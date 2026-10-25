import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Part = {
  key: string;
  name: string;
  does: string;
  where: string;
  color: Highlighter;
  /** filled once the student has finished chapters 1–4 */
  filled?: boolean;
};

// The GPT blueprint, top to bottom. The two block parts repeat N times (GPT-3: 96 layers).
export const PIPELINE: Part[] = [
  { key: "tok", name: "分词器", does: "把文字切成片段（词元）", where: "第 29 章", color: "sky" },
  { key: "emb", name: "嵌入", does: "把片段变成带有意义的数字", where: "第 33 章", color: "sky" },
  { key: "pos", name: "位置信息", does: "告诉模型这是第几个片段", where: "第 36 章", color: "sky" },
  { key: "att", name: "注意力", does: "片段之间互相看，把意思混在一起", where: "第45章", color: "yellow" },
  { key: "ffn", name: "前馈网络", does: "给每个片段加上“思考”", where: "第55章", color: "yellow" },
  { key: "out", name: "输出 + Softmax", does: "算出下一个片段的概率", where: "第 60、14 章", color: "mint" },
  { key: "loop", name: "抽取并接上", does: "抽一个接到文字末尾，再来一遍", where: "第 1、2 章", color: "mint", filled: true },
];

export const TRAINING = [
  { name: "训练数据", does: "互联网上的海量文字", where: "第 4、63 章", filled: true },
  { name: "预训练", does: "练习猜下一个片段，错多少就改多少数字", where: "Part 2、7" },
  { name: "对话练习", does: "模仿示范答案 + 人的夸奖", where: "第 73、76 章" },
];

export const ch05: ChapterSpec = {
  id: 5,
  part: 0,
  title: "我们要组装的设计图",
  core: true,
  hook: "打开 ChatGPT 这台机器，里面到底装着什么？",
  steps: [
    { id: "s1", sec: 6, narration: "把前面的内容总结一下：ChatGPT 是一台猜下一个片段的机器。现在该把它拆开看看了。" },
    { id: "s2", sec: 8, narration: "最前面有三个零件：把文字切成片段的分词器、把片段变成数字的嵌入，还有告诉模型第几个片段的位置信息。" },
    { id: "s3", sec: 8, narration: "中间是 Transformer 块。片段之间互相看的注意力，加上添加“思考”的前馈网络，组成一套，叠了几十层。" },
    { id: "s4", sec: 7, narration: "最后用 Softmax 算出下一个片段的概率，抽一个接到末尾。然后再回到最上面。" },
    { id: "s5", sec: 8, narration: "可是零件里的数字一开始乱七八糟。要用海量文字练习猜下一个片段，一点点改数字。这就是预训练。" },
    { id: "s6", sec: 7, narration: "最后，再靠示范答案和人的夸奖学会怎么对话。这样就成了 ChatGPT。" },
    { id: "s7", sec: 8, narration: "接下来，我们会一个 Part 一个 Part 地填满这张设计图。目前已经填好了“抽取并接上”和“训练数据”。出发吧！" },
  ],
  playgroundTitle: "组装设计图",
  playgroundIntro: "按照文字穿过机器的顺序，依次点零件。第一个零件负责把文字切成片段。",
  summary: [
    "分词器 → 嵌入 + 位置 → [注意力 + 前馈网络] × 几十层 → Softmax → 抽取并接上。",
    "一开始乱七八糟的数字，要靠预训练改好。",
    "再用示范答案和人的评价学会对话，就成了 ChatGPT。",
  ],
  unlocks: "GPT 设计图",
  unlockLabel: "拿到设计图了",
  quiz: [
    {
      q: "把文字切成片段的零件是哪个？",
      choices: ["嵌入", "分词器", "Softmax"],
      answer: 1,
      explain: "分词器把文字切成词元，嵌入再把词元变成数字。",
      review: "s2",
    },
    {
      q: "一套 Transformer 块里有哪两样东西？",
      choices: ["注意力和前馈网络", "分词器和嵌入", "Softmax 和抽取"],
      answer: 0,
      explain: "注意力 + 前馈网络算一层，这样的层要叠几十次。",
      review: "s3",
    },
    {
      q: "预训练时，模型在练习什么？",
      choices: ["猜下一个片段", "认人脸", "背语法规则"],
      answer: 0,
      explain: "用海量文字练习猜下一个片段，一边练一边改数字。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 5 章 我们要组装的设计图",
    input: "我 今天 去",
    output: "学校",
    gpt: "GPT",
    chatgpt: "ChatGPT",
    block: "Transformer 块",
    layers: "× 几十层（GPT-3 有 96 层）",
    again: "回到顶部",
    pretrain: "预训练",
    chat: "对话练习",
    mess: "一开始数字乱七八糟",
    numbers: "把 1750 亿个数字一点点改好",
    filled: "已填好",
    empty: "空位",
    go: "出发！",
    web: "互联网上的海量文字",
    practice: "练习猜下一个片段",
    fix: "错多少，就改多少数字",
    sft: "模仿示范答案",
    rlhf: "人的夸奖",
    ch73: "第 73 章",
    ch76: "第 76 章",
    data: "训练数据",
    blockLayers: "× 几十层",
    gpt3: "GPT-3 有 96 层",
  },
};
