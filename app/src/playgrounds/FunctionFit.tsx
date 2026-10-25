import { useState } from "react";
import { TARGETS } from "../data/ch12";

// plot area: x 0–6, y −5–25 mapped into a 300×260 SVG
const X = (x: number) => 30 + x * 45;
const Y = (y: number) => 230 - y * 8;

export function FunctionFit() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const f = (x: number) => a * x + b;
  const hits = TARGETS.map(([x, y]) => Math.abs(f(x) - y) < 1e-9);
  const done = hits.every(Boolean);

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 260" style={{ width: "100%", maxWidth: 340, display: "block" }} role="img" aria-label={`f(x) = ${a}x + ${b}`}>
        {[0, 1, 2, 3, 4, 5, 6].map((x) => (
          <line key={`x${x}`} x1={X(x)} y1={Y(-3)} x2={X(x)} y2={Y(27)} stroke="var(--grid-minor)" />
        ))}
        {[0, 5, 10, 15, 20, 25].map((y) => (
          <g key={`y${y}`}>
            <line x1={X(0)} y1={Y(y)} x2={X(6.2)} y2={Y(y)} stroke="var(--grid-minor)" />
            <text x={X(0) - 6} y={Y(y) + 4} textAnchor="end" fontSize={10} fill="var(--ink-3)">
              {y}
            </text>
          </g>
        ))}
        <line x1={X(0)} y1={Y(0)} x2={X(6.2)} y2={Y(0)} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={X(0)} y1={Y(-3)} x2={X(0)} y2={Y(27)} stroke="var(--ink)" strokeWidth={1.5} />
        <clipPath id="fit-clip">
          <rect x={X(0)} y={Y(27)} width={X(6.2) - X(0)} height={Y(-3) - Y(27)} />
        </clipPath>
        <line x1={X(0)} y1={Y(f(0))} x2={X(6.2)} y2={Y(f(6.2))} stroke="var(--ink)" strokeWidth={3} clipPath="url(#fit-clip)" />
        {TARGETS.map(([x, y], i) => (
          <g key={x}>
            <circle cx={X(x)} cy={Y(y)} r={7} fill={hits[i] ? "var(--hl-mint)" : "var(--paper)"} stroke="var(--pen)" strokeWidth={2.5} />
            <text x={X(x) + 10} y={Y(y) - 8} fontSize={11} fill="var(--pen)">
              ({x}, {y})
            </text>
          </g>
        ))}
      </svg>
      <div className="plane-side">
        <div className="vec-big num">
          f(x) = <b>{a}</b>x {b < 0 ? "−" : "+"} <b>{Math.abs(b)}</b>
        </div>
        <div className="lab-row">
          <span>a (기울기)</span>
          <input id="fit-a" type="range" min={-5} max={5} step={0.5} value={a} aria-label="손잡이 a" onChange={(e) => setA(Number(e.target.value))} />
          <span className="val">{a}</span>
        </div>
        <div className="lab-row">
          <span>b (더하기)</span>
          <input id="fit-b" type="range" min={-10} max={10} step={1} value={b} aria-label="손잡이 b" onChange={(e) => setB(Number(e.target.value))} />
          <span className="val">{b}</span>
        </div>
        <ul className="missions">
          {TARGETS.map(([x, y], i) => (
            <li key={x} data-done={hits[i]}>
              {hits[i] ? "○" : "□"} f({x}) = {y} (지금 {f(x)})
            </li>
          ))}
        </ul>
        <p className="lab-tip">{done ? "두 점을 모두 지나요! 손잡이를 맞추는 것, 이게 학습의 아주 작은 버전이에요." : "목표 점과 얼마나 떨어져 있는지 보면서 손잡이를 조금씩 돌려 보세요."}</p>
      </div>
    </div>
  );
}
