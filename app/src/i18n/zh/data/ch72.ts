import type { ChapterSpec } from "../../../data/types";

// What the base model writes after the question in the scene (illustrative, labelled so).
export const CONTINUE = ["日本的首都是哪里？", "韩国的首都是哪里？", "法国的首都是哪里？"];
export const READ = ["新闻", "百科词条", "小说", "习题集", "论坛帖子", "菜谱"];
export const QLIKE = ["习题集", "问卷", "问题合集", "知识竞赛台本"];

/** Playground: the same question wrapped in different document starts. All continuations and chances are illustrative. */
export type Frame = { key: string; name: string; before: string; after: string };
export const FRAMES: Frame[] = [
  { key: "plain", name: "只写一个问题", before: "", after: "" },
  { key: "exam", name: "试卷的第一题", before: "[练习题]\n1. ", after: "" },
  { key: "qa", name: "问：… 答：", before: "问：", after: "\n答：" },
  { key: "script", name: "学生和老师的对话", before: "学生：", after: "\n老师：" },
];

export type Probe = {
  q: string;
  /** continuation per frame key, and the chance that the very next piece starts an answer */
  out: Record<string, { text: string; answer: number; isAnswer: boolean }>;
};

export const PROBES: Probe[] = [
  {
    q: "中国的首都是哪里？",
    out: {
      plain: { text: "\n日本的首都是哪里？\n韩国的首都是哪里？", answer: 0.08, isAnswer: false },
      exam: { text: "\n2. 日本的首都是哪里？\n3. 五星红旗上一共有几颗星？", answer: 0.03, isAnswer: false },
      qa: { text: "北京。", answer: 0.81, isAnswer: true },
      script: { text: "问得好。是北京。", answer: 0.74, isAnswer: true },
    },
  },
  {
    q: "水在多少度沸腾？",
    out: {
      plain: { text: "\n冰在多少度融化？\n水在多少度结冰？", answer: 0.1, isAnswer: false },
      exam: { text: "\n2. 冰融化的温度是多少度？\n3. 水沸腾时冒出的气泡是什么？", answer: 0.04, isAnswer: false },
      qa: { text: "通常在 100 度沸腾。", answer: 0.78, isAnswer: true },
      script: { text: "只要不是在高山上，水在 100 度沸腾。", answer: 0.7, isAnswer: true },
    },
  },
];

export const ch72: ChapterSpec = {
  id: 72,
  part: 8,
  title: "聪明却不听话的模型",
  core: true,
  hook: "读了海量网络文字的模型，你问它问题，它会马上回答吗？",
  steps: [
    { id: "s1", sec: 9, narration: "在 Part 7，有个模型用网络文字学完了“猜下一个片段”。它叫作基础模型（base model）。" },
    { id: "s2", sec: 8, narration: "我们来问问它：“中国的首都是哪里？”它当然会回答北京吧？" },
    { id: "s3", sec: 8, narration: "可它没有回答，反而接着写问题：日本的首都呢？韩国的首都呢？就像一份考题清单。" },
    { id: "s4", sec: 8, narration: "在模型眼里，这句话像是习题集的第一行。网上有大量“问题后面还是问题”的文字。" },
    { id: "s5", sec: 8, narration: "基础模型学会的只是“像模像样地往下写”（第 2 章）。它从没学过要回答问题。" },
    { id: "s6", sec: 8, narration: "于是人们想了个办法：用“问：… 答：”的样子开头，下一个片段是答案的概率就会大大提高。" },
    { id: "s7", sec: 9, narration: "可总不能每次都耍小聪明。把这个聪明却不听话的模型教得听话，就是 Part 8 要讲的故事。" },
  ],
  playgroundTitle: "换一换开头",
  playgroundIntro: "用不同样子的开头来包装同一个问题，看看基础模型会怎么往下写。找出能引出回答的两种开头。",
  summary: [
    "基础模型只用网络文字学过“猜下一个片段”。",
    "给它一个问题，它可能不回答，而是像习题集一样继续写问题。",
    "改变文字的样子能引出答案，但根本的办法是另外教它。",
  ],
  unlocks: "基础模型",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "只给基础模型写“中国的首都是哪里？”，为什么它可能接着写问题？",
      choices: ["因为模型不知道北京", "因为网上有很多“问题后面还是问题”的文字", "因为模型故意开玩笑"],
      answer: 1,
      explain: "基础模型只是像模像样地往下写。在习题集那样的文字里，问题后面接的还是问题。",
      review: "s4",
    },
    {
      q: "基础模型在预训练中真正练习的是什么？",
      choices: ["亲切地回答问题", "得到人的夸奖", "猜文字的下一个片段"],
      answer: 2,
      explain: "它只练习了猜下一个片段（第 2 章、Part 7），还没学过怎么回答。",
      review: "s5",
    },
    {
      q: "想从基础模型那里引出答案，开头怎样写比较好？",
      choices: ["写成“问：… 答：”的样子，把答案的位置空出来", "把问题重复三遍", "在问题末尾多加几个问号"],
      answer: 0,
      explain: "如果文字里留着答案的空位，下一个片段是答案就变得最顺理成章。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第 72 章 聪明却不听话的模型",
    model: "基础模型",
    modelEn: "base model",
    studied: "“猜下一个片段”学完了！（Part 7）",
    gpt3Read: "GPT-3 读了约 3000 亿个词元来学习",
    question: "中国的首都是哪里？",
    expect: "是北京。",
    expectNote: "它会这样回答吧？",
    dots: "…",
    huh: "不答反问？！",
    example: "示意数据",
    examTitle: "[地理] 首都练习题",
    n1: "1.",
    n2: "2.",
    n3: "3.",
    n4: "4.",
    looks: "像习题集的第一行！",
    mine: "我的问题",
    qlike: "问题后面还是问题的文字",
    learned: "基础模型学会的",
    learnedWhat: "像模像样地往下写",
    wanted: "我们想要的",
    wantedWhat: "回答问题",
    neq: "≠",
    ch2: "只会接着自己的文字往下写（第 2 章）",
    qaQ: "问：",
    qaA: "答：",
    qaFill: "北京。",
    chanceTitle: "下一个片段是答案的概率",
    plainRow: "只写一个问题",
    qaRow: "“问：… 答：”的样子",
    p1: "8%",
    p2: "81%",
    trick: "用文字的样子来引导",
    smart: "聪明",
    listens: "听话",
    yes: "○",
    no: "×",
    chatgpt: "ChatGPT",
    sft: "模仿示范答案（第 73 章）",
    rlhf: "用人的夸奖来打磨（第 76 章）",
    todo: "Part 8 要做的事",
  },
};
