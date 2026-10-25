// Shared toy language model for Part 9 (chapters 80–82).
// The next piece depends only on the last piece (like the ch02 story table), and every option has a
// *score*, not a probability, so temperature can divide the scores before softmax (ch14 → ch81).
// All scores are illustrative (설명용 예시), hand-made so that:
// - greedy (always the top score) loops: 간다 → 그리고 → 친구를 → 만났다 → 그리고 → …
// - temperature 1 gives ordinary sentences, temperature 2+ gives odd ones.

export const TOY_PROMPT = ["나는", "오늘", "학교에"];
export const TOY_STOP = ".";
export const TOY_MAX = 10;

export type Option = { w: string; s: number };

const END_OK: Option[] = [
  { w: ".", s: 2.5 },
  { w: "그리고", s: 1.2 },
  { w: "그런데", s: 0.8 },
  { w: "그래서", s: 0.6 },
  { w: "우주로", s: -1.5 },
];

const o = (...pairs: [string, number][]): Option[] => pairs.map(([w, s]) => ({ w, s }));

// Each line: the sensible options first, then a small "tail" of odd ones with low scores.
// Real models have tens of thousands of tail pieces (ch13); a few are enough to show the effect.
export const TOY: Record<string, Option[]> = {
  학교에: o(["간다", 3], ["갔다", 2], ["늦었다", 1], ["피자", -1]),
  간다: o(["그리고", 2.4], [".", 1.8], ["그래서", 1], ["춤추며", -1], ["거꾸로", -1.5]),
  갔다: o(["그리고", 2.2], [".", 2], ["그런데", 1.2], ["우주로", -1.5], ["거꾸로", -1.5]),
  늦었다: o(["그래서", 2.2], [".", 1.6], ["그런데", 1], ["춤추며", -1.5]),
  그리고: o(["친구를", 2.5], ["급식을", 1.8], ["노래를", 0.8], ["공룡을", -1], ["구름을", -1.5]),
  그래서: o(["뛰었다", 2], ["혼났다", 1.5], ["거꾸로", -1], ["날아갔다", -1.5]),
  그런데: o(["비가", 2], ["선생님이", 1.5], ["공룡이", -1], ["구름이", -1.5]),
  친구를: o(["만났다", 2.5], ["도왔다", 1.2], ["불렀다", 0.5], ["먹었다", -2], ["던졌다", -2]),
  급식을: o(["먹었다", 3], ["남겼다", 1.5], ["던졌다", -1.5], ["그렸다", -1.5]),
  노래를: o(["불렀다", 3], ["들었다", 1.5], ["먹었다", -1.5]),
  공룡을: o(["그렸다", 1.5], ["만났다", 1.5], ["타고", 1]),
  구름을: o(["탔다", 1.5], ["먹었다", 1], ["그렸다", 1]),
  비가: o(["왔다", 3], ["그쳤다", 1.5], ["노래했다", -1.5], ["춤췄다", -1.5]),
  선생님이: o(["웃으셨다", 2], ["부르셨다", 1.5], ["날아가셨다", -1.5], ["춤추셨다", -1.5]),
  공룡이: o(["나타났다", 2], ["노래했다", 0.5], ["춤췄다", 0.5]),
  구름이: o(["몰려왔다", 2], ["노래했다", 0.5]),
  피자: o(["먹으러", 1.5], ["타고", 0.5], ["상자를", 0.5]),
  먹으러: o(["간다", 2], ["갔다", 1.5], ["날아갔다", -1]),
  타고: o(["우주로", 1.5], ["간다", 1], ["날아갔다", 0.5]),
  상자를: o(["열었다", 2], ["먹었다", -0.5]),
  우주로: o(["날아갔다", 2], ["간다", 1]),
  거꾸로: o(["걸었다", 1.5], ["날아갔다", 1], ["간다", 1]),
  춤추며: o(["노래를", 1.5], ["간다", 1]),
  만났다: o(["그리고", 2.6], [".", 2], ["그런데", 1], ["거꾸로", -1.5]),
};
for (const w of ["도왔다", "불렀다", "먹었다", "남겼다", "던졌다", "그렸다", "들었다", "탔다", "왔다", "그쳤다", "노래했다", "춤췄다", "웃으셨다", "부르셨다", "날아가셨다", "춤추셨다", "나타났다", "몰려왔다", "뛰었다", "혼났다", "날아갔다", "열었다", "걸었다"]) {
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
