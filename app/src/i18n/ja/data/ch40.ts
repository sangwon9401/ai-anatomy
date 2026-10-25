// ja overlay of src/data/ch40.ts: same toy RNN and numbers. Japanese 行く already covers the future, so the
// future verb is 行く予定 ("planning to go"), where Korean has 갈 거야.
import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a toy RNN (illustrative toy model), shared with ch41–42 ---
// The note (hidden state) has three slots. Each word writes into a slot; the old note is copied a little fainter.
// new note = squash(0.8 × old note + word), squash = tanh (keeps every number between −1 and 1).
export const SLOTS = ["いつ", "だれ", "どこ"] as const;
export const DECAY = 0.8;
export const WORD_VEC: Record<string, [number, number, number]> = {
  昨日: [-2, 0, 0],
  明日: [2, 0, 0],
  私は: [0, 2, 0],
  友だちと: [0, 1, 0],
  弟と: [0, 1, 0],
  学校に: [0, 0, 2],
};
/** what each word writes on the note, in words */
export const GIST: Record<string, string> = { 昨日: "昨日", 明日: "明日", 私は: "私", 友だちと: "友だち", 弟と: "弟", 学校に: "学校" };
export type Note = { h: [number, number, number]; gist: [string, string, string] };
export const EMPTY: Note = { h: [0, 0, 0], gist: ["", "", ""] };

/** One relay step of the toy RNN. `keep` is how much of the old note survives (0.8 here; ch41's LSTM mode keeps more). */
export function rnnStep(n: Note, w: string, keep = DECAY): Note {
  const x = WORD_VEC[w] ?? [0, 0, 0];
  const h = n.h.map((v, i) => Math.tanh(keep * v + x[i])) as [number, number, number];
  const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
  return { h, gist };
}

export function rnnRun(words: string[], keep = DECAY) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) notes.push((n = rnnStep(n, w, keep)));
  return notes;
}

export const VERBS: { w: string; c: Highlighter }[] = [
  { w: "行った", c: "mint" },
  { w: "行く", c: "yellow" },
  { w: "行く予定", c: "sky" },
];
/** next-word probabilities from the last note: past ↔ future is read from the いつ slot */
export function predictVerb(h: readonly number[]) {
  const s = [-4 * h[0], 1, 4 * h[0]];
  const ex = s.map(Math.exp);
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

export const RELAY = ["昨日", "私は", "学校に"];
export const RELAY_B = ["明日", "私は", "学校に"];
export const LENGTHS = [
  ["私は", "学校に", "行く"],
  ["昨日", "私は", "友だちと", "学校に"],
  ["昨日", "私は", "弟と", "バスに", "乗って", "学校に"],
];

export const ch40: ChapterSpec = {
  id: 40,
  part: 4,
  title: "RNN：メモのリレー",
  core: false,
  hook: "文の長さはばらばらなのに、AIは前の内容をどうやって覚えながら読むのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "第39章のネットは、前の3語しか見ませんでした。文の長さはばらばらなのに。そこで生まれた考え：1語ずつ読みながら、メモに書いて渡そう！" },
    { id: "s2", sec: 10, narration: "マスごとに語が1つずつあります。各マスは前のマスからメモを受け取り、いまの語を見て書き直して、次のマスに渡します。" },
    { id: "s3", sec: 11, narration: "「昨日」は「いつ」の欄に、「私は」は「だれ」の欄に、「学校に」は「どこ」の欄に書きます。前の内容は少しうすく書き写します。" },
    { id: "s4", sec: 10, narration: "書き直すルールは、どのマスも同じです。古いメモに0.8をかけていまの語を足し、−1と1の間におしこみます。" },
    { id: "s5", sec: 11, narration: "最後のメモだけを見て、次の語を当てます。メモに「昨日」が残っているので「行った」が70%。このメモを隠れ状態と呼びます。" },
    { id: "s6", sec: 10, narration: "最初の語だけを「明日」に変えると、今度は「行く予定」が70%。最初の語がメモに乗って、最後まで伝わったのです。" },
    { id: "s7", sec: 11, narration: "広げるとリレー、たたむと同じ機械がぐるぐる回る輪です。だから名前は再帰型ニューラルネット、RNN。文が長くても大丈夫です。" },
  ],
  playgroundTitle: "メモのリレーを回そう",
  playgroundIntro: "語を1つずつ入れて、文を作ってみましょう。語が入るたびにメモの3つの欄が書き直され、最後のメモで次の語を当てます。",
  summary: [
    "RNN：1語ずつ読みながらメモ(隠れ状態)を書き直して、次のマスに渡す。",
    "どのマスも同じルール(同じ重み)を使う。だから文の長さがちがっても大丈夫。",
    "最後のメモで次の語を当てる。最初の語もメモに乗って最後まで伝わる。",
  ],
  unlocks: "RNNの隠れ状態",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "RNNで「メモ」と呼んだものの本当の名前は？",
      choices: ["損失", "隠れ状態", "トークン"],
      answer: 1,
      explain: "それまでに読んだ内容をまとめた数のベクトルです。外からは見えないので、隠れ(hidden)状態といいます。",
      review: "s5",
    },
    {
      q: "RNNのマスがメモを書き直すルールは？",
      choices: ["どのマスも同じルールを使う", "マスごとにルールがちがう", "最後のマスにだけルールがある"],
      answer: 0,
      explain: "同じ機械(同じ重み)を、語ごとにくり返し使います。だから文の長さに関係なく使えます。",
      review: "s4",
    },
    {
      q: "「昨日 私は 学校に」の次に、RNNが「行った」をえらべる理由は？",
      choices: ["最後の語「学校に」に過去の意味があるから", "でたらめにえらんだから", "最初の「昨日」のあとがメモに残って、最後まで伝わったから"],
      answer: 2,
      explain: "「昨日」を読んだときに書いた内容が、少しずつうすくなりながらも、最後のメモまで残っています。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第40章 RNN：メモのリレー",
    window: "前の3語の窓",
    fixed: "窓の大きさは固定、文の長さはばらばら",
    idea: "1語ずつメモを渡そう！",
    cell: "RNNマス",
    empty: "白紙のメモから",
    same: "どのマスも同じルール",
    rule: "新しいメモ = おしこみ( 0.8 × 古いメモ + いまの語 )",
    squash: "おしこみ = −1と1の間に",
    example: "いつの欄：",
    toy: "* 説明用のおもちゃのモデル: 本物は0.8でなく、学習した重み行列(第11章)",
    lastNote: "最後のメモ → 次の語",
    hidden: "メモ ＝ 隠れ状態 (hidden state)",
    carried: "最初の語が最後まで伝わった",
    unrolled: "広げるとリレー",
    folded: "たたむと輪",
    rnn: "再帰型ニューラルネット (RNN)",
    rnnEn: "Recurrent Neural Network",
    anyLen: "文がどんなに長くてもOK",
    next: "第41章：RNNの限界",
    note: "メモ",
    dot: "·",
  },
};
