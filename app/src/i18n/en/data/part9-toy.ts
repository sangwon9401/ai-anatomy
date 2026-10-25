// Shared toy language model for Part 9 (chapters 80–82), English version.
// The next piece depends only on the last piece (like the ch02 story table), and every option has a
// *score*, not a probability, so temperature can divide the scores before softmax (ch14 → ch81).
// All scores are illustrative examples, hand-made so that:
// - greedy (always the top score) loops: school → and → meet → friends → and → meet → friends → …
// - temperature 1 gives ordinary sentences, temperature 2+ gives odd ones.
// English is not Korean: an object comes after its verb, so the table is rebuilt for English word order
// (and → verb → object → and …) while keeping the Korean table's scores and shape where possible.

export const TOY_PROMPT = ["I", "walk", "to"];
export const TOY_STOP = ".";
export const TOY_MAX = 10;

export type Option = { w: string; s: number };

const END_OK: Option[] = [
  { w: ".", s: 2.5 },
  { w: "and", s: 1.2 },
  { w: "but", s: 0.8 },
  { w: "then", s: 0.6 },
  { w: "backwards", s: -1.5 },
];

const o = (...pairs: [string, number][]): Option[] => pairs.map(([w, s]) => ({ w, s }));

// Each line: the sensible options first, then a small "tail" of odd ones with low scores.
// Real models have tens of thousands of tail pieces (ch13); a few are enough to show the effect.
export const TOY: Record<string, Option[]> = {
  to: o(["school", 3], ["the", 2], ["work", 1], ["pizza", -1]),
  school: o(["and", 2.4], [".", 1.8], ["then", 1], ["dancing", -1], ["backwards", -1.5]),
  the: o(["park", 2.2], ["beach", 2], ["library", 1.2], ["moon", -1.5], ["ceiling", -1.5]),
  work: o(["then", 2.2], [".", 1.6], ["but", 1], ["dancing", -1.5]),
  park: o(["and", 2.2], [".", 2], ["but", 1.2], ["backwards", -1.5], ["dancing", -1.5]),
  beach: o([".", 2.2], ["and", 2], ["but", 1], ["backwards", -1.5]),
  library: o([".", 2.2], ["and", 1.5], ["but", 1], ["dancing", -1.5]),
  and: o(["meet", 2.5], ["eat", 1.8], ["sing", 0.8], ["ride", -1], ["hug", -1.5]),
  then: o(["run", 2], ["rest", 1.5], ["float", -1], ["fly", -1.5]),
  but: o(["it", 2], ["Mom", 1.5], ["robots", -1], ["ghosts", -1.5]),
  meet: o(["friends", 2.5], ["teachers", 1.2], ["neighbors", 0.5], ["aliens", -2], ["sandwiches", -2]),
  eat: o(["lunch", 3], ["snacks", 1.5], ["socks", -1.5], ["clouds", -1.5]),
  sing: o(["loudly", 3], ["along", 1.5], ["underwater", -1.5]),
  ride: o(["dinosaurs", 1.5], ["rockets", 1.5], ["clouds", 1]),
  hug: o(["clouds", 1.5], ["trees", 1], ["cactuses", 1]),
  it: o(["rains", 3], ["snows", 1.5], ["sings", -1.5], ["dances", -1.5]),
  Mom: o(["smiles", 2], ["calls", 1.5], ["flies", -1.5], ["dances", -1.5]),
  robots: o(["appear", 2], ["beep", 0.5], ["dance", 0.5]),
  ghosts: o(["appear", 2], ["giggle", 0.5]),
  pizza: o(["and", 1.5], ["land", 0.5], ["boxes", 0.5]),
  moon: o([".", 2], ["and", 1]),
  ceiling: o([".", 1.5], ["and", 1]),
  dancing: o(["and", 1.5], [".", 1]),
  backwards: o([".", 1.5], ["and", 1], ["again", 1]),
  friends: o(["and", 2.6], [".", 2], ["but", 1], ["backwards", -1.5]),
};
for (const w of ["teachers", "neighbors", "aliens", "sandwiches", "lunch", "snacks", "socks", "clouds", "loudly", "along", "underwater", "dinosaurs", "rockets", "trees", "cactuses", "run", "rest", "float", "fly", "rains", "snows", "sings", "dances", "smiles", "calls", "flies", "appear", "beep", "dance", "giggle", "land", "boxes", "again"]) {
  TOY[w] = END_OK;
}

/** softmax(score ÷ temperature); temperature 0 means greedy (all of the probability on the top score). */
export function softmaxT(scores: number[], t: number): number[] {
  if (t <= 0) {
    const top = scores.indexOf(Math.max(...scores));
    return scores.map((_, i) => (i === top ? 1 : 0));
  }
  const m = Math.max(...scores);
  const ex = scores.map((s) => Math.exp((s - m) / t));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

/** Pick an index from probabilities with a number r in [0, 1). */
export function pickIndex(p: number[], r: number) {
  for (let i = 0; i < p.length; i++) {
    r -= p[i];
    if (r < 0) return i;
  }
  return p.length - 1;
}

/** Generate pieces after the prompt; `rand` returns numbers in [0, 1). The result ends with "." or, when cut off, "…". */
export function generate(t: number, rand: () => number, max = TOY_MAX): string[] {
  const out: string[] = [];
  let last = TOY_PROMPT[TOY_PROMPT.length - 1];
  while (out.length < max) {
    const opts = TOY[last];
    const i = pickIndex(softmaxT(opts.map((o) => o.s), t), rand());
    last = opts[i].w;
    out.push(last);
    if (last === TOY_STOP) return out;
  }
  return [...out, "…"];
}

/** Join pieces into a sentence: "." and "…" stick to the word before them. */
export const joinPieces = (ws: string[]) => ws.reduce((acc, w) => (w === "." || w === "…" ? acc + w : acc ? `${acc} ${w}` : w), "");

/** Which pieces were "odd" picks: options with a negative score in their row (the tail). */
export function oddMask(pieces: string[]): boolean[] {
  let last = TOY_PROMPT[TOY_PROMPT.length - 1];
  return pieces.map((w) => {
    const o = TOY[last]?.find((x) => x.w === w);
    last = w;
    return o ? o.s < 0 : false;
  });
}
