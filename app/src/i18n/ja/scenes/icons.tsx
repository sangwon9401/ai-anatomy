// ja overlay of src/scenes/icons.tsx: chapter 45's word is 「かみ」, so the three meaning icons are
// 紙 (a sheet of paper), 神 (a shrine gate, torii) and 髪 (a head of hair), in the data's meaning order.
import type { FC } from "react";

type IconProps = { size: number; x?: number; y?: number; opacity?: number };

/** 紙: a ruled sheet with a folded corner */
const PaperGlyph: FC = () => (
  <>
    <path d="M24 10 L62 10 L80 28 L80 90 L24 90 Z" fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
    <path d="M62 10 L62 28 L80 28" fill="var(--paper)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M35 44 L69 44 M35 58 L69 58 M35 72 L58 72" stroke="var(--ink-2)" strokeWidth={3.5} strokeLinecap="round" />
  </>
);

/** 神: a torii, the gate of a shrine */
const ToriiGlyph: FC = () => (
  <>
    <path d="M27 34 L23 90 L34 90 L36 34 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M73 34 L77 90 L66 90 L64 34 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={16} y={46} width={68} height={9} rx={2} fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3.5} />
    <rect x={46} y={33} width={8} height={13} fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3} />
    <path d="M6 20 C 30 27, 70 27, 94 20 L 91 32 C 70 37, 30 37, 9 32 Z" fill="var(--hl-orange)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M8 95 L92 95" stroke="var(--hl-sky)" strokeWidth={5} strokeLinecap="round" />
  </>
);

/** 髪: a face framed by long hair */
const HairGlyph: FC = () => (
  <>
    <path
      d="M20 48 C 16 22, 36 8, 50 8 C 64 8, 84 22, 80 48 L 84 90 C 70 95, 30 95, 16 90 Z"
      fill="var(--hl-pink)"
      stroke="var(--ink)"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M32 44 C 32 36, 68 36, 68 44 L 68 60 C 68 76, 32 76, 32 60 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M29 46 C 34 26, 66 22, 71 46 C 62 38, 48 36, 29 46 Z" fill="var(--hl-pink)" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" />
    <circle cx={43} cy={56} r={2.6} fill="var(--ink)" />
    <circle cx={57} cy={56} r={2.6} fill="var(--ink)" />
    <path d="M45 66 C 48 69, 52 69, 55 66" stroke="var(--ink)" strokeWidth={2.6} fill="none" strokeLinecap="round" />
  </>
);

/** Glyphs drawn in a 100×100 box; nest them in any <svg viewBox="0 0 100 100">. */
export const MEANING_GLYPHS = [PaperGlyph, ToriiGlyph, HairGlyph];

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
