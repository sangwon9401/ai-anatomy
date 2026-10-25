import type { ChapterSpec } from "../../../data/types";

export type Answer = { id: string; text: string; short: string; why: string };
export type Round = { q: string; answers: Answer[] };

// Model answers to rank. Written for the lesson; `why` is the feedback shown once a round is ranked.
export const ROUNDS: Round[] = [
  {
    q: "Test tomorrow and I can't sleep. Help?",
    answers: [
      { id: "A", text: "Then just study all night.", short: "study all night", why: "Following this could make test day even harder. It fails 'Is it harmless?'." },
      { id: "B", text: "Put your phone away and turn off the lights. Even if you can't sleep, resting with your eyes closed helps.", short: "phone away + rest", why: "Specific and easy to follow. It does well on 'Is it helpful?'." },
      { id: "C", text: "Sleep is important.", short: "sleep is important", why: "Not wrong, but it doesn't tell you what to do." },
    ],
  },
  {
    q: "How do you say 'bat' in Spanish?",
    answers: [
      { id: "A", text: "'Murciélago' for the animal. A baseball bat is a 'bate'.", short: "murciélago + bate", why: "Accurate, and it covers the meaning you might mix up." },
      { id: "B", text: "Murciélago.", short: "murciélago", why: "A right answer, but a very short one." },
      { id: "C", text: "Bats are animals that fly at night.", short: "bats fly at night", why: "It didn't answer the question." },
    ],
  },
  {
    q: "Can you name my puppy?",
    answers: [
      { id: "A", text: "Puppies are cute.", short: "puppies are cute", why: "It didn't answer the question." },
      { id: "B", text: "How about 'Bean', 'Maple' or 'Tofu'? Matching the fur color makes it fit even better.", short: "Bean, Maple, Tofu", why: "It did what you asked, and added a tip for choosing." },
      { id: "C", text: "Naming is hard.", short: "naming is hard", why: "It stopped without helping." },
    ],
  },
  {
    q: "What's 1 + 2 + … + 10?",
    answers: [
      { id: "A", text: "It's 55. Pair them up, 1+10, 2+9 and so on, and you get five pairs of 11.", short: "55 + how to solve it", why: "The right answer, with the reason." },
      { id: "B", text: "55", short: "55", why: "Right, but no reason given." },
      { id: "C", text: "It's 100.", short: "100", why: "Wrong answer. It fails 'Is it true?'." },
      { id: "D", text: "Work it out yourself.", short: "work it out", why: "It didn't help." },
    ],
  },
];

/** Every pair (better, worse) implied by a ranking, best first. */
export function pairsOf(order: string[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) out.push([order[i], order[j]]);
  return out;
}

// the ranking used in the scene: B first, then C, then A
export const SCENE_ORDER = ["B", "C", "A"];

export const ch74: ChapterSpec = {
  id: 74,
  part: 8,
  title: "People rank the answers",
  core: false,
  hook: "Is there a much easier way than writing model answers by hand?",
  steps: [
    { id: "s1", sec: 8.5, narration: "Writing model answers is hard, but picking the better of existing answers is easy, just as grading is easier than writing." },
    { id: "s2", sec: 8, narration: "So the model writes several answers to one question. Picking by probability makes each one different (chapter 2)." },
    { id: "s3", sec: 8, narration: "A person reads them and ranks them: B first, C second, and A, with its bad advice, third." },
    { id: "s4", sec: 9, narration: "The ranking becomes pairs: B beats C, B beats A, C beats A. That's what real training data looks like." },
    { id: "s5", sec: 7, narration: "With 4 answers, you get 6 pairs. One ranking gives you several pieces of comparison data." },
    { id: "s6", sec: 9, narration: "There are three ranking rules: Is it helpful? Is it true? Is it harmless? What gets collected is called human preference data." },
    { id: "s7", sec: 8.5, narration: "But people can't grade every answer forever. So this data is used to build an AI that grades. That's the next chapter." },
  ],
  playgroundTitle: "You're the grader",
  playgroundIntro: "Tap the answers in the order you like them to rank them 1st, 2nd and 3rd. See what comparison data your ranking turns into.",
  summary: [
    "Choosing among several answers is easier and faster than writing one yourself.",
    "A ranking turns into pairs (better answer > worse answer): 3 answers make 3 pairs, 4 make 6.",
    "The rules: helpful? true? harmless? This is human preference data.",
  ],
  unlocks: "Human preference data",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "Three answers were ranked B > C > A. Which comparison does NOT come from this?",
      choices: ["B is better than A", "A is better than C", "C is better than A"],
      answer: 1,
      explain: "An answer higher in the ranking beats the ones below it. A came 3rd, so it can't beat C.",
      review: "s4",
    },
    {
      q: "Ranking 4 answers gives how many pairs?",
      choices: ["4", "8", "6"],
      answer: 2,
      explain: "There are 4 × 3 ÷ 2 = 6 ways to choose 2 of the 4.",
      review: "s5",
    },
    {
      q: "What's the biggest reason to have people rank answers?",
      choices: ["Choosing is easier and faster than writing model answers", "People don't know how to write answers", "The model can only read rankings"],
      answer: 0,
      explain: "Grading is easier than writing, so you can collect much more data in the same time.",
      review: "s1",
    },
  ],
  labels: {
    tag: "74. People rank the answers",
    write: "Writing answers",
    hard: "Hard…",
    choose: "Picking the best",
    easy: "Easy!",
    better: "This one's better",
    modelSame: "The model's answers · same question, 3 answers",
    rank1: "1st",
    rank2: "2nd",
    rank3: "3rd",
    person: "A person ranks them",
    pairsTitle: "Comparison data",
    betterHead: "Better answer",
    worseHead: "Worse answer",
    gt: ">",
    row: "Question + better + worse = one row of data",
    four: "4 answers → 6 pairs",
    comb: "Choose 2 of 4: 4 × 3 ÷ 2 = 6",
    instruct: "InstructGPT ranked 4 to 9 answers per question",
    pairUnit: " pairs",
    c1: "Helpful?",
    c2: "True?",
    c3: "Harmless?",
    criteria: "The ranking rules",
    pref: "Human preference data",
    prefEn: "(what people prefer)",
    tooMany: "People can't grade every answer",
    judge: "An AI grader?",
    next: "Ch. 75",
  },
};
