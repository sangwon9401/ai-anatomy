import { W0, lossA, slopeA } from "../../../data/ch21";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** gradient steps on 21章's valley (A 店, 排队旋钮) with learning rate `lr` */
export function walk(lr: number, steps: number, w0 = W0) {
  const ws = [w0];
  for (let i = 0; i < steps; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - lr * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
}

export const RUNS: { lr: number; name: string; c: Highlighter; ws: number[] }[] = [
  { lr: 0.01, name: "太小", c: "sky", ws: walk(0.01, 10) },
  { lr: 0.1, name: "刚好", c: "mint", ws: walk(0.1, 10) },
  { lr: 0.3, name: "太大", c: "pink", ws: walk(0.3, 10) },
];
export const RUN_LOSS = RUNS.map((r) => r.ws.map(lossA));

export const ch22: ChapterSpec = {
  id: 22,
  part: 2,
  title: "决定步子大小：学习率",
  core: false,
  hook: "下山的时候，一步该迈多大？",
  steps: [
    { id: "s1", sec: 9.5, narration: "第 21 章里，一步的大小是“学习率 × 斜率”。学习率（learning rate）就是决定一步迈多大的步长。" },
    { id: "s2", sec: 8, narration: "学习率太小（0.01），就像乌龟一样慢。走了五步，还在半山腰。" },
    { id: "s3", sec: 7, narration: "大小刚好（0.1），几步就到谷底。就是第 21 章看到的那几步。" },
    { id: "s4", sec: 9, narration: "太大（0.3）就会冲过谷底，弹到对面去。每弹一次都更高，损失反而变大了。" },
    { id: "s5", sec: 8, narration: "把每一步的损失画成图，差别一目了然：慢慢下降、一下掉到底、一路飙升。" },
    { id: "s6", sec: 9, narration: "所以学习率要谨慎地选。GPT-⁠3 训练时，也是先把学习率一点点调高，再在训练中慢慢调低。" },
    { id: "s7", sec: 8, narration: "太小像乌龟，太大会弹飞，合适的步长很重要。更聪明的走法，第 67 章再学。" },
  ],
  playgroundTitle: "步长实验室",
  playgroundIntro: "定好学习率，点“走 10 步”。看看球在山谷里怎么动，损失又怎么变。",
  summary: [
    "学习率 = 一步的步长。新旋钮 = 旋钮 − 学习率 × 斜率。",
    "太小就像乌龟一样慢，太大会冲过谷底弹飞。",
    "选对学习率，才能很快到达谷底。训练中也常常把它逐渐调小。",
  ],
  unlocks: "学习率",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "训练时损失越来越大，最可能是什么原因？",
      choices: ["学习率太大", "学习率太小", "数据太少"],
      answer: 0,
      explain: "步子太大会冲过谷底，弹到对面更高的地方，损失就变大了。",
      review: "s4",
    },
    {
      q: "学习率太小时会怎样？",
      choices: ["损失爆炸", "损失下降得非常慢", "损失马上变成 0"],
      answer: 1,
      explain: "方向是对的，但步子太小，要走很多很多步才能到谷底。",
      review: "s2",
    },
    {
      q: "w = 1、斜率 = −4 时，如果学习率是 0.3，新 w 是多少？",
      choices: ["1.4", "0.7", "2.2"],
      answer: 2,
      explain: "1 − 0.3 × (−4) = 1 + 1.2 = 2.2。一下子越过了谷底（1.5）。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第 22 章 决定步子大小：学习率",
    rule: "新 w = w − 学习率 × 斜率",
    stride: "学习率 = 步长",
    axisW: "w（排队旋钮）",
    axisL: "损失",
    small: "学习率 0.01",
    good: "学习率 0.1",
    big: "学习率 0.3",
    turtle: "乌龟……还在半山腰",
    arrive: "几步就到谷底！",
    bounce: "越弹越高",
    out: "下一步就飞出图外！",
    chart: "每一步的损失",
    step: "步",
    slow: "慢慢降",
    fast: "一下到底",
    up: "飙升",
    schedTitle: "学习率也要做计划",
    warm: "先一点点调高",
    decay: "再慢慢调低",
    lrAxis: "学习率",
    timeAxis: "训练进度",
    sketch: "示意图",
    sum1: "太小：乌龟",
    sum2: "太大：弹飞",
    sum3: "刚好：很快到底",
    next: "更聪明的走法：第 67 章 Adam",
    example: "A 店 · 示意数据",
  },
};
