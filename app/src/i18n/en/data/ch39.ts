import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a tiny neural language model (illustrative example) ---
// Each word has a hand-placed 2-number vector. A small network (2 → 3 tanh neurons → 8 scores → softmax)
// was trained on the imaginary counts below with a script; "dog" was never in the training data.
// en: the words are translated one to one; the vectors, counts and trained weights are the Korean ones.
export const NEXT = ["sleeps", "eats", "runs", "studies", "teaches", "falls", "blows", "stops"] as const;
export const NEXT_COLORS: Highlighter[] = ["yellow", "mint", "sky", "violet", "violet", "orange", "orange", "pink"];

export type ToyWord = { w: string; e: [number, number]; group: string; counts?: Record<string, number> };
export const KNOWN: ToyWord[] = [
  { w: "cat", e: [-0.6, 0.5], group: "animals", counts: { sleeps: 9, eats: 6, runs: 4, studies: 1 } },
  { w: "student", e: [0.5, 0.6], group: "people", counts: { studies: 10, sleeps: 4, eats: 3, runs: 3 } },
  { w: "teacher", e: [0.75, 0.15], group: "people", counts: { teaches: 12, eats: 3, studies: 3, sleeps: 2 } },
  { w: "rain", e: [-0.45, -0.6], group: "weather", counts: { falls: 16, stops: 4 } },
  { w: "wind", e: [0.25, -0.75], group: "weather", counts: { blows: 16, stops: 4 } },
];
export const DOG: ToyWord = { w: "dog", e: [-0.32, 0.68], group: "animals" };

const W1 = [
  [-0.716, -2.838],
  [-2.381, 0.377],
  [-3.55, 2.615],
];
const B1 = [-0.508, 0.073, 1.299];
const W2 = [
  [-3.086, 0.777, 0.299],
  [-3.014, 0.753, -0.141],
  [-2.592, 0.083, 3.194],
  [-2.554, -1.216, 0.938],
  [-3.202, -1.034, -3.892],
  [5.054, 1.859, 2.506],
  [4.866, -1.559, -2.692],
  [4.532, 0.337, -0.212],
];
const B2 = [1.449, 1.563, -1.164, 0.961, -1.694, -0.911, -0.802, 1.642];

/** Forward pass: word vector → neuron outputs (−1…1) → scores → probabilities. */
export function nnlm(e: readonly [number, number]) {
  const h = W1.map((r, i) => Math.tanh(r[0] * e[0] + r[1] * e[1] + B1[i]));
  const s = W2.map((r, k) => r.reduce((a, w, i) => a + w * h[i], B2[k]));
  const m = Math.max(...s);
  const ex = s.map((v) => Math.exp(v - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { h, s, p: ex.map((v) => v / sum) };
}

/** The k most likely next words. */
export function top(e: readonly [number, number], k = 3) {
  const { p } = nnlm(e);
  return p
    .map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] }))
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}

// --- the scene's running example (illustrative example): three word vectors → scores 3, 2, 1, −1 (ch14) ---
export const CONTEXT: { w: string; v: [number, number]; c: Highlighter }[] = [
  { w: "I", v: [0.8, 0.1], c: "mint" },
  { w: "walk", v: [-0.3, 0.9], c: "sky" },
  { w: "to", v: [0.5, -0.6], c: "violet" },
];
export const OUTPUTS: { w: string; s: number; c: Highlighter }[] = [
  { w: "school", s: 3, c: "yellow" },
  { w: "the", s: 2, c: "mint" },
  { w: "work", s: 1, c: "sky" },
  { w: "pizza", s: -1, c: "pink" },
];
/** an older sentence the fixed window cannot see all of: 'Yesterday' decides walk / walked */
export const WINDOW_SENT = ["Yesterday", "my", "friend", "and", "I"];

export const ch39: ChapterSpec = {
  id: 39,
  part: 4,
  title: "The neural language model",
  core: false,
  hook: "How can an AI guess the next word in a sentence it has never seen before?",
  steps: [
    { id: "s1", sec: 10, narration: "An n-gram may have counted 'the cat' lots of times, but if it has never seen 'the dog', it has no idea what comes next. The count is 0." },
    { id: "s2", sec: 10, narration: "In 2003, Bengio's team came up with a new way: a neural network that guesses the next word, the neural language model." },
    { id: "s3", sec: 9, narration: "First, every word gets a vector of numbers: chapter 33's embedding. Words used in similar ways sit close together." },
    { id: "s4", sec: 10, narration: "The vectors of the last three words are joined into one row and fed in. After Part 2's neuron layers, each candidate word gets a score." },
    { id: "s5", sec: 10, narration: "Softmax (ch. 14) turns the scores into probabilities: school 65.7%, the 24.2%, work 8.9%, pizza 1.2%." },
    { id: "s6", sec: 10, narration: "The dog vector is close to the cat vector, so the network gives similar answers. It can guess even in a sentence it has never seen." },
    { id: "s7", sec: 10, narration: "Training adjusts the network's weights and the word vectors together. Ten years later, Word2Vec (ch. 34) focused only on the vectors." },
    { id: "s8", sec: 10, narration: "One limit remains: it's still a fixed window that sees only the last few words. How do we see the whole sentence? Chapter 40." },
  ],
  playgroundTitle: "Move the word",
  playgroundIntro: "'dog' never appeared in the training sentences. Drag the yellow dot (the vector of 'dog') and watch how the network's next-word probabilities change.",
  summary: [
    "2003 neural language model: word vectors (embeddings) + a neural network predict the next word.",
    "Similar words = nearby vectors, so it makes good guesses even for sentences it has never seen.",
    "Training polishes the word vectors too. Limit: it's still a window that sees only the last few words.",
  ],
  unlocks: "2003 neural language model",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "What does a neural language model do better than an n-gram?",
      choices: ["Similar words have nearby vectors, so it guesses well even for unseen sentences", "It needs no corpus at all", "It sees the whole sentence at once"],
      answer: 0,
      explain: "Even if it never saw 'the dog', the network gives a similar answer when the 'dog' vector is close to 'cat'.",
      review: "s6",
    },
    {
      q: "In what form do the previous words go into the network?",
      choices: ["As one ID number", "Each word's vector is looked up and joined into one row", "As the number of letters"],
      answer: 1,
      explain: "Look up each word's embedding vector (ch. 33) and join the vectors into one row.",
      review: "s4",
    },
    {
      q: "What limit does the neural language model still have?",
      choices: ["It can't make probabilities", "It can't use word vectors", "It's still a fixed window that sees only the last few words"],
      answer: 2,
      explain: "It can't see words outside the window. Chapter 40's RNN follows the whole sentence.",
      review: "s8",
    },
  ],
  labels: {
    tag: "39. The neural language model",
    ngram: "n-gram pair counts",
    catBlank: "the cat ___",
    dogBlank: "the dog ___",
    times: "×",
    never: "never counted → no idea",
    notKnow: "It doesn't know the words are alike",
    year: "2003",
    who: "Bengio's team",
    nnlm: "Neural language model",
    nnlmEn: "Neural Network Language Model",
    idea: "Turn words into vectors and feed them to a neural net!",
    planeTitle: "A vector for every word (ch. 33 embedding)",
    animal: "animals",
    people: "people",
    weather: "weather",
    close: "similar words = nearby spots",
    emb: "Embedding (ch. 33)",
    concat: "join",
    layer: "Neurons (ch. 18)",
    score: "score",
    softmax: "Softmax (ch. 14)",
    demo: "* illustrative example",
    nearIn: "nearby vectors",
    sameOut: "similar answers",
    unseen: "It can guess unseen sentences!",
    learnTitle: "Training polishes both",
    weights: "network weights",
    vectors: "word vectors",
    drift: "Words used alike drift closer together",
    w2v: "2013 Word2Vec: focused on vectors (ch. 34)",
    windowNote: "3-word window",
    outside: "can't see outside the window",
    which: "walk(ed)?",
    next: "Ch. 40: the RNN note relay",
  },
};
