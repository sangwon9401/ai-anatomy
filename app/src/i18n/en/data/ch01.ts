import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Candidate = { w: string; p: number; c: Highlighter | null };

// Illustrative probabilities (labelled as such in the scene), not measured from a real model.
export const ROUND1: Candidate[] = [
  { w: "school", p: 0.52, c: "yellow" },
  { w: "the", p: 0.21, c: "mint" },
  { w: "work", p: 0.12, c: "sky" },
  { w: "my", p: 0.09, c: "violet" },
  { w: "pizza", p: 0.01, c: "pink" },
  { w: "other", p: 0.05, c: null },
];

export const ROUND2: Candidate[] = [
  { w: ".", p: 0.58, c: "yellow" },
  { w: "and", p: 0.14, c: "mint" },
  { w: ",", p: 0.11, c: "sky" },
  { w: "!", p: 0.07, c: "violet" },
  { w: "other", p: 0.1, c: null },
];

export const EXAMPLES = [
  { q: "Tokyo is in", a: "Japan", tag: "knowledge" },
  { q: "1, 3, 5, 7,", a: "9", tag: "patterns" },
  { q: "Cold? Wear a", a: "coat", tag: "common sense" },
];

export type GameRound = { sentence: string; options: { w: string; p: number }[] };

export const GAME_ROUNDS: GameRound[] = [
  {
    sentence: "The capital of France is",
    options: [
      { w: "Lyon", p: 0.02 },
      { w: "Paris", p: 0.92 },
      { w: "a", p: 0.03 },
      { w: "Nice", p: 0.02 },
    ],
  },
  {
    sentence: "1, 3, 5, 7,",
    options: [
      { w: "8", p: 0.04 },
      { w: "9", p: 0.88 },
      { w: "10", p: 0.02 },
      { w: "11", p: 0.03 },
    ],
  },
  {
    sentence: "It was raining, so I took my",
    options: [
      { w: "pizza", p: 0.001 },
      { w: "bike", p: 0.07 },
      { w: "umbrella", p: 0.71 },
      { w: "raincoat", p: 0.18 },
    ],
  },
];

export const ch01: ChapterSpec = {
  id: 1,
  part: 0,
  title: "The next-word guessing game",
  core: true,
  hook: "When you ask ChatGPT something, does it think up the whole answer at once?",
  steps: [
    { id: "s1", sec: 5, narration: "Here's a sentence: \"I walk to…\" What word comes next?" },
    { id: "s2", sec: 7, narration: "There are lots of candidates: school, the, work… Even \"pizza\" could come next, strange as it sounds." },
    { id: "s3", sec: 8, narration: "ChatGPT gives every candidate a number for how likely it is to come next. That number is a probability." },
    { id: "s4", sec: 6, narration: "It picks the most likely word, \"school\", and puts it in the blank." },
    { id: "s5", sec: 8, narration: "Then it starts over! It reads the longer sentence and predicts the next word again. This time, a period wins." },
    { id: "s6", sec: 7, narration: "That's all ChatGPT does: guess the next word really well, and repeat." },
    { id: "s7", sec: 9, narration: "But to guess well, you need knowledge, patterns and common sense. Where that ability comes from is the rest of our story." },
  ],
  playgroundTitle: "Guess the next word!",
  playgroundIntro: "Pick the word that fits the blank. Then compare your pick with the probabilities the model gave.",
  summary: [
    "ChatGPT calculates the probability of each word that could come next.",
    "It picks a likely word, adds it, and predicts again.",
    "Repeating just this step builds a long answer.",
  ],
  unlocks: "The generation loop",
  quiz: [
    {
      q: "What does ChatGPT do over and over when it writes?",
      choices: ["Thinks up the whole sentence at once", "Calculates the probability of each next word and picks one", "Finds a similar text online and copies it"],
      answer: 1,
      explain: "One piece at a time: it calculates probabilities and picks.",
      review: "s3",
    },
    {
      q: "What happens to the word it picked?",
      choices: ["It's thrown away", "It's added to the end and becomes input for the next prediction", "It's saved and shown with the others at the very end"],
      answer: 1,
      explain: "Add it, then predict again. Repeating this builds a long text.",
      review: "s5",
    },
    {
      q: "What do you need to guess \"1, 3, 5, 7, ___\" well?",
      choices: ["The ability to spot the pattern between the numbers", "A habit of picking the longest number", "A table with the answers written in it"],
      answer: 0,
      explain: "To guess the next word well you need patterns, knowledge and common sense. That's why practicing prediction alone makes a model smart.",
      review: "s7",
    },
  ],
  labels: {
    tag: "1. The next-word guessing game",
    example: "illustrative example",
    loop: "add it, then predict again!",
    stmtTop: "What ChatGPT does",
    stmtMain: "Guess what's next",
    stmtLoop: "× repeat, over and over",
    stmtNote: "Honestly, that's all",
    token: "* Strictly speaking, it predicts \"tokens\" (ch. 29)",
    words: "I walk to school",
  },
};
