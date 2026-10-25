import type { ChapterSpec } from "./types";

// A made-up school's documents (별빛제 = the school festival). 2026-11-06 and 2025-11-07 are both Fridays.
export type Doc = { id: string; title: string; text: string; c: "yellow" | "mint" | "sky" | "pink" | "orange" | "violet" };
export const DOCS: Doc[] = [
  { id: "fest", title: "2026 별빛제 안내", text: "2026 별빛제(학교 축제)는 11월 6일(금)에 열립니다. 반별 부스는 오전 10시부터 오후 2시 30분까지 운영합니다.", c: "yellow" },
  { id: "old", title: "2025 별빛제 감사 인사", text: "2025 별빛제(학교 축제)는 11월 7일(금)에 열렸습니다. 많이 참여해 주셔서 고맙습니다.", c: "orange" },
  { id: "lunch", title: "11월 급식 안내", text: "11월 둘째 주 금요일 점심은 카레라이스와 미역국입니다. 알레르기 정보는 학교 누리집에 있습니다.", c: "mint" },
  { id: "lib", title: "도서관 이용 시간", text: "도서관은 평일 오전 8시부터 오후 5시까지 엽니다. 시험 기간에는 오후 7시까지 엽니다.", c: "sky" },
  { id: "pe", title: "겨울 체육복 안내", text: "겨울 체육복은 11월 2일부터 입을 수 있습니다.", c: "violet" },
  { id: "club", title: "방과후 코딩반 모집", text: "방과후 코딩반 신청은 11월 3일까지 받습니다. 신청은 담임 선생님께 하세요.", c: "pink" },
];

export type Question = {
  key: string;
  q: string;
  /** search words; a document's score = how many of them it contains (a simple stand-in for vector search) */
  keys: string[];
  answer?: { doc: string; text: string };
  /** what comes out when only this (misleading) document is given */
  trap?: { doc: string; text: string };
  /** what the model makes up when no documents are given (illustrative) */
  madeUp: string;
};
export const QUESTIONS: Question[] = [
  {
    key: "date",
    q: "2026 별빛제는 언제예요?",
    keys: ["2026", "별빛제", "축제"],
    answer: { doc: "fest", text: "11월 6일 금요일이에요." },
    trap: { doc: "old", text: "11월 7일 금요일이에요." },
    madeUp: "10월 16일 금요일이에요!",
  },
  {
    key: "booth",
    q: "축제 날 반별 부스는 몇 시부터 몇 시까지 운영해요?",
    keys: ["축제", "부스", "운영", "시간"],
    answer: { doc: "fest", text: "오전 10시부터 오후 2시 30분까지 운영해요." },
    madeUp: "오전 9시부터 오후 4시까지예요!",
  },
  {
    key: "lib",
    q: "도서관은 몇 시까지 열어요?",
    keys: ["도서관", "시간"],
    answer: { doc: "lib", text: "평일에는 오후 5시까지, 시험 기간에는 오후 7시까지 열어요." },
    madeUp: "오후 6시까지 열어요!",
  },
  {
    key: "trip",
    q: "수학여행은 어디로 가요?",
    keys: ["수학여행", "장소"],
    madeUp: "제주도로 가요!",
  },
];

export const scoreDoc = (q: Question, d: Doc) => q.keys.filter((k) => d.title.includes(k) || d.text.includes(k));

// Scene: four documents and their (illustrative) closeness to the question vector, best first.
export const SCENE_Q = "우리 학교 축제는 언제예요?";
export const SCENE_DOCS = [
  { title: "2026 별빛제 안내", sim: 0.86, c: "yellow" as const },
  { title: "도서관 이용 시간", sim: 0.31, c: "sky" as const },
  { title: "11월 급식 안내", sim: 0.24, c: "mint" as const },
  { title: "겨울 체육복 안내", sim: 0.12, c: "violet" as const },
];

export const ch88: ChapterSpec = {
  id: 88,
  part: 10,
  title: "찾아보고 답하기",
  core: false,
  hook: "우리 학교 축제 날짜처럼 AI가 배운 적 없는 건 어떻게 물어볼까요?",
  steps: [
    { id: "s1", sec: 9, narration: "우리 학교 축제가 언제인지 모델에게 물어볼까요? 모델은 학습할 때 본 글만 알아요. 우리 학교 가정통신문은 본 적이 없죠." },
    { id: "s2", sec: 7, narration: "그래도 모델은 다음 조각을 이어 써요. 그럴듯한 날짜를 지어낼 수 있죠. 84장에서 본 환각이에요." },
    { id: "s3", sec: 7, narration: "해결책은 간단해요. 답하기 전에 먼저 찾아보기! 학교 문서 더미에서 질문과 관련 있는 문서를 검색해요." },
    { id: "s4", sec: 8, narration: "질문과 문서를 각각 숫자 벡터로 바꾸고, 질문과 가까운 문서를 골라요(8장). 축제 안내문이 가장 가까워요." },
    { id: "s5", sec: 8, narration: "찾은 문서를 질문과 함께 한 덩어리 글로 모델에 넣어요. '아래 문서를 보고 답해 줘'라는 부탁도 같이요." },
    { id: "s6", sec: 8, narration: "이제 모델은 문서에 적힌 날짜를 옮겨 쓰면 돼요. 어느 문서를 보고 답했는지 출처도 달 수 있어요." },
    { id: "s7", sec: 9, narration: "이 방법을 검색 증강 생성, 줄여서 RAG라고 해요. 2020년에 나온 이름이에요. 모델을 다시 학습시키지 않고도 새 정보를 써요." },
    { id: "s8", sec: 9, narration: "단, 찾은 문서가 틀리면 답도 틀려요. 작년 안내문을 찾으면 작년 날짜로 답하죠. 그래서 출처를 직접 확인해야 해요." },
  ],
  playgroundTitle: "검색해서 답하기",
  playgroundIntro: "질문을 고르고 학교 문서를 검색해 보세요. 프롬프트에 넣을 문서를 골라 답을 받아요. 함정 문서도 섞여 있어요!",
  summary: [
    "모델은 학습할 때 본 글만 안다. 모르는 걸 물으면 지어낼 수 있다(환각, 84장).",
    "RAG: 질문과 가까운 문서를 검색해서 프롬프트에 함께 넣고 답하게 한다.",
    "출처가 달린 답도 문서가 틀리면 틀린다. 출처를 직접 확인하자.",
  ],
  unlocks: "찾아보고 답하기",
  unlockLabel: "새 능력 카드를 하나 얻었어요",
  quiz: [
    {
      q: "모델이 우리 학교 축제 날짜를 모르는 이유는?",
      choices: ["학습할 때 본 글에 그 정보가 없어서", "날짜는 숫자라서", "질문이 너무 짧아서"],
      answer: 0,
      explain: "모델은 학습 데이터에 있던 내용만 알아요. 그래도 이어 쓰기는 하니까 지어낼 수 있어요(84장).",
      review: "s1",
    },
    {
      q: "RAG에서 '검색한 문서'는 어디에 들어갈까요?",
      choices: ["모델의 파라미터를 바꾸는 데", "질문과 함께 프롬프트(입력 글)에", "답이 나온 뒤 맨 끝에"],
      answer: 1,
      explain: "찾은 문서를 질문과 한 덩어리 글로 넣어요. 모델은 다시 학습하지 않아요.",
      review: "s5",
    },
    {
      q: "출처가 달린 답인데 작년 안내문이 출처라면?",
      choices: ["출처가 있으니 무조건 맞다", "모델이 알아서 올해 날짜로 고친다", "문서가 틀렸으니 답도 틀릴 수 있다. 출처를 확인한다"],
      answer: 2,
      explain: "모델은 넣어 준 문서를 믿고 답해요. 찾은 문서가 틀리면 답도 틀려요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "88장 찾아보고 답하기",
    q: "우리 학교 축제는 언제예요?",
    model: "모델",
    seen: "학습할 때 본 글",
    notice: "가정통신문",
    noticeTitle: "2026 별빛제 안내",
    never: "본 적 없어요",
    madeUp: "10월 16일 금요일이에요!",
    halluc: "그럴듯한 지어내기 = 환각 (84장)",
    pile: "학교 문서 더미",
    search: "검색",
    closeness: "질문과 가까운 순서 (8장)",
    example: "* 설명용 예시",
    promptTitle: "모델에 들어가는 글",
    docTag: "[문서] 2026 별빛제 안내",
    docText: "2026 별빛제는 11월 6일(금)에 열립니다.",
    ask: "아래 문서를 보고 답해 주세요.",
    qLine: "질문: 우리 학교 축제는 언제예요?",
    answer: "11월 6일 금요일이에요.",
    date: "11월 6일(금)",
    docPre: "2026 별빛제는",
    docPost: "에 열립니다.",
    source: "출처: 2026 별빛제 안내",
    copy: "적힌 그대로 옮겨 쓰기",
    rag: "검색 증강 생성 (RAG, 2020)",
    r: "R 검색 (Retrieval)",
    a: "A 보태서 (Augmented)",
    g: "G 생성 (Generation)",
    step1: "① 검색",
    step2: "② 붙여 넣기",
    step3: "③ 답 + 출처",
    same: "모델은 그대로, 정보만 새로!",
    oldTitle: "2025 별빛제 감사 인사",
    oldText: "2025 별빛제는 11월 7일(금)에 열렸습니다.",
    lastYear: "작년 문서!",
    oldAnswer: "11월 7일 금요일이에요.",
    oldSource: "출처: 2025 별빛제 감사 인사",
    wrongDoc: "문서가 틀리면 답도 틀려요",
    checkIt: "출처를 열어 직접 확인하기",
  },
};
