// ja overlay of src/data/ch43.ts: Japanese source sentences, same scores
import { softmax } from "../../../data/ch14";
import { percents } from "../../../data/ch45";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A translation with illustrative relevance scores (illustrative): scores[t][s] = how relevant source word s is while writing target word t. */
export type Pair = { label: string; src: string[]; tgt: string[]; scores: number[][] };

export const PAIRS: Pair[] = [
  {
    label: "私は 今日 学校に 行く",
    src: ["私は", "今日", "学校に", "行く"],
    tgt: ["I", "go", "to", "school", "today"],
    scores: [
      [3.0, 0.2, 0.1, 0.4],
      [0.3, 0.2, 0.8, 3.0],
      [0.1, 0.3, 2.6, 1.0],
      [0.1, 0.1, 3.2, 0.5],
      [0.2, 3.1, 0.3, 0.4],
    ],
  },
  {
    label: "私は 昨日 友だちに 会った",
    src: ["私は", "昨日", "友だちに", "会った"],
    tgt: ["I", "met", "my", "friend", "yesterday"],
    scores: [
      [3.0, 0.2, 0.2, 0.5],
      [0.4, 0.3, 0.9, 3.0],
      [2.0, 0.1, 2.2, 0.3],
      [0.2, 0.1, 3.2, 0.6],
      [0.2, 3.2, 0.2, 0.5],
    ],
  },
  {
    label: "猫が 魚を 食べる",
    src: ["猫が", "魚を", "食べる"],
    tgt: ["The", "cat", "eats", "fish"],
    scores: [
      [2.4, 0.6, 0.3],
      [3.2, 0.2, 0.3],
      [0.3, 0.9, 3.0],
      [0.2, 3.1, 0.6],
    ],
  },
];

/** attention weights for every target word (softmax of its scores, ch14) and whole-percent labels that add up to 100 */
export function weightsOf(pair: Pair) {
  return pair.scores.map((row) => {
    const w = softmax(row).p;
    return { w, pct: percents(w) };
  });
}

export const MAIN = PAIRS[0];
export const MAIN_W = weightsOf(MAIN);
export const SRC_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

/** the Part 4 recap cards */
export const RECAP: { ch: string; t: string; year?: string }[] = [
  { ch: "37", t: "言語モデル = 文の確率" },
  { ch: "38", t: "n-gram：直前の数語だけを数える" },
  { ch: "39", t: "ニューラル言語モデル", year: "2003" },
  { ch: "40", t: "RNN：メモのリレー" },
  { ch: "41", t: "RNNの限界 → LSTM", year: "1997" },
  { ch: "42", t: "seq2seq翻訳機：メモ1枚の限界", year: "2014" },
  { ch: "43", t: "アテンション：必要な所を見直す", year: "2014" },
];

export const ch43: ChapterSpec = {
  id: 43,
  part: 4,
  title: "アテンションの誕生",
  core: true,
  hook: "翻訳しながらもとの文をもう一度見られたら、AIの翻訳はどれだけよくなるでしょう？",
  steps: [
    { id: "s1", sec: 11, narration: "第42章のボトルネックを解くため、2014年、バダナウ(Bahdanau)の研究チームは考え方を変えました。最後のメモだけでなく、全部のメモを残そう！" },
    { id: "s2", sec: 10, narration: "デコーダーが「I」を書くとき、残しておいたメモを見わたして、いま必要な所にスポットライトを当てます。「私は」が84%です。" },
    { id: "s3", sec: 10, narration: "次の「go」を書くときは、スポットライトがいちばん最後の「行く」へ飛びます。2つの言語の語順がちがっても問題ありません。" },
    { id: "s4", sec: 10, narration: "「to」と「school」は「学校に」を、「today」は「今日」を照らします。書く語ごとに、見る場所がちがいます。" },
    { id: "s5", sec: 10, narration: "照らす割合は、関連度のスコアをソフトマックス(第14章)で変えて決めます。その割合でメモをまぜて、デコーダーに渡します。" },
    { id: "s6", sec: 10, narration: "どこを見たかを表にかくと、ななめにずれた線が見えます。語のペアを見つけて合わせるので、アラインメント(alignment)と呼びます。" },
    { id: "s7", sec: 10, narration: "Part 4をまとめましょう。数える(n-gram)、ニューラルネットと語のベクトル、メモのリレー(RNN)、そしてアテンションまで来ました。" },
    { id: "s8", sec: 11, narration: "そして2017年、こんな問いが出ます。メモのリレーはやめて、アテンションだけで作ったらどうだろう？ Part 5で会いましょう。" },
  ],
  playgroundTitle: "自分でスポットライト",
  playgroundIntro: "デコーダーが英語の語を1つずつ書きます。その語を書くとき、どの日本語の語を照らせばいいか押してみましょう。モデルのスポットライトとくらべます。",
  summary: [
    "アテンション(2014)：デコーダーが語を書くたびに、もとの文の全部のメモをもう一度見る。",
    "関連度のスコア → ソフトマックス → 割合。その割合でメモをまぜて書く。",
    "語順のちがう言語も、長い文もOK。2017年には、アテンションだけで(Part 5)！",
  ],
  unlocks: "2014 アテンション",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "アテンションが第42章のボトルネックを解いた方法は？",
      choices: ["メモをもっと大きくした", "デコーダーが語を書くたびに、もとの文の全部のメモをもう一度見る", "文を短く切った"],
      answer: 1,
      explain: "最後のメモ1枚に全部入れずに、マスごとに書いたメモを残しておき、必要なときにもう一度見ます。",
      review: "s2",
    },
    {
      q: "「I go to school today」で「go」を書くとき、スポットライトがいちばん明るく照らす日本語の語は？",
      choices: ["私は", "今日", "行く"],
      answer: 2,
      explain: "「go」の意味は、文のいちばん最後の「行く」にあります。語順がちがっても飛んで照らします。",
      review: "s3",
    },
    {
      q: "スポットライトの割合(どこをどれだけ見るか)は、どうやって決めるでしょう？",
      choices: ["関連度のスコアをソフトマックスで変えて", "語の順番どおりに同じだけ分けて", "でたらめに"],
      answer: 0,
      explain: "第14章のソフトマックスそのものです。だから割合を全部足すと100%になります。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第43章 アテンションの誕生",
    year: "2014",
    who: "バダナウ・チョ・ベンジオ",
    cho: "ベンジオは第39章の人！",
    keep: "メモを全部残そう！",
    attention: "attention ＝ 注意を向ける",
    note: "メモ",
    dec: "デコーダーが書いている",
    jump: "最後へ飛ぶ！",
    differ: "書く語ごとに見る場所がちがう",
    score: "関連度のスコア",
    softmax: "ソフトマックス (第14章)",
    mix: "割合どおりにまぜたメモ",
    mixNote: "まぜることには第45章でまた出会う",
    align: "アラインメント (alignment)",
    zigzag: "語順がずれていてもペアを見つける",
    recap: "Part 4で集めた歴史カード",
    y2017: "2017",
    question: "メモのリレーはやめて、アテンションだけで？",
    aiayn: "Attention Is All You Need",
    part5: "Part 5・第44章で会いましょう",
    demo: "* 説明用の例",
  },
};
