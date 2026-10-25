import type { ChapterSpec } from "./types";

// What the base model writes after the question in the scene (illustrative, labelled so).
export const CONTINUE = ["일본의 수도는 어디인가요?", "중국의 수도는 어디인가요?", "프랑스의 수도는 어디인가요?"];
export const READ = ["뉴스", "위키 문서", "소설", "문제집", "게시판 글", "요리책"];
export const QLIKE = ["문제집", "설문지", "질문 모음", "퀴즈 대회 대본"];

/** Playground: the same question wrapped in different document starts. All continuations and chances are illustrative. */
export type Frame = { key: string; name: string; before: string; after: string };
export const FRAMES: Frame[] = [
  { key: "plain", name: "질문만 덩그러니", before: "", after: "" },
  { key: "exam", name: "시험지 첫 문제", before: "[확인 문제]\n1. ", after: "" },
  { key: "qa", name: "질문: … 답:", before: "질문: ", after: "\n답:" },
  { key: "script", name: "학생과 선생님 대본", before: "학생: ", after: "\n선생님:" },
];

export type Probe = {
  q: string;
  /** continuation per frame key, and the chance that the very next piece starts an answer */
  out: Record<string, { text: string; answer: number; isAnswer: boolean }>;
};

export const PROBES: Probe[] = [
  {
    q: "대한민국의 수도는 어디인가요?",
    out: {
      plain: { text: "\n일본의 수도는 어디인가요?\n중국의 수도는 어디인가요?", answer: 0.08, isAnswer: false },
      exam: { text: "\n2. 일본의 수도는 어디인가요?\n3. 태극기의 네 괘 이름을 쓰시오.", answer: 0.03, isAnswer: false },
      qa: { text: " 서울입니다.", answer: 0.81, isAnswer: true },
      script: { text: " 좋은 질문이구나. 서울이란다.", answer: 0.74, isAnswer: true },
    },
  },
  {
    q: "물은 몇 도에서 끓나요?",
    out: {
      plain: { text: "\n얼음은 몇 도에서 녹나요?\n물은 몇 도에서 얼까요?", answer: 0.1, isAnswer: false },
      exam: { text: "\n2. 얼음이 녹는 온도는 몇 도인가요?\n3. 물이 끓을 때 생기는 기포의 정체는?", answer: 0.04, isAnswer: false },
      qa: { text: " 보통 100도에서 끓어요.", answer: 0.78, isAnswer: true },
      script: { text: " 높은 산이 아니라면 100도에서 끓는단다.", answer: 0.7, isAnswer: true },
    },
  },
];

export const ch72: ChapterSpec = {
  id: 72,
  part: 8,
  title: "똑똑하지만 말을 안 듣는 모델",
  core: true,
  hook: "인터넷 글을 엄청나게 읽은 모델에게 질문하면, 바로 대답해 줄까요?",
  steps: [
    { id: "s1", sec: 9, narration: "Part 7에서 인터넷 글로 다음 조각 맞히기 공부를 마친 모델이 있어요. 이걸 베이스 모델(base model)이라고 해요." },
    { id: "s2", sec: 8, narration: "이 모델에게 물어볼게요. '대한민국의 수도는 어디인가요?' 당연히 서울이라고 대답하겠죠?" },
    { id: "s3", sec: 8, narration: "그런데 대답 대신 질문을 계속 써요. 일본의 수도는? 중국의 수도는? 마치 시험 문제 목록처럼요." },
    { id: "s4", sec: 8, narration: "모델 눈에는 이 글이 문제집의 첫 줄로 보였어요. 인터넷에는 질문 다음에 또 질문이 오는 글이 아주 많거든요." },
    { id: "s5", sec: 8, narration: "베이스 모델이 배운 건 그럴듯하게 이어 쓰기뿐이에요(2장). 질문에 대답하라고 배운 적은 없어요." },
    { id: "s6", sec: 8, narration: "그래서 꾀를 냈어요. '질문: … 답:' 모양으로 글을 시작하면, 다음 조각으로 답이 올 확률이 확 커져요." },
    { id: "s7", sec: 9, narration: "하지만 매번 꾀를 낼 수는 없죠. 똑똑하지만 말을 안 듣는 이 모델을 말 잘 듣게 가르치는 게 Part 8 이야기예요." },
  ],
  playgroundTitle: "글의 첫머리 바꾸기",
  playgroundIntro: "같은 질문을 여러 모양의 글로 시작해 보세요. 베이스 모델이 어떻게 이어 쓰는지 보여 줘요. 대답이 나오는 시작 두 가지를 찾아보세요.",
  summary: [
    "베이스 모델은 인터넷 글로 다음 조각 맞히기만 배운 모델이다.",
    "질문을 주면 대답 대신 문제집처럼 질문을 이어 쓰기도 한다.",
    "글의 모양을 바꾸면 답을 끌어낼 수 있지만, 근본 해결은 따로 가르치기.",
  ],
  unlocks: "베이스 모델",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "베이스 모델에게 '대한민국의 수도는 어디인가요?'라고만 쓰면 왜 질문이 이어질 수 있을까요?",
      choices: ["모델이 서울을 몰라서", "인터넷에는 질문 다음에 또 질문이 오는 글이 많아서", "모델이 일부러 장난을 쳐서"],
      answer: 1,
      explain: "베이스 모델은 글을 그럴듯하게 이어 쓸 뿐이에요. 문제집 같은 글에선 질문 다음에 질문이 오죠.",
      review: "s4",
    },
    {
      q: "베이스 모델이 사전학습에서 실제로 연습한 일은?",
      choices: ["질문에 친절하게 대답하기", "사람의 칭찬 받기", "글의 다음 조각 맞히기"],
      answer: 2,
      explain: "다음 조각 맞히기만 연습했어요(2장, Part 7). 대답하는 법은 아직 배운 적이 없어요.",
      review: "s5",
    },
    {
      q: "베이스 모델에게서 답을 끌어내려면 글을 어떻게 시작하면 좋을까요?",
      choices: ["'질문: … 답:' 모양으로 쓰고 답 자리를 비워 둔다", "질문을 세 번 반복한다", "질문 끝에 물음표를 여러 개 붙인다"],
      answer: 0,
      explain: "답 자리가 비어 있는 글이면, 그다음 조각으로 답이 오는 게 가장 그럴듯해져요.",
      review: "playground",
    },
  ],
  labels: {
    tag: "72장 똑똑하지만 말을 안 듣는 모델",
    model: "베이스 모델",
    modelEn: "base model",
    studied: "다음 조각 맞히기 공부 끝! (Part 7)",
    gpt3Read: "GPT-3는 약 3,000억 개의 토큰을 읽고 공부했어요",
    question: "대한민국의 수도는 어디인가요?",
    expect: "서울이에요.",
    expectNote: "이렇게 대답하겠지?",
    dots: "…",
    huh: "대답 대신 질문?!",
    example: "설명용 예시",
    examTitle: "[사회] 수도 확인 문제",
    n1: "1.",
    n2: "2.",
    n3: "3.",
    n4: "4.",
    looks: "모델 눈엔 문제집 첫 줄!",
    mine: "내 질문",
    qlike: "질문 뒤에 질문이 오는 글",
    learned: "베이스 모델이 배운 것",
    learnedWhat: "그럴듯하게 이어 쓰기",
    wanted: "우리가 바란 것",
    wantedWhat: "질문에 대답하기",
    neq: "≠",
    ch2: "자기가 쓴 글을 이어 쓸 뿐 (2장)",
    qaQ: "질문:",
    qaA: "답:",
    qaFill: "서울입니다.",
    chanceTitle: "다음 조각으로 답이 올 확률",
    plainRow: "질문만 덩그러니",
    qaRow: "'질문: … 답:' 모양",
    p1: "8%",
    p2: "81%",
    trick: "글의 모양으로 유도하기",
    smart: "똑똑함",
    listens: "말 잘 들음",
    yes: "○",
    no: "×",
    chatgpt: "ChatGPT",
    sft: "모범 답안 따라 하기 (73장)",
    rlhf: "사람의 칭찬으로 다듬기 (76장)",
    todo: "Part 8에서 할 일",
  },
};
