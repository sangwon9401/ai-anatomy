import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V4 = [number, number, number, number];

// s1 (en): English has no particles, so word order alone says who did what. Each part is [word, ""];
// the first word of each row is the one who bites.
export const PARTICLE_ROWS: { parts: [string, string][]; same: boolean }[] = [
  { parts: [["Dog", ""], ["bites", ""], ["man", ""]], same: true },
  { parts: [["Man", ""], ["bites", ""], ["dog", ""]], same: false },
];

// s2: same tokens, different order (real GPT-4o tokens, o200k_base: '10' ':' '11' → ids 702, 25, 994)
export const TIME_A = ["10", ":", "11"];
export const TIME_B = ["11", ":", "10"];

// illustrative token vectors (illustrative example, 4 numbers each)
export const TOK_VEC: Record<string, V4> = {
  "10": [0.5, -0.3, 0.8, 0.1],
  ":": [-0.6, 0.4, 0.2, -0.5],
  "11": [0.6, -0.2, 0.7, 0.3],
};

/**
 * A 4-number position pattern in the style of the 2017 Transformer: a fast "hand" turning 1 radian per position
 * and a slow one turning 1/4 radian, each written as (sin, cos). The real paper uses many more speeds.
 */
export const SPEEDS = [1, 1 / 4];
export const pe = (p: number): V4 => [Math.sin(p * SPEEDS[0]), Math.cos(p * SPEEDS[0]), Math.sin(p * SPEEDS[1]), Math.cos(p * SPEEDS[1])];
export const add4 = (a: V4, b: V4): V4 => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const fmt = (x: number) => {
  const v = r2(x);
  return v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2);
};
export const WAVE_NAMES = ["fast sin", "fast cos", "slow sin", "slow cos"];
export const WAVE_COLORS: Highlighter[] = ["orange", "orange", "sky", "sky"];

// s8: what Part 3 gave us
export const PART3_TOOLS = ["Unicode", "Tokens", "BPE", "Token efficiency", "One-hot", "Embedding", "Distributional hypothesis", "Meaning search", "Position info"];

export const ch36: ChapterSpec = {
  id: 36,
  part: 3,
  title: "How does it know the order?",
  core: true,
  hook: "'10:11' and '11:10' are made of exactly the same pieces. How does an AI know they're different times?",
  steps: [
    { id: "s1", sec: 9, narration: "'Dog bites man' and 'Man bites dog' use the same three words, but who bit whom flips. In English, word order says who did what." },
    { id: "s2", sec: 9, narration: "Times work the same way. 10:11 and 11:10 are made of exactly the same pieces, only reordered, and they mean different times." },
    { id: "s3", sec: 9.5, narration: "Attention (ch. 45) looks at all the pieces at once and mixes them. Without position info, both look like the same bag of pieces." },
    { id: "s4", sec: 9, narration: "So we add numbers that tell each piece its position. But adding 1, 2, 3 as they are would bury the meaning of piece 2,000." },
    { id: "s5", sec: 9, narration: "The 2017 Transformer used sine waves: read the height of waves of different speeds at each spot. Values stay between −1 and 1.", tts: "The 2017 Transformer used sine waves: read the height of waves of different speeds at each spot. Values stay between minus 1 and 1." },
    { id: "s6", sec: 9.5, narration: "Read a clock's fast hand and slow hand together and you know the time. Waves work the same way: every spot gets its own pattern." },
    { id: "s7", sec: 9.5, narration: "Add this pattern to each piece's vector. Now the same '10' at position 0 and at position 2 gets different vectors, so order is kept." },
    { id: "s8", sec: 9, narration: "Letters, tokens, IDs, embeddings, position info: text is now numbers a model can compute with. That's Part 3. Next up, Part 4." },
  ],
  playgroundTitle: "Position pattern lab",
  playgroundIntro: "Switch between the two times and turn 'Add position info' on and off. Without it, the model sees both as the same bundle of pieces.",
  summary: [
    "The same pieces in a different order can mean something else (10:11 ≠ 11:10, 'Dog bites man' ≠ 'Man bites dog').",
    "Position info: add a pattern that says 'which position' to each piece's vector.",
    "The pattern is made from sine waves of different speeds (2017). Values stay within −1 to 1 and differ at every position.",
  ],
  unlocks: "Position info",
  quiz: [
    {
      q: "Why do 'Dog bites man' and 'Man bites dog' mean different things?",
      choices: ["They use different words", "In English, word order tells who did what", "One of them is longer"],
      answer: 1,
      explain: "The words are the same; only the order changed. The word before 'bites' is the one doing the biting.",
      review: "s1",
    },
    {
      q: "What goes wrong if we add 1, 2, 3, … as they are for each position?",
      choices: ["The calculation gets too slow", "Later pieces get such big numbers that their meaning is buried", "The first piece disappears"],
      answer: 1,
      explain: "Add 2,000 to piece 2,000 and a meaning number like 0.5 hardly shows. Sine waves always stay between −1 and 1, so that's fine.",
      review: "s4",
    },
    {
      q: "With position info added, how do the vectors of '10' in '10:11' and in '11:10' compare?",
      choices: ["They're the same", "Both become 0", "They're different because the positions differ"],
      answer: 2,
      explain: "Position 0 and position 2 have different patterns, so the sums differ too. That's how the model can tell the order.",
      review: "s7",
    },
  ],
  labels: {
    tag: "36. How does it know the order?",
    sameMeaning: "different meaning!",
    particle: "Same words; the order says who did what",
    diff: "Only one of them makes the news!",
    eq: "=",
    neq: "≠",
    orderMatters: "Same pieces, new order → new meaning",
    src: "GPT-4o tokenizer (o200k_base)",
    attn: "Attention sees it all at once (ch. 45)",
    bag: "Without position, the same bag?!",
    addPos: "piece vector + position = input",
    tokVec: "vector of '10' (illustrative example)",
    plain: "Just add 1, 2, 3…?",
    pos1: "Position 1: +1",
    pos2000: "Position 2,000: +2000",
    buried: "The meaning gets buried!",
    waves: "Sine wave patterns (2017 Transformer)",
    readAt: "at pos 2",
    range: "Values always stay in −1 ~ 1",
    speedsNote: "illustrative example: only 2 speeds (real ones use many more)",
    clockTitle: "A different pattern at every spot",
    fast: "fast hand",
    slow: "slow hand",
    clock: "Like a clock: two hands tell the time",
    posNo: "pos",
    addTitle: "Same '10', different position",
    at0: "10:11 → position 0",
    at3: "11:10 → position 2",
    differ: "Different position, different vector!",
    learned: "* GPT-2 and GPT-3 learn this pattern too",
    from0: "Positions count from 0",
    done: "Part 3 done: text has become numbers!",
    bp: "The front of the blueprint is done",
    next: "Next: Part 4, before the transformer",
    space: "␣",
    ten: "'10'",
    ops: "+=→",
  },
};
