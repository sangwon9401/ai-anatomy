import type { ChapterSpec, Highlighter } from "./types";

// 설명용 예시. Scores (logits) chosen so that softmax over the whole GPT-3 vocabulary (50,257 tokens)
// gives the course's numbers: 간다 52%, 갔다 21%, 늦었다 12% (ch01).
export const VOCAB = 50257;
export const LOGITS: { w: string; s: number; c: Highlighter }[] = [
  { w: "간다", s: 3.0, c: "yellow" },
  { w: "갔다", s: 2.1, c: "mint" },
  { w: "늦었다", s: 1.5, c: "sky" },
  { w: "피자", s: -1.0, c: "pink" },
];
export const REST_N = VOCAB - LOGITS.length; // 50,253
/** e^score summed over the other 50,253 tokens (their scores are mostly around −9.1) */
export const REST_SUM = 5.614;
export const REST_SCORE = Math.log(REST_SUM / REST_N); // ≈ −9.1

export function outputProbs(scores: number[], wholeVocab = true) {
  const ex = scores.map((s) => Math.exp(s));
  const rest = wholeVocab ? REST_SUM : 0;
  const sum = ex.reduce((a, b) => a + b, 0) + rest;
  return { ex, rest, sum, p: ex.map((e) => e / sum), restP: rest / sum };
}

/** s1–s2: the last vector of '학교에' and each token's output vector (설명용); their dot products are the scores. */
export const LAST_VEC = [1.0, 2.0, 0.5, -1.0];
export const TOKEN_VECS = [
  [1.0, 1.0, 0.0, 0.0],
  [0.5, 1.0, 0.0, 0.4],
  [0.5, 0.5, 0.0, 0.0],
  [-1.0, 0.0, 0.0, 0.0],
];
export const OTHER_VECS = [
  [0.4, -0.3, 0.2, 0.6],
  [-0.2, 0.5, 1.1, 0.3],
];

/** words a '나머지' draw can turn into in the playground (just examples of other tokens) */
export const OTHERS = ["집에", "왔다", "가서", "있다", "도착", "그리고"];

export const ch60: ChapterSpec = {
  id: 60,
  part: 6,
  title: "벡터에서 단어로",
  core: false,
  hook: "96층을 지나 나온 건 숫자 12,288개짜리 벡터. 이걸 어떻게 '간다'라는 단어로 바꿀까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "96층을 다 지나면 단어마다 벡터가 하나씩 나와요. 다음 말을 정하는 건 맨 끝 단어 '학교에'의 벡터예요." },
    { id: "s2", sec: 9.5, narration: "이 벡터를 단어장의 토큰마다 하나씩 비교해 점수를 매겨요. 방향이 비슷할수록 점수가 높아요(9장 내적)." },
    { id: "s3", sec: 10, narration: "단어장에는 토큰이 약 5만 개, 50,257개 있어요. 그래서 점수도 50,257개 나와요. 이 점수를 로짓(logit)이라고 해요." },
    { id: "s4", sec: 9.5, narration: "간다 3.0점, 갔다 2.1점, 늦었다 1.5점, 피자 −1.0점. 나머지 5만여 개는 대부분 −9점쯤이에요." },
    { id: "s5", sec: 9.5, narration: "이제 14장의 소프트맥스! e로 올리고, 5만 개 전부의 합으로 나눠요. 다 더하면 약 38.72예요." },
    { id: "s6", sec: 9.5, narration: "간다 52%, 갔다 21%, 늦었다 12%. 나머지 5만여 개가 조금씩 모여 14%를 가져갔어요." },
    { id: "s7", sec: 9, narration: "이제 확률대로 하나를 뽑아 글 끝에 붙여요(1, 2장). 설계도에 출력 + 소프트맥스가 채워졌어요!" },
  ],
  playgroundTitle: "5만 개 중에서 고르기",
  playgroundIntro: "점수를 바꾸고 '하나 뽑기'를 눌러 보세요. 후보가 4개뿐일 때와 5만 개일 때 확률이 어떻게 다른지도 비교해 보세요.",
  summary: [
    "마지막 층에서 나온 맨 끝 단어의 벡터로 다음 말을 정한다.",
    "토큰 약 5만 개(50,257개)와 하나씩 비교해 점수(로짓)를 매긴다. 12,288 × 50,257 행렬 곱 한 번(11장).",
    "소프트맥스(14장)로 확률을 만들고 하나 뽑아 붙인다. 간다 52%, 갔다 21%, 늦었다 12%.",
  ],
  unlocks: "출력 + 소프트맥스",
  quiz: [
    {
      q: "다음 말을 정할 때 쓰는 벡터는?",
      choices: ["맨 끝 단어의 마지막 벡터", "맨 앞 단어의 벡터", "모든 단어 벡터의 평균"],
      answer: 0,
      explain: "맨 끝 단어 '학교에'의 벡터는 가림막 덕분에 앞 단어를 모두 보고 왔어요(51장). 그래서 다음 말을 정하는 데 써요.",
      review: "s1",
    },
    {
      q: "GPT-3는 다음 말 후보마다 점수를 몇 개 낼까요?",
      choices: ["96개", "12,288개", "약 5만 개(50,257개)"],
      answer: 2,
      explain: "단어장의 토큰마다 점수를 하나씩 매겨서 50,257개가 나와요.",
      review: "s3",
    },
    {
      q: "점수(로짓)를 확률로 바꾸는 계산은?",
      choices: ["정규화", "소프트맥스", "잔차 연결"],
      answer: 1,
      explain: "e로 올리고 전체 합으로 나누는 소프트맥스예요(14장). 합이 딱 100%가 돼요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "60장 벡터에서 단어로",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
    after: "96층을 지난 벡터",
    sawAll: "앞 단어를 다 보고 온 벡터 (51장)",
    toy: "설명용 예시",
    lastVec: "'학교에'의 마지막 벡터",
    compare: "토큰마다 비교해서 점수 매기기",
    dotEx: "1.0×1.0 + 2.0×1.0 + 0.5×0.0 + (−1.0)×0.0 = 3.0",
    similar: "방향이 비슷할수록 점수가 높아요 (9장)",
    vocab: "단어장의 토큰 50,257개",
    logit: "점수 50,257개 = 로짓(logit)",
    matmul: "12,288 × 50,257 행렬 곱 한 번 (11장)",
    rest: "나머지",
    restN: "50,253개",
    restScore: "약 −9.1",
    mostly: "대부분",
    expTitle: "① e로 올리기",
    divTitle: "② 전부의 합으로 나누기",
    restSum: "나머지 합",
    total: "합 = 100%",
    gather: "조금씩 모여서 14% ↘",
    pick: "확률대로 하나 뽑아 붙이기",
    filled: "채움!",
    vdots: "⋮",
    stack: "트랜스포머 블록 × 96층",
  },
};
