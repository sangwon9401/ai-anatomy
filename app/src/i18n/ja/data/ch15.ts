import type { ChapterSpec } from "../../../data/types";

export const MATH = [55, 65, 70, 75, 85]; // mean 70, standard deviation 10
export const FIT = [11, 13, 14, 15, 17]; // mean 14, standard deviation 2 (a 20-point quiz in this version)

export const stats = (xs: number[]) => {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length);
  return { mean, sd };
};

export const DATASETS = [
  { key: "math", name: "数学の点数", xs: MATH },
  { key: "fit", name: "小テストの点数", xs: FIT },
  { key: "wild", name: "ばらばら", xs: [3, 40, 12, 95, 60] },
];

export const TOOLS = ["数字に変える", "ベクトル", "距離", "内積", "行列", "行列の積", "関数", "確率分布", "ソフトマックス", "正規化"];

export const ch15: ChapterSpec = {
  id: 15,
  part: 1,
  title: "大きさをそろえる：正規化",
  core: false,
  hook: "100点満点のテストと20点満点のテスト、どちらのほうがよくできたのでしょう？",
  steps: [
    { id: "s1", sec: 8, narration: "数学のテストは100点満点、小テストは20点満点。数字の大きさがちがうので、そのままでは比べられません。" },
    { id: "s2", sec: 10, narration: "そこで大きさをそろえます。1つ目、平均を引きます。平均の位置が0になり、平均より高いか低いかが見えます。" },
    { id: "s3", sec: 10, narration: "2つ目、散らばりの大きさで割ります。散らばりの大きさは標準偏差で表します。これで2つのテストが同じものさしになります。" },
    { id: "s4", sec: 12, narration: "数学85点と小テスト17点。どちらも平均より標準偏差1.5個分高く、同じくらいよくできています。このようにそろえることを正規化といいます。" },
    { id: "s5", sec: 10, narration: "GPTでも、ベクトルが層を通るたびに数字が大きくなりすぎたり小さくなりすぎたりします。だから層ごとに正規化で大きさをそろえ直します。" },
    { id: "s6", sec: 9, narration: "第57章で見るレイヤー正規化がまさにこれです。何十層も積み重ねても、計算がぐらつかないようにしてくれます。" },
    { id: "s7", sec: 9, narration: "平均を引いて、散らばりの大きさで割る。これでPart 1の数学の道具箱が完成しました！" },
  ],
  playgroundTitle: "正規化マシン",
  playgroundIntro: "点数のまとまりを選んで、①、②のボタンを順に押してみましょう。どんな数字のまとまりでも、同じくらいの大きさにそろいます。",
  summary: [
    "① 平均を引く：平均の位置が0になる。",
    "② 標準偏差で割る：散らばりの大きさが1にそろう。",
    "GPTは層ごとに正規化して、数字が暴走しないようにする（第57章）。",
  ],
  unlocks: "正規化",
  unlockLabel: "数学の道具をひとつ手に入れました",
  quiz: [
    {
      q: "点数 [60, 70, 80] から平均を引くと？",
      choices: ["[−10, 0, 10]", "[0, 10, 20]", "[60, 70, 80]"],
      answer: 0,
      explain: "平均が70なので、それぞれから70を引くと−10、0、10です。",
      review: "s2",
    },
    {
      q: "正規化の2つのステップは？",
      choices: ["平均を引く、標準偏差で割る", "最大値を引く、2で割る", "全部足す、個数で割る"],
      answer: 0,
      explain: "平均を引いて真ん中を0に、標準偏差で割って散らばりの大きさを1にそろえます。",
      review: "s3",
    },
    {
      q: "GPTが層ごとに正規化をする理由は？",
      choices: ["数字が大きくなりすぎたり小さくなりすぎたりしないように", "単語の数を減らすため", "答えを早く出すため"],
      answer: 0,
      explain: "何十層も通るうちに数字が暴走しないよう、大きさをそろえ直します。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第15章 大きさをそろえる：正規化",
    math: "数学（100点満点）",
    fit: "小テスト（20点満点）",
    hard: "そのままでは比べられない",
    step1: "① 平均を引く",
    step2: "② 標準偏差で割る",
    mean: "平均",
    zero: "0 = 平均",
    sd: "標準偏差",
    same: "同じものさし！",
    m85: "数学85点 → +1.5",
    f17: "小テスト17点 → +1.5",
    norm: "正規化",
    layer: "層",
    grow: "層を通るほど大きくなる",
    fix: "正規化でそろえ直す",
    ln: "レイヤー正規化（第57章）",
    done: "Part 1 数学の道具箱、完成！",
  },
};
