// en overlay of src/scenes/part7-kit.tsx: everything comes from the original, except HBar, which leaves a 14 px gap
// between the word and its bar (English words such as "school" fill the whole word column).
import type { FC } from "react";

export * from "../../../scenes/part7-kit";

const GAP = 14;

/** A horizontal probability bar with its word on the left and an optional value after it. */
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
    <div style={{ position: "absolute", left: x + wordW + GAP, top: y + fs * 0.1, width: Math.max(0, p * scale), height: fs, borderRadius: fs * 0.3, background: color }} />
    {value !== undefined && (
      <div style={{ position: "absolute", left: x + wordW + GAP + p * scale + 16, top: y, fontFamily: "var(--font-mono)", fontSize: fs * 0.9, lineHeight: 1.3, whiteSpace: "nowrap" }}>{value}</div>
    )}
  </div>
);
