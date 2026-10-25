import type { ChapterSpec } from "../../../data/types";

// The scene's word problem: the classic "bat and ball" puzzle (the English-speaking original of the Korean
// bread-and-milk version: same numbers, in dollars and cents; the fast answer is a trap).
export const PROBLEM = ["A bat and a ball cost $1.10 together.", "The bat costs $1.00 more than the ball.", "How much does the ball cost?"];
// First-piece candidates when the model must answer at once. Illustrative probabilities.
export const FAST = [
  { w: "10¢", p: 0.62, c: "pink" as const },
  { w: "5¢", p: 0.24, c: "mint" as const },
  { w: "$1.00", p: 0.09, c: "sky" as const },
];
export const FAST_CHECK = ["Ball 10¢ → bat $1.10", "10¢ + $1.10 = $1.20", "≠ $1.10"];
export const THINK = ["Say the ball costs x cents", "Then the bat costs x + 100", "x + (x + 100) = 110", "2x = 10, x = 5", "Check: 5 + 105 = 110"];

export type Problem = {
  key: string;
  title: string;
  q: string;
  choices: string[];
  fast: string;
  fastCheck: string;
  steps: string[];
  answer: string;
};

/** Playground problems: each has a tempting fast answer and a short worked solution. */
export const PROBLEMS: Problem[] = [
  {
    key: "bread",
    title: "Bat and ball",
    q: "A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?",
    choices: ["10¢", "5¢", "$1.00"],
    fast: "10¢",
    fastCheck: "Check: ball 10¢ + bat $1.10 = $1.20 ✗",
    steps: ["Say the ball costs x cents. Then the bat costs x + 100 cents.", "Together: x + (x + 100) = 110.", "2x + 100 = 110, so 2x = 10.", "x = 5. The ball costs 5¢.", "Check: ball 5¢ + bat $1.05 = $1.10 ✓"],
    answer: "5¢",
  },
  {
    key: "machine",
    title: "Toy machines",
    q: "5 machines make 5 toys in 5 minutes. How many minutes would it take 100 machines to make 100 toys?",
    choices: ["100 minutes", "5 minutes", "20 minutes"],
    fast: "100 minutes",
    fastCheck: "Check: in 100 minutes, 100 machines would make 2,000 toys ✗",
    steps: ["5 machines make 5 toys in 5 minutes → 1 machine makes 1 toy in 5 minutes.", "100 machines working at once make 100 toys in 5 minutes.", "So: 5 minutes.", "Check: 100 machines × (1 toy per 5 minutes) = 100 toys in 5 minutes ✓"],
    answer: "5 minutes",
  },
  {
    key: "lotus",
    title: "Lily pads on a lake",
    q: "A patch of lily pads doubles every day. On day 48 it covers the whole lake. On which day did it cover half the lake?",
    choices: ["Day 24", "Day 47", "Day 46"],
    fast: "Day 24",
    fastCheck: "Check: if half were covered on day 24, the whole lake would be covered the very next day (day 25) ✗",
    steps: ["The lily pads double every day.", "So one day before the lake was covered, exactly half was covered.", "The lake was covered on day 48, so half was covered the day before: day 47.", "Check: half on day 47 × 2 = the whole lake on day 48 ✓"],
    answer: "Day 47",
  },
];

export const ch87: ChapterSpec = {
  id: 87,
  part: 10,
  title: "Think, then answer",
  core: true,
  hook: "When you give an AI a hard problem, it shows 'Thinking…'. What is it doing all that time?",
  steps: [
    { id: "s1", sec: 8, narration: "Try this: a bat and a ball cost $1.10, and the bat costs $1.00 more than the ball. What does the ball cost? 10¢ jumps to mind." },
    { id: "s2", sec: 8, narration: "Give this to the model with 'Answer only!'. It has to answer in the very first piece, so the plausible '10¢' gets picked easily." },
    { id: "s3", sec: 9, narration: "Let's check. If the ball is 10¢, the bat is $1.10, and together $1.20. Wrong! Each piece gets only one run of the model (chapter 2)." },
    { id: "s4", sec: 8, narration: "Now start with 'Think step by step.' If the ball is x cents, the bat is x + 100, so x + (x + 100) = 110." },
    { id: "s5", sec: 9, narration: "Then 2x = 10, so x = 5. The ball costs 5¢! Rereading each line it wrote, it split the hard math into small steps." },
    { id: "s6", sec: 8, narration: "Having it write the working first is called chain of thought. A 2022 study found it helped bigger models more." },
    { id: "s7", sec: 9, narration: "Reasoning models are trained for this. One known way: reward long working that ends in the right answer (chapter 76)." },
    { id: "s8", sec: 8, narration: "But writing many pieces takes longer, and the working itself can be wrong. Check important answers yourself." },
  ],
  playgroundTitle: "Answer at once vs work it out",
  playgroundIntro: "Pick a problem and choose your own answer first. Then compare the model answering at once with the model working it out line by line.",
  summary: [
    "Answering at once means picking the answer in the first piece, so a plausible wrong answer comes out easily.",
    "Writing the working first lets the model reread its lines and split the math into steps (chain of thought).",
    "Reasoning models are trained to think at length before answering. But they're slower, and the working needs checking too.",
  ],
  unlocks: "Working it out",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "Why is 'Answer only!' easy to get wrong?",
      choices: ["The model gets it wrong on purpose", "Answering in the first piece leaves no chance to split the math into steps", "The problem is too long"],
      answer: 1,
      explain: "Each piece gets only one run of the model's math (chapter 2). Writing the working spreads the math over many runs.",
      review: "s3",
    },
    {
      q: "What is chain of thought?",
      choices: ["Having the model write out its working before answering", "Drawing several answers and picking one", "Making the question shorter"],
      answer: 0,
      explain: "It writes the working one line at a time, rereading what it wrote to continue with the next line.",
      review: "s6",
    },
    {
      q: "Which is a downside of working it out first?",
      choices: ["The answer is always wrong", "The answer gets too short", "It uses many pieces, so it takes longer, and the working can be wrong too"],
      answer: 2,
      explain: "The model runs once per piece (chapter 2). The working is text continued by probability too, so it needs checking.",
      review: "s8",
    },
  ],
  labels: {
    tag: "87. Think, then answer",
    problem: "Problem",
    first: "The first answer that comes to mind?",
    guess: "10¢?",
    askFast: "Answer only!",
    model: "Model",
    firstPiece: "Answer at piece 1",
    example: "* illustrative example",
    out: "Answer: 10¢",
    check: "Check",
    wrong: "Wrong!",
    once: "1 piece = 1 run of the model (ch. 2)",
    onceMore: "There's only so much math in one run",
    askSlow: "Think step by step.",
    think: "Working (thinking)",
    reread: "rereading what it wrote",
    answer: "Answer: 5¢",
    qBox: "Q",
    aBox: "A",
    stepBox: "Step",
    rowFast: "Answer at once",
    rowCot: "Work it out first",
    cot: "Chain of thought",
    cotNote: "2022 study: the bigger the model, the bigger the effect",
    reasoning: "Reasoning models",
    since: "since around 2024",
    thinking: "Thinking…",
    trained: "Trained to think long before answering",
    trainA: "Problems with checkable answers",
    trainB: "Right working gets a higher score (ch. 76)",
    known: "one of the known methods",
    fastSide: "Fast but often wrong",
    slowSide: "Slow but strong",
    pieces: "Number of pieces = number of model runs (ch. 2)",
    verify: "The working can be wrong too. Check!",
  },
};
