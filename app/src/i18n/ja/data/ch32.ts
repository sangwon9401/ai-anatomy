import type { ChapterSpec, Highlighter } from "../../../data/types";

// a tiny vocabulary for the scene (5 words) and the playground (8 words)
export const VOCAB5: { w: string; c: Highlighter }[] = [
  { w: "犬", c: "yellow" },
  { w: "猫", c: "mint" },
  { w: "バス", c: "sky" },
  { w: "りんご", c: "pink" },
  { w: "学校", c: "violet" },
];
export const VOCAB8 = [...VOCAB5.map((v) => v.w), "行く", "ピザ", "私は"];

export const oneHot = (i: number, n: number) => Array.from({ length: n }, (_, k) => (k === i ? 1 : 0));
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

// real GPT-4o token ids (o200k_base) from ch29: '私は' 158341, 'に' 5280 → ratio ≈ 30.0
// (names kept from the Korean file, where they held '나는' and '에')
export const ID_NANEUN = 158341;
export const ID_E = 5280;
export const VOCAB_SIZES = [
  { name: "例の語彙", n: 8 },
  { name: "GPT-3", n: 50257 },
  { name: "GPT-4o", n: 200019 },
];

export const ch32: ChapterSpec = {
  id: 32,
  part: 3,
  title: "番号札の限界",
  core: false,
  hook: "トークンには番号があるのに、その番号をそのままモデルに入れてはだめなのでしょうか？",
  steps: [
    { id: "s1", sec: 8.5, narration: "トークンには番号がありましたね(第29章)。「私は」は158341番、「に」は5280番。この番号をそのまま入れたらどうなるでしょう？" },
    { id: "s2", sec: 9, narration: "モデルは数をかけたり足したりします(第12章)。すると「私は」は「に」の約30倍大きい値として扱われます。番号の大きさに意味はないのに。" },
    { id: "s3", sec: 8.5, narration: "そこで番号の代わりに、場所で表します。単語の数だけ欄を作り、自分の場所にだけ1を入れます。これがワンホット表現です。" },
    { id: "s4", sec: 9, narration: "これで大きさの差はなくなりました。でも問題が2つあります。1つめ、長すぎること。GPT-4oなら約20万欄のうち、1はたった1つです。" },
    { id: "s5", sec: 7.5, narration: "2つめ、どの単語もみんな同じだけ他人どうし。どの2語でも、距離は√2(第8章)、内積は0(第9章)です。", tts: "2つめ、どの単語もみんな同じだけ他人どうし。どの2語でも、距離はルート2、内積は0です。" },
    { id: "s6", sec: 7, narration: "犬と猫が似ていることを、ワンホットでは表せません。犬とバスと同じくらい遠いのです。" },
    { id: "s7", sec: 7.5, narration: "必要なのは、短くて、意味が似ていれば近くなる数の列です。それが次の章で出会う埋め込みです。" },
  ],
  playgroundTitle: "ワンホット実験室",
  playgroundIntro: "単語を2つえらんでみましょう。ワンホットベクトルと、2つの間の距離・内積が出ます。距離が√2でないペアは見つかるでしょうか？",
  summary: [
    "トークン番号の大きさには意味がないので、そのまま計算に使ってはいけない。",
    "ワンホット：単語の数だけある欄のうち、自分の場所にだけ1。大きさの差は消える。",
    "でも長すぎて(約20万欄)、どの単語も同じだけ遠い(距離√2、内積0)。",
  ],
  unlocks: "ワンホットベクトル",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "語彙が5個のとき、3番目の単語のワンホットベクトルは？",
      choices: ["[3]", "[1, 1, 1, 0, 0]", "[0, 0, 1, 0, 0]"],
      answer: 2,
      explain: "5つの欄のうち、3番目の場所にだけ1、残りは0です。",
      review: "s3",
    },
    {
      q: "ワンホットベクトルで「犬」と「猫」の内積は？",
      choices: ["1", "0", "√2"],
      answer: 1,
      explain: "1がちがう場所にあるので、かけると全部0です。「犬」と「バス」も同じく0です。",
      review: "s5",
    },
    {
      q: "ワンホットの問題ではないものは？",
      choices: ["ベクトルが長すぎる", "似た単語どうしも近くない", "単語どうしでベクトルが重なってまぎらわしい"],
      answer: 2,
      explain: "ワンホットは単語ごとに1の場所がちがうので、決して重なりません。問題は長さと「みんな同じだけ遠い」ことです。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第32章 番号札の限界",
    naneun: "私は",
    e: "に",
    into: "そのまま入れたら？",
    model: "モデル",
    r2: "√2",
    times: "× 2 →",
    ratio: "158341 ÷ 5280 ≈ 30倍",
    bigger: "「私は」が30倍大きい？！",
    noMeaning: "番号の大きさに意味はない (第6章)",
    seat: "番号の代わりに場所で",
    oneHot: "ワンホット表現 (one-hot)",
    onlyOne: "自分だけ1",
    prob1: "問題① 長すぎる",
    cells: "約20万欄",
    justOne: "1はたった1つ",
    prob2: "問題② みんな同じだけ他人",
    distLbl: "距離",
    dotLbl: "内積",
    sqrt2: "√2 ≈ 1.41",
    same: "似た2つも、似ていない2つも同じ√2",
    need: "必要：短くて、意味のこもった数の列",
    emb: "埋め込み (第33章)",
    sample: "[0.8, 0.7, −0.2]",
    zeros: "0 0 0 0 0 0 0 0 0 0 0 0 … 1 … 0 0 0 0 0 0 0 0 0",
  },
};
