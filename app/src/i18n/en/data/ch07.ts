import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Friend = { name: string; v: [number, number]; c: Highlighter };

// taste vectors: (spicy, sweet), each 0–10. Reused in chapters 8 and 9.
export const FRIENDS: Friend[] = [
  { name: "Mia", v: [8, 3], c: "pink" },
  { name: "Noah", v: [2, 9], c: "mint" },
  { name: "Emma", v: [7, 4], c: "sky" },
];

export const FLAVORS4 = [
  { name: "spicy", v: 8 },
  { name: "sweet", v: 3 },
  { name: "salty", v: 5 },
  { name: "sour", v: 2 },
];

export const ch07: ChapterSpec = {
  id: 7,
  part: 1,
  title: "Vectors: rows of numbers",
  core: true,
  hook: "Can you put into numbers how similar your taste in food is to a friend's?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Let's write taste as numbers: how much you like spicy food, from 0 to 10, and sweet food, also from 0 to 10." },
    { id: "s2", sec: 9.5, narration: "Mia: spicy 8, sweet 3. We write it in parentheses as (8, 3). Numbers bundled in order like this are called a vector." },
    { id: "s3", sec: 10, narration: "A vector can be drawn as an arrow. Across is spicy, up is sweet. The arrow from the origin to (8, 3) is Mia's taste." },
    { id: "s4", sec: 8.5, narration: "Noah is (2, 9) and Emma is (7, 4). Just from the arrows' directions, you can see whose tastes are alike." },
    { id: "s5", sec: 9.5, narration: "More slots give more detail. Add salty and sour and you get a vector of 4 numbers. The number of slots is the dimension." },
    { id: "s6", sec: 10, narration: "GPT represents each word as a very long vector: GPT-3 uses 12,288 numbers per word. You can't draw it, but the idea is the same." },
    { id: "s7", sec: 8, narration: "A vector is a row of numbers with meaning. In the next chapter, we measure how close two vectors are." },
  ],
  playgroundTitle: "My taste arrow",
  playgroundIntro: "Set your taste with the sliders. The arrow and the vector change together.",
  summary: [
    "Vector: numbers bundled in order. Each slot has a meaning.",
    "A 2-slot vector can be drawn as an arrow on a plane.",
    "Number of slots = dimension. GPT-3's word vectors have 12,288 dimensions.",
  ],
  unlocks: "Vectors",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "In Mia's taste (8, 3), what is the 8?",
      choices: ["Her spicy score", "Her sweet score", "Mia's age"],
      answer: 0,
      explain: "In a vector, the order of the slots matters. We decided slot 1 = spicy, slot 2 = sweet.",
      review: "s2",
    },
    {
      q: "How many dimensions does (8, 3, 5, 2) have?",
      choices: ["2", "4", "18"],
      answer: 1,
      explain: "It has 4 numbers, so it's 4-dimensional. Their sum doesn't matter.",
      review: "s5",
    },
    {
      q: "How many numbers does GPT-3 use for one word?",
      choices: ["2", "100", "12,288"],
      answer: 2,
      explain: "Far too many slots to draw, but it's the same idea: a row of numbers.",
      review: "s6",
    },
  ],
  labels: {
    tag: "7. Vectors: rows of numbers",
    spicy: "spicy",
    sweet: "sweet",
    salty: "salty",
    sour: "sour",
    minji: "Mia",
    junho: "Noah",
    seoyeon: "Emma",
    vector: "vector",
    origin: "origin",
    similar: "similar!",
    arrowSE: "↘",
    dims: "4-D vector",
    dimNote: "number of slots = dimension",
    noDraw: "You can't draw 4-D as an arrow, but bars work fine",
    gpt: "One word in GPT-3",
    count: "12,288 numbers",
    same: "Same idea, though",
    sum: "Vector = numbers with meaning",
    word: "cat",
    examples: "(8,3) · (8,3,5,2) · (…12,288)",
  },
};
