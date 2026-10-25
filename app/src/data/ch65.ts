import type { ChapterSpec, Highlighter } from "./types";

/** 놀람 in "halvings": how many times 1 must be halved to reach p, i.e. log₂(1/p). */
export const surprise = (p: number) => Math.log2(1 / p);

/** ch01's numbers for "나는 오늘 학교에 → ?" (illustrative), with 가기/피자/기타 merged into 기타. */
export const NEXT: { w: string; p: number; c: Highlighter }[] = [
  { w: "간다", p: 0.52, c: "yellow" },
  { w: "갔다", p: 0.21, c: "mint" },
  { w: "늦었다", p: 0.12, c: "sky" },
  { w: "기타", p: 0.15, c: "violet" },
];

/** The halving ladder: probability as a fraction label and its 놀람. */
export const LADDER = [
  { label: "1", p: 1 },
  { label: "1/2", p: 1 / 2 },
  { label: "1/4", p: 1 / 4 },
  { label: "1/8", p: 1 / 8 },
];

/** 64장's four questions with illustrative probabilities the model gave the right answer. */
export const QUESTIONS65 = [
  { ctx: "나는", ans: "오늘", p: 0.25 },
  { ctx: "나는 오늘", ans: "학교에", p: 0.5 },
  { ctx: "나는 오늘 학교에", ans: "간다", p: 0.52 },
  { ctx: "나는 오늘 학교에 간다", ans: ".", p: 0.8 },
];

export const meanSurprise = (ps: number[]) => ps.reduce((a, p) => a + surprise(p), 0) / ps.length;

export const ch65: ChapterSpec = {
  id: 65,
  part: 7,
  title: "놀람의 크기",
  core: true,
  hook: "정답에 52%를 건 모델은 얼마나 틀린 걸까요? 틀린 정도를 숫자 하나로 잴 수 있을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "모델이 '나는 오늘 학교에' 다음으로 간다에 52%를 줬어요. 정답은 간다였어요. 모델은 얼마나 틀린 걸까요?" },
    { id: "s2", sec: 11, narration: "사람으로 치면 '놀람'이에요. 맞을 거라 믿은 일이 일어나면 별로 안 놀라고, 설마 했던 일이 일어나면 깜짝 놀라죠." },
    { id: "s3", sec: 11, narration: "놀람을 숫자로 재 볼게요. 확실한 일(확률 1)이 일어나면 놀람 0. 확률이 반으로 줄 때마다 놀람이 1씩 커져요." },
    { id: "s4", sec: 11, narration: "1/4이면 2, 1/8이면 3. 8이 되려면 2를 몇 번 곱해야 하는지 세는 거예요. 2 × 2 × 2 = 8, 그래서 3." },
    { id: "s5", sec: 11, narration: "점을 이어 보면, 확률이 0에 가까울수록 놀람이 끝없이 치솟아요. 수학에선 이 계산을 로그라고 해요. 고2 때 배워요." },
    { id: "s6", sec: 10, narration: "간다 52%를 재면 놀람은 약 0.94. 간다에 12%만 줬다면 약 3.06이에요. 정답에 많이 걸수록 덜 놀라요." },
    { id: "s7", sec: 11, narration: "문제마다 놀람을 재서 평균 내면 교차 엔트로피(cross-entropy)예요. 이게 GPT의 손실, 학습은 이걸 줄이는 거예요." },
  ],
  playgroundTitle: "놀람 미터",
  playgroundIntro: "정답에 준 확률을 바꿔 보세요. 확률이 반으로 줄 때마다 놀람이 얼마나 커지는지 확인해요.",
  summary: [
    "놀람: 정답에 준 확률이 낮을수록 커진다. 확률 1이면 놀람 0.",
    "확률이 반으로 줄 때마다 놀람 +1 (1/2 → 1, 1/4 → 2, 1/8 → 3). 이 계산이 로그.",
    "문제마다 놀람의 평균 = 교차 엔트로피 = GPT의 손실. 학습은 이걸 줄이는 것.",
  ],
  unlocks: "교차 엔트로피",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "정답에 준 확률이 1/4이면 놀람은? (2를 기준으로)",
      choices: ["1", "2", "4"],
      answer: 1,
      explain: "1을 반으로 두 번 나누면 1/4이에요. 2 × 2 = 4, 그래서 놀람은 2예요.",
      review: "s4",
    },
    {
      q: "모델이 정답에 90%를 준 경우와 10%를 준 경우, 손실이 더 큰 쪽은?",
      choices: ["10%를 준 경우", "90%를 준 경우", "둘이 같다"],
      answer: 0,
      explain: "정답에 적게 걸었을수록 더 놀라요. 놀람이 크면 손실도 커요.",
      review: "s6",
    },
    {
      q: "교차 엔트로피 손실을 줄인다는 것은?",
      choices: ["후보 수를 줄인다", "모든 후보에 똑같은 확률을 준다", "정답 조각에 더 높은 확률을 준다"],
      answer: 2,
      explain: "정답에 높은 확률을 줄수록 놀람이 작아지고, 그 평균이 손실이에요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "65장 놀람의 크기",
    ctx: "나는 오늘 학교에",
    example: "설명용 예시",
    answer: "정답!",
    howWrong: "얼마나 틀렸을까?",
    rain90: "비 올 확률 90%",
    rain10: "비 올 확률 10%",
    rained: "→ 비가 왔다!",
    little: "조금 놀람",
    big: "깜짝 놀람!",
    prob: "확률",
    surprise: "놀람",
    halve: "반으로 줄면 +1",
    times: "8 = 2 × 2 × 2 → 놀람 3",
    axisP: "정답에 준 확률 →",
    axisS: "↑ 놀람",
    soar: "0에 가까울수록 치솟아요",
    formula: "놀람 = log₂(1 ÷ 확률)",
    log: "로그: 고2 대수에서 배워요",
    go52: "간다 52%",
    go12: "간다 12%",
    lessSurprise: "정답에 많이 걸수록 덜 놀라요",
    colQ: "문제",
    colP: "정답 확률",
    colS: "놀람",
    mean: "평균",
    ce: "교차 엔트로피",
    loss: "= GPT의 손실 (20장)",
    learn: "학습 = 놀람 줄이기",
    base: "실제 학습에선 2 대신 e(14장)를 써요. 생각은 같아요",
  },
};
