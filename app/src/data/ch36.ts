import type { ChapterSpec, Highlighter } from "./types";

export type V4 = [number, number, number, number];

// s1: Korean particles carry the roles, so these two mean the same; the third swaps the particles
export const PARTICLE_ROWS: { parts: [string, string][]; same: boolean }[] = [
  { parts: [["개", "가"], ["사람", "을"], ["물었다", ""]], same: true },
  { parts: [["사람", "을"], ["개", "가"], ["물었다", ""]], same: true },
  { parts: [["사람", "이"], ["개", "를"], ["물었다", ""]], same: false },
];

// s2: same tokens, different order (real GPT-4o tokens, o200k_base: '10' '시' ' ' '11' '분')
export const TIME_A = ["10", "시", " ", "11", "분"];
export const TIME_B = ["11", "시", " ", "10", "분"];

// illustrative token vectors (설명용 예시, 4 numbers each)
export const TOK_VEC: Record<string, V4> = {
  "10": [0.5, -0.3, 0.8, 0.1],
  시: [-0.6, 0.4, 0.2, -0.5],
  " ": [0.0, 0.1, -0.1, 0.0],
  "11": [0.6, -0.2, 0.7, 0.3],
  분: [-0.4, 0.6, -0.3, -0.6],
};

/**
 * A 4-number position pattern in the style of the 2017 Transformer: a fast "hand" turning 1 radian per position
 * and a slow one turning 1/4 radian, each written as (sin, cos). The real paper uses many more speeds.
 */
export const SPEEDS = [1, 1 / 4];
export const pe = (p: number): V4 => [Math.sin(p * SPEEDS[0]), Math.cos(p * SPEEDS[0]), Math.sin(p * SPEEDS[1]), Math.cos(p * SPEEDS[1])];
export const add4 = (a: V4, b: V4): V4 => [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const fmt = (x: number) => {
  const v = r2(x);
  return v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2);
};
export const WAVE_NAMES = ["빠른 sin", "빠른 cos", "느린 sin", "느린 cos"];
export const WAVE_COLORS: Highlighter[] = ["orange", "orange", "sky", "sky"];

// s8: what Part 3 gave us
export const PART3_TOOLS = ["유니코드", "토큰", "BPE", "토큰 효율", "원-핫", "임베딩", "분포 가설", "의미 검색", "위치 정보"];

export const ch36: ChapterSpec = {
  id: 36,
  part: 3,
  title: "순서는 어떻게 알까",
  core: true,
  hook: "'10시 11분'과 '11시 10분'은 조각이 똑같은데, AI는 둘이 다르다는 걸 어떻게 알까요?",
  steps: [
    { id: "s1", sec: 9, narration: "'개가 사람을 물었다'와 '사람을 개가 물었다'. 순서는 달라도 뜻은 같아요. 조사 '가'와 '을'이 누가 했는지 알려 주거든요." },
    { id: "s2", sec: 8, narration: "그런데 '10시 11분'과 '11시 10분'은 조각이 똑같은데 순서만 바뀌어서 뜻이 달라요. 순서도 정보예요." },
    { id: "s3", sec: 8, narration: "어텐션(45장)은 모든 조각을 한꺼번에 보고 섞어요. 위치 정보가 없으면 두 문장이 같은 조각 주머니처럼 보여요." },
    { id: "s4", sec: 9, narration: "그래서 조각 벡터에 몇 번째인지 알려 주는 숫자를 더해요. 그런데 1, 2, 3을 그대로 더하면 2,000번째 조각은 뜻이 묻혀요." },
    { id: "s5", sec: 8.5, narration: "원래 트랜스포머(2017)는 사인파를 썼어요. 빠르기가 다른 물결에서 그 자리의 높이를 읽어요. 값은 늘 −1과 1 사이예요.", tts: "원래 트랜스포머는 사인파를 썼어요. 빠르기가 다른 물결에서 그 자리의 높이를 읽어요. 값은 늘 마이너스 1과 1 사이예요." },
    { id: "s6", sec: 8.5, narration: "시계의 빠른 바늘과 느린 바늘을 함께 보면 시각을 알 수 있죠. 물결도 그래요. 자리마다 무늬가 모두 달라요." },
    { id: "s7", sec: 9, narration: "이 무늬를 조각 벡터에 더해요. 그러면 같은 '10'이라도 0번 자리와 3번 자리의 벡터가 달라져서 순서가 담겨요." },
    { id: "s8", sec: 8.5, narration: "글자, 토큰, 번호, 임베딩, 위치 정보. 이제 글이 모델이 계산할 수 있는 숫자가 됐어요. Part 3 끝, 다음은 Part 4예요." },
  ],
  playgroundTitle: "위치 무늬 실험실",
  playgroundIntro: "두 문장을 바꿔 가며 '위치 정보 더하기'를 켜고 꺼 보세요. 위치 정보가 없으면 모델 눈에 두 문장이 같은 조각 묶음이에요.",
  summary: [
    "같은 조각도 순서가 바뀌면 뜻이 바뀐다(10시 11분 ≠ 11시 10분). 한국어는 조사도 역할을 알려 준다.",
    "위치 정보: 조각 벡터에 '몇 번째인지'를 나타내는 무늬를 더한다.",
    "무늬는 빠르기가 다른 사인파로 만든다(2017). 값은 −1~1, 자리마다 다르다.",
  ],
  unlocks: "위치 정보",
  quiz: [
    {
      q: "'개가 사람을 물었다'와 '사람을 개가 물었다'의 뜻이 같은 이유는?",
      choices: ["AI가 순서를 무시해서", "조사 '가', '을'이 누가 했는지 알려 줘서", "두 문장의 글자 수가 같아서"],
      answer: 1,
      explain: "한국어는 조사가 역할을 표시해서 순서를 바꿔도 뜻이 같을 때가 많아요. '사람이 개를'처럼 조사가 바뀌면 뜻이 바뀌어요.",
      review: "s1",
    },
    {
      q: "위치마다 1, 2, 3, …을 그대로 더하면 생기는 문제는?",
      choices: ["계산이 너무 느려진다", "뒤쪽 조각은 숫자가 너무 커져 원래 뜻이 묻힌다", "첫 조각이 사라진다"],
      answer: 1,
      explain: "2,000번째 조각에 2,000을 더하면 0.5 같은 뜻 숫자는 티도 안 나요. 사인파는 늘 −1~1 사이라 괜찮아요.",
      review: "s4",
    },
    {
      q: "위치 정보를 더하면 '10시 11분'과 '11시 10분'에 쓰인 '10'의 벡터는?",
      choices: ["똑같다", "둘 다 0이 된다", "자리가 달라서 서로 달라진다"],
      answer: 2,
      explain: "0번 자리와 3번 자리의 무늬가 달라서, 더한 결과도 달라져요. 그래서 모델이 순서를 알 수 있어요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "36장 순서는 어떻게 알까",
    sameMeaning: "같은 뜻",
    particle: "조사가 역할을 알려 줘요",
    diff: "조사가 바뀌면 다른 뜻",
    eq: "=",
    neq: "≠",
    orderMatters: "같은 조각, 다른 순서 → 다른 뜻",
    src: "GPT-4o 토크나이저 (o200k_base)",
    attn: "어텐션은 한꺼번에 봐요 (45장)",
    bag: "위치 정보가 없으면 같은 주머니?!",
    addPos: "조각 벡터 + 위치 = 입력",
    tokVec: "'10'의 벡터 (설명용 예시)",
    plain: "1, 2, 3…을 그냥 더하면?",
    pos1: "1번째: +1",
    pos2000: "2,000번째: +2000",
    buried: "뜻이 묻혀요!",
    waves: "사인파 무늬 (2017 트랜스포머)",
    readAt: "3번 자리 값",
    range: "값은 늘 −1 ~ 1",
    speedsNote: "설명용 예시: 빠르기 2가지만 (진짜 트랜스포머는 훨씬 많아요)",
    clockTitle: "자리마다 다른 무늬",
    fast: "빠른 바늘",
    slow: "느린 바늘",
    clock: "시계처럼: 바늘 두 개로 시각을 알아요",
    posNo: "자리",
    addTitle: "같은 '10', 다른 자리",
    at0: "10시 11분: 0번 자리",
    at3: "11시 10분: 3번 자리",
    differ: "자리가 다르면 벡터도 달라요!",
    learned: "* GPT-2·3은 이 무늬도 학습으로 정해요",
    from0: "자리 번호는 0부터 세요",
    done: "Part 3 완성: 글이 숫자가 됐어요!",
    bp: "설계도 앞부분 완성",
    next: "다음: Part 4 트랜스포머 이전 이야기",
    space: "␣",
    ten: "'10'",
    ops: "+=→",
  },
};
