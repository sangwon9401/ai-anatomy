import { useState } from "react";
import { surprise } from "../../data/ch65";
import "./style.css";

const MAX = 7;
const PRESETS = [
  { label: "100%", p: 100 },
  { label: "1/2", p: 50 },
  { label: "1/4", p: 25 },
  { label: "1/8", p: 12.5 },
  { label: "간다 52%", p: 52 },
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
    { key: "three", text: "놀람을 정확히 3으로 만들기" },
    { key: "small", text: "놀람을 0.5보다 작게 만들기" },
    { key: "five", text: "놀람 5 넘기기" },
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

  let tip = "확률을 반으로 줄여 보세요. 놀람이 딱 1씩 커져요.";
  if (pct >= 100) tip = "확실하다고 한 게 맞았으니 전혀 놀라지 않아요. 놀람 0.";
  else if (s > 5) tip = "정답에 거의 안 걸었네요. 확률이 0에 가까울수록 놀람은 끝없이 커져요.";
  else if (n !== null) tip = `1을 반으로 ${n}번 나누면 이 확률이 돼요. 그래서 놀람 ${n}.`;
  else if (pct === 52) tip = "1장의 간다 52%예요. 반보다 조금 높으니 놀람은 1보다 조금 작아요.";

  return (
    <div className="plane-lab">
      <div>
        <Gauge v={s} label={`놀람 ${s.toFixed(2)}`} />
        <p className="p7-big" style={{ textAlign: "center", margin: 0 }}>
          놀람 <b>{s.toFixed(2)}</b>
        </p>
      </div>
      <div className="plane-side">
        <div className="lab-row">
          <span>확률</span>
          <input type="range" min={1} max={100} step={0.5} value={pct} aria-label="정답에 준 확률" onChange={(e) => update(Number(e.target.value))} />
          <span className="val">{fmt(pct, 1)}%</span>
        </div>
        <div className="p7-seg" role="group" aria-label="확률 바로 고르기">
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
              2를 <b>{n}</b>번 곱하면 {fmt(inv)} → 놀람 {n}
            </>
          ) : (
            <>놀람 = log₂({fmt(inv)}) ≈ {s.toFixed(2)}</>
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
        <p className="p7-note">여기서는 2를 기준으로 셌어요. 실제 학습에선 e(14장)를 기준으로 써요.</p>
      </div>
    </div>
  );
}
