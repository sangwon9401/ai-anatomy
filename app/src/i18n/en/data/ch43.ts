import { softmax } from "../../../data/ch14";
import { percents } from "../../../data/ch45";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A translation with illustrative relevance scores (illustrative example): scores[t][s] = how relevant source word s is while writing target word t.
 * en: English → Spanish, as in ch42 (src = English, tgt = Spanish). Percents checked with a script (softmax, ch14). */
export type Pair = { label: string; src: string[]; tgt: string[]; scores: number[][] };

export const PAIRS: Pair[] = [
  {
    label: "I walk to school",
    src: ["I", "walk", "to", "school"],
    tgt: ["Voy", "a", "la", "escuela", "caminando"],
    scores: [
      [2.8, 1.5, 0.1, 0.3],
      [0.1, 0.4, 3.0, 0.9],
      [0.1, 0.2, 1.5, 2.8],
      [0.1, 0.4, 0.5, 3.2],
      [0.4, 3.1, 0.3, 0.3],
    ],
  },
  {
    label: "I saw my friend yesterday",
    src: ["I", "saw", "my", "friend", "yesterday"],
    tgt: ["Ayer", "vi", "a", "mi", "amigo"],
    scores: [
      [0.2, 0.4, 0.2, 0.3, 3.2],
      [2.0, 2.6, 0.1, 0.2, 0.4],
      [0.2, 0.5, 0.6, 2.6, 0.2],
      [0.1, 0.1, 3.0, 0.6, 0.1],
      [0.1, 0.2, 0.6, 3.2, 0.2],
    ],
  },
  {
    label: "The black cat eats fish",
    src: ["The", "black", "cat", "eats", "fish"],
    tgt: ["El", "gato", "negro", "come", "pescado"],
    scores: [
      [3.0, 0.5, 0.6, 0.2, 0.2],
      [0.6, 0.6, 3.2, 0.3, 0.2],
      [0.2, 3.1, 0.7, 0.2, 0.2],
      [0.2, 0.2, 0.6, 3.0, 0.5],
      [0.1, 0.1, 0.4, 0.6, 3.1],
    ],
  },
];

/** attention weights for every target word (softmax of its scores, ch14) and whole-percent labels that add up to 100 */
export function weightsOf(pair: Pair) {
  return pair.scores.map((row) => {
    const w = softmax(row).p;
    return { w, pct: percents(w) };
  });
}

export const MAIN = PAIRS[0];
export const MAIN_W = weightsOf(MAIN);
export const SRC_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

/** the Part 4 recap cards */
export const RECAP: { ch: string; t: string; year?: string }[] = [
  { ch: "37", t: "Language model = probability of a sentence" },
  { ch: "38", t: "n-gram: count only the last few words" },
  { ch: "39", t: "Neural LM: word vectors + a network", year: "2003" },
  { ch: "40", t: "RNN: passing notes in a relay" },
  { ch: "41", t: "Limits of RNNs → LSTM", year: "1997" },
  { ch: "42", t: "seq2seq: the one-note bottleneck", year: "2014" },
  { ch: "43", t: "Attention: look back where needed", year: "2014" },
];

export const ch43: ChapterSpec = {
  id: 43,
  part: 4,
  title: "The birth of attention",
  core: true,
  hook: "What if a translator could glance back at the original while it writes? How much better would AI translation get?",
  steps: [
    { id: "s1", sec: 11, narration: "To fix chapter 42's bottleneck, Bahdanau's team had a new idea in 2014: don't keep only the last note, keep every note!" },
    { id: "s2", sec: 10, narration: "When the decoder writes 'Voy', it scans all the saved notes and shines a spotlight where it's needed right now: 'I' gets 70%." },
    { id: "s3", sec: 10, narration: "For the next word, 'a', the spotlight skips over 'walk' and lands on 'to'. A different word order is no problem." },
    { id: "s4", sec: 10, narration: "'la' and 'escuela' light up 'school', and 'caminando' jumps back to 'walk'. Each word it writes looks somewhere different." },
    { id: "s5", sec: 10, narration: "How much light each note gets comes from relevance scores turned into shares by softmax (ch. 14). The notes are mixed in those shares." },
    { id: "s6", sec: 10, narration: "Draw a table of where it looked and you see the lines cross. Matching up word pairs like this is called alignment." },
    { id: "s7", sec: 10, narration: "Let's wrap up Part 4: counting (n-gram), neural nets and word vectors, the note relay (RNN), and now attention." },
    { id: "s8", sec: 11, narration: "Then, in 2017, someone asked: what if we dropped the note relay and built everything from attention alone? See you in Part 5." },
  ],
  playgroundTitle: "You're the spotlight",
  playgroundIntro: "The decoder writes Spanish one word at a time. For each word, tap the English word it should light up, then compare with the model's spotlight.",
  summary: [
    "Attention (2014): each time the decoder writes a word, it looks again at every note from the original.",
    "Relevance scores → softmax → shares. The notes are mixed in those shares.",
    "Different word orders and long sentences are OK. In 2017: attention alone (Part 5)!",
  ],
  unlocks: "2014 attention",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "How did attention fix chapter 42's bottleneck?",
      choices: ["It made the note bigger", "Each time the decoder writes a word, it looks again at every note from the original", "It cut sentences shorter"],
      answer: 1,
      explain: "Instead of packing everything into the last note, it keeps the note from every step and looks back when needed.",
      review: "s2",
    },
    {
      q: "In 'Voy a la escuela caminando', which English word gets the brightest spotlight when it writes 'caminando'?",
      choices: ["I", "to", "walk"],
      answer: 2,
      explain: "'caminando' means walking, and that meaning is in 'walk', the 2nd word. The spotlight jumps back to it even though the order differs.",
      review: "s4",
    },
    {
      q: "How are the spotlight's shares (where to look, and how much) decided?",
      choices: ["Relevance scores are turned into shares by softmax", "Split equally in word order", "At random"],
      answer: 0,
      explain: "It's the softmax from chapter 14, so all the shares add up to 100%.",
      review: "s5",
    },
  ],
  labels: {
    tag: "43. The birth of attention",
    year: "2014",
    who: "Bahdanau · Cho · Bengio",
    cho: "Cho also co-invented the GRU",
    keep: "Keep the note from every step!",
    attention: "attention = paying attention",
    note: "note",
    dec: "decoder writing",
    jump: "skips ahead!",
    differ: "Each word looks somewhere different",
    score: "relevance score",
    softmax: "softmax (ch. 14)",
    mix: "notes mixed by share",
    mixNote: "We'll mix again in ch. 45",
    align: "Alignment",
    zigzag: "It finds the pairs even when the order crosses",
    recap: "History cards from Part 4",
    y2017: "2017",
    question: "Drop the note relay and use attention alone?",
    aiayn: "Attention Is All You Need",
    part5: "See you in Part 5 · ch. 44",
    demo: "* illustrative example",
  },
};
