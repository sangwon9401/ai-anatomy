import type { ChapterSpec, Highlighter } from "../../../data/types";

export const SCORES: { w: string; s: number; c: Highlighter }[] = [
  { w: "学校", s: 3, c: "yellow" },
  { w: "图书馆", s: 2, c: "mint" },
  { w: "公园", s: 1, c: "sky" },
  { w: "披萨", s: -1, c: "pink" },
];

export const softmax = (xs: number[]) => {
  const ex = xs.map((x) => Math.exp(x));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { ex, sum, p: ex.map((e) => e / sum) };
};

export const ch14: ChapterSpec = {
  id: 14,
  part: 1,
  title: "把分数变成概率：Softmax",
  core: true,
  hook: "模型打的分数可以是负数，加起来也不一定是 1。怎样把它们变成概率？",
  steps: [
    { id: "s1", sec: 6, narration: "模型会给下一个词的每个候选打分。分数可以是 3，也可以是 −1 这样的负数。" },
    { id: "s2", sec: 7, narration: "可是概率不能小于 0，全部加起来还必须等于 1。现在既有负数，总和又是 5。" },
    { id: "s3", sec: 8, narration: "第一步：算 e 的“分数”次方。e 是约等于 2.718 的一个数。这样一来，所有值都变成了正数。" },
    { id: "s4", sec: 7, narration: "还有个附带效果：大的分数会变得更大。3 分原来是 2 分的 1.5 倍，变完后约是 2.7 倍。" },
    { id: "s5", sec: 8, narration: "第二步：把变换后的值全部加起来，得到 30.56。再用每个值除以这个总和。" },
    { id: "s6", sec: 8, narration: "这样就得到了概率：学校 65.7%，图书馆 24.2%，公园 8.9%，披萨 1.2%。加起来正好 100%。" },
    { id: "s7", sec: 8, narration: "这两步合起来就是 Softmax。第 45 章的注意力还会用到它，一定要记住哦。" },
  ],
  playgroundTitle: "分数调节室",
  playgroundIntro: "用滑块改一改分数，马上就能看到概率怎么变。",
  summary: [
    "分数（logit）可以是负数，加起来也不一定是 1。",
    "① 变成 e 的次方：全部变成正数，大的分数变得更大。",
    "② 除以总和就成了概率。这两步合起来就是 Softmax。",
  ],
  unlocks: "Softmax",
  quiz: [
    {
      q: "Softmax 第一步用 e 的次方，最主要的原因是？",
      choices: ["让所有值都变成正数", "让计算更快", "把分数变成整数"],
      answer: 0,
      explain: "e 的次方永远是正数，顺带还会把大的分数放得更大。",
      review: "s3",
    },
    {
      q: "如果分数是 [2, 2, 2]，每个候选的概率是多少？",
      choices: ["2", "约 33.3%", "约 66.7%"],
      answer: 1,
      explain: "分数一样，eˣ 也一样，三个候选平分。",
      review: "s6",
    },
    {
      q: "给所有分数都加上 5，概率会怎样？",
      choices: ["全部变大", "保持不变", "只有第一名变大"],
      answer: 1,
      explain: "所有 eˣ 都变成原来的 e⁵ 倍，除以总和时这个倍数被约掉了。只有分数之间的差距才重要。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第 14 章 把分数变成概率：Softmax",
    axis: "分数",
    neg: "负概率？",
    sum: "3 + 2 + 1 − 1 = 5",
    notOne: "≠ 1",
    e: "e ≈ 2.718",
    eLater: "以后的数学课上还会见到它",
    ratioA: "分数：3 vs 2 → 1.5 倍",
    ratioB: "：20.09 vs 7.39 →",
    ratioB2: "约 2.7 倍",
    bigger: "大的变得更大！",
    total: "共 100%",
    fTitle: "Softmax",
    fLeft: "我的概率",
    fMine: "我的分数",
    fAll: "所有",
    fSum: "之和",
    step1: "① 变成 e 的次方：全部为正，大的更大",
    step2: "② 除以总和：总和正好是 1",
    seeYou: "第 45 章的注意力里再见",
  },
};
