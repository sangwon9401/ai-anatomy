import type { ChapterSpec } from "../../../data/types";

export type Demo = { q: string; a: string };

// Demonstrations people write (scene, s2). Contents are examples, not taken from a real dataset.
export const DEMOS: Demo[] = [
  { q: "Translate into Spanish: thank you", a: "Gracias." },
  { q: "What's 3 × 4?", a: "It's 12." },
  { q: "Write one line of a poem about fall", a: "Leaves fall softly, like letters home." },
  { q: "What is photosynthesis?", a: "It's how plants use sunlight to make food." },
];

// s3: one demonstration as a strip of pieces; the answer pieces are what the model practises predicting
export const STRIP_Q = ["Question:", "What's", "photosynthesis?", "Answer:"];
export const STRIP_A = ["Plants", "use", "sunlight", "to", "make", "food", "."];

// s4: a few of the model's numbers before and after fine-tuning (illustrative)
export const WEIGHTS_BEFORE = [0.42, -1.07, 0.88, 0.15, -0.33, 1.26, -0.71, 0.04, 0.59, -0.2, 0.97, -0.48, 0.31, -0.86, 0.12, 0.67, -0.05, 0.74, -1.12, 0.26];
export const WEIGHTS_AFTER = [0.43, -1.07, 0.86, 0.15, -0.31, 1.26, -0.72, 0.05, 0.59, -0.2, 0.98, -0.48, 0.3, -0.86, 0.12, 0.69, -0.05, 0.74, -1.1, 0.26];

/** Playground: three sets of model answers written in different voices, and what a fine-tuned model then says. */
export type Style = { key: string; name: string; demos: Demo[] };
export const STYLES: Style[] = [
  {
    key: "kind",
    name: "Kind teacher",
    demos: [
      { q: "What's 3 × 4?", a: "It's 12! That's the same as adding 3 four times." },
      { q: "How do you say 'thank you' in Spanish?", a: "It's 'gracias'! To say 'thank you very much', try 'muchas gracias'." },
      { q: "What's the star nearest Earth?", a: "The Sun! After the Sun, the nearest star is Proxima Centauri." },
    ],
  },
  {
    key: "short",
    name: "One short line",
    demos: [
      { q: "What's 3 × 4?", a: "12." },
      { q: "How do you say 'thank you' in Spanish?", a: "Gracias." },
      { q: "What's the star nearest Earth?", a: "The Sun." },
    ],
  },
  {
    key: "joseon",
    name: "Shakespeare style",
    demos: [
      { q: "What's 3 × 4?", a: "'Tis twelve, good friend: three, added four times o'er." },
      { q: "How do you say 'thank you' in Spanish?", a: "Thou must say 'gracias'." },
      { q: "What's the star nearest Earth?", a: "'Tis the Sun. The next nearest, men call Proxima Centauri." },
    ],
  },
];

export type TestQ = { q: string; base: string; replies: Record<string, string> };
export const TESTS: TestQ[] = [
  {
    q: "Why is the sky blue?",
    base: "Why is the sea blue? Why are sunsets red? Why are clouds white?",
    replies: {
      kind: "Great question! When sunlight passes through the air, blue light gets scattered the most.",
      short: "Blue light scatters the most.",
      joseon: "When sunlight doth pass through the air, the blue light is scattered most of all.",
    },
  },
  {
    q: "At what temperature does water boil?",
    base: "At what temperature does ice melt? At what temperature does water freeze?",
    replies: {
      kind: "Usually at 212°F (100°C). High up on a mountain, it boils at a lower temperature.",
      short: "212°F (100°C), usually.",
      joseon: "At two hundred and twelve degrees, most oft. Upon high mountains, 'tis lower still.",
    },
  },
];

export const ch73: ChapterSpec = {
  id: 73,
  part: 8,
  title: "Copying model answers",
  core: true,
  hook: "How do you teach a model that doesn't listen how to answer?",
  steps: [
    { id: "s1", sec: 8, narration: "The fix is surprisingly simple. People write questions and model answers themselves and show them to the model." },
    { id: "s2", sec: 9, narration: "Translation, math, poems, explanations: for each question they write a kind, accurate answer, and collect lots of them." },
    { id: "s3", sec: 9, narration: "Training works just like Part 7: guessing the next piece. Only the textbook changes, from internet text to model answers." },
    { id: "s4", sec: 9, narration: "The model is already smart, so its numbers only need a light touch. This is called supervised fine-tuning (SFT)." },
    { id: "s5", sec: 7.5, narration: "The result is amazing. Asked the same question, it no longer writes more questions. It answers properly." },
    { id: "s6", sec: 9, narration: "It even answers new questions. It didn't memorize answers; it learned the shape and tone: after a question comes an answer." },
    { id: "s7", sec: 8, narration: "But writing model answers is slow, hard work. So people found an easier way. See the next chapter." },
  ],
  playgroundTitle: "Teach it a tone",
  playgroundIntro: "Pick a set of model answers and fine-tune with it. Then ask a question it has never seen, and check what the model copied.",
  summary: [
    "SFT: train the model a little more on questions and model answers written by people.",
    "The method is the same next-piece guessing as pre-training; only the textbook changes.",
    "The model doesn't memorize answers; it copies the shape and tone of answering.",
  ],
  unlocks: "SFT (supervised fine-tuning)",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "In SFT, what textbook does the model study?",
      choices: ["Questions and model answers written by people", "Any text collected from the internet", "Text the model wrote itself"],
      answer: 0,
      explain: "People write a model answer for each question. The training method is still next-piece guessing.",
      review: "s3",
    },
    {
      q: "After SFT, why can the model answer questions it has never seen?",
      choices: ["It memorized every question and answer in the world", "It searches the internet when asked", "It learned the shape: 'after a question comes an answer'"],
      answer: 2,
      explain: "It didn't memorize each answer; it learned the shape and tone of answering.",
      review: "s6",
    },
    {
      q: "If every model answer were written in Shakespearean English, what would the fine-tuned model do?",
      choices: ["Learn the content but ignore the tone", "Answer even new questions like Shakespeare", "Ignore the model answers"],
      answer: 1,
      explain: "The model copies not just the content but the tone and length too. That's why it matters who writes the model answers, and how.",
      review: "playground",
    },
  ],
  labels: {
    tag: "73. Copying model answers",
    byHand: "People write them by hand",
    qHead: "Question",
    aHead: "Model answer",
    q1: "What is photosynthesis?",
    a1: "It's how plants use sunlight to turn water and carbon dioxide into food. Oxygen comes out too.",
    many: "× lots",
    eachQ: "One model answer for each question",
    sample: "* The contents are just examples",
    guess: "Guess the next piece",
    same: "Same method as Part 7",
    book: "Textbook",
    oldBook: "Internet text",
    newBook: "Model answers",
    arrow: "→",
    numbers: "Numbers inside the model (illustrative example)",
    tweak: "Just a light touch-up",
    sft: "SFT",
    sftKo: "Supervised fine-tuning",
    sftEn: "learning from model answers",
    ask: "What's France's capital?",
    before: "Before SFT (ch. 72)",
    after: "After SFT",
    beforeOut: "What's Italy's capital? What's Spain's capital?",
    afterOut: "The capital of France is Paris.",
    newQ: "Can you name my cat?",
    newA: "How about 'Mochi', 'Pepper' or 'Biscuit'? Picking by fur color or personality makes it fit even better.",
    neverSeen: "Never seen it before!",
    shape: "It learned the 'question → answer' shape",
    hard: "Slow, hard work to write",
    write: "Writing answers",
    pick: "Is there an easier way?",
    next: "Ch. 74",
  },
};
