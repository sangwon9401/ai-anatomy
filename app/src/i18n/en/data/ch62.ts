import { UNLOCK6 } from "../../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKind } from "../../../data/part6-block";
import { PIPELINE } from "../../../data/ch05";
import type { ChapterSpec, Highlighter } from "../../../data/types";

// ---- the boss playground: round 1 builds the block, round 2 the whole blueprint ----
export type Card = { id: string; kind: string; name: string; color: Highlighter | null };
export type Slot = { kind: string; hint: string };

const BLOCK_HINT: Record<BlockKind, string> = {
  norm: "Right before each part, first even out the size of the numbers (ch. 57).",
  att: "After normalizing comes the part where the words look at each other (ch. 45).",
  add: "Each part's result is added to the original vector on the highway (ch. 56).",
  ffn: "After the second normalize comes the part where each word thinks on its own (ch. 55).",
};
export const BLOCK_SLOTS: Slot[] = BLOCK_ORDER.map((k) => ({ kind: kindOf(k), hint: BLOCK_HINT[kindOf(k)] }));
export const BLOCK_CARDS: Card[] = [
  ...BLOCK_ORDER.map((k, i) => ({ id: `b${i}`, kind: kindOf(k), name: KIND[kindOf(k)].name, color: KIND[kindOf(k)].color })),
  { id: "bx", kind: "softmax", name: "Softmax", color: "mint" },
];

const outer = (key: string) => PIPELINE.find((p) => p.key === key)!;
export const BLOCK_CARD_NAME = "Transformer block × 96";
export const BP_SLOTS: Slot[] = [
  { kind: "tok", hint: "The first part to receive the text cuts it into pieces (ch. 29)." },
  { kind: "emb", hint: "This part turns piece numbers into meaningful numbers (ch. 33)." },
  { kind: "pos", hint: "This part tells which position each piece is in (ch. 36)." },
  { kind: "block", hint: "In the middle, the block you just built is stacked 96 layers deep." },
  { kind: "out", hint: "This part turns the last vector into next-word probabilities (ch. 60)." },
  { kind: "loop", hint: "Finally, pick one by probability and append it to the text (ch. 1, 2)." },
];
export const BP_CARDS: Card[] = [
  ...["tok", "emb", "pos"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "block", kind: "block", name: BLOCK_CARD_NAME, color: "yellow" },
  ...["out", "loop"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "enc", kind: "encoder", name: "Encoder (BERT)", color: "sky" },
];

export const DISTRACTOR_HINT: Record<string, string> = {
  softmax: "Softmax isn't inside the block. It's at the very end of the blueprint, in the output (ch. 60).",
  encoder: "GPT stacks only decoder blocks. Encoders belong to BERT (ch. 59).",
};

/** A fixed shuffle, so every student sees the same tray (and it never starts in order). */
export function shuffled<T>(items: T[], seed = 11) {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const ch62: ChapterSpec = {
  id: 62,
  part: 6,
  title: "Part 6 boss battle: the finished blueprint",
  core: false,
  hook: "We've collected every part. Can you assemble them in the right order and complete GPT?",
  steps: [
    { id: "s1", sec: 8, narration: "In Part 6 we collected the block's parts one by one. Now let's put them all together and complete the blueprint!" },
    { id: "s2", sec: 10, narration: "Start with one block layer: normalize → attention → add, then normalize → feed-forward → add." },
    { id: "s3", sec: 8.5, narration: "Stack this block 96 layers deep. Thanks to the highway and normalization, it stays steady even that deep." },
    { id: "s4", sec: 8.5, narration: "In front, the tokenizer, embedding and position info turn the text into vectors and feed them in (Part 3)." },
    { id: "s5", sec: 8.5, narration: "At the back, output + softmax gives the next word's probabilities, and one word is picked and appended." },
    { id: "s6", sec: 8.5, narration: "The machine part of the blueprint is complete! It's a GPT that takes in text and gives out the next word." },
    { id: "s7", sec: 9.5, narration: "But the 175 billion numbers inside its parts are still a mess. Part 7 teaches them. That's called pre-training." },
  ],
  playgroundTitle: "Assemble the blueprint",
  playgroundIntro: "Drag part cards onto the empty slots, or tap a card and then a slot. First one block layer, then the whole blueprint. One card doesn't belong!",
  summary: [
    "One block layer: normalize → attention → add → normalize → feed-forward → add. Stack it 96 times.",
    "Blueprint: tokenizer → embedding → position info → block × 96 → output + softmax → pick and append.",
    "The machine is complete! Next comes pre-training, which teaches its 175 billion numbers (Part 7).",
  ],
  unlocks: "The complete blueprint",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "In one block layer, which part comes right before attention?",
      choices: ["Add", "Normalize", "Feed-forward"],
      answer: 1,
      explain: "Right before each part, normalization evens out the sizes. GPT-2 and GPT-3 use this order (ch. 57).",
      review: "s2",
    },
    {
      q: "Which part of the blueprint receives the text first?",
      choices: ["Tokenizer", "Embedding", "Output + softmax"],
      answer: 0,
      explain: "The tokenizer cuts the text into pieces, and the embedding turns the pieces into numbers (ch. 29, ch. 33).",
      review: "s4",
    },
    {
      q: "What's still left to do for the fully assembled GPT?",
      choices: ["Add one more part", "Remove softmax", "Train the numbers inside the parts (pre-training)"],
      answer: 2,
      explain: "The machine's shape is done, but its numbers start out as a mess. Part 7 fixes them with pre-training (ch. 5).",
      review: "s7",
    },
  ],
  labels: {
    tag: "62. Part 6 boss battle: the finished blueprint",
    boss: "Part 6 boss battle",
    got: "The parts we collected",
    oneLayer: "One block layer",
    layers: "× 96",
    steady: "So it stays steady, even stacked deep",
    road: "Highway (ch. 56)",
    norm: "Normalize (ch. 57)",
    front: "Text → vectors (Part 3)",
    back: "Next-word probabilities → pick and append",
    done: "Done!",
    input: "I walk to",
    output: "school",
    mess: "At first the numbers are a mess",
    next: "Next: Part 7, pre-training",
    nextSub: "Teaching the 175 billion numbers",
  },
};
