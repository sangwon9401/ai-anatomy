import { NET, STORE_A, forward, type Net } from "./part2-toy";
import type { ChapterSpec } from "./types";

/**
 * 책임 of every knob for loss = (별점 − 정답)²: how much the loss changes per unit nudge.
 * Computed backwards, one multiplication per edge (the chain the chapter shows).
 */
export function blame(net: Net, x: readonly number[], target: number) {
  const f = forward(net, x);
  const dy = 2 * (f.y - target);
  const dh = net.v.map((v) => dy * v);
  const dz = dh.map((d, j) => (f.z[j] > 0 ? d : 0));
  const dW1 = net.W1.map((row, j) => row.map((_, i) => dz[j] * x[i]));
  const db1 = dz;
  const dv = f.h.map((h) => dy * h);
  const dc = dy;
  return { f, loss: (f.y - target) ** 2, dy, dh, dz, dW1, db1, dv, dc };
}

export function step(net: Net, x: readonly number[], target: number, lr: number): Net {
  const g = blame(net, x, target);
  const r = (v: number) => Math.round(v * 1e6) / 1e6;
  return {
    W1: net.W1.map((row, j) => row.map((w, i) => r(w - lr * g.dW1[j][i]))) as Net["W1"],
    b1: net.b1.map((b, j) => r(b - lr * g.db1[j])) as Net["b1"],
    v: net.v.map((v, j) => r(v - lr * g.dv[j])) as Net["v"],
    c: r(net.c - lr * g.dc),
  };
}

export const B0 = blame(NET, STORE_A.x, STORE_A.real);
export const LR23 = 0.005;
export const NET_AFTER = step(NET, STORE_A.x, STORE_A.real, LR23);
export const AFTER = blame(NET_AFTER, STORE_A.x, STORE_A.real);

export const ch23: ChapterSpec = {
  id: 23,
  part: 2,
  title: "역전파: 책임 나누기",
  core: true,
  hook: "손잡이가 수십억 개인데, 틀렸을 때 어느 손잡이를 얼마나 고쳐야 할까요?",
  steps: [
    { id: "s1", sec: 8, narration: "19장 신경망은 가게 A를 3.5점으로 예상했고, 진짜는 4.5점이라 손실은 1이에요. 손잡이 11개 중 누구 탓일까요?" },
    { id: "s2", sec: 8, narration: "21장처럼 하나씩 살짝 바꿔 보면 알 수 있어요. 하지만 GPT-3는 손잡이가 1,750억 개라 끝이 없어요." },
    { id: "s3", sec: 8, narration: "그래서 끝에서부터 거꾸로 책임을 나눠요. 별점을 0.01 올리면 손실이 0.02 줄어요. 별점의 책임은 −2예요." },
    { id: "s4", sec: 9, narration: "별점은 인기 × 1.5로 만들어졌어요. 그래서 인기의 책임은 −2 × 1.5 = −3. 책임이 선을 따라 거꾸로 흘러요." },
    { id: "s5", sec: 9, narration: "줄 가중치는 줄 2와 곱해져 인기를 만들어요. 그래서 책임은 −3 × 2 = −6. 이렇게 곱셈이 사슬처럼 이어져요." },
    { id: "s6", sec: 8, narration: "'너무 매움' 뉴런은 꺼져 있었죠. 꺼진 뉴런은 결과를 못 바꾸니 책임도 0. 그 손잡이들은 그대로 둬요." },
    { id: "s7", sec: 8, narration: "이렇게 한 번 거꾸로 훑으면 모든 손잡이의 책임이 한꺼번에 나와요. 이게 역전파(backpropagation)예요." },
    { id: "s8", sec: 9.5, narration: "책임의 반대쪽으로 조금씩 고치면 예측이 4.2점, 손실은 1에서 0.09로 줄어요. 1986년에 널리 알려진 방법이에요(3장)." },
  ],
  playgroundTitle: "책임 추적기",
  playgroundIntro: "손잡이 하나를 골라 보세요. 그 손잡이의 책임이 출력 쪽에서 거꾸로 어떻게 곱해져 오는지 보여요. '한 걸음 고치기'로 손실을 줄여 보세요.",
  summary: [
    "역전파: 손실에서 출발해 거꾸로, 선을 따라 책임을 곱해 나간다.",
    "손잡이의 책임 = 살짝 바꿨을 때 손실이 얼마나 변하나. 꺼진 뉴런 뒤는 0.",
    "한 번 거꾸로 훑으면 모든 손잡이의 책임이 나오고, 그 반대로 조금씩 고친다.",
  ],
  unlocks: "역전파",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "별점의 책임이 −2이고 별점 = 인기 × 1.5라면, 인기의 책임은?",
      choices: ["−3", "−0.5", "3.5"],
      answer: 0,
      explain: "인기를 살짝 올리면 별점이 1.5배만큼 오르니, 책임도 −2 × 1.5 = −3이에요.",
      review: "s4",
    },
    {
      q: "ReLU가 0으로 꺼 버린 뉴런으로 들어가는 가중치들의 책임은?",
      choices: ["가장 크다", "음수다", "0이다"],
      answer: 2,
      explain: "꺼진 뉴런은 입력이 조금 바뀌어도 계속 0이라 결과가 안 바뀌어요. 그래서 책임이 0이에요.",
      review: "s6",
    },
    {
      q: "역전파가 꼭 필요한 이유는?",
      choices: ["손실을 계산하려고", "모든 손잡이의 책임을 한 번에 빨리 구하려고", "입력 데이터를 늘리려고"],
      answer: 1,
      explain: "손잡이를 하나씩 살짝 바꿔 보면 1,750억 번 계산해야 해요. 역전파는 한 번 거꾸로 훑어서 전부 구해요.",
      review: "s2",
    },
  ],
  labels: {
    tag: "23장 역전파: 책임 나누기",
    title: "누구 탓일까?",
    example: "19장 신경망 · 가게 A · 설명용 예시",
    spicy: "맵기",
    line: "줄",
    price: "가격",
    h1: "인기",
    h2: "너무 매움",
    out: "별점",
    loss: "손실",
    knobs: "손잡이 11개",
    knobsSub: "가중치 8개 + 편향 3개",
    target: "정답 4.5",
    gpt: "GPT-3: 1,750억 개",
    oneByOne: "하나씩 살짝 바꿔 보기? 끝이 없어요",
    backward: "거꾸로 책임 나누기",
    blame: "책임",
    nudge: "별점 +0.01 → 손실 −0.02",
    chainTitle: "줄 가중치의 책임",
    chain: "−2 × 1.5 × 2 = −6",
    off: "꺼짐 → 책임 0",
    bp: "역전파 (backpropagation)",
    all: "한 번에 모든 책임!",
    update: "새 손잡이 = 손잡이 − 0.005 × 책임",
    before: "예측 3.5 · 손실 1",
    after: "예측 4.2 · 손실 0.09",
    year: "1986 역전파가 널리 알려지다 (3장)",
    big: "책임이 클수록 굵게",
  },
};
