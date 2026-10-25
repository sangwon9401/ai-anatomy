import type { ChapterSpec } from "./types";

export type M2 = [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]

export const apply = (m: M2, v: [number, number]): [number, number] => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
export const lerpM = (a: M2, b: M2, t: number): M2 => a.map((x, i) => x + (b[i] - x) * t) as M2;

export const I2: M2 = [1, 0, 0, 1];
export const WORKED: { m: M2; v: [number, number] } = { m: [2, 1, 0, 1], v: [1, 2] };

export const PRESETS: { key: string; m: M2 }[] = [
  { key: "stretch", m: [2, 0, 0, 1] },
  { key: "rotate", m: [0, -1, 1, 0] },
  { key: "shear", m: [1, 1, 0, 1] },
  { key: "flip", m: [-1, 0, 0, 1] },
];

export const ch11: ChapterSpec = {
  id: 11,
  part: 1,
  title: "행렬 곱 = 공간 변환",
  core: true,
  hook: "행렬을 벡터에 곱하면 무슨 일이 일어날까요?",
  steps: [
    { id: "s1", sec: 6, narration: "행렬에 벡터를 곱해 볼게요. 곱하면 새로운 벡터가 나와요." },
    { id: "s2", sec: 9, narration: "계산은 9장의 내적으로 해요. 행렬의 첫째 행과 벡터를 내적하면 결과의 첫째 칸, 둘째 행과 내적하면 둘째 칸이에요." },
    { id: "s3", sec: 8, narration: "그림으로 보면 이래요. 모눈종이의 모든 점에 같은 행렬을 곱하면, 공간 전체가 옆으로 늘어나요." },
    { id: "s4", sec: 9, narration: "행렬을 바꾸면 변하는 모양도 바뀌어요. 공간을 돌리기도 하고, 비스듬히 밀기도 해요." },
    { id: "s5", sec: 7, narration: "어떤 행렬이든 곧은 선은 곧게 남고, 원점은 제자리예요. 이런 변환을 선형 변환이라고 해요." },
    { id: "s6", sec: 8, narration: "GPT는 단어 벡터에 행렬을 곱해서 뜻의 공간을 이리저리 바꿔요. 어텐션의 Query, Key, Value도 행렬 곱으로 만들어요." },
    { id: "s7", sec: 6, narration: "행렬 곱은 공간을 바꾸는 기계. 이 기계 속 숫자를 정하는 게 바로 AI의 학습이에요." },
  ],
  playgroundTitle: "공간 바꾸기 기계",
  playgroundIntro: "행렬의 네 숫자를 바꾸거나 버튼을 눌러 보세요. 모눈종이 전체가 어떻게 바뀌는지 보여요.",
  summary: [
    "행렬 × 벡터 = 새 벡터. 각 칸은 '행렬의 행 · 벡터' 내적.",
    "모든 점에 같은 행렬을 곱하면 공간이 늘어나고, 돌고, 밀린다.",
    "곧은 선은 곧게, 원점은 제자리(선형 변환). GPT의 층도 행렬 곱.",
  ],
  unlocks: "행렬 곱",
  unlockLabel: "수학 도구를 하나 얻었어요",
  quiz: [
    {
      q: "행렬 [[1, 0], [0, 3]]에 벡터 (2, 1)을 곱하면?",
      choices: ["(2, 3)", "(3, 2)", "(2, 1)"],
      answer: 0,
      explain: "첫째 행 (1, 0)·(2, 1) = 2, 둘째 행 (0, 3)·(2, 1) = 3. 그래서 (2, 3)이에요.",
      review: "s2",
    },
    {
      q: "행렬 [[2, 0], [0, 1]]을 모든 점에 곱하면 공간은?",
      choices: ["가로로 2배 늘어난다", "세로로 2배 늘어난다", "그대로다"],
      answer: 0,
      explain: "가로 좌표만 2배가 되고 세로 좌표는 그대로예요.",
      review: "s3",
    },
    {
      q: "선형 변환에서 언제나 그대로인 것은?",
      choices: ["원점의 위치", "모든 점의 위치", "모든 화살표의 길이"],
      answer: 0,
      explain: "원점에 어떤 행렬을 곱해도 (0, 0)이에요. 곧은 선도 곧은 선으로 남아요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "11장 행렬 곱 = 공간 변환",
    times: "행렬 × 벡터 = 새 벡터",
    row1: "1행 · 벡터",
    row2: "2행 · 벡터",
    stretch: "늘리기",
    rotate: "돌리기",
    shear: "밀기",
    flip: "뒤집기",
    every: "모든 점에 같은 행렬",
    straight: "곧은 선은 곧게",
    origin: "원점은 제자리",
    linear: "선형 변환",
    gpt: "단어 벡터 × 행렬",
    newSpace: "뜻의 공간이 바뀐다",
    qkv: "Query, Key, Value도 행렬 곱 (46장)",
    learn: "행렬 속 숫자 = 학습으로 정함",
    sum: "행렬 곱 = 공간을 바꾸는 기계",
    cat: "고양이",
    dog: "강아지",
    car: "자동차",
  },
};
