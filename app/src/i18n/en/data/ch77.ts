import type { ChapterSpec } from "../../../data/types";

// Scene: a three-bubble chat, the hidden system prompt, and the answer the model writes next.
export type Turn = { role: "user" | "bot"; words: string[] };
export const SYSTEM = ["You're", "a", "helpful", "assistant."];
export const TURNS: Turn[] = [
  { role: "user", words: ["Hi!", "Help", "with", "my", "homework?"] },
  { role: "bot", words: ["Sure!", "What", "homework?"] },
  { role: "user", words: ["What's", "photosynthesis?"] },
];
export const REPLY = ["It's", "how", "plants", "make", "food", "from", "sunlight."];
// next-piece candidates at the open assistant slot (illustrative)
export const NEXT = [
  { w: "It's", p: 0.61 },
  { w: "Plants", p: 0.22 },
  { w: "Good", p: 0.09 },
  { w: "other", p: 0.08 },
];

// ChatML-style example ("for example, it looks like this"): [marker, text] per line
export const CHATML: [string, string][] = [
  ["<|im_start|>system", ""],
  ["", "You're a helpful assistant."],
  ["<|im_start|>user", ""],
  ["", "Hi! Help with my homework?"],
  ["<|im_start|>assistant", ""],
  ["", "Sure! What homework?"],
  ["<|im_start|>user", ""],
  ["", "What's photosynthesis?"],
  ["<|im_start|>assistant", ""],
];
export const IM_END = "<|im_end|>";

/** Playground: system prompts × user messages → illustrative replies */
export const SYSTEMS = [
  { key: "kind", name: "Kind helper", text: "You're a kind helper. Explain things at a high school level." },
  { key: "short", name: "One-sentence helper", text: "You're a helper who answers in one sentence only." },
  { key: "eng", name: "Spanish teacher", text: "You're a Spanish teacher. After answering, teach one Spanish phrase." },
];
export const MESSAGES = [
  {
    text: "What's photosynthesis?",
    reply: {
      kind: "Photosynthesis is how plants use sunlight to turn water and carbon dioxide into food. Oxygen comes out too.",
      short: "It's how plants make food from sunlight.",
      eng: "It's how plants make food from sunlight. In Spanish, it's 'fotosíntesis'.",
    } as Record<string, string>,
    noMarker: " And how is it different from breathing?",
  },
  {
    text: "What should I do this weekend?",
    reply: {
      kind: "If the weather's nice, how about a walk or a bike ride with friends? If it rains, you could watch a movie you've been wanting to see.",
      short: "Take a walk in a nearby park.",
      eng: "I'd suggest a walk in the park. In Spanish, 'to take a walk' is 'dar un paseo'.",
    } as Record<string, string>,
    noMarker: " Also tell me places I could go with friends.",
  },
  {
    text: "Thanks!",
    reply: {
      kind: "You're welcome! Ask me anytime you're curious about something.",
      short: "You're welcome.",
      eng: "You're welcome! In Spanish, that's 'de nada'.",
    } as Record<string, string>,
    noMarker: " I finished my homework thanks to you!",
  },
];

export const ch77: ChapterSpec = {
  id: 77,
  part: 8,
  title: "A chat is really one long document",
  core: false,
  hook: "How does ChatGPT tell what I said from what it said?",
  steps: [
    { id: "s1", sec: 7, narration: "On the chat screen, bubbles go back and forth. I ask, ChatGPT answers, and I ask again." },
    { id: "s2", sec: 7, narration: "But inside the model there are no bubbles. The whole chat is joined into one long text." },
    { id: "s3", sec: 8.5, narration: "Special marker tokens are slipped in to show who said what, like 'the user starts here' and 'the assistant starts here'." },
    { id: "s4", sec: 9, narration: "At the very front goes a system prompt that users never see. It sets the role and tone the model should keep." },
    { id: "s5", sec: 8, narration: "For example, it looks like this. The markers look different for each company and model, but the idea is the same." },
    { id: "s6", sec: 9, narration: "The text ends with an 'assistant's turn' marker and an empty spot. The model just predicts the next piece, like in chapter 1." },
    { id: "s7", sec: 9, narration: "When done, it writes the end marker and stops (chapter 2). Chapter 73's model answers had this shape, so an answer comes here." },
    { id: "s8", sec: 8, narration: "The longer the chat, the longer this text. The model rereads the whole conversation every time. More in chapter 83." },
  ],
  playgroundTitle: "The text the model sees",
  playgroundIntro: "Pick a system prompt and send messages. Switch between the chat screen and 'the text the model sees' to watch the bubbles turn into one long text.",
  summary: [
    "A chat goes into the model as one long text, divided by marker tokens.",
    "The system prompt at the very front is an instruction the user can't see.",
    "At the 'assistant's turn' spot at the end, the model just continues with the next piece.",
  ],
  unlocks: "Chat template",
  unlockLabel: "You learned one of ChatGPT's secrets",
  quiz: [
    {
      q: "What does a chat look like when it goes into the model?",
      choices: ["Still in bubbles", "One long text divided by marker tokens", "Just the last question"],
      answer: 1,
      explain: "Bubbles exist only on the screen. The model reads one long text with marker tokens in it.",
      review: "s3",
    },
    {
      q: "Which is true about the system prompt?",
      choices: ["It's added after the model finishes answering", "Users have to type it every time", "It sits at the front and sets the model's role and tone"],
      answer: 2,
      explain: "Users can't see it, but it sits at the very front of the text, so it shapes what the model writes next.",
      review: "s4",
    },
    {
      q: "If the 'assistant's turn' marker is missing at the end, what might happen?",
      choices: ["The model might keep writing the user's message", "The model answers more accurately", "No difference"],
      answer: 0,
      explain: "The model only continues text plausibly, so without the marker it may keep writing the user's sentence (ch. 72).",
      review: "playground",
    },
  ],
  labels: {
    tag: "77. A chat is really one long document",
    me: "Me",
    bot: "ChatGPT",
    who: "Who said what?",
    oneDoc: "One long text",
    user: "user",
    assistant: "assistant",
    system: "system",
    end: "end",
    markers: "Marker tokens",
    markerList: "= user / assistant / end",
    hidden: "Users can't see this",
    sysPrompt: "System prompt",
    shape: "For example, it looks like this",
    chatml: "(ChatML format. The markers look different for each company and model)",
    empty: "Empty spot",
    nextPiece: "Next piece?",
    same1: "Same game as ch. 1!",
    example: "illustrative example",
    stop: "Stops at the end marker (ch. 2)",
    sft: "Ch. 73's model answers use this shape",
    grows: "Longer chat, longer text",
    reread: "It rereads it all, every time",
    turn: "turn",
    ch83: "ch. 83",
  },
};
