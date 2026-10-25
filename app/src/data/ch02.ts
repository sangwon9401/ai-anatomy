import type { ChapterSpec } from "./types";

export const END = "〈끝〉";

export const QUESTION = ["하늘은", "왜", "파랄까?"];
export const ANSWER = ["햇빛이", "공기를", "지날 때", "파란빛이", "더 많이", "흩어지기", "때문이에요", "."];
export const MISTAKE = {
  question: ["대한민국의", "수도는?"],
  answer: ["부산", "이에요", ".", "아,", "정정할게요", ".", "서울", "이에요", "."],
  wrong: 0,
  fix: 3,
};
// Two continuations of the same prefix, picked by chance (illustrative probabilities).
export const BRANCH = {
  prefix: ["햇빛이"],
  a: { p: 0.48, words: ["공기를", "지날 때", "…"] },
  b: { p: 0.31, words: ["대기 중의", "작은 알갱이에", "…"] },
};

/** Toy next-piece table for the playground: the next piece depends only on the last one. */
export const STORY_START = "옛날 옛적에";
export const STORY: Record<string, { w: string; p: number }[]> = {
  "옛날 옛적에": [
    { w: "호랑이가", p: 0.5 },
    { w: "작은", p: 0.3 },
    { w: "공주가", p: 0.2 },
  ],
  작은: [
    { w: "마을에", p: 0.6 },
    { w: "토끼가", p: 0.4 },
  ],
  "마을에": [
    { w: "호랑이가", p: 0.4 },
    { w: "토끼가", p: 0.35 },
    { w: "공주가", p: 0.25 },
  ],
  호랑이가: [
    { w: "살았어요.", p: 0.55 },
    { w: "떡을", p: 0.3 },
    { w: "나타났어요.", p: 0.15 },
  ],
  토끼가: [
    { w: "살았어요.", p: 0.5 },
    { w: "떡을", p: 0.5 },
  ],
  공주가: [
    { w: "살았어요.", p: 0.6 },
    { w: "노래를", p: 0.4 },
  ],
  떡을: [
    { w: "먹었어요.", p: 0.6 },
    { w: "팔았어요.", p: 0.4 },
  ],
  노래를: [{ w: "불렀어요.", p: 1 }],
  "살았어요.": [
    { w: END, p: 0.45 },
    { w: "그런데", p: 0.55 },
  ],
  "먹었어요.": [
    { w: END, p: 0.5 },
    { w: "그런데", p: 0.5 },
  ],
  "팔았어요.": [
    { w: END, p: 0.5 },
    { w: "그런데", p: 0.5 },
  ],
  "나타났어요.": [
    { w: END, p: 0.3 },
    { w: "그런데", p: 0.7 },
  ],
  "불렀어요.": [
    { w: END, p: 0.5 },
    { w: "그런데", p: 0.5 },
  ],
  그런데: [
    { w: "호랑이가", p: 0.4 },
    { w: "토끼가", p: 0.35 },
    { w: "공주가", p: 0.25 },
  ],
};
export const STORY_MAX = 14;

export const ch02: ChapterSpec = {
  id: 2,
  part: 0,
  title: "한 단어씩 써 내려가는 AI",
  core: true,
  hook: "ChatGPT의 답은 왜 타자를 치듯 한 조각씩 나타날까요?",
  steps: [
    { id: "s1", sec: 6, narration: "질문을 보내면 답이 한 조각씩 나타나죠. 멋 부리는 연출이 아니라, 진짜로 한 조각씩 만들고 있어서예요." },
    { id: "s2", sec: 7, narration: "기계 안을 보면 이래요. 질문과 지금까지 쓴 답, 그러니까 글 전체가 모델에 들어가면 다음 조각 하나가 나와요." },
    { id: "s3", sec: 9, narration: "나온 조각은 글 끝에 붙고, 늘어난 글이 다시 모델로 들어가요. 자기가 쓴 걸 다시 읽으며 이어 쓰는 이 방식을 자기회귀라고 해요." },
    { id: "s4", sec: 7, narration: "그럼 언제 멈출까요? '이제 끝'을 뜻하는 특별한 조각이 뽑히면 멈춰요. 이걸 끝 토큰이라고 불러요." },
    { id: "s5", sec: 7, narration: "답이 9조각이면 모델을 9번 돌린 거예요. 100조각이면 100번이요. 그래서 답이 길수록 오래 걸려요." },
    { id: "s6", sec: 8, narration: "그리고 한번 붙인 조각은 지우지 않아요. 앞에서 틀렸다면, 고치는 말도 뒤에 이어서 써야 해요." },
    { id: "s7", sec: 7, narration: "같은 질문에 답이 매번 조금씩 다른 건, 조각을 확률에 따라 뽑기 때문이에요. 81장에서 자세히 다뤄요." },
  ],
  playgroundTitle: "한 조각씩 이야기 짓기",
  playgroundIntro: "내가 모델이 되어 다음 조각을 골라 보세요. '확률대로 뽑기'를 누르면 확률에 따라 하나가 뽑혀요.",
  summary: [
    "글 전체를 넣으면 다음 조각 하나가 나온다.",
    "나온 조각을 붙여 다시 넣는다. 끝 토큰이 나올 때까지.",
    "조각 수만큼 모델을 돌리고, 붙인 조각은 지우지 않는다.",
  ],
  unlocks: "끝 토큰",
  quiz: [
    {
      q: "답이 한 조각씩 나타나는 진짜 이유는?",
      choices: ["보기 좋으라고 일부러 천천히 보여 준다", "한 조각을 만들 때마다 모델을 한 번씩 돌리기 때문에", "인터넷이 느려서"],
      answer: 1,
      explain: "조각 하나 = 모델 한 번. 만들어지는 대로 바로 보여 주는 거예요.",
      review: "s2",
    },
    {
      q: "ChatGPT는 언제 글쓰기를 멈출까요?",
      choices: ["질문의 길이만큼 쓰면", "'끝'을 뜻하는 특별한 조각이 뽑히면", "사용자가 멈추라고 할 때만"],
      answer: 1,
      explain: "끝 토큰도 다른 조각처럼 확률로 뽑혀요. 뽑히는 순간 멈춰요.",
      review: "s4",
    },
    {
      q: "앞에서 틀린 조각을 붙였다면?",
      choices: ["바로 지우고 다시 쓴다", "지우지 못하고, 고치려면 뒤에 이어서 써야 한다", "처음부터 다시 쓴다"],
      answer: 1,
      explain: "생성은 붙이기만 하는 방식이라, 정정도 이어 쓰기로 해요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "2장 한 단어씩 써 내려가는 AI",
    model: "모델",
    soFar: "지금까지의 글",
    next: "다음 조각",
    loop: "붙이고 다시!",
    round: "번째",
    end: "끝 토큰이 나오면 멈춤",
    stop: "멈춤",
    count: "조각 9개 = 모델 9번",
    hundred: "100조각이면 100번",
    longer: "길수록 오래 걸려요",
    noErase: "한번 붙이면 못 지워요",
    fixLater: "고치는 말도 이어서 써요",
    sample: "확률대로 뽑기 (81장)",
    auto: "자기회귀",
    really: "진짜로 한 조각씩!",
  },
};
