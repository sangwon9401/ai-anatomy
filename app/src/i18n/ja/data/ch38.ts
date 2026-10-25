import type { ChapterSpec } from "../../../data/types";

/** ja: a small original corpus written for this chapter (same story as the Korean one). Words are split on spaces
 * at 文節 boundaries, the way the course spaces 私は 今日 学校に 行く. Counts recomputed with a script. */
export const CORPUS = [
  "私は 今日 学校に 行く",
  "私は 昨日 学校に 遅れた",
  "私は 朝 学校に 行く",
  "弟は 今日 学校に 行く",
  "友だちは 今日 塾に 行く",
  "友だちは 昨日 塾に 遅れた",
  "猫は 今日 ソファで 寝る",
  "猫は 昨日 ソファで 寝た",
  "猫は 魚を おいしく 食べた",
  "猫は 家で 昼寝を した",
  "私は 昼に 給食を おいしく 食べた",
  "友だちは 給食を はやく 食べた",
  "弟は 給食を こっそり 残した",
  "先生は 朝 教室で 本を 読んだ",
  "先生は 今日 宿題を 出した",
  "私は 家で 宿題を した",
  "私は 図書館で 本を 読んだ",
  "友だちは 運動場で サッカーを した",
  "私は 昨日 運動場で サッカーを した",
  "弟は 家で 昼寝を した",
  "友だちは 図書館で 宿題を した",
  "先生は 教室で 歌を 歌った",
  "私は 今日 早く 寝る",
  "弟は 朝 おそく 起きた",
];

export const START = "〈はじめ〉";
export const END = "〈おわり〉";

export const TOKENS = CORPUS.map((s) => [START, ...s.split(" "), END]);

/** How many times the word sequence `seq` appears in the corpus (sentence edges count as tokens). */
export function countSeq(seq: string[]) {
  let n = 0;
  for (const t of TOKENS)
    for (let i = 0; i + seq.length <= t.length; i++) if (seq.every((w, k) => t[i + k] === w)) n++;
  return n;
}

/** Next-word counts after the context `ctx` (the last 1 word for a 2-gram, the last 2 for a 3-gram), most frequent first. */
export function followers(ctx: string[]) {
  const counts = new Map<string, number>();
  for (const t of TOKENS)
    for (let i = 0; i + ctx.length < t.length; i++)
      if (ctx.every((w, k) => t[i + k] === w)) counts.set(t[i + ctx.length], (counts.get(t[i + ctx.length]) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()].map(([w, c]) => ({ w, c, p: c / total })).sort((a, b) => b.c - a.c);
}

/** The sentence the scene builds from the 2-gram table (every pair appears in the corpus). */
export const PATH = ["猫は", "昨日", "運動場で", "サッカーを", "した"];
/** rows of the pair table shown in the scene */
export const TABLE_ROWS = [START, ...PATH];

export const ch38: ChapterSpec = {
  id: 38,
  part: 4,
  title: "直前の数語だけを見る",
  core: false,
  hook: "昔のAIは「次の語の確率」をどうやって求めていたのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "確率を求めるいちばん簡単な方法は、数えることです。まず、文をたくさん集めたノート、コーパス(corpus)が必要です。" },
    { id: "s2", sec: 10, narration: "「私は 今日 学校に」の次を数えるには、この3語がまるごと出てこないといけません。たった1回だけで、「猫は 今日 学校に」は0回です。" },
    { id: "s3", sec: 9, narration: "そこで工夫します。直前の1語だけを見るのです。「学校に」の次に何が来たかだけを数えればいいのです。" },
    { id: "s4", sec: 9, narration: "「学校に」の次は「行く」が3回、「遅れた」が1回。だから「行く」は4回中3回で、75%です。" },
    { id: "s5", sec: 10, narration: "すべての語についてこう数えると、ペアの回数表ができます。直前の数語だけを見るこの方法を、n-gramと呼びます。" },
    { id: "s6", sec: 9, narration: "この表だけを見て、文を作ってみましょう。1948年にシャノンも、こうして英語の文を作ってみました。" },
    { id: "s7", sec: 10, narration: "ペアどうしはどれも自然なのに、文は変ですね。直前の1語しか見ないので、主人公が猫だったことを忘れたのです。" },
    { id: "s8", sec: 10, narration: "もっと前まで見たらどうでしょう？ 長い語の並びほどコーパスにほとんどなく、0回になります。これを第39章のニューラルネットが解きます。" },
  ],
  playgroundTitle: "ペアの回数表で文を作る",
  playgroundIntro: "24文のコーパスで数えたペアの回数表で、文を作ります。候補を自分でえらぶか、「確率どおりに引く」を押してみましょう。コーパスになかった新しい文は出てくるでしょうか？",
  summary: [
    "n-gram：直前の数語だけを見て、コーパスで次の語を数えて確率を決める。",
    "ペアどうしは自然でも、前の内容を忘れるので、文全体はおかしくなりやすい。",
    "前を長く見ると、そんな語の並びはコーパスにほとんどなく、0回になる。",
  ],
  unlocks: "n-gram",
  unlockLabel: "歴史カードを1枚集めました",
  quiz: [
    {
      q: "コーパスで「学校に」の次に「行く」が3回、「遅れた」が1回出てきました。2-gramがつける「行く」の確率は？",
      choices: ["3%", "75%", "33%"],
      answer: 1,
      explain: "「学校に」のあとに来た語は全部で4回、そのうち「行く」が3回なので、3 ÷ 4 = 75%です。",
      review: "s4",
    },
    {
      q: "2-gramで作った文が、よくおかしくなる理由は？",
      choices: ["直前の1語だけを見て次の語をえらぶから", "語をでたらめにえらぶから", "コーパスにまちがった文があるから"],
      answer: 0,
      explain: "ペアどうしはコーパスで見たとおり自然ですが、もっと前の内容(主人公、時)は見ていません。",
      review: "s7",
    },
    {
      q: "前の語をもっと多く(例えば4語)見るn-gramの問題は？",
      choices: ["計算がかんたんになりすぎる", "文が短くなる", "そんな長い語の並びはコーパスにほとんどなく、0回が多い"],
      answer: 2,
      explain: "語の並びが長いほど、まったく同じものが出てきたことはまれで、数えるものがありません。第39章のニューラルネットがこの問題を解きます。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第38章 直前の数語だけを見る",
    corpus: "コーパス (corpus)",
    more: "… 全部で24文",
    count: "数えよう！",
    times: "回",
    only: "たった1回",
    zero: "0回",
    trick: "直前の1語だけを見る",
    after: "「学校に」の次に来た語",
    total: "全部で4回",
    pairTitle: "ペアの回数表",
    gram2: "直前の1語 → 2-gram",
    gram3: "直前の2語 → 3-gram",
    rowsMore: "… 語ごとに1行ずつ",
    shannon: "シャノン(1948)も！",
    pairOk: "ペアはどれも自然なのに…",
    huh: "猫がサッカーを？！",
    forgot: "直前しか見ないので主人公を忘れた",
    look1: "直前の1語",
    look2: "直前の2語",
    look3: "直前の3語",
    longer: "長く見るほど数えるものがない",
    next: "第39章：ニューラル言語モデル",
    arrow: "→",
  },
};
