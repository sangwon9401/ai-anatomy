import { useState } from "react";
import { FRIENDS } from "../data/ch07";
import { dot } from "../data/ch09";

const A = FRIENDS[0].v;
const A_ANG = (Math.atan2(A[1], A[0]) * 180) / Math.PI;
const SIZE = 300;
const O = 150;
const U = 12;
const r1 = (v: number) => Math.round(v * 10) / 10;

function Arrow({ v, color, width }: { v: [number, number]; color: string; width: number }) {
  const x = O + v[0] * U;
  const y = O - v[1] * U;
  const a = Math.atan2(y - O, x - O);
  const h = 11;
  return (
    <g>
      <line x1={O} y1={O} x2={x - Math.cos(a) * h * 0.6} y2={y - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${x - h * Math.cos(a - 0.45)} ${y - h * Math.sin(a - 0.45)} L ${x - h * Math.cos(a + 0.45)} ${y - h * Math.sin(a + 0.45)} Z`} fill={color} />
    </g>
  );
}

export function DotDial() {
  const [angle, setAngle] = useState(60);
  const [len, setLen] = useState(6);
  const [found, setFound] = useState({ zero: false, neg: false });
  const rad = ((A_ANG + angle) * Math.PI) / 180;
  const b: [number, number] = [r1(len * Math.cos(rad)), r1(len * Math.sin(rad))];
  const d = r1(dot(A, b));
  if (Math.abs(d) < 2 && !found.zero) setFound((f) => ({ ...f, zero: true }));
  if (d < 0 && !found.neg) setFound((f) => ({ ...f, neg: true }));

  return (
    <div className="plane-lab">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", maxWidth: 340, display: "block" }} role="img" aria-label={`내적 ${d}`}>
        {Array.from({ length: 25 }, (_, i) => (
          <g key={i}>
            <line x1={i * U + 6} y1={0} x2={i * U + 6} y2={SIZE} stroke="var(--grid-minor)" />
            <line x1={0} y1={i * U + 6} x2={SIZE} y2={i * U + 6} stroke="var(--grid-minor)" />
          </g>
        ))}
        <line x1={0} y1={O} x2={SIZE} y2={O} stroke="var(--ink-3)" strokeWidth={1.5} />
        <line x1={O} y1={0} x2={O} y2={SIZE} stroke="var(--ink-3)" strokeWidth={1.5} />
        <Arrow v={A} color="var(--hl-pink)" width={6} />
        <Arrow v={b} color="var(--hl-sky)" width={6} />
      </svg>
      <div className="plane-side">
        <div className="dot-formula num">
          (8, 3) · ({b[0]}, {b[1]})
          <br />= {r1(8 * b[0])} + {r1(3 * b[1])}
          <br />= <b className={d < 0 ? "pen" : ""}>{d}</b>
        </div>
        <div className="lab-row">
          <span>각도</span>
          <input id="dot-angle" type="range" min={0} max={360} step={5} value={angle} aria-label="파란 화살표의 각도" onChange={(e) => setAngle(Number(e.target.value))} />
          <span className="val">{angle}°</span>
        </div>
        <div className="lab-row">
          <span>길이</span>
          <input id="dot-len" type="range" min={1} max={10} step={0.5} value={len} aria-label="파란 화살표의 길이" onChange={(e) => setLen(Number(e.target.value))} />
          <span className="val">{len}</span>
        </div>
        <ul className="missions">
          <li data-done={found.zero}>{found.zero ? "○" : "□"} 내적을 0 근처로 만들기 (직각)</li>
          <li data-done={found.neg}>{found.neg ? "○" : "□"} 내적을 음수로 만들기 (반대쪽)</li>
        </ul>
        <p className="lab-tip">분홍 화살표(민지)는 그대로예요. 각도 0°는 같은 방향이에요.</p>
      </div>
    </div>
  );
}
