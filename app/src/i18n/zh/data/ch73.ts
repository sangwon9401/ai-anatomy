import type { ChapterSpec } from "../../../data/types";

export type Demo = { q: string; a: string };

// Demonstrations people write (scene, s2). Contents are examples, not taken from a real dataset.
export const DEMOS: Demo[] = [
  { q: "翻译成英语：谢谢", a: "Thank you." },
  { q: "3 × 4 等于几？", a: "等于 12。" },
  { q: "以“秋天”为题写一句诗", a: "落叶像一封封信，轻轻落在午后" },
  { q: "光合作用是什么？", a: "就是植物利用阳光制造养分。" },
];

// s3: one demonstration as a strip of pieces; the answer pieces are what the model practises predicting
// "到底是什么？" is wide enough that the answer starts on the second row, under which the scene writes its "↑ 猜下一个片段" note
export const STRIP_Q = ["问：", "光合作用", "到底是什么？", "答："];
export const STRIP_A = ["植物", "利用", "阳光", "制造", "养分", "。"];

// s4: a few of the model's numbers before and after fine-tuning (illustrative)
export const WEIGHTS_BEFORE = [0.42, -1.07, 0.88, 0.15, -0.33, 1.26, -0.71, 0.04, 0.59, -0.2, 0.97, -0.48, 0.31, -0.86, 0.12, 0.67, -0.05, 0.74, -1.12, 0.26];
export const WEIGHTS_AFTER = [0.43, -1.07, 0.86, 0.15, -0.31, 1.26, -0.72, 0.05, 0.59, -0.2, 0.98, -0.48, 0.3, -0.86, 0.12, 0.69, -0.05, 0.74, -1.1, 0.26];

/** Playground: three sets of model answers written in different voices, and what a fine-tuned model then says. */
export type Style = { key: string; name: string; demos: Demo[] };
export const STYLES: Style[] = [
  {
    key: "kind",
    name: "亲切的老师",
    demos: [
      { q: "3 × 4 等于几？", a: "等于 12！就是 3 加了 4 次。" },
      { q: "“谢谢”用英语怎么说？", a: "Thank you！朋友之间也常说 Thanks。" },
      { q: "离地球最近的恒星是哪颗？", a: "是太阳！除了太阳，离我们最近的恒星是比邻星。" },
    ],
  },
  {
    key: "short",
    name: "一句话说完",
    demos: [
      { q: "3 × 4 等于几？", a: "12。" },
      { q: "“谢谢”用英语怎么说？", a: "Thank you." },
      { q: "离地球最近的恒星是哪颗？", a: "太阳。" },
    ],
  },
  {
    key: "joseon",
    name: "古代书生腔",
    demos: [
      { q: "3 × 4 等于几？", a: "十二也。三者，四度相加之理也。" },
      { q: "“谢谢”用英语怎么说？", a: "曰“Thank you”是也。" },
      { q: "离地球最近的恒星是哪颗？", a: "日也。次之者，比邻星也。" },
    ],
  },
];

export type TestQ = { q: string; base: string; replies: Record<string, string> };
export const TESTS: TestQ[] = [
  {
    q: "天空为什么是蓝色的？",
    base: "大海为什么是蓝色的？晚霞为什么是红色的？云为什么是白色的？",
    replies: {
      kind: "好问题！阳光穿过空气时，蓝光被散射得更多，所以天空看起来是蓝的。",
      short: "蓝光散射得更多。",
      joseon: "日光过空气之时，蓝光散之尤多，故天色青也。",
    },
  },
  {
    q: "水在多少度沸腾？",
    base: "冰在多少度融化？水在多少度结冰？",
    replies: {
      kind: "一般在 100 度沸腾。在高山上，水在更低的温度就会沸腾。",
      short: "一般 100 度。",
      joseon: "常时百度而沸。高山之上，则不及百度矣。",
    },
  },
];

export const ch73: ChapterSpec = {
  id: 73,
  part: 8,
  title: "照着标准答案学",
  core: true,
  hook: "不听话的模型，怎样教它“回答问题”？",
  steps: [
    { id: "s1", sec: 7, narration: "办法出奇地简单：由人亲手写好问题和示范答案，拿给模型看。" },
    { id: "s2", sec: 8, narration: "翻译、计算、写诗、讲解……每个问题都写一个亲切又准确的回答。这样的例子要收集非常多。" },
    { id: "s3", sec: 9, narration: "学习方法和 Part 7 一样，还是猜下一个片段。只是教科书从网络文字换成了示范答案。" },
    { id: "s4", sec: 9, narration: "模型本来就很聪明，所以只要把数字稍微修整一下。用示范答案这样修整，叫作监督微调（SFT）。" },
    { id: "s5", sec: 7, narration: "效果惊人。同样的问题，它现在不再接着写问题，而是好好回答了。" },
    { id: "s6", sec: 8, narration: "第一次见的问题也能回答。它不是背下了答案，而是学会了“问题后面接回答”的样子和语气。" },
    { id: "s7", sec: 8, narration: "可是写示范答案又累又费时间。于是人们找到了更轻松的办法。下一章来看。" },
  ],
  playgroundTitle: "教它说话的语气",
  playgroundIntro: "选一组示范答案来做微调。然后问它一个没见过的问题，看看模型模仿了什么。",
  summary: [
    "SFT：用人写的问题和示范答案，让模型再稍微学习一下。",
    "学习方法和预训练一样是猜下一个片段，只是换了教科书。",
    "模型不背答案，而是模仿回答的样子和语气。",
  ],
  unlocks: "SFT（监督微调）",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "在 SFT 里，模型学习用的教科书是什么？",
      choices: ["人亲手写的问题和示范答案", "从网上随便收集的文字", "模型自己写的文字"],
      answer: 0,
      explain: "由人给每个问题写好示范答案拿给它看。学习方法还是猜下一个片段。",
      review: "s3",
    },
    {
      q: "做完 SFT 的模型，为什么第一次见的问题也能回答？",
      choices: ["因为背下了世界上所有的问题和答案", "因为一收到问题就上网搜索", "因为学会了“问题后面接回答”的样子"],
      answer: 2,
      explain: "它不是一个个背答案，而是学会了回答的样子和语气。",
      review: "s6",
    },
    {
      q: "如果示范答案全都用“古代书生腔”来写，微调后的模型会怎样？",
      choices: ["语气不变，只学内容", "遇到没见过的问题，也用书生腔回答", "不理会示范答案"],
      answer: 1,
      explain: "模型不光学内容，连语气和长短都会模仿。所以由谁、怎样写示范答案非常重要。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第 73 章 照着标准答案学",
    byHand: "由人亲手写",
    qHead: "问题",
    aHead: "示范答案",
    q1: "光合作用是什么？",
    a1: "就是植物吸收阳光，用水和二氧化碳制造养分。这个过程还会放出氧气。",
    many: "× 非常多",
    eachQ: "每个问题配一个示范答案",
    sample: "* 内容是示例",
    guess: "猜下一个片段",
    same: "学习方法和 Part 7 一样",
    book: "教科书",
    oldBook: "网络文字",
    newBook: "示范答案",
    arrow: "→",
    numbers: "模型里的数字（示意数据）",
    tweak: "只稍微修整",
    sft: "SFT",
    sftKo: "监督微调",
    sftEn: "Supervised Fine-Tuning",
    ask: "中国的首都是哪里？",
    before: "SFT 之前（第 72 章）",
    after: "SFT 之后",
    beforeOut: "日本的首都是哪里？韩国的首都是哪里？",
    afterOut: "中国的首都是北京。",
    newQ: "帮我的猫起个名字吧",
    newA: "叫“咪咪”“核桃”“芝士”怎么样？看看它的毛色和性格再挑，会更合适。",
    neverSeen: "从没见过的问题！",
    shape: "没背答案，学的是“问题 → 回答”的样子",
    hard: "写起来又累又费时间",
    write: "写示范答案",
    pick: "有没有更轻松的办法？",
    next: "第 74 章",
  },
};
