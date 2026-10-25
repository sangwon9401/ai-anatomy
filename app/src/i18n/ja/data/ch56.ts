import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

/** s1: the telephone game (伝言ゲーム), each line one more person down the chain; changed characters come from GARBLE. */
export const PHONE = ["私は 今日 学校に 行く", "私は 今日 学校に 着く", "私は 京都 学校に 着く", "君は 京都 楽校に 着け", "君も 京都 楽器で 着け"];

/** character swaps in the order they happen (the playground garbles the sentence the same way); each keeps the length */
export const GARBLE: [string, string][] = [
  ["行く", "着く"],
  ["今日", "京都"],
  ["私", "君"],
  ["学", "楽"],
  ["く", "け"],
  ["は", "も"],
  ["校", "器"],
  ["に", "で"],
];

export function garble(sentence: string, k: number) {
  let s = sentence;
  for (const [a, b] of GARBLE.slice(0, k)) s = s.replace(a, b);
  return s;
}

/** s2: one vector replaced layer after layer (説明用) */
export const DRIFT = [
  [2.0, 1.0, -1.0, 3.0],
  [2.5, -0.5, 0.5, 2.9],
  [2.4, -1.4, 1.4, 2.3],
  [2.0, -2.1, 2.1, 1.5],
  [1.6, -2.4, 2.4, 0.8],
];

/** s4: x + f(x) (説明用) */
export const RES_X = [2.0, 1.0, -1.0, 3.0];
export const RES_F = [0.3, -0.2, 0.5, 0.1];

export const cosine = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b);

// ---- playground: a toy 8-number vector through up to 48 layers ----
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(3);
const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
export const TOY_D = 8;
export const TOY_X0 = [1.5, -0.8, 0.6, 1.2, -1.4, 0.3, -0.5, 0.9];
const LAYERS = Array.from({ length: 48 }, () =>
  Array.from({ length: TOY_D }, (_, i) => Array.from({ length: TOY_D }, (_, k) => (i === k ? 0.7 : 0) + (gauss() * 0.7) / Math.sqrt(TOY_D))),
);
const part = (W: number[][], x: number[]) => W.map((r) => Math.tanh(r.reduce((s, w, k) => s + w * x[k], 0)));

/** Run n layers. Without the highway each layer replaces the vector (kept at the same size, so only the direction changes). */
export function runLayers(n: number, highway: boolean) {
  let x = TOY_X0;
  const size0 = Math.hypot(...TOY_X0);
  for (const W of LAYERS.slice(0, n)) {
    const f = part(W, x);
    if (highway) x = x.map((v, k) => v + 0.15 * f[k]);
    else {
      const s = Math.hypot(...f);
      x = f.map((v) => (v / s) * size0);
    }
  }
  return { x, keep: Math.max(0, cosine(x, TOY_X0)), size: Math.hypot(...x), size0 };
}

export const ch56: ChapterSpec = {
  id: 56,
  part: 6,
  title: "情報の高速道路",
  core: false,
  hook: "層を96個も通ったら、最初の文の情報は全部消えてしまわないでしょうか？",
  steps: [
    { id: "s1", sec: 8.5, narration: "伝言ゲームをしたことはありますか？ たくさんの人を通るほど、最初の言葉がどんどんおかしく変わりますよね。" },
    { id: "s2", sec: 9.5, narration: "層を深く積んでも同じことが起きます。層ごとにベクトルを丸ごと取りかえると、最初の情報がだんだんぼやけます。" },
    { id: "s3", sec: 10, narration: "だからブロックはベクトルを取りかえません。部品が出した結果を元のベクトルに足します。x + f(x)です。" },
    { id: "s4", sec: 9.5, narration: "元のxはそのまま残り、部品は直したい分だけ少し足します。だから最初の情報が消えません。" },
    { id: "s5", sec: 10, narration: "図にすると、元の情報は高速道路をまっすぐ走り、部品たちはわき道で計算した結果を足していきます。" },
    { id: "s6", sec: 10.5, narration: "学習のときにも便利です。間違えた分を直せという信号が、高速道路を通っていちばん前の層までよく届きます（第23章）。" },
    { id: "s7", sec: 9.5, narration: "結果を元の値に足すこの道を、残差接続といいます。部品は「直す差」だけを受け持てばいいのです。" },
  ],
  playgroundTitle: "高速道路をオン・オフ",
  playgroundIntro: "層の数を増やしてみましょう。高速道路（残差接続）をオフにすると最初の情報がどれだけ残るか、オンにするとどうなるか比べてみましょう。",
  summary: [
    "層ごとにベクトルを丸ごと取りかえると、最初の情報がぼやける。伝言ゲームのように。",
    "残差接続：出力 = x + f(x)。元の情報は高速道路で運び、部品は直す差だけを足す。",
    "直す信号も高速道路で前の層までよく届くので、深く積める。",
  ],
  unlocks: "残差接続",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "残差接続を式で書くと？（xは元のベクトル、fは部品）",
      choices: ["f(x)", "x + f(x)", "x × f(x)"],
      answer: 1,
      explain: "部品の結果f(x)を元のベクトルxに足します。取りかえ（f(x)だけを残す）ではありません。",
      review: "s3",
    },
    {
      q: "x = [2, 1]で、部品の結果がf(x) = [0.5, −0.5]なら、ブロックが出す値は？",
      choices: ["[0.5, −0.5]", "[2, 1]", "[2.5, 0.5]"],
      answer: 2,
      explain: "x + f(x) = [2 + 0.5, 1 − 0.5] = [2.5, 0.5]です。",
      review: "s4",
    },
    {
      q: "残差接続のおかげで学習が楽になるのはなぜ？",
      choices: ["直す信号が高速道路で前の層までよく届くから", "計算する数が減るから", "単語の数が減るから"],
      answer: 0,
      explain: "部品をひとつずつ通ると信号は弱まりますが、高速道路なら弱まらずに届きます（第23章 誤差逆伝播法）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第56章 情報の高速道路",
    person: "人目",
    orig: "最初",
    layer: "層",
    keep: "最初と似ている度合い",
    blur: "最初の情報がぼやける",
    toy: "説明用の例",
    swap: "取りかえ",
    add: "足し算",
    x: "x",
    fx: "f(x)",
    xfx: "x + f(x)",
    xMeans: "x = 元のベクトル",
    fMeans: "f(x) = 部品が出した結果",
    origVec: "元のx",
    plusF: "+ f(x)",
    out: "= 出力",
    stays: "xがそのまま生きている！",
    road: "高速道路",
    straight: "元の情報がまっすぐ走る",
    side: "わき道で計算",
    plusNote: "⊕ で足す",
    lost: "xは消える",
    w1: "私は",
    w2: "今日",
    w3: "学校に",
    noRoad: "高速道路なし",
    withRoad: "高速道路あり",
    part: "部品",
    weak: "だんだん弱まる",
    strong: "そのまま届く！",
    signal: "↑ 間違えた分を直せという信号",
    name: "残差接続",
    en: "（residual connection）",
    diff: "残差 = 残った差：部品は直す差だけ",
    deep: "おかげで96層も積める",
    resnet: "2015年、画像認識のResNetがこの方法で152層を積みました",
  },
};
