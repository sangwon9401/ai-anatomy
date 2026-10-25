import type { ChapterSpec } from "../../../data/types";

// All numbers below come from the zh bpe.ts run on the zh 谚语 corpus (part11-corpus.ts overlay); see the zh report.
// Chinese has no spaces, so a whole proverb is one "word" for BPE and pairs are counted along the line.

/** "种瓜得瓜，种豆得豆" in the character tokenizer: [piece, id]. */
export const IDS: [string, number][] = [
  ["种", 347],
  ["瓜", 321],
  ["得", 182],
  ["瓜", 321],
  ["，", 505],
  ["种", 347],
  ["豆", 429],
  ["得", 182],
  ["豆", 429],
];

/** the start of the 506-token dictionary (after the line break and the space) */
export const VOCAB_HEAD = ["一", "万", "三", "上", "下", "不", "业", "丢", "两", "个", "中", "丰", "为", "久"];

/** most frequent neighbouring pairs, before any merge */
export const PAIRS = [
  { a: "不", b: "怕", n: 7 },
  { a: "一", b: "个", n: 7 },
  { a: "不", b: "如", n: 6 },
  { a: "千", b: "里", n: 6 },
];

/** three of the seven lines where 不+怕 appears */
export const DEMO_LINES = ["真金不怕火炼", "身正不怕影子斜", "酒香不怕巷子深"];

/** total tokens after 0…30 merges (most frequent pair each time) */
export const TOKENS_BY_MERGE = [
  1449, 1442, 1435, 1429, 1423, 1418, 1413, 1409, 1405, 1401, 1397, 1393, 1389, 1386, 1383, 1380, 1377, 1374, 1371, 1368, 1365, 1362, 1359, 1356, 1353, 1350, 1347, 1344,
  1342, 1340, 1338,
];

/** the first 30 merged tokens, in order (BPE also merges a character with the comma before it when that pair is frequent) */
export const MERGED30 = [
  "不怕", "一个", "不如", "千里", "三个", "一山", "，十", "，一", "不可", "计在", "计在于", "之计在于", "，不", "，就", "必有",
  "萝卜", "明日", "人心", "人之", "天下", "行，", "一场", "一寸", "一年", "有所", "众人", "，就怕", "，百", "，大", "，二",
];

/** "一个篱笆三个桩，一个好汉三个帮" after 30 merges */
export const AFTER30 = ["一个", "篱", "笆", "三个", "桩", "，", "一个", "好", "汉", "三个", "帮"];

export const TRADE = [
  { merges: "0 次", tokens: "1,449 个", vocab: "506 种" },
  { merges: "30 次", tokens: "1,338 个", vocab: "536 种" },
  { merges: "60 次", tokens: "1,278 个", vocab: "566 种" },
];

export const ch93: ChapterSpec = {
  id: 93,
  part: 11,
  title: "做我自己的分词器",
  core: false,
  hook: "最适合我这份数据的词元，该怎么定？",
  steps: [
    { id: "s1", sec: 10.5, narration: "模型不能直接读文字，只读词元编号（第 29 章）。最简单的办法，是一个字当一个词元，标点也算一个。" },
    { id: "s2", sec: 10, narration: "把谚语数据按字切开，一共 1,449 个词元，词元种类 506 种。换行也是一个词元。" },
    { id: "s3", sec: 10.5, narration: "BPE 会数一数哪两个片段总是挨在一起（第 30 章）。谚语里最常见的一对是“不”和“怕”，出现 7 次。" },
    { id: "s4", sec: 10.5, narration: "把最常见的一对合成一个词元。词元种类多了一种，变成 507 种；词元总数少了 7 个，变成 1,442 个。" },
    { id: "s5", sec: 9.5, narration: "一遍遍重复。合并 30 次后，词元变成 1,338 个。同样的文字，用更少的词元装下。" },
    { id: "s6", sec: 11, narration: "合并越多越好吗？词元数会变少，但种类会变多，模型要学的嵌入也跟着变多。GPT-3 大约有 5 万种。" },
    { id: "s7", sec: 10.5, narration: "“动手试试”里做好的分词器，第 94 章的迷你 GPT 会直接拿来用。一次都不合并，就是一字一词元。" },
  ],
  playgroundTitle: "BPE 合并按钮",
  playgroundIntro: "黄色的那一对是现在最常见的一对，点它就能合并。看看每合并一次，词元数和词元种类怎么变。",
  summary: [
    "一开始一个字 = 一个词元。谚语一共 1,449 个词元，506 种。",
    "BPE：把最常见的一对合并，种类多一种，总数变少。",
    "我做的分词器会给第 94 章的模型用。不合并的话，就是按字切。",
  ],
  unlocks: "我的分词器",
  unlockLabel: "毕业项目又完成了一步",
  quiz: [
    {
      q: "BPE 先合并哪一对？",
      choices: ["出现最少的一对", "最常挨在一起出现的一对", "随便哪一对"],
      answer: 1,
      explain: "把常常挨在一起的一对合成一个，词元数减少得最多（第 30 章）。",
      review: "s3",
    },
    {
      q: "合并一次之后会怎样？",
      choices: ["词元种类多一种，词元总数变少", "种类和总数都变少", "两者都不变"],
      answer: 0,
      explain: "词典里多了“不怕”这个新词元，原来的“不”+“怕”两个变成了一个。",
      review: "s4",
    },
    {
      q: "一次都不合并就去第 94 章，模型会怎样？",
      choices: ["没法训练", "借用 GPT-3 的分词器", "一个字当一个词元"],
      answer: 2,
      explain: "不合并就是按字切的分词器。照样可以好好训练。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 93 章 做我自己的分词器",
    reads: "模型读的编号",
    oneToOne: "一个字 = 一个词元",
    space: "标点也是词元",
    tokens: "词元",
    tokensN: "1,449 个",
    tokensUnit: " 个",
    vocab: "词元种类",
    vocabN: "506 种",
    dict: "词元词典",
    more: "… 共 506 种",
    newline: "换行和标点也是词元",
    count: "数一数挨在一起的一对",
    times: " 次",
    top: "第 1！",
    merge: "合并",
    after: "合并 1 次后",
    t1: "词元 1,449 → 1,442 个",
    v1: "种类 506 → 507 种",
    again: "重复 30 次",
    t30: "词元 1,338 个",
    v30: "种类 536 种",
    merged: "新出现的词元",
    example: "一个篱笆三个桩，一个好汉三个帮",
    mergesCol: "合并",
    tokensCol: "词元数",
    vocabCol: "词元种类",
    fewer: "变少",
    moreV: "变多",
    emb: "每一种都有一行嵌入（第 33 章）",
    gpt3: "GPT-3：50,257 种",
    mine: "我的分词器",
    mineSub: "第 93 章 动手试试",
    model: "第94章 迷你 GPT",
    zero: "合并 0 次 = 一个字一个词元",
  },
};
