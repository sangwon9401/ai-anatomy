import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V4 = [number, number, number, number];

// ja overlay of src/data/ch36.ts. Japanese marks roles with particles just like Korean, so the particle example stays:
// s1: the particles carry the roles, so these two mean the same; the third swaps the particles
export const PARTICLE_ROWS: { parts: [string, string][]; same: boolean }[] = [
  { parts: [["犬", "が"], ["人", "を"], ["かんだ", ""]], same: true },
  { parts: [["人", "を"], ["犬", "が"], ["かんだ", ""]], same: true },
  { parts: [["人", "が"], ["犬", "を"], ["かんだ", ""]], same: false },
];

// s2: same tokens, different order (real GPT-4o tokens, o200k_base: '10' '時' '11' '分'; Japanese writes no space,
// so there are 4 pieces and the second '10' sits at position 2, not 3 as in the Korean '10시 11분')
export const TIME_A = ["10", "時", "11", "分"];
export const TIME_B = ["11", "時", "10", "分"];

// illustrative token vectors (説明用の例, 4 numbers each; same numbers as the Korean file)
export const TOK_VEC: Record<string, V4> = {
  "10": [0.5, -0.3, 0.8, 0.1],
  時: [-0.6, 0.4, 0.2, -0.5],
  "11": [0.6, -0.2, 0.7, 0.3],
  分: [-0.4, 0.6, -0.3, -0.6],
};

/**
 * A 4-number position pattern in the style of the 2017 Transformer: a fast "hand" turning 1 radian per position
 * and a slow one turning 1/4 radian, each written as (sin, cos). The real paper uses many more speeds.
 */
export const SPEEDS = [1, 1 / 4];
export const pe = (p: number): V4 => [Math.sin(p * SPEEDS[0]), Math.cos(p * SPEEDS[0]), Math.sin(p * SPEEDS[1]), Math.cos(p * SPEEDS[1])];
export const add4 = (a: V4, b: V4): V4 => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const fmt = (x: number) => {
  const v = r2(x);
  return v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2);
};
export const WAVE_NAMES = ["速いsin", "速いcos", "遅いsin", "遅いcos"];
export const WAVE_COLORS: Highlighter[] = ["orange", "orange", "sky", "sky"];

// s8: what Part 3 gave us
export const PART3_TOOLS = ["ユニコード", "トークン", "BPE", "トークン効率", "ワンホット", "埋め込み", "分布仮説", "意味で検索", "位置情報"];

export const ch36: ChapterSpec = {
  id: 36,
  part: 3,
  title: "順番はどうやってわかる？",
  core: true,
  hook: "「10時11分」と「11時10分」はかけらがまったく同じなのに、AIはどうやって2つがちがうとわかるのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "「犬が人をかんだ」と「人を犬がかんだ」。順番はちがっても意味は同じです。助詞の「が」と「を」が、だれがしたかを教えてくれるからです。" },
    { id: "s2", sec: 8, narration: "でも「10時11分」と「11時10分」は、かけらがまったく同じで順番だけがちがうのに、意味がちがいます。順番も情報なのです。" },
    { id: "s3", sec: 8, narration: "アテンション(第45章)は、すべてのかけらを一度に見てまぜます。位置の情報がないと、2つの文は同じかけらの袋に見えてしまいます。" },
    { id: "s4", sec: 9, narration: "そこで、かけらのベクトルに何番目かを教える数を足します。でも1, 2, 3をそのまま足すと、2,000番目のかけらは意味がうもれてしまいます。" },
    { id: "s5", sec: 8.5, narration: "もとのトランスフォーマー(2017年)はサイン波を使いました。速さのちがう波から、その位置の高さを読みます。値はいつも−1から1の間です。", tts: "もとのトランスフォーマーはサイン波を使いました。速さのちがう波から、その位置の高さを読みます。値はいつもマイナス1から1の間です。" },
    { id: "s6", sec: 8.5, narration: "時計の速い針と遅い針をいっしょに見れば、時刻がわかりますね。波も同じです。位置ごとに、もようがすべてちがいます。" },
    { id: "s7", sec: 9, narration: "このもようを、かけらのベクトルに足します。すると同じ「10」でも、0番の位置と2番の位置ではベクトルがちがい、順番が入ります。" },
    { id: "s8", sec: 8.5, narration: "文字、トークン、番号、埋め込み、位置情報。これで文章が、モデルが計算できる数になりました。Part 3はここまで、次はPart 4です。" },
  ],
  playgroundTitle: "位置のもよう実験室",
  playgroundIntro: "2つの文を切りかえながら「位置情報を足す」をオン・オフしてみましょう。位置情報がないと、モデルにとって2つの文は同じかけらの集まりです。",
  summary: [
    "同じかけらでも、順番が変わると意味が変わる(10時11分 ≠ 11時10分)。日本語は助詞も役割を教えてくれる。",
    "位置情報：かけらのベクトルに「何番目か」を表すもようを足す。",
    "もようは速さのちがうサイン波で作る(2017年)。値は−1〜1で、位置ごとにちがう。",
  ],
  unlocks: "位置情報",
  quiz: [
    {
      q: "「犬が人をかんだ」と「人を犬がかんだ」の意味が同じなのはなぜ？",
      choices: ["AIが順番を無視するから", "助詞の「が」「を」が、だれがしたかを教えてくれるから", "2つの文の文字数が同じだから"],
      answer: 1,
      explain: "日本語は助詞が役割を表すので、順番を入れかえても意味が同じことが多いです。「人が犬を」のように助詞が変わると、意味が変わります。",
      review: "s1",
    },
    {
      q: "位置ごとに1, 2, 3, …をそのまま足すと、どんな問題が起きる？",
      choices: ["計算が遅くなりすぎる", "うしろのかけらは数が大きくなりすぎて、もとの意味がうもれる", "最初のかけらが消える"],
      answer: 1,
      explain: "2,000番目のかけらに2,000を足すと、0.5のような意味の数はまったく目立ちません。サイン波はいつも−1〜1の間なので大丈夫です。",
      review: "s4",
    },
    {
      q: "位置情報を足すと、「10時11分」と「11時10分」の「10」のベクトルは？",
      choices: ["まったく同じ", "どちらも0になる", "位置がちがうので、たがいにちがってくる"],
      answer: 2,
      explain: "0番の位置と2番の位置ではもようがちがうので、足した結果もちがいます。だからモデルは順番がわかります。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第36章 順番はどうやってわかる？",
    sameMeaning: "同じ意味",
    particle: "助詞が役割を教えてくれる",
    diff: "助詞が変わると、ちがう意味",
    eq: "=",
    neq: "≠",
    orderMatters: "同じかけら、ちがう順番 → ちがう意味",
    src: "GPT-4oのトークナイザー (o200k_base)",
    attn: "アテンションは一度に見る (第45章)",
    bag: "位置情報がないと同じ袋？！",
    addPos: "かけらのベクトル + 位置 = 入力",
    tokVec: "「10」のベクトル (説明用の例)",
    plain: "1, 2, 3…をそのまま足すと？",
    pos1: "1番目：+1",
    pos2000: "2,000番目：+2000",
    buried: "意味がうもれる！",
    waves: "サイン波のもよう (2017年)",
    readAt: "3番の位置の値",
    range: "値はいつも −1 〜 1",
    speedsNote: "説明用の例：速さは2種類だけ (本物のトランスフォーマーはずっと多い)",
    clockTitle: "位置ごとにちがうもよう",
    fast: "速い針",
    slow: "遅い針",
    clock: "時計のように：2本の針で時刻がわかる",
    posNo: "位置",
    addTitle: "同じ「10」、ちがう位置",
    at0: "10時11分：0番の位置",
    at3: "11時10分：2番の位置",
    differ: "位置がちがえばベクトルもちがう！",
    learned: "* GPT-2・3はこのもようも学習で決める",
    from0: "位置の番号は0から数える",
    done: "Part 3 完成：文章が数になった！",
    bp: "設計図の前半が完成",
    next: "次：Part 4 トランスフォーマー以前の物語",
    space: "␣",
    ten: "「10」",
    ops: "+=→",
  },
};
