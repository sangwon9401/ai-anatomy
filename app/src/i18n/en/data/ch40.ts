import type { ChapterSpec, Highlighter } from "../../../data/types";

// --- a toy RNN (illustrative toy model), shared with ch41–42 ---
// en: English puts the verb before the place, so the relay is "Yesterday | at school | I → went/go/will go".
// Each cell still writes one slot (when, where, who); the 'when' slot, which decides the verb, gets exactly the
// same numbers as in the Korean order, so every probability below is unchanged.
// The note (hidden state) has three slots. Each word writes into a slot; the old note is copied a little fainter.
// new note = squash(0.8 × old note + word), squash = tanh (keeps every number between −1 and 1).
export const SLOTS = ["when", "who", "where"] as const;
export const DECAY = 0.8;
export const WORD_VEC: Record<string, [number, number, number]> = {
  Yesterday: [-2, 0, 0],
  Tomorrow: [2, 0, 0],
  I: [0, 2, 0],
  friends: [0, 1, 0],
  "at school": [0, 0, 2],
};
/** what each word writes on the note, in words */
export const GIST: Record<string, string> = { Yesterday: "past", Tomorrow: "future", I: "me", friends: "friends", "at school": "school" };
export type Note = { h: [number, number, number]; gist: [string, string, string] };
export const EMPTY: Note = { h: [0, 0, 0], gist: ["", "", ""] };

/** One relay step of the toy RNN. `keep` is how much of the old note survives (0.8 here; ch41's LSTM mode keeps more). */
export function rnnStep(n: Note, w: string, keep = DECAY): Note {
  const x = WORD_VEC[w] ?? [0, 0, 0];
  const h = n.h.map((v, i) => Math.tanh(keep * v + x[i])) as [number, number, number];
  const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
  return { h, gist };
}

export function rnnRun(words: string[], keep = DECAY) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) notes.push((n = rnnStep(n, w, keep)));
  return notes;
}

export const VERBS: { w: string; c: Highlighter }[] = [
  { w: "went", c: "mint" },
  { w: "go", c: "yellow" },
  { w: "will go", c: "sky" },
];
/** next-word probabilities from the last note: past ↔ future is read from the 'when' slot */
export function predictVerb(h: readonly number[]) {
  const s = [-4 * h[0], 1, 4 * h[0]];
  const ex = s.map(Math.exp);
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

export const RELAY = ["Yesterday", "at school", "I"];
export const RELAY_B = ["Tomorrow", "at school", "I"];
export const LENGTHS = [
  ["I", "walk", "to"],
  ["Yesterday", "at", "school", "I"],
  ["Last", "week", "at", "school", "Mia", "and", "I"],
];

export const ch40: ChapterSpec = {
  id: 40,
  part: 4,
  title: "RNN: passing notes in a relay",
  core: false,
  hook: "Sentences come in every length. How does an AI remember what came before while it reads?",
  steps: [
    { id: "s1", sec: 10, narration: "Chapter 39's network saw only three words, but sentences come in every length. New idea: read one word at a time and pass a note along!" },
    { id: "s2", sec: 10, narration: "Each cell gets one word. It takes the note from the cell before, rewrites it after reading its word, and hands it to the next cell." },
    { id: "s3", sec: 11, narration: "'Yesterday' goes in the 'when' slot, 'at school' in 'where', and 'I' in 'who'. What was there before is copied a little fainter." },
    { id: "s4", sec: 10, narration: "Every cell uses the same rule: multiply the old note by 0.8, add the current word, then squash the result to between −1 and 1." },
    { id: "s5", sec: 11, narration: "Only the last note is used to guess the next word. 'Yesterday' is still on it, so 'went' gets 70%. The note is called the hidden state." },
    { id: "s6", sec: 10, narration: "Change just the first word to 'Tomorrow', and now 'will go' gets 70%. The first word rode the notes all the way to the end." },
    { id: "s7", sec: 11, narration: "Unrolled it's a relay; rolled up it's one machine going round in a loop. That's why it's called a recurrent neural network, or RNN." },
  ],
  playgroundTitle: "Run the note relay",
  playgroundIntro: "Add words one at a time to build a sentence. Each word rewrites the note's three slots, and the last note guesses what comes next.",
  summary: [
    "RNN: reads one word at a time, rewrites a note (the hidden state), and passes it to the next cell.",
    "Every cell uses the same rule (the same weights), so sentences can be any length.",
    "The last note guesses the next word. Even the first word rides the notes to the end.",
  ],
  unlocks: "RNN hidden state",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "What is the real name of the 'note' in an RNN?",
      choices: ["Loss", "Hidden state", "Token"],
      answer: 1,
      explain: "It's a vector of numbers summing up everything read so far. It isn't shown outside, so it's called the hidden state.",
      review: "s5",
    },
    {
      q: "What rule do the RNN's cells use to rewrite the note?",
      choices: ["Every cell uses the same rule", "Each cell has its own rule", "Only the last cell has a rule"],
      answer: 0,
      explain: "The same machine (the same weights) is reused for every word. That's why it works for any sentence length.",
      review: "s4",
    },
    {
      q: "Why can the RNN pick 'went' after 'Yesterday at school I'?",
      choices: ["The last word 'I' means the past", "It picks at random", "A trace of the first word 'Yesterday' stays on the notes all the way to the end"],
      answer: 2,
      explain: "What it wrote when reading 'Yesterday' fades a little at each step but is still on the last note.",
      review: "s6",
    },
  ],
  labels: {
    tag: "40. RNN: passing notes in a relay",
    window: "3-word window",
    fixed: "The window is fixed, but sentence lengths vary",
    idea: "Read one word at a time and pass a note along!",
    cell: "RNN cell",
    empty: "starts with an empty note",
    same: "Every cell uses the same rule",
    rule: "new = squash( 0.8 × old + word )",
    squash: "squash = keep it between −1 and 1",
    example: "when slot:",
    toy: "* illustrative toy model: a real RNN learns its weights (ch. 11)",
    lastNote: "last note → next word",
    hidden: "note = hidden state",
    carried: "The first word made it all the way to the end",
    unrolled: "unrolled: a relay",
    folded: "rolled up: a loop",
    rnn: "Recurrent neural network (RNN)",
    rnnEn: "Recurrent Neural Network",
    anyLen: "Any sentence length works",
    next: "Ch. 41: the limits of RNNs",
    note: "note",
    dot: "·",
  },
};
