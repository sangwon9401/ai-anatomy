import type { ChapterSpec, Highlighter } from "../../../data/types";

/** the four real GPT-2 heads this chapter visits (layer and head numbered from 0, like code: L4H11) */
export const GPT2_HEADS: { key: string; layer: number; head: number; name: string; c: Highlighter; desc: string }[] = [
  { key: "prev", layer: 4, head: 11, name: "previous word", c: "sky", desc: "In any sentence, it looks almost 100% at the word right before." },
  { key: "first", layer: 7, head: 2, name: "first word", c: "violet", desc: "Almost every word looks at the first word. Why? Researchers are still working on it." },
  { key: "copy", layer: 5, head: 1, name: "copycat", c: "mint", desc: "When words repeat, it looks at the word that came next the first time. Easy to see in repeated sentences." },
  { key: "subj", layer: 4, head: 3, name: "find the subject?", c: "orange", desc: "Verbs and words like 'it' and 'she' seem to look back at the main character. Read it with care!" },
];

/** Part 5 in chips, for the recap */
export const PART5_TOOLS = ["attention is all (44)", "look at each other (45)", "Q · K · V (46)", "Q · K scores (47)", "÷ √d + softmax (48)", "mix V (49)", "all at once (50)", "causal mask (51)", "multi-head (52)", "attention maps (53)"];

export const ch53: ChapterSpec = {
  id: 53,
  part: 5,
  title: "Peeking inside a real GPT",
  core: false,
  hook: "Are the heads of a real GPT actually 'looking' at anything?",
  steps: [
    { id: "s1", sec: 9, narration: "At last, let's open up a real GPT: the smallest GPT-2 model. It has 12 layers with 12 heads each, 144 heads in all." },
    { id: "s2", sec: 9.5, narration: "Feed in an English sentence and map how much one head looks at each word. Rows are the words looking; columns, the words looked at." },
    { id: "s3", sec: 9, narration: "Layer 4, head 11: every word looks almost 100% at the word right before it, so only the cells just below the diagonal are dark." },
    { id: "s4", sec: 10, narration: "In layer 7, head 2, almost every word looks at the first word, 'The'. Here, 98 of the 144 heads put over half on the first word." },
    { id: "s5", sec: 9.5, narration: "Here we fed in the same sentence twice. In layer 5, head 1, the second 'my' looks 51% at 'dog', the word that followed the first 'my'." },
    { id: "s6", sec: 9, narration: "In layer 4, head 3, 'it' looks 84% at 'cat'. Like the words in chapter 45, it seems to find what 'it' refers to." },
    { id: "s7", sec: 9, narration: "In Part 5 we took attention completely apart: Q · K scores, √d and softmax, mixing V, matrices, the curtain, and many heads." },
    { id: "s8", sec: 9.5, narration: "Now we know everything the attention part of the blueprint does. In Part 6 we stack the parts into a transformer block (ch. 54)." },
  ],
  playgroundTitle: "Explore attention maps",
  playgroundIntro: "These attention maps were computed in advance from the real GPT-2. Change the sentence and the head, and tap a word to see whom it looks at.",
  summary: [
    "The real GPT-2 (smallest model): 12 layers × 12 heads = 144 heads.",
    "There really are heads that look only at the previous word, heads that pile onto the first word, and heads that copy what came before.",
    "Part 5 done: score (Q · K) → ÷ √d → softmax → mix V, with the curtain on and many heads at once.",
  ],
  unlocks: "Reading attention maps",
  unlockLabel: "You cracked one of attention's secrets",
  quiz: [
    {
      q: "On the map of layer 4, head 11, where were the dark cells?",
      choices: ["Just below the diagonal (the previous word)", "In the leftmost column (the first word)", "Spread out evenly"],
      answer: 0,
      explain: "Every word looks only at the word right before it, so only the cells just below the diagonal are dark.",
      review: "s3",
    },
    {
      q: "How many heads does the smallest GPT-2 model have in all?",
      choices: ["12", "96", "144"],
      answer: 2,
      explain: "12 layers with 12 heads each: 12 × 12 = 144. (96 is the number of heads in one layer of GPT-3.)",
      review: "s1",
    },
    {
      q: "Why is the part of an attention map above the diagonal always empty?",
      choices: ["The causal mask covers the future", "Those words aren't important", "The calculation isn't finished"],
      answer: 0,
      explain: "GPT can only look at earlier words (ch. 51), so the maps are always triangles.",
      review: "s2",
    },
  ],
  labels: {
    tag: "53. Peeking inside a real GPT",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "↙",
    model: "GPT-2 small",
    layers: "12 layers",
    perLayer: "12 heads per layer",
    total: "12 × 12 = 144 heads",
    layer: "layer",
    head: "head",
    rows: "word looking ↓",
    cols: "word looked at →",
    tri: "triangle = causal mask (ch. 51)",
    dark: "darker = looks more",
    prevT: "the previous-word head",
    firstT: "the first-word head",
    first98: "In this sentence, 98 of 144 heads put over half on the first word",
    why: "Why? Still being researched",
    copyT: "the copycat head",
    copyNote: "second 'my' → 'dog', which followed the first 'my'",
    subjT: "the head where 'it' looks at 'cat'",
    careful: "It only looks that way: read it with care!",
    callback: "ch. 45: words look at each other",
    src: "real values",
    recap: "Part 5: attention mastered!",
    blueprint: "GPT blueprint",
    understood: "mastered in ch. 45–53",
    next: "Next: Part 6, assembling the transformer (ch. 54)",
  },
};
