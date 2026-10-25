import { UNLOCK6 } from "./ch54";
import { stats } from "../../../data/ch15";
import type { ChapterSpec } from "../../../data/types";

// 示意数据. A word vector early on, and the same word much later: same shape, 4× the size.
export const EARLY = [3, 17, 9, 11]; // mean 10, spread 5
export const LATE = [12, 68, 36, 44]; // mean 40, spread 20

/** s5: every word normalised with its own numbers */
export const ROWS: { w: string; v: number[] }[] = [
  { w: "我", v: [2.7, 1.9, 1.3, 2.1] },
  { w: "今天", v: [-3, 1, 1, -3] },
  { w: "去", v: EARLY },
];

/** s6: the learned scale and shift (示意数据) */
export const GAIN = [1.5, 0.5, 2.0, 1.0];
export const SHIFT = [0, 0.3, 0, -0.2];

/** s1: one vector drifting bigger through the layers (示意数据) */
export const GROW_STRIP = [0.9, -0.6, 0.4, 1.1, -0.9, 0.3, -0.4, 0.7];
export const GROW = [
  { layer: 1, k: 1 },
  { layer: 24, k: 2 },
  { layer: 48, k: 3.2 },
  { layer: 96, k: 5 },
];

/** Layer normalisation of one vector: subtract its mean, divide by its spread (第 15 章), then scale and shift. */
export function layerNorm(v: number[], gain: number[] | number = 1, shift: number[] | number = 0) {
  const { mean, sd } = stats(v);
  const z = v.map((x) => (x - mean) / sd);
  const g = (i: number) => (typeof gain === "number" ? gain : gain[i]);
  const b = (i: number) => (typeof shift === "number" ? shift : shift[i]);
  return { mean, sd, z, out: z.map((x, i) => x * g(i) + b(i)) };
}

/** playground: the three words' vectors after `layer` layers (示意数据; they grow at different rates and drift a little) */
export function wordsAt(layer: number) {
  return ROWS.map((r, wi) => {
    const k = 1 + (layer - 1) * [0.03, 0.05, 0.04][wi];
    return { w: r.w, v: r.v.map((x, i) => x * k + Math.sin(layer * 0.21 + i * 1.7 + wi) * 0.04 * layer) };
  });
}

export const ch57: ChapterSpec = {
  id: 57,
  part: 6,
  title: "稳住波动",
  core: false,
  hook: "结果一直往上加，到了第 96 层，数字会不会变得特别大？",
  steps: [
    { id: "s1", sec: 8.5, narration: "第 56 章说过，结果会一直加上去。一层层加下来，向量里的数字就越来越大。" },
    { id: "s2", sec: 10, narration: "同样是“去”，每一层的大小却差这么多，部件每次都得换一把尺子来算。计算就不稳了。" },
    { id: "s3", sec: 9.5, narration: "所以在送进部件之前，先做第 15 章的归一化。用一个词向量自己的数字，求出平均值和分散程度。" },
    { id: "s4", sec: 9.5, narration: "减去平均值 10，再除以分散程度 5，就得到这些数。变大 4 倍的向量，结果也一模一样。" },
    { id: "s5", sec: 9.5, narration: "这个计算每个词各做各的。每个词只用自己的 12,288 个数字，求平均值和分散程度。" },
    { id: "s6", sec: 9.5, narration: "最后，每个数字再乘一个倍率、加一个值。这两个值靠训练决定，由模型自己挑出合适的大小。" },
    { id: "s7", sec: 9.5, narration: "GPT 在每次进入注意力和前馈网络之前都做归一化。高速公路上原来的值则保持不动。" },
  ],
  playgroundTitle: "统一大小实验",
  playgroundIntro: "把层数滑块往上拉，让词向量变大。打开层归一化，看看送进部件的数字有什么变化。",
  summary: [
    "一层层加上结果，向量里的数字会变大，而且忽大忽小。",
    "层归一化：每个词用自己的数字，减去平均值，再除以分散程度（第 15 章）。然后乘倍率、加偏移。",
    "GPT 在每次进入注意力和前馈网络之前，都要做一次归一化。",
  ],
  unlocks: "层归一化",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "把词向量 [3, 17, 9, 11] 归一化时，要减去的数是多少？",
      choices: ["平均值 10", "最大值 17", "最小值 3"],
      answer: 0,
      explain: "(3 + 17 + 9 + 11) ÷ 4 = 10。先减去平均值，再除以分散程度 5。",
      review: "s3",
    },
    {
      q: "层归一化的平均值和分散程度，是用什么算出来的？",
      choices: ["所有词同一位置上的数字", "一个词自己的数字", "全部训练数据"],
      answer: 1,
      explain: "每个词各算各的，只用自己向量里的数字。在 GPT-3 里就是自己的 12,288 个数字。",
      review: "s5",
    },
    {
      q: "在 GPT 里，层归一化放在哪里？",
      choices: ["只在最前面的分词器之前", "只在 Softmax 之后", "每次进入注意力和前馈网络之前"],
      answer: 2,
      explain: "每个模块里做两次，都在送进部件之前统一大小。高速公路上的值不去动它。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 57 章 稳住波动",
    layer: " 层",
    grow: "层数越深，数字越大",
    fine: "合适的大小",
    toy: "示意数据",
    early: "第 3 层的“去”",
    late: "第 90 层的“去”",
    same: "形状一样，大小却是 4 倍！",
    shaky: "部件每次都换一把尺子 → 不稳",
    mean: "平均值",
    // U+2060 (word joiner) keeps 程度 together when the narrow note in s3 wraps: 分散 / 程度 5
    spread: "分散程\u2060度",
    step1: "① 减去平均值",
    step2: "② 除以分散程度",
    ch15: "（第 15 章）",
    equal: "一模一样！",
    title: "层归一化",
    en: "(layer normalization)",
    own: "每个词各算各的，只用自己的数字",
    real: "（GPT-3：每个词 12,288 个）",
    z: "归一化后的值",
    gain: "× 倍率",
    shift: "+ 偏移",
    out: "= 送进部件的值",
    learned: "倍率和偏移靠训练决定",
    before: "进入部件之前",
    keepRoad: "高速公路上的值不变",
    arrow: "→",
    w1: "我",
    w2: "今天",
    w3: "去",
  },
};
