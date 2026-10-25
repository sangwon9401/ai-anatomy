import { UNLOCK6 } from "./ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKind } from "../../../data/part6-block";
import { PIPELINE } from "../../../data/ch05";
import type { ChapterSpec, Highlighter } from "../../../data/types";

// ---- the boss playground: round 1 builds the block, round 2 the whole blueprint ----
export type Card = { id: string; kind: string; name: string; color: Highlighter | null };
export type Slot = { kind: string; hint: string };

const BLOCK_HINT: Record<BlockKind, string> = {
  norm: "进入部件之前，要先统一数字的大小（第 57 章）。",
  att: "归一化之后，是让词与词互相看的部件（第 45 章）。",
  add: "部件算出的结果，要加回高速公路上原来的向量（第 56 章）。",
  ffn: "第二次归一化之后，是让每个词各自思考的部件（第 55 章）。",
};
export const BLOCK_SLOTS: Slot[] = BLOCK_ORDER.map((k) => ({ kind: kindOf(k), hint: BLOCK_HINT[kindOf(k)] }));
export const BLOCK_CARDS: Card[] = [
  ...BLOCK_ORDER.map((k, i) => ({ id: `b${i}`, kind: kindOf(k), name: KIND[kindOf(k)].name, color: KIND[kindOf(k)].color })),
  { id: "bx", kind: "softmax", name: "Softmax", color: "mint" },
];

const outer = (key: string) => PIPELINE.find((p) => p.key === key)!;
export const BLOCK_CARD_NAME = "Transformer 模块 × 96";
export const BP_SLOTS: Slot[] = [
  { kind: "tok", hint: "最先接收文字的部件，负责把文字切成小块（第 29 章）。" },
  { kind: "emb", hint: "把词元编号变成带着意思的数字的部件（第 33 章）。" },
  { kind: "pos", hint: "告诉模型这是第几个词元的部件（第 36 章）。" },
  { kind: "block", hint: "正中间是刚刚组装好的模块，叠了 96 层。" },
  { kind: "out", hint: "用最后的向量算出下一个词的概率的部件（第 60 章）。" },
  { kind: "loop", hint: "最后按概率抽出一个，接到句子末尾（第 1、2 章）。" },
];
export const BP_CARDS: Card[] = [
  ...["tok", "emb", "pos"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "block", kind: "block", name: BLOCK_CARD_NAME, color: "yellow" },
  ...["out", "loop"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "enc", kind: "encoder", name: "编码器（BERT）", color: "sky" },
];

export const DISTRACTOR_HINT: Record<string, string> = {
  softmax: "Softmax 不在模块里，而在设计图的最后，也就是输出那里（第 60 章）。",
  encoder: "GPT 只叠解码器模块。编码器是 BERT 那一边的（第 59 章）。",
};

/** A fixed shuffle, so every student sees the same tray (and it never starts in order). */
export function shuffled<T>(items: T[], seed = 11) {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const ch62: ChapterSpec = {
  id: 62,
  part: 6,
  title: "Part 6 Boss 战：设计图完成",
  core: false,
  hook: "部件都集齐了。能按正确的顺序组装起来，完成 GPT 吗？",
  steps: [
    { id: "s1", sec: 8, narration: "在 Part 6，我们把模块的部件一个个集齐了。现在把它们全部组装起来，完成设计图吧！" },
    { id: "s2", sec: 10, narration: "先从模块的一层开始。归一化 → 注意力 → 相加，再来一次归一化 → 前馈网络 → 相加。" },
    { id: "s3", sec: 8.5, narration: "把这个模块叠 96 层。多亏了高速公路和归一化，叠得再深也不会不稳。" },
    { id: "s4", sec: 8.5, narration: "前面是分词器、嵌入和位置信息，它们把文字变成向量送进来（Part 3）。" },
    { id: "s5", sec: 8.5, narration: "后面是输出 + Softmax，算出下一个词的概率，再抽出一个接到句子末尾。" },
    { id: "s6", sec: 8.5, narration: "设计图上机器的部分全部填好了！一个输入文字、就能说出下一个词的 GPT 完成了。" },
    { id: "s7", sec: 9.5, narration: "可是部件里的 1750 亿个数字还是一团乱。Part 7 要让这些数字好好学习，这就是预训练。" },
  ],
  playgroundTitle: "组装设计图",
  playgroundIntro: "把部件卡片拖到空格里，或者先点卡片、再点空格。先组装模块的一层，再组装整张设计图。里面还混着一张不相干的卡片。",
  summary: [
    "模块的一层：归一化 → 注意力 → 相加 → 归一化 → 前馈网络 → 相加。把它叠 96 层。",
    "设计图：分词器 → 嵌入 → 位置信息 → 模块 × 96 → 输出 + Softmax → 抽取并接上。",
    "机器完成了！接下来是让 1750 亿个数字好好学习的预训练（Part 7）。",
  ],
  unlocks: "完成的设计图",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "在模块的一层里，紧挨在注意力前面的部件是哪个？",
      choices: ["相加", "归一化", "前馈网络"],
      answer: 1,
      explain: "进入部件之前，先用归一化统一大小。GPT-2、GPT-3 都是这个顺序（第 57 章）。",
      review: "s2",
    },
    {
      q: "在设计图里，最先接收文字的部件是哪个？",
      choices: ["分词器", "嵌入", "输出 + Softmax"],
      answer: 0,
      explain: "分词器把文字切成小块，嵌入再把小块变成数字（第 29 章、第 33 章）。",
      review: "s4",
    },
    {
      q: "设计图全部组装好的 GPT，还剩下什么事要做？",
      choices: ["再装一个部件", "拿掉 Softmax", "让部件里的数字学习（预训练）"],
      answer: 2,
      explain: "机器的样子完成了，可数字一开始是一团乱。Part 7 会用预训练把它们改好（第 5 章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 62 章 Part 6 Boss 战：设计图完成",
    boss: "Part 6 Boss 战",
    got: "集齐的部件",
    oneLayer: "模块的一层",
    layers: "× 96 层",
    steady: "叠得再深也稳",
    road: "高速公路（第 56 章）",
    norm: "归一化（第 57 章）",
    front: "文字 → 向量（Part 3）",
    back: "下一个词的概率 → 抽取并接上",
    done: "完成！",
    input: "我 今天 去",
    output: "学校",
    mess: "一开始数字一团乱",
    next: "下一站：Part 7 预训练",
    nextSub: "让 1750 亿个数字好好学习",
  },
};
