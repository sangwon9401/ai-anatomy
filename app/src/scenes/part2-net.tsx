import type { CSSProperties, FC, ReactNode } from "react";
import { mix } from "./kit";

// Layout of Part 2's small network (3 inputs → 2 hidden → 1 output), shared by 19장 and 23장.
export const IN_BOX = { x: 64, w: 200, h: 112 };
export const IN_Y = [330, 560, 790];
// h1 ("인기", takes all three inputs) sits below h2 ("너무 매움", only 맵기) so the edges cross less
export const HID: [number, number][] = [
  [590, 760],
  [590, 420],
];
export const HR = 78;
export const OUT: [number, number] = [910, 590];
export const OR = 80;

export type Seg = { x1: number; y1: number; x2: number; y2: number };
const toward = (ax: number, ay: number, bx: number, by: number, r: number): [number, number] => {
  const d = Math.hypot(bx - ax, by - ay);
  return [bx - ((bx - ax) / d) * r, by - ((by - ay) / d) * r];
};
/** input i → hidden j */
export const inEdge = (i: number, j: number): Seg => {
  const x1 = IN_BOX.x + IN_BOX.w;
  const y1 = IN_Y[i];
  const [x2, y2] = toward(x1, y1, HID[j][0], HID[j][1], HR);
  return { x1, y1, x2, y2 };
};
/** hidden j → output */
export const outEdge = (j: number): Seg => {
  const [x1, y1] = toward(OUT[0], OUT[1], HID[j][0], HID[j][1], HR);
  const [x2, y2] = toward(HID[j][0], HID[j][1], OUT[0], OUT[1], OR);
  return { x1, y1, x2, y2 };
};
export const on = (s: Seg, t: number): [number, number] => [mix(s.x1, s.x2, t), mix(s.y1, s.y2, t)];
/** where a weight tag sits on an edge: h1's tags close to h1, h2's nearer the inputs */
export const IN_TAG_T = [0.62, 0.4];

export const EdgeLine: FC<{ s: Seg; p?: number; color?: string; w?: number; dash?: string; o?: number }> = ({ s, p = 1, color = "var(--ink)", w = 5, dash, o = 1 }) => (
  <line x1={s.x1} y1={s.y1} x2={mix(s.x1, s.x2, p)} y2={mix(s.y1, s.y2, p)} stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" opacity={p > 0 ? o : 0} />
);

/** a small value tag centred on (x, y) */
export const Tag2: FC<{ x: number; y: number; text: string; o?: number; fs?: number; bg?: string; color?: string; border?: string; style?: CSSProperties }> = ({
  x,
  y,
  text,
  o = 1,
  fs = 30,
  bg = "var(--paper)",
  color = "var(--ink)",
  border = "3px solid var(--ink)",
  style,
}) => {
  const w = [...text].length * 0.6 * fs + fs * 0.8;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - fs * 0.75,
        width: w,
        height: fs * 1.5,
        boxSizing: "border-box",
        display: "grid",
        placeItems: "center",
        borderRadius: 10,
        border,
        background: bg,
        color,
        fontFamily: "var(--font-mono)",
        fontSize: fs,
        fontWeight: 700,
        whiteSpace: "nowrap",
        opacity: o,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const InputBox: FC<{ i: number; name: string; value: ReactNode; o?: number }> = ({ i, name, value, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: IN_BOX.x,
      top: IN_Y[i] - IN_BOX.h / 2,
      width: IN_BOX.w,
      height: IN_BOX.h,
      borderRadius: 18,
      border: "4px solid var(--ink)",
      background: "var(--paper)",
      boxSizing: "border-box",
      padding: "8px 18px",
      opacity: o,
    }}
  >
    <div style={{ fontSize: 32, fontWeight: 700, color: "var(--ink-2)", lineHeight: 1.1 }}>{name}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
  </div>
);

export const Node: FC<{ c: [number, number]; r: number; fill: string; o?: number; children?: ReactNode; label?: string; labelBelow?: boolean; ink?: string }> = ({
  c,
  r,
  fill,
  o = 1,
  children,
  label,
  labelBelow,
  ink = "var(--chip-ink)",
}) => (
  <div style={{ opacity: o }}>
    <div
      style={{
        position: "absolute",
        left: c[0] - r,
        top: c[1] - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: "6px solid var(--ink)",
        boxSizing: "border-box",
        background: fill,
        color: ink,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 50,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
    {label && (
      <div style={{ position: "absolute", left: c[0] - 150, width: 300, top: labelBelow ? c[1] + r + 8 : c[1] - r - 52, textAlign: "center", fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</div>
    )}
  </div>
);

export const Particle: FC<{ x: number; y: number; o?: number; r?: number; color?: string }> = ({ x, y, o = 1, r = 13, color = "var(--hl-yellow)" }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r * 1.9} fill={color} opacity={0.35} />
    <circle cx={x} cy={y} r={r} fill={color} stroke="var(--ink)" strokeWidth={3} />
  </g>
);
