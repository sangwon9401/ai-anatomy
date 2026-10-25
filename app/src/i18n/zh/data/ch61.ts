import { percents } from "../../../data/ch45";
import { ffn } from "../../../data/ch55";
import { UNLOCK6 } from "./ch54";
import { layerNorm } from "../../../data/ch57";
import { LAST_VEC, LOGITS, REST_N, outputProbs } from "../../../data/ch60";
import type { ChapterSpec } from "../../../data/types";
import { PIPELINE } from "../../../data/ch05";
import { KIND } from "../../../data/part6-block";

// The whole forward pass of 我 今天 去 → 学校 with toy 4-number vectors (示意数据).
// Every stage is rounded to one decimal before the next, so the sums on screen add up exactly.
const r1 = (v: number) => Math.round(v * 10) / 10;

export const TOKENS = ["我", "今天", "去"];
/** 示意编号 (a real tokenizer gives other numbers and may cut the sentence differently) */
export const IDS = [1043, 2517, 8820];
export const EMB = [
  [0.8, -0.2, 0.1, 0.4],
  [-0.1, 0.9, 0.2, -0.3],
  [0.2, 0.1, 0.9, 0.6],
];
export const POS = [
  [0.2, 0.1, 0.0, 0.1],
  [0.1, 0.2, 0.1, 0.0],
  [0.0, 0.1, 0.2, 0.1],
];
export const X0 = EMB.map((e, i) => e.map((v, k) => r1(v + POS[i][k])));

/** attention scores; each word only sees itself and the words before it (第 51 章) */
const SCORES = [[0], [0.5, 0.9], [0.6, 0.8, 1.2]];
export const ATT_W = SCORES.map((row) => {
  const ex = row.map(Math.exp);
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
});
export const ATT_PCT = ATT_W.map((w) => percents(w));
const MIX = ATT_W.map((w) => [0, 1, 2, 3].map((k) => w.reduce((a, wj, j) => a + wj * X0[j][k], 0)));
export const D_ATT = MIX.map((m) => m.map((v) => r1(0.5 * v)));
export const X1 = X0.map((x, i) => x.map((v, k) => r1(v + D_ATT[i][k])));
export const D_FFN = X1.map((x) => ffn(layerNorm(x).z).y.map((v) => r1(0.4 * v)));
export const X2 = X1.map((x, i) => x.map((v, k) => r1(v + D_FFN[i][k])));
/** after all 96 layers (示意数据); the last one is the vector 第 60 章 scores */
export const FINAL = [[1.3, -0.8, 0.9, 1.6], [-0.5, 2.4, 0.7, 0.4], LAST_VEC];

export const OUT = outputProbs(LOGITS.map((l) => l.s));
export const OUT_PCT = percents([...OUT.p, OUT.restP]);
export { LOGITS, REST_N };

/** The stations of the trip, in order (used by the scene's header and the playground).
 * Part names come from the ch05 blueprint and the Part 6 block, so they always match those drawings. */
const nm = (k: string) => PIPELINE.find((p) => p.key === k)!.name;
const B = "模块：";
export const STATIONS = [
  { key: "tok", name: nm("tok"), where: "第 29 章", color: "sky" },
  { key: "emb", name: nm("emb"), where: "第 33 章", color: "sky" },
  { key: "pos", name: nm("pos"), where: "第 36 章", color: "sky" },
  { key: "att", name: `${B}${KIND.norm.name} → ${KIND.att.name}`, where: "第 57、45 章", color: "yellow" },
  { key: "add", name: `${B}${KIND.add.name}`, where: "第 56 章", color: "yellow" },
  { key: "ffn", name: `${B}${KIND.norm.name} → ${KIND.ffn.name} → ${KIND.add.name}`, where: "第 55 章", color: "yellow" },
  { key: "x96", name: "模块 × 96 层", where: "第 58 章", color: "yellow" },
  { key: "out", name: "输出：打分", where: "第 60 章", color: "mint" },
  { key: "soft", name: "Softmax", where: "第 14 章", color: "mint" },
  { key: "loop", name: nm("loop"), where: "第 1、2 章", color: "mint" },
] as const;

export const ch61: ChapterSpec = {
  id: 61,
  part: 6,
  title: "从头到尾走一遍",
  core: true,
  hook: "ChatGPT 写出一个词的时候，里面到底发生了什么？",
  steps: [
    { id: "s1", sec: 8, narration: "把“我 今天 去”放进我们组装好的 GPT，从头到尾跟着它走一遍。" },
    { id: "s2", sec: 8.5, narration: "首先，分词器把文字切成片段（词元），每个词元都对应词表里的一个编号（第 29 章）。" },
    { id: "s3", sec: 10, narration: "嵌入按编号取出一串带着意思的数字。在 GPT-3 里，一个词元就是 12,288 个数字（第 33 章）。" },
    { id: "s4", sec: 9.5, narration: "再加上表示“第几个”的位置信息（第 36 章）。现在，3 个向量进入模块。" },
    { id: "s5", sec: 10.5, narration: "进入模块。先归一化，再做注意力！“去”看向前面的“我”“今天”和它自己（第 45 章）。" },
    { id: "s6", sec: 9, narration: "把看过之后混合来的结果，加到高速公路上原来的向量上（第 56 章）。数字是不是变了一点？" },
    { id: "s7", sec: 9.5, narration: "再做一次归一化，前馈网络给每个词加上思考。这个结果也加回原来的向量（第 55 章）。" },
    { id: "s8", sec: 9.5, narration: "这就是模块的一层。同样的事重复 96 层，每个向量里就会一层层积累起上下文（第 58 章）。" },
    { id: "s9", sec: 10, narration: "用走出 96 层的“去”的向量，给 50,257 个词元打分。学校 3.0，图书馆 2.1，公园 1.5（第 60 章）。" },
    { id: "s10", sec: 9.5, narration: "用 Softmax 变成概率：学校 52%，图书馆 21%，公园 12%。全部加起来是 100%（第 14 章）。" },
    { id: "s11", sec: 9, narration: "按概率抽出一个：“学校”！接到句子末尾，就成了“我今天去学校”（第 1 章）。" },
    { id: "s12", sec: 10, narration: "然后把这句话送回最上面，生成下一个词元（第 2 章）。ChatGPT 的回答全是这样一趟趟走出来的。" },
  ],
  playgroundTitle: "一步一步跟着走",
  playgroundIntro: "按“下一个部件”，把“我 今天 去”送进 GPT。到了注意力那一步，点一点词，看看它在看谁。",
  summary: [
    "分词器 → 嵌入 + 位置信息 → [归一化·注意力·相加·归一化·前馈网络·相加] × 96 → 输出 + Softmax → 抽取并接上。",
    "词向量每经过一层，就多加一点上下文；最后一个词的向量决定下一个词。",
    "生成一个词元 = 走一趟这段旅程。接好的句子再从头开始。",
  ],
  unlocks: "完整的前向传播",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "“我 今天 去”经过 GPT 的顺序，哪个是对的？",
      choices: [
        "嵌入 → 分词器 → 模块 → 位置信息 → Softmax",
        "分词器 → 嵌入 + 位置信息 → 模块 × 96 → 输出 + Softmax",
        "模块 × 96 → 分词器 → Softmax → 嵌入",
      ],
      answer: 1,
      explain: "先把文字切开（分词器），变成数字（嵌入 + 位置），经过 96 层模块，最后把分数变成概率。",
      review: "s1",
    },
    {
      q: "在模块里，让“去”去看前面那些词的部件是哪个？",
      choices: ["注意力", "前馈网络", "Softmax"],
      answer: 0,
      explain: "注意力看着前面的词，把意思混合过来（第 45 章）。前馈网络是每个词各自思考。",
      review: "s5",
    },
    {
      q: "抽出下一个词接上之后，会发生什么？",
      choices: ["就此结束", "由人来修改答案", "把变长的句子再送回最上面"],
      answer: 2,
      explain: "用接好的句子再从头走一趟，生成再下一个词元（第 2 章 自回归）。",
      review: "s12",
    },
  ],
  labels: {
    tag: "第 61 章 从头到尾走一遍",
    title: "从头到尾走一遍",
    sentence: "我今天去",
    q: "?",
    arrow: "→",
    idToy: "编号是示意数据",
    vocab: "词表（50,257 个词元）",
    vdots: "⋮",
    table: "嵌入表：50,257 行 × 12,288 列",
    lookup: "取出编号那一行",
    real: "真正的有 12,288 个数字",
    toy: "示意数据",
    nth: " 号位",
    posNote: "+ 第几个",
    toBlock: "进入模块！",
    norm: "归一化",
    looks: "“去”看向各个词的比例",
    mask: "帘子（第 51 章）",
    addNote: "把混合来的结果加回原来的向量",
    ffn: "前馈网络",
    ffnNote: "每个词各自加上思考",
    layer: " 层",
    same: "同样的事做 96 次",
    lastVec: "走出 96 层的“去”",
    compare: "和每个词元比较（第 9 章）",
    rest: "其余",
    restN: "50,253 个",
    restScore: "约 −9.1",
    pt: " 分",
    total: "总和 = 100%",
    pick: "抽！",
    again: "再回到最上面",
    oneWord: "一个词元 = 走一趟这段旅程",
    all: "1750 亿个数字全都参与计算",
    w4: "学校",
  },
};
