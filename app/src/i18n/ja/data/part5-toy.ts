// ja overlay of src/data/part5-toy.ts: the same toy numbers with the Japanese sentence 私は 今日 学校に 行く
// Part 5 (46–51) toy attention example: one sentence, 2-dimensional vectors, every number derived here.
// The matrices are illustrative (説明用の例), picked so the arithmetic stays readable (see the Part 5 build notes).
import type { Highlighter } from "../../../data/types";

export type V2 = [number, number];
/** [a, b, c, d] = [[a, b], [c, d]]; multiplied onto a column vector like ch11: W·x */
export type M2 = [number, number, number, number];

export const WORDS = ["私は", "今日", "学校に", "行く"] as const;
/** the word whose row we follow through 46–49 */
export const FOCUS = 3;
/** paint colours for each word's Value (ch49) */
export const PAINT: Highlighter[] = ["pink", "violet", "orange", "mint"];

/** word vectors (embeddings, ch33), toy 2-dimensional */
export const X: V2[] = [
  [0, 1],
  [1, 0],
  [1, 2],
  [1, 1],
];
export const W_Q: M2 = [1, 0, 3, -1];
export const W_K: M2 = [1, 0, -1, 1];
export const W_V: M2 = [1, 1, 0, 1];

export const apply = (m: M2, v: V2): V2 => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
export const dot = (a: readonly number[], b: readonly number[]) => a.reduce((s, x, i) => s + x * b[i], 0);

export const Q: V2[] = X.map((x) => apply(W_Q, x));
export const K: V2[] = X.map((x) => apply(W_K, x));
export const V: V2[] = X.map((x) => apply(W_V, x));

/** number of entries in each Q / K vector */
export const D = 2;
export const SQRT_D = Math.sqrt(D);

/** relevance scores: row = the word asking (Q), column = the word answering (K) */
export const SCORE: number[][] = Q.map((q) => K.map((k) => dot(q, k)));
export const SCALED: number[][] = SCORE.map((row) => row.map((s) => s / SQRT_D));

export function softmax(xs: number[]) {
  const m = Math.max(...xs.filter((x) => Number.isFinite(x)));
  const ex = xs.map((x) => (Number.isFinite(x) ? Math.exp(x - m) : 0));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}
/** softmax without shifting, so the eˣ values match ch14 when shown */
export const expAll = (xs: number[]) => xs.map((x) => Math.exp(x));

/** attention weights without the mask (46–50) */
export const WEIGHT: number[][] = SCALED.map(softmax);
/** causal mask (ch51): a word may only look at itself and the words before it */
export const allowed = (row: number, col: number) => col <= row;
export const MASKED: number[][] = SCALED.map((row, i) => softmax(row.map((s, j) => (allowed(i, j) ? s : -Infinity))));

export const mixRow = (w: number[]): V2 => [dot(w, V.map((v) => v[0])), dot(w, V.map((v) => v[1]))];
export const OUT: V2[] = WEIGHT.map(mixRow);
export const OUT_MASKED: V2[] = MASKED.map(mixRow);

/** ch48: the focus row with no √d division gives exactly ch14's numbers (scores 2, −1, 3, 1 = 3, 2, 1, −1 reordered) */
export const RAW_WEIGHT: number[] = softmax(SCORE[FOCUS]);

// ---------- formatting ----------
const MINUS = "−";
/** a signed number with a real minus sign; integers stay integers */
export function fmt(v: number, digits = 2) {
  if (Math.abs(v) < 0.5 * 10 ** -digits) return Number.isInteger(v) ? "0" : (0).toFixed(digits);
  const s = Number.isInteger(v) ? String(Math.abs(v)) : Math.abs(v).toFixed(digits);
  return v < 0 ? `${MINUS}${s}` : s;
}
export const fmtVec = (v: readonly number[], digits = 2) => `(${v.map((x) => fmt(x, digits)).join(", ")})`;

/**
 * Round a probability row to `digits` decimals of a percent so the shown values add up to exactly 100
 * (largest remainder). Returns the numbers, not strings.
 */
export function pct(row: number[], digits = 1): number[] {
  const unit = 10 ** digits;
  const raw = row.map((p) => p * 100 * unit);
  const fl = raw.map(Math.floor);
  let left = 100 * unit - fl.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - fl[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    fl[i] += 1;
    left -= 1;
  }
  return fl.map((f) => f / unit);
}
export const pctText = (p: number, digits = 1) => `${p.toFixed(digits)}%`;

/** Weights as 3-decimal fractions that match the 1-decimal percents and add up to exactly 1, for the matrix view. */
export const dec3 = (row: number[]) => pct(row, 1).map((p) => Math.round(p * 10) / 1000);

// ---------- ch48: why divide by √d ----------
/** small deterministic PRNG (mulberry32), so scenes and playgrounds draw the same "random" vectors */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** one query and four keys whose entries are +1 or −1 at random; returns the four raw dot products */
export function randomScores(d: number, seed: number): number[] {
  const r = rng(seed * 7919 + d);
  const pm = () => (r() < 0.5 ? -1 : 1);
  const q = Array.from({ length: d }, pm);
  return WORDS.map(() => dot(q, Array.from({ length: d }, pm)));
}
/** the seed for the 128-entry illustration in 48장 (picked so the raw softmax is extreme and 学校に leads, like the toy row) */
export const BIG_D = 128;
export const BIG_SEED = 130;
export const BIG_SCORES = randomScores(BIG_D, BIG_SEED);
export const BIG_RAW = softmax(BIG_SCORES);
export const BIG_SCALED = softmax(BIG_SCORES.map((s) => s / Math.sqrt(BIG_D)));

/** strings that appear only through this module, for the font corpus */
export const TOY_CORPUS = [WORDS, "説明用の例"];

/** CSS colour for paints mixed by weight (ch49): nested color-mix over the highlighter tokens. */
export function paintMix(weights: number[], colors: Highlighter[] = PAINT): string {
  let left = weights.reduce((a, b) => a + b, 0);
  if (left <= 0) return "var(--paper-2)";
  const parts: string[] = [];
  for (let i = 0; i < weights.length - 1; i++) {
    const share = left > 0 ? (weights[i] / left) * 100 : 0;
    parts.push(`color-mix(in srgb, var(--hl-${colors[i]}) ${share.toFixed(1)}%, `);
    left -= weights[i];
  }
  return parts.join("") + `var(--hl-${colors[weights.length - 1]})` + ")".repeat(weights.length - 1);
}
