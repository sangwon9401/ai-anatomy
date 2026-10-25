import { GD_RUN, TRAIN, VAL, fitPoly, mseOf } from "../../../data/part2-fit";
import type { ChapterSpec } from "../../../data/types";

export const LINE = fitPoly(1, TRAIN);
export const LINE_TRAIN = mseOf(LINE, TRAIN);
export const LINE_VAL = mseOf(LINE, VAL);
export const WIGGLE = GD_RUN[GD_RUN.length - 1];
/** the point of the run where the validation loss was lowest */
export const BEST_STOP = GD_RUN.slice(1).reduce((a, r) => (r.val < a.val ? r : a), GD_RUN[1]);

export const ch25: ChapterSpec = {
  id: 25,
  part: 2,
  title: "只背真题的学生",
  core: false,
  hook: "练习题全对，一考试就错的 AI，问题出在哪？",
  steps: [
    { id: "s1", sec: 8, narration: "只会死背真题的学生，真题能考满分，没见过的题却一塌糊涂。AI 身上也会发生同样的事。" },
    { id: "s2", sec: 8, narration: "用 8 家店的排队和评分来练习，这就是训练数据。简单的直线会从这些点中间恰当地穿过。" },
    { id: "s3", sec: 9, narration: "让一个非常复杂的模型训练很久，它就会变成一条穿过全部 8 个点的弯弯曲曲的线。训练损失是 0。" },
    { id: "s4", sec: 9.5, narration: "可是放进 7 家没见过的店（验证数据），它就给出离谱的答案。它只是背了下来，这就是过拟合（overfitting）。" },
    { id: "s5", sec: 8.5, narration: "训练时把两个损失一起画出来：训练损失一直在降，验证损失却从某一刻开始又往上升。" },
    { id: "s6", sec: 9.5, narration: "在验证损失最低时停下，或者收集更多数据。没见过的题也能做好的能力，叫作泛化（generalization）。" },
    { id: "s7", sec: 8, narration: "GPT 训练时也会用单独留出的文字盯着验证损失，确认它是真的学会了，而不是背下来。" },
  ],
  playgroundTitle: "死记硬背探测器",
  playgroundIntro: "调一调模型的复杂度（曲线能弯成什么样），看看训练损失和验证损失怎么变，再看看多收集数据会怎样。",
  summary: [
    "过拟合：把训练数据背下来，训练损失很低，遇到没见过的数据却会错。",
    "用验证数据（训练时没用过的题）来检查。验证损失又上升，就是危险信号。",
    "办法：在验证损失最低时停下，收集更多数据。目标是泛化。",
  ],
  unlocks: "过拟合 · 泛化",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "训练损失是 0，验证损失却很大，说明什么？",
      choices: ["学得非常好", "过拟合了", "学习率是 0"],
      answer: 1,
      explain: "说明它只背下了训练数据，没见过的数据猜不对。这就是过拟合。",
      review: "s4",
    },
    {
      q: "验证数据是什么样的数据？",
      choices: ["训练时不用、单独留出来的数据", "把训练数据再用一遍", "没有答案的数据"],
      answer: 0,
      explain: "要用模型从没见过的题来考，才知道它的真实水平。",
      review: "s4",
    },
    {
      q: "下面哪一项不能减少过拟合？",
      choices: ["收集更多数据", "在验证损失最低时停下", "用同样的数据再训练更久"],
      answer: 2,
      explain: "用同样的数据训练得越久，就背得越多。验证损失开始上升时，最好停下来。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 25 章 只背真题的学生",
    memo: "死背的学生",
    under: "真懂的学生",
    past: "真题",
    fresh: "没见过的题",
    pts: "分",
    example: "示意数据",
    trainTitle: "训练数据：8 家店",
    axisX: "排队（桌）",
    axisY: "评分",
    simple: "简单的直线",
    trainLoss: "训练损失",
    valLoss: "验证损失",
    complex: "非常复杂的模型",
    zero: "穿过全部 8 个点！",
    valTitle: "没见过的 7 家店",
    weird: "评分 6 分？！",
    overfit: "过拟合（overfitting）",
    curveTitle: "训练中的两个损失",
    time: "训练时间 →",
    timeNote: "越往后刻度越宽",
    stop: "在这里停下！",
    apart: "分开了",
    fix1: "在验证损失最低时停下",
    fix2: "收集更多数据",
    gen: "泛化 = 没见过的题也能做好",
    gpt: "GPT 也用留出的文字来验证",
    real: "是背下来了，还是学会了？",
    line: "直线",
    wiggle: "弯弯曲曲",
  },
};
