import { W0, lossA, slopeA } from "./ch21";
import type { ChapterSpec, Highlighter } from "./types";

/** gradient steps on 21장's valley (가게 A, 줄 손잡이) with learning rate `lr` */
export function walk(lr: number, steps: number, w0 = W0) {
  const ws = [w0];
  for (let i = 0; i < steps; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - lr * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
}

export const RUNS: { lr: number; name: string; c: Highlighter; ws: number[] }[] = [
  { lr: 0.01, name: "너무 작게", c: "sky", ws: walk(0.01, 10) },
  { lr: 0.1, name: "알맞게", c: "mint", ws: walk(0.1, 10) },
  { lr: 0.3, name: "너무 크게", c: "pink", ws: walk(0.3, 10) },
];
export const RUN_LOSS = RUNS.map((r) => r.ws.map(lossA));

export const ch22: ChapterSpec = {
  id: 22,
  part: 2,
  title: "보폭 정하기: 학습률",
  core: false,
  hook: "산을 내려갈 때 한 걸음을 얼마나 크게 디뎌야 할까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "21장에서 한 걸음의 크기는 학습률 × 기울기였어요. 학습률(learning rate)은 얼마나 성큼 걸을지 정하는 보폭이에요." },
    { id: "s2", sec: 8, narration: "학습률이 너무 작으면(0.01) 거북이처럼 느려요. 다섯 걸음을 가도 아직 산 중턱이에요." },
    { id: "s3", sec: 7, narration: "알맞으면(0.1) 몇 걸음 만에 바닥에 닿아요. 21장에서 본 바로 그 걸음이에요." },
    { id: "s4", sec: 9, narration: "너무 크면(0.3) 바닥을 지나쳐 반대편으로 튕겨요. 튈 때마다 더 높이 올라가서 손실이 오히려 커져요." },
    { id: "s5", sec: 8, narration: "걸음마다 손실을 그래프로 그려 보면 차이가 확 보여요. 느리게 내려가고, 뚝 떨어지고, 치솟아요." },
    { id: "s6", sec: 9, narration: "그래서 학습률은 신중하게 골라요. GPT-3도 처음엔 학습률을 조금씩 올렸다가 학습하면서 서서히 줄였어요." },
    { id: "s7", sec: 8, narration: "너무 작으면 거북이, 너무 크면 튕겨 나가요. 알맞은 보폭이 중요해요. 더 똑똑한 걸음은 67장에서 배워요." },
  ],
  playgroundTitle: "보폭 실험실",
  playgroundIntro: "학습률을 정하고 '10걸음 가기'를 눌러 보세요. 공이 골짜기에서 어떻게 움직이는지, 손실이 어떻게 변하는지 보세요.",
  summary: [
    "학습률 = 한 걸음의 보폭. 새 손잡이 = 손잡이 − 학습률 × 기울기.",
    "너무 작으면 거북이처럼 느리고, 너무 크면 바닥을 지나쳐 튕겨 나간다.",
    "알맞은 학습률을 골라야 빨리 바닥에 닿는다. 학습 중에 줄여 가기도 한다.",
  ],
  unlocks: "학습률",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "학습하는 동안 손실이 점점 커지고 있어요. 가장 의심되는 것은?",
      choices: ["학습률이 너무 크다", "학습률이 너무 작다", "데이터가 너무 적다"],
      answer: 0,
      explain: "보폭이 너무 크면 바닥을 지나쳐 반대편 더 높은 곳으로 튕겨요. 손실이 커져요.",
      review: "s4",
    },
    {
      q: "학습률이 너무 작을 때 생기는 일은?",
      choices: ["손실이 폭발한다", "손실이 아주 천천히 줄어든다", "손실이 바로 0이 된다"],
      answer: 1,
      explain: "방향은 맞지만 걸음이 너무 작아서, 바닥까지 아주 많은 걸음이 필요해요.",
      review: "s2",
    },
    {
      q: "w = 1, 기울기 = −4일 때 학습률 0.3이면 새 w는?",
      choices: ["1.4", "0.7", "2.2"],
      answer: 2,
      explain: "1 − 0.3 × (−4) = 1 + 1.2 = 2.2예요. 바닥(1.5)을 훌쩍 지나쳤어요.",
      review: "s4",
    },
  ],
  labels: {
    tag: "22장 보폭 정하기: 학습률",
    rule: "새 w = w − 학습률 × 기울기",
    stride: "학습률 = 보폭",
    axisW: "w (줄 손잡이)",
    axisL: "손실",
    small: "학습률 0.01",
    good: "학습률 0.1",
    big: "학습률 0.3",
    turtle: "거북이… 아직 중턱",
    arrive: "몇 걸음 만에 바닥!",
    bounce: "점점 더 높이 튕겨요",
    out: "다음엔 그래프 밖으로!",
    chart: "걸음마다 손실",
    step: "걸음",
    slow: "느리게",
    fast: "뚝",
    up: "치솟음",
    schedTitle: "학습률도 계획을 세워요",
    warm: "처음엔 조금씩 올리고",
    decay: "점점 줄이기",
    lrAxis: "학습률",
    timeAxis: "학습 진행",
    sketch: "설명용 그림",
    sum1: "너무 작으면: 거북이",
    sum2: "너무 크면: 튕겨 나감",
    sum3: "알맞으면: 빨리 바닥",
    next: "더 똑똑한 걸음: 67장 Adam",
    example: "가게 A · 설명용 예시",
  },
};
