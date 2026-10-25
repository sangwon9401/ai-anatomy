import { NEURON, STORES, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** A 店, B 店, C 店 scored by the 16章 neuron: prediction, real 评分, error */
export const GRADED = STORES.slice(0, 3).map((s) => {
  const pred = neuron(s.x, NEURON.w, NEURON.b);
  return { name: s.name, pred, real: s.real, err: pred - s.real };
});
export const ERR_SUM = GRADED.reduce((a, g) => a + g.err, 0);
export const SQ_SUM = GRADED.reduce((a, g) => a + g.err ** 2, 0);
export const MSE = SQ_SUM / GRADED.length;

export const ch20: ChapterSpec = {
  id: 20,
  part: 2,
  title: "错了多少：损失",
  core: true,
  hook: "知道 AI 错了，可是错了“多少”，要怎么量？",
  steps: [
    { id: "s1", sec: 8, narration: "第 16 章的神经元预测 A 店是 3.5 分。可朋友们吃过之后打的真实评分是 4.5 分。" },
    { id: "s2", sec: 8, narration: "错的程度，就是箭和靶心之间的距离。预测减答案：3.5 − 4.5 = −1，少猜了 1 分。" },
    { id: "s3", sec: 9, narration: "给三家店打打分：A 是 −1，B 是 +1，C 是 −0.5。直接相加是 −0.5，看起来几乎没错。" },
    { id: "s4", sec: 8.5, narration: "为了去掉正负号，把误差平方。用绝对值也可以，但平方会把错得多的罚得更重。" },
    { id: "s5", sec: 8, narration: "平方的平均是 2.25 ÷ 3 = 0.75。这一个数就是损失（loss）。损失是 0，就表示全对。" },
    { id: "s6", sec: 9, narration: "GPT 猜的不是评分，而是下一个词。所以要看它给正确的词分了多少概率来打分。第 65 章会学到。" },
    { id: "s7", sec: 7, narration: "现在有目标了：找到让损失接近 0 的旋钮。怎么找，第 21 章见。" },
  ],
  playgroundTitle: "打分机器",
  playgroundIntro: "用滑块移动三家店的预测评分（箭）。离靶心（真实评分）的距离、它的平方，还有损失，都会马上算出来。",
  summary: [
    "误差 = 预测 − 答案。直接相加的话，正负会互相抵消。",
    "所以先平方（或取绝对值），再求平均，这一个数就是损失。",
    "损失 0 = 全对。学习 = 找让损失变小的旋钮。GPT 的损失见第 65 章。",
  ],
  unlocks: "损失（loss）",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "预测 2 分，答案 5 分，平方误差是多少？",
      choices: ["3", "9", "−3"],
      answer: 1,
      explain: "误差是 2 − 5 = −3，平方后是 (−3)² = 9。",
      review: "s4",
    },
    {
      q: "为什么不直接把误差相加，而要先平方？",
      choices: ["让正负不会互相抵消", "为了算得快", "让损失变成负数"],
      answer: 0,
      explain: "−1 和 +1 直接相加是 0，看起来就像完全没错。平方后两个都是 1。",
      review: "s3",
    },
    {
      q: "损失是 0，表示什么？",
      choices: ["模型还没开始算", "所有预测都和答案一样", "所有预测都是 0"],
      answer: 1,
      explain: "误差全是 0，平方的平均才会是 0。损失越小越好。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 20 章 错了多少：损失",
    titleA: "猜 A 店的评分",
    title3: "给三家店打分",
    example: "示意数据",
    pred: "预测",
    real: "真实评分",
    gap: "差 1 分",
    errFormula: "预测 − 答案 = 3.5 − 4.5 = −1",
    star: "评分",
    sum: "直接相加：−1 + 1 − 0.5 = −0.5",
    looks: "看起来几乎没错？！",
    err: "误差",
    square: "平方",
    sqSum: "平方和：1 + 1 + 0.25 = 2.25",
    big: "错得越多，平方后越大",
    mean: "平均：2.25 ÷ 3 = 0.75",
    loss: "损失（loss）= 0.75",
    zero: "0 就是全对",
    gptTitle: "GPT 怎么打分",
    sentence: "我今天去",
    answer: "正确答案：学校",
    gave: "给正确答案的概率",
    ce: "交叉熵（第 65 章）",
    surprise: "按“惊讶程度”打分",
    goal1: "损失 = 用一个数表示错了多少",
    goal2: "学习 = 让损失接近 0",
    how: "怎么做？→ 第 21 章 梯度下降",
  },
};
