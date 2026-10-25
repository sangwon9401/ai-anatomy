import type { ChapterSpec } from "../../../data/types";

// Real outputs of the offline ja checkpoints (i18n/ja/data/part11-checkpoints.ts), loaded and sampled with minigpt.ts.

/** "石" + what the ことわざ model wrote at temperature 0.3 (five samples, all the same) */
export const PROMPT = "石";
export const LOW_LINE = ["の", "上", "に", "は", "上", "が", "あ", "る"];

/** next-token probabilities (%) after "石" at three temperatures */
export const NEXT_AT: Record<string, { w: string; p: number }[]> = {
  "1": [
    { w: "の", p: 56.7 },
    { w: "二", p: 31.8 },
    { w: "橋", p: 7.9 },
    { w: "に", p: 2.1 },
  ],
  "0.3": [
    { w: "の", p: 87.1 },
    { w: "二", p: 12.8 },
    { w: "橋", p: 0.1 },
    { w: "に", p: 0.0 },
  ],
  "1.6": [
    { w: "の", p: 39.8 },
    { w: "二", p: 27.7 },
    { w: "橋", p: 11.6 },
    { w: "に", p: 5.1 },
  ],
};

/** where each candidate comes from in the data */
export const SOURCES = ["石の上にも三年", "一石二鳥", "石橋を叩いて渡る"];

/** the two proverbs the low-temperature line was stitched from */
export const STITCH = [
  { line: "石の上にも三年", keep: "石の上に" },
  { line: "上には上がある", keep: "は上がある" },
];

/** three of five lines at temperature 1.6 */
export const HIGH_LINES = ["石橋を叩いて渡る間に目あり", "石に水", "石のも借る"];

/** the 教科書の文 model, prompt "四角形は" */
export const WRONG = { before: "四角形は辺が", bad: "三", after: "つある図形である。", fix: "四" };

export const ch95: ChapterSpec = {
  id: 95,
  part: 11,
  title: "文章を生成してみる",
  core: false,
  hook: "自分で訓練したモデルは、どんな文章を書くのでしょう？",
  steps: [
    { id: "s1", sec: 10.5, narration: "いよいよモデルに文章を書かせます。やり方は第2章と同じ。次のトークンを1つ選んでつなげ、改行が出るまでくり返します。" },
    { id: "s2", sec: 11, narration: "「石」の次のトークンの確率は、の57%、二32%、橋8%。データの中の「石の上」「一石二鳥」「石橋」を学んだのです。" },
    { id: "s3", sec: 10.5, narration: "温度を下げると（第81章）1位がさらに大きくなります。温度0.3では「の」が87%で、5回書いて5回とも同じ文になりました。" },
    { id: "s4", sec: 10, narration: "でも「石の上には上がある」はデータにない文です。2つのことわざをつなぎ合わせて、それらしく作ったのです。" },
    { id: "s5", sec: 9, narration: "温度を上げると、低い棒もよく選ばれます。温度1.6では文が毎回ちがい、でたらめもまじります。" },
    { id: "s6", sec: 11, narration: "教科書の文のモデルは「四角形は辺が三つある図形である。」と書きました。もっともらしいまちがい、ハルシネーションです（第84章）。" },
    { id: "s7", sec: 10, narration: "小さくても、ChatGPTが文章を書くやり方そのものです。「やってみよう」で書き出しと温度を変えながら書かせてみましょう。" },
  ],
  playgroundTitle: "自分のモデルで書く",
  playgroundIntro: "書き出しの文字を入れて温度を決め、「1行書く」を押してみましょう。第94章で訓練したモデルがあればそのモデルが、なければ前もって訓練しておいたモデルが書きます。",
  summary: [
    "生成 = 確率を出す → 1つ選ぶ → つなげる。改行が出たら止まる。",
    "温度を下げるとぶれずに覚えた言葉、上げると多様だがでたらめも。",
    "もっともらしい組み合わせが事実とちがえばハルシネーション。小さなモデルも同じ。",
  ],
  unlocks: "自分のモデルが書いた文",
  unlockLabel: "卒業プロジェクトの1段階を終えました",
  quiz: [
    {
      q: "温度を下げると、どうなるでしょう？",
      choices: ["全部の候補の確率が同じになる", "1位の候補がもっとよく選ばれて、答えがぶれなくなる", "モデルがもっと学ぶ"],
      answer: 1,
      explain: "温度が低いと分布がとがります。温度0.3では「の」が57%から87%になりました（第81章）。",
      review: "s3",
    },
    {
      q: "「石の上には上がある」ができたのはなぜでしょう？",
      choices: ["データにそのままあったから", "人があとから入れたから", "2つのことわざのかけらをつなぎ合わせたから"],
      answer: 2,
      explain: "「石の上に」と「…には上がある」は別のことわざから来ています。モデルはもっともらしい次のかけらをつないだだけです。",
      review: "s4",
    },
    {
      q: "「四角形は辺が三つある図形である。」のような文を何というでしょう？",
      choices: ["ハルシネーション", "プロンプト", "トークン"],
      answer: 0,
      explain: "口調は教科書のようですが、事実がまちがっています。もっともらしさと事実は別の問題です（第84章）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第95章 文章を生成してみる",
    model: "ミニGPT",
    pick: "選んでつなぐ",
    runs: "モデルを動かした回数",
    stop: "改行が出たら終わり",
    t1: "温度 1",
    t03: "温度 0.3",
    t16: "温度 1.6",
    learned: "データから学んだこと",
    same: "5回とも同じ文",
    notInData: "データにない文！",
    stitched: "2つのことわざをつなぎ合わせました",
    plus: "+",
    varied: "でたらめもまじる",
    textbook: "教科書の文のモデル",
    wrong: "四角形の辺は4つ！",
    halluc: "ハルシネーション（第84章）",
    sounds: "口調はもっともらしい",
    try: "書き出し + 温度",
    same2: "ChatGPTと同じやり方",
    real: "前もって訓練したモデルの本当の出力",
  },
};
