import { GD_RUN, TRAIN, VAL, fitPoly, mseOf } from "./part2-fit";
import type { ChapterSpec } from "./types";

export const LINE = fitPoly(1, TRAIN);
export const LINE_TRAIN = mseOf(LINE, TRAIN);
export const LINE_VAL = mseOf(LINE, VAL);
export const WIGGLE = GD_RUN[GD_RUN.length - 1];
/** the point of the run where the validation loss was lowest */
export const BEST_STOP = GD_RUN.slice(1).reduce((a, r) => (r.val < a.val ? r : a), GD_RUN[1]);

export const ch25: ChapterSpec = {
  id: 25,
  part: 2,
  title: "기출만 외운 학생",
  core: false,
  hook: "연습 문제는 다 맞히는데 시험만 보면 틀리는 AI, 왜 그럴까요?",
  steps: [
    { id: "s1", sec: 8, narration: "기출문제만 달달 외운 학생은 기출은 만점인데, 처음 보는 문제는 망쳐요. AI에게도 똑같은 일이 생겨요." },
    { id: "s2", sec: 8, narration: "가게 8곳의 줄과 별점으로 연습해요. 이게 훈련 데이터예요. 단순한 직선은 점들 사이를 적당히 지나가요." },
    { id: "s3", sec: 9, narration: "아주 복잡한 모델을 오래 학습시키면 점 8개를 모두 정확히 지나는 꼬불꼬불한 선이 돼요. 훈련 손실은 0이에요." },
    { id: "s4", sec: 9.5, narration: "그런데 처음 보는 가게 7곳(검증 데이터)을 넣으면 엉뚱한 답을 내요. 외우기만 한 거죠. 이게 과적합(overfitting)이에요." },
    { id: "s5", sec: 8.5, narration: "학습하면서 두 손실을 같이 그려 보면, 훈련 손실은 계속 내려가는데 검증 손실은 어느 순간부터 다시 올라가요." },
    { id: "s6", sec: 9.5, narration: "검증 손실이 가장 낮을 때 멈추거나 데이터를 더 모아요. 처음 보는 문제도 잘 푸는 힘이 일반화(generalization)예요." },
    { id: "s7", sec: 8, narration: "GPT도 학습할 때 따로 떼어 둔 글로 검증 손실을 지켜봐요. 외운 게 아니라 정말 배웠는지 확인하는 거예요." },
  ],
  playgroundTitle: "외우기 탐지기",
  playgroundIntro: "모델의 복잡도(곡선이 얼마나 꼬불꼬불해질 수 있나)를 바꿔 보세요. 훈련 손실과 검증 손실이 어떻게 달라지는지, 데이터를 더 모으면 어떻게 되는지 확인해 보세요.",
  summary: [
    "과적합: 훈련 데이터를 외워서 훈련 손실은 낮은데 처음 보는 데이터에선 틀린다.",
    "검증 데이터(학습에 안 쓴 문제)로 확인한다. 검증 손실이 다시 오르면 위험 신호.",
    "막는 법: 검증 손실이 가장 낮을 때 멈추기, 데이터 더 모으기. 목표는 일반화.",
  ],
  unlocks: "과적합 · 일반화",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "훈련 손실은 0인데 검증 손실이 크다면?",
      choices: ["아주 잘 학습됐다", "과적합됐다", "학습률이 0이다"],
      answer: 1,
      explain: "훈련 데이터만 외웠고 처음 보는 데이터는 못 맞힌다는 뜻이에요. 과적합이에요.",
      review: "s4",
    },
    {
      q: "검증 데이터는 어떤 데이터일까요?",
      choices: ["학습에 쓰지 않고 따로 떼어 둔 데이터", "훈련 데이터를 한 번 더 쓴 것", "정답이 없는 데이터"],
      answer: 0,
      explain: "모델이 한 번도 본 적 없는 문제로 시험을 봐야 진짜 실력을 알 수 있어요.",
      review: "s4",
    },
    {
      q: "과적합을 줄이는 방법이 아닌 것은?",
      choices: ["데이터를 더 모은다", "검증 손실이 가장 낮을 때 멈춘다", "같은 데이터로 훨씬 더 오래 학습한다"],
      answer: 2,
      explain: "같은 데이터로 오래 학습할수록 더 외우게 돼요. 검증 손실이 오르기 시작하면 멈추는 게 좋아요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "25장 기출만 외운 학생",
    memo: "외운 학생",
    under: "이해한 학생",
    past: "기출",
    fresh: "처음 보는 문제",
    pts: "점",
    example: "설명용 예시",
    trainTitle: "훈련 데이터: 가게 8곳",
    axisX: "줄 (팀)",
    axisY: "별점",
    simple: "단순한 직선",
    trainLoss: "훈련 손실",
    valLoss: "검증 손실",
    complex: "아주 복잡한 모델",
    zero: "점 8개를 모두 통과!",
    valTitle: "처음 보는 가게 7곳",
    weird: "별점 6점?!",
    overfit: "과적합 (overfitting)",
    curveTitle: "학습하면서 두 손실",
    time: "학습 시간 →",
    timeNote: "갈수록 눈금 간격이 넓어요",
    stop: "여기서 멈추기!",
    apart: "갈라진다",
    fix1: "검증 손실이 가장 낮을 때 멈추기",
    fix2: "데이터 더 모으기",
    gen: "일반화 = 처음 보는 문제도 잘 풀기",
    gpt: "GPT도 따로 떼어 둔 글로 검증해요",
    real: "외운 걸까, 배운 걸까?",
    line: "직선",
    wiggle: "꼬불꼬불",
  },
};
