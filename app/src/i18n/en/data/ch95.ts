import type { ChapterSpec } from "../../../data/types";

// Real outputs of the offline English checkpoints (part11-checkpoints.ts), loaded and sampled with minigpt.ts.

/** "A " + what the proverb model wrote at temperature 0.3 (five samples, all the same; the tokens of its BPE tokenizer) */
export const PROMPT = "A";
export const LOW_LINE = ["good", " ", "beginning", " ", "makes", " ", "a", " ", "great", " ", "fire"];

/** next-token probabilities (%) after "A " at three temperatures */
export const NEXT_AT: Record<string, { w: string; p: number }[]> = {
  "1": [
    { w: "good", p: 21.7 },
    { w: "small", p: 12.3 },
    { w: "penny", p: 10.3 },
    { w: "cat", p: 10.0 },
  ],
  "0.3": [
    { w: "good", p: 71.3 },
    { w: "small", p: 10.7 },
    { w: "penny", p: 6.0 },
    { w: "cat", p: 5.4 },
  ],
  "1.6": [
    { w: "good", p: 12.1 },
    { w: "small", p: 8.5 },
    { w: "penny", p: 7.6 },
    { w: "cat", p: 7.5 },
  ],
};

/** where each candidate comes from in the data */
export const SOURCES = ["A good beginning …", "A small spark …", "A penny saved …"];

/** the two proverbs the low-temperature line was stitched from */
export const STITCH = [
  { line: "A good beginning makes a good ending", keep: "A good beginning makes a" },
  { line: "A small spark makes a great fire", keep: "great fire" },
];

/** three of five lines at temperature 1.6 (the other two: one copied line, one more mix) */
export const HIGH_LINES = ["A can't ched easucceed, try again", "A penny saved isdeep", "A apple never fallsss Romen"];

/** the textbook-sentence model, prompt "Bread is made " (the data has "Bread is made from flour." and "Cheese is made from milk.") */
export const WRONG = { before: "Bread is made from ", bad: "milk", after: ".", fix: "flour" };

export const ch95: ChapterSpec = {
  id: 95,
  part: 11,
  title: "Let's generate",
  core: false,
  hook: "What will the model I trained write?",
  steps: [
    { id: "s1", sec: 10.5, narration: "Now let's make the model write. Same as chapter 2: pick one next token, append it, and repeat until a line break comes out." },
    { id: "s2", sec: 11, narration: "After 'A' the odds are good 22%, small 12%, penny 10%, learned from 'A good beginning', 'A small spark' and 'A penny saved'." },
    { id: "s3", sec: 10.5, narration: "Lower the temperature (chapter 81) and first place grows. At 0.3, 'good' is 71%, and five tries give the same sentence." },
    { id: "s4", sec: 10, narration: "But 'A good beginning makes a great fire' isn't in the data. It stitched two proverbs into one plausible new line." },
    { id: "s5", sec: 9, narration: "Raise the temperature and low bars get picked more. At 1.6 every line is different, and some are nonsense." },
    { id: "s6", sec: 11, narration: "The textbook model wrote 'Bread is made from milk.' It sounds right, but it's false: a hallucination (chapter 84)." },
    { id: "s7", sec: 10, narration: "It's tiny, but it writes exactly the way ChatGPT does. In Try it, change the start text and the temperature and let it write." },
  ],
  playgroundTitle: "Writing with my model",
  playgroundIntro: "Type a start, set the temperature and press 'Write a line'. If you trained a model in chapter 94 it writes; otherwise a ready-made model does.",
  summary: [
    "Generating = give the odds → pick one → append it. Stop at a line break.",
    "Low temperature: steady, often memorized lines. High: varied, but nonsense too.",
    "A plausible mix that isn't true is a hallucination, even in a tiny model.",
  ],
  unlocks: "A line my model wrote",
  unlockLabel: "You finished a step of the graduation project",
  quiz: [
    {
      q: "What happens when you lower the temperature?",
      choices: ["Every candidate gets the same probability", "First place gets picked more often, so the answers become steady", "The model learns more"],
      answer: 1,
      explain: "A low temperature makes the distribution sharp. At 0.3, 'good' went from 22% to 71% (chapter 81).",
      review: "s3",
    },
    {
      q: "Why did 'A good beginning makes a great fire' come out?",
      choices: ["It's in the data as is", "Someone added it later", "It stitched pieces of two proverbs together"],
      answer: 2,
      explain: "'A good beginning makes a' and 'great fire' come from different proverbs. The model just kept adding plausible next pieces.",
      review: "s4",
    },
    {
      q: "What do you call a sentence like 'Bread is made from milk.'?",
      choices: ["A hallucination", "A prompt", "A token"],
      answer: 0,
      explain: "It sounds like a textbook, but the fact is wrong. Sounding plausible and being true are different things (chapter 84).",
      review: "s6",
    },
  ],
  labels: {
    tag: "95. Let's generate",
    model: "Mini GPT",
    pick: "pick one, append it",
    runs: "Model runs",
    stop: "Stop at a line break",
    t1: "Temp 1",
    t03: "Temp 0.3",
    t16: "Temp 1.6",
    learned: "Learned from the data",
    same: "Same, 5 times!",
    notInData: "Not in the data!",
    stitched: "Two proverbs stitched together",
    plus: "+",
    varied: "Varied, some nonsense",
    textbook: "Textbook model",
    wrong: "Bread is made from flour!",
    halluc: "Hallucination (ch. 84)",
    sounds: "It sounds like a textbook",
    try: "Start text + temperature",
    same2: "Just like ChatGPT",
    real: "Real output of a mini GPT we trained",
  },
};
