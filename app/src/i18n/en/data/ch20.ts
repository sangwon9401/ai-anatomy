import { NEURON, STORES, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** Trucks A, B, C scored by the chapter 16 neuron: prediction, real rating, error */
export const GRADED = STORES.slice(0, 3).map((s) => {
  const pred = neuron(s.x, NEURON.w, NEURON.b);
  return { name: s.name, pred, real: s.real, err: pred - s.real };
});
export const ERR_SUM = GRADED.reduce((a, g) => a + g.err, 0);
export const SQ_SUM = GRADED.reduce((a, g) => a + g.err ** 2, 0);
export const MSE = SQ_SUM / GRADED.length;

export const ch20: ChapterSpec = {
  id: 20,
  part: 2,
  title: "How wrong was it? Loss",
  core: true,
  hook: "We know when an AI is wrong, but how do we measure how wrong it is?",
  steps: [
    { id: "s1", sec: 9.5, narration: "The chapter 16 neuron guessed Truck A would get 3.5 points. But the real rating our friends gave after eating there is 4.5." },
    { id: "s2", sec: 10.5, narration: "How wrong it is = the distance between the dart and the target. Guess minus answer: 3.5 − 4.5 = −1. It fell 1 point short." },
    { id: "s3", sec: 9, narration: "Let's grade three trucks: A is −1, B is +1, C is −0.5. Simply adding them gives −0.5, which looks almost right." },
    { id: "s4", sec: 9, narration: "To get rid of the signs, we square each error. Absolute values would work too, but squaring punishes big misses much more." },
    { id: "s5", sec: 10, narration: "The mean of the squares is 2.25 ÷ 3 = 0.75. This single number is the loss. A loss of 0 means everything was right." },
    { id: "s6", sec: 9.5, narration: "GPT guesses the next word, not a rating, so it's graded on how much probability it gave the right word. That's chapter 65." },
    { id: "s7", sec: 8, narration: "Now we have a goal: find the knobs that bring the loss close to 0. Chapter 21 shows how." },
  ],
  playgroundTitle: "The grading machine",
  playgroundIntro: "Move the three trucks' predicted ratings (the darts) with the sliders. The distance to the target (the real rating), its square and the loss are computed right away.",
  summary: [
    "Error = guess − answer. Simply adding errors lets + and − cancel out.",
    "So we square them (or take absolute values) and average. That one number is the loss.",
    "Loss 0 = all correct. Learning = finding knobs that shrink the loss. GPT's loss is in chapter 65.",
  ],
  unlocks: "Loss",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "If the guess is 2 and the answer is 5, what is the squared error?",
      choices: ["3", "9", "−3"],
      answer: 1,
      explain: "The error is 2 − 5 = −3, and squaring gives (−3)² = 9.",
      review: "s4",
    },
    {
      q: "Why square the errors instead of just adding them?",
      choices: ["So + and − don't cancel each other out", "To calculate faster", "To make the loss negative"],
      answer: 0,
      explain: "Adding −1 and +1 gives 0, as if nothing were wrong. Squared, both become 1.",
      review: "s3",
    },
    {
      q: "What does a loss of 0 mean?",
      choices: ["The model hasn't computed anything yet", "Every guess equals the answer", "Every guess is 0"],
      answer: 1,
      explain: "The mean of the squares is 0 only if every error is 0. The smaller the loss, the better.",
      review: "s5",
    },
  ],
  labels: {
    tag: "20. How wrong was it? Loss",
    titleA: "Truck A's rating",
    title3: "Grading three trucks",
    example: "illustrative example",
    pred: "guess",
    real: "real rating",
    gap: "1 point off",
    errFormula: "guess − answer = 3.5 − 4.5 = −1",
    star: "rating",
    sum: "Just adding: −1 + 1 − 0.5 = −0.5",
    looks: "Looks almost right?!",
    err: "error",
    square: "squared",
    sqSum: "Sum of squares: 1 + 1 + 0.25 = 2.25",
    big: "Bigger misses grow much bigger",
    mean: "Mean: 2.25 ÷ 3 = 0.75",
    loss: "loss = 0.75",
    zero: "0 means all correct",
    gptTitle: "How GPT is graded",
    sentence: "I walk to",
    answer: "answer: school",
    gave: "the answer's chance",
    ce: "cross-entropy (ch. 65)",
    surprise: "graded by how surprised it is",
    goal1: "Loss = how wrong, in one number",
    goal2: "Learning = shrinking the loss toward 0",
    how: "How? → ch. 21, gradient descent",
  },
};
