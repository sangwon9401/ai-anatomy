import type { ChapterSpec } from "./types";

/**
 * Time each service took to reach 1 million users. These figures are widely quoted (e.g. in a 2023 Statista chart)
 * but rough: each company counted "users" differently. They are labelled 널리 인용되는 추정치 wherever they appear.
 */
export type Service = { name: string; days: number; label: string };
export const SERVICES: Service[] = [
  { name: "넷플릭스", days: 1278, label: "약 3.5년" },
  { name: "트위터", days: 730, label: "약 2년" },
  { name: "페이스북", days: 304, label: "약 10개월" },
  { name: "인스타그램", days: 76, label: "약 2.5개월" },
  { name: "ChatGPT", days: 5, label: "5일" },
];

export const RECIPE = [
  { name: "GPT-3.5 계열 모델", sub: "사전학습 (Part 7)", color: "sky" as const },
  { name: "+ 모범 답안 따라 하기", sub: "73장", color: "violet" as const },
  { name: "+ 사람의 칭찬", sub: "74~76장", color: "pink" as const },
];

export const ch78: ChapterSpec = {
  id: 78,
  part: 8,
  title: "2022년 11월 30일",
  core: false,
  hook: "ChatGPT는 어떻게 닷새 만에 100만 명을 모았을까요?",
  steps: [
    { id: "s1", sec: 8, narration: "2022년 11월 30일, OpenAI가 ChatGPT를 공개했어요. 누구나 무료로 써 볼 수 있는 연구용 미리보기였어요." },
    { id: "s2", sec: 8, narration: "속은 이 Part에서 본 그대로예요. GPT-3.5 계열 모델을 모범 답안과 사람의 칭찬으로 대화에 맞게 다듬었어요." },
    { id: "s3", sec: 7, narration: "달라진 건 쓰는 방법이었어요. 어려운 설정 없이, 친구에게 말 걸듯 대화창에 쓰기만 하면 됐죠." },
    { id: "s4", sec: 7, narration: "반응은 폭발적이었어요. 공개하고 5일 만에 사용자가 100만 명을 넘었어요." },
    { id: "s5", sec: 8, narration: "다른 인기 서비스가 100만 명을 모으는 데 걸린 시간과 비교해 볼까요? 널리 인용되는 추정치예요." },
    { id: "s6", sec: 9, narration: "두 달쯤 지나자 한 달 사용자가 약 1억 명으로 추정됐어요. 그때까지 가장 빨리 성장한 앱이라는 분석도 나왔죠." },
    { id: "s7", sec: 9, narration: "하지만 문제도 드러났어요. 그럴듯하게 틀린 답을 하거나, 위험한 부탁에 답하기도 했죠. 그래서 안전이 더 중요해졌어요." },
  ],
  playgroundTitle: "100만 명 레이스",
  playgroundIntro: "먼저 ChatGPT가 사용자 100만 명을 모으는 데 며칠 걸렸을지 짐작해 보세요. 그다음 다른 서비스와 경주를 시켜 봐요.",
  summary: [
    "ChatGPT는 2022년 11월 30일에 무료 연구용 미리보기로 공개됐다.",
    "속은 GPT-3.5 계열 모델 + 모범 답안 + 사람의 칭찬(RLHF).",
    "5일 만에 100만 명, 두 달쯤 뒤 한 달 사용자 약 1억 명(추정).",
  ],
  unlocks: "ChatGPT 출시",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "ChatGPT가 처음 공개된 날은?",
      choices: ["2020년 6월", "2022년 11월 30일", "2017년 12월"],
      answer: 1,
      explain: "2022년 11월 30일이에요. 2017년은 트랜스포머 논문(44장), 2020년은 GPT-3가 나온 해예요.",
      review: "s1",
    },
    {
      q: "ChatGPT의 속은 어떻게 만들어졌나요?",
      choices: ["완전히 새로운 구조를 처음부터 발명했다", "인터넷 검색 결과를 그대로 보여 준다", "GPT-3.5 계열 모델을 모범 답안과 사람의 칭찬으로 다듬었다"],
      answer: 2,
      explain: "이 Part에서 배운 SFT와 RLHF가 바로 그 방법이에요.",
      review: "s2",
    },
    {
      q: "'100만 명까지 걸린 시간' 비교표를 볼 때 조심할 점은?",
      choices: ["서비스마다 '사용자'를 세는 기준이 달라서 대략적인 추정치다", "모든 숫자가 정확히 측정된 값이다", "ChatGPT가 가장 느렸다"],
      answer: 0,
      explain: "널리 인용되지만 회사마다 기준이 달라요. 큰 흐름을 보는 데만 쓰는 게 좋아요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "78장 2022년 11월 30일",
    month: "2022년 11월",
    day: "30",
    weekday: "수요일",
    launch: "ChatGPT 공개",
    preview: "무료 연구용 미리보기",
    equals: "= ChatGPT",
    sameWay: "* OpenAI 발표: InstructGPT(76장)와 같은 방법으로 학습",
    appName: "ChatGPT",
    ask: "주말에 읽을 책 추천해 줘",
    reply: "좋아요! 어떤 이야기를 좋아하는지 알려 주면 골라 볼게요.",
    input: "메시지를 입력하세요",
    send: "↑",
    justTalk: "그냥 말 걸면 끝!",
    dayN: "일째",
    users: "명",
    dot: "● 1개 = 1만 명",
    million: "5일 만에 100만 명!",
    chartTitle: "사용자 100만 명까지 걸린 시간",
    estimate: "* 널리 인용되는 추정치. 서비스마다 '사용자'를 세는 기준이 달라요",
    wow: "5일!",
    m1: "100만 명 (5일) →",
    m100: "← 약 1억 명\n(두 달쯤, 추정)",
    monthly: "한 달 사용자 약 1억 명 (추정)",
    fastest: "가장 빨리 성장한 앱이라는 분석도",
    cell: "□ 1칸 = 100만 명",
    problems: "드러난 문제",
    wrong: "그럴듯하게 틀린 답 (84장)",
    danger: "위험한 부탁에도 대답",
    safety: "안전하게 만들기",
    next: "79장",
  },
};
