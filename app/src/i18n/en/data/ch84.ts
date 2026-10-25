import type { ChapterSpec, Highlighter } from "../../../data/types";

// An invented book (made up for this example; a web search found no book with this title). The model's answer about
// it is built one chunk at a time from illustrative next-chunk probabilities; every chunk is plausible, the whole is false.
export const BOOK = "“The Rabbit Planet Library”";
export const QUESTION84 = `What is ${BOOK}?`;

export type Opt = { w: string; p: number; c: Highlighter | null; next?: string };
export const HONEST = "I can't find";
export const END84 = "(end)";

/** chunk → options for the next chunk (illustrative, each list adds up to 1) */
export const TREE: Record<string, Opt[]> = {
  start: [
    { w: "A 2018", p: 0.4, c: "yellow", next: "year" },
    { w: "A 2015", p: 0.32, c: "orange", next: "year" },
    { w: "A 2020", p: 0.24, c: "violet", next: "year" },
    { w: HONEST, p: 0.04, c: "mint", next: "honest" },
  ],
  year: [
    { w: "fairy tale", p: 0.66, c: "yellow", next: "came" },
    { w: "storybook", p: 0.34, c: "orange", next: "came" },
  ],
  came: [
    { w: "that won", p: 0.54, c: "yellow", next: "kind" },
    { w: "that earned", p: 0.32, c: "orange", next: "kind" },
    { w: "that got", p: 0.14, c: "violet", next: "kind" },
  ],
  kind: [
    { w: "a children's", p: 0.46, c: "yellow", next: "got" },
    { w: "a national", p: 0.4, c: "orange", next: "got" },
    { w: "a big", p: 0.14, c: "violet", next: "drew" },
  ],
  got: [{ w: "book prize.", p: 1, c: "yellow", next: "end" }],
  drew: [{ w: "reading award.", p: 1, c: "yellow", next: "end" }],
  honest: [
    { w: "that book.", p: 0.8, c: "mint", next: "end" },
    { w: "it anywhere.", p: 0.2, c: "mint", next: "end" },
  ],
};

// the path the scene follows (always the top option)
export const SCENE_ROUNDS = ["start", "year", "came", "kind"] as const;
export const ANSWER84 = ["A 2018", "fairy tale", "that won", "a children's", "book prize."];

export const RISKY = [
  { w: "Rare facts", ex: "history of a small town", c: "yellow" as const },
  { w: "Numbers · dates", ex: "years, statistics, scores", c: "sky" as const },
  { w: "Names", ex: "who did it, who said it", c: "mint" as const },
  { w: "Sources · quotes", ex: "book titles, papers, links", c: "pink" as const },
];

export const HELPS = [
  { n: "①", w: "Check the source yourself", ex: "search, a library, ask a teacher" },
  { n: "②", w: "Check that its sources are real", ex: "it can invent sources too" },
  { n: "③", w: "Give it reliable material", ex: "look it up, then answer (ch. 88)" },
];

export const ch84: ChapterSpec = {
  id: 84,
  part: 9,
  title: "Convincing lies",
  core: true,
  hook: "If an AI says something confidently, is it true?",
  steps: [
    { id: "s1", sec: 10, narration: "We asked about a book that doesn't exist, and it answered smoothly, with a year and even a prize. That's called a hallucination." },
    { id: "s2", sec: 9, narration: "Let's replay it piece by piece. Book intros often start with a year, so 'A 2018' sounds likely. 'I can't find' gets only 4%." },
    { id: "s3", sec: 10, narration: "Same for the next pieces: fairy tale, that won, a children's. Each pick is plausible, but together they make a fake fact." },
    { id: "s4", sec: 8, narration: "What the model learned is 'the word likely to come next' (chapter 1). Nothing in it checks whether that word is true." },
    { id: "s5", sec: 9, narration: "And a written word can't be erased (chapter 2). Once 'A 2018' is written, everything after it follows along plausibly." },
    { id: "s6", sec: 9, narration: "Hallucinations are most common with rare facts, numbers and dates, names, and sources. It can even invent real-looking sources." },
    { id: "s7", sec: 9, narration: "So check sources yourself when it matters. Giving it reliable material makes it invent much less (chapter 88)." },
    { id: "s8", sec: 9, narration: "What about lowering the temperature? Odd picks drop, but if the top answer is made up, it stays. Plausible isn't the same as true." },
  ],
  playgroundTitle: "Hallucination lab",
  playgroundIntro: "Play the model: describe a book that doesn't exist, one piece at a time. Then press 'Answer 100 times' to count how often the model makes things up.",
  summary: [
    "Hallucination: making up something untrue that sounds convincing.",
    "The model only picks a likely next word. It doesn't check whether that word is true.",
    "Check numbers, names and sources yourself; giving it material makes it invent less (ch. 88).",
  ],
  unlocks: "Spotting hallucinations",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "What is the biggest reason an AI hallucinates?",
      choices: ["It wants to fool people on purpose", "The internet is slow", "It picks a likely next word and never checks whether it's true"],
      answer: 2,
      explain: "The model learned to pick words that are likely to come next. Checking facts isn't part of that goal.",
      review: "s4",
    },
    {
      q: "What happens to hallucinations if you set the temperature to 0?",
      choices: ["Odd picks drop, but a wrong top answer still comes out", "They disappear completely", "They always get worse"],
      answer: 0,
      explain: "Temperature only reshares the probabilities (chapter 81). If the most plausible answer is false, it says that falsehood every time.",
      review: "s8",
    },
    {
      q: "You want to use a book title and source an AI gave you in your homework. What should you do?",
      choices: ["Use it as is, since the AI sounded sure", "Check in a search or a library that it really exists", "Raise the temperature and ask again"],
      answer: 1,
      explain: "An AI can even make up sources. Always check important things yourself.",
      review: "s7",
    },
  ],
  labels: {
    tag: "84. Convincing lies",
    answer1: "A 2018 fairy tale that won",
    answer2: "a children's book prize.",
    none: "No such book exists!",
    madeUp: "* The book title is made up for this example",
    halluc: "Hallucination = a convincing lie",
    q: "Q.",
    example: "illustrative probabilities",
    honestNote: "← honest: only 4%",
    chatgpt: "ChatGPT",
    markO: "○",
    markX: "×",
    plausible: "plausible ○",
    fake: "Joined up: a fake fact!",
    learned: "Learned",
    learnedWhat: "likely next word",
    notLearned: "Never checked",
    notWhat: "if it's true",
    score: "Model's score = how plausible",
    first: "First pick",
    follow: "goes along",
    noErase: "A written word can't be erased (ch. 2)",
    button: "Start wrong, and it stays wrong to the end…",
    risky: "Watch out!",
    helpsTitle: "What to do",
    temp: "temp",
    low: "Even at a low temperature",
    same: "A false #1 answer stays!",
    key: "Plausible ≠ true",
  },
};
