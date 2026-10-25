import { DECAY, EMPTY, GIST, WORD_VEC, rnnRun, type Note } from "../../../data/ch40";
import type { ChapterSpec } from "../../../data/types";

// zh: 11 words again; only 昨天 writes the 时间 slot, so every number matches the Korean chapter
export const LONG = ["昨天", "我", "和朋友", "一起", "坐", "公交车", "冒着", "大雨", "穿过", "小路", "最后"];
export const LONG_NOTES = rnnRun(LONG);

/** toy LSTM (示意用): important slots go into a storage box (cell) that is not squashed again each step, so they fade much more slowly. */
export const LSTM_KEEP = 0.95;
export function lstmRun(words: string[], keep = LSTM_KEEP) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) {
    const x = WORD_VEC[w] ?? [0, 0, 0];
    const h = n.h.map((v, i) => Math.max(-1, Math.min(1, keep * v + Math.tanh(x[i])))) as [number, number, number];
    const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
    notes.push((n = { h, gist }));
  }
  return notes;
}
export const LONG_LSTM = lstmRun(LONG);

/** backprop's blame signal shrinking by the same factor at every step back (ch23) */
export const BACK = Array.from({ length: LONG.length }, (_, k) => DECAY ** k);

/** words handed to GPUs in s6 */
export const GPU_WORDS = LONG.slice(0, 6);

/** playground: words placed between 昨天 and 最后 (repeats when longer) */
export const FILLERS = ["我", "和朋友", "一起", "坐", "公交车", "冒着", "大雨", "穿过", "小路", "慢慢地", "走过", "一座", "小桥"];
export const sentenceWith = (middle: number) => ["昨天", ...Array.from({ length: middle }, (_, i) => FILLERS[i % FILLERS.length]), "最后"];

export const ch41: ChapterSpec = {
  id: 41,
  part: 4,
  title: "RNN 的局限",
  core: true,
  hook: "既然传纸条接力这么好，为什么 ChatGPT 不用 RNN？",
  steps: [
    { id: "s1", sec: 10, narration: "这次是个长句子。“昨天 我 和朋友 一起 …… 最后”后面应该是“去了”，因为开头有“昨天”。" },
    { id: "s2", sec: 9, narration: "纸条每传一格，“昨天”就淡一点。传过 11 格以后，字几乎看不见了。" },
    { id: "s3", sec: 10, narration: "所以只看最后一张纸条的 RNN 选了“去”。它没抓住相隔很远的词之间的关系，也就是长期依赖。" },
    { id: "s4", sec: 10, narration: "训练时也有问题。把误差的责任（第 23 章）往回传时，每一格也会变小，到 10 格之前只剩 0.11 倍。" },
    { id: "s5", sec: 11, narration: "1997 年的 LSTM 给纸条加了保管箱和门，让重要的内容不那么快变淡。可是文章很长时，最后还是会模糊。" },
    { id: "s6", sec: 11, narration: "第二个问题是排队。第 2 格要等第 1 格的纸条到了才能开始。其他 GPU 只能排队干等。" },
    { id: "s7", sec: 10, narration: "GPU 的特长是同时做很多计算（第 68 章）。可如果有 1,000 个词，就得按顺序算 1,000 次。" },
    { id: "s8", sec: 11, narration: "总结一下：RNN 的纸条会变淡，还得排队等。Transformer 把两个问题都解决了（Part 5）。在那之前，先看第 42 章的翻译器。" },
  ],
  playgroundTitle: "记忆力实验室",
  playgroundIntro: "在“昨天”和“最后”之间放进越来越多的词。看看 RNN 的纸条上“昨天”还剩多少，换成 LSTM 又会怎样。",
  summary: [
    "局限 ①：纸条每传一格就变淡，抓不住相隔很远的词之间的关系（长期依赖）。",
    "1997 年的 LSTM 靠保管箱和门记得更久，但文章很长时还是会模糊。",
    "局限 ②：前一格算完才能算下一格，GPU 只能排队等。",
  ],
  unlocks: "长期依赖",
  unlockLabel: "收集到一张历史卡片",
  quiz: [
    {
      q: "在长句子末尾，RNN 会忘掉最前面的“昨天”，原因是？",
      choices: ["每传一次纸条，旧内容就淡一点", "它不认识“昨天”这个词", "句子太短"],
      answer: 0,
      explain: "每一格都把旧纸条乘上一个小于 1 的数再抄过去，传得越远就越模糊。",
      review: "s2",
    },
    {
      q: "1997 年出现的 LSTM，想法是？",
      choices: ["把词倒过来读", "给纸条加上保管箱和门，把重要的内容保存得更久", "干脆不用纸条"],
      answer: 1,
      explain: "有决定保留什么、擦掉什么的门（gate），重要的内容就不那么快变淡。",
      review: "s5",
    },
    {
      q: "训练 RNN 时 GPU 会闲着，原因是？",
      choices: ["GPU 不懂中文", "词太少", "要等前一格的纸条到了，才能算下一格"],
      answer: 2,
      explain: "各格只能按顺序计算，发挥不了 GPU 同时计算的特长。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 41 章 RNN 的局限",
    far: "隔了足足 11 格",
    survive: "纸条上的“昨天”能留到最后吗？",
    answer: "答案是“去了”（因为开头有“昨天”）",
    strength: "纸条里“昨天”的浓淡",
    faded: "11 格以后几乎看不见",
    wrong: "昨天却选“去”？！",
    longdep: "长期依赖（long-term dependency）",
    longdepD: "相隔很远的词之间的关系",
    blame: "责任信号（第 23 章 反向传播）",
    back: "← 往回传",
    barely: "责任几乎传不到前面",
    lstm: "1997 LSTM",
    lstmD: "保管箱 + 门（gate）",
    rnnBars: "RNN",
    lstmBars: "LSTM",
    still: "可是太长了还是会模糊",
    queue: "排队等待的 GPU",
    working: "计算中",
    waiting: "等待中",
    zzz: "zzz",
    done: "完成",
    wait: "前一格算完，下一格才能开始",
    gpu: "GPU",
    special: "GPU 的特长 = 同时计算（第 68 章）",
    seq: "RNN：依次算",
    par: "如果同时算",
    time: "时间",
    thousand: "1,000 个词 = 按顺序算 1,000 次",
    sumTitle: "RNN 的两个局限",
    sum1: "① 纸条会变淡",
    sum1d: "抓不住长期依赖",
    sum2: "② 排队等",
    sum2d: "GPU 没法同时用",
    fix: "Transformer 把两个都解决了（Part 5）",
    next: "在那之前，第 42 章：翻译器的结构",
    toy: "* 示意用的玩具模型",
  },
};
