import type { ChapterSpec } from "../../../data/types";

export const MA = [
  [1, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 2, 1],
  [3, 1, 0, 2],
];
export const MB = [
  [2, 0, 1, 1],
  [1, 3, 0, 2],
  [0, 1, 2, 0],
  [1, 2, 1, 3],
];
export const matmul = (a: number[][], b: number[][]) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
export const MC = matmul(MA, MB);

/** The cell picked out in the scene: row 2, column 3 (0-based 1, 2). */
export const PICK = { i: 1, j: 2 };
export const pickTerms = () => MA[PICK.i].map((a, k) => `${a}×${MB[k][PICK.j]}`).join(" + ");

/** GPT-3's attention matrices are d_model × d_model = 12,288 × 12,288 (canonical d_model). */
export const D_MODEL = 12288;
export const GPT3_CELLS = D_MODEL * D_MODEL;

// illustrative speeds for the race
export const CALC_RATE = 20; // one fast calculator: 20 cells per second
export const STUDENT_RATE = 1; // one student: 1 cell per second
export const STUDENTS = 10000;
export const calcTime = (cells: number) => cells / CALC_RATE;
export const studentTime = (cells: number, students = STUDENTS) => Math.ceil(cells / students) / STUDENT_RATE;
export const RACE_CELLS = 10000;

export const ch68: ChapterSpec = {
  id: 68,
  part: 7,
  title: "Why GPUs?",
  core: false,
  hook: "Why do AI companies buy piles of 'graphics cards' instead of regular computers?",
  steps: [
    { id: "s1", sec: 10, narration: "GPT's math is mostly matrix multiplication (chapter 11). A single GPT-3 layer has several 12,288 × 12,288 matrices." },
    { id: "s2", sec: 10, narration: "Let's multiply two small 4 × 4 matrices. The result has 16 cells; each is one row times one column, added up (chapter 9)." },
    { id: "s3", sec: 10, narration: "Think of a CPU as one very fast calculator. It fills the cells one at a time, so 16 cells means waiting 16 turns." },
    { id: "s4", sec: 10, narration: "But the cells don't need to wait for each other. Each cell can be computed as soon as it has its own row and its own column." },
    { id: "s5", sec: 9, narration: "A GPU is thousands of simple calculators. Like 10,000 students each taking one cell, it fills every cell at once." },
    { id: "s6", sec: 11, narration: "Say a calculator does 20 cells a second, a student 1. For 10,000 cells, the calculator takes 500 seconds; 10,000 students take 1!" },
    { id: "s7", sec: 11, narration: "So big AIs train on thousands of linked GPUs. Transformers compute all the words at once, a perfect match for GPUs (chapter 41)." },
  ],
  playgroundTitle: "Calculation race",
  playgroundIntro: "Pick a matrix size and a number of students, then go! Who fills every cell first: one fast calculator or a crowd of students?",
  summary: [
    "Each result cell of a matrix product is its own 'one row · one column' calculation. No cell has to wait for another.",
    "CPU = a few fast calculators taking turns; GPU = thousands of simple calculators working at the same time.",
    "The more cells, the bigger the GPU's advantage. That's why AI is trained on GPUs.",
  ],
  unlocks: "GPU parallel computing",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "Multiply two 4 × 4 matrices. How many cells does the result have?",
      choices: ["8", "16", "4"],
      answer: 1,
      explain: "The result is also a 4 × 4 matrix, so 16 cells. Each cell multiplies one row by one column and adds them up.",
      review: "s2",
    },
    {
      q: "Why is a GPU fast at matrix multiplication?",
      choices: ["Its calculators split up the cells and compute them at the same time", "One calculator is incredibly smart", "It skips some of the calculations"],
      answer: 0,
      explain: "Each one is simple, but thousands of them fill the cells side by side, all at once.",
      review: "s5",
    },
    {
      q: "Why can the result cells of a matrix product be computed at the same time?",
      choices: ["The results are all the same", "Each cell needs the previous cell's answer", "Each cell only needs its own row and column"],
      answer: 2,
      explain: "No cell uses another cell's answer, so they can all be computed at once without waiting.",
      review: "s4",
    },
  ],
  labels: {
    tag: "68. Why GPUs?",
    gpt3Layer: "One matrix in one GPT-3 layer",
    size: "12,288 × 12,288",
    cells: "about 150 million cells",
    times: "×",
    equals: "=",
    cellCount: "16 result cells",
    rowCol: "row · column = one cell",
    cpu: "CPU: 1 fast calculator",
    turn: "Turn",
    wait: "16 turns of waiting",
    noWait: "No need to wait for each other!",
    onlyNeeds: "Its own row + its own column is all it needs",
    gpu: "GPU: thousands of helpers",
    allAtOnce: "Every cell at once!",
    example: "illustrative example",
    task: "Fill 10,000 cells",
    calc: "1 calculator (20 cells a second)",
    students: "10,000 students (1 cell a second each)",
    sec1: "1 second",
    sec500: "500 seconds (about 8 min)",
    done: "· done!",
    ff: "Fast forward ▶▶",
    sec: "s",
    many: "Thousands of GPUs linked together",
    gpuChip: "GPU",
    sentence: "I walk to school",
    together: "Transformers compute every word at once (ch. 41)",
    next: "Ch. 69: how big did GPT get?",
  },
};
