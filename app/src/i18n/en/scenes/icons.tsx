// en: the ch45 word is "trunk", so the three meaning glyphs are an elephant, a car with its trunk open, and a tree.
// Same exports and 100×100 boxes as src/scenes/icons.tsx.
import type { FC } from "react";

type IconProps = { size: number; x?: number; y?: number; opacity?: number };

/** an elephant's trunk */
const ElephantGlyph: FC = () => (
  <>
    {/* legs */}
    {[40, 54, 68, 80].map((x) => (
      <rect key={x} x={x - 5} y={62} width={11} height={28} rx={4} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={3.5} />
    ))}
    {/* tail */}
    <path d="M88 48 C 94 52, 95 58, 92 64" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    {/* body */}
    <ellipse cx={60} cy={52} rx={30} ry={21} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} />
    {/* trunk: an ink outline under a coloured core */}
    <path d="M20 46 C 10 56, 8 72, 14 82 C 17 87, 23 86, 22 80" stroke="var(--ink)" strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d="M20 46 C 10 56, 8 72, 14 82 C 17 87, 23 86, 22 80" stroke="var(--hl-yellow)" strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* head and ear */}
    <circle cx={28} cy={38} r={16} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} />
    <ellipse cx={42} cy={38} rx={10} ry={14} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3.5} />
    <circle cx={24} cy={34} r={2.6} fill="var(--ink)" />
  </>
);

/** a car's trunk (open at the back) */
const CarGlyph: FC = () => (
  <>
    {/* raised trunk lid */}
    <path d="M78 42 L 84 20 L 91 22 L 87 44 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    {/* body */}
    <path
      d="M8 66 L 8 52 C 8 46, 12 43, 20 42 L 30 41 L 40 28 L 66 28 L 76 41 L 88 43 C 93 44, 94 48, 94 54 L 94 66 Z"
      fill="var(--hl-sky)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    {/* windows */}
    <path d="M36 41 L 43 32 L 52 32 L 52 41 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
    <path d="M57 41 L 57 32 L 64 32 L 71 41 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
    {/* wheels */}
    {[26, 76].map((x) => (
      <g key={x}>
        <circle cx={x} cy={67} r={10} fill="var(--ink)" />
        <circle cx={x} cy={67} r={4} fill="var(--paper)" />
      </g>
    ))}
    <path d="M4 82 L 96 82" stroke="var(--ink-3)" strokeWidth={3} strokeLinecap="round" />
  </>
);

/** a tree trunk */
const TreeGlyph: FC = () => (
  <>
    <path d="M42 92 C 45 80, 45 66, 44 54 L 56 54 C 55 66, 55 80, 58 92 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
    <path
      d="M28 58 C 12 58, 10 36, 26 34 C 26 14, 50 8, 58 20 C 72 12, 90 24, 80 40 C 94 46, 86 62, 72 58 Z"
      fill="var(--hl-mint)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M24 92 L 76 92" stroke="var(--ink-3)" strokeWidth={3.5} strokeLinecap="round" />
  </>
);

/** Glyphs drawn in a 100×100 box; nest them in any <svg viewBox="0 0 100 100">. */
export const MEANING_GLYPHS = [ElephantGlyph, CarGlyph, TreeGlyph];

export const MEANING_ICONS: FC<IconProps>[] = MEANING_GLYPHS.map((Glyph) => {
  const Icon: FC<IconProps> = ({ size, x, y, opacity = 1 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={x === undefined ? undefined : { position: "absolute", left: x, top: y, overflow: "visible" }}
      opacity={opacity}
      aria-hidden="true"
    >
      <Glyph />
    </svg>
  );
  return Icon;
});
