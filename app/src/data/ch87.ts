import type { ChapterSpec } from "./types";

// The scene's word problem (a classic "fast answer is a trap" puzzle, in won).
export const PROBLEM = ["빵과 우유를 합쳐서 1,100원.", "빵은 우유보다 1,000원 비싸요.", "우유는 얼마일까요?"];
// First-piece candidates when the model must answer at once. Illustrative probabilities (설명용 예시).
export const FAST = [
  { w: "100원", p: 0.62, c: "pink" as const },
  { w: "50원", p: 0.24, c: "mint" as const },
  { w: "1,000원", p: 0.09, c: "sky" as const },
];
export const FAST_CHECK = ["우유 100원이면 빵은 1,100원", "100 + 1,100 = 1,200원", "≠ 1,100원"];
export const THINK = ["우유를 x원이라고 하면", "빵은 x + 1,000원", "x + (x + 1,000) = 1,100", "2x = 100, x = 50", "검산: 50 + 1,050 = 1,100"];

export type Problem = {
  key: string;
  title: string;
  q: string;
  choices: string[];
  fast: string;
  fastCheck: string;
  steps: string[];
  answer: string;
};

/** Playground problems: each has a tempting fast answer and a short worked solution. */
export const PROBLEMS: Problem[] = [
  {
    key: "bread",
    title: "빵과 우유",
    q: "빵과 우유를 합쳐서 1,100원이에요. 빵은 우유보다 1,000원 비싸요. 우유는 얼마일까요?",
    choices: ["100원", "50원", "1,000원"],
    fast: "100원",
    fastCheck: "검산: 우유 100 + 빵 1,100 = 1,200원 ✗",
    steps: ["우유를 x원이라고 하면, 빵은 x + 1,000원.", "둘을 합치면 x + (x + 1,000) = 1,100.", "2x + 1,000 = 1,100이니까 2x = 100.", "x = 50. 우유는 50원.", "검산: 우유 50 + 빵 1,050 = 1,100원 ✓"],
    answer: "50원",
  },
  {
    key: "machine",
    title: "장난감 기계",
    q: "기계 5대가 5분 동안 장난감 5개를 만들어요. 기계 100대가 장난감 100개를 만들려면 몇 분이 걸릴까요?",
    choices: ["100분", "5분", "20분"],
    fast: "100분",
    fastCheck: "검산: 100분이면 기계 100대가 2,000개를 만들어요 ✗",
    steps: ["기계 5대가 5분에 5개 → 기계 1대는 5분에 1개를 만들어요.", "기계 100대가 동시에 일하면 5분에 100개.", "그러니까 5분.", "검산: 100대 × (5분에 1개씩) = 5분에 100개 ✓"],
    answer: "5분",
  },
  {
    key: "lotus",
    title: "연못의 연잎",
    q: "연못의 연잎이 하루에 2배씩 늘어나서 48일째에 연못을 다 덮었어요. 연못의 절반을 덮은 날은 며칠째일까요?",
    choices: ["24일째", "47일째", "46일째"],
    fast: "24일째",
    fastCheck: "검산: 24일째가 절반이면 바로 다음 날(25일째)에 다 덮어요 ✗",
    steps: ["연잎은 하루에 2배씩 늘어나요.", "그러면 다 덮기 하루 전에는 딱 절반이었어요.", "48일째에 다 덮었으니, 절반은 하루 전인 47일째.", "검산: 47일째의 절반 × 2 = 48일째에 전부 ✓"],
    answer: "47일째",
  },
];

export const ch87: ChapterSpec = {
  id: 87,
  part: 10,
  title: "생각하고 답하기",
  core: true,
  hook: "AI에게 어려운 문제를 내면 '생각 중…'이 뜨는데, 그동안 뭘 하는 걸까요?",
  steps: [
    { id: "s1", sec: 8, narration: "문제 하나 풀어 볼까요? 빵과 우유를 합쳐서 1,100원, 빵이 우유보다 1,000원 비싸요. 우유는 얼마일까요? 100원이 떠오르죠." },
    { id: "s2", sec: 8, narration: "이 문제를 모델에게 내고 '답만 바로 써'라고 해 봐요. 첫 조각부터 답을 골라야 하니, 그럴듯한 '100원'이 뽑히기 쉬워요." },
    { id: "s3", sec: 9, narration: "검산해 봐요. 우유가 100원이면 빵은 1,100원, 합은 1,200원. 틀렸어요! 조각 하나에 쓰는 계산은 모델 한 번뿐이에요(2장)." },
    { id: "s4", sec: 8, narration: "'차근차근 풀어 보자'로 시작해 봐요. 우유가 x원이면 빵은 x + 1,000원, 합은 x + (x + 1,000) = 1,100." },
    { id: "s5", sec: 9, narration: "그러면 2x = 100, x = 50. 우유는 50원! 써 둔 줄을 다시 읽으며 다음 줄을 쓰니까, 어려운 계산을 나눠서 해낸 거예요." },
    { id: "s6", sec: 8, narration: "풀이를 먼저 쓰게 하는 방법을 사고의 사슬(chain of thought)이라고 해요. 2022년 연구에서 큰 모델일수록 효과가 컸어요." },
    { id: "s7", sec: 9, narration: "요즘 '추론 모델'은 이걸 훈련으로 익혀요. 답 전에 긴 풀이를 쓰고, 정답을 맞힌 풀이에 점수를 주는 방법이 알려져 있어요(76장)." },
    { id: "s8", sec: 8, narration: "대신 조각을 많이 쓰니 시간이 더 걸리고, 풀이 자체가 틀릴 수도 있어요. 중요한 답은 직접 검산해 봐요." },
  ],
  playgroundTitle: "바로 답 vs 풀어서 답",
  playgroundIntro: "문제를 고르고 내 답부터 골라 보세요. 그다음 모델이 바로 답할 때와 한 줄씩 풀어서 답할 때를 비교해요.",
  summary: [
    "답만 바로 쓰면 첫 조각에 답을 골라야 해서, 그럴듯한 오답이 나오기 쉽다.",
    "풀이를 먼저 쓰면 써 둔 줄을 다시 읽으며 계산을 나눠서 할 수 있다(사고의 사슬).",
    "추론 모델은 답 전에 길게 생각하도록 훈련됐다. 대신 느리고, 풀이도 검산이 필요하다.",
  ],
  unlocks: "풀이 과정 쓰기",
  unlockLabel: "새 능력 카드를 하나 얻었어요",
  quiz: [
    {
      q: "'답만 바로 써'라고 하면 왜 틀리기 쉬울까요?",
      choices: ["모델이 일부러 틀려서", "첫 조각에 바로 답을 쓰면 계산을 나눠서 할 기회가 없어서", "문제가 너무 길어서"],
      answer: 1,
      explain: "조각 하나에 쓸 수 있는 계산은 모델 한 번만큼이에요(2장). 풀이를 쓰면 여러 번에 나눠서 계산해요.",
      review: "s3",
    },
    {
      q: "사고의 사슬(chain of thought)이란 무엇일까요?",
      choices: ["답하기 전에 풀이 과정을 글로 쓰게 하는 것", "답을 여러 번 뽑아서 고르는 것", "질문을 짧게 줄이는 것"],
      answer: 0,
      explain: "풀이를 한 줄씩 쓰고, 써 둔 줄을 다시 읽으며 다음 줄을 이어 써요.",
      review: "s6",
    },
    {
      q: "풀어서 답하기의 단점으로 알맞은 것은?",
      choices: ["답이 항상 틀린다", "답이 너무 짧아진다", "조각을 많이 써서 오래 걸리고, 풀이도 틀릴 수 있다"],
      answer: 2,
      explain: "조각 수만큼 모델을 돌려요(2장). 풀이도 확률로 이어 쓴 글이라 검산이 필요해요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "87장 생각하고 답하기",
    problem: "문제",
    first: "바로 떠오르는 답은?",
    guess: "100원?",
    askFast: "답만 바로 써 줘",
    model: "모델",
    firstPiece: "첫 조각부터 답",
    example: "* 설명용 예시",
    out: "답: 100원",
    check: "검산",
    wrong: "틀렸어요!",
    once: "조각 하나 = 모델 한 번 (2장)",
    onceMore: "한 번에 할 수 있는 계산은 정해져 있어요",
    askSlow: "차근차근 풀어 보자",
    think: "풀이 (생각)",
    reread: "써 둔 줄을 다시 읽으며",
    answer: "답: 50원",
    qBox: "질문",
    aBox: "답",
    stepBox: "풀이",
    rowFast: "바로 답",
    rowCot: "풀어서 답",
    cot: "사고의 사슬 (chain of thought)",
    cotNote: "2022년 연구: 큰 모델일수록 효과가 컸어요",
    reasoning: "추론 모델",
    since: "2024년 무렵부터",
    thinking: "생각 중…",
    trained: "답 전에 길게 생각하도록 훈련",
    trainA: "정답을 확인할 수 있는 문제",
    trainB: "맞힌 풀이에 점수 ↑ (76장)",
    known: "알려진 방법 중 하나",
    fastSide: "빠르지만 틀리기 쉬워요",
    slowSide: "느리지만 어려운 문제에 강해요",
    pieces: "조각 수 = 모델을 돌린 횟수 (2장)",
    verify: "풀이도 틀릴 수 있어요 → 중요한 답은 검산!",
  },
};
