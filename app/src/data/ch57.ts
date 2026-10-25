import { UNLOCK6 } from "./ch54";
import { stats } from "./ch15";
import type { ChapterSpec } from "./types";

// 설명용 예시. A word vector early on, and the same word much later: same shape, 4× the size.
export const EARLY = [3, 17, 9, 11]; // mean 10, spread 5
export const LATE = [12, 68, 36, 44]; // mean 40, spread 20

/** s5: every word normalised with its own numbers */
export const ROWS: { w: string; v: number[] }[] = [
  { w: "나는", v: [2.7, 1.9, 1.3, 2.1] },
  { w: "오늘", v: [-3, 1, 1, -3] },
  { w: "학교에", v: EARLY },
];

/** s6: the learned scale and shift (설명용) */
export const GAIN = [1.5, 0.5, 2.0, 1.0];
export const SHIFT = [0, 0.3, 0, -0.2];

/** s1: one vector drifting bigger through the layers (설명용) */
export const GROW_STRIP = [0.9, -0.6, 0.4, 1.1, -0.9, 0.3, -0.4, 0.7];
export const GROW = [
  { layer: 1, k: 1 },
  { layer: 24, k: 2 },
  { layer: 48, k: 3.2 },
  { layer: 96, k: 5 },
];

/** Layer normalisation of one vector: subtract its mean, divide by its spread (15장), then scale and shift. */
export function layerNorm(v: number[], gain: number[] | number = 1, shift: number[] | number = 0) {
  const { mean, sd } = stats(v);
  const z = v.map((x) => (x - mean) / sd);
  const g = (i: number) => (typeof gain === "number" ? gain : gain[i]);
  const b = (i: number) => (typeof shift === "number" ? shift : shift[i]);
  return { mean, sd, z, out: z.map((x, i) => x * g(i) + b(i)) };
}

/** playground: the three words' vectors after `layer` layers (설명용; they grow at different rates and drift a little) */
export function wordsAt(layer: number) {
  return ROWS.map((r, wi) => {
    const k = 1 + (layer - 1) * [0.03, 0.05, 0.04][wi];
    return { w: r.w, v: r.v.map((x, i) => x * k + Math.sin(layer * 0.21 + i * 1.7 + wi) * 0.04 * layer) };
  });
}

export const ch57: ChapterSpec = {
  id: 57,
  part: 6,
  title: "흔들림 잡기",
  core: false,
  hook: "결과를 계속 더하면, 96층쯤엔 숫자가 엄청 커지지 않을까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "56장에서 결과를 계속 더한다고 했죠. 층을 지나며 더하다 보면 벡터의 숫자가 점점 커져요." },
    { id: "s2", sec: 10, narration: "같은 '학교에'인데 층마다 크기가 이렇게 다르면, 부품은 매번 다른 잣대로 계산해야 해요. 계산이 흔들리죠." },
    { id: "s3", sec: 9.5, narration: "그래서 부품에 넣기 직전에 15장의 정규화를 해요. 단어 벡터 하나 안의 숫자들로 평균과 퍼진 정도를 구해요." },
    { id: "s4", sec: 9.5, narration: "평균 10을 빼고 퍼진 정도 5로 나누면 이렇게 돼요. 4배로 커진 벡터도 똑같은 결과가 나와요." },
    { id: "s5", sec: 9.5, narration: "이 계산은 단어마다 따로 해요. 각 단어가 자기 숫자 12,288개끼리만 평균과 퍼진 정도를 구해요." },
    { id: "s6", sec: 9.5, narration: "마지막으로 숫자마다 배율을 곱하고 값을 더해요. 이 값은 학습으로 정해서, 알맞은 크기를 모델이 골라요." },
    { id: "s7", sec: 9.5, narration: "GPT에서는 어텐션과 피드포워드에 들어가기 직전마다 정규화해요. 고속도로 위의 원래 값은 그대로 두고요." },
  ],
  playgroundTitle: "크기 맞추기 실험",
  playgroundIntro: "층 슬라이더를 올려 단어 벡터를 키워 보세요. 레이어 정규화를 켜면 부품에 들어가는 숫자가 어떻게 바뀌는지 보세요.",
  summary: [
    "층을 지나며 결과를 더하다 보면 벡터의 숫자가 커지고 들쭉날쭉해진다.",
    "레이어 정규화: 단어마다 자기 숫자들로 평균을 빼고 퍼진 정도로 나눈다(15장). 그다음 배율을 곱하고 값을 더한다.",
    "GPT는 어텐션과 피드포워드에 들어가기 직전마다 정규화한다.",
  ],
  unlocks: "레이어 정규화",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "단어 벡터 [3, 17, 9, 11]을 정규화할 때 빼는 값은?",
      choices: ["평균 10", "가장 큰 값 17", "가장 작은 값 3"],
      answer: 0,
      explain: "(3 + 17 + 9 + 11) ÷ 4 = 10. 평균을 빼고, 퍼진 정도 5로 나눠요.",
      review: "s3",
    },
    {
      q: "레이어 정규화에서 평균과 퍼진 정도는 무엇으로 구할까요?",
      choices: ["모든 단어의 같은 자리 숫자들로", "단어 하나의 자기 숫자들로", "학습 데이터 전체로"],
      answer: 1,
      explain: "단어마다 따로, 자기 벡터 안의 숫자들끼리 계산해요. GPT-3라면 12,288개끼리요.",
      review: "s5",
    },
    {
      q: "GPT에서 레이어 정규화는 어디에 있을까요?",
      choices: ["맨 처음 토크나이저 앞에만", "소프트맥스 뒤에만", "어텐션과 피드포워드에 들어가기 직전마다"],
      answer: 2,
      explain: "블록마다 두 번, 부품에 넣기 직전에 크기를 맞춰요. 고속도로 위의 값은 건드리지 않아요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "57장 흔들림 잡기",
    layer: "층",
    grow: "층을 지날수록 커져요",
    fine: "적당한 크기",
    toy: "설명용 예시",
    early: "3층의 '학교에'",
    late: "90층의 '학교에'",
    same: "모양은 같은데 크기는 4배!",
    shaky: "부품은 매번 다른 잣대로 계산 → 흔들려요",
    mean: "평균",
    spread: "퍼진 정도",
    step1: "① 평균 빼기",
    step2: "② 퍼진 정도로 나누기",
    ch15: "(15장)",
    equal: "똑같아요!",
    title: "레이어 정규화",
    en: "(layer normalization)",
    own: "단어마다 따로, 자기 숫자들끼리",
    real: "(GPT-3: 단어마다 12,288개)",
    z: "정규화한 값",
    gain: "× 배율",
    shift: "+ 이동",
    out: "= 부품에 들어갈 값",
    learned: "배율과 이동은 학습으로 정해요",
    before: "부품 들어가기 직전",
    keepRoad: "고속도로 위 값은 그대로",
    arrow: "→",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
  },
};
