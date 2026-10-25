import type { CSSProperties, FC, ReactNode } from "react";
import { AbsoluteFill, Easing, Html5Audio, Sequence, interpolate, useCurrentFrame } from "remotion";
import NARRATION from "../data/narration.json";
import type { ChapterSpec, Highlighter } from "../data/types";

export const FPS = 30;
export const W = 1080;
export const H = 1350;

/** `audio` maps "ch01-s1" → a playable URL; without it the scene is silent. */
export type SceneProps = { captions: boolean; audio?: Record<string, string> };

export type TimedStep = ChapterSpec["steps"][number] & { index: number; from: number; to: number; dur: number };

// voice-over starts a beat after the step does and gets a short pause after it
const AUDIO_LEAD = 0.25;
const AUDIO_TAIL = 0.6;
const voiceSec = (chapter: number, step: string) => (NARRATION as Record<string, Record<string, number>>)[chapter]?.[step];

export const audioKey = (chapter: number, step: string) => `ch${String(chapter).padStart(2, "0")}-${step}`;

/** Step timings for a chapter; a step stretches when its narration clip is longer than planned. */
export function buildTimeline(spec: ChapterSpec): TimedStep[] {
  let f = 0;
  return spec.steps.map((s, index) => {
    const voice = voiceSec(spec.id, s.id);
    const sec = voice === undefined ? s.sec : Math.max(s.sec, AUDIO_LEAD + voice + AUDIO_TAIL);
    const dur = Math.round(sec * FPS);
    const from = f;
    f += dur;
    return { ...s, index, from, dur, to: from + dur };
  });
}

export const totalFrames = (spec: ChapterSpec) => {
  const tl = buildTimeline(spec);
  return tl[tl.length - 1].to;
};

export const Narration: FC<{ tl: TimedStep[]; chapter: number; audio?: Record<string, string> }> = ({ tl, chapter, audio }) => {
  if (!audio) return null;
  return (
    <>
      {tl.map((s) => {
        const src = audio[audioKey(chapter, s.id)];
        if (!src) return null;
        const lead = Math.round(AUDIO_LEAD * FPS);
        return (
          <Sequence key={s.id} from={s.from + lead} durationInFrames={s.dur - lead} layout="none">
            <Html5Audio src={src} />
          </Sequence>
        );
      })}
    </>
  );
};

export const byId = (tl: TimedStep[]) => Object.fromEntries(tl.map((s) => [s.id, s])) as Record<string, TimedStep>;

export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 progress of a beat that starts `start` seconds into a step and lasts `dur` seconds. */
export function beat(frame: number, step: TimedStep, start: number, dur = 0.6, easing = EASE) {
  const a = step.from + start * FPS;
  return interpolate(frame, [a, a + Math.max(1, dur * FPS)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rough advance widths for the scene fonts (IBM Plex Sans KR/JP, Noto Sans SC), good enough to lay chips out without measuring. */
export function textWidth(text: string, fs: number) {
  let w = 0;
  for (const ch of text) {
    if (/[가-힣]/.test(ch)) w += fs * 0.94;
    // kana, CJK ideographs and full-width punctuation are a full em
    else if (/[\u3000-\u30ff\u3400-\u9fff\uf900-\ufaff\uff01-\uff60]/.test(ch)) w += fs;
    else if (/[0-9A-Za-z]/.test(ch)) w += fs * 0.58;
    else if (ch === " ") w += fs * 0.28;
    else w += fs * 0.36;
  }
  return w;
}

export const chipWidth = (text: string, fs: number) => textWidth(text, fs) + fs * 0.9;

/** Lay boxes of the given widths in a centred row; returns the left x of each. */
export function rowLayout(widths: number[], gap: number, cx = W / 2) {
  const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  let x = cx - total / 2;
  return widths.map((w) => {
    const left = x;
    x += w + gap;
    return left;
  });
}

/** Lay boxes left-to-right, wrapping at maxW; positions of a prefix never change when more boxes are added. */
export function wrapLayout(widths: number[], { x0 = 64, y0 = 0, maxW = 952, gap = 14, lineH = 84 } = {}) {
  let x = x0;
  let y = y0;
  return widths.map((w) => {
    if (x + w > x0 + maxW && x > x0) {
      x = x0;
      y += lineH;
    }
    const at = { x, y };
    x += w + gap;
    return at;
  });
}

export const hl = (c: Highlighter | null) => (c ? `var(--hl-${c})` : "var(--paper-2)");

export const Paper: FC<{ children: ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: "var(--paper)",
      backgroundImage:
        "linear-gradient(var(--grid-major) 2px, transparent 2px), linear-gradient(90deg, var(--grid-major) 2px, transparent 2px), linear-gradient(var(--grid-minor) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--grid-minor) 1.5px, transparent 1.5px)",
      backgroundSize: "180px 180px, 180px 180px, 36px 36px, 36px 36px",
      backgroundPosition: "-1px -1px",
      color: "var(--ink)",
      fontFamily: "var(--font-sans)",
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Chip: FC<{
  text: string;
  color: Highlighter | null;
  fs: number;
  x: number;
  y: number;
  w?: number;
  style?: CSSProperties;
}> = ({ text, color, fs, x, y, w, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w ?? chipWidth(text, fs),
      height: fs * 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fs,
      fontWeight: 500,
      color: color ? "var(--chip-ink)" : "var(--ink-2)",
      background: hl(color),
      borderRadius: `${fs * 0.2}px ${fs * 0.34}px ${fs * 0.22}px ${fs * 0.3}px`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

export const Hand: FC<{
  x: number;
  y: number;
  fs?: number;
  color?: string;
  style?: CSSProperties;
  children: ReactNode;
}> = ({ x, y, fs = 44, color = "var(--pen)", style, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: "var(--font-hand)",
      fontWeight: 400,
      fontSize: fs,
      lineHeight: 1.15,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A hand-drawn loop around a box, drawn on as `p` goes 0→1. */
export const PenCircle: FC<{ x: number; y: number; w: number; h: number; p: number; stroke?: number }> = ({
  x,
  y,
  w,
  h,
  p,
  stroke = 6,
}) => {
  const d = `M ${w * 0.1} ${h * 0.28} C ${w * 0.22} ${-h * 0.08}, ${w * 0.86} ${-h * 0.1}, ${w * 0.98} ${h * 0.4} C ${w * 1.06} ${h * 0.86}, ${w * 0.3} ${h * 1.12}, ${w * 0.05} ${h * 0.66} C ${-w * 0.04} ${h * 0.4}, ${w * 0.2} ${h * 0.04}, ${w * 0.58} ${h * 0.02}`;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        fill="none"
        stroke="var(--pen)"
        strokeWidth={stroke}
        strokeLinecap="round"
        opacity={p > 0 ? 1 : 0}
      />
    </svg>
  );
};

export const PenUnderline: FC<{ x: number; y: number; w: number; p: number }> = ({ x, y, w, p }) => (
  <svg width={w} height={24} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    <path
      d={`M 0 12 C ${w * 0.3} 4, ${w * 0.6} 18, ${w} 8`}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      fill="none"
      stroke="var(--pen)"
      strokeWidth={6}
      strokeLinecap="round"
      opacity={p > 0 ? 1 : 0}
    />
  </svg>
);

/** Hand-drawn ellipse around inline text, wiped in left→right as `p` goes 0→1. */
export const InlineCircle: FC<{ p: number; children: ReactNode; pad?: number }> = ({ p, children, pad = 14 }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span
      style={{
        position: "absolute",
        left: -pad,
        right: -pad,
        top: -pad * 0.7,
        bottom: -pad * 0.7,
        border: "5px solid var(--pen)",
        borderRadius: "52% 46% 55% 48% / 58% 50% 46% 52%",
        rotate: "-3deg",
        clipPath: `inset(-10px ${100 - p * 100}% -10px -10px)`,
        opacity: p > 0 ? 1 : 0,
      }}
    />
  </span>
);

export const InlineUnderline: FC<{ p: number; children: ReactNode }> = ({ p, children }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    {children}
    <span
      style={{
        position: "absolute",
        left: -4,
        right: -4,
        bottom: -6,
        height: 6,
        borderRadius: 3,
        background: "var(--pen)",
        rotate: "-1.5deg",
        clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
      }}
    />
  </span>
);

// Latin terms followed by a number ("GPT-4o", "Part 4") must not split across lines; Japanese and Chinese
// text breaks between any characters, and a hyphen or space would otherwise be a break point.
const KEEP_TOGETHER = /[A-Za-z][A-Za-z0-9.]*(?:[- ][0-9][0-9A-Za-z.]*)+/g;

/** Text with "GPT-4o"-style terms wrapped in no-break spans. */
export function keepTerms(text: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(KEEP_TOGETHER)) {
    out.push(text.slice(last, m.index), <span key={m.index} style={{ whiteSpace: "nowrap" }}>{m[0]}</span>);
    last = m.index! + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

export const Caption: FC<{ tl: TimedStep[] }> = ({ tl }) => {
  const frame = useCurrentFrame();
  const cur = tl.find((s) => frame >= s.from && frame < s.to) ?? tl[tl.length - 1];
  const o = interpolate(frame, [cur.from, cur.from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "26px 64px 40px",
        background: "var(--paper)",
        borderTop: "2px solid var(--grid-major)",
        fontSize: 40,
        lineHeight: 1.45,
        fontWeight: 500,
        color: "var(--ink)",
        opacity: o,
        wordBreak: "keep-all",
      }}
    >
      {keepTerms(cur.narration)}
    </div>
  );
};

export const Tag: FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 56, top: 36, fontSize: 30, fontWeight: 500, color: "var(--ink-3)" }}>{text}</div>
);
