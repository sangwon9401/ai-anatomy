import type { ChapterSpec, Highlighter } from "./types";

export const SCORES: { w: string; s: number; c: Highlighter }[] = [
  { w: "간다", s: 3, c: "yellow" },
  { w: "갔다", s: 2, c: "mint" },
  { w: "늦었다", s: 1, c: "sky" },
  { w: "피자", s: -1, c: "pink" },
];

export const softmax = (xs: number[]) => {
  const ex = xs.map((x) => Math.exp(x));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { ex, sum, p: ex.map((e) => e / sum) };
};

export const ch14: ChapterSpec = {
  id: 14,
  part: 1,
  title: "점수를 확률로: 소프트맥스",
  core: true,
  hook: "모델이 매긴 점수는 음수도 되고 합도 제각각이에요. 이걸 어떻게 확률로 바꿀까요?",
  steps: [
    { id: "s1", sec: 6, narration: "모델은 다음 말 후보마다 점수를 매겨요. 점수는 3도 되고, −1 같은 음수도 될 수 있어요." },
    { id: "s2", sec: 7, narration: "그런데 확률은 0보다 작으면 안 되고, 전부 더하면 1이 돼야 해요. 지금은 음수도 있고 합도 5예요." },
    { id: "s3", sec: 8, narration: "첫 번째 단계. e를 점수만큼 거듭제곱해요. e는 약 2.718인 수예요. 이러면 모든 값이 양수가 돼요." },
    { id: "s4", sec: 7, narration: "덤으로 큰 점수는 훨씬 더 커져요. 3점은 2점의 1.5배였는데, 바꾼 뒤에는 약 2.7배가 됐어요." },
    { id: "s5", sec: 8, narration: "두 번째 단계. 바꾼 값을 전부 더하면 30.56이에요. 이제 각 값을 이 합으로 나눠요." },
    { id: "s6", sec: 8, narration: "그러면 확률이 나와요. 간다 65.7%, 갔다 24.2%, 늦었다 8.9%, 피자 1.2%. 다 더하면 딱 100%예요." },
    { id: "s7", sec: 8, narration: "이 두 단계를 합친 계산이 소프트맥스예요. 45장 어텐션에서 다시 만나니까 꼭 기억해 두세요." },
  ],
  playgroundTitle: "점수 조절실",
  playgroundIntro: "슬라이더로 점수를 바꿔 보세요. 확률이 어떻게 변하는지 바로 보여요.",
  summary: [
    "점수(로짓)는 음수도 되고, 합도 제각각이다.",
    "① e로 올리면 전부 양수가 되고, 큰 점수는 더 커진다.",
    "② 합으로 나누면 확률이 된다. 이 두 단계가 소프트맥스.",
  ],
  unlocks: "소프트맥스",
  quiz: [
    {
      q: "소프트맥스 첫 단계에서 e의 거듭제곱을 쓰는 가장 큰 이유는?",
      choices: ["모든 값을 양수로 만들려고", "계산을 빠르게 하려고", "점수를 정수로 만들려고"],
      answer: 0,
      explain: "e의 거듭제곱은 항상 양수예요. 덤으로 큰 점수를 더 크게 키워요.",
      review: "s3",
    },
    {
      q: "점수가 [2, 2, 2]라면 각 후보의 확률은?",
      choices: ["2", "약 33.3%", "약 66.7%"],
      answer: 1,
      explain: "점수가 같으면 eˣ도 같아서, 셋이 똑같이 나눠 가져요.",
      review: "s6",
    },
    {
      q: "모든 점수에 똑같이 5를 더하면 확률은?",
      choices: ["전부 커진다", "그대로다", "1등만 커진다"],
      answer: 1,
      explain: "eˣ가 모두 똑같이 e⁵배가 되고, 합으로 나눌 때 그 배수가 약분돼요. 점수 사이의 차이만 중요해요.",
      review: "playground",
    },
  ],
  labels: {
    tag: "14장 점수를 확률로: 소프트맥스",
    axis: "점수",
    neg: "확률이 음수?",
    sum: "3 + 2 + 1 − 1 = 5",
    notOne: "≠ 1",
    e: "e ≈ 2.718",
    eLater: "고2 대수에서 다시 만나요",
    ratioA: "점수: 3 vs 2 → 1.5배",
    ratioB: ": 20.09 vs 7.39 →",
    ratioB2: "약 2.7배",
    bigger: "큰 점수는 더 크게!",
    total: "합 = 100%",
    fTitle: "소프트맥스",
    fLeft: "내 확률",
    fMine: "내 점수",
    fAll: "모든",
    fSum: "의 합",
    step1: "① e로 올리기: 전부 양수, 큰 건 더 크게",
    step2: "② 합으로 나누기: 합이 딱 1",
    seeYou: "45장 어텐션에서 또 만나요",
  },
};
