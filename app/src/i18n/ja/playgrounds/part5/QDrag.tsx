// ja overlay of src/playgrounds/part5/QDrag.tsx (strings only)
import { useRef, useState, type PointerEvent } from "react";
import { FOCUS, K, Q, WORDS, dot, fmt, fmtVec, type V2 } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

const SIZE = 300;
const O: [number, number] = [150, 158];
const U = 38;
const MAXV = 3;
const px = (v: readonly number[]): [number, number] => [O[0] + v[0] * U, O[1] - v[1] * U];
const snap = (v: number) => Math.max(-MAXV, Math.min(MAXV, Math.round(v * 2) / 2));
const K_COLORS = ["var(--hl-pink)", "var(--hl-violet)", "var(--hl-orange)", "var(--hl-mint)"];

function Arrow({ v, color, width }: { v: readonly number[]; color: string; width: number }) {
  const [x, y] = px(v);
  const a = Math.atan2(y - O[1], x - O[0]);
  const h = width * 2.6;
  if (Math.hypot(x - O[0], y - O[1]) < 3) return null;
  return (
    <g>
      <line x1={O[0]} y1={O[1]} x2={x - Math.cos(a) * h * 0.6} y2={y - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${x - h * Math.cos(a - 0.45)} ${y - h * Math.sin(a - 0.45)} L ${x - h * Math.cos(a + 0.45)} ${y - h * Math.sin(a + 0.45)} Z`} fill={color} />
    </g>
  );
}

const term = (a: number, b: number) => `${fmt(a, 1)}×${b < 0 ? `(${fmt(b)})` : fmt(b)}`;

/** ch47: drag 行く's Query arrow; the four Q·K scores update live. */
export function QDrag() {
  const [q, setQ] = useState<V2>(Q[FOCUS]);
  const [done, setDone] = useState({ a: false, b: false, neg: false });
  const drag = useRef(false);

  const scores = K.map((k) => dot(q, k));
  const best = Math.max(...scores);
  const tops = scores.map((s, i) => (s === best ? i : -1)).filter((i) => i >= 0);
  const leader = tops.length === 1 ? tops[0] : -1;
  const allNeg = scores.every((s) => s < 0);
  if ((leader === 0 && !done.a) || (leader === 1 && !done.b) || (allNeg && !done.neg))
    setDone((d) => ({ a: d.a || leader === 0, b: d.b || leader === 1, neg: d.neg || allNeg }));
  const span = Math.max(4, ...scores.map(Math.abs));

  const move = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * SIZE;
    const sy = ((e.clientY - r.top) / r.height) * SIZE;
    const next: V2 = [snap((sx - O[0]) / U), snap((O[1] - sy) / U)];
    if (next[0] !== q[0] || next[1] !== q[1]) setQ(next);
  };

  let tip = "いまは「学校に」が1位です。矢印を回して、「私は」を1位にしてみましょう。";
  if (done.a && !done.b) tip = "今度は「今日」を1位に！「今日」のKは右下を指しています。";
  if (done.a && done.b && !done.neg) tip = "すべてのスコアをマイナスにすることもできます。すべてのKと反対の向きを指してみましょう。";
  if (done.a && done.b && done.neg) tip = "「行く」はひとりで1位にはなれません。「行く」のK(1, 0)は「学校に」と「今日」の間にはさまっているので、いつもどちらかが大きいか同じになるのです。";
  if (leader < 0 && !allNeg) tip = "同点の1位です。もう少しだけ回してみましょう。";

  return (
    <div className="plane-lab">
      <svg
        className="p5-plane"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Qの矢印 ${fmtVec(q, 1)}。スコア ${scores.map((s, i) => `${WORDS[i]} ${fmt(s, 1)}`).join("、")}`}
        onPointerDown={(e) => {
          drag.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e);
        }}
        onPointerMove={(e) => drag.current && move(e)}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        {Array.from({ length: 9 }, (_, i) => i - 4).map((t) => (
          <g key={t}>
            <line x1={O[0] + t * U} y1={0} x2={O[0] + t * U} y2={SIZE} stroke="var(--grid-minor)" />
            <line x1={0} y1={O[1] - t * U} x2={SIZE} y2={O[1] - t * U} stroke="var(--grid-minor)" />
          </g>
        ))}
        <line x1={0} y1={O[1]} x2={SIZE} y2={O[1]} stroke="var(--ink-3)" strokeWidth={1.5} />
        <line x1={O[0]} y1={0} x2={O[0]} y2={SIZE} stroke="var(--ink-3)" strokeWidth={1.5} />
        {K.map((k, i) => (
          <g key={i}>
            <Arrow v={k} color={K_COLORS[i]} width={5} />
            <text x={px(k)[0] + (k[0] === 0 ? -6 : 6)} y={px(k)[1] + (k[1] < 0 ? 16 : -6)} textAnchor={k[0] === 0 ? "end" : "start"} fontSize={12} fontWeight={700} fill="var(--ink)">
              {WORDS[i]}
            </text>
          </g>
        ))}
        <Arrow v={q} color="var(--ink)" width={7} />
        <Arrow v={q} color="var(--hl-yellow)" width={4} />
        <circle className="handle" cx={px(q)[0]} cy={px(q)[1]} r={14} fill="var(--hl-yellow)" fillOpacity={0.35} stroke="var(--ink)" strokeWidth={1.5} />
      </svg>
      <div className="plane-side">
        <div className="dot-formula num">
          「行く」のQ = <b>{fmtVec(q, 1)}</b>
        </div>
        <div className="norm-bars p5-fit" style={{ marginTop: 0 }}>
          {WORDS.map((w, i) => {
            const v = scores[i];
            const half = (Math.abs(v) / span) * 50;
            return (
              <div key={w}>
                <div className="norm-row">
                  <span style={{ fontWeight: i === leader ? 700 : 400 }}>{w}</span>
                  <span className="norm-track">
                    <span className="norm-mid" />
                    <span className="norm-fill" style={{ left: v >= 0 ? "50%" : `${50 - half}%`, width: `${half}%`, background: i === leader ? "var(--hl-yellow)" : K_COLORS[i] }} />
                  </span>
                  <span className="val num">{fmt(v, 1)}</span>
                </div>
                <div className="p5-vec muted" style={{ fontSize: 12, paddingLeft: "4.4em" }}>
                  {term(q[0], K[i][0])} + {term(q[1], K[i][1])}
                </div>
              </div>
            );
          })}
        </div>
        <ul className="missions">
          <li data-done={done.a}>{done.a ? "○" : "□"} 「私は」が1位</li>
          <li data-done={done.b}>{done.b ? "○" : "□"} 「今日」が1位</li>
          <li data-done={done.neg}>{done.neg ? "○" : "□"} 4つのスコアを全部マイナスに</li>
        </ul>
        <div className="lab-actions" style={{ marginTop: 0 }}>
          <button className="btn ghost" onClick={() => setQ(Q[FOCUS])}>
            最初の位置にもどす
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
