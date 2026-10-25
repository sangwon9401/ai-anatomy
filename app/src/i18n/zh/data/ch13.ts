import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Dist = { key: string; name: string; items: { w: string; p: number; c: Highlighter }[] };

export const DISTS: Dist[] = [
  {
    key: "dice",
    name: "骰子",
    items: [1, 2, 3, 4, 5, 6].map((n) => ({ w: String(n), p: 1 / 6, c: "sky" as const })),
  },
  {
    key: "breakfast",
    name: "早餐",
    items: [
      { w: "包子", p: 0.55, c: "yellow" },
      { w: "面包", p: 0.25, c: "mint" },
      { w: "麦片", p: 0.15, c: "sky" },
      { w: "披萨", p: 0.05, c: "pink" },
    ],
  },
  {
    key: "flat",
    name: "平的分布",
    items: [
      { w: "甲", p: 0.28, c: "yellow" },
      { w: "乙", p: 0.26, c: "mint" },
      { w: "丙", p: 0.24, c: "sky" },
      { w: "丁", p: 0.22, c: "pink" },
    ],
  },
];

// fixed "random" draws for the s5 animation (mostly 包子, sometimes others)
export const DRAWS = ["包子", "包子", "面包", "包子", "麦片", "包子", "包子", "面包", "包子", "披萨", "包子", "面包"];

export const ch13: ChapterSpec = {
  id: 13,
  part: 1,
  title: "概率分布",
  core: false,
  hook: "“大概会下雨吧”，用数字该怎么说？",
  steps: [
    { id: "s1", sec: 6, narration: "掷骰子时，1 到 6 每个数出现的概率都是六分之一。这是初中学过的概率。" },
    { id: "s2", sec: 8, narration: "把每种结果的概率立成柱子，就是概率分布。所有柱子的高度加起来永远是 1，也就是 100%。" },
    { id: "s3", sec: 8, narration: "不是所有分布都这么均匀。早餐吃什么？包子的柱子高，披萨的柱子矮。这叫作尖的分布。" },
    { id: "s4", sec: 8, narration: "GPT 每一刻都会给出这样的分布。候选约有 5 万个片段，柱子也有 5 万根，但总和正好是 1。" },
    { id: "s5", sec: 9, narration: "从分布里抽一个时，柱子越高越容易被抽中。不过，矮的柱子偶尔也会被抽中。" },
    { id: "s6", sec: 8, narration: "分布越尖，回答越稳定；越平，回答越多样。第 81 章会用“温度”来调节它。" },
    { id: "s7", sec: 6, narration: "概率分布就是所有候选的可能性，总和为 1。第 14 章会学怎么把分数变成这样的分布。" },
  ],
  playgroundTitle: "抽签实验室",
  playgroundIntro: "选一个分布，多抽几次。抽得越多，抽中的比例就越接近概率。",
  summary: [
    "概率分布：给每个候选标上可能性，所有柱子加起来是 1。",
    "柱子越高越容易抽中，但矮柱子偶尔也会中。",
    "GPT 每次都给出约 5 万个候选的分布，再从中抽一个。",
  ],
  unlocks: "概率分布",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "掷骰子掷出 3 的概率是多少？",
      choices: ["1/6", "1/3", "3/6"],
      answer: 0,
      explain: "六个面出现的机会一样，所以各是 1/6。",
      review: "s1",
    },
    {
      q: "概率分布里所有柱子的高度加起来是多少？",
      choices: ["1（100%）", "候选的个数", "每次都不一样"],
      answer: 0,
      explain: "总有一个结果一定会发生，所以所有可能性加起来是 1。",
      review: "s2",
    },
    {
      q: "概率为 10% 的候选会怎样？",
      choices: ["永远不会被抽中", "偶尔会被抽中", "每次都被抽中"],
      answer: 1,
      explain: "大约 10 次中 1 次。概率再低，只要不是 0，就有可能被抽中。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 13 章 概率分布",
    dice: "骰子",
    sixth: "各 1/6",
    dist: "概率分布",
    total: "总和 = 1（100%）",
    breakfast: "早餐",
    peaked: "尖的分布",
    gpt: "GPT 的下一个片段分布",
    many: "约 5 万个候选，总和是 1",
    draw: "抽",
    count: "抽中次数",
    sometimes: "矮柱子偶尔也会中！",
    sharp: "尖 → 回答稳定",
    flat: "平 → 回答多样",
    temp: "第 81 章：用温度调节",
    sum: "概率分布 = 各候选的可能性，和为 1",
    next: "下一章：第 14 章 Softmax",
    go: "学校",
    went: "图书馆",
    late: "公园",
  },
};
