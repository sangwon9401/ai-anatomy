import type { ChapterSpec } from "../../../data/types";

/**
 * zh: the Korean word '배' (pear / boat / belly) becomes '包', which has three senses a picture can show:
 * [吃的包 (包子, a steamed bun), 背的包 (a bag), 身上的包 (a bump, e.g. a mosquito bite)] — a toy 3-dimensional "meaning".
 * Every context word takes the meaning and score of its Korean counterpart in the same role, so the weights and the
 * positions of the dot are the same as in the Korean chapter (checked with a script).
 */
export type Meaning = [number, number, number];

export type ToyWord = { w: string; m: Meaning; score: number };

// Relevance score of each word *to "包"*. Attention weights are softmax(score), exactly like ch.14.
export const SELF: ToyWord = { w: "包", m: [1 / 3, 1 / 3, 1 / 3], score: 1.0 };

export const BANK: ToyWord[] = [
  { w: "肩上", m: [0.02, 0.95, 0.03], score: 2.3 },
  { w: "她", m: [0.33, 0.34, 0.33], score: 0.9 },
  { w: "背着", m: [0.05, 0.9, 0.05], score: 1.9 },
  { w: "一个", m: [0.33, 0.34, 0.33], score: 1.0 },
  { w: "装着书的", m: [0.03, 0.92, 0.05], score: 2.0 },
  { w: "早餐", m: [0.95, 0.02, 0.03], score: 2.0 },
  { w: "吃了", m: [0.45, 0.3, 0.25], score: 1.1 },
  { w: "豆沙", m: [0.92, 0.03, 0.05], score: 2.0 },
  { w: "甜甜的", m: [0.85, 0.03, 0.12], score: 1.6 },
  { w: "蚊子", m: [0.1, 0.05, 0.85], score: 1.7 },
  { w: "个", m: [0.33, 0.33, 0.34], score: 0.8 },
  { w: "叮了", m: [0.2, 0.03, 0.77], score: 2.0 },
  { w: "红红的", m: [0.15, 0.15, 0.7], score: 1.5 },
  { w: "今天", m: [0.33, 0.33, 0.34], score: 0.3 },
];

// names kept from the Korean file: sea = the bag sentence, fruit = the bun sentence, meal = the bump sentence
export const SENTENCES = {
  sea: ["她", "肩上", "背着", "一个"],
  fruit: ["早餐", "吃了", "豆沙"],
  meal: ["蚊子", "叮了", "个"],
};

const byWord = (w: string) => BANK.find((b) => b.w === w)!;

export function attend(context: string[]) {
  const words = [...context.map(byWord), SELF];
  const ex = words.map((x) => Math.exp(x.score));
  const sum = ex.reduce((a, b) => a + b, 0);
  const weights = ex.map((e) => e / sum);
  const mix: Meaning = [0, 0, 0];
  words.forEach((x, i) => x.m.forEach((v, k) => (mix[k] += weights[i] * v)));
  return { words, weights, mix };
}

/** Round to whole percents that still add up to exactly 100 (largest remainder). */
export function percents(values: number[]): number[] {
  const raw = values.map((v) => v * 100);
  const floor = raw.map(Math.floor);
  let left = 100 - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floor[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floor[i] += 1;
    left -= 1;
  }
  return floor;
}

export const MEANING_NAMES = ["吃的包", "背的包", "身上的包"] as const;

export const ch45: ChapterSpec = {
  id: 45,
  part: 5,
  title: "词与词互相看",
  core: true,
  hook: "“包”是吃的包子，还是背的包？AI 是怎么分辨的？",
  steps: [
    { id: "s1", sec: 7, narration: "“包”这个字有好几个意思：可以吃的包子，背在身上的包，还有蚊子叮出来的包。" },
    { id: "s2", sec: 7.5, narration: "在第 33 章学的嵌入里，“包”永远是同一个向量。所以单独看时，它在三种意思的正中间。" },
    { id: "s3", sec: 6, narration: "现在把它放进句子里：“她肩上背着一个包”。" },
    { id: "s4", sec: 8, narration: "“包”环顾前面的词。关系越密切的词，线越粗，看得越多。" },
    { id: "s5", sec: 8.5, narration: "再按看的多少，把那些词的意思混进来。“肩上”“背着”混得多，就往“背的包”那边移动了。" },
    { id: "s6", sec: 9, narration: "句子换了会怎样？“早餐吃了豆沙包”。这次多看“早餐”和“豆沙”，就往“吃的包”那边去。" },
    { id: "s7", sec: 7, narration: "像这样，每个词都看看句子里的其他词，修正自己的意思。这就是自注意力。" },
    { id: "s8", sec: 6.5, narration: "那么关系有多密切，是怎么决定的？下一章用 Query、Key、Value 来揭晓。" },
  ],
  playgroundTitle: "搭个上下文",
  playgroundIntro: "选几个词放在“包”的前面，看看“包”的意思往哪里移动。",
  summary: [
    "同一个词，上下文不同，意思也不同。",
    "每个词都看前面的词，越相关的看得越多。",
    "按看的多少把意思混起来，修正自己的意思。这就是自注意力。",
  ],
  unlocks: "自注意力",
  quiz: [
    {
      q: "在自注意力里，“包”做了什么？",
      choices: ["看前面的词，把相关词的意思混进来，修正自己的意思", "去词典里查意思", "变成离得最近的那一个词"],
      answer: 0,
      explain: "它不是只挑一个词，而是按看的比例，把好几个词的意思混在一起。",
      review: "s5",
    },
    {
      q: "“包”看其他词的比例，全部加起来是？",
      choices: ["100%", "词数 × 100%", "每次都不一样"],
      answer: 0,
      explain: "比例是用 Softmax（第 14 章）算出来的，所以总和永远是 1，也就是 100%。",
      review: "s4",
    },
    {
      q: "同样是“包”，前面的句子换了会怎样？",
      choices: ["意思不变", "随前面的词改变意思", "句子结束了才有意思"],
      answer: 1,
      explain: "嵌入虽然一样，经过注意力就会变成适合上下文的意思。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 45 章 词与词互相看",
    fruit: "吃的包",
    boat: "背的包",
    body: "身上的包",
    alone: "包（单独时）",
    vague: "意思模糊，所以在正中间",
    vec: "一个词 = 一个向量（第 33 章）",
    toBoat: "往“背的包”那边去！",
    toFruit: "往“吃的包”那边去！",
    foot: "* 实际混合的是由几百个数字组成的向量",
    line: "自注意力：看其他的词，修正自己的意思",
    meal: "蚊子叮了个包",
    sum: "看的比例全部加起来是 100%（第 14 章 Softmax！）",
    ask: "关系有多密切，怎么决定？",
    q: "Query",
    k: "Key",
    v: "Value",
    qd: "提问",
    kd: "标签",
    vd: "内容",
    seaLine: "她肩上背着一个包",
    fruitLine: "早餐吃了豆沙包",
    next: "下一章：第 46 章 Query · Key · Value",
    self: "自己",
  },
};
