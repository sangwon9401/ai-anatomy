import type { ChapterSpec, Highlighter } from "../../../data/types";

// ja overlay of src/data/ch53.ts: the GPT-2 maps are real data on English sentences (part5-gpt2.ts, unchanged);
// only the explanations are Japanese.
/** the four real GPT-2 heads this chapter visits (layer and head numbered from 0, like code: L4H11) */
export const GPT2_HEADS: { key: string; layer: number; head: number; name: string; c: Highlighter; desc: string }[] = [
  { key: "prev", layer: 4, head: 11, name: "すぐ前の語", c: "sky", desc: "どんな文でも、すぐ前の語だけをほぼ100%見ます。" },
  { key: "first", layer: 7, head: 2, name: "最初の語", c: "violet", desc: "ほとんどすべての語が、最初の語を見ます。なぜそうなるのかは、まだ研究中です。" },
  { key: "copy", layer: 5, head: 1, name: "まねっこ", c: "mint", desc: "同じことばがまた出てくると、1回目にそのあとに来た語を見ます。くり返しの文でよくわかります。" },
  { key: "subj", layer: 4, head: 3, name: "主語さがし？", c: "orange", desc: "動詞や「it」「she」が、前に出てきた主人公を見ているように見えます。解釈には注意！" },
];

/** Part 5 in chips, for the recap */
export const PART5_TOOLS = ["アテンションだけで十分 (44)", "見つめ合う (45)", "Q・K・V (46)", "Q・Kスコア (47)", "÷ √d + ソフトマックス (48)", "Vをまぜる (49)", "行列で一度に (50)", "因果マスク (51)", "マルチヘッド (52)", "アテンションの地図 (53)"];

export const ch53: ChapterSpec = {
  id: 53,
  part: 5,
  title: "本物のGPTの頭の中をのぞく",
  core: false,
  hook: "本物のGPTのヘッドは、本当に何かを「見つめて」いるのでしょうか？",
  steps: [
    { id: "s1", sec: 9, narration: "いよいよ本物のGPTを開けてみましょう。GPT-2のいちばん小さいモデルです。層が12、層ごとにヘッドが12、全部で144個です。" },
    { id: "s2", sec: 9, narration: "英語の文を1つ入れて、1つのヘッドが見つめる割合を地図にかきます。行は見つめる語、列は見つめられる語です。" },
    { id: "s3", sec: 8, narration: "4層の11番ヘッドです。どの語も、すぐ前の語だけをほぼ100%見ています。だから対角線のすぐ下のマスだけがこいのです。" },
    { id: "s4", sec: 10, narration: "7層の2番ヘッドでは、ほとんどの語が最初の語「The」を見ます。この文では、144個のヘッドのうち98個が、半分以上最初の語を見ていました。" },
    { id: "s5", sec: 9, narration: "同じ文を2回入れました。5層の1番ヘッドで、2回目の「my」は、1回目の「my」のあとに来た「dog」を51%見ます。" },
    { id: "s6", sec: 9, narration: "4層の3番ヘッドでは、「it」が「cat」を84%見つめます。第45章のように、指しているものを探しているように見えます。" },
    { id: "s7", sec: 9, narration: "Part 5で、アテンションを完全に分解しました。Q・Kスコア、√dとソフトマックス、Vをまぜる、行列の計算、目かくし、たくさんのヘッドまで。" },
    { id: "s8", sec: 9, narration: "これで設計図のアテンション部品がすることを、全部知りました。Part 6では部品を積み上げて、トランスフォーマーブロックを組み立てます(第54章)。" },
  ],
  playgroundTitle: "アテンションの地図探検",
  playgroundIntro: "本物のGPT-2で前もって計算しておいたアテンションの地図です。文とヘッドを変えて、語を押して、その語がだれを見ているか確かめましょう。",
  summary: [
    "本物のGPT-2(いちばん小さいモデル)：12層 × ヘッド12個 ＝ ヘッド144個。",
    "すぐ前の語だけを見るヘッド、最初の語に集まるヘッド、前の流れをまねするヘッドが、実際にある。",
    "Part 5 完成：スコア(Q・K) → ÷ √d → ソフトマックス → Vをまぜる。目かくしをして、たくさんのヘッドで計算する。",
  ],
  unlocks: "アテンションの地図を読む",
  unlockLabel: "アテンションの秘密をひとつ解きました",
  quiz: [
    {
      q: "4層の11番ヘッドの地図で、こいマスはどこにありましたか？",
      choices: ["対角線のすぐ下 (すぐ前の語)", "いちばん左の列 (最初の語)", "まんべんなく広がっている"],
      answer: 0,
      explain: "どの語もすぐ前の語だけを見るので、対角線のすぐ下のマスだけがこくなります。",
      review: "s3",
    },
    {
      q: "GPT-2のいちばん小さいモデルには、ヘッドが全部でいくつあるでしょう？",
      choices: ["12個", "96個", "144個"],
      answer: 2,
      explain: "層が12、層ごとにヘッドが12なので、12 × 12 = 144個です。(96個はGPT-3の1つの層にあるヘッドの数です。)",
      review: "s1",
    },
    {
      q: "アテンションの地図で、対角線より上がいつも空いている理由は？",
      choices: ["因果マスクで未来をかくしているから", "その語が大事ではないから", "計算が終わっていないから"],
      answer: 0,
      explain: "GPTは前の語しか見られません(第51章)。だから地図はいつも三角形です。",
      review: "s2",
    },
  ],
  labels: {
    tag: "第53章 本物のGPTの頭の中をのぞく",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "↙",
    model: "GPT-2 (最小モデル)",
    layers: "層が12",
    perLayer: "層ごとにヘッド12個",
    total: "12 × 12 = ヘッド144個",
    layer: "層",
    headN: "番ヘッド",
    rows: "見つめる語 ↓",
    cols: "見つめられる語 →",
    tri: "三角形 ＝ 因果マスク (第51章)",
    dark: "こいほどたくさん見ている",
    prevT: "すぐ前の語だけを見るヘッド",
    firstT: "最初の語に集まるヘッド",
    first98: "この文では、144個中98個のヘッドが半分以上最初の語を見る",
    why: "なぜ？ 研究中",
    copyT: "前の流れをまねするヘッド",
    copyNote: "2回目の「my」→ 1回目の「my」の次の「dog」",
    subjT: "「it」が「cat」を見るヘッド",
    careful: "そう見えるだけ、解釈には注意！",
    callback: "第45章の見つめ合い！",
    src: "本物の値・0層から",
    recap: "Part 5 アテンション完全攻略！",
    blueprint: "GPTの設計図",
    understood: "第45〜53章で完全攻略",
    next: "次：第54章から組み立て開始！",
  },
};
