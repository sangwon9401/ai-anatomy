import type { ChapterSpec } from "../../../data/types";

// All numbers below come from bpe.ts run on the English proverb corpus (part11-corpus.ts).
// The base unit here is one character: a letter (capital and small letters are different tokens), an apostrophe,
// a comma, the space or the line break. (Real GPT tokenizers start from bytes instead.)

/** "Time flies" in the character tokenizer: [piece, id]; " " is the space token (id 1). */
export const IDS: [string, number][] = [
  ["T", 21],
  ["i", 33],
  ["m", 37],
  ["e", 29],
  [" ", 1],
  ["f", 30],
  ["l", 36],
  ["i", 33],
  ["e", 29],
  ["s", 43],
];

/** the start of the 49-token dictionary (after the line break and the space) */
export const VOCAB_HEAD = ["'", ",", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M"];

/** most frequent neighbouring pairs inside words, before any merge */
export const PAIRS = [
  { a: "t", b: "h", n: 72 },
  { a: "h", b: "e", n: 67 },
  { a: "e", b: "r", n: 61 },
  { a: "i", b: "n", n: 47 },
];

/** three of the words where t+h appears (it appears in 57 of the 120 lines) */
export const DEMO_LINES = ["than", "there's", "feather"];

/** total tokens after 0…30 merges (most frequent pair each time) */
export const TOKENS_BY_MERGE = [
  3380, 3308, 3247, 3200, 3166, 3134, 3103, 3074, 3047, 3021, 2999, 2978, 2957, 2939, 2921, 2903, 2885, 2867, 2851, 2835, 2819, 2804, 2789, 2775, 2761, 2747, 2734, 2722,
  2710, 2698, 2686,
];

/** the first 30 merged tokens, in order */
export const MERGED30 = [
  "th", "er", "in", "the", "es", "an", "is", "ea", "on", "or", "it", "ou", "en", "ke", "ll",
  "st", "ing", "at", "om", "oo", "ed", "ther", "'t", "ma", "ver", "ce", "ha", "ir", "li", "ri",
];

/** "Like father, like son" after 30 merges */
export const AFTER30 = ["L", "i", "ke", " ", "f", "a", "ther", ",", " ", "li", "ke", " ", "s", "on"];

export const TRADE = [
  { merges: "0", tokens: "3,380", vocab: "49" },
  { merges: "30", tokens: "2,686", vocab: "79" },
  { merges: "300", tokens: "1,771", vocab: "349" },
];

export const ch93: ChapterSpec = {
  id: 93,
  part: 11,
  title: "Building my own tokenizer",
  core: false,
  hook: "How do you decide the tokens that fit your own data best?",
  steps: [
    { id: "s1", sec: 10.5, narration: "The model can't read text directly, only token numbers (chapter 29). The simplest way: make each character one token." },
    { id: "s2", sec: 10, narration: "Cut the proverbs into characters and you get 3,380 tokens of 49 kinds. Spaces and line breaks are tokens too." },
    { id: "s3", sec: 10.5, narration: "BPE counts pairs that sit side by side inside words (chapter 30). In the proverbs the most common pair is 't' and 'h', 72 times." },
    { id: "s4", sec: 10.5, narration: "Merge the top pair into one token. The kinds go up by one to 50, and the total drops by 72 to 3,308 tokens." },
    { id: "s5", sec: 9.5, narration: "Repeat it. After 30 merges there are 2,686 tokens. The same text now fits in fewer tokens." },
    { id: "s6", sec: 11, narration: "Is more merging always better? Fewer tokens, but more kinds, so more embeddings to learn. GPT-3 has about 50,000 kinds." },
    { id: "s7", sec: 10.5, narration: "Chapter 94's mini GPT uses the tokenizer you build here. No merges means one character per token; our ready-made models used 300." },
  ],
  playgroundTitle: "The BPE merge button",
  playgroundIntro: "The yellow pair is the most common pair right now. Press it to merge. Watch how the token count and the kinds of tokens change with each merge.",
  summary: [
    "At first, 1 character = 1 token. The proverbs: 3,380 tokens of 49 kinds.",
    "BPE: merging the most common pair adds one kind and cuts the number of tokens.",
    "Chapter 94's model uses my tokenizer. Letters say little alone, so English likes many merges.",
  ],
  unlocks: "My tokenizer",
  unlockLabel: "You finished a step of the graduation project",
  quiz: [
    {
      q: "Which pair does BPE merge first?",
      choices: ["The rarest pair", "The pair that most often appears side by side", "Any pair at all"],
      answer: 1,
      explain: "Merging the pair that appears together most often cuts the most tokens (chapter 30).",
      review: "s3",
    },
    {
      q: "What happens after one merge?",
      choices: ["One more kind of token, and fewer tokens in total", "Fewer kinds and fewer tokens", "Nothing changes"],
      answer: 0,
      explain: "A new token 'th' joins the dictionary, and every 't'+'h' becomes one token instead of two.",
      review: "s4",
    },
    {
      q: "You go to chapter 94 without a single merge. What does the model do?",
      choices: ["It can't train", "It borrows GPT-3's tokenizer", "It uses one character per token"],
      answer: 2,
      explain: "With no merges you get a character tokenizer. Training still works, but single English letters carry little meaning, so it learns more slowly.",
      review: "s7",
    },
  ],
  labels: {
    tag: "93. Building my own tokenizer",
    reads: "the numbers the model reads",
    oneToOne: "1 character = 1 token",
    space: "Spaces are tokens too",
    tokens: "tokens",
    tokensN: "3,380",
    vocab: "kinds of tokens",
    vocabN: "49",
    dict: "Token dictionary",
    more: "… 49 kinds",
    newline: "Spaces and line breaks are tokens too",
    count: "Count pairs side by side inside words",
    times: "×",
    top: "#1!",
    merge: "Merge",
    after: "After merge #1",
    t1: "Tokens 3,380 → 3,308",
    v1: "Kinds 49 → 50",
    again: "Repeat 30 times",
    t30: "2,686 tokens",
    v30: "79 kinds",
    merged: "New tokens",
    example: "Like father, like son",
    mergesCol: "Merges",
    tokensCol: "Tokens",
    vocabCol: "Kinds",
    fewer: "fewer",
    moreV: "more",
    emb: "One embedding row per kind (ch. 33)",
    gpt3: "GPT-3: 50,257 kinds",
    mine: "My tokenizer",
    mineSub: "Try it, ch. 93",
    model: "Ch. 94 mini GPT",
    zero: "0 merges = 1 character per token",
  },
};
