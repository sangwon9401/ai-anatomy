import type { CSSProperties, FC, ReactNode } from "react";
import { hl, textWidth } from "./kit";
import type { Highlighter } from "../data/types";

/** A square card with one big glyph (a letter, a syllable). */
export const GlyphCard: FC<{
  x: number;
  y: number;
  size: number;
  glyph: string;
  fs?: number;
  color?: Highlighter | null;
  style?: CSSProperties;
}> = ({ x, y, size, glyph, fs, color = null, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: size * 0.1,
      border: "4px solid var(--ink)",
      background: color ? hl(color) : "var(--paper)",
      color: color ? "var(--chip-ink)" : "var(--ink)",
      display: "grid",
      placeItems: "center",
      fontSize: fs ?? size * 0.62,
      fontWeight: 700,
      lineHeight: 1,
      ...style,
    }}
  >
    {glyph}
  </div>
);

/** A small boxed number (a byte, a token id). */
export const NumBox: FC<{ x: number; y: number; w: number; h?: number; fs?: number; color?: Highlighter | null; children: ReactNode; style?: CSSProperties }> = ({
  x,
  y,
  w,
  h = 76,
  fs = 40,
  color = null,
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
      borderRadius: 12,
      border: "3px solid var(--ink)",
      background: color ? hl(color) : "var(--paper)",
      color: color ? "var(--chip-ink)" : "var(--ink)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: fs,
      fontWeight: 500,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Centered single-line text at a given y. */
export const Line: FC<{ y: number; fs?: number; weight?: number; mono?: boolean; color?: string; o?: number; children: ReactNode; style?: CSSProperties }> = ({
  y,
  fs = 48,
  weight = 700,
  mono = false,
  color = "var(--ink)",
  o = 1,
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
      fontFamily: mono ? "var(--font-mono)" : undefined,
      color,
      opacity: o,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A full-canvas SVG layer for lines and arcs. */
export const Svg: FC<{ children: ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
    {children}
  </svg>
);

/** A hand-drawn arrow between two points, drawn on as p goes 0→1. */
export const PenArrow: FC<{ x1: number; y1: number; x2: number; y2: number; p: number; bend?: number; color?: string; w?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  bend = 0,
  color = "var(--pen)",
  w = 5,
}) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - bend;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  // arrow head direction from the control point to the end
  const ang = Math.atan2(y2 - my, x2 - mx);
  const h = 18;
  const head = `M ${x2 - h * Math.cos(ang - 0.45)} ${y2 - h * Math.sin(ang - 0.45)} L ${x2} ${y2} L ${x2 - h * Math.cos(ang + 0.45)} ${y2 - h * Math.sin(ang + 0.45)}`;
  return (
    <g>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
      {p > 0.95 && <path d={head} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
};

/** Width of a token chip: spaces inside tokens are drawn as a small "␣" mark. */
export const showSpace = (t: string) => t.replace(/ /g, "␣");
export const tokenWidth = (t: string, fs: number) => Math.max(fs * 1.3, textWidth(showSpace(t), fs) + fs * 0.7);

export const TOKEN_COLORS: Highlighter[] = ["sky", "yellow", "mint", "pink", "violet", "orange"];

/** A token chip: leading/inner spaces show as a faint "␣"; `partial` = only some bytes of a character (dashed). */
export const TokChip: FC<{
  text: string;
  x: number;
  y: number;
  fs: number;
  color?: Highlighter | null;
  partial?: boolean;
  w?: number;
  style?: CSSProperties;
}> = ({ text, x, y, fs, color = null, partial = false, w, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w ?? tokenWidth(text, fs),
      height: fs * 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fs,
      fontWeight: 500,
      whiteSpace: "pre",
      boxSizing: "border-box",
      borderRadius: `${fs * 0.2}px ${fs * 0.34}px ${fs * 0.22}px ${fs * 0.3}px`,
      background: partial ? "var(--paper)" : hl(color),
      border: partial ? "3px dashed var(--ink-3)" : undefined,
      color: partial ? "var(--ink-3)" : color ? "var(--chip-ink)" : "var(--ink-2)",
      ...style,
    }}
  >
    {[...text].map((c, i) =>
      c === " " ? (
        <span key={i} style={{ fontSize: fs * 0.7, opacity: 0.55, marginRight: fs * 0.04 }}>
          ␣
        </span>
      ) : (
        <span key={i}>{c}</span>
      ),
    )}
  </div>
);

/** Lay token chips in a centred row (or wrapped rows when `maxW` is exceeded); returns x, y per chip. */
export function tokenRow(texts: string[], fs: number, gap: number, y: number, maxW = 968, lineH = fs * 1.5 + 18) {
  const ws = texts.map((t) => tokenWidth(t, fs));
  const lines: number[][] = [[]];
  let cur = 0;
  ws.forEach((w, i) => {
    if (cur + w > maxW && lines[lines.length - 1].length) {
      lines.push([]);
      cur = 0;
    }
    lines[lines.length - 1].push(i);
    cur += w + gap;
  });
  const out: { x: number; y: number; w: number }[] = [];
  lines.forEach((idx, li) => {
    const total = idx.reduce((a, i) => a + ws[i], 0) + gap * (idx.length - 1);
    let x = 540 - total / 2;
    idx.forEach((i) => {
      out[i] = { x, y: y + li * lineH, w: ws[i] };
      x += ws[i] + gap;
    });
  });
  return out;
}

export type BlueprintPart = { key: string; name: string; does: string; where: string; color: Highlighter };

/** The GPT blueprint from ch05: filled parts in colour, empty ones dashed; `fresh` fills in as p goes 0→1. */
export const Blueprint: FC<{ parts: BlueprintPart[]; filled: string[]; fresh: string; p: number; y0?: number; emptyText: string }> = ({
  parts,
  filled,
  fresh,
  p,
  y0 = 190,
  emptyText,
}) => {
  const Y: Record<string, number> = { tok: 0, emb: 96, pos: 192, att: 320, ffn: 416, out: 544, loop: 640 };
  return (
    <>
      <div style={{ position: "absolute", left: 180, top: y0 + 300, width: 660, height: 212, borderRadius: 22, border: "3px solid var(--line)" }} />
      {parts.map((part) => {
        const inner = part.key === "att" || part.key === "ffn";
        const full = filled.includes(part.key) ? 1 : part.key === fresh ? p : 0;
        const base: CSSProperties = {
          position: "absolute",
          left: inner ? 230 : 200,
          top: y0 + Y[part.key],
          width: inner ? 560 : 620,
          height: 80,
          borderRadius: 16,
          padding: "6px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxSizing: "border-box",
        };
        return (
          <div key={part.key}>
            <div style={{ ...base, background: "var(--paper)", border: "3px dashed var(--ink-3)", color: "var(--ink-3)", opacity: 1 - full }}>
              <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>{part.name}</div>
              <div style={{ fontSize: 28, lineHeight: 1.2 }}>{emptyText}</div>
            </div>
            <div style={{ ...base, background: hl(part.color), color: "var(--chip-ink)", opacity: full, scale: part.key === fresh ? String(mix2(1.08, 1, p)) : undefined }}>
              <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>{part.name}</div>
              <div style={{ fontSize: 28, lineHeight: 1.2 }}>{part.does}</div>
            </div>
            <div style={{ position: "absolute", left: 838, top: y0 + Y[part.key] + 20, fontFamily: "var(--font-hand)", fontSize: 34, color: "var(--ink-2)" }}>{part.where}</div>
          </div>
        );
      })}
    </>
  );
};
const mix2 = (a: number, b: number, t: number) => a + (b - a) * t;
