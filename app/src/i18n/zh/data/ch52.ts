import type { ChapterSpec, Highlighter } from "../../../data/types";

/**
 * 示意数据: three made-up heads on 我 今天 去 学校 (with the causal mask, ch51). zh: the third head asks 做什么？ (the
 * action, 去) where the Korean one asked 어디로? (to where, 학교에); the numbers are unchanged.
 * Each map is in percent, row = the word looking, column = the word looked at; every row adds up to 100.
 */
export const HEADS52: { name: string; ask: string; target: number; c: Highlighter; map: number[][] }[] = [
  {
    name: "头 1",
    ask: "谁？",
    target: 0,
    c: "pink",
    map: [
      [100, 0, 0, 0],
      [85, 15, 0, 0],
      [80, 8, 12, 0],
      [75, 5, 10, 10],
    ],
  },
  {
    name: "头 2",
    ask: "何时？",
    target: 1,
    c: "violet",
    map: [
      [100, 0, 0, 0],
      [20, 80, 0, 0],
      [10, 75, 15, 0],
      [8, 70, 12, 10],
    ],
  },
  {
    name: "头 3",
    ask: "做什么？",
    target: 2,
    c: "orange",
    map: [
      [100, 0, 0, 0],
      [50, 50, 0, 0],
      [15, 10, 75, 0],
      [7, 5, 80, 8],
    ],
  },
];

export const ch52: ChapterSpec = {
  id: 52,
  part: 5,
  title: "用很多双眼睛看",
  core: false,
  hook: "“学校”既想知道谁去，也想知道什么时候去。只看一次够吗？",
  steps: [
    { id: "s1", sec: 7, narration: "一句话里的关系有好几种：谁在做，什么时候，做什么。" },
    { id: "s2", sec: 10, narration: "可是做一次注意力，比例只能定出一种。所以要做好几套 Q、K、V，一套叫一个头（head）。" },
    { id: "s3", sec: 9, narration: "比如头 1 找“谁”，头 2 找“什么时候”，头 3 找“做什么”。同一个“学校”，看的地方却不一样。" },
    { id: "s4", sec: 8, narration: "各个头不用互相等，同时、分别计算，各自交出一个“学校”的新向量。" },
    { id: "s5", sec: 9, narration: "把这些结果横着接起来，再乘一次矩阵混成一个。好几双眼睛看到的信息，汇集到一个向量里。" },
    { id: "s6", sec: 9, narration: "GPT-3 每一层有 96 个头，一个头 128 格。96 × 128 = 12,288，正好等于词向量的大小。" },
    { id: "s7", sec: 9, narration: "哪个头看什么，不是人定的，而是在训练中自己分好的。第 53 章来看看真正的头。" },
  ],
  playgroundTitle: "头部侦探",
  playgroundIntro: "看着注意力地图，猜猜这个头在找什么。格子越深，看得越多。",
  summary: [
    "一套 Q、K、V = 一个头。每个头看的关系不同。",
    "各个头同时计算，结果接起来，再乘一次矩阵混合。",
    "GPT-3：每层 96 个头 × 128 格 = 12,288。分工是训练中自己形成的。",
  ],
  unlocks: "多头注意力",
  unlockLabel: "解开了注意力的一个秘密",
  quiz: [
    {
      q: "用好几个头，最大的原因是？",
      choices: ["同时看好几种关系", "减少计算", "增加词数"],
      answer: 0,
      explain: "一个头只能定出一种比例。好几个头各看一种不同的关系。",
      review: "s2",
    },
    {
      q: "GPT-3 的一层里有几个头？",
      choices: ["12 个", "96 个", "128 个"],
      answer: 1,
      explain: "96 个。一个头 128 格，所以 96 × 128 = 12,288 格。",
      review: "s6",
    },
    {
      q: "每个头看什么，是怎么定下来的？",
      choices: ["人用规则定", "在训练中自己分好", "按词序定"],
      answer: 1,
      explain: "做 Q、K、V 的矩阵是训练出来的，所以分工也是训练出来的（第 46 章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 52 章 用很多双眼睛看",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "·",
    many: "一句话，好几种关系",
    wants: "“学校”三样都想知道",
    who: "谁？",
    when: "何时？",
    where: "做什么？",
    oneHead: "一次注意力 = 一行比例",
    oneWay: "只有一种标准",
    sets: "好几套 Q、K、V",
    head: "头",
    headEn: "头（head）",
    differ: "同一个“学校”，不同的眼睛",
    parallel: "同时，分别",
    result: "结果",
    concat: "接起来",
    mixM: "× 矩阵",
    final: "新的“学校”",
    gather: "好几双眼睛的信息汇成一个向量",
    gpt3: "GPT-3 的一层",
    heads96: "96 个头",
    dim128: "一个头 = 128 格",
    product: "96 × 128 = 12,288",
    tokenVec: "= 词向量的大小（第 33 章）",
    learned: "分工是训练中自己形成的",
    next: "下一章：第 53 章 看看真 GPT 的脑袋里",
    ex: "示意数据",
    q: "Q",
    k: "K",
    v: "V",
    w0: "我",
    w1: "今天",
    w2: "去",
    w3: "学校",
  },
};
