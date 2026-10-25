import { UNLOCK6 } from "../../../data/ch54";
import { stats } from "../../../data/ch15";
import type { ChapterSpec } from "../../../data/types";

// 説明用の例. A word vector early on, and the same word much later: same shape, 4× the size.
export const EARLY = [3, 17, 9, 11]; // mean 10, spread 5
export const LATE = [12, 68, 36, 44]; // mean 40, spread 20

/** s5: every word normalised with its own numbers */
export const ROWS: { w: string; v: number[] }[] = [
  { w: "私は", v: [2.7, 1.9, 1.3, 2.1] },
  { w: "今日", v: [-3, 1, 1, -3] },
  { w: "学校に", v: EARLY },
];

/** s6: the learned scale and shift (説明用) */
export const GAIN = [1.5, 0.5, 2.0, 1.0];
export const SHIFT = [0, 0.3, 0, -0.2];

/** s1: one vector drifting bigger through the layers (説明用) */
export const GROW_STRIP = [0.9, -0.6, 0.4, 1.1, -0.9, 0.3, -0.4, 0.7];
export const GROW = [
  { layer: 1, k: 1 },
  { layer: 24, k: 2 },
  { layer: 48, k: 3.2 },
  { layer: 96, k: 5 },
];

/** Layer normalisation of one vector: subtract its mean, divide by its spread (第15章), then scale and shift. */
export function layerNorm(v: number[], gain: number[] | number = 1, shift: number[] | number = 0) {
  const { mean, sd } = stats(v);
  const z = v.map((x) => (x - mean) / sd);
  const g = (i: number) => (typeof gain === "number" ? gain : gain[i]);
  const b = (i: number) => (typeof shift === "number" ? shift : shift[i]);
  return { mean, sd, z, out: z.map((x, i) => x * g(i) + b(i)) };
}

/** playground: the three words' vectors after `layer` layers (説明用; they grow at different rates and drift a little) */
export function wordsAt(layer: number) {
  return ROWS.map((r, wi) => {
    const k = 1 + (layer - 1) * [0.03, 0.05, 0.04][wi];
    return { w: r.w, v: r.v.map((x, i) => x * k + Math.sin(layer * 0.21 + i * 1.7 + wi) * 0.04 * layer) };
  });
}

export const ch57: ChapterSpec = {
  id: 57,
  part: 6,
  title: "ゆれを抑える",
  core: false,
  hook: "結果を足し続けたら、96層あたりでは数がとんでもなく大きくならないでしょうか？",
  steps: [
    { id: "s1", sec: 8.5, narration: "第56章で、結果を足し続けると言いましたね。層を通るたびに足すと、ベクトルの数がだんだん大きくなります。" },
    { id: "s2", sec: 10, narration: "同じ「学校に」なのに層ごとに大きさがこんなに違うと、部品は毎回ちがう物差しで計算することになります。計算がゆれます。" },
    { id: "s3", sec: 9.5, narration: "そこで部品に入れる直前に、第15章の正規化をします。1つの単語ベクトルの中の数だけで、平均とばらつきを求めます。" },
    { id: "s4", sec: 9.5, narration: "平均10を引いて、ばらつき5で割るとこうなります。4倍に大きくなったベクトルでも同じ結果になります。" },
    { id: "s5", sec: 9.5, narration: "この計算は単語ごとに別々にします。各単語が、自分の12,288個の数だけで平均とばらつきを求めます。" },
    { id: "s6", sec: 9.5, narration: "最後に、数ごとに倍率をかけて値を足します。この値は学習で決まるので、ちょうどいい大きさをモデルが選びます。" },
    { id: "s7", sec: 9.5, narration: "GPTでは、アテンションとフィードフォワードに入る直前に毎回正規化します。高速道路の上の元の値はそのままです。" },
  ],
  playgroundTitle: "大きさをそろえる実験",
  playgroundIntro: "層のスライダーを上げて、単語ベクトルを大きくしてみましょう。レイヤー正規化をオンにすると、部品に入る数がどう変わるか見てみましょう。",
  summary: [
    "層を通りながら結果を足していくと、ベクトルの数が大きくなり、ばらばらになる。",
    "レイヤー正規化：単語ごとに自分の数で平均を引き、ばらつきで割る（第15章）。そのあと倍率をかけて値を足す。",
    "GPTは、アテンションとフィードフォワードに入る直前に毎回正規化する。",
  ],
  unlocks: "レイヤー正規化",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "単語ベクトル[3, 17, 9, 11]を正規化するとき、引く値は？",
      choices: ["平均の10", "いちばん大きい17", "いちばん小さい3"],
      answer: 0,
      explain: "(3 + 17 + 9 + 11) ÷ 4 = 10。平均を引いて、ばらつき5で割ります。",
      review: "s3",
    },
    {
      q: "レイヤー正規化で、平均とばらつきは何から求める？",
      choices: ["全単語の同じ位置の数から", "1つの単語の自分の数から", "学習データ全体から"],
      answer: 1,
      explain: "単語ごとに別々に、自分のベクトルの中の数どうしで計算します。GPT-3なら12,288個どうしです。",
      review: "s5",
    },
    {
      q: "GPTでレイヤー正規化があるのはどこ？",
      choices: ["最初のトークナイザーの前だけ", "ソフトマックスの後ろだけ", "アテンションとフィードフォワードに入る直前に毎回"],
      answer: 2,
      explain: "ブロックごとに2回、部品に入れる直前に大きさをそろえます。高速道路の上の値にはさわりません。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第57章 ゆれを抑える",
    layer: "層",
    grow: "層を通るほど大きくなる",
    fine: "ちょうどいい大きさ",
    toy: "説明用の例",
    early: "3層めの「学校に」",
    late: "90層めの「学校に」",
    same: "形は同じなのに大きさは4倍！",
    shaky: "部品は毎回ちがう物差しで計算 → ゆれる",
    mean: "平均",
    spread: "ばらつき",
    step1: "① 平均を引く",
    step2: "② ばらつきで割る",
    ch15: "（第15章）",
    equal: "同じになった！",
    title: "レイヤー正規化",
    en: "（layer normalization）",
    own: "単語ごとに別々に、自分の数どうしで",
    real: "（GPT-3：1単語あたり12,288個）",
    z: "正規化した値",
    gain: "× 倍率",
    shift: "+ ずらし",
    out: "= 部品に入る値",
    learned: "倍率とずらしは学習で決まる",
    before: "部品の直前",
    keepRoad: "高速道路の上の値はそのまま",
    arrow: "→",
    w1: "私は",
    w2: "今日",
    w3: "学校に",
  },
};
