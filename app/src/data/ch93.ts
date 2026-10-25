import type { ChapterSpec } from "./types";

// All numbers below come from bpe.ts run on the 속담 corpus (part11-corpus.ts); see the Part 11 report.

/** "꿩 먹고 알 먹는다" in the character tokenizer: [piece, id]; " " is the space token (id 1). */
export const IDS: [string, number][] = [
  ["꿩", 40],
  [" ", 1],
  ["먹", 132],
  ["고", 19],
  [" ", 1],
  ["알", 213],
  [" ", 1],
  ["먹", 132],
  ["는", 64],
  ["다", 67],
];

/** the start of the 337-token dictionary (after the line break and the space) */
export const VOCAB_HEAD = ["가", "각", "간", "갈", "값", "강", "같", "갚", "개", "건", "걸", "것", "겉", "게"];

/** most frequent neighbouring pairs inside words, before any merge */
export const PAIRS = [
  { a: "는", b: "다", n: 11 },
  { a: "간", b: "다", n: 6 },
  { a: "나", b: "무", n: 6 },
  { a: "있", b: "다", n: 6 },
];

/** three of the eleven lines where 는+다 appears */
export const DEMO_LINES = ["꿩 먹고 알 먹는다", "업은 아이 삼 년 찾는다", "낙숫물이 댓돌을 뚫는다"];

/** total tokens after 0…30 merges (most frequent pair each time) */
export const TOKENS_BY_MERGE = [
  1644, 1633, 1627, 1621, 1615, 1610, 1605, 1600, 1596, 1592, 1588, 1584, 1580, 1576, 1572, 1568, 1565, 1562, 1559, 1556, 1553, 1550, 1547, 1544, 1541, 1538, 1535, 1532,
  1530, 1528, 1526,
];

/** the first 30 merged tokens, in order */
export const MERGED30 = [
  "는다", "간다", "나무", "있다", "가는", "말이", "우물", "랑이", "른다", "먹기", "보고", "으로", "진다", "모른다", "호랑이",
  "난다", "넘어", "물이", "부터", "사람", "수록", "어야", "없다", "에서", "으면", "하늘", "어진다", "가라", "개구", "고양",
];

/** "가는 말이 고와야 오는 말이 곱다" after 30 merges */
export const AFTER30 = ["가는", " ", "말이", " ", "고", "와", "야", " ", "오", "는", " ", "말이", " ", "곱", "다"];

export const TRADE = [
  { merges: "0번", tokens: "1,644개", vocab: "337가지" },
  { merges: "30번", tokens: "1,526개", vocab: "367가지" },
  { merges: "60번", tokens: "1,466개", vocab: "397가지" },
];

export const ch93: ChapterSpec = {
  id: 93,
  part: 11,
  title: "내 토크나이저 만들기",
  core: false,
  hook: "내 데이터에 꼭 맞는 토큰은 어떻게 정할까요?",
  steps: [
    { id: "s1", sec: 10.5, narration: "모델은 글을 바로 못 읽고 토큰 번호만 읽어요(29장). 가장 쉬운 방법은 글자 하나를 토큰 하나로 삼는 거예요." },
    { id: "s2", sec: 10, narration: "속담 데이터를 글자로 자르면 토큰이 1,644개, 토큰 종류는 337가지예요. 띄어쓰기와 줄바꿈도 토큰이에요." },
    { id: "s3", sec: 10.5, narration: "BPE는 낱말 안에서 붙어 나오는 두 조각을 세요(30장). 속담에서 가장 잦은 쌍은 '는'과 '다', 11번이에요." },
    { id: "s4", sec: 10.5, narration: "가장 잦은 쌍을 토큰 하나로 합쳐요. 토큰 종류는 338가지로 하나 늘고, 전체 토큰은 1,633개로 11개 줄어요." },
    { id: "s5", sec: 9.5, narration: "이걸 되풀이해요. 30번 합치면 토큰이 1,526개가 돼요. 같은 글을 더 적은 토큰으로 담는 거예요." },
    { id: "s6", sec: 11, narration: "많이 합칠수록 좋을까요? 토큰 수는 줄지만 종류가 늘어서, 모델이 익힐 임베딩도 늘어요. GPT-3는 약 5만 가지예요." },
    { id: "s7", sec: 10.5, narration: "직접 해보기에서 만든 토크나이저를 94장 미니 GPT가 그대로 써요. 한 번도 안 합치면 글자 하나가 토큰 하나예요." },
  ],
  playgroundTitle: "BPE 병합 버튼",
  playgroundIntro: "노란 쌍이 지금 가장 잦은 쌍이에요. 눌러서 합쳐 보세요. 합칠 때마다 토큰 수와 토큰 종류가 어떻게 변하는지 보세요.",
  summary: [
    "처음엔 글자 하나 = 토큰 하나. 속담은 토큰 1,644개, 337가지.",
    "BPE: 가장 잦은 쌍을 합치면 종류는 하나 늘고, 토큰 수는 준다.",
    "내가 만든 토크나이저를 94장 모델이 쓴다. 안 합치면 글자 단위.",
  ],
  unlocks: "내 토크나이저",
  unlockLabel: "졸업 프로젝트 한 단계를 마쳤어요",
  quiz: [
    {
      q: "BPE는 어떤 쌍부터 합칠까요?",
      choices: ["가장 드물게 나오는 쌍", "가장 자주 붙어 나오는 쌍", "아무 쌍이나"],
      answer: 1,
      explain: "자주 붙어 나오는 쌍을 하나로 묶을수록 토큰 수가 가장 많이 줄어요(30장).",
      review: "s3",
    },
    {
      q: "병합을 한 번 하면 어떻게 될까요?",
      choices: ["토큰 종류는 하나 늘고, 전체 토큰 수는 준다", "토큰 종류도, 토큰 수도 준다", "둘 다 그대로다"],
      answer: 0,
      explain: "'는다'라는 새 토큰이 사전에 하나 더 생기고, '는'+'다' 두 개가 하나로 줄어요.",
      review: "s4",
    },
    {
      q: "병합을 한 번도 안 하고 94장으로 가면 모델은?",
      choices: ["훈련을 할 수 없다", "GPT-3의 토크나이저를 빌려 쓴다", "글자 하나를 토큰 하나로 쓴다"],
      answer: 2,
      explain: "병합이 없으면 글자 단위 토크나이저가 돼요. 그래도 훈련은 잘 돼요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "93장 내 토크나이저 만들기",
    reads: "모델이 읽는 번호",
    oneToOne: "글자 하나 = 토큰 하나",
    space: "띄어쓰기도 토큰",
    tokens: "토큰",
    tokensN: "1,644개",
    vocab: "토큰 종류",
    vocabN: "337가지",
    dict: "토큰 사전",
    more: "… 337가지",
    newline: "띄어쓰기와 줄바꿈도 토큰이에요",
    count: "낱말 안에서 붙어 나오는 쌍 세기",
    times: "번",
    top: "1등!",
    merge: "합치기",
    after: "병합 1번 뒤",
    t1: "토큰 1,644 → 1,633개",
    v1: "종류 337 → 338가지",
    again: "30번 되풀이하면",
    t30: "토큰 1,526개",
    v30: "종류 367가지",
    merged: "새로 생긴 토큰",
    example: "가는 말이 고와야 오는 말이 곱다",
    mergesCol: "병합",
    tokensCol: "토큰 수",
    vocabCol: "토큰 종류",
    fewer: "줄어요",
    moreV: "늘어요",
    emb: "종류마다 임베딩 한 줄씩 (33장)",
    gpt3: "GPT-3: 50,257가지",
    mine: "내 토크나이저",
    mineSub: "93장 직접 해보기",
    model: "94장 미니 GPT",
    zero: "병합 0번이면 글자 하나 = 토큰 하나",
  },
};
