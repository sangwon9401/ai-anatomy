import { NEURON, STORE_A, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** A店 only, turning only the 待ち knob w: loss = (prediction − 4.5)² = (2w − 3)² */
export const lossA = (w: number) => (neuron(STORE_A.x, [NEURON.w[0], w, NEURON.w[2]], NEURON.b) - STORE_A.real) ** 2;
/** slope measured the way the chapter explains it: nudge w a little and see how the loss changes */
export const slopeA = (w: number, d = 1e-4) => (lossA(w + d) - lossA(w - d)) / (2 * d);
export const LR = 0.1;
export const W0 = NEURON.w[1];
/** w after each gradient step from W0 */
export const PATH = (() => {
  const ws = [W0];
  for (let i = 0; i < 5; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - LR * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
})();

export const ch21: ChapterSpec = {
  id: 21,
  part: 2,
  title: "勾配降下法",
  core: true,
  hook: "損失を減らすには、つまみをどちらへ、どれだけ回せばよいのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "A店だけを見て、第16章のニューロンの「待ち」の重みwだけを回してみます。いまwは1、損失は1です。" },
    { id: "s2", sec: 9, narration: "wをいろいろな値に変えて損失を点で打つと、谷の形が現れます。いちばん低い谷底を見つけたいのです。" },
    { id: "s3", sec: 11, narration: "でも実際にはこの図は見えません。つまみが数えきれないほどあるからです。霧のかかった山で、足もとしか見えないようなものです。" },
    { id: "s4", sec: 9, narration: "足もとの傾きならわかります。wをほんの0.01上げてみると、損失は1から0.96へ、約0.04減ります。" },
    { id: "s5", sec: 11, narration: "傾きとは、少し変えたときに損失がどれだけ変わるか。−0.04 ÷ 0.01 = 約 −4。マイナスなので、wを上げると損失が下がります。" },
    { id: "s6", sec: 11, narration: "だから傾きと反対の向きに一歩！新しいw = 1 − 0.1 × (−4) = 1.4。0.1は歩幅です（第22章の学習率）。" },
    { id: "s7", sec: 11, narration: "これをくり返すと、ボールが谷底へ転がっていきます。wは1.5、予想は4.5点、損失は0。これが勾配降下法です。" },
    { id: "s8", sec: 10, narration: "つまみが2つなら、おわんの形になります。1,750億個なら想像もできない山ですが、つまみごとに傾きを求めるのは同じです。" },
  ],
  playgroundTitle: "霧の中の下山",
  playgroundIntro: "谷は霧にかくれています。「傾きをはかる」で足もとだけを確かめながら、つまみを回して損失を0.01より下げてみましょう。行きづまったら「自動で一歩」を押してみましょう。",
  summary: [
    "傾き = つまみを少し変えたとき、損失がどれだけ変わるか。",
    "傾きと反対の向きに少しずつ：新しいつまみ = つまみ − 学習率 × 傾き。",
    "くり返すと、損失の谷の底へ下りていく。これが勾配降下法。",
  ],
  unlocks: "勾配降下法",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "つまみを0.01上げたら、損失が0.03増えました。傾きはおよそいくつでしょう？",
      choices: ["−3", "+3", "+0.03"],
      answer: 1,
      explain: "傾き = 損失の変化 ÷ つまみの変化 = 0.03 ÷ 0.01 = 3です。増えたのでプラスです。",
      review: "s5",
    },
    {
      q: "傾きが +3 なら、損失を減らすにはつまみをどちらに回せばよいでしょう？",
      choices: ["上げる", "下げる", "そのままにする"],
      answer: 1,
      explain: "上げると損失が増えるので、反対に下げます。新しい値 = いまの値 − 学習率 × 3。",
      review: "s6",
    },
    {
      q: "w = 2、傾き = 5、学習率 = 0.1 なら、一歩進んだあとのwは？",
      choices: ["1.5", "2.5", "1.9"],
      answer: 0,
      explain: "2 − 0.1 × 5 = 2 − 0.5 = 1.5です。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第21章 勾配降下法",
    title: "待ちの重みwだけ",
    example: "A店だけ · 説明用の例",
    axisW: "w（待ちの重み）",
    axisL: "損失",
    now: "いま：w = 1、損失 = 1",
    valley: "損失の谷",
    goal: "ここが谷底！",
    fog: "霧の中：足もとしか見えない",
    nudgeW: "w：1 → 1.01",
    nudgeL: "損失：1 → 0.96",
    nudgeD: "約0.04減った",
    slope: "傾き ≈ −0.04 ÷ 0.01 = −4",
    slopeNote: "マイナス → wを上げると損失が減る",
    rule: "新しいw = 1 − 0.1 × (−4) = 1.4",
    lr: "0.1 = 歩幅（学習率）",
    loss14: "損失 1 → 0.04",
    repeat: "1 → 1.4 → 1.48 → 1.496 → … → 1.5",
    done: "予想4.5点 = 本当の星！",
    gd: "勾配降下法",
    bowl: "つまみ2つ = おわんの形",
    k1: "つまみ1",
    k2: "つまみ2",
    many: "1,750億個でも同じ",
    bowlEx: "説明用の図",
  },
};
