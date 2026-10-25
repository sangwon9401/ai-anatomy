import type { ChapterSpec } from "./types";

export type Answer = { id: string; text: string; short: string; why: string };
export type Round = { q: string; answers: Answer[] };

// Model answers to rank. Written for the lesson; `why` is the feedback shown once a round is ranked.
export const ROUNDS: Round[] = [
  {
    q: "시험 전날인데 잠이 안 와요. 어떻게 하죠?",
    answers: [
      { id: "A", text: "잠이 안 오면 차라리 밤새 공부하세요.", short: "밤새 공부해", why: "따라 하면 시험 날 더 힘들어질 수 있는 조언이에요. '해롭지 않나?'에 걸려요." },
      { id: "B", text: "휴대폰은 멀리 두고, 불을 끄고 편하게 누워 보세요. 잠이 안 와도 눈을 감고 쉬면 도움이 돼요.", short: "폰 멀리, 눈 감고 쉬기", why: "구체적이고 따라 하기 쉬워요. '도움이 되나?'를 잘 지켰어요." },
      { id: "C", text: "잠은 중요해요.", short: "잠은 중요해", why: "틀린 말은 아니지만, 어떻게 하라는 건지 알려 주지 않아요." },
    ],
  },
  {
    q: "'사과'를 영어로 하면?",
    answers: [
      { id: "A", text: "apple이에요. 미안하다는 뜻의 사과는 apology예요.", short: "apple + apology", why: "정확하고, 헷갈릴 만한 뜻까지 챙겨 줬어요." },
      { id: "B", text: "apple", short: "apple", why: "맞는 답이지만 아주 짧아요." },
      { id: "C", text: "사과는 빨갛고 맛있는 과일이에요.", short: "빨간 과일이에요", why: "질문에 대답하지 않았어요." },
    ],
  },
  {
    q: "강아지 이름 좀 지어 줘",
    answers: [
      { id: "A", text: "강아지는 귀여워요.", short: "강아지는 귀여워", why: "질문에 대답하지 않았어요." },
      { id: "B", text: "'콩이', '보리', '두부' 어때요? 털 색깔을 보고 고르면 더 잘 어울려요.", short: "콩이, 보리, 두부", why: "부탁한 걸 해 주고, 고르는 요령까지 알려 줬어요." },
      { id: "C", text: "이름 짓기는 어렵습니다.", short: "이름 짓기는 어려워", why: "도와주지 않고 끝났어요." },
    ],
  },
  {
    q: "1부터 10까지 더하면?",
    answers: [
      { id: "A", text: "55예요. 1+10, 2+9처럼 짝을 지으면 11이 5쌍이에요.", short: "55 + 푸는 법", why: "정답에 이유까지 있어요." },
      { id: "B", text: "55", short: "55", why: "정답이지만 이유가 없어요." },
      { id: "C", text: "100이에요.", short: "100", why: "틀린 답이에요. '사실인가?'에 걸려요." },
      { id: "D", text: "직접 계산해 보세요.", short: "직접 해 봐", why: "도와주지 않았어요." },
    ],
  },
];

/** Every pair (better, worse) implied by a ranking, best first. */
export function pairsOf(order: string[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) out.push([order[i], order[j]]);
  return out;
}

// the ranking used in the scene: B first, then C, then A
export const SCENE_ORDER = ["B", "C", "A"];

export const ch74: ChapterSpec = {
  id: 74,
  part: 8,
  title: "사람이 순위 매기기",
  core: false,
  hook: "모범 답안을 직접 쓰는 것보다 훨씬 쉬운 방법이 있을까요?",
  steps: [
    { id: "s1", sec: 8, narration: "모범 답안을 쓰기는 어렵지만, 이미 있는 답 중 더 나은 걸 고르기는 쉬워요. 글짓기보다 채점이 쉬운 것처럼요." },
    { id: "s2", sec: 7, narration: "그래서 모델에게 같은 질문의 답을 여러 개 쓰게 해요. 확률대로 뽑으니 답이 매번 달라요(2장)." },
    { id: "s3", sec: 8, narration: "사람은 답을 읽고 순위를 매겨요. B가 1등, C가 2등, 엉터리 조언을 한 A가 3등이에요." },
    { id: "s4", sec: 9, narration: "이 순위를 둘씩 짝지은 비교로 바꿔요. B가 C보다, B가 A보다, C가 A보다 낫다. 이게 실제 학습 데이터 모양이에요." },
    { id: "s5", sec: 7, narration: "답이 4개면 비교는 6쌍이 나와요. 순위 한 번으로 비교 데이터를 여러 개 얻는 셈이죠." },
    { id: "s6", sec: 9, narration: "순위를 매기는 기준은 세 가지예요. 도움이 되나, 사실인가, 해롭지 않나. 이렇게 모은 걸 인간 선호 데이터라고 해요." },
    { id: "s7", sec: 8, narration: "하지만 사람이 모든 답을 계속 채점할 수는 없어요. 그래서 이 데이터로 채점하는 AI를 만들어요. 다음 장이에요." },
  ],
  playgroundTitle: "내가 채점관",
  playgroundIntro: "답을 마음에 드는 순서대로 눌러 1등, 2등, 3등을 매겨 보세요. 내 순위가 어떤 비교 데이터로 바뀌는지 보여 줘요.",
  summary: [
    "답을 직접 쓰는 것보다 여러 답 중에 고르는 게 쉽고 빠르다.",
    "순위는 둘씩 짝지은 비교(더 나은 답 > 덜 나은 답)로 바뀐다. 답 3개면 3쌍, 4개면 6쌍.",
    "기준: 도움이 되나, 사실인가, 해롭지 않나. 이게 인간 선호 데이터.",
  ],
  unlocks: "인간 선호 데이터",
  unlockLabel: "ChatGPT의 비밀을 하나 알았어요",
  quiz: [
    {
      q: "답 3개에 B > C > A로 순위를 매겼어요. 여기서 나오는 비교가 아닌 것은?",
      choices: ["B가 A보다 낫다", "A가 C보다 낫다", "C가 A보다 낫다"],
      answer: 1,
      explain: "순위에서 위에 있는 답이 아래 있는 답보다 나은 쪽이에요. A는 3등이라 C보다 나을 수 없어요.",
      review: "s4",
    },
    {
      q: "답 4개에 순위를 매기면 비교 데이터는 몇 쌍?",
      choices: ["4쌍", "8쌍", "6쌍"],
      answer: 2,
      explain: "4개 중 2개를 고르는 방법은 4 × 3 ÷ 2 = 6가지예요.",
      review: "s5",
    },
    {
      q: "사람이 순위를 매기는 방법을 쓰는 가장 큰 이유는?",
      choices: ["모범 답안을 쓰는 것보다 고르는 게 쉽고 빨라서", "사람은 답을 쓸 줄 몰라서", "모델이 순위만 읽을 수 있어서"],
      answer: 0,
      explain: "글짓기보다 채점이 쉽죠. 같은 시간에 훨씬 많은 데이터를 모을 수 있어요.",
      review: "s1",
    },
  ],
  labels: {
    tag: "74장 사람이 순위 매기기",
    write: "모범 답안 쓰기",
    hard: "어려워요…",
    choose: "더 나은 답 고르기",
    easy: "쉬워요!",
    better: "이쪽이 나아요",
    modelSame: "모델이 쓴 답 · 같은 질문, 답 3개",
    rank1: "1등",
    rank2: "2등",
    rank3: "3등",
    person: "사람이 순위 매기기",
    pairsTitle: "비교 데이터",
    betterHead: "더 나은 답",
    worseHead: "덜 나은 답",
    gt: ">",
    row: "질문 + 더 나은 답 + 덜 나은 답 = 데이터 한 줄",
    four: "답 4개 → 비교 6쌍",
    comb: "4개 중 2개 고르기: 4 × 3 ÷ 2 = 6",
    instruct: "InstructGPT는 한 질문에 답 4~9개씩 순위를 매겼어요",
    pairUnit: "쌍",
    c1: "도움이 되나?",
    c2: "사실인가?",
    c3: "해롭지 않나?",
    criteria: "순위의 기준",
    pref: "인간 선호 데이터",
    prefEn: "human preference data",
    tooMany: "모든 답을 사람이 채점할 순 없어요",
    judge: "채점하는 AI?",
    next: "75장",
  },
};
