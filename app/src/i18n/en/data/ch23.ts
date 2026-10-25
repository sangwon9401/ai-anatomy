import { NET, STORE_A, forward, type Net } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/**
 * Blame of every knob for loss = (rating − answer)²: how much the loss changes per unit nudge.
 * Computed backwards, one multiplication per edge (the chain the chapter shows).
 */
export function blame(net: Net, x: readonly number[], target: number) {
  const f = forward(net, x);
  const dy = 2 * (f.y - target);
  const dh = net.v.map((v) => dy * v);
  const dz = dh.map((d, j) => (f.z[j] > 0 ? d : 0));
  const dW1 = net.W1.map((row, j) => row.map((_, i) => dz[j] * x[i]));
  const db1 = dz;
  const dv = f.h.map((h) => dy * h);
  const dc = dy;
  return { f, loss: (f.y - target) ** 2, dy, dh, dz, dW1, db1, dv, dc };
}

export function step(net: Net, x: readonly number[], target: number, lr: number): Net {
  const g = blame(net, x, target);
  const r = (v: number) => Math.round(v * 1e6) / 1e6;
  return {
    W1: net.W1.map((row, j) => row.map((w, i) => r(w - lr * g.dW1[j][i]))) as Net["W1"],
    b1: net.b1.map((b, j) => r(b - lr * g.db1[j])) as Net["b1"],
    v: net.v.map((v, j) => r(v - lr * g.dv[j])) as Net["v"],
    c: r(net.c - lr * g.dc),
  };
}

export const B0 = blame(NET, STORE_A.x, STORE_A.real);
export const LR23 = 0.005;
export const NET_AFTER = step(NET, STORE_A.x, STORE_A.real, LR23);
export const AFTER = blame(NET_AFTER, STORE_A.x, STORE_A.real);

export const ch23: ChapterSpec = {
  id: 23,
  part: 2,
  title: "Backpropagation: sharing the blame",
  core: true,
  hook: "With billions of knobs, when the answer is wrong, which knobs do you fix, and by how much?",
  steps: [
    { id: "s1", sec: 10.5, narration: "Chapter 19's network guessed 3.5 for Truck A; the real rating is 4.5, so the loss is 1. Which of the 11 knobs is to blame?" },
    { id: "s2", sec: 9, narration: "You could nudge each knob a little, as in chapter 21. But GPT-3 has 175 billion knobs, so that would never end." },
    { id: "s3", sec: 10, narration: "So we hand out blame backward from the end. Raise the rating by 0.01 and the loss drops by 0.02: the rating's blame is −2." },
    { id: "s4", sec: 9.5, narration: "The rating was made from popular × 1.5, so popular's blame is −2 × 1.5 = −3. Blame flows backward along the lines." },
    { id: "s5", sec: 10.5, narration: "The line weight is multiplied by line 2 to make popular, so its blame is −3 × 2 = −6. The multiplications link up like a chain." },
    { id: "s6", sec: 9.5, narration: "The \"too spicy\" neuron was off. An off neuron can't change the result, so its blame is 0. Those knobs stay as they are." },
    { id: "s7", sec: 8, narration: "One sweep backward gives every knob's blame at once. This is backpropagation." },
    { id: "s8", sec: 10, narration: "Nudge each knob against its blame: the guess becomes 4.2 and the loss falls from 1 to 0.09. This caught on in 1986 (chapter 3)." },
  ],
  playgroundTitle: "The blame tracker",
  playgroundIntro: "Pick a knob. You'll see how its blame is multiplied backward from the output. Use \"Fix one step\" to bring the loss down.",
  summary: [
    "Backpropagation: start at the loss and go backward, multiplying blame along the lines.",
    "A knob's blame = how much the loss changes if you nudge it. Behind an off neuron, it's 0.",
    "One backward sweep gives every knob's blame; then nudge each a little the other way.",
  ],
  unlocks: "Backpropagation",
  unlockLabel: "You got a new learning tool",
  quiz: [
    {
      q: "The rating's blame is −2 and rating = popular × 1.5. What is popular's blame?",
      choices: ["−3", "−0.5", "3.5"],
      answer: 0,
      explain: "Nudge popular up and the rating rises 1.5 times as much, so the blame is −2 × 1.5 = −3.",
      review: "s4",
    },
    {
      q: "What is the blame of the weights going into a neuron that ReLU switched off to 0?",
      choices: ["The biggest", "Negative", "0"],
      answer: 2,
      explain: "An off neuron stays 0 even if its input changes a little, so the result doesn't change. Its blame is 0.",
      review: "s6",
    },
    {
      q: "Why is backpropagation so necessary?",
      choices: ["To calculate the loss", "To get every knob's blame quickly, in one go", "To get more input data"],
      answer: 1,
      explain: "Nudging knobs one by one would take 175 billion calculations. Backpropagation gets them all in one backward sweep.",
      review: "s2",
    },
  ],
  labels: {
    tag: "23. Backpropagation: sharing the blame",
    title: "Whose fault?",
    example: "ch. 19 network · Truck A · illustrative example",
    spicy: "Spicy",
    line: "Line",
    price: "Price",
    h1: "popular",
    h2: "too spicy",
    out: "rating",
    loss: "loss",
    knobs: "11 knobs",
    knobsSub: "8 weights + 3 biases",
    target: "answer 4.5",
    gpt: "GPT-3: 175 billion",
    oneByOne: "one at a time? Endless",
    backward: "Share the blame backward",
    blame: "blame",
    nudge: "rating +0.01 → loss −0.02",
    chainTitle: "The line weight's blame",
    chain: "−2 × 1.5 × 2 = −6",
    off: "off → blame 0",
    bp: "Backpropagation",
    all: "All the blame at once!",
    update: "new knob = knob − 0.005 × blame",
    before: "guess 3.5 · loss 1",
    after: "guess 4.2 · loss 0.09",
    year: "1986: backpropagation catches on (ch. 3)",
    big: "(thicker = more blame)",
  },
};
