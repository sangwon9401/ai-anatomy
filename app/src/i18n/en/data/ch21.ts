import { NEURON, STORE_A, neuron } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/** Truck A only, turning only the line knob w: loss = (guess − 4.5)² = (2w − 3)² */
export const lossA = (w: number) => (neuron(STORE_A.x, [NEURON.w[0], w, NEURON.w[2]], NEURON.b) - STORE_A.real) ** 2;
/** slope measured the way the chapter explains it: nudge w a little and see how the loss changes */
export const slopeA = (w: number, d = 1e-4) => (lossA(w + d) - lossA(w - d)) / (2 * d);
export const LR = 0.1;
export const W0 = NEURON.w[1];
/** w after each gradient step from W0 */
export const PATH = (() => {
  const ws = [W0];
  for (let i = 0; i < 5; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - LR * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
})();

export const ch21: ChapterSpec = {
  id: 21,
  part: 2,
  title: "Gradient descent",
  core: true,
  hook: "To shrink the loss, which way should you turn a knob, and by how much?",
  steps: [
    { id: "s1", sec: 10.5, narration: "Take just Truck A and turn one knob of the chapter 16 neuron: the line weight w. Right now, w is 1 and the loss is 1." },
    { id: "s2", sec: 8.5, narration: "Try many values of w and plot the loss, and you get a valley. We want to find its lowest point." },
    { id: "s3", sec: 9.5, narration: "But in real life you can't see this picture: there are countless knobs. It's like a foggy mountain where you only see your feet." },
    { id: "s4", sec: 10.5, narration: "You can feel the slope under your feet, though. Nudge w up by just 0.01, and the loss drops from 1 to 0.96, about 0.04 less." },
    { id: "s5", sec: 10, narration: "The slope is how much the loss changes for a small nudge: −0.04 ÷ 0.01 = about −4. It's negative, so raising w goes downhill." },
    { id: "s6", sec: 10.5, narration: "So take one step against the slope! New w = 1 − 0.1 × (−4) = 1.4. The 0.1 is the step size (chapter 22, learning rate)." },
    { id: "s7", sec: 9.5, narration: "Repeat this and the ball rolls to the bottom: w is 1.5, the guess is 4.5, the loss is 0. This is gradient descent." },
    { id: "s8", sec: 9, narration: "With two knobs it's a bowl. With 175 billion it's an unimaginable mountain, but finding each knob's slope works the same way." },
  ],
  playgroundTitle: "Down the mountain in the fog",
  playgroundIntro: "The valley is hidden in fog. Use \"Feel the slope\" to check under your feet, then turn the knob to bring the loss below 0.01. Stuck? Press \"Auto step\".",
  summary: [
    "Slope = how much the loss changes when you nudge a knob a little.",
    "Step a little against the slope: new knob = knob − learning rate × slope.",
    "Repeat, and you go down to the bottom of the loss valley. That's gradient descent.",
  ],
  unlocks: "Gradient descent",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "You raised a knob by 0.01 and the loss went up by 0.03. About what is the slope?",
      choices: ["−3", "+3", "+0.03"],
      answer: 1,
      explain: "Slope = change in loss ÷ change in knob = 0.03 ÷ 0.01 = 3. The loss went up, so it's positive.",
      review: "s5",
    },
    {
      q: "If the slope is +3, which way should you turn the knob to lower the loss?",
      choices: ["Up", "Down", "Leave it"],
      answer: 1,
      explain: "Raising it increases the loss, so go the other way. New value = current value − learning rate × 3.",
      review: "s6",
    },
    {
      q: "If w = 2, slope = 5 and learning rate = 0.1, what is w after one step?",
      choices: ["1.5", "2.5", "1.9"],
      answer: 0,
      explain: "2 − 0.1 × 5 = 2 − 0.5 = 1.5.",
      review: "s6",
    },
  ],
  labels: {
    tag: "21. Gradient descent",
    title: "Just the line knob w",
    example: "Truck A only · illustrative example",
    axisW: "w (line knob)",
    axisL: "loss",
    now: "now: w = 1, loss = 1",
    valley: "loss valley",
    goal: "the bottom!",
    fog: "In the fog: you only see your feet",
    nudgeW: "w: 1 → 1.01",
    nudgeL: "loss: 1 → 0.96",
    nudgeD: "down about 0.04",
    slope: "slope ≈ −0.04 ÷ 0.01 = −4",
    slopeNote: "negative → raising w lowers the loss",
    rule: "new w = 1 − 0.1 × (−4) = 1.4",
    lr: "0.1 = step size (learning rate)",
    loss14: "loss 1 → 0.04",
    repeat: "1 → 1.4 → 1.48 → 1.496 → … → 1.5",
    done: "guess 4.5 = the real rating!",
    gd: "Gradient descent",
    bowl: "2 knobs = a bowl shape",
    k1: "knob 1",
    k2: "knob 2",
    many: "same for 175 billion",
    bowlEx: "illustrative sketch",
  },
};
