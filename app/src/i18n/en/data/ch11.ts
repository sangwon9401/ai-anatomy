import type { ChapterSpec } from "../../../data/types";

export type M2 = [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]

export const apply = (m: M2, v: [number, number]): [number, number] => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
export const lerpM = (a: M2, b: M2, t: number): M2 => a.map((x, i) => x + (b[i] - x) * t) as M2;

export const I2: M2 = [1, 0, 0, 1];
export const WORKED: { m: M2; v: [number, number] } = { m: [2, 1, 0, 1], v: [1, 2] };

export const PRESETS: { key: string; m: M2 }[] = [
  { key: "stretch", m: [2, 0, 0, 1] },
  { key: "rotate", m: [0, -1, 1, 0] },
  { key: "shear", m: [1, 1, 0, 1] },
  { key: "flip", m: [-1, 0, 0, 1] },
];

export const ch11: ChapterSpec = {
  id: 11,
  part: 1,
  title: "Matrix multiplication = transforming space",
  core: true,
  hook: "What happens when you multiply a vector by a matrix?",
  steps: [
    { id: "s1", sec: 6, narration: "Let's multiply a vector by a matrix. What comes out is a new vector." },
    { id: "s2", sec: 11, narration: "We use the dot product from chapter 9. Row 1 of the matrix · the vector gives the first slot; row 2 · the vector gives the second." },
    { id: "s3", sec: 8, narration: "Here's the picture. Multiply every point on the grid by the same matrix, and the whole space stretches sideways." },
    { id: "s4", sec: 9, narration: "Change the matrix and the change in shape changes too. It can rotate the space, or push it over at a slant." },
    { id: "s5", sec: 8.5, narration: "With any matrix, straight lines stay straight and the origin stays put. This kind of change is called a linear transformation." },
    { id: "s6", sec: 9, narration: "GPT multiplies word vectors by matrices to reshape the space of meaning. Attention's Query, Key and Value are matrix products too." },
    { id: "s7", sec: 8, narration: "Matrix multiplication is a machine that reshapes space. Choosing the numbers inside that machine is exactly what AI learning does." },
  ],
  playgroundTitle: "The space-changing machine",
  playgroundIntro: "Change the matrix's four numbers or press a button. You'll see how the whole grid changes.",
  summary: [
    "Matrix × vector = new vector. Each slot is a dot product: \"matrix row · vector\".",
    "Multiply every point by the same matrix and space stretches, rotates and slants.",
    "Straight lines stay straight, the origin stays put (linear transformation). GPT's layers are matrix products too.",
  ],
  unlocks: "Matrix multiplication",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "What is the matrix [[1, 0], [0, 3]] times the vector (2, 1)?",
      choices: ["(2, 3)", "(3, 2)", "(2, 1)"],
      answer: 0,
      explain: "Row 1: (1, 0)·(2, 1) = 2. Row 2: (0, 3)·(2, 1) = 3. So it's (2, 3).",
      review: "s2",
    },
    {
      q: "If you multiply every point by the matrix [[2, 0], [0, 1]], what happens to space?",
      choices: ["It stretches 2× sideways", "It stretches 2× up and down", "Nothing changes"],
      answer: 0,
      explain: "Only the across coordinate doubles; the up coordinate stays the same.",
      review: "s3",
    },
    {
      q: "What always stays the same in a linear transformation?",
      choices: ["Where the origin is", "Where every point is", "The length of every arrow"],
      answer: 0,
      explain: "Any matrix times the origin gives (0, 0). Straight lines also stay straight.",
      review: "s5",
    },
  ],
  labels: {
    tag: "11. Matrix multiplication = transforming space",
    times: "matrix × vector = new vector",
    row1: "row 1 · vector",
    row2: "row 2 · vector",
    stretch: "stretch",
    rotate: "rotate",
    shear: "shear",
    flip: "flip",
    every: "one matrix, every point",
    straight: "lines stay straight",
    origin: "origin stays put",
    linear: "linear transformation",
    gpt: "word vector × matrix",
    newSpace: "the space of meaning changes",
    qkv: "Query, Key and Value are matrix products too (ch. 46)",
    learn: "numbers in the matrix = set by learning",
    sum: "A matrix reshapes space",
    cat: "cat",
    dog: "dog",
    car: "car",
  },
};
