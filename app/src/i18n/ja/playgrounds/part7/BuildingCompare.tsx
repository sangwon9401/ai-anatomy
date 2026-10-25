import { useState } from "react";
import { GUESSES, MODELS, TOWER, floors, timesText } from "../../../../data/ch69";
import "../../../../playgrounds/part7/style.css";

type Item = { key: string; name: string; floors: number; color: string; sub: string };

const ITEMS: Item[] = [
  ...MODELS.map((m) => ({ key: m.key, name: m.name, floors: floors(m.params), color: `var(--hl-${m.c})`, sub: `${m.year} · ${m.paramsText}` })),
  { key: TOWER.key, name: TOWER.name, floors: TOWER.floors, color: "var(--hl-violet)", sub: "実在の建物" },
];
const fmtFloors = (f: number) => (f < 10 ? f.toFixed(2).replace(/0$/, "") : Math.round(f).toLocaleString("ja-JP"));

export function BuildingCompare() {
  const [guess, setGuess] = useState<number | null>(null);
  const [on, setOn] = useState<Record<string, boolean>>({ gpt1: true, gpt2: true, gpt3: false, tower: false });
  const revealed = guess !== null;
  const shown = ITEMS.filter((it) => on[it.key] && (it.key !== "gpt3" || revealed));
  const max = Math.max(1, ...shown.map((s) => s.floors));
  const min = Math.min(...shown.map((s) => s.floors));
  const W = 320;
  const GROUND = 200;
  const TOP = 24;
  const slot = W / Math.max(1, shown.length);

  const toggle = (k: string) => setOn((o) => ({ ...o, [k]: !o[k] }));
  let tip = "GPT-3は何階建てでしょう？ 1つ選んでみましょう。";
  if (revealed)
    tip =
      guess === 1750
        ? "正解！ 1,750億 ÷ 1億 = 1,750階。GPT-3をオンにして、ほかの建物がどれだけ小さくなるか見てみましょう。"
        : `おしい！ 1,750億 ÷ 1億 = 1,750階です。GPT-3をオンにして比べてみましょう。`;
  if (revealed && on.gpt3 && on.gpt1) tip = "GPT-3をオンにすると、GPT-1はほとんど見えません。約1,500倍の差があるからです。";

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="GPT-3の階数を当てる">
        {GUESSES.map((g) => (
          <button key={g} aria-pressed={guess === g} onClick={() => setGuess(g)}>
            {g.toLocaleString("ja-JP")}階？
          </button>
        ))}
      </div>
      <div className="p7-seg" role="group" aria-label="建物のオン・オフ" style={{ marginTop: 10 }}>
        {ITEMS.map((it) => (
          <button key={it.key} aria-pressed={!!on[it.key] && (it.key !== "gpt3" || revealed)} disabled={it.key === "gpt3" && !revealed} onClick={() => toggle(it.key)}>
            {it.name}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} 228`} className="p7-svg" role="img" aria-label={shown.map((s) => `${s.name} ${fmtFloors(s.floors)}階`).join(", ")}>
        <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="var(--ink)" strokeWidth={2} />
        {shown.map((s, i) => {
          const h = ((GROUND - TOP) * s.floors) / max;
          const cx = slot * i + slot / 2;
          const w = Math.min(54, slot * 0.6);
          const tiny = h < 2;
          return (
            <g key={s.key}>
              <rect x={cx - w / 2} y={GROUND - Math.max(h, 0.6)} width={w} height={Math.max(h, 0.6)} fill={s.color} stroke="var(--ink)" strokeWidth={h > 4 ? 1.5 : 0.6} />
              {tiny && <path d={`M ${cx} ${GROUND - 26} L ${cx} ${GROUND - 6} M ${cx - 4} ${GROUND - 11} L ${cx} ${GROUND - 5} L ${cx + 4} ${GROUND - 11}`} stroke="var(--pen)" strokeWidth={1.5} fill="none" />}
              <text x={cx} y={Math.min(GROUND - Math.max(h, 0) - (tiny ? 30 : 6), GROUND - 30)} fontSize={12} textAnchor="middle" fill="var(--ink)" fontWeight={700}>
                {fmtFloors(s.floors)}階
              </text>
              <text x={cx} y={GROUND + 17} fontSize={11.5} textAnchor="middle" fill="var(--ink)">
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="legend">
        {shown.map((s) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: s.color }} />
            {s.name}：{s.sub} → {fmtFloors(s.floors)}階
          </li>
        ))}
      </ul>
      {shown.length >= 2 && (
        <p className="lab-sum num">
          いちばん高い建物は、いちばん低い建物の<b>{timesText(max / min)}</b>
        </p>
      )}
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">パラメータ1億個 = 1階と決めました。パラメータの数は本物の値で、あべのハルカスは地上60階です。</p>
    </div>
  );
}
