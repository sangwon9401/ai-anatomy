import type { ChapterSpec, Highlighter } from "../../../data/types";

// a tiny vocabulary for the scene (5 words) and the playground (8 words)
export const VOCAB5: { w: string; c: Highlighter }[] = [
  { w: "小狗", c: "yellow" },
  { w: "小猫", c: "mint" },
  { w: "公交车", c: "sky" },
  { w: "苹果", c: "pink" },
  { w: "学校", c: "violet" },
];
export const VOCAB8 = [...VOCAB5.map((v) => v.w), "去", "披萨", "我"];

export const oneHot = (i: number, n: number) => Array.from({ length: n }, (_, k) => (k === i ? 1 : 0));
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

// zh: real GPT-4o token ids (o200k_base) from ch29: '学校' 73048, '我' 7522 → ratio ≈ 9.7
// (names kept from the Korean file: ID_NANEUN = the big id, ID_E = the small one)
export const ID_NANEUN = 73048;
export const ID_E = 7522;
export const VOCAB_SIZES = [
  { name: "示例词表", n: 8 },
  { name: "GPT-3", n: 50257 },
  { name: "GPT-4o", n: 200019 },
];

export const ch32: ChapterSpec = {
  id: 32,
  part: 3,
  title: "编号的局限",
  core: false,
  hook: "每个词元都有编号，直接把编号送进模型不行吗？",
  steps: [
    { id: "s1", sec: 8.5, narration: "每个词元都有编号（第 29 章）：“学校”是 73048 号，“我”是 7522 号。直接把编号送进去会怎样？" },
    { id: "s2", sec: 9, narration: "模型会把数字相乘、相加（第 12 章）。这样一来，“学校”就成了“我”的将近 10 倍。可编号的大小根本没有意义。" },
    { id: "s3", sec: 8.5, narration: "所以不用编号，改用位置来表示。词有多少个就准备多少格，只在自己的位置放 1。这叫独热编码。" },
    { id: "s4", sec: 9, narration: "这样就没有大小之分了。可是有两个问题。第一，太长了。换成 GPT-4o，约 20 万格里只有一个 1。" },
    { id: "s5", sec: 7.5, narration: "第二，所有词都一样陌生。任意两个词的距离都是 √2（第 8 章），点积都是 0（第 9 章）。", tts: "第二，所有词都一样陌生。任意两个词的距离都是根号 2，点积都是 0。" },
    { id: "s6", sec: 7, narration: "小狗和小猫很像，独热编码却表示不出来。它们的距离和小狗与公交车一样远。" },
    { id: "s7", sec: 7.5, narration: "我们需要的是一串短短的数字，意思越像，数字就越接近。这就是下一章要讲的嵌入。" },
  ],
  playgroundTitle: "独热编码实验室",
  playgroundIntro: "选两个词，看看它们的独热向量，以及两者之间的距离和点积。你能找到距离不是 √2 的一对吗？",
  summary: [
    "词元编号的大小没有意义，不能直接拿来计算。",
    "独热编码：词有多少个就有多少格，只在自己的位置放 1。大小之分消失了。",
    "但它太长（约 20 万格），而且所有词都一样远（距离 √2，点积 0）。",
  ],
  unlocks: "独热向量",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "词表里有 5 个词时，第三个词的独热向量是？",
      choices: ["[3]", "[1, 1, 1, 0, 0]", "[0, 0, 1, 0, 0]"],
      answer: 2,
      explain: "5 格里只有第三格是 1，其余都是 0。",
      review: "s3",
    },
    {
      q: "用独热向量表示，“小狗”和“小猫”的点积是？",
      choices: ["1", "0", "√2"],
      answer: 1,
      explain: "两个 1 在不同的位置，相乘全是 0。“小狗”和“公交车”也一样是 0。",
      review: "s5",
    },
    {
      q: "下面哪一项不是独热编码的问题？",
      choices: ["向量太长", "意思相近的词也不靠近", "不同词的向量会重叠，分不清"],
      answer: 2,
      explain: "独热编码里每个词的 1 都在不同位置，绝不会重叠。问题在于太长，以及“所有词都一样远”。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 32 章 编号的局限",
    naneun: "学校",
    e: "我",
    into: "直接送进去？",
    model: "模型",
    r2: "√2",
    times: "× 2 →",
    ratio: "73048 ÷ 7522 ≈ 9.7",
    bigger: "“学校”是“我”的近 10 倍？！",
    noMeaning: "编号的大小没有意义（第 6 章）",
    seat: "不用编号，改用位置",
    oneHot: "独热编码（one-hot）",
    onlyOne: "自己那格是 1",
    prob1: "问题 ① 太长了",
    cells: "约 20 万格",
    justOne: "1 只有一个",
    prob2: "问题 ② 大家都一样陌生",
    distLbl: "距离",
    dotLbl: "点积",
    sqrt2: "√2 ≈ 1.41",
    same: "像的一对、不像的一对，都是 √2",
    need: "需要的是：又短、又带着意思的一串数字",
    emb: "嵌入（第 33 章）",
    sample: "[0.8, 0.7, −0.2]",
    zeros: "0 0 0 0 0 0 0 0 0 0 0 0 … 1 … 0 0 0 0 0 0 0 0 0",
  },
};
