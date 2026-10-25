import type { ChapterSpec, Highlighter } from "./types";

export type Part = {
  key: string;
  name: string;
  does: string;
  where: string;
  color: Highlighter;
  /** filled once the student has finished chapters 1–4 */
  filled?: boolean;
};

// The GPT blueprint, top to bottom. The two block parts repeat N times (GPT-3: 96 layers).
export const PIPELINE: Part[] = [
  { key: "tok", name: "토크나이저", does: "글을 조각(토큰)으로 자른다", where: "29장", color: "sky" },
  { key: "emb", name: "임베딩", does: "조각을 의미가 담긴 숫자로 바꾼다", where: "33장", color: "sky" },
  { key: "pos", name: "위치 정보", does: "몇 번째 조각인지 알려 준다", where: "36장", color: "sky" },
  { key: "att", name: "어텐션", does: "조각끼리 서로 쳐다보고 의미를 섞는다", where: "45장", color: "yellow" },
  { key: "ffn", name: "피드포워드", does: "각 조각에 '생각'을 더한다", where: "55장", color: "yellow" },
  { key: "out", name: "출력 + 소프트맥스", does: "다음 조각의 확률을 낸다", where: "60장, 14장", color: "mint" },
  { key: "loop", name: "뽑아서 붙이기", does: "하나 뽑아 글 끝에 붙이고 다시", where: "1, 2장", color: "mint", filled: true },
];

export const TRAINING = [
  { name: "학습 데이터", does: "인터넷의 엄청난 글", where: "4장, 63장", filled: true },
  { name: "사전학습", does: "다음 조각 맞히기 연습, 틀린 만큼 숫자 고치기", where: "Part 2, 7" },
  { name: "대화 연습", does: "모범 답안 따라 하기 + 사람의 칭찬", where: "73장, 76장" },
];

export const ch05: ChapterSpec = {
  id: 5,
  part: 0,
  title: "우리가 조립할 설계도",
  core: true,
  hook: "ChatGPT라는 기계를 열면 안에 뭐가 들어 있을까요?",
  steps: [
    { id: "s1", sec: 6, narration: "지금까지 본 걸 정리하면, ChatGPT는 다음 조각을 맞히는 기계예요. 이제 그 기계를 열어 볼 차례예요." },
    { id: "s2", sec: 8, narration: "맨 앞에는 글을 조각내는 토크나이저, 조각을 숫자로 바꾸는 임베딩, 몇 번째 조각인지 알려 주는 위치 정보가 있어요." },
    { id: "s3", sec: 8, narration: "가운데는 트랜스포머 블록이에요. 조각끼리 쳐다보는 어텐션과 생각을 더하는 피드포워드가 한 세트로, 수십 층 쌓여 있어요." },
    { id: "s4", sec: 7, narration: "마지막엔 소프트맥스로 다음 조각의 확률을 내고, 하나를 뽑아 붙여요. 그리고 다시 맨 위로." },
    { id: "s5", sec: 8, narration: "그런데 부품 속 숫자는 처음엔 엉망이에요. 엄청난 양의 글로 다음 조각 맞히기를 연습하며 숫자를 고쳐야 해요. 이게 사전학습이에요." },
    { id: "s6", sec: 7, narration: "마지막으로 모범 답안과 사람의 칭찬으로 대화하는 법을 배워요. 그러면 ChatGPT가 돼요." },
    { id: "s7", sec: 8, narration: "앞으로 이 설계도의 빈칸을 한 Part씩 채워 갈 거예요. 지금까지는 뽑아서 붙이기와 학습 데이터를 채웠어요. 출발해 볼까요?" },
  ],
  playgroundTitle: "설계도 조립하기",
  playgroundIntro: "글이 기계를 지나가는 순서대로 부품을 눌러 보세요. 첫 부품은 글을 조각내는 부품이에요.",
  summary: [
    "토크나이저 → 임베딩 + 위치 → [어텐션 + 피드포워드] × 수십 층 → 소프트맥스 → 뽑아서 붙이기.",
    "처음엔 엉망인 숫자를 사전학습으로 고친다.",
    "모범 답안과 사람의 평가로 대화를 배우면 ChatGPT.",
  ],
  unlocks: "GPT 설계도",
  unlockLabel: "설계도를 받았어요",
  quiz: [
    {
      q: "글을 조각으로 나누는 부품은?",
      choices: ["임베딩", "토크나이저", "소프트맥스"],
      answer: 1,
      explain: "토크나이저가 글을 토큰으로 자르고, 임베딩이 그 토큰을 숫자로 바꿔요.",
      review: "s2",
    },
    {
      q: "트랜스포머 블록 한 세트에 들어 있는 두 가지는?",
      choices: ["어텐션과 피드포워드", "토크나이저와 임베딩", "소프트맥스와 뽑기"],
      answer: 0,
      explain: "어텐션 + 피드포워드가 한 층이고, 이 층을 수십 번 쌓아요.",
      review: "s3",
    },
    {
      q: "사전학습에서 모델이 연습하는 것은?",
      choices: ["다음 조각 맞히기", "사람 얼굴 알아보기", "문법 규칙 외우기"],
      answer: 0,
      explain: "엄청난 양의 글로 다음 조각 맞히기를 연습하면서 숫자를 고쳐요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "5장 우리가 조립할 설계도",
    input: "나는 오늘 학교에",
    output: "간다",
    gpt: "GPT",
    chatgpt: "ChatGPT",
    block: "트랜스포머 블록",
    layers: "× 수십 층 (GPT-3는 96층)",
    again: "다시 맨 위로",
    pretrain: "사전학습",
    chat: "대화 연습",
    mess: "처음엔 숫자가 엉망",
    numbers: "숫자 1,750억 개를 조금씩 고치기",
    filled: "채움",
    empty: "빈칸",
    go: "출발!",
    web: "인터넷의 엄청난 글",
    practice: "다음 조각 맞히기 연습",
    fix: "틀린 만큼 숫자 고치기",
    sft: "모범 답안 따라 하기",
    rlhf: "사람의 칭찬",
    ch73: "73장",
    ch76: "76장",
    data: "학습 데이터",
    blockLayers: "× 수십 층",
    gpt3: "(GPT-3는 96층)",
  },
};
