import type { ChapterSpec } from "../../../data/types";

/** the first layer of 18章: two ReLU neurons on 辣度 (示意数据) */
export const FOLD_AT = 3;
export const FOLD_TABLE = [1, 2, 3, 4, 5].map((m) => {
  const h1 = Math.max(0, m - FOLD_AT);
  const h2 = Math.max(0, FOLD_AT - m);
  return { m, h1, h2, d: h1 + h2 };
});

export const ch18: ChapterSpec = {
  id: 18,
  part: 2,
  title: "把层叠起来",
  core: false,
  hook: "一个神经元解决不了的问题，多凑几个神经元能解决吗？",
  steps: [
    { id: "s1", sec: 8, narration: "第 17 章的 V 字形边界怎么做？一个神经元只能画直线，所以把好几个神经元并排放，组成一层。" },
    { id: "s2", sec: 9, narration: "第一层放两个神经元：一个算“辣度 − 3”，一个算“3 − 辣度”，再都用 ReLU 把负数折成 0。" },
    { id: "s3", sec: 8, narration: "两个值加起来，就是“离 3 级有多远”。1 级和 5 级都是 2，2 级和 4 级都是 1。" },
    { id: "s4", sec: 8, narration: "放到平面上看，就像沿着 3 级那条线把纸对折。左边的点翻到右边，叠在了一起。" },
    { id: "s5", sec: 8, narration: "在折好的纸上，V 字被拉成了直线。现在下一层的一个神经元，用一条直线就能干净地分开。" },
    { id: "s6", sec: 8, narration: "层叠得越多，就能折了再折。折两次是 W 字，折很多次，就能做出非常复杂的边界。" },
    { id: "s7", sec: 9, narration: "像这样一层层叠起来的神经网络，叫作多层感知机（MLP）。GPT-⁠3 每层要用 49152 个这样的神经元。" },
  ],
  playgroundTitle: "折纸神经网络",
  playgroundIntro: "定好折线的位置，再拖动“折叠”滑块。如果在折好的纸上用一条直线就能把 13 家店全部分对，就成功了。",
  summary: [
    "好几个神经元并排 = 一层。好几层接起来 = 多层感知机（MLP）。",
    "两个 ReLU 神经元能把空间“折”起来，一折，V 字就变成直线。",
    "层越深，就能折了又折，做出越复杂的边界。",
  ],
  unlocks: "叠层（MLP）",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "辣度为 5 时，ReLU(辣度 − 3) 和 ReLU(3 − 辣度) 分别是多少？",
      choices: ["2 和 0", "2 和 −2", "0 和 2"],
      answer: 0,
      explain: "5 − 3 = 2 是正数，原样输出 2；3 − 5 = −2 是负数，ReLU 把它变成 0。",
      review: "s2",
    },
    {
      q: "第一层沿着 3 级的线把平面“折”起来，好处是什么？",
      choices: ["点变少了", "V 字边界变成直线，一个神经元就能分开", "好吃的店都消失了"],
      answer: 1,
      explain: "在折好的纸上，V 字的两条臂叠成了一条直线。下一层的神经元只要画直线就行。",
      review: "s5",
    },
    {
      q: "GPT-3 的一层里有多少个这样的神经元？（前馈网络，第 55 章）",
      choices: ["12 个", "约 1000 个", "49152 个"],
      answer: 2,
      explain: "GPT-3 每层用 49152 个神经元，是词向量 12288 格的 4 倍。这样的层一共有 96 个。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 18 章 把层叠起来",
    q1: "V 字边界怎么做？",
    q2: "一个神经元 = 一条直线",
    spicy: "辣度",
    line: "排队",
    example: "示意数据",
    layer1: "第一层",
    n1: "辣度 − 3",
    n2: "3 − 辣度",
    relu: "ReLU",
    h1: "h1 太辣",
    h2: "h2 不够辣",
    sumRow: "h1 + h2",
    far: "离 3 级有多远",
    fold: "沿着 3 级的线对折",
    folded: "一折，V 字变直线！",
    layer2: "下一层一个神经元就够了",
    farAxis: "离 3 级有多远",
    once: "折 1 次",
    twice: "折 2 次",
    many: "折很多次",
    deeper: "层越深，边界越复杂",
    mlp: "多层感知机（MLP）",
    input: "输入",
    hidden: "层",
    output: "输出",
    gpt: "GPT-3：每层 49152 个神经元 × 96 层",
    ffn: "第 55 章前馈网络里再见",
  },
};
