import { UNLOCK6 } from "../../../data/ch54";
import { stats } from "../../../data/ch15";
import type { ChapterSpec } from "../../../data/types";

// Illustrative. A word vector early on, and the same word much later: same shape, 4× the size.
export const EARLY = [3, 17, 9, 11]; // mean 10, spread 5
export const LATE = [12, 68, 36, 44]; // mean 40, spread 20

/** s5: every word normalised with its own numbers */
export const ROWS: { w: string; v: number[] }[] = [
  { w: "I", v: [2.7, 1.9, 1.3, 2.1] },
  { w: "walk", v: [-3, 1, 1, -3] },
  { w: "to", v: EARLY },
];

/** s6: the learned scale and shift (illustrative) */
export const GAIN = [1.5, 0.5, 2.0, 1.0];
export const SHIFT = [0, 0.3, 0, -0.2];

/** s1: one vector drifting bigger through the layers (illustrative) */
export const GROW_STRIP = [0.9, -0.6, 0.4, 1.1, -0.9, 0.3, -0.4, 0.7];
export const GROW = [
  { layer: 1, k: 1 },
  { layer: 24, k: 2 },
  { layer: 48, k: 3.2 },
  { layer: 96, k: 5 },
];

/** Layer normalisation of one vector: subtract its mean, divide by its spread (ch. 15), then scale and shift. */
export function layerNorm(v: number[], gain: number[] | number = 1, shift: number[] | number = 0) {
  const { mean, sd } = stats(v);
  const z = v.map((x) => (x - mean) / sd);
  const g = (i: number) => (typeof gain === "number" ? gain : gain[i]);
  const b = (i: number) => (typeof shift === "number" ? shift : shift[i]);
  return { mean, sd, z, out: z.map((x, i) => x * g(i) + b(i)) };
}

/** playground: the three words' vectors after `layer` layers (illustrative; they grow at different rates and drift a little) */
export function wordsAt(layer: number) {
  return ROWS.map((r, wi) => {
    const k = 1 + (layer - 1) * [0.03, 0.05, 0.04][wi];
    return { w: r.w, v: r.v.map((x, i) => x * k + Math.sin(layer * 0.21 + i * 1.7 + wi) * 0.04 * layer) };
  });
}

export const ch57: ChapterSpec = {
  id: 57,
  part: 6,
  title: "Keeping things steady",
  core: false,
  hook: "If results keep getting added, won't the numbers be huge by layer 96?",
  steps: [
    { id: "s1", sec: 8.5, narration: "In chapter 56, results keep getting added. As they pile up layer after layer, the vector's numbers keep growing." },
    { id: "s2", sec: 10, narration: "Same word 'to', yet a different size at every layer. The parts would need a new ruler each time, and the math gets shaky." },
    { id: "s3", sec: 9.5, narration: "So right before each part, we use chapter 15's normalization: the mean and spread of the numbers inside one word vector." },
    { id: "s4", sec: 9.5, narration: "Subtract the mean 10 and divide by the spread 5. The vector that grew 4 times bigger ends up exactly the same." },
    { id: "s5", sec: 9.5, narration: "This is done for each word separately. Each word uses only its own 12,288 numbers to find the mean and spread." },
    { id: "s6", sec: 9.5, narration: "Last, each number is multiplied by a scale and gets a shift. These are learned, so the model picks the right size itself." },
    { id: "s7", sec: 9.5, narration: "GPT normalizes right before attention and right before feed-forward, and leaves the original values on the highway alone." },
  ],
  playgroundTitle: "Evening out the sizes",
  playgroundIntro: "Raise the layer slider to grow the word vectors. Then turn on layer normalization and watch what goes into the parts.",
  summary: [
    "As results pile up layer after layer, the vector's numbers grow and become uneven.",
    "Layer normalization: each word subtracts the mean of its own numbers and divides by their spread (ch. 15), then gets scaled and shifted.",
    "GPT normalizes right before attention and right before feed-forward.",
  ],
  unlocks: "Layer normalization",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "To normalize the word vector [3, 17, 9, 11], what do you subtract?",
      choices: ["The mean, 10", "The largest value, 17", "The smallest value, 3"],
      answer: 0,
      explain: "(3 + 17 + 9 + 11) ÷ 4 = 10. Subtract the mean, then divide by the spread, 5.",
      review: "s3",
    },
    {
      q: "In layer normalization, what are the mean and spread computed from?",
      choices: ["The numbers in the same position across all words", "One word's own numbers", "The whole training data"],
      answer: 1,
      explain: "Each word separately, from the numbers inside its own vector. In GPT-3, that's 12,288 numbers.",
      review: "s5",
    },
    {
      q: "Where is layer normalization in GPT?",
      choices: ["Only before the tokenizer, at the very start", "Only after softmax", "Right before attention and right before feed-forward"],
      answer: 2,
      explain: "Twice per block, the sizes are evened out right before each part. Values on the highway are left alone.",
      review: "s7",
    },
  ],
  labels: {
    tag: "57. Keeping things steady",
    layer: "Layer",
    grow: "Bigger with every layer",
    fine: "a good size",
    toy: "illustrative example",
    early: "'to' at layer 3",
    late: "'to' at layer 90",
    same: "Same shape, but 4× the size!",
    shaky: "Each part needs a new ruler every time → shaky",
    mean: "mean",
    spread: "spread",
    step1: "① − mean",
    step2: "② ÷ spread",
    ch15: "(ch. 15)",
    equal: "Identical!",
    title: "Layer normalization",
    en: "(LayerNorm, for short)",
    own: "Each word on its own, with its own numbers",
    real: "(GPT-3: 12,288 numbers per word)",
    z: "Normalized",
    gain: "× scale",
    shift: "+ shift",
    out: "= into the part",
    learned: "The scale and shift are learned in training",
    before: "Right before the part",
    keepRoad: "Values on the highway stay as they are",
    arrow: "→",
    w1: "I",
    w2: "walk",
    w3: "to",
  },
};
