import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "./types";

export const MODELS = [
  { name: "GPT-1", year: "2018", layers: 12 },
  { name: "GPT-2", year: "2019", layers: 48 },
  { name: "GPT-3", year: "2020", layers: 96 },
];

// GPT-3: per block, attention 4·d² + feed-forward 8·d² weights (d = 12,288)
export const PER_LAYER = 12 * 12288 * 12288; // 1,811,939,328 ≈ 18억
export const ALL_LAYERS = PER_LAYER * 96; // 173,946,175,488 ≈ 1,740억 (of 1,750억)

/** What the vector of '학교에' carries at each depth (설명용, a rough picture of what research finds). */
export const DEPTH_NOTES = [
  { layer: 1, note: "학교 + 에, 글자 조각", band: "shallow" },
  { layer: 24, note: "학교 = 장소, '에' = 어디로", band: "shallow" },
  { layer: 48, note: "'나는'이 가는 사람", band: "middle" },
  { layer: 72, note: "오늘 일어나는 일", band: "deep" },
  { layer: 96, note: "다음엔 '간다' 같은 말이 올 차례", band: "deep" },
] as const;

/** Peeking at the next-word guess after each depth (설명용 예시; the last one is the course's 52%). */
export const PEEK_LAYERS = [1, 12, 24, 48, 72, 96];
export const PEEK = [
  { w: "간다", c: "yellow" as const, p: [2, 4, 9, 27, 44, 52] },
  { w: "갔다", c: "mint" as const, p: [2, 5, 12, 22, 22, 21] },
  { w: "늦었다", c: "sky" as const, p: [1, 2, 4, 9, 12, 12] },
  { w: "피자", c: "pink" as const, p: [3, 3, 2, 1, 1, 1] },
];

/** Linear blend of the PEEK numbers at any layer 1–96. */
export function peekAt(layer: number) {
  let i = PEEK_LAYERS.findIndex((l) => l >= layer);
  if (i <= 0) i = 1;
  const a = PEEK_LAYERS[i - 1];
  const b = PEEK_LAYERS[i];
  const t = Math.max(0, Math.min(1, (layer - a) / (b - a)));
  return PEEK.map((r) => ({ ...r, now: r.p[i - 1] + (r.p[i] - r.p[i - 1]) * t }));
}

export const ch58: ChapterSpec = {
  id: 58,
  part: 6,
  title: "블록을 쌓으면",
  core: false,
  hook: "블록 하나로도 돌아가는데, 왜 96개나 쌓을까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "블록은 들어간 모양 그대로 나와요. 그래서 레고처럼 그 밑에 블록을 계속 이어 붙일 수 있어요." },
    { id: "s2", sec: 8.5, narration: "GPT-1은 12층, GPT-2는 48층, GPT-3는 96층이에요. 똑같은 블록 설계를 반복해 쌓았어요." },
    { id: "s3", sec: 8, narration: "모양은 같아도 층마다 안의 숫자는 달라요. 그래서 층마다 맡는 일도 조금씩 달라져요." },
    { id: "s4", sec: 9.5, narration: "얕은 층은 주로 단어 생김새와 바로 옆 단어를, 중간 층은 문장 속 역할과 관계를 다뤄요." },
    { id: "s5", sec: 9.5, narration: "깊은 층일수록 문장 전체의 뜻과 다음에 올 말을 다뤄요. 같은 '학교에'에 정보가 차곡차곡 쌓이죠." },
    { id: "s6", sec: 9, narration: "층마다 다음 말을 미리 들여다보면, 깊어질수록 '간다'의 확률이 점점 올라가요." },
    { id: "s7", sec: 9.5, narration: "GPT-3 블록 한 층에는 숫자가 약 18억 개. 96층을 합치면 약 1,740억 개로, 1,750억 개의 거의 전부예요." },
    { id: "s8", sec: 9, narration: "이렇게 깊이 쌓을 수 있는 건 고속도로와 정규화 덕분이에요. 다음 장에선 블록을 쓰는 두 방식을 봐요." },
  ],
  playgroundTitle: "층별 탐험",
  playgroundIntro: "슬라이더로 층을 내려가 보세요. '학교에' 벡터에 무엇이 쌓이는지, 다음 말 예측이 어떻게 바뀌는지 보여요.",
  summary: [
    "블록은 들어간 모양 그대로 나와서 계속 쌓을 수 있다. GPT-1 12층, GPT-2 48층, GPT-3 96층.",
    "설계는 같아도 층마다 숫자가 달라서, 얕은 층과 깊은 층이 맡는 일이 다르다.",
    "깊이 갈수록 단어 벡터에 문맥과 다음 말의 정보가 쌓인다. GPT-3 숫자의 거의 전부가 블록에 있다.",
  ],
  unlocks: "블록 쌓기",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "GPT-3에는 트랜스포머 블록이 몇 층 쌓여 있을까요?",
      choices: ["12층", "48층", "96층"],
      answer: 2,
      explain: "GPT-1은 12층, GPT-2는 48층, GPT-3는 96층이에요.",
      review: "s2",
    },
    {
      q: "블록을 여러 층 쌓을 때, 층마다 똑같은 것은?",
      choices: ["블록의 설계(모양)", "블록 안의 숫자", "층이 맡는 일"],
      answer: 0,
      explain: "설계는 같고, 안의 숫자는 층마다 따로 학습돼요. 그래서 맡는 일이 달라져요.",
      review: "s3",
    },
    {
      q: "깊은 층으로 갈수록 '학교에' 벡터에는 어떤 일이 생길까요?",
      choices: ["정보가 점점 지워진다", "문장 전체의 뜻과 다음 말에 대한 정보가 쌓인다", "글자 모양 정보만 남는다"],
      answer: 1,
      explain: "층을 지날 때마다 결과가 더해지면서(56장) 문맥 정보가 쌓여요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "58장 블록을 쌓으면",
    att: "어텐션",
    ffn: "피드포워드",
    layer: "층",
    dots: "⋮",
    same: "같은 모양 그대로 이어 붙이기",
    design: "똑같은 설계 반복",
    shape: "모양은 같아요",
    nums: "숫자는 층마다 달라요",
    word: "학교에",
    shallow: "얕은 층",
    middle: "중간 층",
    deep: "깊은 층",
    toy: "설명용 예시",
    rough: "대략 이런 경향이에요",
    peek: "층마다 다음 말을 미리 들여다보면",
    gan: "간다",
    perLayer: "블록 한 층: 약 18억 개",
    times: "× 96층 = 약 1,740억 개",
    total: "GPT-3 전체 1,750억 개",
    almost: "거의 전부!",
    thanks: "깊이 쌓을 수 있는 비결",
    road: "고속도로 (56장)",
    norm: "정규화 (57장)",
    next: "다음 장: 59장 인코더 vs 디코더",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
  },
};
