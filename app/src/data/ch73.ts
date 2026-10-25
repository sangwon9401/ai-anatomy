import type { ChapterSpec } from "./types";

export type Demo = { q: string; a: string };

// Demonstrations people write (scene, s2). Contents are examples, not taken from a real dataset.
export const DEMOS: Demo[] = [
  { q: "영어로 번역해 줘: 고마워", a: "Thank you." },
  { q: "3 × 4는?", a: "12예요." },
  { q: "'가을'로 시 한 줄 써 줘", a: "낙엽이 편지처럼 내려앉는 오후" },
  { q: "광합성이 뭐야?", a: "식물이 햇빛으로 양분을 만드는 일이에요." },
];

// s3: one demonstration as a strip of pieces; the answer pieces are what the model practises predicting
export const STRIP_Q = ["질문:", "광합성이", "뭐야?", "답:"];
export const STRIP_A = ["식물이", "햇빛으로", "양분을", "만드는", "일이에요", "."];

// s4: a few of the model's numbers before and after fine-tuning (illustrative)
export const WEIGHTS_BEFORE = [0.42, -1.07, 0.88, 0.15, -0.33, 1.26, -0.71, 0.04, 0.59, -0.2, 0.97, -0.48, 0.31, -0.86, 0.12, 0.67, -0.05, 0.74, -1.12, 0.26];
export const WEIGHTS_AFTER = [0.43, -1.07, 0.86, 0.15, -0.31, 1.26, -0.72, 0.05, 0.59, -0.2, 0.98, -0.48, 0.3, -0.86, 0.12, 0.69, -0.05, 0.74, -1.1, 0.26];

/** Playground: three sets of model answers written in different voices, and what a fine-tuned model then says. */
export type Style = { key: string; name: string; demos: Demo[] };
export const STYLES: Style[] = [
  {
    key: "kind",
    name: "친절한 선생님",
    demos: [
      { q: "3 × 4는?", a: "12예요! 3을 네 번 더한 것과 같아요." },
      { q: "'고마워'를 영어로 하면?", a: "Thank you예요. 친구끼리는 Thanks도 많이 써요." },
      { q: "지구에서 가장 가까운 별은?", a: "태양이에요! 태양 다음으로 가까운 별은 프록시마 센타우리예요." },
    ],
  },
  {
    key: "short",
    name: "한 줄로 짧게",
    demos: [
      { q: "3 × 4는?", a: "12." },
      { q: "'고마워'를 영어로 하면?", a: "Thank you." },
      { q: "지구에서 가장 가까운 별은?", a: "태양." },
    ],
  },
  {
    key: "joseon",
    name: "조선 선비 말투",
    demos: [
      { q: "3 × 4는?", a: "열둘이오. 셋을 네 번 더하는 이치라오." },
      { q: "'고마워'를 영어로 하면?", a: "'Thank you'라 하오." },
      { q: "지구에서 가장 가까운 별은?", a: "해올시다. 그다음으로 가까운 별은 프록시마 센타우리라 하오." },
    ],
  },
];

export type TestQ = { q: string; base: string; replies: Record<string, string> };
export const TESTS: TestQ[] = [
  {
    q: "하늘은 왜 파랄까?",
    base: "바다는 왜 파랄까? 노을은 왜 붉을까? 구름은 왜 하얄까?",
    replies: {
      kind: "좋은 질문이에요! 햇빛이 공기를 지날 때 파란빛이 더 많이 흩어지기 때문이에요.",
      short: "파란빛이 더 많이 흩어져서.",
      joseon: "햇빛이 공기를 지날 적에 푸른빛이 더 많이 흩어지기 때문이오.",
    },
  },
  {
    q: "물은 몇 도에서 끓어?",
    base: "얼음은 몇 도에서 녹아? 물은 몇 도에서 얼어?",
    replies: {
      kind: "보통 100도에서 끓어요. 높은 산에서는 그보다 낮은 온도에서 끓어요.",
      short: "보통 100도.",
      joseon: "보통 백 도에서 끓는다오. 높은 산에서는 그보다 낮다 하오.",
    },
  },
];

export const ch73: ChapterSpec = {
  id: 73,
  part: 8,
  title: "모범답안 따라 하기",
  core: true,
  hook: "말을 안 듣는 모델에게 '대답하는 법'은 어떻게 가르칠까요?",
  steps: [
    { id: "s1", sec: 7, narration: "해결책은 의외로 단순해요. 사람이 직접 질문과 모범 답안을 써서 모델에게 보여 주는 거예요." },
    { id: "s2", sec: 8, narration: "번역, 계산, 시 쓰기, 설명까지 여러 질문마다 친절하고 정확한 답을 써요. 이런 예시를 아주 많이 모아요." },
    { id: "s3", sec: 9, narration: "학습 방법은 Part 7과 똑같은 다음 조각 맞히기예요. 다만 교과서가 인터넷 글에서 모범 답안으로 바뀌었어요." },
    { id: "s4", sec: 9, narration: "이미 똑똑한 모델이라 숫자를 살짝만 다듬어요. 모범 답안으로 이렇게 다듬는 방법을 지도 미세조정(SFT)이라고 해요." },
    { id: "s5", sec: 7, narration: "결과는 놀라워요. 같은 질문에 이제는 질문을 이어 쓰지 않고, 제대로 대답해요." },
    { id: "s6", sec: 8, narration: "처음 보는 질문에도 대답해요. 답을 외운 게 아니라, '질문 다음엔 대답'이라는 모양과 말투를 배운 거예요." },
    { id: "s7", sec: 8, narration: "하지만 모범 답안을 쓰는 일은 힘들고 오래 걸려요. 그래서 사람들은 더 쉬운 방법을 찾았어요. 다음 장에서 봐요." },
  ],
  playgroundTitle: "말투 가르치기",
  playgroundIntro: "모범 답안 묶음을 하나 골라 미세조정해 보세요. 그다음 처음 보는 질문을 던져서, 모델이 무엇을 따라 했는지 확인해요.",
  summary: [
    "SFT: 사람이 쓴 질문과 모범 답안으로 모델을 살짝 더 학습시킨다.",
    "학습 방법은 사전학습과 같은 다음 조각 맞히기, 교과서만 바뀐다.",
    "모델은 답을 외우지 않고 대답하는 모양과 말투를 따라 한다.",
  ],
  unlocks: "SFT (지도 미세조정)",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "SFT에서 모델이 공부하는 교과서는?",
      choices: ["사람이 직접 쓴 질문과 모범 답안", "인터넷에서 모은 아무 글", "모델이 스스로 쓴 글"],
      answer: 0,
      explain: "사람이 질문마다 모범 답안을 써서 보여 줘요. 학습 방법은 다음 조각 맞히기 그대로예요.",
      review: "s3",
    },
    {
      q: "SFT를 마친 모델이 처음 보는 질문에도 대답할 수 있는 이유는?",
      choices: ["세상의 모든 질문과 답을 외워서", "질문을 받으면 인터넷을 검색해서", "'질문 다음엔 대답'이라는 모양을 배워서"],
      answer: 2,
      explain: "답 하나하나를 외운 게 아니라, 대답하는 모양과 말투를 배운 거예요.",
      review: "s6",
    },
    {
      q: "모범 답안을 전부 '조선 선비 말투'로 썼다면, 미세조정한 모델은?",
      choices: ["말투는 그대로 두고 내용만 배운다", "처음 보는 질문에도 선비 말투로 대답한다", "모범 답안을 무시한다"],
      answer: 1,
      explain: "모델은 내용뿐 아니라 말투와 길이까지 따라 해요. 그래서 누가 어떻게 모범 답안을 쓰느냐가 중요해요.",
      review: "playground",
    },
  ],
  labels: {
    tag: "73장 모범답안 따라 하기",
    byHand: "사람이 직접 써요",
    qHead: "질문",
    aHead: "모범 답안",
    q1: "광합성이 뭐야?",
    a1: "식물이 햇빛을 받아 물과 이산화탄소로 양분을 만드는 일이에요. 이때 산소도 나와요.",
    many: "× 아주 많이",
    eachQ: "질문마다 모범 답안 한 개씩",
    sample: "* 내용은 예시예요",
    guess: "다음 조각 맞히기",
    same: "학습 방법은 Part 7 그대로",
    book: "교과서",
    oldBook: "인터넷 글",
    newBook: "모범 답안",
    arrow: "→",
    numbers: "모델 속 숫자 (설명용 예시)",
    tweak: "살짝만 다듬기",
    sft: "SFT",
    sftKo: "지도 미세조정",
    sftEn: "Supervised Fine-Tuning",
    ask: "대한민국의 수도는 어디인가요?",
    before: "SFT 전 (72장)",
    after: "SFT 후",
    beforeOut: "일본의 수도는 어디인가요? 중국의 수도는 어디인가요?",
    afterOut: "대한민국의 수도는 서울이에요.",
    newQ: "고양이 이름 좀 지어 줘",
    newA: "'나비', '호두', '치즈' 어때요? 털 색깔이나 성격을 보고 고르면 더 잘 어울려요.",
    neverSeen: "처음 보는 질문인데도!",
    shape: "외운 게 아니라 '질문 → 대답' 모양을 배웠어요",
    hard: "쓰는 건 힘들고 오래 걸려요",
    write: "모범 답안 쓰기",
    pick: "더 쉬운 방법은?",
    next: "74장",
  },
};
