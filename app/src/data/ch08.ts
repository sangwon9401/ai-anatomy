import type { ChapterSpec } from "./types";

// more classmates for the clustering beat: two taste groups
export const CLASS: { name: string; v: [number, number] }[] = [
  { name: "지우", v: [8.5, 2] },
  { name: "하준", v: [9, 4] },
  { name: "예린", v: [7.5, 1.5] },
  { name: "도윤", v: [6.5, 2.5] },
  { name: "수아", v: [3, 8] },
  { name: "시우", v: [1.5, 7.5] },
  { name: "유나", v: [2.5, 10] },
  { name: "현우", v: [3.5, 9] },
];

// an illustrative 2-D word map (real embeddings have thousands of dimensions)
export const WORDS: { w: string; v: [number, number] }[] = [
  { w: "사과", v: [1.6, 8.2] },
  { w: "배", v: [3.4, 8.8] },
  { w: "포도", v: [2.2, 9.9] },
  { w: "강아지", v: [8, 8.2] },
  { w: "고양이", v: [8.9, 7] },
  { w: "토끼", v: [7.3, 6.2] },
  { w: "버스", v: [6.4, 2.4] },
  { w: "지하철", v: [8.2, 1.4] },
  { w: "자전거", v: [5.6, 0.6] },
];

export const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const ch08: ChapterSpec = {
  id: 8,
  part: 1,
  title: "가까우면 닮았다",
  core: false,
  hook: "취향이 비슷한 친구를 숫자로 찾을 수 있을까요?",
  steps: [
    { id: "s1", sec: 6, narration: "지난 장의 화살표에서 끝점만 남겨 볼게요. 점 하나가 친구 한 명의 취향이에요." },
    { id: "s2", sec: 8, narration: "두 점이 가까우면 취향이 비슷하다는 뜻이에요. 거리는 중학교 때 배운 피타고라스 정리로 잴 수 있어요." },
    { id: "s3", sec: 9, narration: "민지와 서연은 가로로 1, 세로로 1 차이. 거리는 루트 2, 약 1.4예요. 민지와 준호는 약 8.5. 서연이 훨씬 가깝죠." },
    { id: "s4", sec: 7, narration: "친구가 많아지면 점들이 무리를 지어요. 매운맛파와 단맛파. 가까운 점끼리 모이는 거예요." },
    { id: "s5", sec: 7, narration: "AI도 이 원리로 비슷한 걸 찾아요. 노래 추천도, 비슷한 사진 찾기도 결국 가까운 점 찾기예요." },
    { id: "s6", sec: 8, narration: "단어도 점으로 찍을 수 있어요. 뜻이 비슷한 단어끼리 가까이 모여요. 과일은 과일끼리, 동물은 동물끼리. 33장에서 자세히 봐요." },
    { id: "s7", sec: 6, narration: "가까우면 닮았다. 다음 장에선 거리 대신 방향으로 닮음을 재는 내적을 배워요." },
  ],
  playgroundTitle: "나와 가장 닮은 친구",
  playgroundIntro: "평면을 눌러 내 취향 점을 찍어 보세요. 친구들까지의 거리를 재서 가까운 순서로 보여 줘요.",
  summary: [
    "벡터의 끝점끼리 가까우면 닮았다.",
    "거리는 피타고라스 정리: √(가로 차이² + 세로 차이²).",
    "비슷한 것끼리 모인다. 추천도, 단어의 뜻도 '가까운 점 찾기'.",
  ],
  unlocks: "거리",
  unlockLabel: "수학 도구를 하나 얻었어요",
  quiz: [
    {
      q: "(8, 3)과 (7, 4) 사이의 거리는?",
      choices: ["√2, 약 1.4", "2", "15"],
      answer: 0,
      explain: "가로 차이 1, 세로 차이 1. √(1² + 1²) = √2예요.",
      review: "s3",
    },
    {
      q: "두 점이 가깝다는 것은 무슨 뜻일까요?",
      choices: ["숫자가 크다", "취향(성질)이 비슷하다", "둘 다 원점에 있다"],
      answer: 1,
      explain: "칸마다 뜻이 있으니, 숫자들이 비슷하면 성질도 비슷해요.",
      review: "s2",
    },
    {
      q: "AI가 비슷한 노래를 추천할 때 쓰는 원리는?",
      choices: ["가장 최근 노래 고르기", "가장 가까운 점 찾기", "제목이 비슷한 노래 고르기"],
      answer: 1,
      explain: "노래를 벡터로 바꾸고, 내가 좋아한 노래와 가까운 점을 찾아요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "8장 가까우면 닮았다",
    spicy: "매운맛",
    sweet: "단맛",
    minji: "민지",
    junho: "준호",
    seoyeon: "서연",
    pyth: "거리 = √(가로² + 세로²)",
    d1: "√(1² + 1²) = √2 ≈ 1.4",
    d2: "√(6² + 6²) ≈ 8.5",
    closer: "서연이 훨씬 가까워요",
    spicyTeam: "매운맛파",
    sweetTeam: "단맛파",
    recommend: "추천 = 가까운 점 찾기",
    song: "내가 좋아한 노래",
    suggest: "추천!",
    fruit: "과일",
    animal: "동물",
    ride: "탈것",
    wordMap: "단어 지도 (설명용 예시)",
    sum: "가까우면 닮았다",
    next: "다음: 방향으로 재는 내적",
  },
};
