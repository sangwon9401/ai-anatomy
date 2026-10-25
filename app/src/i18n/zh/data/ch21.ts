import { NEURON, STORE_A, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** A 店 only, turning only the 排队 knob w: loss = (预测 − 4.5)² = (2w − 3)² */
export const lossA = (w: number) => (neuron(STORE_A.x, [NEURON.w[0], w, NEURON.w[2]], NEURON.b) - STORE_A.real) ** 2;
/** slope measured the way the chapter explains it: nudge w a little and see how the loss changes */
export const slopeA = (w: number, d = 1e-4) => (lossA(w + d) - lossA(w - d)) / (2 * d);
export const LR = 0.1;
export const W0 = NEURON.w[1];
/** w after each gradient step from W0 */
export const PATH = (() => {
  const ws = [W0];
  for (let i = 0; i < 5; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - LR * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
})();

export const ch21: ChapterSpec = {
  id: 21,
  part: 2,
  title: "梯度下降",
  core: true,
  hook: "想让损失变小，旋钮该往哪边转、转多少？",
  steps: [
    { id: "s1", sec: 8, narration: "只看 A 店，也只转第 16 章神经元的排队旋钮 w。现在 w 是 1，损失是 1。" },
    { id: "s2", sec: 8, narration: "把 w 换成各种值，把损失画出来，就是一个山谷的形状。我们想找到最低的谷底。" },
    { id: "s3", sec: 9, narration: "可实际上看不到这张图，因为旋钮多得数不清。就像在大雾笼罩的山上，只看得见脚下。" },
    { id: "s4", sec: 8, narration: "脚下的坡度是能知道的。把 w 稍微调高 0.01，损失从 1 变成 0.96，大约少了 0.04。" },
    { id: "s5", sec: 9, narration: "斜率就是“稍微改一点，损失变多少”：−0.04 ÷ 0.01 ≈ −4。它是负数，所以调高 w，损失就会下降。" },
    { id: "s6", sec: 9, narration: "所以朝斜率的反方向走一步！新 w = 1 − 0.1 × (−4) = 1.4。0.1 是步子的大小（第 22 章 学习率）。" },
    { id: "s7", sec: 9, narration: "反复这样走，球就会滚到谷底：w 是 1.5，预测 4.5 分，损失 0。这就是梯度下降（梯度就是这里的斜率）。" },
    { id: "s8", sec: 9, narration: "有两个旋钮，就是碗的形状。有 1750 亿个，就是想象不出的大山，但给每个旋钮求斜率的方法是一样的。" },
  ],
  playgroundTitle: "雾中下山",
  playgroundIntro: "山谷被雾挡住了。用“测斜率”只看脚下，转动旋钮，把损失降到 0.01 以下。卡住了就点“自动走一步”。",
  summary: [
    "斜率 = 把旋钮稍微改一点，损失会变多少。",
    "朝斜率的反方向一点点走：新旋钮 = 旋钮 − 学习率 × 斜率。",
    "反复走，就能下到损失山谷的谷底。这就是梯度下降。",
  ],
  unlocks: "梯度下降",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "旋钮调高 0.01，损失增加了 0.03。斜率大约是多少？",
      choices: ["−3", "+3", "+0.03"],
      answer: 1,
      explain: "斜率 = 损失的变化 ÷ 旋钮的变化 = 0.03 ÷ 0.01 = 3。损失增加了，所以是正数。",
      review: "s5",
    },
    {
      q: "斜率是 +3 时，旋钮该往哪边转，损失才会变小？",
      choices: ["调高", "调低", "不动"],
      answer: 1,
      explain: "调高会让损失变大，所以要反过来调低。新值 = 现在的值 − 学习率 × 3。",
      review: "s6",
    },
    {
      q: "w = 2，斜率 = 5，学习率 = 0.1，走一步后 w 是多少？",
      choices: ["1.5", "2.5", "1.9"],
      answer: 0,
      explain: "2 − 0.1 × 5 = 2 − 0.5 = 1.5。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 21 章 梯度下降",
    title: "只转排队旋钮 w",
    example: "只看 A 店 · 示意数据",
    axisW: "w（排队旋钮）",
    axisL: "损失",
    now: "现在：w = 1，损失 = 1",
    valley: "损失山谷",
    goal: "这里是谷底！",
    fog: "雾里：只看得见脚下",
    nudgeW: "w：1 → 1.01",
    nudgeL: "损失：1 → 0.96",
    nudgeD: "约少了 0.04",
    slope: "斜率 ≈ −0.04 ÷ 0.01 = −4",
    slopeNote: "负数 → 调高 w，损失变小",
    rule: "新 w = 1 − 0.1 × (−4) = 1.4",
    lr: "0.1 = 步子大小（学习率）",
    loss14: "损失 1 → 0.04",
    repeat: "1 → 1.4 → 1.48 → 1.496 → … → 1.5",
    done: "预测 4.5 分 = 真实评分！",
    gd: "梯度下降",
    bowl: "2 个旋钮 = 碗的形状",
    k1: "旋钮 1",
    k2: "旋钮 2",
    many: "1750 亿个也一样",
    bowlEx: "示意图",
  },
};
