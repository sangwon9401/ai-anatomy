import type { ChapterSpec } from "../../../data/types";

export const UNLOCK6 = "又拿到一个组装部件";

/** What breaks when a kind of part is pulled out of the block (第 54 章 playground). */
export const MISSING = {
  att: "词与词看不见彼此。一个词有好几种意思时，没法靠前面的词判断是哪一种。（第 45 章）",
  ffn: "每个词没有地方单独思考了。模型学到的知识，大部分都存在这里。（第 55 章）",
  add: "每过一层，原来的信息就被覆盖一次。叠得越深，越会忘掉最初的句子。（第 56 章）",
  norm: "越往后层，数字的大小越忽大忽小，计算就不稳了。（第 57 章）",
};

export const ch54: ChapterSpec = {
  id: 54,
  part: 6,
  title: "Transformer 模块设计图",
  core: false,
  hook: "第 5 章设计图正中间的“Transformer 模块”，打开来看，里面装着什么？",
  steps: [
    { id: "s1", sec: 9.5, narration: "我们把第 5 章设计图的正中间放大：Transformer 模块。GPT 就是把这种模块叠了很多层的机器。" },
    { id: "s2", sec: 8, narration: "有几个词，就有几个向量进入模块。出来的向量个数一样，大小也一样。" },
    { id: "s3", sec: 8, narration: "第一个部件是注意力。词与词互相看，把意思混合起来。第 45 章学过。" },
    { id: "s4", sec: 8, narration: "第二个是前馈网络，给每个词单独加上“思考”。下一章再打开细看。" },
    { id: "s5", sec: 9, narration: "部件算出的结果，要加回原来的向量。原信息笔直穿过的这条路，叫作高速公路。" },
    { id: "s6", sec: 8, narration: "进入部件之前，先用归一化统一数字的大小。就是第 15 章学过的那个方法。" },
    { id: "s7", sec: 10, narration: "总结一下：归一化 → 注意力 → 相加，归一化 → 前馈网络 → 相加。这就是模块的一层。" },
    { id: "s8", sec: 9, narration: "进去什么形状，出来还是什么形状，所以模块可以一直往上叠。GPT-3 叠了 96 层。" },
  ],
  playgroundTitle: "拆掉一个部件",
  playgroundIntro: "点一下模块里的部件，把它拆下来。看看哪里出了问题，就知道每个部件是干什么的。",
  summary: [
    "模块的一层 = 归一化 → 注意力 → 相加，归一化 → 前馈网络 → 相加。",
    "注意力让词与词互相混合，前馈网络让每个词各自思考。结果都加回原来的向量。",
    "进去什么形状，出来还是什么形状，所以可以一直叠。GPT-3 有 96 层。",
  ],
  unlocks: "模块设计图",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "在模块里，让词与词互相看、混合意思的部件是哪个？",
      choices: ["前馈网络", "注意力", "归一化"],
      answer: 1,
      explain: "注意力让词与词互相交换信息（第 45 章）。前馈网络是每个词各自思考。",
      review: "s3",
    },
    {
      q: "下面哪一个是模块一层里的正确顺序？",
      choices: ["归一化 → 注意力 → 相加", "注意力 → Softmax → 归一化", "相加 → 归一化 → 注意力"],
      answer: 0,
      explain: "先在部件前统一大小（归一化），再经过部件，最后把结果加回原来的向量。前馈网络也是同样的顺序。",
      review: "s7",
    },
    {
      q: "模块为什么能叠到 96 层？",
      choices: ["因为每过一层，词就变少", "因为每层的部件种类都不同", "因为进去什么形状，出来还是什么形状"],
      answer: 2,
      explain: "词的个数、向量的大小都不变，所以可以原样送进下一个模块。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 54 章 Transformer 模块设计图",
    w1: "我",
    w2: "今天",
    w3: "去",
    empty: "待填",
    open: "打开这里看看！",
    inNote: "3 个词 = 3 个向量",
    inSize: "（GPT-3：每个词 12,288 个数字）",
    outNote: "个数一样，大小也一样！",
    att: "互相看",
    ffn: "各自思考",
    add: "守住原信息",
    norm: "统一大小",
    road: "高速公路",
    arrow: "→",
    oneLayer: "= 模块的一层",
    layers: "× 96 层",
    gpt3: "（GPT-3）",
    stack: "可以一直叠下去",
  },
};
