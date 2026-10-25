import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A toy corpus: each word with how many times it appeared. Pieces start as single syllables. */
export type Corpus = { w: string; n: number }[];
export type Pair = { a: string; b: string; n: number };

// zh: the same shape as the Korean diary (stem + ending, four characters each), so the numbers stay the same.
// merges checked by running this file's runBpe: 完了 9 → 学习 7 → 运动 6 → 一下 5, pieces 56 → 47 → 40 → 34 → 29
export const DIARY: Corpus = [
  { w: "学习完了", n: 4 },
  { w: "运动完了", n: 4 },
  { w: "学习一下", n: 3 },
  { w: "运动一下", n: 2 },
  { w: "打扫完了", n: 1 },
];
// playground corpus: first merges 学校 8 → 朋友 7 → 去学校 5 → 食堂 5 …
export const SCHOOL: Corpus = [
  { w: "去学校", n: 5 },
  { w: "在学校", n: 3 },
  { w: "去食堂", n: 3 },
  { w: "在食堂", n: 2 },
  { w: "好朋友", n: 4 },
  { w: "老朋友", n: 3 },
  { w: "好吃的", n: 3 },
  { w: "好玩的", n: 2 },
  { w: "同学们", n: 2 },
  { w: "老师们", n: 1 },
];

export const split0 = (w: string) => [...w];

/** Count neighbouring pairs, most frequent first (ties keep first-seen order). */
export function countPairs(pieces: string[][], corpus: Corpus): Pair[] {
  const m = new Map<string, Pair>();
  pieces.forEach((ps, i) => {
    for (let k = 0; k + 1 < ps.length; k++) {
      const key = `${ps[k]}\u0000${ps[k + 1]}`;
      const p = m.get(key) ?? { a: ps[k], b: ps[k + 1], n: 0 };
      p.n += corpus[i].n;
      m.set(key, p);
    }
  });
  return [...m.values()].sort((x, y) => y.n - x.n);
}

export function applyMerge(ps: string[], a: string, b: string) {
  const out: string[] = [];
  for (let k = 0; k < ps.length; k++) {
    if (k + 1 < ps.length && ps[k] === a && ps[k + 1] === b) {
      out.push(a + b);
      k++;
    } else out.push(ps[k]);
  }
  return out;
}

export const totalPieces = (pieces: string[][], corpus: Corpus) => pieces.reduce((s, ps, i) => s + ps.length * corpus[i].n, 0);

/** Run BPE for `steps` merges; returns the pieces after each stage (stage 0 = single syllables). */
export function runBpe(corpus: Corpus, steps: number) {
  const stages = [corpus.map((c) => split0(c.w))];
  const merges: Pair[] = [];
  for (let s = 0; s < steps; s++) {
    const cur = stages[stages.length - 1];
    const top = countPairs(cur, corpus)[0];
    if (!top) break;
    merges.push(top);
    stages.push(cur.map((ps) => applyMerge(ps, top.a, top.b)));
  }
  return { stages, merges };
}

/** Cut new text with learned merges, applied in the order they were learned. */
export function encode(text: string, merges: { a: string; b: string }[]) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => merges.reduce((ps, m) => applyMerge(ps, m.a, m.b), split0(w)));
}

export const SCENE_BPE = runBpe(DIARY, 4);
export const MERGE_COLORS: Highlighter[] = ["yellow", "sky", "mint", "pink"];
export const NEW_WORDS = ["跑步完了", "打扫一下"];

export const ch30: ChapterSpec = {
  id: 30,
  part: 3,
  title: "把常挨在一起的片段合并",
  core: false,
  hook: "词表里有 20 万块，难道是有人一块一块定出来的？",
  steps: [
    { id: "s1", sec: 8.5, narration: "词表不是人定的。先收集大量文字，再把经常挨在一起出现的片段合并起来。这个方法叫 BPE。" },
    { id: "s2", sec: 7.5, narration: "用日记里的五个词来试试。一开始每个字都是一块。把出现次数也算上，一共 56 块。" },
    { id: "s3", sec: 7.5, narration: "现在把挨着的两块配成对，数一数。“完”和“了”挨在一起的次数最多，有 9 次。" },
    { id: "s4", sec: 7, narration: "把最多的那一对合成一块，放进词表。现在“完了”是一个新词元，块数减少到 47。" },
    { id: "s5", sec: 8, narration: "再数一遍，再合并：学习、运动、一下。合并四次后，块数从 56 减少到 29。" },
    { id: "s6", sec: 8, narration: "没人教过它语法，“学习”和“完了”却各自成了一块。它只是数了数哪些组合经常出现。" },
    { id: "s7", sec: 7.5, narration: "所以第一次见到的“跑步完了”也能用认识的块来切：跑、步、完了。“打扫一下”是打、扫、一下。" },
    { id: "s8", sec: 8, narration: "GPT-4o 的分词器也是这样合并出约 20 万块的，所以“学校”“学生”“学习”都成了整块。" },
  ],
  playgroundTitle: "合并工厂",
  playgroundIntro: "找出出现次数最多的一对，点一下，它们就会合成一个新词元。做完以后，在下面的框里写一个词，用你的分词器切切看。",
  summary: [
    "BPE：在一大堆文字里，把最常挨在一起出现的一对合并成一块。",
    "不断重复“数一数、合一合”，直到词表达到想要的大小。",
    "常见的组合变成一块，第一次见的词也能用认识的块切开。",
  ],
  unlocks: "BPE",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "BPE 每次合并哪一对？",
      choices: ["意思最重要的一对", "在文字里最常挨在一起出现的一对", "按拼音排在最前面的一对"],
      answer: 1,
      explain: "它不懂意思，只是数一数，把次数最多的一对合并。",
      review: "s3",
    },
    {
      q: "不断合并下去，整份文字的块数会怎样？",
      choices: ["变多", "不变", "变少"],
      answer: 2,
      explain: "两块变成一块，所以会变少。例子里从 56 块减少到 29 块。",
      review: "s5",
    },
    {
      q: "学会了“完了”的分词器，第一次遇到“跑步完了”会怎么做？",
      choices: ["切成 跑 + 步 + 完了", "读不了，停下来", "整个当成一块"],
      answer: 0,
      explain: "认识的“完了”合成一块，其余的保留为单字。没有读不了的词。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 30 章 把常挨在一起的片段合并",
    title: "BPE：把常挨在一起的一对合并",
    sub: "Byte Pair Encoding",
    often: "常常一起出现 → 合成一块",
    corpus: "日记里收集的词（示意数据）",
    pieces: "块数",
    pairs: "数对子",
    vocab: "新的词元表",
    times: "次",
    most: "最多！",
    merge: "合并",
    noGrammar: "不懂语法也能",
    noGrammar2: "学习 + 完了！",
    justCount: "只是数了数而已",
    newWord: "第一次见的词",
    known: "用认识的块来切",
    knownList: "认识的块：",
    real: "真正的 GPT-4o 分词器",
    realSrc: "用 o200k_base 切出的结果",
    size: "这样合并出约 20 万块",
    bytes: "* 真正的分词器从比字还小的字节开始合并（第 28 章）",
    x: "×",
    arrow: "→",
  },
};
