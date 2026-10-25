import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a toy RNN (示意用的玩具模型), shared with ch41–42 ---
// zh: Chinese verbs do not change for tense, but the time word still decides the form that follows: 昨天 … 去了,
// 明天 … 要去, otherwise 去. The relay reads 昨天 / 我 / 和朋友 (when / who / with whom); the numbers are unchanged.
// The note (hidden state) has three slots. Each word writes into a slot; the old note is copied a little fainter.
// new note = squash(0.8 × old note + word), squash = tanh (keeps every number between −1 and 1).
export const SLOTS = ["时间", "谁", "和谁"] as const;
export const DECAY = 0.8;
export const WORD_VEC: Record<string, [number, number, number]> = {
  昨天: [-2, 0, 0],
  明天: [2, 0, 0],
  我: [0, 2, 0],
  小雨: [0, 1, 0],
  和朋友: [0, 0, 2],
};
/** what each word writes on the note, in words */
export const GIST: Record<string, string> = { 昨天: "昨天", 明天: "明天", 我: "我", 小雨: "小雨", 和朋友: "朋友" };
export type Note = { h: [number, number, number]; gist: [string, string, string] };
export const EMPTY: Note = { h: [0, 0, 0], gist: ["", "", ""] };

/** One relay step of the toy RNN. `keep` is how much of the old note survives (0.8 here; ch41's LSTM mode keeps more). */
export function rnnStep(n: Note, w: string, keep = DECAY): Note {
  const x = WORD_VEC[w] ?? [0, 0, 0];
  const h = n.h.map((v, i) => Math.tanh(keep * v + x[i])) as [number, number, number];
  const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
  return { h, gist };
}

export function rnnRun(words: string[], keep = DECAY) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) notes.push((n = rnnStep(n, w, keep)));
  return notes;
}

export const VERBS: { w: string; c: Highlighter }[] = [
  { w: "去了", c: "mint" },
  { w: "去", c: "yellow" },
  { w: "要去", c: "sky" },
];
/** next-word probabilities from the last note: past ↔ future is read from the 时间 slot */
export function predictVerb(h: readonly number[]) {
  const s = [-4 * h[0], 1, 4 * h[0]];
  const ex = s.map(Math.exp);
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

export const RELAY = ["昨天", "我", "和朋友"];
export const RELAY_B = ["明天", "我", "和朋友"];
export const LENGTHS = [
  ["我", "去", "学校"],
  ["昨天", "我", "和朋友", "去了"],
  ["昨天", "我", "和朋友", "一起", "坐", "公交车", "去了"],
];

export const ch40: ChapterSpec = {
  id: 40,
  part: 4,
  title: "RNN：传纸条接力",
  core: false,
  hook: "句子有长有短，AI 怎么一边读一边记住前面的内容？",
  steps: [
    { id: "s1", sec: 10, narration: "第 39 章的神经网络只看前三个词，可句子有长有短。于是有了新想法：一个词一个词地读，把要点写在纸条上传下去！" },
    { id: "s2", sec: 10, narration: "每一格放一个词。每一格接过前一格传来的纸条，看看现在的词，改写一下，再传给下一格。" },
    { id: "s3", sec: 11, narration: "“昨天”写进“时间”栏，“我”写进“谁”栏，“和朋友”写进“和谁”栏。前面的内容会抄得淡一点。" },
    { id: "s4", sec: 10, narration: "每一格改写的规则都一样：旧纸条乘 0.8，加上现在的词，再压到 −1 和 1 之间。" },
    { id: "s5", sec: 11, narration: "只看最后一张纸条来猜下一个词。纸条上还留着“昨天”，所以“去了”是 70%。这张纸条叫隐藏状态。" },
    { id: "s6", sec: 10, narration: "只把第一个词换成“明天”，这次“要去”是 70%。最前面的词顺着纸条一直传到了最后。" },
    { id: "s7", sec: 11, narration: "展开是接力，折起来就是同一台机器在转圈。所以它叫循环神经网络，RNN。句子再长也没关系。" },
  ],
  playgroundTitle: "纸条接力",
  playgroundIntro: "一个一个放词，拼成句子。每放进一个词，纸条上的三栏就会被改写，最后用这张纸条猜下一个词。",
  summary: [
    "RNN：一个词一个词地读，改写纸条（隐藏状态）再传给下一格。",
    "每一格都用同样的规则（同样的权重），所以句子长短都可以。",
    "用最后一张纸条猜下一个词。最前面的词也能顺着纸条传到最后。",
  ],
  unlocks: "RNN 隐藏状态",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "RNN 里被叫作“纸条”的东西，正式名称是？",
      choices: ["损失", "隐藏状态", "词元"],
      answer: 1,
      explain: "它是把读过的内容浓缩起来的一串数字（向量）。因为不直接露在外面，所以叫隐藏（hidden）状态。",
      review: "s5",
    },
    {
      q: "RNN 的各格改写纸条的规则是？",
      choices: ["每一格都用同样的规则", "每一格规则不同", "只有最后一格有规则"],
      answer: 0,
      explain: "同一台机器（同样的权重）对每个词重复使用，所以不管句子多长都能用。",
      review: "s4",
    },
    {
      q: "“昨天 我 和朋友”后面，RNN 能选出“去了”，原因是？",
      choices: ["最后的“和朋友”本身就表示过去", "随便选的", "最前面“昨天”的痕迹留在纸条上，一直传到了最后"],
      answer: 2,
      explain: "读“昨天”时写下的内容虽然一点点变淡，但一直留到了最后一张纸条上。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 40 章 RNN：传纸条接力",
    window: "前 3 个词的窗口",
    fixed: "窗口大小固定，句子却有长有短",
    idea: "一个词一个词地读，写在纸条上传下去！",
    cell: "RNN 格",
    empty: "空白纸条",
    same: "每一格规则都一样",
    rule: "新纸条 = 压一压（ 0.8 × 旧纸条 + 现在的词 ）",
    squash: "压一压 = 压到 −1 和 1 之间",
    example: "时间栏：",
    toy: "* 示意用的玩具模型：实际上乘的不是 0.8，而是训练出来的权重矩阵（第 11 章）",
    lastNote: "最后的纸条 → 下一个词",
    hidden: "纸条 = 隐藏状态（hidden state）",
    carried: "最前面的词一直传到了最后",
    unrolled: "展开是接力",
    folded: "折起来是一个圈",
    rnn: "循环神经网络（RNN）",
    rnnEn: "Recurrent Neural Network",
    anyLen: "句子再长都没问题",
    next: "第 41 章：RNN 的局限",
    note: "纸条",
    dot: "·",
    gists: "昨天明天我朋友小雨",
  },
};
