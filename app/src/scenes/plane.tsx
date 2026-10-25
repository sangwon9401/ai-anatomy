import type { FC, ReactNode } from "react";
import { mix } from "./kit";

/** A coordinate plane drawn on the scene's graph paper: origin in pixels and pixels per unit. */
export type Plane = { ox: number; oy: number; unit: number };

export const at = (pl: Plane, v: readonly [number, number]): [number, number] => [pl.ox + v[0] * pl.unit, pl.oy - v[1] * pl.unit];

const Svg: FC<{ children: ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
    {children}
  </svg>
);

export const Axes: FC<{
  pl: Plane;
  x: [number, number];
  y: [number, number];
  p: number;
  ticks?: number[];
  labelX?: string;
  labelY?: string;
  opacity?: number;
}> = ({ pl, x, y, p, ticks = [], labelX, labelY, opacity = 1 }) => {
  const [x0, y0] = at(pl, [x[0], 0]);
  const [x1] = at(pl, [x[1], 0]);
  const [, yb] = at(pl, [0, y[0]]);
  const [, yt] = at(pl, [0, y[1]]);
  return (
    <div style={{ opacity }}>
      <Svg>
        <line x1={x0} y1={y0} x2={mix(x0, x1, p)} y2={y0} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        <line x1={pl.ox} y1={yb} x2={pl.ox} y2={mix(yb, yt, p)} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
        {p > 0.95 && (
          <>
            <path d={`M ${x1 - 16} ${y0 - 12} L ${x1 + 2} ${y0} L ${x1 - 16} ${y0 + 12}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M ${pl.ox - 12} ${yt + 16} L ${pl.ox} ${yt - 2} L ${pl.ox + 12} ${yt + 16}`} fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {ticks.map((t) => (
          <g key={t} opacity={p}>
            <line x1={pl.ox + t * pl.unit} y1={y0 - 8} x2={pl.ox + t * pl.unit} y2={y0 + 8} stroke="var(--ink)" strokeWidth={3} />
            <line x1={pl.ox - 8} y1={pl.oy - t * pl.unit} x2={pl.ox + 8} y2={pl.oy - t * pl.unit} stroke="var(--ink)" strokeWidth={3} />
          </g>
        ))}
      </Svg>
      {ticks.map((t) => (
        <div key={`l${t}`} style={{ opacity: p }}>
          <div style={{ position: "absolute", left: pl.ox + t * pl.unit - 30, width: 60, top: y0 + 14, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>
            {t}
          </div>
          {t !== 0 && (
            <div style={{ position: "absolute", left: pl.ox - 76, width: 56, top: pl.oy - t * pl.unit - 18, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--ink-2)" }}>
              {t}
            </div>
          )}
        </div>
      ))}
      {labelX && <div style={{ position: "absolute", left: x1 - 180, width: 170, top: y0 + 52, textAlign: "right", fontSize: 34, fontWeight: 700, opacity: p }}>{labelX} →</div>}
      {labelY && <div style={{ position: "absolute", left: pl.ox - 20, top: yt - 70, fontSize: 34, fontWeight: 700, opacity: p }}>↑ {labelY}</div>}
    </div>
  );
};

/** An arrow from the origin to v, drawn on as p goes 0→1. */
export const Vec: FC<{ pl: Plane; v: readonly [number, number]; p: number; color: string; width?: number; from?: readonly [number, number] }> = ({
  pl,
  v,
  p,
  color,
  width = 8,
  from = [0, 0],
}) => {
  if (p <= 0) return null;
  const [ax, ay] = at(pl, from);
  const [bx, by] = at(pl, v);
  const ex = mix(ax, bx, p);
  const ey = mix(ay, by, p);
  const ang = Math.atan2(ey - ay, ex - ax);
  const h = width * 3.2;
  const hx = (a: number) => ex - h * Math.cos(ang + a);
  const hy = (a: number) => ey - h * Math.sin(ang + a);
  return (
    <Svg>
      <line x1={ax} y1={ay} x2={ex - Math.cos(ang) * h * 0.6} y2={ey - Math.sin(ang) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M ${ex} ${ey} L ${hx(0.42)} ${hy(0.42)} L ${hx(-0.42)} ${hy(-0.42)} Z`} fill={color} stroke={color} strokeWidth={3} strokeLinejoin="round" />
    </Svg>
  );
};

export const Pt: FC<{ pl: Plane; v: readonly [number, number]; r?: number; color: string; o?: number }> = ({ pl, v, r = 16, color, o = 1 }) => {
  const [x, y] = at(pl, v);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: color,
        border: "4px solid var(--ink)",
        boxSizing: "border-box",
        opacity: o,
        scale: String(mix(0.4, 1, o)),
      }}
    />
  );
};
