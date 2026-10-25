import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

export const MODELS = [
  { name: "GPT-1", year: "2018", layers: 12 },
  { name: "GPT-2", year: "2019", layers: 48 },
  { name: "GPT-3", year: "2020", layers: 96 },
];

// GPT-3: per block, attention 4·d² + feed-forward 8·d² weights (d = 12,288)
export const PER_LAYER = 12 * 12288 * 12288; // 1,811,939,328 ≈ 18億
export const ALL_LAYERS = PER_LAYER * 96; // 173,946,175,488 ≈ 1,740億 (of 1,750億)

/** What the vector of 「学校に」 carries at each depth (説明用, a rough picture of what research finds). */
export const DEPTH_NOTES = [
  { layer: 1, note: "学校 + に、文字のかけら", band: "shallow" },
  { layer: 24, note: "学校 = 場所、「に」= 行き先", band: "shallow" },
  { layer: 48, note: "行くのは「私」", band: "middle" },
  { layer: 72, note: "今日起きること", band: "deep" },
  { layer: 96, note: "次は「行く」のような言葉", band: "deep" },
] as const;

/** Peeking at the next-word guess after each depth (説明用の例; the last one is the course's 52%). */
export const PEEK_LAYERS = [1, 12, 24, 48, 72, 96];
export const PEEK = [
  { w: "行く", c: "yellow" as const, p: [2, 4, 9, 27, 44, 52] },
  { w: "行った", c: "mint" as const, p: [2, 5, 12, 22, 22, 21] },
  { w: "遅れた", c: "sky" as const, p: [1, 2, 4, 9, 12, 12] },
  { w: "ピザ", c: "pink" as const, p: [3, 3, 2, 1, 1, 1] },
];

/** Linear blend of the PEEK numbers at any layer 1–96. */
export function peekAt(layer: number) {
  let i = PEEK_LAYERS.findIndex((l) => l >= layer);
  if (i <= 0) i = 1;
  const a = PEEK_LAYERS[i - 1];
  const b = PEEK_LAYERS[i];
  const t = Math.max(0, Math.min(1, (layer - a) / (b - a)));
  return PEEK.map((r) => ({ ...r, now: r.p[i - 1] + (r.p[i] - r.p[i - 1]) * t }));
}

export const ch58: ChapterSpec = {
  id: 58,
  part: 6,
  title: "ブロックを積み重ねると",
  core: false,
  hook: "ブロック1つでも動くのに、なぜ96個も積むのでしょう？",
  steps: [
    { id: "s1", sec: 8.5, narration: "ブロックは入ったときと同じ形で出てきます。だからレゴのように、下へ次々とブロックをつなげられます。" },
    { id: "s2", sec: 8.5, narration: "GPT-1は12層、GPT-2は48層、GPT-3は96層。同じブロックの設計をくり返し積みました。" },
    { id: "s3", sec: 8, narration: "形は同じでも、層ごとに中の数はちがいます。だから層ごとに受け持つ仕事も少しずつ変わります。" },
    { id: "s4", sec: 9.5, narration: "浅い層は主に単語の形やすぐとなりの単語を、中間の層は文の中での役割や関係をあつかいます。" },
    { id: "s5", sec: 9.5, narration: "深い層ほど、文全体の意味や次に来る言葉をあつかいます。同じ「学校に」に情報が少しずつ積み重なります。" },
    { id: "s6", sec: 9, narration: "層ごとに次の言葉をのぞいてみると、深くなるほど「行く」の確率がだんだん上がっていきます。" },
    { id: "s7", sec: 9.5, narration: "GPT-3のブロック1層には数が約18億個。96層合わせると約1,740億個で、1,750億個のほぼ全部です。" },
    { id: "s8", sec: 9, narration: "こんなに深く積めるのは、高速道路と正規化のおかげです。次の章ではブロックの2つの使い方を見ます。" },
  ],
  playgroundTitle: "層ごとの探検",
  playgroundIntro: "スライダーで層を下りていきましょう。「学校に」のベクトルに何が積み重なるか、次の言葉の予想がどう変わるかが見えます。",
  summary: [
    "ブロックは入ったときと同じ形で出てくるので、いくらでも積める。GPT-1は12層、GPT-2は48層、GPT-3は96層。",
    "設計は同じでも層ごとに数がちがうので、浅い層と深い層で受け持つ仕事がちがう。",
    "深くなるほど、単語ベクトルに文脈と次の言葉の情報が積み重なる。GPT-3の数のほぼ全部がブロックにある。",
  ],
  unlocks: "ブロックを積む",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "GPT-3にはトランスフォーマーブロックが何層積まれている？",
      choices: ["12層", "48層", "96層"],
      answer: 2,
      explain: "GPT-1は12層、GPT-2は48層、GPT-3は96層です。",
      review: "s2",
    },
    {
      q: "ブロックを何層も積むとき、どの層でも同じなのは？",
      choices: ["ブロックの設計（形）", "ブロックの中の数", "層が受け持つ仕事"],
      answer: 0,
      explain: "設計は同じで、中の数は層ごとに別々に学習されます。だから受け持つ仕事が変わります。",
      review: "s3",
    },
    {
      q: "深い層に行くほど、「学校に」のベクトルにはどんなことが起きる？",
      choices: ["情報がだんだん消える", "文全体の意味と次の言葉についての情報が積み重なる", "文字の形の情報だけが残る"],
      answer: 1,
      explain: "層を通るたびに結果が足されて（第56章）、文脈の情報が積み重なります。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第58章 ブロックを積み重ねると",
    att: "アテンション",
    ffn: "フィード\nフォワード",
    layer: "層",
    dots: "⋮",
    same: "同じ形のままつなげる",
    design: "設計は同じ！",
    shape: "形は同じ",
    nums: "数は層ごと別々",
    word: "学校に",
    shallow: "浅い層",
    middle: "中間層",
    deep: "深い層",
    toy: "説明用の例",
    rough: "だいたいこんな傾向です",
    peek: "層ごとに次の言葉をのぞいてみると",
    gan: "行く",
    perLayer: "ブロック1層：約18億個",
    times: "× 96層 = 約1,740億個",
    total: "GPT-3全体 1,750億個",
    almost: "ほぼ全部！",
    thanks: "深く積めるひみつ",
    road: "高速道路（第56章）",
    norm: "正規化（第57章）",
    next: "次の章：エンコーダー vs デコーダー",
    w1: "私は",
    w2: "今日",
    w3: "学校に",
  },
};
