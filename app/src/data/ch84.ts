import type { ChapterSpec, Highlighter } from "./types";

// An invented book (설명을 위해 지어낸 제목). The model's answer about it is built one chunk at a time from
// illustrative next-chunk probabilities; every chunk is plausible, the whole is false.
export const BOOK = "『토끼 행성의 마지막 도서관』";
export const QUESTION84 = `${BOOK}은 어떤 책이야?`;

export type Opt = { w: string; p: number; c: Highlighter | null; next?: string };
export const HONEST = "그런 책은";
export const END84 = "〈끝〉";

/** chunk → options for the next chunk (illustrative, each list adds up to 1) */
export const TREE: Record<string, Opt[]> = {
  start: [
    { w: "2018년에", p: 0.4, c: "yellow", next: "year" },
    { w: "2015년에", p: 0.32, c: "orange", next: "year" },
    { w: "2020년에", p: 0.24, c: "violet", next: "year" },
    { w: HONEST, p: 0.04, c: "mint", next: "honest" },
  ],
  year: [
    { w: "나온", p: 0.66, c: "yellow", next: "came" },
    { w: "출간된", p: 0.34, c: "orange", next: "came" },
  ],
  came: [
    { w: "동화로,", p: 0.54, c: "yellow", next: "kind" },
    { w: "소설로,", p: 0.32, c: "orange", next: "kind" },
    { w: "그림책으로,", p: 0.14, c: "violet", next: "kind" },
  ],
  kind: [
    { w: "어린이 문학상을", p: 0.46, c: "yellow", next: "got" },
    { w: "많은 사랑을", p: 0.4, c: "orange", next: "got" },
    { w: "큰 인기를", p: 0.14, c: "violet", next: "drew" },
  ],
  got: [{ w: "받았어요.", p: 1, c: "yellow", next: "end" }],
  drew: [{ w: "끌었어요.", p: 1, c: "yellow", next: "end" }],
  honest: [
    { w: "찾을 수 없어요.", p: 0.8, c: "mint", next: "end" },
    { w: "처음 들어 봐요.", p: 0.2, c: "mint", next: "end" },
  ],
};

// the path the scene follows (always the top option)
export const SCENE_ROUNDS = ["start", "year", "came", "kind"] as const;
export const ANSWER84 = ["2018년에", "나온", "동화로,", "어린이 문학상을", "받았어요."];

export const RISKY = [
  { w: "드문 사실", ex: "작은 마을의 역사", c: "yellow" as const },
  { w: "숫자 · 날짜", ex: "연도, 통계, 점수", c: "sky" as const },
  { w: "사람 이름", ex: "누가 했나, 누가 말했나", c: "mint" as const },
  { w: "출처 · 인용", ex: "책 제목, 논문, 링크", c: "pink" as const },
];

export const HELPS = [
  { n: "①", w: "출처를 직접 확인하기", ex: "검색, 도서관, 선생님께 묻기" },
  { n: "②", w: "AI가 댄 출처도 진짜인지 확인", ex: "출처까지 지어낼 수 있어요" },
  { n: "③", w: "믿을 만한 자료를 함께 넣어 주기", ex: "찾아보고 답하기 (88장)" },
];

export const ch84: ChapterSpec = {
  id: 84,
  part: 9,
  title: "그럴듯한 거짓말",
  core: true,
  hook: "AI가 자신 있게 말하면 다 사실일까요?",
  steps: [
    { id: "s1", sec: 10, narration: "없는 책을 물었는데, 출간 연도와 수상 경력까지 술술 대답했어요. 이런 그럴듯한 거짓말을 환각(hallucination)이라고 해요." },
    { id: "s2", sec: 9, narration: "한 조각씩 다시 볼게요. 책 소개는 보통 출간 연도로 시작하니까 '2018년에'가 그럴듯해요. '그런 책은'은 4%뿐이에요." },
    { id: "s3", sec: 10, narration: "다음 조각도 마찬가지예요. 나온, 동화로, 어린이 문학상을. 매번 그럴듯한 말을 골랐을 뿐인데, 이어 붙이니 가짜 사실이 됐어요." },
    { id: "s4", sec: 8, narration: "모델이 배운 건 '다음에 올 법한 말'이에요(1장). 그 말이 사실인지 따로 확인하는 장치는 없어요." },
    { id: "s5", sec: 9, narration: "게다가 한번 쓴 말은 지울 수 없죠(2장). '2018년에'를 쓴 순간부터, 뒤는 거기에 맞춰 그럴듯하게 이어져요." },
    { id: "s6", sec: 9, narration: "환각은 드문 사실, 숫자와 날짜, 사람 이름, 출처에서 특히 잘 생겨요. 진짜처럼 보이는 가짜 출처를 만들기도 해요." },
    { id: "s7", sec: 9, narration: "그래서 중요한 내용은 출처를 직접 확인해야 해요. 믿을 만한 자료를 함께 넣어 주면 훨씬 덜 지어내요(88장)." },
    { id: "s8", sec: 9, narration: "온도를 낮추면 어떨까요? 엉뚱한 뽑기는 줄지만, 1등 답이 지어낸 거라면 그대로예요. 그럴듯함과 사실은 달라요." },
  ],
  playgroundTitle: "환각 실험실",
  playgroundIntro: "모델이 되어 없는 책을 소개하는 답을 한 조각씩 골라 보세요. 그다음 '100번 대답시키기'로 모델이 얼마나 자주 지어내는지 세어 봐요.",
  summary: [
    "환각: 사실이 아닌 내용을 그럴듯하게 지어내는 것.",
    "모델은 '다음에 올 법한 말'을 고를 뿐, 그 말이 사실인지 확인하지 않는다.",
    "숫자·이름·출처는 직접 확인하고, 자료를 함께 주면 덜 지어낸다(88장).",
  ],
  unlocks: "환각 알아채기",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "AI가 환각을 일으키는 가장 큰 까닭은?",
      choices: ["일부러 사람을 속이려고", "인터넷이 느려서", "다음에 올 그럴듯한 말을 고를 뿐, 사실인지 확인하지 않아서"],
      answer: 2,
      explain: "모델은 '이어질 법한 말'을 잘 고르도록 배웠어요. 사실 확인은 그 목표에 들어 있지 않아요.",
      review: "s4",
    },
    {
      q: "온도를 0으로 낮추면 환각은?",
      choices: ["엉뚱한 뽑기는 줄지만, 1등 답이 틀렸다면 그대로 나온다", "완전히 사라진다", "반드시 더 늘어난다"],
      answer: 0,
      explain: "온도는 확률을 다시 나눌 뿐이에요(81장). 가장 그럴듯한 답이 거짓이면, 그 거짓을 매번 말해요.",
      review: "s8",
    },
    {
      q: "AI가 알려 준 책 제목과 출처를 숙제에 쓰려면?",
      choices: ["AI가 자신 있게 말했으니 그대로 쓴다", "검색이나 도서관에서 진짜 있는지 직접 확인한다", "온도를 높여서 다시 물어본다"],
      answer: 1,
      explain: "AI는 출처까지 지어낼 수 있어요. 중요한 내용은 꼭 직접 확인해요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "84장 그럴듯한 거짓말",
    answer1: "2018년에 나온 동화로,",
    answer2: "어린이 문학상을 받았어요.",
    none: "그런데 이 책은 세상에 없어요!",
    madeUp: "* 설명을 위해 지어낸 책 제목이에요",
    halluc: "환각 = 그럴듯한 거짓말",
    q: "Q.",
    example: "설명용 예시 확률",
    honestNote: "← 정직한 답은 4%뿐",
    chatgpt: "ChatGPT",
    markO: "○",
    markX: "×",
    plausible: "그럴듯 ○",
    fake: "이어 붙이니 가짜 사실!",
    learned: "배운 것",
    learnedWhat: "다음에 올 법한 말",
    notLearned: "확인하지 않는 것",
    notWhat: "그 말이 사실인지",
    score: "모델의 점수 = 그럴듯함",
    first: "첫 단추",
    follow: "맞춰서 이어 쓰기",
    noErase: "한번 쓴 말은 못 지워요 (2장)",
    button: "첫 단추를 잘못 끼우면 끝까지…",
    risky: "특히 조심!",
    helpsTitle: "이렇게 대처해요",
    temp: "온도",
    low: "온도를 낮춰도",
    same: "1등 답이 거짓이면 그대로!",
    key: "그럴듯함 ≠ 사실",
  },
};
