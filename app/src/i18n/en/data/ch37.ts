import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Illustrative probabilities (illustrative example). Each one is "the chance of this word, given every word before it". */
export const CHAIN: { w: string; p: number; c: Highlighter }[] = [
  { w: "I", p: 0.2, c: "mint" },
  { w: "walk", p: 0.25, c: "sky" },
  { w: "to", p: 0.1, c: "violet" },
  { w: "school", p: 0.52, c: "yellow" },
];
/** the same prefix ending in pizza instead (1%, as in ch01) */
export const PIZZA = { w: "pizza", p: 0.01, c: "pink" as Highlighter };

export const NOVEL = ["I ran to school through the pouring rain", "Our class hamster ate my homework"];

/** Format a probability as a percent with two significant digits, without scientific notation. */
export function fmtPct(p: number) {
  const v = p * 100;
  if (v >= 10) return `${Math.round(v)}%`;
  const decimals = Math.min(20, Math.max(0, 1 - Math.floor(Math.log10(v))));
  let s = v.toFixed(decimals);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return `${s}%`;
}

// --- the playground's toy language model (illustrative example) ---
// Five words; the chance of the next word depends on the whole prefix, like a real language model.
// en: the table follows English word order. "I walk to school" is the best sentence (20% × 25% × 10% × 52%);
// the poetic "To school I walk" is the other order above 0.1% (3% × 30% × 20% × 60%).
export const LM_WORDS = ["I", "walk", "to", "school", "pizza"] as const;
export const LM_COLORS: Record<string, Highlighter> = { I: "mint", walk: "sky", to: "violet", school: "yellow", pizza: "pink" };

const TABLE: Record<string, Record<string, number>> = {
  "": { I: 0.2, walk: 0.05, to: 0.03, school: 0.01 },
  I: { walk: 0.25, to: 0.01, school: 0.005 },
  "I walk": { to: 0.1, school: 0.01 },
  "I walk to": { school: 0.52 },
  walk: { to: 0.2, I: 0.01, school: 0.01 },
  "walk to": { school: 0.3, I: 0.005 },
  "walk to school": { I: 0.01 },
  to: { school: 0.3, I: 0.01, walk: 0.01 },
  "to school": { I: 0.2, walk: 0.05 },
  "to school I": { walk: 0.6 },
  "to school walk": { I: 0.01 },
  school: { I: 0.03, walk: 0.01, to: 0.005 },
  "school I": { walk: 0.1, to: 0.005 },
  "school I walk": { to: 0.3 },
};

function rule(prefix: string[], w: string): number {
  const k = prefix.length;
  const has = (x: string) => prefix.includes(x);
  const last = prefix[k - 1];
  if (has("pizza")) return 0.01; // the sentence is already strange
  if (w === "pizza") return k === 0 ? 0.01 : last === "to" ? 0.01 : 0.005;
  return TABLE[prefix.join(" ")]?.[w] ?? 0.002; // any other order is awkward
}

/** Candidates for the next word after `prefix` (words are used once each); `rest` = every other word in the language. */
export function nextProbs(prefix: string[]) {
  const options = LM_WORDS.filter((w) => !prefix.includes(w)).map((w) => ({ w, p: rule(prefix, w) }));
  const rest = 1 - options.reduce((a, o) => a + o.p, 0);
  return { options, rest };
}

export function sentenceProb(words: string[]) {
  let p = 1;
  const factors: number[] = [];
  words.forEach((w, i) => {
    const f = nextProbs(words.slice(0, i)).options.find((o) => o.w === w)!.p;
    factors.push(f);
    p *= f;
  });
  return { p, factors };
}

export const ch37: ChapterSpec = {
  id: 37,
  part: 4,
  title: "Language model = probability of a sentence",
  core: false,
  hook: "How does an AI know that one sentence sounds 'natural' and another doesn't?",
  steps: [
    { id: "s1", sec: 9, narration: "Look at two sentences: 'I walk to school' and 'I walk to pizza'. Which one sounds more natural?" },
    { id: "s2", sec: 9.5, narration: "A language model is a machine that gives every sentence a probability: how likely it is to show up. ChatGPT is a language model too." },
    { id: "s3", sec: 10, narration: "But we can't count whole sentences. There are far too many sentences nobody has ever seen. So we break them into single words." },
    { id: "s4", sec: 10, narration: "The chance the first word is 'I', then that 'walk' comes next… Each time, look at the words so far and find the next word's chance." },
    { id: "s5", sec: 9, narration: "Multiply these chances in order and you get the sentence's probability: 20% × 25% × 10% × 52% = 0.26%." },
    { id: "s6", sec: 10, narration: "The 'pizza' sentence has only 1% at the end, so it gets 0.005%. Same start, but one last word makes a 52-fold difference." },
    { id: "s7", sec: 10, narration: "So a model that's good at guessing the next word is also good at scoring sentences. That's chapter 1's next-word game." },
    { id: "s8", sec: 9, narration: "So where do these probabilities come from? The easiest way is to count. We'll count them ourselves in chapter 38." },
  ],
  playgroundTitle: "Sentence probability calculator",
  playgroundIntro: "Pick words one at a time to build a four-word sentence. Each pick multiplies in that word's chance. Which sentence scores highest?",
  summary: [
    "Language model: a machine that gives a sentence a probability of showing up.",
    "A sentence's probability = the chances of each next word (given the words before it), multiplied in order.",
    "A model that guesses the next word well = a model that scores sentences well (ch. 1).",
  ],
  unlocks: "Language model",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "How do we get a sentence's probability?",
      choices: ["Add up every word's chance", "Multiply the next-word chances in order", "Divide by the number of words"],
      answer: 1,
      explain: "The first word's chance × the next word's chance × … multiplied in order.",
      review: "s5",
    },
    {
      q: "Two sentences share their first three words, and the last word's chance is 52% in one and 1% in the other. How many times more likely is the first?",
      choices: ["52 times", "51 times", "2 times"],
      answer: 0,
      explain: "The shared start is multiplied in on both sides, so only the ratio of the last chances is left: 52 ÷ 1 = 52.",
      review: "s6",
    },
    {
      q: "If you add one more word to the end of a sentence, its probability usually…",
      choices: ["gets bigger", "becomes exactly 1", "gets smaller"],
      answer: 2,
      explain: "Each chance is less than 1, so every extra factor makes it smaller. That's why long sentences have tiny probabilities.",
      review: "s5",
    },
  ],
  labels: {
    tag: "37. Language model = probability of a sentence",
    which: "Which one sounds more natural?",
    lm: "Language model",
    lmEn: "LM",
    inSent: "text",
    outProb: "chance",
    high: "high",
    low: "low",
    chatgpt: "ChatGPT is a language model too!",
    whole: "Count whole sentences?",
    novel: "never seen",
    tooMany: "There are endless sentences nobody has seen",
    split: "Break it into single words!",
    demo: "* illustrative example",
    first: "first word is 'I'",
    look: "looking at the words so far",
    times: "×",
    vs: "vs",
    eq: "=",
    smaller: "Multiply → smaller",
    same: "the start is the same",
    was: "with 'school'",
    now: "with 'pizza'",
    ratio: " times apart!",
    rule: "Guess the next word well = Score sentences well",
    prefix: "I walk to",
    ch01: "ch. 1's next-word game",
    gaws: "the",
    late: "work",
    mult: "Multiply them → the sentence's probability!",
    where: "Where do these chances come from?",
    count: "Count them!",
    next: "Ch. 38: look at only the last few words",
  },
};
