// ja overlay of src/data/ch42.ts: Japanese source sentences (the `ko` fields hold Japanese), same word counts and numbers
import { DECAY } from "../../../data/ch40";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** the running example and its translation; EN_FROM = which Japanese word each English word comes from */
export const KO = ["私は", "今日", "学校に", "行く"];
export const EN = ["I", "go", "to", "school", "today"];
export const EN_FROM = [0, 3, 2, 2, 1];
export const KO_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

// --- toy bottleneck (illustrative toy model) ---
// Every phrase leaves a trace on the one summary note; the trace fades ×0.8 for each source word read after it (ch41).
// Traces weaker than KEEP_MIN are lost, and the decoder cannot write them.
export type Phrase = { ko: string; en: string; enPos: number; fixed?: boolean };
export const PHRASES: Phrase[] = [
  { ko: "昨日", en: "yesterday", enPos: 6 },
  { ko: "私は", en: "I", enPos: 0 },
  { ko: "友だちと いっしょに", en: "with my friend", enPos: 3 },
  { ko: "図書館で", en: "at the library", enPos: 4 },
  { ko: "数学の 宿題を", en: "math homework", enPos: 2 },
  { ko: "した", en: "did", enPos: 1, fixed: true },
];
export const KEEP_MIN = 0.3;
export const NOTE_SLOTS = 4;

const wordCount = (p: Phrase) => p.ko.split(" ").length;

/** strength of each chosen phrase's trace on the final note, and the decoder's output with lost phrases as "???" */
export function squeeze(on: boolean[], attention = false) {
  const chosen = PHRASES.map((p, i) => ({ p, i })).filter(({ i }) => on[i]);
  const words = chosen.reduce((a, { p }) => a + wordCount(p), 0);
  let after = words;
  const traces = chosen.map(({ p, i }) => {
    after -= wordCount(p);
    const s = DECAY ** after;
    return { i, p, s, kept: attention || s >= KEEP_MIN };
  });
  const out = [...traces].sort((a, b) => a.p.enPos - b.p.enPos).map((t) => (t.kept ? t.p.en : "???"));
  return { words, traces, out, lost: traces.filter((t) => !t.kept).map((t) => t.p.ko) };
}
export const ALL_ON = PHRASES.map(() => true);
export const FULL = squeeze(ALL_ON);
export const CORRECT = [...PHRASES].sort((a, b) => a.enPos - b.enPos).map((p) => p.en);

export const ch42: ChapterSpec = {
  id: 42,
  part: 4,
  title: "翻訳機のしくみ",
  core: false,
  hook: "語順も長さもちがう2つの言語を、AIはどうやって翻訳するのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "「私は 今日 学校に 行く」は英語で「I go to school today」。語順も語の数もちがうので、1語ずつ置きかえることはできません。" },
    { id: "s2", sec: 11, narration: "2014年、サツケバー(Sutskever)の研究チームはRNNを2つつなげました。読むエンコーダーと書くデコーダー、これをseq2seqといいます。" },
    { id: "s3", sec: 9, narration: "エンコーダーは日本語を1語ずつ読みながら、メモを書き直します。最後のメモに、文全体の意味が入ります。" },
    { id: "s4", sec: 10, narration: "デコーダーはそのメモを受け取って、英語を1語ずつ書きます。書いた語はまた入力に入ります。第2章の自己回帰と同じです。" },
    { id: "s5", sec: 11, narration: "でも、メモの大きさは決まっています。4語でも40語でも、文全体を同じ大きさのメモ1枚に、ぎゅっとおしこまなければなりません。" },
    { id: "s6", sec: 10, narration: "これがボトルネックです。びんのせまい首を、すべての意味が通らなければなりません。だから文が長いほど翻訳が悪くなりました。" },
    { id: "s7", sec: 9, narration: "デコーダーが語を書くたびに、もとの文をもう一度見られたらどうでしょう？ そのアイデアが第43章のアテンションです。" },
  ],
  playgroundTitle: "ぎゅっとおしこむ",
  playgroundIntro: "文に入れる部分をえらんでみましょう。文が長くなるほど、1枚だけの要約メモで前のほうのあとがうすれて、翻訳からぬけ落ちます。",
  summary: [
    "seq2seq(2014)：エンコーダーのRNNが読み、デコーダーのRNNが1語ずつ書く。",
    "エンコーダーは文全体を、決まった大きさのメモ(ベクトル)1枚に入れて渡す。",
    "ボトルネック：文が長いほどメモ1枚に入りきらず、翻訳が悪くなる。",
  ],
  unlocks: "2014 seq2seq",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "seq2seqの翻訳機で、エンコーダーとデコーダーがすることは？",
      choices: ["エンコーダーはもとの文を読んでメモに入れ、デコーダーはそのメモで訳文を書く", "どちらももとの文を読むだけ", "エンコーダーが訳文を書き、デコーダーがチェックする"],
      answer: 0,
      explain: "読む側(エンコーダー)と書く側(デコーダー)、2つのRNNをつなげたしくみです。",
      review: "s2",
    },
    {
      q: "デコーダーが英語を書くやり方は？",
      choices: ["すべての語を一度に書く", "1語ずつ書き、書いた語をまた入力に入れる", "日本語の語順どおりに1つずつ置きかえる"],
      answer: 1,
      explain: "第2章で見た自己回帰と同じです。〈おわり〉が出るまで1語ずつ書きます。",
      review: "s4",
    },
    {
      q: "seq2seqの「ボトルネック」とは？",
      choices: ["単語の辞書が小さすぎること", "デコーダーが遅すぎること", "文全体を、大きさの決まったメモ1枚におしこまなければならないこと"],
      answer: 2,
      explain: "長くても短くてもメモ1枚でしか渡せないので、長い文ほど意味がぬけ落ちます。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第42章 翻訳機のしくみ",
    diff: "語順も、語の数もちがう",
    noOneByOne: "1語ずつ置きかえてはだめ",
    year: "2014 · サツケバー(Sutskever)の研究チーム",
    s2s: "seq2seq",
    s2sD: "sequence to sequence：語の列 → 語の列",
    enc: "エンコーダー",
    encD: "読む側のRNN",
    dec: "デコーダー",
    decD: "書く側のRNN",
    summary: "要約メモ",
    start: "〈はじめ〉",
    end: "〈おわり〉",
    whole: "文全体の意味",
    auto: "書いた語がまた入力へ (第2章)",
    fixed: "メモの大きさはいつも同じ",
    slots: "数が4欄",
    both: "短い文も長い文も、同じ数4欄",
    correct: "正解：",
    real: "* 本物は数が数百〜数千個だが、大きさが決まっているのは同じ",
    squeeze: "ぎゅっ！",
    bottleneck: "ボトルネック",
    longer: "長いほど悪くなる",
    longKo: "昨日 私は 友だちと いっしょに 図書館で 数学の 宿題を した",
    demo: "* 説明用のおもちゃのモデル",
    lostLabel: "ぬけた意味",
    ask: "書くたびにもとの文をもう一度見られたら？",
    next: "第43章：アテンションの誕生",
  },
};
