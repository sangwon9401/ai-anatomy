import type { ChapterSpec } from "../../../data/types";

// The scene's word problem (a classic "fast answer is a trap" puzzle, in yuan: 11 元 / 10 元 → 0.5 元).
export const PROBLEM = ["面包和牛奶一共 11 元。", "面包比牛奶贵 10 元。", "牛奶多少钱？"];
// First-piece candidates when the model must answer at once. Illustrative probabilities (示意数据).
export const FAST = [
  { w: "1 元", p: 0.62, c: "pink" as const },
  { w: "0.5 元", p: 0.24, c: "mint" as const },
  { w: "10 元", p: 0.09, c: "sky" as const },
];
export const FAST_CHECK = ["牛奶 1 元的话，面包 11 元", "1 + 11 = 12 元", "≠ 11 元"];
export const THINK = ["设牛奶 x 元", "面包就是 x + 10 元", "x + (x + 10) = 11", "2x = 1，x = 0.5", "验算：0.5 + 10.5 = 11"];

export type Problem = {
  key: string;
  title: string;
  q: string;
  choices: string[];
  fast: string;
  fastCheck: string;
  steps: string[];
  answer: string;
};

/** Playground problems: each has a tempting fast answer and a short worked solution. */
export const PROBLEMS: Problem[] = [
  {
    key: "bread",
    title: "面包和牛奶",
    q: "面包和牛奶一共 11 元，面包比牛奶贵 10 元。牛奶多少钱？",
    choices: ["1 元", "0.5 元", "10 元"],
    fast: "1 元",
    fastCheck: "验算：牛奶 1 + 面包 11 = 12 元 ✗",
    steps: ["设牛奶 x 元，面包就是 x + 10 元。", "两个加起来：x + (x + 10) = 11。", "2x + 10 = 11，所以 2x = 1。", "x = 0.5。牛奶 0.5 元（5 角）。", "验算：牛奶 0.5 + 面包 10.5 = 11 元 ✓"],
    answer: "0.5 元",
  },
  {
    key: "machine",
    title: "玩具机器",
    q: "5 台机器 5 分钟做 5 个玩具。100 台机器做 100 个玩具，要几分钟？",
    choices: ["100 分钟", "5 分钟", "20 分钟"],
    fast: "100 分钟",
    fastCheck: "验算：100 分钟的话，100 台机器能做 2,000 个 ✗",
    steps: ["5 台机器 5 分钟做 5 个 → 1 台机器 5 分钟做 1 个。", "100 台机器同时干，5 分钟就做 100 个。", "所以是 5 分钟。", "验算：100 台 ×（每台 5 分钟 1 个）= 5 分钟 100 个 ✓"],
    answer: "5 分钟",
  },
  {
    key: "lotus",
    title: "池塘里的荷叶",
    q: "池塘里的荷叶每天增加一倍，第 48 天盖满了整个池塘。盖住一半是第几天？",
    choices: ["第 24 天", "第 47 天", "第 46 天"],
    fast: "第 24 天",
    fastCheck: "验算：第 24 天盖住一半的话，第二天（第 25 天）就盖满了 ✗",
    steps: ["荷叶每天增加一倍。", "那么盖满的前一天，正好是一半。", "第 48 天盖满，一半就是前一天：第 47 天。", "验算：第 47 天的量 × 2 = 第 48 天全满 ✓"],
    answer: "第 47 天",
  },
];

export const ch87: ChapterSpec = {
  id: 87,
  part: 10,
  title: "先思考再回答",
  core: true,
  hook: "给 AI 出难题时，它会显示“思考中…”。这段时间它在干什么？",
  steps: [
    { id: "s1", sec: 8, narration: "来做道题：面包和牛奶一共 11 元，面包比牛奶贵 10 元。牛奶多少钱？脑子里是不是冒出了 1 元？" },
    { id: "s2", sec: 8, narration: "把这道题交给模型，要求“只写答案”。它从第一个片段就得选答案，很容易抽中像样的“1 元”。" },
    { id: "s3", sec: 9, narration: "验算一下：牛奶 1 元，面包就是 11 元，合计 12 元。错了！写一个片段，模型只能算一遍（第 2 章）。" },
    { id: "s4", sec: 8, narration: "改用“我们一步一步来解”开头。设牛奶 x 元，面包就是 x + 10 元，合计 x + (x + 10) = 11。" },
    { id: "s5", sec: 9, narration: "于是 2x = 1，x = 0.5。牛奶 0.5 元！它边重读写好的行边写下一行，把难算的部分拆开算完了。" },
    { id: "s6", sec: 8, narration: "先写解题过程的方法叫思维链（chain of thought）。2022 年的研究发现，模型越大，效果越明显。" },
    { id: "s7", sec: 9, narration: "如今的“推理模型”靠训练学会了这件事。已知的一种做法：先写很长的解题过程，再给答对的过程加分（第 76 章）。" },
    { id: "s8", sec: 8, narration: "代价是要写很多片段，花的时间更长，而且解题过程本身也可能出错。重要的答案要自己验算。" },
  ],
  playgroundTitle: "直接答 vs 解完再答",
  playgroundIntro: "选一道题，先选出你自己的答案。然后比较模型直接回答和一行一行解完再回答有什么不同。",
  summary: [
    "只写答案的话，第一个片段就得选答案，容易出现像样的错误答案。",
    "先写解题过程，就能边重读写好的行，边把计算拆开来做（思维链）。",
    "推理模型被训练成先长时间思考再回答。代价是更慢，解题过程也需要验算。",
  ],
  unlocks: "写出解题过程",
  unlockLabel: "又得到一张新能力卡",
  quiz: [
    {
      q: "要求“只写答案”，为什么容易出错？",
      choices: ["模型故意答错", "第一个片段就直接写答案，没机会把计算拆开", "题目太长"],
      answer: 1,
      explain: "写一个片段能做的计算，只有模型运行一遍那么多（第 2 章）。写出解题过程，就能分好几次来算。",
      review: "s3",
    },
    {
      q: "思维链（chain of thought）是什么？",
      choices: ["回答前先把解题过程写出来", "多抽几次答案再挑一个", "把问题缩短"],
      answer: 0,
      explain: "一行一行写解题过程，边重读写好的行，边接着写下一行。",
      review: "s6",
    },
    {
      q: "解完再答的缺点是？",
      choices: ["答案总是错的", "答案变得太短", "要写很多片段，花时间更长，过程也可能出错"],
      answer: 2,
      explain: "片段有多少个，模型就要运行多少次（第 2 章）。解题过程也是按概率续写出来的，需要验算。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 87 章 先思考再回答",
    problem: "题目",
    first: "第一反应的答案是？",
    guess: "1 元？",
    askFast: "只写答案就行",
    model: "模型",
    firstPiece: "第一个片段就写答案",
    example: "* 示意数据",
    out: "答：1 元",
    check: "验算",
    wrong: "错了！",
    once: "1 个片段 = 模型运行 1 次（第 2 章）",
    onceMore: "一次能做的计算是有限的",
    askSlow: "我们一步一步来解",
    think: "解题过程（思考）",
    reread: "边重读写好的行",
    answer: "答：0.5 元",
    qBox: "问题",
    aBox: "答案",
    stepBox: "过程",
    rowFast: "直接答",
    rowCot: "解完再答",
    cot: "思维链（chain of thought）",
    cotNote: "2022 年的研究：模型越大，效果越明显",
    reasoning: "推理模型",
    since: "2024 年前后起",
    thinking: "思考中…",
    trained: "训练成先长时间思考再回答",
    trainA: "能核对答案的题目",
    trainB: "答对的过程加分 ↑（第 76 章）",
    known: "已知的方法之一",
    fastSide: "快，但容易错",
    slowSide: "慢，但擅长难题",
    pieces: "片段数 = 模型运行的次数（第 2 章）",
    verify: "过程也可能出错 → 重要答案要验算！",
  },
};
