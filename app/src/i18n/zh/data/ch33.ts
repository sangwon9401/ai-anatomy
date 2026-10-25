import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V3 = [number, number, number];

// illustrative 3-number embeddings (示意数据), four themed clusters; nearest neighbours and label overlaps
// (for the scene's view angles) checked with a script. `side`/`dy` place the word label in the scene.
export const STARS: { w: string; v: V3; group: number; side?: "l"; dy?: number }[] = [
  { w: "小狗", v: [0.8, 0.7, -0.2], group: 0, side: "l" },
  { w: "小猫", v: [0.6, 0.9, 0.0], group: 0 },
  { w: "兔子", v: [0.35, 0.85, -0.55], group: 0, side: "l" },
  { w: "老虎", v: [1.0, 0.75, 0.2], group: 0 },
  { w: "苹果", v: [-0.7, 0.5, 0.5], group: 1, side: "l" },
  { w: "葡萄", v: [-0.95, 0.75, 0.55], group: 1, side: "l" },
  { w: "香蕉", v: [-0.5, 0.95, 0.75], group: 1 },
  { w: "草莓", v: [-0.8, 0.9, 0.2], group: 1, side: "l" },
  { w: "公交车", v: [0.1, -0.8, 0.5], group: 2, side: "l", dy: 10 },
  { w: "地铁", v: [0.5, -0.95, 0.3], group: 2 },
  { w: "自行车", v: [-0.15, -0.55, 0.85], group: 2, side: "l" },
  { w: "飞机", v: [0.45, -0.4, 0.95], group: 2 },
  { w: "学校", v: [-0.3, -0.4, -0.75], group: 3 },
  { w: "老师", v: [0.0, -0.15, -0.95], group: 3 },
  { w: "作业", v: [-0.6, -0.35, -0.6], group: 3, side: "l" },
  { w: "教室", v: [-0.35, -0.75, -0.9], group: 3 },
];
export const GROUPS: { name: string; c: Highlighter }[] = [
  { name: "动物", c: "yellow" },
  { name: "水果", c: "pink" },
  { name: "交通工具", c: "sky" },
  { name: "学校", c: "mint" },
];

export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** small seeded PRNG so the "before training" positions are the same everywhere */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(33);
export const RANDOM_START: V3[] = STARS.map(() => [rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9]);

/** Turn around the vertical axis by `yaw`, tilt by `pitch`; returns screen x, y and depth (−1 far … 1 near). */
export function project(v: V3, yaw: number, pitch: number) {
  const x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw);
  const z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  const y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return { x: x1, y: y2, z: z2 };
}

// GPT-3: 50,257 tokens × 12,288 numbers = 617,558,016
export const GPT3_TABLE = 50257 * 12288;

export const ch33: ChapterSpec = {
  id: 33,
  part: 3,
  title: "嵌入：意义的坐标",
  core: true,
  hook: "“小狗”和“小猫”很像，这件事要怎么用数字表示？",
  steps: [
    { id: "s1", sec: 9.5, narration: "不用独热编码，改给每个词一串短短的数字。小狗是 [0.8, 0.7, −0.2]。把词变成这样一串数字，就叫嵌入。", tts: "不用独热编码，改给每个词一串短短的数字。小狗是 0.8，0.7，负 0.2。把词变成这样一串数字，就叫嵌入。" },
    { id: "s2", sec: 7, narration: "有三个数字，就是三维空间里的一个点。词语像星座一样悬浮在空间里。" },
    { id: "s3", sec: 8, narration: "意思相近的词会聚在一起：动物和动物，水果和水果。就像把第 8 章的词语地图搬进了三维空间。" },
    { id: "s4", sec: 8.5, narration: "像不像，可以用点积来量（第 9 章）。小狗·小猫是 1.11，小狗·公交车是 −0.58。方向越一致，值越大。", tts: "像不像，可以用点积来量。小狗和小猫是 1.11，小狗和公交车是负 0.58。方向越一致，值越大。" },
    { id: "s5", sec: 8, narration: "模型里有一张嵌入表，一行对应一个词元。用词元编号找到那一行，取出来用就行。" },
    { id: "s6", sec: 8.5, narration: "一开始，表里的数字是随便填的。在练习猜下一个片段的过程中，相近的词慢慢找到了自己的位置。" },
    { id: "s7", sec: 8.5, narration: "真实的规模呢？GPT-3 每个词元有 12,288 个数字，大约 5 万行。光这张表就有 6 亿多个数字。" },
    { id: "s8", sec: 7.5, narration: "把词元变成意义坐标的嵌入，是设计图的第二个零件。下一章看看这些坐标是怎么获得意思的。" },
  ],
  playgroundTitle: "转动星座",
  playgroundIntro: "拖动来转动空间。点一颗星（词），就会显示它的三个数字和离它最近的词。用滑块比较训练前和训练后。",
  summary: [
    "嵌入：给每个词元一串短短的数字（向量）。这些数字就是坐标。",
    "意思相近的词放得近、方向也相近（距离见第 8 章，点积见第 9 章）。",
    "嵌入表里的数字是训练出来的。GPT-3 的表里有 6 亿多个数字。",
  ],
  unlocks: "嵌入",
  quiz: [
    {
      q: "嵌入是什么？",
      choices: ["给每个词元一串带着意思的短数字", "给词元编号", "把词按拼音排序"],
      answer: 0,
      explain: "它和编号（第 29 章）、独热编码（第 32 章）不同，是让相近的词得到相近数字的坐标。",
      review: "s1",
    },
    {
      q: "小狗 [0.8, 0.7, −0.2] 和小猫 [0.6, 0.9, 0] 的点积是？",
      choices: ["0", "1.11", "−0.58"],
      answer: 1,
      explain: "0.8×0.6 + 0.7×0.9 + (−0.2)×0 = 0.48 + 0.63 + 0 = 1.11。",
      review: "s4",
    },
    {
      q: "嵌入表里的数字是怎么定下来的？",
      choices: ["由人给每个词一个一个定", "按词典顺序定", "一开始随便填，在训练中慢慢修改"],
      answer: 2,
      explain: "在练习猜下一个片段时一点点修改。这样下去，相近的词就聚到了一起。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 33 章 嵌入：意义的坐标",
    dog: "小狗",
    dogVec: "[0.8, 0.7, −0.2]",
    emb: "嵌入 = 词 → 一串数字",
    oneHot: "独热编码：约 20 万格",
    short: "嵌入：几个数字",
    point: "3 个数字 = 三维空间里的一个点",
    constel: "词语星座",
    example: "示意数据（真实的有几千个数字）",
    near: "意思相近就靠得近",
    dotTitle: "用点积量相似度（第 9 章）",
    dot1: "小狗 · 小猫 = 1.11",
    dot2: "小狗 · 公交车 = −0.58",
    sameDir: "方向越一致，值越大",
    table: "嵌入表",
    rowNote: "一行 = 一个词元",
    lookup: "用词元编号取出一行",
    matmul: "独热 × 表 = 那一行（第 11 章矩阵乘法）",
    before: "训练前：随便放",
    after: "训练后：相近的聚在一起",
    real: "GPT-3 的嵌入表",
    rows: "50,257 行（词元）",
    cols: "12,288 列（数字）",
    total: "50,257 × 12,288 = 617,558,016",
    over: "超过 6 亿个数字！",
    bp: "设计图第二个零件完成！",
    empty: "空着",
    next: "下一章：坐标怎样获得意思？（第 34 章）",
    ax1: "第 1 格",
    ax2: "第 2 格",
    ax3: "第 3 格",
    id: "编号",
  },
};
