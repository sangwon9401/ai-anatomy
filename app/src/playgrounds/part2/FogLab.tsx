import { useState } from "react";
import { LR, W0, lossA } from "../../data/ch21";
import { num } from "../../data/part2-toy";
import "./style.css";

const X = (w: number) => 30 + w * 85;
const Y = (l: number) => 196 - Math.min(l, 8.4) * 21;
const NUDGE = 0.01;
const curveBetween = (a: number, b: number) => {
  const n = Math.max(2, Math.round((b - a) * 60));
  return Array.from({ length: n + 1 }, (_, i) => {
    const w = a + ((b - a) * i) / n;
    return `${i ? "L" : "M"} ${X(w).toFixed(1)} ${Y(lossA(w)).toFixed(1)}`;
  }).join(" ");
};

export function FogLab() {
  const [w, setW] = useState(W0);
  const [trail, setTrail] = useState<number[]>([W0]);
  const [measured, setMeasured] = useState<{ w: number; dl: number } | null>(null);
  const [clear, setClear] = useState(false);
  const loss = lossA(w);
  const pred = 1.5 + 2 * w;
  const slope = measured ? measured.dl / NUDGE : null;

  const moveTo = (v: number) => {
    const r = Math.round(Math.max(0, Math.min(3, v)) * 1000) / 1000;
    setW(r);
    setTrail((t) => [...t.slice(-30), r]);
    setMeasured(null);
  };
  const measure = () => setMeasured({ w, dl: lossA(w + NUDGE) - lossA(w) });
  const step = () => {
    const dl = lossA(w + NUDGE) - lossA(w);
    moveTo(w - LR * (dl / NUDGE));
  };

  let tip: string;
  if (loss < 0.01) tip = `바닥 도착! 손실 ${num(loss, 4)}. w = ${num(w, 3)}일 때 예측이 ${num(pred, 2)}점으로 진짜 별점 4.5점에 거의 딱 맞아요.`;
  else if (slope === null) tip = "안개 때문에 골짜기가 안 보여요. '기울기 재기'로 발밑이 어느 쪽으로 기울었는지 먼저 확인해 보세요.";
  else if (slope < 0) tip = `기울기 ${num(slope, 2)}: 음수예요. w를 올리면 손실이 줄어요. 오른쪽으로 조금 돌려 보세요.`;
  else tip = `기울기 +${num(slope, 2)}: 양수예요. w를 올리면 손실이 늘어요. 왼쪽으로 조금 돌려 보세요.`;

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 228" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`w ${num(w, 2)}, 손실 ${num(loss, 3)}`}>
        <rect x={X(0)} y={Y(8.4)} width={X(3) - X(0)} height={Y(0) - Y(8.4)} fill="var(--paper-2)" />
        <text x={X(1.5)} y={Y(5)} textAnchor="middle" fontSize={22} fill="var(--ink-3)" opacity={clear ? 0 : 0.6} fontFamily="var(--font-hand)">
          안개
        </text>
        {[0.5, 1, 1.5, 2, 2.5, 3].map((t) => (
          <g key={t}>
            <line x1={X(t)} y1={Y(0) - 3} x2={X(t)} y2={Y(0) + 3} stroke="var(--ink)" />
            <text x={X(t)} y={Y(0) + 14} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
              {t}
            </text>
          </g>
        ))}
        {[2, 4, 6, 8].map((t) => (
          <text key={t} x={X(0) - 5} y={Y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--ink-3)">
            {t}
          </text>
        ))}
        <line x1={X(0)} y1={Y(0)} x2={X(3.05)} y2={Y(0)} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(8.4)} stroke="var(--ink)" strokeWidth={1.5} />
        <text x={X(3)} y={Y(0) + 26} textAnchor="end" fontSize={11} fill="var(--ink-2)">
          w (줄 손잡이) →
        </text>
        <text x={X(0) + 5} y={Y(8.4) + 10} fontSize={11} fill="var(--ink-2)">
          ↑ 손실
        </text>
        {clear ? (
          <path d={curveBetween(0, 3)} fill="none" stroke="var(--ink)" strokeWidth={2} />
        ) : (
          <path d={curveBetween(Math.max(0, w - 0.18), Math.min(3, w + 0.18))} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
        )}
        {trail.map((t, i) => (
          <circle key={i} cx={X(t)} cy={Y(lossA(t))} r={2.4} fill="var(--pen)" opacity={0.3 + (0.7 * i) / trail.length} />
        ))}
        {measured && (
          <line
            x1={X(w - 0.25)}
            y1={Y(loss - (measured.dl / NUDGE) * 0.25)}
            x2={X(w + 0.25)}
            y2={Y(loss + (measured.dl / NUDGE) * 0.25)}
            stroke="var(--pen)"
            strokeWidth={2.5}
          />
        )}
        <circle cx={X(w)} cy={Y(loss) - 8} r={7.5} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1.8} />
      </svg>
      <div className="plane-side">
        <div className="lab-row p2-sliders" style={{ gridTemplateColumns: "6.6em minmax(0, 1fr) 3.2em" }}>
          <span>줄 손잡이 w</span>
          <input type="range" min={0} max={3} step="any" value={w} aria-label="줄 손잡이 w" onChange={(e) => moveTo(Number(e.target.value))} />
          <span className="val">{num(w, 2)}</span>
        </div>
        <p className="p2-calc">
          예측 = 1.5 + 2 × {num(w, 3)} = {num(pred, 3)}점 · 진짜 4.5점
          <br />
          손실 = ({num(pred, 3)} − 4.5)² = <b>{num(loss, 4)}</b>
          {measured && (
            <>
              <br />
              w를 0.01 올리면 손실 {measured.dl < 0 ? "−" : "+"}
              {num(Math.abs(measured.dl), 4)} → 기울기 ≈ <b>{num(measured.dl / NUDGE, 2)}</b>
            </>
          )}
        </p>
        <div className="lab-actions">
          <button className="btn" onClick={measure}>
            기울기 재기
          </button>
          <button className="btn ghost" onClick={step}>
            자동으로 한 걸음
          </button>
          <button className="btn ghost" onClick={() => setClear((c) => !c)}>
            {clear ? "안개 덮기" : "안개 걷기"}
          </button>
          <button
            className="btn ghost"
            onClick={() => {
              setW(W0);
              setTrail([W0]);
              setMeasured(null);
            }}
          >
            처음으로
          </button>
        </div>
        <p className="p2-note">자동으로 한 걸음 = 새 w = w − {LR} × 기울기. 가게 A, 설명용 예시예요.</p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
