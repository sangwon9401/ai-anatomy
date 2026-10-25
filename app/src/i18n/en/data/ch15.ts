import type { ChapterSpec } from "../../../data/types";

export const MATH = [55, 65, 70, 75, 85]; // mean 70, standard deviation 10
export const FIT = [11, 13, 14, 15, 17]; // mean 14, standard deviation 2

export const stats = (xs: number[]) => {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length);
  return { mean, sd };
};

export const DATASETS = [
  { key: "math", name: "Math scores", xs: MATH },
  { key: "fit", name: "Fitness test", xs: FIT },
  { key: "wild", name: "All over the place", xs: [3, 40, 12, 95, 60] },
];

export const TOOLS = ["Turning things into numbers", "Vectors", "Distance", "Dot product", "Matrices", "Matrix multiplication", "Functions", "Probability distributions", "Softmax", "Normalization"];

export const ch15: ChapterSpec = {
  id: 15,
  part: 1,
  title: "Matching sizes: normalization",
  core: false,
  hook: "One test is out of 100, another out of 20. Who did better?",
  steps: [
    { id: "s1", sec: 9.5, narration: "The math test is out of 100, but the fitness test is out of 20. With different scales, you can't just compare the numbers." },
    { id: "s2", sec: 9.5, narration: "So we match their sizes. First, subtract the mean. The mean moves to 0, and you can see what's above or below it." },
    { id: "s3", sec: 9, narration: "Second, divide by the spread: the standard deviation from statistics class. Now both tests use the same yardstick." },
    { id: "s4", sec: 9, narration: "Math 85 and fitness 17: both 1.5 standard deviations above the mean. Equally good! Matching sizes like this is called normalization." },
    { id: "s5", sec: 8, narration: "Inside GPT, numbers can grow or shrink as vectors pass through the layers. So every layer resizes them with normalization." },
    { id: "s6", sec: 8, narration: "That's the layer normalization we'll see in chapter 57. It keeps the math steady even with dozens of layers stacked." },
    { id: "s7", sec: 7, narration: "Subtract the mean, divide by the spread. And with that, your Part 1 math toolbox is complete!" },
  ],
  playgroundTitle: "The normalizing machine",
  playgroundIntro: "Pick a set of scores and press ① and ② in order. Any set of numbers ends up at a similar size.",
  summary: [
    "① Subtract the mean: the mean moves to 0.",
    "② Divide by the standard deviation: the spread becomes 1.",
    "GPT normalizes at every layer so its numbers don't run wild (chapter 57).",
  ],
  unlocks: "Normalization",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "What do you get when you subtract the mean from the scores [60, 70, 80]?",
      choices: ["[−10, 0, 10]", "[0, 10, 20]", "[60, 70, 80]"],
      answer: 0,
      explain: "The mean is 70, so subtracting 70 from each gives −10, 0, 10.",
      review: "s2",
    },
    {
      q: "What are the two steps of normalization?",
      choices: ["Subtract the mean, divide by the standard deviation", "Subtract the maximum, divide by 2", "Add them all, divide by how many there are"],
      answer: 0,
      explain: "Subtracting the mean puts the center at 0; dividing by the standard deviation sets the spread to 1.",
      review: "s3",
    },
    {
      q: "Why does GPT normalize at every layer?",
      choices: ["So the numbers don't get too big or too small", "To use fewer words", "To answer faster"],
      answer: 0,
      explain: "It resets the size so the numbers don't run wild while passing through dozens of layers.",
      review: "s5",
    },
  ],
  labels: {
    tag: "15. Matching sizes: normalization",
    math: "Math (out of 100)",
    fit: "Fitness test (out of 20)",
    hard: "Can't compare them as they are",
    step1: "① subtract the mean",
    step2: "② divide by the standard deviation",
    mean: "mean",
    zero: "0 = mean",
    sd: "standard deviation",
    same: "same yardstick!",
    m85: "Math 85 → +1.5",
    f17: "Fitness 17 → +1.5",
    norm: "Normalization",
    layer: "layer",
    grow: "Grows as it passes through layers",
    fix: "Normalize to reset the size",
    ln: "Layer normalization (ch. 57)",
    done: "Part 1 math toolbox complete!",
  },
};
