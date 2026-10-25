import type { ChapterSpec } from "../../../data/types";

export type View = { who: string; say: string };
export type Card = {
  key: string;
  title: string;
  c: "yellow" | "sky" | "mint" | "violet";
  /** scene: the question and three short viewpoints */
  q: string;
  sceneViews: string[];
  /** playground */
  story: string;
  views: View[];
  fact: string;
  talk: string;
};

export const CARDS: Card[] = [
  {
    key: "copy",
    title: "Copyright",
    c: "yellow",
    q: "Can AI learn from people's art? Who owns a picture an AI draws?",
    sceneViews: ["People learn from others' work too.", "Ask creators first, and pay them.", "What's the prompt writer's share?"],
    story: "Lily wants to enter a picture she made with AI in the school art contest.",
    views: [
      { who: "Illustrator", say: "If it learned from my pictures, it should ask me first and pay me." },
      { who: "AI developer", say: "People learn by looking at others' work too. I think learning itself is fine." },
      { who: "Lily", say: "I thought hard about the prompt and fixed it many times, so my effort is in it too." },
      { who: "Contest judge", say: "Entrants should say whether they used AI, and the rules should be set in advance." },
    ],
    fact: "In the U.S., the Copyright Office has said copyright protects only work made by humans. Many countries are still debating how to treat things AI makes.",
    talk: "If you ran the contest, what rules would you make about AI pictures?",
  },
  {
    key: "bias",
    title: "Bias",
    c: "sky",
    q: "If the data leans one way, so does the AI. What should we do?",
    sceneViews: ["Collect balanced data and fix it.", "Who decides what's 'fair'?", "Sometimes showing reality is right."],
    story: "You ask an AI for ten pictures of 'a doctor', and all ten show the same gender.",
    views: [
      { who: "AI developer", say: "We should collect more balanced data, check the results and fix them." },
      { who: "Statistician", say: "Sometimes it's right to show the real-world proportions as they are." },
      { who: "User", say: "Who decides what's 'fair'? I'd like that process to be open, too." },
      { who: "Student", say: "When I read an AI's answer, I should stop and ask: could this be biased?" },
    ],
    fact: "A model learns the patterns in its training data as they are (chapter 4). The more often something appears in the data, the more often it shows up in the results.",
    talk: "What questions could you ask to find out whether an AI's answer is biased?",
  },
  {
    key: "privacy",
    title: "Privacy",
    c: "mint",
    q: "Where do the things I type in a chat, and my friends' photos, go?",
    sceneViews: ["It's handy, so ask it anything.", "Friends' info needs their OK first.", "Check the saving and training settings."],
    story: "Liam wants to upload a group photo of his friends and ask the AI to say who's who.",
    views: [
      { who: "Liam", say: "It's handy. I just get an answer and that's it. What's the problem?" },
      { who: "Friend in the photo", say: "I want to know where my face and name get stored. Ask me first." },
      { who: "Service company", say: "Chats may be saved or used to improve the service, so we say so in our terms and settings." },
      { who: "Teacher", say: "Before you upload, ask yourself: is this someone else's information?" },
    ],
    fact: "Services differ in how long they keep chats and whether they use them for training. Some let you turn that off in the settings. A face or name that identifies someone is personal information too.",
    talk: "If our class made rules for what we can and can't put into an AI, what would they be?",
  },
  {
    key: "career",
    title: "Careers",
    c: "violet",
    q: "If AI takes over some work, what should I get ready for?",
    sceneViews: ["Many jobs will disappear.", "Many new jobs will appear, too.", "Skill with AI will matter more."],
    story: "Zoe dreams of drawing comics, but seeing AI draw pictures has made her worried.",
    views: [
      { who: "A worried person", say: "There may be fewer jobs for people who draw." },
      { who: "A hopeful person", say: "With AI as a tool, one person can make far more work." },
      { who: "Working artist", say: "Writing the story and connecting with readers will still be mostly up to people." },
      { who: "Career counselor", say: "Whatever you do, understanding and using AI will help." },
    ],
    fact: "Experts disagree about how AI will affect jobs. Some think the way people work will change more often than jobs disappear outright.",
    talk: "In your dream job, which tasks could AI help with, and which must you do yourself?",
  },
];

/** Part 10 recap: what each chapter added (the unlock of each chapter). */
export const ABILITIES = [
  { ch: 86, t: "Patch tokens", c: "yellow" as const },
  { ch: 87, t: "Working it out", c: "mint" as const },
  { ch: 88, t: "Look it up, then answer", c: "sky" as const },
  { ch: 89, t: "Using tools", c: "orange" as const },
  { ch: 90, t: "Model compression", c: "violet" as const },
  { ch: 91, t: "Living with AI", c: "pink" as const },
];

export const ch91: ChapterSpec = {
  id: 91,
  part: 10,
  title: "AI and us",
  core: false,
  hook: "Who owns a picture an AI drew? And what should I get ready for in the age of AI?",
  steps: [
    { id: "s1", sec: 8, narration: "AI can now see, reason, look things up and even use tools. How that power is used is up to people. Let's lay out some discussion cards." },
    { id: "s2", sec: 9, narration: "One: copyright. AI learned from people's text and pictures. Some say 'people learn by looking too', others 'ask and pay first'." },
    { id: "s3", sec: 9, narration: "Two: bias. If the data leans one way, the model learns that too (chapter 4). If we fix it, who decides what's 'fair'?" },
    { id: "s4", sec: 9, narration: "Three: privacy. Where do your chats or a friend's photo go? Each service stores and uses them differently, so check." },
    { id: "s5", sec: 9, narration: "Four: careers. If AI does some work, how will jobs change? Predictions differ about which jobs will go and which will appear." },
    { id: "s6", sec: 8, narration: "None of the four cards has one right answer. But knowing how AI works helps you ask better questions and judge better." },
    { id: "s7", sec: 8, narration: "In Part 10, AI gained eyes, working, search, tools and a place in your phone. In Part 11, you build your own mini GPT!" },
  ],
  playgroundTitle: "Discussion cards",
  playgroundIntro: "Pick a card and react to each person's view: agree, not sure, or disagree. There are no right answers. It's even better to talk it over with friends.",
  summary: [
    "Copyright, bias, privacy, careers: questions without a single right answer.",
    "Bias comes from data. Think twice before putting your own or a friend's information into an AI.",
    "Part 10: eyes (patches), working, search (RAG), tools, compression. Next, Part 11: your own mini GPT!",
  ],
  unlocks: "Living with AI",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "What is the biggest reason an AI gives biased answers?",
      choices: ["Its training data leans one way", "The AI takes sides on purpose", "The computer is slow"],
      answer: 0,
      explain: "A model learns the patterns in its data as they are (chapter 4). If the data leans, the answers can lean too.",
      review: "s3",
    },
    {
      q: "What should you think about before uploading a friend's photo to a chat AI?",
      choices: ["AI forgets everything right away", "Depending on the service it may be stored or used, and your friend should agree", "Photos aren't personal information"],
      answer: 1,
      explain: "Each service stores things differently. A photo that identifies someone is that person's personal information.",
      review: "s4",
    },
    {
      q: "From Part 10, which method finds documents, puts them in the prompt and has the model answer?",
      choices: ["Quantization", "ViT", "RAG (look it up, then answer)"],
      answer: 2,
      explain: "RAG puts the documents it found in with the question to give answers with sources (chapter 88).",
      review: "s7",
    },
  ],
  labels: {
    tag: "91. AI and us",
    cards: "Discussion cards",
    weDecide: "We decide how to use it",
    n1: "①",
    n2: "②",
    n3: "③",
    n4: "④",
    some: "One view",
    other: "Another view",
    another: "Yet another view",
    me: "What do you think?",
    biasEx: "e.g. What if every 'doctor' picture showed one gender?",
    noOne: "No one right answer",
    know: "Knowing how it works helps you ask better questions",
    recap: "Abilities from Part 10",
    next: "Next: Part 11, build your own mini GPT!",
    c: "C",
  },
};
