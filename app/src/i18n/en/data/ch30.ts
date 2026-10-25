import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A toy corpus: each word with how many times it appeared. Pieces start as single letters. */
export type Corpus = { w: string; n: number }[];
export type Pair = { a: string; b: string; n: number };

// en: the word list is the classic BPE example (low, lower, newest, widest); merges checked with the ch30 functions
// (scratch script i18n/en-g2/scripts/bpe_en.mts): es 9 → est 9 → lo 7 → low 7, pieces 79 → 70 → 61 → 54 → 47
export const DIARY: Corpus = [
  { w: "low", n: 5 },
  { w: "lower", n: 2 },
  { w: "newest", n: 6 },
  { w: "widest", n: 3 },
];
// playground's second word list: merges ea, in, ing, er, then the stems teach / read / play
export const SCHOOL: Corpus = [
  { w: "teacher", n: 4 },
  { w: "teaching", n: 3 },
  { w: "reader", n: 3 },
  { w: "reading", n: 4 },
  { w: "player", n: 2 },
  { w: "playing", n: 3 },
  { w: "helper", n: 1 },
  { w: "helping", n: 2 },
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

/** Run BPE for `steps` merges; returns the pieces after each stage (stage 0 = single letters). */
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
export const NEW_WORDS = ["lowest", "slower"];

export const ch30: ChapterSpec = {
  id: 30,
  part: 3,
  title: "Merging pieces that often go together",
  core: false,
  hook: "GPT-4o knows about 200,000 tokens. Did someone pick every one of them by hand?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Nobody writes the token list by hand. We gather lots of text and merge pieces that often appear together. This is BPE." },
    { id: "s2", sec: 9, narration: "Let's try it on a tiny word list. At first every letter is a piece. Counting how often each word appears, that's 79 pieces." },
    { id: "s3", sec: 7.5, narration: "Now count every pair of neighbors. 'e' followed by 's' shows up 9 times, the most of all." },
    { id: "s4", sec: 8, narration: "Merge the top pair into one piece and add it to the list. Now 'es' is a token, and we're down to 70 pieces." },
    { id: "s5", sec: 8, narration: "Count again, merge again: est, lo, low. After four merges, the 79 pieces have become 47." },
    { id: "s6", sec: 8, narration: "Nobody taught it grammar, yet the word 'low' and the ending 'est' became pieces. It only counted." },
    { id: "s7", sec: 8, narration: "So even a new word like 'lowest' can be cut into known pieces: low, est. And 'slower' becomes s, low, e, r." },
    { id: "s8", sec: 9, narration: "GPT-4o's tokenizer was made by merging like this, about 200,000 pieces. That's why 'schoolwork' becomes ' school' + 'work'." },
  ],
  playgroundTitle: "Merge factory",
  playgroundIntro: "Find the pair that appears most often and tap it. The pair merges into a new token. When you're done, type words below and cut them with your tokenizer.",
  summary: [
    "BPE: in a pile of text, merge the pair of pieces that appears together most often.",
    "Repeat counting and merging until the list is as big as you want.",
    "Common chunks become pieces, and even a new word can be cut into known pieces.",
  ],
  unlocks: "BPE",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "Which pair does BPE merge each time?",
      choices: ["The pair with the most important meaning", "The pair that appears together most often in the text", "The first pair in alphabetical order"],
      answer: 1,
      explain: "It doesn't know meaning. It just counts and merges the most frequent pair.",
      review: "s3",
    },
    {
      q: "As the merges repeat, the total number of pieces in the text…",
      choices: ["goes up", "stays the same", "goes down"],
      answer: 2,
      explain: "Two pieces become one, so the total goes down. In the example, 79 → 47.",
      review: "s5",
    },
    {
      q: "A tokenizer that learned 'low' and 'est' meets the new word 'lowest'. What does it do?",
      choices: ["Cuts it into low + est", "Can't read it and stops", "Keeps it as one piece"],
      answer: 0,
      explain: "It groups the pieces it knows and leaves the rest as letters. No word is unreadable.",
      review: "s7",
    },
  ],
  labels: {
    tag: "30. Merging pieces that often go together",
    title: "BPE: merge frequent pairs",
    sub: "Byte Pair Encoding",
    often: "Often together → one piece",
    corpus: "Tiny word list (illustrative)",
    pieces: "Pieces",
    pairs: "Pair counts",
    vocab: "New tokens",
    times: "times",
    most: "the most!",
    merge: "merge",
    noGrammar: "No grammar lessons,",
    noGrammar2: "yet 'low' and 'est'!",
    justCount: "It only counted",
    newWord: "New word",
    known: "known pieces",
    knownList: "Known pieces:",
    real: "The real GPT-4o tokenizer",
    realSrc: "cut with o200k_base",
    size: "Merged into ~200,000 pieces",
    bytes: "* The real one starts from bytes, smaller than letters (ch. 28)",
    x: "×",
    arrow: "→",
    pairA: "e",
    pairB: "s",
    pairAB: "es",
  },
};
