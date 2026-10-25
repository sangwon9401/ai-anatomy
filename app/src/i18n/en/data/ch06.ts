import type { ChapterSpec } from "../../../data/types";

// 10×10 grayscale heart, 0 = black … 255 = white
export const HEART: number[][] = [
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [255, 255, 60, 30, 255, 255, 30, 60, 255, 255],
  [255, 60, 0, 0, 30, 30, 0, 0, 60, 255],
  [255, 30, 0, 0, 0, 0, 0, 0, 30, 255],
  [255, 30, 0, 0, 0, 0, 0, 0, 30, 255],
  [255, 255, 30, 0, 0, 0, 0, 30, 255, 255],
  [255, 255, 255, 30, 0, 0, 30, 255, 255, 255],
  [255, 255, 255, 255, 30, 30, 255, 255, 255, 255],
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
];

export const RGB = { r: 255, g: 200, b: 0 };

// Unicode code points (checked by script): A 65, B 66, a 97, b 98
export const CODES = [
  { ch: "A", code: 65 },
  { ch: "B", code: 66 },
  { ch: "a", code: 97 },
];
// "A" sits right next to "B" by number, but far from "a", the very same letter in lowercase — numbers carry no meaning
export const NEIGHBORS = [
  { ch: "A", code: 65 },
  { ch: "B", code: 66 },
  { ch: "a", code: 97 },
  { ch: "b", code: 98 },
];

export const ch06: ChapterSpec = {
  id: 6,
  part: 1,
  title: "Everything is a number",
  core: false,
  hook: "How does a computer remember photos, songs and letters?",
  steps: [
    { id: "s1", sec: 8, narration: "Inside a computer, photos, songs and letters are all stored as numbers. Today, let's look at those numbers up close." },
    { id: "s2", sec: 9.5, narration: "Zoom into a photo and you see tiny squares called pixels. Each pixel is one number for brightness: 0 is black, 255 is white." },
    { id: "s3", sec: 7.5, narration: "Color photos use three numbers per pixel: red, green and blue. Mixing those three lights makes every color." },
    { id: "s4", sec: 9.5, narration: "Sound is vibrating air. We measure the vibration over and over and write down numbers: a CD does it 44,100 times a second." },
    { id: "s5", sec: 8.5, narration: "Letters too: every character has its own number. \"A\" is 65 and \"B\" is 66. This numbering system is called Unicode." },
    { id: "s6", sec: 10.5, narration: "But the numbers carry no meaning. A and B are neighbors, yet different letters. Small \"a\", the same letter as A, is far off at 97." },
    { id: "s7", sec: 9, narration: "So AI turns words into bundles of numbers that do carry meaning. Those bundles are vectors. See you in the next chapter." },
  ],
  playgroundTitle: "Draw with numbers",
  playgroundIntro: "Tap the squares to draw a picture. The numbers for your picture appear right next to it. Below, check the numbers of letters too.",
  summary: [
    "A photo is stored as a brightness number (or red, green, blue numbers) for each pixel.",
    "Sound is the size of the vibration measured many times a second; letters are Unicode numbers.",
    "Code numbers carry no meaning, so AI uses bundles of numbers that do: vectors.",
  ],
  unlocks: "Turning things into numbers",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "What does one pixel of a black-and-white photo stand for?",
      choices: ["The brightness of that square", "The date the photo was taken", "The size of the whole photo"],
      answer: 0,
      explain: "One pixel = one brightness number, usually from 0 (black) to 255 (white).",
      review: "s2",
    },
    {
      q: "How many numbers does one pixel of a color photo need?",
      choices: ["1", "3 (red, green, blue)", "10"],
      answer: 1,
      explain: "Three numbers say how much of each of the three colors of light to mix.",
      review: "s3",
    },
    {
      q: "If two characters have close Unicode numbers, are their meanings similar?",
      choices: ["Yes", "No, the number is just a name tag", "Only for capital letters"],
      answer: 1,
      explain: "\"A\" and \"B\" are neighbors by number but different letters, while \"a\" is far away. That's why we need other numbers that carry meaning: vectors.",
      review: "s6",
    },
  ],
  labels: {
    tag: "6. Everything is a number",
    photo: "Photo",
    song: "Song",
    letter: "Letter",
    pixel: "pixel",
    black: "0 = black",
    white: "255 = white",
    red: "red",
    green: "green",
    blue: "blue",
    mixed: "mix → yellow",
    second: "measured 44,100 times a second",
    unicode: "Unicode numbers",
    near: "↙ neighbors by number",
    far: "same letter as A, yet far away ↑",
    nameTag: "Number = name tag, no meaning",
    vector: "Numbers with meaning = a vector",
    next: "Next: chapter 7, vectors",
    apple: "cat",
  },
};
