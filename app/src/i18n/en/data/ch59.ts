import { UNLOCK6 } from "../../../data/ch54";
import type { ChapterSpec } from "../../../data/types";

export const SENT = ["I", "walk", "to", "school"];

/** The words a model may look at when guessing SENT[target]. */
export function visible(mode: "bert" | "gpt", target: number) {
  return SENT.map((_, i) => i).filter((i) => (mode === "bert" ? i !== target : i < target));
}

/** A sentence about a (mode, target) pair for the playground. */
export function explain(mode: "bert" | "gpt", target: number) {
  const seen = visible(mode, target).map((i) => `'${SENT[i]}'`);
  if (mode === "bert" && target === 2) return "It sees 'I walk' before the blank and 'school' after it. With 'school' right after, 'to' fits and 'pizza' would sound odd. Seeing both sides makes the blank easy.";
  if (mode === "gpt" && target === 2) return "It can only see 'I walk'. 'to', 'home', 'fast', 'away'… many words could fit, so it picks by probability (ch. 1).";
  if (mode === "gpt" && target === 3) return "It sees 'I walk to' and guesses the next word. The very question we keep coming back to. school 52%!";
  if (mode === "gpt" && target === 0) return "The first word has nothing before it to look at. That's why the first word is the hardest one for GPT to guess.";
  if (mode === "bert") return `It sees every word except the hidden one: ${seen.join(", ")}.`;
  return `It guesses from only the words before it: ${seen.join(", ")}. Later words are hidden behind the mask (ch. 51).`;
}

export const ch59: ChapterSpec = {
  id: 59,
  part: 6,
  title: "Encoder vs decoder",
  core: false,
  hook: "The 'GPT' in ChatGPT and Google's 'BERT' are both transformers. So what's the difference?",
  steps: [
    { id: "s1", sec: 9.5, narration: "The first Transformer (2017) was a translator: an encoder reads the original, and a decoder writes the translation (chapter 44)." },
    { id: "s2", sec: 9, narration: "In 2018 came models that used just one half: BERT, a stack of encoders only, and GPT, a stack of decoders only." },
    { id: "s3", sec: 9, narration: "BERT sees the whole sentence from both sides. It practices by hiding a word in the middle and guessing it from its neighbors." },
    { id: "s4", sec: 9, narration: "GPT sees only the words before. With chapter 51's mask hiding the future, it practices guessing the next word." },
    { id: "s5", sec: 9, narration: "In the attention tables, every cell is open for BERT. For GPT, only the diagonal and the triangle below it are open." },
    { id: "s6", sec: 8.5, narration: "So BERT is strong at understanding sentences, and GPT is strong at writing text one word at a time." },
    { id: "s7", sec: 9.5, narration: "ChatGPT is a GPT made only of decoder blocks. The block we've assembled since chapter 54 is exactly this decoder block." },
  ],
  playgroundTitle: "Blank vs next word",
  playgroundIntro: "Choose BERT or GPT, then tap the word to guess. The words the model may look at change.",
  summary: [
    "The original Transformer (2017) was a translator made of an encoder + a decoder.",
    "BERT = encoders only: sees both sides and fills in blanks. Strong at understanding sentences.",
    "GPT = decoders only: sees only the words before (the mask) and guesses the next one. Strong at writing on. ChatGPT is this kind.",
  ],
  unlocks: "Decoder block",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "What does BERT practice?",
      choices: ["Guessing a hidden blank from the words on both sides", "Guessing the next word", "Translating sentences"],
      answer: 0,
      explain: "BERT hides a word in the middle and fills the blank using both sides. Guessing the next word is GPT's practice.",
      review: "s3",
    },
    {
      q: "In GPT's attention table, which cells are open?",
      choices: ["All cells", "The diagonal and the triangle below it", "The triangle above the diagonal"],
      answer: 1,
      explain: "Each word can see only itself and the words before it. Future cells are covered by the mask (ch. 51).",
      review: "s5",
    },
    {
      q: "Which one fits the job of writing text one word at a time?",
      choices: ["BERT (encoder)", "Both are the same", "GPT (decoder)"],
      answer: 2,
      explain: "GPT learned to guess the next word from only the words before, so it's a perfect fit for writing one word at a time (ch. 2).",
      review: "s6",
    },
  ],
  labels: {
    tag: "59. Encoder vs decoder",
    y2017: "2017 Transformer = a translator",
    src: "I walk to school",
    dst: "Ich gehe zur Schule",
    enc: "Encoder",
    dec: "Decoder",
    encDo: "reads the original",
    decDo: "writes the translation",
    x6: "× 6",
    bert: "BERT",
    gpt: "GPT",
    bertBy: "2018, Google",
    gptBy: "2018, OpenAI",
    encOnly: "Encoders only",
    decOnly: "Decoders only",
    blank: "?",
    both: "Sees both sides",
    front: "Sees only the words before",
    fill: "Fill in the blank",
    next: "Guess the next word",
    mask: "mask (ch. 51)",
    future: "future",
    rows: "Rows: the word looking",
    cols: "Columns: the words it can see",
    understand: "Understanding",
    understandEx: "search, sorting text",
    write: "Writing",
    writeEx: "chatting, writing",
    decoderBlock: "GPT's block = a decoder block",
    chatgpt: "ChatGPT uses this block too!",
    masked: "masked attention (ch. 51)",
    w1: "I",
    w2: "walk",
    w3: "to",
    w4: "school",
  },
};
