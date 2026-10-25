import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Surprise in "halvings": how many times 1 must be halved to reach p, i.e. log₂(1/p). */
export const surprise = (p: number) => Math.log2(1 / p);

/** ch01's numbers for "I walk to → ?" (illustrative), with the rest merged into "other". */
export const NEXT: { w: string; p: number; c: Highlighter }[] = [
  { w: "school", p: 0.52, c: "yellow" },
  { w: "the", p: 0.21, c: "mint" },
  { w: "work", p: 0.12, c: "sky" },
  { w: "other", p: 0.15, c: "violet" },
];

/** The halving ladder: probability as a fraction label and its surprise. */
export const LADDER = [
  { label: "1", p: 1 },
  { label: "1/2", p: 1 / 2 },
  { label: "1/4", p: 1 / 4 },
  { label: "1/8", p: 1 / 8 },
];

/** ch. 64's four questions with illustrative probabilities the model gave the right answer. */
export const QUESTIONS65 = [
  { ctx: "I", ans: "walk", p: 0.25 },
  { ctx: "I walk", ans: "to", p: 0.5 },
  { ctx: "I walk to", ans: "school", p: 0.52 },
  { ctx: "I walk to school", ans: ".", p: 0.8 },
];

export const meanSurprise = (ps: number[]) => ps.reduce((a, p) => a + surprise(p), 0) / ps.length;

export const ch65: ChapterSpec = {
  id: 65,
  part: 7,
  title: "Measuring surprise",
  core: true,
  hook: "A model that bet 52% on the right answer: how wrong was it? Can we measure wrongness with a single number?",
  steps: [
    { id: "s1", sec: 10, narration: "After 'I walk to', the model gave 'school' 52%. The answer was 'school'. So how wrong was the model?" },
    { id: "s2", sec: 11, narration: "Think of it as surprise. If what you expected happens, you're hardly surprised; if the unlikely happens, you're shocked." },
    { id: "s3", sec: 11, narration: "Let's put a number on it. A sure thing (probability 1) means surprise 0. Each halving of the probability adds 1." },
    { id: "s4", sec: 11, narration: "1/4 gives 2, and 1/8 gives 3. Count how many 2s you multiply to get 8: 2 × 2 × 2 = 8, so 3." },
    { id: "s5", sec: 11, narration: "Connect the dots: near probability 0, surprise shoots up without end. In math this is a logarithm; you'll meet it later on." },
    { id: "s6", sec: 10, narration: "school at 52% gives a surprise of about 0.94. Had it given school just 12%, about 3.06. Bet more on the answer, less surprise." },
    { id: "s7", sec: 11, narration: "Average the surprise over all the questions and you get cross-entropy. That's GPT's loss; training means making it smaller." },
  ],
  playgroundTitle: "Surprise meter",
  playgroundIntro: "Change the probability given to the right answer. See how much the surprise grows each time the probability halves.",
  summary: [
    "Surprise: the lower the probability given to the answer, the bigger it is. Probability 1 means surprise 0.",
    "Each time the probability halves, surprise goes up by 1 (1/2 → 1, 1/4 → 2, 1/8 → 3). This calculation is a logarithm.",
    "Average surprise over the questions = cross-entropy = GPT's loss. Training means making it smaller.",
  ],
  unlocks: "Cross-entropy",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "If the right answer got probability 1/4, what is the surprise? (counting in 2s)",
      choices: ["1", "2", "4"],
      answer: 1,
      explain: "Halve 1 twice and you get 1/4. 2 × 2 = 4, so the surprise is 2.",
      review: "s4",
    },
    {
      q: "One model gave the right answer 90%, another gave it 10%. Which has the bigger loss?",
      choices: ["The one that gave 10%", "The one that gave 90%", "They're the same"],
      answer: 0,
      explain: "The less you bet on the right answer, the more surprised you are. Bigger surprise means bigger loss.",
      review: "s6",
    },
    {
      q: "What does lowering the cross-entropy loss mean?",
      choices: ["Having fewer candidates", "Giving every candidate the same probability", "Giving the right piece a higher probability"],
      answer: 2,
      explain: "The higher the probability on the right answer, the smaller the surprise, and the loss is the average surprise.",
      review: "s7",
    },
  ],
  labels: {
    tag: "65. Measuring surprise",
    ctx: "I walk to",
    example: "illustrative example",
    answer: "Correct!",
    howWrong: "How wrong was it?",
    rain90: "90% chance of rain",
    rain10: "10% chance of rain",
    rained: "→ It rained!",
    little: "A bit surprised",
    big: "Shocked!",
    prob: "Probability",
    surprise: "Surprise",
    halve: "Halve it → +1",
    times: "8 = 2 × 2 × 2 → surprise 3",
    axisP: "Probability →",
    axisS: "↑ Surprise",
    soar: "Shoots up near 0",
    formula: "surprise = log₂(1 ÷ p)",
    log: "Logs: you'll meet them later",
    go52: "school 52%",
    go12: "school 12%",
    lessSurprise: "Bet more on the answer, less surprise",
    colQ: "Question",
    colP: "P(answer)",
    colS: "Surprise",
    mean: "Average",
    ce: "Cross-entropy",
    loss: "= GPT's loss (ch. 20)",
    learn: "Training = shrinking surprise",
    base: "Real training uses e (ch. 14) instead of 2. Same idea.",
  },
};
