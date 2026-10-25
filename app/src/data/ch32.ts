import type { ChapterSpec, Highlighter } from "./types";

// a tiny vocabulary for the scene (5 words) and the playground (8 words)
export const VOCAB5: { w: string; c: Highlighter }[] = [
  { w: "강아지", c: "yellow" },
  { w: "고양이", c: "mint" },
  { w: "버스", c: "sky" },
  { w: "사과", c: "pink" },
  { w: "학교", c: "violet" },
];
export const VOCAB8 = [...VOCAB5.map((v) => v.w), "간다", "피자", "나는"];

export const oneHot = (i: number, n: number) => Array.from({ length: n }, (_, k) => (k === i ? 1 : 0));
export const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0));

// real GPT-4o token ids (o200k_base) from ch29: '나는' 102052, '에' 3107 → ratio ≈ 32.8
export const ID_NANEUN = 102052;
export const ID_E = 3107;
export const VOCAB_SIZES = [
  { name: "예시 어휘", n: 8 },
  { name: "GPT-3", n: 50257 },
  { name: "GPT-4o", n: 200019 },
];

export const ch32: ChapterSpec = {
  id: 32,
  part: 3,
  title: "번호표의 한계",
  core: false,
  hook: "토큰마다 번호가 있는데, 그 번호를 그냥 모델에 넣으면 안 될까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "토큰마다 번호가 있죠(29장). '나는'은 102052번, '에'는 3107번. 이 번호를 그대로 넣으면 어떨까요?" },
    { id: "s2", sec: 9, narration: "모델은 숫자를 곱하고 더해요(12장). 그러면 '나는'이 '에'보다 33배쯤 큰 값처럼 다뤄져요. 번호 크기엔 뜻이 없는데요." },
    { id: "s3", sec: 8.5, narration: "그래서 번호 대신 자리로 표시해요. 단어 수만큼 칸을 만들고, 내 자리에만 1을 넣어요. 이게 원-핫 인코딩이에요." },
    { id: "s4", sec: 9, narration: "이제 크기 차이는 없어요. 그런데 문제가 둘 있어요. 첫째, 너무 길어요. GPT-4o라면 약 20만 칸 중에 1이 딱 하나예요." },
    { id: "s5", sec: 7.5, narration: "둘째, 모든 단어가 똑같이 남남이에요. 어떤 두 단어든 거리는 √2(8장), 내적은 0(9장)이에요.", tts: "둘째, 모든 단어가 똑같이 남남이에요. 어떤 두 단어든 거리는 루트 2, 내적은 0이에요." },
    { id: "s6", sec: 7, narration: "강아지와 고양이가 닮았다는 걸 원-핫으로는 나타낼 수 없어요. 강아지와 버스만큼이나 멀거든요." },
    { id: "s7", sec: 7.5, narration: "필요한 건 짧고, 뜻이 비슷하면 가까운 숫자 줄이에요. 그게 다음 장에서 만날 임베딩이에요." },
  ],
  playgroundTitle: "원-핫 실험실",
  playgroundIntro: "단어 두 개를 골라 보세요. 원-핫 벡터와 둘 사이의 거리, 내적이 나와요. 거리가 √2가 아닌 짝을 찾을 수 있을까요?",
  summary: [
    "토큰 번호의 크기에는 뜻이 없어서 그대로 계산에 쓰면 안 된다.",
    "원-핫: 단어 수만큼의 칸 중 내 자리에만 1. 크기 차이는 사라진다.",
    "하지만 너무 길고(약 20만 칸), 모든 단어가 똑같이 멀다(거리 √2, 내적 0).",
  ],
  unlocks: "원-핫 벡터",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "어휘가 5개일 때 세 번째 단어의 원-핫 벡터는?",
      choices: ["[3]", "[1, 1, 1, 0, 0]", "[0, 0, 1, 0, 0]"],
      answer: 2,
      explain: "5칸 중 세 번째 자리에만 1, 나머지는 0이에요.",
      review: "s3",
    },
    {
      q: "원-핫 벡터에서 '강아지'와 '고양이'의 내적은?",
      choices: ["1", "0", "√2"],
      answer: 1,
      explain: "1이 서로 다른 자리에 있어서 곱하면 전부 0이에요. '강아지'와 '버스'도 똑같이 0이에요.",
      review: "s5",
    },
    {
      q: "원-핫의 문제가 아닌 것은?",
      choices: ["벡터가 너무 길다", "비슷한 단어도 가깝지 않다", "단어마다 벡터가 겹쳐서 헷갈린다"],
      answer: 2,
      explain: "원-핫은 단어마다 1의 자리가 달라서 절대 안 겹쳐요. 문제는 길이와 '모두 똑같이 멀다'는 점이에요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "32장 번호표의 한계",
    naneun: "나는",
    e: "에",
    into: "그대로 넣으면?",
    model: "모델",
    r2: "√2",
    times: "× 2 →",
    ratio: "102052 ÷ 3107 ≈ 33배",
    bigger: "'나는'이 33배 큰 값?!",
    noMeaning: "번호 크기엔 뜻이 없어요 (6장)",
    seat: "번호 대신 자리로",
    oneHot: "원-핫 인코딩 (one-hot)",
    onlyOne: "내 자리에만 1",
    prob1: "문제 ① 너무 길어요",
    cells: "약 20만 칸",
    justOne: "1은 딱 하나",
    prob2: "문제 ② 모두 똑같이 남남",
    distLbl: "거리",
    dotLbl: "내적",
    sqrt2: "√2 ≈ 1.41",
    same: "닮은 둘도, 안 닮은 둘도 똑같이 √2",
    need: "필요한 것: 짧고, 뜻이 담긴 숫자 줄",
    emb: "임베딩 (33장)",
    sample: "[0.8, 0.7, −0.2]",
    zeros: "0 0 0 0 0 0 0 0 0 0 0 0 … 1 … 0 0 0 0 0 0 0 0 0",
  },
};
