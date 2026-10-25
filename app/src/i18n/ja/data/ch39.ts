// ja overlay of src/data/ch39.ts: same vectors and trained weights, Japanese words
import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a tiny neural language model (illustrative) ---
// Each word has a hand-placed 2-number vector. A small network (2 → 3 tanh neurons → 8 scores → softmax)
// was trained on the imaginary counts below with a script; "犬が" was never in the training data.
export const NEXT = ["寝る", "食べる", "走る", "勉強する", "教える", "降る", "吹く", "やむ"] as const;
export const NEXT_COLORS: Highlighter[] = ["yellow", "mint", "sky", "violet", "violet", "orange", "orange", "pink"];

export type ToyWord = { w: string; e: [number, number]; group: string; counts?: Record<string, number> };
export const KNOWN: ToyWord[] = [
  { w: "猫が", e: [-0.6, 0.5], group: "動物", counts: { 寝る: 9, 食べる: 6, 走る: 4, 勉強する: 1 } },
  { w: "生徒が", e: [0.5, 0.6], group: "人", counts: { 勉強する: 10, 寝る: 4, 食べる: 3, 走る: 3 } },
  { w: "先生が", e: [0.75, 0.15], group: "人", counts: { 教える: 12, 食べる: 3, 勉強する: 3, 寝る: 2 } },
  { w: "雨が", e: [-0.45, -0.6], group: "天気", counts: { 降る: 16, やむ: 4 } },
  { w: "風が", e: [0.25, -0.75], group: "天気", counts: { 吹く: 16, やむ: 4 } },
];
export const DOG: ToyWord = { w: "犬が", e: [-0.32, 0.68], group: "動物" };

const W1 = [
  [-0.716, -2.838],
  [-2.381, 0.377],
  [-3.55, 2.615],
];
const B1 = [-0.508, 0.073, 1.299];
const W2 = [
  [-3.086, 0.777, 0.299],
  [-3.014, 0.753, -0.141],
  [-2.592, 0.083, 3.194],
  [-2.554, -1.216, 0.938],
  [-3.202, -1.034, -3.892],
  [5.054, 1.859, 2.506],
  [4.866, -1.559, -2.692],
  [4.532, 0.337, -0.212],
];
const B2 = [1.449, 1.563, -1.164, 0.961, -1.694, -0.911, -0.802, 1.642];

/** Forward pass: word vector → neuron outputs (−1…1) → scores → probabilities. */
export function nnlm(e: readonly [number, number]) {
  const h = W1.map((r, i) => Math.tanh(r[0] * e[0] + r[1] * e[1] + B1[i]));
  const s = W2.map((r, k) => r.reduce((a, w, i) => a + w * h[i], B2[k]));
  const m = Math.max(...s);
  const ex = s.map((v) => Math.exp(v - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { h, s, p: ex.map((v) => v / sum) };
}

/** The k most likely next words. */
export function top(e: readonly [number, number], k = 3) {
  const { p } = nnlm(e);
  return p
    .map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] }))
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}

// --- the scene's running example (illustrative): three word vectors → scores 3, 2, 1, −1 (ch14) ---
export const CONTEXT: { w: string; v: [number, number]; c: Highlighter }[] = [
  { w: "私は", v: [0.8, 0.1], c: "mint" },
  { w: "今日", v: [-0.3, 0.9], c: "sky" },
  { w: "学校に", v: [0.5, -0.6], c: "violet" },
];
export const OUTPUTS: { w: string; s: number; c: Highlighter }[] = [
  { w: "行く", s: 3, c: "yellow" },
  { w: "行った", s: 2, c: "mint" },
  { w: "遅れた", s: 1, c: "sky" },
  { w: "ピザ", s: -1, c: "pink" },
];
/** an older sentence the fixed window cannot see all of */
export const WINDOW_SENT = ["昨日", "私は", "弟と", "バスで", "学校に"];

export const ch39: ChapterSpec = {
  id: 39,
  part: 4,
  title: "ニューラル言語モデル",
  core: false,
  hook: "一度も見たことがない文なのに、AIはどうやって次の語を見当づけるのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "n-gramは「猫が」の次はたくさん数えていても、「犬が」を一度も見ていなければ、次の語がまったくわかりません。0回だからです。" },
    { id: "s2", sec: 10, narration: "2003年、ベンジオ(Bengio)の研究チームが新しい方法を出しました。ニューラルネットで次の語を当てる、ニューラル言語モデルです。" },
    { id: "s3", sec: 9, narration: "まず、語ごとに数のベクトルをあげます。第33章の埋め込みです。似た使われ方をする語は、近い場所に置かれます。" },
    { id: "s4", sec: 10, narration: "前の3語のベクトルをつなげて、ニューラルネットに入れます。Part 2のニューロンの層を通ると、候補の語ごとにスコアが出ます。" },
    { id: "s5", sec: 10, narration: "スコアはソフトマックス(第14章)で確率になります。行く65.7%、行った24.2%、遅れた8.9%、ピザ1.2%。" },
    { id: "s6", sec: 10, narration: "犬のベクトルは猫のベクトルと近いので、ニューラルネットを通っても似た答えが出ます。はじめて見る文も見当がつくのです。" },
    { id: "s7", sec: 10, narration: "学習では、ネットの重みと語のベクトルをいっしょに直します。10年後のWord2Vec(第34章)は、このベクトル作りだけに集中しました。" },
    { id: "s8", sec: 10, narration: "それでも限界があります。やはり前の数語だけを見る、決まった大きさの窓なのです。文全体を見るには？ 第40章で見てみましょう。" },
  ],
  playgroundTitle: "語の場所を動かそう",
  playgroundIntro: "「犬が」は、学習した文に一度も出てこなかった語です。黄色い点(犬がのベクトル)をドラッグして動かすと、ニューラルネットが出す次の語の確率がどう変わるか見てみましょう。",
  summary: [
    "2003年のニューラル言語モデル：語のベクトル(埋め込み) + ニューラルネットで次の語を予測。",
    "似た語 ＝ 近いベクトルなので、はじめて見る文もそれらしく見当をつける。",
    "学習すると語のベクトルもいっしょにみがかれる。限界：やはり前の数語だけを見る窓。",
  ],
  unlocks: "2003 ニューラル言語モデル",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "ニューラル言語モデルがn-gramよりすぐれている点は？",
      choices: ["似た語はベクトルも近いので、はじめて見る文もそれらしく見当をつける", "コーパスがまったくいらない", "文全体を一度に見る"],
      answer: 0,
      explain: "「犬が」を見たことがなくても、ベクトルが「猫が」と近ければ、ニューラルネットは似た答えを出します。",
      review: "s6",
    },
    {
      q: "前の語は、どんな形でニューラルネットに入るでしょう？",
      choices: ["語の番号1つで", "語ごとにベクトルを取り出し、つなげて", "文字数で"],
      answer: 1,
      explain: "語ごとに埋め込みのベクトルを取り出し(第33章)、それらを1列につなげて入れます。",
      review: "s4",
    },
    {
      q: "ニューラル言語モデルにまだ残っている限界は？",
      choices: ["確率を作れない", "語のベクトルを使えない", "やはり前の数語だけを見る、決まった窓である"],
      answer: 2,
      explain: "窓の外にある語は見えません。文全体をたどっていく方法が、第40章のRNNです。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第39章 ニューラル言語モデル",
    ngram: "n-gramのペアの回数表",
    catBlank: "猫が ___",
    dogBlank: "犬が ___",
    times: "回",
    never: "数えたことがない → 不明",
    notKnow: "似た語だとわからない",
    year: "2003",
    who: "ベンジオ(Bengio)の研究チーム",
    nnlm: "ニューラル言語モデル",
    nnlmEn: "Neural Network Language Model",
    idea: "語をベクトルにして、ネットに入れる！",
    planeTitle: "語ごとに数のベクトル (第33章 埋め込み)",
    animal: "動物",
    people: "人",
    weather: "天気",
    close: "似た語 ＝ 近い場所",
    emb: "埋め込み (第33章)",
    concat: "つなげる",
    layer: "層 (第18章)",
    score: "スコア",
    softmax: "ソフトマックス (第14章)",
    demo: "* 説明用の例",
    nearIn: "近いベクトル",
    sameOut: "似た答え",
    unseen: "はじめて見る文も見当がつく！",
    learnTitle: "学習するといっしょにみがかれる",
    weights: "ネットの重み",
    vectors: "語のベクトル",
    drift: "似た使われ方の語はだんだん近くに",
    w2v: "2013 Word2Vec：ベクトル作りに集中 (第34章)",
    windowNote: "前の3語の窓",
    outside: "窓の外は見えない",
    which: "行った？",
    next: "第40章：RNN メモのリレー",
  },
};
