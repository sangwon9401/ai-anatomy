import { NEURON, STORES, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** A店, B店, C店 scored by the 16章 neuron: prediction, real stars, error */
export const GRADED = STORES.slice(0, 3).map((s) => {
  const pred = neuron(s.x, NEURON.w, NEURON.b);
  return { name: s.name, pred, real: s.real, err: pred - s.real };
});
export const ERR_SUM = GRADED.reduce((a, g) => a + g.err, 0);
export const SQ_SUM = GRADED.reduce((a, g) => a + g.err ** 2, 0);
export const MSE = SQ_SUM / GRADED.length;

export const ch20: ChapterSpec = {
  id: 20,
  part: 2,
  title: "どれだけ間違えた？ 損失",
  core: true,
  hook: "AIがまちがえたのはわかるけれど、「どれだけ」まちがえたかは、どうはかるのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "第16章のニューロンは、A店を3.5点と予想しました。でも友だちが食べてつけた本当の星は4.5です。" },
    { id: "s2", sec: 10, narration: "まちがいの大きさは、矢と的の間の距離です。予想引く正解、3.5 − 4.5 = −1。1点足りない当て方でした。" },
    { id: "s3", sec: 11, narration: "3軒を採点してみましょう。Aは −1、Bは +1、Cは −0.5。そのまま足すと −0.5で、ほとんどまちがえていないように見えます。" },
    { id: "s4", sec: 11, narration: "符号を消すために、まちがいの大きさを2乗します。絶対値でもいいのですが、2乗すると大きなまちがいをより強くしかります。" },
    { id: "s5", sec: 9, narration: "2乗した値の平均は 2.25 ÷ 3 = 0.75。この数字1つが損失（loss）です。0なら全部正解です。" },
    { id: "s6", sec: 11, narration: "GPTは星の代わりに次の単語を当てます。だから、正解の単語にどれだけ確率をつけたかで採点します。第65章で学びます。" },
    { id: "s7", sec: 8, narration: "これで目標ができました。損失が0に近づくようなつまみを探すこと。探し方は第21章で見ます。" },
  ],
  playgroundTitle: "採点マシン",
  playgroundIntro: "スライダーで3軒の予想の星（矢）を動かしてみましょう。的（本当の星）との距離、その2乗、そして損失がすぐに計算されます。",
  summary: [
    "誤差 = 予想 − 正解。そのまま足すと、+と−が打ち消し合う。",
    "だから2乗（または絶対値）して平均をとる。この数字1つが損失。",
    "損失0 = 全部正解。学習 = 損失を減らすつまみ探し。GPTの損失は第65章。",
  ],
  unlocks: "損失（loss）",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "予想が2点、正解が5点なら、2乗誤差は？",
      choices: ["3", "9", "−3"],
      answer: 1,
      explain: "誤差は 2 − 5 = −3、2乗すると (−3)² = 9です。",
      review: "s4",
    },
    {
      q: "誤差をそのまま足さずに2乗する理由は？",
      choices: ["+と−が打ち消し合わないようにするため", "計算を速くするため", "損失をマイナスにするため"],
      answer: 0,
      explain: "−1と+1をそのまま足すと0になり、まったくまちがえていないように見えます。2乗すればどちらも1です。",
      review: "s3",
    },
    {
      q: "損失が0というのは、どういう意味でしょう？",
      choices: ["モデルがまだ計算していない", "すべての予想が正解と同じ", "すべての予想が0"],
      answer: 1,
      explain: "誤差がすべて0でなければ、2乗の平均も0にはなりません。損失は小さいほどよいのです。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第20章 どれだけ間違えた？ 損失",
    titleA: "A店の星を当てる",
    title3: "3軒を採点する",
    example: "説明用の例",
    pred: "予想",
    real: "本当の星",
    gap: "1点の差",
    errFormula: "予想 − 正解 = 3.5 − 4.5 = −1",
    star: "星",
    sum: "そのまま足すと：−1 + 1 − 0.5 = −0.5",
    looks: "ほとんどまちがえていない？！",
    err: "誤差",
    square: "2乗する",
    sqSum: "2乗の合計：1 + 1 + 0.25 = 2.25",
    big: "大きくまちがえるほど、ずっと大きくなる",
    mean: "平均：2.25 ÷ 3 = 0.75",
    loss: "損失（loss）= 0.75",
    zero: "0なら全部正解",
    gptTitle: "GPTの採点",
    sentence: "私は今日学校に",
    answer: "正解：行く",
    gave: "正解の確率",
    ce: "交差エントロピー（第65章）",
    surprise: "「おどろきの大きさ」で採点",
    goal1: "損失 = まちがいの大きさを数字1つで",
    goal2: "学習 = 損失を0に近づけること",
    how: "どうやって？ → 第21章 勾配降下法",
    go: "行く",
    went: "行った",
    late: "遅れた",
  },
};
