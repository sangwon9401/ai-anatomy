import type { ChapterSpec, Highlighter } from "../../../data/types";

// Illustrative. Scores (logits) chosen so that softmax over the whole GPT-3 vocabulary (50,257 tokens)
// gives the course's numbers: school 52%, the 21%, work 12% (ch01).
export const VOCAB = 50257;
export const LOGITS: { w: string; s: number; c: Highlighter }[] = [
  { w: "school", s: 3.0, c: "yellow" },
  { w: "the", s: 2.1, c: "mint" },
  { w: "work", s: 1.5, c: "sky" },
  { w: "pizza", s: -1.0, c: "pink" },
];
export const REST_N = VOCAB - LOGITS.length; // 50,253
/** e^score summed over the other 50,253 tokens (their scores are mostly around −9.1) */
export const REST_SUM = 5.614;
export const REST_SCORE = Math.log(REST_SUM / REST_N); // ≈ −9.1

export function outputProbs(scores: number[], wholeVocab = true) {
  const ex = scores.map((s) => Math.exp(s));
  const rest = wholeVocab ? REST_SUM : 0;
  const sum = ex.reduce((a, b) => a + b, 0) + rest;
  return { ex, rest, sum, p: ex.map((e) => e / sum), restP: rest / sum };
}

/** s1–s2: the last vector of 'to' and each token's output vector (illustrative); their dot products are the scores. */
export const LAST_VEC = [1.0, 2.0, 0.5, -1.0];
export const TOKEN_VECS = [
  [1.0, 1.0, 0.0, 0.0],
  [0.5, 1.0, 0.0, 0.4],
  [0.5, 0.5, 0.0, 0.0],
  [-1.0, 0.0, 0.0, 0.0],
];
export const OTHER_VECS = [
  [0.4, -0.3, 0.2, 0.6],
  [-0.2, 0.5, 1.1, 0.3],
];

/** words a 'the rest' draw can turn into in the playground (just examples of other tokens) */
export const OTHERS = ["my", "class", "town", "a", "church", "and"];

export const ch60: ChapterSpec = {
  id: 60,
  part: 6,
  title: "From vector to word",
  core: false,
  hook: "After 96 layers, out comes a vector of 12,288 numbers. How does that turn into the word 'school'?",
  steps: [
    { id: "s1", sec: 9.5, narration: "After all 96 layers, each word comes out as one vector. The one that decides the next word is the vector of the last word, 'to'." },
    { id: "s2", sec: 9.5, narration: "It's compared with every token in the vocabulary to give each a score. Similar direction, higher score (chapter 9, dot product)." },
    { id: "s3", sec: 10, narration: "The vocabulary has about 50,000 tokens, 50,257 to be exact. So there are 50,257 scores too. These scores are called logits." },
    { id: "s4", sec: 9.5, narration: "school 3.0, the 2.1, work 1.5, pizza −1.0. The other 50,000 or so mostly score around −9." },
    { id: "s5", sec: 9.5, narration: "Now chapter 14's softmax! Raise e to each score, then divide by the sum over all 50,000. That sum is about 38.72." },
    { id: "s6", sec: 9.5, narration: "school 52%, the 21%, work 12%. The other 50,000-odd tokens each add a tiny bit, and together they take 14%." },
    { id: "s7", sec: 9, narration: "Now pick one by probability and append it to the text (chapters 1 and 2). Output + softmax is filled in on the blueprint!" },
  ],
  playgroundTitle: "Choosing from 50,000",
  playgroundIntro: "Change the scores and tap 'Pick one'. Also compare the probabilities with only 4 candidates and with all 50,000.",
  summary: [
    "The next word is decided by the last word's vector from the final layer.",
    "It's compared with each of about 50,000 tokens (50,257) to get scores (logits): one 12,288 × 50,257 matrix multiplication (ch. 11).",
    "Softmax (ch. 14) turns them into probabilities, and one is picked and appended. school 52%, the 21%, work 12%.",
  ],
  unlocks: "Output + softmax",
  quiz: [
    {
      q: "Which vector is used to decide the next word?",
      choices: ["The last word's final vector", "The first word's vector", "The average of all the word vectors"],
      answer: 0,
      explain: "Thanks to the mask, the last word 'to' has seen all the words before it (ch. 51). That's why its vector decides the next word.",
      review: "s1",
    },
    {
      q: "How many scores does GPT-3 give, one per next-word candidate?",
      choices: ["96", "12,288", "About 50,000 (50,257)"],
      answer: 2,
      explain: "Every token in the vocabulary gets one score, so 50,257 come out.",
      review: "s3",
    },
    {
      q: "Which calculation turns scores (logits) into probabilities?",
      choices: ["Normalization", "Softmax", "Residual connection"],
      answer: 1,
      explain: "Softmax raises e to each score and divides by the total (ch. 14). The results add up to exactly 100%.",
      review: "s5",
    },
  ],
  labels: {
    tag: "60. From vector to word",
    w1: "I",
    w2: "walk",
    w3: "to",
    after: "After 96 layers",
    sawAll: "Saw all earlier words (ch. 51)",
    toy: "illustrative example",
    lastVec: "Final vector of 'to'",
    compare: "Score every token by comparing",
    dotEx: "1.0×1.0 + 2.0×1.0 + 0.5×0.0 + (−1.0)×0.0 = 3.0",
    similar: "Similar direction → higher score (ch. 9)",
    vocab: "The vocabulary's 50,257 tokens",
    logit: "50,257 scores = logits",
    matmul: "One 12,288 × 50,257 matrix multiplication (ch. 11)",
    rest: "the rest",
    restN: "50,253",
    restScore: "≈ −9.1",
    mostly: "mostly",
    expTitle: "① e to the power",
    divTitle: "② ÷ sum of all",
    restSum: "sum of the rest",
    total: "total = 100%",
    gather: "it adds up: 14% ↘",
    pick: "Pick one by probability and append it",
    filled: "Filled!",
    vdots: "⋮",
    stack: "Transformer block × 96 layers",
  },
};
