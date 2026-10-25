// Shared toy language model for Part 9 (chapters 80–82), zh adaptation.
// The next piece depends only on the last piece (like the ch02 story table), and every option has a
// *score*, not a probability, so temperature can divide the scores before softmax (ch14 → ch81).
// All scores are illustrative (示意数据), hand-made so that:
// - greedy (always the top score) loops: 学校 → 然后 → 见到 → 朋友 → 然后 → …
// - temperature 1 gives ordinary sentences, temperature 2+ gives odd ones.

export const TOY_PROMPT = ["我", "今天", "去"];
export const TOY_STOP = "。";
export const TOY_MAX = 10;

export type Option = { w: string; s: number };

const END_OK: Option[] = [
  { w: "。", s: 2.5 },
  { w: "然后", s: 1.2 },
  { w: "可是", s: 0.8 },
  { w: "所以", s: 0.6 },
  { w: "飞向太空", s: -1.5 },
];

const o = (...pairs: [string, number][]): Option[] => pairs.map(([w, s]) => ({ w, s }));

// Each line: the sensible options first, then a small "tail" of odd ones with low scores.
// Real models have tens of thousands of tail pieces (ch13); a few are enough to show the effect.
export const TOY: Record<string, Option[]> = {
  去: o(["学校", 3], ["图书馆", 2], ["公园", 1], ["披萨", -1]),
  学校: o(["然后", 2.4], ["。", 1.8], ["上课", 1], ["跳着舞", -1], ["倒着走", -1.5]),
  图书馆: o(["然后", 2.2], ["。", 2], ["可是", 1.2], ["飞向太空", -1.5], ["倒着走", -1.5]),
  公园: o(["所以", 2.2], ["。", 1.6], ["可是", 1], ["跳着舞", -1.5]),
  然后: o(["见到", 2.5], ["吃了", 1.8], ["唱了", 0.8], ["骑着", -1], ["爬上", -1.5]),
  所以: o(["很开心", 2], ["很累", 1.5], ["倒着走", -1], ["飞走了", -1.5]),
  可是: o(["下起了", 2], ["老师", 1.5], ["恐龙", -1], ["云朵", -1.5]),
  见到: o(["朋友", 2.5], ["同学", 1.2], ["校长", 0.5], ["外星人", -2], ["幽灵", -2]),
  吃了: o(["午饭", 3], ["面包", 1.5], ["书包", -1.5], ["橡皮", -1.5]),
  唱了: o(["歌", 3], ["校歌", 1.5], ["数学题", -1.5]),
  骑着: o(["大象", 1.5], ["扫把", 1.5], ["自行车", 1]),
  爬上: o(["彩虹", 1.5], ["屋顶", 1], ["月亮", 1]),
  下起了: o(["大雨", 3], ["小雨", 1.5], ["披萨雨", -1.5], ["糖果雨", -1.5]),
  老师: o(["笑了", 2], ["叫我", 1.5], ["飞走了", -1.5], ["跳起舞", -1.5]),
  恐龙: o(["出现了", 2], ["唱歌了", 0.5], ["跳舞了", 0.5]),
  云朵: o(["飘来了", 2], ["唱歌了", 0.5]),
  披萨: o(["店", 1.5], ["星球", 0.5], ["盒子里", 0.5]),
  店: o(["吃饭", 2], ["打工", 1.5], ["飞走了", -1]),
  星球: o(["探险", 1.5], ["。", 1], ["飞走了", 0.5]),
  盒子里: o(["睡觉", 2], ["跳着舞", -0.5]),
  飞向太空: o(["。", 2], ["然后", 1]),
  倒着走: o(["回家", 1.5], ["飞走了", 1], ["。", 1]),
  跳着舞: o(["唱了", 1.5], ["回家", 1]),
  朋友: o(["然后", 2.6], ["。", 2], ["可是", 1], ["倒着走", -1.5]),
};
for (const w of ["上课", "同学", "校长", "外星人", "幽灵", "午饭", "面包", "书包", "橡皮", "歌", "校歌", "数学题", "大象", "扫把", "自行车", "彩虹", "屋顶", "月亮", "大雨", "小雨", "披萨雨", "糖果雨", "笑了", "叫我", "飞走了", "跳起舞", "出现了", "唱歌了", "跳舞了", "飘来了", "很开心", "很累", "吃饭", "打工", "探险", "睡觉", "回家"]) {
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

/** Join pieces into a sentence: "。" and "…" stick to the word before them. */
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
