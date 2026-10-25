import type { ChapterSpec } from "../../../data/types";

/** GPT-3 (canonical facts) next to the Part 11 mini GPT with the proverb data (computed from minigpt.ts / bpe.ts).
 * English vocab: line break + space + 47 single characters + 300 BPE merges = 349 (see ch93). */
export const COMPARE = [
  { k: "layers", gpt3: "96", mini: "1" },
  { k: "width", gpt3: "12,288", mini: "32" },
  { k: "heads", gpt3: "96", mini: "1" },
  { k: "context", gpt3: "2,048", mini: "24" },
  { k: "vocab", gpt3: "50,257", mini: "349" },
];

export const PROJECT = [
  { n: "①", name: "Pick the data", ch: "ch.92" },
  { n: "②", name: "Build a tokenizer", ch: "ch.93" },
  { n: "③", name: "Train it", ch: "ch.94" },
  { n: "④", name: "Let it write", ch: "ch.95" },
];

/** Real outputs of the offline checkpoints (temperature 0.8), none of them a line of the data. */
export const STYLES = [
  { name: "Proverbs", seen: "Blood is thicker than water", wrote: "Blood is thicker than words", color: "yellow" as const },
  { name: "Rhymes", seen: "Mary had a little lamb", wrote: "Mary had a great fall", color: "sky" as const },
  { name: "Textbook", seen: "Birds build nests in spring.", wrote: "Birds build nests in the east.", color: "mint" as const },
];

/** Real next-token probabilities of the proverb checkpoint after "A " (temperature 1). */
export const NEXT = [
  { w: "good", p: 21.7 },
  { w: "small", p: 12.3 },
  { w: "penny", p: 10.3 },
];

export const ch92: ChapterSpec = {
  id: 92,
  part: 11,
  title: "Designing a mini GPT",
  core: false,
  hook: "If you shrink ChatGPT way down, could you build one with your own hands?",
  steps: [
    { id: "s1", sec: 10, narration: "Graduation project time! With the parts you've learned, you'll build a real tiny GPT and train it right on your phone." },
    { id: "s2", sec: 9, narration: "There are four steps: pick the data, build a tokenizer, train the model, and finally let it write." },
    { id: "s3", sec: 10.5, narration: "Same blueprint as GPT-3 (chapter 5), but 1 block instead of 96, and token vectors of 32 numbers instead of 12,288." },
    { id: "s4", sec: 11, narration: "It has 1 attention head and reads 24 tokens at a time. 349 kinds of tokens: 49 characters plus 300 merged pieces (chapter 93)." },
    { id: "s5", sec: 10.5, narration: "Count the knobs (parameters): GPT-3 has 175 billion, the mini GPT 24,925. That's about 7 million times fewer." },
    { id: "s6", sec: 10, narration: "But it does the same job: it reads text and gives the odds of the next piece. This is a real answer from a mini GPT we trained." },
    { id: "s7", sec: 10, narration: "Proverbs in, proverbs out; rhymes in, rhymes out; textbook sentences in, explanations out. A model resembles what it reads." },
    { id: "s8", sec: 11, narration: "The data is about 3.3 KB, about 1,800 tokens: tiny next to GPT-3's 300 billion, but enough. Shall we pick one?" },
  ],
  playgroundTitle: "Pick the data",
  playgroundIntro: "Choose the text your mini GPT will read. In chapters 93–95 you'll build a tokenizer for it, train on it and let the model write.",
  summary: [
    "The mini GPT has the same blueprint as GPT-3. Only the numbers of layers, vector sizes and heads are small.",
    "24,925 knobs: about 7 million times fewer than GPT-3.",
    "A model resembles what it reads, so picking the data is step one.",
  ],
  unlocks: "My dataset",
  unlockLabel: "You finished a step of the graduation project",
  quiz: [
    {
      q: "Compare the blueprints of the mini GPT and GPT-3. What do you find?",
      choices: ["Same parts, only the sizes differ", "A completely different design", "The mini GPT has no attention"],
      answer: 0,
      explain: "From the tokenizer to softmax, the parts are the same. There are just far fewer layers, vector numbers and heads.",
      review: "s3",
    },
    {
      q: "About how many knobs (parameters) does the mini GPT have?",
      choices: ["175 billion", "About 25,000", "96"],
      answer: 1,
      explain: "24,925 with the proverb data: about 7 million times fewer than GPT-3's 175 billion.",
      review: "s5",
    },
    {
      q: "A model trained only on nursery rhymes writes what kind of text?",
      choices: ["Textbook-style explanations", "Nothing at all", "Text like song lines"],
      answer: 2,
      explain: "A model resembles what it reads. Read rhymes full of repetition, and it writes like a song.",
      review: "s7",
    },
  ],
  labels: {
    tag: "92. Designing a mini GPT",
    title: "Graduation project",
    tok: "Tokenizer",
    emb: "Embedding",
    pos: "Position info",
    att: "Attention",
    ffn: "Feed-forward",
    out: "Output + softmax",
    loop: "Pick and append",
    mine: "My own mini GPT",
    real: "Real training!",
    ch96: "⑤ Graduation day, ch. 96",
    gpt3: "GPT-3",
    mini: "Mini GPT",
    layers: "Block layers",
    width: "Token vector size",
    heads: "Attention heads",
    context: "Tokens read at once",
    vocab: "Kinds of tokens",
    same: "Same parts, smaller numbers",
    knobs: "Number of knobs (parameters)",
    gpt3Knobs: "175,000,000,000",
    miniKnobs: "24,925",
    ratio: "About 1/7,000,000",
    prompt: "A",
    next: "Odds of the next piece",
    realOut: "A real answer from a mini GPT we trained",
    seen: "Read",
    wrote: "Wrote",
    alike: "It resembles what it read",
    noCopy: "None of the three is in the data",
    size: "About 3.3 KB · about 1,800 tokens",
    gptData: "GPT-3: 300 billion tokens",
    dust: "Many drops make a shower?",
    pick: "Pick one yourself",
    lines120: "120 lines",
    lines69: "69 lines",
    lines82: "82 lines",
    loss: "loss",
    vocabNote: "49 characters + 300 merges",
  },
};
