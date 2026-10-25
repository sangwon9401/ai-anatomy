import { MNIST_TEST_ACC } from "./part2-mnist";
import { predict, sampleDigit } from "./part2-mnist-net";
import type { ChapterSpec } from "./types";

/** the scene's 3 (an MNIST test image) and what the embedded network says about it */
export const THREE = sampleDigit(3);
export const THREE_OUT = predict(THREE);
/** s1 zoom: a 4×4 patch of the 3 (rows, cols) */
export const PATCH = { row: 10, col: 10, n: 4 };
export const PATCH_VALUES = Array.from({ length: PATCH.n }, (_, r) => Array.from({ length: PATCH.n }, (_, c) => THREE[(PATCH.row + r) * 28 + PATCH.col + c]));
export const ACC_PCT = (MNIST_TEST_ACC * 100).toFixed(2);
export const ACC_RIGHT = Math.round(MNIST_TEST_ACC * 10000);
/** s2 draws 8 of the 64 hidden neurons: the five most active for this 3, and three that stay off */
export const SHOWN_HIDDEN = (() => {
  const idx = Array.from(THREE_OUT.hidden, (v, i) => [i, v] as [number, number]);
  const on = [...idx].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const off = idx.filter(([, v]) => v === 0).slice(0, 3);
  return [on[0], off[0], on[1], on[2], off[1], on[3], off[2], on[4]];
})();
export const HIDDEN_MAX = Math.max(...THREE_OUT.hidden);
export const ACTIVE_COUNT = THREE_OUT.hidden.filter((v) => v > 0).length;

export const ch26: ChapterSpec = {
  id: 26,
  part: 2,
  title: "직접 해보기: 손글씨 숫자",
  core: false,
  hook: "내가 손가락으로 쓴 숫자를 신경망이 정말 알아볼 수 있을까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "숫자 그림은 28 × 28 = 784칸이에요. 칸마다 0(빈칸)부터 1(진한 잉크)까지의 숫자가 들어 있어요(6장)." },
    { id: "s2", sec: 9.5, narration: "784개 숫자가 입력이에요. 은닉층 뉴런 64개가 저마다 (입력 × 가중치)의 합 + 편향을 계산하고 ReLU로 꺾어요(16~19장)." },
    { id: "s3", sec: 9.5, narration: "출력 뉴런 10개가 0~9의 점수를 내고, 소프트맥스로 확률을 만들어요(14장). 이 그림은 3이 87.5%, 5가 11.3%." },
    { id: "s4", sec: 9, narration: "학습에는 MNIST라는 손글씨 6만 장을 썼어요. 순전파, 손실, 역전파, 고치기를 미니배치로 되풀이했죠(19~24장)." },
    { id: "s5", sec: 9, narration: "다 배운 뒤 처음 보는 시험 그림 1만 장으로 채점했더니 97.96%를 맞혔어요. 이 앱 안에 든 바로 그 신경망이에요." },
    { id: "s6", sec: 9, narration: "은닉 뉴런의 가중치를 그림으로 그리면 획의 조각 같은 무늬가 보여요. 아무도 가르쳐 주지 않았는데 스스로 찾은 거예요." },
    { id: "s7", sec: 7, narration: "이제 직접 그려 볼 차례예요. 아래 칸에 손가락으로 숫자를 그리면, 브라우저 속 신경망이 바로 맞혀요." },
  ],
  playgroundTitle: "숫자 맞히기",
  playgroundIntro: "네모 칸에 손가락(또는 마우스)으로 0부터 9까지 숫자 하나를 크게 그려 보세요. 신경망이 보는 28×28 그림과 숫자별 확률이 바로 나와요.",
  summary: [
    "숫자 그림 = 28 × 28 = 784개의 숫자. 이게 신경망의 입력이다.",
    "784 → 은닉 뉴런 64개(ReLU) → 출력 10개 → 소프트맥스로 0~9의 확률.",
    "MNIST 6만 장으로 학습하고, 처음 보는 1만 장 중 약 98%를 맞혔다.",
  ],
  unlocks: "손글씨 인식기",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "28 × 28 크기의 흑백 숫자 그림은 숫자 몇 개로 나타낼까요?",
      choices: ["56개", "784개", "28개"],
      answer: 1,
      explain: "가로 28칸 × 세로 28칸 = 784칸이고, 칸마다 숫자가 하나씩 있어요.",
      review: "s1",
    },
    {
      q: "출력 뉴런 10개의 점수를 확률로 바꾸는 계산은?",
      choices: ["ReLU", "정규화", "소프트맥스"],
      answer: 2,
      explain: "점수를 e로 올리고 합으로 나누는 소프트맥스(14장)로 0~9의 확률을 만들어요.",
      review: "s3",
    },
    {
      q: "신경망의 실력을 재려면 어떤 그림으로 채점해야 할까요?",
      choices: ["학습에 쓰지 않은 처음 보는 그림", "학습에 쓴 그림", "아무 그림이나"],
      answer: 0,
      explain: "외운 걸 다시 물으면 실력을 알 수 없어요(25장). 처음 보는 시험 그림 1만 장으로 채점했어요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "26장 직접 해보기: 손글씨 숫자",
    title: "손글씨 숫자 하나",
    grid: "28 × 28 = 784칸",
    scale: "0 = 빈칸, 1 = 진한 잉크",
    zoom: "확대",
    mnist: "MNIST 시험 그림",
    inputs: "입력 784개",
    hidden: "은닉 뉴런 64개",
    outputs: "출력 10개",
    drawn: "64개 중 8개만 그렸어요",
    active: "이 그림에선 64개 중 35개가 켜졌어요",
    relu: "ReLU로 꺾기",
    on: "켜진 뉴런은 노랗게",
    probTitle: "점수 → 소프트맥스 → 확률",
    confuse: "5와 조금 헷갈려요",
    trainTitle: "MNIST 손글씨 6만 장으로 학습",
    loop: "순전파 → 손실 → 역전파 → 고치기",
    batch: "미니배치로 되풀이",
    test: "처음 보는 시험 그림 1만 장",
    right: "장 정답",
    measured: "이 앱에 든 신경망으로 직접 잰 값",
    seeTitle: "은닉 뉴런이 보는 무늬",
    plus: "+ 가중치: 여기 잉크가 있으면 켜져요",
    minus: "− 가중치: 여기 잉크가 있으면 꺼져요",
    self: "아무도 안 가르쳐 줬어요!",
    neuron: "뉴런",
    go: "이제 직접 그려 볼 차례!",
    down: "아래 칸에 숫자를 그려 보세요",
    digits: "0 1 2 3 4 5 6 7 8 9 %",
  },
};
