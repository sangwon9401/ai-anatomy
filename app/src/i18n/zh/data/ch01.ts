import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Candidate = { w: string; p: number; c: Highlighter | null };

// Illustrative probabilities (labelled as such in the scene), not measured from a real model.
export const ROUND1: Candidate[] = [
  { w: "学校", p: 0.52, c: "yellow" },
  { w: "图书馆", p: 0.21, c: "mint" },
  { w: "公园", p: 0.12, c: "sky" },
  { w: "超市", p: 0.09, c: "violet" },
  { w: "披萨", p: 0.01, c: "pink" },
  { w: "其他", p: 0.05, c: null },
];

export const ROUND2: Candidate[] = [
  { w: "。", p: 0.58, c: "yellow" },
  { w: "了", p: 0.14, c: "mint" },
  { w: "，", p: 0.11, c: "sky" },
  { w: "！", p: 0.07, c: "violet" },
  { w: "其他", p: 0.1, c: null },
];

export const EXAMPLES = [
  { q: "中国的首都是", a: "北京", tag: "知识" },
  { q: "1, 3, 5, 7,", a: "9", tag: "规律" },
  { q: "下雨了，我把伞", a: "撑开", tag: "常识" },
];

export type GameRound = { sentence: string; options: { w: string; p: number }[] };

export const GAME_ROUNDS: GameRound[] = [
  {
    sentence: "中国的首都是",
    options: [
      { w: "上海", p: 0.02 },
      { w: "北京", p: 0.92 },
      { w: "哪里", p: 0.03 },
      { w: "南京", p: 0.02 },
    ],
  },
  {
    sentence: "1, 3, 5, 7,",
    options: [
      { w: "8", p: 0.04 },
      { w: "9", p: 0.88 },
      { w: "10", p: 0.02 },
      { w: "11", p: 0.03 },
    ],
  },
  {
    sentence: "下雨了，我把伞",
    options: [
      { w: "吃了", p: 0.001 },
      { w: "买了", p: 0.07 },
      { w: "撑开", p: 0.71 },
      { w: "带上", p: 0.18 },
    ],
  },
];

export const ch01: ChapterSpec = {
  id: 1,
  part: 0,
  title: "猜下一个词游戏",
  core: true,
  hook: "ChatGPT 听完问题，是一下子就想好整个回答的吗？",
  steps: [
    { id: "s1", sec: 5, narration: "这里有半句话：“我今天去”。后面会接什么词呢？" },
    { id: "s2", sec: 6, narration: "候选词有很多：学校、图书馆、公园……虽然很怪，但也可能是“披萨”。" },
    { id: "s3", sec: 7, narration: "ChatGPT 会给每个候选词算出一个数字，表示它接在后面的可能性。这就是概率。" },
    { id: "s4", sec: 6, narration: "选出最有可能的“学校”，填进空格。" },
    { id: "s5", sec: 8, narration: "然后从头再来！看着变长的句子，再预测下一个词。这次选中的是句号。" },
    { id: "s6", sec: 7, narration: "ChatGPT 做的事就这么多：把下一个词猜得非常准，然后不断重复。" },
    { id: "s7", sec: 8, narration: "不过，想猜准下一个词，得懂知识、懂规律，还得有常识。这些能力从哪儿来，就是后面要讲的故事。" },
  ],
  playgroundTitle: "猜猜看！下一个词",
  playgroundIntro: "选一选空格里该填什么词。选完后，会和模型算出的概率比一比。",
  summary: [
    "ChatGPT 会计算下一个词出现的概率。",
    "选出最有可能的词接上去，再接着预测。",
    "只靠这样不断重复，就能写出很长的回答。",
  ],
  unlocks: "生成循环",
  quiz: [
    {
      q: "ChatGPT 写文字时，一直在重复做的是什么？",
      choices: ["一下子想好整句话", "计算下一个词的概率，然后选一个", "上网找相似的文章复制过来"],
      answer: 1,
      explain: "一次一小段，算好概率再选。",
      review: "s3",
    },
    {
      q: "选出来的词接下来会怎样？",
      choices: ["被扔掉", "接到句子后面，成为下一次预测的输入", "先存起来，最后一起显示"],
      answer: 1,
      explain: "接上去，再预测。靠这样重复，就写出了长长的文字。",
      review: "s5",
    },
    {
      q: "想猜准“1, 3, 5, 7, ___”，需要什么？",
      choices: ["看出数字之间规律的能力", "总挑最长数字的习惯", "一张写着答案的表"],
      answer: 0,
      explain: "要猜准下一个词，规律、知识、常识都少不了。所以光是练习预测，模型就会变聪明。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 1 章 猜下一个词游戏",
    example: "概率为示意数据",
    loop: "接上，再预测！",
    stmtTop: "ChatGPT 做的事",
    stmtMain: "猜下一个词",
    stmtLoop: "× 不断重复",
    stmtNote: "真的就这么多",
    token: "* 准确地说，是以“词元”为单位来预测（第 29 章）",
    words: "我 今天 去 学校",
  },
};
