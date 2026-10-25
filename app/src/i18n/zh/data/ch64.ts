import type { ChapterSpec } from "../../../data/types";

/** The running example split into pieces. GPT-4o's tokenizer (o200k_base) cuts 我今天去学校。 exactly like this;
 * GPT-3's (r50k_base) cuts it into 12 smaller pieces (第 29 章). */
export const SENT = ["我", "今天", "去", "学校", "。"];

export const PRESETS64 = [
  "我 今天 去 学校。",
  "种瓜 得 瓜， 种豆 得 豆。",
  "1, 2, 3, 4, 5",
  "一波 未平， 一波 又起。",
];

export const MAX_PIECES = 12;

/** Split on spaces and peel trailing punctuation (half- or full-width) into its own piece: "学校。" → "学校", "。". */
export function pieces(text: string): string[] {
  const out: string[] = [];
  for (const w of text.trim().split(/\s+/).filter(Boolean)) {
    const m = w.match(/^(.*?)([.,!?。，！？、]+)$/);
    if (m && m[1]) out.push(m[1], m[2]);
    else out.push(w);
  }
  return out;
}

/** Every prefix becomes a question whose answer is the next piece. */
export const questions = (ps: string[]) => ps.slice(1).map((answer, i) => ({ context: ps.slice(0, i + 1), answer }));

export const ch64: ChapterSpec = {
  id: 64,
  part: 7,
  title: "没有答案的学习",
  core: true,
  hook: "互联网上的文字没有标准答案，GPT 是靠什么判对错的？",
  steps: [
    { id: "s1", sec: 11, narration: "第 4 章的垃圾邮件过滤器，要靠人标上“垃圾”“正常”的答案。可互联网上所有的文字，不可能都标上答案。" },
    { id: "s2", sec: 9, narration: "秘诀是：文字本身就是答案。我们拿一个句子来看：“我今天去学校。”" },
    { id: "s3", sec: 10, narration: "只给出前面的部分、遮住下一个片段，就成了一道题。“我”后面是？答案是紧跟着的“今天”。" },
    { id: "s4", sec: 10, narration: "每多给一格，就又多一道题。“我 今天”后面是“去”，“我 今天 去”后面是“学校”。" },
    { id: "s5", sec: 10, narration: "5 个片段的句子，出了 4 道题。答案不是人给的，而是文字自己告诉我们的。这叫作自监督学习。" },
    { id: "s6", sec: 9, narration: "模型一次就把这 4 道题全做了。多亏第 51 章的帘子，每个位置都只能看到自己前面的内容。" },
    { id: "s7", sec: 11, narration: "GPT-3 看过的约 3000 亿个词元，全都是这样的题。一张答案纸都没有，就生出了约 3000 亿道题。" },
  ],
  playgroundTitle: "出题工厂",
  playgroundIntro: "选一个句子，或者自己写一句（用空格分开片段）。一个句子会变成好几道“猜下一个片段”的题。看答案之前，先自己猜一猜。",
  summary: [
    "只给出句子的前半部分，让模型猜下一个片段，就成了一道题。",
    "答案就是文字里紧跟着的那个片段。不需要人来标答案 = 自监督学习。",
    "N 个片段的句子 → N − 1 道题。整个互联网都成了习题集。",
  ],
  unlocks: "自监督学习",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "像“猫 / 吃了 / 鱼 / 。”这样有 4 个片段的句子，能出几道题？",
      choices: ["2 道", "3 道", "4 道"],
      answer: 1,
      explain: "第一个片段前面什么都没有，出不了题。后面的 3 个片段各自是一道题的答案。",
      review: "s5",
    },
    {
      q: "在自监督学习里，答案是从哪里来的？",
      choices: ["老师一个个标上去", "模型自己随便定", "文字里本来就有的下一个片段"],
      answer: 2,
      explain: "给出前面的部分，被遮住的下一个片段就是答案。文字本身就是答案纸。",
      review: "s3",
    },
    {
      q: "给出“我 今天”的那道题，答案是什么？",
      choices: ["去", "我", "学校"],
      answer: 0,
      explain: "在“我今天去学校。”里，紧跟在“我 今天”后面的片段是“去”。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第 64 章 没有答案的学习",
    spamMsg: "[广告] 免费领券",
    spam: "垃圾",
    byPerson: "人标上的答案（第 4 章）",
    allWeb: "互联网上所有的文字？",
    impossible: "不可能一条条去标",
    finer: "GPT-3 的分词器会切得更碎（第 29 章）",
    textIs: "文字 = 题目 + 答案",
    q: "题",
    answerFrom: "答案就在文字里！",
    count: "5 个片段 → 4 道题",
    ssl: "自监督学习",
    sslEn: "self-supervised learning",
    together: "4 道题一起做",
    mask: "第 51 章的帘子：只看自己前面",
    gpt3: "GPT-3 看过的文字",
    tokens: "约 3000 亿个词元",
    equals: "= 约 3000 亿道题",
    noKey: "一张答案纸都没有！",
    next: "第 65 章：衡量错了多少",
  },
};
