import { useEffect, useRef, useState } from "react";
import { X_MAX, X_MIN, bumpy, roll } from "../../../../data/ch67";
import "../../../../playgrounds/part7/style.css";

const STEPS = 300;
// plot box 320 × 190
const PX = (x: number) => 14 + (x / X_MAX) * 292;
const PY = (f: number) => 176 - f * 26;
const CURVE = Array.from({ length: 121 }, (_, i) => (i / 120) * X_MAX)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${PX(x).toFixed(1)} ${PY(bumpy(x)).toFixed(1)}`)
  .join(" ");
const where = (x: number) => (Math.abs(x - 7) < 0.4 ? "deep valley" : Math.abs(x - 2.7) < 0.4 ? "small dip" : "rolling");

export function BallRace() {
  const [x0, setX0] = useState(0.4);
  const [beta, setBeta] = useState(0.85);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const raf = useRef(0);
  const plain = roll(x0, 0, STEPS);
  const mom = roll(x0, beta, STEPS);
  const finished = t >= STEPS;

  useEffect(() => {
    if (!running) return;
    let v = 0;
    const tick = () => {
      v = Math.min(STEPS, v + 3);
      setT(v);
      if (v >= STEPS) {
        setRunning(false);
        const p = where(plain[STEPS]);
        const m = where(mom[STEPS]);
        setDone((d) => ({
          ...d,
          escape: d.escape || (p === "small dip" && m === "deep valley"),
          both: d.both || (p === "deep valley" && m === "deep valley"),
          weak: d.weak || (beta > 0 && m === "small dip" && x0 < 2.2),
        }));
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // plain/mom are derived from x0 and beta, which cannot change while running
  }, [running, x0, beta]);

  const reset = () => {
    setRunning(false);
    setT(0);
  };
  const ball = (xs: number[], color: string, label: string) => {
    const x = xs[Math.min(STEPS, Math.floor(t))];
    return <circle cx={PX(x)} cy={PY(bumpy(x)) - 7} r={7} fill={color} stroke="var(--ink)" strokeWidth={2} aria-label={label} />;
  };

  let tip = "Press Roll to start both balls at the same time.";
  if (running) tip = "Rolling…";
  else if (finished) {
    const p = where(plain[STEPS]);
    const m = where(mom[STEPS]);
    if (p === "small dip" && m === "deep valley") tip = "Only the pink ball rolled over the hill on its speed! That's the power of momentum.";
    else if (m === "small dip" && x0 >= 2.2 && x0 < 3.5) tip = "Starting inside the dip, there's no downhill to build up speed, so even the momentum ball can't get out.";
    else if (m === "small dip") tip = beta === 0 ? "With momentum 0, the pink ball is just like the blue one. Turn up the momentum." : "With weak momentum it can't get over the hill. Turn it up a little more.";
    else if (p === "deep valley") tip = "If it starts right of the hill, the slope alone reaches the valley. The starting point matters.";
    else tip = "The ball hasn't settled yet. Too much momentum makes it swing for a long time.";
  }

  const missions = [
    { key: "escape", text: "Blue ball in the dip, pink ball in the deep valley" },
    { key: "weak", text: "Find a momentum too weak to free the pink ball" },
    { key: "both", text: "Get both balls into the deep valley" },
  ];

  return (
    <div>
      <svg viewBox="0 0 320 196" className="p7-svg" role="img" aria-label="A bumpy loss landscape with two balls">
        <path d={CURVE} fill="none" stroke="var(--ink)" strokeWidth={3} />
        <line x1={PX(x0)} y1={PY(bumpy(x0)) - 22} x2={PX(x0)} y2={PY(bumpy(x0)) - 14} stroke="var(--ink-3)" strokeWidth={2} />
        <text x={PX(2.7)} y={PY(bumpy(2.7)) + 16} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          small dip
        </text>
        <text x={PX(7)} y={PY(0) + 14} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          deep valley
        </text>
        {ball(plain, "var(--hl-sky)", "slope-only ball")}
        {ball(mom, "var(--hl-pink)", "momentum ball")}
      </svg>
      <ul className="legend" style={{ marginTop: 6 }}>
        <li>
          <span className="swatch hl-sky" />
          Slope only: {t === 0 ? "not started" : where(plain[Math.floor(t)])}
        </li>
        <li>
          <span className="swatch hl-pink" />
          Momentum: {t === 0 ? "not started" : where(mom[Math.floor(t)])}
        </li>
      </ul>
      <div className="lab-rows" style={{ marginTop: 12 }}>
        <div className="lab-row">
          <span>Start</span>
          <input
            type="range"
            min={X_MIN + 0.2}
            max={X_MAX - 0.2}
            step={0.1}
            value={x0}
            disabled={running}
            aria-label="Starting point"
            onChange={(e) => {
              setX0(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{x0.toFixed(1)}</span>
        </div>
        <div className="lab-row">
          <span>Momentum</span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.05}
            value={beta}
            disabled={running}
            aria-label="Momentum strength"
            onChange={(e) => {
              setBeta(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{beta.toFixed(2)}</span>
        </div>
      </div>
      <div className="lab-actions">
        <button
          className="btn"
          disabled={running}
          onClick={() => {
            setT(0);
            setRunning(true);
          }}
        >
          Roll
        </button>
        <button className="btn ghost" onClick={reset}>
          Reset
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        {missions.map((m) => (
          <li key={m.key} data-done={!!done[m.key]}>
            {done[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">An illustrative landscape. Momentum = how much of the last step's speed is kept (0 is the ball from ch. 21).</p>
    </div>
  );
}
