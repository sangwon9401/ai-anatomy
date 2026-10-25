// zh overlay of src/scenes/icons.tsx: the Korean word '배' (pear / boat / belly) becomes '包', whose three senses are
// 包子 (a steamed bun you eat), a bag you carry, and a bump on the skin (a mosquito bite). Same exports, same 100×100 box,
// same order as MEANING_NAMES in the zh data/ch45.ts.
import type { FC } from "react";

type IconProps = { size: number; x?: number; y?: number; opacity?: number };

/** 吃的包: a steamed bun with pleats, on a plate, with steam */
const BunGlyph: FC = () => (
  <>
    <path d="M36 16 C 32 10, 40 7, 36 1" stroke="var(--ink-3)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M54 14 C 50 8, 58 5, 54 -1" stroke="var(--ink-3)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <ellipse cx={50} cy={84} rx={44} ry={9} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={3.5} />
    <path
      d="M14 76 C 12 52, 32 28, 50 26 C 68 28, 88 52, 86 76 C 70 82, 30 82, 14 76 Z"
      fill="var(--hl-yellow)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M50 30 C 42 40, 32 52, 26 66" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M50 30 C 46 44, 42 56, 40 70" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M50 30 C 54 44, 58 56, 60 70" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M50 30 C 58 40, 68 52, 74 66" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <circle cx={50} cy={28} r={4.5} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={3} />
  </>
);

/** 背的包: a backpack with a handle, flap and pocket */
const BagGlyph: FC = () => (
  <>
    <path d="M38 24 C 38 8, 62 8, 62 24" stroke="var(--ink)" strokeWidth={4.5} fill="none" strokeLinecap="round" />
    <rect x={20} y={22} width={60} height={70} rx={14} fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={4} />
    <path d="M20 44 C 34 56, 66 56, 80 44" stroke="var(--ink)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <circle cx={50} cy={52} r={3.5} fill="var(--ink)" />
    <rect x={32} y={62} width={36} height={22} rx={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3.5} />
    <path d="M38 70 L 62 70" stroke="var(--ink-3)" strokeWidth={3} strokeLinecap="round" />
  </>
);

/** 身上的包: an arm with a red bump from a mosquito bite, and the mosquito */
const BumpGlyph: FC = () => (
  <>
    <path
      d="M2 72 C 26 64, 74 62, 98 66 L 98 94 C 74 90, 26 92, 2 98 Z"
      fill="var(--hl-pink)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M30 68 C 30 36, 70 36, 70 66" fill="var(--hl-pink)" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
    <circle cx={50} cy={50} r={4.5} fill="var(--pen)" />
    <path d="M36 34 L 28 25" stroke="var(--pen)" strokeWidth={3.5} strokeLinecap="round" />
    <path d="M64 34 L 72 25" stroke="var(--pen)" strokeWidth={3.5} strokeLinecap="round" />
    <path d="M50 30 L 50 19" stroke="var(--pen)" strokeWidth={3.5} strokeLinecap="round" />
    {/* the mosquito, flying off to the upper right */}
    <ellipse cx={84} cy={16} rx={11} ry={5} fill="var(--ink)" transform="rotate(-25 84 16)" />
    <ellipse cx={80} cy={6} rx={8} ry={4.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} transform="rotate(-50 80 6)" />
    <ellipse cx={91} cy={5} rx={8} ry={4.5} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2.5} transform="rotate(30 91 5)" />
    <path d="M75 21 L 67 27" stroke="var(--ink)" strokeWidth={2.5} strokeLinecap="round" />
    <path d="M82 21 L 80 30 M 89 19 L 91 28" stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
  </>
);

/** Glyphs drawn in a 100×100 box; nest them in any <svg viewBox="0 0 100 100">. */
export const MEANING_GLYPHS = [BunGlyph, BagGlyph, BumpGlyph];

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
