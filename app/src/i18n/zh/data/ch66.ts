import type { ChapterSpec, Highlighter } from "../../../data/types";

export const CANDS: { w: string; c: Highlighter }[] = [
  { w: "学校", c: "yellow" },
  { w: "图书馆", c: "mint" },
  { w: "公园", c: "sky" },
  { w: "其他", c: "violet" },
];

/** A mini model whose only numbers are the four scores (示意数据). It starts out wrong:
 *  ch01's probabilities with 学校 and 公园 swapped. Scores are ln(p) + 3 (shifting all scores changes nothing, 第 14 章). */
export const START_P = [0.12, 0.21, 0.52, 0.15];
export const START_Z = START_P.map((p) => Math.log(p) + 3);
export const LR = 1;

export const softmax66 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** 惊讶 in halvings, as in 第 65 章. */
export const surprise66 = (p: number) => Math.log2(1 / p);

/** 责任 of each score: probability minus 1 for the right answer, minus 0 for the rest. */
export const blameOf = (p: number[], target: number) => p.map((v, i) => v - (i === target ? 1 : 0));

export type Lap = { z: number[]; p: number[]; loss: number; blame: number[] };

/** Run the loop: lap k holds the scores before its update. */
export function runLaps(z0: number[], target: number, n: number, lr = LR): Lap[] {
  const laps: Lap[] = [];
  let z = [...z0];
  for (let k = 0; k < n; k++) {
    const p = softmax66(z);
    const blame = blameOf(p, target);
    laps.push({ z, p, loss: surprise66(p[target]), blame });
    z = z.map((v, i) => v - lr * blame[i]);
  }
  return laps;
}

export const LAPS = runLaps(START_Z, 0, 4);

export const STATIONS = [
  { n: "① 预测", ref: "第 19 章", c: "yellow" as Highlighter },
  { n: "② 损失", ref: "第 20、65 章", c: "pink" as Highlighter },
  { n: "③ 反向传播", ref: "第 23 章", c: "violet" as Highlighter },
  { n: "④ 更新", ref: "第 21、22 章", c: "mint" as Highlighter },
];

export const ch66: ChapterSpec = {
  id: 66,
  part: 7,
  title: "训练循环转一圈",
  core: true,
  hook: "几千亿道题，GPT 是按什么顺序学的？",
  steps: [
    { id: "s1", sec: 9, narration: "把学过的零碎知识串起来。GPT 是在一个四步组成的循环里，一圈又一圈地学习的。" },
    { id: "s2", sec: 11, narration: "① 预测。放进“我 今天 去”，算出下一个片段的概率（第 19 章）。一开始数字一团乱，“学校”只有 12%。" },
    { id: "s3", sec: 10, narration: "② 损失。用给正确答案“学校”的概率来测惊讶（第 65 章）。只给了 12%，所以惊讶高达 3.06。" },
    { id: "s4", sec: 11, narration: "③ 反向传播。把损失倒着传回去，给每个数字分责任（第 23 章）。要调高“学校”的分数，调低“公园”的分数。" },
    { id: "s5", sec: 11, narration: "④ 更新。按责任把数字改一点点。改多大由学习率决定（第 22 章）。这里学习率是 1。" },
    { id: "s6", sec: 10, narration: "然后回到 ①。每转一圈，“学校”的概率就升到 32%、55%、69%，惊讶一路往下降。" },
    { id: "s7", sec: 11, narration: "真正的 GPT 把很多题打成一批（第 24 章），转上非常多圈，一点点修改 1750 亿个数字。这就是预训练。" },
  ],
  playgroundTitle: "转动训练循环",
  playgroundIntro: "按顺序点 ① → ② → ③ → ④ 按钮，让迷你模型一圈一圈地学习。目标：把惊讶降到 0.5 以下。",
  summary: [
    "① 预测（前向传播）→ ② 损失（惊讶）→ ③ 反向传播（分责任）→ ④ 更新（改数字）。",
    "每转一圈，正确答案的概率上升，损失下降。",
    "把这个循环转上非常多圈，修改 1750 亿个数字 = 预训练。",
  ],
  unlocks: "预训练",
  quiz: [
    {
      q: "训练循环的正确顺序是？",
      choices: ["损失 → 预测 → 更新 → 反向传播", "预测 → 损失 → 反向传播 → 更新", "更新 → 预测 → 反向传播 → 损失"],
      answer: 1,
      explain: "先给出答案（预测），测出错了多少（损失），分好责任（反向传播），再改数字（更新）。",
      review: "s1",
    },
    {
      q: "反向传播这一步做的是什么？",
      choices: ["算出下一个片段的概率", "出新的题", "给每个数字分配对损失的责任"],
      answer: 2,
      explain: "把损失倒着传回去，算出每个数字该负多少责任、该往哪个方向改（第 23 章）。",
      review: "s4",
    },
    {
      q: "循环转完一圈后，通常会怎样？",
      choices: ["正确答案的概率上升，损失下降", "正确答案的概率和损失都上升", "什么都不变"],
      answer: 0,
      explain: "更新让正确答案的分数变高，再做同一道题时就没那么惊讶了。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 66 章 训练循环转一圈",
    lap: "转一圈",
    repeat: "反复无数次！",
    again: "回到 ①",
    gpt: "GPT",
    ctx1: "我",
    ctx2: "今天",
    ctx3: "去",
    example: "示意数据",
    mess: "一开始一团乱：“学校”只有 12%",
    lateFirst: "“公园”第一？！",
    lossIs: "惊讶 = 损失",
    lossNote: "正确答案只给了 12% → 惊讶 3.06",
    colW: "候选",
    colZ: "分数",
    colB: "责任",
    colNew: "新分数",
    up: "↑ 调高",
    down: "↓ 调低",
    blameRule: "责任 = 概率 −（正确答案为 1，否则为 0）",
    backward: "把损失倒着传",
    real: "在真正的 GPT 里，责任会一直传到 1750 亿个数字",
    update: "新分数 = 分数 − 学习率 × 责任",
    lr: "学习率 1",
    mini: "示意用的迷你模型：只改 4 个分数",
    probGo: "“学校”的概率",
    lossTitle: "惊讶（损失）",
    lap0: "开始",
    lap1: "第 1 圈",
    lap2: "第 2 圈",
    lap3: "第 3 圈",
    many: "1750 亿个数字",
    pretrain: "预训练",
    batch: "把很多题打成一批（第 24 章）",
    loopAll: "预测 → 损失 → 反向传播 → 更新，反复！",
  },
};
