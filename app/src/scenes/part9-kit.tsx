import type { CSSProperties, FC, ReactNode } from "react";
import type { Highlighter } from "../data/types";
import { hl, mix } from "./kit";

// Shared drawing pieces for Part 9 scenes (roulette wheel, temperature dial, arrows, cards).

export type Slice = { w: string; p: number; c: Highlighter | null };

const rad = (deg: number) => (deg * Math.PI) / 180;
/** Point on a circle, angle in degrees clockwise from 12 o'clock. */
export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))];

/** Cumulative start angle (degrees) of each slice. */
export function sliceStarts(items: Slice[]) {
  let a = 0;
  return items.map((it) => {
    const s = a;
    a += it.p * 360;
    return s;
  });
}

/**
 * Wheel rotation (degrees, clockwise) that puts slice `i` under the top pointer, always ahead of `from`
 * by at least `turns` full turns. `at` (0–1) picks where inside the slice the pointer lands.
 */
export function landOn(items: Slice[], i: number, from: number, turns: number, at = 0.5) {
  const phi = sliceStarts(items)[i] + items[i].p * 360 * at;
  const target = (((-phi - from) % 360) + 360) % 360;
  return from + target + turns * 360;
}

export const Wheel: FC<{
  items: Slice[];
  cx: number;
  cy: number;
  r: number;
  rot: number;
  fs?: number;
  minLabel?: number;
  otherLabel?: string;
  opacity?: number;
  highlight?: number;
}> = ({ items, cx, cy, r, rot, fs = 40, minLabel = 0.04, otherLabel, opacity = 1, highlight = -1 }) => {
  const starts = sliceStarts(items);
  return (
    <div style={{ opacity }}>
      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {items.map((it, i) => {
            const a0 = starts[i];
            const a1 = a0 + it.p * 360;
            const [x0, y0] = polar(cx, cy, r, a0);
            const [x1, y1] = polar(cx, cy, r, a1);
            const large = a1 - a0 > 180 ? 1 : 0;
            return (
              <path
                key={it.w}
                d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
                fill={it.c ? hl(it.c) : "var(--paper-2)"}
                stroke="var(--ink)"
                strokeWidth={highlight === i ? 7 : 3.5}
                strokeLinejoin="round"
              />
            );
          })}
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ink)" strokeWidth={6} />
        <circle cx={cx} cy={cy} r={Math.max(10, r * 0.06)} fill="var(--ink)" />
        {/* pointer */}
        <path d={`M ${cx - r * 0.09} ${cy - r - r * 0.16} L ${cx + r * 0.09} ${cy - r - r * 0.16} L ${cx} ${cy - r + r * 0.07} Z`} fill="var(--pen)" stroke="var(--pen)" strokeWidth={4} strokeLinejoin="round" />
      </svg>
      {items.map((it, i) => {
        if (it.p < minLabel) return null;
        const mid = starts[i] + it.p * 180 + rot;
        const [x, y] = polar(cx, cy, r * (it.p < 0.1 ? 0.74 : 0.62), mid);
        const text = it.c ? it.w : (otherLabel ?? it.w);
        const f = it.p < 0.1 ? Math.max(28, fs * 0.75) : fs;
        return (
          <div
            key={`l${it.w}`}
            style={{
              position: "absolute",
              left: x - 120,
              top: y - f * 0.72,
              width: 240,
              textAlign: "center",
              fontSize: f,
              fontWeight: 700,
              color: it.c ? "var(--chip-ink)" : "var(--ink-2)",
              lineHeight: 1.4,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

/** A temperature gauge: needle sweeps -120°..+120° for t in [0, max]. */
export const Dial: FC<{ x: number; y: number; r: number; t: number; max?: number; ticks?: number[]; label?: string; opacity?: number }> = ({
  x,
  y,
  r,
  t,
  max = 3,
  ticks = [0, 1, 2, 3],
  label,
  opacity = 1,
}) => {
  const ang = (v: number) => -120 + (Math.min(max, Math.max(0, v)) / max) * 240;
  const [nx, ny] = polar(x, y, r * 0.78, ang(t));
  const arc = (a0: number, a1: number, rr: number) => {
    const [x0, y0] = polar(x, y, rr, a0);
    const [x1, y1] = polar(x, y, rr, a1);
    return `M ${x0} ${y0} A ${rr} ${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  return (
    <div style={{ opacity }}>
      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={x} cy={y} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth={5} />
        <path d={arc(-120, -40, r * 0.9)} fill="none" stroke="var(--hl-sky)" strokeWidth={r * 0.12} />
        <path d={arc(40, 120, r * 0.9)} fill="none" stroke="var(--hl-orange)" strokeWidth={r * 0.12} />
        {ticks.map((v) => {
          const [ax, ay] = polar(x, y, r * 0.84, ang(v));
          const [bx, by] = polar(x, y, r * 0.98, ang(v));
          return <line key={v} x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />;
        })}
        <line x1={x} y1={y} x2={nx} y2={ny} stroke="var(--pen)" strokeWidth={Math.max(5, r * 0.07)} strokeLinecap="round" />
        <circle cx={x} cy={y} r={r * 0.1} fill="var(--ink)" />
      </svg>
      {ticks.map((v) => {
        const fs = Math.max(28, r * 0.2);
        const [lx, ly] = polar(x, y, r + fs * 0.75, ang(v));
        return (
          <div key={`t${v}`} style={{ position: "absolute", left: lx - 30, top: ly - fs * 0.62, width: 60, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: fs, color: "var(--ink-2)" }}>
            {v}
          </div>
        );
      })}
      {label && (
        <div style={{ position: "absolute", left: x - 200, width: 400, top: y + r * 0.38, textAlign: "center", fontSize: Math.max(30, r * 0.22), fontWeight: 700 }}>
          {label}
        </div>
      )}
    </div>
  );
};

/** Straight arrow drawn on as p goes 0→1. */
export const Arrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  color = "var(--ink)",
  width = 6,
}) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = width * 3;
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.9 && (
        <path
          d={`M ${ex - h * Math.cos(ang - 0.5)} ${ey - h * Math.sin(ang - 0.5)} L ${ex} ${ey} L ${ex - h * Math.cos(ang + 0.5)} ${ey - h * Math.sin(ang + 0.5)}`}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

/** Curved arrow along a quadratic path, drawn on as p goes 0→1 (arrow head appears at the end). */
export const CurveArrow: FC<{ d: string; end: [number, number]; endAngle: number; p: number; color?: string; width?: number }> = ({
  d,
  end,
  endAngle,
  p,
  color = "var(--ink)",
  width = 6,
}) => {
  if (p <= 0) return null;
  const h = width * 3;
  const [ex, ey] = end;
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.95 && (
        <path
          d={`M ${ex - h * Math.cos(endAngle - 0.5)} ${ey - h * Math.sin(endAngle - 0.5)} L ${ex} ${ey} L ${ex - h * Math.cos(endAngle + 0.5)} ${ey - h * Math.sin(endAngle + 0.5)}`}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

/** A paper card with a soft border. */
export const Card: FC<{ x: number; y: number; w: number; h: number; style?: CSSProperties; children?: ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 28,
      border: "3px solid var(--ink)",
      background: "var(--paper)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const OUTLINE: CSSProperties = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };

/** Percent text for a probability: one decimal, "<0.1%" for tiny ones. */
export const pct1 = (p: number) => (p > 0 && p < 0.0005 ? "<0.1%" : `${(p * 100).toFixed(1)}%`);
