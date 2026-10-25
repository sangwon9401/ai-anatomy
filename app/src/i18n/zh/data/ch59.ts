import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "../../../data/types";

export const SENT = ["我", "今天", "去", "学校"];

/** The words a model may look at when guessing SENT[target]. */
export function visible(mode: "bert" | "gpt", target: number) {
  return SENT.map((_, i) => i).filter((i) => (mode === "bert" ? i !== target : i < target));
}

/** A sentence about a (mode, target) pair for the playground. */
export function explain(mode: "bert" | "gpt", target: number) {
  const seen = visible(mode, target).map((i) => `“${SENT[i]}”`);
  if (mode === "bert" && target === 2) return "前面的“我 今天”和后面的“学校”都能看到。后面是“学校”，填“吃”就说不通了。两边都看，填空就容易多了。";
  if (mode === "gpt" && target === 2) return "只能看到“我 今天”。“去”“吃”“看”……好多词都说得通，所以要按概率来选（第 1 章）。";
  if (mode === "gpt" && target === 3) return "看着“我 今天 去”，猜下一个词。这就是我们一直在看的那道题。学校 52%！";
  if (mode === "gpt" && target === 0) return "第一个词前面没有词可看。所以对 GPT 来说，第一个词最难猜。";
  if (mode === "bert") return `除了被遮住的词，其他的全都能看到：${seen.join("、")}。`;
  return `只看前面的 ${seen.join("、")} 来猜。后面的词被帘子挡住了（第 51 章）。`;
}

export const ch59: ChapterSpec = {
  id: 59,
  part: 6,
  title: "编码器 vs 解码器",
  core: false,
  hook: "ChatGPT 里的“GPT”和谷歌的“BERT”都是 Transformer，它们有什么不同？",
  steps: [
    { id: "s1", sec: 9.5, narration: "2017 年最早的 Transformer 是个翻译器，由读原文的编码器和写译文的解码器组成（第 44 章）。" },
    { id: "s2", sec: 9, narration: "2018 年，出现了只用其中一半的模型：只叠编码器的 BERT，和只叠解码器的 GPT。" },
    { id: "s3", sec: 9, narration: "BERT 从两边看整个句子。它把中间的词遮住，再靠前后的词来练习填空。" },
    { id: "s4", sec: 9, narration: "GPT 只看前面的词。它用第 51 章的帘子挡住未来，练习猜下一个词。" },
    { id: "s5", sec: 9, narration: "用注意力表格来看：BERT 所有的格子都打开，GPT 只打开对角线和它下面的三角形。" },
    { id: "s6", sec: 8.5, narration: "所以 BERT 擅长理解句子，GPT 擅长一个词一个词地往下写。" },
    { id: "s7", sec: 9.5, narration: "ChatGPT 就是只叠解码器模块的 GPT。我们从第 54 章开始组装的，正是这种解码器模块。" },
  ],
  playgroundTitle: "填空 vs 下一个词",
  playgroundIntro: "在 BERT 和 GPT 里选一个，再点一个要猜的词。猜这个词时能看到哪些词，两者不一样。",
  summary: [
    "最早的 Transformer（2017）是编码器 + 解码器组成的翻译器。",
    "BERT = 只叠编码器：两边都看，练习填空。擅长理解句子。",
    "GPT = 只叠解码器：只看前面（帘子），练习猜下一个词。擅长接着往下写。ChatGPT 也属于这一边。",
  ],
  unlocks: "解码器模块",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "BERT 练习的是什么题？",
      choices: ["靠前后的词，猜出被遮住的空", "猜下一个词", "翻译句子"],
      answer: 0,
      explain: "BERT 遮住句子中间的词，看着两边的词来填空。猜下一个词是 GPT 的练习。",
      review: "s3",
    },
    {
      q: "在 GPT 的注意力表格里，哪些格子是打开的？",
      choices: ["所有格子", "对角线和它下面的三角形", "对角线上面的三角形"],
      answer: 1,
      explain: "每个词只能看到自己和前面的词。未来的格子被帘子挡住（第 51 章）。",
      review: "s5",
    },
    {
      q: "一个词一个词往下写文章，适合用哪一种？",
      choices: ["BERT（编码器）", "两个一样", "GPT（解码器）"],
      answer: 2,
      explain: "GPT 学的就是只看前面的词、猜下一个词，正好适合一个一个往下接（第 2 章）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 59 章 编码器 vs 解码器",
    y2017: "2017 年的 Transformer = 翻译器",
    src: "I go to school today",
    dst: "我今天去学校",
    enc: "编码器",
    dec: "解码器",
    encDo: "读原文的一方",
    decDo: "写译文的一方",
    x6: "× 6 层",
    bert: "BERT",
    gpt: "GPT",
    bertBy: "2018，谷歌",
    gptBy: "2018，OpenAI",
    encOnly: "只叠编码器",
    decOnly: "只叠解码器",
    blank: "?",
    both: "两边都看",
    front: "只看前面",
    fill: "填空",
    next: "猜下一个词",
    mask: "帘子（第 51 章）",
    future: "未来",
    rows: "横行：在看的词",
    cols: "竖列：被看到的词",
    understand: "理解句子",
    understandEx: "搜索、句子分类",
    write: "接着往下写",
    writeEx: "对话、写作",
    decoderBlock: "GPT 的模块 = 解码器模块",
    chatgpt: "ChatGPT 也是这种模块！",
    masked: "带帘子（第 51 章）",
    w1: "我",
    w2: "今天",
    w3: "去",
    w4: "学校",
  },
};
