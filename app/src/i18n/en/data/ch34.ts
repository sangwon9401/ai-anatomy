import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];
export type WordMap = { key: string; name: string; c: Highlighter; words: { w: string; v: P2 }[]; presets: [string, string, string][] };

// illustrative 2-D word maps (illustrative example); the coordinates are the Korean ones, only the words are English. Every preset analogy lands nearest its target — checked with a script.
export const MAPS: WordMap[] = [
  {
    key: "people",
    name: "People",
    c: "yellow",
    words: [
      { w: "man", v: [2, 2] },
      { w: "woman", v: [2, 5] },
      { w: "king", v: [7, 2.5] },
      { w: "queen", v: [7.2, 5.3] },
      { w: "boy", v: [0.8, 1.2] },
      { w: "girl", v: [0.9, 4.3] },
      { w: "prince", v: [5.4, 1.6] },
      { w: "princess", v: [5.6, 4.7] },
      { w: "dad", v: [3.5, 2.8] },
      { w: "mom", v: [3.6, 5.9] },
    ],
    presets: [
      ["king", "man", "woman"],
      ["prince", "boy", "girl"],
      ["dad", "man", "woman"],
    ],
  },
  {
    key: "capital",
    name: "Countries and capitals",
    c: "sky",
    words: [
      { w: "Korea", v: [1.5, 6] },
      { w: "Seoul", v: [2.1, 2.6] },
      { w: "Japan", v: [4.2, 6.4] },
      { w: "Tokyo", v: [4.9, 3.1] },
      { w: "France", v: [7.2, 6.1] },
      { w: "Paris", v: [7.7, 2.6] },
    ],
    presets: [
      ["Seoul", "Korea", "Japan"],
      ["Paris", "France", "Korea"],
      ["Tokyo", "Japan", "France"],
    ],
  },
  {
    key: "tense",
    name: "Now and past",
    c: "mint",
    words: [
      { w: "go", v: [1.4, 6] },
      { w: "went", v: [2.2, 2.7] },
      { w: "eat", v: [4.4, 6.5] },
      { w: "ate", v: [5.1, 3.1] },
      { w: "see", v: [7.3, 5.9] },
      { w: "saw", v: [8.1, 2.4] },
    ],
    presets: [
      ["went", "go", "eat"],
      ["saw", "see", "go"],
      ["ate", "eat", "see"],
    ],
  },
];

export const vecOf = (m: WordMap, w: string) => m.words.find((x) => x.w === w)!.v;
/** a − b + c, and the nearest word that is not one of the inputs (as Word2Vec demos do) */
export function analogy(m: WordMap, a: string, b: string, c: string) {
  const [va, vb, vc] = [vecOf(m, a), vecOf(m, b), vecOf(m, c)];
  const r: P2 = [va[0] - vb[0] + vc[0], va[1] - vb[1] + vc[1]];
  const ranked = m.words
    .filter((x) => x.w !== a && x.w !== b && x.w !== c)
    .map((x) => ({ w: x.w, d: Math.hypot(x.v[0] - r[0], x.v[1] - r[1]) }))
    .sort((p, q) => p.d - q.d);
  return { r, best: ranked[0] };
}

// s1–s2: guess a word from its neighbours
export const CONTEXT = ["I", "drank", "a hot", "___", "at a café."];
export const CANDIDATES = [
  { w: "coffee", fits: true },
  { w: "tea", fits: true },
  { w: "cocoa", fits: true },
  { w: "bicycle", fits: false },
];
// s3: a sliding window over a sentence (Word2Vec practice)
export const WINDOW = ["I", "drink", "coffee", "in", "the", "morning"];
// s4: before/after training on a small map
export const DRINKS: { w: string; from: P2; to: P2; c: Highlighter }[] = [
  { w: "coffee", from: [6.8, 5.6], to: [2.3, 5.2], c: "orange" },
  { w: "tea", from: [1.6, 1.8], to: [3.1, 5.9], c: "orange" },
  { w: "cocoa", from: [4.6, 3.4], to: [2.2, 6.4], c: "orange" },
  { w: "bicycle", from: [3.0, 6.2], to: [7.0, 1.8], c: "sky" },
  { w: "bus", from: [7.6, 2.4], to: [7.8, 2.8], c: "sky" },
];

export const ch34: ChapterSpec = {
  id: 34,
  part: 3,
  title: "Neighbors reveal meaning",
  core: false,
  hook: "Nobody ever taught it what words mean. So how does an AI know that 'coffee' and 'tea' are alike?",
  steps: [
    { id: "s1", sec: 9, narration: "'I drank a hot ___ at a café.' What fits in the blank? Even in a sentence you've never seen, the words around it give it away." },
    { id: "s2", sec: 9.5, narration: "Words that fit the same spot, like coffee, tea and cocoa, mean similar things. This idea is called the distributional hypothesis." },
    { id: "s3", sec: 9, narration: "Word2Vec (2013) turned this idea into training: look at one word and guess the words around it, millions and millions of times." },
    { id: "s4", sec: 8.5, narration: "After practice, words with similar neighbors end up with nearby vectors, even though nobody told it any meanings." },
    { id: "s5", sec: 8.5, narration: "Amazingly, directions carry meaning too. The arrow from man to woman is almost the same as the arrow from king to queen." },
    { id: "s6", sec: 9, narration: "So king − man + woman lands right next to queen: (7, 2.5) − (2, 2) + (2, 5) = (7, 5.5).", tts: "So king minus man plus woman lands right next to queen: 7, 2.5 minus 2, 2 plus 2, 5 equals 7, 5.5." },
    { id: "s7", sec: 9.5, narration: "Seoul − Korea + Japan ≈ Tokyo too. Real Word2Vec has hundreds of dimensions and isn't always this neat. This map is illustrative.", tts: "Seoul minus Korea plus Japan is about Tokyo too. Real Word2Vec has hundreds of dimensions and isn't always this neat. This map is illustrative." },
    { id: "s8", sec: 7.5, narration: "Neighbors reveal meaning. GPT's embeddings learn meaning the same way, by guessing the next piece." },
  ],
  playgroundTitle: "Word calculator",
  playgroundIntro: "Choose A − B + C. Follow the arrows: the word closest to where you land is the answer. Find calculations that land right on a word.",
  summary: [
    "Distributional hypothesis: words that appear in the same spots (with the same neighbors) have similar meanings.",
    "Word2Vec (2013): builds word vectors by practicing guessing the neighboring words.",
    "Directions carry meaning too: king − man + woman ≈ queen.",
  ],
  unlocks: "Distributional hypothesis",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "What do we call the idea that a word's neighbors reveal its meaning?",
      choices: ["Probability distribution", "One-hot encoding", "Distributional hypothesis"],
      answer: 2,
      explain: "Words that fit the same spots have similar meanings. Word2Vec turned this idea into training.",
      review: "s2",
    },
    {
      q: "What practice does Word2Vec use to build word vectors?",
      choices: ["Memorizing dictionary definitions", "Looking at one word and guessing the words around it", "Sorting words alphabetically"],
      answer: 1,
      explain: "While guessing neighbors, words with similar neighbors end up with nearby vectors.",
      review: "s3",
    },
    {
      q: "On this chapter's map, what is king (7, 2.5) − man (2, 2) + woman (2, 5)?",
      choices: ["(11, 9.5) → nothing there", "(3, 0.5) → near boy", "(7, 5.5) → near queen"],
      answer: 2,
      explain: "Across: 7 − 2 + 2 = 7. Up: 2.5 − 2 + 5 = 5.5. That's right next to queen (7.2, 5.3).",
      review: "s6",
    },
  ],
  labels: {
    tag: "34. Neighbors reveal meaning",
    guess: "What fits in the blank?",
    hint: "The neighbors are hints!",
    fits: "all fit",
    nofit: "doesn't fit",
    hypo: "Neighbors reveal meaning",
    hypoName: "Distributional hypothesis",
    w2v: "Word2Vec (2013)",
    practice: "Middle word → guess its neighbors",
    guessIt: "Guess them!",
    millions: "Repeated on huge piles of text",
    before: "Before practice",
    after: "After: similar neighbors → close",
    noOne: "Nobody taught it the meanings",
    dir: "Directions carry meaning too",
    same: "same arrow!",
    calc: "king − man + woman",
    calcNum: "(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)",
    land: "≈ queen",
    capital: "Seoul − Korea + Japan ≈ Tokyo",
    real: "Real ones: hundreds of dimensions, not always exact",
    example: "illustrative map",
    sum: "Meaning = neighbors",
    gpt: "GPT learns meaning the same way",
    minus: "− man",
    minusKor: "Korea → Japan",
    ok: "○",
    no: "✕",
    plus: "+ woman",
  },
};
