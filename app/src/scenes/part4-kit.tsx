import type { CSSProperties, FC, ReactNode } from "react";
import { mix } from "./kit";

// Shared drawing pieces for Part 4 (chapters 37–43).

/** A straight arrow drawn on from (x1, y1) to (x2, y2) as `p` goes 0→1. */
export const Arrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number; dash?: string; opacity?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  color = "var(--ink)",
  width = 6,
  dash,
  opacity = 1,
}) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = width * 2.8;
  const hx = (a: number) => ex - h * Math.cos(ang + a);
  const hy = (a: number) => ey - h * Math.sin(ang + a);
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity, pointerEvents: "none" }}>
      <line x1={x1} y1={y1} x2={ex - Math.cos(ang) * 2} y2={ey - Math.sin(ang) * 2} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} />
      {p > 0.9 && (
        <path d={`M ${hx(0.5)} ${hy(0.5)} L ${ex} ${ey} L ${hx(-0.5)} ${hy(-0.5)}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
};

/** A curved arrow along a quadratic curve, drawn on with `p`. */
export const CurveArrow: FC<{ x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; p: number; color?: string; width?: number; opacity?: number }> = ({
  x1,
  y1,
  cx,
  cy,
  x2,
  y2,
  p,
  color = "var(--pen)",
  width = 6,
  opacity = 1,
}) => {
  if (p <= 0) return null;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const h = width * 2.8;
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity, pointerEvents: "none" }}>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {p > 0.95 && (
        <path
          d={`M ${x2 - h * Math.cos(ang + 0.5)} ${y2 - h * Math.sin(ang + 0.5)} L ${x2} ${y2} L ${x2 - h * Math.cos(ang - 0.5)} ${y2 - h * Math.sin(ang - 0.5)}`}
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

/** A rounded machine box with a centred label (like ch12's function machine). */
export const Box: FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  o?: number;
  border?: number;
  radius?: number;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({ x, y, w, h, color = "var(--hl-violet)", o = 1, border = 5, radius = 26, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      border: `${border}px solid var(--ink)`,
      background: color,
      color: color === "var(--paper)" || color === "var(--paper-2)" ? "var(--ink)" : "var(--chip-ink)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      opacity: o,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A small sticky note (쪽지). Each line can fade on its own. */
export const Note: FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lines?: { text: string; o?: number; color?: string }[];
  fs?: number;
  rotate?: number;
  o?: number;
  tint?: string;
  children?: ReactNode;
}> = ({ x, y, w, h, lines = [], fs = 36, rotate = -2, o = 1, tint = "var(--hl-yellow)", children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      rotate: `${rotate}deg`,
      opacity: o,
      background: tint,
      borderRadius: "6px 6px 6px 22px",
      boxShadow: "0 3px 0 var(--grid-major)",
      border: "3px solid var(--ink)",
      boxSizing: "border-box",
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 2,
      fontFamily: "var(--font-hand)",
      fontSize: fs,
      lineHeight: 1.15,
      color: "var(--chip-ink)",
      overflow: "hidden",
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={{ opacity: l.o ?? 1, color: l.color, whiteSpace: "nowrap" }}>
        {l.text}
      </div>
    ))}
    {children}
  </div>
);

/** "* 설명용 예시" in the top-right corner. */
export const Demo: FC<{ text: string; o: number; top?: number }> = ({ text, o, top = 40 }) => (
  <div style={{ position: "absolute", right: 56, top, fontSize: 28, color: "var(--ink-3)", opacity: o }}>{text}</div>
);

/** A horizontal probability bar row: label, bar, percent. */
export const BarRow: FC<{
  x: number;
  y: number;
  label: string;
  p: number;
  scale: number;
  color: string;
  grow?: number;
  labelW?: number;
  fs?: number;
  text?: string;
  o?: number;
  bold?: boolean;
}> = ({ x, y, label, p, scale, color, grow = 1, labelW = 170, fs = 40, text, o = 1, bold }) => (
  <div style={{ opacity: o }}>
    <div style={{ position: "absolute", left: x, top: y, width: labelW, fontSize: fs, fontWeight: bold ? 700 : 500, lineHeight: 1.2, whiteSpace: "nowrap" }}>{label}</div>
    <div
      style={{
        position: "absolute",
        left: x + labelW,
        top: y + fs * 0.12,
        height: fs,
        width: Math.max(4, p * scale * grow),
        borderRadius: fs / 2,
        background: color,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: x + labelW + Math.max(4, p * scale * grow) + 16,
        top: y,
        fontFamily: "var(--font-mono)",
        fontSize: fs * 0.95,
        lineHeight: 1.2,
        opacity: grow,
      }}
    >
      {text ?? `${Math.round(p * 100)}%`}
    </div>
  </div>
);

const signed = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`);

/** An RNN note (쪽지) with named slots: each slot's handwriting fades with the size of its number. */
export const SlotNote: FC<{
  x: number;
  y: number;
  w: number;
  slots: readonly string[];
  h: readonly number[];
  gist: readonly string[];
  fs?: number;
  o?: number;
  rotate?: number;
  nums?: boolean;
  tint?: string;
  title?: string;
}> = ({ x, y, w, slots, h, gist, fs = 34, o = 1, rotate = -2, nums = true, tint = "var(--hl-yellow)", title }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      rotate: `${rotate}deg`,
      opacity: o,
      background: tint,
      borderRadius: "6px 6px 6px 22px",
      border: "3px solid var(--ink)",
      boxShadow: "0 4px 0 var(--grid-major)",
      boxSizing: "border-box",
      padding: "10px 14px 12px",
      color: "var(--chip-ink)",
    }}
  >
    {title && <div style={{ fontSize: fs * 0.8, fontWeight: 700, marginBottom: 4 }}>{title}</div>}
    {slots.map((s, i) => (
      <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 8, lineHeight: 1.3, whiteSpace: "nowrap" }}>
        <span style={{ fontSize: fs * 0.78, fontWeight: 700, minWidth: fs * 1.6 }}>{s}</span>
        <span style={{ fontFamily: "var(--font-hand)", fontSize: fs * 1.05, flex: 1, opacity: gist[i] ? Math.max(0.06, Math.abs(h[i])) : 1 }}>{gist[i] || "·"}</span>
        {nums && <span style={{ fontFamily: "var(--font-mono)", fontSize: fs * 0.72 }}>{signed(h[i])}</span>}
      </div>
    ))}
  </div>
);
