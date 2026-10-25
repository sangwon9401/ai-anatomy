import type { ChapterSpec } from "../../../data/types";

export type Ingredient = "Role" | "Examples" | "Step by step" | "Format";
export const INGREDIENTS: Ingredient[] = ["Role", "Examples", "Step by step", "Format"];

const ROLE = "You're a science teacher for young kids.";
const APPLES = "There are 8 boxes of 12 apples, and 6 apples are bad. Six people share the rest equally. How many does each get?";
const SORT = "Sort apple, pear, cucumber and carrot into fruits and vegetables.";

// Scene comparisons: the same request with and without one ingredient. Answers are illustrative examples.
export type Compare = { ing: Ingredient; plain: string; plainAnswer: string; add: string; before?: boolean; goodAnswer: string; bad?: boolean };
export const COMPARES: Compare[] = [
  {
    ing: "Role",
    plain: "What is photosynthesis?",
    plainAnswer: "Photosynthesis is the process in which chloroplasts use light energy to turn carbon dioxide and water into glucose.",
    add: ROLE,
    before: true,
    goodAnswer: "It's how plants cook with sunlight! They mix water and air to make their own food.",
  },
  {
    ing: "Examples",
    plain: "salmon →",
    plainAnswer: "Salmon is an ocean fish with pink flesh. People often grill or bake it.",
    add: "apple → fruit / carrot → vegetable /",
    before: true,
    goodAnswer: "fish",
  },
  {
    ing: "Step by step",
    plain: APPLES,
    plainAnswer: "16 apples.",
    add: "Solve it step by step.",
    goodAnswer: "12 × 8 = 96 → 96 − 6 = 90 → 90 ÷ 6 = 15. Each person gets 15.",
    bad: true,
  },
  {
    ing: "Format",
    plain: SORT,
    plainAnswer: "Apples and pears are sweet fruits. Cucumbers and carrots are vegetables, but…",
    add: "Write just two lines: 'Fruits: / Vegetables:'.",
    goodAnswer: "Fruits: apple, pear / Vegetables: cucumber, carrot",
  },
];

// s1: first-chunk probabilities for "What is photosynthesis?" without / with the role line (illustrative)
export const S1_BARS = [
  { w: "The", a: 0.62, b: 0.18, c: "yellow" as const },
  { w: "Plants", a: 0.21, b: 0.57, c: "mint" as const },
  { w: "Light", a: 0.09, b: 0.12, c: "sky" as const },
];

// Part 9 toolbox for the wrap-up
export const TOOLS9 = ["Greedy · Sampling", "Temperature", "Top-k · Top-p", "Context window", "KV cache", "Hallucinations", "Prompts"];

// playground: four prescriptions
export type Case = { goal: string; prompt: string; bad: string; right: Ingredient; add: string; good: string; why: string };
export const CASES: Case[] = [
  {
    goal: "So a little kid can understand",
    prompt: "What is photosynthesis?",
    bad: "Photosynthesis is the process in which chloroplasts use light energy to turn carbon dioxide and water into glucose.",
    right: "Role",
    add: ROLE,
    good: "It's how plants cook with sunlight! They mix the water they drink through their roots with air to make their own food.",
    why: "With a role up front, the most likely continuation is text such a teacher would write. The next-piece odds tilt toward easy words (chapter 1).",
  },
  {
    goal: "With no math mistakes",
    prompt: APPLES,
    bad: "16 apples.",
    right: "Step by step",
    add: "Solve it step by step.",
    good: "① 12 × 8 = 96  ② 96 − 6 = 90  ③ 90 ÷ 6 = 15. Each person gets 15.",
    why: "The steps it writes become input again (chapter 2). Getting one step right at a time is much easier than getting the whole answer at once. More in chapter 87.",
  },
  {
    goal: "In a fixed shape",
    prompt: SORT,
    bad: "Apples and pears are sweet fruits, while cucumbers and carrots count as vegetables. By the way, cucumbers…",
    right: "Format",
    add: "Write just two lines: 'Fruits: ○○ / Vegetables: ○○'.",
    good: "Fruits: apple, pear\nVegetables: cucumber, carrot",
    why: "Give it a template, and the pieces that fit it become the most likely. After 'Fruits:', it's a fruit's turn.",
  },
  {
    goal: "Following my own rule",
    prompt: "bright",
    bad: "'Bright' means full of light. Example: The room is bright.",
    right: "Examples",
    add: "big → small\nfast → slow\nbright →",
    good: "dark",
    why: "Show examples, and the model finds the pattern and continues it. That's the in-context learning of chapter 71. You don't have to explain the rule in words.",
  },
];
export const WHAT_IT_DOES: Record<Ingredient, string> = {
  Role: "A role changes the tone and the level.",
  Examples: "Examples show a pattern to copy.",
  "Step by step": "Step by step makes it write out the steps in between.",
  Format: "A format sets the shape of the answer (lines, template).",
};

export const ch85: ChapterSpec = {
  id: 85,
  part: 9,
  title: "Prompts make sense once you know the structure",
  core: false,
  hook: "Why does the answer change with how you ask, even when you ask for the same thing?",
  steps: [
    { id: "s1", sec: 9, narration: "A prompt is the start of a text the model continues (chapter 1). Change it, and the next-piece odds change. So how you ask matters." },
    { id: "s2", sec: 8, narration: "First, a role. Write 'a teacher for young kids' up front, and the easy words such a teacher would use become likely." },
    { id: "s3", sec: 8, narration: "Second, examples. Show 'apple → fruit, carrot → vegetable' and the model continues the pattern: in-context learning (chapter 71)." },
    { id: "s4", sec: 8, narration: "Third, step by step. When it writes out the steps, they become input again (chapter 2), making the answer easier to get right." },
    { id: "s5", sec: 8, narration: "Fourth, format. Give a template like 'Fruits: / Vegetables:' and words that fit it become most likely, shaping the answer." },
    { id: "s6", sec: 8, narration: "None of these are magic spells. They just change the start to change the next-piece odds. Put in the information it needs, too." },
    { id: "s7", sec: 9, narration: "That's Part 9! Choosing, temperature, cutting, the memory window, hallucinations and prompts. Next, we meet the AI after ChatGPT." },
  ],
  playgroundTitle: "Prompt prescriptions",
  playgroundIntro: "Here are four cases where the AI's answer falls short. Pick the right ingredient (role, examples, step by step, format) to fix each prompt.",
  summary: [
    "Prompt = the start of a text the model continues. Change the start, and the next-piece odds change.",
    "A role sets the tone and level, examples set a pattern, and a format sets the shape of the answer.",
    "Step by step: the steps it writes become input again, so the answer is easier to get right.",
  ],
  unlocks: "How prompts work",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "Why does adding 'You're a teacher for young kids' make the answer easier?",
      choices: ["Easy words that would follow such a text become more likely", "The model studies a grade-school textbook on the spot", "The model hides what it knows on purpose"],
      answer: 0,
      explain: "The model doesn't learn anything new. The start changed, so the next-piece probabilities changed.",
      review: "s2",
    },
    {
      q: "After 'big → small, fast → slow, bright →' the model writes 'dark'. What made that happen?",
      choices: ["Raising the temperature", "A full context window", "In-context learning: the examples showed a pattern"],
      answer: 2,
      explain: "Just showing examples is enough for the model to continue the pattern (chapter 71).",
      review: "s3",
    },
    {
      q: "Why does 'Solve it step by step' help with math problems?",
      choices: ["The model secretly uses a calculator", "The steps it writes become input again, so the next pieces are easier to get right", "The answer gets shorter"],
      answer: 1,
      explain: "Thanks to autoregression (chapter 2), it can look at the steps it already wrote while working out the next one.",
      review: "s4",
    },
  ],
  labels: {
    tag: "85. Prompts make sense once you know the structure",
    prompt: "Prompt",
    model: "Model",
    is: "Prompt = the start of the model's text",
    next: "Next-piece odds",
    example: "illustrative example",
    first: "First",
    second: "Second",
    third: "Third",
    fourth: "Fourth",
    plain: "Just asking",
    withIt: "With the ingredient",
    roleNote: "Words such a person would use become likely",
    exampleNote: "It sees the pattern and continues it (ch. 71)",
    stepNote: "The written steps become input again (ch. 2)",
    formatNote: "Words that fit the template become likely",
    markO: "○",
    markX: "×",
    change: "The start changes",
    then: "The next-piece odds change",
    notMagic: "Not a magic spell! Just a good start",
    info: "Put in the information it needs (ch. 83·84)",
    done: "Part 9 toolbox complete!",
    nextPart: "Next: Part 10, The world after ChatGPT",
    nextCh: "86. AI with eyes",
    ai: "AI",
    w1: "The",
    w2: "Plants",
    w3: "Light",
    roleAdd: ROLE,
  },
};
