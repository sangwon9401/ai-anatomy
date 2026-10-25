import type { ChapterSpec } from "../../../data/types";

/** en: a small original corpus written for this chapter (checked with scratch script i18n/en-g2/scripts/ngram_en.mjs).
 * Words are split on spaces. 'to' is followed by school ×3 and work ×1; the 2-gram path below appears pair by pair. */
export const CORPUS = [
  "I walk to school",
  "My dad drives to work",
  "I run to school",
  "My brother walks to school",
  "My cat sleeps on the sofa",
  "My cat sleeps all day",
  "Our cat played with yarn",
  "Our cat ate fish",
  "I ate pizza for lunch",
  "My friend ate lunch fast",
  "My brother left his lunch",
  "Our teacher reads in class",
  "Our teacher gave us homework",
  "I did homework at home",
  "I read books at the library",
  "My friend played soccer yesterday",
  "I played soccer at the park",
  "My brother napped at home",
  "My friend did homework at the library",
  "Our teacher sang in class",
  "I went home early",
  "My brother woke up late",
  "We played games at home",
  "We sang songs in class",
];

export const START = "‹start›";
export const END = "‹end›";

export const TOKENS = CORPUS.map((s) => [START, ...s.split(" "), END]);

/** How many times the word sequence `seq` appears in the corpus (sentence edges count as tokens). */
export function countSeq(seq: string[]) {
  let n = 0;
  for (const t of TOKENS)
    for (let i = 0; i + seq.length <= t.length; i++) if (seq.every((w, k) => t[i + k] === w)) n++;
  return n;
}

/** Next-word counts after the context `ctx` (the last 1 word for a 2-gram, the last 2 for a 3-gram), most frequent first. */
export function followers(ctx: string[]) {
  const counts = new Map<string, number>();
  for (const t of TOKENS)
    for (let i = 0; i + ctx.length < t.length; i++)
      if (ctx.every((w, k) => t[i + k] === w)) counts.set(t[i + ctx.length], (counts.get(t[i + ctx.length]) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()].map(([w, c]) => ({ w, c, p: c / total })).sort((a, b) => b.c - a.c);
}

/** The sentence the scene builds from the 2-gram table (every pair appears in the corpus). */
export const PATH = ["My", "cat", "played", "soccer", "yesterday"];
/** rows of the pair table shown in the scene */
export const TABLE_ROWS = [START, ...PATH];

export const ch38: ChapterSpec = {
  id: 38,
  part: 4,
  title: "Looking at only the last few words",
  core: false,
  hook: "How did AI find 'the chance of the next word' in the old days?",
  steps: [
    { id: "s1", sec: 10, narration: "The easiest way to find a probability is to count. First we need a notebook full of sentences, called a corpus." },
    { id: "s2", sec: 10, narration: "To count what follows 'I walk to', those three words must appear together. That happens just once, and 'We walk to' never does." },
    { id: "s3", sec: 9, narration: "So here's a trick: look only at the one word right before. We just count what came after 'to'." },
    { id: "s4", sec: 9, narration: "After 'to', 'school' came 3 times and 'work' once. So 'school' wins 3 times out of 4: 75%." },
    { id: "s5", sec: 10, narration: "Count like this for every word and you get a pair-count table. Looking at only the last few words is called an n-gram." },
    { id: "s6", sec: 9, narration: "Let's write a sentence using only this table. In 1948, Claude Shannon wrote English sentences this way too." },
    { id: "s7", sec: 10, narration: "Every pair sounds natural, but the sentence is odd, right? Looking only one word back, it forgot the subject was a cat." },
    { id: "s8", sec: 10, narration: "Why not look further back? Longer word strings are rarer in the corpus, so the count is often 0. Chapter 39's neural net fixes this." },
  ],
  playgroundTitle: "Write with a pair-count table",
  playgroundIntro: "Write sentences with a pair-count table counted from a 24-sentence corpus. Pick the next word yourself or tap 'Draw by chance'. Can you get a sentence that isn't in the corpus?",
  summary: [
    "n-gram: look at only the last few words, and count the next word in a corpus to get its probability.",
    "Each pair may sound natural, but the sentence easily goes off track because it forgets what came earlier.",
    "Looking further back doesn't work either: such long word strings are rarely in the corpus, so the count is 0.",
  ],
  unlocks: "n-gram",
  unlockLabel: "You collected a history card",
  quiz: [
    {
      q: "In the corpus, 'to' is followed by 'school' 3 times and 'work' once. What probability does a 2-gram give 'school'?",
      choices: ["3%", "75%", "33%"],
      answer: 1,
      explain: "Words came after 'to' 4 times in all, and 3 of them were 'school': 3 ÷ 4 = 75%.",
      review: "s4",
    },
    {
      q: "Why do 2-gram sentences often go off track?",
      choices: ["They pick the next word by looking only one word back", "They pick words at random", "The corpus has wrong sentences"],
      answer: 0,
      explain: "Each pair is natural, just as seen in the corpus, but anything further back (who, when) is never looked at.",
      review: "s7",
    },
    {
      q: "What's the problem with an n-gram that looks further back (say, 4 words)?",
      choices: ["The calculation gets too easy", "Sentences get shorter", "Such long word strings are rarely in the corpus, so many counts are 0"],
      answer: 2,
      explain: "The longer the string, the rarer it is to have seen exactly the same one, so there's nothing to count. Chapter 39's neural net solves this.",
      review: "s8",
    },
  ],
  labels: {
    tag: "38. Looking at only the last few words",
    corpus: "corpus",
    more: "… 24 sentences in all",
    count: "Count!",
    times: "×",
    only: "just once",
    zero: "0×",
    trick: "Look only at the word right before",
    after: "Words after 'to'",
    total: "4 in all",
    pairTitle: "Pair-count table",
    gram2: "1 word back → 2-gram",
    gram3: "2 words back → 3-gram",
    rowsMore: "… one row for every word",
    shannon: "Shannon did this in 1948!",
    pairOk: "Every pair sounds natural…",
    huh: "A cat playing soccer?!",
    forgot: "Seeing only 1 word back, it forgot the cat",
    look1: "1 word",
    look2: "2 words",
    look3: "3 words",
    longer: "The further back, the less to count",
    next: "Ch. 39: the neural language model",
    arrow: "→",
  },
};
