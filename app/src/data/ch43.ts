import { softmax } from "./ch14";
import { percents } from "./ch45";
import type { ChapterSpec, Highlighter } from "./types";

/** A translation with illustrative relevance scores (설명용 예시): scores[t][s] = how relevant source word s is while writing target word t. */
export type Pair = { label: string; src: string[]; tgt: string[]; scores: number[][] };

export const PAIRS: Pair[] = [
  {
    label: "나는 오늘 학교에 간다",
    src: ["나는", "오늘", "학교에", "간다"],
    tgt: ["I", "go", "to", "school", "today"],
    scores: [
      [3.0, 0.2, 0.1, 0.4],
      [0.3, 0.2, 0.8, 3.0],
      [0.1, 0.3, 2.6, 1.0],
      [0.1, 0.1, 3.2, 0.5],
      [0.2, 3.1, 0.3, 0.4],
    ],
  },
  {
    label: "나는 어제 친구를 만났다",
    src: ["나는", "어제", "친구를", "만났다"],
    tgt: ["I", "met", "my", "friend", "yesterday"],
    scores: [
      [3.0, 0.2, 0.2, 0.5],
      [0.4, 0.3, 0.9, 3.0],
      [2.0, 0.1, 2.2, 0.3],
      [0.2, 0.1, 3.2, 0.6],
      [0.2, 3.2, 0.2, 0.5],
    ],
  },
  {
    label: "고양이가 생선을 먹는다",
    src: ["고양이가", "생선을", "먹는다"],
    tgt: ["The", "cat", "eats", "fish"],
    scores: [
      [2.4, 0.6, 0.3],
      [3.2, 0.2, 0.3],
      [0.3, 0.9, 3.0],
      [0.2, 3.1, 0.6],
    ],
  },
];

/** attention weights for every target word (softmax of its scores, ch14) and whole-percent labels that add up to 100 */
export function weightsOf(pair: Pair) {
  return pair.scores.map((row) => {
    const w = softmax(row).p;
    return { w, pct: percents(w) };
  });
}

export const MAIN = PAIRS[0];
export const MAIN_W = weightsOf(MAIN);
export const SRC_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

/** the Part 4 recap cards */
export const RECAP: { ch: string; t: string; year?: string }[] = [
  { ch: "37", t: "언어 모델 = 문장의 확률" },
  { ch: "38", t: "n-gram: 앞 몇 단어만 세어 보기" },
  { ch: "39", t: "신경망 언어 모델: 단어 벡터 + 신경망", year: "2003" },
  { ch: "40", t: "RNN: 쪽지 릴레이" },
  { ch: "41", t: "RNN의 한계 → LSTM", year: "1997" },
  { ch: "42", t: "seq2seq 번역기: 쪽지 하나의 병목", year: "2014" },
  { ch: "43", t: "어텐션: 필요한 곳을 다시 보기", year: "2014" },
];

export const ch43: ChapterSpec = {
  id: 43,
  part: 4,
  title: "어텐션의 탄생",
  core: true,
  hook: "번역하다가 원문을 다시 쳐다볼 수 있다면, AI 번역은 얼마나 좋아질까요?",
  steps: [
    { id: "s1", sec: 11, narration: "42장의 병목을 풀려고, 2014년 바흐다나우(Bahdanau) 연구팀은 생각을 바꿨어요. 마지막 쪽지만 말고 모든 쪽지를 남기자!" },
    { id: "s2", sec: 10, narration: "디코더가 'I'를 쓸 때, 남겨 둔 쪽지들을 훑어보고 지금 필요한 곳에 스포트라이트를 비춰요. '나는'이 84%예요." },
    { id: "s3", sec: 10, narration: "다음 'go'를 쓸 땐 스포트라이트가 맨 끝의 '간다'로 건너뛰어요. 두 언어의 순서가 달라도 문제없어요." },
    { id: "s4", sec: 10, narration: "'to'와 'school'은 '학교에'를, 'today'는 '오늘'을 비춰요. 쓰는 단어마다 바라보는 곳이 달라요." },
    { id: "s5", sec: 10, narration: "비추는 비율은 관련도 점수를 소프트맥스(14장)로 바꿔 정해요. 그 비율대로 쪽지들을 섞어 디코더에 건네요." },
    { id: "s6", sec: 10, narration: "어디를 봤는지 표로 그리면 엇갈린 줄이 보여요. 단어 짝을 찾아 맞춘다고 해서 정렬(alignment)이라고 불러요." },
    { id: "s7", sec: 10, narration: "Part 4를 정리해 볼까요? 세어 보기(n-gram), 신경망과 단어 벡터, 쪽지 릴레이(RNN), 그리고 어텐션까지 왔어요." },
    { id: "s8", sec: 11, narration: "그리고 2017년, 이런 질문이 나와요. 쪽지 릴레이는 빼고, 아예 어텐션만으로 만들면 어떨까? Part 5에서 만나요." },
  ],
  playgroundTitle: "내가 스포트라이트",
  playgroundIntro: "디코더가 영어 단어를 하나씩 써요. 그 단어를 쓸 때 어떤 한국어 단어를 비춰야 할지 눌러 보세요. 모델의 스포트라이트와 비교해요.",
  summary: [
    "어텐션(2014): 디코더가 단어를 쓸 때마다 원문의 모든 쪽지를 다시 본다.",
    "관련도 점수 → 소프트맥스 → 비율. 그 비율대로 쪽지를 섞어서 쓴다.",
    "순서가 다른 언어도, 긴 문장도 OK. 2017년엔 아예 어텐션만으로(Part 5)!",
  ],
  unlocks: "2014 어텐션",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "어텐션이 42장의 병목을 푼 방법은?",
      choices: ["쪽지를 더 크게 만들었다", "디코더가 단어를 쓸 때마다 원문의 모든 쪽지를 다시 본다", "문장을 짧게 잘랐다"],
      answer: 1,
      explain: "마지막 쪽지 하나에 다 담지 않고, 칸마다 쓴 쪽지를 남겨 두고 필요할 때 다시 봐요.",
      review: "s2",
    },
    {
      q: "'I go to school today'에서 'go'를 쓸 때 스포트라이트가 가장 밝게 비추는 한국어 단어는?",
      choices: ["나는", "오늘", "간다"],
      answer: 2,
      explain: "'go'의 뜻은 문장 맨 끝의 '간다'에 있어요. 순서가 달라도 건너뛰어 비춰요.",
      review: "s3",
    },
    {
      q: "스포트라이트의 비율(어디를 얼마나 볼지)은 어떻게 정할까요?",
      choices: ["관련도 점수를 소프트맥스로 바꿔서", "단어 순서대로 똑같이 나눠서", "무작위로"],
      answer: 0,
      explain: "14장의 소프트맥스 그대로예요. 그래서 비율을 다 더하면 100%예요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "43장 어텐션의 탄생",
    year: "2014",
    who: "바흐다나우 · 조경현 · 벤지오",
    cho: "조경현: 한국인 연구자예요!",
    keep: "칸마다 쓴 쪽지를 전부 남기자!",
    attention: "어텐션 (attention) = 주의를 기울이다",
    note: "쪽지",
    dec: "디코더가 쓰는 중",
    jump: "맨 끝으로 건너뛰기!",
    differ: "쓰는 단어마다 보는 곳이 달라요",
    score: "관련도 점수",
    softmax: "소프트맥스 (14장)",
    mix: "비율대로 섞은 쪽지",
    mixNote: "섞기는 45장에서 또 만나요",
    align: "정렬 (alignment)",
    zigzag: "순서가 엇갈려도 짝을 찾아요",
    recap: "Part 4에서 모은 역사 카드",
    y2017: "2017",
    question: "쪽지 릴레이는 빼고, 아예 어텐션만으로?",
    aiayn: "Attention Is All You Need",
    part5: "Part 5 · 44장에서 만나요",
    demo: "* 설명용 예시",
  },
};
