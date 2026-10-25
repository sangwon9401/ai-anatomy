import { useEffect, useRef, useState } from "react";
import { I2, PRESETS, apply, lerpM, type M2 } from "../../../data/ch11";

const NAMES: Record<string, string> = { stretch: "拉伸", rotate: "旋转", shear: "推斜", flip: "翻转" };
const U = 24;
const P = (v: [number, number]) => [v[0] * U, -v[1] * U] as const;
const K = Array.from({ length: 13 }, (_, i) => i - 6);
const ENTRY = ["a", "b", "c", "d"];

export function MatrixWarp() {
  const [m, setM] = useState<M2>(I2);
  const anim = useRef<number | null>(null);

  // glide to a preset so students see the grid move, not just jump
  const glide = (target: M2) => {
    if (anim.current) cancelAnimationFrame(anim.current);
    const from = m;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 600);
      const e = 1 - (1 - k) ** 3;
      setM(lerpM(from, target, e));
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };
  useEffect(() => () => {
    if (anim.current) cancelAnimationFrame(anim.current);
  }, []);

  const v = apply(m, [1, 1]);
  const fmt = (x: number) => (Math.round(x * 10) / 10).toString().replace("-", "−");

  return (
    <div className="plane-lab">
      <svg viewBox="-150 -150 300 300" style={{ width: "100%", maxWidth: 340, display: "block" }} role="img" aria-label={`被矩阵 [[${m.map(fmt).join(", ")}]] 变换后的方格纸`}>
        <defs>
          <clipPath id="warp-clip">
            <rect x={-148} y={-148} width={296} height={296} rx={10} />
          </clipPath>
        </defs>
        <rect x={-148} y={-148} width={296} height={296} rx={10} fill="var(--paper)" stroke="var(--line)" />
        <g clipPath="url(#warp-clip)">
          {K.map((k) => {
            const a = P(apply(m, [k, -7]));
            const b = P(apply(m, [k, 7]));
            const c = P(apply(m, [-7, k]));
            const d = P(apply(m, [7, k]));
            const axis = k === 0;
            return (
              <g key={k} stroke={axis ? "var(--ink)" : "var(--hl-sky)"} strokeWidth={axis ? 2 : 1.2}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
                <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />
              </g>
            );
          })}
          <polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]].map((q) => P(apply(m, q as [number, number])).join(",")).join(" ")} fill="var(--hl-yellow)" opacity={0.55} />
          <line x1={0} y1={0} x2={P(v)[0]} y2={P(v)[1]} stroke="var(--pen)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={P(v)[0]} cy={P(v)[1]} r={4} fill="var(--pen)" />
        </g>
      </svg>
      <div className="plane-side">
        <div className="matrix-edit">
          {m.map((x, i) => (
            <label key={i}>
              <span className="muted">{ENTRY[i]}</span>
              <input
                id={`warp-${i}`}
                type="range"
                min={-2}
                max={2}
                step={0.5}
                value={Math.round(x * 2) / 2}
                aria-label={`矩阵的 ${ENTRY[i]} 格`}
                onChange={(e) => setM((cur) => cur.map((y, j) => (j === i ? Number(e.target.value) : y)) as M2)}
              />
              <b className="num">{fmt(x)}</b>
            </label>
          ))}
        </div>
        <p className="lab-sum num">
          红点 (1, 1) → ({fmt(v[0])}, {fmt(v[1])})
        </p>
        <div className="ctx-presets">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => glide(p.m)}>
              {NAMES[p.key]}
            </button>
          ))}
          <button onClick={() => glide(I2)}>回到开始</button>
        </div>
        <p className="lab-tip">看看黄色正方形是怎么变形的。原点永远待在原地。</p>
      </div>
    </div>
  );
}
