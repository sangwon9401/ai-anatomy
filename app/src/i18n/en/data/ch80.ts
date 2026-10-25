import { ROUND1 } from "../../../data/ch01";
import { TOY_PROMPT, generate } from "../../../data/part9-toy";
import type { ChapterSpec } from "../../../data/types";

// The ch01 distribution for "I walk to ___" (illustrative): school 52, the 21, work 12, … 9, pizza 1, other 5.
export const WHEEL = ROUND1;
export const PROMPT80 = TOY_PROMPT;

// Greedy with the Part 9 toy model loops: school and meet friends and meet friends …
export const GREEDY_LOOP = generate(0, () => 0).slice(0, 8);

// The s5 spin lands on the 2nd candidate; the s6 spins give these twelve results (a typical-looking run, fixed for the
// video). Taken by index from ch01's list so the words always match the wheel.
export const SPIN_FIRST = WHEEL[1].w;
export const SPINS = [0, 1, 0, 0, 2, 0, 1, 0, 3, 0, 2, 1].map((i) => WHEEL[i].w);

export const ch80: ChapterSpec = {
  id: 80,
  part: 9,
  title: "Ways to choose",
  core: false,
  hook: "Why not just pick the most likely word every time?",
  steps: [
    { id: "s1", sec: 7, narration: `Here are the chances for the word after '${TOY_PROMPT.join(" ")}'. Now we have to pick one. How should we choose?` },
    { id: "s2", sec: 8, narration: `Way one is greedy. Like a greedy kid, it always grabs first place, the most likely word. Here that's '${WHEEL[0].w}'.` },
    { id: "s3", sec: 7, narration: "Greedy is steady. Give it the same sentence many times and it always takes first place, so the answer never changes." },
    { id: "s4", sec: 8, narration: "But it easily goes in circles. Follow first place every time, and 'and meet friends' repeats over and over." },
    { id: "s5", sec: 8, narration: "Way two is sampling. Spin a wheel whose slices are sized by the probabilities. It's the same draw as in chapter 13." },
    { id: "s6", sec: 8, narration: `Spin it many times: '${WHEEL[0].w}' comes up most, but '${WHEEL[1].w}' and '${WHEEL[2].w}' show up too. The result changes every time.` },
    { id: "s7", sec: 9, narration: "ChatGPT usually samples, so the same question gets slightly different answers. Temperature (next chapter) sets the slice sizes." },
  ],
  playgroundTitle: "Greedy vs the wheel",
  playgroundIntro: "Compare the two ways on the same probability table. Press 'pick one word' and 'write to the end' several times each.",
  summary: [
    "Greedy: always picks the most likely word. Steady, but it easily goes in circles.",
    "Sampling: spins a wheel with slices sized by probability. The result changes every spin.",
    "ChatGPT usually samples, so the same question gets slightly different answers.",
  ],
  unlocks: "Greedy · Sampling",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "How does the greedy method choose the next word?",
      choices: ["It always picks the most likely word", "It spins a wheel with slices sized by probability", "It picks the longest word"],
      answer: 0,
      explain: "Greedy always grabs first place, like a greedy kid.",
      review: "s2",
    },
    {
      q: "You ask greedy to continue the same sentence three times. What happens?",
      choices: ["A different answer each time", "The same answer all three times", "The answers get shorter each time"],
      answer: 1,
      explain: "With the same probability table, first place is the same too, so greedy always gives the same answer.",
      review: "s3",
    },
    {
      q: "Why does ChatGPT answer the same question a little differently each time?",
      choices: ["Its internet search results keep changing", "The model sometimes breaks", "It draws the next word by probability, like a wheel"],
      answer: 2,
      explain: "Sampling gives a different result on every spin, so the answers differ a little too (chapter 2).",
      review: "s7",
    },
  ],
  labels: {
    tag: "80. Ways to choose",
    example: "illustrative probabilities",
    how: "How to pick?",
    way1: "Way 1",
    way2: "Way 2",
    greedy: "Greedy",
    greedyEn: "like a greedy kid: grab the biggest",
    top: "Always #1!",
    run: "Try",
    same: "Same answer every time",
    loop: "Going in circles",
    again: "Again!",
    sampling: "Sampling",
    wheel: "a probability wheel",
    other: "other",
    thisTime: `This time '${WHEEL[1].w}'!`,
    spins: "12 spins:",
    times: "×",
    vary: "Different every time",
    gTop: "Only #1",
    gSame: "Always the same",
    gLoop: "Loops easily",
    sTop: "Spins the wheel",
    sVary: "Varies each time",
    sOdd: "Sometimes odd",
    chatgpt: "ChatGPT usually samples",
    next: "Slice sizes: temperature, ch. 81",
  },
};
