import type { ChapterSpec } from "../../../data/types";

// What the base model writes after the question in the scene (illustrative, labelled so).
export const CONTINUE = ["韓国の首都はどこですか？", "中国の首都はどこですか？", "フランスの首都はどこですか？"];
export const READ = ["ニュース", "ウィキの記事", "小説", "問題集", "掲示板の投稿", "料理の本"];
export const QLIKE = ["問題集", "アンケート", "質問集", "クイズ大会の台本"];

/** Playground: the same question wrapped in different document starts. All continuations and chances are illustrative. */
export type Frame = { key: string; name: string; before: string; after: string };
export const FRAMES: Frame[] = [
  { key: "plain", name: "質問だけぽつんと", before: "", after: "" },
  { key: "exam", name: "テストの第1問", before: "【確認問題】\n1. ", after: "" },
  { key: "qa", name: "質問：… 答え：", before: "質問：", after: "\n答え：" },
  { key: "script", name: "生徒と先生の台本", before: "生徒：", after: "\n先生：" },
];

export type Probe = {
  q: string;
  /** continuation per frame key, and the chance that the very next piece starts an answer */
  out: Record<string, { text: string; answer: number; isAnswer: boolean }>;
};

export const PROBES: Probe[] = [
  {
    q: "日本の首都はどこですか？",
    out: {
      plain: { text: "\n韓国の首都はどこですか？\n中国の首都はどこですか？", answer: 0.08, isAnswer: false },
      exam: { text: "\n2. 韓国の首都はどこですか？\n3. 日本でいちばん長い川の名前を書きなさい。", answer: 0.03, isAnswer: false },
      qa: { text: "東京です。", answer: 0.81, isAnswer: true },
      script: { text: "いい質問だね。東京だよ。", answer: 0.74, isAnswer: true },
    },
  },
  {
    q: "水は何度で沸とうしますか？",
    out: {
      plain: { text: "\n氷は何度でとけますか？\n水は何度でこおりますか？", answer: 0.1, isAnswer: false },
      exam: { text: "\n2. 氷がとける温度は何度ですか？\n3. 水が沸とうするときに出る泡の正体は？", answer: 0.04, isAnswer: false },
      qa: { text: "ふつうは100度で沸とうします。", answer: 0.78, isAnswer: true },
      script: { text: "高い山の上でなければ、100度で沸とうするよ。", answer: 0.7, isAnswer: true },
    },
  },
];

export const ch72: ChapterSpec = {
  id: 72,
  part: 8,
  title: "賢いけれど言うことを聞かないモデル",
  core: true,
  hook: "インターネットの文章をものすごい量読んだモデルに質問したら、すぐに答えてくれるでしょうか？",
  steps: [
    { id: "s1", sec: 9, narration: "Part 7で、ネットの文章で次のかけら当てを勉強し終えたモデルがいます。これをベースモデル（base model）といいます。" },
    { id: "s2", sec: 8, narration: "このモデルに聞いてみましょう。「日本の首都はどこですか？」 もちろん東京と答えますよね？" },
    { id: "s3", sec: 8, narration: "ところが答えるかわりに、質問を書き続けます。韓国の首都は？ 中国の首都は？ まるでテストの問題リストです。" },
    { id: "s4", sec: 8, narration: "モデルには、この文が問題集の1行めに見えたのです。ネットには、質問のあとにまた質問が続く文章がとても多いからです。" },
    { id: "s5", sec: 8, narration: "ベースモデルが学んだのは、それらしく続きを書くことだけです（第2章）。質問に答えろと教わったことはありません。" },
    { id: "s6", sec: 8, narration: "そこで工夫しました。「質問：… 答え：」の形で文章を始めると、次のかけらに答えが来る確率がぐんと上がります。" },
    { id: "s7", sec: 9, narration: "でも毎回工夫するわけにはいきません。賢いけれど言うことを聞かないこのモデルを、素直にするのがPart 8のお話です。" },
  ],
  playgroundTitle: "文章の書き出しを変えよう",
  playgroundIntro: "同じ質問を、いろいろな形の文章で始めてみましょう。ベースモデルがどう続きを書くかを見せます。答えが出てくる書き出しを2つ見つけましょう。",
  summary: [
    "ベースモデルは、ネットの文章で次のかけら当てだけを学んだモデル。",
    "質問をあたえると、答えるかわりに問題集のように質問を書き続けることもある。",
    "文章の形を変えれば答えを引き出せるが、根本的な解決は別に教えること。",
  ],
  unlocks: "ベースモデル",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "ベースモデルに「日本の首都はどこですか？」とだけ書くと、なぜ質問が続くことがある？",
      choices: ["モデルが東京を知らないから", "ネットには質問のあとにまた質問が来る文章が多いから", "モデルがわざといたずらをするから"],
      answer: 1,
      explain: "ベースモデルは文章をそれらしく続けるだけです。問題集のような文章では、質問のあとに質問が来ますね。",
      review: "s4",
    },
    {
      q: "ベースモデルが事前学習で実際に練習したことは？",
      choices: ["質問にやさしく答えること", "人にほめられること", "文章の次のかけらを当てること"],
      answer: 2,
      explain: "次のかけら当てだけを練習しました（第2章、Part 7）。答え方はまだ教わっていません。",
      review: "s5",
    },
    {
      q: "ベースモデルから答えを引き出すには、文章をどう始めるとよい？",
      choices: ["「質問：… 答え：」の形で書き、答えの場所を空けておく", "質問を3回くり返す", "質問の最後に「？」をたくさんつける"],
      answer: 0,
      explain: "答えの場所が空いている文章なら、その次のかけらとして答えが来るのがいちばんそれらしくなります。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第72章 賢いけれど言うことを聞かないモデル",
    model: "ベースモデル",
    modelEn: "base model",
    studied: "かけら当ての勉強、完了！",
    gpt3Read: "GPT-3は約3,000億トークンを読んで勉強しました",
    question: "日本の首都はどこですか？",
    expect: "東京です。",
    expectNote: "こう答えるよね？",
    dots: "…",
    huh: "答えずに質問！",
    example: "説明用の例",
    examTitle: "【社会】首都の確認問題",
    n1: "1.",
    n2: "2.",
    n3: "3.",
    n4: "4.",
    looks: "問題集に見えた！",
    mine: "私の質問",
    qlike: "質問のあとに質問が来る文章",
    learned: "ベースモデルが学んだこと",
    learnedWhat: "それらしく続きを書く",
    wanted: "私たちがほしかったこと",
    wantedWhat: "質問に答える",
    neq: "≠",
    ch2: "続きを書くだけ（第2章）",
    qaQ: "質問：",
    qaA: "答え：",
    qaFill: "東京です。",
    chanceTitle: "次のかけらに答えが来る確率",
    plainRow: "質問だけぽつんと",
    qaRow: "「質問：… 答え：」の形",
    p1: "8%",
    p2: "81%",
    trick: "文章の形で答えに導く",
    smart: "賢さ",
    listens: "素直さ",
    yes: "○",
    no: "×",
    chatgpt: "ChatGPT",
    sft: "お手本の答えをまねる（第73章）",
    rlhf: "人のほめ言葉で磨く（第76章）",
    todo: "Part 8ですること",
  },
};
