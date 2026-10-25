import { MNIST_TEST_ACC } from "../../../data/part2-mnist";
import { predict, sampleDigit } from "../../../data/part2-mnist-net";
import type { ChapterSpec } from "../../../data/types";

/** the scene's 3 (an MNIST test image) and what the embedded network says about it */
export const THREE = sampleDigit(3);
export const THREE_OUT = predict(THREE);
/** s1 zoom: a 4×4 patch of the 3 (rows, cols) */
export const PATCH = { row: 10, col: 10, n: 4 };
export const PATCH_VALUES = Array.from({ length: PATCH.n }, (_, r) => Array.from({ length: PATCH.n }, (_, c) => THREE[(PATCH.row + r) * 28 + PATCH.col + c]));
export const ACC_PCT = (MNIST_TEST_ACC * 100).toFixed(2);
export const ACC_RIGHT = Math.round(MNIST_TEST_ACC * 10000);
/** s2 draws 8 of the 64 hidden neurons: the five most active for this 3, and three that stay off */
export const SHOWN_HIDDEN = (() => {
  const idx = Array.from(THREE_OUT.hidden, (v, i) => [i, v] as [number, number]);
  const on = [...idx].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const off = idx.filter(([, v]) => v === 0).slice(0, 3);
  return [on[0], off[0], on[1], on[2], off[1], on[3], off[2], on[4]];
})();
export const HIDDEN_MAX = Math.max(...THREE_OUT.hidden);
export const ACTIVE_COUNT = THREE_OUT.hidden.filter((v) => v > 0).length;

export const ch26: ChapterSpec = {
  id: 26,
  part: 2,
  title: "Hands-on: handwritten digits",
  core: false,
  hook: "Can a neural network really read a digit you write with your finger?",
  steps: [
    { id: "s1", sec: 10.5, narration: "A digit image is 28 × 28 = 784 squares. Each square holds a number from 0 (blank) to 1 (dark ink), as in chapter 6." },
    { id: "s2", sec: 9.5, narration: "These 784 numbers are the input. 64 hidden neurons each take a weighted sum plus bias, then bend it with ReLU (chapters 16–19)." },
    { id: "s3", sec: 9.5, narration: "10 output neurons give scores for 0–9, and softmax turns them into probabilities (chapter 14). Here: 3 is 87.5%, 5 is 11.3%." },
    { id: "s4", sec: 9, narration: "It trained on MNIST's 60,000 handwritten digits: forward pass, loss, backpropagation and fixes, in minibatches (chapters 19–24)." },
    { id: "s5", sec: 9.5, narration: "After training, it was graded on 10,000 test images it had never seen and got 97.96% right. It's the very network inside this app." },
    { id: "s6", sec: 9, narration: "Draw a hidden neuron's weights as a picture and you see stroke-like patterns. Nobody taught it these; it found them by itself." },
    { id: "s7", sec: 9.5, narration: "Now it's your turn. Draw a digit with your finger in the box below, and the network in your browser reads it right away." },
  ],
  playgroundTitle: "Guess my digit",
  playgroundIntro: "Draw one big digit from 0 to 9 in the box with your finger (or mouse). You'll see the 28×28 image the network sees and the probability of each digit.",
  summary: [
    "A digit image = 28 × 28 = 784 numbers. That's the network's input.",
    "784 → 64 hidden neurons (ReLU) → 10 outputs → softmax gives probabilities for 0–9.",
    "Trained on MNIST's 60,000 images, it got about 98% of 10,000 new ones right.",
  ],
  unlocks: "Handwriting reader",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "How many numbers describe a 28 × 28 black-and-white digit image?",
      choices: ["56", "784", "28"],
      answer: 1,
      explain: "28 squares across × 28 squares down = 784 squares, with one number each.",
      review: "s1",
    },
    {
      q: "Which calculation turns the 10 output neurons' scores into probabilities?",
      choices: ["ReLU", "Normalization", "Softmax"],
      answer: 2,
      explain: "Softmax (chapter 14), which raises e to each score and divides by the total, gives the probabilities for 0–9.",
      review: "s3",
    },
    {
      q: "To measure the network's skill, which images should you grade it on?",
      choices: ["New images not used in training", "Images used in training", "Any images at all"],
      answer: 0,
      explain: "Asking about what it memorized can't show real skill (chapter 25). It was graded on 10,000 test images it had never seen.",
      review: "s5",
    },
  ],
  labels: {
    tag: "26. Hands-on: handwritten digits",
    title: "A handwritten 3",
    grid: "28 × 28 = 784 squares",
    scale: "0 = blank, 1 = dark ink",
    zoom: "zoom",
    mnist: "MNIST test image",
    inputs: "784 inputs",
    hidden: "64 hidden",
    outputs: "10 outputs",
    drawn: "8 of the 64 shown",
    active: "For this image, 35 of the 64 turned on",
    relu: "bent by ReLU",
    on: "lit = yellow",
    probTitle: "Scores → softmax → %",
    confuse: "a little confused with 5",
    trainTitle: "Trained on 60,000 MNIST digits",
    loop: "forward pass → loss → backprop → fix",
    batch: "repeat in minibatches",
    test: "10,000 test images it never saw",
    right: " correct",
    measured: "measured with the very network in this app",
    seeTitle: "Patterns the hidden neurons see",
    plus: "+ weight: ink here turns it on",
    minus: "− weight: ink here turns it off",
    self: "Nobody taught them this!",
    neuron: "neuron",
    go: "Now it's your turn to draw!",
    down: "Draw a digit in the box below",
    digits: "0 1 2 3 4 5 6 7 8 9 %",
  },
};
