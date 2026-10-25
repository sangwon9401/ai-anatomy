import type { ChapterSpec } from "./types";

export type Msg = { me: boolean; text: string };

// The chat in the scene. In the picture the window holds five speech bubbles (illustrative; real windows count tokens).
export const CHAT: Msg[] = [
  { me: true, text: "안녕! 내 이름은 민지야." },
  { me: false, text: "반가워요! 무엇을 도와줄까요?" },
  { me: true, text: "주말에 볼 영화 추천해 줘." },
  { me: false, text: "가족 영화라면 애니메이션 어때요?" },
  { me: true, text: "팝콘은 뭐가 맛있어?" },
  { me: false, text: "캐러멜 팝콘이 인기가 많아요." },
  { me: true, text: "내 이름이 뭐였지?" },
];
export const GUESS = "음… 혹시 지수 님이었나요?";
export const WINDOW_SLOTS = 5;

export const GPT3_CTX = 2048;
export const GPT3_CELLS = GPT3_CTX * GPT3_CTX; // 4,194,304 ≈ 약 419만

// s6–s7: generating after "나는 오늘 학교에" (the greedy loop from ch80)
export const KV_TOKENS = ["나는", "오늘", "학교에", "간다", "그리고", "친구를"];
export const KV_PROMPT = 3;
export const KV_ROUNDS = 4; // rows: 3, 4, 5, 6 tokens
export const noCache = (m: number, n: number) => n * m + (n * (n - 1)) / 2; // 3+4+5+6 = 18
export const withCache = (m: number, n: number) => m + (n - 1); // 3+1+1+1 = 6

// playground: extra turns the student can add (user message + canned reply)
export const TURNS: { label: string; me: string; ai: string }[] = [
  { label: "영화 추천", me: "주말에 볼 영화 추천해 줘.", ai: "가족 영화라면 애니메이션 어때요?" },
  { label: "팝콘", me: "팝콘은 뭐가 맛있어?", ai: "캐러멜 팝콘이 인기가 많아요." },
  { label: "숙제", me: "수학 숙제 좀 도와줘.", ai: "좋아요, 어떤 문제인가요?" },
  { label: "소풍", me: "내일 소풍 가도 될까?", ai: "날씨 예보를 먼저 확인해 보세요." },
  { label: "노래", me: "신나는 노래 하나 골라 줘.", ai: "운동할 때 듣기 좋은 곡을 찾아볼게요." },
];

export const ch83: ChapterSpec = {
  id: 83,
  part: 9,
  title: "AI의 기억 한계",
  core: false,
  hook: "ChatGPT와 오래 이야기하다 보면, 처음에 한 말을 잊어버릴 때가 있어요. 왜 그럴까요?",
  steps: [
    { id: "s1", sec: 7, narration: "77장에서 봤듯이 대화는 모델에게 하나의 긴 글이에요. 그런데 한 번에 읽을 수 있는 길이에는 한계가 있어요." },
    { id: "s2", sec: 8, narration: "이 한계를 컨텍스트 창이라고 해요. GPT-3은 2,048토큰까지 볼 수 있었어요. 창 안에 든 글만 예측에 쓰여요." },
    { id: "s3", sec: 7, narration: "대화가 길어지면, 새 말이 들어올 때마다 가장 오래된 말이 창 밖으로 밀려나요." },
    { id: "s4", sec: 9, narration: "이제 이름을 물으면? 이름은 창 밖이라 모델 눈에 안 보여요. 모른다고 하거나, 이름을 지어낼 수도 있어요(84장)." },
    { id: "s5", sec: 9, narration: "창을 마냥 키우기는 어려워요. 어텐션은 조각 쌍마다 점수를 매기니까(47장), 길이가 2배면 점수표는 4배예요." },
    { id: "s6", sec: 9, narration: "답을 쓸 땐 조각 하나를 만들 때마다 앞 조각 전부의 Key와 Value가 필요해요(46장). 매번 새로 계산하면 낭비죠." },
    { id: "s7", sec: 9, narration: "KV 캐시는 이미 계산한 Key·Value 메모를 다시 쓰는 방법이에요. 앞 조각은 뒤를 안 보니까(51장) 값이 그대로거든요." },
    { id: "s8", sec: 8, narration: "대신 메모는 대화가 길수록 쌓여서 메모리를 차지해요. 긴 대화에선 중요한 내용을 다시 알려 주면 좋아요." },
  ],
  playgroundTitle: "기억 창 시뮬레이터",
  playgroundIntro: "대화를 이어 가다가 '내 이름이 뭐였지?'를 눌러 보고, 창 크기도 바꿔 보세요. 아래에선 KV 캐시가 아껴 주는 계산을 세어 봐요.",
  summary: [
    "컨텍스트 창(context window): 모델이 한 번에 볼 수 있는 토큰 수. GPT-3은 2,048토큰.",
    "창을 넘으면 오래된 말부터 밀려나서, 모델은 그 내용을 볼 수 없다.",
    "KV 캐시: 이미 계산한 Key·Value를 메모해 두고 다시 써서 답을 빨리 만든다.",
  ],
  unlocks: "컨텍스트 창 · KV 캐시",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "대화가 컨텍스트 창보다 길어지면 어떻게 될까요?",
      choices: ["모델이 대화 전체를 요약해서 기억한다", "가장 오래된 부분부터 창 밖으로 밀려나 보이지 않는다", "대화가 저절로 끝난다"],
      answer: 1,
      explain: "창 안에 든 글만 볼 수 있어요. 밀려난 앞부분은 모델에게 없는 것과 같아요.",
      review: "s3",
    },
    {
      q: "조각 수가 2배가 되면 어텐션 점수표의 칸 수는?",
      choices: ["4배", "2배", "그대로"],
      answer: 0,
      explain: "점수표는 가로도 세로도 조각 수만큼이라, 2배 × 2배 = 4배가 돼요.",
      review: "s5",
    },
    {
      q: "KV 캐시가 다시 꺼내 쓰는 것은?",
      choices: ["사용자가 예전에 했던 질문", "인터넷 검색 결과", "앞 조각들의, 이미 계산해 둔 Key와 Value"],
      answer: 2,
      explain: "앞 조각의 Key·Value는 뒤에 조각이 붙어도 바뀌지 않아서, 메모해 두고 다시 쓸 수 있어요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "83장 AI의 기억 한계",
    longText: "대화 전체 = 하나의 긴 글 (77장)",
    window: "컨텍스트 창",
    gpt3: "GPT-3: 2,048토큰",
    toy: "이 그림에선 말풍선 5개 (설명용)",
    out: "창 밖 = 안 보여요",
    here: "여기 있는데…",
    mayMake: "못 보면 지어낼 수도! (84장)",
    me: "나",
    ai: "AI",
    t4: "4조각",
    t8: "8조각",
    c16: "16칸",
    c64: "64칸",
    x4: "2배 길이 → 4배 칸",
    big: "2,048조각 → 약 419만 칸",
    every: "층마다, 헤드마다!",
    round: "번째",
    calc: "새로 계산",
    memo: "메모에서 꺼냄",
    noCacheSum: "캐시 없이: 3 + 4 + 5 + 6 = 18번",
    cacheSum: "KV 캐시: 3 + 1 + 1 + 1 = 6번",
    kv: "Key·Value 계산",
    why: "앞 조각은 뒤를 안 봐요 (51장)",
    cacheName: "KV 캐시 = 계산 메모장",
    stack: "대화가 길수록 메모도 쑥쑥",
    full: "메모리가 꽉!",
    tipTitle: "긴 대화 꿀팁",
    tip1: "중요한 내용은 다시 알려 주기",
    tip2: "주제가 바뀌면 새 대화 열기",
    tokens: "토큰",
  },
};
