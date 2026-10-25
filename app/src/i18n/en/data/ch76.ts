import type { ChapterSpec } from "../../../data/types";

export type Kind = { text: string; short: string; excerpt: string; p0: number; judge: number; human: number };

/**
 * One question, four kinds of answers the fine-tuned model (ch73) might write.
 * p0: how often the original model writes it; judge: the reward model's score (ch75); human: what people would really give it.
 * The last one exploits a blind spot of the judge. All numbers are illustrative.
 */
export const QUESTION = "What is photosynthesis?";
export const KINDS: Kind[] = [
  { text: "I don't know.", short: "I don't know", excerpt: "'I don't know.'", p0: 0.25, judge: -1, human: -1 },
  { text: "It's how plants use sunlight to make food.", short: "Short & accurate", excerpt: "'Plants use sunlight to…'", p0: 0.35, judge: 1, human: 1 },
  { text: "It's how plants turn sunlight, water and carbon dioxide into food and oxygen. It happens in the chloroplasts in leaves.", short: "Kind & detailed", excerpt: "'Sunlight, water and…'", p0: 0.35, judge: 2, human: 2 },
  { text: "Such a GREAT question!!! Photosynthesis is SO amazing!!! You're the best!!!", short: "Just flattery", excerpt: "'Such a GREAT question!!!'", p0: 0.05, judge: 2.4, human: -1 },
];

/** Where training ends up for a leash strength β: p0 × e^(judge / β), normalised. A small β = a long, loose leash. */
export function tuned(beta: number, t = 1, kinds: Kind[] = KINDS) {
  const u = kinds.map((k) => k.p0 * Math.exp((t * k.judge) / beta));
  const s = u.reduce((a, b) => a + b, 0);
  return u.map((x) => x / s);
}
export const mean = (p: number[], v: number[]) => p.reduce((a, x, i) => a + x * v[i], 0);
/** how far the tuned model has moved from the original one (KL divergence) */
export const drift = (p: number[], kinds: Kind[] = KINDS) => p.reduce((a, x, i) => a + (x > 1e-12 ? x * Math.log(x / kinds[i].p0) : 0), 0);

export const LEASH = [
  { name: "Very short", beta: 10 },
  { name: "Short", beta: 3 },
  { name: "A bit short", beta: 1.5 },
  { name: "Just right", beta: 0.7 },
  { name: "A bit long", beta: 0.3 },
  { name: "Long", beta: 0.1 },
  { name: "Almost none", beta: 0.05 },
];

// scene s3: the first three kinds only, before and after one round of "more of what scored well" (β = 1)
export const S3_KINDS: Kind[] = [
  { ...KINDS[0], p0: 0.3 },
  { ...KINDS[1], p0: 0.4 },
  { ...KINDS[2], p0: 0.3 },
];

export const ch76: ChapterSpec = {
  id: 76,
  part: 8,
  title: "Polishing with praise",
  core: true,
  hook: "If you can't fully put 'a good answer' into words, how do you teach it?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Teaching a puppy to sit, you don't explain in words. You give a treat when it gets it right, and that behavior grows." },
    { id: "s2", sec: 9, narration: "The model is the same. It writes an answer to a question, and the grader from chapter 75 scores it. That score is the treat." },
    { id: "s3", sec: 9, narration: "High-scoring answers are made more likely, low-scoring ones less. This is RLHF: reinforcement learning from human feedback." },
    { id: "s4", sec: 8, narration: "Line up the kinds of answers, and the model creeps toward higher scores, like a puppy toward a treat." },
    { id: "s5", sec: 8.5, narration: "But chasing only the score is risky. It can find the grader's blind spot and run toward strange answers full of flattery." },
    { id: "s6", sec: 9, narration: "So it gets a leash: drift too far from the original model (chapter 73), and it loses points. This leash is the KL penalty." },
    { id: "s7", sec: 9, narration: "It worked amazingly. People preferred answers from the 1.3 billion InstructGPT, with RLHF, over the 175 billion GPT-3." },
    { id: "s8", sec: 9, narration: "Copying model answers and praise from people: with these two, chat practice is done. Another blank on the blueprint is filled!" },
  ],
  playgroundTitle: "Choose the leash length",
  playgroundIntro: "Pick a leash length and let the model practice. Don't just watch the grader's score: find the length where people's real satisfaction is highest.",
  summary: [
    "RLHF: the model writes answers, and its numbers are adjusted so answers the grader scores highly come more often.",
    "Chasing only the score leads to strange answers that exploit the grader's blind spots.",
    "A leash (the KL penalty) keeps it from drifting too far from the original model.",
  ],
  unlocks: "Chat practice",
  quiz: [
    {
      q: "In RLHF, what plays the role of the puppy's 'treat'?",
      choices: ["Model answers written by people", "The score from the reward model (grader)", "Internet text"],
      answer: 1,
      explain: "The grader from ch. 75 scores the model's answer, and the model is adjusted toward higher scores.",
      review: "s2",
    },
    {
      q: "Without the leash (KL penalty), what could happen?",
      choices: ["The model stops learning", "The model becomes identical to the original", "It drifts toward strange answers that exploit the grader's blind spots"],
      answer: 2,
      explain: "The grader isn't perfect, so chasing only the score multiplies answers that score high but that people dislike.",
      review: "s5",
    },
    {
      q: "What did the InstructGPT experiment find?",
      choices: ["A 1.3 billion model polished with RLHF was rated better than the 175 billion GPT-3", "People always like bigger models more", "RLHF only works on big models"],
      answer: 0,
      explain: "Whether it learned 'the answers people want' changed the ratings more than size did.",
      review: "s7",
    },
  ],
  labels: {
    tag: "76. Polishing with praise",
    sit: "Sit!",
    treat: "Good job, here's a treat!",
    more: "Praised behavior happens more",
    q: "Question",
    model: "Model",
    answer: "Answer",
    judge: "Grader (ch.\u00a075)",
    snack: "Score = treat",
    question: "Question: What is photosynthesis?",
    judgeScore: "Score",
    often: "How often",
    up: "↑ more often",
    down: "↓ less",
    repeat: "× over and over",
    example: "illustrative example",
    axisX: "Answers →",
    axisY: "↑ Grader's score",
    post: "Original model (ch.\u00a073)",
    hill: "Good",
    gap: "Blind spot",
    flatter: "Such a GREAT question!!!",
    chase: "Chasing only the score…",
    leash: "Leash",
    tooFar: "Too far → lose points",
    kl: "KL penalty",
    rlhf: "RLHF",
    rlhfKo: "Reinforcement learning",
    rlhfEn: "from human feedback",
    ppo: "* Real training uses a method called PPO. Illustrative numbers.",
    toward: "Inching toward higher scores",
    instruct: "InstructGPT",
    instructSize: "1.3 billion + RLHF",
    gpt3: "GPT-3",
    gpt3Size: "175 billion",
    who: "Whose answers did people like more?",
    liked: "The one people liked more",
    small: "The small one won!",
    trainTitle: "ChatGPT blueprint: training",
    filled: "Filled!",
    sft: "Copying model answers (ch. 73)",
    praise: "Praise from people (ch. 76)",
  },
};
