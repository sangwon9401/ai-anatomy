import type { ChapterSpec, Highlighter } from "../../../data/types";

export type FewShotTask = {
  key: string;
  name: string;
  query: string;
  /** candidates: [the rule's answer, the odd example's answer, two plain continuations] */
  cands: string[];
  base: number[];
  examples: string[];
  odd: string;
};

// 示意数据: a made-up scoring rule, not a real model. Every matching example adds RULE_BOOST to the
// rule's answer; the odd example (from another pattern) adds ODD_BOOST to its own answer.
export const RULE_BOOST = 1.2;
export const ODD_BOOST = 2.0;

export const TASKS: FewShotTask[] = [
  {
    key: "opp",
    name: "反义词",
    query: "快 →",
    cands: ["慢", "fast", "快点", "快乐"],
    base: [0.6, 0, 1.6, 1.2],
    examples: ["大 → 小", "高 → 低", "亮 → 暗"],
    odd: "苹果 → apple",
  },
  {
    key: "eng",
    name: "译成英语",
    query: "小狗 →",
    cands: ["dog", "汪汪", "很可爱", "狗粮"],
    base: [0.6, 0.2, 1.6, 1.1],
    examples: ["苹果 → apple", "学校 → school", "书 → book"],
    odd: "小猫 → 喵喵",
  },
  {
    key: "cap",
    name: "首都",
    query: "英国 →",
    cands: ["伦敦", "英语", "足球", "旅行"],
    base: [0.7, 0.3, 1.5, 1.2],
    examples: ["中国 → 北京", "日本 → 东京", "法国 → 巴黎"],
    odd: "德国 → 德语",
  },
];

export const softmax71 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** The model's guess after `k` matching examples (and the odd one, if included). */
export const guess = (task: FewShotTask, k: number, odd = false) =>
  softmax71(task.base.map((b, i) => b + (i === 0 ? RULE_BOOST * k : 0) + (i === 1 && odd ? ODD_BOOST : 0)));

export const CAND_COLORS: Highlighter[] = ["mint", "orange", "sky", "violet"];

/** s6: 正确率 by number of examples, 示意数据 (the shape follows the GPT-3 paper: bigger models gain more). */
export const SHOTS = [0, 1, 2, 4, 8];
export const ACCURACY = [
  { name: "小模型", c: "sky" as Highlighter, v: [5, 7, 8, 9, 10] },
  { name: "中模型", c: "mint" as Highlighter, v: [10, 22, 28, 33, 36] },
  { name: "大模型", c: "pink" as Highlighter, v: [20, 45, 56, 64, 68] },
];

/** Part 7 recap chips (the unlocks of 63–71). */
export const PART7_TOOLS = ["数据清洗", "自监督学习", "交叉熵", "预训练", "Adam 优化器", "GPU 并行计算", "GPT 模型的大小", "缩放定律", "上下文学习"];

export const ch71: ChapterSpec = {
  id: 71,
  part: 7,
  title: "只看例子也能学会",
  core: false,
  hook: "一个数字都没改，模型能学会新本事吗？",
  steps: [
    { id: "s1", sec: 11, narration: "2020 年介绍 GPT-3 的论文，题目是《语言模型是少样本学习者》。意思是只看几个例子，就能完成新任务。" },
    { id: "s2", sec: 11, narration: "只给出“快 →”，模型不知道你要什么。你想要反义词，它却容易像“快点走”那样把话接下去。" },
    { id: "s3", sec: 10, narration: "在前面加一个例子：“大 → 小”。现在它开始察觉，箭头后面该接反义词。" },
    { id: "s4", sec: 9, narration: "加上三个例子，“慢”就几乎确定了。神奇的是，模型里的数字一个都没变。" },
    { id: "s5", sec: 10, narration: "这就是上下文学习。它不像第 66 章那样修改数字，而是从提示词里的例子中读出规律。" },
    { id: "s6", sec: 10, narration: "按例子的个数画出正确率：例子越多，正确率越高。而且模型越大，从例子里得到的好处越多。" },
    { id: "s7", sec: 10, narration: "不给例子叫零样本，给一个叫单样本，给好几个叫少样本。放例子的诀窍，第 85 章讲提示词时还会用到。" },
    { id: "s8", sec: 11, narration: "Part 7 让 GPT 学习：教科书、猜下一个片段、减少惊讶、训练循环、规模的力量。接下来，该学对话了！" },
  ],
  playgroundTitle: "放进例子",
  playgroundIntro: "点例子卡片，把它放进提示词或拿出来。模型的数字没变，只靠例子，回答就变了。也试试放进一个不相干的例子。",
  summary: [
    "在提示词里给出例子，模型当场读出规律并照着做 = 上下文学习。",
    "模型里的数字不变。0 个例子是零样本，1 个是单样本，好几个是少样本。",
    "Part 7：互联网教科书 → 猜下一个片段 → 减少惊讶 → 训练循环 → 规模的力量。",
  ],
  unlocks: "上下文学习",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "在上下文学习里，改变的是什么？",
      choices: ["模型里的数字（参数）", "提示词里的例子", "分词器"],
      answer: 1,
      explain: "数字一个都不改。只有放进提示词的例子变了，模型从中读出规律。",
      review: "s5",
    },
    {
      q: "像“大 → 小，高 → 低，快 →”这样给出 2 个例子的方式叫什么？",
      choices: ["少样本", "零样本", "预训练"],
      answer: 0,
      explain: "例子有好几个叫少样本，一个叫单样本，没有叫零样本。",
      review: "s7",
    },
    {
      q: "增加例子时，正确率上升最多的是哪一种？（示意图）",
      choices: ["小模型", "都一样", "大模型"],
      answer: 2,
      explain: "GPT-3 的论文里也是这样：模型越大，越会利用提示词里的例子。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 71 章 只看例子也能学会",
    paperEn: "Language Models are Few-Shot Learners",
    paperKo: "《语言模型是少样本学习者》",
    paperMeta: "2020 · GPT-3 论文",
    fewMeaning: "几个例子 → 新任务",
    prompt: "提示词",
    guess: "模型的下一个片段",
    example: "示意数据",
    // U+2060 (word joiner) keeps 反义词 together when this note wraps: 本想要 / 反义词……
    wanted: "本想要反\u2060义\u2060词……",
    notice: "开始察觉了！",
    sure: "几乎确定！",
    frozen: "模型里的数字：没变",
    train: "训练（第 66 章）",
    trainDo: "修改数字",
    icl: "上下文学习",
    iclEn: "(in-context learning)",
    zeroEn: "zero-shot",
    oneEn: "one-shot",
    fewEn: "few-shot",
    iclDo: "数字不变，从例子里读出规律",
    axisX: "提示词里的例子数 →",
    axisY: "↑ 正确率",
    bigGain: "模型越大，越能用好例子",
    zero: "零样本",
    one: "单样本",
    few: "少样本",
    zeroN: "0 个例子",
    oneN: "1 个例子",
    fewN: "好几个例子",
    ch85: "第 85 章：提示词的诀窍",
    recap: "Part 7 得到的工具",
    next: "下一站：Part 8 ChatGPT 的诞生",
    nextQ: "第 72 章：聪明却不听话的模型",
    q: "?",
  },
};
