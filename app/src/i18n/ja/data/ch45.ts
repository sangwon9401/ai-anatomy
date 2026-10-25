import type { ChapterSpec } from "../../../data/types";

// ja overlay of src/data/ch45.ts. The Korean word 배 (pear / boat / belly) becomes 「かみ」 written in kana:
// 紙 (paper), 神 (god) and 髪 (hair) sound and look the same in hiragana. Meaning slots keep the Korean order
// [fruit → 紙, boat → 神, body → 髪], and every word keeps its Korean twin's scores and mix, so all numbers
// (41/10/27/11/11 % …) and the later chapters that reuse them stay the same.

/** [紙, 神, 髪] — a toy 3-dimensional "meaning" so students can see the mix. */
export type Meaning = [number, number, number];

export type ToyWord = { w: string; m: Meaning; score: number };

// Relevance score of each word *to "かみ"*. Attention weights are softmax(score), exactly like ch.14.
export const SELF: ToyWord = { w: "かみ", m: [1 / 3, 1 / 3, 1 / 3], score: 1.0 };

export const BANK: ToyWord[] = [
  { w: "神社で", m: [0.02, 0.95, 0.03], score: 2.3 },
  { w: "毎日", m: [0.33, 0.34, 0.33], score: 0.9 },
  { w: "祈る", m: [0.05, 0.9, 0.05], score: 1.9 },
  { w: "あの", m: [0.33, 0.34, 0.33], score: 1.0 },
  { w: "お参り", m: [0.03, 0.92, 0.05], score: 2.0 },
  { w: "文房具の", m: [0.95, 0.02, 0.03], score: 2.0 },
  { w: "店で", m: [0.45, 0.3, 0.25], score: 1.1 },
  { w: "ノートと", m: [0.92, 0.03, 0.05], score: 2.0 },
  { w: "白い", m: [0.85, 0.03, 0.12], score: 1.6 },
  { w: "美容院で", m: [0.1, 0.05, 0.85], score: 1.7 },
  { w: "ばっさり", m: [0.33, 0.33, 0.34], score: 0.8 },
  { w: "切った", m: [0.2, 0.03, 0.77], score: 2.0 },
  { w: "長い", m: [0.15, 0.15, 0.7], score: 1.5 },
  { w: "今日", m: [0.33, 0.33, 0.34], score: 0.3 },
];

// the key names stay the Korean file's (other chapters import them): sea → the 神 sentence, fruit → the 紙 sentence,
// meal → the 髪 sentence
export const SENTENCES = {
  sea: ["神社で", "毎日", "祈る", "あの"],
  fruit: ["文房具の", "店で", "ノートと"],
  meal: ["美容院で", "ばっさり", "切った"],
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

export const MEANING_NAMES = ["紙", "神", "髪"] as const;

export const ch45: ChapterSpec = {
  id: 45,
  part: 5,
  title: "単語どうしが見つめ合う",
  core: true,
  hook: "ひらがなで「かみ」と書いたら、紙？ 神？ 髪？ AIはどうやって見分けるのでしょう？",
  steps: [
    { id: "s1", sec: 6.5, narration: "「かみ」ということばには、意味がいくつもあります。書く紙、神社の神、そして頭の髪。" },
    { id: "s2", sec: 7.5, narration: "第33章の埋め込みでは、「かみ」はいつも同じベクトル1つ。だから、ひとりでは3つの意味のまん中あたりにいます。" },
    { id: "s3", sec: 6, narration: "では、文の中に入れてみましょう。「神社で毎日祈るあのかみ」。" },
    { id: "s4", sec: 8, narration: "「かみ」が、前にある語を見わたします。関係が深い語ほど太い線で、たくさん見つめます。" },
    { id: "s5", sec: 8.5, narration: "そして見つめた分だけ、その語の意味をまぜてきます。「神社で」と「祈る」をたくさんまぜたので、神のほうへ動きました。" },
    { id: "s6", sec: 9, narration: "文が変わるとどうでしょう？「文房具の店でノートとかみ」。今度は文房具とノートをよく見て、紙のほうへ行きます。" },
    { id: "s7", sec: 7, narration: "こうして各語が、文の中のほかの語を見て、自分の意味を直すこと。これがセルフアテンションです。" },
    { id: "s8", sec: 7, narration: "でも、関係の深さはどうやって決めるのでしょう？ 次の章で、Query、Key、Valueを使って見ていきます。" },
  ],
  playgroundTitle: "文脈を作ろう",
  playgroundIntro: "語をえらんで「かみ」の前に置いてみましょう。「かみ」の意味がどこへ動くかが見えます。",
  summary: [
    "同じ語でも、文脈によって意味がちがう。",
    "各語は前の語を見て、関係の深い語ほどたくさん見つめる。",
    "見つめた分だけ意味をまぜて、自分の意味を直す。これがセルフアテンション。",
  ],
  unlocks: "セルフアテンション",
  quiz: [
    {
      q: "セルフアテンションで「かみ」がすることは？",
      choices: ["前の語を見て、関係のある語の意味をまぜて自分の意味を直す", "辞書で意味を調べてくる", "いちばん近い語1つに入れかわる"],
      answer: 0,
      explain: "1語だけをえらぶのではなく、見つめた割合の分だけ、いくつもの語の意味をまぜます。",
      review: "s5",
    },
    {
      q: "「かみ」がほかの語を見つめる割合を全部足すと？",
      choices: ["100%", "語の数 × 100%", "そのときによってちがう"],
      answer: 0,
      explain: "割合はソフトマックス(第14章)で作るので、合計はいつも1、つまり100%です。",
      review: "s4",
    },
    {
      q: "同じ「かみ」でも、前の文が変わると？",
      choices: ["意味はそのまま", "前の語によって意味が変わる", "文が終わるまで意味がない"],
      answer: 1,
      explain: "埋め込みは同じでも、アテンションを通ると、文脈に合った意味に変わります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第45章 単語どうしが見つめ合う",
    fruit: "紙",
    boat: "神",
    body: "髪",
    bae: "かみ",
    alone: "かみ (ひとりのとき)",
    vague: "意味があいまいで、まん中",
    vec: "単語1つ ＝ ベクトル1つ (第33章)",
    toBoat: "神のほうへ！",
    toFruit: "紙のほうへ！",
    foot: "* 本物は、数百個の数でできたベクトルをまぜます",
    line: "セルフアテンション：ほかの語を見て意味を直す",
    meal: "美容院でばっさり切ったかみ",
    sum: "見つめる割合の合計は100% (第14章 ソフトマックス！)",
    ask: "関係の深さは、どう決める？",
    q: "Query",
    k: "Key",
    v: "Value",
    qd: "質問",
    kd: "ラベル",
    vd: "中身",
    seaLine: "神社で毎日祈るあのかみ",
    fruitLine: "文房具の店でノートとかみ",
    next: "次の章：第46章 Query・Key・Value",
    self: "自分",
  },
};
