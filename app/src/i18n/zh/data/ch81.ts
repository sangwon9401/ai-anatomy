import type { ChapterSpec, Highlighter } from "../../../data/types";

// ch14's scores in the zh running example (学校 3, 图书馆 2, 公园 1, 披萨 −1, colours as in ch14);
// probabilities = softmax(score ÷ temperature), see part9-toy.ts.
export const SCORES81: { w: string; s: number; c: Highlighter }[] = [
  { w: "学校", s: 3, c: "yellow" },
  { w: "图书馆", s: 2, c: "mint" },
  { w: "公园", s: 1, c: "sky" },
  { w: "披萨", s: -1, c: "pink" },
];

// s6: continuations of "我 今天 去" written by the Part 9 toy model at three temperatures (illustrative picks;
// every one is a real path through the toy table, checked by script). At 0.2 the loop comes out about 78% of the time.
export const RUNS = [
  { t: 0.2, runs: [["学校", "然后", "见到", "朋友", "然后", "见到", "朋友", "…"]] },
  {
    t: 1,
    runs: [
      ["学校", "然后", "吃了", "午饭", "。"],
      ["图书馆", "。"],
      ["公园", "所以", "很开心", "。"],
    ],
  },
  {
    t: 2,
    runs: [
      ["披萨", "星球", "探险", "。"],
      ["图书馆", "可是", "恐龙", "出现了", "。"],
      ["学校", "。"],
    ],
  },
];

export const ch81: ChapterSpec = {
  id: 81,
  part: 9,
  title: "创造力旋钮",
  core: true,
  hook: "AI 的“创造力”能用一个数字来调吗？",
  steps: [
    { id: "s1", sec: 9, narration: "第 14 章把分数 3、2、1、−1 放进 Softmax，“学校”得到 65.7%。现在给它装一个旋钮。" },
    { id: "s2", sec: 9, narration: "这个旋钮叫温度（temperature）。先把分数除以温度，再放进 Softmax。温度是 1 时，一切照旧。" },
    { id: "s3", sec: 9, narration: "把温度降到 0.5，分数变成 6、4、2、−2。差距拉大一倍，“学校”变成 86.7%，一下子变尖了。" },
    { id: "s4", sec: 9, narration: "把温度升到 2，分数变成 1.5、1、0.5、−0.5。差距缩小，分布变平，披萨也有 6.4% 了。" },
    { id: "s5", sec: 9, narration: "拧到头会怎样？温度接近 0，只剩第 1 名，就成了贪心（第 80 章）；温度很高，所有候选都差不多。" },
    { id: "s6", sec: 9, narration: "用玩具模型写句子：温度 0.2 时原地打转，温度 1 时很自然，温度 2 时就变得古怪。" },
    { id: "s7", sec: 9, narration: "要准确的回答，适合低温度；要新点子，适合高温度。温度不改变知识，只是重新分配概率。" },
  ],
  playgroundTitle: "温度旋钮",
  playgroundIntro: "一边调温度一边看概率柱子，再用同一个温度写 5 句话。句子有什么变化？",
  summary: [
    "温度：先把分数除以温度，再放进 Softmax。",
    "温度低，分布尖，第 1 名独占；温度高，分布平，大家都有机会被抽中。",
    "低温度稳定，高温度多样。模型的知识并没有变。",
  ],
  unlocks: "温度",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "把温度降到 0.5，放进 Softmax 的分数 [3, 2, 1, −1] 会变成？",
      choices: ["[1.5, 1, 0.5, −0.5]", "[6, 4, 2, −2]", "[3.5, 2.5, 1.5, −0.5]"],
      answer: 1,
      explain: "分数要除以温度。除以 0.5 就是翻一倍，分数之间的差距也拉大一倍。",
      review: "s3",
    },
    {
      q: "把温度调得非常高，概率分布会怎样？",
      choices: ["所有候选都差不多", "只有第 1 名变成 100%", "完全不变"],
      answer: 0,
      explain: "分数除以一个很大的数，差距几乎消失，柱子就变得差不多高。",
      review: "s5",
    },
    {
      q: "像数学题这样需要准确答案时，适合什么温度？",
      choices: ["非常高的温度", "高低都无所谓", "低温度"],
      answer: 2,
      explain: "低温度几乎每次都挑最可信的答案，很稳定。高温度适合编故事这类需要多样性的时候。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 81 章 创造力旋钮",
    example: "* 分数为示意数据（第 14 章）",
    recap: "第 14 章：分数 → Softmax → 概率",
    dial: "装个旋钮！",
    temp: "温度",
    fLeft: "概率 =",
    fRight: "Softmax(分数 ÷ 温度)",
    score: "分数",
    divided: "分数÷温度",
    same: "÷ 1 → 不变",
    sharp: "差距翻倍 → 变尖！",
    flat: "差距减半 → 变平",
    near0: "温度 0.1",
    high: "温度 10",
    greedy: "只剩第 1 名 = 贪心",
    even: "全都差不多 = 平",
    runsHead: "接着“我 今天 去”往下写",
    toy: "* 用玩具模型抽出的示意例子",
    allSame: "写多少遍都一样",
    loop: "打转",
    natural: "自然",
    odd: "古怪",
    low: "低温度",
    highT: "高温度",
    lowWhen: "需要准确时",
    lowEx: "解数学题、问事实",
    highWhen: "需要多样时",
    highEx: "想点子、编故事",
    key: "知识不变，只重新分配概率",
    name: "“创造力旋钮”只是个外号",
    go: "学校",
    went: "图书馆",
    late: "公园",
    pizza: "披萨",
  },
};
