import type { ChapterSpec, Highlighter } from "./types";

/** A toy corpus: each word with how many times it appeared. Pieces start as single syllables. */
export type Corpus = { w: string; n: number }[];
export type Pair = { a: string; b: string; n: number };

// merges checked with a Python script: 했다 9 → 공부 7 → 운동 6 → 한다 5, pieces 56 → 47 → 40 → 34 → 29
export const DIARY: Corpus = [
  { w: "공부했다", n: 4 },
  { w: "운동했다", n: 4 },
  { w: "공부한다", n: 3 },
  { w: "운동한다", n: 2 },
  { w: "청소했다", n: 1 },
];
export const SCHOOL: Corpus = [
  { w: "학교에", n: 5 },
  { w: "학교가", n: 3 },
  { w: "학원에", n: 3 },
  { w: "학생이", n: 2 },
  { w: "친구가", n: 4 },
  { w: "친구랑", n: 3 },
  { w: "급식이", n: 2 },
  { w: "급식은", n: 1 },
  { w: "맛있다", n: 3 },
  { w: "재밌다", n: 2 },
];

export const split0 = (w: string) => [...w];

/** Count neighbouring pairs, most frequent first (ties keep first-seen order). */
export function countPairs(pieces: string[][], corpus: Corpus): Pair[] {
  const m = new Map<string, Pair>();
  pieces.forEach((ps, i) => {
    for (let k = 0; k + 1 < ps.length; k++) {
      const key = `${ps[k]}\u0000${ps[k + 1]}`;
      const p = m.get(key) ?? { a: ps[k], b: ps[k + 1], n: 0 };
      p.n += corpus[i].n;
      m.set(key, p);
    }
  });
  return [...m.values()].sort((x, y) => y.n - x.n);
}

export function applyMerge(ps: string[], a: string, b: string) {
  const out: string[] = [];
  for (let k = 0; k < ps.length; k++) {
    if (k + 1 < ps.length && ps[k] === a && ps[k + 1] === b) {
      out.push(a + b);
      k++;
    } else out.push(ps[k]);
  }
  return out;
}

export const totalPieces = (pieces: string[][], corpus: Corpus) => pieces.reduce((s, ps, i) => s + ps.length * corpus[i].n, 0);

/** Run BPE for `steps` merges; returns the pieces after each stage (stage 0 = single syllables). */
export function runBpe(corpus: Corpus, steps: number) {
  const stages = [corpus.map((c) => split0(c.w))];
  const merges: Pair[] = [];
  for (let s = 0; s < steps; s++) {
    const cur = stages[stages.length - 1];
    const top = countPairs(cur, corpus)[0];
    if (!top) break;
    merges.push(top);
    stages.push(cur.map((ps) => applyMerge(ps, top.a, top.b)));
  }
  return { stages, merges };
}

/** Cut new text with learned merges, applied in the order they were learned. */
export function encode(text: string, merges: { a: string; b: string }[]) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => merges.reduce((ps, m) => applyMerge(ps, m.a, m.b), split0(w)));
}

export const SCENE_BPE = runBpe(DIARY, 4);
export const MERGE_COLORS: Highlighter[] = ["yellow", "sky", "mint", "pink"];
export const NEW_WORDS = ["숙제했다", "청소한다"];

export const ch30: ChapterSpec = {
  id: 30,
  part: 3,
  title: "자주 붙는 조각 합치기",
  core: false,
  hook: "토큰 목록 20만 개, 누가 하나하나 정했을까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "토큰 목록은 사람이 정하지 않아요. 글을 잔뜩 모아서, 자주 붙어 나오는 조각끼리 합쳐 만들어요. 이 방법이 BPE예요." },
    { id: "s2", sec: 7.5, narration: "일기에서 모은 단어 다섯 개로 해 볼게요. 처음엔 글자 하나하나가 조각이에요. 나온 횟수까지 세면 조각은 56개." },
    { id: "s3", sec: 7.5, narration: "이제 옆에 붙은 두 조각을 짝지어 세요. '했'과 '다'가 붙은 짝이 9번으로 가장 많아요." },
    { id: "s4", sec: 7, narration: "가장 많은 짝을 한 조각으로 합쳐 목록에 올려요. 이제 '했다'가 새 토큰이에요. 조각은 47개로 줄었어요." },
    { id: "s5", sec: 8, narration: "다시 세고, 또 합쳐요. 공부, 운동, 한다. 네 번 합치니 조각이 56개에서 29개로 줄었어요." },
    { id: "s6", sec: 8, narration: "문법을 가르친 적이 없는데, '공부'와 '했다'가 따로 조각이 됐어요. 자주 나오는 덩어리를 셌을 뿐이에요." },
    { id: "s7", sec: 7.5, narration: "그래서 처음 보는 '숙제했다'도 아는 조각으로 자를 수 있어요. 숙, 제, 했다. '청소한다'는 청, 소, 한다." },
    { id: "s8", sec: 8, narration: "GPT-4o 토크나이저도 이렇게 합쳐 약 20만 조각을 만들었어요. 그래서 '학교에'를 '학교'와 '에'로 잘라요." },
  ],
  playgroundTitle: "합치기 공장",
  playgroundIntro: "가장 많이 나온 짝을 찾아 눌러 보세요. 짝이 하나로 합쳐지며 새 토큰이 돼요. 다 만든 뒤엔 아래 칸에 단어를 써서 잘라 보세요.",
  summary: [
    "BPE: 글 모음에서 가장 자주 붙어 나오는 짝을 하나로 합친다.",
    "세고 합치기를 목록이 원하는 크기가 될 때까지 반복한다.",
    "자주 나오는 덩어리가 조각이 되고, 처음 보는 말도 아는 조각으로 자른다.",
  ],
  unlocks: "BPE",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "BPE는 매번 어떤 짝을 합칠까요?",
      choices: ["뜻이 가장 중요한 짝", "글 모음에서 가장 자주 붙어 나온 짝", "가나다순으로 첫 번째 짝"],
      answer: 1,
      explain: "뜻은 몰라요. 그냥 세서 가장 많은 짝을 합쳐요.",
      review: "s3",
    },
    {
      q: "합치기를 반복하면 글 모음 전체의 조각 수는?",
      choices: ["늘어난다", "그대로다", "줄어든다"],
      answer: 2,
      explain: "두 조각이 하나가 되니까 줄어요. 예시에선 56개 → 29개.",
      review: "s5",
    },
    {
      q: "'했다'를 배운 토크나이저가 처음 보는 '숙제했다'를 만나면?",
      choices: ["숙 + 제 + 했다로 자른다", "읽지 못하고 멈춘다", "한 조각으로 둔다"],
      answer: 0,
      explain: "아는 조각 '했다'는 묶고, 나머지는 글자 조각으로 둬요. 못 읽는 말이 없어요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "30장 자주 붙는 조각 합치기",
    title: "BPE: 자주 붙는 짝 합치기",
    sub: "Byte Pair Encoding",
    often: "자주 붙어 나오면 → 한 조각으로",
    corpus: "일기에서 모은 단어 (설명용 예시)",
    pieces: "조각 수",
    pairs: "짝 세기",
    vocab: "새 토큰 목록",
    times: "번",
    most: "가장 많아요!",
    merge: "합치기",
    noGrammar: "문법을 몰라도",
    noGrammar2: "'공부' + '했다'!",
    justCount: "그냥 셌을 뿐이에요",
    newWord: "처음 보는 말",
    known: "아는 조각으로 자르기",
    knownList: "아는 조각:",
    real: "진짜 GPT-4o 토크나이저",
    realSrc: "o200k_base로 자른 결과",
    size: "이렇게 합쳐서 약 20만 조각",
    bytes: "* 진짜는 글자보다 작은 바이트에서 시작해요 (28장)",
    x: "×",
    arrow: "→",
  },
};
