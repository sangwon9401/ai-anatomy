import type { ChapterSpec } from "../../../data/types";

// A made-up bumpy loss landscape (説明用の例): a wide valley at x = 7 with a small dip near x = 2.7.
const A = 1.6;
const C = 2.6;
const SD = 0.4;
export const X_MIN = 0;
export const X_MAX = 10;
export const bumpy = (x: number) => 0.12 * (x - 7) ** 2 - A * Math.exp(-((x - C) ** 2) / (2 * SD * SD));
export const slope = (x: number) => 0.24 * (x - 7) + ((A * (x - C)) / (SD * SD)) * Math.exp(-((x - C) ** 2) / (2 * SD * SD));

/** Heavy-ball descent: v ← β·v − lr·傾き, x ← x + v. β = 0 is plain gradient descent (第21章). */
export function roll(x0: number, beta: number, steps: number, lr = 0.05): number[] {
  const xs = [x0];
  let x = x0;
  let v = 0;
  for (let i = 0; i < steps; i++) {
    v = beta * v - lr * slope(x);
    x = Math.min(X_MAX, Math.max(X_MIN, x + v));
    xs.push(x);
  }
  return xs;
}

export const START_X = 0.4;
export const MOMENTUM = 0.85;
export const PLAIN_PATH = roll(START_X, 0, 160);
export const MOMENTUM_PATH = roll(START_X, MOMENTUM, 160);

// A long, narrow valley: knob A is gentle, knob B is steep (説明用の例).
export const VA = 0.4;
export const VB = 18;
export const valley = (x: number, y: number) => 0.5 * (VA * x * x + VB * y * y);
const grad2 = ([x, y]: [number, number]): [number, number] => [VA * x, VB * y];
export const START_2D: [number, number] = [-3.6, 1.2];

/** Plain steps: every knob moves by learning rate × its slope. */
export function plain2D(steps: number, lr = 0.1): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  for (let i = 0; i < steps; i++) {
    const g = grad2(p);
    p = [p[0] - lr * g[0], p[1] - lr * g[1]];
    out.push(p);
  }
  return out;
}

/** Self-adjusting steps: each knob's step is divided by how big its slopes have been lately. */
export function adaptive2D(steps: number, lr = 0.3, decay = 0.9): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  let v: [number, number] = [0, 0];
  for (let t = 1; t <= steps; t++) {
    const g = grad2(p);
    v = [decay * v[0] + (1 - decay) * g[0] ** 2, decay * v[1] + (1 - decay) * g[1] ** 2];
    const corr = 1 - decay ** t;
    p = [p[0] - (lr * g[0]) / (Math.sqrt(v[0] / corr) + 1e-8), p[1] - (lr * g[1]) / (Math.sqrt(v[1] / corr) + 1e-8)];
    out.push(p);
  }
  return out;
}

export const STEPS_2D = 30;
export const PLAIN_2D = plain2D(STEPS_2D);
export const ADAPT_2D = adaptive2D(STEPS_2D);

export const ch67: ChapterSpec = {
  id: 67,
  part: 7,
  title: "かしこい下り坂",
  core: false,
  hook: "傾きだけを見て下るボールは、どうして道に迷うのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "第21章では、ボールは足もとの傾きだけを見て下りました。でも本物の損失の地形は、こんなにでこぼこです。" },
    { id: "s2", sec: 10, narration: "傾きだけに従うボールは、小さなくぼみに落ちると止まります。くぼみの底は傾きが0で、もう行き先がないからです。" },
    { id: "s3", sec: 10, narration: "そこで勢い（慣性）をつけます。転がってきた勢いを覚えておき、その力で小さな丘を越えて、もっと深い谷まで行きます。" },
    { id: "s4", sec: 10, narration: "2つめの問題は歩幅です。つまみごとに傾きがちがうので、急な方向はあちこち跳ね、ゆるやかな方向はカメのように遅くなります。" },
    { id: "s5", sec: 10, narration: "そこで、つまみごとに歩幅を別々に調整します。大きくゆれていたつまみは少しずつ、あまり動かなかったつまみは大またで。" },
    { id: "s6", sec: 10, narration: "慣性と歩幅の自動調整を合わせた方法がAdamです。2014年に生まれ、GPTを学習させるときもAdamを使います。" },
    { id: "s7", sec: 10, narration: "本物の計算はもう少し複雑ですが、かなめはこの2つです。第66章の輪の④ 更新が、かしこくなったのです。" },
  ],
  playgroundTitle: "ボール転がし対決",
  playgroundIntro: "スタート地点と慣性の強さを決めて転がしてみましょう。青いボールは傾きだけ、ピンクのボールは慣性も使います。ピンクのボールを深い谷まで届けましょう。",
  summary: [
    "傾きだけに従うと、小さなくぼみに閉じこめられたり、急な方向でジグザグに跳ねたりする。",
    "慣性：転がってきた勢いを覚えて、小さな丘を越える。",
    "Adam = 慣性 + つまみごとの歩幅の自動調整。GPTの学習にも使う。",
  ],
  unlocks: "Adamオプティマイザー",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "傾きだけに従うボールが、小さなくぼみで止まってしまうのはなぜ？",
      choices: ["くぼみの底では傾きが0だから", "ボールが重すぎるから", "損失が0になるから"],
      answer: 0,
      explain: "傾きが0だと「こっちへ行け」という合図がありません。すぐとなりにもっと深い場所があっても気づけません。",
      review: "s2",
    },
    {
      q: "ボールに慣性をつけると、何がよくなる？",
      choices: ["傾きを計算しなくてよくなる", "転がってきた勢いで小さな丘を越えられる", "いつもスタート地点に戻ってくる"],
      answer: 1,
      explain: "これまで転がってきた向きと速さを覚えているので、傾きが0の場所も勢いで通り過ぎます。",
      review: "s3",
    },
    {
      q: "Adamを一言でまとめると？",
      choices: ["傾きを無視して好きな場所へ移動", "学習率を0にする", "慣性 + つまみごとの歩幅の自動調整"],
      answer: 2,
      explain: "Adamは、慣性と、つまみごとに別々に合わせる歩幅を組み合わせた方法です（2014年）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第67章 かしこい下り坂",
    axisX: "つまみの値 →",
    axisY: "↑ 損失",
    review: "第21章：足もとの傾きだけを見て下る",
    start: "スタート",
    plain: "傾きだけ",
    inertia: "慣性",
    stuck: "ここで止まる！",
    deeper: "もっと深い谷",
    flat: "傾き0",
    memory: "慣性 = 転がってきた勢いを覚える",
    over: "丘を越えた！",
    example: "説明用の例の地形",
    knobA: "つまみA（ゆるやか）",
    knobB: "つまみB（急）",
    knobAAxis: "つまみA（ゆるやか）→",
    knobBAxis: "↑ つまみB（急）",
    zigzag: "ジグザグ！",
    slow: "カメ…",
    adaptive: "歩幅の自動調整",
    same: "同じ30歩",
    adamEq: "Adam = 慣性 + 歩幅の自動調整",
    year: "2014 · Kingma, Ba",
    gptUses: "GPTの学習にもAdam",
    smaller: "小",
    bigger: "大",
    update: "④ 更新",
    smarter: "④ 更新がかしこくなった",
    simple: "本物の計算はもっと複雑。ここではかなめだけ！",
    loop1: "① 予測",
    loop2: "② 損失",
    loop3: "③ 逆伝播",
    adam: "Adam",
    goal: "谷底",
  },
};
