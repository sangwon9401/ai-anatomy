import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Dist = { key: string; name: string; items: { w: string; p: number; c: Highlighter }[] };

export const DISTS: Dist[] = [
  {
    key: "dice",
    name: "Die",
    items: [1, 2, 3, 4, 5, 6].map((n) => ({ w: String(n), p: 1 / 6, c: "sky" as const })),
  },
  {
    key: "breakfast",
    name: "Breakfast",
    items: [
      { w: "cereal", p: 0.55, c: "yellow" },
      { w: "toast", p: 0.25, c: "mint" },
      { w: "eggs", p: 0.15, c: "sky" },
      { w: "pizza", p: 0.05, c: "pink" },
    ],
  },
  {
    key: "flat",
    name: "Flat distribution",
    items: [
      { w: "A", p: 0.28, c: "yellow" },
      { w: "B", p: 0.26, c: "mint" },
      { w: "C", p: 0.24, c: "sky" },
      { w: "D", p: 0.22, c: "pink" },
    ],
  },
];

// fixed "random" draws for the s5 animation (mostly cereal, sometimes others)
export const DRAWS = ["cereal", "cereal", "toast", "cereal", "eggs", "cereal", "cereal", "toast", "cereal", "pizza", "cereal", "toast"];

export const ch13: ChapterSpec = {
  id: 13,
  part: 1,
  title: "Probability distributions",
  core: false,
  hook: "How would you say \"it'll probably rain\" with numbers?",
  steps: [
    { id: "s1", sec: 9.5, narration: "Roll a die and each number from 1 to 6 comes up with probability 1/6. That's the probability you learned in middle school." },
    { id: "s2", sec: 9.5, narration: "Draw a bar for each outcome's probability and you get a probability distribution. The bar heights always add up to 1, or 100%." },
    { id: "s3", sec: 8, narration: "Not every distribution is even. For breakfast, cereal is high and pizza is low. We call this a peaked distribution." },
    { id: "s4", sec: 9, narration: "GPT produces a distribution like this every moment: about 50,000 candidate pieces, so 50,000 bars. They still add up to exactly 1." },
    { id: "s5", sec: 9, narration: "When you draw one from a distribution, taller bars get picked more often. But lower bars get picked sometimes too." },
    { id: "s6", sec: 8, narration: "A peaked distribution gives steady answers; a flat one gives varied answers. In chapter 81 we control this with temperature." },
    { id: "s7", sec: 9, narration: "A probability distribution gives every candidate a chance, and they add up to 1. In chapter 14, we turn scores into one." },
  ],
  playgroundTitle: "The drawing lab",
  playgroundIntro: "Pick a distribution and draw many times. The more you draw, the closer the share of each result gets to its probability.",
  summary: [
    "Probability distribution: a chance for every candidate. All the bars add up to 1.",
    "Taller bars get picked more often, but lower bars get picked sometimes too.",
    "Every time, GPT makes a distribution over about 50,000 candidates and picks one.",
  ],
  unlocks: "Probability distributions",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "What is the probability of rolling a 3 on a die?",
      choices: ["1/6", "1/3", "3/6"],
      answer: 0,
      explain: "All six faces are equally likely, so each has 1/6.",
      review: "s1",
    },
    {
      q: "What do the bar heights of a probability distribution add up to?",
      choices: ["1 (100%)", "The number of candidates", "It depends"],
      answer: 0,
      explain: "Something is sure to happen, so all the chances together add up to 1.",
      review: "s2",
    },
    {
      q: "What about a candidate with a 10% probability?",
      choices: ["It's never picked", "It's picked sometimes", "It's always picked"],
      answer: 1,
      explain: "About 1 time in 10. Low isn't zero, so it can be picked.",
      review: "s5",
    },
  ],
  labels: {
    tag: "13. Probability distributions",
    dice: "Die",
    sixth: "each 1/6",
    dist: "Probability distribution",
    total: "sum = 1 (100%)",
    breakfast: "Breakfast",
    peaked: "peaked distribution",
    gpt: "GPT's next-piece distribution",
    many: "about 50,000 candidates, sum = 1",
    draw: "draw",
    count: "times drawn",
    sometimes: "low bars get picked too!",
    sharp: "peaked → steady answers",
    flat: "flat → varied answers",
    temp: "Ch. 81: control it with temperature",
    sum: "Every candidate's chance; total 1",
    next: "Next: chapter 14, softmax",
    go: "school",
    went: "the",
    late: "work",
  },
};
