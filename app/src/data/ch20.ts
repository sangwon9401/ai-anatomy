import { NEURON, STORES, neuron } from "./part2-toy";
import type { ChapterSpec } from "./types";

/** 가게 A, B, C scored by the 16장 neuron: prediction, real 별점, error */
export const GRADED = STORES.slice(0, 3).map((s) => {
  const pred = neuron(s.x, NEURON.w, NEURON.b);
  return { name: s.name, pred, real: s.real, err: pred - s.real };
});
export const ERR_SUM = GRADED.reduce((a, g) => a + g.err, 0);
export const SQ_SUM = GRADED.reduce((a, g) => a + g.err ** 2, 0);
export const MSE = SQ_SUM / GRADED.length;

export const ch20: ChapterSpec = {
  id: 20,
  part: 2,
  title: "얼마나 틀렸나: 손실",
  core: true,
  hook: "AI가 틀렸다는 건 알겠는데, '얼마나' 틀렸는지는 어떻게 잴까요?",
  steps: [
    { id: "s1", sec: 8, narration: "16장 뉴런은 가게 A를 3.5점으로 예상했어요. 그런데 친구들이 먹어 보고 매긴 진짜 별점은 4.5점이에요." },
    { id: "s2", sec: 8, narration: "틀린 정도는 화살과 과녁 사이의 거리예요. 예측 빼기 정답, 3.5 − 4.5 = −1. 1점 모자라게 맞혔어요." },
    { id: "s3", sec: 9, narration: "가게 셋을 채점해 볼게요. A는 −1, B는 +1, C는 −0.5. 그냥 더하면 −0.5라 거의 안 틀린 것처럼 보여요." },
    { id: "s4", sec: 8.5, narration: "부호를 없애려고 틀린 정도를 제곱해요. 절댓값을 써도 되지만, 제곱하면 크게 틀린 걸 더 크게 혼내요." },
    { id: "s5", sec: 8, narration: "제곱한 값의 평균은 2.25 ÷ 3 = 0.75. 이 숫자 하나가 손실(loss)이에요. 0이면 모두 맞힌 거예요." },
    { id: "s6", sec: 9, narration: "GPT는 별점 대신 다음 단어를 맞혀요. 그래서 정답 단어에 확률을 얼마나 줬는지로 채점해요. 65장에서 배워요." },
    { id: "s7", sec: 7, narration: "이제 목표가 생겼어요. 손실이 0에 가까워지게 손잡이를 찾는 것. 찾는 방법은 21장에서 봐요." },
  ],
  playgroundTitle: "채점 기계",
  playgroundIntro: "슬라이더로 세 가게의 예측 별점(화살)을 옮겨 보세요. 과녁(진짜 별점)과의 거리, 그 제곱, 그리고 손실이 바로 계산돼요.",
  summary: [
    "오차 = 예측 − 정답. 그냥 더하면 +와 −가 서로 지워진다.",
    "그래서 제곱(또는 절댓값)해서 평균 낸다. 이 숫자 하나가 손실.",
    "손실 0 = 다 맞힘. 학습 = 손실을 줄이는 손잡이 찾기. GPT의 손실은 65장.",
  ],
  unlocks: "손실 (loss)",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "예측이 2점, 정답이 5점이면 제곱 오차는?",
      choices: ["3", "9", "−3"],
      answer: 1,
      explain: "오차는 2 − 5 = −3, 제곱하면 (−3)² = 9예요.",
      review: "s4",
    },
    {
      q: "오차를 그냥 더하지 않고 제곱하는 이유는?",
      choices: ["+와 −가 서로 지워지지 않게 하려고", "계산을 빨리 하려고", "손실을 음수로 만들려고"],
      answer: 0,
      explain: "−1과 +1을 그냥 더하면 0이 돼서 하나도 안 틀린 것처럼 보여요. 제곱하면 둘 다 1이에요.",
      review: "s3",
    },
    {
      q: "손실이 0이라는 건 무슨 뜻일까요?",
      choices: ["모델이 아직 계산을 안 했다", "모든 예측이 정답과 같다", "모든 예측이 0이다"],
      answer: 1,
      explain: "오차가 전부 0이어야 제곱의 평균도 0이에요. 손실은 작을수록 좋아요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "20장 얼마나 틀렸나: 손실",
    titleA: "가게 A의 별점 맞히기",
    title3: "가게 셋 채점하기",
    example: "설명용 예시",
    pred: "예측",
    real: "진짜 별점",
    gap: "1점 차이",
    errFormula: "예측 − 정답 = 3.5 − 4.5 = −1",
    star: "별점",
    sum: "그냥 더하면: −1 + 1 − 0.5 = −0.5",
    looks: "거의 안 틀린 것처럼?!",
    err: "오차",
    square: "제곱하기",
    sqSum: "제곱의 합: 1 + 1 + 0.25 = 2.25",
    big: "크게 틀릴수록 훨씬 커져요",
    mean: "평균: 2.25 ÷ 3 = 0.75",
    loss: "손실 (loss) = 0.75",
    zero: "0이면 모두 맞힘",
    gptTitle: "GPT의 채점",
    sentence: "나는 오늘 학교에",
    answer: "정답: 간다",
    gave: "정답에 준 확률",
    ce: "교차 엔트로피 (65장)",
    surprise: "놀람의 크기로 채점해요",
    goal1: "손실 = 얼마나 틀렸나를 숫자 하나로",
    goal2: "학습 = 손실을 0에 가깝게 줄이기",
    how: "어떻게? → 21장 경사하강법",
  },
};
