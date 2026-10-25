import { bookLoss, train } from "../../../data/part2-batch";
import { NEURON, STORES, TUNED_LINE_W, neuron } from "../../../data/part2-toy";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** s1: tuning the 줄 knob for 가게 A alone (16장, 21장) helps A but hurts the five stores overall */
export const ONLY_A = STORES.map((s) => {
  const before = neuron(s.x, NEURON.w, NEURON.b) - s.real;
  const after = neuron(s.x, [NEURON.w[0], TUNED_LINE_W, NEURON.w[2]], NEURON.b) - s.real;
  return { name: s.name, before, after };
});
export const LOSS_BEFORE = ONLY_A.reduce((a, r) => a + r.before ** 2, 0) / ONLY_A.length;
export const LOSS_AFTER = ONLY_A.reduce((a, r) => a + r.after ** 2, 0) / ONLY_A.length;

export const BATCH_LR = 0.05;
export const CMP_EPOCHS = 3;
/** s5: loss over the whole book after every update, three epochs, three batch sizes */
export const CURVES: { batch: number; c: Highlighter; loss: number[] }[] = [1, 10, 60].map((batch, i) => ({
  batch,
  c: (["pink", "mint", "sky"] as Highlighter[])[i],
  loss: train(batch, CMP_EPOCHS, BATCH_LR).map(([w, b]) => bookLoss(w, b)),
}));

export const ch24: ChapterSpec = {
  id: 24,
  part: 2,
  title: "把练习册分开做",
  core: false,
  hook: "一本有几百万道题的练习册，是做一道改一次，还是全做完再一起改？",
  steps: [
    { id: "s1", sec: 9.5, narration: "照着 A 店把排队旋钮调到 1.5，A 店刚好对了，可 B 店错得更多，五家店的总损失从 0.7 变成了 1.95。" },
    { id: "s2", sec: 8, narration: "所以要看整本练习册来调。可是题目有几百万道，全做完才改一次，实在太慢了。" },
    { id: "s3", sec: 9.5, narration: "所以把几道题打成一包：做一包、打分、调旋钮，再做下一包。这样的一包叫小批量（minibatch）。" },
    { id: "s4", sec: 8, narration: "把练习册从头到尾做完一遍，叫作 1 轮（epoch）。通常要重复很多轮。" },
    { id: "s5", sec: 9.5, narration: "做 180 道题的过程中比一比：一题一改下降快，但忽上忽下；全做完再改只改了 3 次；10 题一包最平稳。" },
    { id: "s6", sec: 9, narration: "电脑会把一包题一起算，所以很快（第 68 章）。GPT-⁠3 的一包里装了约 320 万个词元。" },
    { id: "s7", sec: 8, narration: "分成小批量来做，再重复很多轮。可同一本练习册做太多遍，会出问题（第 25 章）。" },
  ],
  playgroundTitle: "批量大小实验",
  playgroundIntro: "用一本 60 家店的练习册，训练第 16 章神经元的两个旋钮（排队权重、偏置）。选好一包的大小，点“做 1 轮”。",
  summary: [
    "只看一道题就改，别的题会跑偏，要看整本练习册。",
    "小批量：几道题一包，做完、打分、调整。轮（epoch）：把练习册做完一遍。",
    "一题一改摇摇晃晃，全做完再改太慢，大小适中的包又快又稳。",
  ],
  unlocks: "小批量 · 轮",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "1000 道题按 100 道一包来做，1 轮里旋钮要调几次？",
      choices: ["10 次", "100 次", "1000 次"],
      answer: 0,
      explain: "1000 ÷ 100 = 10 包，每包调一次，所以是 10 次。",
      review: "s3",
    },
    {
      q: "“1 轮（epoch）”是指什么？",
      choices: ["把旋钮调一次", "把整本练习册从头到尾做一遍", "做一道题"],
      answer: 1,
      explain: "一轮就是把全部训练数据完整地看一遍。",
      review: "s4",
    },
    {
      q: "一题一改有什么特点？",
      choices: ["改得勤，但方向忽左忽右", "一轮只改一次", "总是最准确"],
      answer: 0,
      explain: "只看一道题就改，一会儿偏向这道题，一会儿又偏向那道题，所以路线歪歪扭扭。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 24 章 把练习册分开做",
    s1title: "只照着 A 店来调",
    col0: "店",
    col1: "原来的误差",
    col2: "按 A 调整后",
    total: "五家店的总损失",
    worse: "只看 A 来调，B 就坏了",
    book: "练习册",
    probs: "几百万道题",
    allAtOnce: "全做完再改一次？",
    tooSlow: "改一次要等太久",
    bundle: "10 道题",
    station: "打分 → 调旋钮",
    done: "做完的包",
    count: "包",
    minibatch: "小批量 = 一包",
    epoch: "1 轮做完！",
    again: "从头再来：第 2 轮",
    cmp: "同样 3 轮（180 道题）",
    solved: "做过的题数",
    lossAxis: "损失",
    jump: "偶尔会猛地一跳",
    axisW: "排队权重",
    axisB: "偏置",
    b1: "一题一改：改 180 次",
    b10: "10 题一包：18 次",
    b60: "全部一起：3 次",
    bottom: "谷底",
    start: "出发",
    example: "60 家店 · 示意数据",
    gpu: "一包题一起计算（第 68 章）",
    gptBatch: "GPT-3 一包：约 320 万个词元",
    gptAll: "整本练习册：约 3000 亿个词元",
    sumA: "小批量：几道题一包，做完就调",
    sumB: "轮：把练习册做完一遍",
    next: "同一本练习册做太多遍？→ 第 25 章",
  },
};
