import { bookLoss, train } from "../../../data/part2-batch";
import { NEURON, STORES, TUNED_LINE_W, neuron } from "../../../data/part2-toy";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** s1: tuning the line knob for Truck A alone (ch. 16, 21) helps A but hurts the five trucks overall */
export const ONLY_A = STORES.map((s) => {
  const before = neuron(s.x, NEURON.w, NEURON.b) - s.real;
  const after = neuron(s.x, [NEURON.w[0], TUNED_LINE_W, NEURON.w[2]], NEURON.b) - s.real;
  return { name: s.name, before, after };
});
export const LOSS_BEFORE = ONLY_A.reduce((a, r) => a + r.before ** 2, 0) / ONLY_A.length;
export const LOSS_AFTER = ONLY_A.reduce((a, r) => a + r.after ** 2, 0) / ONLY_A.length;

export const BATCH_LR = 0.05;
export const CMP_EPOCHS = 3;
/** s5: loss over the whole book after every update, three epochs, three batch sizes */
export const CURVES: { batch: number; c: Highlighter; loss: number[] }[] = [1, 10, 60].map((batch, i) => ({
  batch,
  c: (["pink", "mint", "sky"] as Highlighter[])[i],
  loss: train(batch, CMP_EPOCHS, BATCH_LR).map(([w, b]) => bookLoss(w, b)),
}));

export const ch24: ChapterSpec = {
  id: 24,
  part: 2,
  title: "Splitting the workbook",
  core: false,
  hook: "A workbook with millions of problems: fix after every problem, or solve them all and fix once?",
  steps: [
    { id: "s1", sec: 10.5, narration: "Tuning the line knob to 1.5 makes A spot on, but B goes way off. The loss over all five trucks grows from 0.7 to 1.95." },
    { id: "s2", sec: 9, narration: "So we must look at the whole workbook. But with millions of problems, solving them all before every fix is too slow." },
    { id: "s3", sec: 10.5, narration: "So we solve a few at a time: solve a bundle, grade it, fix the knobs, then on to the next bundle. Each bundle is a minibatch." },
    { id: "s4", sec: 8, narration: "Going through the whole workbook once, start to finish, is 1 epoch. Usually we repeat many epochs." },
    { id: "s5", sec: 9.5, narration: "Compare over 180 problems: one at a time drops fast but wobbles; all at once fixes only 3 times. Bundles of 10 are smooth." },
    { id: "s6", sec: 9, narration: "Computers calculate a whole bundle at once, so it's fast (chapter 68). GPT-3 packed about 3.2 million tokens into each bundle." },
    { id: "s7", sec: 8, narration: "Split into minibatches, repeat for many epochs. But solving the same workbook too many times causes a problem (chapter 25)." },
  ],
  playgroundTitle: "Bundle size experiment",
  playgroundIntro: "Train the two knobs of the chapter 16 neuron (line weight and bias) on a workbook of 60 trucks. Pick a bundle size and press \"Solve 1 epoch\".",
  summary: [
    "Fix based on just one problem and the others go off. You have to look at the whole workbook.",
    "Minibatch: solve, grade and fix a few problems at a time. Epoch: one lap of the workbook.",
    "One at a time wobbles; all at once is slow. A medium bundle is fast and steadier.",
  ],
  unlocks: "Minibatch · epoch",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "If you solve 1,000 problems in bundles of 100, how many times do you fix the knobs in 1 epoch?",
      choices: ["10", "100", "1,000"],
      answer: 0,
      explain: "1,000 ÷ 100 = 10 bundles. You fix once per bundle, so 10 times.",
      review: "s3",
    },
    {
      q: "What is \"1 epoch\"?",
      choices: ["Fixing the knobs once", "Going through the whole workbook once, start to finish", "Solving one problem"],
      answer: 1,
      explain: "An epoch is one full lap through all of the training data.",
      review: "s4",
    },
    {
      q: "What happens when you fix the knobs after every single problem?",
      choices: ["You fix often, but the direction wobbles", "You fix only once per epoch", "It's always the most accurate"],
      answer: 0,
      explain: "Each fix leans toward one problem, then toward another, so the path zigzags.",
      review: "s5",
    },
  ],
  labels: {
    tag: "24. Splitting the workbook",
    s1title: "Tuned for Truck A alone",
    col0: "truck",
    col1: "first error",
    col2: "after fixing A",
    total: "Total loss of all five",
    worse: "Fixing only A breaks B",
    book: "The workbook",
    probs: "millions of problems",
    allAtOnce: "Solve them all, then fix once?",
    tooSlow: "One fix takes far too long",
    bundle: "10 problems",
    station: "grade → fix the knobs",
    done: "done",
    count: "bundle",
    minibatch: "minibatch = one bundle",
    epoch: "1 epoch done!",
    again: "Back to the start: epoch 2",
    cmp: "Over the same 3 epochs (180 problems)",
    solved: "problems solved",
    lossAxis: "loss",
    jump: "sometimes jumps way up",
    axisW: "line weight",
    axisB: "bias",
    b1: "One at a time: 180 fixes",
    b10: "10 at a time: 18",
    b60: "All at once: 3",
    bottom: "bottom",
    start: "start",
    example: "60 trucks · illustrative example",
    gpu: "Compute a whole bundle at once (ch. 68)",
    gptBatch: "GPT-3 bundle: about 3.2 million tokens",
    gptAll: "Whole workbook: about 300 billion tokens",
    sumA: "Minibatch: solve and fix a few at a time",
    sumB: "Epoch: one lap of the workbook",
    next: "Same workbook too often? → ch. 25",
  },
};
