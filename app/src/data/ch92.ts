import type { ChapterSpec } from "./types";

/** GPT-3 (canonical facts) next to the Part 11 mini GPT with the 속담 data (computed from minigpt.ts / bpe.ts). */
export const COMPARE = [
  { k: "layers", gpt3: "96", mini: "1" },
  { k: "width", gpt3: "12,288", mini: "32" },
  { k: "heads", gpt3: "96", mini: "1" },
  { k: "context", gpt3: "2,048", mini: "24" },
  { k: "vocab", gpt3: "50,257", mini: "337" },
];

export const PROJECT = [
  { n: "①", name: "데이터 고르기", ch: "92장" },
  { n: "②", name: "토크나이저 만들기", ch: "93장" },
  { n: "③", name: "훈련하기", ch: "94장" },
  { n: "④", name: "글 써 보기", ch: "95장" },
];

/** Real outputs of the offline checkpoints (temperature 0.8 / 1.0), none of them a line of the data. */
export const STYLES = [
  { name: "속담", seen: "발 없는 말이 천 리 간다", wrote: "가는 말이 천 리 간다", color: "yellow" as const },
  { name: "동요", seen: "구름아 구름아 둥실둥실 떠가라", wrote: "구름아 구름아 뒤에 숨었어요", color: "sky" as const },
  { name: "교과서 문장", seen: "일기에는 그날 있었던 일과 생각을 쓴다.", wrote: "일기에는 그날 있었던 일과 생각을 나눈다.", color: "mint" as const },
];

/** Real next-token probabilities of the 속담 checkpoint after "가는 " (temperature 1). */
export const NEXT = [
  { w: "말", p: 51.6 },
  { w: "정", p: 20.3 },
  { w: "토", p: 9.1 },
];

export const ch92: ChapterSpec = {
  id: 92,
  part: 11,
  title: "미니 GPT 설계하기",
  core: false,
  hook: "ChatGPT를 아주 작게 줄이면, 내 손으로 직접 만들 수 있을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "드디어 졸업 프로젝트예요. 지금까지 배운 부품으로 진짜 작은 GPT를 만들어, 내 폰에서 직접 훈련시킬 거예요." },
    { id: "s2", sec: 9, narration: "순서는 네 단계예요. 데이터를 고르고, 토크나이저를 만들고, 훈련시키고, 마지막으로 글을 써 봐요." },
    { id: "s3", sec: 10.5, narration: "설계도는 GPT-3와 똑같아요(5장). 다만 블록은 96층 대신 1층, 토큰 벡터는 12,288칸 대신 32칸이에요." },
    { id: "s4", sec: 11, narration: "어텐션 헤드도 1개, 한 번에 읽는 글은 24토큰이에요. 토큰 종류는 337가지면 돼요. 속담에 쓰인 글자가 딱 그만큼이거든요." },
    { id: "s5", sec: 10.5, narration: "손잡이(파라미터)를 세면 GPT-3는 1,750억 개, 미니 GPT는 24,529개예요. 약 700만 분의 1이죠." },
    { id: "s6", sec: 10, narration: "그래도 하는 일은 같아요. 글을 읽고 다음 조각의 확률을 내요. 미리 훈련해 본 미니 GPT의 진짜 답이에요." },
    { id: "s7", sec: 10, narration: "속담을 읽히면 속담을, 동요를 읽히면 노랫말을, 교과서 문장을 읽히면 설명문을 써요. 모델은 읽은 글을 닮아요." },
    { id: "s8", sec: 11, narration: "데이터는 약 4KB, 토큰 1,600개쯤이에요. GPT-3가 읽은 3,000억 토큰에 비하면 티끌이지만 충분해요. 골라 볼까요?" },
  ],
  playgroundTitle: "데이터 고르기",
  playgroundIntro: "미니 GPT에게 읽힐 글을 골라 보세요. 여기서 고른 데이터로 93~95장에서 토크나이저를 만들고, 훈련시키고, 글을 써요.",
  summary: [
    "미니 GPT도 GPT-3와 같은 설계도. 층, 벡터, 헤드의 수만 작다.",
    "손잡이 24,529개. GPT-3의 약 700만 분의 1.",
    "모델은 읽은 글을 닮는다. 그래서 데이터 고르기가 첫 단계.",
  ],
  unlocks: "내 데이터셋",
  unlockLabel: "졸업 프로젝트 한 단계를 마쳤어요",
  quiz: [
    {
      q: "미니 GPT와 GPT-3의 설계도를 비교하면?",
      choices: ["부품 구성은 같고, 숫자 크기만 다르다", "완전히 다른 구조다", "미니 GPT에는 어텐션이 없다"],
      answer: 0,
      explain: "토크나이저부터 소프트맥스까지 부품은 같아요. 층 수, 벡터 칸 수, 헤드 수가 훨씬 작을 뿐이에요.",
      review: "s3",
    },
    {
      q: "미니 GPT의 손잡이(파라미터)는 몇 개쯤일까요?",
      choices: ["1,750억 개", "약 2만 5천 개", "96개"],
      answer: 1,
      explain: "속담 데이터 기준 24,529개예요. GPT-3(1,750억 개)의 약 700만 분의 1이에요.",
      review: "s5",
    },
    {
      q: "동요만 읽혀서 훈련한 모델은 어떤 글을 쓸까요?",
      choices: ["교과서 같은 설명문", "아무 글도 못 쓴다", "노랫말 같은 글"],
      answer: 2,
      explain: "모델은 읽은 글을 닮아요. 되풀이가 많은 동요를 읽으면 노랫말처럼 써요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "92장 미니 GPT 설계하기",
    title: "졸업 프로젝트",
    tok: "토크나이저",
    emb: "임베딩",
    pos: "위치 정보",
    att: "어텐션",
    ffn: "피드포워드",
    out: "출력 + 소프트맥스",
    loop: "뽑아서 붙이기",
    mine: "나만의 미니 GPT",
    real: "진짜로 훈련해요!",
    ch96: "⑤ 졸업식 96장",
    gpt3: "GPT-3",
    mini: "미니 GPT",
    layers: "블록 층 수",
    width: "토큰 벡터 칸 수",
    heads: "어텐션 헤드",
    context: "한 번에 읽는 토큰",
    vocab: "토큰 종류",
    same: "부품은 같고, 숫자만 작게",
    knobs: "손잡이(파라미터) 수",
    gpt3Knobs: "175,000,000,000",
    miniKnobs: "24,529",
    ratio: "약 700만 분의 1",
    prompt: "가는",
    next: "다음 조각의 확률",
    realOut: "미리 훈련한 미니 GPT의 실제 답",
    seen: "읽은 글",
    wrote: "모델이 쓴 글",
    alike: "읽은 글을 닮아요",
    noCopy: "세 문장 모두 데이터에 없는 새 문장",
    size: "약 4KB · 토큰 약 1,600개",
    gptData: "GPT-3: 3,000억 토큰",
    dust: "티끌 모아 태산?",
    pick: "직접 골라 보세요",
    lines120: "120줄",
    lines69: "69줄",
    lines82: "82줄",
    loss: "손실",
    vocabNote: "속담에 쓰인 글자 수",
  },
};
