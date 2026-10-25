import { NEURON, STORE_A, neuron } from "./part2-toy";
import type { ChapterSpec } from "./types";

/** 가게 A only, turning only the 줄 knob w: loss = (예측 − 4.5)² = (2w − 3)² */
export const lossA = (w: number) => (neuron(STORE_A.x, [NEURON.w[0], w, NEURON.w[2]], NEURON.b) - STORE_A.real) ** 2;
/** slope measured the way the chapter explains it: nudge w a little and see how the loss changes */
export const slopeA = (w: number, d = 1e-4) => (lossA(w + d) - lossA(w - d)) / (2 * d);
export const LR = 0.1;
export const W0 = NEURON.w[1];
/** w after each gradient step from W0 */
export const PATH = (() => {
  const ws = [W0];
  for (let i = 0; i < 5; i++) {
    const w = ws[ws.length - 1];
    ws.push(Math.round((w - LR * slopeA(w)) * 1e6) / 1e6);
  }
  return ws;
})();

export const ch21: ChapterSpec = {
  id: 21,
  part: 2,
  title: "경사하강법",
  core: true,
  hook: "손실을 줄이려면 손잡이를 어느 쪽으로, 얼마나 돌려야 할까요?",
  steps: [
    { id: "s1", sec: 8, narration: "가게 A 하나만 보고, 16장 뉴런의 줄 손잡이 w 하나만 돌려 볼게요. 지금 w는 1, 손실은 1이에요." },
    { id: "s2", sec: 8, narration: "w를 여러 값으로 바꾸며 손실을 찍어 보면 골짜기 모양이 나와요. 우리는 가장 낮은 바닥을 찾고 싶어요." },
    { id: "s3", sec: 9, narration: "그런데 실제로는 이 그림을 볼 수 없어요. 손잡이가 수없이 많으니까요. 안개 낀 산에서 발밑만 보이는 셈이에요." },
    { id: "s4", sec: 8, narration: "발밑의 기울기는 알 수 있어요. w를 0.01만 살짝 올려 보면 손실이 1에서 0.96으로, 약 0.04 줄어요." },
    { id: "s5", sec: 9, narration: "기울기는 살짝 바꿨을 때 손실이 얼마나 변하나예요. −0.04 ÷ 0.01 = 약 −4. 음수니까 w를 올리면 내려가요." },
    { id: "s6", sec: 9, narration: "그래서 기울기의 반대쪽으로 한 걸음! 새 w = 1 − 0.1 × (−4) = 1.4. 0.1은 보폭이에요(22장 학습률)." },
    { id: "s7", sec: 9, narration: "이걸 되풀이하면 공이 바닥으로 굴러가요. w는 1.5, 예측은 4.5점, 손실은 0. 이게 경사하강법이에요." },
    { id: "s8", sec: 9, narration: "손잡이가 둘이면 그릇 모양이 돼요. 1,750억 개면 상상도 못 할 산이지만, 손잡이마다 기울기를 구하는 건 똑같아요." },
  ],
  playgroundTitle: "안개 속 하산",
  playgroundIntro: "골짜기는 안개에 가려 있어요. '기울기 재기'로 발밑만 확인하고, 손잡이를 돌려 손실을 0.01 아래로 내려 보세요. 막히면 '자동으로 한 걸음'을 눌러 보세요.",
  summary: [
    "기울기 = 손잡이를 살짝 바꿨을 때 손실이 얼마나 변하나.",
    "기울기의 반대쪽으로 조금씩: 새 손잡이 = 손잡이 − 학습률 × 기울기.",
    "되풀이하면 손실의 골짜기 바닥으로 내려간다. 이게 경사하강법.",
  ],
  unlocks: "경사하강법",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "손잡이를 0.01 올렸더니 손실이 0.03 늘었어요. 기울기는 약 얼마일까요?",
      choices: ["−3", "+3", "+0.03"],
      answer: 1,
      explain: "기울기 = 손실 변화 ÷ 손잡이 변화 = 0.03 ÷ 0.01 = 3이에요. 늘었으니 양수예요.",
      review: "s5",
    },
    {
      q: "기울기가 +3이면 손잡이를 어느 쪽으로 돌려야 손실이 줄까요?",
      choices: ["올린다", "내린다", "그대로 둔다"],
      answer: 1,
      explain: "올리면 손실이 느니까 반대로 내려야 해요. 새 값 = 지금 값 − 학습률 × 3.",
      review: "s6",
    },
    {
      q: "w = 2, 기울기 = 5, 학습률 = 0.1이면 한 걸음 뒤의 w는?",
      choices: ["1.5", "2.5", "1.9"],
      answer: 0,
      explain: "2 − 0.1 × 5 = 2 − 0.5 = 1.5예요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "21장 경사하강법",
    title: "줄 손잡이 w 하나만",
    example: "가게 A만 · 설명용 예시",
    axisW: "w (줄 손잡이)",
    axisL: "손실",
    now: "지금: w = 1, 손실 = 1",
    valley: "손실 골짜기",
    goal: "여기가 바닥!",
    fog: "안개 속: 발밑만 보여요",
    nudgeW: "w: 1 → 1.01",
    nudgeL: "손실: 1 → 0.96",
    nudgeD: "약 0.04 줄었다",
    slope: "기울기 ≈ −0.04 ÷ 0.01 = −4",
    slopeNote: "음수 → w를 올리면 손실이 준다",
    rule: "새 w = 1 − 0.1 × (−4) = 1.4",
    lr: "0.1 = 보폭 (학습률)",
    loss14: "손실 1 → 0.04",
    repeat: "1 → 1.4 → 1.48 → 1.496 → … → 1.5",
    done: "예측 4.5점 = 진짜 별점!",
    gd: "경사하강법",
    bowl: "손잡이 2개 = 그릇 모양",
    k1: "손잡이 1",
    k2: "손잡이 2",
    many: "1,750억 개도 같은 방법",
    bowlEx: "설명용 그림",
  },
};
