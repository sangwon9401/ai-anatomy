import { PAIRS, TOKENIZERS } from "./part3-tokens";
import type { ChapterSpec } from "./types";

// all counts come from tiktoken (see part3-tokens.ts); checked with a script
export const MAIN = PAIRS[0]; // 나는 오늘 학교에 간다. / I am going to school today.  → 28·14·7 vs 7·7·7
export const LONG = PAIRS[PAIRS.length - 1]; // a 3-sentence paragraph → 143·67·38 vs 29·28·27
// ' 학교' in GPT-3's tokenizer: one space token, then bytes [237 149] [153] [234] [181] [144]
export const SCHOOL_BYTES = ["237 149", "153", "234", "181", "144"];
// a few real single tokens of GPT-3's vocabulary (r50k_base)
export const EN_SAMPLES = [" the", " school", "ing", " today", " going", "tion", " and", " you", " computer", " cat"];
// vocabulary entries that hold at least one whole Hangul syllable (counted over every token id)
export const HANGUL_TOKENS = [0, 281, 2352];
export { TOKENIZERS };

export const ch31: ChapterSpec = {
  id: 31,
  part: 3,
  title: "한국어는 토큰이 많다?",
  core: false,
  hook: "같은 말을 해도 한국어로 하면 AI 요금이 더 나온다는데, 정말일까요?",
  steps: [
    { id: "s1", sec: 7.5, narration: "같은 뜻의 문장을 한국어와 영어로 써 놓고, 토큰 수를 세어 봐요. 토큰 수는 AI가 읽고 써야 하는 양이에요." },
    { id: "s2", sec: 7.5, narration: "GPT-3의 토크나이저로 자르면 영어는 7조각인데, 한국어는 28조각이에요. 같은 뜻인데 4배나 많아요." },
    { id: "s3", sec: 8, narration: "점선 조각이 많죠? 한글 한 글자는 3바이트예요(28장). 이 토크나이저는 한글을 거의 바이트 하나하나로 잘랐어요." },
    { id: "s4", sec: 8, narration: "GPT-3 토크나이저는 거의 영어로 된 글로 만들어서, 조각 5만 개 중에 한글 글자 조각이 하나도 없어요." },
    { id: "s5", sec: 8, narration: "토큰이 많으면 손해예요. 요금도 토큰 수로 매기고, 한 번에 읽는 양도 토큰 수로 정해지고, 답도 느려져요." },
    { id: "s6", sec: 8.5, narration: "새 토크나이저는 한글 조각을 많이 배웠어요. 같은 문장이 GPT-4에선 14조각, GPT-4o에선 7조각. 영어와 같아졌어요." },
    { id: "s7", sec: 8, narration: "긴 글로 재 보면 GPT-4o에서도 한국어가 1.4배쯤 많아요. GPT-3 때 약 5배였던 것에 비하면 많이 줄었죠." },
    { id: "s8", sec: 8, narration: "한국어는 토큰이 많다? 예전엔 훨씬 많았고, 지금은 조금 많아요. 토크나이저가 어떤 글로 배웠는지에 달렸어요." },
  ],
  playgroundTitle: "토큰 수 대결",
  playgroundIntro: "같은 뜻의 한국어·영어 문장을 골라 보세요. 먼저 어느 쪽이 토큰이 많을지 맞혀 본 다음, 세 토크나이저의 결과를 비교해요.",
  summary: [
    "같은 뜻이라도 언어마다 토큰 수가 다르다. 요금·읽는 양·속도가 토큰 수로 정해진다.",
    "GPT-3 토크나이저는 영어 글로 만들어져 한글을 바이트 단위로 잘게 잘랐다.",
    "한글 조각을 많이 배운 GPT-4o에선 차이가 확 줄었다(긴 글 기준 약 5배 → 약 1.4배).",
  ],
  unlocks: "토큰 효율",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "GPT-3 토크나이저에서 한국어 문장의 토큰이 특히 많았던 이유는?",
      choices: ["한국어 문장이 원래 더 길어서", "한글 조각을 거의 못 배워서 바이트 단위로 잘랐기 때문에", "한국어는 띄어쓰기를 안 해서"],
      answer: 1,
      explain: "영어 글로 만든 토크나이저라 한글 글자 조각이 하나도 없었어요. 그래서 한 글자가 2~3조각이 됐어요.",
      review: "s4",
    },
    {
      q: "토큰이 많으면 생기는 일이 아닌 것은?",
      choices: ["요금이 더 나온다", "한 번에 읽을 수 있는 글이 줄어든다", "답이 더 정확해진다"],
      answer: 2,
      explain: "토큰이 많다고 똑똑해지진 않아요. 요금, 읽는 양, 속도만 손해예요.",
      review: "s5",
    },
    {
      q: "GPT-4o에서 같은 뜻의 긴 글을 재 보면 한국어 토큰은 영어의 약 몇 배였나요?",
      choices: ["약 1.4배", "약 5배", "약 10배"],
      answer: 0,
      explain: "한국어 38조각, 영어 27조각. GPT-3 때는 143 대 29로 약 5배였어요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "31장 한국어는 토큰이 많다?",
    ko: "한국어",
    en: "영어",
    amount: "토큰 수 = AI가 읽고 쓰는 양",
    gpt3src: "GPT-3 토크나이저 (r50k_base)",
    times4: "4배!",
    dashed: "점선 = 글자 하나의 바이트 일부",
    school: "'학교' →",
    hak: "학",
    gyo: "교",
    bytesNote: "한 글자가 바이트 2~3조각으로",
    vocab3: "GPT-3 어휘 50,257개",
    hangul0: "한글 글자 조각:",
    zero: "0개",
    mostlyEn: "거의 영어로 된 글로 만든 목록",
    cost: "토큰이 많으면",
    c1: "요금",
    c1d: "토큰 수만큼 내요",
    c2: "읽는 양",
    c2d: "GPT-3는 한 번에 2,048토큰",
    c3: "속도",
    c3d: "한 조각씩 써요 (2장)",
    model3: "GPT-3",
    model4: "GPT-4",
    model4o: "GPT-4o",
    hangulN: "한글 글자 조각",
    same: "같아졌어요!",
    long: "긴 글 (세 문장)로 재 보면",
    r1: "약 4.9배",
    r2: "약 2.4배",
    r3: "약 1.4배",
    q: "한국어는 토큰이 많다?",
    a1: "예전 (GPT-3): 훨씬 많았다",
    a2: "지금 (GPT-4o): 조금 많다",
    dep: "토크나이저가 어떤 글로 배웠느냐에 달렸어요",
    pieces: "조각",
    src: "tiktoken으로 센 실제 토큰 수",
  },
};
