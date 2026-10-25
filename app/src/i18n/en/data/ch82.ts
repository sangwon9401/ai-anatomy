import { ROUND1 } from "../../../data/ch01";
import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Cand = { w: string; p: number; c: Highlighter | null };

// "I walk to ___" with ch01's numbers (words taken from ch01 so they always match); ch01's other 5% is split into
// class 3% and "tens of thousands of others" 2% (illustrative). The odd tail = pizza 1% + the others 2% = 3%.
const W1 = ROUND1.map((c) => c.w);
export const DIST82: Cand[] = [
  { w: W1[0], p: 0.52, c: "yellow" },
  { w: W1[1], p: 0.21, c: "mint" },
  { w: W1[2], p: 0.12, c: "sky" },
  { w: W1[3], p: 0.09, c: "violet" },
  { w: "class", p: 0.03, c: "orange" },
  { w: W1[4], p: 0.01, c: "pink" },
  { w: W1[5], p: 0.02, c: null },
];
export const TAIL = 0.03;
export const TAIL_RUN = 100; // 1 − 0.97^100 ≈ 0.952

// s6: when the model is sure vs unsure (illustrative)
export const SURE: Cand[] = [
  { w: "9", p: 0.92, c: "yellow" },
  { w: "8", p: 0.04, c: "mint" },
  { w: "11", p: 0.02, c: "sky" },
  { w: "10", p: 0.01, c: "violet" },
  { w: "13", p: 0.01, c: "pink" },
];
export const UNSURE: Cand[] = [
  { w: "apples", p: 0.24, c: "yellow" },
  { w: "grapes", p: 0.21, c: "mint" },
  { w: "pears", p: 0.17, c: "sky" },
  { w: "plums", p: 0.14, c: "violet" },
  { w: "kiwis", p: 0.11, c: "orange" },
  { w: "figs", p: 0.09, c: "pink" },
  { w: "chairs", p: 0.04, c: null },
];
export const PRESETS82 = [
  { key: "school", name: "I walk to", items: DIST82 },
  { key: "sure", name: "1, 3, 5, 7,", items: SURE },
  { key: "unsure", name: "I like to eat", items: UNSURE },
];

/** How many candidates each rule keeps (lists are sorted from most to least likely). */
export const keepTopK = (items: Cand[], k: number) => Math.min(k, items.length);
export function keepTopP(items: Cand[], p: number) {
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += items[i].p;
    if (acc >= p - 1e-9) return i + 1;
  }
  return items.length;
}
/** Probabilities after cutting to the first n and sharing out again so they add up to 1. */
export function renorm(items: Cand[], n: number) {
  const s = items.slice(0, n).reduce((a, b) => a + b.p, 0);
  return items.map((it, i) => (i < n ? it.p / s : 0));
}

export const PIPE = [
  { a: "Scores", b: "" },
  { a: "÷ temp", b: "ch. 81" },
  { a: "Softmax", b: "ch. 14" },
  { a: "Trim tail", b: "ch. 82" },
  { a: "Spin", b: "ch. 80" },
  { a: "Next piece!", b: "" },
];

export const ch82: ChapterSpec = {
  id: 82,
  part: 9,
  title: "Narrowing the candidates",
  core: false,
  hook: "If the wheel has a 'pizza' slice, won't 'pizza' really come up someday?",
  steps: [
    { id: "s1", sec: 7, narration: "Sampling has a trap. There are tens of thousands of candidates, so all the tiny bars together make a fat tail." },
    { id: "s2", sec: 8, narration: "Even if the tail is only 3%, in a 100-piece answer the chance that an odd word sneaks in somewhere is 95%." },
    { id: "s3", sec: 8, narration: "So we cut the tail. First, Top-k: keep only the top k by probability. With k = 3, three are left." },
    { id: "s4", sec: 9, narration: "Share the remaining 85% out again so it adds up to 1: school 61.2%, the 24.7%, work 14.1%. Now spin the wheel." },
    { id: "s5", sec: 9, narration: "Second, Top-p: add up the probabilities from the top, stop the moment you pass p, say 90%, and cut the rest." },
    { id: "s6", sec: 9, narration: "Top-k always keeps 3, but Top-p adapts: it keeps 1 when the model is sure and 6 when it's unsure." },
    { id: "s7", sec: 9, narration: "So: divide the scores by temperature, softmax them, cut the tail, and spin the wheel. That's how each piece is picked." },
  ],
  playgroundTitle: "Tail-cutting lab",
  playgroundIntro: "Pick a sentence and cut the candidates with Top-k or Top-p. Spin the wheel with what's left. What comes out?",
  summary: [
    "There are tens of thousands of candidates, so even a thin tail can add up and let an odd word slip in.",
    "Top-k keeps the top k. Top-p keeps adding from the top until the total passes p.",
    "After cutting, share the rest out again so it adds up to 1, then spin the wheel.",
  ],
  unlocks: "Top-k · Top-p",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "What does Top-k do with k = 2?",
      choices: ["Keeps only candidates above 2%", "Spins the wheel twice", "Keeps first and second place and cuts the rest"],
      answer: 2,
      explain: "Top-k keeps only the top k candidates, in order of probability.",
      review: "s3",
    },
    {
      q: "The candidates have probabilities [60%, 25%, 10%, 5%]. How many does Top-p (p = 80%) keep?",
      choices: ["1", "2", "4"],
      answer: 1,
      explain: "Adding from the top: 60%, then 85%. The total passes 80% at the second one, so 2 are kept.",
      review: "s5",
    },
    {
      q: "The model is very sure (first place has 92%). How many candidates does Top-p (90%) keep?",
      choices: ["Just first place", "Always 3", "All of them"],
      answer: 0,
      explain: "First place alone already passes 90%. With Top-p, the number kept changes with the shape of the distribution.",
      review: "s6",
    },
  ],
  labels: {
    tag: "82. Narrowing the candidates",
    example: "illustrative example",
    tailNote: "other = tens of thousands of pieces",
    tail: "odd tail = 3%",
    long: "If the answer is 100 pieces long",
    avoid: "Dodging the tail 100 times in a row",
    mult: "0.97 × 0.97 × … × 0.97",
    times: "100 times",
    approx: "≈ 0.05",
    once: "At least one odd word ≈ 95%",
    calc: "* illustrative calculation",
    way1: "Way 1",
    way2: "Way 2",
    topk: "Top-k",
    k3: "k = 3",
    topkNote: "Keep only the top k!",
    snip: "Snip!",
    renorm: "÷ 0.85 → adds to 1",
    topp: "Top-p",
    p90: "p = 90%",
    toppNote: "add until you pass 90%",
    sum: "sum so far",
    over: "Over 90%!",
    toppRenorm: "Reshared among 4: 55.3 · 22.3 · 12.8 · 9.6%",
    sureQ: "1, 3, 5, 7, ___",
    unsureQ: "I like to eat ___",
    sure: "When it's sure",
    unsure: "When it's unsure",
    kLine: "Top-k",
    pLine: "Top-p",
    keepSure: "Top-k 3 · Top-p 1",
    keepUnsure: "Top-k 3 · Top-p 6",
    adapt: "Top-p grows and shrinks to fit!",
    pipeTitle: "How one piece gets picked",
    again: "Attach the next piece and start again (ch. 2)",
  },
};
