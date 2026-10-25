import type { ChapterSpec } from "../../../data/types";

// What the base model writes after the question in the scene (illustrative, labelled so).
export const CONTINUE = ["What's Italy's capital?", "What's Spain's capital?", "What's Japan's capital?"];
export const READ = ["News", "Wiki pages", "Novels", "Workbooks", "Forum posts", "Cookbooks"];
export const QLIKE = ["Workbooks", "Surveys", "FAQs", "Quiz shows"];

/** Playground: the same question wrapped in different document starts. All continuations and chances are illustrative. */
export type Frame = { key: string; name: string; before: string; after: string };
export const FRAMES: Frame[] = [
  { key: "plain", name: "Just the question", before: "", after: "" },
  { key: "exam", name: "First item on a quiz sheet", before: "[Review quiz]\n1. ", after: "" },
  { key: "qa", name: "Question: … Answer:", before: "Question: ", after: "\nAnswer:" },
  { key: "script", name: "Student–teacher script", before: "Student: ", after: "\nTeacher:" },
];

export type Probe = {
  q: string;
  /** continuation per frame key, and the chance that the very next piece starts an answer */
  out: Record<string, { text: string; answer: number; isAnswer: boolean }>;
};

export const PROBES: Probe[] = [
  {
    q: "What's France's capital?",
    out: {
      plain: { text: "\nWhat's Italy's capital?\nWhat's Spain's capital?", answer: 0.08, isAnswer: false },
      exam: { text: "\n2. What's Italy's capital?\n3. Name the river that runs through Paris.", answer: 0.03, isAnswer: false },
      qa: { text: " Paris.", answer: 0.81, isAnswer: true },
      script: { text: " Good question. It's Paris.", answer: 0.74, isAnswer: true },
    },
  },
  {
    q: "At what temperature does water boil?",
    out: {
      plain: { text: "\nAt what temperature does ice melt?\nAt what temperature does water freeze?", answer: 0.1, isAnswer: false },
      exam: { text: "\n2. At what temperature does ice melt?\n3. What are the bubbles in boiling water made of?", answer: 0.04, isAnswer: false },
      qa: { text: " At 212°F (100°C), at sea level.", answer: 0.78, isAnswer: true },
      script: { text: " Unless you're up a high mountain, at 212°F, which is 100°C.", answer: 0.7, isAnswer: true },
    },
  },
];

export const ch72: ChapterSpec = {
  id: 72,
  part: 8,
  title: "Smart but doesn't listen",
  core: true,
  hook: "Ask a question to a model that has read a huge amount of internet text. Will it simply answer?",
  steps: [
    { id: "s1", sec: 9, narration: "Here's a model that finished Part 7: it learned next-piece guessing from internet text. It's called a base model." },
    { id: "s2", sec: 8, narration: "Let's ask it: 'What's France's capital?' Surely it will answer Paris, right?" },
    { id: "s3", sec: 8, narration: "Instead of answering, it keeps writing questions: Italy's capital? Spain's capital? Like a list of quiz questions." },
    { id: "s4", sec: 8, narration: "To the model, it looked like the first line of a quiz. Online, questions are often followed by more questions." },
    { id: "s5", sec: 8, narration: "All a base model learned is to continue text plausibly (chapter 2). It was never taught to answer questions." },
    { id: "s6", sec: 8, narration: "So people used a trick: start with 'Question: … Answer:', and the next piece is far more likely to be an answer." },
    { id: "s7", sec: 9, narration: "But you can't use a trick every time. Teaching this smart but disobedient model to listen is what Part 8 is about." },
  ],
  playgroundTitle: "Change how the text starts",
  playgroundIntro: "Start the same question as different kinds of text and see how the base model continues. Find the two starts that get an answer.",
  summary: [
    "A base model has only learned to guess the next piece of internet text.",
    "Give it a question, and instead of answering it may keep writing questions, like a workbook.",
    "Changing the shape of the text can draw out an answer, but the real fix is to teach it separately.",
  ],
  unlocks: "Base model",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "Why might a base model keep writing questions when you write only 'What's France's capital?'",
      choices: ["The model doesn't know Paris", "The internet has lots of text where questions follow questions", "The model is joking on purpose"],
      answer: 1,
      explain: "A base model just continues text plausibly. In a workbook-like text, a question is followed by another question.",
      review: "s4",
    },
    {
      q: "What did the base model actually practice during pre-training?",
      choices: ["Answering questions kindly", "Getting praise from people", "Guessing the next piece of text"],
      answer: 2,
      explain: "It only practiced guessing the next piece (ch. 2, Part 7). It has never learned how to answer.",
      review: "s5",
    },
    {
      q: "How should you start the text to draw an answer out of a base model?",
      choices: ["Write it as 'Question: … Answer:' and leave the answer blank", "Repeat the question three times", "Put lots of question marks at the end"],
      answer: 0,
      explain: "When the text has an empty spot for the answer, an answer becomes the most plausible next piece.",
      review: "playground",
    },
  ],
  labels: {
    tag: "72. Smart but doesn't listen",
    model: "Base model",
    modelEn: "a next-piece guesser",
    studied: "Next-piece practice: done! (Part 7)",
    gpt3Read: "GPT-3 studied by reading about 300 billion tokens",
    question: "What's France's capital?",
    expect: "Paris.",
    expectNote: "It'll say that, right?",
    dots: "…",
    huh: "Not an answer?!",
    example: "illustrative example",
    examTitle: "[Geography] Capital cities",
    n1: "1.",
    n2: "2.",
    n3: "3.",
    n4: "4.",
    looks: "To the model: line 1 of a quiz!",
    mine: "mine",
    qlike: "Text where questions follow questions",
    learned: "What the base model learned",
    learnedWhat: "Continuing text",
    wanted: "What we wanted",
    wantedWhat: "Answering questions",
    neq: "≠",
    ch2: "It just continues the text (ch. 2)",
    qaQ: "Question:",
    qaA: "Answer:",
    qaFill: "Paris.",
    chanceTitle: "Chance the next piece is an answer",
    plainRow: "Just the question",
    qaRow: "Shaped like 'Question: … Answer:'",
    p1: "8%",
    p2: "81%",
    trick: "Steering with the shape of the text",
    smart: "Smart",
    listens: "Listens",
    yes: "○",
    no: "×",
    chatgpt: "ChatGPT",
    sft: "Copying model answers (ch. 73)",
    rlhf: "Polishing with praise (ch. 76)",
    todo: "Part 8's job",
  },
};
