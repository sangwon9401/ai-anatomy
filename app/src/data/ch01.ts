import type { ChapterSpec, Highlighter } from "./types";

export type Candidate = { w: string; p: number; c: Highlighter | null };

// Illustrative probabilities (labelled as such in the scene), not measured from a real model.
export const ROUND1: Candidate[] = [
  { w: "간다", p: 0.52, c: "yellow" },
  { w: "갔다", p: 0.21, c: "mint" },
  { w: "늦었다", p: 0.12, c: "sky" },
  { w: "가기", p: 0.09, c: "violet" },
  { w: "피자", p: 0.01, c: "pink" },
  { w: "기타", p: 0.05, c: null },
];

export const ROUND2: Candidate[] = [
  { w: ".", p: 0.58, c: "yellow" },
  { w: "그리고", p: 0.14, c: "mint" },
  { w: ",", p: 0.11, c: "sky" },
  { w: "!", p: 0.07, c: "violet" },
  { w: "기타", p: 0.1, c: null },
];

export const EXAMPLES = [
  { q: "대한민국의 수도는", a: "서울", tag: "지식" },
  { q: "1, 3, 5, 7,", a: "9", tag: "규칙" },
  { q: "비가 와서 우산을", a: "썼다", tag: "상식" },
];

export type GameRound = { sentence: string; options: { w: string; p: number }[] };

export const GAME_ROUNDS: GameRound[] = [
  {
    sentence: "대한민국의 수도는",
    options: [
      { w: "부산", p: 0.02 },
      { w: "서울", p: 0.92 },
      { w: "어디", p: 0.03 },
      { w: "세종", p: 0.02 },
    ],
  },
  {
    sentence: "1, 3, 5, 7,",
    options: [
      { w: "8", p: 0.04 },
      { w: "9", p: 0.88 },
      { w: "10", p: 0.02 },
      { w: "11", p: 0.03 },
    ],
  },
  {
    sentence: "비가 와서 우산을",
    options: [
      { w: "먹었다", p: 0.001 },
      { w: "샀다", p: 0.07 },
      { w: "썼다", p: 0.71 },
      { w: "챙겼다", p: 0.18 },
    ],
  },
];

export const ch01: ChapterSpec = {
  id: 1,
  part: 0,
  title: "다음 단어 맞히기 게임",
  core: true,
  hook: "ChatGPT는 질문을 듣고 대답 전체를 한 번에 떠올리는 걸까요?",
  steps: [
    { id: "s1", sec: 5, narration: "문장이 하나 있어요. '나는 오늘 학교에' 다음에는 어떤 말이 올까요?" },
    { id: "s2", sec: 6, narration: "후보는 많아요. 간다, 갔다, 늦었다… 이상하지만 '피자'가 올 수도 있죠." },
    { id: "s3", sec: 7, narration: "ChatGPT는 후보마다 다음에 올 가능성을 숫자로 계산해요. 이게 바로 확률이에요." },
    { id: "s4", sec: 6, narration: "가장 그럴듯한 '간다'를 골라서 빈칸에 붙여요." },
    { id: "s5", sec: 8, narration: "그리고 다시 처음부터! 늘어난 문장을 보고 또 다음 말을 예측해요. 이번엔 마침표가 뽑혔네요." },
    { id: "s6", sec: 7, narration: "ChatGPT가 하는 일은 이게 전부예요. 다음 말을 아주 잘 맞히고, 그걸 계속 반복하는 것." },
    { id: "s7", sec: 8, narration: "그런데 다음 말을 잘 맞히려면 지식도, 규칙도, 상식도 알아야 해요. 그 능력이 어디서 오는지가 앞으로 볼 이야기예요." },
  ],
  playgroundTitle: "맞혀 봐! 다음 말 게임",
  playgroundIntro: "빈칸에 올 말을 골라 보세요. 고르면 모델이 계산한 확률과 비교해 줘요.",
  summary: [
    "ChatGPT는 다음에 올 말의 확률을 계산한다.",
    "가장 그럴듯한 말을 골라 붙이고, 다시 예측한다.",
    "이 반복만으로 긴 대답이 만들어진다.",
  ],
  unlocks: "생성 루프",
  quiz: [
    {
      q: "ChatGPT가 글을 만들 때 계속 반복하는 일은?",
      choices: ["문장 전체를 한 번에 떠올린다", "다음에 올 말의 확률을 계산하고 하나를 고른다", "인터넷에서 비슷한 글을 찾아 복사한다"],
      answer: 1,
      explain: "한 번에 한 조각씩, 확률을 계산해서 골라요.",
      review: "s3",
    },
    {
      q: "골라낸 말은 그다음에 어떻게 되나요?",
      choices: ["버린다", "문장 뒤에 붙어서 다음 예측의 입력이 된다", "따로 모아 뒀다가 마지막에 한꺼번에 보여 준다"],
      answer: 1,
      explain: "붙이고 다시 예측해요. 이 반복으로 긴 글이 만들어져요.",
      review: "s5",
    },
    {
      q: "'1, 3, 5, 7, ___'을 잘 맞히려면 무엇이 필요할까요?",
      choices: ["숫자 사이의 규칙을 알아채는 능력", "가장 긴 숫자를 고르는 습관", "정답이 적힌 표"],
      answer: 0,
      explain: "다음 말을 잘 맞히려면 규칙, 지식, 상식이 다 필요해요. 그래서 예측을 연습하는 것만으로 똑똑해져요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "1장 다음 단어 맞히기 게임",
    example: "설명용 예시 확률",
    loop: "붙이고, 다시 예측!",
    stmtTop: "ChatGPT가 하는 일",
    stmtMain: "다음 말 맞히기",
    stmtLoop: "× 계속 반복",
    stmtNote: "진짜로 이게 전부예요",
    token: "* 정확히는 '토큰' 단위로 예측해요 (29장)",
    words: "나는 오늘 학교에 간다",
  },
};
