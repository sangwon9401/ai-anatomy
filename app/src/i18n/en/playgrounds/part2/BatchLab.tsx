import { useEffect, useRef, useState } from "react";
import { BATCH_LR } from "../../../../data/ch24";
import { BEST, BEST_LOSS, BOOK, bookLoss, contour, epochSteps } from "../../../../data/part2-batch";
import { NEURON, num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const PX = (w: number) => 24 + (w + 0.15) * 210;
const PY = (b: number) => 214 - (b - 1.7) * 76;
const LEVELS = [0.17, 0.25, 0.4, 0.6, 0.85];
const SIZES = [1, 5, 10, 60];
const COLORS: Record<number, string> = { 1: "var(--hl-pink)", 5: "var(--hl-orange)", 10: "var(--hl-mint)", 60: "var(--hl-sky)" };
const START: [number, number] = [NEURON.w[1], NEURON.b];
const d = (pts: [number, number][]) => pts.map(([w, b], i) => `${i ? "L" : "M"} ${PX(w).toFixed(1)} ${PY(b).toFixed(1)}`).join(" ");

type Run = { batch: number; trail: [number, number][]; epochs: number; updates: number };

export function BatchLab() {
  const [batch, setBatch] = useState(10);
  const [run, setRun] = useState<Run>({ batch: 10, trail: [START], epochs: 0, updates: 0 });
  const [old, setOld] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState<number[]>([]);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const [w, b] = run.trail[run.trail.length - 1];
  const loss = bookLoss(w, b);

  const choose = (s: number) => {
    cancelAnimationFrame(raf.current);
    setBusy(false);
    if (run.updates > 0) setOld((o) => [...o.filter((r) => r.batch !== run.batch), run].slice(-3));
    setBatch(s);
    setRun({ batch: s, trail: [START], epochs: 0, updates: 0 });
  };

  const oneEpoch = () => {
    if (busy) return;
    const steps = epochSteps(w, b, batch, BATCH_LR, 101 + run.epochs * 13 + batch);
    setBusy(true);
    let k = 0;
    const perFrame = Math.max(1, Math.ceil(steps.length / 40));
    const tick = () => {
      const n = Math.min(steps.length, k + perFrame);
      const chunk = steps.slice(k, n);
      k = n;
      setRun((r) => ({ ...r, trail: [...r.trail, ...chunk], updates: r.updates + chunk.length, epochs: k >= steps.length ? r.epochs + 1 : r.epochs }));
      if (k < steps.length) raf.current = requestAnimationFrame(tick);
      else {
        setBusy(false);
        setTried((t) => (t.includes(batch) ? t : [...t, batch]));
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const missions = [
    { done: tried.includes(60), text: "1 epoch with all 60 in one bundle: how many fixes?" },
    { done: tried.includes(1), text: "1 epoch, one problem at a time: what does the path look like?" },
    { done: loss < 0.2, text: `Bring the loss below 0.2 (now ${num(loss, 3)})` },
  ];
  let tip: string;
  if (busy) tip = "Solving…";
  else if (run.epochs === 0) tip = `Bundles of ${batch}: 1 epoch fixes the knobs ${Math.ceil(BOOK.length / batch)} ${Math.ceil(BOOK.length / batch) === 1 ? "time" : "times"}. Press \"Solve 1 epoch\".`;
  else if (batch === 60) tip = `Looking at everything before each fix keeps the path straight, but in ${run.epochs} ${run.epochs === 1 ? "epoch" : "epochs"} it fixed only ${run.updates} ${run.updates === 1 ? "time" : "times"}.`;
  else if (batch === 1) tip = `One problem at a time: ${run.updates} fixes, but the path zigzags. It leans toward one problem, then toward another.`;
  else tip = `Bundles of ${batch}: ${run.updates} fixes, and the path is fairly straight. Compare with other sizes.`;

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 236" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`Line weight ${num(w, 2)}, bias ${num(b, 2)}, loss ${num(loss, 3)}`}>
        <clipPath id="p2-batch-clip">
          <rect x={PX(-0.15)} y={PY(4.3)} width={PX(1.15) - PX(-0.15)} height={PY(1.7) - PY(4.3)} />
        </clipPath>
        <g clipPath="url(#p2-batch-clip)">
          {LEVELS.map((lv, i) => (
            <path key={lv} d={d(contour(lv, 48))} fill={i === 0 ? "var(--hl-mint)" : "none"} fillOpacity={0.35} stroke="var(--ink-3)" strokeWidth={1} />
          ))}
          {old.map((r) => (
            <path key={r.batch} d={d(r.trail)} fill="none" stroke={COLORS[r.batch]} strokeWidth={1.5} opacity={0.5} />
          ))}
          <path d={d(run.trail)} fill="none" stroke={COLORS[run.batch]} strokeWidth={2.4} strokeLinejoin="round" />
          <circle cx={PX(w)} cy={PY(b)} r={4.5} fill={COLORS[run.batch]} stroke="var(--ink)" strokeWidth={1.2} />
        </g>
        <circle cx={PX(START[0])} cy={PY(START[1])} r={4} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1.2} />
        <text x={PX(BEST[0]) + 6} y={PY(BEST[1]) - 6} fontSize={10} fill="var(--pen)" fontFamily="var(--font-hand)">
          bottom {num(BEST_LOSS, 2)}
        </text>
        <circle cx={PX(BEST[0])} cy={PY(BEST[1])} r={2.5} fill="var(--pen)" />
        <line x1={PX(-0.15)} y1={PY(1.7)} x2={PX(1.15)} y2={PY(1.7)} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={PX(-0.15)} y1={PY(1.7)} x2={PX(-0.15)} y2={PY(4.3)} stroke="var(--ink)" strokeWidth={1.5} />
        {[0, 0.5, 1].map((t) => (
          <text key={t} x={PX(t)} y={PY(1.7) + 12} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
            {t}
          </text>
        ))}
        {[2, 3, 4].map((t) => (
          <text key={t} x={PX(-0.15) - 4} y={PY(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--ink-3)">
            {t}
          </text>
        ))}
        <text x={PX(1.15)} y={PY(1.7) + 23} textAnchor="end" fontSize={11} fill="var(--ink-2)">
          line weight →
        </text>
        <text x={PX(-0.15) + 4} y={PY(4.3) + 10} fontSize={11} fill="var(--ink-2)">
          ↑ bias
        </text>
      </svg>
      <div className="plane-side">
        <div className="ctx-presets" role="group" aria-label="Bundle size">
          {SIZES.map((s) => (
            <button key={s} aria-pressed={batch === s} onClick={() => choose(s)} style={batch === s ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)", background: COLORS[s] } : undefined}>
              {s === 60 ? "All 60" : `${s} at a time`}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button className="btn" disabled={busy} onClick={oneEpoch}>
            Solve 1 epoch
          </button>
          <button className="btn ghost" disabled={busy} onClick={() => choose(batch)}>
            Reset
          </button>
        </div>
        <p className="p2-calc">
          epochs <b>{run.epochs}</b> · fixes <b>{run.updates}</b> · loss <b>{num(loss, 3)}</b>
          <br />
          line weight {num(w, 3)}, bias {num(b, 3)} (learning rate {BATCH_LR})
        </p>
        <ul className="missions">
          {missions.map((m) => (
            <li key={m.text} data-done={m.done}>
              {m.done ? "○" : "□"} {m.text}
            </li>
          ))}
        </ul>
        <p className="p2-note">Faded lines are the paths of bundle sizes you tried before. The 60 trucks are an illustrative example.</p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
