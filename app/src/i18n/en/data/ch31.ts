import { PAIRS, TOKENIZERS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// en: chapter 31 compares English with Korean, Japanese and Chinese. All counts come from tiktoken
// (see part3-tokens.ts, scratch script i18n/en-g2/scripts/gen_tokens_en.py).
// PAIRS holds three entries per English sentence; `ko` is the Korean, Japanese or Chinese text.
const HANGUL = /[가-힣]/;
export const MAIN = PAIRS[0]; // 나는 학교에 걸어서 간다. / I walk to school.  GPT-3 32 vs 5 · GPT-4 15 vs 5 · GPT-4o 8 vs 5
// the 3-sentence paragraph in Korean → 143·67·38 vs 29·28·27 (Japanese 68·48·36, Chinese 72·45·25)
export const LONG = PAIRS.filter((p) => HANGUL.test(p.ko)).slice(-1)[0];
// ' 학교' in GPT-3's tokenizer: one space token, then bytes [237 149] [153] [234] [181] [144]
export const SCHOOL_BYTES = ["237 149", "153", "234", "181", "144"];
// a few real single tokens of GPT-3's vocabulary (r50k_base)
export const EN_SAMPLES = [" the", " school", "ing", " today", " going", "tion", " and", " you", " computer", " cat"];
// vocabulary entries that hold at least one whole Hangul syllable (counted over every token id)
export const HANGUL_TOKENS = [0, 281, 2352];
export { TOKENIZERS };

export const ch31: ChapterSpec = {
  id: 31,
  part: 3,
  title: "Do some languages need more tokens?",
  core: false,
  hook: "People say asking an AI something in Korean costs more than asking in English. Is that true?",
  steps: [
    { id: "s1", sec: 9, narration: "Let's write the same sentence in four languages and count the tokens. The token count is how much the AI must read and write." },
    { id: "s2", sec: 7.5, narration: "With GPT-3's tokenizer, English takes 5 pieces but Korean takes 32. Same meaning, over 6 times as many!" },
    { id: "s3", sec: 9, narration: "See all the dashed pieces? A Korean character is 3 bytes (ch. 28), and this tokenizer cut each one into 2 or 3 byte pieces." },
    { id: "s4", sec: 8, narration: "GPT-3's tokenizer was built mostly from English text. Of its 50,257 pieces, not one is a whole Korean character." },
    { id: "s5", sec: 8.5, narration: "Extra tokens cost you: you pay per token, how much an AI can read at once is counted in tokens, and answers get slower." },
    { id: "s6", sec: 9, narration: "Newer tokenizers learned far more non-English pieces. In GPT-4o our sentence is 8 tokens in Korean and Japanese, 6 in Chinese." },
    { id: "s7", sec: 9, narration: "On a long paragraph, GPT-4o needs 1.4 times as many tokens for Korean as for English, 1.3 for Japanese, and 0.9 for Chinese." },
    { id: "s8", sec: 9.5, narration: "Do some languages need more tokens? Once far more; now a little more, or the same. It depends on what the tokenizer learned from." },
  ],
  playgroundTitle: "Token count showdown",
  playgroundIntro: "Pick a sentence and a language. First guess which side needs more tokens, then compare three real tokenizers.",
  summary: [
    "The same meaning can take a different number of tokens in each language. Price, reading limit and speed all depend on the token count.",
    "GPT-3's tokenizer was made from English text, so it chopped Korean characters into bytes.",
    "GPT-4o learned many more pieces from other languages, so the gap shrank (long text, Korean: about 4.9× → 1.4× English).",
  ],
  unlocks: "Token efficiency",
  unlockLabel: "You picked up a language tool",
  quiz: [
    {
      q: "Why did Korean need so many tokens with GPT-3's tokenizer?",
      choices: ["Korean sentences are much longer", "It had almost no Korean pieces, so it cut Korean into bytes", "Korean doesn't use spaces"],
      answer: 1,
      explain: "It was built from English text, so not one piece was a whole Korean character. Each character became 2–3 byte pieces.",
      review: "s4",
    },
    {
      q: "Which of these is NOT a result of needing more tokens?",
      choices: ["It costs more", "Less text fits in at once", "The answer gets more accurate"],
      answer: 2,
      explain: "More tokens don't make the AI smarter. You only lose on price, reading limit and speed.",
      review: "s5",
    },
    {
      q: "With GPT-4o, which language needed the fewest tokens for the same long paragraph?",
      choices: ["Chinese", "Korean", "Japanese"],
      answer: 0,
      explain: "Chinese 25, English 27, Japanese 36, Korean 38. With GPT-3 it was 72, 29, 68 and 143.",
      review: "s7",
    },
  ],
  labels: {
    tag: "31. Do some languages need more tokens?",
    ko: "Korean",
    en: "English",
    ja: "Japanese",
    zh: "Chinese",
    amount: "Token count = how much the AI reads and writes",
    gpt3src: "GPT-3 tokenizer (r50k_base)",
    times4: "6.4×!",
    dashed: "dashed = part of one character's bytes",
    school: "'학교' (school) →",
    hak: "학",
    gyo: "교",
    bytesNote: "One character → 2–3 byte pieces",
    vocab3: "GPT-3's vocabulary: 50,257 pieces",
    hangul0: "Korean characters:",
    zero: "0",
    mostlyEn: "a list made mostly from English text",
    cost: "More tokens means",
    c1: "Price",
    c1d: "you pay for every token",
    c2: "Reading",
    c2d: "GPT-3: 2,048 tokens at a time",
    c3: "Speed",
    c3d: "one piece at a time (ch. 2)",
    model3: "GPT-3",
    model4: "GPT-4",
    model4o: "GPT-4o",
    hangulN: "Korean chars",
    same: "close now!",
    long: "A long paragraph (3 sentences)",
    vsEn: "× = how many times English's count",
    r1: "×4.9",
    r2: "×2.4",
    r3: "×1.4",
    q: "Some languages need more tokens?",
    a1: "Before (GPT-3): far more",
    a2: "Now (GPT-4o): a little more, or the same",
    dep: "It depends on what text the tokenizer learned from",
    pieces: "pieces",
    src: "real token counts from tiktoken",
  },
};
