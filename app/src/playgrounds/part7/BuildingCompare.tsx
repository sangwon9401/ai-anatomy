import { useState } from "react";
import { GUESSES, MODELS, TOWER, floors, timesText } from "../../data/ch69";
import "./style.css";

type Item = { key: string; name: string; floors: number; color: string; sub: string };

const ITEMS: Item[] = [
  ...MODELS.map((m) => ({ key: m.key, name: m.name, floors: floors(m.params), color: `var(--hl-${m.c})`, sub: `${m.year} · ${m.paramsText}` })),
  { key: TOWER.key, name: TOWER.name, floors: TOWER.floors, color: "var(--hl-violet)", sub: "실제 건물" },
];
const fmtFloors = (f: number) => (f < 10 ? f.toFixed(2).replace(/0$/, "") : Math.round(f).toLocaleString("ko-KR"));

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
  let tip = "GPT-3는 몇 층일까요? 하나를 골라 보세요.";
  if (revealed)
    tip =
      guess === 1750
        ? "정답! 1,750억 ÷ 1억 = 1,750층. GPT-3를 켜고 다른 건물이 얼마나 작아지는지 보세요."
        : `아쉬워요. 1,750억 ÷ 1억 = 1,750층이에요. 이제 GPT-3를 켜고 비교해 보세요.`;
  if (revealed && on.gpt3 && on.gpt1) tip = "GPT-3를 켜면 GPT-1은 거의 안 보여요. 약 1,500배 차이거든요.";

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="GPT-3 층수 맞히기">
        {GUESSES.map((g) => (
          <button key={g} aria-pressed={guess === g} onClick={() => setGuess(g)}>
            {g.toLocaleString("ko-KR")}층?
          </button>
        ))}
      </div>
      <div className="p7-seg" role="group" aria-label="건물 켜고 끄기" style={{ marginTop: 10 }}>
        {ITEMS.map((it) => (
          <button key={it.key} aria-pressed={!!on[it.key] && (it.key !== "gpt3" || revealed)} disabled={it.key === "gpt3" && !revealed} onClick={() => toggle(it.key)}>
            {it.name}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} 228`} className="p7-svg" role="img" aria-label={shown.map((s) => `${s.name} ${fmtFloors(s.floors)}층`).join(", ")}>
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
                {fmtFloors(s.floors)}층
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
            {s.name}: {s.sub} → {fmtFloors(s.floors)}층
          </li>
        ))}
      </ul>
      {shown.length >= 2 && (
        <p className="lab-sum num">
          가장 높은 건물은 가장 낮은 건물의 <b>{timesText(max / min)}</b>
        </p>
      )}
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">파라미터 1억 개 = 1층으로 정했어요. 파라미터 수는 실제 값, 롯데월드타워는 지상 123층이에요.</p>
    </div>
  );
}
