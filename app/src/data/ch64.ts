import type { ChapterSpec } from "./types";

/** The running example split into word-sized pieces (real tokenizers cut finer, 29장). */
export const SENT = ["나는", "오늘", "학교에", "간다", "."];

export const PRESETS64 = [
  "나는 오늘 학교에 간다.",
  "가는 말이 고와야 오는 말이 곱다.",
  "1, 2, 3, 4, 5",
  "산 넘어 산이다.",
];

export const MAX_PIECES = 12;

/** Split on spaces and peel trailing punctuation into its own piece: "간다." → "간다", ".". */
export function pieces(text: string): string[] {
  const out: string[] = [];
  for (const w of text.trim().split(/\s+/).filter(Boolean)) {
    const m = w.match(/^(.*?)([.,!?]+)$/);
    if (m && m[1]) out.push(m[1], m[2]);
    else out.push(w);
  }
  return out;
}

/** Every prefix becomes a question whose answer is the next piece. */
export const questions = (ps: string[]) => ps.slice(1).map((answer, i) => ({ context: ps.slice(0, i + 1), answer }));

export const ch64: ChapterSpec = {
  id: 64,
  part: 7,
  title: "정답지 없는 공부",
  core: true,
  hook: "인터넷 글에는 정답지가 없는데, GPT는 뭘 보고 채점했을까요?",
  steps: [
    { id: "s1", sec: 11, narration: "4장의 스팸 필터는 사람이 '스팸', '정상' 정답을 달아 줘야 했어요. 그런데 인터넷 글 전부에 정답을 달 수는 없어요." },
    { id: "s2", sec: 9, narration: "비밀은 글 자체가 정답지라는 거예요. 문장 하나를 가져와 볼게요. '나는 오늘 학교에 간다.'" },
    { id: "s3", sec: 10, narration: "앞부분만 보여 주고 다음 조각을 가리면 문제가 돼요. '나는' 다음은? 정답은 바로 뒤에 있던 '오늘'이에요." },
    { id: "s4", sec: 10, narration: "한 칸씩 늘리면 또 문제가 생겨요. '나는 오늘' 다음은 '학교에', '나는 오늘 학교에' 다음은 '간다'." },
    { id: "s5", sec: 10, narration: "조각 5개짜리 문장에서 문제가 4개 나왔어요. 정답은 사람이 아니라 글이 알려 줘요. 이게 자기지도학습이에요." },
    { id: "s6", sec: 9, narration: "모델은 이 4문제를 한꺼번에 풀어요. 51장의 가림막 덕분에 자리마다 자기 앞만 볼 수 있거든요." },
    { id: "s7", sec: 11, narration: "GPT-3가 본 약 3,000억 토큰이 전부 이런 문제예요. 정답지 한 장 없이 문제가 약 3,000억 개 생긴 거죠." },
  ],
  playgroundTitle: "문제 만들기 공장",
  playgroundIntro: "문장을 고르거나 직접 써 보세요. 문장 하나가 '다음 조각 맞히기' 문제 여러 개로 바뀌어요. 정답을 보기 전에 먼저 맞혀 보세요.",
  summary: [
    "문장의 앞부분만 보여 주고 다음 조각을 맞히게 하면 문제가 된다.",
    "정답은 글 속 바로 다음 조각. 사람이 정답을 달 필요가 없다 = 자기지도학습.",
    "조각 N개짜리 문장 하나 → 문제 N − 1개. 인터넷 전체가 문제집이 된다.",
  ],
  unlocks: "자기지도학습",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "'고양이가 / 생선을 / 먹었다 / .' 처럼 조각 4개인 문장에서 나오는 문제는 몇 개?",
      choices: ["2개", "3개", "4개"],
      answer: 1,
      explain: "첫 조각은 앞에 아무것도 없어서 문제가 안 돼요. 그다음 조각 3개가 각각 정답이 돼요.",
      review: "s5",
    },
    {
      q: "자기지도학습에서 정답은 어디서 올까요?",
      choices: ["선생님이 하나씩 달아 준다", "모델이 마음대로 정한다", "글 속에 이미 있는 다음 조각"],
      answer: 2,
      explain: "앞부분을 보여 주고 가린 다음 조각이 곧 정답이에요. 글 자체가 정답지예요.",
      review: "s3",
    },
    {
      q: "'나는 오늘'을 보여 준 문제의 정답은?",
      choices: ["학교에", "나는", "간다"],
      answer: 0,
      explain: "'나는 오늘 학교에 간다.'에서 '나는 오늘' 바로 다음 조각은 '학교에'예요.",
      review: "s4",
    },
  ],
  labels: {
    tag: "64장 정답지 없는 공부",
    spamMsg: "[광고] 무료 쿠폰 받기",
    spam: "스팸",
    byPerson: "사람이 단 정답 (4장)",
    allWeb: "인터넷 글 전부?",
    impossible: "하나하나 달 수 없어요",
    finer: "실제 토큰은 더 잘게 잘려요 (29장)",
    textIs: "글 = 문제 + 정답",
    q: "문제",
    answerFrom: "정답은 글 속에!",
    count: "조각 5개 → 문제 4개",
    ssl: "자기지도학습",
    sslEn: "self-supervised learning",
    together: "4문제를 한꺼번에",
    mask: "51장 가림막: 자기 앞만 보기",
    gpt3: "GPT-3가 본 글",
    tokens: "약 3,000억 토큰",
    equals: "= 문제 약 3,000억 개",
    noKey: "정답지 한 장 없이!",
    next: "65장: 얼마나 틀렸는지 재기",
  },
};
