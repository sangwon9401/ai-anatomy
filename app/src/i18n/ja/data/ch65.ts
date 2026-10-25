import type { ChapterSpec, Highlighter } from "../../../data/types";

/** 驚き in "halvings": how many times 1 must be halved to reach p, i.e. log₂(1/p). */
export const surprise = (p: number) => Math.log2(1 / p);

/** ch01's numbers for "私は 今日 学校に → ?" (illustrative), with the rest merged into その他. */
export const NEXT: { w: string; p: number; c: Highlighter }[] = [
  { w: "行く", p: 0.52, c: "yellow" },
  { w: "行った", p: 0.21, c: "mint" },
  { w: "遅れた", p: 0.12, c: "sky" },
  { w: "その他", p: 0.15, c: "violet" },
];

/** The halving ladder: probability as a fraction label and its 驚き. */
export const LADDER = [
  { label: "1", p: 1 },
  { label: "1/2", p: 1 / 2 },
  { label: "1/4", p: 1 / 4 },
  { label: "1/8", p: 1 / 8 },
];

/** 第64章's four questions with illustrative probabilities the model gave the right answer. */
export const QUESTIONS65 = [
  { ctx: "私は", ans: "今日", p: 0.25 },
  { ctx: "私は 今日", ans: "学校に", p: 0.5 },
  { ctx: "私は 今日 学校に", ans: "行く", p: 0.52 },
  { ctx: "私は 今日 学校に 行く", ans: "。", p: 0.8 },
];

export const meanSurprise = (ps: number[]) => ps.reduce((a, p) => a + surprise(p), 0) / ps.length;

export const ch65: ChapterSpec = {
  id: 65,
  part: 7,
  title: "驚きの大きさ",
  core: true,
  hook: "正解に52%をかけたモデルは、どれくらい間違えたのでしょう？ 間違いの度合いを1つの数で測れるでしょうか？",
  steps: [
    { id: "s1", sec: 10, narration: "モデルは「私は 今日 学校に」の次に、行くに52%をつけました。正解は行くでした。モデルはどれくらい間違えたのでしょう？" },
    { id: "s2", sec: 11, narration: "人で言えば「驚き」です。起きると信じていたことが起きてもあまり驚かず、まさかと思ったことが起きるとびっくりしますよね。" },
    { id: "s3", sec: 11, narration: "驚きを数で測ってみましょう。確実なこと（確率1）が起きたら驚きは0。確率が半分になるたびに、驚きが1ずつ増えます。" },
    { id: "s4", sec: 11, narration: "1/4なら2、1/8なら3。8にするには2を何回かければいいかを数えるのです。2 × 2 × 2 = 8、だから3。" },
    { id: "s5", sec: 11, narration: "点をつなぐと、確率が0に近づくほど驚きはどこまでも跳ね上がります。数学ではこの計算を対数（log）といい、高校数学で習います。" },
    { id: "s6", sec: 10, narration: "行く52%で測ると、驚きは約0.94。行くに12%しかつけていなかったら約3.06です。正解に多くかけるほど驚きは小さくなります。" },
    { id: "s7", sec: 11, narration: "問題ごとの驚きを平均すると、交差エントロピー（cross-entropy）です。これがGPTの損失で、学習はこれを小さくすることです。" },
  ],
  playgroundTitle: "驚きメーター",
  playgroundIntro: "正解につけた確率を変えてみましょう。確率が半分になるたびに、驚きがどれだけ大きくなるか確かめます。",
  summary: [
    "驚き：正解につけた確率が低いほど大きくなる。確率1なら驚きは0。",
    "確率が半分になるたびに驚き +1（1/2 → 1、1/4 → 2、1/8 → 3）。この計算が対数（log）。",
    "問題ごとの驚きの平均 = 交差エントロピー = GPTの損失。学習はこれを小さくすること。",
  ],
  unlocks: "交差エントロピー",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "正解につけた確率が1/4なら、驚きは？（2を基準にして）",
      choices: ["1", "2", "4"],
      answer: 1,
      explain: "1を半分に2回すると1/4です。2 × 2 = 4、だから驚きは2です。",
      review: "s4",
    },
    {
      q: "モデルが正解に90%をつけた場合と10%をつけた場合、損失が大きいのは？",
      choices: ["10%をつけた場合", "90%をつけた場合", "どちらも同じ"],
      answer: 0,
      explain: "正解に少ししかかけていないほど、大きく驚きます。驚きが大きいと損失も大きくなります。",
      review: "s6",
    },
    {
      q: "交差エントロピー損失を小さくするとは？",
      choices: ["候補の数を減らす", "全部の候補に同じ確率をつける", "正解のかけらにもっと高い確率をつける"],
      answer: 2,
      explain: "正解に高い確率をつけるほど驚きが小さくなり、その平均が損失です。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第65章 驚きの大きさ",
    ctx: "私は 今日 学校に",
    example: "説明用の例",
    answer: "正解！",
    howWrong: "どれだけ外れた？",
    rain90: "降水確率90%",
    rain10: "降水確率10%",
    rained: "→ 雨が降った！",
    little: "少し驚く",
    big: "びっくり！",
    prob: "確率",
    surprise: "驚き",
    halve: "半分になると +1",
    times: "8 = 2 × 2 × 2 → 驚き3",
    axisP: "正解につけた確率 →",
    axisS: "↑ 驚き",
    soar: "0に近いほど跳ね上がる",
    formula: "驚き = log₂(1 ÷ 確率)",
    log: "対数（log）：高校で習う",
    go52: "行く 52%",
    go12: "行く 12%",
    lessSurprise: "正解に多くかけるほど驚きは小さい",
    colQ: "問題",
    colP: "正解の確率",
    colS: "驚き",
    mean: "平均",
    ce: "交差エントロピー",
    loss: "= GPTの損失（第20章）",
    learn: "学習 = 驚きを小さくする",
    base: "本物の学習では2ではなくe（第14章）を使う。考え方は同じ",
  },
};
