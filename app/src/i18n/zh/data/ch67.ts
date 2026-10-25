import type { ChapterSpec } from "../../../data/types";

// A made-up bumpy loss landscape (示意数据): a wide valley at x = 7 with a small dip near x = 2.7.
const A = 1.6;
const C = 2.6;
const SD = 0.4;
export const X_MIN = 0;
export const X_MAX = 10;
export const bumpy = (x: number) => 0.12 * (x - 7) ** 2 - A * Math.exp(-((x - C) ** 2) / (2 * SD * SD));
export const slope = (x: number) => 0.24 * (x - 7) + ((A * (x - C)) / (SD * SD)) * Math.exp(-((x - C) ** 2) / (2 * SD * SD));

/** Heavy-ball descent: v ← β·v − lr·坡度, x ← x + v. β = 0 is plain gradient descent (第 21 章). */
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

// A long, narrow valley: knob A is gentle, knob B is steep (示意数据).
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
  title: "更聪明的下坡",
  core: false,
  hook: "只看坡度往下走的球，为什么会迷路？",
  steps: [
    { id: "s1", sec: 9, narration: "在第 21 章，球只看脚下的坡度往下走。可真正的损失地形，是这样坑坑洼洼的。" },
    { id: "s2", sec: 10, narration: "只跟着坡度走的球，掉进小水坑就停住了。因为坑底的坡度是 0，再也没有路可走。" },
    { id: "s3", sec: 10, narration: "所以给它加上惯性。记住滚过来的那股劲，靠它冲过小山坡，一直滚到更深的山谷。" },
    { id: "s4", sec: 10, narration: "第二个问题是步子。每个旋钮的坡度都不一样：陡的那边来回乱跳，缓的那边像乌龟一样慢。" },
    { id: "s5", sec: 10, narration: "所以给每个旋钮单独调步子。晃得厉害的旋钮一点点挪，几乎不动的旋钮就大步走。" },
    { id: "s6", sec: 10, narration: "把惯性和自动调步子合在一起的方法，叫作 Adam。它在 2014 年提出，训练 GPT 时用的也是 Adam。" },
    { id: "s7", sec: 10, narration: "实际的计算还要复杂一些，但核心就是这两点。第 66 章循环里的 ④ 更新，变得更聪明了。" },
  ],
  playgroundTitle: "滚球大比拼",
  playgroundIntro: "定好出发点和惯性的大小，然后让球滚起来。蓝球只看坡度，粉球还带着惯性。试着让粉球滚进深谷。",
  summary: [
    "只跟着坡度走，会困在小水坑里，或者在陡的方向上之字形乱跳。",
    "惯性：记住滚过来的那股劲，冲过小山坡。",
    "Adam = 惯性 + 每个旋钮自动调步子。训练 GPT 也用它。",
  ],
  unlocks: "Adam 优化器",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "只跟着坡度走的球，为什么会停在小水坑里？",
      choices: ["因为坑底的坡度是 0", "因为球太重了", "因为损失变成了 0"],
      answer: 0,
      explain: "坡度是 0，就没有“往这边走”的信号了。旁边就算有更深的地方，它也不知道。",
      review: "s2",
    },
    {
      q: "给球加上惯性，有什么好处？",
      choices: ["不用再计算坡度了", "能靠滚过来的劲冲过小山坡", "总会回到出发点"],
      answer: 1,
      explain: "它记得之前滚动的方向和速度，所以坡度为 0 的地方也能靠惯性冲过去。",
      review: "s3",
    },
    {
      q: "用一句话概括 Adam？",
      choices: ["不管坡度，随便乱走", "把学习率变成 0", "惯性 + 每个旋钮自动调步子"],
      answer: 2,
      explain: "Adam 把惯性和每个旋钮各自调整的步子结合在一起（2014 年）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 67 章 更聪明的下坡",
    axisX: "旋钮的值 →",
    axisY: "↑ 损失",
    review: "第 21 章：只看脚下的坡度往下走",
    start: "出发",
    plain: "只看坡度",
    inertia: "惯性",
    stuck: "停在这里了！",
    deeper: "更深的山谷",
    flat: "坡度 0",
    memory: "惯性 = 记住滚过来的劲",
    over: "冲过山坡了！",
    example: "示意用的地形",
    knobA: "旋钮 A（平缓）",
    knobB: "旋钮 B（陡峭）",
    knobAAxis: "旋钮 A（平缓）→",
    knobBAxis: "↑ 旋钮 B（陡峭）",
    zigzag: "之字形！",
    slow: "乌龟爬……",
    adaptive: "自动调步子",
    same: "都走 30 步",
    adamEq: "Adam = 惯性 + 自动调步子",
    year: "2014 · Kingma, Ba",
    gptUses: "训练 GPT 也用 Adam",
    smaller: "小步",
    bigger: "大步",
    update: "④ 更新",
    smarter: "④ 更新变聪明了",
    simple: "实际计算更复杂，这里只讲核心！",
    loop1: "① 预测",
    loop2: "② 损失",
    loop3: "③ 反向传播",
    adam: "Adam",
    goal: "最低的地方",
  },
};
