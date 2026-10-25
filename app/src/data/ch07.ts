import type { ChapterSpec, Highlighter } from "./types";

export type Friend = { name: string; v: [number, number]; c: Highlighter };

// taste vectors: (매운맛, 단맛), each 0–10. Reused in 8장 and 9장.
export const FRIENDS: Friend[] = [
  { name: "민지", v: [8, 3], c: "pink" },
  { name: "준호", v: [2, 9], c: "mint" },
  { name: "서연", v: [7, 4], c: "sky" },
];

export const FLAVORS4 = [
  { name: "매운맛", v: 8 },
  { name: "단맛", v: 3 },
  { name: "짠맛", v: 5 },
  { name: "신맛", v: 2 },
];

export const ch07: ChapterSpec = {
  id: 7,
  part: 1,
  title: "벡터: 숫자들의 줄",
  core: true,
  hook: "친구와 내 음식 취향이 얼마나 비슷한지, 숫자로 나타낼 수 있을까요?",
  steps: [
    { id: "s1", sec: 6, narration: "취향을 숫자로 적어 볼게요. 매운맛을 얼마나 좋아하는지 0부터 10, 단맛도 0부터 10." },
    { id: "s2", sec: 7, narration: "민지는 매운맛 8, 단맛 3. 이걸 괄호로 묶어 (8, 3)이라고 써요. 이렇게 숫자를 순서대로 묶은 걸 벡터라고 해요." },
    { id: "s3", sec: 8, narration: "벡터는 화살표로 그릴 수 있어요. 가로는 매운맛, 세로는 단맛. 원점에서 (8, 3)까지 화살표를 그리면 민지의 취향이에요." },
    { id: "s4", sec: 7, narration: "준호는 (2, 9), 서연은 (7, 4). 화살표 방향만 봐도 누구와 누가 취향이 비슷한지 보여요." },
    { id: "s5", sec: 8, narration: "칸을 늘리면 더 자세해져요. 짠맛, 신맛까지 넣으면 숫자 4개짜리 벡터. 칸의 개수를 차원이라고 해요." },
    { id: "s6", sec: 8, narration: "GPT는 단어 하나를 아주 긴 벡터로 나타내요. GPT-3는 단어마다 숫자를 12,288개 써요. 그릴 수는 없지만 원리는 같아요." },
    { id: "s7", sec: 6, narration: "벡터는 뜻이 있는 숫자들의 줄. 다음 장에선 두 벡터가 얼마나 가까운지 재 봐요." },
  ],
  playgroundTitle: "내 취향 화살표",
  playgroundIntro: "슬라이더로 내 취향을 정해 보세요. 화살표와 벡터가 같이 바뀌어요.",
  summary: [
    "벡터: 숫자를 순서대로 묶은 것. 칸마다 뜻이 있다.",
    "2칸짜리 벡터는 평면 위 화살표로 그릴 수 있다.",
    "칸의 개수 = 차원. GPT-3의 단어 벡터는 12,288차원.",
  ],
  unlocks: "벡터",
  unlockLabel: "수학 도구를 하나 얻었어요",
  quiz: [
    {
      q: "민지의 취향 (8, 3)에서 8은 무엇일까요?",
      choices: ["매운맛 점수", "단맛 점수", "민지의 나이"],
      answer: 0,
      explain: "벡터는 칸의 순서가 중요해요. 첫 칸 = 매운맛, 둘째 칸 = 단맛으로 정했어요.",
      review: "s2",
    },
    {
      q: "(8, 3, 5, 2)는 몇 차원 벡터일까요?",
      choices: ["2차원", "4차원", "18차원"],
      answer: 1,
      explain: "숫자가 4개니까 4차원이에요. 숫자들을 더한 값과는 상관없어요.",
      review: "s5",
    },
    {
      q: "GPT-3가 단어 하나를 나타내는 데 쓰는 숫자는 몇 개일까요?",
      choices: ["2개", "100개", "12,288개"],
      answer: 2,
      explain: "그릴 수 없을 만큼 많은 칸이지만, '숫자들의 줄'이라는 원리는 똑같아요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "7장 벡터: 숫자들의 줄",
    spicy: "매운맛",
    sweet: "단맛",
    salty: "짠맛",
    sour: "신맛",
    minji: "민지",
    junho: "준호",
    seoyeon: "서연",
    vector: "벡터",
    origin: "원점",
    similar: "방향이 비슷!",
    arrowSE: "↘",
    dims: "4차원 벡터",
    dimNote: "칸의 개수 = 차원",
    noDraw: "4차원은 화살표로 못 그려요. 막대로는 볼 수 있죠",
    gpt: "GPT-3의 단어 하나",
    count: "숫자 12,288개",
    same: "원리는 똑같아요",
    sum: "벡터 = 뜻이 있는 숫자들의 줄",
    word: "학교",
    examples: "(8, 3) · (8, 3, 5, 2) · (…12,288개)",
  },
};
