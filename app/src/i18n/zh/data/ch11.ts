import type { ChapterSpec } from "../../../data/types";

export type M2 = [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]

export const apply = (m: M2, v: [number, number]): [number, number] => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
export const lerpM = (a: M2, b: M2, t: number): M2 => a.map((x, i) => x + (b[i] - x) * t) as M2;

export const I2: M2 = [1, 0, 0, 1];
export const WORKED: { m: M2; v: [number, number] } = { m: [2, 1, 0, 1], v: [1, 2] };

export const PRESETS: { key: string; m: M2 }[] = [
  { key: "stretch", m: [2, 0, 0, 1] },
  { key: "rotate", m: [0, -1, 1, 0] },
  { key: "shear", m: [1, 1, 0, 1] },
  { key: "flip", m: [-1, 0, 0, 1] },
];

export const ch11: ChapterSpec = {
  id: 11,
  part: 1,
  title: "矩阵乘法 = 空间变换",
  core: true,
  hook: "把矩阵乘到向量上，会发生什么？",
  steps: [
    { id: "s1", sec: 6, narration: "把矩阵和一个向量相乘试试，会得到一个新的向量。" },
    { id: "s2", sec: 9, narration: "计算用的是第 9 章的点积：矩阵第一行与向量的点积是结果的第一格，第二行与向量的点积是第二格。" },
    { id: "s3", sec: 8, narration: "画成图是这样：给方格纸上的每个点都乘上同一个矩阵，整个空间就被横向拉长了。" },
    { id: "s4", sec: 9, narration: "换一个矩阵，变形的方式也跟着变。它可以让空间旋转，也可以把空间斜着推歪。" },
    { id: "s5", sec: 7, narration: "不管是什么矩阵，直线变完还是直线，原点也留在原地。这种变换叫作线性变换。" },
    { id: "s6", sec: 8, narration: "GPT 把矩阵乘到词向量上，让意义空间变来变去。注意力的 Query、Key、Value 也靠矩阵乘法得到。" },
    { id: "s7", sec: 6, narration: "矩阵乘法是改变空间的机器。决定机器里的数字，正是 AI 的学习。" },
  ],
  playgroundTitle: "空间变换机",
  playgroundIntro: "改一改矩阵的四个数字，或者点按钮，看看整张方格纸怎么变。",
  summary: [
    "矩阵 × 向量 = 新向量。每一格都是“矩阵的一行 · 向量”的点积。",
    "给所有点乘同一个矩阵，空间会被拉伸、旋转、推斜。",
    "直线还是直线，原点不动（线性变换）。GPT 的每一层也在做矩阵乘法。",
  ],
  unlocks: "矩阵乘法",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "矩阵 [[1, 0], [0, 3]] 乘向量 (2, 1)，结果是？",
      choices: ["(2, 3)", "(3, 2)", "(2, 1)"],
      answer: 0,
      explain: "第一行 (1, 0)·(2, 1) = 2，第二行 (0, 3)·(2, 1) = 3，所以是 (2, 3)。",
      review: "s2",
    },
    {
      q: "把矩阵 [[2, 0], [0, 1]] 乘到所有点上，空间会怎样？",
      choices: ["横向拉长 2 倍", "纵向拉长 2 倍", "保持不变"],
      answer: 0,
      explain: "只有横坐标变成 2 倍，纵坐标不变。",
      review: "s3",
    },
    {
      q: "在线性变换中，什么永远不变？",
      choices: ["原点的位置", "所有点的位置", "所有箭头的长度"],
      answer: 0,
      explain: "原点乘上任何矩阵都还是 (0, 0)。直线也仍然是直线。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 11 章 矩阵乘法 = 空间变换",
    times: "矩阵 × 向量 = 新向量",
    row1: "第 1 行 · 向量",
    row2: "第 2 行 · 向量",
    stretch: "拉伸",
    rotate: "旋转",
    shear: "推斜",
    flip: "翻转",
    every: "每个点都乘同一个矩阵",
    straight: "直线还是直线",
    origin: "原点不动",
    linear: "线性变换",
    gpt: "词向量 × 矩阵",
    newSpace: "意义空间变了",
    qkv: "Query、Key、Value 也靠矩阵乘法（第 46 章）",
    learn: "矩阵里的数字 = 靠学习决定",
    sum: "矩阵乘法 = 改变空间的机器",
    cat: "猫",
    dog: "狗",
    car: "汽车",
  },
};
