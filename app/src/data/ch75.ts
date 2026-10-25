import type { ChapterSpec } from "./types";

/**
 * A toy reward model for the lesson: it looks at three yes/no features of an answer and adds up weights.
 * (A real reward model is a transformer that finds its own features; this keeps the idea visible.)
 */
export const FEATURES = ["질문에 맞게 대답함", "이유나 방법을 알려 줌", "틀리거나 해로운 내용"];

export type Scored = { id: string; text: string; f: number[] };

// The answers ranked in ch74 (questions 1 and 2), with their features
export const TRAIN: { q: string; answers: Scored[]; order: string[] }[] = [
  {
    q: "시험 전날인데 잠이 안 와요. 어떻게 하죠?",
    answers: [
      { id: "A", text: "잠이 안 오면 차라리 밤새 공부하세요.", f: [1, 0, 1] },
      { id: "B", text: "휴대폰은 멀리 두고, 불을 끄고 편하게 누워 보세요. 잠이 안 와도 눈을 감고 쉬면 도움이 돼요.", f: [1, 1, 0] },
      { id: "C", text: "잠은 중요해요.", f: [0, 0, 0] },
    ],
    order: ["B", "C", "A"],
  },
  {
    q: "'사과'를 영어로 하면?",
    answers: [
      { id: "A", text: "apple이에요. 미안하다는 뜻의 사과는 apology예요.", f: [1, 1, 0] },
      { id: "B", text: "apple", f: [1, 0, 0] },
      { id: "C", text: "사과는 빨갛고 맛있는 과일이에요.", f: [0, 0, 0] },
    ],
    order: ["A", "B", "C"],
  },
];

export type Pair = { q: number; better: Scored; worse: Scored };
export const PAIRS: Pair[] = TRAIN.flatMap((t, q) => {
  const by = (id: string) => t.answers.find((a) => a.id === id)!;
  const out: Pair[] = [];
  for (let i = 0; i < t.order.length; i++) for (let j = i + 1; j < t.order.length; j++) out.push({ q, better: by(t.order[i]), worse: by(t.order[j]) });
  return out;
});

// A question the reward model has never seen
export const TEST = {
  q: "친구랑 싸웠는데 어떻게 화해하죠?",
  answers: [
    { id: "X", text: "먼저 짧게 사과 문자를 보내 보세요. 서운했던 점은 나중에 차분히 말해도 돼요.", f: [1, 1, 0] },
    { id: "Y", text: "시간이 지나면 괜찮아질 거예요.", f: [1, 0, 0] },
    { id: "Z", text: "똑같이 험담해서 갚아 주세요.", f: [1, 0, 1] },
    { id: "W", text: "싸움은 누구나 해요.", f: [0, 0, 0] },
  ] as Scored[],
};

export const W0 = [0.5, -0.5, 1.0]; // a clumsy untrained judge
export const LR = 1.0;
export const DECAY = 0.04;

export const scoreOf = (w: number[], f: number[]) => f.reduce((a, x, i) => a + x * w[i], 0);
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
/** chance that `better` wins = softmax over the two scores (ch.14) */
export const winChance = (w: number[], p: Pair) => sigmoid(scoreOf(w, p.better.f) - scoreOf(w, p.worse.f));

/** One pass over all pairs: nudge the weights so the better answer's score goes up and the worse one's goes down. */
export function trainStep(w: number[]): number[] {
  const g = w.map(() => 0);
  for (const p of PAIRS) {
    const miss = 1 - winChance(w, p);
    for (let i = 0; i < w.length; i++) g[i] += miss * (p.better.f[i] - p.worse.f[i]);
  }
  return w.map((x, i) => x + LR * (g[i] / PAIRS.length) - LR * DECAY * x);
}

export function trainN(w: number[], n: number) {
  let v = w;
  for (let i = 0; i < n; i++) v = trainStep(v);
  return v;
}

// numbers for the scene, computed from the same toy model the playground's auto-train button runs
export const TRAIN_STEPS = 40;
export const W_TRAINED = trainN(W0, TRAIN_STEPS);
const R1 = TRAIN[0].answers;
export const SCENE = {
  before: { B: scoreOf(W0, R1[1].f), A: scoreOf(W0, R1[0].f) },
  after: { B: scoreOf(W_TRAINED, R1[1].f), A: scoreOf(W_TRAINED, R1[0].f) },
  test: TEST.answers.slice(0, 3).map((a) => ({ ...a, s: scoreOf(W_TRAINED, a.f) })),
};

export const ch75: ChapterSpec = {
  id: 75,
  part: 8,
  title: "AI 채점관",
  core: false,
  hook: "사람 대신 답에 점수를 매겨 주는 AI가 있다면 어떨까요?",
  steps: [
    { id: "s1", sec: 8, narration: "사람 대신 채점하는 AI를 만들어요. 답을 넣으면 점수가 하나 나오는 기계, 보상 모델(reward model)이에요." },
    { id: "s2", sec: 8, narration: "속은 GPT와 같은 트랜스포머예요. 다만 마지막에 다음 조각의 확률 대신, 점수 하나를 내도록 바꿨어요." },
    { id: "s3", sec: 7, narration: "처음엔 엉터리로 채점해요. 사람은 B가 낫다고 했는데, 채점관은 A에게 더 높은 점수를 줬어요." },
    { id: "s4", sec: 8, narration: "그러면 틀린 만큼 숫자를 고쳐요(21장). B의 점수는 올라가고, A의 점수는 내려가는 쪽으로요." },
    { id: "s5", sec: 9, narration: "두 점수를 14장의 소프트맥스에 넣으면 'B가 이길 확률'이 돼요. 이 확률이 사람의 선택과 맞도록 연습해요." },
    { id: "s6", sec: 8, narration: "아주 많은 비교 쌍으로 연습하고 나면, 처음 보는 답에도 사람이 좋아할 만한 정도를 점수로 매겨요." },
    { id: "s7", sec: 9, narration: "하지만 채점관도 완벽하진 않아요. 칭찬만 잔뜩 늘어놓은 답에 속아서 높은 점수를 주기도 해요. 76장에서 다시 봐요." },
  ],
  playgroundTitle: "채점관 훈련소",
  playgroundIntro: "장난감 채점관은 답의 특징 세 가지에 가중치를 곱해 점수를 내요. 슬라이더로 가중치를 고쳐서, 사람이 정한 비교 6쌍을 모두 맞혀 보세요.",
  summary: [
    "보상 모델: 질문과 답을 넣으면 점수 하나를 내는 채점관 AI.",
    "사람의 비교 쌍에서 '더 나은 답'의 점수가 더 높도록 숫자를 고치며 배운다.",
    "두 점수의 소프트맥스 = 더 나은 답이 이길 확률. 채점관도 가끔 속는다.",
  ],
  unlocks: "보상 모델",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "보상 모델에 답을 넣으면 무엇이 나올까요?",
      choices: ["점수 하나", "다음 조각의 확률", "더 좋은 답"],
      answer: 0,
      explain: "몸통은 GPT와 같은 트랜스포머지만, 마지막에 점수 하나를 내도록 바꿨어요.",
      review: "s2",
    },
    {
      q: "사람은 B > A라고 했는데 채점관이 A에 더 높은 점수를 줬어요. 학습은 어떻게 할까요?",
      choices: ["A의 점수를 더 올린다", "그 비교 쌍을 지운다", "B 점수는 올리고 A 점수는 내리는 쪽으로 숫자를 고친다"],
      answer: 2,
      explain: "틀린 만큼 숫자를 고쳐서, 더 나은 답의 점수가 위로 가게 해요.",
      review: "s4",
    },
    {
      q: "두 답의 점수가 똑같다면, 채점관이 보는 'B가 이길 확률'은?",
      choices: ["0%", "50%", "100%"],
      answer: 1,
      explain: "점수가 같으면 소프트맥스도 반반으로 나눠요(14장). 아직 둘을 구별하지 못한 거예요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "75장 AI 채점관",
    rm: "보상 모델",
    rmEn: "reward model",
    input: "질문 + 답",
    score: "점수",
    oneNumber: "답 → 점수 하나",
    example: "설명용 예시",
    block: "트랜스포머 블록",
    layers: "× 여러 층",
    sameBody: "몸통은 GPT와 같아요",
    probs: "다음 조각 확률 (60장)",
    oneScore: "점수 하나",
    newHead: "머리만 바꿨어요",
    humanSays: "사람의 판정 (74장): B > A",
    backwards: "거꾸로 채점했어요!",
    fix: "틀린 만큼 숫자 고치기 (21장)",
    beforeTrain: "고치기 전",
    afterTrain: "고친 뒤",
    winTitle: "B가 이길 확률",
    winSub: "두 점수의 소프트맥스 (14장)",
    winB: "B 이김",
    winA: "A 이김",
    match: "사람의 선택(B)과 맞아요!",
    newQ: "친구랑 싸웠는데 어떻게 화해하죠?",
    newAns: "처음 보는 답도 채점해요",
    flatter: "정말 최고의 질문이에요!!! 당신은 천재예요!!! 화해도 분명 잘할 거예요!!!",
    fooled: "속았다!",
    notPerfect: "채점관도 완벽하진 않아요",
    next: "76장",
    gaugeMin: "−3",
    gaugeMax: "+3",
    arrowUp: "↑",
    arrowDown: "↓",
    expA: "A 점수",
    expB: "B 점수",
    sep: " · ",
    digits: "0123456789.−+%",
  },
};
