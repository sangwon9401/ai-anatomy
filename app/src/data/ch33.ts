import type { ChapterSpec, Highlighter } from "./types";

export type V3 = [number, number, number];

// illustrative 3-number embeddings (설명용 예시), four themed clusters; nearest neighbours and label overlaps
// (for the scene's view angles) checked with a script. `side`/`dy` place the word label in the scene.
export const STARS: { w: string; v: V3; group: number; side?: "l"; dy?: number }[] = [
  { w: "강아지", v: [0.8, 0.7, -0.2], group: 0, side: "l" },
  { w: "고양이", v: [0.6, 0.9, 0.0], group: 0 },
  { w: "토끼", v: [0.35, 0.85, -0.55], group: 0, side: "l" },
  { w: "호랑이", v: [1.0, 0.75, 0.2], group: 0 },
  { w: "사과", v: [-0.7, 0.5, 0.5], group: 1, side: "l" },
  { w: "포도", v: [-0.95, 0.75, 0.55], group: 1, side: "l" },
  { w: "바나나", v: [-0.5, 0.95, 0.75], group: 1 },
  { w: "딸기", v: [-0.8, 0.9, 0.2], group: 1, side: "l" },
  { w: "버스", v: [0.1, -0.8, 0.5], group: 2, side: "l", dy: 10 },
  { w: "지하철", v: [0.5, -0.95, 0.3], group: 2 },
  { w: "자전거", v: [-0.15, -0.55, 0.85], group: 2, side: "l" },
  { w: "비행기", v: [0.45, -0.4, 0.95], group: 2 },
  { w: "학교", v: [-0.3, -0.4, -0.75], group: 3 },
  { w: "선생님", v: [0.0, -0.15, -0.95], group: 3 },
  { w: "숙제", v: [-0.6, -0.35, -0.6], group: 3, side: "l" },
  { w: "교실", v: [-0.35, -0.75, -0.9], group: 3 },
];
export const GROUPS: { name: string; c: Highlighter }[] = [
  { name: "동물", c: "yellow" },
  { name: "과일", c: "pink" },
  { name: "탈것", c: "sky" },
  { name: "학교", c: "mint" },
];

export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** small seeded PRNG so the "before training" positions are the same everywhere */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(33);
export const RANDOM_START: V3[] = STARS.map(() => [rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9, rnd() * 1.8 - 0.9]);

/** Turn around the vertical axis by `yaw`, tilt by `pitch`; returns screen x, y and depth (−1 far … 1 near). */
export function project(v: V3, yaw: number, pitch: number) {
  const x1 = v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw);
  const z1 = -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw);
  const y2 = v[1] * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = v[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  return { x: x1, y: y2, z: z2 };
}

// GPT-3: 50,257 tokens × 12,288 numbers = 617,558,016
export const GPT3_TABLE = 50257 * 12288;

export const ch33: ChapterSpec = {
  id: 33,
  part: 3,
  title: "임베딩: 의미의 좌표",
  core: true,
  hook: "'강아지'와 '고양이'가 닮았다는 걸, 숫자로 어떻게 나타낼까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "원-핫 대신 단어마다 짧은 숫자 줄을 줘요. 강아지는 [0.8, 0.7, −0.2]. 단어를 이런 숫자 줄로 바꾸는 게 임베딩이에요.", tts: "원-핫 대신 단어마다 짧은 숫자 줄을 줘요. 강아지는 0.8, 0.7, 마이너스 0.2. 단어를 이런 숫자 줄로 바꾸는 게 임베딩이에요." },
    { id: "s2", sec: 7, narration: "숫자가 세 개면 3D 공간의 점 하나가 돼요. 단어들이 별자리처럼 공간에 떠 있어요." },
    { id: "s3", sec: 8, narration: "뜻이 비슷한 단어는 가까이 모여요. 동물은 동물끼리, 과일은 과일끼리. 8장의 단어 지도를 3D로 띄운 셈이에요." },
    { id: "s4", sec: 8.5, narration: "닮은 정도는 내적으로 잴 수 있어요(9장). 강아지·고양이는 1.11, 강아지·버스는 −0.58. 방향이 같을수록 커요.", tts: "닮은 정도는 내적으로 잴 수 있어요. 강아지와 고양이는 1.11, 강아지와 버스는 마이너스 0.58. 방향이 같을수록 커요." },
    { id: "s5", sec: 8, narration: "모델 안에는 임베딩 표가 있어요. 한 줄이 토큰 하나예요. 토큰 번호로 그 줄을 찾아 꺼내 쓰면 돼요." },
    { id: "s6", sec: 8.5, narration: "처음엔 표에 숫자가 아무렇게나 들어 있어요. 다음 조각 맞히기를 학습하면서 비슷한 단어끼리 자리를 찾아가요." },
    { id: "s7", sec: 8.5, narration: "진짜 크기는요? GPT-3는 토큰마다 숫자가 12,288개, 줄은 약 5만 개. 이 표에만 숫자가 6억 개 넘게 들어 있어요." },
    { id: "s8", sec: 7.5, narration: "토큰을 의미의 좌표로 바꾸는 임베딩, 설계도의 두 번째 부품이 채워졌어요. 다음 장에선 좌표가 뜻을 얻는 방법을 봐요." },
  ],
  playgroundTitle: "별자리 돌리기",
  playgroundIntro: "공간을 끌어서 돌려 보세요. 별(단어)을 누르면 그 단어의 숫자 세 개와 가장 가까운 단어가 나와요. 슬라이더로 학습 전과 후를 비교해 봐요.",
  summary: [
    "임베딩: 토큰마다 짧은 숫자 줄(벡터)을 주는 것. 숫자들이 곧 좌표.",
    "뜻이 비슷한 단어는 가까이, 같은 방향으로 놓인다(거리 8장, 내적 9장).",
    "임베딩 표의 숫자는 학습으로 정해진다. GPT-3 표에는 숫자 6억 개 이상.",
  ],
  unlocks: "임베딩",
  quiz: [
    {
      q: "임베딩이란?",
      choices: ["토큰마다 뜻이 담긴 짧은 숫자 줄을 주는 것", "토큰에 번호를 붙이는 것", "단어를 가나다순으로 정렬하는 것"],
      answer: 0,
      explain: "번호(29장)나 원-핫(32장)과 달리, 비슷한 단어끼리 비슷한 숫자가 되도록 만든 좌표예요.",
      review: "s1",
    },
    {
      q: "강아지 [0.8, 0.7, −0.2]와 고양이 [0.6, 0.9, 0]의 내적은?",
      choices: ["0", "1.11", "−0.58"],
      answer: 1,
      explain: "0.8×0.6 + 0.7×0.9 + (−0.2)×0 = 0.48 + 0.63 + 0 = 1.11이에요.",
      review: "s4",
    },
    {
      q: "임베딩 표의 숫자는 어떻게 정해질까요?",
      choices: ["사람이 단어마다 하나씩 정한다", "사전 순서대로 정해진다", "처음엔 아무렇게나, 학습하면서 고쳐진다"],
      answer: 2,
      explain: "다음 조각 맞히기를 연습하며 조금씩 고쳐져요. 그러다 보면 비슷한 단어끼리 모여요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "33장 임베딩: 의미의 좌표",
    dog: "강아지",
    dogVec: "[0.8, 0.7, −0.2]",
    emb: "임베딩 = 단어 → 숫자 줄",
    oneHot: "원-핫: 약 20만 칸",
    short: "임베딩: 숫자 몇 개",
    point: "숫자 3개 = 3D 공간의 점",
    constel: "단어 별자리",
    example: "설명용 예시 (진짜는 숫자가 수천 개)",
    near: "뜻이 비슷하면 가까이",
    dotTitle: "내적으로 닮음 재기 (9장)",
    dot1: "강아지 · 고양이 = 1.11",
    dot2: "강아지 · 버스 = −0.58",
    sameDir: "같은 방향일수록 커요",
    table: "임베딩 표",
    rowNote: "한 줄 = 토큰 하나",
    lookup: "토큰 번호로 줄 꺼내기",
    matmul: "원-핫 × 표 = 그 줄 (11장 행렬 곱)",
    before: "학습 전: 아무렇게나",
    after: "학습 후: 비슷한 것끼리",
    real: "GPT-3의 임베딩 표",
    rows: "줄 50,257개 (토큰)",
    cols: "칸 12,288개 (숫자)",
    total: "50,257 × 12,288 = 617,558,016",
    over: "숫자 6억 개가 넘어요!",
    bp: "설계도 두 번째 부품 완성!",
    empty: "빈칸",
    next: "다음: 좌표는 어떻게 뜻을 얻을까? (34장)",
    ax1: "칸1",
    ax2: "칸2",
    ax3: "칸3",
    id: "번호",
  },
};
