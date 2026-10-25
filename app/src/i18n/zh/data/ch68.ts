import type { ChapterSpec } from "../../../data/types";

export const MA = [
  [1, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 2, 1],
  [3, 1, 0, 2],
];
export const MB = [
  [2, 0, 1, 1],
  [1, 3, 0, 2],
  [0, 1, 2, 0],
  [1, 2, 1, 3],
];
export const matmul = (a: number[][], b: number[][]) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
export const MC = matmul(MA, MB);

/** The cell picked out in the scene: row 2, column 3 (0-based 1, 2). */
export const PICK = { i: 1, j: 2 };
export const pickTerms = () => MA[PICK.i].map((a, k) => `${a}×${MB[k][PICK.j]}`).join(" + ");

/** GPT-3's attention matrices are d_model × d_model = 12,288 × 12,288 (canonical d_model). */
export const D_MODEL = 12288;
export const GPT3_CELLS = D_MODEL * D_MODEL;

// 示意数据 speeds for the race
export const CALC_RATE = 20; // one fast calculator: 20 cells per second
export const STUDENT_RATE = 1; // one student: 1 cell per second
export const STUDENTS = 10000;
export const calcTime = (cells: number) => cells / CALC_RATE;
export const studentTime = (cells: number, students = STUDENTS) => Math.ceil(cells / students) / STUDENT_RATE;
export const RACE_CELLS = 10000;

export const ch68: ChapterSpec = {
  id: 68,
  part: 7,
  title: "为什么是 GPU？",
  core: false,
  hook: "AI 公司为什么不买普通电脑，而是大量购买“显卡”？",
  steps: [
    { id: "s1", sec: 10, narration: "GPT 的计算大部分是矩阵乘法（第 11 章）。GPT-3 光是一层，就有好几个 12,288 × 12,288 的矩阵。" },
    { id: "s2", sec: 10, narration: "先拿两个小小的 4 × 4 矩阵来乘一乘。结果有 16 格，每一格都是一行和一列相乘再相加（第 9 章）。" },
    { id: "s3", sec: 10, narration: "把 CPU 想成一台非常快的计算器。它一格一格按顺序填，16 格就要排 16 次队。" },
    { id: "s4", sec: 10, narration: "可是这些格子根本不用互相等。每一格只要有自己的那一行和那一列，马上就能算。" },
    { id: "s5", sec: 9, narration: "GPU 是几千台简单的计算器。就像 1 万名学生每人负责一格，所有格子一起填好。" },
    { id: "s6", sec: 11, narration: "示意：计算器每秒填 20 格，学生每秒填 1 格。1 万格的话，计算器要 500 秒，1 万名学生只要 1 秒！" },
    { id: "s7", sec: 11, narration: "所以大 AI 要连起几千块 GPU 来训练。Transformer 一次算完所有词，和 GPU 天生一对（第 41 章）。" },
  ],
  playgroundTitle: "计算赛跑",
  playgroundIntro: "选好矩阵大小和学生人数，出发！一台快速计算器和一群学生，谁先填满所有格子？",
  summary: [
    "矩阵乘法结果里的每一格，都是“一行 · 一列”的计算，彼此不用等。",
    "CPU = 几台快速计算器按顺序算，GPU = 几千台简单计算器同时算。",
    "格子越多，GPU 越占优势。所以 AI 训练要用 GPU。",
  ],
  unlocks: "GPU 并行计算",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "两个 4 × 4 矩阵相乘，结果有多少格？",
      choices: ["8 格", "16 格", "4 格"],
      answer: 1,
      explain: "结果也是 4 × 4 矩阵，所以有 16 格。每一格都是一行和一列相乘再相加。",
      review: "s2",
    },
    {
      q: "GPU 做矩阵乘法为什么快？",
      choices: ["把格子分开，同时计算", "一台计算器特别聪明", "跳过了一部分计算"],
      answer: 0,
      explain: "每一台都很简单，但几千台同时分头填格子。",
      review: "s5",
    },
    {
      q: "矩阵乘法结果里的格子，为什么能同时计算？",
      choices: ["因为结果全都一样", "因为要先有前一格的答案，才能算下一格", "因为每一格只需要自己的那一行和那一列"],
      answer: 2,
      explain: "没有哪一格要用到别的格子的答案。所以不用等，可以一起算。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第 68 章 为什么是 GPU？",
    gpt3Layer: "GPT-3 一层里的一个矩阵",
    size: "12,288 × 12,288",
    cells: "约 1.5 亿格",
    times: "×",
    equals: "=",
    cellCount: "结果有 16 格",
    rowCol: "一行 · 一列 = 一格",
    cpu: "CPU：一台快速计算器",
    turn: "进度",
    wait: "要排 16 次队",
    noWait: "彼此不用等！",
    onlyNeeds: "只要有自己的行 + 列就行",
    gpu: "GPU：几千台简单计算器",
    allAtOnce: "所有格子一起填！",
    example: "示意数据",
    task: "填满 1 万格",
    calc: "1 台计算器（每秒 20 格）",
    students: "1 万名学生（每人每秒 1 格）",
    sec1: "1 秒",
    sec500: "500 秒（约 8 分钟）",
    done: "完成！",
    ff: "快进 ▶▶",
    sec: "秒",
    many: "把几千块 GPU 连起来",
    gpuChip: "GPU",
    sentence: "我 今天 去 学校",
    together: "Transformer：所有词一次算完（第 41 章）",
    next: "第 69 章：GPT 变大了多少？",
  },
};
