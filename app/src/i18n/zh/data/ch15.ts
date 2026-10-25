import type { ChapterSpec } from "../../../data/types";

export const MATH = [55, 65, 70, 75, 85]; // mean 70, standard deviation 10
export const FIT = [11, 13, 14, 15, 17]; // mean 14, standard deviation 2

export const stats = (xs: number[]) => {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length);
  return { mean, sd };
};

export const DATASETS = [
  { key: "math", name: "数学成绩", xs: MATH },
  { key: "fit", name: "体测成绩", xs: FIT },
  { key: "wild", name: "参差不齐", xs: [3, 40, 12, 95, 60] },
];

export const TOOLS = ["变成数字", "向量", "距离", "点积", "矩阵", "矩阵乘法", "函数", "概率分布", "Softmax", "归一化"];

export const ch15: ChapterSpec = {
  id: 15,
  part: 1,
  title: "统一大小：归一化",
  core: false,
  hook: "满分 100 的考试和满分 20 的考试，谁考得更好？",
  steps: [
    { id: "s1", sec: 6, narration: "数学考试满分 100，体测满分 20。数字的大小不一样，直接比是比不了的。" },
    { id: "s2", sec: 8, narration: "所以要统一尺度。第一步，减去平均分。平均分的位置变成 0，一眼就能看出比平均高还是低。" },
    { id: "s3", sec: 8, narration: "第二步，除以分散的程度。分散程度就是统计里学的标准差。这样两种考试就用上了同一把尺子。" },
    { id: "s4", sec: 9, narration: "数学 85 分和体测 17 分，都比平均高出 1.5 个标准差，一样优秀。这样统一尺度，就叫归一化。" },
    { id: "s5", sec: 8, narration: "在 GPT 里，向量每经过一层，数字都可能越变越大或越变越小。所以每一层都要用归一化重新调整大小。" },
    { id: "s6", sec: 7, narration: "第 57 章要讲的层归一化就是它。叠上几十层，计算也不会乱掉。" },
    { id: "s7", sec: 7, narration: "减去平均，再除以分散程度。到这里，Part 1 的数学工具箱就齐了！" },
  ],
  playgroundTitle: "归一化机器",
  playgroundIntro: "选一组分数，依次按 ①、② 按钮。不管哪组数字，都会被调成差不多的大小。",
  summary: [
    "① 减去平均：平均的位置变成 0。",
    "② 除以标准差：分散程度统一成 1。",
    "GPT 每一层都做归一化，防止数字失控（第 57 章）。",
  ],
  unlocks: "归一化",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "分数 [60, 70, 80] 减去平均后是？",
      choices: ["[−10, 0, 10]", "[0, 10, 20]", "[60, 70, 80]"],
      answer: 0,
      explain: "平均是 70，每个数减去 70，就是 −10、0、10。",
      review: "s2",
    },
    {
      q: "归一化的两步是？",
      choices: ["减去平均，再除以标准差", "减去最大值，再除以 2", "全部加起来，再除以个数"],
      answer: 0,
      explain: "减去平均，让中心变成 0；除以标准差，让分散程度变成 1。",
      review: "s3",
    },
    {
      q: "GPT 为什么每一层都要做归一化？",
      choices: ["防止数字变得太大或太小", "为了减少词的数量", "为了更快给出答案"],
      answer: 0,
      explain: "经过几十层，数字可能失控，所以每层都要重新调整大小。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 15 章 统一大小：归一化",
    math: "数学（满分 100）",
    fit: "体测（满分 20）",
    hard: "直接比是比不了的",
    step1: "① 减去平均",
    step2: "② 除以标准差",
    mean: "平均",
    zero: "0 = 平均",
    sd: "标准差",
    same: "同一把尺子！",
    m85: "数学 85 分 → +1.5",
    f17: "体测 17 分 → +1.5",
    norm: "归一化",
    layer: "层",
    grow: "越往后越大",
    fix: "用归一化重新调整",
    ln: "层归一化（第 57 章）",
    done: "Part 1 数学工具箱齐了！",
  },
};
