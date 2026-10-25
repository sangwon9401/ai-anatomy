// Shared drawing pieces for the Part 5 scenes (attention). Frame-driven, tokens only.
import type { CSSProperties, FC, ReactNode } from "react";
import { PAINT } from "../data/part5-toy";
import type { Highlighter } from "../data/types";
import { Chip, chipWidth, hl } from "./kit";

export const MONO: CSSProperties = { fontFamily: "var(--font-mono)" };

/** A word chip: outlined, or highlighted (the focus word gets a red-pen outline like ch45's '배'). */
export const Word: FC<{ text: string; x: number; y: number; fs?: number; color?: Highlighter | null; focus?: boolean; o?: number; w?: number; style?: CSSProperties }> = ({
  text,
  x,
  y,
  fs = 52,
  color = null,
  focus = false,
  o = 1,
  w,
  style,
}) => (
  <Chip
    text={text}
    color={color}
    fs={fs}
    x={x}
    y={y}
    w={w}
    style={{
      opacity: o,
      ...(color ? {} : { background: "var(--paper)", border: "2.5px solid var(--ink)", color: "var(--ink)" }),
      ...(focus ? { outline: "5px solid var(--pen)", outlineOffset: 4 } : {}),
      ...style,
    }}
  />
);

export const wordW = (text: string, fs = 52) => chipWidth(text, fs);

/** Q / K / V colours, as introduced in ch45's last step */
export const QKV_COLOR: Record<"q" | "k" | "v", Highlighter> = { q: "yellow", k: "mint", v: "sky" };

/** A small index card: a coloured letter tab and a vector written in mono. */
export const Card: FC<{
  kind: "q" | "k" | "v";
  x: number;
  y: number;
  text: string;
  fs?: number;
  w?: number;
  o?: number;
  letter?: string;
  /** font size of the text part (defaults to fs) */
  tfs?: number;
  /** Korean text: use the sans font instead of mono */
  sans?: boolean;
  style?: CSSProperties;
}> = ({ kind, x, y, text, fs = 34, w, o = 1, letter, tfs, sans, style }) => {
  const h = fs * 1.7;
  const tab = fs * 1.35;
  const width = w ?? tab + text.length * fs * 0.62 + fs * 0.9;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: h,
        display: "flex",
        alignItems: "stretch",
        borderRadius: 12,
        border: "3px solid var(--ink)",
        background: "var(--paper)",
        overflow: "hidden",
        opacity: o,
        ...style,
      }}
    >
      <div style={{ width: tab, display: "flex", alignItems: "center", justifyContent: "center", background: hl(QKV_COLOR[kind]), color: "var(--chip-ink)", fontSize: fs * 0.95, fontWeight: 700 }}>
        {letter ?? kind.toUpperCase()}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ...(sans ? { fontWeight: 500 } : MONO), fontSize: tfs ?? fs, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/**
 * A grid of numbers. `cell(i, j)` returns the text; `fill` / `show` / `ink` style each cell.
 * Optional row / column headers sit outside the grid; `brackets` draws matrix brackets around it.
 */
export const Grid: FC<{
  x: number;
  y: number;
  rows: number;
  cols: number;
  cw: number;
  ch: number;
  fs?: number;
  gap?: number;
  cell: (i: number, j: number) => ReactNode;
  fill?: (i: number, j: number) => string | undefined;
  show?: (i: number, j: number) => number;
  ink?: (i: number, j: number) => string | undefined;
  rowHead?: (i: number) => ReactNode;
  colHead?: (j: number) => ReactNode;
  headW?: number;
  headH?: number;
  headFs?: number;
  brackets?: boolean;
  frame?: boolean;
  o?: number;
}> = ({ x, y, rows, cols, cw, ch, fs = 34, gap = 6, cell, fill, show, ink, rowHead, colHead, headW = 150, headH = 60, headFs = 32, brackets, frame, o = 1 }) => {
  const W = cols * cw + (cols - 1) * gap;
  const H = rows * ch + (rows - 1) * gap;
  const cells: ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const op = show ? show(i, j) : 1;
      cells.push(
        <div
          key={`${i}-${j}`}
          style={{
            position: "absolute",
            left: x + j * (cw + gap),
            top: y + i * (ch + gap),
            width: cw,
            height: ch,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: fill?.(i, j) ?? (frame ? "var(--paper-2)" : undefined),
            color: ink?.(i, j) ?? "var(--ink)",
            ...MONO,
            fontSize: fs,
            opacity: op,
            whiteSpace: "nowrap",
          }}
        >
          {cell(i, j)}
        </div>,
      );
    }
  }
  const b = 5;
  return (
    <div style={{ opacity: o }}>
      {brackets && (
        <>
          <div style={{ position: "absolute", left: x - 14, top: y - 8, width: 14, height: H + 16, borderLeft: `${b}px solid var(--ink)`, borderTop: `${b}px solid var(--ink)`, borderBottom: `${b}px solid var(--ink)`, boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: x + W, top: y - 8, width: 14, height: H + 16, borderRight: `${b}px solid var(--ink)`, borderTop: `${b}px solid var(--ink)`, borderBottom: `${b}px solid var(--ink)`, boxSizing: "border-box" }} />
        </>
      )}
      {cells}
      {rowHead &&
        Array.from({ length: rows }, (_, i) => (
          <div
            key={`r${i}`}
            style={{ position: "absolute", left: x - headW - (brackets ? 22 : 10), width: headW, top: y + i * (ch + gap), height: ch, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: headFs, fontWeight: 500, whiteSpace: "nowrap" }}
          >
            {rowHead(i)}
          </div>
        ))}
      {colHead &&
        Array.from({ length: cols }, (_, j) => (
          <div
            key={`c${j}`}
            style={{ position: "absolute", left: x + j * (cw + gap) - 20, width: cw + 40, top: y - headH - (brackets ? 14 : 6), height: headH, display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: headFs, fontWeight: 500, whiteSpace: "nowrap" }}
          >
            {colHead(j)}
          </div>
        ))}
    </div>
  );
};

export const gridW = (cols: number, cw: number, gap = 6) => cols * cw + (cols - 1) * gap;
export const gridH = (rows: number, ch: number, gap = 6) => rows * ch + (rows - 1) * gap;

/** A highlighter swatch behind inline numbers. */
export const Mark: FC<{ c: Highlighter; children: ReactNode }> = ({ c, children }) => (
  <span style={{ background: hl(c), color: "var(--chip-ink)", borderRadius: 8, padding: "0 6px" }}>{children}</span>
);

/** The small grey "설명용 예시" tag used on illustrative numbers. */
export const Example: FC<{ x: number; y: number; text: string; o?: number; align?: "left" | "right" }> = ({ x, y, text, o = 1, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      ...(align === "left" ? { left: x } : { right: 1080 - x }),
      fontSize: 28,
      color: "var(--ink-3)",
      border: "2px dashed var(--ink-3)",
      borderRadius: 10,
      padding: "2px 12px",
      opacity: o,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** A line of text centred on the canvas. */
export const Center: FC<{ y: number; fs?: number; o?: number; weight?: number; color?: string; children: ReactNode; style?: CSSProperties }> = ({
  y,
  fs = 48,
  o = 1,
  weight = 700,
  color,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: 56, right: 56, top: y, textAlign: "center", fontSize: fs, fontWeight: weight, color, opacity: o, wordBreak: "keep-all", ...style }}>{children}</div>
);

/** a 100% bar split by word colour */
export const PctStack: FC<{ y: number; ps: number[]; grow: number; labels: string[]; o?: number; x0?: number; W?: number; colors?: Highlighter[] }> = ({ y, ps, grow, labels, o = 1, x0 = 120, W = 840, colors = PAINT }) => {
  let acc = 0;
  return (
    <div style={{ opacity: o }}>
      {ps.map((p, i) => {
        const left = x0 + acc * W;
        acc += p / 100;
        const w = (p / 100) * W * grow;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left,
                top: y,
                width: w,
                height: 76,
                background: `var(--hl-${colors[i]})`,
                borderRadius: i === 0 ? "12px 0 0 12px" : i === ps.length - 1 ? "0 12px 12px 0" : 0,
              }}
            />
            {p >= 8 && (
              <div style={{ position: "absolute", left, width: (p / 100) * W, top: y + 14, textAlign: "center", fontSize: 34, fontWeight: 700, color: "var(--chip-ink)", opacity: grow }}>
                {labels[i]}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x0 - 4, top: y - 4, width: W + 8, height: 84, borderRadius: 14, border: "3px solid var(--ink)", boxSizing: "border-box" }} />
    </div>
  );
};

/** Heat-map tint for a 0–1 level: highlighter yellow over paper-2, plus a text colour that stays readable in dark mode. */
export const heat = (level: number) => `color-mix(in srgb, var(--hl-yellow) ${Math.round(Math.max(0, Math.min(1, level)) * 85)}%, var(--paper-2))`;
export const heatInk = (level: number) => (level >= 0.45 ? "var(--chip-ink)" : "var(--ink)");
