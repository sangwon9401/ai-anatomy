import type { ChapterSpec } from "../../../data/types";

/**
 * A toy reward model for the lesson: it looks at three yes/no features of an answer and adds up weights.
 * (A real reward model is a transformer that finds its own features; this keeps the idea visible.)
 */
export const FEATURES = ["切题地回答了", "说明了理由或方法", "有错误或有害内容"];

export type Scored = { id: string; text: string; f: number[] };

// The answers ranked in ch74 (questions 1 and 2), with their features
export const TRAIN: { q: string; answers: Scored[]; order: string[] }[] = [
  {
    q: "明天就考试了，可我睡不着。怎么办？",
    answers: [
      { id: "A", text: "睡不着的话，干脆通宵复习吧。", f: [1, 0, 1] },
      { id: "B", text: "把手机放远一点，关上灯，舒服地躺着。就算睡不着，闭上眼睛休息也有帮助。", f: [1, 1, 0] },
      { id: "C", text: "睡眠很重要。", f: [0, 0, 0] },
    ],
    order: ["B", "C", "A"],
  },
  {
    q: "“苹果”用英语怎么说？",
    answers: [
      { id: "A", text: "apple。如果说的是苹果公司，就写成首字母大写的 Apple。", f: [1, 1, 0] },
      { id: "B", text: "apple", f: [1, 0, 0] },
      { id: "C", text: "苹果是又红又好吃的水果。", f: [0, 0, 0] },
    ],
    order: ["A", "B", "C"],
  },
];

export type Pair = { q: number; better: Scored; worse: Scored };
export const PAIRS: Pair[] = TRAIN.flatMap((t, q) => {
  const by = (id: string) => t.answers.find((a) => a.id === id)!;
  const out: Pair[] = [];
  for (let i = 0; i < t.order.length; i++) for (let j = i + 1; j < t.order.length; j++) out.push({ q, better: by(t.order[i]), worse: by(t.order[j]) });
  return out;
});

// A question the reward model has never seen
export const TEST = {
  q: "和朋友吵架了，怎么和好呢？",
  answers: [
    { id: "X", text: "先发一条简短的道歉消息。委屈的地方，以后再平心静气地说也行。", f: [1, 1, 0] },
    { id: "Y", text: "过段时间就会好的。", f: [1, 0, 0] },
    { id: "Z", text: "你也去说他坏话，还回去。", f: [1, 0, 1] },
    { id: "W", text: "谁都会吵架的。", f: [0, 0, 0] },
  ] as Scored[],
};

export const W0 = [0.5, -0.5, 1.0]; // a clumsy untrained judge
export const LR = 1.0;
export const DECAY = 0.04;

export const scoreOf = (w: number[], f: number[]) => f.reduce((a, x, i) => a + x * w[i], 0);
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
/** chance that `better` wins = softmax over the two scores (ch.14) */
export const winChance = (w: number[], p: Pair) => sigmoid(scoreOf(w, p.better.f) - scoreOf(w, p.worse.f));

/** One pass over all pairs: nudge the weights so the better answer's score goes up and the worse one's goes down. */
export function trainStep(w: number[]): number[] {
  const g = w.map(() => 0);
  for (const p of PAIRS) {
    const miss = 1 - winChance(w, p);
    for (let i = 0; i < w.length; i++) g[i] += miss * (p.better.f[i] - p.worse.f[i]);
  }
  return w.map((x, i) => x + LR * (g[i] / PAIRS.length) - LR * DECAY * x);
}

export function trainN(w: number[], n: number) {
  let v = w;
  for (let i = 0; i < n; i++) v = trainStep(v);
  return v;
}

// numbers for the scene, computed from the same toy model the playground's auto-train button runs
export const TRAIN_STEPS = 40;
export const W_TRAINED = trainN(W0, TRAIN_STEPS);
const R1 = TRAIN[0].answers;
export const SCENE = {
  before: { B: scoreOf(W0, R1[1].f), A: scoreOf(W0, R1[0].f) },
  after: { B: scoreOf(W_TRAINED, R1[1].f), A: scoreOf(W_TRAINED, R1[0].f) },
  test: TEST.answers.slice(0, 3).map((a) => ({ ...a, s: scoreOf(W_TRAINED, a.f) })),
};

export const ch75: ChapterSpec = {
  id: 75,
  part: 8,
  title: "AI 评分员",
  core: false,
  hook: "如果有个 AI 能代替人给答案打分，会怎么样？",
  steps: [
    { id: "s1", sec: 8, narration: "我们来造一个代替人打分的 AI。放进答案，就输出一个分数的机器：奖励模型（reward model）。" },
    { id: "s2", sec: 8, narration: "它的内部和 GPT 一样是 Transformer。只是最后不再输出下一个片段的概率，而是改成输出一个分数。" },
    { id: "s3", sec: 7, narration: "一开始它乱打分。人说 B 更好，评分员却给了 A 更高的分。" },
    { id: "s4", sec: 8, narration: "那就按错的程度修改数字（第 21 章），让 B 的分数往上走，A 的分数往下走。" },
    { id: "s5", sec: 9, narration: "把两个分数放进第 14 章的 Softmax，就得到“B 获胜的概率”。练习让这个概率和人的选择一致。" },
    { id: "s6", sec: 8, narration: "用非常多的比较对练习之后，第一次见的答案，它也能按人喜欢的程度打出分数。" },
    { id: "s7", sec: 9, narration: "不过评分员也不完美。它有时会被满篇夸奖的答案骗到，打出高分。第 76 章再来看。" },
  ],
  playgroundTitle: "评分员训练营",
  playgroundIntro: "这个玩具评分员把答案的三个特征乘上权重，加起来就是分数。拖动滑块修改权重，让人定下的 6 对比较全部判对。",
  summary: [
    "奖励模型：放进问题和答案，输出一个分数的评分员 AI。",
    "按照人给的比较对，修改数字，让“更好的答案”分数更高。",
    "两个分数的 Softmax = 更好的答案获胜的概率。评分员偶尔也会被骗。",
  ],
  unlocks: "奖励模型",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "把答案放进奖励模型，会输出什么？",
      choices: ["一个分数", "下一个片段的概率", "一个更好的答案"],
      answer: 0,
      explain: "主体和 GPT 一样是 Transformer，只是最后改成输出一个分数。",
      review: "s2",
    },
    {
      q: "人说 B > A，评分员却给 A 打了更高的分。该怎么训练？",
      choices: ["把 A 的分数再调高", "删掉这一对比较", "修改数字，让 B 的分数上升、A 的分数下降"],
      answer: 2,
      explain: "按错的程度修改数字，让更好的答案分数排到上面。",
      review: "s4",
    },
    {
      q: "两个答案分数完全相同时，评分员认为“B 获胜的概率”是多少？",
      choices: ["0%", "50%", "100%"],
      answer: 1,
      explain: "分数一样，Softmax 也会一人一半（第 14 章）。说明它还分不出两者。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 75 章 AI 评分员",
    rm: "奖励模型",
    rmEn: "reward model",
    input: "问题 + 答案",
    score: "分数",
    oneNumber: "答案 → 一个分数",
    example: "示意数据",
    block: "Transformer 模块",
    layers: "× 很多层",
    sameBody: "主体和 GPT 一样",
    probs: "下一个片段的概率",
    oneScore: "一个分数",
    newHead: "只换了“头”",
    humanSays: "人的判定（第 74 章）：B > A",
    backwards: "打反了！",
    fix: "按错的程度修改数字（第 21 章）",
    beforeTrain: "修改前",
    afterTrain: "修改后",
    winTitle: "B 获胜的概率",
    winSub: "两个分数的 Softmax（第 14 章）",
    winB: "B 胜",
    winA: "A 胜",
    match: "和人的选择（B）一致了！",
    newQ: "和朋友吵架了，怎么和好呢？",
    newAns: "第一次见的答案也能打分",
    flatter: "真是史上最棒的问题！！！你简直是天才！！！你一定能和好的！！！",
    fooled: "被骗了！",
    notPerfect: "评分员也不完美",
    next: "第 76 章",
    gaugeMin: "−3",
    gaugeMax: "+3",
    arrowUp: "↑",
    arrowDown: "↓",
    expA: "A 的分数",
    expB: "B 的分数",
    sep: " · ",
    digits: "0123456789.−+%",
  },
};
