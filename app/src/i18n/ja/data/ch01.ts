import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Candidate = { w: string; p: number; c: Highlighter | null };

// Illustrative probabilities (labelled as such in the scene), not measured from a real model.
export const ROUND1: Candidate[] = [
  { w: "行く", p: 0.52, c: "yellow" },
  { w: "行った", p: 0.21, c: "mint" },
  { w: "遅れた", p: 0.12, c: "sky" },
  { w: "着いた", p: 0.09, c: "violet" },
  { w: "ピザ", p: 0.01, c: "pink" },
  { w: "その他", p: 0.05, c: null },
];

export const ROUND2: Candidate[] = [
  { w: "。", p: 0.58, c: "yellow" },
  { w: "から", p: 0.14, c: "mint" },
  { w: "、", p: 0.11, c: "sky" },
  { w: "！", p: 0.07, c: "violet" },
  { w: "その他", p: 0.1, c: null },
];

export const EXAMPLES = [
  { q: "日本の首都は", a: "東京", tag: "知識" },
  { q: "1, 3, 5, 7,", a: "9", tag: "規則" },
  { q: "雨が降ったので傘を", a: "さした", tag: "常識" },
];

export type GameRound = { sentence: string; options: { w: string; p: number }[] };

export const GAME_ROUNDS: GameRound[] = [
  {
    sentence: "日本の首都は",
    options: [
      { w: "大阪", p: 0.02 },
      { w: "東京", p: 0.92 },
      { w: "どこ", p: 0.03 },
      { w: "京都", p: 0.02 },
    ],
  },
  {
    sentence: "1, 3, 5, 7,",
    options: [
      { w: "8", p: 0.04 },
      { w: "9", p: 0.88 },
      { w: "10", p: 0.02 },
      { w: "11", p: 0.03 },
    ],
  },
  {
    sentence: "雨が降ったので傘を",
    options: [
      { w: "食べた", p: 0.001 },
      { w: "買った", p: 0.07 },
      { w: "さした", p: 0.71 },
      { w: "持った", p: 0.18 },
    ],
  },
];

export const ch01: ChapterSpec = {
  id: 1,
  part: 0,
  title: "次の言葉当てゲーム",
  core: true,
  hook: "ChatGPTは、質問を聞いて答え全体を一度に思いついているのでしょうか？",
  steps: [
    { id: "s1", sec: 6, narration: "文がひとつあります。「私は今日学校に」の次には、どんな言葉が来るでしょう？" },
    { id: "s2", sec: 8, narration: "候補はたくさんあります。行く、行った、遅れた…変ですが「ピザ」が来ることもありえます。" },
    { id: "s3", sec: 8, narration: "ChatGPTは、候補ごとに次に来る可能性を数字で計算します。これが確率です。" },
    { id: "s4", sec: 7, narration: "いちばんありそうな「行く」を選んで、空欄につなげます。" },
    { id: "s5", sec: 9, narration: "そしてまた最初から！長くなった文を見て、また次の言葉を予測します。今度は「。」が選ばれましたね。" },
    { id: "s6", sec: 8, narration: "ChatGPTがしているのはこれだけです。次の言葉をとてもうまく当てて、それをくり返すこと。" },
    { id: "s7", sec: 9, narration: "でも次の言葉をうまく当てるには、知識も規則も常識も必要です。その力がどこから来るのかが、これからの話です。" },
  ],
  playgroundTitle: "当ててみよう！次の言葉ゲーム",
  playgroundIntro: "空欄に入る言葉を選んでみましょう。選ぶと、モデルが計算した確率とくらべられます。",
  summary: [
    "ChatGPTは次に来る言葉の確率を計算する。",
    "いちばんありそうな言葉を選んでつなげ、また予測する。",
    "このくり返しだけで長い答えができあがる。",
  ],
  unlocks: "生成ループ",
  quiz: [
    {
      q: "ChatGPTが文章を作るとき、くり返していることは？",
      choices: ["文全体を一度に思いつく", "次に来る言葉の確率を計算して1つ選ぶ", "インターネットで似た文章を探してコピーする"],
      answer: 1,
      explain: "一度にひとかけらずつ、確率を計算して選んでいます。",
      review: "s3",
    },
    {
      q: "選ばれた言葉は、そのあとどうなりますか？",
      choices: ["捨てられる", "文の後ろにつながり、次の予測の入力になる", "別にためておき、最後にまとめて表示する"],
      answer: 1,
      explain: "つなげて、また予測します。このくり返しで長い文章ができます。",
      review: "s5",
    },
    {
      q: "「1, 3, 5, 7, ___」をうまく当てるには、何が必要でしょう？",
      choices: ["数字の間の規則に気づく力", "いちばん長い数字を選ぶくせ", "正解が書かれた表"],
      answer: 0,
      explain: "次の言葉をうまく当てるには、規則も知識も常識も必要です。だから予測の練習をするだけで賢くなるのです。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第1章 次の言葉当てゲーム",
    example: "確率は説明用の例",
    loop: "つなげて再予測",
    stmtTop: "ChatGPTがしていること",
    stmtMain: "次の言葉当て",
    stmtLoop: "× ずっとくり返す",
    stmtNote: "本当にこれだけ",
    token: "* 正確には「トークン」単位で予測します（第29章）",
    words: "私は 今日 学校に 行く",
  },
};
