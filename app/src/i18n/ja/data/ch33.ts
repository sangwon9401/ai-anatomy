// ja overlay of src/data/ch33.ts: same vectors, Japanese words
import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V3 = [number, number, number];

// illustrative 3-number embeddings (illustrative), four themed clusters; nearest neighbours and label overlaps
// (for the scene's view angles) checked with a script. `side`/`dy` place the word label in the scene.
export const STARS: { w: string; v: V3; group: number; side?: "l"; dy?: number }[] = [
  { w: "犬", v: [0.8, 0.7, -0.2], group: 0, side: "l" },
  { w: "猫", v: [0.6, 0.9, 0.0], group: 0 },
  { w: "うさぎ", v: [0.35, 0.85, -0.55], group: 0, side: "l" },
  { w: "トラ", v: [1.0, 0.75, 0.2], group: 0 },
  { w: "りんご", v: [-0.7, 0.5, 0.5], group: 1, side: "l" },
  { w: "ぶどう", v: [-0.95, 0.75, 0.55], group: 1, side: "l" },
  { w: "バナナ", v: [-0.5, 0.95, 0.75], group: 1 },
  { w: "いちご", v: [-0.8, 0.9, 0.2], group: 1, side: "l" },
  { w: "バス", v: [0.1, -0.8, 0.5], group: 2, side: "l", dy: 10 },
  { w: "地下鉄", v: [0.5, -0.95, 0.3], group: 2 },
  { w: "自転車", v: [-0.15, -0.55, 0.85], group: 2, side: "l" },
  { w: "飛行機", v: [0.45, -0.4, 0.95], group: 2 },
  { w: "学校", v: [-0.3, -0.4, -0.75], group: 3 },
  { w: "先生", v: [0.0, -0.15, -0.95], group: 3 },
  { w: "宿題", v: [-0.6, -0.35, -0.6], group: 3, side: "l" },
  { w: "教室", v: [-0.35, -0.75, -0.9], group: 3 },
];
export const GROUPS: { name: string; c: Highlighter }[] = [
  { name: "動物", c: "yellow" },
  { name: "果物", c: "pink" },
  { name: "乗り物", c: "sky" },
  { name: "学校", c: "mint" },
];

export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** small seeded PRNG so the "before training" positions are the same everywhere */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(33);
export const RANDOM_START: V3[] = STARS.map(() => [rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9]);

/** Turn around the vertical axis by `yaw`, tilt by `pitch`; returns screen x, y and depth (−1 far … 1 near). */
export function project(v: V3, yaw: number, pitch: number) {
  const x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw);
  const z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  const y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return { x: x1, y: y2, z: z2 };
}

// GPT-3: 50,257 tokens × 12,288 numbers = 617,558,016
export const GPT3_TABLE = 50257 * 12288;

export const ch33: ChapterSpec = {
  id: 33,
  part: 3,
  title: "埋め込み：意味の座標",
  core: true,
  hook: "「犬」と「猫」が似ていることを、数でどうやって表すのでしょう？",
  steps: [
    { id: "s1", sec: 9.5, narration: "ワンホットの代わりに、単語ごとに短い数の列をあげます。犬は[0.8, 0.7, −0.2]。単語をこんな数の列に変えるのが埋め込みです。", tts: "ワンホットの代わりに、単語ごとに短い数の列をあげます。犬は0.8、0.7、マイナス0.2。単語をこんな数の列に変えるのが埋め込みです。" },
    { id: "s2", sec: 7, narration: "数が3つなら、3D空間の点1つになります。単語たちが星座のように空間に浮かんでいます。" },
    { id: "s3", sec: 8, narration: "意味が似た単語は近くに集まります。動物は動物どうし、果物は果物どうし。第8章の単語地図を3Dにしたものです。" },
    { id: "s4", sec: 8.5, narration: "似ている度合いは内積で測れます(第9章)。犬・猫は1.11、犬・バスは−0.58。向きが同じほど大きくなります。", tts: "似ている度合いは内積で測れます。犬と猫は1.11、犬とバスはマイナス0.58。向きが同じほど大きくなります。" },
    { id: "s5", sec: 8, narration: "モデルの中には埋め込みの表があります。1行がトークン1つ。トークン番号でその行を探して、取り出して使います。" },
    { id: "s6", sec: 8.5, narration: "最初、表には数がでたらめに入っています。次のかけら当てを学習するうちに、似た単語どうしが自分の場所を見つけていきます。" },
    { id: "s7", sec: 8.5, narration: "本物の大きさは？ GPT-3はトークンごとに数が12,288個、行は約5万。この表だけで6億個以上の数が入っています。" },
    { id: "s8", sec: 7.5, narration: "トークンを意味の座標に変える埋め込み。設計図の2つめの部品が埋まりました。次の章では、座標が意味を持つしくみを見ます。" },
  ],
  playgroundTitle: "星座を回そう",
  playgroundIntro: "空間をドラッグして回してみましょう。星(単語)を押すと、その単語の3つの数と、いちばん近い単語が出ます。スライダーで学習前と学習後をくらべましょう。",
  summary: [
    "埋め込み：トークンごとに短い数の列(ベクトル)をあげること。その数がそのまま座標。",
    "意味が似た単語は近くに、同じ向きに置かれる(距離は第8章、内積は第9章)。",
    "埋め込みの表の数は学習で決まる。GPT-3の表には6億個以上の数。",
  ],
  unlocks: "埋め込み",
  quiz: [
    {
      q: "埋め込みとは？",
      choices: ["トークンごとに意味のこもった短い数の列をあげること", "トークンに番号をつけること", "単語を五十音順に並べること"],
      answer: 0,
      explain: "番号(第29章)やワンホット(第32章)とちがい、似た単語どうしが似た数になるように作った座標です。",
      review: "s1",
    },
    {
      q: "犬[0.8, 0.7, −0.2]と猫[0.6, 0.9, 0]の内積は？",
      choices: ["0", "1.11", "−0.58"],
      answer: 1,
      explain: "0.8×0.6 + 0.7×0.9 + (−0.2)×0 = 0.48 + 0.63 + 0 = 1.11です。",
      review: "s4",
    },
    {
      q: "埋め込みの表の数は、どうやって決まるでしょう？",
      choices: ["人が単語ごとに1つずつ決める", "辞書の順番で決まる", "最初はでたらめで、学習しながら直される"],
      answer: 2,
      explain: "次のかけら当てを練習しながら、少しずつ直されます。そのうちに似た単語どうしが集まります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第33章 埋め込み：意味の座標",
    dog: "犬",
    dogVec: "[0.8, 0.7, −0.2]",
    emb: "埋め込み＝単語 → 数の列",
    oneHot: "ワンホット：約20万欄",
    short: "埋め込み：数がいくつか",
    point: "数3つ＝3D空間の点",
    constel: "単語の星座",
    example: "説明用の例 (本物は数千個)",
    near: "意味が似ていれば近くに",
    dotTitle: "内積で似ている度合いを測る (第9章)",
    dot1: "犬 · 猫 = 1.11",
    dot2: "犬 · バス = −0.58",
    sameDir: "同じ向き＝大きい",
    table: "埋め込みの表",
    rowNote: "1行＝トークン1つ",
    lookup: "トークン番号で行を取り出す",
    matmul: "ワンホット × 表 ＝ その行 (第11章 行列の積)",
    before: "学習前：でたらめ",
    after: "学習後：似たものどうし",
    real: "GPT-3の埋め込みの表",
    rows: "行 50,257個 (トークン)",
    cols: "列 12,288個 (数)",
    total: "50,257 × 12,288 = 617,558,016",
    over: "6億個以上の数！",
    bp: "設計図の2つめの部品が完成！",
    empty: "空き",
    next: "次：座標はどうやって意味を持つ？ (第34章)",
    ax1: "欄1",
    ax2: "欄2",
    ax3: "欄3",
    id: "番号",
  },
};
