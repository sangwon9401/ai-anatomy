import type { ChapterSpec, Highlighter } from "../../../data/types";

// 説明用の例. Scores (logits) chosen so that softmax over the whole GPT-3 vocabulary (50,257 tokens)
// gives the course's numbers: 行く 52%, 行った 21%, 遅れた 12% (ch01).
export const VOCAB = 50257;
export const LOGITS: { w: string; s: number; c: Highlighter }[] = [
  { w: "行く", s: 3.0, c: "yellow" },
  { w: "行った", s: 2.1, c: "mint" },
  { w: "遅れた", s: 1.5, c: "sky" },
  { w: "ピザ", s: -1.0, c: "pink" },
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

/** s1–s2: the last vector of 「学校に」 and each token's output vector (説明用); their dot products are the scores. */
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

/** words a 「その他」 draw can turn into in the playground (just examples of other tokens) */
export const OTHERS = ["家に", "来た", "行って", "いる", "着く", "そして"];

export const ch60: ChapterSpec = {
  id: 60,
  part: 6,
  title: "ベクトルから単語へ",
  core: false,
  hook: "96層を通って出てきたのは、12,288個の数のベクトル。これをどうやって「行く」という単語に変えるのでしょう？",
  steps: [
    { id: "s1", sec: 9.5, narration: "96層を通り終えると、単語ごとにベクトルが1本ずつ出てきます。次の言葉を決めるのは、最後の単語「学校に」のベクトルです。" },
    { id: "s2", sec: 9.5, narration: "このベクトルを単語帳のトークン1つ1つと比べて点数をつけます。向きが似ているほど点数が高くなります（第9章 内積）。" },
    { id: "s3", sec: 10, narration: "単語帳のトークンは約5万個、50,257個。だから点数も50,257個出ます。この点数をロジット（logit）といいます。" },
    { id: "s4", sec: 9.5, narration: "行く3.0点、行った2.1点、遅れた1.5点、ピザ −1.0点。残りの5万個あまりは、ほとんどが −9点くらいです。" },
    { id: "s5", sec: 9.5, narration: "ここで第14章のソフトマックス！ eの累乗にして、5万個全部の合計で割ります。全部足すと約38.72です。" },
    { id: "s6", sec: 9.5, narration: "行く52%、行った21%、遅れた12%。残りの5万個あまりが少しずつ集まって14%になりました。" },
    { id: "s7", sec: 9, narration: "あとは確率どおりに1つ選んで、文の最後につなげます（第1、2章）。設計図に出力 + ソフトマックスが入りました！" },
  ],
  playgroundTitle: "5万個の中から選ぶ",
  playgroundIntro: "点数を変えて「1つ選ぶ」を押してみましょう。候補が4個だけのときと5万個のときで、確率がどうちがうかも比べてみましょう。",
  summary: [
    "最後の層から出た、最後の単語のベクトルで次の言葉を決める。",
    "トークン約5万個（50,257個）と1つずつ比べて点数（ロジット）をつける。12,288 × 50,257の行列の積が1回（第11章）。",
    "ソフトマックス（第14章）で確率にして、1つ選んでつなげる。行く52%、行った21%、遅れた12%。",
  ],
  unlocks: "出力 + ソフトマックス",
  quiz: [
    {
      q: "次の言葉を決めるときに使うベクトルは？",
      choices: ["最後の単語の、最後の層のベクトル", "先頭の単語のベクトル", "全単語のベクトルの平均"],
      answer: 0,
      explain: "最後の単語「学校に」のベクトルは、目かくしのおかげで前の単語を全部見てきています（第51章）。だから次の言葉を決めるのに使います。",
      review: "s1",
    },
    {
      q: "GPT-3は次の言葉の候補ごとに点数をいくつ出す？",
      choices: ["96個", "12,288個", "約5万個（50,257個）"],
      answer: 2,
      explain: "単語帳のトークンごとに点数を1つずつつけるので、50,257個出てきます。",
      review: "s3",
    },
    {
      q: "点数（ロジット）を確率に変える計算は？",
      choices: ["正規化", "ソフトマックス", "残差接続"],
      answer: 1,
      explain: "eの累乗にして全体の合計で割るソフトマックスです（第14章）。合計がちょうど100%になります。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第60章 ベクトルから単語へ",
    w1: "私は",
    w2: "今日",
    w3: "学校に",
    after: "96層を通ったベクトル",
    sawAll: "前を全部見てきた（51章）",
    toy: "説明用の例",
    lastVec: "「学校に」のベクトル",
    compare: "トークンごとに比べて点数をつける",
    dotEx: "1.0×1.0 + 2.0×1.0 + 0.5×0.0 + (−1.0)×0.0 = 3.0",
    similar: "向きが似ているほど点数が高い（第9章）",
    vocab: "単語帳のトークン50,257個",
    logit: "点数50,257個 = ロジット（logit）",
    matmul: "12,288 × 50,257の行列の積が1回（第11章）",
    rest: "その他",
    restN: "50,253個",
    restScore: "約−9.1",
    mostly: "ほとんど",
    expTitle: "① eの累乗にする",
    divTitle: "② 全部の合計で割る",
    restSum: "その他の合計",
    total: "合計 = 100%",
    gather: "集まって14% ↘",
    pick: "確率どおりに1つ選んでつなげる",
    filled: "完成！",
    vdots: "⋮",
    stack: "トランスフォーマーブロック × 96層",
  },
};
