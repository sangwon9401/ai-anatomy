import type { ChapterSpec, Highlighter } from "../../../data/types";

/** zh: the running example 我 今天 去 → 学校 (the Korean words map one to one, so every number stays the same).
 * Illustrative probabilities (示意数据). Each one is "the chance of this word, given every word before it". */
export const CHAIN: { w: string; p: number; c: Highlighter }[] = [
  { w: "我", p: 0.2, c: "mint" },
  { w: "今天", p: 0.25, c: "sky" },
  { w: "去", p: 0.1, c: "violet" },
  { w: "学校", p: 0.52, c: "yellow" },
];
/** the same prefix ending in 披萨 instead (1%, as in ch01) */
export const PIZZA = { w: "披萨", p: 0.01, c: "pink" as Highlighter };

export const NOVEL = ["我今天冒着雨跑去了学校", "我们班的猫在吃午饭"];

/** Format a probability as a percent with two significant digits, without scientific notation. */
export function fmtPct(p: number) {
  const v = p * 100;
  if (v >= 10) return `${Math.round(v)}%`;
  const decimals = Math.min(20, Math.max(0, 1 - Math.floor(Math.log10(v))));
  let s = v.toFixed(decimals);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return `${s}%`;
}

// --- the playground's toy language model (示意数据) ---
// Five words; the chance of the next word depends on the whole prefix, like a real language model.
export const LM_WORDS = ["我", "今天", "去", "学校", "披萨"] as const;
export const LM_COLORS: Record<string, Highlighter> = { 我: "mint", 今天: "sky", 去: "violet", 学校: "yellow", 披萨: "pink" };

function rule(prefix: string[], w: string): number {
  const k = prefix.length;
  const has = (x: string) => prefix.includes(x);
  const last = prefix[k - 1];
  const key = prefix.join(" ");
  if (has("披萨")) return 0.01; // the sentence is already strange
  if (w === "披萨") return k === 0 ? 0.01 : has("学校") ? 0.002 : last === "去" ? 0.01 : 0.005;
  if (has("学校")) return w === "我" || w === "今天" ? 0.01 : 0.002; // the sentence already ended
  const table: Record<string, Record<string, number>> = {
    我: { "": 0.2, 今天: 0.2, 去: 0.1, "今天 去": 0.04, "去 今天": 0.05 },
    今天: { "": 0.15, 我: 0.25, 去: 0.08, "我 去": 0.03, "去 我": 0.05 },
    去: { "": 0.03, 我: 0.08, 今天: 0.06, "我 今天": 0.1, "今天 我": 0.1 },
  };
  if (w === "学校") {
    if (has("去")) {
      if (last === "去") return k === 3 ? 0.52 : k === 2 ? (prefix[0] === "我" ? 0.3 : 0.2) : 0.15;
      return k === 3 ? (last === "今天" ? 0.45 : 0.4) : 0.25;
    }
    return ({ "": 0.005, 我: 0.02, 今天: 0.005, "我 今天": 0.02, "今天 我": 0.02 } as Record<string, number>)[key];
  }
  return table[w][key];
}

/** Candidates for the next word after `prefix` (words are used once each); `rest` = every other word in the language. */
export function nextProbs(prefix: string[]) {
  const options = LM_WORDS.filter((w) => !prefix.includes(w)).map((w) => ({ w, p: rule(prefix, w) }));
  const rest = 1 - options.reduce((a, o) => a + o.p, 0);
  return { options, rest };
}

export function sentenceProb(words: string[]) {
  let p = 1;
  const factors: number[] = [];
  words.forEach((w, i) => {
    const f = nextProbs(words.slice(0, i)).options.find((o) => o.w === w)!.p;
    factors.push(f);
    p *= f;
  });
  return { p, factors };
}

export const ch37: ChapterSpec = {
  id: 37,
  part: 4,
  title: "语言模型 = 句子的概率",
  core: false,
  hook: "AI 怎么知道哪句话说得“自然”？",
  steps: [
    { id: "s1", sec: 9, narration: "看两句话：“我今天去学校”和“我今天去披萨”。哪一句更自然？" },
    { id: "s2", sec: 9, narration: "语言模型就是给每句话打分的机器：用概率表示它“有多像真会出现的话”。ChatGPT 也是语言模型。" },
    { id: "s3", sec: 10, narration: "可是整句整句地数很难，第一次见到的句子实在太多了。所以要拆成一个词一个词来算。" },
    { id: "s4", sec: 10, narration: "第一个词是“我”的概率，后面接“今天”的概率……看着前面的词，一个一个求出下一个词的概率。" },
    { id: "s5", sec: 9, narration: "把这些概率依次乘起来，就是整句话的概率：20% × 25% × 10% × 52% = 0.26%。" },
    { id: "s6", sec: 10, narration: "“披萨”那句只有最后一个词是 1%，结果是 0.005%。前面完全一样，只因最后一个词就差了 52 倍。" },
    { id: "s7", sec: 10, narration: "所以，越会猜下一个词的模型，也越会给句子打分。第 1 章的“猜下一个词”说的就是这个。" },
    { id: "s8", sec: 9, narration: "那这些概率从哪儿来？最简单的办法是数一数。第 38 章我们亲手来数。" },
  ],
  playgroundTitle: "句子概率计算器",
  playgroundIntro: "一个一个选词，拼成四个词的句子。每选一个，就乘上那个词的概率。概率最高的句子是哪一句？",
  summary: [
    "语言模型：用概率给句子打分，看它有多像真会出现的话。",
    "句子的概率 = 看着前面的词求出的下一个词的概率，依次相乘。",
    "会猜下一个词的模型 = 会给句子打分的模型（第 1 章）。",
  ],
  unlocks: "语言模型",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "句子的概率怎么求？",
      choices: ["把每个词的概率加起来", "把下一个词的概率依次相乘", "除以词的个数"],
      answer: 1,
      explain: "第一个词的概率 × 下一个词的概率 × …… 依次相乘。",
      review: "s5",
    },
    {
      q: "前三个词完全一样，只有最后一个词的概率分别是 52% 和 1%，两句话的概率差几倍？",
      choices: ["52 倍", "51 倍", "2 倍"],
      answer: 0,
      explain: "相同的前半部分两边都要乘，所以只剩最后概率的比：52 ÷ 1 = 52 倍。",
      review: "s6",
    },
    {
      q: "在句子末尾再接一个词，这句话的概率一般会怎样？",
      choices: ["变大", "总是变成 1", "变小"],
      answer: 2,
      explain: "概率都小于 1，多乘一个就变小。所以长句子的概率非常小。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 37 章 语言模型 = 句子的概率",
    which: "哪一句更自然？",
    lm: "语言模型",
    lmEn: "Language Model",
    inSent: "句子",
    outProb: "概率",
    high: "高",
    low: "低",
    chatgpt: "ChatGPT 也是语言模型！",
    whole: "整句整句地数？",
    novel: "第一次见的句子",
    tooMany: "第一次见的句子多得数不完",
    split: "拆成一个一个词！",
    demo: "* 示意数据",
    first: "第一个词是“我”",
    look: "看着前面的词",
    times: "×",
    vs: "vs",
    eq: "=",
    smaller: "越乘越小",
    same: "前半部分完全一样",
    was: "“学校”时",
    now: "“披萨”时",
    ratio: " 倍之差！",
    rule: "会猜下一个词 = 会给句子打分",
    prefix: "我 今天 去",
    ch01: "第 1 章的猜下一个词",
    gaws: "图书馆",
    late: "公园",
    mult: "把这些概率乘起来，就是句子的概率！",
    where: "这些概率从哪儿来？",
    count: "亲手数一数！",
    next: "第 38 章：只看前面几个词",
  },
};
