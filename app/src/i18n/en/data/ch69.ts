import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Canonical parameter counts (CHAPTER_GUIDE "Canonical facts"); floors = parameters / 100 million. */
export const MODELS: { key: string; name: string; year: number; params: number; paramsText: string; c: Highlighter }[] = [
  { key: "gpt1", name: "GPT-1", year: 2018, params: 1.17e8, paramsText: "117M", c: "mint" },
  { key: "gpt2", name: "GPT-2", year: 2019, params: 1.5e9, paramsText: "1.5B", c: "sky" },
  { key: "gpt3", name: "GPT-3", year: 2020, params: 1.75e11, paramsText: "175B", c: "yellow" },
];
export const FLOOR = 1e8; // 100 million parameters = one floor
export const floors = (params: number) => params / FLOOR;

/** Empire State Building, New York: 102 floors (real building, used only as a yardstick). */
export const TOWER = { key: "tower", name: "Empire State", floors: 102 };

export const ratio = (a: number, b: number) => a / b;
/** "about 13×" style: whole numbers, thousands separated. */
export const timesText = (r: number) => `about ${Math.round(r).toLocaleString("en-US")}×`;

export const GUESSES = [175, 1750, 17500];

export const ch69: ChapterSpec = {
  id: 69,
  part: 7,
  title: "GPT-1 → 2 → 3",
  core: false,
  hook: "From GPT-1 to GPT-3, how much did it grow in just two years?",
  steps: [
    { id: "s1", sec: 11, narration: "GPT wasn't born all at once. GPT-1 came in 2018, GPT-2 in 2019, GPT-3 in 2020. It got bigger every year." },
    { id: "s2", sec: 10, narration: "Let's say 100 million parameters (chapter 12's knobs) make one floor. GPT-1 has 117 million: a one-story house." },
    { id: "s3", sec: 7, narration: "GPT-2 has 1.5 billion: a 15-story apartment building. About 13 times bigger in one year." },
    { id: "s4", sec: 9, narration: "GPT-3 has 175 billion. How many floors? It won't fit on the screen. Let's step back." },
    { id: "s5", sec: 11, narration: "A whopping 1,750 floors! About 117 times GPT-2, and about 1,500 times GPT-1. GPT-1 doesn't even show up as a dot." },
    { id: "s6", sec: 8, narration: "You'd have to stack about 17 Empire State Buildings, 102 floors each, to reach it. Enormous!" },
    { id: "s7", sec: 11, narration: "The bigger GPT-3 could solve new tasks from just a few examples (chapter 71). Why does bigger mean smarter? Next chapter." },
  ],
  playgroundTitle: "Compare building heights",
  playgroundIntro: "100 million = 1 floor. First guess how many floors GPT-3 has. Then switch the buildings on and off to compare their sizes.",
  summary: [
    "GPT-1 (2018) 117 million → GPT-2 (2019) 1.5 billion → GPT-3 (2020) 175 billion parameters.",
    "At 100 million = 1 floor: a 1-story house → a 15-story apartment building → a 1,750-floor tower.",
    "About 1,500 times bigger in two years. As the size grew, new abilities appeared (ch. 71).",
  ],
  unlocks: "GPT model sizes",
  unlockLabel: "You picked up one more learning tool",
  quiz: [
    {
      q: "In which years did GPT-1, GPT-2 and GPT-3 come out?",
      choices: ["2016, 2017, 2018", "2018, 2019, 2020", "2020, 2021, 2022"],
      answer: 1,
      explain: "GPT-1 came out in 2018, GPT-2 in 2019, and GPT-3 in 2020.",
      review: "s1",
    },
    {
      q: "If 100 million = 1 floor, how many floors is GPT-3 (175 billion)?",
      choices: ["175 floors", "17 floors", "1,750 floors"],
      answer: 2,
      explain: "175 billion ÷ 100 million = 1,750 floors.",
      review: "s5",
    },
    {
      q: "About how many times more parameters does GPT-3 have than GPT-2?",
      choices: ["About 117 times", "About 2 times", "About 10 times"],
      answer: 0,
      explain: "175 billion ÷ 1.5 billion ≈ 117. That much growth in a single year.",
      review: "s5",
    },
  ],
  labels: {
    tag: "69. GPT-1 → 2 → 3",
    grow: "Bigger every year",
    floorRule: "100 million parameters = 1 floor",
    f1: "≈ 1 floor",
    f2: "= 15 floors",
    f3: "= 1,750 floors",
    tiny: "Just 1 floor!",
    x13: "about 13×",
    howTall: "How tall?",
    offScreen: "Off-screen…",
    back: "Step back",
    x117: "about 117× GPT-2",
    x1500: "about 1,500× GPT-1",
    dot: "GPT-1 is here (smaller than a dot)",
    tower: "Empire State Building: 102\u00a0floors",
    x14: "× 17",
    huge: "Enormous!",
    fewShot: "It solved new tasks from just a few examples (ch.\u00a071)",
    why: "Why is bigger smarter?",
    next: "Ch. 70: scaling laws",
  },
};
