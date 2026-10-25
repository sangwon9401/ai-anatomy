import { useState } from "react";
import { surprise } from "../../../../data/ch65";
import "../../../../playgrounds/part7/style.css";

const MAX = 7;
const PRESETS = [
  { label: "100%", p: 100 },
  { label: "1/2", p: 50 },
  { label: "1/4", p: 25 },
  { label: "1/8", p: 12.5 },
  { label: "行く 52%", p: 52 },
  { label: "12%", p: 12 },
];

/** Semicircle gauge in a 300 × 190 box. */
export function Gauge({ v, max = MAX, label }: { v: number; max?: number; label: string }) {
  const cx = 150;
  const cy = 160;
  const r = 118;
  const ang = (t: number) => Math.PI * (1 - Math.min(Math.max(t, 0), max) / max);
  const pt = (t: number, rr: number) => [cx + Math.cos(ang(t)) * rr, cy - Math.sin(ang(t)) * rr];
  const arc = (a: number, b: number) => {
    const [x0, y0] = pt(a, r);
    const [x1, y1] = pt(b, r);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const [nx, ny] = pt(v, r * 0.82);
  return (
    <svg viewBox="0 0 300 190" className="p7-gauge" role="img" aria-label={label}>
      <path d={arc(0, max / 3)} fill="none" stroke="var(--hl-mint)" strokeWidth={20} />
      <path d={arc(max / 3, (2 * max) / 3)} fill="none" stroke="var(--hl-yellow)" strokeWidth={20} />
      <path d={arc((2 * max) / 3, max)} fill="none" stroke="var(--hl-pink)" strokeWidth={20} />
      {Array.from({ length: max + 1 }, (_, t) => {
        const [a, b] = pt(t, r - 14);
        const [c, d] = pt(t, r + 14);
        const [lx, ly] = pt(t, r + 28);
        return (
          <g key={t}>
            <line x1={a} y1={b} x2={c} y2={d} stroke="var(--ink)" strokeWidth={2} />
            <text x={lx} y={ly + 4} fontSize={12} textAnchor="middle" fill="var(--ink-2)">
              {t}
            </text>
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--pen)" strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={8} fill="var(--ink)" />
    </svg>
  );
}

/** "2를 n번 곱하면 x" when x is a whole power of two. */
function powerOfTwo(x: number) {
  const n = Math.round(Math.log2(x));
  return Math.abs(2 ** n - x) < 1e-9 ? n : null;
}

const fmt = (x: number, d = 2) => String(Number(x.toFixed(d)));

export function SurpriseMeter() {
  const [pct, setPct] = useState(52);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const p = pct / 100;
  const s = surprise(p);
  const inv = 1 / p;
  const n = powerOfTwo(inv);

  const missions = [
    { key: "three", text: "驚きをちょうど3にする" },
    { key: "small", text: "驚きを0.5より小さくする" },
    { key: "five", text: "驚きを5より大きくする" },
  ];
  const update = (v: number) => {
    setPct(v);
    const sv = surprise(v / 100);
    setDone((d) => ({
      ...d,
      three: d.three || Math.abs(sv - 3) < 1e-9,
      small: d.small || sv < 0.5,
      five: d.five || sv > 5,
    }));
  };

  let tip = "確率を半分にしてみましょう。驚きがちょうど1ずつ大きくなります。";
  if (pct >= 100) tip = "確実だと言ったことが当たったので、まったく驚きません。驚き0。";
  else if (s > 5) tip = "正解にほとんどかけていませんね。確率が0に近づくほど、驚きはどこまでも大きくなります。";
  else if (n !== null) tip = `1を半分に${n}回するとこの確率になります。だから驚き${n}。`;
  else if (pct === 52) tip = "第1章の行く52%です。半分より少し高いので、驚きは1より少し小さくなります。";

  return (
    <div className="plane-lab">
      <div>
        <Gauge v={s} label={`驚き ${s.toFixed(2)}`} />
        <p className="p7-big" style={{ textAlign: "center", margin: 0 }}>
          驚き <b>{s.toFixed(2)}</b>
        </p>
      </div>
      <div className="plane-side">
        <div className="lab-row">
          <span>確率</span>
          <input type="range" min={1} max={100} step={0.5} value={pct} aria-label="正解につけた確率" onChange={(e) => update(Number(e.target.value))} />
          <span className="val">{fmt(pct, 1)}%</span>
        </div>
        <div className="p7-seg" role="group" aria-label="確率をすぐ選ぶ">
          {PRESETS.map((b) => (
            <button key={b.label} aria-pressed={pct === b.p} onClick={() => update(b.p)}>
              {b.label}
            </button>
          ))}
        </div>
        <div className="dot-formula num">
          1 ÷ {fmt(p, 3)} = <b>{fmt(inv)}</b>
          <br />
          {n !== null ? (
            <>
              2を<b>{n}</b>回かけると{fmt(inv)} → 驚き{n}
            </>
          ) : (
            <>驚き = log₂({fmt(inv)}) ≈ {s.toFixed(2)}</>
          )}
        </div>
        <ul className="missions">
          {missions.map((m) => (
            <li key={m.key} data-done={!!done[m.key]}>
              {done[m.key] ? "○" : "□"} {m.text}
            </li>
          ))}
        </ul>
        <p className="lab-tip">{tip}</p>
        <p className="p7-note">ここでは2を基準に数えました。本物の学習ではe（第14章）を基準にします。</p>
      </div>
    </div>
  );
}
