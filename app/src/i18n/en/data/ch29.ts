import { PRESETS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// the running sentence, cut three ways (tokens: real GPT-4o tokenizer o200k_base, see part3-tokens.ts)
export const SENT = PRESETS[0]; // I walk to school.
export const SENT_CHARS = [...SENT.text];
export const SENT_WORDS = SENT.text.split(" ");
export const RARE = { unbelievable: PRESETS[6], slang: PRESETS[4] }; // unbelievable, rizzler

// s6: a few rows of the GPT-4o vocabulary (ids checked with tiktoken)
export const VOCAB_ROWS: [string, string][] = [
  ["0", "!"],
  ["1", '"'],
  ["2", "#"],
  ["⋮", ""],
  ["316", " to"],
  ["⋮", ""],
  ["3474", " school"],
  ["⋮", ""],
];

export const ch29: ChapterSpec = {
  id: 29,
  part: 3,
  title: "Tokens: the AI's unit of text",
  core: true,
  hook: "Does ChatGPT read one letter at a time, or one word at a time?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Before ChatGPT reads text, it cuts it into small pieces. The pieces are tokens, and the part that cuts is the tokenizer." },
    { id: "s2", sec: 8, narration: "What if we cut letter by letter? We'd get far too many pieces, and one letter like 'l' means almost nothing." },
    { id: "s3", sec: 8.5, narration: "Word by word, then? There are endless words, and new slang like 'rizzler' isn't on any list, so it can't be read." },
    { id: "s4", sec: 9, narration: "So we cut somewhere in between. GPT-4o's real tokenizer cuts this sentence into 5 pieces. The space sticks to the next word." },
    { id: "s5", sec: 8.5, narration: "Every piece has a number: ' school' with its space is 3474. What the model really gets is this row of numbers, not text." },
    { id: "s6", sec: 7.5, narration: "The list of pieces is called the vocabulary. GPT-3 knows about 50,000 pieces, GPT-4o about 200,000." },
    { id: "s7", sec: 8.5, narration: "A rare word is split into pieces it knows: 'unbelievable' is 3 pieces, 'rizzler' 3 as well. So no word is unreadable." },
    { id: "s8", sec: 8.5, narration: "The tokenizer cuts text and numbers the pieces: the blueprint's first part is in. But how is the list of pieces made?" },
  ],
  playgroundTitle: "Token microscope",
  playgroundIntro: "Pick a sentence to see how the real GPT-4o tokenizer cuts it, one color per piece. Tap 'Show numbers' to see what the model receives.",
  summary: [
    "Token: the piece of text an AI reads. Often bigger than a letter and no bigger than a word.",
    "Common chunks are one piece; rare words become several small pieces.",
    "Every piece has a number, and the model receives a row of numbers. The list of pieces = the vocabulary.",
  ],
  unlocks: "Tokenizer",
  quiz: [
    {
      q: "What does the tokenizer do?",
      choices: ["Cuts text into pieces (tokens) and gives each a number", "Calculates the probability of the next word", "Fixes spelling mistakes"],
      answer: 0,
      explain: "Text → pieces → numbers. It's the very first part of the blueprint.",
      review: "s1",
    },
    {
      q: "What goes wrong if we only cut by whole words?",
      choices: ["There are far too many pieces", "New words that aren't on the list can't be read", "The spaces disappear"],
      answer: 1,
      explain: "A new word like 'rizzler' isn't on any word list. Tokens can still read it by splitting it into smaller pieces.",
      review: "s3",
    },
    {
      q: "What actually goes into the model?",
      choices: ["Pictures of letters", "The sentence exactly as typed", "A row of token numbers"],
      answer: 2,
      explain: "For GPT-4o, 'I walk to school.' is 5 numbers: 40, 5229, 316, 3474, 13.",
      review: "s5",
    },
  ],
  labels: {
    tag: "29. Tokens: the AI's unit of text",
    machine: "Tokenizer ✂",
    token: "Token = a piece the AI reads",
    byChar: "Cut letter by letter?",
    byWord: "Cut word by word?",
    byToken: "Tokens: somewhere in between",
    n13: "17 pieces",
    n4: "4 pieces",
    n7: "5 pieces",
    tooMany: "too many!",
    noMeaning: "One letter means almost nothing",
    looksOk: "looks fine, but…",
    unknown: "A new word, not on the list!",
    endless: "There are endless words",
    cmp: "17 characters · 5 tokens · 4 words",
    source: "GPT-4o tokenizer (o200k_base)",
    space: "␣ = a space; it sticks to the next word",
    ids: "What the model really gets",
    vocab: "Vocabulary = the list of pieces",
    rows: "about 200,000 rows",
    gpt3: "GPT-3",
    gpt4o: "GPT-4o",
    v3: "~50,000",
    v4o: "~200,000",
    rare: "Rare words become smaller pieces",
    bytes: "Pieces follow how often text appears, not meaning",
    canRead: "So no word is unreadable",
    bp: "First part of the blueprint done!",
    empty: "empty",
    next: "Next: how is the list of pieces made? (ch. 30)",
    q: "?",
  },
};
