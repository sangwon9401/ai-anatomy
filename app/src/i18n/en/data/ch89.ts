import { DOCS } from "../../../data/ch88";
import type { ChapterSpec } from "../../../data/types";

// Scene numbers: 4837 × 2961 = 14,322,357. The model's guess without a calculator is made up (illustrative).
export const MUL = { a: 4837, b: 2961, product: 4837 * 2961, guess: "14,328,557" };

export type Tool = "calc" | "search";
export type AgentEvent = { t: "think" | "answer"; text: string } | { t: "call"; tool: Tool; arg: string };
export type Task = { key: string; title: string; q: string; events: AgentEvent[]; guess: string };

/** Playground tasks. The program (the student) runs each tool call; results are computed live. */
export const TASKS: Task[] = [
  {
    key: "tteok",
    title: "Pizza for the class",
    q: "27 classmates each get a $4.50 slice of pizza. Is the $120 class fund enough?",
    events: [
      { t: "think", text: "First I need the total cost of the pizza." },
      { t: "call", tool: "calc", arg: "27 × 4.5" },
      { t: "think", text: "That's more than $120. Let me work out how much is missing." },
      { t: "call", tool: "calc", arg: "121.5 − 120" },
      { t: "answer", text: "It comes to $121.50, so the class fund is $1.50 short." },
    ],
    guess: "The class fund is enough!",
  },
  {
    key: "big",
    title: "Big multiplication",
    q: "What is 4837 × 2961?",
    events: [
      { t: "think", text: "For big multiplication, use a calculator to get it exactly right." },
      { t: "call", tool: "calc", arg: "4837 × 2961" },
      { t: "answer", text: "4837 × 2961 = 14,322,357." },
    ],
    guess: "It's 14,328,557.",
  },
  {
    key: "booth",
    title: "Festival booth hours",
    q: "At Star Fest, how many hours is our class booth open?",
    events: [
      { t: "think", text: "I should look up the school festival notice." },
      { t: "call", tool: "search", arg: "Star Fest booth hours" },
      { t: "think", text: "It says 10 a.m. to 2:30 p.m. In 24-hour time 2:30 p.m. is 14.5, so I'll subtract." },
      { t: "call", tool: "calc", arg: "14.5 − 10" },
      { t: "answer", text: "4.5 hours, so 4 hours and 30 minutes. (Source: 2026 Star Fest)" },
    ],
    guess: "It's open for 4 hours.",
  },
];

/** A tiny, safe calculator for "a op b" (no eval). */
export function calc(expr: string): number | null {
  const m = expr.replace(/,/g, "").match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-−×x*÷/])\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  switch (m[2]) {
    case "+":
      return a + b;
    case "-":
    case "−":
      return a - b;
    case "×":
    case "x":
    case "*":
      return a * b;
    default:
      return b === 0 ? null : a / b;
  }
}

/** A tiny search over the school documents of chapter 88: the document sharing the most query words wins. */
export function search(query: string) {
  const words = query.split(/\s+/).filter(Boolean);
  let best: { title: string; text: string; hits: number } | null = null;
  for (const d of DOCS) {
    const hits = words.filter((w) => d.title.includes(w) || d.text.includes(w)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { title: d.title, text: d.text, hits };
  }
  return best;
}

export const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-US") : String(n));

// scene strips (pieces of the running text)
export const STRIP_CALC = { q: "4837 × 2961?", call: "calculator(4837 × 2961)", result: "→ 14,322,357", answer: ["The answer is", "14,322,357."] };
export const STRIP_SEARCH = { q: "When is Star Fest?", call: "search(Star Fest date)", result: "→ Fri., Nov. 6", answer: ["Friday,", "Nov. 6."] };

export const ch89: ChapterSpec = {
  id: 89,
  part: 10,
  title: "AI with hands and feet",
  core: false,
  hook: "How can an AI that only writes text punch a calculator or even search the web?",
  steps: [
    { id: "s1", sec: 8, narration: "A model can only write text. It easily gets big products like 4837 × 2961 wrong, and can't know things like today's weather." },
    { id: "s2", sec: 8, narration: "So we make a deal: when the model writes text in a set shape, like 'calculator(4837 × 2961)', it means 'please call this tool'." },
    { id: "s3", sec: 8, narration: "The program around the model spots this text and stops the writing. Then it runs a real calculator and gets 14,322,357." },
    { id: "s4", sec: 9, narration: "The result goes on the end of the text and back into the model, which reads it and writes on. Like chapter 2: attach and repeat." },
    { id: "s5", sec: 9, narration: "Search works the same way: write 'search(…)' and the program attaches what it finds. The model calls chapter 88's RAG by itself." },
    { id: "s6", sec: 8, narration: "Think, call a tool, read the result, think again. An AI that goes round this loop many times to finish a job is called an agent." },
    { id: "s7", sec: 8, narration: "With hands and feet comes care. Things that are hard to undo, like sending email or paying, wait until a person checks." },
  ],
  playgroundTitle: "An agent, one step at a time",
  playgroundIntro: "You are the program around the model. When the model calls a tool, run the right tool and attach the result.",
  summary: [
    "When the model writes text in a set shape (a tool call), the program stops and runs that tool.",
    "The tool's result is attached to the end of the text and fed back in, and the model reads it and writes on.",
    "An AI that loops through think → tool → result many times is an agent. A person checks the important steps.",
  ],
  unlocks: "Using tools",
  unlockLabel: "You got a new ability card",
  quiz: [
    {
      q: "The model writes 'calculator(27 × 4.5)'. Who actually does the math?",
      choices: ["The model, in its head", "The program around the model, with a real calculator", "The user"],
      answer: 1,
      explain: "The model only writes text. The program recognizes text in the agreed shape and runs the tool.",
      review: "s3",
    },
    {
      q: "How does the tool's result get back to the model?",
      choices: ["It's attached to the end of the text and fed back in as input", "It changes the model's parameters", "It isn't; only the user sees it"],
      answer: 0,
      explain: "The result is attached as more pieces of text, just like chapter 2's 'attach and repeat'.",
      review: "s4",
    },
    {
      q: "You let an agent handle payments. Which design fits best?",
      choices: ["Let it do everything quickly on its own", "The only option is to block payments completely", "Things that are hard to undo happen only after a person checks"],
      answer: 2,
      explain: "With tools, mistakes matter more. For important steps, a person makes the final check.",
      review: "s7",
    },
  ],
  labels: {
    tag: "89. AI with hands and feet",
    q1: "4837 × 2961 = ?",
    a1: "It's 14,328,557.",
    q2: "Is it raining now?",
    a2: "Hmm… I can't tell.",
    hard: "Easy to get wrong",
    blind: "It can't see outside",
    textOnly: "Model = a machine that only writes text",
    example: "* illustrative example",
    model: "Model",
    promise: "A set shape = a signal to call a tool",
    program: "Program",
    stop: "Stop!",
    calc: "Calculator",
    real: "A real calculation",
    again: "Attach and repeat (ch. 2)",
    searchTool: "Search",
    rag: "The model calls ch. 88's RAG itself",
    agent: "Agent",
    think: "Think",
    callTool: "Call a tool",
    see: "Read result",
    done: "Done → answer",
    loops: "Round and round!",
    mail: "Send email",
    pay: "Pay",
    ok: "Fine to use right away",
    human: "Only after a person checks",
    careful: "Hard to undo? A person checks first!",
    found: "2026 Star Fest",
    foundText: "Friday, November 6",
  },
};
