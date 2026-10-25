import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

export const SENT = ["私は", "今日", "学校に", "行く"];

/** The words a model may look at when guessing SENT[target]. */
export function visible(mode: "bert" | "gpt", target: number) {
  return SENT.map((_, i) => i).filter((i) => (mode === "bert" ? i !== target : i < target));
}

/** A sentence about a (mode, target) pair for the playground. */
export function explain(mode: "bert" | "gpt", target: number) {
  const seen = visible(mode, target).map((i) => `「${SENT[i]}」`);
  if (mode === "bert" && target === 2) return "前の「私は 今日」も、後ろの「行く」も全部見えます。「行く」の前だから「ピザを」は変ですね。両側が見えると空欄が楽になります。";
  if (mode === "gpt" && target === 2) return "「私は 今日」までしか見えません。「学校に」「家に」「ピザを」…どれもありそうなので、確率で選びます（第1章）。";
  if (mode === "gpt" && target === 3) return "「私は 今日 学校に」を見て次の言葉を当てます。ずっと見てきたあの問題です。行く 52%！";
  if (mode === "gpt" && target === 0) return "先頭の単語には、前に見る単語がありません。だからGPTにとって最初の単語がいちばん当てにくいのです。";
  if (mode === "bert") return `隠された単語以外は全部見えます：${seen.join("")}。`;
  return `前の${seen.join("")}だけを見て当てます。後ろの単語は目かくしで隠れています（第51章）。`;
}

export const ch59: ChapterSpec = {
  id: 59,
  part: 6,
  title: "エンコーダー vs デコーダー",
  core: false,
  hook: "ChatGPTの「GPT」とGoogleの「BERT」。どちらもトランスフォーマーなのに、何がちがうのでしょう？",
  steps: [
    { id: "s1", sec: 10.5, narration: "2017年に生まれたトランスフォーマーは翻訳機でした。原文を読むエンコーダーと、訳文を書くデコーダーでできていました（第44章）。" },
    { id: "s2", sec: 10, narration: "2018年には、片方だけを取り出したモデルが登場します。エンコーダーだけを積んだBERTと、デコーダーだけを積んだGPTです。" },
    { id: "s3", sec: 9, narration: "BERTは文全体を両側から見ます。途中の単語を隠して、前後の単語から空欄を当てる練習をします。" },
    { id: "s4", sec: 9, narration: "GPTは前の単語だけを見ます。第51章の目かくしで未来を隠したまま、次の単語を当てる練習をします。" },
    { id: "s5", sec: 9, narration: "アテンションの表で見ると、BERTは全部のマスが開いていて、GPTは対角線とその下の三角形だけが開いています。" },
    { id: "s6", sec: 8.5, narration: "だからBERTは文を理解する仕事に、GPTは文章を一語ずつ書き続ける仕事に強いのです。" },
    { id: "s7", sec: 10.5, narration: "ChatGPTは、デコーダーブロックだけを積んだGPTです。第54章から組み立ててきたブロックが、まさにこのデコーダーブロックです。" },
  ],
  playgroundTitle: "空欄 vs 次の言葉",
  playgroundIntro: "BERTかGPTを選んで、当てたい単語を押してみましょう。その単語を当てるときに見える単語が変わります。",
  summary: [
    "もとのトランスフォーマー（2017）は、エンコーダー + デコーダーでできた翻訳機だった。",
    "BERT = エンコーダーだけを積む：両側を見て空欄を当てる。文の理解に強い。",
    "GPT = デコーダーだけを積む：前だけを見て（目かくし）次の単語を当てる。文章を書き続けるのに強い。ChatGPTもこちら。",
  ],
  unlocks: "デコーダーブロック",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "BERTが練習する問題は？",
      choices: ["隠された空欄を前後の単語から当てる", "次の単語を当てる", "文を翻訳する"],
      answer: 0,
      explain: "BERTは文の途中を隠して、両側の単語を見ながら空欄を当てます。次の単語当てはGPTの練習です。",
      review: "s3",
    },
    {
      q: "GPTのアテンションの表で開いているマスは？",
      choices: ["全部のマス", "対角線とその下の三角形", "対角線より上の三角形"],
      answer: 1,
      explain: "各単語は自分と前の単語しか見られません。未来のマスは目かくしで隠します（第51章）。",
      review: "s5",
    },
    {
      q: "文章を一語ずつ書き続ける仕事に向いているのは？",
      choices: ["BERT（エンコーダー）", "どちらも同じ", "GPT（デコーダー）"],
      answer: 2,
      explain: "GPTは前の単語だけを見て次の単語を当てるように学ぶので、1つずつ書き続けるのにぴったりです（第2章）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第59章 エンコーダー vs デコーダー",
    y2017: "2017年のトランスフォーマー = 翻訳機",
    src: "I go to school today",
    dst: "私は 今日 学校に 行く",
    enc: "エンコーダー",
    dec: "デコーダー",
    encDo: "原文を読む側",
    decDo: "訳文を書く側",
    x6: "6層",
    bert: "BERT",
    gpt: "GPT",
    bertBy: "2018、Google",
    gptBy: "2018、OpenAI",
    encOnly: "エンコーダーだけを積む",
    decOnly: "デコーダーだけを積む",
    blank: "?",
    both: "両側が見える",
    front: "前だけが見える",
    fill: "空欄を当てる",
    next: "次の言葉を当てる",
    mask: "目かくし（第51章）",
    future: "未来",
    rows: "横の行：見る側の単語",
    cols: "縦の列：見える単語",
    understand: "文の理解",
    understandEx: "検索、文の分類",
    write: "続きを書く",
    writeEx: "会話、作文",
    decoderBlock: "GPTのブロック = デコーダーブロック",
    chatgpt: "ChatGPTもこのブロック！",
    masked: "目かくし付き（51章）",
    w1: "私は",
    w2: "今日",
    w3: "学校に",
    w4: "行く",
  },
};
