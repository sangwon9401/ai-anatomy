import { ROUND1 } from "../../../data/ch01";
import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Cand = { w: string; p: number; c: Highlighter | null };

// "私は 今日 学校に ___" with ch01's numbers (and ch01's words, so the two chapters always agree);
// ch01's その他 5% is split into 来た 3% and "the other tens of thousands" 2% (illustrative).
// The odd tail = ピザ 1% + the other tens of thousands 2% = 3%.
export const DIST82: Cand[] = [
  ROUND1[0],
  ROUND1[1],
  ROUND1[2],
  ROUND1[3],
  { w: "来た", p: 0.03, c: "orange" },
  ROUND1[4],
  { w: ROUND1[5].w, p: 0.02, c: null },
];
export const TAIL = 0.03;
export const TAIL_RUN = 100; // 1 − 0.97^100 ≈ 0.952

// s6: when the model is sure vs unsure (illustrative)
export const SURE: Cand[] = [
  { w: "9", p: 0.92, c: "yellow" },
  { w: "8", p: 0.04, c: "mint" },
  { w: "11", p: 0.02, c: "sky" },
  { w: "10", p: 0.01, c: "violet" },
  { w: "13", p: 0.01, c: "pink" },
];
export const UNSURE: Cand[] = [
  { w: "りんご", p: 0.24, c: "yellow" },
  { w: "いちご", p: 0.21, c: "mint" },
  { w: "バナナ", p: 0.17, c: "sky" },
  { w: "ぶどう", p: 0.14, c: "violet" },
  { w: "すいか", p: 0.11, c: "orange" },
  { w: "もも", p: 0.09, c: "pink" },
  { w: "いす", p: 0.04, c: null },
];
export const PRESETS82 = [
  { key: "school", name: "私は今日学校に", items: DIST82 },
  { key: "sure", name: "1, 3, 5, 7,", items: SURE },
  { key: "unsure", name: "私の好きな果物は", items: UNSURE },
];

/** How many candidates each rule keeps (lists are sorted from most to least likely). */
export const keepTopK = (items: Cand[], k: number) => Math.min(k, items.length);
export function keepTopP(items: Cand[], p: number) {
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += items[i].p;
    if (acc >= p - 1e-9) return i + 1;
  }
  return items.length;
}
/** Probabilities after cutting to the first n and sharing out again so they add up to 1. */
export function renorm(items: Cand[], n: number) {
  const s = items.slice(0, n).reduce((a, b) => a + b.p, 0);
  return items.map((it, i) => (i < n ? it.p / s : 0));
}

export const PIPE = [
  { a: "スコア", b: "" },
  { a: "÷ 温度", b: "81章" },
  { a: "ソフトマックス", b: "14章" },
  { a: "しっぽを切る", b: "82章" },
  { a: "ルーレット", b: "80章" },
  { a: "次のかけら！", b: "" },
];

export const ch82: ChapterSpec = {
  id: 82,
  part: 9,
  title: "候補をしぼる",
  core: false,
  hook: "ルーレットに「ピザ」のマスがあったら、いつか本当に「ピザ」が選ばれてしまうのでは？",
  steps: [
    { id: "s1", sec: 9.5, narration: "サンプリングには落とし穴があります。候補は何万個もあるので、小さな棒も全部集めると、しっぽがけっこう太くなります。" },
    { id: "s2", sec: 9, narration: "しっぽが3%だけでも、100かけらの答えを書けば、どこかで一度はへんてこな言葉がまじる確率が95%にもなります。" },
    { id: "s3", sec: 9, narration: "だからしっぽを切ります。1つめはTop-k。確率の高い順に、上からk個だけ残します。kが3なら、残るのは3つです。" },
    { id: "s4", sec: 11, narration: "残った85%を配り直して、合計を1にそろえます。行く61.2%、行った24.7%、遅れた14.1%。それからルーレットを回します。" },
    { id: "s5", sec: 9, narration: "2つめはTop-p。上から確率を足していき、p、たとえば90%をこえた瞬間に止めて、残りを切ります。" },
    { id: "s6", sec: 10, narration: "Top-kはいつも3つ残しますが、Top-pはモデルに自信があれば1つ、迷っていれば6つのように、状況に合わせて残します。" },
    { id: "s7", sec: 10.5, narration: "まとめると、スコアを温度で割り、ソフトマックスで確率にし、しっぽを切り、ルーレットを回す。これがかけら1つが選ばれる道です。" },
  ],
  playgroundTitle: "しっぽ切り実験室",
  playgroundIntro: "文を選んで、Top-kやTop-pで候補を切ってみましょう。残った候補でルーレットを回すと、何が選ばれるでしょう？",
  summary: [
    "候補は何万個もあるので、小さなしっぽも集まると、へんてこな言葉が選ばれることがある。",
    "Top-kは上からk個だけ、Top-pは上から足してpをこえるまで残す。",
    "切ったあと、残ったものどうしで配り直して合計を1にし、ルーレットを回す。",
  ],
  unlocks: "Top-k・Top-p",
  unlockLabel: "推論の道具をひとつ手に入れました",
  quiz: [
    {
      q: "Top-kでk = 2にすると？",
      choices: ["確率が2%より大きい候補だけ残す", "ルーレットを2回回して選ぶ", "確率1位と2位だけ残して、ほかは切る"],
      answer: 2,
      explain: "Top-kは確率の高い順に、上からk個だけ残します。",
      review: "s3",
    },
    {
      q: "確率が[60%, 25%, 10%, 5%]の候補にTop-p（p = 80%）を使うと、いくつ残るでしょう？",
      choices: ["1つ", "2つ", "4つ"],
      answer: 1,
      explain: "上から足すと60%、85%。2つめで80%をこえるので、2つ残ります。",
      review: "s5",
    },
    {
      q: "モデルにとても自信があるとき（1位が92%）、Top-p（90%）は候補をいくつ残すでしょう？",
      choices: ["1位の1つだけ", "いつも3つ", "全部の候補"],
      answer: 0,
      explain: "1位だけですでに90%をこえています。Top-pは分布の形に合わせて、残す数が変わります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第82章 候補をしぼる",
    example: "確率は説明用の例",
    tailNote: "その他 = 何万ものかけらの合計",
    tail: "へんてこなしっぽ = 3%",
    long: "100かけらの答えを書くなら",
    avoid: "しっぽを100回続けてよける確率",
    mult: "0.97 × 0.97 × … × 0.97",
    times: "100回",
    approx: "≈ 0.05",
    once: "一度でもしっぽを引く確率 ≈ 95%",
    calc: "* 説明用の計算",
    way1: "方法1",
    way2: "方法2",
    topk: "Top-k",
    k3: "k = 3",
    topkNote: "上からk個だけ！",
    snip: "切る！",
    renorm: "÷0.85 → 合計1",
    topp: "Top-p",
    p90: "p = 90%",
    toppNote: "足して90%をこえるまで",
    sum: "足した値",
    over: "90%超え！",
    toppRenorm: "残った4つで配り直すと 55.3・22.3・12.8・9.6%",
    sureQ: "1, 3, 5, 7, ___",
    unsureQ: "私の好きな果物は ___",
    sure: "自信があるとき",
    unsure: "迷っているとき",
    kLine: "Top-k",
    pLine: "Top-p",
    keepSure: "Top-k 3個・Top-p 1個",
    keepUnsure: "Top-k 3個・Top-p 6個",
    adapt: "Top-pは状況に合わせて増えたり減ったり！",
    pipeTitle: "かけらが1つ選ばれるまで",
    again: "次のかけらをつなげて、また最初から（第2章）",
  },
};
