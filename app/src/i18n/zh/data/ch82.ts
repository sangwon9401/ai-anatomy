import { ROUND1 } from "../../../data/ch01";
import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Cand = { w: string; p: number; c: Highlighter | null };

// "我 今天 去 ___" with ch01's numbers (the first four words come from ch01, so they always match it);
// ch01's 其他 5% is split into 动物园 3% and "其余几万个" 2% (illustrative).
// The odd tail = 披萨 1% + 其余几万个 2% = 3%.
export const DIST82: Cand[] = [
  { w: ROUND1[0].w, p: 0.52, c: "yellow" },
  { w: ROUND1[1].w, p: 0.21, c: "mint" },
  { w: ROUND1[2].w, p: 0.12, c: "sky" },
  { w: ROUND1[3].w, p: 0.09, c: "violet" },
  { w: "动物园", p: 0.03, c: "orange" },
  { w: "披萨", p: 0.01, c: "pink" },
  { w: "其他", p: 0.02, c: null },
];
export const TAIL = 0.03;
export const TAIL_RUN = 100; // 1 − 0.97^100 ≈ 0.952

// s6: when the model is sure vs unsure (illustrative)
export const SURE: Cand[] = [
  { w: "9", p: 0.92, c: "yellow" },
  { w: "8", p: 0.04, c: "mint" },
  { w: "11", p: 0.02, c: "sky" },
  { w: "10", p: 0.01, c: "violet" },
  { w: "13", p: 0.01, c: "pink" },
];
export const UNSURE: Cand[] = [
  { w: "苹果", p: 0.24, c: "yellow" },
  { w: "草莓", p: 0.21, c: "mint" },
  { w: "香蕉", p: 0.17, c: "sky" },
  { w: "葡萄", p: 0.14, c: "violet" },
  { w: "西瓜", p: 0.11, c: "orange" },
  { w: "桃子", p: 0.09, c: "pink" },
  { w: "椅子", p: 0.04, c: null },
];
export const PRESETS82 = [
  { key: "school", name: "我 今天 去", items: DIST82 },
  { key: "sure", name: "1, 3, 5, 7,", items: SURE },
  { key: "unsure", name: "我最喜欢的水果是", items: UNSURE },
];

/** How many candidates each rule keeps (lists are sorted from most to least likely). */
export const keepTopK = (items: Cand[], k: number) => Math.min(k, items.length);
export function keepTopP(items: Cand[], p: number) {
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += items[i].p;
    if (acc >= p - 1e-9) return i + 1;
  }
  return items.length;
}
/** Probabilities after cutting to the first n and sharing out again so they add up to 1. */
export function renorm(items: Cand[], n: number) {
  const s = items.slice(0, n).reduce((a, b) => a + b.p, 0);
  return items.map((it, i) => (i < n ? it.p / s : 0));
}

export const PIPE = [
  { a: "分数", b: "" },
  { a: "÷ 温度", b: "第 81 章" },
  { a: "Softmax", b: "第 14 章" },
  { a: "剪掉尾巴", b: "第 82 章" },
  { a: "转转盘", b: "第 80 章" },
  { a: "下一个片段！", b: "" },
];

export const ch82: ChapterSpec = {
  id: 82,
  part: 9,
  title: "缩小候选范围",
  core: false,
  hook: "转盘上有“披萨”这一格，总有一天会真的抽中“披萨”吧？",
  steps: [
    { id: "s1", sec: 7, narration: "采样有个陷阱。候选有好几万个，再小的柱子全加起来，尾巴也不算薄。" },
    { id: "s2", sec: 8, narration: "就算尾巴只有 3%，写一个 100 个片段的回答，中间至少混进一个怪词的概率也高达 95%。" },
    { id: "s3", sec: 8, narration: "所以要剪掉尾巴。第一种：Top-k。按概率排好，只留最前面的 k 个。k 是 3，就只留三个。" },
    { id: "s4", sec: 9, narration: "剩下的 85% 重新分配，总和回到 1：学校 61.2%，图书馆 24.7%，公园 14.1%。再转转盘。" },
    { id: "s5", sec: 9, narration: "第二种：Top-p。从上往下把概率加起来，一旦超过 p，比如 90%，就停下，剩下的全剪掉。" },
    { id: "s6", sec: 9, narration: "Top-k 永远留 3 个；Top-p 会看情况：模型有把握时只留 1 个，拿不准时留 6 个。" },
    { id: "s7", sec: 9, narration: "总结一下：分数除以温度，用 Softmax 变成概率，剪掉尾巴，再转转盘。一个片段就是这样被抽出来的。" },
  ],
  playgroundTitle: "剪尾巴实验室",
  playgroundIntro: "选一句话，用 Top-k 或 Top-p 剪掉一部分候选。用剩下的候选转转盘，会抽出什么？",
  summary: [
    "候选有好几万个，小尾巴加起来，也可能抽出怪词。",
    "Top-k 只留前 k 个；Top-p 从上往下加，加到超过 p 为止。",
    "剪完后把剩下的重新分配，让总和回到 1，再转转盘。",
  ],
  unlocks: "Top-k · Top-p",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "Top-k 中如果设 k = 2，会怎样？",
      choices: ["只留下概率大于 2% 的候选", "转两次转盘来挑", "只留下概率第 1 和第 2 名，其余剪掉"],
      answer: 2,
      explain: "Top-k 按概率排好，只留最前面的 k 个。",
      review: "s3",
    },
    {
      q: "候选的概率是 [60%, 25%, 10%, 5%]，用 Top-p（p = 80%）会留下几个？",
      choices: ["1 个", "2 个", "4 个"],
      answer: 1,
      explain: "从上往下加：60%、85%。加到第二个就超过 80%，所以留下 2 个。",
      review: "s5",
    },
    {
      q: "模型非常有把握时（第 1 名占 92%），Top-p（90%）会留下几个候选？",
      choices: ["只留第 1 名", "永远 3 个", "所有候选"],
      answer: 0,
      explain: "光第 1 名就超过 90% 了。Top-p 留下的个数会随分布的形状变化。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 82 章 缩小候选范围",
    example: "示意数据",
    tailNote: "其他 = 几万个片段加在一起",
    tail: "古怪的尾巴 = 3%",
    long: "如果要写 100 个片段长的回答",
    avoid: "连续 100 次都躲开尾巴的概率",
    mult: "0.97 × 0.97 × … × 0.97",
    times: "100 次",
    approx: "≈ 0.05",
    once: "至少抽中一次尾巴的概率 ≈ 95%",
    calc: "* 示意计算",
    way1: "方法 1",
    way2: "方法 2",
    topk: "Top-k",
    k3: "k = 3",
    topkNote: "只留前 k 个！",
    snip: "咔嚓！",
    renorm: "÷ 0.85 → 和为 1",
    topp: "Top-p",
    p90: "p = 90%",
    toppNote: "一路相加，直到超过 90%",
    sum: "累加",
    over: "超过 90%！",
    toppRenorm: "剩下 4 个重新分配：55.3 · 22.3 · 12.8 · 9.6%",
    sureQ: "1, 3, 5, 7, ___",
    unsureQ: "我最喜欢的水果是 ___",
    sure: "有把握时",
    unsure: "拿不准时",
    kLine: "Top-k",
    pLine: "Top-p",
    keepSure: "Top-k 3 个 · Top-p 1 个",
    keepUnsure: "Top-k 3 个 · Top-p 6 个",
    adapt: "Top-p 会看情况增减！",
    pipeTitle: "一个片段被抽出来的路线",
    again: "接上这个片段，再从头来一遍（第 2 章）",
  },
};
