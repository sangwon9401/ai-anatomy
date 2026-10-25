import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Part = {
  key: string;
  name: string;
  does: string;
  where: string;
  color: Highlighter;
  /** filled once the student has finished chapters 1–4 */
  filled?: boolean;
};

// The GPT blueprint, top to bottom. The two block parts repeat N times (GPT-3: 96 layers).
export const PIPELINE: Part[] = [
  { key: "tok", name: "Tokenizer", does: "Cuts text into pieces (tokens)", where: "ch. 29", color: "sky" },
  { key: "emb", name: "Embedding", does: "Turns pieces into numbers that carry meaning", where: "ch. 33", color: "sky" },
  { key: "pos", name: "Position info", does: "Tells which place each piece is in", where: "ch. 36", color: "sky" },
  { key: "att", name: "Attention", does: "Pieces see each other, mix meaning", where: "ch. 45", color: "yellow" },
  { key: "ffn", name: "Feed-forward", does: "Adds \"thinking\" to each piece", where: "ch. 55", color: "yellow" },
  { key: "out", name: "Output + softmax", does: "Gives the next piece's probabilities", where: "ch. 60, 14", color: "mint" },
  { key: "loop", name: "Pick and append", does: "Picks one, adds it to the end, repeats", where: "ch. 1, 2", color: "mint", filled: true },
];

export const TRAINING = [
  { name: "Training data", does: "A huge amount of text from the internet", where: "ch. 4, 63", filled: true },
  { name: "Pre-training", does: "Practice next-piece guessing, fix numbers by how far off", where: "Parts 2, 7" },
  { name: "Chat practice", does: "Copy model answers + praise from people", where: "ch. 73, 76" },
];

export const ch05: ChapterSpec = {
  id: 5,
  part: 0,
  title: "The blueprint we will build",
  core: true,
  hook: "If you opened up the machine called ChatGPT, what would you find inside?",
  steps: [
    { id: "s1", sec: 9, narration: "To sum up so far: ChatGPT is a machine that guesses the next piece. Now it's time to open that machine up." },
    { id: "s2", sec: 9, narration: "Up front, the tokenizer cuts text into pieces, the embedding turns them into numbers, and position info tells each piece's place." },
    { id: "s3", sec: 9, narration: "Next, transformer blocks: attention lets pieces look at each other, and feed-forward adds thinking. Dozens are stacked." },
    { id: "s4", sec: 8, narration: "At the end, softmax gives the next piece's probabilities, and one is picked and added. Then back to the top." },
    { id: "s5", sec: 9, narration: "But the numbers inside start out a mess. Practicing next-piece guessing on a huge amount of text fixes them: that's pre-training." },
    { id: "s6", sec: 7, narration: "Finally, it learns to chat from model answers and people's praise. Then it becomes ChatGPT." },
    { id: "s7", sec: 10, narration: "We'll fill in this blueprint one Part at a time. So far we've filled in \"pick and append\" and the training data. Ready to start?" },
  ],
  playgroundTitle: "Assemble the blueprint",
  playgroundIntro: "Tap the parts in the order text passes through the machine. The first part is the one that cuts text into pieces.",
  summary: [
    "Tokenizer → embedding + position → [attention + feed-forward] × dozens of layers → softmax → pick and append.",
    "Numbers that start out a mess get fixed by pre-training.",
    "Learn to chat from model answers and people's ratings, and you get ChatGPT.",
  ],
  unlocks: "The GPT blueprint",
  unlockLabel: "You got the blueprint",
  quiz: [
    {
      q: "Which part cuts text into pieces?",
      choices: ["Embedding", "Tokenizer", "Softmax"],
      answer: 1,
      explain: "The tokenizer cuts text into tokens, and the embedding turns those tokens into numbers.",
      review: "s2",
    },
    {
      q: "Which two things make up one transformer block?",
      choices: ["Attention and feed-forward", "Tokenizer and embedding", "Softmax and picking"],
      answer: 0,
      explain: "Attention + feed-forward make one layer, and the layer is stacked dozens of times.",
      review: "s3",
    },
    {
      q: "What does the model practice during pre-training?",
      choices: ["Guessing the next piece", "Recognizing faces", "Memorizing grammar rules"],
      answer: 0,
      explain: "It practices guessing the next piece on a huge amount of text, fixing its numbers as it goes.",
      review: "s5",
    },
  ],
  labels: {
    tag: "5. The blueprint we will build",
    input: "I walk to",
    output: "school",
    gpt: "GPT",
    chatgpt: "ChatGPT",
    block: "Transformer block",
    layers: "× dozens of layers (GPT-3: 96)",
    again: "back to top",
    pretrain: "Pre-training",
    chat: "Chat practice",
    mess: "The numbers start out a mess",
    numbers: "Nudge 175 billion numbers, bit by bit",
    filled: "filled in",
    empty: "empty",
    go: "Let's go!",
    web: "A huge amount of text from the internet",
    practice: "Practice next-piece guessing",
    fix: "Fix numbers by how far off",
    sft: "Copy model answers",
    rlhf: "Praise from people",
    ch73: "ch. 73",
    ch76: "ch. 76",
    data: "Training data",
    blockLayers: "× dozens",
    gpt3: "(GPT-3: 96)",
  },
};
