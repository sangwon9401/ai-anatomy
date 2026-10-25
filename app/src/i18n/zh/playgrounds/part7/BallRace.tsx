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
const where = (x: number) => (Math.abs(x - 7) < 0.4 ? "深谷" : Math.abs(x - 2.7) < 0.4 ? "小水坑" : "还在滚");

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
          escape: d.escape || (p === "小水坑" && m === "深谷"),
          both: d.both || (p === "深谷" && m === "深谷"),
          weak: d.weak || (beta > 0 && m === "小水坑" && x0 < 2.2),
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

  let tip = "按“滚动”，让两个球同时出发。";
  if (running) tip = "正在滚……";
  else if (finished) {
    const p = where(plain[STEPS]);
    const m = where(mom[STEPS]);
    if (p === "小水坑" && m === "深谷") tip = "只有粉球靠着冲劲翻过了山坡！这就是惯性的力量。";
    else if (m === "小水坑" && x0 >= 2.2 && x0 < 3.5) tip = "从水坑里出发，没有下坡来攒冲劲，带惯性的球也出不来。";
    else if (m === "小水坑") tip = beta === 0 ? "惯性是 0 的话，粉球和蓝球完全一样。把惯性调大试试。" : "惯性太弱就翻不过山坡。再把惯性调大一点。";
    else if (p === "深谷") tip = "出发点在山坡右边的话，只靠坡度也能到深谷。出发点很重要。";
    else tip = "球还没停下来。惯性太大，会晃很久。";
  }

  const missions = [
    { key: "escape", text: "蓝球停在水坑，粉球滚进深谷" },
    { key: "weak", text: "找到一个惯性太弱、粉球也被困在水坑的大小" },
    { key: "both", text: "让两个球都滚进深谷" },
  ];

  return (
    <div>
      <svg viewBox="0 0 320 196" className="p7-svg" role="img" aria-label="坑坑洼洼的损失地形和两个球">
        <path d={CURVE} fill="none" stroke="var(--ink)" strokeWidth={3} />
        <line x1={PX(x0)} y1={PY(bumpy(x0)) - 22} x2={PX(x0)} y2={PY(bumpy(x0)) - 14} stroke="var(--ink-3)" strokeWidth={2} />
        <text x={PX(2.7)} y={PY(bumpy(2.7)) + 16} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          小水坑
        </text>
        <text x={PX(7)} y={PY(0) + 14} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          深谷
        </text>
        {ball(plain, "var(--hl-sky)", "只看坡度的球")}
        {ball(mom, "var(--hl-pink)", "带惯性的球")}
      </svg>
      <ul className="legend" style={{ marginTop: 6 }}>
        <li>
          <span className="swatch hl-sky" />
          只看坡度：{t === 0 ? "还没出发" : where(plain[Math.floor(t)])}
        </li>
        <li>
          <span className="swatch hl-pink" />
          惯性：{t === 0 ? "还没出发" : where(mom[Math.floor(t)])}
        </li>
      </ul>
      <div className="lab-rows" style={{ marginTop: 12 }}>
        <div className="lab-row">
          <span>出发点</span>
          <input
            type="range"
            min={X_MIN + 0.2}
            max={X_MAX - 0.2}
            step={0.1}
            value={x0}
            disabled={running}
            aria-label="出发点"
            onChange={(e) => {
              setX0(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{x0.toFixed(1)}</span>
        </div>
        <div className="lab-row">
          <span>惯性</span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.05}
            value={beta}
            disabled={running}
            aria-label="惯性大小"
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
          滚动
        </button>
        <button className="btn ghost" onClick={reset}>
          回到原位
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
      <p className="p7-note">地形是示意数据。惯性 = 保留多少上一步的冲劲（0 就和第 21 章的球一样）。</p>
    </div>
  );
}
