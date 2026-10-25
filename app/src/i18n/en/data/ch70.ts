import type { ChapterSpec } from "../../../data/types";

/** Illustrative curve: every ×10 in size takes 0.5 off the loss. (Kaplan 2020 found straight lines on ×10 axes;
 *  these numbers are made up to keep the arithmetic simple.) */
export const LOSS_AT_1E7 = 5;
export const DROP_PER_10X = 0.5;
export const lossOf = (n: number) => LOSS_AT_1E7 - DROP_PER_10X * (Math.log10(n) - 7);

export const SIZES70 = [1e7, 1e8, 1e9, 1e10, 1e11];
export const GPT3_N = 1.75e11;

/** Short number words for model sizes (the name is kept from the Korean file): 10M, 100M, 1B, 175B, 1T. */
export function koN(n: number): string {
  const short = (v: number) => Number(v.toPrecision(3)).toLocaleString("en-US");
  if (n >= 1e12) return `${Number((n / 1e12).toFixed(1)).toLocaleString("en-US")}T`;
  if (n >= 1e9) return `${short(n / 1e9)}B`;
  if (n >= 1e6) return `${short(n / 1e6)}M`;
  return `${short(n / 1e3)}K`;
}

/** Chinchilla (2022): about 20 training tokens per parameter. */
export const TOKENS_PER_PARAM = 20;

export const ch70: ChapterSpec = {
  id: 70,
  part: 7,
  title: "Bigger is smarter",
  core: true,
  hook: "Make a model 10 times bigger: how much better does it get? Can we know in advance?",
  steps: [
    { id: "s1", sec: 10, narration: "Does a bigger model really get smarter? In 2020, researchers built many models of different sizes and compared their loss." },
    { id: "s2", sec: 9, narration: "Let's plot it on a normal scale. The small models crowd together at the left edge, and after that it looks almost flat." },
    { id: "s3", sec: 9, narration: "Now let's change the horizontal ruler. Instead of adding 1 with each step, each step multiplies by 10." },
    { id: "s4", sec: 10, narration: "Now the dots line up in a straight line. In this illustrative example, every 10 times bigger cuts the loss by 0.5." },
    { id: "s5", sec: 10, narration: "A ruler that grows 10 times per step is a log scale. Like surprise in chapter 65, it counts how many times you multiplied." },
    { id: "s6", sec: 9, narration: "More data or more computing gave the same straight line. This rule is called the scaling laws." },
    { id: "s7", sec: 10, narration: "Extend the line, and you can predict the loss of an even bigger model. That's why people dared to build big models like GPT-3." },
    { id: "s8", sec: 11, narration: "In 2022, the Chinchilla study said: don't just grow the model; grow the data too, about 20 tokens of text per parameter." },
  ],
  playgroundTitle: "Change the ruler",
  playgroundIntro: "Change the model size, and switch between the normal ruler and the ×10 ruler to compare how the same dots look.",
  summary: [
    "Change the horizontal ruler to steps of ×10 (a log scale), and the loss drops in a straight line.",
    "Grow the size, data and compute, and the loss drops predictably = scaling laws (2020).",
    "Extending the line predicts big models. The data has to grow too (Chinchilla, 2022).",
  ],
  unlocks: "Scaling laws",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "On the ×10 ruler, what happens to the value when you move one step to the right?",
      choices: ["It goes up by 1", "It becomes 10 times bigger", "It doubles"],
      answer: 1,
      explain: "Each step multiplies by 10, like 1 → 10 → 100 → 1,000. A ruler like that is a log scale.",
      review: "s3",
    },
    {
      q: "What do the scaling laws say?",
      choices: ["A big enough model reaches zero loss", "A model that's too big can't learn", "Growing size, data and compute lowers the loss predictably"],
      answer: 2,
      explain: "On the ×10 ruler, the loss falls along a straight line, so you can predict how bigger models will do.",
      review: "s6",
    },
    {
      q: "What did the Chinchilla study (2022) recommend?",
      choices: ["Grow the data along with the model size", "Make the model as big as possible, nothing else", "Use less data"],
      answer: 0,
      explain: "Grow the model and the data together, at about 20 tokens of text per parameter.",
      review: "s8",
    },
  ],
  labels: {
    tag: "70. Bigger is smarter",
    study: "2020 · Kaplan et al.",
    sizes: "Model size (number of parameters)",
    q: "Does bigger mean lower loss?",
    axisX: "Model size",
    axisXArrow: "Model size →",
    axisY: "↑ Loss",
    example: "illustrative example",
    crowd: "← crowded at the left edge",
    flatQ: "Almost flat?",
    rulerA: "Normal ruler: +1 per step",
    rulerB: "×10 ruler: ×10 per step",
    plus1: "+1",
    times10: "×10",
    line: "One straight line!",
    minus: "−0.5",
    logName: "Log scale",
    link65: "Ch. 65: each halving, surprise +1",
    link70: "Ch. 70: each ×10, one step",
    data: "Data",
    compute: "Compute",
    law: "Scaling laws",
    predict: "Predict ahead →",
    gpt3: "GPT-3",
    chinchilla: "2022 · Chinchilla",
    perParam: "About 20 tokens of text per parameter",
    exampleCalc: "1 billion parameters → about 20 billion tokens",
    together: "Grow the model and the data together",
  },
};
