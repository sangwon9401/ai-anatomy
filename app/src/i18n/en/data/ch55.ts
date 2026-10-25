import type { ChapterSpec } from "../../../data/types";

// A toy feed-forward layer, 4 → 16 → 4 (the same 4× widening as GPT-3's 12,288 → 49,152 → 12,288).
// All numbers are illustrative; the scene and the playground compute from these same weights.

export const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));

/** each word's vector after attention (illustrative) */
export const FFN_WORDS: { w: string; x: number[] }[] = [
  { w: "I", x: [1.2, 0.1, -0.3, -0.5] },
  { w: "walk", x: [-0.2, 1.3, 0.2, -0.1] },
  { w: "to", x: [-0.3, 0.2, 1.1, 1.0] },
];

export const W1 = [
  [0.3, -0.6, -0.1, -0.6], [0.4, 0, 0, -0.5], [1.4, -0.4, -0.4, -0.4], [-0.3, 0.1, -0.4, -0.6],
  [0.3, 0, 0.4, 0.5], [-0.2, 0.3, -0.3, 0.2], [0, 0.5, 0.1, -0.7], [-0.4, 1.4, -0.3, -0.3],
  [0.5, -0.3, 0.6, 0.4], [-0.1, 0.3, -0.5, -0.2], [0.3, -0.7, -0.7, 0], [0.5, 0.1, 0.3, 0.4],
  [-0.4, -0.3, 1, 1], [0.1, 0.1, -0.6, -0.2], [0, 0.5, -0.1, -0.1], [0, 0.1, 0.4, 0.5],
];
export const B1 = [-0.3, -0.2, -0.3, -0.3, -0.3, -0.2, -0.4, -0.3, -0.4, -0.3, -0.3, -0.4, -0.3, -0.3, -0.1, -0.1];
export const W2 = [
  [0, 0.4, 0.2, 0, -0.2, 0, 0.1, -0.1, -0.1, 0.3, -0.3, 0.5, 0.1, 0.3, 0.3, -0.4],
  [-0.1, -0.3, -0.1, 0.3, 0.1, 0.5, 0.5, 0.4, 0.1, 0.4, 0.5, 0.3, 0, 0.1, 0.4, -0.1],
  [0.1, -0.4, 0, 0, -0.2, 0.4, -0.5, 0.1, -0.4, -0.1, 0.4, -0.5, 0.3, -0.4, -0.2, 0.5],
  [0, -0.3, 0.3, -0.3, 0.1, 0.1, 0.3, 0.2, 0.3, -0.4, -0.3, -0.4, 0.8, 0.2, 0.1, 0.2],
];

/** Neurons with a (made-up) name tag; the rest are hard to name, as in real models. */
export const NEURON_NAMES: Record<number, string> = {
  2: "words for a person, like 'I'",
  7: "action words, like 'walk'",
  12: "'to' after a movement word → a place comes next",
};

export function ffn(x: number[], bend = true) {
  const pre = W1.map((w, i) => w.reduce((a, wk, k) => a + wk * x[k], B1[i]));
  const h = bend ? pre.map(gelu) : pre;
  const y = W2.map((w) => w.reduce((a, wj, j) => a + wj * h[j], 0));
  return { pre, h, y, out: x.map((v, k) => v + y[k]) };
}

// GPT-3 sizes: d = 12,288, the wide layer is 4d. Per layer: attention 4·d², feed-forward 8·d² weights.
export const D = 12288;
export const FFN_PARAMS = 8 * D * D * 96; // 115,964,116,992 ≈ 116 billion
export const ATT_PARAMS = 4 * D * D * 96; // 57,982,058,496 ≈ 58 billion

export const ch55: ChapterSpec = {
  id: 55,
  part: 6,
  title: "The thinking layer",
  core: true,
  hook: "Attention let the words share information. What does each word do next?",
  steps: [
    { id: "s1", sec: 8, narration: "With attention, the words mixed in each other's meanings. Now it's the block's second part: feed-forward." },
    { id: "s2", sec: 9, narration: "Feed-forward is a small neural network each word goes through on its own (chapter 18). Every word uses the very same machine." },
    { id: "s3", sec: 10, narration: "Inside, 4 numbers widen 4 times to 16, then shrink back to 4. In the wide layer, GELU bends the numbers (chapter 17)." },
    { id: "s4", sec: 9, narration: "Each neuron in the wide layer reacts to some pattern. Let's say this one lights up when it sees 'to' after a movement word." },
    { id: "s5", sec: 8.5, narration: "What the lit-up neurons produce is added to the original vector. That's how knowledge gets attached to each word." },
    { id: "s6", sec: 10.5, narration: "In GPT-3, 12,288 numbers widen to 49,152 and then come back to 12,288. The same 4 times." },
    { id: "s7", sec: 9, narration: "About two-thirds of GPT-3's 175 billion numbers are in feed-forward. It's the warehouse of what the model learned." },
    { id: "s8", sec: 8.5, narration: "Attention: words talk to each other. Feed-forward: each word thinks alone. Feed-forward is now filled in on the blueprint!" },
  ],
  playgroundTitle: "Look inside the thinking layer",
  playgroundIntro: "Pick a word and send it through feed-forward. Tap the neurons to see which ones light up in the wide layer.",
  summary: [
    "Feed-forward: a small neural network each word goes through on its own. Every word uses the same machine.",
    "It widens 4 times (bending with GELU), then narrows again. GPT-3: 12,288 → 49,152 → 12,288.",
    "Its result is added to the original vector, attaching knowledge. About two-thirds of the model's numbers live here.",
  ],
  unlocks: "Feed-forward",
  quiz: [
    {
      q: "How does feed-forward handle the words?",
      choices: ["Each word on its own, all with the same machine", "It mixes all the words together", "Only the last word"],
      answer: 0,
      explain: "Mixing words together is attention's job. Feed-forward sends each word on its own through a machine with the same numbers.",
      review: "s2",
    },
    {
      q: "Inside GPT-3's feed-forward, how many numbers do the 12,288 widen to?",
      choices: ["24,576", "49,152", "96"],
      answer: 1,
      explain: "12,288 × 4 = 49,152. They widen, then come back to 12,288.",
      review: "s6",
    },
    {
      q: "Why does the wide layer bend the numbers with GELU?",
      choices: ["To turn the numbers into probabilities", "To tell the model the word order", "To do things a single straight line can't"],
      answer: 2,
      explain: "Without the bend, the whole machine collapses into one straight-line function. Bending lets it catch complex patterns (ch. 17).",
      review: "s3",
    },
  ],
  labels: {
    tag: "55. The thinking layer",
    here: "This chapter's star",
    same: "The same machine (same numbers, too)",
    alone: "Words don't mix here",
    ffn: "Feed-forward",
    inside: "inside feed-forward",
    four: "4 numbers",
    wide: "16 (4× wider)",
    back: "back to 4",
    gelu: "GELU (ch. 17)",
    tagN: "'to' after a movement word → a place comes next",
    toy: "illustrative example",
    orig: "Original",
    thought: "+ thought",
    result: "= new vector",
    knowledge: "Knowledge attached!",
    real: "In the real GPT-3",
    n1: "12,288",
    n2: "49,152",
    times: "× 4",
    total: "GPT-3: 175 billion numbers",
    ffnPart: "Feed-forward ≈ 116 billion",
    attPart: "Attention ≈ 58 billion",
    twoThirds: "about two-thirds",
    store: "the knowledge warehouse",
    filled: "Filled!",
    talk: "Attention = words talk",
    think: "Feed-forward = each word thinks",
    w1: "I",
    w2: "walk",
    w3: "to",
  },
};
