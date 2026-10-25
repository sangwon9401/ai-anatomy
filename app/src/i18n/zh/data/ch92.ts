import type { ChapterSpec } from "../../../data/types";

/** GPT-3 (canonical facts) next to the Part 11 mini GPT with the zh 谚语 data (computed from minigpt.ts / the zh bpe.ts). */
export const COMPARE = [
  { k: "layers", gpt3: "96", mini: "1" },
  { k: "width", gpt3: "12,288", mini: "32" },
  { k: "heads", gpt3: "96", mini: "1" },
  { k: "context", gpt3: "2,048", mini: "24" },
  { k: "vocab", gpt3: "50,257", mini: "506" },
];

export const PROJECT = [
  { n: "①", name: "挑选数据", ch: "第92章" },
  { n: "②", name: "做分词器", ch: "第93章" },
  { n: "③", name: "训练模型", ch: "第94章" },
  { n: "④", name: "写写句子", ch: "第95章" },
];

/** Real outputs of the zh offline checkpoints (temperature 1.0), none of them a line of the data. */
export const STYLES = [
  { name: "谚语", seen: "早起的鸟儿有虫吃", wrote: "早起的鸟先飞", color: "yellow" as const },
  { name: "童谣", seen: "小鸡小鸡叽叽叽，跟着妈妈去找米", wrote: "小鸡小鸡叽叽叽，跟着妈妈上山坡", color: "sky" as const },
  { name: "课本句子", seen: "勤洗手可以预防疾病。", wrote: "勤洗手可以保护环境。", color: "mint" as const },
];

/** Real next-token probabilities of the zh 谚语 checkpoint after "一人" (temperature 1). */
export const NEXT = [
  { w: "心", p: 33.6 },
  { w: "难", p: 20.8 },
  { w: "多", p: 10.3 },
];

export const ch92: ChapterSpec = {
  id: 92,
  part: 11,
  title: "设计迷你 GPT",
  core: false,
  hook: "把 ChatGPT 缩到非常小，我能亲手做一个吗？",
  steps: [
    { id: "s1", sec: 10, narration: "终于到毕业项目了。我们要用学过的部件做一个真正的小 GPT，并在自己的手机上亲手训练它。" },
    { id: "s2", sec: 9, narration: "一共四步：挑选数据，做分词器，训练模型，最后用它来写句子。" },
    { id: "s3", sec: 10.5, narration: "设计图和 GPT-3 一模一样（第 5 章）。只是块从 96 层变成 1 层，词元向量从 12,288 格变成 32 格。" },
    { id: "s4", sec: 11, narration: "注意力头只有 1 个，一次读 24 个词元。词元 506 种就够了，谚语里的字和标点差不多就这么多。" },
    { id: "s5", sec: 10.5, narration: "数一数旋钮（参数）：GPT-3 有 1750 亿个，迷你 GPT 有 30,106 个，大约是它的 580 万分之一。" },
    { id: "s6", sec: 10, narration: "但它做的事是一样的：读一段文字，给出下一个片段的概率。这是事先训练好的迷你 GPT 的真实回答。" },
    { id: "s7", sec: 10, narration: "读谚语就写谚语，读童谣就写歌词，读课本句子就写说明文。模型会变得像它读过的文字。" },
    { id: "s8", sec: 11, narration: "数据约 4KB，约 1,450 个词元，和 GPT-3 读的 3000 亿个比微不足道，但够用了。来挑一挑吧？" },
  ],
  playgroundTitle: "挑选数据",
  playgroundIntro: "选一份给迷你 GPT 读的文字。第 93～95 章会用这里选的数据来做分词器、训练模型、写句子。",
  summary: [
    "迷你 GPT 和 GPT-3 用的是同一张设计图，只是层数、向量格数、头数都很小。",
    "旋钮 30,106 个，大约是 GPT-3 的 580 万分之一。",
    "模型会变得像它读过的文字，所以第一步是挑选数据。",
  ],
  unlocks: "我的数据集",
  unlockLabel: "毕业项目又完成了一步",
  quiz: [
    {
      q: "把迷你 GPT 和 GPT-3 的设计图比一比，会发现？",
      choices: ["部件一样，只是数字大小不同", "结构完全不同", "迷你 GPT 没有注意力"],
      answer: 0,
      explain: "从分词器到 Softmax，部件都一样。只是层数、向量格数、头数小得多。",
      review: "s3",
    },
    {
      q: "迷你 GPT 大约有多少个旋钮（参数）？",
      choices: ["1750 亿个", "大约 3 万个", "96 个"],
      answer: 1,
      explain: "用谚语数据时是 30,106 个，大约是 GPT-3（1750 亿个）的 580 万分之一。",
      review: "s5",
    },
    {
      q: "只读童谣训练出来的模型，会写出什么样的文字？",
      choices: ["像课本那样的说明文", "什么也写不出来", "像歌词一样的文字"],
      answer: 2,
      explain: "模型会变得像它读过的文字。读了重复很多的童谣，写出来的也像歌词。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 92 章 设计迷你 GPT",
    title: "毕业项目",
    tok: "分词器",
    emb: "嵌入",
    pos: "位置信息",
    att: "注意力",
    ffn: "前馈网络",
    out: "输出 + Softmax",
    loop: "抽取并接上",
    mine: "我的迷你 GPT",
    real: "真的要训练！",
    ch96: "⑤ 毕业典礼 第 96 章",
    gpt3: "GPT-3",
    mini: "迷你 GPT",
    layers: "块的层数",
    width: "词元向量格数",
    heads: "注意力头",
    context: "一次读的词元数",
    vocab: "词元种类",
    same: "部件一样，只是数字变小",
    knobs: "旋钮（参数）个数",
    gpt3Knobs: "175,000,000,000",
    miniKnobs: "30,106",
    ratio: "约 580 万分之一",
    prompt: "一人",
    next: "下一个片段的概率",
    realOut: "事先训练好的迷你 GPT 的真实回答",
    seen: "读过的",
    wrote: "模型写的",
    alike: "像它读过的文字",
    noCopy: "三句都是数据里没有的新句子",
    size: "约 4KB · 约 1,450 个词元",
    gptData: "GPT-3：3000 亿个词元",
    dust: "聚沙成塔？",
    pick: "亲手挑一挑",
    lines120: "165 行",
    lines69: "94 行",
    lines82: "112 行",
    loss: "损失",
    vocabNote: "谚语里用到的字数",
  },
};
