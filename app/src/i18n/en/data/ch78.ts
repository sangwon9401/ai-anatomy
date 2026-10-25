import type { ChapterSpec } from "../../../data/types";

/**
 * Time each service took to reach 1 million users. These figures are widely quoted (e.g. in a 2023 Statista chart)
 * but rough: each company counted "users" differently. They are labelled as widely quoted estimates wherever they appear.
 */
export type Service = { name: string; days: number; label: string };
export const SERVICES: Service[] = [
  { name: "Netflix", days: 1278, label: "3.5 years" },
  { name: "Twitter", days: 730, label: "2 years" },
  { name: "Facebook", days: 304, label: "10 months" },
  { name: "Instagram", days: 76, label: "2.5 months" },
  { name: "ChatGPT", days: 5, label: "5 days" },
];

export const RECIPE = [
  { name: "GPT-3.5-series model", sub: "Pre-training (Part 7)", color: "sky" as const },
  { name: "+ Copying model answers", sub: "ch. 73", color: "violet" as const },
  { name: "+ Praise from people", sub: "ch. 74–76", color: "pink" as const },
];

export const ch78: ChapterSpec = {
  id: 78,
  part: 8,
  title: "November 30, 2022",
  core: false,
  hook: "How did ChatGPT gather a million users in five days?",
  steps: [
    { id: "s1", sec: 8, narration: "On November 30, 2022, OpenAI released ChatGPT: a free research preview that anyone could try." },
    { id: "s2", sec: 8.5, narration: "Inside, it's just what this Part showed: a GPT-3.5-series model polished for chat with model answers and human praise." },
    { id: "s3", sec: 7.5, narration: "What changed was how you used it. No tricky setup: you just typed in a chat box, like talking to a friend." },
    { id: "s4", sec: 7, narration: "The response was explosive. Within 5 days of launch, it passed 1 million users." },
    { id: "s5", sec: 8, narration: "How long did other popular services take to reach 1 million? These are widely quoted estimates." },
    { id: "s6", sec: 9, narration: "About two months later, monthly users were estimated at 100 million. Some called it the fastest-growing app yet." },
    { id: "s7", sec: 9, narration: "But problems showed up too: convincing wrong answers, and replies to dangerous requests. So safety mattered even more." },
  ],
  playgroundTitle: "The 1-million race",
  playgroundIntro: "First guess how many days ChatGPT took to reach 1 million users. Then race it against other services.",
  summary: [
    "ChatGPT was released on November 30, 2022, as a free research preview.",
    "Inside: a GPT-3.5-series model + model answers + human praise (RLHF).",
    "1 million users in 5 days, and about 100 million monthly users two months later (estimated).",
  ],
  unlocks: "ChatGPT's launch",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "When was ChatGPT first released?",
      choices: ["June 2020", "November 30, 2022", "December 2017"],
      answer: 1,
      explain: "November 30, 2022. 2017 is when the Transformer paper came out (ch. 44), and 2020 is when GPT-3 came out.",
      review: "s1",
    },
    {
      q: "How was ChatGPT made?",
      choices: ["A brand-new structure was invented from scratch", "It just shows internet search results", "A GPT-3.5-series model was polished with model answers and human praise"],
      answer: 2,
      explain: "The SFT and RLHF you learned in this Part are exactly that method.",
      review: "s2",
    },
    {
      q: "What should you be careful about with the 'time to 1 million users' chart?",
      choices: ["Each service counted 'users' differently, so the numbers are rough estimates", "Every number was measured exactly", "ChatGPT was the slowest"],
      answer: 0,
      explain: "They're widely quoted, but each company used its own definition. Use them only to see the big picture.",
      review: "s5",
    },
  ],
  labels: {
    tag: "78. November 30, 2022",
    month: "November 2022",
    day: "30",
    weekday: "Wednesday",
    launch: "ChatGPT launches",
    preview: "A free research preview",
    equals: "= ChatGPT",
    sameWay: "* OpenAI said it was trained the same way as InstructGPT (ch. 76)",
    appName: "ChatGPT",
    ask: "Suggest a weekend read?",
    reply: "Sure! Tell me what kinds of stories you like, and I'll pick a few.",
    input: "Type a message",
    send: "↑",
    justTalk: "Just start talking!",
    dayN: "Day ",
    users: " users",
    dot: "● 1 dot = 10,000 people",
    million: "1 million in 5 days!",
    chartTitle: "Time to reach 1 million users",
    estimate: "* Widely quoted estimates. Each service counted 'users' differently.",
    wow: "5 days!",
    m1: "1 million (5 days) →",
    m100: "← 100 million\n(~2 months)",
    monthly: "100 million monthly users (est.)",
    fastest: "Some called it the fastest-growing app",
    cell: "□ 1 box = 1 million people",
    problems: "Problems that showed up",
    wrong: "Convincing but wrong (ch. 84)",
    danger: "Answering dangerous requests",
    safety: "Making it safe",
    next: "Ch. 79",
  },
};
