import { useState } from "react";
import { SPICE_PTS, V_SPLIT, num } from "../../../../data/part2-toy";
import { Mark, SX, SY, S_MAX, SpicePlot } from "../../../../playgrounds/part2/SpicePlot";
import "../../../../playgrounds/part2/style.css";

const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const START = { p: 2, t: 0, a: 1, b: 1 };

export function FoldLab() {
  const [k, setK] = useState(START);
  const set = (key: keyof typeof START, v: number) => setK((prev) => ({ ...prev, [key]: v }));
  const cos = Math.cos(Math.PI * k.t);
  // left of the fold the paper turns over; the right half stays put
  const fm = (m: number) => (m < k.p ? k.p + (m - k.p) * cos : m);
  const edge = (m: number) => k.a * Math.abs(m - k.p) + k.b;
  const wrong = PTS.filter((pt) => pt.l > edge(pt.m) !== pt.good);

  const top = S_MAX.l + 0.3;
  const clampL = (l: number) => Math.min(top, l);
  const rightArm = `M ${SX(k.p)} ${SY(edge(k.p))} L ${SX(S_MAX.m)} ${SY(clampL(edge(S_MAX.m)))}`;
  const leftEnd = fm(0);
  const leftArm = `M ${SX(k.p)} ${SY(edge(k.p))} L ${SX(leftEnd)} ${SY(clampL(edge(0)))}`;
  const paperX = Math.min(SX(leftEnd), SX(k.p));
  const paperW = Math.abs(SX(k.p) - SX(leftEnd));

  const missions = [
    { done: k.p === 3, text: "Fold along the level 3 line" },
    { done: k.t === 1, text: "Fold all the way" },
    { done: wrong.length === 0, text: "Get all 13 right with one straight line" },
  ];
  let tip: string;
  if (missions.every((m) => m.done)) tip = "Success! The first layer folded the paper, and one next-layer neuron split it with a straight line. That's the power of stacking layers.";
  else if (k.t < 1) tip = "Push the fold slider all the way. The points on the left flip over the fold line onto the right.";
  else if (k.p !== 3) tip = "Do points of the same kind land on each other? Try moving the fold.";
  else tip = `${wrong.length} wrong. On the folded paper, change the line's slope and height.`;

  const sliders: { key: keyof typeof START; label: string; min: number; max: number; step: number }[] = [
    { key: "p", label: "Fold at", min: 1, max: 5, step: 0.5 },
    { key: "t", label: "Fold", min: 0, max: 1, step: 0.05 },
    { key: "a", label: "Line slope", min: 0, max: 2, step: 0.25 },
    { key: "b", label: "Line height", min: 0, max: 4, step: 0.25 },
  ];

  return (
    <div className="plane-lab">
      <SpicePlot
        label={`Plane folded at spiciness level ${num(k.p)}, ${wrong.length} wrong`}
        after={
          <>
            {PTS.map((pt, i) => (
              <Mark key={i} x={SX(fm(pt.m))} y={SY(pt.l)} good={pt.good} />
            ))}
            {wrong.map((pt, i) => (
              <circle key={`w${i}`} cx={SX(fm(pt.m))} cy={SY(pt.l)} r={13} fill="none" stroke="var(--pen)" strokeWidth={2} />
            ))}
          </>
        }
      >
        <clipPath id="p2-fold-clip">
          <rect x={SX(0)} y={SY(S_MAX.l)} width={SX(S_MAX.m) - SX(0)} height={SY(0) - SY(S_MAX.l)} />
        </clipPath>
        <g clipPath="url(#p2-fold-clip)">
          <rect x={paperX} y={SY(S_MAX.l)} width={paperW} height={SY(0) - SY(S_MAX.l)} fill={cos >= 0 ? "var(--paper-2)" : "var(--hl-sky)"} opacity={cos >= 0 ? 0.8 : 0.3} />
          <path d={rightArm} stroke="var(--pen)" strokeWidth={2.5} fill="none" />
          <path d={leftArm} stroke="var(--pen)" strokeWidth={2.5} fill="none" strokeDasharray={k.t > 0 && k.t < 1 ? "5 4" : undefined} />
        </g>
        <line x1={SX(k.p)} y1={SY(S_MAX.l)} x2={SX(k.p)} y2={SY(0)} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="4 4" />
      </SpicePlot>
      <div className="plane-side">
        <div className="lab-rows p2-sliders">
          {sliders.map((s) => (
            <div className="lab-row" key={s.key}>
              <span>{s.label}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={k[s.key]} aria-label={s.label} onChange={(e) => set(s.key, Number(e.target.value))} />
              <span className="val">{s.key === "t" ? `${Math.round(k.t * 100)}%` : num(k[s.key])}</span>
            </div>
          ))}
        </div>
        <ul className="missions">
          {missions.map((m) => (
            <li key={m.text} data-done={m.done}>
              {m.done ? "○" : "□"} {m.text}
            </li>
          ))}
        </ul>
        <p className="lab-sum">The red line is the next-layer neuron's boundary. Unfolded it's a V; folded, it's a straight line. The points are an illustrative example.</p>
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setK(START)}>
            Reset
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
