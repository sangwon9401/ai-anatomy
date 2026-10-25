import type { ChapterSpec, Highlighter } from "./types";

/** the four real GPT-2 heads this chapter visits (layer and head numbered from 0, like code: L4H11) */
export const GPT2_HEADS: { key: string; layer: number; head: number; name: string; c: Highlighter; desc: string }[] = [
  { key: "prev", layer: 4, head: 11, name: "바로 앞 단어", c: "sky", desc: "어느 문장이든 바로 앞 단어만 거의 100% 봐요." },
  { key: "first", layer: 7, head: 2, name: "첫 단어", c: "violet", desc: "거의 모든 단어가 첫 단어를 봐요. 왜 그런지는 아직 연구 중이에요." },
  { key: "copy", layer: 5, head: 1, name: "따라 하기", c: "mint", desc: "같은 말이 다시 나오면, 처음에 그 다음에 왔던 단어를 봐요. 반복 문장에서 잘 보여요." },
  { key: "subj", layer: 4, head: 3, name: "주어 찾기?", c: "orange", desc: "동사나 'it', 'she'가 앞의 주인공을 보는 것처럼 보여요. 해석은 조심!" },
];

/** Part 5 in chips, for the recap */
export const PART5_TOOLS = ["어텐션만으로 충분 (44)", "서로 쳐다보기 (45)", "Q · K · V (46)", "Q · K 점수 (47)", "÷ √d + 소프트맥스 (48)", "V 섞기 (49)", "행렬로 한 번에 (50)", "인과 마스크 (51)", "멀티헤드 (52)", "어텐션 지도 (53)"];

export const ch53: ChapterSpec = {
  id: 53,
  part: 5,
  title: "진짜 GPT 머릿속 들여다보기",
  core: false,
  hook: "진짜 GPT의 헤드들은 정말로 무언가를 '쳐다보고' 있을까요?",
  steps: [
    { id: "s1", sec: 9, narration: "드디어 진짜 GPT를 열어 볼게요. GPT-2 중 가장 작은 모델이에요. 층이 12개, 층마다 헤드가 12개, 모두 144개예요." },
    { id: "s2", sec: 9, narration: "영어 문장 하나를 넣고, 헤드 하나가 쳐다보는 비율을 지도로 그려요. 줄은 쳐다보는 단어, 칸은 쳐다보이는 단어예요." },
    { id: "s3", sec: 8, narration: "4층 11번 헤드예요. 모든 단어가 바로 앞 단어만 거의 100% 봐요. 그래서 대각선 바로 아래 칸만 진해요." },
    { id: "s4", sec: 10, narration: "7층 2번 헤드에서는 거의 모든 단어가 첫 단어 'The'를 봐요. 이 문장에서 144개 헤드 중 98개가 절반 넘게 첫 단어를 봤어요." },
    { id: "s5", sec: 9, narration: "같은 문장을 두 번 넣었어요. 5층 1번 헤드에서 두 번째 'my'는, 처음 'my' 다음에 온 'dog'를 51% 봐요." },
    { id: "s6", sec: 9, narration: "4층 3번 헤드에서는 'it'이 'cat'을 84% 쳐다봐요. 45장의 '그것은'처럼, 가리키는 대상을 찾는 것처럼 보여요." },
    { id: "s7", sec: 9, narration: "Part 5에서 어텐션을 완전히 뜯어봤어요. Q · K 점수, √d와 소프트맥스, V 섞기, 행렬 계산, 가림막, 여러 헤드까지." },
    { id: "s8", sec: 9, narration: "이제 설계도의 어텐션 부품이 하는 일을 전부 알게 됐어요. Part 6에서는 부품들을 쌓아 트랜스포머 블록을 조립해요(54장)." },
  ],
  playgroundTitle: "어텐션 지도 탐험",
  playgroundIntro: "진짜 GPT-2에서 미리 계산해 둔 어텐션 지도예요. 문장과 헤드를 바꾸고, 단어를 눌러 그 단어가 누구를 보는지 확인해 보세요.",
  summary: [
    "진짜 GPT-2(가장 작은 모델): 12층 × 헤드 12개 = 헤드 144개.",
    "바로 앞 단어만 보는 헤드, 첫 단어에 몰리는 헤드, 앞의 흐름을 따라 하는 헤드가 실제로 있다.",
    "Part 5 끝: 점수(Q · K) → ÷ √d → 소프트맥스 → V 섞기. 가림막을 쓰고 여러 헤드로 계산한다.",
  ],
  unlocks: "어텐션 지도 읽기",
  unlockLabel: "어텐션의 비밀을 하나 풀었어요",
  quiz: [
    {
      q: "4층 11번 헤드의 지도에서 진한 칸은 어디에 있었나요?",
      choices: ["대각선 바로 아래 (바로 앞 단어)", "맨 왼쪽 열 (첫 단어)", "골고루 퍼져 있다"],
      answer: 0,
      explain: "모든 단어가 바로 앞 단어만 봐서, 대각선 바로 아래 칸만 진해요.",
      review: "s3",
    },
    {
      q: "GPT-2 가장 작은 모델에는 헤드가 모두 몇 개 있을까요?",
      choices: ["12개", "96개", "144개"],
      answer: 2,
      explain: "층이 12개, 층마다 헤드가 12개라서 12 × 12 = 144개예요. (96개는 GPT-3의 한 층에 있는 헤드 수예요.)",
      review: "s1",
    },
    {
      q: "어텐션 지도의 대각선 위쪽이 늘 비어 있는 이유는?",
      choices: ["인과 마스크로 미래를 가려서", "그 단어들이 중요하지 않아서", "계산이 덜 끝나서"],
      answer: 0,
      explain: "GPT는 앞 단어만 볼 수 있어요(51장). 그래서 지도가 늘 삼각형이에요.",
      review: "s2",
    },
  ],
  labels: {
    tag: "53장 진짜 GPT 머릿속 들여다보기",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "↙",
    model: "GPT-2 (가장 작은 모델)",
    layers: "층 12개",
    perLayer: "층마다 헤드 12개",
    total: "12 × 12 = 헤드 144개",
    layer: "층",
    rows: "쳐다보는 단어 ↓",
    cols: "쳐다보이는 단어 →",
    tri: "삼각형 = 인과 마스크 (51장)",
    dark: "진할수록 많이 봐요",
    prevT: "바로 앞 단어만 보는 헤드",
    firstT: "첫 단어에 몰리는 헤드",
    first98: "이 문장에서 144개 중 98개 헤드가 절반 넘게 첫 단어를 봐요",
    why: "왜 그럴까? 아직 연구 중",
    copyT: "앞의 흐름을 따라 하는 헤드",
    copyNote: "두 번째 'my' → 처음 'my' 다음의 'dog'",
    subjT: "'it'이 'cat'을 보는 헤드",
    careful: "그렇게 보일 뿐, 해석은 조심!",
    callback: "45장: 그것은 …",
    src: "실제 계산값 · 0층부터 셈",
    recap: "Part 5 어텐션 완전 정복!",
    blueprint: "GPT 설계도",
    understood: "45~53장에서 완전 정복",
    next: "다음: Part 6 트랜스포머 조립하기 (54장)",
  },
};
