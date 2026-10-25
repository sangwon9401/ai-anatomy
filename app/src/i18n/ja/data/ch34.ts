// ja overlay of src/data/ch34.ts: same coordinates, Japanese words (フランス and パリ moved 0.9 left together so the
// longer katakana label fits; every analogy still lands on its target). The capitals map starts from Japan
// (東京 − 日本 + 韓国 ≈ ソウル), so 日本/東京/韓国/ソウル sit where the Korean map had 한국/서울/일본/도쿄.
import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];
export type WordMap = { key: string; name: string; c: Highlighter; words: { w: string; v: P2 }[]; presets: [string, string, string][] };

// illustrative 2-D word maps (설명용 예시). Every preset analogy lands nearest its target — checked with a script.
export const MAPS: WordMap[] = [
  {
    key: "people",
    name: "人",
    c: "yellow",
    words: [
      { w: "男", v: [2, 2] },
      { w: "女", v: [2, 5] },
      { w: "王", v: [7, 2.5] },
      { w: "女王", v: [7.2, 5.3] },
      { w: "少年", v: [0.8, 1.2] },
      { w: "少女", v: [0.9, 4.3] },
      { w: "王子", v: [5.4, 1.6] },
      { w: "王女", v: [5.6, 4.7] },
      { w: "父", v: [3.5, 2.8] },
      { w: "母", v: [3.6, 5.9] },
    ],
    presets: [
      ["王", "男", "女"],
      ["王子", "少年", "少女"],
      ["父", "男", "女"],
    ],
  },
  {
    key: "capital",
    name: "国と首都",
    c: "sky",
    words: [
      { w: "日本", v: [1.5, 6] },
      { w: "東京", v: [2.1, 2.6] },
      { w: "韓国", v: [4.2, 6.4] },
      { w: "ソウル", v: [4.9, 3.1] },
      { w: "フランス", v: [6.3, 6.1] },
      { w: "パリ", v: [6.8, 2.6] },
    ],
    presets: [
      ["東京", "日本", "韓国"],
      ["パリ", "フランス", "日本"],
      ["ソウル", "韓国", "フランス"],
    ],
  },
  {
    key: "tense",
    name: "いまと過去",
    c: "mint",
    words: [
      { w: "行く", v: [1.4, 6] },
      { w: "行った", v: [2.2, 2.7] },
      { w: "食べる", v: [4.4, 6.5] },
      { w: "食べた", v: [5.1, 3.1] },
      { w: "見る", v: [7.3, 5.9] },
      { w: "見た", v: [8.1, 2.4] },
    ],
    presets: [
      ["行った", "行く", "食べる"],
      ["見た", "見る", "行く"],
      ["食べた", "食べる", "見る"],
    ],
  },
];

export const vecOf = (m: WordMap, w: string) => m.words.find((x) => x.w === w)!.v;
/** a − b + c, and the nearest word that is not one of the inputs (as Word2Vec demos do) */
export function analogy(m: WordMap, a: string, b: string, c: string) {
  const [va, vb, vc] = [vecOf(m, a), vecOf(m, b), vecOf(m, c)];
  const r: P2 = [va[0] - vb[0] + vc[0], va[1] - vb[1] + vc[1]];
  const ranked = m.words
    .filter((x) => x.w !== a && x.w !== b && x.w !== c)
    .map((x) => ({ w: x.w, d: Math.hypot(x.v[0] - r[0], x.v[1] - r[1]) }))
    .sort((p, q) => p.d - q.d);
  return { r, best: ranked[0] };
}

// s1–s2: guess a word from its neighbours
export const CONTEXT = ["カフェで", "温かい", "〇〇を", "飲んだ。"];
export const CANDIDATES = [
  { w: "コーヒー", fits: true },
  { w: "緑茶", fits: true },
  { w: "ココア", fits: true },
  { w: "自転車", fits: false },
];
// s3: a sliding window over a sentence (Word2Vec practice)
export const WINDOW = ["毎朝", "温かい", "コーヒーを", "1杯", "飲む"];
// s4: before/after training on a small map
export const DRINKS: { w: string; from: P2; to: P2; c: Highlighter }[] = [
  { w: "コーヒー", from: [6.8, 5.6], to: [2.3, 5.2], c: "orange" },
  { w: "緑茶", from: [1.6, 1.8], to: [3.1, 5.9], c: "orange" },
  { w: "ココア", from: [4.6, 3.4], to: [2.2, 6.4], c: "orange" },
  { w: "自転車", from: [3.0, 6.2], to: [7.0, 1.8], c: "sky" },
  { w: "バス", from: [7.6, 2.4], to: [7.8, 2.8], c: "sky" },
];

export const ch34: ChapterSpec = {
  id: 34,
  part: 3,
  title: "まわりの単語が意味を教えてくれる",
  core: false,
  hook: "だれも意味を教えていないのに、AIは「コーヒー」と「緑茶」が似ていると、どうしてわかるのでしょう？",
  steps: [
    { id: "s1", sec: 8.5, narration: "「カフェで温かい〇〇を飲んだ。」空欄には何が入るでしょう？ はじめて見る文でも、まわりの単語を見れば見当がつきますね。" },
    { id: "s2", sec: 8.5, narration: "コーヒー、緑茶、ココアのように、同じ場所に来る単語は意味も似ています。意味はまわりの単語が教えてくれる。これを分布仮説といいます。" },
    { id: "s3", sec: 9, narration: "2013年に出たWord2Vecは、この考えを学習に変えました。1つの単語を見て、まわりの単語を当てる練習を、ものすごくたくさんさせます。" },
    { id: "s4", sec: 7.5, narration: "練習を終えると、まわりが似ている単語どうしのベクトルが近くなります。だれも意味を教えていないのに、です。" },
    { id: "s5", sec: 8, narration: "おどろくことに、向きにも意味が入ります。男から女へ向かう矢印と、王から女王へ向かう矢印が、ほぼ同じなのです。" },
    { id: "s6", sec: 9, narration: "だから王 − 男 + 女を計算すると、女王のすぐそばに着きます。(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)。", tts: "だから王ひく男たす女を計算すると、女王のすぐそばに着きます。7、2.5ひく2、2たす2、5は、7、5.5。" },
    { id: "s7", sec: 8.5, narration: "東京 − 日本 + 韓国 ≈ ソウルにもなります。本物のWord2Vecは数百次元で、いつもこうぴったりとはいきません。この地図は説明用の例です。", tts: "東京ひく日本たす韓国は、ソウルにもなります。本物のWord2Vecは数百次元で、いつもこうぴったりとはいきません。この地図は説明用の例です。" },
    { id: "s8", sec: 7.5, narration: "単語の意味は、まわりの単語が教えてくれる。GPTの埋め込みも、次のかけらを当てながら同じように意味を学びます。" },
  ],
  playgroundTitle: "単語の計算機",
  playgroundIntro: "A − B + Cをえらんでみましょう。矢印をたどって着いた場所から、いちばん近い単語が答えです。ぴったり合う計算を探しましょう。",
  summary: [
    "分布仮説：同じ場所(まわりの単語)に来る単語は、意味も似ている。",
    "Word2Vec(2013)：まわりの単語を当てる練習で、単語のベクトルを作る。",
    "向きにも意味が入る：王 − 男 + 女 ≈ 女王。",
  ],
  unlocks: "分布仮説",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "「単語の意味はまわりの単語が教えてくれる」という考えを何というでしょう？",
      choices: ["確率分布", "ワンホット表現", "分布仮説"],
      answer: 2,
      explain: "同じ場所に来る単語どうしは意味が似ている、という考えです。Word2Vecがこれを学習に変えました。",
      review: "s2",
    },
    {
      q: "Word2Vecは、どんな練習で単語のベクトルを作るでしょう？",
      choices: ["辞書の意味を覚える", "1つの単語を見て、まわりの単語を当てる", "単語を五十音順に並べる"],
      answer: 1,
      explain: "まわりの単語を当てているうちに、まわりが似た単語どうしのベクトルが近くなります。",
      review: "s3",
    },
    {
      q: "この章の地図で、王(7, 2.5) − 男(2, 2) + 女(2, 5)は？",
      choices: ["(11, 9.5) → 何もない", "(3, 0.5) → 少年の近く", "(7, 5.5) → 女王の近く"],
      answer: 2,
      explain: "横は7 − 2 + 2 = 7、縦は2.5 − 2 + 5 = 5.5。女王(7.2, 5.3)のすぐそばです。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第34章 まわりの単語が意味を教えてくれる",
    guess: "空欄に何が入る？",
    hint: "まわりの単語がヒント！",
    fits: "どれも合う",
    nofit: "合わない",
    hypo: "意味はまわりの単語が教えてくれる",
    hypoName: "分布仮説",
    w2v: "Word2Vec (2013)",
    practice: "まん中の単語で、まわりの単語を当てる",
    guessIt: "当てて！",
    millions: "ものすごくたくさんの文でくり返す",
    before: "練習前",
    after: "練習後：まわりが似ていれば近くに",
    noOne: "意味はだれも教えていない",
    dir: "向きにも意味がある",
    same: "同じ矢印！",
    calc: "王 − 男 + 女",
    calcNum: "(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)",
    land: "≈ 女王",
    capital: "東京 − 日本 + 韓国 ≈ ソウル",
    real: "本物は数百次元で、ずれることも",
    example: "説明用の例",
    sum: "意味＝まわりの単語",
    gpt: "GPTの埋め込みも同じように学ぶ",
    minus: "− 男",
    minusKor: "日本 → 韓国",
    ok: "○",
    no: "✕",
    plus: "+ 女",
  },
};
