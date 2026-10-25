import type { ChapterSpec } from "./types";

export const MATH = [55, 65, 70, 75, 85]; // mean 70, standard deviation 10
export const FIT = [11, 13, 14, 15, 17]; // mean 14, standard deviation 2

export const stats = (xs: number[]) => {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length);
  return { mean, sd };
};

export const DATASETS = [
  { key: "math", name: "수학 점수", xs: MATH },
  { key: "fit", name: "체력장 점수", xs: FIT },
  { key: "wild", name: "들쭉날쭉", xs: [3, 40, 12, 95, 60] },
];

export const TOOLS = ["숫자로 바꾸기", "벡터", "거리", "내적", "행렬", "행렬 곱", "함수", "확률 분포", "소프트맥스", "정규화"];

export const ch15: ChapterSpec = {
  id: 15,
  part: 1,
  title: "크기 맞추기: 정규화",
  core: false,
  hook: "100점 만점 시험과 20점 만점 시험, 누가 더 잘한 걸까요?",
  steps: [
    { id: "s1", sec: 6, narration: "수학 시험은 100점 만점, 체력장은 20점 만점이에요. 숫자 크기가 달라서 그냥은 비교가 안 되죠." },
    { id: "s2", sec: 8, narration: "그래서 크기를 맞춰요. 첫째, 평균을 빼요. 평균 자리가 0이 되고, 평균보다 높은지 낮은지가 보여요." },
    { id: "s3", sec: 8, narration: "둘째, 퍼진 정도로 나눠요. 퍼진 정도는 중학교 3학년 때 배운 표준편차예요. 이제 두 시험이 같은 잣대가 돼요." },
    { id: "s4", sec: 9, narration: "수학 85점과 체력장 17점. 둘 다 평균보다 표준편차 1.5개만큼 높아요. 똑같이 잘한 거예요. 이렇게 맞추는 걸 정규화라고 해요." },
    { id: "s5", sec: 8, narration: "GPT에서도 벡터가 층을 지날 때마다 숫자가 점점 커지거나 작아질 수 있어요. 그래서 층마다 정규화로 크기를 다시 맞춰요." },
    { id: "s6", sec: 7, narration: "57장에서 볼 레이어 정규화가 바로 이거예요. 수십 층을 쌓아도 계산이 흔들리지 않게 해 줘요." },
    { id: "s7", sec: 7, narration: "평균을 빼고, 퍼진 정도로 나누기. 이걸로 Part 1 수학 도구상자가 완성됐어요!" },
  ],
  playgroundTitle: "정규화 기계",
  playgroundIntro: "점수 묶음을 고르고 ①, ② 버튼을 차례로 눌러 보세요. 어떤 숫자 묶음이든 비슷한 크기로 맞춰져요.",
  summary: [
    "① 평균 빼기: 평균 자리가 0이 된다.",
    "② 표준편차로 나누기: 퍼진 정도가 1로 맞춰진다.",
    "GPT는 층마다 정규화해서 숫자가 폭주하지 않게 한다(57장).",
  ],
  unlocks: "정규화",
  unlockLabel: "수학 도구를 하나 얻었어요",
  quiz: [
    {
      q: "점수 [60, 70, 80]에서 평균을 빼면?",
      choices: ["[−10, 0, 10]", "[0, 10, 20]", "[60, 70, 80]"],
      answer: 0,
      explain: "평균이 70이니까 각각 70을 빼면 −10, 0, 10이에요.",
      review: "s2",
    },
    {
      q: "정규화의 두 단계는?",
      choices: ["평균 빼기, 표준편차로 나누기", "최댓값 빼기, 2로 나누기", "모두 더하기, 개수로 나누기"],
      answer: 0,
      explain: "평균을 빼서 가운데를 0으로, 표준편차로 나눠서 퍼진 정도를 1로 맞춰요.",
      review: "s3",
    },
    {
      q: "GPT가 층마다 정규화를 하는 이유는?",
      choices: ["숫자가 너무 커지거나 작아지지 않게", "단어 수를 줄이려고", "답을 빨리 내려고"],
      answer: 0,
      explain: "수십 층을 지나며 숫자가 폭주하지 않도록 크기를 다시 맞춰요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "15장 크기 맞추기: 정규화",
    math: "수학 (100점 만점)",
    fit: "체력장 (20점 만점)",
    hard: "그냥은 비교가 안 돼요",
    step1: "① 평균 빼기",
    step2: "② 표준편차로 나누기",
    mean: "평균",
    zero: "0 = 평균",
    sd: "표준편차",
    same: "같은 잣대!",
    m85: "수학 85점 → +1.5",
    f17: "체력장 17점 → +1.5",
    norm: "정규화",
    layer: "층",
    grow: "층을 지날수록 커져요",
    fix: "정규화로 다시 맞추기",
    ln: "레이어 정규화 (57장)",
    done: "Part 1 수학 도구상자 완성!",
  },
};
