import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

/** s1: the telephone game, each line one more person down the chain; the changes come from GARBLE
 * (every swap keeps the sentence the same length, so the scene can mark changed letters by position). */
export const PHONE = ["I walk to school", "I walk to a pool", "I talk to a fool", "I took two fools", "I took two tools"];

/** swaps in the order they happen (the playground garbles the sentence the same way) */
export const GARBLE: [string, string][] = [
  ["school", "a pool"],
  ["walk", "talk"],
  ["pool", "fool"],
  ["talk", "took"],
  ["to a fool", "two fools"],
  ["fools", "tools"],
];

export function garble(sentence: string, k: number) {
  let s = sentence;
  for (const [a, b] of GARBLE.slice(0, k)) s = s.replace(a, b);
  return s;
}

/** s2: one vector replaced layer after layer (illustrative) */
export const DRIFT = [
  [2.0, 1.0, -1.0, 3.0],
  [2.5, -0.5, 0.5, 2.9],
  [2.4, -1.4, 1.4, 2.3],
  [2.0, -2.1, 2.1, 1.5],
  [1.6, -2.4, 2.4, 0.8],
];

/** s4: x + f(x) (illustrative) */
export const RES_X = [2.0, 1.0, -1.0, 3.0];
export const RES_F = [0.3, -0.2, 0.5, 0.1];

export const cosine = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b);

// ---- playground: a toy 8-number vector through up to 48 layers ----
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(3);
const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
export const TOY_D = 8;
export const TOY_X0 = [1.5, -0.8, 0.6, 1.2, -1.4, 0.3, -0.5, 0.9];
const LAYERS = Array.from({ length: 48 }, () =>
  Array.from({ length: TOY_D }, (_, i) => Array.from({ length: TOY_D }, (_, k) => (i === k ? 0.7 : 0) + (gauss() * 0.7) / Math.sqrt(TOY_D))),
);
const part = (W: number[][], x: number[]) => W.map((r) => Math.tanh(r.reduce((s, w, k) => s + w * x[k], 0)));

/** Run n layers. Without the highway each layer replaces the vector (kept at the same size, so only the direction changes). */
export function runLayers(n: number, highway: boolean) {
  let x = TOY_X0;
  const size0 = Math.hypot(...TOY_X0);
  for (const W of LAYERS.slice(0, n)) {
    const f = part(W, x);
    if (highway) x = x.map((v, k) => v + 0.15 * f[k]);
    else {
      const s = Math.hypot(...f);
      x = f.map((v) => (v / s) * size0);
    }
  }
  return { x, keep: Math.max(0, cosine(x, TOY_X0)), size: Math.hypot(...x), size0 };
}

export const ch56: ChapterSpec = {
  id: 56,
  part: 6,
  title: "The information highway",
  core: false,
  hook: "After 96 layers, wouldn't the information in the original sentence be wiped out?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Ever played the telephone game? The more people a message passes through, the stranger it gets." },
    { id: "s2", sec: 9.5, narration: "Stacking layers deep does the same thing. If every layer replaces the whole vector, the original information fades." },
    { id: "s3", sec: 10, narration: "So the block doesn't swap the vector out. It adds each part's result to the original vector: x + f(x)." },
    { id: "s4", sec: 9.5, narration: "The original x stays as it is, and the part adds only a small fix. So the original information isn't erased." },
    { id: "s5", sec: 10, narration: "In the picture, the original information runs straight down the highway, and the parts add results from the side roads." },
    { id: "s6", sec: 10.5, narration: "It helps training too. The 'fix this much' signal rides the highway all the way back to the first layer (chapter 23)." },
    { id: "s7", sec: 9.5, narration: "This path that adds results to the original is called a residual connection. Each part only handles the 'difference to fix'." },
  ],
  playgroundTitle: "Highway off and on",
  playgroundIntro: "Add more layers. Compare how much of the original information survives with the highway (residual connection) off, and then on.",
  summary: [
    "If every layer replaces the whole vector, the original information fades, like in the telephone game.",
    "Residual connection: output = x + f(x). The original rides the highway; each part only adds the difference to fix.",
    "The fix signal also rides the highway back to the early layers, so the model can be stacked deep.",
  ],
  unlocks: "Residual connection",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "How do you write a residual connection? (x is the original vector, f is the part)",
      choices: ["f(x)", "x + f(x)", "x × f(x)"],
      answer: 1,
      explain: "The part's result f(x) is added to the original vector x. It's not a swap (keeping only f(x)).",
      review: "s3",
    },
    {
      q: "If x = [2, 1] and the part's result is f(x) = [0.5, −0.5], what does the block output?",
      choices: ["[0.5, −0.5]", "[2, 1]", "[2.5, 0.5]"],
      answer: 2,
      explain: "x + f(x) = [2 + 0.5, 1 − 0.5] = [2.5, 0.5].",
      review: "s4",
    },
    {
      q: "Why does the residual connection make training easier?",
      choices: ["The fix signal rides the highway back to the early layers", "There are fewer numbers to compute", "There are fewer words"],
      answer: 0,
      explain: "Going through part after part weakens the signal, but along the highway it arrives without weakening (ch. 23, backpropagation).",
      review: "s6",
    },
  ],
  labels: {
    tag: "56. The information highway",
    person: "th person",
    orig: "Start",
    layer: "Layer",
    keep: "Similarity to start",
    blur: "The original information fades",
    toy: "illustrative example",
    swap: "Swap",
    add: "Add",
    x: "x",
    fx: "f(x)",
    xfx: "x + f(x)",
    xMeans: "x = original vector",
    fMeans: "f(x) = the part's result",
    origVec: "Original x",
    plusF: "+ f(x)",
    out: "= output",
    stays: "x is still there!",
    road: "Highway",
    straight: "The original runs straight",
    side: "Computed on a side road",
    plusNote: "⊕ adds the result",
    lost: "x is gone",
    w1: "I",
    w2: "walk",
    w3: "to",
    noRoad: "Without the highway",
    withRoad: "With the highway",
    part: "Part",
    weak: "getting weaker",
    strong: "arrives intact!",
    signal: "↑ the 'fix this much' signal",
    name: "Residual connection",
    en: "(also called a skip connection)",
    diff: "Residual = the leftover difference to fix",
    deep: "That's how 96 layers can be stacked",
    resnet: "In 2015, the image recognition model ResNet used this trick to stack 152 layers",
  },
};
