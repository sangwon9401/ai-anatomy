import type { ChapterSpec, Highlighter } from "../../../data/types";

// ch14's scores (行く 3, 行った 2, 遅れた 1, ピザ −1, fixed for every locale by I18N_GUIDE.md); probabilities = softmax(score ÷ temperature), see part9-toy.ts.
export const SCORES81: { w: string; s: number; c: Highlighter }[] = [
  { w: "行く", s: 3, c: "yellow" },
  { w: "行った", s: 2, c: "mint" },
  { w: "遅れた", s: 1, c: "sky" },
  { w: "ピザ", s: -1, c: "pink" },
];

// s6: continuations of "私は 今日 学校に" written by the Part 9 toy model at three temperatures (illustrative picks;
// every one is a real path through the toy table, checked by script). At 0.2 the loop comes out about 78% of the time.
export const RUNS = [
  { t: 0.2, runs: [["行く", "そして", "友と", "会った", "そして", "友と", "会った", "…"]] },
  {
    t: 1,
    runs: [
      ["行く", "そして", "給食を", "食べた", "。"],
      ["行った", "。"],
      ["遅れた", "から", "走った", "。"],
    ],
  },
  {
    t: 2,
    runs: [
      ["ピザ", "持って", "宇宙へ", "飛んでいった", "。"],
      ["行った", "けど", "恐竜が", "現れた", "。"],
      ["行く", "。"],
    ],
  },
];

export const ch81: ChapterSpec = {
  id: 81,
  part: 9,
  title: "創造性のダイヤル",
  core: true,
  hook: "AIの「創造性」を、数字ひとつで調節できるのでしょうか？",
  steps: [
    { id: "s1", sec: 9.5, narration: "第14章でスコア3、2、1、−1をソフトマックスに入れると「行く」は65.7%でした。ここにダイヤルをつけてみます。" },
    { id: "s2", sec: 10, narration: "このダイヤルが温度（temperature）です。スコアを温度で割ってからソフトマックスに入れます。温度が1ならそのままです。" },
    { id: "s3", sec: 9.5, narration: "温度を0.5に下げると、スコアは6、4、2、−2。差が2倍に広がり、「行く」は86.7%。ぐっととがった形になります。" },
    { id: "s4", sec: 9.5, narration: "温度を2に上げると、スコアは1.5、1、0.5、−0.5。差が縮んで分布が平らになり、ピザも6.4%になります。" },
    { id: "s5", sec: 10, narration: "端まで回すと？温度が0に近いと1位だけが残ってグリーディ（第80章）になり、とても高いと全部の候補が同じくらいになります。" },
    { id: "s6", sec: 9.5, narration: "おもちゃのモデルで文を書くと、温度0.2では同じ言葉をぐるぐる回り、1では自然で、2ではへんてこになります。" },
    { id: "s7", sec: 10, narration: "正確な答えには低い温度、新しいアイデアには高い温度が向いています。温度は知識を変えず、確率だけを配り直します。" },
  ],
  playgroundTitle: "温度ダイヤル",
  playgroundIntro: "温度を変えながら確率の棒を見て、同じ温度で文を5つ書いてみましょう。文はどう変わるでしょう？",
  summary: [
    "温度：スコアを温度で割ってからソフトマックスに入れる。",
    "温度が低いととがって1位がひとり占め、高いと平らになっていろいろ選ばれる。",
    "低い温度はぶれず、高い温度は多様になる。モデルの知識はそのまま。",
  ],
  unlocks: "温度",
  unlockLabel: "推論の道具をひとつ手に入れました",
  quiz: [
    {
      q: "温度を0.5に下げると、ソフトマックスに入るスコア[3, 2, 1, −1]は？",
      choices: ["[1.5, 1, 0.5, −0.5]", "[6, 4, 2, −2]", "[3.5, 2.5, 1.5, −0.5]"],
      answer: 1,
      explain: "スコアを温度で割ります。0.5で割ると2倍になり、スコアの差も2倍に広がります。",
      review: "s3",
    },
    {
      q: "温度をとても高くすると、確率分布はどうなるでしょう？",
      choices: ["全部の候補が同じくらいになる", "1位だけが100%になる", "まったく変わらない"],
      answer: 0,
      explain: "スコアを大きな数で割ると差がほとんどなくなり、棒がみんな同じくらいの高さになります。",
      review: "s5",
    },
    {
      q: "数学の問題のように、正確な答えが必要なときに向いている温度は？",
      choices: ["とても高い温度", "高くても低くても関係ない", "低い温度"],
      answer: 2,
      explain: "低い温度はいちばんもっともらしい答えをほぼ毎回選ぶので、ぶれません。高い温度はお話づくりのように多様さがほしいときに使います。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第81章 創造性のダイヤル",
    example: "* 説明用の例のスコア（第14章）",
    recap: "第14章：スコア → 確率",
    dial: "ダイヤル追加！",
    temp: "温度",
    fLeft: "確率 = ソフトマックス",
    fRight: "(スコア ÷ 温度)",
    score: "スコア",
    divided: "÷温度",
    same: "÷ 1 → そのまま",
    sharp: "差が2倍 → とがる！",
    flat: "差が半分 → 平ら",
    near0: "温度 0.1",
    high: "温度 10",
    greedy: "1位だけ＝グリーディ",
    even: "みんな横並び＝平ら",
    runsHead: "「私は今日学校に」の続きを書くと",
    toy: "* おもちゃのモデルで選んだ説明用の例",
    allSame: "何回書いても同じです",
    loop: "ぐるぐる",
    natural: "自然",
    odd: "へんてこ",
    low: "低い温度",
    highT: "高い温度",
    lowWhen: "正確さが大事なとき",
    lowEx: "数学の解き方、事実の質問",
    highWhen: "多様さがほしいとき",
    highEx: "アイデア出し、お話づくり",
    key: "知識はそのまま、確率だけを配り直す",
    name: "「創造性のダイヤル」はニックネームです",
    go: "行く",
    went: "行った",
    late: "遅れた",
    pizza: "ピザ",
  },
};
