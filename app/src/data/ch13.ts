import type { ChapterSpec, Highlighter } from "./types";

export type Dist = { key: string; name: string; items: { w: string; p: number; c: Highlighter }[] };

export const DISTS: Dist[] = [
  {
    key: "dice",
    name: "주사위",
    items: [1, 2, 3, 4, 5, 6].map((n) => ({ w: String(n), p: 1 / 6, c: "sky" as const })),
  },
  {
    key: "breakfast",
    name: "아침 메뉴",
    items: [
      { w: "밥", p: 0.55, c: "yellow" },
      { w: "빵", p: 0.25, c: "mint" },
      { w: "시리얼", p: 0.15, c: "sky" },
      { w: "피자", p: 0.05, c: "pink" },
    ],
  },
  {
    key: "flat",
    name: "평평한 분포",
    items: [
      { w: "가", p: 0.28, c: "yellow" },
      { w: "나", p: 0.26, c: "mint" },
      { w: "다", p: 0.24, c: "sky" },
      { w: "라", p: 0.22, c: "pink" },
    ],
  },
];

// fixed "random" draws for the s5 animation (mostly 밥, sometimes others)
export const DRAWS = ["밥", "밥", "빵", "밥", "시리얼", "밥", "밥", "빵", "밥", "피자", "밥", "빵"];

export const ch13: ChapterSpec = {
  id: 13,
  part: 1,
  title: "확률 분포",
  core: false,
  hook: "'아마 비가 올 거야'를 숫자로 말하면 어떻게 될까요?",
  steps: [
    { id: "s1", sec: 6, narration: "주사위를 던지면 1부터 6까지 각각 6분의 1의 확률로 나와요. 중학교 때 배운 확률이죠." },
    { id: "s2", sec: 8, narration: "결과마다 확률을 막대로 세우면 확률 분포가 돼요. 막대 높이를 모두 더하면 언제나 1, 즉 100%예요." },
    { id: "s3", sec: 8, narration: "모든 분포가 고르지는 않아요. 아침 메뉴라면 밥이 높고 피자는 낮겠죠. 이런 걸 뾰족한 분포라고 해요." },
    { id: "s4", sec: 8, narration: "GPT는 매 순간 이런 분포를 내놓아요. 후보는 약 5만 개 조각, 막대도 5만 개. 그래도 합은 딱 1이에요." },
    { id: "s5", sec: 9, narration: "분포에서 하나를 뽑을 때, 높은 막대일수록 잘 뽑혀요. 하지만 낮은 막대도 가끔은 뽑혀요." },
    { id: "s6", sec: 8, narration: "분포가 뾰족하면 대답이 한결같고, 평평하면 다양해져요. 81장에서는 온도로 이걸 조절해요." },
    { id: "s7", sec: 6, narration: "확률 분포는 모든 후보의 가능성, 그리고 합은 1. 다음 14장에선 점수를 이런 분포로 바꾸는 법을 배워요." },
  ],
  playgroundTitle: "뽑기 실험실",
  playgroundIntro: "분포를 고르고 여러 번 뽑아 보세요. 많이 뽑을수록 뽑힌 비율이 확률에 가까워져요.",
  summary: [
    "확률 분포: 후보마다 가능성을 매긴 것. 막대를 모두 더하면 1.",
    "높은 막대일수록 잘 뽑히지만, 낮은 막대도 가끔 뽑힌다.",
    "GPT는 매번 약 5만 개 후보의 분포를 내고, 거기서 하나를 뽑는다.",
  ],
  unlocks: "확률 분포",
  unlockLabel: "수학 도구를 하나 얻었어요",
  quiz: [
    {
      q: "주사위에서 3이 나올 확률은?",
      choices: ["1/6", "1/3", "3/6"],
      answer: 0,
      explain: "여섯 면이 똑같이 나올 수 있으니 각각 1/6이에요.",
      review: "s1",
    },
    {
      q: "확률 분포의 막대 높이를 모두 더하면?",
      choices: ["1 (100%)", "후보의 개수", "그때그때 다르다"],
      answer: 0,
      explain: "어느 하나는 반드시 일어나니까, 모든 가능성을 더하면 1이에요.",
      review: "s2",
    },
    {
      q: "확률이 10%인 후보는?",
      choices: ["절대 뽑히지 않는다", "가끔 뽑힌다", "항상 뽑힌다"],
      answer: 1,
      explain: "10번에 1번쯤 뽑혀요. 낮아도 0이 아니면 뽑힐 수 있어요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "13장 확률 분포",
    dice: "주사위",
    sixth: "각각 1/6",
    dist: "확률 분포",
    total: "합 = 1 (100%)",
    breakfast: "아침 메뉴",
    peaked: "뾰족한 분포",
    gpt: "GPT의 다음 조각 분포",
    many: "후보 약 5만 개, 합은 1",
    draw: "뽑기",
    count: "뽑힌 횟수",
    sometimes: "낮은 막대도 가끔!",
    sharp: "뾰족 → 한결같은 대답",
    flat: "평평 → 다양한 대답",
    temp: "81장: 온도로 조절",
    sum: "확률 분포 = 모든 후보의 가능성, 합은 1",
    next: "다음: 14장 소프트맥스",
    go: "간다",
    went: "갔다",
    late: "늦었다",
  },
};
