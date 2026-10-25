export type CurriculumPart = {
  part: number;
  title: string;
  chapters: { n: number; title: string; core?: boolean }[];
};

export const CURRICULUM: CurriculumPart[] = [
  {
    part: 0,
    title: "ChatGPT, 넌 누구니?",
    chapters: [
      { n: 1, title: "다음 단어 맞히기 게임", core: true },
      { n: 2, title: "한 단어씩 써 내려가는 AI", core: true },
      { n: 3, title: "AI 70년 타임라인" },
      { n: 4, title: "규칙으로 vs 데이터로" },
      { n: 5, title: "우리가 조립할 설계도", core: true },
    ],
  },
  {
    part: 1,
    title: "AI의 언어는 숫자",
    chapters: [
      { n: 6, title: "모든 것은 숫자다" },
      { n: 7, title: "벡터: 숫자들의 줄", core: true },
      { n: 8, title: "가까우면 닮았다" },
      { n: 9, title: "내적: 얼마나 같은 방향?", core: true },
      { n: 10, title: "행렬: 벡터 묶음" },
      { n: 11, title: "행렬 곱 = 공간 변환", core: true },
      { n: 12, title: "함수는 입력→출력 기계" },
      { n: 13, title: "확률 분포" },
      { n: 14, title: "점수를 확률로: 소프트맥스", core: true },
      { n: 15, title: "크기 맞추기: 정규화" },
    ],
  },
  {
    part: 2,
    title: "기계는 어떻게 배우나",
    chapters: [
      { n: 16, title: "뉴런 하나", core: true },
      { n: 17, title: "꺾어야 산다: 활성화 함수" },
      { n: 18, title: "층을 쌓으면" },
      { n: 19, title: "순전파" },
      { n: 20, title: "얼마나 틀렸나: 손실", core: true },
      { n: 21, title: "경사하강법", core: true },
      { n: 22, title: "보폭 정하기: 학습률" },
      { n: 23, title: "역전파: 책임 나누기", core: true },
      { n: 24, title: "문제집 나눠 풀기" },
      { n: 25, title: "기출만 외운 학생" },
      { n: 26, title: "직접 해보기: 손글씨 숫자" },
      { n: 27, title: "Part 2 보스전" },
    ],
  },
  {
    part: 3,
    title: "글자를 숫자로",
    chapters: [
      { n: 28, title: "컴퓨터 속 글자" },
      { n: 29, title: "토큰: AI의 글자 단위", core: true },
      { n: 30, title: "자주 붙는 조각 합치기" },
      { n: 31, title: "한국어는 토큰이 많다?" },
      { n: 32, title: "번호표의 한계" },
      { n: 33, title: "임베딩: 의미의 좌표", core: true },
      { n: 34, title: "주변 단어가 의미를 알려준다" },
      { n: 35, title: "임베딩 우주 탐험" },
      { n: 36, title: "순서는 어떻게 알까", core: true },
    ],
  },
  {
    part: 4,
    title: "트랜스포머 이전 이야기",
    chapters: [
      { n: 37, title: "언어 모델 = 문장의 확률" },
      { n: 38, title: "앞 몇 단어만 보기" },
      { n: 39, title: "신경망 언어 모델" },
      { n: 40, title: "RNN: 쪽지 릴레이" },
      { n: 41, title: "RNN의 한계", core: true },
      { n: 42, title: "번역기의 구조" },
      { n: 43, title: "어텐션의 탄생", core: true },
    ],
  },
  {
    part: 5,
    title: "어텐션 완전 정복",
    chapters: [
      { n: 44, title: "Attention Is All You Need" },
      { n: 45, title: "단어들이 서로를 쳐다본다", core: true },
      { n: 46, title: "Query · Key · Value", core: true },
      { n: 47, title: "관련도 점수" },
      { n: 48, title: "나누고 소프트맥스" },
      { n: 49, title: "섞어서 새 의미 만들기" },
      { n: 50, title: "한 번에 계산하기", core: true },
      { n: 51, title: "미래를 훔쳐보지 마", core: true },
      { n: 52, title: "여러 눈으로 보기" },
      { n: 53, title: "진짜 GPT 머릿속 들여다보기" },
    ],
  },
  {
    part: 6,
    title: "트랜스포머 조립하기",
    chapters: [
      { n: 54, title: "트랜스포머 블록 설계도" },
      { n: 55, title: "생각하는 층", core: true },
      { n: 56, title: "정보 고속도로" },
      { n: 57, title: "흔들림 잡기" },
      { n: 58, title: "블록을 쌓으면" },
      { n: 59, title: "인코더 vs 디코더" },
      { n: 60, title: "벡터에서 단어로" },
      { n: 61, title: "처음부터 끝까지 따라가기", core: true },
      { n: 62, title: "Part 6 보스전: 설계도 완성" },
    ],
  },
  {
    part: 7,
    title: "GPT 공부시키기",
    chapters: [
      { n: 63, title: "교과서는 인터넷" },
      { n: 64, title: "정답지 없는 공부", core: true },
      { n: 65, title: "놀람의 크기", core: true },
      { n: 66, title: "훈련 루프 한 바퀴", core: true },
      { n: 67, title: "똑똑한 내리막" },
      { n: 68, title: "왜 GPU일까?" },
      { n: 69, title: "GPT-1 → 2 → 3" },
      { n: 70, title: "클수록 똑똑해진다", core: true },
      { n: 71, title: "예시만 보여줘도 배운다" },
    ],
  },
  {
    part: 8,
    title: "ChatGPT의 탄생",
    chapters: [
      { n: 72, title: "똑똑하지만 말을 안 듣는 모델", core: true },
      { n: 73, title: "모범답안 따라 하기", core: true },
      { n: 74, title: "사람이 순위 매기기" },
      { n: 75, title: "AI 채점관" },
      { n: 76, title: "칭찬으로 다듬기", core: true },
      { n: 77, title: "대화는 사실 긴 문서" },
      { n: 78, title: "2022년 11월 30일" },
      { n: 79, title: "안전한 AI 만들기" },
    ],
  },
  {
    part: 9,
    title: "대답이 만들어지는 순간",
    chapters: [
      { n: 80, title: "고르는 방법" },
      { n: 81, title: "창의력 다이얼", core: true },
      { n: 82, title: "후보 줄이기" },
      { n: 83, title: "AI의 기억 한계" },
      { n: 84, title: "그럴듯한 거짓말", core: true },
      { n: 85, title: "구조를 알면 보이는 프롬프트" },
    ],
  },
  {
    part: 10,
    title: "ChatGPT 이후의 세계",
    chapters: [
      { n: 86, title: "눈을 가진 AI" },
      { n: 87, title: "생각하고 답하기", core: true },
      { n: 88, title: "찾아보고 답하기" },
      { n: 89, title: "손발이 생긴 AI" },
      { n: 90, title: "내 폰 속 AI" },
      { n: 91, title: "AI와 우리" },
    ],
  },
  {
    part: 11,
    title: "졸업 프로젝트",
    chapters: [
      { n: 92, title: "미니 GPT 설계하기" },
      { n: 93, title: "내 토크나이저 만들기" },
      { n: 94, title: "브라우저에서 훈련하기", core: true },
      { n: 95, title: "생성해 보기" },
      { n: 96, title: "졸업식" },
    ],
  },
];

export const TOTAL_CHAPTERS = CURRICULUM.reduce((n, p) => n + p.chapters.length, 0);

export const partTitle = (part: number) => CURRICULUM.find((p) => p.part === part)?.title ?? "";
