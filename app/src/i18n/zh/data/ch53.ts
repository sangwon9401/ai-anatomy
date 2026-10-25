import type { ChapterSpec, Highlighter } from "../../../data/types";

/** the four real GPT-2 heads this chapter visits (layer and head numbered from 0, like code: L4H11); the data stays English */
export const GPT2_HEADS: { key: string; layer: number; head: number; name: string; c: Highlighter; desc: string }[] = [
  { key: "prev", layer: 4, head: 11, name: "前一个词", c: "sky", desc: "不管哪句话，都几乎 100% 只看前一个词。" },
  { key: "first", layer: 7, head: 2, name: "第一个词", c: "violet", desc: "几乎所有词都看第一个词。为什么会这样，还在研究中。" },
  { key: "copy", layer: 5, head: 1, name: "照着重复", c: "mint", desc: "同样的话再出现时，会去看第一次出现时紧跟在后面的词。在重复的句子里看得很清楚。" },
  { key: "subj", layer: 4, head: 3, name: "找主语？", c: "orange", desc: "动词或“it”“she”看起来像在找前面的主角。解读要小心！" },
];

/** Part 5 in chips, for the recap */
export const PART5_TOOLS = ["只要注意力（44）", "互相看（45）", "Q · K · V（46）", "Q · K 分数（47）", "÷ √d + Softmax（48）", "混合 V（49）", "矩阵一次算完（50）", "因果掩码（51）", "多头（52）", "注意力地图（53）"];

export const ch53: ChapterSpec = {
  id: 53,
  part: 5,
  title: "看看真 GPT 的脑袋里",
  core: false,
  hook: "真正的 GPT 里，那些头真的在“看”着什么吗？",
  steps: [
    { id: "s1", sec: 9, narration: "终于要打开真正的 GPT 了。这是 GPT-2 里最小的模型：12 层，每层 12 个头，一共 144 个。" },
    { id: "s2", sec: 9, narration: "放进一句英文，把一个头看各个词的比例画成地图。行是正在看的词，列是被看的词。" },
    { id: "s3", sec: 8, narration: "这是第 4 层的 11 号头。每个词都几乎 100% 只看前一个词，所以只有对角线正下方的格子是深色的。" },
    { id: "s4", sec: 10, narration: "在第 7 层的 2 号头，几乎所有词都看第一个词“The”。在这句话里，144 个头中有 98 个把一半以上的注意力放在第一个词上。" },
    { id: "s5", sec: 9, narration: "把同一句话放两遍。在第 5 层的 1 号头，第二个“my”有 51% 在看第一次“my”后面的“dog”。" },
    { id: "s6", sec: 9, narration: "在第 4 层的 3 号头，“it”有 84% 在看“cat”。看起来像是在找“it”指的是谁。" },
    { id: "s7", sec: 9, narration: "Part 5 把注意力彻底拆开看了：Q · K 分数、√d 和 Softmax、混合 V、矩阵计算、帘子，还有多个头。" },
    { id: "s8", sec: 9, narration: "现在我们完全知道设计图里注意力零件做的事了。Part 6 要把零件叠起来，组装 Transformer 块（第 54 章）。" },
  ],
  playgroundTitle: "探索注意力地图",
  playgroundIntro: "这是在真正的 GPT-2 上预先算好的注意力地图。换换句子和头，点一个词，看看它在看谁。",
  summary: [
    "真正的 GPT-2（最小的模型）：12 层 × 每层 12 个头 = 144 个头。",
    "真的有只看前一个词的头、集中看第一个词的头、照着前文重复的头。",
    "Part 5 结束：分数（Q · K）→ ÷ √d → Softmax → 混合 V。加上帘子，用多个头来算。",
  ],
  unlocks: "读懂注意力地图",
  unlockLabel: "解开了注意力的一个秘密",
  quiz: [
    {
      q: "第 4 层 11 号头的地图里，深色的格子在哪里？",
      choices: ["对角线正下方（前一个词）", "最左边一列（第一个词）", "分散得很均匀"],
      answer: 0,
      explain: "每个词都只看前一个词，所以只有对角线正下方的格子是深色的。",
      review: "s3",
    },
    {
      q: "GPT-2 最小的模型一共有多少个头？",
      choices: ["12 个", "96 个", "144 个"],
      answer: 2,
      explain: "12 层，每层 12 个头，所以 12 × 12 = 144 个。（96 个是 GPT-3 一层里的头数。）",
      review: "s1",
    },
    {
      q: "注意力地图对角线右上方总是空的，原因是？",
      choices: ["因果掩码遮住了未来", "那些词不重要", "还没算完"],
      answer: 0,
      explain: "GPT 只能看前面的词（第 51 章），所以地图总是三角形的。",
      review: "s2",
    },
  ],
  labels: {
    tag: "第 53 章 看看真 GPT 的脑袋里",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "↙",
    model: "GPT-2 最小模型",
    layers: "12 层",
    perLayer: "每层 12 个头",
    total: "12 × 12 = 144 个头",
    layer: "层",
    rows: "正在看的词 ↓",
    cols: "被看的词 →",
    tri: "三角形 = 因果掩码（第 51 章）",
    dark: "颜色越深，看得越多",
    prevT: "只看前一个词的头",
    firstT: "集中看第一个词的头",
    first98: "144 个头里，有 98 个主要看第一个词",
    why: "为什么？还在研究中",
    copyT: "照着前文重复的头",
    copyNote: "第二个“my”→ 第一次“my”后面的“dog”",
    subjT: "“it”在看“cat”的头",
    careful: "只是看起来像，解读要小心！",
    callback: "第 45 章：看周围的词……",
    src: "真实计算值 · 层号从 0 开始",
    recap: "Part 5 彻底搞懂注意力！",
    blueprint: "GPT 设计图",
    understood: "第 45～53 章彻底搞懂",
    next: "下一部分：Part 6 组装 Transformer（第 54 章）",
    headFmt: "第 {layer} 层 {head} 号头",
  },
};
