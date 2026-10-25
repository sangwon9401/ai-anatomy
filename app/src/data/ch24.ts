import { bookLoss, train } from "./part2-batch";
import { NEURON, STORES, TUNED_LINE_W, neuron } from "./part2-toy";
import type { ChapterSpec, Highlighter } from "./types";

/** s1: tuning the 줄 knob for 가게 A alone (16장, 21장) helps A but hurts the five stores overall */
export const ONLY_A = STORES.map((s) => {
  const before = neuron(s.x, NEURON.w, NEURON.b) - s.real;
  const after = neuron(s.x, [NEURON.w[0], TUNED_LINE_W, NEURON.w[2]], NEURON.b) - s.real;
  return { name: s.name, before, after };
});
export const LOSS_BEFORE = ONLY_A.reduce((a, r) => a + r.before ** 2, 0) / ONLY_A.length;
export const LOSS_AFTER = ONLY_A.reduce((a, r) => a + r.after ** 2, 0) / ONLY_A.length;

export const BATCH_LR = 0.05;
export const CMP_EPOCHS = 3;
/** s5: loss over the whole book after every update, three epochs, three batch sizes */
export const CURVES: { batch: number; c: Highlighter; loss: number[] }[] = [1, 10, 60].map((batch, i) => ({
  batch,
  c: (["pink", "mint", "sky"] as Highlighter[])[i],
  loss: train(batch, CMP_EPOCHS, BATCH_LR).map(([w, b]) => bookLoss(w, b)),
}));

export const ch24: ChapterSpec = {
  id: 24,
  part: 2,
  title: "문제집 나눠 풀기",
  core: false,
  hook: "문제가 수백만 개인 문제집, 한 문제씩 고칠까요, 다 풀고 한 번에 고칠까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "A에 맞춰 줄 손잡이를 1.5로 바꾸면 A는 딱 맞지만, B가 크게 틀어져서 다섯 곳 전체 손실은 0.7에서 1.95로 커져요." },
    { id: "s2", sec: 8, narration: "그래서 문제집 전체를 보고 고쳐야 해요. 그런데 문제가 수백만 개면, 다 풀고 한 번 고치기엔 너무 느려요." },
    { id: "s3", sec: 9.5, narration: "그래서 몇 문제씩 묶어서 풀어요. 한 묶음을 풀고, 채점하고, 손잡이를 고치고, 다음 묶음으로. 이 묶음이 미니배치예요." },
    { id: "s4", sec: 8, narration: "문제집을 처음부터 끝까지 한 번 다 풀면 1 에폭(epoch)이라고 해요. 보통 여러 에폭을 되풀이해요." },
    { id: "s5", sec: 9.5, narration: "문제 180개를 푸는 동안 비교해요. 한 문제씩은 빨리 내려가지만 들쭉날쭉, 전부 다는 겨우 3번. 10문제씩은 부드러워요." },
    { id: "s6", sec: 9, narration: "컴퓨터는 묶음 하나를 한꺼번에 계산해서 빨라요(68장). GPT-3는 한 묶음에 토큰을 약 320만 개씩 담았어요." },
    { id: "s7", sec: 8, narration: "미니배치로 나눠 풀고, 에폭을 되풀이하기. 그런데 같은 문제집만 너무 많이 풀면 생기는 문제가 있어요(25장)." },
  ],
  playgroundTitle: "묶음 크기 실험",
  playgroundIntro: "가게 60곳짜리 문제집으로 16장 뉴런의 손잡이 두 개(줄 가중치, 편향)를 학습시켜요. 묶음 크기를 골라 '1 에폭 풀기'를 눌러 보세요.",
  summary: [
    "한 문제만 보고 고치면 다른 문제가 틀어진다. 문제집 전체를 봐야 한다.",
    "미니배치: 몇 문제씩 묶어 풀고 채점하고 고치기. 에폭: 문제집을 한 바퀴.",
    "한 문제씩은 비틀비틀, 전부 다는 느림. 적당한 묶음이 빠르고 덜 흔들린다.",
  ],
  unlocks: "미니배치 · 에폭",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "문제 1,000개를 100개씩 묶어 풀면, 1 에폭 동안 손잡이를 몇 번 고칠까요?",
      choices: ["10번", "100번", "1,000번"],
      answer: 0,
      explain: "1,000 ÷ 100 = 10묶음이에요. 묶음마다 한 번씩 고치니까 10번이에요.",
      review: "s3",
    },
    {
      q: "'1 에폭'이란?",
      choices: ["손잡이를 한 번 고친 것", "문제집 전체를 처음부터 끝까지 한 번 푼 것", "문제 하나를 푼 것"],
      answer: 1,
      explain: "에폭은 학습 데이터 전체를 한 바퀴 다 본 거예요.",
      review: "s4",
    },
    {
      q: "한 문제씩 보고 바로 고칠 때의 특징은?",
      choices: ["자주 고치지만 방향이 들쭉날쭉하다", "한 에폭에 한 번만 고친다", "항상 가장 정확하다"],
      answer: 0,
      explain: "문제 하나만 보고 고치니 그 문제 쪽으로 쏠렸다가 다른 문제 쪽으로 쏠려요. 그래서 길이 비틀비틀해요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "24장 문제집 나눠 풀기",
    s1title: "가게 A에만 맞췄더니",
    col0: "가게",
    col1: "처음 오차",
    col2: "A에 맞춘 뒤",
    total: "다섯 곳 전체 손실",
    worse: "A만 보고 고치면 B가 망가져요",
    book: "문제집",
    probs: "문제 수백만 개",
    allAtOnce: "다 풀고 나서 한 번 고치기?",
    tooSlow: "한 번 고치는 데 너무 오래 걸려요",
    bundle: "10문제",
    station: "채점 → 손잡이 고치기",
    done: "다 푼 묶음",
    count: "묶음",
    minibatch: "미니배치 = 한 묶음",
    epoch: "1 에폭 완료!",
    again: "다시 처음부터: 2 에폭",
    cmp: "같은 3 에폭 (문제 180개) 동안",
    solved: "푼 문제 수",
    lossAxis: "손실",
    jump: "가끔 크게 튀어요",
    axisW: "줄 가중치",
    axisB: "편향",
    b1: "한 문제씩: 180번 고침",
    b10: "10문제씩: 18번",
    b60: "전부 다: 3번",
    bottom: "바닥",
    start: "출발",
    example: "가게 60곳 · 설명용 예시",
    gpu: "묶음 하나를 한꺼번에 계산 (68장)",
    gptBatch: "GPT-3 한 묶음: 토큰 약 320만 개",
    gptAll: "문제집 전체: 약 3,000억 토큰",
    sumA: "미니배치: 몇 문제씩 묶어 풀고 고치기",
    sumB: "에폭: 문제집을 한 바퀴",
    next: "같은 문제집만 너무 풀면? → 25장",
  },
};
