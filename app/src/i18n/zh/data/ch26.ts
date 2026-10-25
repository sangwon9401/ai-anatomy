import { MNIST_TEST_ACC } from "../../../data/part2-mnist";
import { predict, sampleDigit } from "../../../data/part2-mnist-net";
import type { ChapterSpec } from "../../../data/types";

/** the scene's 3 (an MNIST test image) and what the embedded network says about it */
export const THREE = sampleDigit(3);
export const THREE_OUT = predict(THREE);
/** s1 zoom: a 4×4 patch of the 3 (rows, cols) */
export const PATCH = { row: 10, col: 10, n: 4 };
export const PATCH_VALUES = Array.from({ length: PATCH.n }, (_, r) => Array.from({ length: PATCH.n }, (_, c) => THREE[(PATCH.row + r) * 28 + PATCH.col + c]));
export const ACC_PCT = (MNIST_TEST_ACC * 100).toFixed(2);
export const ACC_RIGHT = Math.round(MNIST_TEST_ACC * 10000);
/** s2 draws 8 of the 64 hidden neurons: the five most active for this 3, and three that stay off */
export const SHOWN_HIDDEN = (() => {
  const idx = Array.from(THREE_OUT.hidden, (v, i) => [i, v] as [number, number]);
  const on = [...idx].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const off = idx.filter(([, v]) => v === 0).slice(0, 3);
  return [on[0], off[0], on[1], on[2], off[1], on[3], off[2], on[4]];
})();
export const HIDDEN_MAX = Math.max(...THREE_OUT.hidden);
export const ACTIVE_COUNT = THREE_OUT.hidden.filter((v) => v > 0).length;

export const ch26: ChapterSpec = {
  id: 26,
  part: 2,
  title: "动手试试：手写数字",
  core: false,
  hook: "我用手指写的数字，神经网络真的认得出来吗？",
  steps: [
    { id: "s1", sec: 9.5, narration: "一张数字图有 28 × 28 = 784 格。每一格里是从 0（空白）到 1（浓墨）的一个数（第 6 章）。" },
    { id: "s2", sec: 9.5, narration: "这 784 个数就是输入。隐藏层的 64 个神经元各自算出 (输入 × 权重) 之和 + 偏置，再用 ReLU 折一下（第 16～19 章）。" },
    { id: "s3", sec: 9.5, narration: "10 个输出神经元给出 0～9 的分数，再用 Softmax 变成概率（第 14 章）。这张图：3 是 87.5%，5 是 11.3%。" },
    { id: "s4", sec: 9, narration: "训练用的是 6 万张手写数字，叫作 MNIST。前向传播、损失、反向传播、调整，按小批量反复进行（第 19～24 章）。" },
    { id: "s5", sec: 9, narration: "学完后，用没见过的 1 万张测试图来打分，答对了 97.96%。它就是装在这个应用里的那个神经网络。" },
    { id: "s6", sec: 9, narration: "把隐藏神经元的权重画成图，会看到像笔画片段一样的花纹。没有人教过它，是它自己找到的。" },
    { id: "s7", sec: 7, narration: "现在轮到你来画了。用手指在下面的格子里写一个数字，浏览器里的神经网络马上就能认出来。" },
  ],
  playgroundTitle: "猜数字",
  playgroundIntro: "用手指（或鼠标）在方框里大大地写一个 0 到 9 的数字。神经网络看到的 28×28 图像和每个数字的概率会马上出来。",
  summary: [
    "一张数字图 = 28 × 28 = 784 个数，这就是神经网络的输入。",
    "784 → 64 个隐藏神经元（ReLU）→ 10 个输出 → Softmax 得出 0～9 的概率。",
    "用 MNIST 的 6 万张训练，没见过的 1 万张里答对了约 98%。",
  ],
  unlocks: "手写数字识别器",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "一张 28 × 28 的黑白数字图，要用多少个数来表示？",
      choices: ["56 个", "784 个", "28 个"],
      answer: 1,
      explain: "横 28 格 × 纵 28 格 = 784 格，每格一个数。",
      review: "s1",
    },
    {
      q: "把 10 个输出神经元的分数变成概率的计算是哪个？",
      choices: ["ReLU", "归一化", "Softmax"],
      answer: 2,
      explain: "把分数变成 e 的次方再除以总和，就是 Softmax（第 14 章），由此得出 0～9 的概率。",
      review: "s3",
    },
    {
      q: "要测神经网络的真实水平，该用什么样的图来打分？",
      choices: ["训练时没用过的新图", "训练时用过的图", "随便什么图都行"],
      answer: 0,
      explain: "考背过的题，测不出真实水平（第 25 章）。所以用没见过的 1 万张测试图来打分。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 26 章 动手试试：手写数字",
    title: "一个手写数字",
    grid: "28 × 28 = 784 格",
    scale: "0 = 空白，1 = 浓墨",
    zoom: "放大",
    mnist: "MNIST 测试图",
    inputs: "784 个输入",
    hidden: "64 个隐藏神经元",
    outputs: "10 个输出",
    drawn: "64 个里只画了 8 个",
    active: "这张图让 64 个里的 35 个亮了",
    relu: "用 ReLU 折",
    on: "亮着的是黄色",
    probTitle: "分数 → Softmax → 概率",
    confuse: "和 5 有点像",
    trainTitle: "用 MNIST 的 6 万张手写数字训练",
    loop: "前向传播 → 损失 → 反向传播 → 调整",
    batch: "按小批量反复进行",
    test: "没见过的 1 万张测试图",
    right: " 张答对",
    measured: "用这个应用里的神经网络实测",
    seeTitle: "隐藏神经元看到的花纹",
    plus: "+ 权重：这里有墨就亮",
    minus: "− 权重：这里有墨就灭",
    self: "没有人教过它！",
    neuron: "神经元",
    go: "轮到你来画了！",
    down: "在下面的格子里写个数字",
    digits: "0 1 2 3 4 5 6 7 8 9 %",
  },
};
