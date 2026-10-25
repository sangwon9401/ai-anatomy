import type { ChapterSpec, Highlighter } from "../../../data/types";

// en: chapter 28 is rewritten around English letters (ASCII → Unicode → UTF-8 bytes) with the same goal as the
// Korean original: characters become numbers by a rule, and some characters are built from parts.
// Export names are kept from the Korean file; every number below was checked with a script (Python unicodedata).

// s3: the ASCII table's letters and digits (Korean: the three jamo lists)
export const CHO = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]; // 26 capital letters, 65–90
export const JUNG = [..."abcdefghijklmnopqrstuvwxyz"]; // 26 small letters, 97–122
export const JONG = [..."0123456789"]; // 10 digits, 48–57

// kept from the Korean file (Hangul syllable formula); not used by the English scene or playground
export const HANGUL_BASE = 44032;
export const compose = (cho: number, jung: number, jong: number) => HANGUL_BASE + (cho * 21 + jung) * 28 + jong;
export const decompose = (code: number): [number, number, number] | null => {
  const n = code - HANGUL_BASE;
  if (n < 0 || n > 11171) return null;
  return [Math.floor(n / 588), Math.floor((n % 588) / 28), n % 28];
};
/** UTF-8 bytes of one character (what the computer actually stores) */
export const utf8 = (ch: string) => [...new TextEncoder().encode(ch)];

// s2: one table for every script (code points checked with a script)
export const WORLD: { ch: string; code: number; c: Highlighter }[] = [
  { ch: "A", code: 65, c: "sky" },
  { ch: "中", code: 20013, c: "mint" },
  { ch: "가", code: 44032, c: "yellow" },
  { ch: "😀", code: 128512, c: "pink" },
];

// s4: neighbours of 'A' by number
export const NEXT_TO_GA = [
  { ch: "A", code: 65 },
  { ch: "B", code: 66 },
  { ch: "C", code: 67 },
  { ch: "D", code: 68 },
  { ch: "E", code: 69 },
];

export const ch28: ChapterSpec = {
  id: 28,
  part: 3,
  title: "Letters inside a computer",
  core: false,
  hook: "Every letter has a number inside the computer. But who picked those numbers, and does anyone have to memorize them?",
  steps: [
    { id: "s1", sec: 7.5, narration: "In chapter 6, every letter had a number: 'A' is 65. Today let's see where these numbers come from." },
    { id: "s2", sec: 9.5, narration: "Unicode is one big table that numbers the world's characters. 'A' is 65, '中' is 20013, the smiley is 128512. Over 150,000 in all." },
    { id: "s3", sec: 8.5, narration: "English got its numbers early. ASCII gave 128 numbers to letters, digits and symbols, and Unicode kept all of them." },
    { id: "s4", sec: 9, narration: "The numbers follow the alphabet: one more is the next letter. A is 65, B is 66, and so on up to Z, 90. And 32 more gives 'a'." },
    { id: "s5", sec: 8.5, narration: "So it's a rule, not a memory test. A capital letter's number is 64 plus its place in the alphabet." },
    { id: "s6", sec: 8.5, narration: "'H' is the 8th letter, so 64 + 8 = 72. Small letters start at 96 instead: 'h' is 96 + 8 = 104." },
    { id: "s7", sec: 8.5, narration: "Some characters are built from parts. 'é' can be 'e' plus an accent piece. 👍🏽 is 👍 plus a skin-tone piece." },
    { id: "s8", sec: 9, narration: "A byte holds only 0 to 255, so big numbers are split up. 'A' takes 1 byte, 'é' 2, '😀' 4. Bytes are what tokens are made of." },
  ],
  playgroundTitle: "Letter lab",
  playgroundIntro: "Pick a letter, capital or small, and an accent piece. Watch the number follow the rule and see how many bytes it takes to store.",
  summary: [
    "Unicode: a table that gives every character in the world a number. 'A' 65, '中' 20013.",
    "Capital = 64 + place in the alphabet; small letters are 32 later. Some characters are built from parts: é = e + ´.",
    "To store a number it is split into bytes (0–255): 'A' takes 1 byte, 'é' 2, '😀' 4.",
  ],
  unlocks: "Unicode",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "How many numbers did the ASCII table have?",
      choices: ["26", "128", "150,000"],
      answer: 1,
      explain: "26 capitals + 26 small letters + 10 digits + 66 symbols, spaces and controls = 128. Unicode kept all of them.",
      review: "s3",
    },
    {
      q: "'A' is 65. What is the number of 'C'?",
      choices: ["97", "66", "67"],
      answer: 2,
      explain: "One more is the next letter: B is 66, so C is 67. You can also use the rule: 64 + 3 = 67.",
      review: "s4",
    },
    {
      q: "How many bytes does it take to store '😀' (128512)?",
      choices: ["4", "1", "128512"],
      answer: 0,
      explain: "A byte holds only 0–255, so 128512 is split into 4 bytes: 240, 159, 152, 128.",
      review: "s8",
    },
  ],
  labels: {
    tag: "28. Letters inside a computer",
    recap: "Chapter 6: every letter has a number",
    how: "Who picked these numbers?",
    unicode: "Unicode = the world's character table",
    many: "Over 150,000 characters",
    ascii: "ASCII (1960s): 128 numbers for English",
    upper: "A–Z",
    lower: "a–z",
    digits: "0–9",
    others: "66 = symbols, space, controls",
    kept: "Unicode kept all 128",
    plus1: "+1 → the next letter",
    last: "the last capital",
    small: "the small letter",
    rule: "A rule, not a memory test",
    capital: "capital",
    smallL: "small",
    place: "place",
    start: "← counts from 64",
    start2: "← counts from 96",
    eighth: "H = 8th letter",
    calc1: "64 + 8 = 72",
    calc2: "96 + 8 = 104",
    gap: "small = capital + 32",
    parts: "Some characters are built from parts",
    accent: "accent piece",
    tone: "skin tone",
    oneNum: "or one number",
    twoNums: "still 2 numbers",
    byte: "A byte is a box for 0–255",
    one: "1 byte",
    two: "2 bytes",
    four: "4 bytes",
    split: "Big numbers are split into bytes (UTF-8)",
    material: "These bytes are what tokens are made of (ch. 29)",
    chars: "A中가😀BCDEZaHheé´👍🏽",
  },
};
