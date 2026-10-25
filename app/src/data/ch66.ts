import type { ChapterSpec, Highlighter } from "./types";

export const CANDS: { w: string; c: Highlighter }[] = [
  { w: "간다", c: "yellow" },
  { w: "갔다", c: "mint" },
  { w: "늦었다", c: "sky" },
  { w: "기타", c: "violet" },
];

/** A mini model whose only numbers are the four scores (설명용 예시). It starts out wrong:
 *  ch01's probabilities with 간다 and 늦었다 swapped. Scores are ln(p) + 3 (shifting all scores changes nothing, 14장). */
export const START_P = [0.12, 0.21, 0.52, 0.15];
export const START_Z = START_P.map((p) => Math.log(p) + 3);
export const LR = 1;

export const softmax66 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** 놀람 in halvings, as in 65장. */
export const surprise66 = (p: number) => Math.log2(1 / p);

/** 책임 of each score: probability minus 1 for the right answer, minus 0 for the rest. */
export const blameOf = (p: number[], target: number) => p.map((v, i) => v - (i === target ? 1 : 0));

export type Lap = { z: number[]; p: number[]; loss: number; blame: number[] };

/** Run the loop: lap k holds the scores before its update. */
export function runLaps(z0: number[], target: number, n: number, lr = LR): Lap[] {
  const laps: Lap[] = [];
  let z = [...z0];
  for (let k = 0; k < n; k++) {
    const p = softmax66(z);
    const blame = blameOf(p, target);
    laps.push({ z, p, loss: surprise66(p[target]), blame });
    z = z.map((v, i) => v - lr * blame[i]);
  }
  return laps;
}

export const LAPS = runLaps(START_Z, 0, 4);

export const STATIONS = [
  { n: "① 예측", ref: "19장", c: "yellow" as Highlighter },
  { n: "② 손실", ref: "20 · 65장", c: "pink" as Highlighter },
  { n: "③ 역전파", ref: "23장", c: "violet" as Highlighter },
  { n: "④ 업데이트", ref: "21 · 22장", c: "mint" as Highlighter },
];

export const ch66: ChapterSpec = {
  id: 66,
  part: 7,
  title: "훈련 루프 한 바퀴",
  core: true,
  hook: "GPT는 수천억 개의 문제를 어떤 순서로 공부할까요?",
  steps: [
    { id: "s1", sec: 9, narration: "지금까지 배운 조각들을 하나로 이어 볼게요. GPT는 네 단계로 된 고리를 수없이 돌면서 공부해요." },
    { id: "s2", sec: 11, narration: "① 예측. '나는 오늘 학교에'를 넣고 다음 조각의 확률을 내요(19장). 처음엔 숫자가 엉망이라 간다가 겨우 12%예요." },
    { id: "s3", sec: 10, narration: "② 손실. 정답 간다에 준 확률로 놀람을 재요(65장). 12%밖에 안 줬으니 놀람이 3.06으로 커요." },
    { id: "s4", sec: 11, narration: "③ 역전파. 손실을 거꾸로 보내며 숫자마다 책임을 나눠요(23장). 간다 점수는 올리고, 늦었다 점수는 내려야 해요." },
    { id: "s5", sec: 11, narration: "④ 업데이트. 책임만큼 숫자를 살짝 고쳐요. 얼마나 크게 고칠지는 학습률이 정해요(22장). 여기선 학습률 1이에요." },
    { id: "s6", sec: 10, narration: "그리고 다시 ①로. 한 바퀴 돌 때마다 간다 확률은 32%, 55%, 69%로 오르고, 놀람은 쭉 줄어요." },
    { id: "s7", sec: 11, narration: "진짜 GPT는 문제를 잔뜩 묶어(24장) 이 고리를 아주 많이 돌며 숫자 1,750억 개를 조금씩 고쳐요. 이게 사전학습이에요." },
  ],
  playgroundTitle: "훈련 고리 돌리기",
  playgroundIntro: "① → ② → ③ → ④ 버튼을 순서대로 눌러 미니 모델을 한 바퀴씩 학습시켜 보세요. 목표는 놀람을 0.5 아래로 줄이기예요.",
  summary: [
    "① 예측(순전파) → ② 손실(놀람) → ③ 역전파(책임 나누기) → ④ 업데이트(숫자 고치기).",
    "한 바퀴 돌 때마다 정답 확률은 오르고 손실은 준다.",
    "이 고리를 엄청나게 많이 돌며 숫자 1,750억 개를 고치는 것 = 사전학습.",
  ],
  unlocks: "사전학습",
  quiz: [
    {
      q: "훈련 고리의 올바른 순서는?",
      choices: ["손실 → 예측 → 업데이트 → 역전파", "예측 → 손실 → 역전파 → 업데이트", "업데이트 → 예측 → 역전파 → 손실"],
      answer: 1,
      explain: "먼저 답을 내 보고(예측), 얼마나 틀렸는지 재고(손실), 책임을 나눈 뒤(역전파), 숫자를 고쳐요(업데이트).",
      review: "s1",
    },
    {
      q: "역전파 단계에서 하는 일은?",
      choices: ["다음 조각의 확률을 낸다", "새 문제를 만든다", "숫자마다 손실에 대한 책임을 나눈다"],
      answer: 2,
      explain: "손실을 거꾸로 보내면서 각 숫자가 얼마나, 어느 쪽으로 책임이 있는지 계산해요(23장).",
      review: "s4",
    },
    {
      q: "고리를 한 바퀴 돌고 나면 보통 어떻게 될까요?",
      choices: ["정답 확률은 오르고 손실은 준다", "정답 확률도 손실도 오른다", "아무것도 안 바뀐다"],
      answer: 0,
      explain: "업데이트로 정답 쪽 점수가 올라가서, 같은 문제를 다시 풀면 덜 놀라요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "66장 훈련 루프 한 바퀴",
    lap: "한 바퀴",
    repeat: "수없이 반복!",
    again: "다시 ①로",
    gpt: "GPT",
    ctx1: "나는",
    ctx2: "오늘",
    ctx3: "학교에",
    example: "설명용 예시",
    mess: "처음엔 엉망: 간다가 겨우 12%",
    lateFirst: "늦었다가 1등?!",
    lossIs: "놀람 = 손실",
    lossNote: "정답에 12%밖에 → 놀람 3.06",
    colW: "후보",
    colZ: "점수",
    colB: "책임",
    colNew: "새 점수",
    up: "↑ 올려요",
    down: "↓ 내려요",
    blameRule: "책임 = 확률 − (정답이면 1, 아니면 0)",
    backward: "손실을 거꾸로",
    real: "진짜 GPT에선 1,750억 개 숫자까지 책임이 흘러가요",
    update: "새 점수 = 점수 − 학습률 × 책임",
    lr: "학습률 1",
    mini: "설명용 미니 모델: 점수 4개만 고쳐요",
    probGo: "간다 확률",
    lossTitle: "놀람 (손실)",
    lap0: "처음",
    lap1: "1바퀴",
    lap2: "2바퀴",
    lap3: "3바퀴",
    many: "숫자 1,750억 개",
    pretrain: "사전학습",
    batch: "문제를 잔뜩 묶어서 (24장)",
    loopAll: "예측 → 손실 → 역전파 → 업데이트, 반복!",
  },
};
