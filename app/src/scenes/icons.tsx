import type { FC } from "react";

type IconProps = { size: number; x?: number; y?: number; opacity?: number };

/** 과일 배 */
const PearGlyph: FC = () => (
  <>
    <path d="M50 14 C 52 10, 55 8, 58 7" stroke="var(--ink)" strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M56 12 C 66 6, 76 10, 78 16 C 70 20, 61 18, 56 12 Z" fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={3} />
    <path
      d="M50 16 C 40 16, 36 28, 38 40 C 24 48, 20 72, 34 86 C 42 93, 58 93, 66 86 C 80 72, 76 48, 62 40 C 64 28, 60 16, 50 16 Z"
      fill="var(--hl-yellow)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </>
);

/** 타는 배 */
const BoatGlyph: FC = () => (
  <>
    <path d="M52 12 L52 64" stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
    <path d="M56 16 L82 60 L56 60 Z" fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M48 26 L48 60 L26 60 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M14 66 L88 66 L76 82 L26 82 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
    <path d="M10 92 C 20 86, 30 98, 40 92 C 50 86, 60 98, 70 92 C 80 86, 88 96, 94 92" stroke="var(--ink-3)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </>
);

/** 몸의 배 */
const BellyGlyph: FC = () => (
  <>
    <circle cx={50} cy={16} r={11} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
    <path
      d="M34 32 C 40 29, 60 29, 66 32 L 68 50 C 82 58, 82 82, 64 90 L 36 90 C 18 82, 18 58, 32 50 Z"
      fill="var(--hl-pink)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M40 66 C 44 72, 56 72, 60 66" stroke="var(--ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
    <circle cx={50} cy={76} r={2.6} fill="var(--ink)" />
  </>
);

/** Glyphs drawn in a 100×100 box; nest them in any <svg viewBox="0 0 100 100">. */
export const MEANING_GLYPHS = [PearGlyph, BoatGlyph, BellyGlyph];

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
