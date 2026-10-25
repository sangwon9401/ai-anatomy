import type { ChapterSpec, Highlighter } from "../../../data/types";

// a tiny vocabulary for the scene (5 words) and the playground (8 words)
export const VOCAB5: { w: string; c: Highlighter }[] = [
  { w: "dog", c: "yellow" },
  { w: "cat", c: "mint" },
  { w: "bus", c: "sky" },
  { w: "apple", c: "pink" },
  { w: "school", c: "violet" },
];
export const VOCAB8 = [...VOCAB5.map((v) => v.w), "walk", "pizza", "I"];

export const oneHot = (i: number, n: number) => Array.from({ length: n }, (_, k) => (k === i ? 1 : 0));
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

// real GPT-4o token ids (o200k_base) from ch29: ' walk' 5229, 'I' 40 → ratio ≈ 130.7
export const ID_NANEUN = 5229;
export const ID_E = 40;
export const VOCAB_SIZES = [
  { name: "Example list", n: 8 },
  { name: "GPT-3", n: 50257 },
  { name: "GPT-4o", n: 200019 },
];

export const ch32: ChapterSpec = {
  id: 32,
  part: 3,
  title: "The limits of ID numbers",
  core: false,
  hook: "Every token already has a number. Why not just feed those numbers into the model?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Every token has a number (ch. 29): ' walk' is 5229 and 'I' is 40. What if we fed these numbers straight into the model?" },
    { id: "s2", sec: 9, narration: "Models multiply and add numbers (ch. 12), so 'walk' would count as 131 times bigger than 'I'. Yet an ID's size means nothing." },
    { id: "s3", sec: 9, narration: "So instead of a number, we mark a position. Make one slot per word and put a 1 only in your own slot. That's one-hot encoding." },
    { id: "s4", sec: 9.5, narration: "No more size differences. But there are two problems. First, it's far too long: for GPT-4o, about 200,000 slots with a single 1." },
    { id: "s5", sec: 8, narration: "Second, all words are equal strangers. Any two words are √2 apart (ch. 8) with a dot product of 0 (ch. 9).", tts: "Second, all words are equal strangers. Any two words are the square root of 2 apart, with a dot product of 0." },
    { id: "s6", sec: 7.5, narration: "One-hot can't show that a dog and a cat are alike. They're exactly as far apart as a dog and a bus." },
    { id: "s7", sec: 9, narration: "What we need is a short row of numbers where similar meanings sit close together. That's the embedding, coming next chapter." },
  ],
  playgroundTitle: "One-hot lab",
  playgroundIntro: "Pick two words to see their one-hot vectors, the distance between them and their dot product. Can you find a pair whose distance isn't √2?",
  summary: [
    "The size of a token ID means nothing, so we can't use it directly in calculations.",
    "One-hot: one slot per word, with a 1 only in your own slot. Size differences disappear.",
    "But it's far too long (about 200,000 slots), and every word is equally far apart (distance √2, dot product 0).",
  ],
  unlocks: "One-hot vector",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "With a vocabulary of 5 words, what is the one-hot vector of the third word?",
      choices: ["[3]", "[1, 1, 1, 0, 0]", "[0, 0, 1, 0, 0]"],
      answer: 2,
      explain: "A 1 only in the third of the 5 slots, and 0 everywhere else.",
      review: "s3",
    },
    {
      q: "With one-hot vectors, what is the dot product of 'dog' and 'cat'?",
      choices: ["1", "0", "√2"],
      answer: 1,
      explain: "Their 1s sit in different slots, so every product is 0. 'dog' and 'bus' give 0 as well.",
      review: "s5",
    },
    {
      q: "Which is NOT a problem with one-hot vectors?",
      choices: ["The vectors are too long", "Similar words aren't any closer", "Words share vectors and get mixed up"],
      answer: 2,
      explain: "Every word has its 1 in a different slot, so they never overlap. The problems are the length and that all words are equally far apart.",
      review: "s6",
    },
  ],
  labels: {
    tag: "32. The limits of ID numbers",
    naneun: "walk",
    e: "I",
    into: "Feed them in as they are?",
    model: "Model",
    r2: "√2",
    times: "× 2 →",
    ratio: "5229 ÷ 40 ≈ 131×",
    bigger: "'walk' is 131 times bigger?!",
    noMeaning: "An ID's size means nothing (ch. 6)",
    seat: "A position instead of a number",
    oneHot: "One-hot encoding",
    onlyOne: "its slot = 1",
    prob1: "Problem ① Far too long",
    cells: "about 200,000 slots",
    justOne: "just one 1",
    prob2: "Problem ② All equal strangers",
    distLbl: "distance",
    dotLbl: "dot product",
    sqrt2: "√2",
    same: "Alike or not, every pair is √2 ≈ 1.41 apart",
    need: "We need short, meaningful rows",
    emb: "Embedding (ch. 33)",
    sample: "[0.8, 0.7, −0.2]",
    zeros: "0 0 0 0 0 0 0 0 0 0 0 0 … 1 … 0 0 0 0 0 0 0 0 0",
  },
};
