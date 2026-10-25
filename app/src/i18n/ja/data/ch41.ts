// ja overlay of src/data/ch41.ts: same toy RNN/LSTM, Japanese sentence (11 words, as in Korean)
import { DECAY, EMPTY, GIST, WORD_VEC, rnnRun, type Note } from "../../../data/ch40";
import type { ChapterSpec } from "../../../data/types";

export const LONG = ["昨日", "私は", "弟と", "朝", "早く", "バスで", "雨の", "中", "坂を", "上り", "学校に"];
export const LONG_NOTES = rnnRun(LONG);

/** toy LSTM (illustrative): important slots go into a 保管箱 (cell) that is not squashed again each step, so they fade much more slowly. */
export const LSTM_KEEP = 0.95;
export function lstmRun(words: string[], keep = LSTM_KEEP) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) {
    const x = WORD_VEC[w] ?? [0, 0, 0];
    const h = n.h.map((v, i) => Math.max(-1, Math.min(1, keep * v + Math.tanh(x[i])))) as [number, number, number];
    const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
    notes.push((n = { h, gist }));
  }
  return notes;
}
export const LONG_LSTM = lstmRun(LONG);

/** backprop's blame signal shrinking by the same factor at every step back (ch23) */
export const BACK = Array.from({ length: LONG.length }, (_, k) => DECAY ** k);

/** words handed to GPUs in s6 */
export const GPU_WORDS = LONG.slice(0, 6);

/** playground: words placed between 昨日 and 学校に (repeats when longer) */
export const FILLERS = ["私は", "弟と", "朝", "早く", "バスで", "雨の", "中", "坂を", "上り", "ゆっくり", "歩いて", "橋を", "わたって"];
export const sentenceWith = (middle: number) => ["昨日", ...Array.from({ length: middle }, (_, i) => FILLERS[i % FILLERS.length]), "学校に"];

export const ch41: ChapterSpec = {
  id: 41,
  part: 4,
  title: "RNNの限界",
  core: true,
  hook: "メモのリレーがそんなにいいなら、なぜChatGPTはRNNを使わないのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "今度は長い文です。「昨日 私は 弟と … 学校に」の次は「行った」のはずです。最初の「昨日」があるからです。" },
    { id: "s2", sec: 9, narration: "メモを1マスずつ渡すたびに、「昨日」は少しずつうすくなります。11マスを過ぎると、字がほとんど見えません。" },
    { id: "s3", sec: 10, narration: "だから最後のメモだけを見たRNNは「行く」をえらびます。遠くはなれた語どうしの関係、長期依存を見落としたのです。" },
    { id: "s4", sec: 10, narration: "学習のときも問題です。まちがいの責任(第23章)を逆向きに伝えるときもマスごとに小さくなり、10マス前ではたった0.11倍です。" },
    { id: "s5", sec: 11, narration: "1997年のLSTMは、メモに保管箱と門をつけて、大事な内容がうすれにくいように守りました。それでも、とても長い文ではやがてうすれます。" },
    { id: "s6", sec: 11, narration: "2つめの問題は順番待ちです。2番のマスは、1番のマスのメモが来るまで始められません。ほかのGPUは順番を待って遊んでいます。" },
    { id: "s7", sec: 10, narration: "GPUは、たくさんの計算を同時にするのが得意です(第68章)。なのに語が1,000個なら、1,000回を順番にしなければなりません。" },
    { id: "s8", sec: 11, narration: "まとめると、RNNはメモがうすれ、順番待ちをします。トランスフォーマーが両方を解決します(Part 5)。その前に第42章で翻訳機を見ましょう。" },
  ],
  playgroundTitle: "記憶力実験室",
  playgroundIntro: "「昨日」と「学校に」の間に語をどんどん入れてみましょう。RNNのメモに「昨日」がどれだけ残るか、LSTMに切りかえるとどうなるか、くらべてみましょう。",
  summary: [
    "限界①：メモがマスごとにうすれ、遠くはなれた語の関係(長期依存)を見落とす。",
    "1997年のLSTMは保管箱と門で長く覚えたが、とても長い文ではやがてうすれる。",
    "限界②：前のマスが終わらないと次のマスを計算できず、GPUが順番待ちをする。",
  ],
  unlocks: "長期依存",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "長い文の最後で、RNNが最初の「昨日」を忘れてしまう理由は？",
      choices: ["メモを渡すたびに、古い内容が少しずつうすれるから", "「昨日」という語を知らないから", "文が短いから"],
      answer: 0,
      explain: "マスごとに古いメモに1より小さい数をかけて書き写すので、遠くへ行くほどぼやけます。",
      review: "s2",
    },
    {
      q: "1997年に出たLSTMのアイデアは？",
      choices: ["語を逆から読む", "メモに保管箱と門をつけて、大事な内容を長く守る", "メモをまったく使わない"],
      answer: 1,
      explain: "何を守り何を消すかを決める門(ゲート)があるので、大事な内容がうすれにくくなります。",
      review: "s5",
    },
    {
      q: "RNNを学習させるとき、GPUが遊んでしまう理由は？",
      choices: ["GPUが日本語を知らないから", "語が少なすぎるから", "前のマスのメモが来ないと、次のマスを計算できないから"],
      answer: 2,
      explain: "マスは順番にしか計算できないので、同時に計算するというGPUの得意技を生かせません。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第41章 RNNの限界",
    far: "11マスもはなれている",
    survive: "メモの「昨日」は最後まで残る？",
    answer: "正解は「行った」(昨日だから)",
    strength: "メモの中の「昨日」のこさ",
    faded: "11マスでほぼ消える",
    wrong: "昨日なのに「行く」？！",
    longdep: "長期依存 (long-term dependency)",
    longdepD: "遠くはなれた語どうしの関係",
    blame: "責任の信号 (第23章 誤差逆伝播法)",
    back: "← 逆向きに伝える",
    barely: "前のほうまで責任がほとんど届かない",
    lstm: "1997 LSTM",
    lstmD: "保管箱 + 門(ゲート)",
    rnnBars: "RNN",
    lstmBars: "LSTM",
    still: "それでも、とても長いとうすれる",
    queue: "順番待ちするGPU",
    working: "計算中",
    waiting: "待っている",
    zzz: "zzz",
    done: "終わり",
    wait: "前のマスが終わらないと次のマスが始まらない",
    gpu: "GPU",
    special: "GPUの得意技 ＝ 同時に計算すること (第68章)",
    seq: "RNN：順番に",
    par: "同時にするなら",
    time: "時間",
    thousand: "語が1,000個 ＝ 1,000回を順番に",
    sumTitle: "RNNの2つの限界",
    sum1: "① メモがうすれる",
    sum1d: "長期依存を見落とす",
    sum2: "② 順番待ちをする",
    sum2d: "GPUを同時に使えない",
    fix: "トランスフォーマーが両方を解決 (Part 5)",
    next: "その前に、第42章：翻訳機のしくみ",
    toy: "* 説明用のおもちゃのモデル",
  },
};
