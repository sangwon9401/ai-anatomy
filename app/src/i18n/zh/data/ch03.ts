import type { ChapterSpec } from "../../../data/types";

export type Era = {
  year: string;
  title: string;
  desc: string;
  kind: "learn" | "rule" | "event" | "winter" | "star";
  step: string;
};

// Spacing on the scene is by order, not to scale; years are written on every card.
export const ERAS: Era[] = [
  { year: "1950", title: "图灵：机器能思考吗？", desc: "艾伦·图灵提出的问题", kind: "event", step: "s1" },
  { year: "1956", title: "“人工智能”这个名字诞生", desc: "美国达特茅斯会议", kind: "event", step: "s2" },
  { year: "1958", title: "感知机：会自己学习的机器", desc: "罗森布拉特。和第 16 章“一个神经元”原理相同", kind: "learn", step: "s2" },
  { year: "1970 年代", title: "第一次 AI 寒冬", desc: "连简单的问题都解决不了，期待落空", kind: "winter", step: "s3" },
  { year: "1980 年代", title: "专家系统", desc: "由人把规则一条条写进去的 AI", kind: "rule", step: "s3" },
  { year: "1986", title: "反向传播广为人知", desc: "训练多层神经网络的方法（第 23 章）", kind: "learn", step: "s4" },
  { year: "1990 年前后", title: "第二次 AI 寒冬", desc: "规则 AI 的局限暴露出来", kind: "winter", step: "s4" },
  { year: "1997", title: "深蓝战胜国际象棋世界冠军", desc: "靠规则和海量计算推算每一步棋", kind: "rule", step: "s4" },
  { year: "2012", title: "深度学习时代开启", desc: "神经网络在图片识别比赛中大胜", kind: "learn", step: "s5" },
  { year: "2016", title: "AlphaGo 战胜李世石九段", desc: "在首尔以 4 胜 1 负获胜", kind: "learn", step: "s5" },
  { year: "2017", title: "Transformer 发表", desc: "“Attention Is All You Need”（第 44 章）", kind: "star", step: "s6" },
  { year: "2018", title: "GPT-1", desc: "Generative Pre-trained Transformer", kind: "learn", step: "s6" },
  { year: "2020", title: "GPT-3", desc: "由 1750 亿个数字组成的模型", kind: "learn", step: "s6" },
  { year: "2022", title: "ChatGPT 发布", desc: "11 月 30 日。5 天用户就达到 100 万", kind: "star", step: "s7" },
];

export const ORDER_ITEMS = [
  { key: "turing", label: "图灵提出“机器能思考吗？”", year: "1950" },
  { key: "perceptron", label: "会自己学习的机器“感知机”问世", year: "1958" },
  { key: "deepblue", label: "深蓝战胜国际象棋世界冠军", year: "1997" },
  { key: "alphago", label: "AlphaGo 战胜李世石九段", year: "2016" },
  { key: "transformer", label: "Transformer 发表", year: "2017" },
  { key: "chatgpt", label: "ChatGPT 发布", year: "2022" },
];

export const ch03: ChapterSpec = {
  id: 3,
  part: 0,
  title: "AI 七十年时间线",
  core: false,
  hook: "AI 是和 ChatGPT 一起突然出现的吗？",
  steps: [
    { id: "s1", sec: 7, narration: "AI 不是突然冒出来的，它有 70 多年的故事。1950 年，艾伦·图灵问：“机器能思考吗？”" },
    { id: "s2", sec: 7, narration: "1956 年，“人工智能”这个名字诞生；1958 年，会自己学习的机器“感知机”问世。" },
    { id: "s3", sec: 8, narration: "可感知机连简单的问题都解决不了，期待落空，研究也冷了下来。这叫“AI 寒冬”。其间，靠人写规则的 AI 流行起来。" },
    { id: "s4", sec: 8, narration: "1986 年，训练神经网络的反向传播广为人知，但之后又是一段寒冬。1997 年，靠规则和计算的深蓝战胜了国际象棋世界冠军。" },
    { id: "s5", sec: 7, narration: "2012 年，神经网络在图片识别比赛中大胜，深度学习时代开启。2016 年，AlphaGo 战胜了李世石九段。" },
    { id: "s6", sec: 8, narration: "2017 年，谷歌团队发表了 Transformer，就是 GPT 的 T。第二年有了 GPT-⁠1，2020 年有了 1750 亿个数字的 GPT-⁠3。" },
    { id: "s7", sec: 7, narration: "然后是 2022 年 11 月 30 日，ChatGPT 发布，5 天就有 100 万人用。我们来一步步拆开这台机器吧。" },
  ],
  playgroundTitle: "给年表排顺序",
  playgroundIntro: "从最早发生的事开始，按顺序点一点。",
  summary: [
    "从 1950 年图灵的问题开始，延续了 70 多年的故事。",
    "期待和失望（AI 寒冬）反复交替，2012 年靠深度学习大步跃进。",
    "2017 年 Transformer → GPT → 2022 年 ChatGPT。",
  ],
  unlocks: "2017 Transformer",
  unlockLabel: "集齐了年表卡片",
  quiz: [
    {
      q: "ChatGPT 的“T”是哪个词的缩写？",
      choices: ["Talk", "Transformer", "Turing"],
      answer: 1,
      explain: "GPT = Generative Pre-trained Transformer。它用的是 2017 年发表的 Transformer 结构。",
      review: "s6",
    },
    {
      q: "“AI 寒冬”指的是什么？",
      choices: ["AI 只在冬天工作的时期", "期待落空、研究大幅减少的时期", "AI 用来预报天气的时期"],
      answer: 1,
      explain: "成果没有达到很高的期待，关注和研究经费都减少了。这样的时期有过两次。",
      review: "s3",
    },
    {
      q: "下面哪件事最早发生？",
      choices: ["AlphaGo 战胜李世石九段", "Transformer 发表", "ChatGPT 发布"],
      answer: 0,
      explain: "顺序是 AlphaGo 2016 年 → Transformer 2017 年 → ChatGPT 2022 年。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 3 章 AI 七十年时间线",
    learn: "学习",
    rule: "规则",
    winter: "寒冬",
    gpt: "GPT 的 T",
    note: "年份之间的间距不按真实比例",
  },
};
