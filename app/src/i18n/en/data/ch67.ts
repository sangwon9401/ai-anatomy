import type { ChapterSpec } from "../../../data/types";

// A made-up bumpy loss landscape (illustrative): a wide valley at x = 7 with a small dip near x = 2.7.
const A = 1.6;
const C = 2.6;
const SD = 0.4;
export const X_MIN = 0;
export const X_MAX = 10;
export const bumpy = (x: number) => 0.12 * (x - 7) ** 2 - A * Math.exp(-((x - C) ** 2) / (2 * SD * SD));
export const slope = (x: number) => 0.24 * (x - 7) + ((A * (x - C)) / (SD * SD)) * Math.exp(-((x - C) ** 2) / (2 * SD * SD));

/** Heavy-ball descent: v ← β·v − lr·slope, x ← x + v. β = 0 is plain gradient descent (ch. 21). */
export function roll(x0: number, beta: number, steps: number, lr = 0.05): number[] {
  const xs = [x0];
  let x = x0;
  let v = 0;
  for (let i = 0; i < steps; i++) {
    v = beta * v - lr * slope(x);
    x = Math.min(X_MAX, Math.max(X_MIN, x + v));
    xs.push(x);
  }
  return xs;
}

export const START_X = 0.4;
export const MOMENTUM = 0.85;
export const PLAIN_PATH = roll(START_X, 0, 160);
export const MOMENTUM_PATH = roll(START_X, MOMENTUM, 160);

// A long, narrow valley: knob A is gentle, knob B is steep (illustrative).
export const VA = 0.4;
export const VB = 18;
export const valley = (x: number, y: number) => 0.5 * (VA * x * x + VB * y * y);
const grad2 = ([x, y]: [number, number]): [number, number] => [VA * x, VB * y];
export const START_2D: [number, number] = [-3.6, 1.2];

/** Plain steps: every knob moves by learning rate × its slope. */
export function plain2D(steps: number, lr = 0.1): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  for (let i = 0; i < steps; i++) {
    const g = grad2(p);
    p = [p[0] - lr * g[0], p[1] - lr * g[1]];
    out.push(p);
  }
  return out;
}

/** Self-adjusting steps: each knob's step is divided by how big its slopes have been lately. */
export function adaptive2D(steps: number, lr = 0.3, decay = 0.9): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  let v: [number, number] = [0, 0];
  for (let t = 1; t <= steps; t++) {
    const g = grad2(p);
    v = [decay * v[0] + (1 - decay) * g[0] ** 2, decay * v[1] + (1 - decay) * g[1] ** 2];
    const corr = 1 - decay ** t;
    p = [p[0] - (lr * g[0]) / (Math.sqrt(v[0] / corr) + 1e-8), p[1] - (lr * g[1]) / (Math.sqrt(v[1] / corr) + 1e-8)];
    out.push(p);
  }
  return out;
}

export const STEPS_2D = 30;
export const PLAIN_2D = plain2D(STEPS_2D);
export const ADAPT_2D = adaptive2D(STEPS_2D);

export const ch67: ChapterSpec = {
  id: 67,
  part: 7,
  title: "A smarter way downhill",
  core: false,
  hook: "Why does a ball that only follows the slope get lost?",
  steps: [
    { id: "s1", sec: 9, narration: "In chapter 21, the ball rolled down by looking only at the slope under its feet. But a real loss landscape is bumpy like this." },
    { id: "s2", sec: 10, narration: "A ball that only follows the slope stops in a small dip. At the bottom of the dip the slope is 0, so there's nowhere to go." },
    { id: "s3", sec: 10, narration: "So we give it momentum. It remembers how it was rolling, and that push carries it over the little hill to the deeper valley." },
    { id: "s4", sec: 10, narration: "Problem two is step size. Each knob has its own slope: the steep one bounces back and forth, the gentle one crawls like a snail." },
    { id: "s5", sec: 10, narration: "So each knob gets its own step size. A knob that has been swinging wildly takes small steps; a sluggish one takes big strides." },
    { id: "s6", sec: 10, narration: "Momentum plus automatic step sizes is a method called Adam. It came out in 2014, and GPT is trained with Adam too." },
    { id: "s7", sec: 10, narration: "The real math is more complex, but these two ideas are the heart of it. Step ④ of chapter 66's loop just got smarter." },
  ],
  playgroundTitle: "Ball race",
  playgroundIntro: "Pick a starting point and how strong the momentum is, then roll. The blue ball uses only the slope; the pink ball also uses momentum. Get the pink ball into the deep valley.",
  summary: [
    "Following only the slope, the ball gets stuck in a small dip or zigzags on the steep side.",
    "Momentum: remembering how it was rolling carries the ball over small hills.",
    "Adam = momentum + an automatic step size for each knob. It's used to train GPT, too.",
  ],
  unlocks: "Adam optimizer",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "Why does a ball that only follows the slope stop in a small dip?",
      choices: ["The slope at the bottom of the dip is 0", "The ball is too heavy", "The loss has become 0"],
      answer: 0,
      explain: "With a slope of 0, there's no signal saying 'go this way'. It can't tell that a deeper spot is right next to it.",
      review: "s2",
    },
    {
      q: "What does giving the ball momentum improve?",
      choices: ["It no longer needs to compute the slope", "Its speed can carry it over small hills", "It always returns to the start"],
      answer: 1,
      explain: "It remembers the direction and speed it has been rolling, so it coasts through places where the slope is 0.",
      review: "s3",
    },
    {
      q: "How would you sum up Adam in one line?",
      choices: ["Ignore the slope and move anywhere", "Set the learning rate to 0", "Momentum + an automatic step size for each knob"],
      answer: 2,
      explain: "Adam combines momentum with a step size tuned separately for each knob (2014).",
      review: "s6",
    },
  ],
  labels: {
    tag: "67. A smarter way downhill",
    axisX: "Knob value →",
    axisY: "↑ Loss",
    review: "Ch. 21: downhill by the slope underfoot",
    start: "Start",
    plain: "Slope only",
    inertia: "Momentum",
    stuck: "Stuck here!",
    deeper: "A deeper valley",
    flat: "slope 0",
    memory: "Momentum = remembering how it rolled",
    over: "Over the hill!",
    example: "illustrative example",
    knobA: "Knob A (gentle)",
    knobB: "Knob B (steep)",
    knobAAxis: "Knob A (gentle) →",
    knobBAxis: "↑ Knob B (steep)",
    zigzag: "Zigzag!",
    slow: "Snail pace…",
    adaptive: "Auto step size",
    same: "The same 30 steps each",
    adamEq: "Adam = momentum + auto step size",
    year: "2014 · Kingma, Ba",
    gptUses: "GPT is trained with Adam too",
    smaller: "small",
    bigger: "big",
    update: "④ Update",
    smarter: "Step ④, the update, got smarter",
    simple: "The real math is more complex. Here's just the core!",
    loop1: "① Predict",
    loop2: "② Loss",
    loop3: "③ Backprop",
    adam: "Adam",
    goal: "Lowest spot",
  },
};
