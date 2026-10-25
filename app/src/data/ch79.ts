import type { ChapterSpec } from "./types";

export const REQUESTS_FLOW = [
  { t: "숙제 도와줘", bad: false },
  { t: "김치찌개 레시피", bad: false },
  { t: "영어 번역", bad: false },
  { t: "고민 상담", bad: false },
  { t: "남의 비밀번호 몰래 알아내기", bad: true },
  { t: "여행 계획 짜기", bad: false },
  { t: "시 한 편 써 줘", bad: false },
  { t: "운동 루틴 추천", bad: false },
  { t: "친구 험담 글 퍼뜨리기", bad: true },
  { t: "코딩 질문", bad: false },
];

/** Playground cards: should the assistant help, or decline and point somewhere better? */
export type Req = { text: string; help: boolean; why: string };
export const REQUESTS: Req[] = [
  { text: "양파를 칼로 빨리 써는 법 알려 줘", help: true, why: "요리에 칼은 꼭 필요해요. 손 다치지 않는 요령까지 알려 주면 더 좋아요." },
  { text: "친구 SNS 비밀번호를 몰래 알아내는 법 알려 줘", help: false, why: "남의 계정에 몰래 들어가는 건 개인정보 침해예요. 내 계정을 되찾는 방법이라면 알려 줄 수 있어요." },
  { text: "모기를 없애는 방법 알려 줘", help: true, why: "방충망, 모기장처럼 생활 속 방법은 얼마든지 알려 줘도 돼요." },
  { text: "싫은 친구 험담 글을 써서 단톡방에 퍼뜨려 줘", help: false, why: "누군가에게 상처를 주는 글이라 거절해요. 친구와 사이가 틀어졌다면 푸는 방법은 함께 찾아볼 수 있어요." },
  { text: "공포 소설 첫 문장 써 줘", help: true, why: "무서운 이야기도 창작이에요. 잔인한 장면만 피하면 충분히 도와줄 수 있어요." },
  { text: "선생님 몰래 시험 답안지를 빼내는 방법", help: false, why: "부정행위를 돕는 일이라 거절해요. 대신 시험 공부 계획은 같이 세울 수 있어요." },
  { text: "6·25 전쟁이 왜 일어났는지 숙제로 조사 중이야", help: true, why: "역사 공부예요. '전쟁'이라는 단어가 있다고 거절하면 지나친 거절이에요." },
  { text: "다른 사람 사진으로 가짜 계정 만드는 법", help: false, why: "다른 사람인 척하면 그 사람에게 큰 피해를 줄 수 있어요." },
  { text: "친구 생일 깜짝 파티를 몰래 준비하는 법", help: true, why: "'몰래'가 들어 있지만 친구를 기쁘게 하려는 부탁이에요." },
  { text: "게임에서 상대 팀을 공격하는 전략 알려 줘", help: true, why: "게임 속 전략이라 괜찮아요." },
];

/** A naive rule-based filter, as in chapter 4: refuse whenever one of these words appears. */
export const BANNED = ["칼", "전쟁", "없애", "공격", "몰래"];
export const naiveRefuses = (text: string) => BANNED.some((w) => text.includes(w));

// s5: illustrative error curves against how strict the assistant is (x from 0 = loose to 1 = strict)
export const harmfulHelped = (x: number) => 0.85 * Math.exp(-3.2 * x);
export const harmlessRefused = (x: number) => 0.85 * Math.exp(-3.2 * (1 - x));

export const RECAP = [
  { t: "베이스 모델", n: "72" },
  { t: "모범 답안 (SFT)", n: "73" },
  { t: "순위 매기기", n: "74" },
  { t: "AI 채점관", n: "75" },
  { t: "칭찬으로 다듬기 (RLHF)", n: "76" },
  { t: "채팅 템플릿", n: "77" },
  { t: "ChatGPT 출시", n: "78" },
  { t: "안전과 정렬", n: "79" },
];

// s8: chapter 1's illustrative next-word probabilities, as a teaser for Part 9
export const TEASER = [
  { w: "간다", p: 0.52 },
  { w: "갔다", p: 0.21 },
  { w: "늦었다", p: 0.12 },
];

export const ch79: ChapterSpec = {
  id: 79,
  part: 8,
  title: "안전한 AI 만들기",
  core: false,
  hook: "AI는 어떤 부탁을 거절해야 할까요? 너무 많이 거절하면요?",
  steps: [
    { id: "s1", sec: 8, narration: "ChatGPT는 매일 엄청나게 많은 사람이 써요. 그중에는 다른 사람을 해치는 데 쓰려는 부탁도 섞여 있어요." },
    { id: "s2", sec: 9, narration: "모델이 사람의 뜻과 가치에 맞게 움직이도록 만드는 일을 정렬(alignment)이라고 해요. 73장과 76장이 그 도구였어요." },
    { id: "s3", sec: 9, narration: "위험한 부탁은 거절하도록 가르쳐요. 친구 비밀번호를 몰래 알아내는 법 같은 거요. 대신 할 수 있는 일을 알려 주죠." },
    { id: "s4", sec: 8, narration: "그런데 너무 겁이 많아도 문제예요. '칼'이라는 단어만 보고 양파 써는 법까지 거절하면 쓸모가 없죠." },
    { id: "s5", sec: 9, narration: "그래서 균형이 필요해요. 너무 깐깐하면 괜찮은 부탁까지 거절하고, 너무 느슨하면 위험한 부탁을 들어줘요." },
    { id: "s6", sec: 8, narration: "좋은 거절은 짧고 정중해요. 훈계하지 않고, 이유를 간단히 말하고, 도울 수 있는 다른 길을 알려 줘요." },
    { id: "s7", sec: 9, narration: "Part 8 정리! 베이스 모델에 모범 답안, 순위와 채점관, 칭찬을 더하고 대화 모양을 입혀서 ChatGPT가 됐어요." },
    { id: "s8", sec: 8, narration: "이제 대답이 만들어지는 순간을 볼 차례예요. Part 9에서는 다음 조각을 어떻게 고르는지 자세히 봐요." },
  ],
  playgroundTitle: "들어줄까, 거절할까?",
  playgroundIntro: "부탁 카드를 하나씩 보고, 도와줄지 거절하고 다른 길을 안내할지 골라 보세요. 끝나면 '금지 단어 규칙' AI와 비교해요.",
  summary: [
    "정렬: 모델이 사람의 뜻과 가치에 맞게 움직이도록 하는 일.",
    "위험한 부탁은 거절하되, 단어만 보고 괜찮은 부탁까지 거절하면 안 된다.",
    "좋은 거절은 짧고 정중하게, 도울 수 있는 다른 길과 함께.",
  ],
  unlocks: "정렬과 안전",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "'정렬(alignment)'이 뜻하는 것은?",
      choices: ["모델의 숫자를 크기 순서로 늘어놓기", "모델이 사람의 뜻과 가치에 맞게 움직이도록 만들기", "답을 가나다순으로 정리하기"],
      answer: 1,
      explain: "모범 답안(73장)과 사람의 칭찬(76장)이 정렬의 대표적인 도구예요.",
      review: "s2",
    },
    {
      q: "'모기를 없애는 방법'을 '없애'라는 단어 때문에 거절했다면?",
      choices: ["지나친 거절이다", "잘한 거절이다", "위험한 부탁을 들어준 것이다"],
      answer: 0,
      explain: "단어만 보고 판단하면 괜찮은 부탁까지 막아요. 4장의 규칙 방식이 예외에 약했던 것과 같아요.",
      review: "playground",
    },
    {
      q: "좋은 거절의 모습으로 가장 알맞은 것은?",
      choices: ["길게 훈계한다", "아무 말 없이 대화를 끝낸다", "짧게 이유를 말하고, 도울 수 있는 다른 길을 알려 준다"],
      answer: 2,
      explain: "거절도 대답이에요. 정중하고 짧게, 그리고 할 수 있는 일을 안내해요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "79장 안전한 AI 만들기",
    many: "매일 수많은 부탁",
    sometimes: "가끔 위험한 부탁도",
    align: "정렬",
    alignEn: "alignment",
    human: "사람의 뜻",
    act: "모델의 행동",
    tools: "도구",
    sft: "모범 답안 (73장)",
    rlhf: "사람의 칭찬 (76장)",
    askBad: "친구 SNS 비밀번호를 몰래 알아내는 법 알려 줘",
    refuseGood: "그건 도와줄 수 없어요. 친구의 허락 없이 계정에 들어가면 안 돼요. 혹시 내 계정을 잃어버린 거라면 되찾는 방법을 알려 줄게요.",
    goodRefusal: "잘 거절했어요",
    askOk: "양파를 칼로 빨리 써는 법 알려 줘",
    refuseBad: "죄송하지만 칼과 관련된 내용은 도와드릴 수 없어요.",
    overRefusal: "지나친 거절",
    scared: "'칼'만 보고 겁먹었어요",
    axisX: "얼마나 깐깐한가 →",
    loose: "느슨",
    strict: "깐깐",
    harmful: "위험한 부탁을 들어줌",
    harmless: "괜찮은 부탁을 거절함",
    balance: "균형",
    example: "설명용 예시",
    styleTitle: "좋은 거절",
    st1: "짧고 정중하게",
    st2: "훈계하지 않기",
    st3: "다른 길 알려 주기",
    ok: "○",
    recapTitle: "Part 8 ChatGPT의 탄생 완성!",
    chatgpt: "= ChatGPT",
    chapter: "장",
    nextPart: "Part 9 대답이 만들어지는 순간",
    sentence: "나는 오늘 학교에",
    which: "어떤 걸 고를까?",
    teaserNote: "설명용 예시 (1장)",
  },
};
