import type { ChapterSpec } from "../../../data/types";

// Word scores the "trained" filter ended up with. Illustrative values (labelled so in the UI),
// standing in for what a real filter would learn from thousands of examples.
// Words are matched exactly as written (so "Teacher" and "teacher" are two different words, like real tokens).
export const WEIGHTS: Record<string, number> = {
  AD: 1.8, free: 0.9, coupon: 2.1, won: 2.4, prize: 1.9, link: 1.5, Click: 1.3, deal: 1.7, sale: 1.4,
  now: 0.6, claim: 0.7, Congrats: 0.8, class: 0.4, preview: 0.3, only: 0.8, Check: 0.5, event: 1.0,
  picked: 1.6, lunch: -1.6, "sign-up": -0.3, info: -0.6, homework: -1.2, school: -1.9, Teacher: -1.4,
  teacher: -1.3, tomorrow: -0.8, wanna: -1.0, weekend: -0.4, movie: -0.2, come: -0.9, math: -0.7, pages: -0.5,
  Tell: -0.8, Tutoring: -0.2, assembly: -0.3, Newsletter: -1.5, Hey: -1.1, burgers: -0.3, eat: -0.9,
  menu: -0.4, changed: -0.7, sent: -0.6, see: -0.8,
};

export type Msg = { text: string; spam: boolean };

export const KNOWN: Msg[] = [
  { text: "[AD] free coupon, claim now", spam: true },
  { text: "[AD] fr.ee coupon, you won!", spam: true },
  { text: "Congrats! You won a prize! Click link", spam: true },
  { text: "Newsletter: free lunch sign-up info", spam: false },
  { text: "Tell me the math homework pages for tomorrow", spam: false },
  { text: "Teacher: school assembly info tomorrow", spam: false },
  { text: "This weekend: free movie preview, wanna come?", spam: false },
  { text: "[AD] Tutoring deal: class coupon", spam: true },
];

export const FRESH: Msg[] = [
  { text: "Today only: sale! Check it now", spam: true },
  { text: "Hey, I got a coupon, wanna eat burgers?", spam: false },
  { text: "You were picked in our prize event", spam: true },
  { text: "The free lunch menu changed!", spam: false },
  { text: "Did you see the link the teacher sent?", spam: false },
];

export const RULE_WORDS = ["free", "coupon", "won", "AD", "link"];

/** Split on spaces and trim brackets/punctuation at the edges only, so "fr.ee" stays a different word from "free". */
export const words = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => w.replace(/^[[\](){}:!?,.]+|[[\](){}:!?,.]+$/g, ""))
    .filter(Boolean);

export const scoreOf = (text: string) => words(text).reduce((a, w) => a + (WEIGHTS[w] ?? 0), 0);

export const SCENE_SCALE = ["won", "coupon", "AD", "free", "info", "homework", "lunch", "school"];

export const ch04: ChapterSpec = {
  id: 4,
  part: 0,
  title: "Rules vs data",
  core: false,
  hook: "How could you build a program that filters out spam texts?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Say you want to build a program that filters out spam texts. The easiest way is to write the rules yourself." },
    { id: "s2", sec: 8, narration: "If it contains \"free\", it's spam! Seems to work. But if a spammer writes \"fr.ee\", it slips right through." },
    { id: "s3", sec: 9, narration: "And the school's \"free lunch sign-up\" message gets blocked as spam. You fix the rules again and again, and it never ends." },
    { id: "s4", sec: 9.5, narration: "So we flip the method. Instead of rules, show lots of examples labeled \"spam\" or \"OK\", and the computer finds the rules itself." },
    { id: "s5", sec: 9.5, narration: "Inside the trained model, every word gets a score. \"won\" and \"coupon\" lean spam; \"lunch\" and \"school\" lean OK. No person set them." },
    { id: "s6", sec: 8, narration: "Now it judges new messages by adding up scores. Even with the \"fr.ee\" trick, \"coupon\" and \"won\" give it away." },
    { id: "s7", sec: 9, narration: "People write rules, but in learning, data teaches. ChatGPT didn't study grammar rules either: it learned from a huge amount of text." },
  ],
  playgroundTitle: "Spam filter showdown",
  playgroundIntro: "Pick words to make your own rule: \"if any of these words appear, it's spam\". Then test it on messages it has never seen.",
  summary: [
    "Rule way: people write \"if …, then …\" rules by hand. Exceptions never stop coming.",
    "Learning way: give labeled examples, and the computer finds the rules (scores).",
    "ChatGPT also taught itself from a huge amount of text.",
  ],
  unlocks: "Training data",
  quiz: [
    {
      q: "What's the biggest difference between the rule way and the learning way?",
      choices: ["The rule way is always more accurate", "People write rules; learning finds the rules in examples", "The learning way doesn't need a computer"],
      answer: 1,
      explain: "In the learning way, people provide labeled examples, and the computer finds the rules.",
      review: "s7",
    },
    {
      q: "What do you need to train a spam filter?",
      choices: ["Lots of example messages marked spam or not", "The spammers' phone numbers", "The time each message was sent"],
      answer: 0,
      explain: "Examples with the right answer (spam / OK) attached are the textbook.",
      review: "s4",
    },
    {
      q: "What happens if the rule \"spam if it contains free\" checks \"free lunch sign-up info\"?",
      choices: ["It passes as OK", "It's wrongly blocked as spam", "The rule finds the exception by itself"],
      answer: 1,
      explain: "A rule does exactly what it says, nothing more. People have to write every exception.",
      review: "s3",
    },
  ],
  labels: {
    tag: "4. Rules vs data",
    ruleTitle: "My rule",
    rule: "If it contains \"free\" → spam",
    spam: "spam",
    ok: "OK",
    m1: "[AD] free coupon, claim now",
    m2: "[AD] fr.ee coupon, you won!",
    m3: "Newsletter: free lunch sign-up",
    pass: "gets in?!",
    blocked: "blocked?!",
    add1: "+ \"fr.ee\" is spam too",
    add2: "+ unless it says \"lunch\"",
    add3: "+ unless it's a movie \"preview\"",
    add4: "+ unless ...",
    endless: "It never ends",
    examples: "thousands of example messages",
    learn: "learn",
    modelBox: "Model",
    findRule: "finds the rules itself",
    scaleL: "OK side",
    scaleR: "spam side",
    made: "scores no person ever set",
    example: "illustrative example scores",
    newMsg: "New message",
    total: "Total",
    unknown: "unknown word = 0",
    rWay: "The rule way",
    lWay: "The learning way",
    input: "Input",
    rules: "Rules",
    answer: "Answer",
    model: "Rules (model)",
    ex3: "Congrats! You won a prize!",
    ex4: "Tomorrow's math homework",
    ex5: "[AD] Tutoring deal",
    dataMakes: "\u00a0\u00a0are made by the data",
  },
};
