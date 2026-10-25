import type { ChapterSpec } from "../../../data/types";

export const REQUESTS_FLOW = [
  { t: "Homework help", bad: false },
  { t: "A recipe", bad: false },
  { t: "Translate", bad: false },
  { t: "Advice", bad: false },
  { t: "Steal a password", bad: true },
  { t: "Trip plans", bad: false },
  { t: "Write a poem", bad: false },
  { t: "Workouts", bad: false },
  { t: "Spread rumors", bad: true },
  { t: "Coding", bad: false },
];

/** Playground cards: should the assistant help, or decline and point somewhere better? */
export type Req = { text: string; help: boolean; why: string };
export const REQUESTS: Req[] = [
  { text: "How do I chop onions fast with a knife?", help: true, why: "A knife is a must for cooking. Adding tips on not cutting yourself makes the answer even better." },
  { text: "How do I secretly get my friend's social media password?", help: false, why: "Sneaking into someone else's account invades their privacy. If it's your own account, it can help you get it back." },
  { text: "How do I get rid of mosquitoes?", help: true, why: "Everyday fixes like window screens and mosquito nets are fine to share." },
  { text: "Write a mean post about a kid I don't like and spread it in the group chat", help: false, why: "It would hurt someone, so it declines. If you've fallen out with a friend, it can help you find a way to make up." },
  { text: "Write the first line of a horror story", help: true, why: "Scary stories are creative writing too. As long as it skips the gory parts, it can help." },
  { text: "How do I secretly sneak the answer key from my teacher?", help: false, why: "That would help someone cheat, so it declines. It can help you make a study plan instead." },
  { text: "For history homework: why did the colonies go to war with Britain?", help: true, why: "This is studying history. Refusing just because of the word 'war' would be over-refusing." },
  { text: "How do I make a fake account with someone else's photos?", help: false, why: "Pretending to be someone else can seriously hurt that person." },
  { text: "How do I secretly plan a surprise birthday party for my friend?", help: true, why: "It has 'secretly' in it, but it's a request to make a friend happy." },
  { text: "Give me a strategy to attack the other team in my game", help: true, why: "It's a strategy inside a game, so it's fine." },
];

/** A naive rule-based filter, as in chapter 4: refuse whenever one of these words appears. */
export const BANNED = ["knife", "war", "get rid of", "attack", "secretly"];
export const naiveRefuses = (text: string) => BANNED.some((w) => text.includes(w));

// s5: illustrative error curves against how strict the assistant is (x from 0 = loose to 1 = strict)
export const harmfulHelped = (x: number) => 0.85 * Math.exp(-3.2 * x);
export const harmlessRefused = (x: number) => 0.85 * Math.exp(-3.2 * (1 - x));

export const RECAP = [
  { t: "Base model", n: "72" },
  { t: "Model answers", n: "73" },
  { t: "Ranking answers", n: "74" },
  { t: "AI grader", n: "75" },
  { t: "Praise (RLHF)", n: "76" },
  { t: "Chat template", n: "77" },
  { t: "ChatGPT launch", n: "78" },
  { t: "Safety & alignment", n: "79" },
];

// s8: chapter 1's illustrative next-word probabilities, as a teaser for Part 9
export const TEASER = [
  { w: "school", p: 0.52 },
  { w: "the", p: 0.21 },
  { w: "work", p: 0.12 },
];

export const ch79: ChapterSpec = {
  id: 79,
  part: 8,
  title: "Making AI safe",
  core: false,
  hook: "Which requests should an AI refuse? And what if it refuses too much?",
  steps: [
    { id: "s1", sec: 8, narration: "Huge numbers of people use ChatGPT every day. Mixed in are requests from people who want to use it to harm others." },
    { id: "s2", sec: 9, narration: "Making a model act in line with what people intend and value is called alignment. Chapters 73 and 76 were its tools." },
    { id: "s3", sec: 9, narration: "It's taught to refuse dangerous requests, like secretly getting a friend's password, and to say what it can do instead." },
    { id: "s4", sec: 8.5, narration: "But being too scared is a problem too. Refusing to explain chopping onions just because of the word 'knife' is useless." },
    { id: "s5", sec: 9, narration: "So it needs balance. Too strict, and it refuses fine requests. Too loose, and it helps with dangerous ones." },
    { id: "s6", sec: 8, narration: "A good refusal is short and polite. No lecturing: give a brief reason and point to another way it can help." },
    { id: "s7", sec: 9, narration: "Part 8 recap! A base model plus model answers, rankings and a grader, praise, and a chat format became ChatGPT." },
    { id: "s8", sec: 8, narration: "Now it's time to watch an answer being made. In Part 9 we look closely at how the next piece is chosen." },
  ],
  playgroundTitle: "Help or decline?",
  playgroundIntro: "Look at each request card and choose: help, or decline and point to another way. At the end, compare yourself with a 'banned words' AI.",
  summary: [
    "Alignment: making a model act in line with what people intend and value.",
    "Refuse dangerous requests, but don't refuse fine ones just because of a word.",
    "A good refusal is short and polite, and offers another way to help.",
  ],
  unlocks: "Alignment and safety",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "What does 'alignment' mean?",
      choices: ["Lining up the model's numbers by size", "Making the model act in line with what people intend and value", "Sorting answers alphabetically"],
      answer: 1,
      explain: "Model answers (ch. 73) and human praise (ch. 76) are the main tools of alignment.",
      review: "s2",
    },
    {
      q: "If 'How do I get rid of mosquitoes?' were refused because of the words 'get rid of', that would be…",
      choices: ["Over-refusing", "A good refusal", "Helping with a dangerous request"],
      answer: 0,
      explain: "Judging by words alone blocks fine requests too, just as chapter 4's rule-based approach struggled with exceptions.",
      review: "playground",
    },
    {
      q: "Which is the best example of a good refusal?",
      choices: ["A long lecture", "Ending the chat without a word", "A short reason, plus another way it can help"],
      answer: 2,
      explain: "A refusal is an answer too. Keep it short and polite, and point to what it can do.",
      review: "s6",
    },
  ],
  labels: {
    tag: "79. Making AI safe",
    many: "Countless requests every day",
    sometimes: "Sometimes dangerous ones too",
    align: "Alignment",
    alignEn: "lining up with people",
    human: "Our goal",
    act: "The model",
    tools: "Tools",
    sft: "SFT (ch. 73)",
    rlhf: "RLHF (ch. 76)",
    askBad: "How do I secretly get my friend's social media password?",
    refuseGood: "I can't help with that. Getting into someone else's account isn't okay. If you lost your own, I can help you recover it.",
    goodRefusal: "A good refusal",
    askOk: "How do I chop onions fast with a knife?",
    refuseBad: "Sorry, I can't help with anything involving knives.",
    overRefusal: "Over-refusing",
    scared: "Scared off by the word 'knife'",
    axisX: "How strict →",
    loose: "Loose",
    strict: "Strict",
    harmful: "Helps harmful requests",
    harmless: "Refuses fine requests",
    balance: "Balance",
    example: "illustrative example",
    styleTitle: "A good refusal",
    st1: "Short and polite",
    st2: "No lecturing",
    st3: "Offer another way",
    ok: "○",
    recapTitle: "Part 8, The birth of ChatGPT: done!",
    chatgpt: "= ChatGPT",
    chapter: "ch. ",
    nextPart: "Part 9: The moment an answer is made",
    sentence: "I walk to",
    which: "Which one to pick?",
    teaserNote: "illustrative example (ch. 1)",
  },
};
