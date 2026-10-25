import { PRESETS } from "./part3-tokens";
import type { ChapterSpec } from "./types";

// the running sentence, cut three ways (tokens: real GPT-4o tokenizer o200k_base, see part3-tokens.ts)
export const SENT = PRESETS[0];
export const SENT_CHARS = [...SENT.text];
export const SENT_WORDS = SENT.text.split(" ");
export const RARE = { unbelievable: PRESETS[6], slang: PRESETS[4] };

// s6: a few rows of the GPT-4o vocabulary (ids checked with tiktoken)
export const VOCAB_ROWS: [string, string][] = [
  ["0", "!"],
  ["1", '"'],
  ["2", "#"],
  ["⋮", ""],
  ["3107", "에"],
  ["⋮", ""],
  ["136975", " 학교"],
  ["⋮", ""],
];

export const ch29: ChapterSpec = {
  id: 29,
  part: 3,
  title: "토큰: AI의 글자 단위",
  core: true,
  hook: "ChatGPT는 글을 한 글자씩 읽을까요, 한 단어씩 읽을까요?",
  steps: [
    { id: "s1", sec: 7, narration: "ChatGPT는 글을 읽기 전에 먼저 잘게 잘라요. 이 조각을 토큰, 자르는 부품을 토크나이저라고 해요." },
    { id: "s2", sec: 7.5, narration: "글자 단위로 자르면 어떨까요? 조각이 너무 많아지고, '는' 같은 글자 하나에는 뜻이 거의 없어요." },
    { id: "s3", sec: 8, narration: "단어 단위는요? 세상에 단어는 끝없이 많고, '어쩔티비' 같은 새 말은 목록에 없어서 읽을 수가 없어요." },
    { id: "s4", sec: 8.5, narration: "그래서 그 중간으로 잘라요. 실제 GPT-4o 토크나이저는 이 문장을 7조각으로 잘라요. 띄어쓰기는 뒷말에 붙어요." },
    { id: "s5", sec: 8.5, narration: "조각마다 번호가 있어요. 띄어쓰기가 붙은 '학교'는 136975번. 모델이 실제로 받는 건 글이 아니라 이 번호 줄이에요." },
    { id: "s6", sec: 7.5, narration: "조각 목록을 어휘라고 해요. GPT-3는 약 5만 개, GPT-4o는 약 20만 개의 조각을 알고 있어요." },
    { id: "s7", sec: 8.5, narration: "드문 말은 아는 작은 조각으로 나눠요. unbelievable은 세 조각, 어쩔티비는 다섯 조각. 그래서 못 읽는 말이 없어요." },
    { id: "s8", sec: 7.5, narration: "글을 조각내고 번호를 붙이는 토크나이저, 설계도의 첫 부품이 채워졌어요. 이 조각 목록은 어떻게 만들까요?" },
  ],
  playgroundTitle: "토큰 현미경",
  playgroundIntro: "문장을 골라 보세요. 실제 GPT-4o 토크나이저가 자른 조각을 색깔로 보여 줘요. '번호로 보기'를 누르면 모델이 받는 숫자가 보여요.",
  summary: [
    "토큰: AI가 글을 읽는 조각. 글자보다 크고 단어보다 작을 때가 많다.",
    "자주 나오는 덩어리는 한 조각, 드문 말은 작은 조각 여러 개.",
    "조각마다 번호가 있고, 모델은 이 번호 줄을 받는다. 조각 목록 = 어휘.",
  ],
  unlocks: "토크나이저",
  quiz: [
    {
      q: "토크나이저가 하는 일은?",
      choices: ["글을 조각(토큰)으로 자르고 번호를 붙인다", "다음 단어의 확률을 계산한다", "틀린 맞춤법을 고친다"],
      answer: 0,
      explain: "글 → 조각 → 번호. 설계도의 맨 앞 부품이에요.",
      review: "s1",
    },
    {
      q: "단어 단위로만 자르면 생기는 문제는?",
      choices: ["조각이 너무 많아진다", "목록에 없는 새 말을 읽을 수 없다", "띄어쓰기가 사라진다"],
      answer: 1,
      explain: "'어쩔티비' 같은 새 말은 단어 목록에 없어요. 토큰은 작은 조각으로 나눠서라도 읽어요.",
      review: "s3",
    },
    {
      q: "모델에 실제로 들어가는 것은?",
      choices: ["글자 그림", "문장 그대로", "토큰 번호의 줄"],
      answer: 2,
      explain: "'나는 오늘 학교에 간다.'는 GPT-4o에게 102052, 106820, 136975, … 같은 번호 7개예요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "29장 토큰: AI의 글자 단위",
    machine: "토크나이저 ✂",
    token: "토큰 = AI가 읽는 조각",
    byChar: "글자 단위로 자르면?",
    byWord: "단어 단위로 자르면?",
    byToken: "토큰: 그 중간 크기",
    n13: "13조각",
    n4: "4조각",
    n7: "7조각",
    tooMany: "너무 많아요",
    noMeaning: "글자 하나엔 뜻이 거의 없어요",
    looksOk: "좋아 보이지만…",
    unknown: "목록에 없는 새 말!",
    endless: "단어는 끝없이 많아요",
    cmp: "글자 13 · 토큰 7 · 단어 4",
    source: "GPT-4o 토크나이저 (o200k_base)",
    space: "␣ = 띄어쓰기, 뒷말에 붙어요",
    ids: "모델이 실제로 받는 것",
    vocab: "어휘(vocabulary) = 조각 목록",
    rows: "약 20만 줄",
    gpt3: "GPT-3",
    gpt4o: "GPT-4o",
    v3: "약 5만",
    v4o: "약 20만",
    rare: "드문 말은 작은 조각으로",
    bytes: "점선 = 글자 하나가 바이트 조각 2개로 (28장)",
    canRead: "그래서 못 읽는 말이 없어요",
    bp: "설계도 첫 부품 완성!",
    empty: "빈칸",
    next: "다음: 조각 목록은 어떻게 만들까? (30장)",
    q: "?",
  },
};
