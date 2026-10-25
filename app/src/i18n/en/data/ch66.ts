import type { ChapterSpec, Highlighter } from "../../../data/types";

export const CANDS: { w: string; c: Highlighter }[] = [
  { w: "school", c: "yellow" },
  { w: "the", c: "mint" },
  { w: "work", c: "sky" },
  { w: "other", c: "violet" },
];

/** A mini model whose only numbers are the four scores (illustrative). It starts out wrong:
 *  ch01's probabilities with school and work swapped. Scores are ln(p) + 3 (shifting all scores changes nothing, ch. 14). */
export const START_P = [0.12, 0.21, 0.52, 0.15];
export const START_Z = START_P.map((p) => Math.log(p) + 3);
export const LR = 1;

export const softmax66 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** Surprise in halvings, as in ch. 65. */
export const surprise66 = (p: number) => Math.log2(1 / p);

/** Blame of each score: probability minus 1 for the right answer, minus 0 for the rest. */
export const blameOf = (p: number[], target: number) => p.map((v, i) => v - (i === target ? 1 : 0));

export type Lap = { z: number[]; p: number[]; loss: number; blame: number[] };

/** Run the loop: lap k holds the scores before its update. */
export function runLaps(z0: number[], target: number, n: number, lr = LR): Lap[] {
  const laps: Lap[] = [];
  let z = [...z0];
  for (let k = 0; k < n; k++) {
    const p = softmax66(z);
    const blame = blameOf(p, target);
    laps.push({ z, p, loss: surprise66(p[target]), blame });
    z = z.map((v, i) => v - lr * blame[i]);
  }
  return laps;
}

export const LAPS = runLaps(START_Z, 0, 4);

export const STATIONS = [
  { n: "① Predict", ref: "ch. 19", c: "yellow" as Highlighter },
  { n: "② Loss", ref: "ch. 20 · 65", c: "pink" as Highlighter },
  { n: "③ Backprop", ref: "ch. 23", c: "violet" as Highlighter },
  { n: "④ Update", ref: "ch. 21 · 22", c: "mint" as Highlighter },
];

export const ch66: ChapterSpec = {
  id: 66,
  part: 7,
  title: "One lap of the training loop",
  core: true,
  hook: "In what order does GPT study hundreds of billions of questions?",
  steps: [
    { id: "s1", sec: 9, narration: "Let's join the pieces we've learned into one. GPT studies by going around a four-step loop countless times." },
    { id: "s2", sec: 11, narration: "① Predict: feed in 'I walk to' and get probabilities for the next piece (chapter 19). At first, school gets just 12%." },
    { id: "s3", sec: 10, narration: "② Loss: measure the surprise from the probability on the answer, school (chapter 65). Only 12%, so it's a big 3.06." },
    { id: "s4", sec: 11, narration: "③ Backpropagation: send the loss backward and share out the blame (chapter 23). School's score must go up, work's must go down." },
    { id: "s5", sec: 11, narration: "④ Update: nudge each number by its blame. The learning rate sets how big the nudge is (chapter 22). Here it's 1." },
    { id: "s6", sec: 10, narration: "Then back to ①. Lap after lap, school's probability rises to 32%, 55%, 69%, and the surprise keeps falling." },
    { id: "s7", sec: 11, narration: "Real GPT batches questions (chapter 24) and runs this loop over and over, nudging 175 billion numbers. That's pre-training." },
  ],
  playgroundTitle: "Turn the training loop",
  playgroundIntro: "Press ① → ② → ③ → ④ in order to train the mini model one lap at a time. Your goal: get the surprise below 0.5.",
  summary: [
    "① Predict (forward pass) → ② Loss (surprise) → ③ Backpropagation (share the blame) → ④ Update (fix the numbers).",
    "Each lap, the probability of the answer goes up and the loss goes down.",
    "Running this loop a huge number of times to fix 175 billion numbers = pre-training.",
  ],
  unlocks: "Pre-training",
  quiz: [
    {
      q: "What's the right order of the training loop?",
      choices: ["Loss → predict → update → backpropagation", "Predict → loss → backpropagation → update", "Update → predict → backpropagation → loss"],
      answer: 1,
      explain: "First make a guess (predict), measure how wrong it is (loss), share out the blame (backpropagation), then fix the numbers (update).",
      review: "s1",
    },
    {
      q: "What happens in the backpropagation step?",
      choices: ["It gives the next piece's probabilities", "It makes new questions", "It shares out the blame for the loss among the numbers"],
      answer: 2,
      explain: "Sending the loss backward, it works out how much, and in which direction, each number is to blame (ch. 23).",
      review: "s4",
    },
    {
      q: "After one lap of the loop, what usually happens?",
      choices: ["The answer's probability goes up and the loss goes down", "Both the probability and the loss go up", "Nothing changes"],
      answer: 0,
      explain: "The update raises the right answer's score, so the same question is less surprising the next time.",
      review: "s6",
    },
  ],
  labels: {
    tag: "66. One lap of the training loop",
    lap: "One lap",
    repeat: "Over and over!",
    again: "back to ①",
    gpt: "GPT",
    ctx1: "I",
    ctx2: "walk",
    ctx3: "to",
    example: "illustrative example",
    mess: "A mess at first: school gets only 12%",
    lateFirst: "'work' comes first?!",
    lossIs: "Surprise = loss",
    lossNote: "Only 12% on the answer → surprise 3.06",
    colW: "Word",
    colZ: "Score",
    colB: "Blame",
    colNew: "New score",
    up: "↑ raise",
    down: "↓ lower",
    blameRule: "Blame = probability − (1 if it's the answer, else 0)",
    backward: "Sent backward",
    real: "In real GPT, blame flows to all 175 billion numbers",
    update: "New score = score − learning rate × blame",
    lr: "Learning rate 1",
    mini: "Mini model: only 4 scores (illustrative)",
    probGo: "Chance of 'school'",
    lossTitle: "Surprise (loss)",
    lap0: "Start",
    lap1: "Lap 1",
    lap2: "Lap 2",
    lap3: "Lap 3",
    many: "175 billion numbers",
    pretrain: "Pre-training",
    batch: "In big batches of questions (ch. 24)",
    loopAll: "Predict → loss → backprop → update, repeat!",
  },
};
