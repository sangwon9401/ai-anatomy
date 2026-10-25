import type { ChapterSpec, Highlighter } from "../../../data/types";

// ch14's scores (school 3, the 2, work 1, pizza −1; the course-wide English running example, same colours as ch14);
// probabilities = softmax(score ÷ temperature), see part9-toy.ts.
export const SCORES81: { w: string; s: number; c: Highlighter }[] = [
  { w: "school", s: 3, c: "yellow" },
  { w: "the", s: 2, c: "mint" },
  { w: "work", s: 1, c: "sky" },
  { w: "pizza", s: -1, c: "pink" },
];

// s6: continuations of "I walk to" written by the Part 9 toy model at three temperatures (illustrative picks;
// every one is a real path through the toy table, checked by script). At 0.2 the loop comes out about 78% of the time.
export const RUNS = [
  { t: 0.2, runs: [["school", "and", "meet", "friends", "and", "meet", "friends", "…"]] },
  {
    t: 1,
    runs: [
      ["school", "and", "eat", "lunch", "."],
      ["the", "library", "."],
      ["work", "but", "it", "rains", "."],
    ],
  },
  {
    t: 2,
    runs: [
      ["pizza", "and", "ride", "rockets", "."],
      ["work", "but", "robots", "appear", "."],
      ["school", "."],
    ],
  },
];

export const ch81: ChapterSpec = {
  id: 81,
  part: 9,
  title: "The creativity dial",
  core: true,
  hook: "Can you set an AI's 'creativity' with a single number?",
  steps: [
    { id: "s1", sec: 9, narration: "In chapter 14, scores 3, 2, 1, −1 went into softmax and 'school' got 65.7%. Now let's attach a dial to it." },
    { id: "s2", sec: 9, narration: "This dial is the temperature. Divide the scores by the temperature, then put them into softmax. At 1, nothing changes." },
    { id: "s3", sec: 9, narration: "Turn it down to 0.5 and the scores become 6, 4, 2, −2. The gaps double, so 'school' jumps to 86.7%. Much sharper!" },
    { id: "s4", sec: 9, narration: "Turn it up to 2 and the scores are 1.5, 1, 0.5, −0.5. The gaps shrink, the bars flatten, and pizza rises to 6.4%." },
    { id: "s5", sec: 9, narration: "All the way? Near 0, only first place is left: that's greedy (chapter 80). Very high, and every candidate is about the same." },
    { id: "s6", sec: 9, narration: "Let the toy model write: at 0.2 it goes in circles, at 1 it sounds natural, and at 2 it gets strange." },
    { id: "s7", sec: 9, narration: "Low temperature fits exact answers, high fits new ideas. It doesn't change what the model knows, only how the odds are shared." },
  ],
  playgroundTitle: "Temperature dial",
  playgroundIntro: "Change the temperature and watch the probability bars, then write 5 sentences at that temperature. How do they change?",
  summary: [
    "Temperature: divide the scores by the temperature, then put them into softmax.",
    "Low temperature is sharp, so first place takes almost everything. High is flat, so picks spread out.",
    "Low temperature is steady, high temperature is varied. The model's knowledge stays the same.",
  ],
  unlocks: "Temperature",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "Turn the temperature down to 0.5. What do the scores [3, 2, 1, −1] become before softmax?",
      choices: ["[1.5, 1, 0.5, −0.5]", "[6, 4, 2, −2]", "[3.5, 2.5, 1.5, −0.5]"],
      answer: 1,
      explain: "Divide the scores by the temperature. Dividing by 0.5 doubles them, so the gaps between scores double too.",
      review: "s3",
    },
    {
      q: "What happens to the probabilities when the temperature is very high?",
      choices: ["All the candidates become about equal", "First place becomes 100%", "Nothing changes at all"],
      answer: 0,
      explain: "Dividing the scores by a big number almost erases the gaps, so the bars end up about the same height.",
      review: "s5",
    },
    {
      q: "Which temperature fits a task that needs one exact answer, like a math problem?",
      choices: ["A very high temperature", "It doesn't matter", "A low temperature"],
      answer: 2,
      explain: "A low temperature picks the most likely answer almost every time, so it's steady. High temperatures are for jobs that need variety, like making up stories.",
      review: "s7",
    },
  ],
  labels: {
    tag: "81. The creativity dial",
    example: "* illustrative scores (ch. 14)",
    recap: "Ch. 14: scores → softmax → %",
    dial: "Add a dial!",
    temp: "temperature",
    tempShort: "temp",
    fLeft: "probability = softmax(",
    fRight: "score ÷ temperature)",
    score: "score",
    divided: "÷ temp",
    same: "÷ 1 → no change",
    sharp: "gaps × 2 → sharp!",
    flat: "gaps halved → flat",
    near0: "Temperature 0.1",
    high: "Temperature 10",
    greedy: "Only #1 left = greedy",
    even: "All about equal = flat",
    runsHead: "Continuing 'I walk to'",
    toy: "* illustrative picks from a toy model",
    allSame: "Same every time",
    loop: "Loops",
    natural: "Natural",
    odd: "Strange",
    low: "Low temp",
    highT: "High temp",
    lowWhen: "Must be exact",
    lowEx: "math, fact questions",
    highWhen: "Needs variety",
    highEx: "ideas, stories",
    key: "Same knowledge, new odds",
    name: "'Creativity dial' is just a nickname",
    go: "school",
    went: "the",
    late: "work",
    pizza: "pizza",
  },
};
