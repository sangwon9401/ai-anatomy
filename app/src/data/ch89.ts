import { DOCS } from "./ch88";
import type { ChapterSpec } from "./types";

// Scene numbers: 4837 × 2961 = 14,322,357. The model's guess without a calculator is made up (설명용 예시).
export const MUL = { a: 4837, b: 2961, product: 4837 * 2961, guess: "14,328,557" };

export type Tool = "calc" | "search";
export type AgentEvent = { t: "think" | "answer"; text: string } | { t: "call"; tool: Tool; arg: string };
export type Task = { key: string; title: string; q: string; events: AgentEvent[]; guess: string };

/** Playground tasks. The program (the student) runs each tool call; results are computed live. */
export const TASKS: Task[] = [
  {
    key: "tteok",
    title: "떡볶이 값",
    q: "반 친구 27명이 1인분 4,500원짜리 떡볶이를 먹어요. 학급비 120,000원으로 충분할까요?",
    events: [
      { t: "think", text: "먼저 떡볶이 값을 모두 더해야 해요." },
      { t: "call", tool: "calc", arg: "27 × 4500" },
      { t: "think", text: "120,000원보다 많네요. 모자란 돈을 계산해 볼게요." },
      { t: "call", tool: "calc", arg: "121500 − 120000" },
      { t: "answer", text: "모두 121,500원이라, 학급비로는 1,500원이 모자라요." },
    ],
    guess: "학급비로 충분해요!",
  },
  {
    key: "big",
    title: "큰 곱셈",
    q: "4837 × 2961은 얼마예요?",
    events: [
      { t: "think", text: "큰 수 곱셈은 계산기로 정확하게 해요." },
      { t: "call", tool: "calc", arg: "4837 × 2961" },
      { t: "answer", text: "4837 × 2961 = 14,322,357이에요." },
    ],
    guess: "14,328,557이에요.",
  },
  {
    key: "booth",
    title: "축제 부스 시간",
    q: "별빛제에서 우리 반 부스는 몇 시간 동안 운영해요?",
    events: [
      { t: "think", text: "학교 축제 안내문을 찾아봐야 해요." },
      { t: "call", tool: "search", arg: "별빛제 부스 운영 시간" },
      { t: "think", text: "오전 10시부터 오후 2시 30분까지래요. 오후 2시 30분은 14.5시니까 빼 볼게요." },
      { t: "call", tool: "calc", arg: "14.5 − 10" },
      { t: "answer", text: "4.5시간, 그러니까 4시간 30분 동안 운영해요. (출처: 2026 별빛제 안내)" },
    ],
    guess: "4시간 동안 운영해요.",
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

/** A tiny search over the school documents of 88장: the document sharing the most query words wins. */
export function search(query: string) {
  const words = query.split(/\s+/).filter(Boolean);
  let best: { title: string; text: string; hits: number } | null = null;
  for (const d of DOCS) {
    const hits = words.filter((w) => d.title.includes(w) || d.text.includes(w)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { title: d.title, text: d.text, hits };
  }
  return best;
}

export const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("ko-KR") : String(n));

// scene strips (pieces of the running text)
export const STRIP_CALC = { q: "4837 × 2961은?", call: "계산기(4837 × 2961)", result: "→ 14,322,357", answer: ["답은", "14,322,357이에요."] };
export const STRIP_SEARCH = { q: "별빛제는 언제야?", call: "검색(별빛제 날짜)", result: "→ 11월 6일(금)", answer: ["11월 6일", "금요일이에요."] };

export const ch89: ChapterSpec = {
  id: 89,
  part: 10,
  title: "손발이 생긴 AI",
  core: false,
  hook: "글만 쓰는 AI가 어떻게 계산기를 두드리고 검색까지 할까요?",
  steps: [
    { id: "s1", sec: 8, narration: "모델은 글만 쓸 줄 알아요. 4837 × 2961 같은 큰 곱셈은 틀리기 쉽고, 지금 바깥 날씨처럼 세상 소식은 알 수 없죠." },
    { id: "s2", sec: 8, narration: "그래서 약속을 정해요. 모델이 '계산기(4837 × 2961)'처럼 정해진 모양의 글을 쓰면, 도구를 불러 달라는 뜻이에요." },
    { id: "s3", sec: 8, narration: "모델을 감싼 프로그램이 이 글을 알아보고 이어 쓰기를 멈춰요. 그리고 진짜 계산기를 돌려 14,322,357을 얻어요." },
    { id: "s4", sec: 9, narration: "결과를 글 끝에 붙여서 다시 모델에 넣어요. 모델은 결과를 읽고 이어서 답을 써요. 2장의 '붙이고 다시'와 같아요." },
    { id: "s5", sec: 9, narration: "검색도 같은 방식이에요. '검색(…)'을 쓰면 프로그램이 찾아서 결과를 붙여 줘요. 88장의 RAG를 모델이 직접 부르는 셈이죠." },
    { id: "s6", sec: 8, narration: "생각하고, 도구를 부르고, 결과를 보고, 다시 생각하고. 이 고리를 여러 번 돌며 일을 끝내는 AI를 에이전트라고 해요." },
    { id: "s7", sec: 8, narration: "손발이 생긴 만큼 조심도 필요해요. 메일 보내기나 결제처럼 되돌리기 힘든 일은 사람이 확인한 뒤에 하도록 만들어요." },
  ],
  playgroundTitle: "에이전트 한 단계씩",
  playgroundIntro: "내가 모델을 감싼 프로그램이 되어 보세요. 모델이 도구를 부르면 알맞은 도구를 실행해서 결과를 붙여 줘요.",
  summary: [
    "모델이 정해진 모양의 글(도구 호출)을 쓰면, 프로그램이 멈추고 그 도구를 실행한다.",
    "도구의 결과를 글 끝에 붙여 다시 넣으면, 모델이 읽고 이어 쓴다.",
    "생각 → 도구 → 결과 고리를 여러 번 도는 AI가 에이전트. 중요한 일은 사람이 확인한다.",
  ],
  unlocks: "도구 사용",
  unlockLabel: "새 능력 카드를 하나 얻었어요",
  quiz: [
    {
      q: "모델이 '계산기(27 × 4500)'라고 쓰면 실제 계산은 누가 할까요?",
      choices: ["모델이 머릿속으로", "모델을 감싼 프로그램이 진짜 계산기로", "사용자가 직접"],
      answer: 1,
      explain: "모델은 글만 써요. 약속된 모양의 글을 프로그램이 알아보고 도구를 실행해요.",
      review: "s3",
    },
    {
      q: "도구의 결과는 어떻게 모델에게 전해질까요?",
      choices: ["글 끝에 붙여서 다시 입력으로 넣는다", "모델의 파라미터를 바꾼다", "전하지 않고 사용자에게만 보여 준다"],
      answer: 0,
      explain: "결과도 글 조각으로 붙여 넣어요. 2장의 '붙이고 다시'와 같아요.",
      review: "s4",
    },
    {
      q: "에이전트에게 결제를 맡길 때 알맞은 설계는?",
      choices: ["빠르게 혼자 다 하게 둔다", "결제는 아예 못 하게 막는 것만 가능하다", "되돌리기 힘든 일은 사람이 확인한 뒤에 하게 한다"],
      answer: 2,
      explain: "도구가 생긴 만큼 실수의 영향도 커져요. 중요한 일은 사람이 마지막에 확인해요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "89장 손발이 생긴 AI",
    q1: "4837 × 2961 = ?",
    a1: "14,328,557이에요.",
    q2: "지금 바깥 날씨는?",
    a2: "음… 알 수 없어요.",
    hard: "틀리기 쉬워요",
    blind: "바깥을 볼 수 없어요",
    textOnly: "모델 = 글만 쓰는 기계",
    example: "* 설명용 예시",
    model: "모델",
    promise: "약속된 모양 = 도구를 불러 달라는 신호",
    program: "프로그램",
    stop: "멈춤!",
    calc: "계산기",
    real: "진짜 계산",
    again: "붙이고 다시 (2장)",
    searchTool: "검색",
    rag: "88장 RAG를 모델이 직접 불러요",
    agent: "에이전트 (agent)",
    think: "생각",
    callTool: "도구 부르기",
    see: "결과 보기",
    done: "끝나면 → 답",
    loops: "고리를 여러 번!",
    mail: "메일 보내기",
    pay: "결제하기",
    ok: "바로 써도 돼요",
    human: "사람이 확인한 뒤에",
    careful: "되돌리기 힘든 일은 사람이 확인!",
    found: "2026 별빛제 안내",
    foundText: "11월 6일(금)에 열립니다",
  },
};
