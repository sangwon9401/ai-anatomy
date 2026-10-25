import type { ChapterSpec } from "../../../data/types";

// Real outputs of the zh offline checkpoints (part11-checkpoints.ts overlay), loaded and sampled with minigpt.ts.

/** "一人" + what the 谚语 model wrote at temperature 0.3 (five samples, all the same) */
export const PROMPT = "一人";
export const LOW_LINE = ["心", "不", "足", "蛇", "吞", "象"];

/** next-token probabilities (%) after "一人" at three temperatures */
export const NEXT_AT: Record<string, { w: string; p: number }[]> = {
  "1": [
    { w: "心", p: 33.6 },
    { w: "难", p: 20.8 },
    { w: "多", p: 10.3 },
    { w: "行", p: 9.6 },
  ],
  "0.3": [
    { w: "心", p: 79.7 },
    { w: "难", p: 16.1 },
    { w: "多", p: 1.5 },
    { w: "行", p: 1.2 },
  ],
  "1.6": [
    { w: "心", p: 21.1 },
    { w: "难", p: 15.6 },
    { w: "多", p: 10.0 },
    { w: "行", p: 9.7 },
  ],
};

/** where each candidate comes from in the data */
export const SOURCES = ["人心不足蛇吞象 · 人心齐 …", "一人难挑千斤担 …", "人多力量大"];

/** the two proverbs the low-temperature line was stitched from */
export const STITCH = [
  { line: "一人难挑千斤担，众人能移万座山", keep: "一人" },
  { line: "人心不足蛇吞象", keep: "心不足蛇吞象" },
];

/** three of five lines at temperature 1.6 */
export const HIGH_LINES = ["一人所长", "一人往高处走，水往低头难河万，十寸有所步", "一人行，必有路"];

/** the 课本句子 model, prompt "六边形" (one of six lines at temperature 0.8) */
export const WRONG = { before: "六边形有", bad: "四", after: "条边。", fix: "六" };

export const ch95: ChapterSpec = {
  id: 95,
  part: 11,
  title: "来生成吧",
  core: false,
  hook: "我训练的模型会写出什么样的句子？",
  steps: [
    { id: "s1", sec: 10.5, narration: "现在用模型来写句子。方法和第 2 章一样：抽一个词元接上去，再来一遍，直到出现换行。" },
    { id: "s2", sec: 11, narration: "“一人”后面：心 34%，难 21%，多 10%。它学过“人心不足”“一人难挑”“人多力量大”。" },
    { id: "s3", sec: 10.5, narration: "把温度调低（第 81 章），第 1 名会变得更大。温度 0.3 时“心”占 80%，写五遍都是同一句。" },
    { id: "s4", sec: 10, narration: "可是“一人心不足蛇吞象”在数据里根本没有。它是把两句谚语接在一起，编得像模像样。" },
    { id: "s5", sec: 9, narration: "把温度调高，矮柱子也常被抽中。温度 1.6 时，每次写的句子都不一样，还会混进乱七八糟的话。" },
    { id: "s6", sec: 11, narration: "课本句子模型有时还会写出“六边形有四条边”。看着像模像样，其实是错的，这就是幻觉（第 84 章）。" },
    { id: "s7", sec: 10, narration: "它虽小，写句子的方式却和 ChatGPT 一模一样。到“动手试试”里换换开头和温度，写写看吧。" },
  ],
  playgroundTitle: "用我的模型写句子",
  playgroundIntro: "输入开头，定好温度，再按“写一句”。如果第 94 章训练过模型，就用它来写；没有的话，就用事先训练好的模型。",
  summary: [
    "生成 = 算概率 → 抽一个 → 接上。出现换行就停下。",
    "温度低：稳定，常写背过的话；温度高：多样，但也有乱码。",
    "像样的组合如果不符合事实，就是幻觉。小模型也一样。",
  ],
  unlocks: "我的模型写的句子",
  unlockLabel: "毕业项目又完成了一步",
  quiz: [
    {
      q: "把温度调低会怎样？",
      choices: ["所有候选的概率变得一样", "第 1 名更常被抽中，回答更稳定", "模型学到更多"],
      answer: 1,
      explain: "温度低，分布就变尖。温度 0.3 时，“心”从 34% 变成了 80%（第 81 章）。",
      review: "s3",
    },
    {
      q: "为什么会写出“一人心不足蛇吞象”？",
      choices: ["数据里原样就有", "后来有人加进去的", "把两句谚语的片段接在了一起"],
      answer: 2,
      explain: "“一人”和“心不足蛇吞象”来自不同的谚语。模型只是接上了像样的下一个片段。",
      review: "s4",
    },
    {
      q: "“六边形有四条边”这样的句子叫什么？",
      choices: ["幻觉", "提示词", "词元"],
      answer: 0,
      explain: "口气像课本，事实却错了。像不像样和是不是事实是两回事（第 84 章）。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 95 章 来生成吧",
    model: "迷你 GPT",
    pick: "抽一个接上",
    runs: "模型运行次数",
    stop: "出现换行就结束",
    t1: "温度 1",
    t03: "温度 0.3",
    t16: "温度 1.6",
    learned: "从数据里学到的",
    same: "五遍都是同一句",
    notInData: "数据里没有这句！",
    stitched: "把两句谚语接在了一起",
    plus: "+",
    varied: "每次都不同，还有乱码",
    textbook: "课本句子模型",
    wrong: "六边形有六条边！",
    halluc: "幻觉（第 84 章）",
    sounds: "口气倒是像模像样",
    try: "开头 + 温度",
    same2: "和 ChatGPT 一样的方式",
    real: "事先训练好的模型的真实输出",
  },
};
