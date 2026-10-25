import type { ChapterSpec } from "./types";

export type Era = {
  year: string;
  title: string;
  desc: string;
  kind: "learn" | "rule" | "event" | "winter" | "star";
  step: string;
};

// Spacing on the scene is by order, not to scale; years are written on every card.
export const ERAS: Era[] = [
  { year: "1950", title: "튜링: 기계가 생각할 수 있을까?", desc: "앨런 튜링이 던진 질문", kind: "event", step: "s1" },
  { year: "1956", title: "'인공지능'이라는 이름이 생기다", desc: "미국 다트머스 회의", kind: "event", step: "s2" },
  { year: "1958", title: "퍼셉트론: 스스로 배우는 기계", desc: "로젠블랫. 16장 '뉴런 하나'와 같은 원리", kind: "learn", step: "s2" },
  { year: "1970년대", title: "첫 번째 AI 겨울", desc: "간단한 문제도 못 풀어 기대가 꺼짐", kind: "winter", step: "s3" },
  { year: "1980년대", title: "전문가 시스템", desc: "사람이 규칙을 일일이 써 넣은 AI", kind: "rule", step: "s3" },
  { year: "1986", title: "역전파가 널리 알려지다", desc: "여러 층의 신경망을 학습시키는 방법 (23장)", kind: "learn", step: "s4" },
  { year: "1990년 전후", title: "두 번째 AI 겨울", desc: "규칙 AI의 한계가 드러남", kind: "winter", step: "s4" },
  { year: "1997", title: "딥블루, 체스 챔피언을 이기다", desc: "규칙과 엄청난 계산으로 수를 따져 봄", kind: "rule", step: "s4" },
  { year: "2012", title: "딥러닝 시대가 열리다", desc: "신경망이 사진 맞히기 대회에서 압승", kind: "learn", step: "s5" },
  { year: "2016", title: "알파고, 이세돌 9단을 이기다", desc: "서울에서 4승 1패", kind: "learn", step: "s5" },
  { year: "2017", title: "트랜스포머 발표", desc: "'Attention Is All You Need' (44장)", kind: "star", step: "s6" },
  { year: "2018", title: "GPT-1", desc: "Generative Pre-trained Transformer", kind: "learn", step: "s6" },
  { year: "2020", title: "GPT-3", desc: "1,750억 개의 숫자로 된 모델", kind: "learn", step: "s6" },
  { year: "2022", title: "ChatGPT 출시", desc: "11월 30일. 닷새 만에 사용자 100만 명", kind: "star", step: "s7" },
];

export const ORDER_ITEMS = [
  { key: "turing", label: "튜링이 '기계가 생각할 수 있을까?'라고 물었다", year: "1950" },
  { key: "perceptron", label: "스스로 배우는 기계 퍼셉트론이 나왔다", year: "1958" },
  { key: "deepblue", label: "딥블루가 체스 챔피언을 이겼다", year: "1997" },
  { key: "alphago", label: "알파고가 이세돌 9단을 이겼다", year: "2016" },
  { key: "transformer", label: "트랜스포머가 발표됐다", year: "2017" },
  { key: "chatgpt", label: "ChatGPT가 출시됐다", year: "2022" },
];

export const ch03: ChapterSpec = {
  id: 3,
  part: 0,
  title: "AI 70년 타임라인",
  core: false,
  hook: "AI는 ChatGPT와 함께 갑자기 나타났을까요?",
  steps: [
    { id: "s1", sec: 7, narration: "AI는 갑자기 나타난 게 아니에요. 70년이 넘는 이야기가 있어요. 1950년, 앨런 튜링은 '기계가 생각할 수 있을까?' 하고 물었어요." },
    { id: "s2", sec: 7, narration: "1956년에 '인공지능'이라는 이름이 생기고, 1958년엔 스스로 배우는 기계 퍼셉트론이 나왔어요." },
    { id: "s3", sec: 8, narration: "하지만 퍼셉트론은 간단한 문제도 못 풀었고, 기대가 꺼지면서 연구가 얼어붙었어요. 이런 시기를 'AI 겨울'이라고 해요. 그사이 규칙을 써 넣는 AI가 유행했죠." },
    { id: "s4", sec: 8, narration: "1986년엔 신경망을 학습시키는 역전파가 널리 알려졌지만, 한동안은 다시 겨울이었어요. 1997년엔 규칙과 계산으로 무장한 딥블루가 체스 챔피언을 이겼어요." },
    { id: "s5", sec: 7, narration: "2012년, 신경망이 사진 맞히기 대회에서 압승하며 딥러닝 시대가 열려요. 2016년엔 알파고가 이세돌 9단을 이겼죠." },
    { id: "s6", sec: 8, narration: "2017년 구글 연구팀이 트랜스포머를 발표해요. GPT의 T가 바로 이거예요. 이듬해 GPT-1, 2020년엔 1,750억 개의 숫자로 된 GPT-3가 나왔어요." },
    { id: "s7", sec: 7, narration: "그리고 2022년 11월 30일, ChatGPT가 나와요. 닷새 만에 100만 명이 썼죠. 이 기계가 어떻게 만들어졌는지 하나씩 열어 봐요." },
  ],
  playgroundTitle: "연표 순서 맞히기",
  playgroundIntro: "가장 먼저 일어난 일부터 차례로 눌러 보세요.",
  summary: [
    "1950년 튜링의 질문에서 시작해 70년 넘게 이어진 이야기.",
    "기대와 실망(AI 겨울)을 되풀이하다 2012년 딥러닝으로 크게 도약.",
    "2017년 트랜스포머 → GPT → 2022년 ChatGPT.",
  ],
  unlocks: "2017 트랜스포머",
  unlockLabel: "연표 카드를 모았어요",
  quiz: [
    {
      q: "ChatGPT의 'T'는 무엇의 약자일까요?",
      choices: ["Talk", "Transformer", "Turing"],
      answer: 1,
      explain: "GPT = Generative Pre-trained Transformer. 2017년에 발표된 트랜스포머 구조를 써요.",
      review: "s6",
    },
    {
      q: "'AI 겨울'이란?",
      choices: ["AI가 겨울에만 작동하던 시기", "기대가 꺼지면서 연구가 크게 줄어든 시기", "AI가 날씨를 예측하던 시기"],
      answer: 1,
      explain: "큰 기대만큼 성과가 나오지 않자 관심과 연구비가 줄어든 시기예요. 두 번 있었어요.",
      review: "s3",
    },
    {
      q: "다음 중 가장 먼저 일어난 일은?",
      choices: ["알파고가 이세돌 9단을 이겼다", "트랜스포머가 발표됐다", "ChatGPT가 출시됐다"],
      answer: 0,
      explain: "알파고 2016년 → 트랜스포머 2017년 → ChatGPT 2022년 순서예요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "3장 AI 70년 타임라인",
    learn: "학습",
    rule: "규칙",
    winter: "겨울",
    gpt: "GPT의 T",
    note: "연도 사이 간격은 실제 비율이 아니에요",
  },
};
