import type { ChapterSpec } from "./types";

/** [과일 배, 타는 배, 몸의 배] — a toy 3-dimensional "meaning" so students can see the mix. */
export type Meaning = [number, number, number];

export type ToyWord = { w: string; m: Meaning; score: number };

// Relevance score of each word *to "배"*. Attention weights are softmax(score), exactly like ch.14.
export const SELF: ToyWord = { w: "배", m: [1 / 3, 1 / 3, 1 / 3], score: 1.0 };

export const BANK: ToyWord[] = [
  { w: "바다", m: [0.02, 0.95, 0.03], score: 2.3 },
  { w: "위에", m: [0.33, 0.34, 0.33], score: 0.9 },
  { w: "떠", m: [0.05, 0.9, 0.05], score: 1.9 },
  { w: "있는", m: [0.33, 0.34, 0.33], score: 1.0 },
  { w: "낚시", m: [0.03, 0.92, 0.05], score: 2.0 },
  { w: "과일", m: [0.95, 0.02, 0.03], score: 2.0 },
  { w: "가게에서", m: [0.45, 0.3, 0.25], score: 1.1 },
  { w: "사과와", m: [0.92, 0.03, 0.05], score: 2.0 },
  { w: "달콤한", m: [0.85, 0.03, 0.12], score: 1.6 },
  { w: "밥을", m: [0.1, 0.05, 0.85], score: 1.7 },
  { w: "많이", m: [0.33, 0.33, 0.34], score: 0.8 },
  { w: "먹었더니", m: [0.2, 0.03, 0.77], score: 2.0 },
  { w: "볼록한", m: [0.15, 0.15, 0.7], score: 1.5 },
  { w: "오늘", m: [0.33, 0.33, 0.34], score: 0.3 },
];

export const SENTENCES = {
  sea: ["바다", "위에", "떠", "있는"],
  fruit: ["과일", "가게에서", "사과와"],
  meal: ["밥을", "많이", "먹었더니"],
};

const byWord = (w: string) => BANK.find((b) => b.w === w)!;

export function attend(context: string[]) {
  const words = [...context.map(byWord), SELF];
  const ex = words.map((x) => Math.exp(x.score));
  const sum = ex.reduce((a, b) => a + b, 0);
  const weights = ex.map((e) => e / sum);
  const mix: Meaning = [0, 0, 0];
  words.forEach((x, i) => x.m.forEach((v, k) => (mix[k] += weights[i] * v)));
  return { words, weights, mix };
}

/** Round to whole percents that still add up to exactly 100 (largest remainder). */
export function percents(values: number[]): number[] {
  const raw = values.map((v) => v * 100);
  const floor = raw.map(Math.floor);
  let left = 100 - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floor[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    floor[i] += 1;
    left -= 1;
  }
  return floor;
}

export const MEANING_NAMES = ["과일 배", "타는 배", "몸의 배"] as const;

export const ch45: ChapterSpec = {
  id: 45,
  part: 5,
  title: "단어들이 서로를 쳐다본다",
  core: true,
  hook: "'배'는 먹는 배일까, 타는 배일까? AI는 어떻게 구별할까요?",
  steps: [
    { id: "s1", sec: 6, narration: "'배'라는 말에는 뜻이 여러 개예요. 먹는 과일 배, 타는 배, 그리고 우리 몸의 배." },
    { id: "s2", sec: 7, narration: "33장에서 배운 임베딩에서 '배'는 늘 같은 벡터 하나예요. 그래서 혼자서는 세 뜻의 한가운데쯤에 있어요." },
    { id: "s3", sec: 6, narration: "이제 문장 속에 넣어 볼게요. '바다 위에 떠 있는 배'." },
    { id: "s4", sec: 8, narration: "'배'가 앞에 있는 단어들을 둘러봐요. 관련이 깊은 단어일수록 굵은 선으로, 더 많이 쳐다봐요." },
    { id: "s5", sec: 8, narration: "그리고 쳐다본 만큼 그 단어들의 의미를 섞어 와요. '바다'와 '떠'를 많이 섞었더니 타는 배 쪽으로 움직였어요." },
    { id: "s6", sec: 9, narration: "문장이 바뀌면 어떨까요? '과일 가게에서 사과와 배'. 이번엔 과일과 사과를 많이 보고, 과일 배 쪽으로 가요." },
    { id: "s7", sec: 7, narration: "이렇게 각 단어가 문장 속 다른 단어를 보고 자기 의미를 고치는 것. 이게 셀프 어텐션이에요." },
    { id: "s8", sec: 6, narration: "그런데 얼마나 관련 있는지는 어떻게 정할까요? 다음 장에서 Query, Key, Value로 알아봐요." },
  ],
  playgroundTitle: "문맥 만들기",
  playgroundIntro: "단어를 골라 '배' 앞에 놓아 보세요. '배'의 뜻이 어디로 움직이는지 보여요.",
  summary: [
    "같은 단어도 문맥에 따라 뜻이 다르다.",
    "각 단어는 앞 단어들을 보고, 관련 깊은 단어를 더 많이 쳐다본다.",
    "쳐다본 만큼 의미를 섞어 자기 의미를 고친다. 이게 셀프 어텐션.",
  ],
  unlocks: "셀프 어텐션",
  quiz: [
    {
      q: "셀프 어텐션에서 '배'가 하는 일은?",
      choices: ["앞 단어들을 보고, 관련 있는 단어의 의미를 섞어 자기 의미를 고친다", "사전에서 뜻을 찾아온다", "가장 가까운 단어 하나로 바뀐다"],
      answer: 0,
      explain: "한 단어만 고르는 게 아니라, 쳐다본 비율만큼 여러 단어의 의미를 섞어요.",
      review: "s5",
    },
    {
      q: "'배'가 다른 단어들을 쳐다보는 비율을 모두 더하면?",
      choices: ["100%", "단어 수 × 100%", "그때그때 다르다"],
      answer: 0,
      explain: "비율은 소프트맥스(14장)로 만들어서 합이 항상 1, 즉 100%예요.",
      review: "s4",
    },
    {
      q: "같은 '배'라도 앞 문장이 바뀌면?",
      choices: ["의미는 그대로다", "앞 단어에 따라 의미가 달라진다", "문장이 끝나야 의미가 생긴다"],
      answer: 1,
      explain: "임베딩은 같아도, 어텐션을 거치면 문맥에 맞는 의미로 바뀌어요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "45장 단어들이 서로를 쳐다본다",
    fruit: "과일 배",
    boat: "타는 배",
    body: "몸의 배",
    alone: "배 (혼자일 때)",
    vague: "뜻이 애매해서 한가운데",
    vec: "단어 하나 = 벡터 하나 (33장)",
    toBoat: "타는 배 쪽으로!",
    toFruit: "과일 배 쪽으로!",
    foot: "* 실제로는 수백 개의 숫자로 된 벡터를 섞어요",
    line: "셀프 어텐션: 다른 단어를 보고 내 의미를 고친다",
    meal: "밥을 많이 먹었더니 배",
    sum: "쳐다보는 비율을 다 더하면 100% (14장 소프트맥스!)",
    ask: "얼마나 관련 있는지는 어떻게 정할까?",
    q: "Query",
    k: "Key",
    v: "Value",
    qd: "질문",
    kd: "라벨",
    vd: "내용",
    seaLine: "바다 위에 떠 있는 배",
    fruitLine: "과일 가게에서 사과와 배",
    next: "다음 장: 46장 Query · Key · Value",
    self: "자기 자신",
  },
};
