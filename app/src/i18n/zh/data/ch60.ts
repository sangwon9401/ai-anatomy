import type { ChapterSpec, Highlighter } from "../../../data/types";

// 示意数据. Scores (logits) chosen so that softmax over the whole GPT-3 vocabulary (50,257 tokens)
// gives the course's numbers: 学校 52%, 图书馆 21%, 公园 12% (ch01).
export const VOCAB = 50257;
export const LOGITS: { w: string; s: number; c: Highlighter }[] = [
  { w: "学校", s: 3.0, c: "yellow" },
  { w: "图书馆", s: 2.1, c: "mint" },
  { w: "公园", s: 1.5, c: "sky" },
  { w: "披萨", s: -1.0, c: "pink" },
];
export const REST_N = VOCAB - LOGITS.length; // 50,253
/** e^score summed over the other 50,253 tokens (their scores are mostly around −9.1) */
export const REST_SUM = 5.614;
export const REST_SCORE = Math.log(REST_SUM / REST_N); // ≈ −9.1

export function outputProbs(scores: number[], wholeVocab = true) {
  const ex = scores.map((s) => Math.exp(s));
  const rest = wholeVocab ? REST_SUM : 0;
  const sum = ex.reduce((a, b) => a + b, 0) + rest;
  return { ex, rest, sum, p: ex.map((e) => e / sum), restP: rest / sum };
}

/** s1–s2: the last vector of “去” and each token's output vector (示意数据); their dot products are the scores. */
export const LAST_VEC = [1.0, 2.0, 0.5, -1.0];
export const TOKEN_VECS = [
  [1.0, 1.0, 0.0, 0.0],
  [0.5, 1.0, 0.0, 0.4],
  [0.5, 0.5, 0.0, 0.0],
  [-1.0, 0.0, 0.0, 0.0],
];
export const OTHER_VECS = [
  [0.4, -0.3, 0.2, 0.6],
  [-0.2, 0.5, 1.1, 0.3],
];

/** words a 其余 draw can turn into in the playground (just examples of other tokens) */
export const OTHERS = ["上学", "医院", "超市", "了", "看看", "北京"];

export const ch60: ChapterSpec = {
  id: 60,
  part: 6,
  title: "从向量到词",
  core: false,
  hook: "经过 96 层出来的，是一个有 12,288 个数字的向量。怎样把它变成“学校”这个词？",
  steps: [
    { id: "s1", sec: 9.5, narration: "走完 96 层，每个词都会得到一个向量。决定下一个词的，是最后一个词“去”的向量。" },
    { id: "s2", sec: 9.5, narration: "把这个向量和词表里的每个词元逐一比较，打出分数。方向越接近，分数越高（第 9 章 点积）。" },
    { id: "s3", sec: 10, narration: "词表里约有 5 万个词元，准确地说是 50,257 个。所以分数也有 50,257 个。这些分数叫作 logit。" },
    { id: "s4", sec: 9.5, narration: "学校 3.0 分，图书馆 2.1 分，公园 1.5 分，披萨 −1.0 分。其余 5 万多个大多在 −9 分左右。" },
    { id: "s5", sec: 9.5, narration: "现在用上第 14 章的 Softmax！先取 e 的乘方，再除以全部 5 万个的总和。加起来约是 38.72。" },
    { id: "s6", sec: 9.5, narration: "学校 52%，图书馆 21%，公园 12%。其余 5 万多个词元一点一点凑起来，拿走了 14%。" },
    { id: "s7", sec: 9, narration: "然后按概率抽出一个，接到句子末尾（第 1、2 章）。设计图上的“输出 + Softmax”填好了！" },
  ],
  playgroundTitle: "从 5 万个里挑一个",
  playgroundIntro: "改一改分数，再点“抽一个”。也比较一下：候选只有 4 个时和有 5 万个时，概率有什么不同。",
  summary: [
    "用最后一层出来的、最后一个词的向量来决定下一个词。",
    "和约 5 万个（50,257 个）词元逐一比较，打出分数（logit）。就是一次 12,288 × 50,257 的矩阵乘法（第 11 章）。",
    "用 Softmax（第 14 章）变成概率，抽一个接上去。学校 52%，图书馆 21%，公园 12%。",
  ],
  unlocks: "输出 + Softmax",
  quiz: [
    {
      q: "决定下一个词时，用的是哪个向量？",
      choices: ["最后一个词的最终向量", "第一个词的向量", "所有词向量的平均"],
      answer: 0,
      explain: "多亏了帘子，最后一个词“去”的向量已经看过前面所有的词（第 51 章）。所以用它来决定下一个词。",
      review: "s1",
    },
    {
      q: "GPT-3 会给下一个词的候选打出多少个分数？",
      choices: ["96 个", "12,288 个", "约 5 万个（50,257 个）"],
      answer: 2,
      explain: "词表里的每个词元都打一个分，所以有 50,257 个。",
      review: "s3",
    },
    {
      q: "把分数（logit）变成概率的计算是什么？",
      choices: ["归一化", "Softmax", "残差连接"],
      answer: 1,
      explain: "取 e 的乘方，再除以总和，这就是 Softmax（第 14 章）。加起来正好是 100%。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 60 章 从向量到词",
    w1: "我",
    w2: "今天",
    w3: "去",
    after: "经过 96 层的向量",
    sawAll: "看过前面所有词的向量（第 51 章）",
    toy: "示意数据",
    // U+2060 (word joiner) keeps 最终向量 on one line in the 200 px label: “去”的 / 最终向量
    lastVec: "“去”的最\u2060终\u2060向\u2060量",
    compare: "和每个词元比较，打出分数",
    dotEx: "1.0×1.0 + 2.0×1.0 + 0.5×0.0 + (−1.0)×0.0 = 3.0",
    similar: "方向越接近，分数越高（第 9 章）",
    vocab: "词表里的 50,257 个词元",
    logit: "50,257 个分数 = logit",
    matmul: "一次 12,288 × 50,257 的矩阵乘法（第 11 章）",
    rest: "其余",
    restN: "50,253 个",
    restScore: "约 −9.1",
    mostly: "大多",
    expTitle: "① 取 e 的乘方",
    divTitle: "② 除以全部的总和",
    restSum: "其余之和",
    total: "总和 = 100%",
    gather: "一点点凑起来 14% ↘",
    pick: "按概率抽一个接上",
    filled: "填好了！",
    vdots: "⋮",
    stack: "Transformer 模块 × 96 层",
  },
};
