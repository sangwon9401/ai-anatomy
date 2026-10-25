import type { ChapterSpec } from "../../../data/types";

export const SENTENCE_ROWS = [
  { w: "I", v: [0.12, -0.48, 0.91, 0.03, -0.27, 0.66] },
  { w: "walk", v: [-0.35, 0.22, 0.08, 0.74, -0.51, 0.19] },
  { w: "to", v: [0.58, 0.41, -0.13, -0.62, 0.3, -0.08] },
];

export const GRADES = {
  students: ["Mia", "Noah", "Emma"],
  subjects: ["English", "Math", "Science"],
  scores: [
    [88, 92, 79],
    [95, 71, 84],
    [76, 85, 90],
  ],
};

export const ch10: ChapterSpec = {
  id: 10,
  part: 1,
  title: "Matrices: bundles of vectors",
  core: false,
  hook: "Is there a way to handle many vectors at once?",
  steps: [
    { id: "s1", sec: 8, narration: "Let's stack our three friends' taste vectors on top of each other. That gives us a table of numbers." },
    { id: "s2", sec: 10.5, narration: "A table of numbers laid out in rows and columns like this is called a matrix. It's the same matrix you meet in high school math." },
    { id: "s3", sec: 9.5, narration: "Lines across are rows; lines down are columns. 3 friends and 2 tastes make 3 rows and 2 columns: a 3 × 2 matrix." },
    { id: "s4", sec: 9, narration: "One row is one friend's vector. One column is everyone's score for one taste. You can read the same table two ways." },
    { id: "s5", sec: 9, narration: "A sentence becomes a matrix too. Each piece of \"I walk to\" has a vector, so stacking them gives a 3-row matrix." },
    { id: "s6", sec: 8, narration: "Almost every calculation inside GPT uses matrices. In GPT-3, a matrix of (pieces × 12,288) passes through every layer." },
    { id: "s7", sec: 8.5, narration: "A matrix is a container that holds many vectors at once. In the next chapter, we see what matrix multiplication does." },
  ],
  playgroundTitle: "Report card matrix",
  playgroundIntro: "Tap a row or column name and that line pops out as a vector. Add students and the matrix size changes too.",
  summary: [
    "Matrix: a table of numbers in rows and columns. A stack of vectors.",
    "Lines across = rows, lines down = columns. Its size is \"rows × columns\".",
    "Sentence = a (pieces × vector length) matrix. Almost all of GPT's math is matrices.",
  ],
  unlocks: "Matrices",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "If you write 4 students' scores in 3 subjects, one row per student, what size is the matrix?",
      choices: ["3 × 4", "4 × 3", "7 × 1"],
      answer: 1,
      explain: "The rows (across) are the 4 students and the columns (down) are the 3 subjects, so it's 4 × 3.",
      review: "s3",
    },
    {
      q: "In the taste matrix, what does one column stand for?",
      choices: ["One friend's whole taste", "Everyone's score for one taste", "The size of the matrix"],
      answer: 1,
      explain: "Row = one person, column = one taste. You read the same table in two directions.",
      review: "s4",
    },
    {
      q: "When GPT-3 reads \"I walk to\" (3 pieces), what size matrix does it make?",
      choices: ["3 × 12,288", "12,288 × 1", "3 × 3"],
      answer: 0,
      explain: "Each of the 3 pieces is a 12,288-slot vector, so stacking them gives 3 × 12,288.",
      review: "s6",
    },
  ],
  labels: {
    tag: "10. Matrices: bundles of vectors",
    spicy: "spicy",
    sweet: "sweet",
    minji: "Mia",
    junho: "Noah",
    seoyeon: "Emma",
    matrix: "Matrix",
    school: "high school math",
    row: "row (across)",
    col: "column (down)",
    size: "3 × 2 matrix",
    rowRead: "row = one friend's vector",
    colRead: "column = everyone's score for one taste",
    sentence: "Sentence matrix",
    more: "… up to 12,288 slots",
    gpt: "pieces × 12,288",
    layer: "a matrix calculation on every layer",
    sum: "Matrix = a holder for vectors",
  },
};
