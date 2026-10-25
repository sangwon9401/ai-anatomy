import type { ChapterSpec, Highlighter } from "./types";

export type P2 = [number, number];
export type WordMap = { key: string; name: string; c: Highlighter; words: { w: string; v: P2 }[]; presets: [string, string, string][] };

// illustrative 2-D word maps (설명용 예시). Every preset analogy lands nearest its target — checked with a script.
export const MAPS: WordMap[] = [
  {
    key: "people",
    name: "사람",
    c: "yellow",
    words: [
      { w: "남자", v: [2, 2] },
      { w: "여자", v: [2, 5] },
      { w: "왕", v: [7, 2.5] },
      { w: "여왕", v: [7.2, 5.3] },
      { w: "소년", v: [0.8, 1.2] },
      { w: "소녀", v: [0.9, 4.3] },
      { w: "왕자", v: [5.4, 1.6] },
      { w: "공주", v: [5.6, 4.7] },
      { w: "아빠", v: [3.5, 2.8] },
      { w: "엄마", v: [3.6, 5.9] },
    ],
    presets: [
      ["왕", "남자", "여자"],
      ["왕자", "소년", "소녀"],
      ["아빠", "남자", "여자"],
    ],
  },
  {
    key: "capital",
    name: "나라와 수도",
    c: "sky",
    words: [
      { w: "한국", v: [1.5, 6] },
      { w: "서울", v: [2.1, 2.6] },
      { w: "일본", v: [4.2, 6.4] },
      { w: "도쿄", v: [4.9, 3.1] },
      { w: "프랑스", v: [7.2, 6.1] },
      { w: "파리", v: [7.7, 2.6] },
    ],
    presets: [
      ["서울", "한국", "일본"],
      ["파리", "프랑스", "한국"],
      ["도쿄", "일본", "프랑스"],
    ],
  },
  {
    key: "tense",
    name: "지금과 과거",
    c: "mint",
    words: [
      { w: "가다", v: [1.4, 6] },
      { w: "갔다", v: [2.2, 2.7] },
      { w: "먹다", v: [4.4, 6.5] },
      { w: "먹었다", v: [5.1, 3.1] },
      { w: "보다", v: [7.3, 5.9] },
      { w: "봤다", v: [8.1, 2.4] },
    ],
    presets: [
      ["갔다", "가다", "먹다"],
      ["봤다", "보다", "가다"],
      ["먹었다", "먹다", "보다"],
    ],
  },
];

export const vecOf = (m: WordMap, w: string) => m.words.find((x) => x.w === w)!.v;
/** a − b + c, and the nearest word that is not one of the inputs (as Word2Vec demos do) */
export function analogy(m: WordMap, a: string, b: string, c: string) {
  const [va, vb, vc] = [vecOf(m, a), vecOf(m, b), vecOf(m, c)];
  const r: P2 = [va[0] - vb[0] + vc[0], va[1] - vb[1] + vc[1]];
  const ranked = m.words
    .filter((x) => x.w !== a && x.w !== b && x.w !== c)
    .map((x) => ({ w: x.w, d: Math.hypot(x.v[0] - r[0], x.v[1] - r[1]) }))
    .sort((p, q) => p.d - q.d);
  return { r, best: ranked[0] };
}

// s1–s2: guess a word from its neighbours
export const CONTEXT = ["어제", "카페에서", "따뜻한", "○○를", "마셨다."];
export const CANDIDATES = [
  { w: "커피", fits: true },
  { w: "녹차", fits: true },
  { w: "코코아", fits: true },
  { w: "자전거", fits: false },
];
// s3: a sliding window over a sentence (Word2Vec practice)
export const WINDOW = ["아침마다", "따뜻한", "커피를", "한", "잔", "마신다"];
// s4: before/after training on a small map
export const DRINKS: { w: string; from: P2; to: P2; c: Highlighter }[] = [
  { w: "커피", from: [6.8, 5.6], to: [2.3, 5.2], c: "orange" },
  { w: "녹차", from: [1.6, 1.8], to: [3.1, 5.9], c: "orange" },
  { w: "코코아", from: [4.6, 3.4], to: [2.2, 6.4], c: "orange" },
  { w: "자전거", from: [3.0, 6.2], to: [7.0, 1.8], c: "sky" },
  { w: "버스", from: [7.6, 2.4], to: [7.8, 2.8], c: "sky" },
];

export const ch34: ChapterSpec = {
  id: 34,
  part: 3,
  title: "주변 단어가 의미를 알려준다",
  core: false,
  hook: "아무도 뜻을 가르쳐 주지 않았는데, AI는 '커피'와 '녹차'가 비슷하다는 걸 어떻게 알까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "'어제 카페에서 따뜻한 ○○를 마셨다.' 빈칸에 뭐가 들어갈까요? 처음 보는 문장이어도 주변 단어만 보면 짐작이 가죠." },
    { id: "s2", sec: 8.5, narration: "커피, 녹차, 코코아처럼 같은 자리에 오는 단어는 뜻도 비슷해요. 단어의 뜻은 주변 단어가 알려 준다. 이걸 분포 가설이라고 해요." },
    { id: "s3", sec: 9, narration: "2013년에 나온 Word2Vec은 이 생각을 학습으로 바꿨어요. 단어 하나를 보고 주변 단어를 맞히는 연습을 엄청 많이 시켜요." },
    { id: "s4", sec: 7.5, narration: "연습을 마치면 주변이 비슷한 단어끼리 벡터가 가까워져요. 아무도 뜻을 알려 주지 않았는데 말이에요." },
    { id: "s5", sec: 8, narration: "놀랍게도 방향에도 뜻이 담겨요. 남자에서 여자로 가는 화살표와 왕에서 여왕으로 가는 화살표가 거의 같아요." },
    { id: "s6", sec: 9, narration: "그래서 왕 − 남자 + 여자를 계산하면 여왕 바로 옆에 도착해요. (7, 2.5) − (2, 2) + (2, 5) = (7, 5.5).", tts: "그래서 왕 빼기 남자 더하기 여자를 계산하면 여왕 바로 옆에 도착해요. 7, 2.5 빼기 2, 2 더하기 2, 5는 7, 5.5." },
    { id: "s7", sec: 8.5, narration: "서울 − 한국 + 일본 ≈ 도쿄도 돼요. 진짜 Word2Vec은 수백 차원이라 늘 이렇게 딱 맞진 않아요. 이 지도는 설명용 예시예요.", tts: "서울 빼기 한국 더하기 일본은 도쿄도 돼요. 진짜 Word2Vec은 수백 차원이라 늘 이렇게 딱 맞진 않아요. 이 지도는 설명용 예시예요." },
    { id: "s8", sec: 7.5, narration: "단어의 뜻은 주변 단어가 알려 준다. GPT의 임베딩도 다음 조각을 맞히면서 같은 식으로 뜻을 배워요." },
  ],
  playgroundTitle: "단어 계산기",
  playgroundIntro: "A − B + C를 골라 보세요. 화살표를 따라가 도착한 곳에서 가장 가까운 단어가 답이에요. 딱 맞는 계산을 찾아봐요.",
  summary: [
    "분포 가설: 같은 자리(주변 단어)에 오는 단어는 뜻도 비슷하다.",
    "Word2Vec(2013): 주변 단어 맞히기 연습으로 단어 벡터를 만든다.",
    "방향에도 뜻이 담긴다: 왕 − 남자 + 여자 ≈ 여왕.",
  ],
  unlocks: "분포 가설",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "'단어의 뜻은 주변 단어가 알려 준다'는 생각을 무엇이라고 할까요?",
      choices: ["확률 분포", "원-핫 인코딩", "분포 가설"],
      answer: 2,
      explain: "같은 자리에 오는 단어끼리 뜻이 비슷하다는 생각이에요. Word2Vec이 이걸 학습으로 바꿨어요.",
      review: "s2",
    },
    {
      q: "Word2Vec은 어떤 연습으로 단어 벡터를 만들까요?",
      choices: ["사전의 뜻풀이 외우기", "단어 하나를 보고 주변 단어 맞히기", "단어를 가나다순으로 정렬하기"],
      answer: 1,
      explain: "주변 단어를 맞히다 보면 주변이 비슷한 단어끼리 벡터가 가까워져요.",
      review: "s3",
    },
    {
      q: "이 장의 지도에서 왕(7, 2.5) − 남자(2, 2) + 여자(2, 5)는?",
      choices: ["(11, 9.5) → 아무것도 없음", "(3, 0.5) → 소년 근처", "(7, 5.5) → 여왕 근처"],
      answer: 2,
      explain: "가로 7 − 2 + 2 = 7, 세로 2.5 − 2 + 5 = 5.5. 여왕(7.2, 5.3) 바로 옆이에요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "34장 주변 단어가 의미를 알려준다",
    guess: "빈칸에 뭐가 들어갈까?",
    hint: "주변 단어가 힌트!",
    fits: "다 어울려요",
    nofit: "안 어울려요",
    hypo: "단어의 뜻은 주변 단어가 알려 준다",
    hypoName: "분포 가설",
    w2v: "Word2Vec (2013)",
    practice: "가운데 단어로 주변 단어 맞히기",
    guessIt: "맞혀 봐!",
    millions: "엄청 많은 문장으로 반복",
    before: "연습 전",
    after: "연습 후: 주변이 비슷하면 가까이",
    noOne: "뜻은 아무도 안 알려 줬어요",
    dir: "방향에도 뜻이 있어요",
    same: "같은 화살표!",
    calc: "왕 − 남자 + 여자",
    calcNum: "(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)",
    land: "≈ 여왕",
    capital: "서울 − 한국 + 일본 ≈ 도쿄",
    real: "진짜는 수백 차원, 늘 딱 맞진 않아요",
    example: "설명용 예시 지도",
    sum: "뜻 = 주변 단어",
    gpt: "GPT의 임베딩도 다음 조각 맞히기로 뜻을 배워요",
    minus: "− 남자",
    minusKor: "한국 → 일본",
    ok: "○",
    no: "✕",
    plus: "+ 여자",
  },
};
