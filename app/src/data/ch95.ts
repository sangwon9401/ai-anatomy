import type { ChapterSpec } from "./types";

// Real outputs of the offline checkpoints (part11-checkpoints.ts), loaded and sampled with minigpt.ts.

/** "가는 " + what the 속담 model wrote at temperature 0.3 (five samples, all the same) */
export const PROMPT = "가는";
export const LOW_LINE = ["말", "이", " ", "천", " ", "리", " ", "간", "다"];

/** next-token probabilities (%) after "가는 " at three temperatures */
export const NEXT_AT: Record<string, { w: string; p: number }[]> = {
  "1": [
    { w: "말", p: 51.6 },
    { w: "정", p: 20.3 },
    { w: "토", p: 9.1 },
    { w: "놈", p: 4.2 },
  ],
  "0.3": [
    { w: "말", p: 95.4 },
    { w: "정", p: 4.3 },
    { w: "토", p: 0.3 },
    { w: "놈", p: 0.0 },
  ],
  "1.6": [
    { w: "말", p: 27.3 },
    { w: "정", p: 15.3 },
    { w: "토", p: 9.2 },
    { w: "놈", p: 5.7 },
  ],
};

/** where each candidate comes from in the data */
export const SOURCES = ["가는 말이 고와야 …", "… 가는 정이 있다", "가는 토끼 잡으려다 …"];

/** the two proverbs the low-temperature line was stitched from */
export const STITCH = [
  { line: "가는 말이 고와야 오는 말이 곱다", keep: "가는 말이" },
  { line: "발 없는 말이 천 리 간다", keep: "천 리 간다" },
];

/** three of five lines at temperature 1.6 */
export const HIGH_LINES = ["가는 정이 있어가슴 솥뚜껑 보고 놀란다", "가는 값이면 다홍치마", "가는 말이 제물어 가라"];

/** the 교과서 문장 model, prompt "사각형은 " */
export const WRONG = { before: "사각형은 변이 ", bad: "세", after: " 개인 도형이다.", fix: "네" };

export const ch95: ChapterSpec = {
  id: 95,
  part: 11,
  title: "생성해 보기",
  core: false,
  hook: "내가 훈련시킨 모델은 어떤 글을 쓸까요?",
  steps: [
    { id: "s1", sec: 10.5, narration: "이제 모델로 글을 써 볼 차례예요. 방법은 2장과 같아요. 다음 토큰을 하나 뽑아 붙이고, 줄바꿈이 나올 때까지 다시." },
    { id: "s2", sec: 11, narration: "'가는' 다음 토큰의 확률은 말 52%, 정 20%, 토 9%예요. 데이터 속 가는 말, 가는 정, 가는 토끼를 배운 거죠." },
    { id: "s3", sec: 10.5, narration: "온도를 낮추면(81장) 1등이 더 커져요. 온도 0.3에서는 '말'이 95%라서, 다섯 번 써도 같은 문장이 나와요." },
    { id: "s4", sec: 10, narration: "그런데 '가는 말이 천 리 간다'는 데이터에 없는 말이에요. 두 속담을 이어 붙여 그럴듯하게 지어낸 거예요." },
    { id: "s5", sec: 9, narration: "온도를 높이면 낮은 막대도 자주 뽑혀요. 온도 1.6에서는 문장이 매번 다르고, 엉터리도 섞여요." },
    { id: "s6", sec: 11, narration: "교과서 문장 모델은 '사각형은 변이 세 개인 도형이다.'라고 쓰기도 했어요. 그럴듯하지만 틀린 말, 환각이에요(84장)." },
    { id: "s7", sec: 10, narration: "작지만 ChatGPT가 글을 쓰는 방식 그대로예요. 직접 해보기에서 시작 글자와 온도를 바꾸며 써 보세요." },
  ],
  playgroundTitle: "내 모델로 글쓰기",
  playgroundIntro: "시작 글자를 넣고 온도를 정한 뒤 '한 줄 쓰기'를 눌러 보세요. 94장에서 훈련한 모델이 있으면 그 모델이, 없으면 미리 훈련해 둔 모델이 써요.",
  summary: [
    "생성 = 확률 내기 → 하나 뽑기 → 붙이기. 줄바꿈이 나오면 멈춘다.",
    "온도를 낮추면 한결같고 외운 말, 높이면 다양하지만 엉터리도.",
    "그럴듯한 조합이 사실과 다르면 환각. 작은 모델도 마찬가지.",
  ],
  unlocks: "내 모델이 쓴 문장",
  unlockLabel: "졸업 프로젝트 한 단계를 마쳤어요",
  quiz: [
    {
      q: "온도를 낮추면 어떻게 될까요?",
      choices: ["모든 후보의 확률이 똑같아진다", "1등 후보가 더 자주 뽑혀서 답이 한결같아진다", "모델이 더 많이 배운다"],
      answer: 1,
      explain: "온도가 낮으면 분포가 뾰족해져요. 온도 0.3에서 '말'은 52%에서 95%가 됐어요(81장).",
      review: "s3",
    },
    {
      q: "'가는 말이 천 리 간다'가 나온 이유는?",
      choices: ["데이터에 그대로 있어서", "사람이 나중에 넣어서", "두 속담의 조각을 이어 붙여서"],
      answer: 2,
      explain: "'가는 말이'와 '천 리 간다'는 서로 다른 속담에서 왔어요. 모델은 그럴듯한 다음 조각을 이었을 뿐이에요.",
      review: "s4",
    },
    {
      q: "'사각형은 변이 세 개인 도형이다.' 같은 문장을 뭐라고 할까요?",
      choices: ["환각", "프롬프트", "토큰"],
      answer: 0,
      explain: "말투는 교과서 같지만 사실이 틀렸어요. 그럴듯함과 사실은 다른 문제예요(84장).",
      review: "s6",
    },
  ],
  labels: {
    tag: "95장 생성해 보기",
    model: "미니 GPT",
    pick: "하나 뽑아 붙이기",
    runs: "모델을 돌린 횟수",
    stop: "줄바꿈이 나오면 끝",
    t1: "온도 1",
    t03: "온도 0.3",
    t16: "온도 1.6",
    learned: "데이터에서 배운 것",
    same: "다섯 번 모두 같은 문장",
    notInData: "데이터에 없는 문장!",
    stitched: "두 속담을 이어 붙였어요",
    plus: "+",
    varied: "매번 다르고, 엉터리도",
    textbook: "교과서 문장 모델",
    wrong: "사각형의 변은 네 개!",
    halluc: "환각 (84장)",
    sounds: "말투는 그럴듯해요",
    try: "시작 글자 + 온도",
    same2: "ChatGPT와 같은 방식",
    real: "미리 훈련한 모델의 실제 출력",
  },
};
