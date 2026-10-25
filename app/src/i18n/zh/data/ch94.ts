import type { ChapterSpec } from "../../../data/types";

// Everything on screen is from the real offline zh 谚语 run (part11-run.ts, CHECKPOINTS.proverb, seed 1).

/** one training window, shortened to its first 10 tokens: input row and the target row (next token). "\n" = line break */
export const WINDOW_IN = ["\n", "千", "里", "之", "行", "，", "始", "于", "足", "下"];
export const WINDOW_OUT = ["千", "里", "之", "行", "，", "始", "于", "足", "下", "\n"];

/** lines the model wrote during the run (temperature 0.8), with the corpus loss at that step */
export const DIARY = [
  { step: "第 0 步", loss: "6.24", text: "虎观窝辣丢掩将兵耳站百台豆本…" },
  { step: "第 100 步", loss: "5.16", text: "一，吃虎起" },
  { step: "第 500 步", loss: "1.87", text: "三个巴掌拍不成" },
  { step: "第 1,000 步", loss: "0.94", text: "一个萝卜夏吃姜" },
  { step: "第 1,500 步", loss: "0.83", text: "一日之计在于行" },
];

/** s7: one line copied from the data, one new (both written at step 1,500) */
export const COPIED = "授人以鱼，不如授人以渔";
export const FRESH = "一步一花独放不是春，百花齐放春满园";

export const LOOP = [
  { name: "预测", ch: "第 64 章" },
  { name: "损失", ch: "第 65 章" },
  { name: "反向传播", ch: "第 23 章" },
  { name: "转动旋钮", ch: "第 21、67 章" },
];

export const ch94: ChapterSpec = {
  id: 94,
  part: 11,
  title: "在浏览器里训练",
  core: true,
  hook: "模型到底是怎么学会的？在我的手机里亲眼看一看。",
  steps: [
    { id: "s1", sec: 10, narration: "终于要训练了。一开始，迷你 GPT 的 30,106 个旋钮是随便定的，所以它只会乱写一通。" },
    { id: "s2", sec: 10.5, narration: "训练一步是这样的：从数据里取 8 段、每段 24 个词元，让它在每个位置猜下一个词元（第 64 章）。" },
    { id: "s3", sec: 10, narration: "猜错多少，就有多少损失（第 65 章）。一开始损失约 6.2，和从 506 种里随便猜一个的惊讶一样大。" },
    { id: "s4", sec: 10, narration: "用反向传播算出每个旋钮的责任（第 23 章），再朝损失变小的方向轻轻转一下。这就是训练的一步。" },
    { id: "s5", sec: 10.5, narration: "这一圈转上 1,500 次，损失一路往下降：第 475 步降到 2 以下，第 900 步降到 1 以下。" },
    { id: "s6", sec: 10.5, narration: "这期间模型写的句子也在变：第 100 步是乱码，第 500 步能看出词，第 1,500 步已经像谚语了。" },
    { id: "s7", sec: 10.5, narration: "不过训练太久，它会把数据整个背下来。第 1,500 步的模型写的 80 句里，有 62 句是背的（第 25 章）。" },
    { id: "s8", sec: 9, narration: "现在去“动手试试”里按下训练按钮吧。不用服务器，真正的计算就在手机里进行。" },
  ],
  playgroundTitle: "在我的手机上训练",
  playgroundIntro: "按下“开始训练”，真正的迷你 GPT 就会在这部手机里训练。看着损失曲线和生成日记，随时可以暂停、再继续。",
  summary: [
    "一步 = 用 8 段数据猜下一个词元 → 损失 → 反向传播 → 转动旋钮。",
    "损失从约 6.2（随便猜）开始，1,500 步后降到约 0.8。",
    "训练太久就会开始死记硬背。要分清新句子和背下来的句子。",
  ],
  unlocks: "我训练的迷你 GPT",
  unlockLabel: "毕业项目又完成了一步",
  quiz: [
    {
      q: "训练的一步里，发生的事情顺序是？",
      choices: ["转动旋钮 → 预测 → 损失 → 反向传播", "反向传播 → 预测 → 转动旋钮 → 损失", "预测 → 损失 → 反向传播 → 转动旋钮"],
      answer: 2,
      explain: "先猜（预测），量一量错了多少（损失），分摊责任（反向传播），再转动旋钮（第 66 章）。",
      review: "s4",
    },
    {
      q: "刚开始训练时，损失约为 6.2，这是为什么？",
      choices: ["这和从 506 种里随便猜一个一样", "模型已经懂一点谚语了", "因为数据有 6.2KB"],
      answer: 0,
      explain: "一开始所有词元的概率都差不多。从 506 种里随便猜一个，惊讶就是约 6.2。",
      review: "s3",
    },
    {
      q: "一直训练到损失非常低，会发生什么？",
      choices: ["模型会坏掉", "背下数据原句的情况变多", "词元种类会变少"],
      answer: 1,
      explain: "小数据看太久就会背下来，就像只背真题的学生（第 25 章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 94 章 在浏览器里训练",
    model: "迷你 GPT",
    knobs: "旋钮 30,106 个",
    random: "一开始是随便定的",
    first: "最初的模型写的文字",
    input: "输入",
    target: "答案",
    newline: "换行",
    space: "标点",
    window: "24 个词元 × 8 段",
    eachNext: "在每个位置猜下一个词元",
    loss: "损失",
    lossStart: "6.24",
    guess: "506 种里随便猜一个",
    flat: "每个词元都是 1/506",
    oneStep: "训练一步",
    axisSteps: "步数",
    below2: "第 475 步：低于 2",
    below1: "第 900 步：低于 1",
    end: "第 1,500 步：0.83",
    diary: "生成日记",
    copied: "背下来的句子",
    inData: "数据里原样就有",
    fresh: "新句子",
    notInData: "数据里没有这句",
    stat: "80 句里有 62 句是背下来的",
    exam: "只背真题的学生（第 25 章）",
    start: "开始训练",
    noServer: "不用服务器，就在手机里！",
    realRun: "真实训练记录",
  },
};
