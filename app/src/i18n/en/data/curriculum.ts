// en titles; the Korean original is src/data/curriculum.ts
export type CurriculumPart = {
  part: number;
  title: string;
  chapters: { n: number; title: string; core?: boolean }[];
};

export const CURRICULUM: CurriculumPart[] = [
  {
    part: 0,
    title: "ChatGPT, who are you?",
    chapters: [
      { n: 1, title: "The next-word guessing game", core: true },
      { n: 2, title: "An AI that writes one word at a time", core: true },
      { n: 3, title: "70 years of AI on a timeline" },
      { n: 4, title: "Rules vs data" },
      { n: 5, title: "The blueprint we will build", core: true },
    ],
  },
  {
    part: 1,
    title: "AI speaks in numbers",
    chapters: [
      { n: 6, title: "Everything is a number" },
      { n: 7, title: "Vectors: rows of numbers", core: true },
      { n: 8, title: "Close means similar" },
      { n: 9, title: "Dot product: how much the same direction?", core: true },
      { n: 10, title: "Matrices: bundles of vectors" },
      { n: 11, title: "Matrix multiplication = transforming space", core: true },
      { n: 12, title: "Functions are input→output machines" },
      { n: 13, title: "Probability distributions" },
      { n: 14, title: "Scores into probabilities: softmax", core: true },
      { n: 15, title: "Matching sizes: normalization" },
    ],
  },
  {
    part: 2,
    title: "How machines learn",
    chapters: [
      { n: 16, title: "A single neuron", core: true },
      { n: 17, title: "Bend to survive: activation functions" },
      { n: 18, title: "Stacking layers" },
      { n: 19, title: "The forward pass" },
      { n: 20, title: "How wrong was it? Loss", core: true },
      { n: 21, title: "Gradient descent", core: true },
      { n: 22, title: "Choosing the step size: learning rate" },
      { n: 23, title: "Backpropagation: sharing the blame", core: true },
      { n: 24, title: "Splitting the workbook" },
      { n: 25, title: "The student who memorized past exams" },
      { n: 26, title: "Hands-on: handwritten digits" },
      { n: 27, title: "Part 2 boss battle" },
    ],
  },
  {
    part: 3,
    title: "Turning text into numbers",
    chapters: [
      { n: 28, title: "Letters inside a computer" },
      { n: 29, title: "Tokens: the AI's unit of text", core: true },
      { n: 30, title: "Merging pieces that often go together" },
      { n: 31, title: "Do some languages need more tokens?" },
      { n: 32, title: "The limits of ID numbers" },
      { n: 33, title: "Embeddings: coordinates of meaning", core: true },
      { n: 34, title: "Neighbors reveal meaning" },
      { n: 35, title: "Exploring the embedding universe" },
      { n: 36, title: "How does it know the order?", core: true },
    ],
  },
  {
    part: 4,
    title: "Before the transformer",
    chapters: [
      { n: 37, title: "Language model = probability of a sentence" },
      { n: 38, title: "Looking at only the last few words" },
      { n: 39, title: "The neural language model" },
      { n: 40, title: "RNN: passing notes in a relay" },
      { n: 41, title: "The limits of RNNs", core: true },
      { n: 42, title: "How a translator is built" },
      { n: 43, title: "The birth of attention", core: true },
    ],
  },
  {
    part: 5,
    title: "Mastering attention",
    chapters: [
      { n: 44, title: "Attention Is All You Need" },
      { n: 45, title: "Words look at each other", core: true },
      { n: 46, title: "Query · Key · Value", core: true },
      { n: 47, title: "Relevance scores" },
      { n: 48, title: "Divide, then softmax" },
      { n: 49, title: "Mixing to make new meaning" },
      { n: 50, title: "Computing it all at once", core: true },
      { n: 51, title: "No peeking at the future", core: true },
      { n: 52, title: "Looking with many eyes" },
      { n: 53, title: "Peeking inside a real GPT" },
    ],
  },
  {
    part: 6,
    title: "Assembling the transformer",
    chapters: [
      { n: 54, title: "The transformer block blueprint" },
      { n: 55, title: "The thinking layer", core: true },
      { n: 56, title: "The information highway" },
      { n: 57, title: "Keeping things steady" },
      { n: 58, title: "Stacking blocks" },
      { n: 59, title: "Encoder vs decoder" },
      { n: 60, title: "From vector to word" },
      { n: 61, title: "Following it from start to finish", core: true },
      { n: 62, title: "Part 6 boss battle: the finished blueprint" },
    ],
  },
  {
    part: 7,
    title: "Teaching GPT: pre-training",
    chapters: [
      { n: 63, title: "The internet is the textbook" },
      { n: 64, title: "Studying without an answer key", core: true },
      { n: 65, title: "Measuring surprise", core: true },
      { n: 66, title: "One lap of the training loop", core: true },
      { n: 67, title: "A smarter way downhill" },
      { n: 68, title: "Why GPUs?" },
      { n: 69, title: "GPT-1 → 2 → 3" },
      { n: 70, title: "Bigger is smarter", core: true },
      { n: 71, title: "Learning from examples alone" },
    ],
  },
  {
    part: 8,
    title: "The birth of ChatGPT",
    chapters: [
      { n: 72, title: "Smart but doesn't listen", core: true },
      { n: 73, title: "Copying model answers", core: true },
      { n: 74, title: "People rank the answers" },
      { n: 75, title: "The AI grader" },
      { n: 76, title: "Polishing with praise", core: true },
      { n: 77, title: "A chat is really one long document" },
      { n: 78, title: "November 30, 2022" },
      { n: 79, title: "Making AI safe" },
    ],
  },
  {
    part: 9,
    title: "The moment an answer is made",
    chapters: [
      { n: 80, title: "Ways to choose" },
      { n: 81, title: "The creativity dial", core: true },
      { n: 82, title: "Narrowing the candidates" },
      { n: 83, title: "The AI's memory limit" },
      { n: 84, title: "Convincing lies", core: true },
      { n: 85, title: "Prompts make sense once you know the structure" },
    ],
  },
  {
    part: 10,
    title: "The world after ChatGPT",
    chapters: [
      { n: 86, title: "AI with eyes" },
      { n: 87, title: "Think, then answer", core: true },
      { n: 88, title: "Look it up, then answer" },
      { n: 89, title: "AI with hands and feet" },
      { n: 90, title: "AI in my phone" },
      { n: 91, title: "AI and us" },
    ],
  },
  {
    part: 11,
    title: "Graduation project",
    chapters: [
      { n: 92, title: "Designing a mini GPT" },
      { n: 93, title: "Building my own tokenizer" },
      { n: 94, title: "Training in the browser", core: true },
      { n: 95, title: "Let's generate" },
      { n: 96, title: "Graduation day" },
    ],
  },
];

export const TOTAL_CHAPTERS = CURRICULUM.reduce((n, p) => n + p.chapters.length, 0);

export const partTitle = (part: number) => CURRICULUM.find((p) => p.part === part)?.title ?? "";
