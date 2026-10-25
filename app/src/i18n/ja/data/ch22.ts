import { W0, lossA, slopeA } from "../../../data/ch21";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** gradient steps on 21章's valley (A店, the 待ち knob) with learning rate `lr` */
export function walk(lr: number, steps: number, w0 = W0) {
  const ws = [w0];
  for (let i = 0; i < steps; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - lr * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
}

export const RUNS: { lr: number; name: string; c: Highlighter; ws: number[] }[] = [
  { lr: 0.01, name: "小さすぎ", c: "sky", ws: walk(0.01, 10) },
  { lr: 0.1, name: "ちょうどいい", c: "mint", ws: walk(0.1, 10) },
  { lr: 0.3, name: "大きすぎ", c: "pink", ws: walk(0.3, 10) },
];
export const RUN_LOSS = RUNS.map((r) => r.ws.map(lossA));

export const ch22: ChapterSpec = {
  id: 22,
  part: 2,
  title: "歩幅を決める：学習率",
  core: false,
  hook: "山を下りるとき、一歩をどれくらいの大きさにすればよいのでしょう？",
  steps: [
    { id: "s1", sec: 11, narration: "第21章では、一歩の大きさは「学習率 × 傾き」でした。学習率（learning rate）は、どれだけ大またで歩くかを決める歩幅です。" },
    { id: "s2", sec: 9, narration: "学習率が小さすぎると（0.01）、カメのようにのろのろ。5歩進んでも、まだ山の中腹です。" },
    { id: "s3", sec: 8, narration: "ちょうどよければ（0.1）、数歩で谷底に着きます。第21章で見たのと同じ歩き方です。" },
    { id: "s4", sec: 11, narration: "大きすぎると（0.3）、谷底を通りこして反対側へはね返ります。はね返るたびに高く上がり、損失がかえって大きくなります。" },
    { id: "s5", sec: 9, narration: "一歩ごとの損失をグラフにすると、ちがいがはっきり見えます。ゆっくり下がる、ストンと落ちる、はね上がる。" },
    { id: "s6", sec: 11, narration: "だから学習率は慎重に選びます。GPT-3も、最初は学習率を少しずつ上げ、学習しながらだんだん下げていきました。" },
    { id: "s7", sec: 9, narration: "小さすぎるとカメ、大きすぎるとはね返る。ちょうどいい歩幅が大切です。もっと賢い歩き方は第67章で学びます。" },
  ],
  playgroundTitle: "歩幅の実験室",
  playgroundIntro: "学習率を決めて「10歩進む」を押してみましょう。ボールが谷でどう動くか、損失がどう変わるかを見てみましょう。",
  summary: [
    "学習率 = 一歩の歩幅。新しいつまみ = つまみ − 学習率 × 傾き。",
    "小さすぎるとカメのように遅く、大きすぎると谷底を通りこしてはね返る。",
    "ちょうどいい学習率なら、すぐ谷底に着く。学習中に下げていくこともある。",
  ],
  unlocks: "学習率",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "学習中に損失がどんどん大きくなっています。いちばん疑わしいのは？",
      choices: ["学習率が大きすぎる", "学習率が小さすぎる", "データが少なすぎる"],
      answer: 0,
      explain: "歩幅が大きすぎると、谷底を通りこして反対側のもっと高いところへはね返ります。損失が大きくなります。",
      review: "s4",
    },
    {
      q: "学習率が小さすぎると、何が起きるでしょう？",
      choices: ["損失が爆発する", "損失がとてもゆっくり減る", "損失がすぐ0になる"],
      answer: 1,
      explain: "向きは合っていても一歩が小さすぎるので、谷底まで、とてもたくさんの歩数が必要です。",
      review: "s2",
    },
    {
      q: "w = 1、傾き = −4 のとき、学習率0.3なら新しいwは？",
      choices: ["1.4", "0.7", "2.2"],
      answer: 2,
      explain: "1 − 0.3 × (−4) = 1 + 1.2 = 2.2です。谷底（1.5）を大きく通りこしました。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第22章 歩幅を決める：学習率",
    rule: "新しいw = w − 学習率 × 傾き",
    stride: "学習率 = 歩幅",
    axisW: "w（待ちの重み）",
    axisL: "損失",
    small: "学習率 0.01",
    good: "学習率 0.1",
    big: "学習率 0.3",
    turtle: "カメ…まだ中腹",
    arrive: "数歩で谷底！",
    bounce: "どんどん高くはね返る",
    out: "次はグラフの外へ！",
    chart: "一歩ごとの損失",
    step: "歩",
    slow: "ゆっくり",
    fast: "ストン",
    up: "急上昇",
    schedTitle: "学習率にも計画がある",
    warm: "最初は上げて",
    decay: "だんだん下げる",
    lrAxis: "学習率",
    timeAxis: "学習の進み",
    sketch: "説明用の図",
    sum1: "小さすぎ：カメ",
    sum2: "大きすぎ：はね返る",
    sum3: "ちょうどいい：すぐ谷底",
    next: "もっと賢い歩き方：第67章 Adam",
    example: "A店 · 説明用の例",
  },
};
