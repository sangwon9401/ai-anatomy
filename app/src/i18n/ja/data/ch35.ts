import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];

// ja overlay of src/data/ch35.ts. Same coordinates as the Korean map; the multi-sense word is 「かみ」 (紙・神・髪,
// the word chapter 45 uses), so the three groups around it are 文房具 (紙), 神社 (神) and 体 (髪) where the Korean map
// had 과일, 탈것 and 몸. Neighbours, odd-one-out answers and label overlaps re-checked with a script.
export const UNIVERSE: { w: string; v: P2; g: number }[] = [
  { w: "犬", v: [1.4, 9.1], g: 0 },
  { w: "猫", v: [0.55, 8.55], g: 0 },
  { w: "うさぎ", v: [2.1, 8.45], g: 0 },
  { w: "ハムスター", v: [1.25, 7.9], g: 0 },
  { w: "トラ", v: [1.95, 7.4], g: 0 },
  { w: "ノート", v: [8.5, 8.6], g: 1 },
  { w: "はさみ", v: [7.65, 8.05], g: 1 },
  { w: "定規", v: [9.2, 7.95], g: 1 },
  { w: "えんぴつ", v: [8.35, 7.4], g: 1 },
  { w: "ペン", v: [9.05, 6.9], g: 1 },
  { w: "神社", v: [8.3, 2.7], g: 2 },
  { w: "鳥居", v: [7.45, 2.15], g: 2 },
  { w: "祭り", v: [9, 2.05], g: 2 },
  { w: "お守り", v: [8.15, 1.5], g: 2 },
  { w: "初詣", v: [8.85, 1], g: 2 },
  { w: "頭", v: [4.3, 2.5], g: 3 },
  { w: "足", v: [3.45, 1.95], g: 3 },
  { w: "うで", v: [5, 1.85], g: 3 },
  { w: "手", v: [4.15, 1.3], g: 3 },
  { w: "肩", v: [4.85, 0.8], g: 3 },
  { w: "学校", v: [1.4, 5.5], g: 4 },
  { w: "先生", v: [0.55, 4.95], g: 4 },
  { w: "宿題", v: [2.1, 4.85], g: 4 },
  { w: "教室", v: [1.25, 4.3], g: 4 },
  { w: "試験", v: [1.95, 3.8], g: 4 },
  { w: "雲", v: [5, 9.6], g: 5 },
  { w: "風", v: [4.15, 9.05], g: 5 },
  { w: "台風", v: [5.7, 8.95], g: 5 },
  { w: "梅雨", v: [4.85, 8.4], g: 5 },
  { w: "日差し", v: [5.55, 7.9], g: 5 },
  { w: "かみ", v: [6.6, 4.8], g: -1 },
];
export const UNI_GROUPS: { name: string; c: Highlighter }[] = [
  { name: "動物", c: "yellow" },
  { name: "文房具", c: "pink" },
  { name: "神社", c: "sky" },
  { name: "体", c: "orange" },
  { name: "学校", c: "mint" },
  { name: "天気", c: "violet" },
];

export const dist2 = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const wordAt = (w: string) => UNIVERSE.find((x) => x.w === w)!;
export function nearest(w: string, k = 5) {
  const me = wordAt(w);
  return UNIVERSE.filter((x) => x.w !== w)
    .map((x) => ({ ...x, d: dist2(me.v, x.v) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
}
/** the word whose average distance to the other three is largest */
export function oddOne(words: string[]) {
  const avg = words.map((w) => words.filter((x) => x !== w).reduce((s, x) => s + dist2(wordAt(w).v, wordAt(x).v), 0) / (words.length - 1));
  return words[avg.indexOf(Math.max(...avg))];
}
export const ODD_ROUNDS = [
  ["ノート", "はさみ", "定規", "神社"],
  ["犬", "猫", "鳥居", "うさぎ"],
  ["先生", "宿題", "教室", "お守り"],
  ["雲", "風", "台風", "うで"],
  ["頭", "足", "初詣", "手"],
];
// s6: two sentences that pull 'かみ' toward one meaning (第45章)
export const BAE_SENTENCES = [
  { text: "美容院でかみを短く切った", g: 3 },
  { text: "神社にまつられたかみ", g: 2 },
];

export const ch35: ChapterSpec = {
  id: 35,
  part: 3,
  title: "埋め込み宇宙の探検",
  core: false,
  hook: "単語の地図で「犬」のとなりにはだれが住んでいて、「かみ」はどのあたりにいるのでしょう？",
  steps: [
    { id: "s1", sec: 7.5, narration: "これまで作った埋め込みの宇宙を探検しましょう。単語31個を2Dの地図に広げました。場所は説明用の例です。" },
    { id: "s2", sec: 7, narration: "「犬」を検索すると、近い単語から順に明かりがつきます。うさぎ、猫、ハムスター…みんな動物です。" },
    { id: "s3", sec: 8.5, narration: "近さの順番は距離で決めました(第8章)。本物のAIの検索では、向きがどれだけ同じか、つまり内積(第9章)をよく使います。" },
    { id: "s4", sec: 7, narration: "仲間はずれ探しもできます。ノート、はさみ、定規、神社。神社だけ、ひとりで遠くにいますね。" },
    { id: "s5", sec: 8, narration: "では「かみ」はどこでしょう？ 文房具、神社、体のグループの間にはさまっています。紙・神・髪と、意味がいくつもあるからです。" },
    { id: "s6", sec: 8.5, narration: "単語1つに場所は1つだけなので、どの「かみ」かは文を見ないとわかりません。この問題は第45章のアテンションが解きます。" },
    { id: "s7", sec: 8.5, narration: "本物の埋め込みは、GPT-3なら12,288次元です。この地図は、それを2Dにおしつぶしてかいた影なので、少しずつゆがんでいます。" },
    { id: "s8", sec: 7, narration: "埋め込みの宇宙では、近ければ似ていて、向きは関係を表します。これで単語が、意味のこもった数になりました。" },
  ],
  playgroundTitle: "埋め込み宇宙の探検",
  playgroundIntro: "単語を押してみましょう。近い順に、となりの単語が光ります。下の「仲間はずれ探し」にも挑戦しましょう。",
  summary: [
    "埋め込みの空間では、近い単語は意味も似ている。検索＝近い点を探すこと。",
    "「かみ」のように意味がいくつもある単語は、グループの間にはさまっている。",
    "どの意味かは文を見ないとわからない。それをするのがアテンション(第45章)。",
  ],
  unlocks: "意味で検索",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "埋め込みの地図で「犬」にいちばん近そうな単語は？",
      choices: ["神社", "猫", "雲"],
      answer: 1,
      explain: "似たまわりの単語といっしょに使われる動物どうしは、近くに集まっています。",
      review: "s2",
    },
    {
      q: "「かみ」が文房具・神社・体のグループの間に置かれた理由は？",
      choices: ["文字数が少ないから", "意味がいくつもあり、いろいろなグループのまわりの単語といっしょに使われるから", "いちばんよく使う単語だから"],
      answer: 1,
      explain: "紙、神、髪。まわりの単語がまざっているので、座標も中間あたりに置かれます。",
      review: "s5",
    },
    {
      q: "文ごとに「かみ」の意味をえらんでくれるしくみは、第何章で学ぶでしょう？",
      choices: ["第29章 トークナイザー", "第32章 ワンホット", "第45章 アテンション"],
      answer: 2,
      explain: "アテンションがまわりの単語を見て、「かみ」のベクトルを文に合うように直します。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第35章 埋め込み宇宙の探検",
    title: "埋め込みの宇宙 (説明用の例)",
    search: "検索：",
    dog: "犬",
    ranks: "近い順",
    distNote: "距離(第8章)で並べる",
    cosine1: "本物の検索は向きを見る",
    cosine2: "内積(第9章)をよく使う",
    odd: "仲間はずれ探し",
    oddAns: "神社だけ遠い！",
    bae: "かみ",
    baeQ: "「かみ」はどこに？",
    fruit: "「紙」",
    boat: "「神」",
    belly: "「髪」",
    many: "意味がいくつもあるから間に",
    one: "単語1つ＝場所1つ",
    attn: "どのかみかは文で決まる → 第45章",
    dims: "本物：12,288次元 (GPT-3)",
    shadow: "地図＝2Dにおしつぶしてかいた影",
    twist: "だから少しずつゆがんでいる",
    sum1: "近ければ似ている",
    sum2: "向きは関係",
    sum3: "単語 → 意味のこもった数、完成",
  },
};
