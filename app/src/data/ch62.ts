import { UNLOCK6 } from "./ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKind } from "./part6-block";
import { PIPELINE } from "./ch05";
import type { ChapterSpec, Highlighter } from "./types";

// ---- the boss playground: round 1 builds the block, round 2 the whole blueprint ----
export type Card = { id: string; kind: string; name: string; color: Highlighter | null };
export type Slot = { kind: string; hint: string };

const BLOCK_HINT: Record<BlockKind, string> = {
  norm: "부품에 들어가기 직전에는 숫자 크기부터 맞춰요(57장).",
  att: "정규화 다음에는 단어들이 서로 쳐다보는 부품이 와요(45장).",
  add: "부품이 낸 결과는 고속도로 위 원래 벡터에 더해요(56장).",
  ffn: "두 번째 정규화 다음에는 단어마다 따로 생각하는 부품이 와요(55장).",
};
export const BLOCK_SLOTS: Slot[] = BLOCK_ORDER.map((k) => ({ kind: kindOf(k), hint: BLOCK_HINT[kindOf(k)] }));
export const BLOCK_CARDS: Card[] = [
  ...BLOCK_ORDER.map((k, i) => ({ id: `b${i}`, kind: kindOf(k), name: KIND[kindOf(k)].name, color: KIND[kindOf(k)].color })),
  { id: "bx", kind: "softmax", name: "소프트맥스", color: "mint" },
];

const outer = (key: string) => PIPELINE.find((p) => p.key === key)!;
export const BLOCK_CARD_NAME = "트랜스포머 블록 × 96";
export const BP_SLOTS: Slot[] = [
  { kind: "tok", hint: "글을 맨 처음 받는 부품은 글을 조각으로 잘라요(29장)." },
  { kind: "emb", hint: "조각 번호를 의미가 담긴 숫자로 바꾸는 부품이에요(33장)." },
  { kind: "pos", hint: "몇 번째 조각인지 알려 주는 부품이에요(36장)." },
  { kind: "block", hint: "가운데에는 방금 조립한 블록이 96층 쌓여 있어요." },
  { kind: "out", hint: "마지막 벡터로 다음 말의 확률을 내는 부품이에요(60장)." },
  { kind: "loop", hint: "마지막엔 확률대로 하나 뽑아 글 끝에 붙여요(1, 2장)." },
];
export const BP_CARDS: Card[] = [
  ...["tok", "emb", "pos"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "block", kind: "block", name: BLOCK_CARD_NAME, color: "yellow" },
  ...["out", "loop"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "enc", kind: "encoder", name: "인코더 (BERT)", color: "sky" },
];

export const DISTRACTOR_HINT: Record<string, string> = {
  softmax: "소프트맥스는 블록 안이 아니라 설계도 맨 끝, 출력에 있어요(60장).",
  encoder: "GPT는 디코더 블록만 쌓아요. 인코더는 BERT 쪽이에요(59장).",
};

/** A fixed shuffle, so every student sees the same tray (and it never starts in order). */
export function shuffled<T>(items: T[], seed = 11) {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const ch62: ChapterSpec = {
  id: 62,
  part: 6,
  title: "Part 6 보스전: 설계도 완성",
  core: false,
  hook: "부품을 다 모았어요. 올바른 순서로 조립해서 GPT를 완성할 수 있을까요?",
  steps: [
    { id: "s1", sec: 8, narration: "Part 6에서 블록 부품을 하나씩 모았어요. 이제 전부 조립해서 설계도를 완성해 볼까요?" },
    { id: "s2", sec: 10, narration: "블록 한 층부터. 정규화 → 어텐션 → 더하기, 다시 정규화 → 피드포워드 → 더하기." },
    { id: "s3", sec: 8.5, narration: "이 블록을 96층 쌓아요. 고속도로와 정규화 덕분에 깊이 쌓아도 흔들리지 않아요." },
    { id: "s4", sec: 8.5, narration: "앞에는 토크나이저, 임베딩, 위치 정보가 글을 벡터로 바꿔서 넣어 줘요(Part 3)." },
    { id: "s5", sec: 8.5, narration: "뒤에는 출력 + 소프트맥스가 다음 말의 확률을 내고, 하나를 뽑아 글 끝에 붙여요." },
    { id: "s6", sec: 8.5, narration: "설계도의 기계 부분이 모두 채워졌어요! 글을 넣으면 다음 말이 나오는 GPT가 완성됐어요." },
    { id: "s7", sec: 9.5, narration: "그런데 부품 속 숫자 1,750억 개는 아직 엉망이에요. Part 7에서는 이 숫자들을 공부시켜요. 사전학습이에요." },
  ],
  playgroundTitle: "설계도 조립하기",
  playgroundIntro: "부품 카드를 끌어다 빈칸에 놓거나, 카드를 누른 다음 빈칸을 눌러 보세요. 먼저 블록 한 층, 그다음 설계도 전체예요. 엉뚱한 카드도 하나 섞여 있어요.",
  summary: [
    "블록 한 층: 정규화 → 어텐션 → 더하기 → 정규화 → 피드포워드 → 더하기. 이걸 96층 쌓는다.",
    "설계도: 토크나이저 → 임베딩 → 위치 정보 → 블록 × 96 → 출력 + 소프트맥스 → 뽑아서 붙이기.",
    "기계는 완성! 다음은 숫자 1,750억 개를 공부시키는 사전학습(Part 7).",
  ],
  unlocks: "완성된 설계도",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "블록 한 층에서 어텐션 바로 앞에 오는 부품은?",
      choices: ["더하기", "정규화", "피드포워드"],
      answer: 1,
      explain: "부품에 들어가기 직전에 정규화로 크기를 맞춰요. GPT-2, GPT-3가 이 순서예요(57장).",
      review: "s2",
    },
    {
      q: "설계도에서 글을 맨 처음 받는 부품은?",
      choices: ["토크나이저", "임베딩", "출력 + 소프트맥스"],
      answer: 0,
      explain: "토크나이저가 글을 조각으로 자르고, 임베딩이 조각을 숫자로 바꿔요(29장, 33장).",
      review: "s4",
    },
    {
      q: "설계도를 다 조립한 GPT에게 아직 남은 일은?",
      choices: ["부품을 하나 더 끼우기", "소프트맥스 빼기", "부품 속 숫자를 학습시키기(사전학습)"],
      answer: 2,
      explain: "기계 모양은 완성됐지만 숫자는 처음엔 엉망이에요. Part 7에서 사전학습으로 고쳐요(5장).",
      review: "s7",
    },
  ],
  labels: {
    tag: "62장 Part 6 보스전: 설계도 완성",
    boss: "Part 6 보스전",
    got: "모은 부품",
    oneLayer: "블록 한 층",
    layers: "× 96층",
    steady: "깊이 쌓아도 흔들리지 않게",
    road: "고속도로 (56장)",
    norm: "정규화 (57장)",
    front: "글 → 벡터 (Part 3)",
    back: "다음 말 확률 → 뽑아서 붙이기",
    done: "완성!",
    input: "나는 오늘 학교에",
    output: "간다",
    mess: "처음엔 숫자가 엉망",
    next: "다음: Part 7 사전학습",
    nextSub: "숫자 1,750억 개를 공부시키기",
  },
};
