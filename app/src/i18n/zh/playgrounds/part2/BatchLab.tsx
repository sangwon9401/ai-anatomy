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
    { done: tried.includes(60), text: "一包装全部（60 道题）做 1 轮：改了几次？" },
    { done: tried.includes(1), text: "一题一改做 1 轮：路线是什么样？" },
    { done: loss < 0.2, text: `把损失降到 0.2 以下（现在 ${num(loss, 3)}）` },
  ];
  let tip: string;
  if (busy) tip = "正在做题…";
  else if (run.epochs === 0) tip = `一包 ${batch} 道题：做 1 轮要调 ${Math.ceil(BOOK.length / batch)} 次旋钮。点“做 1 轮”试试。`;
  else if (batch === 60) tip = `全部看完再改，路线很直，可是 ${run.epochs} 轮里只改了 ${run.updates} 次。`;
  else if (batch === 1) tip = `一题一改，改了 ${run.updates} 次，路线却歪歪扭扭。因为一会儿偏向这道题，一会儿又偏向那道题。`;
  else tip = `${batch} 道题一包，改了 ${run.updates} 次，路线也挺直。和别的大小比一比。`;

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 236" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`排队权重 ${num(w, 2)}，偏置 ${num(b, 2)}，损失 ${num(loss, 3)}`}>
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
          谷底 {num(BEST_LOSS, 2)}
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
          排队权重 →
        </text>
        <text x={PX(-0.15) + 4} y={PY(4.3) + 10} fontSize={11} fill="var(--ink-2)">
          ↑ 偏置
        </text>
      </svg>
      <div className="plane-side">
        <div className="ctx-presets" role="group" aria-label="一包的大小">
          {SIZES.map((s) => (
            <button key={s} aria-pressed={batch === s} onClick={() => choose(s)} style={batch === s ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)", background: COLORS[s] } : undefined}>
              {s === 60 ? "全部 60 道" : `${s} 道一包`}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button className="btn" disabled={busy} onClick={oneEpoch}>
            做 1 轮
          </button>
          <button className="btn ghost" disabled={busy} onClick={() => choose(batch)}>
            回到开始
          </button>
        </div>
        <p className="p2-calc">
          轮数 <b>{run.epochs}</b> · 调整次数 <b>{run.updates}</b> · 损失 <b>{num(loss, 3)}</b>
          <br />
          排队权重 {num(w, 3)}，偏置 {num(b, 3)}（学习率 {BATCH_LR}）
        </p>
        <ul className="missions">
          {missions.map((m) => (
            <li key={m.text} data-done={m.done}>
              {m.done ? "○" : "□"} {m.text}
            </li>
          ))}
        </ul>
        <p className="p2-note">浅色的线是之前试过的其他大小的路线。60 家店是示意数据。</p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
