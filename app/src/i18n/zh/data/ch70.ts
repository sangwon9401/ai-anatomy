import type { ChapterSpec } from "../../../data/types";

/** 示意数据 curve: every ×10 in size takes 0.5 off the loss. (Kaplan 2020 found straight lines on ×10 axes;
 *  these numbers are made up to keep the arithmetic simple.) */
export const LOSS_AT_1E7 = 5;
export const DROP_PER_10X = 0.5;
export const lossOf = (n: number) => LOSS_AT_1E7 - DROP_PER_10X * (Math.log10(n) - 7);

export const SIZES70 = [1e7, 1e8, 1e9, 1e10, 1e11];
export const GPT3_N = 1.75e11;

/** Chinese number words for model sizes: 1000 万, 1 亿, 10 亿, 1750 亿, 1 万亿 (the export keeps the Korean file's name). */
export function koN(n: number): string {
  if (n >= 1e12) return `${Number((n / 1e12).toFixed(1))} 万亿`;
  if (n >= 1e8) return `${Math.round(n / 1e8)} 亿`;
  return `${Math.round(n / 1e4)} 万`;
}

/** Chinchilla (2022): about 20 training tokens per parameter. */
export const TOKENS_PER_PARAM = 20;

export const ch70: ChapterSpec = {
  id: 70,
  part: 7,
  title: "越大越聪明",
  core: true,
  hook: "把模型变大 10 倍，会好多少？能不能事先知道？",
  steps: [
    { id: "s1", sec: 10, narration: "模型变大，真的会变聪明吗？2020 年，研究人员做了很多大小不同的模型，比较它们的损失。" },
    { id: "s2", sec: 9, narration: "先用普通刻度画出来。小模型都挤在最左边，后面看起来几乎是平的。" },
    { id: "s3", sec: 9, narration: "这次换一种横轴刻度。不是每走一格加 1，而是每走一格乘 10。" },
    { id: "s4", sec: 10, narration: "这样一来，点就排成了一条直线。在这个示意的例子里，模型每变大 10 倍，损失就减少 0.5。" },
    { id: "s5", sec: 10, narration: "这种每格乘 10 的刻度，叫作对数刻度。就像第 65 章的惊讶一样，数的是“乘了几次”。" },
    { id: "s6", sec: 9, narration: "增加数据量或计算量，也同样得到一条直线。这个规律叫作缩放定律。" },
    { id: "s7", sec: 10, narration: "把线一直延长，就能提前预测更大模型的损失。所以人们才敢去挑战 GPT-3 这样的大模型。" },
    { id: "s8", sec: 11, narration: "2022 年的 Chinchilla 研究说：不能只把模型变大，数据也要一起加，大约每个参数配 20 个词元。" },
  ],
  playgroundTitle: "换一换刻度",
  playgroundIntro: "改变模型大小，再在普通刻度和 10 倍刻度之间切换，比较同样的点看起来有什么不同。",
  summary: [
    "把横轴换成每格乘 10 的刻度（对数刻度），损失就沿着一条直线下降。",
    "增加大小、数据、计算量，损失就会按可以预测的方式下降 = 缩放定律（2020）。",
    "把线延长，就能预测大模型。数据也要一起增加（Chinchilla，2022）。",
  ],
  unlocks: "缩放定律",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "在“10 倍刻度”上往右走一格，数值会怎样？",
      choices: ["加 1", "变成 10 倍", "变成 2 倍"],
      answer: 1,
      explain: "1 → 10 → 100 → 1000，每走一格就乘 10。这样的刻度就是对数刻度。",
      review: "s3",
    },
    {
      q: "缩放定律说的是什么？",
      choices: ["模型足够大，损失就会变成 0", "模型太大就学不会", "增加大小、数据、计算量，损失会按可以预测的方式下降"],
      answer: 2,
      explain: "在 10 倍刻度上，损失沿着直线下降，所以能提前预测更大模型的结果。",
      review: "s6",
    },
    {
      q: "Chinchilla 研究（2022）建议怎么做？",
      choices: ["数据也要跟着模型大小一起增加", "只把模型尽量变大", "减少数据"],
      answer: 0,
      explain: "大约每个参数配 20 个词元，模型和数据一起变大效果最好。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 70 章 越大越聪明",
    study: "2020 · Kaplan 等",
    sizes: "模型大小（参数个数）",
    q: "越大，损失就越小吗？",
    axisX: "模型大小",
    axisXArrow: "模型大小 →",
    axisY: "↑ 损失",
    example: "示意曲线",
    crowd: "← 都挤在最左边",
    flatQ: "几乎是平的？",
    rulerA: "普通刻度：每格 +1",
    rulerB: "10 倍刻度：每格 ×10",
    plus1: "+1",
    times10: "×10",
    line: "排成一条直线！",
    minus: "−0.5",
    logName: "对数刻度（log scale）",
    link65: "第 65 章：每减半一次，惊讶 +1",
    link70: "第 70 章：每乘一次 10，走一格",
    data: "数据量",
    compute: "计算量",
    law: "缩放定律",
    predict: "提前预测 →",
    gpt3: "GPT-3",
    chinchilla: "2022 · Chinchilla",
    perParam: "每个参数约配 20 个词元",
    exampleCalc: "10 亿参数的模型 → 约 200 亿个词元",
    together: "模型和数据一起变大",
    // not drawn as such: the number words koN() draws, listed so their font slices load in video renders
    numWords: "1000 万 · 1 亿 · 10 亿 · 1750 亿 · 1 万亿",
  },
};
