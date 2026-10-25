// Small scene helpers shared by the Part 11 scenes (ch92–96).
import type { CSSProperties, FC, ReactNode } from "react";
import { beat, mix, type TimedStep } from "../../../scenes/kit";

/** Opacity of a layer that fades in `at` seconds into `from` and out at the start of `to`. */
export const fade = (frame: number, from: TimedStep, to?: TimedStep, at = 0.2, dur = 0.5) =>
  beat(frame, from, at, dur) * (to ? 1 - beat(frame, to, 0, 0.4) : 1);

/** Whether a layer that lives from `from` until `to` should be mounted (it stays 15 frames into `to` to fade out). */
export const live = (frame: number, from: TimedStep, to?: TimedStep) => frame >= from.from && (!to || frame < to.from + 15);

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
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const h = 18;
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.95 && (
        <path
          d={`M ${x2 - h * Math.cos(ang - 0.5)} ${y2 - h * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - h * Math.cos(ang + 0.5)} ${y2 - h * Math.sin(ang + 0.5)}`}
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

/** Absolutely placed text block. */
export const Txt: FC<{ x: number; y: number; w?: number; fs?: number; bold?: boolean; align?: CSSProperties["textAlign"]; style?: CSSProperties; children: ReactNode }> = ({
  x,
  y,
  w,
  fs = 40,
  bold,
  align = "left",
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      fontSize: fs,
      fontWeight: bold ? 700 : 500,
      lineHeight: 1.3,
      textAlign: align,
      wordBreak: "keep-all",
      whiteSpace: w ? "normal" : "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A rounded box with a hand-drawn feel. */
export const Box: FC<{ x: number; y: number; w: number; h: number; style?: CSSProperties; children?: ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 22,
      border: "4px solid var(--ink)",
      background: "var(--paper-2)",
      display: "grid",
      placeItems: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A horizontal probability bar row: chip-like label, bar, value.
 * English: the label box is wider (170 instead of 92) because the labels are words (good, small, penny), not syllables. */
export const ProbBar: FC<{ x: number; y: number; label: string; p: number; max: number; w: number; color: string; o?: number; grow?: number; fs?: number }> = ({
  x,
  y,
  label,
  p,
  max,
  w,
  color,
  o = 1,
  grow = 1,
  fs = 44,
}) => (
  <div style={{ opacity: o }}>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 170,
        height: 66,
        borderRadius: 12,
        background: color,
        color: "var(--chip-ink)",
        display: "grid",
        placeItems: "center",
        fontSize: fs,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
    <div style={{ position: "absolute", left: x + 188, top: y + 8, width: (p / max) * w * grow, height: 50, borderRadius: 10, background: color }} />
    <div style={{ position: "absolute", left: x + 204 + (p / max) * w * grow, top: y + 8, fontFamily: "var(--font-mono)", fontSize: 40, opacity: grow }}>
      {p.toFixed(1)}%
    </div>
  </div>
);

/** A loss curve (array of values) drawn into a box, revealed left→right as p goes 0→1. */
export const Curve: FC<{ xs: number[]; x: number; y: number; w: number; h: number; top: number; p: number; color?: string; width?: number }> = ({
  xs,
  x,
  y,
  w,
  h,
  top,
  p,
  color = "var(--pen)",
  width = 6,
}) => {
  const d = xs.map((v, i) => `${i ? "L" : "M"} ${(x + (i / (xs.length - 1)) * w).toFixed(1)} ${(y + h - (v / top) * h).toFixed(1)}`).join(" ");
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};
