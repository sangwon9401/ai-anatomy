// ja overlay of src/data/ch37.ts: same toy model and numbers, with the Japanese running sentence 私は 今日 学校に 行く
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Illustrative probabilities (illustrative). Each one is "the chance of this word, given every word before it". */
export const CHAIN: { w: string; p: number; c: Highlighter }[] = [
  { w: "私は", p: 0.2, c: "mint" },
  { w: "今日", p: 0.25, c: "sky" },
  { w: "学校に", p: 0.1, c: "violet" },
  { w: "行く", p: 0.52, c: "yellow" },
];
/** the same prefix ending in ピザ instead (1%, as in ch01) */
export const PIZZA = { w: "ピザ", p: 0.01, c: "pink" as Highlighter };

export const NOVEL = ["私は今日、雨にぬれながら学校へ走った", "うちのクラスの猫が給食を食べる"];

/** Format a probability as a percent with two significant digits, without scientific notation. */
export function fmtPct(p: number) {
  const v = p * 100;
  if (v >= 10) return `${Math.round(v)}%`;
  const decimals = Math.min(20, Math.max(0, 1 - Math.floor(Math.log10(v))));
  let s = v.toFixed(decimals);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return `${s}%`;
}

// --- the playground's toy language model (illustrative) ---
// Five words; the chance of the next word depends on the whole prefix, like a real language model.
export const LM_WORDS = ["私は", "今日", "学校に", "行く", "ピザ"] as const;
export const LM_COLORS: Record<string, Highlighter> = { 私は: "mint", 今日: "sky", 学校に: "violet", 行く: "yellow", ピザ: "pink" };

function rule(prefix: string[], w: string): number {
  const k = prefix.length;
  const has = (x: string) => prefix.includes(x);
  const last = prefix[k - 1];
  const key = prefix.join(" ");
  if (has("ピザ")) return 0.01; // the sentence is already strange
  if (w === "ピザ") return k === 0 ? 0.01 : has("行く") ? 0.002 : last === "学校に" ? 0.01 : 0.005;
  if (has("行く")) return w === "私は" || w === "今日" ? 0.01 : 0.002; // the sentence already ended
  const table: Record<string, Record<string, number>> = {
    私は: { "": 0.2, 今日: 0.2, 学校に: 0.1, "今日 学校に": 0.04, "学校に 今日": 0.05 },
    今日: { "": 0.15, 私は: 0.25, 学校に: 0.08, "私は 学校に": 0.03, "学校に 私は": 0.05 },
    学校に: { "": 0.03, 私は: 0.08, 今日: 0.06, "私は 今日": 0.1, "今日 私は": 0.1 },
  };
  if (w === "行く") {
    if (has("学校に")) {
      if (last === "学校に") return k === 3 ? 0.52 : k === 2 ? (prefix[0] === "私は" ? 0.3 : 0.2) : 0.15;
      return k === 3 ? (last === "今日" ? 0.45 : 0.4) : 0.25;
    }
    return ({ "": 0.005, 私は: 0.02, 今日: 0.005, "私は 今日": 0.02, "今日 私は": 0.02 } as Record<string, number>)[key];
  }
  return table[w][key];
}

/** Candidates for the next word after `prefix` (words are used once each); `rest` = every other word in the language. */
export function nextProbs(prefix: string[]) {
  const options = LM_WORDS.filter((w) => !prefix.includes(w)).map((w) => ({ w, p: rule(prefix, w) }));
  const rest = 1 - options.reduce((a, o) => a + o.p, 0);
  return { options, rest };
}

export function sentenceProb(words: string[]) {
  let p = 1;
  const factors: number[] = [];
  words.forEach((w, i) => {
    const f = nextProbs(words.slice(0, i)).options.find((o) => o.w === w)!.p;
    factors.push(f);
    p *= f;
  });
  return { p, factors };
}

export const ch37: ChapterSpec = {
  id: 37,
  part: 4,
  title: "言語モデル = 文の確率",
  core: false,
  hook: "AIは、ある文が「自然だ」ということを、どうやって知るのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "2つの文を見てみましょう。「私は 今日 学校に 行く」と「私は 今日 学校に ピザ」。どちらが自然でしょう？" },
    { id: "s2", sec: 9, narration: "言語モデルは、文ごとに「どれくらい出てきそうか」を確率でつける機械です。ChatGPTも言語モデルです。" },
    { id: "s3", sec: 10, narration: "でも、文を丸ごと数えるのは大変です。はじめて見る文が多すぎるからです。そこで1語ずつに分けます。" },
    { id: "s4", sec: 10, narration: "最初の語が「私は」である確率、そのあとに「今日」が来る確率…。前の語を見て、次の語の確率を1つずつ求めます。" },
    { id: "s5", sec: 9, narration: "この確率を順番にかけると、文の確率になります。20% × 25% × 10% × 52% = 0.26%。" },
    { id: "s6", sec: 10, narration: "「ピザ」の文は最後だけ1%なので0.005%。前は同じなのに、最後の1語のせいで52倍もちがいます。" },
    { id: "s7", sec: 10, narration: "だから、次の語をうまく当てるモデルは、文の確率もうまくつけられます。第1章の「次の言葉当て」がまさにこれです。" },
    { id: "s8", sec: 9, narration: "では、この確率はどこから求めるのでしょう？ いちばん簡単なのは数えること。第38章で実際に数えてみます。" },
  ],
  playgroundTitle: "文の確率計算機",
  playgroundIntro: "語を1つずつえらんで、4語の文を作ってみましょう。えらぶたびに、その語の確率がかけられます。確率がいちばん高い文はどれでしょう？",
  summary: [
    "言語モデル：文がどれくらい出てきそうかを確率でつける機械。",
    "文の確率 ＝ 前の語を見て求めた、次の語の確率を順番にかけたもの。",
    "次の語をうまく当てるモデル ＝ 文の確率をうまくつけるモデル(第1章)。",
  ],
  unlocks: "言語モデル",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "文の確率はどうやって求めるでしょう？",
      choices: ["語ごとの確率を全部足す", "次の語の確率を順番にかける", "語の数で割る"],
      answer: 1,
      explain: "最初の語の確率 × その次の語の確率 × … と、順番にかけます。",
      review: "s5",
    },
    {
      q: "前の3語は同じで、最後の語の確率だけが52%と1%でちがうとき、2つの文の確率は何倍ちがうでしょう？",
      choices: ["52倍", "51倍", "2倍"],
      answer: 0,
      explain: "同じ前半は両方に同じだけかけられるので、最後の確率の比 52 ÷ 1 = 52倍だけが残ります。",
      review: "s6",
    },
    {
      q: "文の最後に語をもう1つつけると、その文の確率はふつうどうなるでしょう？",
      choices: ["大きくなる", "いつも1になる", "小さくなる"],
      answer: 2,
      explain: "確率は1より小さいので、1つかけるたびに小さくなります。だから長い文の確率はとても小さいのです。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第37章 言語モデル = 文の確率",
    which: "どちらが自然？",
    lm: "言語モデル",
    lmEn: "Language Model",
    inSent: "文",
    outProb: "確率",
    high: "高い",
    low: "低い",
    chatgpt: "ChatGPTも言語モデル！",
    whole: "文を丸ごと数えると？",
    novel: "はじめて見る文",
    tooMany: "はじめて見る文は限りなくある",
    split: "1語ずつに分ける！",
    demo: "* 説明用の例",
    first: "最初の語が「私は」",
    look: "前の語を見て",
    times: "×",
    vs: "vs",
    eq: "=",
    smaller: "かけるほど小さく",
    same: "前半は同じ",
    was: "「行く」のとき",
    now: "「ピザ」のとき",
    ratio: "倍の差！",
    rule: "次の語をうまく当てる = 文の確率をうまくつける",
    prefix: "私は 今日 学校に",
    ch01: "第1章のゲーム",
    gaws: "行った",
    late: "遅れた",
    mult: "この確率をかけると文の確率！",
    where: "この確率はどこから？",
    count: "実際に数えてみよう！",
    next: "第38章：直前の数語だけを見る",
  },
};
