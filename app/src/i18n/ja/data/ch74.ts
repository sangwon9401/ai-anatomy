import type { ChapterSpec } from "../../../data/types";

export type Answer = { id: string; text: string; short: string; why: string };
export type Round = { q: string; answers: Answer[] };

// Model answers to rank. Written for the lesson; `why` is the feedback shown once a round is ranked.
// ja: the Korean 사과 (apple / apology) pun becomes はし (橋 bridge / 箸 chopsticks).
export const ROUNDS: Round[] = [
  {
    q: "テストの前の日なのに眠れません。どうしよう？",
    answers: [
      { id: "A", text: "眠れないなら徹夜で勉強しよう。", short: "徹夜で勉強して", why: "まねするとテストの日がもっとつらくなるかもしれないアドバイスです。「害がないか？」にひっかかります。" },
      { id: "B", text: "スマホを遠ざけ、電気を消して横になってみましょう。眠れなくても、目を閉じて休むと助けになります。", short: "スマホを置いて休む", why: "具体的で、まねしやすいです。「役に立つか？」をよく守っています。" },
      { id: "C", text: "睡眠は大事です。", short: "睡眠は大事", why: "まちがいではないけれど、どうすればいいかを教えてくれません。" },
    ],
  },
  {
    q: "「はし」を英語で言うと？",
    answers: [
      { id: "A", text: "川にかかる橋ならbridge、食べるときの箸ならchopsticksです。", short: "bridge + chopsticks", why: "正確で、まぎらわしい意味まで気をつけてくれました。" },
      { id: "B", text: "bridge", short: "bridge", why: "合ってはいるけれど、とても短いです（箸かもしれません）。" },
      { id: "C", text: "はしは川の上にかかっています。", short: "川にかかっている", why: "質問に答えていません。" },
    ],
  },
  {
    q: "子犬の名前を考えて",
    answers: [
      { id: "A", text: "子犬はかわいいです。", short: "子犬はかわいい", why: "質問に答えていません。" },
      { id: "B", text: "「まめ」「むぎ」「とうふ」はどうですか？ 毛の色を見て選ぶと、もっとぴったりです。", short: "まめ、むぎ、とうふ", why: "たのまれたことをして、選ぶコツまで教えてくれました。" },
      { id: "C", text: "名前をつけるのは難しいです。", short: "名前づけは難しい", why: "手伝わずに終わってしまいました。" },
    ],
  },
  {
    q: "1から10まで足すと？",
    answers: [
      { id: "A", text: "55です。1+10、2+9のようにペアにすると、11が5組できます。", short: "55 + 解き方", why: "正解に理由までついています。" },
      { id: "B", text: "55", short: "55", why: "正解だけれど理由がありません。" },
      { id: "C", text: "100です。", short: "100", why: "まちがった答えです。「本当か？」にひっかかります。" },
      { id: "D", text: "自分で計算してみてください。", short: "自分でやって", why: "手伝ってくれませんでした。" },
    ],
  },
];

/** Every pair (better, worse) implied by a ranking, best first. */
export function pairsOf(order: string[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) out.push([order[i], order[j]]);
  return out;
}

// the ranking used in the scene: B first, then C, then A
export const SCENE_ORDER = ["B", "C", "A"];

export const ch74: ChapterSpec = {
  id: 74,
  part: 8,
  title: "人が順位をつける",
  core: false,
  hook: "お手本の答えを自分で書くより、ずっと楽な方法はあるでしょうか？",
  steps: [
    { id: "s1", sec: 8, narration: "お手本の答えを書くのは難しいけれど、もうある答えからよいほうを選ぶのは簡単です。作文より採点のほうが楽なのと同じです。" },
    { id: "s2", sec: 7, narration: "そこでモデルに、同じ質問の答えをいくつも書かせます。確率どおりに選ぶので、答えは毎回ちがいます（第2章）。" },
    { id: "s3", sec: 8, narration: "人は答えを読んで順位をつけます。Bが1位、Cが2位、でたらめなアドバイスをしたAが3位です。" },
    { id: "s4", sec: 9, narration: "この順位を2つずつの比べっこに変えます。BはCよりよい、BはAよりよい、CはAよりよい。これが本当の学習データの形です。" },
    { id: "s5", sec: 7, narration: "答えが4つなら、比べっこは6組できます。順位を1回つけるだけで、比較データがいくつも手に入るのです。" },
    { id: "s6", sec: 9, narration: "順位をつける基準は3つ。役に立つか、本当か、害がないか。こうして集めたものを人間の好みデータといいます。" },
    { id: "s7", sec: 8, narration: "でも、人が全部の答えを採点し続けることはできません。そこで、このデータで採点するAIを作ります。次の章です。" },
  ],
  playgroundTitle: "自分が採点係",
  playgroundIntro: "答えを好きな順に押して、1位、2位、3位をつけてみましょう。自分の順位がどんな比較データに変わるかを見せます。",
  summary: [
    "答えを自分で書くより、いくつかの答えから選ぶほうが楽で速い。",
    "順位は2つずつの比べっこ（よいほうの答え > よくないほうの答え）に変わる。答え3つなら3組、4つなら6組。",
    "基準：役に立つか、本当か、害がないか。これが人間の好みデータ。",
  ],
  unlocks: "人間の好みデータ",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "3つの答えにB > C > Aと順位をつけました。ここから出てこない比較は？",
      choices: ["BはAよりよい", "AはCよりよい", "CはAよりよい"],
      answer: 1,
      explain: "順位が上の答えが、下の答えよりよいほうです。Aは3位なので、Cよりよいことはありえません。",
      review: "s4",
    },
    {
      q: "4つの答えに順位をつけると、比較データは何組？",
      choices: ["4組", "8組", "6組"],
      answer: 2,
      explain: "4つから2つを選ぶ方法は、4 × 3 ÷ 2 = 6通りです。",
      review: "s5",
    },
    {
      q: "人が順位をつける方法を使ういちばんの理由は？",
      choices: ["お手本を書くより、選ぶほうが楽で速いから", "人は答えを書けないから", "モデルは順位しか読めないから"],
      answer: 0,
      explain: "作文より採点のほうが楽ですね。同じ時間で、ずっとたくさんのデータを集められます。",
      review: "s1",
    },
  ],
  labels: {
    tag: "第74章 人が順位をつける",
    write: "お手本の答えを書く",
    hard: "難しい…",
    choose: "よいほうの答えを選ぶ",
    easy: "簡単！",
    better: "こっちがいい",
    modelSame: "モデルが書いた答え · 同じ質問に答え3つ",
    rank1: "1位",
    rank2: "2位",
    rank3: "3位",
    person: "人が順位をつける",
    pairsTitle: "比較データ",
    betterHead: "よい答え",
    worseHead: "よくない答え",
    gt: ">",
    row: "質問 + よい答え + よくない答え = 1行",
    four: "答え4つ → 比べっこ6組",
    comb: "4つから2つを選ぶ：4 × 3 ÷ 2 = 6",
    instruct: "InstructGPTは、1つの質問に答え4〜9個ずつ順位をつけました",
    pairUnit: "組",
    c1: "役に立つか？",
    c2: "本当か？",
    c3: "害がないか？",
    criteria: "順位の基準",
    pref: "人間の好みデータ",
    prefEn: "human preference data",
    tooMany: "全部の答えを人が採点することはできない",
    judge: "採点するAI？",
    next: "第75章",
  },
};
