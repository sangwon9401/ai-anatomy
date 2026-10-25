import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];

// en: an illustrative 2-D embedding map (illustrative example) with the Korean map's coordinates. The groups are re-dealt
// so that 'trunk' (elephant / car / tree, the ch45 word) sits between animals, vehicles and plants, where the Korean
// word sat between fruit, vehicles and body. Neighbours, odd-one-out answers and label overlaps checked with a script
// (scratch i18n/en-g2/scripts/map35_en.mjs).
export const UNIVERSE: { w: string; v: P2; g: number }[] = [
  { w: "apple", v: [1.4, 9.1], g: 0 },
  { w: "grape", v: [0.55, 8.55], g: 0 },
  { w: "strawberry", v: [2.1, 8.45], g: 0 },
  { w: "banana", v: [1.25, 7.9], g: 0 },
  { w: "orange", v: [1.95, 7.4], g: 0 },
  { w: "elephant", v: [8.5, 8.6], g: 1 },
  { w: "dog", v: [7.65, 8.05], g: 1 },
  { w: "cat", v: [9.2, 7.95], g: 1 },
  { w: "rabbit", v: [8.35, 7.4], g: 1 },
  { w: "tiger", v: [9.05, 6.9], g: 1 },
  { w: "airplane", v: [8.3, 2.7], g: 2 },
  { w: "bus", v: [7.45, 2.15], g: 2 },
  { w: "car", v: [9, 2.05], g: 2 },
  { w: "bicycle", v: [8.15, 1.5], g: 2 },
  { w: "train", v: [8.85, 1], g: 2 },
  { w: "tree", v: [4.3, 2.5], g: 3 },
  { w: "leaf", v: [3.45, 1.95], g: 3 },
  { w: "flower", v: [5, 1.85], g: 3 },
  { w: "grass", v: [4.15, 1.3], g: 3 },
  { w: "bush", v: [4.85, 0.8], g: 3 },
  { w: "school", v: [1.4, 5.5], g: 4 },
  { w: "test", v: [0.55, 4.95], g: 4 },
  { w: "homework", v: [2.1, 4.85], g: 4 },
  { w: "classroom", v: [1.25, 4.3], g: 4 },
  { w: "teacher", v: [1.95, 3.8], g: 4 },
  { w: "cloud", v: [5, 9.6], g: 5 },
  { w: "wind", v: [4.15, 9.05], g: 5 },
  { w: "storm", v: [5.7, 8.95], g: 5 },
  { w: "rain", v: [4.85, 8.4], g: 5 },
  { w: "snow", v: [5.55, 7.9], g: 5 },
  { w: "trunk", v: [6.6, 4.8], g: -1 },
];
export const UNI_GROUPS: { name: string; c: Highlighter }[] = [
  { name: "fruit", c: "pink" },
  { name: "animals", c: "yellow" },
  { name: "vehicles", c: "sky" },
  { name: "plants", c: "mint" },
  { name: "school", c: "orange" },
  { name: "weather", c: "violet" },
];

export const dist2 = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const wordAt = (w: string) => UNIVERSE.find((x) => x.w === w)!;
export function nearest(w: string, k = 5) {
  const me = wordAt(w);
  return UNIVERSE.filter((x) => x.w !== w)
    .map((x) => ({ ...x, d: dist2(me.v, x.v) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
}
/** the word whose average distance to the other three is largest */
export function oddOne(words: string[]) {
  const avg = words.map((w) => words.filter((x) => x !== w).reduce((s, x) => s + dist2(wordAt(w).v, wordAt(x).v), 0) / (words.length - 1));
  return words[avg.indexOf(Math.max(...avg))];
}
export const ODD_ROUNDS = [
  ["cat", "rabbit", "tiger", "bus"],
  ["apple", "grape", "airplane", "banana"],
  ["teacher", "homework", "classroom", "strawberry"],
  ["cloud", "wind", "storm", "leaf"],
  ["tree", "flower", "train", "grass"],
];
// s6: two sentences that pull 'trunk' toward one meaning (ch. 45)
export const BAE_SENTENCES = [
  { text: "The elephant lifted its trunk", g: 1 },
  { text: "She opened the car trunk", g: 2 },
];

export const ch35: ChapterSpec = {
  id: 35,
  part: 3,
  title: "Exploring the embedding universe",
  core: false,
  hook: "On the word map, who lives next to 'dog', and where does 'trunk' end up?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Let's explore the embedding universe we've built. Here are 31 words spread on a 2D map. The positions are an illustrative example." },
    { id: "s2", sec: 7, narration: "Search for 'dog' and the closest words light up first: rabbit, elephant, cat… all animals." },
    { id: "s3", sec: 8.5, narration: "Here 'closest' means distance (ch. 8). Real AI search often compares directions instead, using the dot product (ch. 9)." },
    { id: "s4", sec: 7, narration: "You can also find the odd one out: cat, rabbit, tiger, bus. Only bus sits far away." },
    { id: "s5", sec: 8.5, narration: "But where is 'trunk'? It's stuck between the animals, the vehicles and the plants, because it has several meanings." },
    { id: "s6", sec: 8.5, narration: "A word gets only one spot, so you need the sentence to know which trunk it is. Attention solves this in chapter 45." },
    { id: "s7", sec: 8.5, narration: "Real embeddings have 12,288 dimensions in GPT-3. This map is a 2D shadow of them, so it's a little distorted." },
    { id: "s8", sec: 8.5, narration: "In the embedding universe, close means alike and directions show relationships. Words have become numbers with meaning." },
  ],
  playgroundTitle: "Embedding universe",
  playgroundIntro: "Tap a word and its nearest neighbors light up in order. Then try 'Find the odd one out' below.",
  summary: [
    "In embedding space, nearby words have similar meanings. Search = finding the nearest points.",
    "A word with several meanings, like 'trunk', sits between groups.",
    "Which meaning it has depends on the sentence. That's attention's job (ch. 45).",
  ],
  unlocks: "Meaning search",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "On the embedding map, which word is likely closest to 'dog'?",
      choices: ["bus", "cat", "cloud"],
      answer: 1,
      explain: "Animals are used with similar neighboring words, so they gather close together.",
      review: "s2",
    },
    {
      q: "Why does 'trunk' sit between the animals, the vehicles and the plants?",
      choices: ["Because it's a short word", "It has several meanings, so it appears next to words from several groups", "Because it's the most common word"],
      answer: 1,
      explain: "An elephant's trunk, a car trunk, a tree trunk. Its neighbors are mixed, so its coordinates land in the middle.",
      review: "s5",
    },
    {
      q: "In which chapter do we learn how the right meaning of 'trunk' is picked in each sentence?",
      choices: ["Ch. 29 Tokenizer", "Ch. 32 One-hot", "Ch. 45 Attention"],
      answer: 2,
      explain: "Attention looks at the surrounding words and adjusts the vector of 'trunk' to fit the sentence.",
      review: "s6",
    },
  ],
  labels: {
    tag: "35. Exploring the embedding universe",
    title: "Embedding universe (illustrative example)",
    search: "Search:",
    dog: "dog",
    ranks: "Closest first",
    distNote: "By distance (ch. 8)",
    cosine1: "Real search often compares",
    cosine2: "directions (dot product, ch. 9)",
    odd: "Find the odd one out",
    oddAns: "Only bus is far!",
    bae: "trunk",
    baeQ: "Where is 'trunk'?",
    fruit: "elephant",
    boat: "car",
    belly: "tree",
    many: "Several meanings → in between",
    one: "One word = one spot",
    attn: "The sentence tells which trunk → ch. 45 attention",
    dims: "Real: 12,288 dimensions (GPT-3)",
    shadow: "The map = a 2D shadow",
    twist: "So it's a little distorted",
    sum1: "Close means alike",
    sum2: "Direction = relationship",
    sum3: "Words → numbers with meaning",
  },
};
