import type { ChapterSpec } from "../../../data/types";

export type Msg = { me: boolean; text: string };

// The chat in the scene. In the picture the window holds five speech bubbles (illustrative; real windows count tokens).
export const CHAT: Msg[] = [
  { me: true, text: "Hi! My name is Mia." },
  { me: false, text: "Nice to meet you! How can I help?" },
  { me: true, text: "Recommend a movie for the weekend." },
  { me: false, text: "How about an animated movie?" },
  { me: true, text: "What popcorn tastes best?" },
  { me: false, text: "Caramel popcorn is a big favorite." },
  { me: true, text: "What was my name again?" },
];
export const GUESS = "Hmm… is it Ava, maybe?";
export const WINDOW_SLOTS = 5;

export const GPT3_CTX = 2048;
export const GPT3_CELLS = GPT3_CTX * GPT3_CTX; // 4,194,304 ≈ about 4.2 million

// s6–s7: generating after "I walk to" (the greedy loop from ch80)
export const KV_TOKENS = ["I", "walk", "to", "school", "and", "meet"];
export const KV_PROMPT = 3;
export const KV_ROUNDS = 4; // rows: 3, 4, 5, 6 tokens
export const noCache = (m: number, n: number) => n * m + (n * (n - 1)) / 2; // 3+4+5+6 = 18
export const withCache = (m: number, n: number) => m + (n - 1); // 3+1+1+1 = 6

// playground: extra turns the student can add (user message + canned reply)
export const TURNS: { label: string; me: string; ai: string }[] = [
  { label: "Movie", me: "Recommend a movie for the weekend.", ai: "How about an animated movie?" },
  { label: "Popcorn", me: "What popcorn tastes best?", ai: "Caramel popcorn is a big favorite." },
  { label: "Homework", me: "Can you help with my math homework?", ai: "Sure, which problem is it?" },
  { label: "Picnic", me: "Can I go on a picnic tomorrow?", ai: "Check the weather forecast first." },
  { label: "Song", me: "Pick an upbeat song for me.", ai: "I'll find a good song for working out." },
];

export const ch83: ChapterSpec = {
  id: 83,
  part: 9,
  title: "The AI's memory limit",
  core: false,
  hook: "In a long chat, ChatGPT sometimes forgets what you said at the start. Why?",
  steps: [
    { id: "s1", sec: 7, narration: "As we saw in chapter 77, a chat is one long text to the model. But there's a limit to how much it can read at once." },
    { id: "s2", sec: 8, narration: "That limit is called the context window. GPT-3 could see up to 2,048 tokens. Only text inside the window is used to predict." },
    { id: "s3", sec: 7, narration: "As the chat grows, every new message pushes the oldest one out of the window." },
    { id: "s4", sec: 9, narration: "Now ask for your name. It's outside the window, so the model can't see it. It may say it doesn't know, or invent one (chapter 84)." },
    { id: "s5", sec: 9, narration: "A bigger window is costly. Attention scores every pair of pieces (chapter 47), so double the length means four times the table." },
    { id: "s6", sec: 9, narration: "When writing, each new piece needs the Key and Value of every earlier piece (chapter 46). Recomputing them each time is wasteful." },
    { id: "s7", sec: 9, narration: "The KV cache reuses Key·Value notes already computed. Earlier pieces never look ahead (chapter 51), so their values don't change." },
    { id: "s8", sec: 8, narration: "But the notes pile up as the chat grows and take up memory. In a long chat, it helps to repeat the important parts." },
  ],
  playgroundTitle: "Memory window simulator",
  playgroundIntro: "Keep the chat going, then press 'What was my name?' and try changing the window size. Below, count the work the KV cache saves.",
  summary: [
    "Context window: how many tokens the model can see at once. GPT-3: 2,048 tokens.",
    "Past the window, the oldest words get pushed out first, and the model can no longer see them.",
    "KV cache: keep notes of the Keys and Values already computed and reuse them to answer faster.",
  ],
  unlocks: "Context window · KV cache",
  unlockLabel: "You got a new inference tool",
  quiz: [
    {
      q: "What happens when a chat gets longer than the context window?",
      choices: ["The model sums up the whole chat and remembers it", "The oldest part is pushed out of the window and can't be seen", "The chat ends by itself"],
      answer: 1,
      explain: "The model can see only the text inside the window. To the model, the part that was pushed out doesn't exist.",
      review: "s3",
    },
    {
      q: "If the number of pieces doubles, what happens to the number of cells in the attention score table?",
      choices: ["4 times as many", "2 times as many", "No change"],
      answer: 0,
      explain: "The table is as wide and as tall as the number of pieces, so 2 × 2 = 4 times as many cells.",
      review: "s5",
    },
    {
      q: "What does the KV cache reuse?",
      choices: ["Questions the user asked before", "Internet search results", "The Keys and Values already computed for the earlier pieces"],
      answer: 2,
      explain: "The Key and Value of an earlier piece don't change when new pieces are added, so they can be saved and reused.",
      review: "s7",
    },
  ],
  labels: {
    tag: "83. The AI's memory limit",
    longText: "The whole chat = one long text (ch. 77)",
    window: "Context window",
    gpt3: "GPT-3: 2,048 tokens",
    toy: "5 bubbles in this picture (illustrative)",
    out: "Outside the window = invisible",
    here: "Right here…",
    mayMake: "It may invent one! (ch. 84)",
    me: "Me",
    ai: "AI",
    t4: "4 pieces",
    t8: "8 pieces",
    c16: "16 cells",
    c64: "64 cells",
    x4: "2× as long → 4× the cells",
    big: "2,048 pieces → 4.2 million cells",
    every: "In every layer, in every head!",
    round: "#",
    calc: "computed fresh",
    memo: "taken from the memo",
    noCacheSum: "No cache: 3 + 4 + 5 + 6 = 18 times",
    cacheSum: "KV cache: 3 + 1 + 1 + 1 = 6 times",
    cacheN: "6 times",
    kv: "Computing Key·Value",
    why: "Earlier pieces don't look ahead (ch. 51)",
    cacheName: "KV cache = memo pad",
    stack: "The memo keeps growing",
    full: "Memory full!",
    tipTitle: "Tips for long chats",
    tip1: "Repeat what matters",
    tip2: "New topic, new chat",
    tokens: "tokens",
  },
};
