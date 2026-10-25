import type { ChapterSpec } from "../../../data/types";

// Everything on screen is from the real offline English proverb run (part11-run.ts, CHECKPOINTS.proverb:
// BPE with 300 merges, seed 1, 1,500 steps).

/** one training window, shortened to its first 10 tokens: input row and the target row (next token). "\n" = line break */
export const WINDOW_IN = ["\n", "H", "al", "f", " ", "a", " ", "lo", "af", " "];
export const WINDOW_OUT = ["H", "al", "f", " ", "a", " ", "lo", "af", " ", "is"];

/** lines the model wrote during the run (temperature 0.8), with the corpus loss at that step */
export const DIARY = [
  { step: "Step 0", loss: "5.86", text: "owerwilleapsmallBgsilowh…" },
  { step: "Step 100", loss: "3.79", text: "a home the sp sp Slouom" },
  { step: "Step 500", loss: "2.33", text: "Every make the in hlight spow" },
  { step: "Step 1,000", loss: "1.10", text: "Laughter is the best pours" },
  { step: "Step 1,500", loss: "0.77", text: "April showers flock together" },
];

/** s7: one line copied from the data, one new (both written at step 1,500) */
export const COPIED = "Actions speak louder than words";
export const FRESH = "Empty vessels make the mother noise";

export const LOOP = [
  { name: "Predict", ch: "ch. 64" },
  { name: "Loss", ch: "ch. 65" },
  { name: "Backprop", ch: "ch. 23" },
  { name: "Turn knobs", ch: "ch. 21, 67" },
];

export const ch94: ChapterSpec = {
  id: 94,
  part: 11,
  title: "Training in the browser",
  core: true,
  hook: "How does a model really learn? Watch it happen inside your own phone.",
  steps: [
    { id: "s1", sec: 10, narration: "Time to train! At first, the mini GPT's 24,925 knobs are set at random, so it just spits out random pieces." },
    { id: "s2", sec: 10.5, narration: "One training step: take 8 chunks of 24 tokens from the data, and at every position, guess the next token (chapter 64)." },
    { id: "s3", sec: 10, narration: "Wrong guesses give a loss (chapter 65). It starts near 5.86, the surprise of guessing at random among 349 kinds." },
    { id: "s4", sec: 10, narration: "Backpropagation works out each knob's share of the blame (chapter 23), then nudges it to lower the loss. That's one step." },
    { id: "s5", sec: 10.5, narration: "Go round 1,500 times and the loss keeps falling: below 2 at step 650, below 1 at step 1,100." },
    { id: "s6", sec: 10.5, narration: "Its writing changes too: nonsense at step 100, real words by step 500, proverb-like lines by step 1,500." },
    { id: "s7", sec: 10.5, narration: "But train long enough and it memorizes the data. Of 80 lines from the step-1,500 model, 27 were copied word for word (chapter 25)." },
    { id: "s8", sec: 9, narration: "Now press the train button in Try it. No server: the real math runs right inside your phone." },
  ],
  playgroundTitle: "Train it on my phone",
  playgroundIntro: "Press 'Start training' and a real mini GPT trains inside this phone. Watch the loss graph and the writing diary. You can pause and continue any time.",
  summary: [
    "One step = guess the next token in 8 chunks → loss → backpropagation → turn the knobs.",
    "The loss falls from 5.86 (random guessing) to about 0.77 after 1,500 steps.",
    "Train long and it starts memorizing. Tell new lines apart from memorized ones.",
  ],
  unlocks: "A mini GPT I trained",
  unlockLabel: "You finished a step of the graduation project",
  quiz: [
    {
      q: "In what order do things happen in one training step?",
      choices: ["Turn the knobs → predict → loss → backpropagation", "Backpropagation → predict → turn the knobs → loss", "Predict → loss → backpropagation → turn the knobs"],
      answer: 2,
      explain: "First guess (predict), measure how wrong (loss), share out the blame (backpropagation), then turn the knobs (chapter 66).",
      review: "s4",
    },
    {
      q: "Why is the loss about 5.86 when training starts?",
      choices: ["It's like guessing at random among 349 kinds", "The model already knows a few proverbs", "The data is 5.86 KB"],
      answer: 0,
      explain: "At first every token gets about the same probability. Guessing one of 349 kinds has a surprise of about 5.86.",
      review: "s3",
    },
    {
      q: "What happens if you train until the loss is very low?",
      choices: ["The model breaks", "More of its lines are copied from the data", "The kinds of tokens shrink"],
      answer: 1,
      explain: "Look at small data for long enough and it gets memorized, like a student who only memorized past tests (chapter 25).",
      review: "s7",
    },
  ],
  labels: {
    tag: "94. Training in the browser",
    model: "Mini GPT",
    knobs: "24,925 knobs",
    random: "Random at first",
    first: "The first thing it wrote",
    input: "Input",
    target: "Next",
    newline: "line break",
    space: "space",
    window: "24 tokens × 8 chunks",
    eachNext: "Guess the next token at every spot",
    loss: "loss",
    lossStart: "5.86",
    guess: "random guess among 349",
    flat: "Every token equally 1/349",
    oneStep: "One step",
    axisSteps: "steps",
    below2: "Step 650: < 2",
    below1: "Step 1,100: < 1",
    end: "Step 1,500: 0.77",
    diary: "Writing diary",
    copied: "Memorized",
    inData: "In the data word for word",
    fresh: "New line",
    notInData: "Not in the data",
    stat: "27 of 80 lines were memorized",
    exam: "Like memorizing past tests (ch. 25)",
    start: "Start training",
    noServer: "No server, right in your phone!",
    realRun: "Real training record",
  },
};
