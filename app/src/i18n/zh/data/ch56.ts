import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "../../../data/types";

/** s1: the telephone game (传话游戏), each line one more person down the chain; changed characters come from GARBLE. */
export const PHONE = ["我今天去学校。", "我明天去学校。", "你明天去学校。", "你明天去雪糕？", "他每天吃雪糕？"];

/** character swaps in the order they happen (the playground garbles the sentence the same way).
 * Every swap keeps the length, so the scene and the playground can mark changed characters position by position. */
export const GARBLE: [string, string][] = [
  ["今", "明"],
  ["我", "你"],
  ["。", "？"],
  ["学", "雪"],
  ["校", "糕"],
  ["去", "吃"],
  ["明", "每"],
  ["你", "他"],
];

export function garble(sentence: string, k: number) {
  let s = sentence;
  for (const [a, b] of GARBLE.slice(0, k)) s = s.replace(a, b);
  return s;
}

/** s2: one vector replaced layer after layer (示意数据) */
export const DRIFT = [
  [2.0, 1.0, -1.0, 3.0],
  [2.5, -0.5, 0.5, 2.9],
  [2.4, -1.4, 1.4, 2.3],
  [2.0, -2.1, 2.1, 1.5],
  [1.6, -2.4, 2.4, 0.8],
];

/** s4: x + f(x) (示意数据) */
export const RES_X = [2.0, 1.0, -1.0, 3.0];
export const RES_F = [0.3, -0.2, 0.5, 0.1];

export const cosine = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b);

// ---- playground: a toy 8-number vector through up to 48 layers ----
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(3);
const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
export const TOY_D = 8;
export const TOY_X0 = [1.5, -0.8, 0.6, 1.2, -1.4, 0.3, -0.5, 0.9];
const LAYERS = Array.from({ length: 48 }, () =>
  Array.from({ length: TOY_D }, (_, i) => Array.from({ length: TOY_D }, (_, k) => (i === k ? 0.7 : 0) + (gauss() * 0.7) / Math.sqrt(TOY_D))),
);
const part = (W: number[][], x: number[]) => W.map((r) => Math.tanh(r.reduce((s, w, k) => s + w * x[k], 0)));

/** Run n layers. Without the highway each layer replaces the vector (kept at the same size, so only the direction changes). */
export function runLayers(n: number, highway: boolean) {
  let x = TOY_X0;
  const size0 = Math.hypot(...TOY_X0);
  for (const W of LAYERS.slice(0, n)) {
    const f = part(W, x);
    if (highway) x = x.map((v, k) => v + 0.15 * f[k]);
    else {
      const s = Math.hypot(...f);
      x = f.map((v) => (v / s) * size0);
    }
  }
  return { x, keep: Math.max(0, cosine(x, TOY_X0)), size: Math.hypot(...x), size0 };
}

export const ch56: ChapterSpec = {
  id: 56,
  part: 6,
  title: "信息高速公路",
  core: false,
  hook: "经过 96 层之后，最初那句话的信息会不会全被抹掉？",
  steps: [
    { id: "s1", sec: 8.5, narration: "你玩过传话游戏吗？一句话经过的人越多，就变得越离谱。" },
    { id: "s2", sec: 9.5, narration: "层叠得很深时，也会发生同样的事。如果每层都把向量整个换掉，最初的信息就会越来越模糊。" },
    { id: "s3", sec: 10, narration: "所以模块不会把向量换掉，而是把部件算出的结果加到原来的向量上。也就是 x + f(x)。" },
    { id: "s4", sec: 9.5, narration: "原来的 x 原样保留，部件只补上需要修改的那一点点。所以最初的信息不会被抹掉。" },
    { id: "s5", sec: 10, narration: "画成图就是：原来的信息在高速公路上笔直前进，部件在旁边的小路上算好结果，再补进来。" },
    { id: "s6", sec: 10.5, narration: "训练时也有好处。“错了多少就改多少”的信号，能沿着高速公路一路传回最前面的层（第 23 章）。" },
    { id: "s7", sec: 9.5, narration: "这条把结果加回原值的路，叫作残差连接。部件只要负责“需要修改的差值”就行了。" },
  ],
  playgroundTitle: "开关高速公路",
  playgroundIntro: "把层数调多一些。比较一下：关掉高速公路（残差连接）时，最初的信息还剩多少；打开时又怎样。",
  summary: [
    "如果每层都把向量整个换掉，最初的信息会越来越模糊，就像传话游戏。",
    "残差连接：输出 = x + f(x)。原来的信息走高速公路，部件只补上需要修改的差值。",
    "修改信号也能沿着高速公路顺利传回前面的层，所以模型可以叠得很深。",
  ],
  unlocks: "残差连接",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "残差连接写成式子是什么？（x 是原来的向量，f 是部件）",
      choices: ["f(x)", "x + f(x)", "x × f(x)"],
      answer: 1,
      explain: "把部件的结果 f(x) 加到原来的向量 x 上。不是换掉（只留下 f(x)）。",
      review: "s3",
    },
    {
      q: "如果 x = [2, 1]，部件的结果 f(x) = [0.5, −0.5]，模块输出的是什么？",
      choices: ["[0.5, −0.5]", "[2, 1]", "[2.5, 0.5]"],
      answer: 2,
      explain: "x + f(x) = [2 + 0.5, 1 − 0.5] = [2.5, 0.5]。",
      review: "s4",
    },
    {
      q: "为什么有了残差连接，训练会变得更容易？",
      choices: ["修改信号能沿着高速公路顺利传回前面的层", "要算的数字变少了", "词的个数变少了"],
      answer: 0,
      explain: "如果要一个个穿过部件，信号会越来越弱；走高速公路就不会变弱（第 23 章 反向传播）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 56 章 信息高速公路",
    person: "号传话人",
    orig: "最初",
    layer: " 层",
    keep: "和最初的相似度",
    blur: "最初的信息越来越模糊",
    toy: "示意数据",
    swap: "换掉",
    add: "相加",
    x: "x",
    fx: "f(x)",
    xfx: "x + f(x)",
    xMeans: "x = 原来的向量",
    fMeans: "f(x) = 部件算出的结果",
    origVec: "原来的 x",
    plusF: "+ f(x)",
    out: "= 输出",
    stays: "x 原样保留着！",
    road: "高速公路",
    straight: "原信息直着走",
    side: "在小路上计算",
    plusNote: "⊕ 补上结果",
    lost: "x 不见了",
    w1: "我",
    w2: "今天",
    w3: "去",
    noRoad: "没有高速公路",
    withRoad: "有高速公路",
    part: "部件",
    weak: "越来越弱",
    strong: "原样传到！",
    signal: "↑ “错了多少就改多少”的信号",
    name: "残差连接",
    en: "(residual connection)",
    diff: "残差 = 剩下的差值：部件只管要改的差",
    deep: "多亏了它，96 层也叠得起来",
    resnet: "2015 年，图像识别模型 ResNet 就是用这个方法叠到了 152 层",
  },
};
