import { DECAY, EMPTY, GIST, WORD_VEC, rnnRun, type Note } from "../../../data/ch40";
import type { ChapterSpec } from "../../../data/types";

// en: 11 words from 'Yesterday' to 'I', then the verb (went / go / will go). Only 'Yesterday' writes the 'when'
// slot, so how fast it fades is the same as in the Korean sentence.
export const LONG = ["Yesterday", "after", "class", "and", "a", "long", "walk", "with", "my", "dog", "I"];
export const LONG_NOTES = rnnRun(LONG);

/** toy LSTM (illustrative): important slots go into a storage box (cell) that is not squashed again each step, so they fade much more slowly. */
export const LSTM_KEEP = 0.95;
export function lstmRun(words: string[], keep = LSTM_KEEP) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) {
    const x = WORD_VEC[w] ?? [0, 0, 0];
    const h = n.h.map((v, i) => Math.max(-1, Math.min(1, keep * v + Math.tanh(x[i])))) as [number, number, number];
    const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
    notes.push((n = { h, gist }));
  }
  return notes;
}
export const LONG_LSTM = lstmRun(LONG);

/** backprop's blame signal shrinking by the same factor at every step back (ch. 23) */
export const BACK = Array.from({ length: LONG.length }, (_, k) => DECAY ** k);

/** words handed to GPUs in s6 */
export const GPU_WORDS = LONG.slice(0, 6);

/** playground: words placed between 'Yesterday' and 'I' (repeats when longer) */
export const FILLERS = ["after", "class", "and", "a", "long", "walk", "with", "my", "dog", "in", "the", "cold", "rain"];
export const sentenceWith = (middle: number) => ["Yesterday", ...Array.from({ length: middle }, (_, i) => FILLERS[i % FILLERS.length]), "I"];

export const ch41: ChapterSpec = {
  id: 41,
  part: 4,
  title: "The limits of RNNs",
  core: true,
  hook: "If the note relay is so good, why doesn't ChatGPT use an RNN?",
  steps: [
    { id: "s1", sec: 10, narration: "A long sentence: 'Yesterday after class and a long walk with my dog, I ___'. The answer should be 'went', because of 'Yesterday'." },
    { id: "s2", sec: 9, narration: "Each time the note is passed on, 'Yesterday' gets a little fainter. After 11 cells, you can barely see it." },
    { id: "s3", sec: 10, narration: "So the RNN, looking only at the last note, picks 'go'. It missed a link between far-apart words: a long-term dependency." },
    { id: "s4", sec: 10, narration: "Training has the same problem. Blame passed backward (ch. 23) shrinks at every cell: 10 cells back, only 0.11 of it is left." },
    { id: "s5", sec: 11, narration: "In 1997, the LSTM gave the note a storage box with gates, so important things fade less. But in very long texts, they still fade." },
    { id: "s6", sec: 11, narration: "The second problem is waiting in line. Cell 2 can't start until cell 1's note arrives. The other GPUs sit idle, waiting their turn." },
    { id: "s7", sec: 10, narration: "GPUs are great at doing many calculations at once (ch. 68). But with 1,000 words, an RNN has to take 1,000 turns, one after another." },
    { id: "s8", sec: 11, narration: "So RNN notes fade, and RNNs wait in line. The transformer fixes both (Part 5). But first, chapter 42: how a translator is built." },
  ],
  playgroundTitle: "Memory lab",
  playgroundIntro: "Put more and more words between 'Yesterday' and 'I'. Watch how much of 'Yesterday' is left on the RNN's note, and compare it with an LSTM.",
  summary: [
    "Limit ①: the note fades at every cell, so links between far-apart words (long-term dependencies) get lost.",
    "The 1997 LSTM remembers longer with a storage box and gates, but very long texts still fade.",
    "Limit ②: each cell must wait for the one before, so GPUs wait in line instead of working at once.",
  ],
  unlocks: "Long-term dependency",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "Why does an RNN forget 'Yesterday' at the start by the end of a long sentence?",
      choices: ["The old content fades a little every time the note is passed on", "It doesn't know the word 'Yesterday'", "The sentence is too short"],
      answer: 0,
      explain: "Each cell copies the old note multiplied by a number less than 1, so the further it goes, the fainter it gets.",
      review: "s2",
    },
    {
      q: "What was the idea of the LSTM (1997)?",
      choices: ["Read the words backward", "Give the note a storage box and gates to keep important things longer", "Stop using notes at all"],
      answer: 1,
      explain: "Gates decide what to keep and what to erase, so important content fades less.",
      review: "s5",
    },
    {
      q: "Why do GPUs sit idle when an RNN is trained?",
      choices: ["GPUs don't understand English", "There are too few words", "Each cell can only start once the note from the cell before arrives"],
      answer: 2,
      explain: "The cells can only be computed in order, so the GPU's strength, computing many things at once, goes to waste.",
      review: "s6",
    },
  ],
  labels: {
    tag: "41. The limits of RNNs",
    far: "11 cells apart",
    survive: "Will 'Yesterday' last on the note?",
    answer: "The answer is 'went' (because of 'Yesterday')",
    strength: "Strength of 'Yesterday' on the note",
    faded: "Almost gone after 11 cells",
    wrong: "Yesterday, but 'go'?!",
    longdep: "Long-term dependency",
    longdepD: "a link between far-apart words",
    blame: "Blame signal (ch. 23 backprop)",
    back: "← passed backward",
    barely: "Hardly any blame reaches the start",
    lstm: "1997 LSTM",
    lstmD: "storage box + gates",
    rnnBars: "RNN",
    lstmBars: "LSTM",
    still: "Very long texts still fade",
    queue: "GPUs waiting in line",
    working: "working",
    waiting: "waiting",
    zzz: "zzz",
    done: "done",
    wait: "Each cell waits for the one before",
    gpu: "GPU",
    special: "GPUs work best all at once (ch. 68)",
    seq: "RNN: one by one",
    par: "All at once",
    time: "time",
    thousand: "1,000 words = 1,000 turns in a row",
    sumTitle: "Two limits of RNNs",
    sum1: "① The note fades",
    sum1d: "misses far-apart links",
    sum2: "② Waiting in line",
    sum2d: "GPUs can't work at once",
    fix: "The transformer fixes both (Part 5)",
    next: "First, ch. 42: how a translator is built",
    toy: "* illustrative toy model",
  },
};
