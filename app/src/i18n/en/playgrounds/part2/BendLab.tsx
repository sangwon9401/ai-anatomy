import { useState } from "react";
import { SPICE_PTS, V_SPLIT, gelu, num, relu } from "../../../../data/part2-toy";
import { Mark, SX, SY, S_MAX, SpicePlot } from "../../../../playgrounds/part2/SpicePlot";
import "../../../../playgrounds/part2/style.css";

type Mode = "relu" | "gelu" | "off";
const ACT: Record<Mode, (x: number) => number> = { relu, gelu, off: (x) => x };
const MODES: { key: Mode; label: string }[] = [
  { key: "relu", label: "ReLU" },
  { key: "gelu", label: "GELU" },
  { key: "off", label: "Activation off" },
];
const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const START = { p: 2, sL: 0.5, sR: 0.5, q: 2 };

export function BendLab() {
  const [k, setK] = useState(START);
  const [mode, setMode] = useState<Mode>("relu");
  const act = ACT[mode];
  const edge = (m: number) => k.q + k.sL * act(k.p - m) + k.sR * act(m - k.p);
  const says = (m: number, l: number) => l > edge(m);
  const wrong = PTS.filter((p) => says(p.m, p.l) !== p.good);

  const xs = Array.from({ length: 113 }, (_, i) => (i * S_MAX.m) / 112);
  const clampL = (l: number) => Math.max(-0.2, Math.min(S_MAX.l + 0.3, l));
  const curve = xs.map((m, i) => `${i ? "L" : "M"} ${SX(m).toFixed(1)} ${SY(clampL(edge(m))).toFixed(1)}`).join(" ");
  const shade = `${curve} L ${SX(S_MAX.m)} ${SY(S_MAX.l + 0.3)} L ${SX(0)} ${SY(S_MAX.l + 0.3)} Z`;

  const set = (key: keyof typeof START, v: number) => setK((prev) => ({ ...prev, [key]: v }));
  const sliders: { key: keyof typeof START; label: string; min: number; max: number; step: number }[] = [
    { key: "p", label: "Bend at", min: 1, max: 5, step: 0.5 },
    { key: "sL", label: "Left slope", min: 0, max: 2, step: 0.25 },
    { key: "sR", label: "Right slope", min: 0, max: 2, step: 0.25 },
    { key: "q", label: "Height", min: 0, max: 4, step: 0.25 },
  ];

  let tip: string;
  if (mode === "off") tip = `With the activation function off, the boundary is a straight line. However you turn the knobs, at least 2 are wrong. (Now ${wrong.length}.)`;
  else if (wrong.length === 0) tip = `All 13 are right, thanks to the bent line!${mode === "relu" ? " Check whether GELU works too." : " GELU rounds off the bend."}`;
  else tip = `${wrong.length} wrong. Look at the points circled in red and change where it bends and the slopes.`;

  return (
    <div className="plane-lab">
      <SpicePlot
        label={`Boundary: line = ${num(k.q)} + bent line, ${wrong.length} wrong`}
        after={
          <>
            {PTS.map((p, i) => (
              <Mark key={i} x={SX(p.m)} y={SY(p.l)} good={p.good} />
            ))}
            {wrong.map((p, i) => (
              <circle key={`w${i}`} cx={SX(p.m)} cy={SY(p.l)} r={13} fill="none" stroke="var(--pen)" strokeWidth={2} />
            ))}
          </>
        }
      >
        <clipPath id="p2-bend-clip">
          <rect x={SX(0)} y={SY(S_MAX.l)} width={SX(S_MAX.m) - SX(0)} height={SY(0) - SY(S_MAX.l)} />
        </clipPath>
        <g clipPath="url(#p2-bend-clip)">
          <path d={shade} fill="var(--hl-mint)" opacity={0.3} />
          <path d={curve} fill="none" stroke="var(--pen)" strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      </SpicePlot>
      <div className="plane-side">
        <div className="ctx-presets" role="group" aria-label="Pick an activation function">
          {MODES.map((m) => (
            <button
              key={m.key}
              aria-pressed={mode === m.key}
              style={mode === m.key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="lab-rows p2-sliders">
          {sliders.map((s) => (
            <div className="lab-row" key={s.key}>
              <span>{s.label}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={k[s.key]} aria-label={s.label} onChange={(e) => set(s.key, Number(e.target.value))} />
              <span className="val">{num(k[s.key])}</span>
            </div>
          ))}
        </div>
        <p className="lab-sum">
          Points above the boundary (green area) are judged hits. The points are an illustrative example.
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setK(START);
              setMode("relu");
            }}
          >
            Reset
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
