import type { ChapterSpec } from "../../../data/types";

export const END = "<end>";

export const QUESTION = ["Why", "is", "the", "sky", "blue?"];
export const ANSWER = ["Air", "scatters", "blue", "sunlight", "more", "than", "red", "."];
export const MISTAKE = {
  question: ["What's the capital", "of France?"],
  answer: ["It's", "Lyon", ".", "Oh,", "wait", ".", "It's", "Paris", "."],
  wrong: 1,
  fix: 3,
};
// Two continuations of the same prefix, picked by chance (illustrative probabilities).
export const BRANCH = {
  prefix: ["Air"],
  a: { p: 0.48, words: ["scatters", "blue light", "…"] },
  b: { p: 0.31, words: ["is full of", "tiny molecules", "…"] },
};

/** Toy next-piece table for the playground: the next piece depends only on the last one. */
export const STORY_START = "Once upon a time,";
export const STORY: Record<string, { w: string; p: number }[]> = {
  "Once upon a time,": [
    { w: "a tiger", p: 0.5 },
    { w: "in a small", p: 0.3 },
    { w: "a princess", p: 0.2 },
  ],
  "in a small": [
    { w: "village,", p: 0.6 },
    { w: "forest,", p: 0.4 },
  ],
  "village,": [
    { w: "a tiger", p: 0.4 },
    { w: "a rabbit", p: 0.35 },
    { w: "a princess", p: 0.25 },
  ],
  "forest,": [
    { w: "a tiger", p: 0.4 },
    { w: "a rabbit", p: 0.35 },
    { w: "a princess", p: 0.25 },
  ],
  "a tiger": [
    { w: "lived.", p: 0.55 },
    { w: "baked", p: 0.3 },
    { w: "appeared.", p: 0.15 },
  ],
  "a rabbit": [
    { w: "lived.", p: 0.5 },
    { w: "baked", p: 0.5 },
  ],
  "a princess": [
    { w: "lived.", p: 0.6 },
    { w: "sang", p: 0.4 },
  ],
  baked: [
    { w: "cookies.", p: 0.6 },
    { w: "bread.", p: 0.4 },
  ],
  sang: [{ w: "a song.", p: 1 }],
  "lived.": [
    { w: END, p: 0.45 },
    { w: "Then", p: 0.55 },
  ],
  "cookies.": [
    { w: END, p: 0.5 },
    { w: "Then", p: 0.5 },
  ],
  "bread.": [
    { w: END, p: 0.5 },
    { w: "Then", p: 0.5 },
  ],
  "appeared.": [
    { w: END, p: 0.3 },
    { w: "Then", p: 0.7 },
  ],
  "a song.": [
    { w: END, p: 0.5 },
    { w: "Then", p: 0.5 },
  ],
  Then: [
    { w: "a tiger", p: 0.4 },
    { w: "a rabbit", p: 0.35 },
    { w: "a princess", p: 0.25 },
  ],
};
export const STORY_MAX = 14;

export const ch02: ChapterSpec = {
  id: 2,
  part: 0,
  title: "An AI that writes one word at a time",
  core: true,
  hook: "Why does ChatGPT's answer show up bit by bit, as if someone were typing?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Ask a question and the answer appears piece by piece. That's no special effect: it really is made one piece at a time." },
    { id: "s2", sec: 9.5, narration: "Look inside: the whole text so far, your question plus the answer so far, goes into the model. One next piece comes out." },
    { id: "s3", sec: 9.5, narration: "The piece joins the end, and the longer text goes back in. Writing by rereading its own output like this is called autoregressive." },
    { id: "s4", sec: 8, narration: "So when does it stop? When a special piece that means \"the end\" is picked. It's called the end token." },
    { id: "s5", sec: 7, narration: "9 pieces means 9 runs of the model; 100 pieces, 100 runs. So longer answers take longer." },
    { id: "s6", sec: 9, narration: "And once a piece is added, it's never erased. If something earlier was wrong, the fix has to be written after it." },
    { id: "s7", sec: 8, narration: "The same question gets a slightly different answer each time because pieces are drawn by probability. More in chapter 81." },
  ],
  playgroundTitle: "Build a story piece by piece",
  playgroundIntro: "You are the model: pick the next piece. Press \"Draw by probability\" to let chance pick one for you.",
  summary: [
    "Put the whole text in, and one next piece comes out.",
    "Add that piece and put the text back in, until the end token comes out.",
    "The model runs once per piece, and added pieces are never erased.",
  ],
  unlocks: "The end token",
  quiz: [
    {
      q: "What's the real reason the answer appears one piece at a time?",
      choices: ["It's shown slowly on purpose, to look nice", "The model runs once for every piece it makes", "The internet is slow"],
      answer: 1,
      explain: "One piece = one run of the model. You see each piece as soon as it's made.",
      review: "s2",
    },
    {
      q: "When does ChatGPT stop writing?",
      choices: ["When the answer is as long as the question", "When a special piece meaning \"the end\" is picked", "Only when the user tells it to stop"],
      answer: 1,
      explain: "The end token is picked by probability like any other piece. The moment it's picked, writing stops.",
      review: "s4",
    },
    {
      q: "What if it added a wrong piece earlier?",
      choices: ["It erases it right away and rewrites it", "It can't erase it; to fix it, it has to keep writing after it", "It starts again from the beginning"],
      answer: 1,
      explain: "Generating only ever adds pieces, so a correction is just more writing.",
      review: "s6",
    },
  ],
  labels: {
    tag: "2. An AI that writes one word at a time",
    model: "Model",
    soFar: "the text so far",
    next: "next piece",
    loop: "add it, go again!",
    round: "round",
    end: "It stops when the end token comes out",
    stop: "Stop",
    count: "9 pieces = 9 runs of the model",
    hundred: "100 pieces = 100 runs",
    longer: "longer = slower",
    noErase: "Once it's added, it can't be erased",
    fixLater: "Corrections get added after it, too",
    sample: "Picked by probability (ch. 81)",
    auto: "autoregressive",
    really: "Truly piece by piece!",
  },
};
