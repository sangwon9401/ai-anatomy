import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Dist = { key: string; name: string; items: { w: string; p: number; c: Highlighter }[] };

export const DISTS: Dist[] = [
  {
    key: "dice",
    name: "サイコロ",
    items: [1, 2, 3, 4, 5, 6].map((n) => ({ w: String(n), p: 1 / 6, c: "sky" as const })),
  },
  {
    key: "breakfast",
    name: "朝ごはん",
    items: [
      { w: "ごはん", p: 0.55, c: "yellow" },
      { w: "パン", p: 0.25, c: "mint" },
      { w: "シリアル", p: 0.15, c: "sky" },
      { w: "ピザ", p: 0.05, c: "pink" },
    ],
  },
  {
    key: "flat",
    name: "平らな分布",
    items: [
      { w: "あ", p: 0.28, c: "yellow" },
      { w: "い", p: 0.26, c: "mint" },
      { w: "う", p: 0.24, c: "sky" },
      { w: "え", p: 0.22, c: "pink" },
    ],
  },
];

// fixed "random" draws for the s5 animation (mostly ごはん, sometimes others)
export const DRAWS = ["ごはん", "ごはん", "パン", "ごはん", "シリアル", "ごはん", "ごはん", "パン", "ごはん", "ピザ", "ごはん", "パン"];

export const ch13: ChapterSpec = {
  id: 13,
  part: 1,
  title: "確率分布",
  core: false,
  hook: "「たぶん雨が降るよ」を数字でいうと、どうなるでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "サイコロをふると、1から6がそれぞれ6分の1の確率で出ます。中学校で習った確率ですね。" },
    { id: "s2", sec: 10, narration: "結果ごとに確率を棒で立てると、確率分布になります。棒の高さを全部足すと、いつも1、つまり100%です。" },
    { id: "s3", sec: 9, narration: "どの分布も平らとは限りません。朝ごはんなら、ごはんが高くてピザは低いでしょう。これを、とがった分布といいます。" },
    { id: "s4", sec: 10, narration: "GPTは毎回、このような分布を出します。候補は約5万個のかけらで、棒も5万本。それでも合計はぴったり1です。" },
    { id: "s5", sec: 10, narration: "分布から1つ選ぶとき、高い棒ほど選ばれやすくなります。でも低い棒も、ときどきは選ばれます。" },
    { id: "s6", sec: 10, narration: "分布がとがっていれば答えはいつも同じに、平らならいろいろになります。第81章では「温度」でこれを調節します。" },
    { id: "s7", sec: 9, narration: "確率分布は、すべての候補の可能性で、合計は1。次の第14章では、点数をこのような分布に変える方法を学びます。" },
  ],
  playgroundTitle: "くじ引き実験室",
  playgroundIntro: "分布を選んで、何回も引いてみましょう。たくさん引くほど、選ばれた割合が確率に近づきます。",
  summary: [
    "確率分布：候補ごとに可能性をつけたもの。棒を全部足すと1。",
    "高い棒ほど選ばれやすいが、低い棒もときどき選ばれる。",
    "GPTは毎回、約5万個の候補の分布を出して、そこから1つ選ぶ。",
  ],
  unlocks: "確率分布",
  unlockLabel: "数学の道具をひとつ手に入れました",
  quiz: [
    {
      q: "サイコロで3が出る確率は？",
      choices: ["1/6", "1/3", "3/6"],
      answer: 0,
      explain: "6つの面がどれも同じように出るので、それぞれ1/6です。",
      review: "s1",
    },
    {
      q: "確率分布の棒の高さを全部足すと？",
      choices: ["1（100%）", "候補の数", "そのときによってちがう"],
      answer: 0,
      explain: "どれか1つは必ず起きるので、すべての可能性を足すと1です。",
      review: "s2",
    },
    {
      q: "確率が10%の候補は？",
      choices: ["絶対に選ばれない", "ときどき選ばれる", "いつも選ばれる"],
      answer: 1,
      explain: "10回に1回くらい選ばれます。低くても0でなければ選ばれることがあります。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第13章 確率分布",
    dice: "サイコロ",
    sixth: "どれも1/6",
    dist: "確率分布",
    total: "和 = 1（100%）",
    breakfast: "朝ごはん",
    peaked: "とがった分布",
    gpt: "GPTの次のかけらの分布",
    many: "候補は約5万個、合計は1",
    draw: "くじ引き",
    count: "選ばれた回数",
    sometimes: "低い棒もたまに！",
    sharp: "とがる → 同じ答え",
    flat: "平ら → 多様な答え",
    temp: "第81章：温度で調節",
    sum: "確率分布 = 全候補の可能性、和は1",
    next: "次は第14章：ソフトマックス",
    go: "行く",
    went: "行った",
    late: "遅れた",
  },
};
