import type { ChapterSpec, Highlighter } from "./types";

export type P2 = [number, number];

// an illustrative 2-D embedding map (설명용 예시): six themed groups of five words, plus '배' between 과일, 탈것 and 몸.
// Neighbours, odd-one-out answers and label overlaps on the scene canvas were checked with a script.
export const UNIVERSE: { w: string; v: P2; g: number }[] = [
  { w: "강아지", v: [1.4, 9.1], g: 0 },
  { w: "고양이", v: [0.55, 8.55], g: 0 },
  { w: "토끼", v: [2.1, 8.45], g: 0 },
  { w: "햄스터", v: [1.25, 7.9], g: 0 },
  { w: "호랑이", v: [1.95, 7.4], g: 0 },
  { w: "사과", v: [8.5, 8.6], g: 1 },
  { w: "포도", v: [7.65, 8.05], g: 1 },
  { w: "딸기", v: [9.2, 7.95], g: 1 },
  { w: "바나나", v: [8.35, 7.4], g: 1 },
  { w: "귤", v: [9.05, 6.9], g: 1 },
  { w: "버스", v: [8.3, 2.7], g: 2 },
  { w: "지하철", v: [7.45, 2.15], g: 2 },
  { w: "자전거", v: [9, 2.05], g: 2 },
  { w: "비행기", v: [8.15, 1.5], g: 2 },
  { w: "기차", v: [8.85, 1], g: 2 },
  { w: "머리", v: [4.3, 2.5], g: 3 },
  { w: "다리", v: [3.45, 1.95], g: 3 },
  { w: "팔", v: [5, 1.85], g: 3 },
  { w: "손", v: [4.15, 1.3], g: 3 },
  { w: "어깨", v: [4.85, 0.8], g: 3 },
  { w: "학교", v: [1.4, 5.5], g: 4 },
  { w: "선생님", v: [0.55, 4.95], g: 4 },
  { w: "숙제", v: [2.1, 4.85], g: 4 },
  { w: "교실", v: [1.25, 4.3], g: 4 },
  { w: "시험", v: [1.95, 3.8], g: 4 },
  { w: "구름", v: [5, 9.6], g: 5 },
  { w: "바람", v: [4.15, 9.05], g: 5 },
  { w: "태풍", v: [5.7, 8.95], g: 5 },
  { w: "장마", v: [4.85, 8.4], g: 5 },
  { w: "햇빛", v: [5.55, 7.9], g: 5 },
  { w: "배", v: [6.6, 4.8], g: -1 },
];
export const UNI_GROUPS: { name: string; c: Highlighter }[] = [
  { name: "동물", c: "yellow" },
  { name: "과일", c: "pink" },
  { name: "탈것", c: "sky" },
  { name: "몸", c: "orange" },
  { name: "학교", c: "mint" },
  { name: "날씨", c: "violet" },
];

export const dist2 = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const wordAt = (w: string) => UNIVERSE.find((x) => x.w === w)!;
export function nearest(w: string, k = 5) {
  const me = wordAt(w);
  return UNIVERSE.filter((x) => x.w !== w)
    .map((x) => ({ ...x, d: dist2(me.v, x.v) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
}
/** the word whose average distance to the other three is largest */
export function oddOne(words: string[]) {
  const avg = words.map((w) => words.filter((x) => x !== w).reduce((s, x) => s + dist2(wordAt(w).v, wordAt(x).v), 0) / (words.length - 1));
  return words[avg.indexOf(Math.max(...avg))];
}
export const ODD_ROUNDS = [
  ["사과", "포도", "딸기", "버스"],
  ["강아지", "고양이", "비행기", "토끼"],
  ["선생님", "숙제", "교실", "바나나"],
  ["구름", "바람", "태풍", "팔"],
  ["머리", "다리", "기차", "손"],
];
// s6: two sentences that pull '배' toward one meaning (45장)
export const BAE_SENTENCES = [
  { text: "배가 고파서 밥을 먹었다", g: 3 },
  { text: "배를 타고 섬에 갔다", g: 2 },
];

export const ch35: ChapterSpec = {
  id: 35,
  part: 3,
  title: "임베딩 우주 탐험",
  core: false,
  hook: "단어 지도에서 '강아지' 옆엔 누가 살고, '배'는 어디쯤 있을까요?",
  steps: [
    { id: "s1", sec: 7.5, narration: "지금까지 만든 임베딩 우주를 탐험해 봐요. 단어 31개를 2D 지도에 펼쳐 놨어요. 자리는 설명용 예시예요." },
    { id: "s2", sec: 7, narration: "'강아지'를 검색하면 가까운 단어부터 불이 켜져요. 토끼, 고양이, 햄스터… 모두 동물이에요." },
    { id: "s3", sec: 8.5, narration: "가까운 순서는 거리로 매겼어요(8장). 실제 AI 검색은 방향이 얼마나 같은지, 그러니까 내적(9장)을 많이 써요." },
    { id: "s4", sec: 7, narration: "이상한 하나 찾기도 할 수 있어요. 사과, 포도, 딸기, 버스. 버스만 혼자 멀리 떨어져 있죠." },
    { id: "s5", sec: 8, narration: "그런데 '배'는 어디 있을까요? 과일 무리와 탈것 무리, 몸 무리 사이에 끼어 있어요. 뜻이 여러 개라서요." },
    { id: "s6", sec: 8.5, narration: "단어 하나에 자리가 하나뿐이라, 어떤 배인지는 문장을 봐야 알아요. 이 문제는 45장 어텐션이 풀어요." },
    { id: "s7", sec: 8.5, narration: "진짜 임베딩은 GPT-3 기준 12,288차원이에요. 이 지도는 그걸 2D로 눌러 그린 그림자라 조금씩 틀어져 있어요." },
    { id: "s8", sec: 7, narration: "임베딩 우주에선 가까우면 닮았고, 방향은 관계를 나타내요. 이제 단어가 뜻이 담긴 숫자가 됐어요." },
  ],
  playgroundTitle: "임베딩 우주 탐험",
  playgroundIntro: "단어를 눌러 보세요. 가까운 이웃이 순서대로 켜져요. 아래 '이상한 하나 찾기'도 도전해 봐요.",
  summary: [
    "임베딩 공간에선 가까운 단어가 뜻도 비슷하다. 검색 = 가까운 점 찾기.",
    "'배'처럼 뜻이 여러 개인 단어는 무리들 사이에 끼어 있다.",
    "어떤 뜻인지는 문장을 봐야 안다. 그 일을 어텐션(45장)이 한다.",
  ],
  unlocks: "의미 검색",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "임베딩 지도에서 '강아지'와 가장 가까울 단어는?",
      choices: ["버스", "고양이", "구름"],
      answer: 1,
      explain: "비슷한 주변 단어와 함께 쓰이는 동물끼리 가까이 모여 있어요.",
      review: "s2",
    },
    {
      q: "'배'가 과일·탈것·몸 무리 사이에 놓인 이유는?",
      choices: ["철자가 짧아서", "뜻이 여러 개라 여러 무리의 주변 단어와 함께 쓰여서", "가장 자주 쓰는 단어라서"],
      answer: 1,
      explain: "먹는 배, 타는 배, 몸의 배. 주변 단어가 섞여 있어서 좌표도 중간쯤에 놓여요.",
      review: "s5",
    },
    {
      q: "문장마다 '배'의 뜻을 골라 주는 건 몇 장에서 배울까요?",
      choices: ["29장 토크나이저", "32장 원-핫", "45장 어텐션"],
      answer: 2,
      explain: "어텐션이 주변 단어를 쳐다보고 '배'의 벡터를 문장에 맞게 고쳐요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "35장 임베딩 우주 탐험",
    title: "임베딩 우주 (설명용 예시)",
    search: "검색:",
    dog: "강아지",
    ranks: "가까운 순서",
    distNote: "거리(8장)로 순서 매기기",
    cosine1: "실제 검색은 방향 비교",
    cosine2: "(내적, 9장)를 많이 써요",
    odd: "이상한 하나 찾기",
    oddAns: "버스만 멀리!",
    bae: "배",
    baeQ: "'배'는 어디에?",
    fruit: "먹는 배",
    boat: "타는 배",
    belly: "몸의 배",
    many: "뜻이 여러 개라 사이에",
    one: "단어 하나 = 자리 하나",
    attn: "어떤 배인지는 문장이 알려 줘요 → 45장 어텐션",
    dims: "진짜: 12,288차원 (GPT-3)",
    shadow: "지도 = 2D로 눌러 그린 그림자",
    twist: "그래서 조금씩 틀어져 있어요",
    sum1: "가까우면 닮았다",
    sum2: "방향은 관계",
    sum3: "단어 → 뜻이 담긴 숫자 완성",
  },
};
