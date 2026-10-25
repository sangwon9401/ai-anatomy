import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a tiny neural language model (示意数据) ---
// zh: the words are translated one to one; vectors, weights and counts are unchanged, so every probability is the same.
// Each word has a hand-placed 2-number vector. A small network (2 → 3 tanh neurons → 8 scores → softmax)
// was trained on the imaginary counts below with a script; "小狗" was never in the training data.
export const NEXT = ["睡觉", "吃饭", "跑步", "学习", "讲课", "下大了", "刮大了", "停了"] as const;
export const NEXT_COLORS: Highlighter[] = ["yellow", "mint", "sky", "violet", "violet", "orange", "orange", "pink"];

export type ToyWord = { w: string; e: [number, number]; group: string; counts?: Record<string, number> };
export const KNOWN: ToyWord[] = [
  { w: "猫", e: [-0.6, 0.5], group: "动物", counts: { 睡觉: 9, 吃饭: 6, 跑步: 4, 学习: 1 } },
  { w: "学生", e: [0.5, 0.6], group: "人", counts: { 学习: 10, 睡觉: 4, 吃饭: 3, 跑步: 3 } },
  { w: "老师", e: [0.75, 0.15], group: "人", counts: { 讲课: 12, 吃饭: 3, 学习: 3, 睡觉: 2 } },
  { w: "雨", e: [-0.45, -0.6], group: "天气", counts: { 下大了: 16, 停了: 4 } },
  { w: "风", e: [0.25, -0.75], group: "天气", counts: { 刮大了: 16, 停了: 4 } },
];
export const DOG: ToyWord = { w: "小狗", e: [-0.32, 0.68], group: "动物" };

const W1 = [
  [-0.716, -2.838],
  [-2.381, 0.377],
  [-3.55, 2.615],
];
const B1 = [-0.508, 0.073, 1.299];
const W2 = [
  [-3.086, 0.777, 0.299],
  [-3.014, 0.753, -0.141],
  [-2.592, 0.083, 3.194],
  [-2.554, -1.216, 0.938],
  [-3.202, -1.034, -3.892],
  [5.054, 1.859, 2.506],
  [4.866, -1.559, -2.692],
  [4.532, 0.337, -0.212],
];
const B2 = [1.449, 1.563, -1.164, 0.961, -1.694, -0.911, -0.802, 1.642];

/** Forward pass: word vector → neuron outputs (−1…1) → scores → probabilities. */
export function nnlm(e: readonly [number, number]) {
  const h = W1.map((r, i) => Math.tanh(r[0] * e[0] + r[1] * e[1] + B1[i]));
  const s = W2.map((r, k) => r.reduce((a, w, i) => a + w * h[i], B2[k]));
  const m = Math.max(...s);
  const ex = s.map((v) => Math.exp(v - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { h, s, p: ex.map((v) => v / sum) };
}

/** The k most likely next words. */
export function top(e: readonly [number, number], k = 3) {
  const { p } = nnlm(e);
  return p
    .map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] }))
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}

// --- the scene's running example (示意数据): three word vectors → scores 3, 2, 1, −1 (ch14) ---
export const CONTEXT: { w: string; v: [number, number]; c: Highlighter }[] = [
  { w: "我", v: [0.8, 0.1], c: "mint" },
  { w: "今天", v: [-0.3, 0.9], c: "sky" },
  { w: "去", v: [0.5, -0.6], c: "violet" },
];
export const OUTPUTS: { w: string; s: number; c: Highlighter }[] = [
  { w: "学校", s: 3, c: "yellow" },
  { w: "图书馆", s: 2, c: "mint" },
  { w: "公园", s: 1, c: "sky" },
  { w: "披萨", s: -1, c: "pink" },
];
/** an older sentence the fixed window cannot see all of (zh: the rain that decides 伞 is outside the window) */
export const WINDOW_SENT = ["下雨天", "我", "出门", "时", "带了"];

export const ch39: ChapterSpec = {
  id: 39,
  part: 4,
  title: "神经网络语言模型",
  core: false,
  hook: "一句从来没见过的话，AI 怎么猜出下一个词？",
  steps: [
    { id: "s1", sec: 10, narration: "n-gram 就算数过很多次“猫”后面的词，只要从没见过“小狗”，就完全不知道下一个词是什么。因为是 0 次。" },
    { id: "s2", sec: 10, narration: "2003 年，本吉奥（Bengio）的团队提出了新方法：用神经网络来猜下一个词，叫神经网络语言模型。" },
    { id: "s3", sec: 9, narration: "先给每个词一个数字向量，就是第 33 章的嵌入。用法相近的词会放在相近的位置。" },
    { id: "s4", sec: 10, narration: "把前面三个词的向量接在一起，送进神经网络。经过 Part 2 学过的神经元层，每个候选词都会得到一个分数。" },
    { id: "s5", sec: 10, narration: "分数经过 Softmax（第 14 章）变成概率：学校 65.7%、图书馆 24.2%、公园 8.9%、披萨 1.2%。" },
    { id: "s6", sec: 10, narration: "小狗的向量离猫很近，经过神经网络也会得到相似的答案。所以第一次见的句子也能猜。" },
    { id: "s7", sec: 10, narration: "训练时，神经网络的权重和词向量会一起修改。10 年后的 Word2Vec（第 34 章）专门只做词向量。" },
    { id: "s8", sec: 10, narration: "但还是有局限：它仍然是只看前面几个词的固定窗口。想看整句话怎么办？第 40 章来揭晓。" },
  ],
  playgroundTitle: "挪动词的位置",
  playgroundIntro: "“小狗”是训练句子里一次也没出现过的词。拖动黄色的点（小狗的向量），看看神经网络给出的下一个词的概率怎么变。",
  summary: [
    "2003 年的神经网络语言模型：用词向量（嵌入）+ 神经网络预测下一个词。",
    "相近的词 = 相近的向量，所以第一次见的句子也能猜得像模像样。",
    "训练时词向量也一起被打磨。局限：仍然是只看前面几个词的窗口。",
  ],
  unlocks: "2003 神经网络语言模型",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "神经网络语言模型比 n-gram 强在哪里？",
      choices: ["相近的词向量也相近，第一次见的句子也能猜得像模像样", "完全不需要语料库", "一次看完整句话"],
      answer: 0,
      explain: "就算没见过“小狗”，只要它的向量和“猫”相近，神经网络就会给出相似的答案。",
      review: "s6",
    },
    {
      q: "前面的词是以什么样子送进神经网络的？",
      choices: ["一个词的编号", "找出每个词的向量，接在一起", "字数"],
      answer: 1,
      explain: "给每个词找到嵌入向量（第 33 章），再把这些向量接成一行送进去。",
      review: "s4",
    },
    {
      q: "神经网络语言模型还剩下什么局限？",
      choices: ["不能算概率", "不能用词向量", "仍然是只看前面几个词的固定窗口"],
      answer: 2,
      explain: "窗口外的词它看不到。能一路跟着整句话走的方法，是第 40 章的 RNN。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 39 章 神经网络语言模型",
    ngram: "n-gram 的搭配频次表",
    catBlank: "猫 ___",
    dogBlank: "小狗 ___",
    times: " 次",
    never: "没数过 → 不知道",
    notKnow: "不知道它们是相近的词",
    year: "2003",
    who: "本吉奥（Bengio）的团队",
    nnlm: "神经网络语言模型",
    nnlmEn: "Neural Network Language Model",
    idea: "把词变成数字向量，送进神经网络！",
    planeTitle: "每个词一个数字向量（第 33 章 嵌入）",
    animal: "动物",
    people: "人",
    weather: "天气",
    close: "相近的词 = 相近的位置",
    emb: "嵌入（第 33 章）",
    concat: "接在一起",
    layer: "神经元层",
    score: "分数",
    softmax: "Softmax",
    demo: "* 示意数据",
    nearIn: "相近的向量",
    sameOut: "相似的答案",
    unseen: "第一次见的句子也能猜！",
    learnTitle: "训练时一起被打磨",
    weights: "神经网络权重",
    vectors: "词向量",
    drift: "用法相近的词越靠越近",
    w2v: "2013 Word2Vec：专做向量（第 34 章）",
    windowNote: "前 3 个词的窗口",
    outside: "窗口外看不到",
    which: "伞？钥匙？",
    next: "第 40 章：RNN 传纸条接力",
  },
};
