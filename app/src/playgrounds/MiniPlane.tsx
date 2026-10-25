import type { ReactNode } from "react";

// A small 0–10 coordinate plane for the playgrounds (SVG user units: origin at 36,264, 22.8 per unit).
export const PX = (x: number) => 36 + x * 22.8;
export const PY = (y: number) => 264 - y * 22.8;
export const UNIT = 22.8;

export function MiniPlane({
  children,
  onPick,
  label,
  xLabel = "매운맛",
  yLabel = "단맛",
  range = [0, 10],
}: {
  children: ReactNode;
  onPick?: (v: [number, number]) => void;
  label: string;
  xLabel?: string;
  yLabel?: string;
  range?: [number, number];
}) {
  const [lo, hi] = range;
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  return (
    <svg
      viewBox="0 0 300 300"
      style={{ width: "100%", maxWidth: 340, display: "block", touchAction: "manipulation", cursor: onPick ? "crosshair" : undefined }}
      role="img"
      aria-label={label}
      onClick={(e) => {
        if (!onPick) return;
        const r = e.currentTarget.getBoundingClientRect();
        const sx = ((e.clientX - r.left) / r.width) * 300;
        const sy = ((e.clientY - r.top) / r.height) * 300;
        const x = Math.min(hi, Math.max(lo, (sx - 36) / UNIT));
        const y = Math.min(hi, Math.max(lo, (264 - sy) / UNIT));
        onPick([Math.round(x * 2) / 2, Math.round(y * 2) / 2]);
      }}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PX(t)} y1={PY(lo)} x2={PX(t)} y2={PY(hi)} stroke="var(--grid-minor)" strokeWidth={1} />
          <line x1={PX(lo)} y1={PY(t)} x2={PX(hi)} y2={PY(t)} stroke="var(--grid-minor)" strokeWidth={1} />
        </g>
      ))}
      <line x1={PX(lo)} y1={PY(0)} x2={PX(hi) + 6} y2={PY(0)} stroke="var(--ink)" strokeWidth={2} />
      <line x1={PX(0)} y1={PY(lo)} x2={PX(0)} y2={PY(hi) - 6} stroke="var(--ink)" strokeWidth={2} />
      <text x={PX(hi)} y={PY(0) + 22} textAnchor="end" fontSize={12} fill="var(--ink-2)">
        {xLabel} →
      </text>
      <text x={PX(0) + 6} y={PY(hi) - 4} fontSize={12} fill="var(--ink-2)">
        ↑ {yLabel}
      </text>
      {children}
    </svg>
  );
}

export function Arrow({ from = [0, 0], to, color, width = 4 }: { from?: [number, number]; to: [number, number]; color: string; width?: number }) {
  const x1 = PX(from[0]);
  const y1 = PY(from[1]);
  const x2 = PX(to[0]);
  const y2 = PY(to[1]);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * h * 0.6} y2={y2 - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path
        d={`M ${x2} ${y2} L ${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)} L ${x2 - h * Math.cos(a + 0.45)} ${y2 - h * Math.sin(a + 0.45)} Z`}
        fill={color}
      />
    </g>
  );
}
