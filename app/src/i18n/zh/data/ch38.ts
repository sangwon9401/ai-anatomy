import type { ChapterSpec } from "../../../data/types";

/**
 * A small original corpus (语料库) written for this chapter in Chinese. Chinese has no spaces, so each sentence is
 * written already split into words (分词) with spaces, and the counting runs over those words. The sentences mirror
 * the Korean corpus one for one; every count shown in the scene was recomputed with this file's countSeq / followers.
 */
export const CORPUS = [
  "我 今天 去 学校",
  "我 早上 去 图书馆",
  "弟弟 今天 去 学校",
  "朋友 每天 去 学校",
  "朋友 今天 在补习班 上课",
  "朋友 昨天 上课 迟到了",
  "猫 今天 在沙发上 睡觉",
  "猫 昨天 在沙发上 睡着了",
  "猫 开心地 吃了 鱼",
  "猫 在家里 睡了 午觉",
  "我 中午 在食堂 吃了 午饭",
  "朋友 很快地 吃完了 午饭",
  "弟弟 偷偷 吃了 零食",
  "老师 早上 在教室 看书",
  "老师 今天 布置了 作业",
  "我 在家里 写了 作业",
  "我 在图书馆 看书",
  "朋友 在操场 踢了 足球",
  "我 昨天 在操场 踢了 足球",
  "弟弟 在家里 睡了 午觉",
  "朋友 在图书馆 写了 作业",
  "老师 在教室 唱了 歌",
  "我 今天 早点 睡觉",
  "弟弟 早上 很晚 起床",
];

export const START = "〈开始〉";
export const END = "〈结束〉";

export const TOKENS = CORPUS.map((s) => [START, ...s.split(" "), END]);

/** How many times the word sequence `seq` appears in the corpus (sentence edges count as tokens). */
export function countSeq(seq: string[]) {
  let n = 0;
  for (const t of TOKENS)
    for (let i = 0; i + seq.length <= t.length; i++) if (seq.every((w, k) => t[i + k] === w)) n++;
  return n;
}

/** Next-word counts after the context `ctx` (the last 1 word for a 2-gram, the last 2 for a 3-gram), most frequent first. */
export function followers(ctx: string[]) {
  const counts = new Map<string, number>();
  for (const t of TOKENS)
    for (let i = 0; i + ctx.length < t.length; i++)
      if (ctx.every((w, k) => t[i + k] === w)) counts.set(t[i + ctx.length], (counts.get(t[i + ctx.length]) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()].map(([w, c]) => ({ w, c, p: c / total })).sort((a, b) => b.c - a.c);
}

/** The sentence the scene builds from the 2-gram table (every pair appears in the corpus). */
export const PATH = ["猫", "昨天", "在操场", "踢了", "足球"];
/** rows of the pair table shown in the scene */
export const TABLE_ROWS = [START, ...PATH];


export const ch38: ChapterSpec = {
  id: 38,
  part: 4,
  title: "只看前面几个词",
  core: false,
  hook: "早期的 AI 是怎么算出“下一个词的概率”的？",
  steps: [
    { id: "s1", sec: 10, narration: "求概率最简单的办法就是数一数。先要有一个收集了大量句子的本子，叫语料库（corpus）。" },
    { id: "s2", sec: 10, narration: "想数“我 今天 去”后面接什么，这三个词得整串出现才行。它只出现了一次，“猫 今天 去”是 0 次。" },
    { id: "s3", sec: 9, narration: "于是想个巧办法：只看前面一个词。只要数“去”后面出现过什么就行。" },
    { id: "s4", sec: 9, narration: "“去”后面，“学校”出现 3 次，“图书馆”出现 1 次。所以“学校”是 4 次里的 3 次，75%。" },
    { id: "s5", sec: 10, narration: "每个词都这样数，就得到一张搭配频次表。这种只看前面几个词的方法叫 n-gram。" },
    { id: "s6", sec: 9, narration: "只看这张表来造句试试。1948 年，香农也用这种办法造过英文句子。" },
    { id: "s7", sec: 10, narration: "两两搭配都很自然，整句却很奇怪吧？因为只看前一个词，忘了主角是一只猫。" },
    { id: "s8", sec: 10, narration: "往前多看几个词呢？词串越长，语料库里越难找到，常常是 0 次。第 39 章的神经网络会解决这个问题。" },
  ],
  playgroundTitle: "用搭配频次表造句",
  playgroundIntro: "用从 24 句语料库里数出的搭配频次表来造句。可以自己挑候选词，也可以点“按概率抽”。会造出语料库里没有的新句子吗？",
  summary: [
    "n-gram：只看前面几个词，在语料库里数下一个词出现的次数，定出概率。",
    "两两搭配都自然，但会忘掉前面的内容，整句容易变得离谱。",
    "往前看得越长，这样的词串在语料库里越少见，常常是 0 次。",
  ],
  unlocks: "n-gram",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "语料库里，“去”后面“学校”出现 3 次，“图书馆”出现 1 次。2-gram 给“学校”的概率是？",
      choices: ["3%", "75%", "33%"],
      answer: 1,
      explain: "“去”后面一共出现了 4 次，其中“学校”3 次，所以 3 ÷ 4 = 75%。",
      review: "s4",
    },
    {
      q: "用 2-gram 造的句子常常很离谱，原因是？",
      choices: ["它只看前一个词来选下一个词", "它完全随机地选词", "语料库里有错句"],
      answer: 0,
      explain: "两两搭配都是语料库里见过的，所以很自然；但更前面的内容（主角、时间）它不看。",
      review: "s7",
    },
    {
      q: "往前看更多词（比如 4 个）的 n-gram，问题是？",
      choices: ["计算变得太简单", "句子会变短", "这么长的词串在语料库里很少见，常常是 0 次"],
      answer: 2,
      explain: "词串越长，一模一样出现过的情况就越少，没东西可数。第 39 章的神经网络会解决这个问题。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 38 章 只看前面几个词",
    corpus: "语料库（corpus）",
    more: "…… 一共 24 句",
    count: "数一数！",
    times: " 次",
    only: "只有一次",
    zero: "0 次",
    trick: "只看前面一个词",
    after: "“去”后面出现的词",
    total: "一共 4 次",
    pairTitle: "搭配频次表",
    gram2: "看前 1 个词 → 2-gram",
    gram3: "看前 2 个词 → 3-gram",
    rowsMore: "…… 每个词一行",
    shannon: "香农 1948 年试过！",
    pairOk: "两两搭配都很自然……",
    huh: "猫在踢足球？！",
    forgot: "只看前一个词，忘了主角是谁",
    look1: "前 1 词",
    look2: "前 2 词",
    look3: "前 3 词",
    longer: "看得越长，越没东西可数",
    next: "第 39 章：神经网络语言模型",
    arrow: "→",
  },
};
