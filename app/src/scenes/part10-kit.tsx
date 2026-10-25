import type { CSSProperties, FC, ReactNode } from "react";
import { mix } from "./kit";

// Small drawing helpers shared by the Part 10 scenes (86–91).

export const FullSvg: FC<{ children: ReactNode; opacity?: number; style?: CSSProperties }> = ({ children, opacity = 1, style }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity, ...style }}>
    {children}
  </svg>
);

/** A straight arrow drawn on from (x1,y1) to (x2,y2) as p goes 0→1. */
export const Arrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number; dashed?: boolean }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  color = "var(--ink)",
  width = 6,
  dashed = false,
}) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 18;
  const hx = (a: number) => ex - h * Math.cos(ang + a);
  const hy = (a: number) => ey - h * Math.sin(ang + a);
  return (
    <FullSvg>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "4 14" : undefined} />
      {p > 0.9 && (
        <path d={`M ${hx(0.55)} ${hy(0.55)} L ${ex} ${ey} L ${hx(-0.55)} ${hy(-0.55)}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </FullSvg>
  );
};

/** A curved arrow along a quadratic path, drawn on as p goes 0→1 (the head appears at the end). */
export const CurveArrow: FC<{ d: string; end: [number, number]; ang: number; p: number; color?: string; width?: number }> = ({
  d,
  end,
  ang,
  p,
  color = "var(--pen)",
  width = 6,
}) => {
  if (p <= 0) return null;
  const h = 18;
  const hx = (a: number) => end[0] - h * Math.cos(ang + a);
  const hy = (a: number) => end[1] - h * Math.sin(ang + a);
  return (
    <FullSvg>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.95 && (
        <path d={`M ${hx(0.55)} ${hy(0.55)} L ${end[0]} ${end[1]} L ${hx(-0.55)} ${hy(-0.55)}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </FullSvg>
  );
};

/** A rounded box with a centred label (the "model" machine and friends). */
export const Box: FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label?: ReactNode;
  fs?: number;
  color?: string;
  o?: number;
  dashed?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({ x, y, w, h, label, fs = 52, color = "var(--paper-2)", o = 1, dashed = false, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 26,
      border: `5px ${dashed ? "dashed" : "solid"} var(--ink)`,
      background: color,
      color: color === "var(--paper-2)" || color === "var(--paper)" ? "var(--ink)" : "var(--chip-ink)",
      display: "grid",
      placeItems: "center",
      fontSize: fs,
      fontWeight: 700,
      opacity: o,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {label}
    {children}
  </div>
);

/** A chat bubble: `side` "user" sits right with a sky fill, "ai" sits left on paper. */
export const Bubble: FC<{ x: number; y: number; w: number; text: ReactNode; side: "user" | "ai"; fs?: number; o?: number; style?: CSSProperties }> = ({
  x,
  y,
  w,
  text,
  side,
  fs = 44,
  o = 1,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: "18px 30px",
      fontSize: fs,
      fontWeight: 500,
      lineHeight: 1.4,
      boxSizing: "border-box",
      wordBreak: "keep-all",
      ...(side === "user"
        ? { background: "var(--hl-sky)", color: "var(--chip-ink)", borderRadius: "32px 32px 8px 32px" }
        : { background: "var(--paper)", color: "var(--ink)", border: "3px solid var(--ink)", borderRadius: "32px 32px 32px 8px" }),
      opacity: o,
      translate: `0px ${mix(16, 0, o)}px`,
      ...style,
    }}
  >
    {text}
  </div>
);

/** Hand-drawn ✗ (two pen strokes) centred at (x,y). */
export const PenCross: FC<{ x: number; y: number; r?: number; p: number }> = ({ x, y, r = 34, p }) => {
  if (p <= 0) return null;
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <FullSvg>
      <line x1={x - r} y1={y - r} x2={mix(x - r, x + r, a)} y2={mix(y - r, y + r, a)} stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" />
      {b > 0 && <line x1={x + r} y1={y - r} x2={mix(x + r, x - r, b)} y2={mix(y - r, y + r, b)} stroke="var(--pen)" strokeWidth={8} strokeLinecap="round" />}
    </FullSvg>
  );
};

/** Hand-drawn ✓ centred at (x,y). */
export const PenCheck: FC<{ x: number; y: number; r?: number; p: number }> = ({ x, y, r = 34, p }) => {
  if (p <= 0) return null;
  return (
    <FullSvg>
      <path
        d={`M ${x - r} ${y} L ${x - r * 0.25} ${y + r * 0.75} L ${x + r} ${y - r * 0.8}`}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        fill="none"
        stroke="var(--pen)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </FullSvg>
  );
};

/** Centred line of text at y (full canvas width unless x/w are given). */
export const Line: FC<{ y: number; fs?: number; o?: number; x?: number; w?: number; weight?: number; color?: string; mono?: boolean; children: ReactNode; style?: CSSProperties }> = ({
  y,
  fs = 48,
  o = 1,
  x = 0,
  w = 1080,
  weight = 700,
  color = "var(--ink)",
  mono = false,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      width: w,
      top: y,
      textAlign: "center",
      fontSize: fs,
      fontWeight: weight,
      color,
      opacity: o,
      lineHeight: 1.3,
      wordBreak: "keep-all",
      fontFamily: mono ? "var(--font-mono)" : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const COLORS = ["var(--hl-yellow)", "var(--hl-mint)", "var(--hl-sky)", "var(--hl-pink)", "var(--hl-violet)", "var(--hl-orange)"];
