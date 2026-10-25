import { DOCS } from "../../../data/ch88";
import type { ChapterSpec } from "../../../data/types";

// Scene numbers: 4837 × 2961 = 14,322,357. The model's guess without a calculator is made up (示意数据).
export const MUL = { a: 4837, b: 2961, product: 4837 * 2961, guess: "14,328,557" };

export type Tool = "calc" | "search";
export type AgentEvent = { t: "think" | "answer"; text: string } | { t: "call"; tool: Tool; arg: string };
export type Task = { key: string; title: string; q: string; events: AgentEvent[]; guess: string };

/** Playground tasks. The program (the student) runs each tool call; results are computed live. */
export const TASKS: Task[] = [
  {
    key: "tteok",
    title: "奶茶钱",
    q: "全班 27 位同学每人一杯 15 元的奶茶。班费 400 元够不够？",
    events: [
      { t: "think", text: "先把所有奶茶的钱加起来。" },
      { t: "call", tool: "calc", arg: "27 × 15" },
      { t: "think", text: "比 400 元多。算一算还差多少钱。" },
      { t: "call", tool: "calc", arg: "405 − 400" },
      { t: "answer", text: "一共 405 元，班费还差 5 元。" },
    ],
    guess: "班费够用！",
  },
  {
    key: "big",
    title: "大数乘法",
    q: "4837 × 2961 等于多少？",
    events: [
      { t: "think", text: "大数乘法用计算器算才准确。" },
      { t: "call", tool: "calc", arg: "4837 × 2961" },
      { t: "answer", text: "4837 × 2961 = 14,322,357。" },
    ],
    guess: "等于 14,328,557。",
  },
  {
    key: "booth",
    title: "文化节摊位时间",
    q: "星光节上，我们班的摊位开放几个小时？",
    events: [
      { t: "think", text: "得先找到学校文化节的通知。" },
      { t: "call", tool: "search", arg: "星光节 摊位 开放 时间" },
      { t: "think", text: "上午 10 点到下午 2 点 30 分。下午 2 点 30 分就是 14.5 点，减一下。" },
      { t: "call", tool: "calc", arg: "14.5 − 10" },
      { t: "answer", text: "开放 4.5 小时，也就是 4 小时 30 分钟。（出处：2026 星光节通知）" },
    ],
    guess: "开放 4 个小时。",
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

/** A tiny search over the school documents of ch88: the document sharing the most query words wins. */
export function search(query: string) {
  const words = query.split(/\s+/).filter(Boolean);
  let best: { title: string; text: string; hits: number } | null = null;
  for (const d of DOCS) {
    const hits = words.filter((w) => d.title.includes(w) || d.text.includes(w)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { title: d.title, text: d.text, hits };
  }
  return best;
}

export const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("zh-CN") : String(n));

// scene strips (pieces of the running text)
export const STRIP_CALC = { q: "4837 × 2961 = ？", call: "计算器(4837 × 2961)", result: "→ 14,322,357", answer: ["答案是", "14,322,357。"] };
export const STRIP_SEARCH = { q: "星光节是哪天？", call: "搜索(星光节 日期)", result: "→ 11 月 6 日周五", answer: ["11 月 6 日", "周五。"] };

export const ch89: ChapterSpec = {
  id: 89,
  part: 10,
  title: "长出手脚的 AI",
  core: false,
  hook: "只会写字的 AI，是怎么按计算器、还能上网搜索的？",
  steps: [
    { id: "s1", sec: 8, narration: "模型只会写字。4837 × 2961 这样的大数乘法很容易算错，现在外面的天气这类新消息它也无从知道。" },
    { id: "s2", sec: 8, narration: "所以要先约定好：模型写出“计算器(4837 × 2961)”这种固定格式的文字，就表示请求调用工具。" },
    { id: "s3", sec: 8, narration: "包着模型的程序认出这段文字，就让续写暂停，然后去运行真正的计算器，得到 14,322,357。" },
    { id: "s4", sec: 9, narration: "把结果接在文字末尾，再交给模型。模型读到结果，接着写出回答。这和第 2 章的“接上再来”一样。" },
    { id: "s5", sec: 9, narration: "搜索也一样。写下“搜索(…)”，程序就去查，再把结果接上。相当于模型自己调用第 88 章的 RAG。" },
    { id: "s6", sec: 8, narration: "思考、调用工具、看结果、再思考。像这样转好几圈把事情办完的 AI，叫作智能体（agent）。" },
    { id: "s7", sec: 8, narration: "有了手脚，也更需要小心。发邮件、付款这类难以撤回的事，要设计成先经过人确认再做。" },
  ],
  playgroundTitle: "智能体一步一步来",
  playgroundIntro: "你来当包着模型的程序。模型一调用工具，你就运行合适的工具，把结果接上去。",
  summary: [
    "模型写出固定格式的文字（工具调用），程序就暂停续写，去运行那个工具。",
    "把工具的结果接在文字末尾再输入，模型就会读到它并接着写。",
    "在“思考 → 工具 → 结果”里转好几圈的 AI 就是智能体。重要的事要由人来确认。",
  ],
  unlocks: "使用工具",
  unlockLabel: "又得到一张新能力卡",
  quiz: [
    {
      q: "模型写出“计算器(27 × 15)”，真正的计算是谁做的？",
      choices: ["模型在脑子里算", "包着模型的程序用真正的计算器算", "用户自己算"],
      answer: 1,
      explain: "模型只会写字。程序认出约定格式的文字，再去运行工具。",
      review: "s3",
    },
    {
      q: "工具的结果是怎样交给模型的？",
      choices: ["接在文字末尾，重新作为输入", "修改模型的参数", "不交给模型，只给用户看"],
      answer: 0,
      explain: "结果也作为文字片段接上去。这和第 2 章的“接上再来”一样。",
      review: "s4",
    },
    {
      q: "让智能体帮忙付款，合适的设计是？",
      choices: ["让它自己快速全部办完", "只能完全禁止它付款", "难以撤回的事，先经过人确认再做"],
      answer: 2,
      explain: "有了工具，出错的影响也更大。重要的事最后要由人来确认。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 89 章 长出手脚的 AI",
    q1: "4837 × 2961 = ?",
    a1: "等于 14,328,557。",
    q2: "外面天气如何？",
    a2: "嗯……我不知道。",
    hard: "容易算错",
    blind: "看不到外面",
    textOnly: "模型 = 只会写字的机器",
    example: "* 示意数据",
    model: "模型",
    promise: "约定的格式 = 请求调用工具的信号",
    program: "程序",
    stop: "暂停！",
    calc: "计算器",
    real: "真正计算",
    again: "接上再来（第 2 章）",
    searchTool: "搜索",
    rag: "模型自己调用第 88 章的 RAG",
    agent: "智能体（agent）",
    think: "思考",
    callTool: "调用工具",
    see: "看结果",
    done: "做完 → 回答",
    loops: "转好几圈！",
    mail: "发邮件",
    pay: "付款",
    ok: "可以直接用",
    human: "先经过人确认",
    careful: "难以撤回的事，要人来确认！",
    found: "2026 星光节通知",
    foundText: "将于 11 月 6 日（周五）举行",
  },
};
