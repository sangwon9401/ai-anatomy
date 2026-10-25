// Shared toy language model for Part 9 (chapters 80–82), ja.
// The next piece depends only on the last piece (like the ch02 story table), and every option has a
// *score*, not a probability, so temperature can divide the scores before softmax (ch14 → ch81).
// All scores are illustrative (説明用の例), hand-made so that:
// - greedy (always the top score) loops: 行く → そして → 友と → 会った → そして → …
// - temperature 1 gives ordinary sentences, temperature 2+ gives odd ones.
// The table has exactly the shape and the scores of the Korean one (same chain, so the same statistics);
// only the words are Japanese. Pieces are shown with a space between them, like a picture book's 分かち書き.

export const TOY_PROMPT = ["私は", "今日", "学校に"];
export const TOY_STOP = "。";
export const TOY_MAX = 10;

export type Option = { w: string; s: number };

const END_OK: Option[] = [
  { w: "。", s: 2.5 },
  { w: "そして", s: 1.2 },
  { w: "けど", s: 0.8 },
  { w: "から", s: 0.6 },
  { w: "宇宙へ", s: -1.5 },
];

const o = (...pairs: [string, number][]): Option[] => pairs.map(([w, s]) => ({ w, s }));

// Each line: the sensible options first, then a small "tail" of odd ones with low scores.
// Real models have tens of thousands of tail pieces (ch13); a few are enough to show the effect.
export const TOY: Record<string, Option[]> = {
  学校に: o(["行く", 3], ["行った", 2], ["遅れた", 1], ["ピザ", -1]),
  行く: o(["そして", 2.4], ["。", 1.8], ["から", 1], ["踊りながら", -1], ["後ろ向きに", -1.5]),
  行った: o(["そして", 2.2], ["。", 2], ["けど", 1.2], ["宇宙へ", -1.5], ["後ろ向きに", -1.5]),
  遅れた: o(["から", 2.2], ["。", 1.6], ["けど", 1], ["踊りながら", -1.5]),
  そして: o(["友と", 2.5], ["給食を", 1.8], ["歌を", 0.8], ["恐竜に", -1], ["雲を", -1.5]),
  から: o(["走った", 2], ["怒られた", 1.5], ["後ろ向きに", -1], ["飛んでいった", -1.5]),
  けど: o(["雨が", 2], ["先生が", 1.5], ["恐竜が", -1], ["雲が", -1.5]),
  友と: o(["会った", 2.5], ["話した", 1.2], ["電話した", 0.5], ["合体した", -2], ["変身した", -2]),
  給食を: o(["食べた", 3], ["残した", 1.5], ["投げた", -1.5], ["描いた", -1.5]),
  歌を: o(["歌った", 3], ["聞いた", 1.5], ["食べた", -1.5]),
  恐竜に: o(["変身した", 1.5], ["会った", 1.5], ["乗って", 1]),
  雲を: o(["つかまえた", 1.5], ["食べた", 1], ["描いた", 1]),
  雨が: o(["降った", 3], ["やんだ", 1.5], ["歌った", -1.5], ["踊った", -1.5]),
  先生が: o(["笑った", 2], ["呼んだ", 1.5], ["飛んでいった", -1.5], ["踊った", -1.5]),
  恐竜が: o(["現れた", 2], ["歌った", 0.5], ["踊った", 0.5]),
  雲が: o(["広がった", 2], ["歌った", 0.5]),
  ピザ: o(["食べに", 1.5], ["持って", 0.5], ["配りに", 0.5]),
  食べに: o(["行く", 2], ["行った", 1.5], ["飛んでいった", -1]),
  持って: o(["宇宙へ", 1.5], ["行く", 1], ["飛んでいった", 0.5]),
  乗って: o(["宇宙へ", 1.5], ["行く", 1], ["飛んでいった", 0.5]),
  配りに: o(["回った", 2], ["飛んでいった", -0.5]),
  宇宙へ: o(["飛んでいった", 2], ["行く", 1]),
  後ろ向きに: o(["歩いた", 1.5], ["飛んでいった", 1], ["行く", 1]),
  踊りながら: o(["歌を", 1.5], ["行く", 1]),
  会った: o(["そして", 2.6], ["。", 2], ["けど", 1], ["後ろ向きに", -1.5]),
};
for (const w of ["話した", "電話した", "合体した", "変身した", "食べた", "残した", "投げた", "描いた", "歌った", "聞いた", "つかまえた", "降った", "やんだ", "踊った", "笑った", "呼んだ", "現れた", "広がった", "走った", "怒られた", "飛んでいった", "回った", "歩いた"]) {
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

/** Generate pieces after the prompt; `rand` returns numbers in [0, 1). The result ends with "。" or, when cut off, "…". */
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

/** Join pieces into a sentence: "。" and "…" stick to the word before them, other pieces are spaced like a picture book. */
export const joinPieces = (ws: string[]) => ws.reduce((acc, w) => (w === "。" || w === "…" ? acc + w : acc ? `${acc} ${w}` : w), "");

/** Which pieces were "odd" picks: options with a negative score in their row (the tail). */
export function oddMask(pieces: string[]): boolean[] {
  let last = TOY_PROMPT[TOY_PROMPT.length - 1];
  return pieces.map((w) => {
    const o = TOY[last]?.find((x) => x.w === w);
    last = w;
    return o ? o.s < 0 : false;
  });
}
