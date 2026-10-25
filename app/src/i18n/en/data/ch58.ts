import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

export const MODELS = [
  { name: "GPT-1", year: "2018", layers: 12 },
  { name: "GPT-2", year: "2019", layers: 48 },
  { name: "GPT-3", year: "2020", layers: 96 },
];

// GPT-3: per block, attention 4·d² + feed-forward 8·d² weights (d = 12,288)
export const PER_LAYER = 12 * 12288 * 12288; // 1,811,939,328 ≈ 1.8 billion
export const ALL_LAYERS = PER_LAYER * 96; // 173,946,175,488 ≈ 174 billion (of 175 billion)

/** What the vector of 'to' carries at each depth (illustrative, a rough picture of what research finds). */
export const DEPTH_NOTES = [
  { layer: 1, note: "the word 'to' itself, how it's spelled", band: "shallow" },
  { layer: 24, note: "'to' = heading somewhere", band: "shallow" },
  { layer: 48, note: "'I' is the one walking", band: "middle" },
  { layer: 72, note: "someone going somewhere on foot", band: "deep" },
  { layer: 96, note: "next comes a place, like 'school'", band: "deep" },
] as const;

/** Peeking at the next-word guess after each depth (illustrative; the last one is the course's 52%). */
export const PEEK_LAYERS = [1, 12, 24, 48, 72, 96];
export const PEEK = [
  { w: "school", c: "yellow" as const, p: [2, 4, 9, 27, 44, 52] },
  { w: "the", c: "mint" as const, p: [2, 5, 12, 22, 22, 21] },
  { w: "work", c: "sky" as const, p: [1, 2, 4, 9, 12, 12] },
  { w: "pizza", c: "pink" as const, p: [3, 3, 2, 1, 1, 1] },
];

/** Linear blend of the PEEK numbers at any layer 1–96. */
export function peekAt(layer: number) {
  let i = PEEK_LAYERS.findIndex((l) => l >= layer);
  if (i <= 0) i = 1;
  const a = PEEK_LAYERS[i - 1];
  const b = PEEK_LAYERS[i];
  const t = Math.max(0, Math.min(1, (layer - a) / (b - a)));
  return PEEK.map((r) => ({ ...r, now: r.p[i - 1] + (r.p[i] - r.p[i - 1]) * t }));
}

export const ch58: ChapterSpec = {
  id: 58,
  part: 6,
  title: "Stacking blocks",
  core: false,
  hook: "One block already works. So why stack 96 of them?",
  steps: [
    { id: "s1", sec: 8.5, narration: "What goes into a block comes out in the same shape. So, like Lego, you can keep snapping more blocks on below it." },
    { id: "s2", sec: 8.5, narration: "GPT-1 has 12 layers, GPT-2 has 48, and GPT-3 has 96. They stacked the very same block design over and over." },
    { id: "s3", sec: 8.5, narration: "The shape is the same, but the numbers inside differ from layer to layer. So each layer does a slightly different job." },
    { id: "s4", sec: 9.5, narration: "Shallow layers mostly handle how a word looks and its neighbors; middle layers handle roles and relations in the sentence." },
    { id: "s5", sec: 9.5, narration: "Deeper layers handle the whole sentence's meaning and what comes next. Information piles up on the same 'to', layer by layer." },
    { id: "s6", sec: 9, narration: "If we peek at the next-word guess after each layer, the probability of 'school' rises the deeper we go." },
    { id: "s7", sec: 9.5, narration: "One GPT-3 block layer has about 1.8 billion numbers. All 96 add up to about 174 billion, almost all of the 175 billion." },
    { id: "s8", sec: 9, narration: "Stacking this deep works thanks to the highway and normalization. Next chapter: two ways to use the block." },
  ],
  playgroundTitle: "Layer explorer",
  playgroundIntro: "Move the slider down through the layers. See what piles up in the vector for 'to', and how the next-word guess changes.",
  summary: [
    "A block's output has the same shape as its input, so blocks stack. GPT-1: 12 layers, GPT-2: 48, GPT-3: 96.",
    "The design is the same, but each layer has its own numbers, so shallow and deep layers do different jobs.",
    "The deeper you go, the more context and next-word information a word vector carries. Almost all of GPT-3's numbers are in the blocks.",
  ],
  unlocks: "Stacking blocks",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "How many layers of transformer blocks does GPT-3 have?",
      choices: ["12 layers", "48 layers", "96 layers"],
      answer: 2,
      explain: "GPT-1 has 12 layers, GPT-2 has 48, and GPT-3 has 96.",
      review: "s2",
    },
    {
      q: "When blocks are stacked, what is the same in every layer?",
      choices: ["The block's design (shape)", "The numbers inside the block", "The job the layer does"],
      answer: 0,
      explain: "The design is the same; the numbers inside are learned separately for each layer. That's why their jobs differ.",
      review: "s3",
    },
    {
      q: "What happens to the vector for 'to' in deeper layers?",
      choices: ["Its information gets erased", "It gathers the whole sentence's meaning and hints about the next word", "Only spelling information is left"],
      answer: 1,
      explain: "Each layer adds its result (ch. 56), so context keeps piling up.",
      review: "s5",
    },
  ],
  labels: {
    tag: "58. Stacking blocks",
    att: "Attention",
    ffn: "Feed-forward",
    layer: "",
    nLayers: " layers",
    dots: "⋮",
    same: "Snap the same shape on, again and again",
    design: "The same design, repeated",
    shape: "Same shape",
    nums: "Different numbers in every layer",
    word: "to",
    shallow: "shallow",
    middle: "middle",
    deep: "deep",
    toy: "illustrative example",
    rough: "a rough picture of the trend",
    peek: "Peeking at the next word after each layer",
    gan: "school",
    perLayer: "One block layer: about 1.8 billion",
    times: "× 96 layers = about 174 billion",
    total: "GPT-3 in total: 175 billion",
    almost: "Almost all of it!",
    thanks: "The secret to stacking deep",
    road: "Highway (ch. 56)",
    norm: "Normalize (ch. 57)",
    next: "Next: ch. 59, Encoder vs decoder",
    w1: "I",
    w2: "walk",
    w3: "to",
  },
};
