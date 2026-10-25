import { GD_RUN, TRAIN, VAL, fitPoly, mseOf } from "../../../data/part2-fit";
import type { ChapterSpec } from "../../../data/types";

export const LINE = fitPoly(1, TRAIN);
export const LINE_TRAIN = mseOf(LINE, TRAIN);
export const LINE_VAL = mseOf(LINE, VAL);
export const WIGGLE = GD_RUN[GD_RUN.length - 1];
/** the point of the run where the validation loss was lowest */
export const BEST_STOP = GD_RUN.slice(1).reduce((a, r) => (r.val < a.val ? r : a), GD_RUN[1]);

export const ch25: ChapterSpec = {
  id: 25,
  part: 2,
  title: "The student who memorized past exams",
  core: false,
  hook: "An AI that aces every practice problem but fails the real test: why does that happen?",
  steps: [
    { id: "s1", sec: 8.5, narration: "A student who only memorizes past exams aces those, but does badly on new questions. The same thing happens to AI." },
    { id: "s2", sec: 9, narration: "We practice on the line lengths and ratings of 8 trucks: the training data. A simple straight line passes between the points." },
    { id: "s3", sec: 10, narration: "Train a very complex model for a long time, and it becomes a wiggly line through all 8 points exactly. The training loss is 0." },
    { id: "s4", sec: 9.5, narration: "But give it 7 trucks it has never seen (validation data), and it gives silly answers. It only memorized. This is overfitting." },
    { id: "s5", sec: 8.5, narration: "Plot both losses while training: the training loss keeps going down, but at some point the validation loss starts rising again." },
    { id: "s6", sec: 9.5, narration: "Stop when the validation loss is lowest, or collect more data. Doing well on new problems is called generalization." },
    { id: "s7", sec: 8, narration: "GPT is also checked on held-out text during training: is it really learning, or just memorizing?" },
  ],
  playgroundTitle: "The memorization detector",
  playgroundIntro: "Change the model's complexity (how wiggly the curve can get). See how the training and validation losses change, and what happens when you collect more data.",
  summary: [
    "Overfitting: memorizing the training data, so the training loss is low but new data goes wrong.",
    "Check with validation data (problems not used in training). A rising validation loss is a warning sign.",
    "Fixes: stop when the validation loss is lowest, or collect more data. The goal is generalization.",
  ],
  unlocks: "Overfitting · generalization",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "The training loss is 0 but the validation loss is big. What does that mean?",
      choices: ["It learned really well", "It's overfitting", "The learning rate is 0"],
      answer: 1,
      explain: "It memorized the training data and can't handle new data. That's overfitting.",
      review: "s4",
    },
    {
      q: "What is validation data?",
      choices: ["Data set aside and not used for training", "The training data used a second time", "Data with no answers"],
      answer: 0,
      explain: "Only a test on problems the model has never seen shows its real ability.",
      review: "s4",
    },
    {
      q: "Which of these does NOT reduce overfitting?",
      choices: ["Collecting more data", "Stopping when the validation loss is lowest", "Training much longer on the same data"],
      answer: 2,
      explain: "The longer it trains on the same data, the more it memorizes. Stop once the validation loss starts to rise.",
      review: "s6",
    },
  ],
  labels: {
    tag: "25. The student who memorized past exams",
    memo: "Memorized",
    under: "Understood",
    past: "past exams",
    fresh: "new test",
    pts: "%",
    example: "illustrative example",
    trainTitle: "8 training trucks",
    axisX: "line (people)",
    axisY: "rating",
    simple: "a simple line",
    trainLoss: "training",
    valLoss: "validation",
    complex: "very complex model",
    zero: "passes all 8 points!",
    valTitle: "7 new trucks",
    weird: "a 6-star rating?!",
    overfit: "Overfitting",
    curveTitle: "Both losses during training",
    time: "training time →",
    timeNote: "tick spacing grows to the right",
    stop: "stop here!",
    apart: "they split",
    fix1: "Stop when the validation loss is lowest",
    fix2: "Collect more data",
    gen: "Generalization = solving new problems",
    gpt: "GPT is also checked on held-out text",
    real: "Memorized, or truly learned?",
    line: "line",
    wiggle: "wiggly",
  },
};
