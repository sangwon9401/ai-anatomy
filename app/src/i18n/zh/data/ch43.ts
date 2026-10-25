import { softmax } from "../../../data/ch14";
import { percents } from "../../../data/ch45";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A translation with illustrative relevance scores (示意数据): scores[t][s] = how relevant source word s is while writing target word t. */
export type Pair = { label: string; src: string[]; tgt: string[]; scores: number[][] };

// zh: Chinese → English. The scores are the Korean ones with the source columns reordered to the Chinese word order
// (the verb now comes before the object), so every weight is the same; checked with a script (我 84% for "I").
export const PAIRS: Pair[] = [
  {
    label: "我 今天 去 学校",
    src: ["我", "今天", "去", "学校"],
    tgt: ["I", "go", "to", "school", "today"],
    scores: [
      [3.0, 0.2, 0.4, 0.1],
      [0.3, 0.2, 3.0, 0.8],
      [0.1, 0.3, 2.6, 1.0],
      [0.1, 0.1, 0.5, 3.2],
      [0.2, 3.1, 0.4, 0.3],
    ],
  },
  {
    label: "我 昨天 见了 朋友",
    src: ["我", "昨天", "见了", "朋友"],
    tgt: ["I", "met", "my", "friend", "yesterday"],
    scores: [
      [3.0, 0.2, 0.5, 0.2],
      [0.4, 0.3, 3.0, 0.9],
      [2.0, 0.1, 0.3, 2.2],
      [0.2, 0.1, 0.6, 3.2],
      [0.2, 3.2, 0.5, 0.2],
    ],
  },
  {
    label: "猫 吃 鱼",
    src: ["猫", "吃", "鱼"],
    tgt: ["The", "cat", "eats", "fish"],
    scores: [
      [2.4, 0.3, 0.6],
      [3.2, 0.3, 0.2],
      [0.3, 3.0, 0.9],
      [0.2, 0.6, 3.1],
    ],
  },
];

/** attention weights for every target word (softmax of its scores, ch14) and whole-percent labels that add up to 100 */
export function weightsOf(pair: Pair) {
  return pair.scores.map((row) => {
    const w = softmax(row).p;
    return { w, pct: percents(w) };
  });
}

export const MAIN = PAIRS[0];
export const MAIN_W = weightsOf(MAIN);
export const SRC_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

/** the Part 4 recap cards */
export const RECAP: { ch: string; t: string; year?: string }[] = [
  { ch: "37", t: "语言模型 = 句子的概率" },
  { ch: "38", t: "n-gram：只数前面几个词" },
  { ch: "39", t: "神经网络语言模型：词向量 + 神经网络", year: "2003" },
  { ch: "40", t: "RNN：传纸条接力" },
  { ch: "41", t: "RNN 的局限 → LSTM", year: "1997" },
  { ch: "42", t: "seq2seq 翻译器：一张纸条的瓶颈", year: "2014" },
  { ch: "43", t: "注意力：回头看需要的地方", year: "2014" },
];

export const ch43: ChapterSpec = {
  id: 43,
  part: 4,
  title: "注意力的诞生",
  core: true,
  hook: "如果翻译时可以回头再看原文，AI 翻译会好多少？",
  steps: [
    { id: "s1", sec: 11, narration: "为了解决第 42 章的瓶颈，2014 年 Bahdanau 的团队换了个思路：别只留最后一张纸条，把所有纸条都留下来！" },
    { id: "s2", sec: 10, narration: "解码器写“I”时，扫一遍留下的纸条，把聚光灯打在现在需要的地方。“我”占了 84%。" },
    { id: "s3", sec: 10, narration: "接着写“go”，聚光灯跳过“今天”，照向“去”。两种语言的顺序不一样也没关系。" },
    { id: "s4", sec: 10, narration: "“to”照着“去”，“school”照着“学校”，“today”又跳回前面的“今天”。每写一个词，看的地方都不同。" },
    { id: "s5", sec: 10, narration: "照多亮，是把相关度分数用 Softmax（第 14 章）变成比例来决定的。再按比例把纸条混在一起交给解码器。" },
    { id: "s6", sec: 10, narration: "把看过的地方画成表，就能看出一条条对应关系。因为是在给词配对，所以叫对齐（alignment）。" },
    { id: "s7", sec: 10, narration: "来总结一下 Part 4：数一数（n-gram）、神经网络和词向量、传纸条（RNN），一路走到了注意力。" },
    { id: "s8", sec: 11, narration: "然后到了 2017 年，有人问：干脆不要传纸条，只用注意力来做，会怎样？Part 5 见。" },
  ],
  playgroundTitle: "我来打聚光灯",
  playgroundIntro: "解码器一个一个写英文单词。写每个词时，该照中文的哪个词？点一下，再和模型的聚光灯比一比。",
  summary: [
    "注意力（2014）：解码器每写一个词，都回头看原文的所有纸条。",
    "相关度分数 → Softmax → 比例。按这个比例把纸条混起来用。",
    "顺序不同的语言、很长的句子都没问题。2017 年干脆只用注意力（Part 5）！",
  ],
  unlocks: "2014 注意力",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "注意力是怎样解决第 42 章的瓶颈的？",
      choices: ["把纸条做得更大", "解码器每写一个词，都回头看原文的所有纸条", "把句子剪短"],
      answer: 1,
      explain: "不把一切塞进最后一张纸条，而是留下每一格写的纸条，需要时再回头看。",
      review: "s2",
    },
    {
      q: "在“I go to school today”里写“go”时，聚光灯最亮地照着哪个中文词？",
      choices: ["我", "今天", "去"],
      answer: 2,
      explain: "“go”的意思在“去”里。它会跳过“今天”直接照过去。",
      review: "s3",
    },
    {
      q: "聚光灯的比例（看哪里、看多少）是怎么定的？",
      choices: ["把相关度分数用 Softmax 变成比例", "按词序平均分", "随机决定"],
      answer: 0,
      explain: "就是第 14 章的 Softmax，所以比例加起来是 100%。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 43 章 注意力的诞生",
    year: "2014",
    who: "Bahdanau · Cho · Bengio",
    cho: "Bengio：就是第 39 章那位！",
    keep: "把每一格写的纸条都留下来！",
    attention: "attention = 注意、关注",
    note: "纸条",
    dec: "解码器正在写",
    jump: "跳过“今天”！",
    differ: "每写一个词，看的地方都不同",
    score: "相关度分数",
    softmax: "Softmax（第 14 章）",
    mix: "按比例混合的纸条",
    mixNote: "混合在第 45 章还会见到",
    align: "对齐（alignment）",
    zigzag: "顺序不一样，也能找到对应的词",
    recap: "Part 4 收集的历史卡片",
    y2017: "2017",
    question: "不要传纸条，干脆只用注意力？",
    aiayn: "Attention Is All You Need",
    part5: "Part 5 · 第 44 章见",
    demo: "* 示意数据",
  },
};
