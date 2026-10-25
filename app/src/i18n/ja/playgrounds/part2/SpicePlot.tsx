import type { ReactNode } from "react";

// A small (맵기, 줄) plane for Part 2 playgrounds: 맵기 0–5.6 across, 줄 0–4.6 up, in a 300×250 viewBox.
export const SX = (m: number) => 30 + m * 46;
export const SY = (l: number) => 222 - l * 44;
export const S_MAX = { m: 5.6, l: 4.6 };

export function Mark({ x, y, good, r = 7 }: { x: number; y: number; good: boolean; r?: number }) {
  if (good) return <circle cx={x} cy={y} r={r} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={1.5} />;
  const d = r * 0.8;
  return (
    <g>
      <path d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`} stroke="var(--ink)" strokeWidth={5} strokeLinecap="round" />
      <path d={`M ${x - d} ${y - d} L ${x + d} ${y + d} M ${x + d} ${y - d} L ${x - d} ${y + d}`} stroke="var(--hl-pink)" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

export function SpicePlot({ label, children, after }: { label: string; children?: ReactNode; after?: ReactNode }) {
  return (
    <svg viewBox="0 0 300 250" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((m) => (
        <line key={`m${m}`} x1={SX(m)} y1={SY(0)} x2={SX(m)} y2={SY(S_MAX.l)} stroke="var(--grid-minor)" />
      ))}
      {[1, 2, 3, 4].map((l) => (
        <line key={`l${l}`} x1={SX(0)} y1={SY(l)} x2={SX(S_MAX.m)} y2={SY(l)} stroke="var(--grid-minor)" />
      ))}
      {children}
      <line x1={SX(0)} y1={SY(0)} x2={SX(S_MAX.m)} y2={SY(0)} stroke="var(--ink)" strokeWidth={1.5} />
      <line x1={SX(0)} y1={SY(0)} x2={SX(0)} y2={SY(S_MAX.l)} stroke="var(--ink)" strokeWidth={1.5} />
      {[1, 2, 3, 4, 5].map((m) => (
        <text key={`tm${m}`} x={SX(m)} y={SY(0) + 13} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
          {m}
        </text>
      ))}
      {[1, 2, 3, 4].map((l) => (
        <text key={`tl${l}`} x={SX(0) - 6} y={SY(l) + 3.5} textAnchor="end" fontSize={10} fill="var(--ink-3)">
          {l}
        </text>
      ))}
      <text x={SX(S_MAX.m)} y={SY(0) + 25} textAnchor="end" fontSize={11} fill="var(--ink-2)">
        辛さ →
      </text>
      <text x={SX(0) + 5} y={SY(S_MAX.l) + 4} fontSize={11} fill="var(--ink-2)">
        ↑ 待ち
      </text>
      {after}
    </svg>
  );
}
