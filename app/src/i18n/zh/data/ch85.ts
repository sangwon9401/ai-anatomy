import type { ChapterSpec } from "../../../data/types";

export type Ingredient = "角色" | "示例" | "分步骤" | "格式";
export const INGREDIENTS: Ingredient[] = ["角色", "示例", "分步骤", "格式"];

// Scene comparisons: the same request with and without one ingredient. Answers are illustrative (示意数据).
export type Compare = { ing: Ingredient; plain: string; plainAnswer: string; add: string; before?: boolean; goodAnswer: string; bad?: boolean };
export const COMPARES: Compare[] = [
  {
    ing: "角色",
    plain: "光合作用是什么？",
    plainAnswer: "光合作用是叶绿体利用光能，把二氧化碳和水转化为葡萄糖的过程。",
    add: "你是一位给小学生讲解的科学老师。",
    before: true,
    goodAnswer: "就是植物用阳光来“做饭”！把水和空气混在一起，做成吃的。",
  },
  {
    ing: "示例",
    plain: "带鱼 →",
    plainAnswer: "带鱼是一种身体又扁又长的海鱼，常见做法有红烧和油炸。",
    add: "苹果 → 水果 / 胡萝卜 → 蔬菜 /",
    before: true,
    goodAnswer: "鱼类",
  },
  {
    ing: "分步骤",
    plain: "8 箱苹果，每箱 12 个，其中 6 个坏了。剩下的苹果平分给 6 个人，每人几个？",
    plainAnswer: "16 个。",
    add: "请一步一步地算。",
    goodAnswer: "12 × 8 = 96 → 96 − 6 = 90 → 90 ÷ 6 = 15。每人 15 个。",
    bad: true,
  },
  {
    ing: "格式",
    plain: "把苹果、梨、黄瓜、胡萝卜分成水果和蔬菜。",
    plainAnswer: "苹果和梨是甜甜的水果，黄瓜和胡萝卜属于蔬菜。顺便说一下，黄瓜……",
    add: "只写两行：“水果：/ 蔬菜：”。",
    goodAnswer: "水果：苹果、梨 / 蔬菜：黄瓜、胡萝卜",
  },
];

// s1: first-chunk probabilities for "光合作用是什么？" without / with the role line (illustrative)
export const S1_BARS = [
  { w: "光合作用", a: 0.62, b: 0.18, c: "yellow" as const },
  { w: "植物", a: 0.21, b: 0.57, c: "mint" as const },
  { w: "阳光", a: 0.09, b: 0.12, c: "sky" as const },
];

// Part 9 toolbox for the wrap-up
export const TOOLS9 = ["贪心 · 采样", "温度", "Top-k · Top-p", "上下文窗口", "KV 缓存", "识破幻觉", "提示词原理"];

// playground: four prescriptions
export type Case = { goal: string; prompt: string; bad: string; right: Ingredient; add: string; good: string; why: string };
export const CASES: Case[] = [
  {
    goal: "让上小学的弟弟也能听懂",
    prompt: "光合作用是什么？",
    bad: "光合作用是叶绿体利用光能，把二氧化碳和水转化为葡萄糖的过程。",
    right: "角色",
    add: "你是一位给小学生讲解的科学老师。",
    good: "就是植物用阳光来“做饭”！把根喝进去的水和空气混在一起，做成吃的。",
    why: "把角色写在前面，像那位老师会写的话就成了最像样的续写。下一个片段的概率会偏向浅显的说法（第 1 章）。",
  },
  {
    goal: "计算不出错",
    prompt: "8 箱苹果，每箱 12 个，其中 6 个坏了。剩下的苹果平分给 6 个人，每人几个？",
    bad: "16 个。",
    right: "分步骤",
    add: "请一步一步地算。",
    good: "① 12 × 8 = 96 个  ② 96 − 6 = 90 个  ③ 90 ÷ 6 = 15 个。每人 15 个。",
    why: "写下来的中间计算会再次成为输入（第 2 章）。一步一步算对，比一下子猜中答案容易得多。第 87 章还会细讲。",
  },
  {
    goal: "按规定的格式",
    prompt: "把苹果、梨、黄瓜、胡萝卜分成水果和蔬菜。",
    bad: "苹果和梨是甜甜的水果，黄瓜和胡萝卜属于蔬菜。顺便说一下，黄瓜……",
    right: "格式",
    add: "只写两行：“水果：○○ / 蔬菜：○○”。",
    good: "水果：苹果、梨\n蔬菜：黄瓜、胡萝卜",
    why: "定好了框架，符合框架的片段就最像样。“水果：”后面就该轮到水果名了嘛。",
  },
  {
    goal: "按我想要的规律",
    prompt: "亮",
    bad: "“亮”的意思是光线充足。例：房间很亮。",
    right: "示例",
    add: "大 → 小\n快 → 慢\n亮 →",
    good: "暗",
    why: "给出示例，模型就会找出规律接着写。这就是第 71 章的上下文学习，规律不用讲出来。",
  },
];
export const WHAT_IT_DOES: Record<Ingredient, string> = {
  角色: "角色会改变语气和难度。",
  示例: "示例展示要模仿的规律。",
  分步骤: "分步骤让它把中间过程一步步写出来。",
  格式: "格式决定答案的样子（几行、什么框架）。",
};

export const ch85: ChapterSpec = {
  id: 85,
  part: 9,
  title: "懂了结构就看懂提示词",
  core: false,
  hook: "同样的事，换个问法，回答就不一样了，这是为什么？",
  steps: [
    { id: "s1", sec: 9, narration: "提示词是模型要接着写的那段开头（第 1 章）。开头一变，下一个片段的概率也会变。所以怎么问很重要。" },
    { id: "s2", sec: 8, narration: "第一，角色。在前面写上“给小学生讲解的老师”，那种老师会说的浅显话语就变得最像样。" },
    { id: "s3", sec: 8, narration: "第二，示例。给出“苹果 → 水果，胡萝卜 → 蔬菜”，模型就照着写下去：上下文学习（第 71 章）。" },
    { id: "s4", sec: 8, narration: "第三，分步骤。让它把中间计算写出来，写下的计算又成为输入（第 2 章），答案就更容易算对。" },
    { id: "s5", sec: 8, narration: "第四，格式。给出“水果：/ 蔬菜：”这样的框架，符合框架的话最像样，答案的样子就定下来了。" },
    { id: "s6", sec: 8, narration: "这四招都不是魔法咒语，只是改变开头，从而改变下一个片段的概率。需要的信息也要亲自写进去。" },
    { id: "s7", sec: 9, narration: "Part 9 完！挑选、温度、剪尾巴、记忆窗口、幻觉、提示词都到手了。下面看 ChatGPT 之后的 AI。" },
  ],
  playgroundTitle: "提示词处方",
  playgroundIntro: "AI 的回答有四处不尽如人意。从角色、示例、分步骤、格式里挑一个合适的要素，改一改提示词。",
  summary: [
    "提示词 = 模型要接着写的开头。开头一变，下一个片段的概率就变。",
    "角色决定语气和难度，示例决定规律，格式决定答案的样子。",
    "让它分步骤写，写下的计算又成为输入，答案更容易算对。",
  ],
  unlocks: "提示词原理",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "加上“你是给小学生讲解的老师”，回答就变浅显了，原因是？",
      choices: ["接在这种话后面的浅显说法，概率变高了", "模型当场重新学了一遍小学课本", "模型故意把知识藏了起来"],
      answer: 0,
      explain: "模型并没有重新学习。是开头变了，下一个片段的概率跟着变了。",
      review: "s2",
    },
    {
      q: "“大 → 小，快 → 慢，亮 →”后面会出现“暗”，这是靠什么？",
      choices: ["调高了温度", "上下文窗口满了", "用示例展示规律的上下文学习"],
      answer: 2,
      explain: "只要给出示例，模型就会顺着规律写下去（第 71 章）。",
      review: "s3",
    },
    {
      q: "“请一步一步地算”对计算题有帮助，原因是？",
      choices: ["模型偷偷用了计算器", "写下的中间计算再次成为输入，下一个片段更容易猜对", "答案变短了"],
      answer: 1,
      explain: "多亏了自回归（第 2 章），它能看着前面写下的计算，接着算下一步。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第 85 章 懂了结构就看懂提示词",
    prompt: "提示词",
    model: "模型",
    is: "提示词 = 模型要接着写的开头",
    next: "下一个片段的概率",
    example: "示意数据",
    first: "第一",
    second: "第二",
    third: "第三",
    fourth: "第四",
    plain: "直接问",
    withIt: "加上要素",
    roleNote: "那种人会说的话变得最像样",
    exampleNote: "看着规律接着写（第 71 章）",
    stepNote: "写下的计算又成为输入（第 2 章）",
    formatNote: "符合框架的话变得最像样",
    markO: "○",
    markX: "×",
    change: "开头变了",
    then: "下一片段的概率变了（第 1 章）",
    notMagic: "不是魔法咒语！是给个好开头",
    info: "需要的信息要亲自写进去（第 83、84 章）",
    done: "Part 9 推理工具箱完成！",
    nextPart: "下一站：Part 10 ChatGPT 之后的世界",
    nextCh: "第 86 章 长了眼睛的 AI",
    ai: "AI",
    w1: "光合作用",
    w2: "植物",
    w3: "阳光",
    roleAdd: "你是一位给小学生讲解的科学老师。",
  },
};
