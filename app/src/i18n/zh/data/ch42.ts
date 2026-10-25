import { DECAY } from "../../../data/ch40";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** zh: the running example and its translation; EN_FROM = which Chinese word each English word comes from (names kept: KO = the source) */
export const KO = ["我", "今天", "去", "学校"];
export const EN = ["I", "go", "to", "school", "today"];
export const EN_FROM = [0, 2, 2, 3, 1];
export const KO_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

// --- toy bottleneck (示意用的玩具模型) ---
// Every phrase leaves a trace on the one summary note; the trace fades ×0.8 for each source word read after it (ch41).
// zh: Chinese puts the verb before the object (写了 数学作业), so the fixed verb is phrase 4; the per-phrase word
// counts are the Korean ones, and the same two phrases (昨天, 我) are lost.
// Traces weaker than KEEP_MIN are lost, and the decoder cannot write them.
export type Phrase = { ko: string; en: string; enPos: number; fixed?: boolean };
export const PHRASES: Phrase[] = [
  { ko: "昨天", en: "yesterday", enPos: 6 },
  { ko: "我", en: "I", enPos: 0 },
  { ko: "和朋友 一起", en: "with my friend", enPos: 3 },
  { ko: "在图书馆", en: "at the library", enPos: 4 },
  { ko: "写了", en: "did", enPos: 1, fixed: true },
  { ko: "数学 作业", en: "math homework", enPos: 2 },
];
export const KEEP_MIN = 0.3;
export const NOTE_SLOTS = 4;

const wordCount = (p: Phrase) => p.ko.split(" ").length;

/** strength of each chosen phrase's trace on the final note, and the decoder's output with lost phrases as "???" */
export function squeeze(on: boolean[], attention = false) {
  const chosen = PHRASES.map((p, i) => ({ p, i })).filter(({ i }) => on[i]);
  const words = chosen.reduce((a, { p }) => a + wordCount(p), 0);
  let after = words;
  const traces = chosen.map(({ p, i }) => {
    after -= wordCount(p);
    const s = DECAY ** after;
    return { i, p, s, kept: attention || s >= KEEP_MIN };
  });
  const out = [...traces].sort((a, b) => a.p.enPos - b.p.enPos).map((t) => (t.kept ? t.p.en : "???"));
  return { words, traces, out, lost: traces.filter((t) => !t.kept).map((t) => t.p.ko) };
}
export const ALL_ON = PHRASES.map(() => true);
export const FULL = squeeze(ALL_ON);
export const CORRECT = [...PHRASES].sort((a, b) => a.enPos - b.enPos).map((p) => p.en);

export const ch42: ChapterSpec = {
  id: 42,
  part: 4,
  title: "翻译器的结构",
  core: false,
  hook: "两种语言的语序和长度都不一样，AI 是怎么翻译的？",
  steps: [
    { id: "s1", sec: 10, narration: "“我今天去学校”译成英文是“I go to school today”。语序和词数都不一样，没法一个词一个词地换。" },
    { id: "s2", sec: 11, narration: "2014 年，苏茨克维（Sutskever）的团队把两个 RNN 接在一起：负责读的编码器和负责写的解码器，叫 seq2seq。" },
    { id: "s3", sec: 9, narration: "编码器一个词一个词地读中文，不断改写纸条。最后一张纸条装着整句话的意思。" },
    { id: "s4", sec: 10, narration: "解码器拿到这张纸条，一个词一个词地写英文。写出的词又会作为输入送回去，和第 2 章的自回归一样。" },
    { id: "s5", sec: 11, narration: "可是纸条的大小是固定的。不管四个词还是四十个词，整句话都得硬塞进同样大小的一张纸条里。" },
    { id: "s6", sec: 10, narration: "这就是瓶颈：所有意思都得挤过瓶子窄窄的脖子。所以句子越长，翻译就越差。" },
    { id: "s7", sec: 9, narration: "如果解码器每写一个词，都能回头再看原文呢？这个想法就是第 43 章的注意力。" },
  ],
  playgroundTitle: "硬塞进去",
  playgroundIntro: "选出要放进句子的部分。句子越长，那一张总结纸条上前面部分的痕迹就越淡，翻译里就会漏掉。",
  summary: [
    "seq2seq（2014）：编码器 RNN 负责读，解码器 RNN 一个词一个词地写。",
    "编码器把整句话装进一张大小固定的纸条（向量）传过去。",
    "瓶颈：句子越长，一张纸条越装不下，翻译就越差。",
  ],
  unlocks: "2014 seq2seq",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "seq2seq 翻译器里，编码器和解码器各做什么？",
      choices: ["编码器读原文装进纸条，解码器用这张纸条写译文", "两个都只读原文", "编码器写译文，解码器检查"],
      answer: 0,
      explain: "负责读的（编码器）和负责写的（解码器），是把两个 RNN 接起来的结构。",
      review: "s2",
    },
    {
      q: "解码器是怎么写英文的？",
      choices: ["一次写出所有词", "一个词一个词地写，写出的词再送回去当输入", "按中文的词序一个一个替换"],
      answer: 1,
      explain: "和第 2 章的自回归一样，一个词一个词地写，直到写出〈结束〉。",
      review: "s4",
    },
    {
      q: "seq2seq 的“瓶颈”是指？",
      choices: ["词典太小", "解码器太慢", "整句话必须硬塞进一张大小固定的纸条"],
      answer: 2,
      explain: "不管长短都只能用一张纸条传过去，句子越长，丢掉的意思越多。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 42 章 翻译器的结构",
    diff: "语序和词数都不一样",
    noOneByOne: "不能一个一个换",
    year: "2014 · 苏茨克维（Sutskever）的团队",
    s2s: "seq2seq",
    s2sD: "sequence to sequence：词串 → 词串",
    enc: "编码器",
    encD: "负责读的 RNN",
    dec: "解码器",
    decD: "负责写的 RNN",
    summary: "总结纸条",
    start: "〈开始〉",
    end: "〈结束〉",
    whole: "整句话的意思",
    auto: "写出的词再送回去（第 2 章 自回归）",
    fixed: "纸条大小永远一样",
    slots: "4 格数字",
    both: "短句子、长句子，都是 4 格数字",
    correct: "正确答案：",
    real: "* 实际上有几百到几千个数字，但大小固定这一点是一样的",
    squeeze: "塞！",
    bottleneck: "瓶颈（bottleneck）",
    longer: "越长翻译越差",
    longKo: "昨天 我 和朋友 一起 在图书馆 写了 数学 作业",
    demo: "* 示意用的玩具模型",
    lostLabel: "丢掉的意思",
    ask: "如果每写一个词都能回头看原文呢？",
    next: "第 43 章：注意力的诞生",
  },
};
