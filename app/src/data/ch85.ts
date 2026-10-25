import type { ChapterSpec } from "./types";

export type Ingredient = "역할" | "예시" | "단계별로" | "형식";
export const INGREDIENTS: Ingredient[] = ["역할", "예시", "단계별로", "형식"];

// Scene comparisons: the same request with and without one ingredient. Answers are illustrative (설명용 예시).
export type Compare = { ing: Ingredient; plain: string; plainAnswer: string; add: string; before?: boolean; goodAnswer: string; bad?: boolean };
export const COMPARES: Compare[] = [
  {
    ing: "역할",
    plain: "광합성이 뭐야?",
    plainAnswer: "광합성은 엽록체에서 빛에너지로 이산화 탄소와 물을 포도당으로 바꾸는 과정이에요.",
    add: "너는 초등학생에게 설명하는 과학 선생님이야.",
    before: true,
    goodAnswer: "식물이 햇빛으로 밥을 짓는 거예요! 물과 공기를 섞어 먹을 것을 만들어요.",
  },
  {
    ing: "예시",
    plain: "고등어 →",
    plainAnswer: "고등어는 등이 푸른 바다 생선으로, 구이나 조림으로 많이 먹어요.",
    add: "사과 → 과일 / 당근 → 채소 /",
    before: true,
    goodAnswer: "생선",
  },
  {
    ing: "단계별로",
    plain: "사과가 12개씩 든 상자 8개 중 6개가 상했어. 남은 사과를 6명이 똑같이 나누면 한 명에 몇 개?",
    plainAnswer: "16개예요.",
    add: "단계별로 풀어 줘.",
    goodAnswer: "12 × 8 = 96 → 96 − 6 = 90 → 90 ÷ 6 = 15. 한 명에 15개예요.",
    bad: true,
  },
  {
    ing: "형식",
    plain: "사과, 배, 오이, 당근을 과일과 채소로 나눠 줘.",
    plainAnswer: "사과와 배는 달콤한 과일이고요, 오이랑 당근은 채소로 분류해요. 참고로 오이는…",
    add: "'과일: / 채소:' 두 줄로만 써 줘.",
    goodAnswer: "과일: 사과, 배 / 채소: 오이, 당근",
  },
];

// s1: first-chunk probabilities for "광합성이 뭐야?" without / with the role line (illustrative)
export const S1_BARS = [
  { w: "광합성은", a: 0.62, b: 0.18, c: "yellow" as const },
  { w: "식물이", a: 0.21, b: 0.57, c: "mint" as const },
  { w: "빛을", a: 0.09, b: 0.12, c: "sky" as const },
];

// Part 9 toolbox for the wrap-up
export const TOOLS9 = ["그리디 · 샘플링", "온도", "Top-k · Top-p", "컨텍스트 창", "KV 캐시", "환각 알아채기", "프롬프트 원리"];

// playground: four prescriptions
export type Case = { goal: string; prompt: string; bad: string; right: Ingredient; add: string; good: string; why: string };
export const CASES: Case[] = [
  {
    goal: "초등학생 동생도 알아듣게",
    prompt: "광합성이 뭐야?",
    bad: "광합성은 엽록체에서 빛에너지로 이산화 탄소와 물을 포도당으로 바꾸는 과정이에요.",
    right: "역할",
    add: "너는 초등학생에게 설명하는 과학 선생님이야.",
    good: "식물이 햇빛으로 밥을 짓는 거예요! 뿌리로 마신 물과 공기를 섞어서 먹을 것을 만들어요.",
    why: "역할을 앞에 쓰면, 그런 선생님이 쓴 글처럼 이어 쓰는 게 가장 그럴듯해져요. 다음 조각 확률이 쉬운 말 쪽으로 기울어요(1장).",
  },
  {
    goal: "계산 실수 없이",
    prompt: "사과가 12개씩 든 상자 8개 중 6개가 상했어. 남은 사과를 6명이 똑같이 나누면 한 명에 몇 개?",
    bad: "16개예요.",
    right: "단계별로",
    add: "단계별로 풀어 줘.",
    good: "① 12 × 8 = 96개  ② 96 − 6 = 90개  ③ 90 ÷ 6 = 15개. 한 명에 15개예요.",
    why: "써 놓은 중간 계산이 다시 입력이 돼요(2장). 답을 한 번에 맞히는 것보다 한 단계씩 맞히는 게 훨씬 쉬워요. 87장에서 더 알아봐요.",
  },
  {
    goal: "정해진 모양으로",
    prompt: "사과, 배, 오이, 당근을 과일과 채소로 나눠 줘.",
    bad: "사과와 배는 달콤한 과일이고요, 오이랑 당근은 채소로 분류해요. 참고로 오이는…",
    right: "형식",
    add: "'과일: ○○ / 채소: ○○' 두 줄로만 써 줘.",
    good: "과일: 사과, 배\n채소: 오이, 당근",
    why: "틀을 정해 주면 그 틀에 맞는 조각이 가장 그럴듯해져요. '과일:' 다음엔 과일 이름이 올 차례니까요.",
  },
  {
    goal: "내가 원하는 규칙대로",
    prompt: "밝다",
    bad: "'밝다'는 빛이 많아 환하다는 뜻이에요. 예: 방이 밝다.",
    right: "예시",
    add: "크다 → 작다\n빠르다 → 느리다\n밝다 →",
    good: "어둡다",
    why: "예시를 보여 주면 모델이 패턴을 찾아 이어 써요. 71장의 인컨텍스트 러닝이에요. 규칙을 말로 설명하지 않아도 돼요.",
  },
];
export const WHAT_IT_DOES: Record<Ingredient, string> = {
  역할: "역할은 말투와 수준을 바꿔요.",
  예시: "예시는 따라 할 패턴을 보여 줘요.",
  단계별로: "단계별로는 중간 과정을 차근차근 쓰게 해요.",
  형식: "형식은 답의 모양(줄 수, 틀)을 정해요.",
};

export const ch85: ChapterSpec = {
  id: 85,
  part: 9,
  title: "구조를 알면 보이는 프롬프트",
  core: false,
  hook: "같은 걸 물어도, 묻는 방법에 따라 답이 달라지는 건 왜일까요?",
  steps: [
    { id: "s1", sec: 9, narration: "프롬프트는 모델이 이어 쓸 글의 앞부분이에요(1장). 앞부분이 바뀌면 다음 조각의 확률도 바뀌죠. 그래서 묻는 방법이 중요해요." },
    { id: "s2", sec: 8, narration: "첫째, 역할. '초등학생에게 설명하는 선생님'이라고 앞에 쓰면, 그런 선생님이 쓸 법한 쉬운 말이 그럴듯해져요." },
    { id: "s3", sec: 8, narration: "둘째, 예시. '사과 → 과일, 당근 → 채소'를 보여 주면 모델은 패턴을 이어 써요. 71장의 인컨텍스트 러닝이에요." },
    { id: "s4", sec: 8, narration: "셋째, 단계별로. 중간 계산을 글로 쓰게 하면, 써 놓은 계산이 다시 입력이 돼서(2장) 답을 맞히기 쉬워져요." },
    { id: "s5", sec: 8, narration: "넷째, 형식. '과일: / 채소:' 같은 틀을 주면, 그 틀에 맞는 말이 가장 그럴듯해져서 답의 모양이 정해져요." },
    { id: "s6", sec: 8, narration: "넷 다 마법 주문이 아니에요. 앞부분을 바꿔서 다음 조각 확률을 바꾸는 것뿐이에요. 필요한 정보도 직접 넣어 주세요." },
    { id: "s7", sec: 9, narration: "Part 9 끝! 고르기, 온도, 자르기, 기억 창, 환각, 프롬프트까지 챙겼어요. 다음엔 ChatGPT 이후의 AI를 만나요." },
  ],
  playgroundTitle: "프롬프트 처방전",
  playgroundIntro: "AI의 답이 아쉬운 네 가지 상황이에요. 알맞은 재료(역할, 예시, 단계별로, 형식)를 하나 골라 프롬프트를 고쳐 보세요.",
  summary: [
    "프롬프트 = 모델이 이어 쓸 글의 앞부분. 앞부분이 바뀌면 다음 조각 확률이 바뀐다.",
    "역할은 말투와 수준을, 예시는 패턴을, 형식은 답의 모양을 정한다.",
    "단계별로 쓰게 하면, 써 놓은 계산이 다시 입력이 되어 답을 맞히기 쉬워진다.",
  ],
  unlocks: "프롬프트 원리",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "'너는 초등학생에게 설명하는 선생님이야'를 붙이면 답이 쉬워지는 까닭은?",
      choices: ["그런 글 다음에 이어질 법한 쉬운 말의 확률이 높아져서", "모델이 그 순간 초등학교 교과서를 새로 공부해서", "모델이 일부러 지식을 숨겨서"],
      answer: 0,
      explain: "모델은 새로 배우지 않아요. 앞부분이 바뀌어서 다음 조각의 확률이 바뀐 거예요.",
      review: "s2",
    },
    {
      q: "'크다 → 작다, 빠르다 → 느리다, 밝다 →' 다음에 '어둡다'가 나오는 건 무엇 덕분일까요?",
      choices: ["온도를 높인 덕분", "컨텍스트 창이 꽉 찬 덕분", "예시로 패턴을 보여 준 인컨텍스트 러닝"],
      answer: 2,
      explain: "예시만 보여 줘도 모델이 패턴을 이어 써요(71장).",
      review: "s3",
    },
    {
      q: "'단계별로 풀어 줘'가 계산 문제에 도움이 되는 까닭은?",
      choices: ["모델이 몰래 계산기를 써서", "써 놓은 중간 계산이 다시 입력이 되어, 다음 조각을 맞히기 쉬워져서", "답이 짧아져서"],
      answer: 1,
      explain: "자기회귀(2장) 덕분에, 먼저 쓴 계산을 보면서 다음 계산을 이어 갈 수 있어요.",
      review: "s4",
    },
  ],
  labels: {
    tag: "85장 구조를 알면 보이는 프롬프트",
    prompt: "프롬프트",
    model: "모델",
    is: "프롬프트 = 모델이 이어 쓸 글의 앞부분",
    next: "다음 조각 확률",
    example: "설명용 예시",
    first: "첫째",
    second: "둘째",
    third: "셋째",
    fourth: "넷째",
    plain: "그냥 물으면",
    withIt: "재료를 넣으면",
    roleNote: "그런 사람이 쓸 법한 말이 그럴듯해져요",
    exampleNote: "패턴을 보고 이어 써요 (71장)",
    stepNote: "써 놓은 계산이 다시 입력이 돼요 (2장)",
    formatNote: "틀에 맞는 말이 그럴듯해져요",
    markO: "○",
    markX: "×",
    change: "앞부분이 바뀐다",
    then: "다음 조각 확률이 바뀐다 (1장)",
    notMagic: "마법 주문 아님! 좋은 앞부분 주기",
    info: "필요한 정보는 직접 넣어 주기 (83·84장)",
    done: "Part 9 추론 도구상자 완성!",
    nextPart: "다음: Part 10 ChatGPT 이후의 세계",
    nextCh: "86장 눈을 가진 AI",
    ai: "AI",
    w1: "광합성은",
    w2: "식물이",
    w3: "빛을",
    roleAdd: "너는 초등학생에게 설명하는 과학 선생님이야.",
  },
};
