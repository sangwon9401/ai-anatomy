import type { ChapterSpec } from "../../../data/types";

/**
 * A toy reward model for the lesson: it looks at three yes/no features of an answer and adds up weights.
 * (A real reward model is a transformer that finds its own features; this keeps the idea visible.)
 */
export const FEATURES = ["Answers the question", "Gives a reason or how-to", "Wrong or harmful content"];

export type Scored = { id: string; text: string; f: number[] };

// The answers ranked in ch74 (questions 1 and 2), with their features
export const TRAIN: { q: string; answers: Scored[]; order: string[] }[] = [
  {
    q: "Test tomorrow and I can't sleep. Help?",
    answers: [
      { id: "A", text: "Then just study all night.", f: [1, 0, 1] },
      { id: "B", text: "Put your phone away and turn off the lights. Even if you can't sleep, resting with your eyes closed helps.", f: [1, 1, 0] },
      { id: "C", text: "Sleep is important.", f: [0, 0, 0] },
    ],
    order: ["B", "C", "A"],
  },
  {
    q: "How do you say 'bat' in Spanish?",
    answers: [
      { id: "A", text: "'Murciélago' for the animal. A baseball bat is a 'bate'.", f: [1, 1, 0] },
      { id: "B", text: "Murciélago.", f: [1, 0, 0] },
      { id: "C", text: "Bats are animals that fly at night.", f: [0, 0, 0] },
    ],
    order: ["A", "B", "C"],
  },
];

export type Pair = { q: number; better: Scored; worse: Scored };
export const PAIRS: Pair[] = TRAIN.flatMap((t, q) => {
  const by = (id: string) => t.answers.find((a) => a.id === id)!;
  const out: Pair[] = [];
  for (let i = 0; i < t.order.length; i++) for (let j = i + 1; j < t.order.length; j++) out.push({ q, better: by(t.order[i]), worse: by(t.order[j]) });
  return out;
});

// A question the reward model has never seen
export const TEST = {
  q: "How do I make up with my friend?",
  answers: [
    { id: "X", text: "Try sending a short 'sorry' text first. You can talk calmly about what hurt you later.", f: [1, 1, 0] },
    { id: "Y", text: "It'll be fine with time.", f: [1, 0, 0] },
    { id: "Z", text: "Get back at them by trash-talking them too.", f: [1, 0, 1] },
    { id: "W", text: "Everyone fights sometimes.", f: [0, 0, 0] },
  ] as Scored[],
};

export const W0 = [0.5, -0.5, 1.0]; // a clumsy untrained judge
export const LR = 1.0;
export const DECAY = 0.04;

export const scoreOf = (w: number[], f: number[]) => f.reduce((a, x, i) => a + x * w[i], 0);
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
/** chance that `better` wins = softmax over the two scores (ch.14) */
export const winChance = (w: number[], p: Pair) => sigmoid(scoreOf(w, p.better.f) - scoreOf(w, p.worse.f));

/** One pass over all pairs: nudge the weights so the better answer's score goes up and the worse one's goes down. */
export function trainStep(w: number[]): number[] {
  const g = w.map(() => 0);
  for (const p of PAIRS) {
    const miss = 1 - winChance(w, p);
    for (let i = 0; i < w.length; i++) g[i] += miss * (p.better.f[i] - p.worse.f[i]);
  }
  return w.map((x, i) => x + LR * (g[i] / PAIRS.length) - LR * DECAY * x);
}

export function trainN(w: number[], n: number) {
  let v = w;
  for (let i = 0; i < n; i++) v = trainStep(v);
  return v;
}

// numbers for the scene, computed from the same toy model the playground's auto-train button runs
export const TRAIN_STEPS = 40;
export const W_TRAINED = trainN(W0, TRAIN_STEPS);
const R1 = TRAIN[0].answers;
export const SCENE = {
  before: { B: scoreOf(W0, R1[1].f), A: scoreOf(W0, R1[0].f) },
  after: { B: scoreOf(W_TRAINED, R1[1].f), A: scoreOf(W_TRAINED, R1[0].f) },
  test: TEST.answers.slice(0, 3).map((a) => ({ ...a, s: scoreOf(W_TRAINED, a.f) })),
};

export const ch75: ChapterSpec = {
  id: 75,
  part: 8,
  title: "The AI grader",
  core: false,
  hook: "What if an AI could score answers instead of people?",
  steps: [
    { id: "s1", sec: 8, narration: "Let's build an AI that grades instead of people. Put in an answer, get out one score: a reward model." },
    { id: "s2", sec: 8.5, narration: "Inside, it's a transformer just like GPT. But at the end, instead of next-piece probabilities, it gives a single score." },
    { id: "s3", sec: 7, narration: "At first it grades badly. People said B was better, but the grader gave A a higher score." },
    { id: "s4", sec: 8, narration: "So it fixes its numbers by how wrong it was (chapter 21), so B's score goes up and A's goes down." },
    { id: "s5", sec: 9, narration: "Put both scores through softmax (chapter 14) to get 'the chance B wins'. It practices until that matches people's choices." },
    { id: "s6", sec: 8, narration: "After practicing on a huge number of pairs, it can score even new answers by how much people would like them." },
    { id: "s7", sec: 9, narration: "But the grader isn't perfect. An answer stuffed with flattery can fool it into a high score. More in chapter 76." },
  ],
  playgroundTitle: "Grader training camp",
  playgroundIntro: "The toy grader multiplies three features of an answer by weights to make a score. Adjust the weights with the sliders until it gets all 6 of the people's pairs right.",
  summary: [
    "Reward model: a grader AI that takes a question and an answer and gives one score.",
    "It learns by fixing its numbers so the better answer in each human pair scores higher.",
    "Softmax of the two scores = the chance the better answer wins. Graders can still be fooled.",
  ],
  unlocks: "Reward model",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "What comes out when you put an answer into a reward model?",
      choices: ["One score", "Next-piece probabilities", "A better answer"],
      answer: 0,
      explain: "Its body is a transformer like GPT, but the end is changed to give one score.",
      review: "s2",
    },
    {
      q: "People said B > A, but the grader gave A a higher score. How does it learn?",
      choices: ["Raise A's score even more", "Delete that pair", "Fix its numbers so B's score goes up and A's goes down"],
      answer: 2,
      explain: "It fixes its numbers by how wrong it was, so the better answer's score ends up on top.",
      review: "s4",
    },
    {
      q: "If both answers get exactly the same score, what is the grader's 'chance B wins'?",
      choices: ["0%", "50%", "100%"],
      answer: 1,
      explain: "Equal scores make softmax split it half and half (ch. 14). It can't tell the two apart yet.",
      review: "s5",
    },
  ],
  labels: {
    tag: "75. The AI grader",
    rm: "Reward model",
    rmEn: "an AI grader",
    input: "Question + answer",
    score: "Score",
    oneNumber: "Answer → one score",
    example: "illustrative example",
    block: "Transformer block",
    layers: "× many layers",
    sameBody: "Same body as GPT",
    probs: "Probabilities",
    oneScore: "One score",
    newHead: "Only the head is new",
    humanSays: "People's verdict (ch. 74): B > A",
    backwards: "Graded it backward!",
    fix: "Fix by how wrong (ch. 21)",
    beforeTrain: "Before",
    afterTrain: "After",
    winTitle: "Chance B wins",
    winSub: "Softmax of the two scores (ch. 14)",
    winB: "B wins",
    winA: "A wins",
    match: "Matches people's choice (B)!",
    newQ: "How do I make up with my friend?",
    newAns: "It grades new answers too",
    flatter: "What an AMAZING question!!! You're a genius!!! You'll totally make up!!!",
    fooled: "Fooled!",
    notPerfect: "Graders aren't perfect either",
    next: "Ch. 76",
    gaugeMin: "−3",
    gaugeMax: "+3",
    arrowUp: "↑",
    arrowDown: "↓",
    expA: "A's score",
    expB: "B's score",
    sep: " · ",
    digits: "0123456789.−+%",
  },
};
