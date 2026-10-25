import type { ChapterSpec, Highlighter } from "../../../data/types";

export type V3 = [number, number, number];

// illustrative 3-number embeddings (illustrative example), four themed clusters; nearest neighbours and label overlaps
// (for the scene's view angles) checked with a script. `side`/`dy` place the word label in the scene.
export const STARS: { w: string; v: V3; group: number; side?: "l"; dy?: number }[] = [
  { w: "dog", v: [0.8, 0.7, -0.2], group: 0, side: "l" },
  { w: "cat", v: [0.6, 0.9, 0.0], group: 0 },
  { w: "rabbit", v: [0.35, 0.85, -0.55], group: 0, side: "l" },
  { w: "tiger", v: [1.0, 0.75, 0.2], group: 0 },
  { w: "apple", v: [-0.7, 0.5, 0.5], group: 1, side: "l" },
  { w: "grape", v: [-0.95, 0.75, 0.55], group: 1, side: "l" },
  { w: "banana", v: [-0.5, 0.95, 0.75], group: 1 },
  { w: "strawberry", v: [-0.8, 0.9, 0.2], group: 1, side: "l" },
  { w: "bus", v: [0.1, -0.8, 0.5], group: 2, side: "l", dy: 10 },
  { w: "subway", v: [0.5, -0.95, 0.3], group: 2 },
  { w: "bicycle", v: [-0.15, -0.55, 0.85], group: 2, side: "l" },
  { w: "airplane", v: [0.45, -0.4, 0.95], group: 2 },
  { w: "school", v: [-0.3, -0.4, -0.75], group: 3 },
  { w: "teacher", v: [0.0, -0.15, -0.95], group: 3 },
  { w: "homework", v: [-0.6, -0.35, -0.6], group: 3, side: "l" },
  { w: "classroom", v: [-0.35, -0.75, -0.9], group: 3 },
];
export const GROUPS: { name: string; c: Highlighter }[] = [
  { name: "animals", c: "yellow" },
  { name: "fruit", c: "pink" },
  { name: "vehicles", c: "sky" },
  { name: "school", c: "mint" },
];

export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** small seeded PRNG so the "before training" positions are the same everywhere */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(33);
export const RANDOM_START: V3[] = STARS.map(() => [rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9]);

/** Turn around the vertical axis by `yaw`, tilt by `pitch`; returns screen x, y and depth (−1 far … 1 near). */
export function project(v: V3, yaw: number, pitch: number) {
  const x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw);
  const z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  const y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return { x: x1, y: y2, z: z2 };
}

// GPT-3: 50,257 tokens × 12,288 numbers = 617,558,016
export const GPT3_TABLE = 50257 * 12288;

export const ch33: ChapterSpec = {
  id: 33,
  part: 3,
  title: "Embeddings: coordinates of meaning",
  core: true,
  hook: "How can numbers show that 'dog' and 'cat' are alike?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Instead of one-hot, each word gets a short row of numbers: dog is [0.8, 0.7, −0.2]. Turning words into rows like this is embedding.", tts: "Instead of one-hot, each word gets a short row of numbers: dog is 0.8, 0.7, minus 0.2. Turning words into rows like this is embedding." },
    { id: "s2", sec: 7, narration: "Three numbers make one point in 3D space. The words float in space like stars in constellations." },
    { id: "s3", sec: 9, narration: "Words with similar meanings gather close together: animals with animals, fruit with fruit. It's chapter 8's word map, in 3D." },
    { id: "s4", sec: 9.5, narration: "The dot product measures how alike they are (ch. 9). dog·cat is 1.11, dog·bus is −0.58. The more they point the same way, the bigger.", tts: "The dot product measures how alike they are. Dog and cat give 1.11, dog and bus give minus 0.58. The more they point the same way, the bigger." },
    { id: "s5", sec: 8.5, narration: "Inside the model is an embedding table, one row per token. Use the token's number to find its row and take it out." },
    { id: "s6", sec: 9.5, narration: "At first the table is filled with random numbers. As the model practices guessing the next piece, similar words find their places." },
    { id: "s7", sec: 9.5, narration: "How big is the real one? GPT-3 has 12,288 numbers per token and about 50,000 rows: over 600 million numbers in this table alone." },
    { id: "s8", sec: 9.5, narration: "Embedding turns tokens into coordinates of meaning: the blueprint's second part is in. Next, how do coordinates get their meaning?" },
  ],
  playgroundTitle: "Spin the constellation",
  playgroundIntro: "Drag to spin the space. Tap a star (a word) to see its three numbers and its nearest words. Use the slider to compare before and after training.",
  summary: [
    "Embedding: giving every token a short row of numbers (a vector). The numbers are its coordinates.",
    "Words with similar meanings sit close together and point the same way (distance ch. 8, dot product ch. 9).",
    "The numbers in the embedding table are set by training. GPT-3's table holds over 600 million numbers.",
  ],
  unlocks: "Embedding",
  quiz: [
    {
      q: "What is an embedding?",
      choices: ["Giving every token a short row of numbers that carries meaning", "Giving every token an ID number", "Sorting words in alphabetical order"],
      answer: 0,
      explain: "Unlike IDs (ch. 29) or one-hot (ch. 32), these coordinates are built so that similar words get similar numbers.",
      review: "s1",
    },
    {
      q: "What is the dot product of dog [0.8, 0.7, −0.2] and cat [0.6, 0.9, 0]?",
      choices: ["0", "1.11", "−0.58"],
      answer: 1,
      explain: "0.8×0.6 + 0.7×0.9 + (−0.2)×0 = 0.48 + 0.63 + 0 = 1.11.",
      review: "s4",
    },
    {
      q: "How are the numbers in the embedding table decided?",
      choices: ["A person sets them one word at a time", "In dictionary order", "Random at first, then fixed up by training"],
      answer: 2,
      explain: "They are nudged little by little while the model practices guessing the next piece. Over time, similar words gather together.",
      review: "s6",
    },
  ],
  labels: {
    tag: "33. Embeddings: coordinates of meaning",
    dog: "dog",
    dogVec: "[0.8, 0.7, −0.2]",
    emb: "Embedding: word → numbers",
    oneHot: "one-hot: about 200,000 slots",
    short: "embedding: a few numbers",
    point: "3 numbers = a point in 3D space",
    constel: "Word constellations",
    example: "illustrative example (real ones have thousands of numbers)",
    near: "Similar meanings sit close",
    dotTitle: "Likeness = dot product (ch. 9)",
    dot1: "dog · cat = 1.11",
    dot2: "dog · bus = −0.58",
    sameDir: "same way → bigger",
    table: "Embedding table",
    rowNote: "1 row = 1 token",
    example5: "illustrative example",
    lookup: "Take out a row by token ID",
    matmul: "one-hot × table = that row (ch. 11, matrix multiplication)",
    before: "Before training: random",
    after: "After training: alike words together",
    real: "GPT-3's embedding table",
    rows: "50,257 rows (tokens)",
    cols: "12,288 columns (numbers)",
    total: "50,257 × 12,288 = 617,558,016",
    over: "Over 600 million numbers!",
    bp: "Second part of the blueprint done!",
    empty: "empty",
    next: "Next: how do coordinates get meaning? (ch. 34)",
    ax1: "no.1",
    ax2: "no.2",
    ax3: "no.3",
    id: "ID",
  },
};
