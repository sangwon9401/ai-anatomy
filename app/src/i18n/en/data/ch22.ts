import { W0, lossA, slopeA } from "../../../data/ch21";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** gradient steps on chapter 21's valley (Truck A, line knob) with learning rate `lr` */
export function walk(lr: number, steps: number, w0 = W0) {
  const ws = [w0];
  for (let i = 0; i < steps; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - lr * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
}

export const RUNS: { lr: number; name: string; c: Highlighter; ws: number[] }[] = [
  { lr: 0.01, name: "too small", c: "sky", ws: walk(0.01, 10) },
  { lr: 0.1, name: "just right", c: "mint", ws: walk(0.1, 10) },
  { lr: 0.3, name: "too big", c: "pink", ws: walk(0.3, 10) },
];
export const RUN_LOSS = RUNS.map((r) => r.ws.map(lossA));

export const ch22: ChapterSpec = {
  id: 22,
  part: 2,
  title: "Choosing the step size: learning rate",
  core: false,
  hook: "Walking down a mountain, how big should each step be?",
  steps: [
    { id: "s1", sec: 9.5, narration: "In chapter 21, one step was learning rate × slope. The learning rate is the step size: how big a stride each step takes." },
    { id: "s2", sec: 9, narration: "If the learning rate is too small (0.01), it's slow as a turtle. After five steps, it's still halfway down the slope." },
    { id: "s3", sec: 7.5, narration: "Just right (0.1), and it reaches the bottom in a few steps: the very steps from chapter 21." },
    { id: "s4", sec: 9, narration: "Too big (0.3), and it overshoots the bottom and bounces to the other side. Each bounce goes higher, so the loss grows." },
    { id: "s5", sec: 8.5, narration: "Plot the loss after each step and the difference jumps out: a slow slide, a quick drop, and a shoot upward." },
    { id: "s6", sec: 9, narration: "So the learning rate is chosen carefully. GPT-3 raised it a little at first, then slowly lowered it as training went on." },
    { id: "s7", sec: 8, narration: "Too small is a turtle; too big bounces away. The right step size matters. Smarter steps come in chapter 67." },
  ],
  playgroundTitle: "The step-size lab",
  playgroundIntro: "Pick a learning rate and press \"Take 10 steps\". Watch how the ball moves in the valley and how the loss changes.",
  summary: [
    "Learning rate = the size of one step. New knob = knob − learning rate × slope.",
    "Too small and it crawls like a turtle; too big and it overshoots the bottom and bounces away.",
    "The right learning rate reaches the bottom fast. It's often lowered during training.",
  ],
  unlocks: "Learning rate",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "The loss keeps growing during training. What's the most likely cause?",
      choices: ["The learning rate is too big", "The learning rate is too small", "There's too little data"],
      answer: 0,
      explain: "With too big a step, it overshoots the bottom and lands higher on the other side, so the loss grows.",
      review: "s4",
    },
    {
      q: "What happens when the learning rate is too small?",
      choices: ["The loss explodes", "The loss goes down very slowly", "The loss becomes 0 right away"],
      answer: 1,
      explain: "The direction is right, but the steps are tiny, so it takes a great many steps to reach the bottom.",
      review: "s2",
    },
    {
      q: "With w = 1, slope = −4 and learning rate 0.3, what is the new w?",
      choices: ["1.4", "0.7", "2.2"],
      answer: 2,
      explain: "1 − 0.3 × (−4) = 1 + 1.2 = 2.2. It shot well past the bottom (1.5).",
      review: "s4",
    },
  ],
  labels: {
    tag: "22. Choosing the step size: learning rate",
    rule: "new w = w − learning rate × slope",
    stride: "learning rate = step size",
    axisW: "w (line knob)",
    axisL: "loss",
    small: "rate 0.01",
    good: "rate 0.1",
    big: "rate 0.3",
    turtle: "turtle… still mid-slope",
    arrive: "bottom in a few steps!",
    bounce: "bouncing higher and higher",
    out: "next: off the chart!",
    chart: "Loss after each step",
    step: "step",
    slow: "slowly",
    fast: "drop",
    up: "shoots up",
    schedTitle: "The learning rate gets a plan too",
    warm: "raise it slowly at first",
    decay: "then shrink it",
    lrAxis: "learning rate",
    timeAxis: "training time",
    sketch: "illustrative sketch",
    sum1: "Too small: a turtle",
    sum2: "Too big: bounces away",
    sum3: "Just right: quickly to the bottom",
    next: "Smarter steps: ch. 67, Adam",
    example: "Truck A · illustrative example",
  },
};
