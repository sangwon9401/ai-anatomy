import type { ChapterSpec } from "../../../data/types";

// A made-up school's documents (Star Fest = the school's fall festival). 2026-11-06 and 2025-11-07 are both Fridays.
export type Doc = { id: string; title: string; text: string; c: "yellow" | "mint" | "sky" | "pink" | "orange" | "violet" };
export const DOCS: Doc[] = [
  { id: "fest", title: "2026 Star Fest", text: "The 2026 Star Fest (our school festival) is on Friday, November 6. Class booths are open from 10 a.m. to 2:30 p.m.", c: "yellow" },
  { id: "old", title: "2025 Star Fest thank-you", text: "The 2025 Star Fest (our school festival) was held on Friday, November 7. Thank you to everyone who came!", c: "orange" },
  { id: "lunch", title: "November lunch", text: "Lunch on the second Friday of November is chicken curry with rice and corn soup. Allergy information is on the school website.", c: "mint" },
  { id: "lib", title: "Library hours", text: "The library is open on weekdays from 8 a.m. to 5 p.m. During exam weeks it stays open until 7 p.m.", c: "sky" },
  { id: "pe", title: "Winter PE uniform", text: "You can start wearing the winter PE uniform on November 2.", c: "violet" },
  { id: "club", title: "After-school coding club", text: "Sign-ups for the after-school coding club close on November 3. Sign up with your homeroom teacher.", c: "pink" },
];

export type Question = {
  key: string;
  q: string;
  /** search words; a document's score = how many of them it contains (a simple stand-in for vector search) */
  keys: string[];
  answer?: { doc: string; text: string };
  /** what comes out when only this (misleading) document is given */
  trap?: { doc: string; text: string };
  /** what the model makes up when no documents are given (illustrative) */
  madeUp: string;
};
export const QUESTIONS: Question[] = [
  {
    key: "date",
    q: "When is the 2026 Star Fest?",
    keys: ["2026", "Star", "festival"],
    answer: { doc: "fest", text: "It's on Friday, November 6." },
    trap: { doc: "old", text: "It's on Friday, November 7." },
    madeUp: "It's on Friday, October 16!",
  },
  {
    key: "booth",
    q: "On festival day, what hours are the class booths open?",
    keys: ["festival", "booth", "open", "hours"],
    answer: { doc: "fest", text: "They're open from 10 a.m. to 2:30 p.m." },
    madeUp: "From 9 a.m. to 4 p.m.!",
  },
  {
    key: "lib",
    q: "Until what time is the library open?",
    keys: ["library", "hours"],
    answer: { doc: "lib", text: "Until 5 p.m. on weekdays, and until 7 p.m. during exam weeks." },
    madeUp: "Until 6 p.m.!",
  },
  {
    key: "trip",
    q: "Where is the class trip going?",
    keys: ["class trip", "place"],
    madeUp: "To Washington, D.C.!",
  },
];

export const scoreDoc = (q: Question, d: Doc) => q.keys.filter((k) => d.title.includes(k) || d.text.includes(k));

// Scene: four documents and their (illustrative) closeness to the question vector, best first.
export const SCENE_Q = "When's our school fest?";
export const SCENE_DOCS = [
  { title: "2026 Star Fest", sim: 0.86, c: "yellow" as const },
  { title: "Library hours", sim: 0.31, c: "sky" as const },
  { title: "November lunch", sim: 0.24, c: "mint" as const },
  { title: "Winter PE uniform", sim: 0.12, c: "violet" as const },
];

export const ch88: ChapterSpec = {
  id: 88,
  part: 10,
  title: "Look it up, then answer",
  core: false,
  hook: "How do you ask an AI about something it never learned, like the date of your school festival?",
  steps: [
    { id: "s1", sec: 9, narration: "Let's ask the model when our school festival is. A model only knows text it saw in training. It has never seen our school's notices." },
    { id: "s2", sec: 7, narration: "But it still continues with the next piece, so it can make up a plausible date. That's the hallucination from chapter 84." },
    { id: "s3", sec: 7, narration: "The fix is simple: look it up before answering! Search the pile of school documents for ones related to the question." },
    { id: "s4", sec: 8, narration: "Turn the question and documents into vectors and pick the closest (chapter 8). The festival notice is the closest." },
    { id: "s5", sec: 8, narration: "Put the found document and the question into the model as one text, along with the request 'Answer using the document.'" },
    { id: "s6", sec: 8, narration: "Now the model just copies the date written in the document. It can even cite which document it used as its source." },
    { id: "s7", sec: 9, narration: "This is retrieval-augmented generation, or RAG, a name from 2020. It uses new information without retraining the model." },
    { id: "s8", sec: 9, narration: "But if the document is wrong, so is the answer. Find last year's notice and you get last year's date. So check the source yourself." },
  ],
  playgroundTitle: "Search, then answer",
  playgroundIntro: "Pick a question and search the school documents. Choose which documents go into the prompt and get an answer. Watch out for a trap document!",
  summary: [
    "A model only knows text it saw in training. Ask it something else, and it may make things up (hallucination, ch. 84).",
    "RAG: search for documents close to the question, put them in the prompt with it, and have the model answer.",
    "An answer with a source is still wrong if the document is wrong. Check the source yourself.",
  ],
  unlocks: "Look it up, then answer",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "Why doesn't the model know the date of our school festival?",
      choices: ["That information wasn't in the text it saw in training", "Because dates are numbers", "Because the question is too short"],
      answer: 0,
      explain: "A model only knows what was in its training data. It still keeps writing, so it can make things up (chapter 84).",
      review: "s1",
    },
    {
      q: "In RAG, where do the documents it finds go?",
      choices: ["Into changing the model's parameters", "Into the prompt (the input text), along with the question", "At the very end, after the answer"],
      answer: 1,
      explain: "The found documents go in as one text with the question. The model isn't retrained.",
      review: "s5",
    },
    {
      q: "An answer cites a source, but the source is last year's notice. What then?",
      choices: ["It has a source, so it must be right", "The model fixes it to this year's date by itself", "The document is wrong, so the answer may be wrong. Check the source"],
      answer: 2,
      explain: "The model trusts the documents you give it. If the found document is wrong, so is the answer.",
      review: "s8",
    },
  ],
  labels: {
    tag: "88. Look it up, then answer",
    q: "When's our school fest?",
    model: "Model",
    seen: "Text seen in training",
    notice: "School notice",
    noticeTitle: "2026 Star Fest",
    never: "Never seen it",
    madeUp: "Friday, October 16!",
    halluc: "Plausible but made up = hallucination (ch. 84)",
    pile: "A pile of school documents",
    search: "Search",
    closeness: "Closest to the question first (ch. 8)",
    example: "* illustrative example",
    promptTitle: "Text going into the model",
    docTag: "[Document] 2026 Star Fest",
    docText: "The 2026 Star Fest is on Friday, November 6.",
    ask: "Answer using the document above.",
    qLine: "Question: When's our school fest?",
    answer: "Friday, November 6.",
    date: "Friday, November 6",
    docPre: "The 2026 Star Fest is on",
    docPost: ".",
    source: "Source: 2026 Star Fest",
    copy: "Copy what's written",
    rag: "The name: RAG (2020)",
    r: "R = Retrieval (searching)",
    a: "A = Augmented (added to the prompt)",
    g: "G = Generation (writing the answer)",
    step1: "① Search",
    step2: "② Paste in",
    step3: "③ Answer",
    same: "Same model, new information!",
    oldTitle: "2025 Star Fest thank-you",
    oldText: "The 2025 Star Fest was held on Friday, November 7.",
    lastYear: "Old notice!",
    oldAnswer: "Friday, November 7.",
    oldSource: "Source: 2025 Star Fest thank-you",
    wrongDoc: "Wrong document, wrong answer",
    checkIt: "Open the source and check",
  },
};
