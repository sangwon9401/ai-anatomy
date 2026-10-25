import type { CSSProperties, FC, ReactNode } from "react";
import { mix } from "./kit";

// Shared drawing helpers for Part 8 (chapters 72–79).

export const OUTLINE: CSSProperties = { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" };
export const DARK: CSSProperties = { background: "var(--ink)", color: "var(--paper)" };

/** A straight arrow drawn on as p goes 0→1 (head appears at the end). */
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
  const h = 18;
  const hx = (a: number) => x2 - h * Math.cos(ang + a);
  const hy = (a: number) => y2 - h * Math.sin(ang + a);
  return (
    <svg width={1080} height={1350} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={mix(x1, x2, p)} y2={mix(y1, y2, p)} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.95 && (
        <path
          d={`M ${hx(0.6)} ${hy(0.6)} L ${x2} ${y2} L ${hx(-0.6)} ${hy(-0.6)}`}
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

/** A chat bubble. `side` "user" sits on the right in sky, "bot" on the left on paper. */
export const Bubble: FC<{
  side: "user" | "bot";
  x: number;
  y: number;
  w: number;
  fs?: number;
  o?: number;
  color?: string;
  style?: CSSProperties;
  children: ReactNode;
}> = ({ side, x, y, w, fs = 42, o = 1, color, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: `${fs * 0.38}px ${fs * 0.7}px`,
      fontSize: fs,
      lineHeight: 1.42,
      fontWeight: 500,
      wordBreak: "keep-all",
      background: color ?? (side === "user" ? "var(--hl-sky)" : "var(--paper-2)"),
      color: side === "user" || color ? "var(--chip-ink)" : "var(--ink)",
      border: side === "bot" && !color ? "2px solid var(--line)" : undefined,
      borderRadius: side === "user" ? "34px 34px 8px 34px" : "34px 34px 34px 8px",
      opacity: o,
      translate: `0px ${mix(18, 0, o)}px`,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A labelled machine box. */
export const Machine: FC<{ x: number; y: number; w: number; h: number; o?: number; fs?: number; bg?: string; children: ReactNode; style?: CSSProperties }> = ({
  x,
  y,
  w,
  h,
  o = 1,
  fs = 60,
  bg = "var(--paper-2)",
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      border: "5px solid var(--ink)",
      borderRadius: 28,
      background: bg,
      color: bg === "var(--paper-2)" ? "var(--ink)" : "var(--chip-ink)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontSize: fs,
      fontWeight: 700,
      lineHeight: 1.2,
      opacity: o,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A sheet of paper with a few lines of text. */
export const Doc: FC<{ x: number; y: number; w: number; o?: number; fs?: number; style?: CSSProperties; children: ReactNode }> = ({
  x,
  y,
  w,
  o = 1,
  fs = 38,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: "24px 34px",
      fontSize: fs,
      lineHeight: 1.55,
      background: "var(--paper)",
      border: "3px solid var(--ink)",
      borderRadius: 10,
      boxShadow: "10px 10px 0 var(--grid-major)",
      wordBreak: "keep-all",
      opacity: o,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A round badge with a number or short text (ranks, A/B/C). */
export const Badge: FC<{ x: number; y: number; r?: number; text: string; bg?: string; ink?: string; o?: number; fs?: number }> = ({
  x,
  y,
  r = 34,
  text,
  bg = "var(--ink)",
  ink = "var(--paper)",
  o = 1,
  fs,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: bg,
      color: ink,
      display: "grid",
      placeItems: "center",
      fontSize: fs ?? r * 1.05,
      fontWeight: 700,
      opacity: o,
      scale: String(mix(0.5, 1, o)),
    }}
  >
    {text}
  </div>
);

/** Red-pen ○ (right) or × (wrong), drawn on as p goes 0→1. */
export const Mark: FC<{ x: number; y: number; size?: number; ok: boolean; p: number }> = ({ x, y, size = 70, ok, p }) => {
  if (p <= 0) return null;
  const s = size;
  return (
    <svg width={s} height={s} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      {ok ? (
        <path
          d={`M ${s * 0.5} ${s * 0.06} C ${s * 1.02} ${s * 0.04}, ${s * 1.04} ${s * 0.96}, ${s * 0.48} ${s * 0.96} C ${-s * 0.04} ${s * 0.95}, ${-s * 0.02} ${s * 0.1}, ${s * 0.56} ${s * 0.1}`}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
          fill="none"
          stroke="var(--pen)"
          strokeWidth={7}
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d={`M ${s * 0.1} ${s * 0.1} L ${s * 0.9} ${s * 0.9}`}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - Math.min(1, p * 2)}
            stroke="var(--pen)"
            strokeWidth={8}
            strokeLinecap="round"
          />
          {p > 0.5 && (
            <path
              d={`M ${s * 0.9} ${s * 0.1} L ${s * 0.1} ${s * 0.9}`}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - (p - 0.5) * 2}
              stroke="var(--pen)"
              strokeWidth={8}
              strokeLinecap="round"
            />
          )}
        </>
      )}
    </svg>
  );
};

/** Small caption-style note in ink-3 ("* 설명용 예시"). */
export const Note: FC<{ x: number; y: number; o?: number; w?: number; align?: "left" | "right" | "center"; children: ReactNode }> = ({
  x,
  y,
  o = 1,
  w,
  align = "left",
  children,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontSize: 28, color: "var(--ink-3)", opacity: o, whiteSpace: w ? "normal" : "nowrap" }}>
    {children}
  </div>
);

/** Centered line of text across the canvas. */
export const Center: FC<{ y: number; fs?: number; o?: number; weight?: number; color?: string; children: ReactNode; style?: CSSProperties }> = ({
  y,
  fs = 56,
  o = 1,
  weight = 700,
  color = "var(--ink)",
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 56,
      right: 56,
      top: y,
      textAlign: "center",
      fontSize: fs,
      fontWeight: weight,
      color,
      opacity: o,
      wordBreak: "keep-all",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A friendly line-drawn puppy, drawn in a 100×100 box. `sit` 0→1 lowers the body. */
export const Dog: FC<{ x: number; y: number; size: number; o?: number; sit?: number; flip?: boolean }> = ({ x, y, size, o = 1, sit = 0, flip }) => {
  const b = mix(0, 8, sit);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o, scale: flip ? "-1 1" : undefined }}
      aria-hidden="true"
    >
      {/* tail */}
      <path d={`M 22 ${60 + b} C 10 ${54 + b}, 8 ${44 + b}, 14 ${38 + b}`} stroke="var(--ink)" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* body */}
      <path
        d={`M 20 ${62 + b} C 20 ${50 + b}, 34 ${46 + b}, 50 ${48 + b} C 62 ${50 + b}, 70 ${52 + b}, 72 ${62 + b} L 72 ${74 + b * 0.3} C 60 ${78}, 34 ${78}, 22 ${74 + b * 0.3} Z`}
        fill="var(--hl-orange)"
        stroke="var(--ink)"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* legs */}
      <path d={`M 30 ${74} L 30 ${88 - b * 0.6}`} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <path d={`M 40 ${76} L 40 ${90 - b * 0.4}`} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <path d="M 60 76 L 60 90" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <path d="M 68 74 L 68 88" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      {/* head */}
      <circle cx={76} cy={40} r={17} fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={4} />
      {/* ear */}
      <path d="M 66 28 C 58 30, 56 44, 62 50 C 66 44, 68 36, 66 28 Z" fill="var(--ink-2)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
      {/* face */}
      <circle cx={80} cy={37} r={2.6} fill="var(--ink)" />
      <ellipse cx={92} cy={44} rx={4} ry={3} fill="var(--ink)" />
      <path d="M 82 50 C 85 53, 89 53, 91 50" stroke="var(--ink)" strokeWidth={2.6} fill="none" strokeLinecap="round" />
    </svg>
  );
};

/** A little bone-shaped treat. */
export const Treat: FC<{ x: number; y: number; size: number; o?: number }> = ({ x, y, size, o = 1 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 100 50" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o }} aria-hidden="true">
    <path
      d="M 22 16 C 14 2, -2 10, 8 22 C -2 32, 12 46, 22 34 L 78 34 C 88 46, 102 32, 92 22 C 102 10, 86 2, 78 16 Z"
      fill="var(--hl-yellow)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);

/** A small person (bust) icon for "사람". */
export const Person: FC<{ x: number; y: number; size: number; o?: number; color?: string }> = ({ x, y, size, o = 1, color = "var(--hl-sky)" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: o }} aria-hidden="true">
    <circle cx={50} cy={32} r={18} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4.5} />
    <path d="M 16 92 C 16 66, 30 56, 50 56 C 70 56, 84 66, 84 92 Z" fill={color} stroke="var(--ink)" strokeWidth={4.5} strokeLinejoin="round" />
  </svg>
);
