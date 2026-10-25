import type { ChapterSpec } from "../../../data/types";

/** The running example split into pieces; for this sentence they are exactly GPT-3's real tokens (ch. 29). */
export const SENT = ["I", "walk", "to", "school", "."];

export const PRESETS64 = [
  "I walk to school.",
  "What goes around comes around.",
  "1, 2, 3, 4, 5",
  "When it rains, it pours.",
];

export const MAX_PIECES = 12;

/** Split on spaces and peel trailing punctuation into its own piece: "school." → "school", ".". */
export function pieces(text: string): string[] {
  const out: string[] = [];
  for (const w of text.trim().split(/\s+/).filter(Boolean)) {
    const m = w.match(/^(.*?)([.,!?]+)$/);
    if (m && m[1]) out.push(m[1], m[2]);
    else out.push(w);
  }
  return out;
}

/** Every prefix becomes a question whose answer is the next piece. */
export const questions = (ps: string[]) => ps.slice(1).map((answer, i) => ({ context: ps.slice(0, i + 1), answer }));

export const ch64: ChapterSpec = {
  id: 64,
  part: 7,
  title: "Studying without an answer key",
  core: true,
  hook: "Text on the internet has no answer key. So what did GPT check its answers against?",
  steps: [
    { id: "s1", sec: 11, narration: "In chapter 4, people had to label each email 'spam' or 'not spam'. But no one can label every text on the internet." },
    { id: "s2", sec: 9, narration: "The secret: the text itself is the answer key. Let's take one sentence: 'I walk to school.'" },
    { id: "s3", sec: 10, narration: "Show the beginning, hide the next piece, and it's a question. What comes after 'I'? The answer is right there: 'walk'." },
    { id: "s4", sec: 10, narration: "Add one piece at a time and you get more questions. After 'I walk' comes 'to', and after 'I walk to' comes 'school'." },
    { id: "s5", sec: 10, narration: "A 5-piece sentence gave us 4 questions. The text, not a person, provides the answers. That's self-supervised learning." },
    { id: "s6", sec: 9, narration: "The model solves all 4 questions at once. Thanks to chapter 51's mask, each position can only see what comes before it." },
    { id: "s7", sec: 11, narration: "All of GPT-3's roughly 300 billion tokens are questions like these. About 300 billion questions, without a single answer key." },
  ],
  playgroundTitle: "Question factory",
  playgroundIntro: "Pick a sentence or write your own. One sentence turns into several 'guess the next piece' questions. Try to guess before you look at the answer.",
  summary: [
    "Show only the beginning of a sentence and ask for the next piece: that's a question.",
    "The answer is the very next piece in the text. No person needs to label anything = self-supervised learning.",
    "A sentence of N pieces → N − 1 questions. The whole internet becomes a workbook.",
  ],
  unlocks: "Self-supervised learning",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "A sentence cut into 4 pieces, 'Cats / eat / fish / .', gives how many questions?",
      choices: ["2", "3", "4"],
      answer: 1,
      explain: "The first piece has nothing before it, so it can't be a question. Each of the next 3 pieces is an answer.",
      review: "s5",
    },
    {
      q: "In self-supervised learning, where do the answers come from?",
      choices: ["A teacher labels them one by one", "The model decides whatever it likes", "The next piece, already in the text"],
      answer: 2,
      explain: "Show the beginning and hide the next piece: that piece is the answer. The text itself is the answer key.",
      review: "s3",
    },
    {
      q: "In the question that shows 'I walk', what is the answer?",
      choices: ["to", "I", "school"],
      answer: 0,
      explain: "In 'I walk to school.', the piece right after 'I walk' is 'to'.",
      review: "s4",
    },
  ],
  labels: {
    tag: "64. Studying without an answer key",
    spamMsg: "[AD] Get a free coupon",
    spam: "Spam",
    byPerson: "People label it (ch. 4)",
    allWeb: "Every text on the internet?",
    impossible: "Too many to label one by one",
    finer: "These are GPT-3's real tokens too (ch. 29)",
    textIs: "Text = questions + answers",
    q: "Q",
    answerFrom: "It's in the text!",
    count: "5 pieces → 4 questions",
    ssl: "Self-supervised learning",
    sslEn: "",
    together: "All 4 questions at once",
    mask: "The mask (ch. 51) hides what comes later",
    gpt3: "What GPT-3 read",
    tokens: "about 300 billion tokens",
    equals: "= about 300 billion questions",
    noKey: "Without a single answer key!",
    next: "Ch. 65: measuring how wrong it was",
  },
};
