import type { ChapterSpec, Highlighter } from "../../../data/types";

export const SCORES: { w: string; s: number; c: Highlighter }[] = [
  { w: "school", s: 3, c: "yellow" },
  { w: "the", s: 2, c: "mint" },
  { w: "work", s: 1, c: "sky" },
  { w: "pizza", s: -1, c: "pink" },
];

export const softmax = (xs: number[]) => {
  const ex = xs.map((x) => Math.exp(x));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { ex, sum, p: ex.map((e) => e / sum) };
};

export const ch14: ChapterSpec = {
  id: 14,
  part: 1,
  title: "Scores into probabilities: softmax",
  core: true,
  hook: "A model's scores can be negative, and they add up to anything. How do we turn them into probabilities?",
  steps: [
    { id: "s1", sec: 8.5, narration: "The model gives each candidate next word a score. A score can be 3, or even a negative number like −1." },
    { id: "s2", sec: 9.5, narration: "But probabilities can't be below 0, and together they must add up to 1. Right now one is negative and the total is 5." },
    { id: "s3", sec: 8.5, narration: "Step one: raise e to the power of each score. e is a number, about 2.718. This makes every value positive." },
    { id: "s4", sec: 9.5, narration: "As a bonus, big scores get much bigger. A score of 3 was 1.5 times a 2; after the change, it's about 2.7 times." },
    { id: "s5", sec: 8, narration: "Step two: add up all the new values. The total is 30.56. Now divide each value by this total." },
    { id: "s6", sec: 8, narration: "Out come probabilities: school 65.7%, the 24.2%, work 8.9%, pizza 1.2%. Together, exactly 100%." },
    { id: "s7", sec: 8, narration: "These two steps together are called softmax. You'll meet it again with attention in chapter 45, so remember it." },
  ],
  playgroundTitle: "The score control room",
  playgroundIntro: "Change the scores with the sliders. You'll see right away how the probabilities change.",
  summary: [
    "Scores (logits) can be negative, and they add up to anything.",
    "① Raising e to each score makes everything positive, and big scores get even bigger.",
    "② Dividing by the total gives probabilities. These two steps are softmax.",
  ],
  unlocks: "Softmax",
  quiz: [
    {
      q: "What's the main reason the first step of softmax uses powers of e?",
      choices: ["To make every value positive", "To make the math faster", "To turn the scores into whole numbers"],
      answer: 0,
      explain: "A power of e is always positive. As a bonus, it makes big scores even bigger.",
      review: "s3",
    },
    {
      q: "If the scores are [2, 2, 2], what is each candidate's probability?",
      choices: ["2", "About 33.3%", "About 66.7%"],
      answer: 1,
      explain: "Equal scores give equal eˣ values, so the three share the total equally.",
      review: "s6",
    },
    {
      q: "If you add 5 to every score, what happens to the probabilities?",
      choices: ["They all go up", "They stay the same", "Only the top one goes up"],
      answer: 1,
      explain: "Every eˣ gets multiplied by the same e⁵, and that factor cancels when you divide by the total. Only the differences between scores matter.",
      review: "playground",
    },
  ],
  labels: {
    tag: "14. Scores into probabilities: softmax",
    axis: "score",
    neg: "probability < 0?",
    sum: "3 + 2 + 1 − 1 = 5",
    notOne: "≠ 1",
    e: "e ≈ 2.718",
    eLater: "more on e in later math classes",
    ratioA: "score: 3 vs 2 → 1.5×",
    ratioB: ": 20.09 vs 7.39 →",
    ratioB2: "≈ 2.7×",
    bigger: "big gets bigger!",
    total: "sum = 100%",
    fTitle: "Softmax",
    fLeft: "my probability",
    fMine: "my score",
    fAll: "sum of all",
    fSum: "",
    step1: "① raise e to the score: all positive, big gets bigger",
    step2: "② divide by the sum: total is exactly 1",
    seeYou: "See you in ch. 45, attention",
  },
};
