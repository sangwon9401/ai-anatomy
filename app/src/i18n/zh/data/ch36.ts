import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V4 = [number, number, number, number];

// s1: zh — Chinese marks who did what mainly by word order: 狗咬人 ≠ 人咬狗. The third row shows that 被 can mark the
// roles too (人被狗咬 = 狗咬人); its `same` flag means "same meaning as the first row". The second item of each pair is a
// highlighted marker (only 被 here).
export const PARTICLE_ROWS: { parts: [string, string][]; same: boolean }[] = [
  { parts: [["狗", ""], ["咬", ""], ["人", ""]], same: true },
  { parts: [["人", ""], ["咬", ""], ["狗", ""]], same: false },
  { parts: [["人", ""], ["", "被"], ["狗", ""], ["咬", ""]], same: true },
];

// s2: same tokens, different order (real GPT-4o tokens, o200k_base: '10' '点' '11' '分'; no space token in Chinese)
export const TIME_A = ["10", "点", "11", "分"];
export const TIME_B = ["11", "点", "10", "分"];

// illustrative token vectors (示意数据, 4 numbers each)
export const TOK_VEC: Record<string, V4> = {
  "10": [0.5, -0.3, 0.8, 0.1],
  点: [-0.6, 0.4, 0.2, -0.5],
  "11": [0.6, -0.2, 0.7, 0.3],
  分: [-0.4, 0.6, -0.3, -0.6],
};

/**
 * A 4-number position pattern in the style of the 2017 Transformer: a fast "hand" turning 1 radian per position
 * and a slow one turning 1/4 radian, each written as (sin, cos). The real paper uses many more speeds.
 */
export const SPEEDS = [1, 1 / 4];
export const pe = (p: number): V4 => [Math.sin(p * SPEEDS[0]), Math.cos(p * SPEEDS[0]), Math.sin(p * SPEEDS[1]), Math.cos(p * SPEEDS[1])];
export const add4 = (a: V4, b: V4): V4 => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const fmt = (x: number) => {
  const v = r2(x);
  return v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2);
};
export const WAVE_NAMES = ["快 sin", "快 cos", "慢 sin", "慢 cos"];
export const WAVE_COLORS: Highlighter[] = ["orange", "orange", "sky", "sky"];

// s8: what Part 3 gave us
export const PART3_TOOLS = ["Unicode", "词元", "BPE", "词元效率", "独热编码", "嵌入", "分布假说", "语义搜索", "位置信息"];

export const ch36: ChapterSpec = {
  id: 36,
  part: 3,
  title: "怎么知道顺序？",
  core: true,
  hook: "“10点11分”和“11点10分”的词元一模一样，AI 怎么知道它们不同？",
  steps: [
    { id: "s1", sec: 9, narration: "“狗咬人”和“人咬狗”，字完全一样，顺序一换，意思就反了。中文主要靠语序分清谁做了什么，有时也用“被”来标明。" },
    { id: "s2", sec: 8, narration: "“10点11分”和“11点10分”也一样：词元完全相同，只是顺序换了，意思就不同。顺序本身也是信息。" },
    { id: "s3", sec: 8, narration: "注意力（第 45 章）会一次看完所有词元再混合。没有位置信息，两句话就像同一袋词元。" },
    { id: "s4", sec: 9, narration: "所以要给词元向量加上表示“第几个”的数字。可如果直接加 1、2、3，第 2,000 个词元的意思就被淹没了。" },
    { id: "s5", sec: 8.5, narration: "最初的 Transformer（2017）用的是正弦波：在快慢不同的波上读出那个位置的高度。值总在 −1 和 1 之间。", tts: "最初的 Transformer 用的是正弦波：在快慢不同的波上读出那个位置的高度。值总在负 1 和 1 之间。" },
    { id: "s6", sec: 8.5, narration: "把钟表的快针和慢针一起看，就能知道时刻。波也一样，每个位置的花纹都不一样。" },
    { id: "s7", sec: 9, narration: "把这个花纹加到词元向量上。这样，同一个“10”放在 0 号位置和 2 号位置，向量就不同了，顺序也就装进去了。" },
    { id: "s8", sec: 8.5, narration: "文字、词元、编号、嵌入、位置信息。现在，文字变成了模型能计算的数字。Part 3 结束，接下来是 Part 4。" },
  ],
  playgroundTitle: "位置花纹实验室",
  playgroundIntro: "切换两个句子，打开或关闭“加上位置信息”。没有位置信息时，在模型眼里两句话是同一堆词元。",
  summary: [
    "同样的词元，顺序一变意思就变（10点11分 ≠ 11点10分，狗咬人 ≠ 人咬狗）。",
    "位置信息：给词元向量加上表示“第几个”的花纹。",
    "花纹用快慢不同的正弦波做成（2017）。值在 −1～1 之间，每个位置都不同。",
  ],
  unlocks: "位置信息",
  quiz: [
    {
      q: "“狗咬人”和“人咬狗”意思不同，是因为？",
      choices: ["两句话用的字不一样", "中文主要靠语序表示谁做了什么", "两句话的字数不一样"],
      answer: 1,
      explain: "两句话的字完全相同，只是顺序不同。中文主要靠语序分清谁是做事的人，有时也用“被”来标明。",
      review: "s1",
    },
    {
      q: "如果每个位置直接加上 1、2、3……，会有什么问题？",
      choices: ["计算会变得太慢", "后面的词元数字太大，原本的意思被淹没", "第一个词元会消失"],
      answer: 1,
      explain: "给第 2,000 个词元加上 2000，像 0.5 这样表示意思的数字就几乎看不出来了。正弦波总在 −1～1 之间，就没问题。",
      review: "s4",
    },
    {
      q: "加上位置信息后，“10点11分”和“11点10分”里的“10”的向量会怎样？",
      choices: ["完全一样", "都变成 0", "位置不同，所以变得不一样"],
      answer: 2,
      explain: "0 号位置和 2 号位置的花纹不同，加起来的结果也不同。所以模型能分辨顺序。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 36 章 怎么知道顺序？",
    sameMeaning: "意思一样",
    particle: "中文靠语序分清谁做了什么",
    diff: "加个“被”，顺序变了，意思却和第一句一样",
    eq: "=",
    neq: "≠",
    oppos: "意思相反",
    orderMatters: "同样的词元，顺序不同 → 意思不同",
    src: "GPT-4o 分词器（o200k_base）",
    attn: "注意力一次看完全部（第 45 章）",
    bag: "没有位置信息，就是同一袋？！",
    addPos: "词元向量 + 位置 = 输入",
    tokVec: "“10”的向量（示意数据）",
    plain: "直接加 1、2、3……？",
    pos1: "第 1 个：+1",
    pos2000: "第 2,000 个：+2000",
    buried: "意思被淹没了！",
    waves: "正弦波花纹（2017 年的 Transformer）",
    readAt: "2 号位置的值",
    range: "值总在 −1 ～ 1 之间",
    speedsNote: "示意数据：只用 2 种速度（真正的 Transformer 用得多得多）",
    clockTitle: "每个位置的花纹都不同",
    fast: "快针",
    slow: "慢针",
    clock: "像钟表：两根针就能看出时刻",
    posNo: "位置",
    addTitle: "同一个“10”，不同的位置",
    at0: "10点11分：0 号位置",
    at3: "11点10分：2 号位置",
    differ: "位置不同，向量也不同！",
    learned: "* GPT-2、GPT-3 的花纹也是训练出来的",
    from0: "位置编号从 0 开始数",
    done: "Part 3 完成：文字变成了数字！",
    bp: "设计图前半部分完成",
    next: "下一部分：Part 4 Transformer 之前的故事",
    space: "␣",
    ten: "“10”",
    ops: "+=→",
  },
};
