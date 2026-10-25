import type { ChapterSpec } from "../../../data/types";

/** en: the word is "trunk". [elephant's trunk, car trunk, tree trunk] — a toy 3-dimensional "meaning" so students can see the mix.
 * The scores of each sentence are the Korean ones (same multisets), so the dots land where the Korean ones did. */
export type Meaning = [number, number, number];

export type ToyWord = { w: string; m: Meaning; score: number };

// Relevance score of each word *to "trunk"*. Attention weights are softmax(score), exactly like ch.14.
export const SELF: ToyWord = { w: "trunk", m: [1 / 3, 1 / 3, 1 / 3], score: 1.0 };

export const BANK: ToyWord[] = [
  { w: "bags", m: [0.05, 0.9, 0.05], score: 1.9 },
  { w: "in", m: [0.33, 0.34, 0.33], score: 0.9 },
  { w: "the", m: [0.33, 0.34, 0.33], score: 1.0 },
  { w: "car", m: [0.02, 0.95, 0.03], score: 2.3 },
  { w: "packed", m: [0.03, 0.92, 0.05], score: 2.0 },
  { w: "elephant's", m: [0.95, 0.02, 0.03], score: 2.0 },
  { w: "long", m: [0.45, 0.3, 0.25], score: 1.1 },
  { w: "zoo", m: [0.92, 0.03, 0.05], score: 2.0 },
  { w: "gray", m: [0.85, 0.03, 0.12], score: 1.6 },
  { w: "moss", m: [0.1, 0.05, 0.85], score: 1.7 },
  { w: "on", m: [0.33, 0.33, 0.34], score: 0.8 },
  { w: "tree", m: [0.05, 0.02, 0.93], score: 2.0 },
  { w: "leafy", m: [0.1, 0.05, 0.85], score: 1.5 },
  { w: "today", m: [0.33, 0.33, 0.34], score: 0.3 },
];

// sea → the car sentence, fruit → the elephant sentence, meal → the tree sentence (keys kept from the Korean file)
export const SENTENCES = {
  sea: ["bags", "in", "the", "car"],
  fruit: ["the", "elephant's", "long"],
  meal: ["moss", "on", "the", "tree"],
};

const byWord = (w: string) => BANK.find((b) => b.w === w)!;

export function attend(context: string[]) {
  const words = [...context.map(byWord), SELF];
  const ex = words.map((x) => Math.exp(x.score));
  const sum = ex.reduce((a, b) => a + b, 0);
  const weights = ex.map((e) => e / sum);
  const mix: Meaning = [0, 0, 0];
  words.forEach((x, i) => x.m.forEach((v, k) => (mix[k] += weights[i] * v)));
  return { words, weights, mix };
}

/** Round to whole percents that still add up to exactly 100 (largest remainder). */
export function percents(values: number[]): number[] {
  const raw = values.map((v) => v * 100);
  const floor = raw.map(Math.floor);
  let left = 100 - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floor[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floor[i] += 1;
    left -= 1;
  }
  return floor;
}

export const MEANING_NAMES = ["elephant's trunk", "car trunk", "tree trunk"] as const;

export const ch45: ChapterSpec = {
  id: 45,
  part: 5,
  title: "Words look at each other",
  core: true,
  hook: "Is it an elephant's trunk or a car's trunk? How does an AI tell the difference?",
  steps: [
    { id: "s1", sec: 7, narration: "The word 'trunk' has several meanings: an elephant's trunk, a car's trunk, and a tree trunk." },
    { id: "s2", sec: 8, narration: "Chapter 33's embedding gives 'trunk' one fixed vector. On its own, it sits in the middle of the three meanings." },
    { id: "s3", sec: 6, narration: "Now let's put it in a sentence: 'bags in the car trunk'." },
    { id: "s4", sec: 8.5, narration: "'trunk' looks around at the words before it. The more related a word is, the thicker the line, and the more it looks." },
    { id: "s5", sec: 8.5, narration: "Then it mixes in their meanings, by how much it looked. Lots of 'car' and 'bags' moved it toward the car's trunk." },
    { id: "s6", sec: 9.5, narration: "What if the sentence changes? 'the elephant's long trunk'. This time it looks hard at 'elephant's' and moves toward the elephant." },
    { id: "s7", sec: 7.5, narration: "Each word looks at the other words in its sentence and fixes its own meaning. This is self-attention." },
    { id: "s8", sec: 6.5, narration: "But how does it decide how related two words are? Next chapter: Query, Key and Value." },
  ],
  playgroundTitle: "Build a context",
  playgroundIntro: "Pick words to put in front of 'trunk' and watch where its meaning moves.",
  summary: [
    "The same word can mean different things in different contexts.",
    "Each word looks at the words before it, and looks more at the closely related ones.",
    "It mixes in their meanings by how much it looked and fixes its own meaning. That's self-attention.",
  ],
  unlocks: "Self-attention",
  quiz: [
    {
      q: "What does 'trunk' do in self-attention?",
      choices: ["It looks at the words before it and mixes in the meanings of related words to fix its own", "It looks up its meaning in a dictionary", "It turns into the single closest word"],
      answer: 0,
      explain: "It doesn't pick just one word: it mixes the meanings of several words, in the shares it looked at them.",
      review: "s5",
    },
    {
      q: "Add up all the shares of how much 'trunk' looks at each word. What do you get?",
      choices: ["100%", "number of words × 100%", "It depends"],
      answer: 0,
      explain: "The shares are made with softmax (ch. 14), so they always add up to 1, or 100%.",
      review: "s4",
    },
    {
      q: "Same 'trunk', but the words before it change. Then…",
      choices: ["its meaning stays the same", "its meaning changes with the words before it", "it only gets a meaning when the sentence ends"],
      answer: 1,
      explain: "The embedding is the same, but after attention its meaning fits the context.",
      review: "s6",
    },
  ],
  labels: {
    tag: "45. Words look at each other",
    fruit: "elephant",
    boat: "car",
    body: "tree",
    alone: "trunk (on its own)",
    vague: "unclear, so it's in the middle",
    vec: "one word = one vector (ch. 33)",
    toBoat: "toward the car trunk!",
    toFruit: "toward the elephant!",
    foot: "* real models mix vectors of hundreds of numbers",
    line: "Self-attention: look around, fix my meaning",
    meal: "moss on the tree trunk",
    sum: "All the shares add up to 100% (ch. 14 softmax!)",
    ask: "How do we decide how related they are?",
    q: "Query",
    k: "Key",
    v: "Value",
    qd: "question",
    kd: "label",
    vd: "content",
    seaLine: "bags in the car trunk",
    fruitLine: "the elephant's long trunk",
    next: "Next: ch. 46 Query · Key · Value",
    self: "itself",
    word: "trunk",
  },
};
