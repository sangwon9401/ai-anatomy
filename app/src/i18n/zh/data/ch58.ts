import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "../../../data/types";

export const MODELS = [
  { name: "GPT-1", year: "2018", layers: 12 },
  { name: "GPT-2", year: "2019", layers: 48 },
  { name: "GPT-3", year: "2020", layers: 96 },
];

// GPT-3: per block, attention 4·d² + feed-forward 8·d² weights (d = 12,288)
export const PER_LAYER = 12 * 12288 * 12288; // 1,811,939,328 ≈ 18 亿
export const ALL_LAYERS = PER_LAYER * 96; // 173,946,175,488 ≈ 1740 亿 (of 1750 亿)

/** What the vector of “去” carries at each depth (示意数据, a rough picture of what research finds). */
export const DEPTH_NOTES = [
  { layer: 1, note: "“去”这个字本身", band: "shallow" },
  { layer: 24, note: "“去” = 动作，往某处移动", band: "shallow" },
  { layer: 48, note: "去的人是“我”", band: "middle" },
  { layer: 72, note: "是今天发生的事", band: "deep" },
  { layer: 96, note: "下一个该接地点，比如学校", band: "deep" },
] as const;

/** Peeking at the next-word guess after each depth (示意数据; the last one is the course's 52%). */
export const PEEK_LAYERS = [1, 12, 24, 48, 72, 96];
export const PEEK = [
  { w: "学校", c: "yellow" as const, p: [2, 4, 9, 27, 44, 52] },
  { w: "图书馆", c: "mint" as const, p: [2, 5, 12, 22, 22, 21] },
  { w: "公园", c: "sky" as const, p: [1, 2, 4, 9, 12, 12] },
  { w: "披萨", c: "pink" as const, p: [3, 3, 2, 1, 1, 1] },
];

/** Linear blend of the PEEK numbers at any layer 1–96. */
export function peekAt(layer: number) {
  let i = PEEK_LAYERS.findIndex((l) => l >= layer);
  if (i <= 0) i = 1;
  const a = PEEK_LAYERS[i - 1];
  const b = PEEK_LAYERS[i];
  const t = Math.max(0, Math.min(1, (layer - a) / (b - a)));
  return PEEK.map((r) => ({ ...r, now: r.p[i - 1] + (r.p[i] - r.p[i - 1]) * t }));
}

export const ch58: ChapterSpec = {
  id: 58,
  part: 6,
  title: "把模块叠起来",
  core: false,
  hook: "一个模块就能运转，为什么要叠 96 个？",
  steps: [
    { id: "s1", sec: 8.5, narration: "模块进去什么形状，出来还是什么形状。所以可以像搭乐高一样，在下面一直接上新的模块。" },
    { id: "s2", sec: 8.5, narration: "GPT-1 有 12 层，GPT-2 有 48 层，GPT-3 有 96 层。都是把同一种模块设计反复叠起来。" },
    { id: "s3", sec: 8, narration: "形状虽然一样，每一层里的数字却不同。所以每一层负责的工作也各不相同。" },
    { id: "s4", sec: 9.5, narration: "浅层主要处理词的样子和紧挨着的词，中间层处理词在句子里的角色和关系。" },
    { id: "s5", sec: 9.5, narration: "越深的层，越多处理整句话的意思和下一个该说什么。同一个“去”上，信息一层层累积起来。" },
    { id: "s6", sec: 9, narration: "如果在每一层都偷看一下对下一个词的猜测，会发现越往深处，“学校”的概率越高。" },
    { id: "s7", sec: 9.5, narration: "GPT-3 的一层模块里约有 18 亿个数字。96 层加起来约 1740 亿个，几乎就是 1750 亿的全部。" },
    { id: "s8", sec: 9, narration: "能叠得这么深，多亏了高速公路和归一化。下一章来看模块的两种用法。" },
  ],
  playgroundTitle: "逐层探险",
  playgroundIntro: "用滑块一层层往下走。看看“去”的向量里累积了什么，对下一个词的预测又怎样变化。",
  summary: [
    "模块进去什么形状，出来还是什么形状，所以可以一直叠。GPT-1 12 层，GPT-2 48 层，GPT-3 96 层。",
    "设计虽然一样，每层的数字却不同，所以浅层和深层负责的工作不一样。",
    "越往深处，词向量里累积的上下文和下一个词的信息越多。GPT-3 几乎所有的数字都在模块里。",
  ],
  unlocks: "叠模块",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "GPT-3 叠了多少层 Transformer 模块？",
      choices: ["12 层", "48 层", "96 层"],
      answer: 2,
      explain: "GPT-1 有 12 层，GPT-2 有 48 层，GPT-3 有 96 层。",
      review: "s2",
    },
    {
      q: "把模块叠成很多层时，每一层都一样的是什么？",
      choices: ["模块的设计（形状）", "模块里的数字", "这一层负责的工作"],
      answer: 0,
      explain: "设计一样，里面的数字每层分别训练。所以负责的工作会不同。",
      review: "s3",
    },
    {
      q: "越往深层走，“去”的向量会发生什么？",
      choices: ["信息一点点被抹掉", "累积起整句话的意思和下一个词的信息", "只剩下字形的信息"],
      answer: 1,
      explain: "每经过一层，结果就加上去一次（第 56 章），上下文的信息就这样累积起来。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 58 章 把模块叠起来",
    att: "注意力",
    ffn: "前馈网络",
    // U+202F (narrow no-break space): "1 层" must not wrap in the 60 px layer labels of s3
    layer: "\u202F层",
    dots: "⋮",
    same: "同样的形状，原样接下去",
    design: "同一种设计，反复使用",
    shape: "形状一样",
    nums: "数字每层不同",
    word: "去",
    shallow: "浅层",
    middle: "中间层",
    deep: "深层",
    toy: "示意数据",
    rough: "大致是这样的趋势",
    peek: "在每一层偷看一下下一个词",
    gan: "学校",
    perLayer: "一层模块：约 18 亿个",
    times: "× 96 层 = 约 1740 亿个",
    total: "GPT-3 总共 1750 亿个",
    almost: "几乎全部！",
    thanks: "能叠得深的秘诀",
    road: "高速公路（第 56 章）",
    norm: "归一化（第 57 章）",
    next: "下一章：第 59 章 编码器 vs 解码器",
    w1: "我",
    w2: "今天",
    w3: "去",
  },
};
