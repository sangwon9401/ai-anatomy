import type { ChapterSpec } from "../../../data/types";

// A toy feed-forward layer, 4 → 16 → 4 (the same 4× widening as GPT-3's 12,288 → 49,152 → 12,288).
// All numbers are 示意数据; the scene and the playground compute from these same weights.

export const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));

/** each word's vector after attention (示意数据) */
export const FFN_WORDS: { w: string; x: number[] }[] = [
  { w: "我", x: [1.2, 0.1, -0.3, -0.5] },
  { w: "今天", x: [-0.2, 1.3, 0.2, -0.1] },
  { w: "去", x: [-0.3, 0.2, 1.1, 1.0] },
];

export const W1 = [
  [0.3, -0.6, -0.1, -0.6], [0.4, 0, 0, -0.5], [1.4, -0.4, -0.4, -0.4], [-0.3, 0.1, -0.4, -0.6],
  [0.3, 0, 0.4, 0.5], [-0.2, 0.3, -0.3, 0.2], [0, 0.5, 0.1, -0.7], [-0.4, 1.4, -0.3, -0.3],
  [0.5, -0.3, 0.6, 0.4], [-0.1, 0.3, -0.5, -0.2], [0.3, -0.7, -0.7, 0], [0.5, 0.1, 0.3, 0.4],
  [-0.4, -0.3, 1, 1], [0.1, 0.1, -0.6, -0.2], [0, 0.5, -0.1, -0.1], [0, 0.1, 0.4, 0.5],
];
export const B1 = [-0.3, -0.2, -0.3, -0.3, -0.3, -0.2, -0.4, -0.3, -0.4, -0.3, -0.3, -0.4, -0.3, -0.3, -0.1, -0.1];
export const W2 = [
  [0, 0.4, 0.2, 0, -0.2, 0, 0.1, -0.1, -0.1, 0.3, -0.3, 0.5, 0.1, 0.3, 0.3, -0.4],
  [-0.1, -0.3, -0.1, 0.3, 0.1, 0.5, 0.5, 0.4, 0.1, 0.4, 0.5, 0.3, 0, 0.1, 0.4, -0.1],
  [0.1, -0.4, 0, 0, -0.2, 0.4, -0.5, 0.1, -0.4, -0.1, 0.4, -0.5, 0.3, -0.4, -0.2, 0.5],
  [0, -0.3, 0.3, -0.3, 0.1, 0.1, 0.3, 0.2, 0.3, -0.4, -0.3, -0.4, 0.8, 0.2, 0.1, 0.2],
];

/** Neurons with a (made-up) name tag; the rest are hard to name, as in real models.
 * Inner quotes are ‘ ’ because the playground wraps these names in “ ”. */
export const NEURON_NAMES: Record<number, string> = {
  2: "像‘我’这样指人的词",
  7: "表示时间的词",
  12: "‘去’这类动作 → 后面该接地点了",
};

export function ffn(x: number[], bend = true) {
  const pre = W1.map((w, i) => w.reduce((a, wk, k) => a + wk * x[k], B1[i]));
  const h = bend ? pre.map(gelu) : pre;
  const y = W2.map((w) => w.reduce((a, wj, j) => a + wj * h[j], 0));
  return { pre, h, y, out: x.map((v, k) => v + y[k]) };
}

// GPT-3 sizes: d = 12,288, the wide layer is 4d. Per layer: attention 4·d², feed-forward 8·d² weights.
export const D = 12288;
export const FFN_PARAMS = 8 * D * D * 96; // 115,964,116,992 ≈ 1160 亿
export const ATT_PARAMS = 4 * D * D * 96; // 57,982,058,496 ≈ 580 亿

export const ch55: ChapterSpec = {
  id: 55,
  part: 6,
  title: "会思考的层",
  core: true,
  hook: "通过注意力，词与词分享了信息。接下来，每个词要做什么？",
  steps: [
    { id: "s1", sec: 8, narration: "通过注意力，词与词已经混合了彼此的意思。现在轮到模块的第二个部件：前馈网络。" },
    { id: "s2", sec: 9, narration: "前馈网络是每个词单独通过的一个小神经网络（第 18 章）。所有的词都用同一台机器。" },
    { id: "s3", sec: 10, narration: "在里面，4 个数字先变宽 4 倍成 16 个，再缩回 4 个。宽的那层用 GELU 拐个弯（第 17 章）。" },
    { id: "s4", sec: 9, narration: "宽层里的每个神经元，各自对某种模式有反应。假设这个神经元一看到“去”这类动作就会亮。" },
    { id: "s5", sec: 8.5, narration: "亮起来的神经元给出的结果，加回原来的向量。就这样，每个词都添上了知识。" },
    { id: "s6", sec: 10.5, narration: "在 GPT-3 里，12,288 个数字先变宽成 49,152 个，再回到 12,288 个。同样是 4 倍。" },
    { id: "s7", sec: 9, narration: "GPT-3 的 1750 亿个数字里，约三分之二在前馈网络。可以说它是存放知识的仓库。" },
    { id: "s8", sec: 8.5, narration: "注意力是词与词对话，前馈网络是每个词自己思考。设计图上的前馈网络填好了！" },
  ],
  playgroundTitle: "看看会思考的层",
  playgroundIntro: "选一个词放进前馈网络。点一点神经元，看看宽层里哪些神经元亮了。",
  summary: [
    "前馈网络：每个词单独通过的小神经网络。所有的词都用同一台机器。",
    "先变宽 4 倍（用 GELU 拐弯），再缩回来。GPT-3：12,288 → 49,152 → 12,288。",
    "结果加回原来的向量，给词添上知识。模型约三分之二的数字都在这里。",
  ],
  unlocks: "前馈网络",
  quiz: [
    {
      q: "前馈网络是怎样处理各个词的？",
      choices: ["每个词单独处理，都用同一台机器", "把所有的词混在一起", "只处理最后一个词"],
      answer: 0,
      explain: "把词与词混合起来是注意力的工作。前馈网络让每个词单独通过同一台机器，里面的数字也相同。",
      review: "s2",
    },
    {
      q: "在 GPT-3 的前馈网络里，12,288 个数字会变宽成多少个？",
      choices: ["24,576 个", "49,152 个", "96 个"],
      answer: 1,
      explain: "12,288 × 4 = 49,152。变宽之后，再回到 12,288 个。",
      review: "s6",
    },
    {
      q: "为什么要在宽层里用 GELU 把数字拐个弯？",
      choices: ["为了把数字变成概率", "为了告诉模型词的顺序", "为了做到一条直线做不到的事"],
      answer: 2,
      explain: "如果不拐弯，整台机器就只是一个像直线一样的函数。拐了弯，才能抓住复杂的模式（第 17 章）。",
      review: "s3",
    },
  ],
  labels: {
    tag: "第 55 章 会思考的层",
    here: "这一章的主角",
    same: "同一台机器（数字也一样）",
    alone: "词与词不混合",
    ffn: "前馈网络",
    inside: "前馈网络内部",
    four: "4 个数字",
    wide: "16 个（变宽 4 倍）",
    back: "回到 4 个",
    gelu: "用 GELU 拐弯",
    tagN: "“去”这类动作 → 后面该接地点了",
    toy: "示意数据",
    orig: "原来的向量",
    thought: "+ 思考的结果",
    result: "= 新向量",
    knowledge: "添上了知识！",
    real: "真正的 GPT-3 里",
    n1: "12,288",
    n2: "49,152",
    times: "× 4",
    total: "GPT-3 的 1750 亿个数字",
    ffnPart: "前馈网络 约 1160 亿",
    attPart: "注意力 约 580 亿",
    twoThirds: "约三分之二",
    store: "知识的仓库",
    filled: "填好了！",
    talk: "注意力 = 词与词对话",
    think: "前馈网络 = 每个词自己思考",
    w1: "我",
    w2: "今天",
    w3: "去",
  },
};
