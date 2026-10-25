import type { ChapterSpec } from "../../../data/types";

export type Era = {
  year: string;
  title: string;
  desc: string;
  kind: "learn" | "rule" | "event" | "winter" | "star";
  step: string;
};

// Spacing on the scene is by order, not to scale; years are written on every card.
export const ERAS: Era[] = [
  { year: "1950", title: "Turing: Can machines think?", desc: "Alan Turing asks a question", kind: "event", step: "s1" },
  { year: "1956", title: "\"Artificial intelligence\" gets its name", desc: "Dartmouth workshop, USA", kind: "event", step: "s2" },
  { year: "1958", title: "Perceptron: a machine that learns", desc: "Rosenblatt. Same idea as ch. 16's single neuron", kind: "learn", step: "s2" },
  { year: "1970s", title: "The first AI winter", desc: "It failed at simple problems, and hopes faded", kind: "winter", step: "s3" },
  { year: "1980s", title: "Expert systems", desc: "AI with rules typed in by hand", kind: "rule", step: "s3" },
  { year: "1986", title: "Backpropagation catches on", desc: "A way to train many-layer networks (ch. 23)", kind: "learn", step: "s4" },
  { year: "~1990", title: "The second AI winter", desc: "Limits of rule-based AI become clear", kind: "winter", step: "s4" },
  { year: "1997", title: "Deep Blue beats the chess champion", desc: "Rules plus massive computation to weigh moves", kind: "rule", step: "s4" },
  { year: "2012", title: "The deep learning era begins", desc: "Neural nets crush a photo-recognition contest", kind: "learn", step: "s5" },
  { year: "2016", title: "AlphaGo beats Go master Lee Sedol", desc: "4 wins, 1 loss, in Seoul", kind: "learn", step: "s5" },
  { year: "2017", title: "The transformer is published", desc: "\"Attention Is All You Need\" (ch. 44)", kind: "star", step: "s6" },
  { year: "2018", title: "GPT-1", desc: "Generative Pre-trained Transformer", kind: "learn", step: "s6" },
  { year: "2020", title: "GPT-3", desc: "A model made of 175 billion numbers", kind: "learn", step: "s6" },
  { year: "2022", title: "ChatGPT launches", desc: "Nov 30. 1 million users in 5 days", kind: "star", step: "s7" },
];

export const ORDER_ITEMS = [
  { key: "turing", label: "Turing asked, \"Can machines think?\"", year: "1950" },
  { key: "perceptron", label: "The perceptron, a machine that learns, appeared", year: "1958" },
  { key: "deepblue", label: "Deep Blue beat the chess champion", year: "1997" },
  { key: "alphago", label: "AlphaGo beat Go master Lee Sedol", year: "2016" },
  { key: "transformer", label: "The transformer was published", year: "2017" },
  { key: "chatgpt", label: "ChatGPT was released", year: "2022" },
];

export const ch03: ChapterSpec = {
  id: 3,
  part: 0,
  title: "70 years of AI on a timeline",
  core: false,
  hook: "Did AI suddenly appear out of nowhere along with ChatGPT?",
  steps: [
    { id: "s1", sec: 9, narration: "AI didn't appear out of nowhere. Its story goes back more than 70 years. In 1950, Alan Turing asked, \"Can machines think?\"" },
    { id: "s2", sec: 8, narration: "In 1956, \"artificial intelligence\" got its name. In 1958 came the perceptron, a machine that could learn by itself." },
    { id: "s3", sec: 9, narration: "But perceptrons failed at simple problems, hopes faded, and research froze. That's called an \"AI winter\". Rule-based AI took over." },
    { id: "s4", sec: 9, narration: "In 1986, backpropagation spread, but another winter came. In 1997, Deep Blue beat the chess champion with rules and raw computing." },
    { id: "s5", sec: 8.5, narration: "In 2012, a neural network crushed a photo-recognition contest and the deep learning era began. In 2016, AlphaGo beat Lee Sedol." },
    { id: "s6", sec: 9.5, narration: "In 2017, a Google team published the transformer, the T in GPT. GPT-1 came in 2018, then GPT-3 in 2020, with 175 billion numbers." },
    { id: "s7", sec: 9.5, narration: "Then, on November 30, 2022, ChatGPT arrived. A million people used it within five days. Let's open up this machine, piece by piece." },
  ],
  playgroundTitle: "Put the timeline in order",
  playgroundIntro: "Tap the events in order, starting with the one that happened first.",
  summary: [
    "A story of more than 70 years, starting with Turing's question in 1950.",
    "Hope and disappointment (AI winters) took turns, until deep learning leaped ahead in 2012.",
    "2017 transformer → GPT → 2022 ChatGPT.",
  ],
  unlocks: "2017 transformer",
  unlockLabel: "You collected the timeline cards",
  quiz: [
    {
      q: "What does the \"T\" in ChatGPT stand for?",
      choices: ["Talk", "Transformer", "Turing"],
      answer: 1,
      explain: "GPT = Generative Pre-trained Transformer. It uses the transformer design published in 2017.",
      review: "s6",
    },
    {
      q: "What is an \"AI winter\"?",
      choices: ["A time when AI only worked in winter", "A time when hopes faded and research shrank a lot", "A time when AI predicted the weather"],
      answer: 1,
      explain: "When results didn't live up to big hopes, interest and funding dried up. It happened twice.",
      review: "s3",
    },
    {
      q: "Which of these happened first?",
      choices: ["AlphaGo beat Lee Sedol", "The transformer was published", "ChatGPT was released"],
      answer: 0,
      explain: "AlphaGo 2016 → transformer 2017 → ChatGPT 2022.",
      review: "s5",
    },
  ],
  labels: {
    tag: "3. 70 years of AI on a timeline",
    learn: "learning",
    rule: "rules",
    winter: "winter",
    gpt: "the T in GPT",
    note: "Gaps between years are not to scale",
  },
};
