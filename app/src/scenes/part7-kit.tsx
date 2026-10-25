import type { CSSProperties, FC, ReactNode } from "react";
import { mix } from "./kit";

// Small drawing helpers shared by the Part 7 scenes (63–71). Colours only through tokens.

/** Absolutely placed text block; give `w` for anything that may wrap. */
export const T: FC<{
  x: number;
  y: number;
  w?: number;
  fs?: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
  color?: string;
  mono?: boolean;
  o?: number;
  style?: CSSProperties;
  children: ReactNode;
}> = ({ x, y, w, fs = 40, bold = false, align = "left", color = "var(--ink)", mono = false, o = 1, style, children }) => (
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
      color,
      fontFamily: mono ? "var(--font-mono)" : undefined,
      wordBreak: "keep-all",
      whiteSpace: w === undefined ? "nowrap" : undefined,
      opacity: o,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A centred line across the whole canvas. */
export const Center: FC<{ y: number; fs?: number; bold?: boolean; color?: string; o?: number; mono?: boolean; children: ReactNode }> = ({
  y,
  fs = 48,
  bold = true,
  color,
  o = 1,
  mono,
  children,
}) => (
  <T x={56} y={y} w={968} fs={fs} bold={bold} align="center" color={color} o={o} mono={mono}>
    {children}
  </T>
);

/** Bordered rounded box with centred content. */
export const Box: FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  border?: string;
  bw?: number;
  r?: number;
  o?: number;
  dashed?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({ x, y, w, h, fill = "var(--paper)", border = "var(--ink)", bw = 4, r = 18, o = 1, dashed = false, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: r,
      border: `${bw}px ${dashed ? "dashed" : "solid"} ${border}`,
      background: fill,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      opacity: o,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Full-canvas SVG layer. */
export const Layer: FC<{ children: ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }}>
    {children}
  </svg>
);

/** Straight arrow (inside a <Layer>) from a to b, drawn on as p goes 0→1. */
export const Arrow: FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p?: number;
  color?: string;
  width?: number;
  head?: number;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, p = 1, color = "var(--ink)", width = 6, head, dashed = false }) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(ey - y1, ex - x1);
  const h = head ?? width * 3.2;
  const hx = (a: number) => ex - h * Math.cos(ang + a);
  const hy = (a: number) => ey - h * Math.sin(ang + a);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={ex - Math.cos(ang) * h * 0.6}
        y2={ey - Math.sin(ang) * h * 0.6}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? `${width * 2.4} ${width * 2}` : undefined}
      />
      <path d={`M ${ex} ${ey} L ${hx(0.45)} ${hy(0.45)} L ${hx(-0.45)} ${hy(-0.45)} Z`} fill={color} stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
};

/** A hand-drawn red slash over a box (for "crossed out"), drawn on as p goes 0→1. */
export const Slash: FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => (
  <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <path
      d={`M ${w * 0.04} ${h * 0.86} C ${w * 0.3} ${h * 0.6}, ${w * 0.66} ${h * 0.38}, ${w * 0.97} ${h * 0.1}`}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      fill="none"
      stroke="var(--pen)"
      strokeWidth={7}
      strokeLinecap="round"
      opacity={p > 0 ? 1 : 0}
    />
  </svg>
);

/** A sheet of paper with a folded corner and a few text lines. */
export const Doc: FC<{ x: number; y: number; w?: number; fill?: string; o?: number; rot?: number }> = ({ x, y, w = 90, fill = "var(--paper)", o = 1, rot = 0 }) => {
  const h = w * 1.25;
  const f = w * 0.26;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o, rotate: `${rot}deg` }}>
      <path d={`M 3 3 L ${w - f} 3 L ${w - 3} ${f} L ${w - 3} ${h - 3} L 3 ${h - 3} Z`} fill={fill} stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M ${w - f} 3 L ${w - f} ${f} L ${w - 3} ${f}`} fill="none" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
      {[0.38, 0.54, 0.7].map((t, i) => (
        <line key={i} x1={w * 0.18} y1={h * t} x2={w * (i === 2 ? 0.6 : 0.82)} y2={h * t} stroke="var(--ink-3)" strokeWidth={4} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** Semicircle gauge: `v` from 0 to `max`, ticks at whole numbers. Used for the 놀람 미터. */
export const Meter: FC<{ cx: number; cy: number; r: number; v: number; max: number; o?: number; label?: string; showTicks?: boolean }> = ({
  cx,
  cy,
  r,
  v,
  max,
  o = 1,
  label,
  showTicks = true,
}) => {
  const ang = (t: number) => Math.PI * (1 - Math.min(Math.max(t, 0), max) / max);
  const pt = (t: number, rr: number): [number, number] => [cx + Math.cos(ang(t)) * rr, cy - Math.sin(ang(t)) * rr];
  const arc = (t0: number, t1: number, rr: number) => {
    const [ax, ay] = pt(t0, rr);
    const [bx, by] = pt(t1, rr);
    return `M ${ax} ${ay} A ${rr} ${rr} 0 0 1 ${bx} ${by}`;
  };
  const [nx, ny] = pt(v, r * 0.84);
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <div style={{ opacity: o }}>
      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={arc(0, max * 0.34, r)} fill="none" stroke="var(--hl-mint)" strokeWidth={r * 0.16} />
        <path d={arc(max * 0.34, max * 0.67, r)} fill="none" stroke="var(--hl-yellow)" strokeWidth={r * 0.16} />
        <path d={arc(max * 0.67, max, r)} fill="none" stroke="var(--hl-pink)" strokeWidth={r * 0.16} />
        {showTicks &&
          ticks.map((t) => {
            const [ax, ay] = pt(t, r * 0.9);
            const [bx, by] = pt(t, r * 1.1);
            return <line key={t} x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--ink)" strokeWidth={4} />;
          })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--pen)" strokeWidth={9} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill="var(--ink)" />
      </svg>
      {showTicks &&
        ticks.map((t) => {
          const [lx, ly] = pt(t, r * 1.1 + 34);
          return (
            <div key={t} style={{ position: "absolute", left: lx - 30, top: ly - 20, width: 60, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--ink-2)" }}>
              {t}
            </div>
          );
        })}
      {label && (
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy + 26, textAlign: "center", fontSize: 36, fontWeight: 700 }}>{label}</div>
      )}
    </div>
  );
};

/** Horizontal probability bar row: word on the left, bar, value on the right. */
export const HBar: FC<{
  x: number;
  y: number;
  word: string;
  p: number;
  scale: number;
  color: string;
  wordW?: number;
  fs?: number;
  value?: string;
  o?: number;
  bold?: boolean;
}> = ({ x, y, word, p, scale, color, wordW = 170, fs = 40, value, o = 1, bold = false }) => (
  <div style={{ opacity: o }}>
    <div style={{ position: "absolute", left: x, top: y, width: wordW, fontSize: fs, fontWeight: bold ? 700 : 500, lineHeight: 1.2, whiteSpace: "nowrap" }}>{word}</div>
    <div style={{ position: "absolute", left: x + wordW, top: y + fs * 0.1, width: Math.max(0, p * scale), height: fs, borderRadius: fs * 0.3, background: color }} />
    {value !== undefined && (
      <div style={{ position: "absolute", left: x + wordW + p * scale + 16, top: y, fontFamily: "var(--font-mono)", fontSize: fs * 0.9, lineHeight: 1.3, whiteSpace: "nowrap" }}>{value}</div>
    )}
  </div>
);

/** A round knob (as in 12장) turned to `angle` degrees. */
export const Knob: FC<{ x: number; y: number; r: number; angle: number; o?: number }> = ({ x, y, r, angle, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      boxSizing: "border-box",
      borderRadius: "50%",
      background: "var(--paper)",
      border: `${Math.max(3, r / 10)}px solid var(--ink)`,
      opacity: o,
      rotate: `${angle}deg`,
    }}
  >
    <div style={{ position: "absolute", left: r - Math.max(2, r / 14) - Math.max(3, r / 10), top: r * 0.1, width: Math.max(4, r / 7), height: r * 0.6, borderRadius: 4, background: "var(--pen)" }} />
  </div>
);
