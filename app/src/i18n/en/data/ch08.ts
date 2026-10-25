import type { ChapterSpec } from "../../../data/types";

// more classmates for the clustering beat: two taste groups
export const CLASS: { name: string; v: [number, number] }[] = [
  { name: "Liam", v: [8.5, 2] },
  { name: "Ava", v: [9, 4] },
  { name: "Ethan", v: [7.5, 1.5] },
  { name: "Zoe", v: [6.5, 2.5] },
  { name: "Lucas", v: [3, 8] },
  { name: "Lily", v: [1.5, 7.5] },
  { name: "Jack", v: [2.5, 10] },
  { name: "Ben", v: [3.5, 9] },
];

// an illustrative 2-D word map (real embeddings have thousands of dimensions)
export const WORDS: { w: string; v: [number, number] }[] = [
  { w: "apple", v: [1.6, 8.2] },
  { w: "pear", v: [3.4, 8.8] },
  { w: "grape", v: [2.2, 9.9] },
  { w: "dog", v: [8, 8.2] },
  { w: "cat", v: [8.9, 7] },
  { w: "rabbit", v: [7.3, 6.2] },
  { w: "bus", v: [6.4, 2.4] },
  { w: "subway", v: [8.2, 1.4] },
  { w: "bike", v: [5.6, 0.6] },
];

export const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const ch08: ChapterSpec = {
  id: 8,
  part: 1,
  title: "Close means similar",
  core: false,
  hook: "Can numbers help you find a friend with a taste like yours?",
  steps: [
    { id: "s1", sec: 6.5, narration: "Let's keep only the tips of last chapter's arrows. Each dot is one friend's taste." },
    { id: "s2", sec: 8, narration: "Two dots close together mean similar tastes. You can measure the distance with the Pythagorean theorem from middle school." },
    { id: "s3", sec: 10, narration: "Mia and Emma differ by 1 across and 1 up: the distance is √2, about 1.4. Mia and Noah: about 8.5. Emma is much closer." },
    { id: "s4", sec: 7, narration: "With more friends, the dots form groups: Team Spicy and Team Sweet. Close dots gather together." },
    { id: "s5", sec: 8, narration: "AI finds similar things the same way. Song recommendations and similar-photo search both come down to finding close points." },
    { id: "s6", sec: 8.5, narration: "Words can be dots too. Words with similar meanings sit close: fruits with fruits, pets with pets. More in chapter 33." },
    { id: "s7", sec: 7, narration: "Close means similar. Next, we learn the dot product, which measures similarity by direction instead of distance." },
  ],
  playgroundTitle: "My most similar friend",
  playgroundIntro: "Tap the plane to place your taste dot. It measures the distance to each friend and lists them from closest.",
  summary: [
    "When the tips of two vectors are close, they are similar.",
    "Distance by the Pythagorean theorem: √(across difference² + up difference²).",
    "Similar things gather. Recommendations and word meanings are both \"find the close point\".",
  ],
  unlocks: "Distance",
  unlockLabel: "You got a new math tool",
  quiz: [
    {
      q: "What is the distance between (8, 3) and (7, 4)?",
      choices: ["√2, about 1.4", "2", "15"],
      answer: 0,
      explain: "1 apart across, 1 apart up. √(1² + 1²) = √2.",
      review: "s3",
    },
    {
      q: "What does it mean when two dots are close?",
      choices: ["Their numbers are big", "Their tastes (features) are similar", "Both are at the origin"],
      answer: 1,
      explain: "Every slot has a meaning, so similar numbers mean similar features.",
      review: "s2",
    },
    {
      q: "What idea does AI use to recommend similar songs?",
      choices: ["Pick the newest song", "Find the closest points", "Pick songs with similar titles"],
      answer: 1,
      explain: "It turns songs into vectors and finds the points close to a song you liked.",
      review: "s5",
    },
  ],
  labels: {
    tag: "8. Close means similar",
    spicy: "spicy",
    sweet: "sweet",
    minji: "Mia",
    junho: "Noah",
    seoyeon: "Emma",
    pyth: "distance = √(across² + up²)",
    d1: "√(1² + 1²) = √2 ≈ 1.4",
    d2: "√(6² + 6²) ≈ 8.5",
    closer: "Emma is much closer",
    spicyTeam: "Team Spicy",
    sweetTeam: "Team Sweet",
    recommend: "Recommending = finding close points",
    song: "a song I liked",
    suggest: "for you!",
    fruit: "fruits",
    animal: "pets",
    ride: "vehicles",
    wordMap: "word map (illustrative example)",
    sum: "Close means similar",
    next: "Next: dot product, measured by direction",
  },
};
