import type { ChapterSpec, Highlighter } from "../../../data/types";

export type FewShotTask = {
  key: string;
  name: string;
  query: string;
  /** candidates: [the rule's answer, the odd example's answer, two plain continuations] */
  cands: string[];
  base: number[];
  examples: string[];
  odd: string;
};

// Illustrative: a made-up scoring rule, not a real model. Every matching example adds RULE_BOOST to the
// rule's answer; the odd example (from another pattern) adds ODD_BOOST to its own answer.
export const RULE_BOOST = 1.2;
export const ODD_BOOST = 2.0;

export const TASKS: FewShotTask[] = [
  {
    key: "opp",
    name: "Opposites",
    query: "fast →",
    cands: ["slow", "rápido", "food", "lane"],
    base: [0.6, 0, 1.6, 1.2],
    examples: ["big → small", "high → low", "light → dark"],
    odd: "apple → manzana",
  },
  {
    key: "eng",
    name: "In Spanish",
    query: "dog →",
    cands: ["perro", "woof", "cute", "house"],
    base: [0.6, 0.2, 1.6, 1.1],
    examples: ["apple → manzana", "school → escuela", "book → libro"],
    odd: "cat → meow",
  },
  {
    key: "cap",
    name: "Capitals",
    query: "England →",
    cands: ["London", "English", "soccer", "travel"],
    base: [0.7, 0.3, 1.5, 1.2],
    examples: ["South Korea → Seoul", "Japan → Tokyo", "France → Paris"],
    odd: "Germany → German",
  },
];

export const softmax71 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** The model's guess after `k` matching examples (and the odd one, if included). */
export const guess = (task: FewShotTask, k: number, odd = false) =>
  softmax71(task.base.map((b, i) => b + (i === 0 ? RULE_BOOST * k : 0) + (i === 1 && odd ? ODD_BOOST : 0)));

export const CAND_COLORS: Highlighter[] = ["mint", "orange", "sky", "violet"];

/** s6: accuracy by number of examples, illustrative (the shape follows the GPT-3 paper: bigger models gain more). */
export const SHOTS = [0, 1, 2, 4, 8];
export const ACCURACY = [
  { name: "Small", c: "sky" as Highlighter, v: [5, 7, 8, 9, 10] },
  { name: "Medium", c: "mint" as Highlighter, v: [10, 22, 28, 33, 36] },
  { name: "Large", c: "pink" as Highlighter, v: [20, 45, 56, 64, 68] },
];

/** Part 7 recap chips (the unlocks of 63–71). */
export const PART7_TOOLS = ["Data cleaning", "Self-supervised learning", "Cross-entropy", "Pre-training", "Adam", "GPU parallelism", "GPT model sizes", "Scaling laws", "In-context learning"];

export const ch71: ChapterSpec = {
  id: 71,
  part: 7,
  title: "Learning from examples alone",
  core: false,
  hook: "Without changing a single number, can a model learn a new task?",
  steps: [
    { id: "s1", sec: 11, narration: "The 2020 paper introducing GPT-3 was called 'Language Models are Few-Shot Learners': show a few examples, and it does a new task." },
    { id: "s2", sec: 11, narration: "Give it just 'fast →' and it can't tell what you want. You wanted an opposite, but it may just keep writing, like 'fast food'." },
    { id: "s3", sec: 10, narration: "Let's add one example in front: 'big → small'. Now it starts to notice that an opposite comes after the arrow." },
    { id: "s4", sec: 9, narration: "With three examples, 'slow' is almost certain. Amazingly, not a single number inside the model has changed." },
    { id: "s5", sec: 10, narration: "This is in-context learning. Not fixing numbers like in chapter 66, but reading the rule from examples in the prompt." },
    { id: "s6", sec: 10, narration: "Plot accuracy against the number of examples, and it rises as examples are added. And the bigger the model, the more it gains." },
    { id: "s7", sec: 10, narration: "No examples is zero-shot, one is one-shot, several is few-shot. You'll use this trick again for prompts in chapter 85." },
    { id: "s8", sec: 11, narration: "Part 7 taught GPT with a textbook, next-piece guessing, less surprise, the training loop and sheer size. Next: learning to chat!" },
  ],
  playgroundTitle: "Add examples",
  playgroundIntro: "Tap the example cards to put them in the prompt or take them out. The model's numbers stay the same, yet its answer changes with the examples alone. Try an odd example too.",
  summary: [
    "Show examples in the prompt, and the model reads the rule on the spot and follows it = in-context learning.",
    "The model's numbers stay the same. 0 examples: zero-shot, 1: one-shot, several: few-shot.",
    "Part 7: the internet as a textbook → next-piece guessing → shrinking surprise → the training loop → the power of size.",
  ],
  unlocks: "In-context learning",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "In in-context learning, what changes?",
      choices: ["The numbers inside the model (parameters)", "The examples in the prompt", "The tokenizer"],
      answer: 1,
      explain: "Not a single number is changed. Only the examples in the prompt change, and the model reads the rule from them.",
      review: "s5",
    },
    {
      q: "Giving two examples, as in 'big → small, high → low, fast →', is called what?",
      choices: ["Few-shot", "Zero-shot", "Pre-training"],
      answer: 0,
      explain: "Several examples is few-shot, one is one-shot, and none is zero-shot.",
      review: "s7",
    },
    {
      q: "As examples are added, which gains the most accuracy? (illustrative graph)",
      choices: ["The small model", "They all gain the same", "The large model"],
      answer: 2,
      explain: "In the GPT-3 paper too, bigger models made better use of the examples in the prompt.",
      review: "s6",
    },
  ],
  labels: {
    tag: "71. Learning from examples alone",
    paperEn: "Language Models are Few-Shot Learners",
    paperKo: "Few-shot: from just a few examples",
    paperMeta: "2020 · the GPT-3 paper",
    fewMeaning: "A few examples → a new task",
    prompt: "Prompt",
    guess: "The model's next piece",
    example: "illustrative example",
    wanted: "You wanted an opposite…",
    notice: "Starting to catch on!",
    sure: "Almost certain!",
    frozen: "Numbers stay put",
    train: "Training (ch. 66)",
    trainDo: "Fixes the numbers",
    icl: "In-context learning",
    iclEn: "(learning from the prompt)",
    zeroEn: "",
    oneEn: "",
    fewEn: "",
    iclDo: "Numbers stay put; it reads the rule from examples",
    axisX: "Examples shown →",
    axisY: "↑ Accuracy",
    bigGain: "Bigger models gain more from examples",
    zero: "Zero-shot",
    one: "One-shot",
    few: "Few-shot",
    zeroN: "0 examples",
    oneN: "1 example",
    fewN: "A few examples",
    ch85: "Ch. 85: prompt tips",
    recap: "Tools from Part 7",
    next: "Next: Part 8, the birth of ChatGPT",
    nextQ: "Ch. 72: smart, but doesn't listen",
    q: "?",
  },
};
