import type { ChapterSpec } from "../../../data/types";

export const END = "〈完〉";

export const QUESTION = ["天空", "为什么", "是蓝色的？"];
export const ANSWER = ["因为", "阳光", "穿过", "空气时，", "蓝光", "被散射", "得更多", "。"];
export const MISTAKE = {
  question: ["中国的", "首都是？"],
  answer: ["是", "上海", "。", "啊，", "我说错了", "。", "是", "北京", "。"],
  wrong: 1,
  fix: 3,
};
// Two continuations of the same prefix, picked by chance (illustrative probabilities).
export const BRANCH = {
  prefix: ["阳光"],
  a: { p: 0.48, words: ["穿过", "空气时，", "…"] },
  b: { p: 0.31, words: ["碰到", "空气中的小颗粒", "…"] },
};

/** Toy next-piece table for the playground: the next piece depends only on the last one. */
export const STORY_START = "很久很久以前，";
export const STORY: Record<string, { w: string; p: number }[]> = {
  "很久很久以前，": [
    { w: "老虎", p: 0.5 },
    { w: "有个小", p: 0.3 },
    { w: "公主", p: 0.2 },
  ],
  有个小: [
    { w: "村子，", p: 0.6 },
    { w: "兔子", p: 0.4 },
  ],
  "村子，": [
    { w: "老虎", p: 0.4 },
    { w: "兔子", p: 0.35 },
    { w: "公主", p: 0.25 },
  ],
  老虎: [
    { w: "过得很开心。", p: 0.55 },
    { w: "把年糕", p: 0.3 },
    { w: "出现了。", p: 0.15 },
  ],
  兔子: [
    { w: "过得很开心。", p: 0.5 },
    { w: "把年糕", p: 0.5 },
  ],
  公主: [
    { w: "过得很开心。", p: 0.6 },
    { w: "唱了", p: 0.4 },
  ],
  把年糕: [
    { w: "吃了。", p: 0.6 },
    { w: "卖了。", p: 0.4 },
  ],
  唱了: [{ w: "一首歌。", p: 1 }],
  "过得很开心。": [
    { w: END, p: 0.45 },
    { w: "可是，", p: 0.55 },
  ],
  "吃了。": [
    { w: END, p: 0.5 },
    { w: "可是，", p: 0.5 },
  ],
  "卖了。": [
    { w: END, p: 0.5 },
    { w: "可是，", p: 0.5 },
  ],
  "出现了。": [
    { w: END, p: 0.3 },
    { w: "可是，", p: 0.7 },
  ],
  "一首歌。": [
    { w: END, p: 0.5 },
    { w: "可是，", p: 0.5 },
  ],
  "可是，": [
    { w: "老虎", p: 0.4 },
    { w: "兔子", p: 0.35 },
    { w: "公主", p: 0.25 },
  ],
};
export const STORY_MAX = 14;

export const ch02: ChapterSpec = {
  id: 2,
  part: 0,
  title: "一个词一个词往下写的 AI",
  core: true,
  hook: "ChatGPT 的回答，为什么像打字一样一段一段冒出来？",
  steps: [
    { id: "s1", sec: 6, narration: "发出问题后，回答是一段一段冒出来的。这不是为了好看，而是它真的在一段一段地生成。" },
    { id: "s2", sec: 7, narration: "看看机器内部：问题加上目前写好的回答，也就是整段文字，送进模型，就会出来下一个片段。" },
    { id: "s3", sec: 9, narration: "出来的片段接到文字末尾，变长的文字再送回模型。这种读着自己写的内容往下写的方式，叫作自回归。" },
    { id: "s4", sec: 7, narration: "那什么时候停呢？抽到一个表示“到此结束”的特殊片段时就停。它叫作结束词元。" },
    { id: "s5", sec: 7, narration: "回答有 9 个片段，就要运行模型 9 次；100 个片段就是 100 次。所以回答越长，花的时间越久。" },
    { id: "s6", sec: 8, narration: "而且，已经接上的片段不会删掉。前面说错了，改正的话也只能接着往后写。" },
    { id: "s7", sec: 7, narration: "同一个问题，每次的回答都略有不同，是因为片段是按概率抽出来的。第 81 章会详细讲。" },
  ],
  playgroundTitle: "一段一段编故事",
  playgroundIntro: "你来当模型，选出下一个片段。点“按概率抽”，就会按照概率抽出一个。",
  summary: [
    "把整段文字送进去，就会出来下一个片段。",
    "把出来的片段接上，再送进去，直到出现结束词元。",
    "有几个片段就运行几次模型，接上的片段不会删掉。",
  ],
  unlocks: "结束词元",
  quiz: [
    {
      q: "回答一段一段冒出来，真正的原因是什么？",
      choices: ["为了好看，故意慢慢显示", "每生成一个片段，都要运行一次模型", "网速太慢"],
      answer: 1,
      explain: "一个片段 = 运行一次模型。生成一段就马上显示一段。",
      review: "s2",
    },
    {
      q: "ChatGPT 什么时候停止写作？",
      choices: ["写到和问题一样长时", "抽到表示“结束”的特殊片段时", "只有用户叫停时"],
      answer: 1,
      explain: "结束词元也和其他片段一样按概率抽，一被抽中就停。",
      review: "s4",
    },
    {
      q: "如果前面接上了一个错误的片段，会怎样？",
      choices: ["马上删掉重写", "删不掉，想改正只能接着往后写", "从头重写"],
      answer: 1,
      explain: "生成只会往后接，所以改正也要靠接着写。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 2 章 一个词一个词往下写的 AI",
    model: "模型",
    soFar: "目前为止的文字",
    next: "下一个片段",
    loop: "接上，再来！",
    round: "次",
    end: "出现结束词元就停",
    stop: "停！",
    count: "9 个片段 = 模型运行 9 次",
    hundred: "100 个片段就是 100 次",
    longer: "越长越慢",
    noErase: "接上了就删不掉",
    fixLater: "改正也只能接着写",
    sample: "按概率抽（第 81 章）",
    auto: "自回归",
    really: "真的是一段一段写的！",
  },
};
