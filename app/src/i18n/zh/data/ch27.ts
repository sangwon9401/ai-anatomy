import { DATASETS, accOf, boundary, run } from "../../../data/part2-boss";
import type { ChapterSpec } from "../../../data/types";

/** the scene's run: 맛집 지도, 8 hidden neurons, 학습률 0.1, 10곳씩 미니배치, 300 에폭 (seed chosen so the story reads cleanly) */
export const BOSS_DS = DATASETS[0];
export const BOSS = { hidden: 8, lr: 0.1, batch: 10, epochs: 300, seed: 21 };
/** dense snapshots so the scene can show the boundary, epoch and accuracy of the same moment */
export const SNAP_EPOCHS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 30, 40, 50, 60, 80, 100, 130, 160, 200, 250, 300];
export const BOSS_RUN = run(BOSS_DS, BOSS.hidden, BOSS.lr, BOSS.batch, BOSS.epochs, SNAP_EPOCHS, BOSS.seed);
export const SNAPS = BOSS_RUN.snaps.map((s) => ({ epoch: s.epoch, acc: accOf(s.net, BOSS_DS, BOSS_DS.train), segs: boundary(s.net, BOSS_DS) }));
export const FINAL_VAL = accOf(BOSS_RUN.net, BOSS_DS, BOSS_DS.val);
export const KNOBS = BOSS.hidden * 2 + BOSS.hidden + BOSS.hidden + 1;

export const TOOLS2 = ["神经元", "激活函数", "叠层", "前向传播", "损失", "梯度下降", "学习率", "反向传播", "小批量 · 轮", "防止过拟合", "手写数字识别器"];

export const ch27: ChapterSpec = {
  id: 27,
  part: 2,
  title: "Part 2 Boss 战",
  core: false,
  hook: "把学过的东西全用上，能从零开始训练一个神经网络吗？",
  steps: [
    { id: "s1", sec: 9, narration: "Part 2 Boss 战！第 17 章的火锅店地图扩大到了 60 家店。这次不用手画边界，让神经网络自己去找。" },
    { id: "s2", sec: 9, narration: "2 个输入 → 8 个 ReLU 神经元 → 1 个输出（第 18 章）。33 个旋钮一开始随便设，超过 0.5 就算好吃。" },
    { id: "s3", sec: 9, narration: "跑起训练循环：前向传播（第 19 章）、算损失（第 20 章）、反向传播分责任（第 23 章）、梯度下降来调整（第 21 章）。" },
    { id: "s4", sec: 9.5, narration: "每 10 家一个小批量，跑 300 轮（第 24 章）。损失下降，边界慢慢变成 V 字，准确率从 23% 升到 100%。" },
    { id: "s5", sec: 9, narration: "再用单独留出、没见过的 30 家店来验证（第 25 章），30 家全对。它不是背下来，而是学会了 V 字规律。" },
    { id: "s6", sec: 8, narration: "GPT-⁠3 也是这样学的，只是旋钮从 33 个变成 1750 亿个，数据从 60 家店变成 3000 亿个词元。" },
    { id: "s7", sec: 8.5, narration: "Part 2 的学习工具齐了！在 Part 3，我们要学怎么把文字变成数字，好把文字放进神经网络。" },
  ],
  playgroundTitle: "亲手训练神经网络",
  playgroundIntro: "选一道题，定好神经元个数和学习率，点“开始训练”。看着损失曲线下降、边界慢慢长出来。最后的 Boss 是靶子！",
  summary: [
    "训练循环：前向传播 → 损失 → 反向传播 → 梯度下降调整，按小批量一轮轮重复。",
    "神经元个数、学习率、轮数由人来定；旋钮（权重、偏置）由训练来找。",
    "用验证数据检查才是真实水平。GPT 也用同样的方法学，只是大得多。",
  ],
  unlocks: "训练循环（Part 2 完成）",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "训练循环一圈的正确顺序是？",
      choices: ["损失 → 前向传播 → 调整 → 反向传播", "前向传播 → 损失 → 反向传播 → 调整", "反向传播 → 前向传播 → 损失 → 调整"],
      answer: 1,
      explain: "先预测（前向传播），再量错了多少（损失），然后分摊责任（反向传播），最后调旋钮（梯度下降）。",
      review: "s3",
    },
    {
      q: "2 个输入 → 8 个神经元 → 1 个输出的神经网络，旋钮（权重 + 偏置）一共有多少个？",
      choices: ["11 个", "24 个", "33 个"],
      answer: 2,
      explain: "第一层权重 2 × 8 = 16，偏置 8，输出权重 8，输出偏置 1，一共 33 个。",
      review: "s2",
    },
    {
      q: "学习率设得太大（比如 1），这个神经网络会怎样？",
      choices: ["损失乱跳，训练失败", "更快达到 100%", "没有变化"],
      answer: 0,
      explain: "步子太大会冲过谷底弹飞（第 22 章）。到“动手试试”里验证一下吧。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第 27 章 Part 2 Boss 战",
    boss: "Part 2 Boss 战",
    map: "火锅店地图：60 家店",
    self: "边界由神经网络自己找！",
    spicy: "辣度",
    line: "排队",
    example: "示意数据",
    netTitle: "小小神经网络",
    in1: "辣度",
    in2: "排队",
    out: "好吃分数",
    rule: "超过 0.5 就算好吃",
    knobs: "33 个旋钮",
    random: "一开始随便设",
    loopTitle: "训练循环",
    l1: "① 前向传播",
    l2: "② 损失",
    l3: "③ 反向传播",
    l4: "④ 调整",
    l1s: "第 19 章",
    l2s: "第 20 章",
    l3s: "第 23 章",
    l4s: "第 21 · 22 章",
    center: "小批量 × 轮",
    centerS: "第 24 章",
    epoch: "轮数",
    acc: "准确率",
    lossT: "损失",
    trainTitle: "训练中",
    valTitle: "没见过的 30 家店",
    valOk: "验证：30 家全对！",
    learned: "不是背下来，而是学会了规律",
    gptTitle: "GPT 也一样，只是大得多",
    rowBoss: "Boss 战神经网络",
    rowGpt: "GPT-3",
    colKnobs: "旋钮",
    colData: "训练数据",
    bossKnobs: "33 个",
    bossData: "60 家店",
    gptKnobs: "1750 亿个",
    gptData: "3000 亿个词元",
    done: "Part 2 学习工具齐了！",
    next: "下一站：Part 3 把文字变成数字",
  },
};
