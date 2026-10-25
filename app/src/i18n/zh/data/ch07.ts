import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Friend = { name: string; v: [number, number]; c: Highlighter };

// taste vectors: (辣味, 甜味), each 0–10. Reused in chapters 8 and 9.
export const FRIENDS: Friend[] = [
  { name: "小雨", v: [8, 3], c: "pink" },
  { name: "小杰", v: [2, 9], c: "mint" },
  { name: "小美", v: [7, 4], c: "sky" },
];

export const FLAVORS4 = [
  { name: "辣味", v: 8 },
  { name: "甜味", v: 3 },
  { name: "咸味", v: 5 },
  { name: "酸味", v: 2 },
];

export const ch07: ChapterSpec = {
  id: 7,
  part: 1,
  title: "向量：一串数字",
  core: true,
  hook: "我和朋友的口味有多像，能用数字表示出来吗？",
  steps: [
    { id: "s1", sec: 6, narration: "我们用数字写下口味：有多爱吃辣，从 0 到 10 打分；有多爱吃甜，也从 0 到 10。" },
    { id: "s2", sec: 7, narration: "小雨辣味 8、甜味 3，用括号括起来写成 (8, 3)。像这样按顺序排好的一串数字，就叫向量。" },
    { id: "s3", sec: 8, narration: "向量可以画成箭头。横轴是辣味，纵轴是甜味。从原点画一支箭头到 (8, 3)，就是小雨的口味。" },
    { id: "s4", sec: 7, narration: "小杰是 (2, 9)，小美是 (7, 4)。光看箭头的方向，就知道谁和谁口味相近。" },
    { id: "s5", sec: 8, narration: "格子越多就越详细。再加上咸味和酸味，就成了 4 个数字的向量。格子的个数叫作维度。" },
    { id: "s6", sec: 8, narration: "GPT 用一个很长的向量来表示一个词。GPT-⁠3 给每个词用 12288 个数字。画不出来，但原理一样。" },
    { id: "s7", sec: 6, narration: "向量就是一串有意思的数字。下一章，我们来量一量两个向量有多近。" },
  ],
  playgroundTitle: "我的口味箭头",
  playgroundIntro: "用滑块设定你的口味，箭头和向量会一起变化。",
  summary: [
    "向量：按顺序排好的一串数字，每一格都有意思。",
    "2 格的向量可以画成平面上的箭头。",
    "格子的个数 = 维度。GPT-3 的词向量有 12288 维。",
  ],
  unlocks: "向量",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "小雨的口味 (8, 3) 中，8 表示什么？",
      choices: ["辣味分数", "甜味分数", "小雨的年龄"],
      answer: 0,
      explain: "向量里格子的顺序很重要。我们规定第一格 = 辣味，第二格 = 甜味。",
      review: "s2",
    },
    {
      q: "(8, 3, 5, 2) 是几维向量？",
      choices: ["2 维", "4 维", "18 维"],
      answer: 1,
      explain: "有 4 个数字，所以是 4 维。和数字加起来是多少没有关系。",
      review: "s5",
    },
    {
      q: "GPT-3 用多少个数字来表示一个词？",
      choices: ["2 个", "100 个", "12288 个"],
      answer: 2,
      explain: "格子多得画不出来，但“一串数字”的原理完全一样。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 7 章 向量：一串数字",
    spicy: "辣味",
    sweet: "甜味",
    salty: "咸味",
    sour: "酸味",
    minji: "小雨",
    junho: "小杰",
    seoyeon: "小美",
    vector: "向量",
    origin: "原点",
    similar: "相近！",
    arrowSE: "↘",
    dims: "4 维向量",
    dimNote: "格子的个数 = 维度",
    noDraw: "4 维画不成箭头，但可以画成柱子",
    gpt: "GPT-3 里的一个词",
    count: "12288 个数字",
    same: "原理一样",
    sum: "向量 = 一串有意思的数字",
    word: "学校",
    examples: "(8,3) · (8,3,5,2) · (…12288个)",
  },
};
