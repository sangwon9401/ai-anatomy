import type { ChapterSpec } from "../../../data/types";

export const UNLOCK6 = "You picked up a new building part";

/** What breaks when a kind of part is pulled out of the block (ch. 54 playground). */
export const MISSING = {
  att: "Words can't see each other. A word with two meanings can't use the words before it to pick the right one (ch. 45).",
  ffn: "Each word loses its place to think on its own. Most of what the model has learned is stored here (ch. 55).",
  add: "Every layer overwrites the original information. The deeper you stack, the more the model forgets the sentence it started with (ch. 56).",
  norm: "The numbers swing bigger and bigger from layer to layer, so the calculations get shaky (ch. 57).",
};

export const ch54: ChapterSpec = {
  id: 54,
  part: 6,
  title: "The transformer block blueprint",
  core: false,
  hook: "The 'transformer block' sits in the middle of the chapter 5 blueprint. What's inside if you open it?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Let's zoom in on the middle of the chapter 5 blueprint, the transformer block. GPT is many of these blocks stacked up." },
    { id: "s2", sec: 8, narration: "One vector goes into the block for each word. The same number of vectors, the same size, comes back out." },
    { id: "s3", sec: 8, narration: "The first part is attention. The words look at each other and mix their meanings. We learned it in chapter 45." },
    { id: "s4", sec: 8, narration: "The second is feed-forward. It adds a 'thought' to each word separately. We'll open it up in the next chapter." },
    { id: "s5", sec: 9, narration: "Each part's result is added to the original vector. The straight road the original information travels is called the highway." },
    { id: "s6", sec: 8, narration: "Right before each part, normalization evens out the size of the numbers. It's the method you learned in chapter 15." },
    { id: "s7", sec: 10, narration: "In short: normalize → attention → add, then normalize → feed-forward → add. That's one layer of the block." },
    { id: "s8", sec: 9, narration: "What goes in comes out in the same shape, so blocks can be stacked again and again. GPT-3 has 96 layers of this block." },
  ],
  playgroundTitle: "Pull out a part",
  playgroundIntro: "Tap a part of the block to pull it out. Seeing what breaks shows you what each part does.",
  summary: [
    "One block layer = normalize → attention → add, then normalize → feed-forward → add.",
    "Attention mixes the words together; feed-forward lets each word think. Each result is added to the original vector.",
    "What goes in comes out in the same shape, so blocks can be stacked. GPT-3 has 96 layers.",
  ],
  unlocks: "Block blueprint",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "Which part of the block lets the words look at each other and mix their meanings?",
      choices: ["Feed-forward", "Attention", "Normalization"],
      answer: 1,
      explain: "Attention passes information between words (ch. 45). Feed-forward thinks about each word on its own.",
      review: "s3",
    },
    {
      q: "Which order matches one layer of the block?",
      choices: ["Normalize → attention → add", "Attention → softmax → normalize", "Add → normalize → attention"],
      answer: 0,
      explain: "First even out the sizes (normalize), then go through the part, then add the result to the original vector. Feed-forward follows the same order.",
      review: "s7",
    },
    {
      q: "Why can blocks be stacked as many as 96 layers deep?",
      choices: ["The number of words shrinks each layer", "Each layer has different kinds of parts", "What goes in comes out in the same shape"],
      answer: 2,
      explain: "The number of words and the size of the vectors stay the same, so the output fits straight into the next block.",
      review: "s8",
    },
  ],
  labels: {
    tag: "54. The transformer block blueprint",
    w1: "I",
    w2: "walk",
    w3: "to",
    empty: "empty",
    open: "Let's open this up!",
    inNote: "3 words = 3 vectors",
    inSize: "(GPT-3: 12,288 numbers per word)",
    outNote: "Same count, same size!",
    att: "look at each other",
    ffn: "think alone",
    add: "keep the original",
    norm: "even out sizes",
    road: "Highway",
    arrow: "→",
    oneLayer: "\u2003= one layer",
    layers: "× 96",
    gpt3: "(GPT-3)",
    stack: "You can keep stacking",
  },
};
