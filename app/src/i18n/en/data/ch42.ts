import { DECAY } from "../../../data/ch40";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** en: the source is the English running example and the target is Spanish (KO = source, EN = target);
 * `EN_FROM` = which English word each Spanish word comes from. "Voy" carries "I", "caminando" (walking) carries "walk". */
export const KO = ["I", "walk", "to", "school"];
export const EN = ["Voy", "a", "la", "escuela", "caminando"];
export const EN_FROM = [0, 2, 3, 3, 1];
export const KO_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

// --- toy bottleneck (illustrative toy model) ---
// Every phrase leaves a trace on the one summary note; the trace fades ×0.8 for each source word read after it (ch. 41).
// en: source "Yesterday at the library my friend and I did our homework" (11 words) →
// target "Ayer mi amigo y yo hicimos la tarea en la biblioteca"; with all phrases, Yesterday (0.11) and at the library (0.21) are lost.
// Traces weaker than KEEP_MIN are lost, and the decoder cannot write them.
export type Phrase = { ko: string; en: string; enPos: number; fixed?: boolean };
export const PHRASES: Phrase[] = [
  { ko: "Yesterday", en: "Ayer", enPos: 0 },
  { ko: "at the library", en: "en la biblioteca", enPos: 4 },
  { ko: "my friend and I", en: "mi amigo y yo", enPos: 1 },
  { ko: "did", en: "hicimos", enPos: 2, fixed: true },
  { ko: "our homework", en: "la tarea", enPos: 3 },
];
export const KEEP_MIN = 0.3;
export const NOTE_SLOTS = 4;

const wordCount = (p: Phrase) => p.ko.split(" ").length;

/** strength of each chosen phrase's trace on the final note, and the decoder's output with lost phrases as "???" */
export function squeeze(on: boolean[], attention = false) {
  const chosen = PHRASES.map((p, i) => ({ p, i })).filter(({ i }) => on[i]);
  const words = chosen.reduce((a, { p }) => a + wordCount(p), 0);
  let after = words;
  const traces = chosen.map(({ p, i }) => {
    after -= wordCount(p);
    const s = DECAY ** after;
    return { i, p, s, kept: attention || s >= KEEP_MIN };
  });
  const out = [...traces].sort((a, b) => a.p.enPos - b.p.enPos).map((t) => (t.kept ? t.p.en : "???"));
  return { words, traces, out, lost: traces.filter((t) => !t.kept).map((t) => t.p.ko) };
}
export const ALL_ON = PHRASES.map(() => true);
export const FULL = squeeze(ALL_ON);
export const CORRECT = [...PHRASES].sort((a, b) => a.enPos - b.enPos).map((p) => p.en);

export const ch42: ChapterSpec = {
  id: 42,
  part: 4,
  title: "How a translator is built",
  core: false,
  hook: "Two languages with different word orders and lengths. How does an AI translate between them?",
  steps: [
    { id: "s1", sec: 10, narration: "'I walk to school' in Spanish is 'Voy a la escuela caminando'. The order and the word count differ, so you can't swap word by word." },
    { id: "s2", sec: 11, narration: "In 2014, Sutskever's team joined two RNNs: an encoder that reads and a decoder that writes. This is called seq2seq." },
    { id: "s3", sec: 9, narration: "The encoder reads the English one word at a time, rewriting its note. The last note holds the meaning of the whole sentence." },
    { id: "s4", sec: 10, narration: "The decoder takes that note and writes Spanish one word at a time. Each word it writes goes back in as input, just like chapter 2." },
    { id: "s5", sec: 11, narration: "But the note has a fixed size. Four words or forty, the whole sentence must be squeezed into one note of the same size." },
    { id: "s6", sec: 10, narration: "That's the bottleneck: all the meaning must pass through one narrow neck. So the longer the sentence, the worse the translation got." },
    { id: "s7", sec: 9, narration: "What if the decoder could look back at the original every time it writes a word? That idea is chapter 43's attention." },
  ],
  playgroundTitle: "Squeeze it in",
  playgroundIntro: "Choose which parts go into the sentence. The longer it gets, the fainter the early parts become on the one-page summary note, and they drop out of the translation.",
  summary: [
    "seq2seq (2014): an encoder RNN reads, and a decoder RNN writes one word at a time.",
    "The encoder hands over the whole sentence as one note (vector) of a fixed size.",
    "Bottleneck: the longer the sentence, the less fits in that one note, so the translation gets worse.",
  ],
  unlocks: "2014 seq2seq",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "What do the encoder and decoder do in a seq2seq translator?",
      choices: ["The encoder reads the original into a note; the decoder writes the translation from that note", "Both only read the original", "The encoder writes the translation and the decoder checks it"],
      answer: 0,
      explain: "A reading side (encoder) and a writing side (decoder): two RNNs joined together.",
      review: "s2",
    },
    {
      q: "How does the decoder write the translation?",
      choices: ["All the words at once", "One word at a time, feeding each written word back in as input", "Swapping the English words one by one, in the same order"],
      answer: 1,
      explain: "It's the same autoregression we saw in chapter 2. It writes one word at a time until ‹end› comes out.",
      review: "s4",
    },
    {
      q: "What is the 'bottleneck' of seq2seq?",
      choices: ["The word list is too small", "The decoder is too slow", "The whole sentence has to be squeezed into one note of a fixed size"],
      answer: 2,
      explain: "Long or short, everything passes through one note, so the longer the sentence, the more meaning is lost.",
      review: "s6",
    },
  ],
  labels: {
    tag: "42. How a translator is built",
    diff: "Different order, different word count",
    noOneByOne: "You can't swap word by word",
    year: "2014 · Sutskever's team",
    s2s: "seq2seq",
    s2sD: "sequence to sequence: a row of words → a row of words",
    enc: "Encoder",
    encD: "the reading RNN",
    dec: "Decoder",
    decD: "the writing RNN",
    summary: "summary",
    start: "‹start›",
    end: "‹end›",
    whole: "the whole meaning",
    auto: "written words go back in (ch. 2)",
    fixed: "The note is always the same size",
    slots: "4 numbers",
    both: "Short or long, the same 4 numbers",
    correct: "Answer:",
    real: "* real notes have hundreds to thousands of numbers, but their size is still fixed",
    squeeze: "squeeze!",
    bottleneck: "Bottleneck",
    longer: "the longer, the worse",
    longKo: "Yesterday at the library my friend and I did our homework",
    demo: "* illustrative toy model",
    lostLabel: "lost",
    ask: "What if it could look back at the original each time?",
    next: "Ch. 43: the birth of attention",
  },
};
