import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Part = {
  key: string;
  name: string;
  does: string;
  where: string;
  color: Highlighter;
  /** filled once the student has finished chapters 1–4 */
  filled?: boolean;
};

// The GPT blueprint, top to bottom. The two block parts repeat N times (GPT-3: 96 layers).
export const PIPELINE: Part[] = [
  { key: "tok", name: "トークナイザー", does: "文章をかけら（トークン）に切る", where: "29章", color: "sky" },
  { key: "emb", name: "埋め込み", does: "かけらを意味のこもった数字に変える", where: "33章", color: "sky" },
  { key: "pos", name: "位置情報", does: "何番目のかけらかを教える", where: "36章", color: "sky" },
  { key: "att", name: "アテンション", does: "かけら同士が見合って意味を混ぜる", where: "45章", color: "yellow" },
  { key: "ffn", name: "フィードフォワード", does: "それぞれのかけらに「考え」を足す", where: "55章", color: "yellow" },
  { key: "out", name: "出力 + ソフトマックス", does: "次のかけらの確率を出す", where: "60・14章", color: "mint" },
  { key: "loop", name: "選んでつなげる", does: "1つ選んで文章の最後につなげ、くり返す", where: "1・2章", color: "mint", filled: true },
];

export const TRAINING = [
  { name: "学習データ", does: "インターネットの膨大な文章", where: "4章・63章", filled: true },
  { name: "事前学習", does: "次のかけら当ての練習、まちがえた分だけ数字を直す", where: "Part 2・7" },
  { name: "会話の練習", does: "お手本の答えのまね + 人のほめ言葉", where: "73章・76章" },
];

export const ch05: ChapterSpec = {
  id: 5,
  part: 0,
  title: "これから組み立てる設計図",
  core: true,
  hook: "ChatGPTという機械を開けると、中には何が入っているのでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "ここまでをまとめると、ChatGPTは次のかけらを当てる機械です。では、その機械を開けてみましょう。" },
    { id: "s2", sec: 10, narration: "入り口には、文章をかけらに切るトークナイザー、かけらを数字に変える埋め込み、何番目かを教える位置情報があります。" },
    { id: "s3", sec: 9, narration: "まん中はトランスフォーマーブロック。かけら同士が見合うアテンションと、考えを足すフィードフォワードが1セットで、何十層も積まれています。" },
    { id: "s4", sec: 8, narration: "最後にソフトマックスで次のかけらの確率を出し、1つ選んでつなげます。そしてまたいちばん上へ。" },
    { id: "s5", sec: 9, narration: "でも部品の中の数字は、最初はめちゃくちゃです。膨大な文章で次のかけら当てを練習して数字を直します。これが事前学習です。" },
    { id: "s6", sec: 8, narration: "最後に、お手本の答えと人のほめ言葉で会話のしかたを学びます。そうしてChatGPTになります。" },
    { id: "s7", sec: 9, narration: "これからこの設計図の空欄を、Partごとに埋めていきます。いま埋まっているのは「選んでつなげる」と学習データ。出発しましょう！" },
  ],
  playgroundTitle: "設計図を組み立てよう",
  playgroundIntro: "文章が機械を通る順番に部品を押してみましょう。最初の部品は、文章をかけらに切る部品です。",
  summary: [
    "トークナイザー → 埋め込み + 位置 → [アテンション + フィードフォワード] × 何十層 → ソフトマックス → 選んでつなげる。",
    "最初はめちゃくちゃな数字を、事前学習で直す。",
    "お手本の答えと人の評価で会話を学べば、ChatGPTになる。",
  ],
  unlocks: "GPTの設計図",
  unlockLabel: "設計図を手に入れました",
  quiz: [
    {
      q: "文章をかけらに分ける部品は？",
      choices: ["埋め込み", "トークナイザー", "ソフトマックス"],
      answer: 1,
      explain: "トークナイザーが文章をトークンに切り、埋め込みがそのトークンを数字に変えます。",
      review: "s2",
    },
    {
      q: "トランスフォーマーブロック1セットに入っている2つは？",
      choices: ["アテンションとフィードフォワード", "トークナイザーと埋め込み", "ソフトマックスと選ぶこと"],
      answer: 0,
      explain: "アテンション + フィードフォワードで1層。この層を何十回も積み重ねます。",
      review: "s3",
    },
    {
      q: "事前学習でモデルが練習することは？",
      choices: ["次のかけら当て", "人の顔の見分け", "文法ルールの暗記"],
      answer: 0,
      explain: "膨大な文章で次のかけら当てを練習しながら、数字を直していきます。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第5章 これから組み立てる設計図",
    input: "私は 今日 学校に",
    output: "行く",
    gpt: "GPT",
    chatgpt: "ChatGPT",
    block: "トランスフォーマーブロック",
    layers: "× 何十層（GPT-3は96層）",
    again: "もう一度上へ",
    pretrain: "事前学習",
    chat: "会話の練習",
    mess: "最初は数字がめちゃくちゃ",
    numbers: "1,750億個の数字を少しずつ直す",
    filled: "済み",
    empty: "空欄",
    go: "出発！",
    web: "インターネットの膨大な文章",
    practice: "次のかけら当ての練習",
    fix: "まちがえた分だけ数字を直す",
    sft: "お手本の答えをまねる",
    rlhf: "人のほめ言葉",
    ch73: "第73章",
    ch76: "第76章",
    data: "学習データ",
    blockLayers: "×何十層",
    gpt3: "GPT-3は96層",
  },
};
