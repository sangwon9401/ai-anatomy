import type { FC, ReactNode } from "react";
import { mix } from "./kit";
import { at, type Plane } from "./plane";

// Shared drawing helpers for Part 2 scenes (16–27).

export const FullSvg: FC<{ children: ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
    {children}
  </svg>
);

/** SVG path through plane points */
export const polyPath = (pl: Plane, pts: readonly (readonly [number, number])[], close = false) =>
  pts.map((v, i) => {
    const [x, y] = at(pl, v);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + (close ? " Z" : "");

/** samples of y = f(x) on [x0, x1] */
export const sample = (f: (x: number) => number, x0: number, x1: number, n = 80): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    return [x, f(x)];
  });

/** Axes with separate tick lists for x and y, drawn on as p goes 0→1. */
export const Axes2: FC<{
  pl: Plane;
  x: [number, number];
  y: [number, number];
  p: number;
  xTicks?: number[];
  yTicks?: number[];
  labelX?: string;
  labelY?: string;
  fs?: number;
}> = ({ pl, x, y, p, xTicks = [], yTicks = [], labelX, labelY, fs = 30 }) => {
  const [x0, y0] = at(pl, [x[0], 0]);
  const [x1] = at(pl, [x[1], 0]);
  const [, yb] = at(pl, [0, y[0]]);
  const [, yt] = at(pl, [0, y[1]]);
  const tickO = p > 0.6 ? 1 : 0;
  return (
    <>
      <FullSvg>
        <line x1={x0} y1={y0} x2={mix(x0, x1, p)} y2={y0} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        <line x1={pl.ox} y1={yb} x2={pl.ox} y2={mix(yb, yt, p)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        {p > 0.95 && (
          <>
            <path d={`M ${x1 - 16} ${y0 - 12} L ${x1 + 2} ${y0} L ${x1 - 16} ${y0 + 12}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M ${pl.ox - 12} ${yt + 16} L ${pl.ox} ${yt - 2} L ${pl.ox + 12} ${yt + 16}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        <g opacity={tickO}>
          {xTicks.map((t) => (
            <line key={`x${t}`} x1={pl.ox + t * pl.unit} y1={pl.oy - 8} x2={pl.ox + t * pl.unit} y2={pl.oy + 8} stroke="var(--ink)" strokeWidth={3} />
          ))}
          {yTicks.map((t) => (
            <line key={`y${t}`} x1={pl.ox - 8} y1={pl.oy - t * pl.unit} x2={pl.ox + 8} y2={pl.oy - t * pl.unit} stroke="var(--ink)" strokeWidth={3} />
          ))}
        </g>
      </FullSvg>
      {xTicks.map((t) => (
        <div key={`lx${t}`} style={{ position: "absolute", left: pl.ox + t * pl.unit - 40, width: 80, top: pl.oy + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: fs, color: "var(--ink-2)", opacity: tickO }}>
          {t < 0 ? `−${-t}` : t}
        </div>
      ))}
      {yTicks.map((t) => (
        <div key={`ly${t}`} style={{ position: "absolute", left: pl.ox - 86, width: 66, top: pl.oy - t * pl.unit - fs * 0.62, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: fs, color: "var(--ink-2)", opacity: tickO }}>
          {t < 0 ? `−${-t}` : t}
        </div>
      ))}
      {labelX && (
        <div style={{ position: "absolute", left: x1 - 300, width: 290, top: y0 + 52, textAlign: "right", fontSize: 34, fontWeight: 700, opacity: tickO }}>
          {labelX} →
        </div>
      )}
      {labelY && (
        <div style={{ position: "absolute", left: pl.ox - 20, top: yt - 64, fontSize: 34, fontWeight: 700, opacity: tickO, whiteSpace: "nowrap" }}>
          ↑ {labelY}
        </div>
      )}
    </>
  );
};

/** 맛집 = filled circle, 별로 = cross. Drawn in SVG user space (use inside <FullSvg>). */
export const ClassMark: FC<{ x: number; y: number; good: boolean; o?: number; r?: number }> = ({ x, y, good, o = 1, r = 22 }) => {
  if (o <= 0) return null;
  const s = mix(0.4, 1, o);
  if (good) return <circle cx={x} cy={y} r={r * s} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={4} opacity={o} />;
  const d = r * 0.8 * s;
  return (
    <g opacity={o}>
      <path d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`} stroke="var(--ink)" strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`} stroke="var(--hl-pink)" strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

/** a straight arrow in SVG user space, drawn on as p goes 0→1 */
export const ArrowLine: FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; w?: number; head?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  p = 1,
  color = "var(--ink)",
  w = 6,
  head = 18,
}) => {
  if (p <= 0) return null;
  const ex = mix(x1, x2, p);
  const ey = mix(y1, y2, p);
  const ang = Math.atan2(ey - y1, ex - x1);
  const hx = (a: number) => ex - head * Math.cos(ang + a);
  const hy = (a: number) => ey - head * Math.sin(ang + a);
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${hx(0.5)} ${hy(0.5)} L ${ex} ${ey} L ${hx(-0.5)} ${hy(-0.5)}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** big rounded label with a highlighter background, centred on x */
export const Banner: FC<{ text: string; y: number; color?: string; fs?: number; o?: number; x?: number }> = ({ text, y, color = "var(--hl-yellow)", fs = 50, o = 1, x }) => (
  <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: x === undefined ? "center" : "left", opacity: o }}>
    <span style={{ fontSize: fs, fontWeight: 700, background: color, color: "var(--chip-ink)", borderRadius: 14, padding: "4px 24px", whiteSpace: "nowrap" }}>{text}</span>
  </div>
);
