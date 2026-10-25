import { DECAY } from "./ch40";
import type { ChapterSpec, Highlighter } from "./types";

/** the running example and its translation; `to` = which Korean word each English word comes from */
export const KO = ["나는", "오늘", "학교에", "간다"];
export const EN = ["I", "go", "to", "school", "today"];
export const EN_FROM = [0, 3, 2, 2, 1];
export const KO_COLORS: Highlighter[] = ["mint", "sky", "violet", "yellow"];

// --- toy bottleneck (설명용 장난감 모델) ---
// Every phrase leaves a trace on the one summary note; the trace fades ×0.8 for each Korean word read after it (41장).
// Traces weaker than KEEP_MIN are lost, and the decoder cannot write them.
export type Phrase = { ko: string; en: string; enPos: number; fixed?: boolean };
export const PHRASES: Phrase[] = [
  { ko: "어제", en: "yesterday", enPos: 6 },
  { ko: "나는", en: "I", enPos: 0 },
  { ko: "친구와 함께", en: "with my friend", enPos: 3 },
  { ko: "도서관에서", en: "at the library", enPos: 4 },
  { ko: "수학 숙제를", en: "math homework", enPos: 2 },
  { ko: "했다", en: "did", enPos: 1, fixed: true },
];
export const KEEP_MIN = 0.3;
export const NOTE_SLOTS = 4;

const wordCount = (p: Phrase) => p.ko.split(" ").length;

/** strength of each chosen phrase's trace on the final note, and the decoder's output with lost phrases as "???" */
export function squeeze(on: boolean[], attention = false) {
  const chosen = PHRASES.map((p, i) => ({ p, i })).filter(({ i }) => on[i]);
  const words = chosen.reduce((a, { p }) => a + wordCount(p), 0);
  let after = words;
  const traces = chosen.map(({ p, i }) => {
    after -= wordCount(p);
    const s = DECAY ** after;
    return { i, p, s, kept: attention || s >= KEEP_MIN };
  });
  const out = [...traces].sort((a, b) => a.p.enPos - b.p.enPos).map((t) => (t.kept ? t.p.en : "???"));
  return { words, traces, out, lost: traces.filter((t) => !t.kept).map((t) => t.p.ko) };
}
export const ALL_ON = PHRASES.map(() => true);
export const FULL = squeeze(ALL_ON);
export const CORRECT = [...PHRASES].sort((a, b) => a.enPos - b.enPos).map((p) => p.en);

export const ch42: ChapterSpec = {
  id: 42,
  part: 4,
  title: "번역기의 구조",
  core: false,
  hook: "순서도 길이도 다른 두 언어를, AI는 어떻게 번역할까요?",
  steps: [
    { id: "s1", sec: 10, narration: "'나는 오늘 학교에 간다'는 영어로 'I go to school today'. 순서도 단어 수도 달라서 하나씩 바꿀 수 없어요." },
    { id: "s2", sec: 11, narration: "2014년 서츠케버(Sutskever) 연구팀은 RNN 두 개를 이었어요. 읽는 인코더와 쓰는 디코더, 이걸 seq2seq라고 해요." },
    { id: "s3", sec: 9, narration: "인코더는 한국어를 한 단어씩 읽으며 쪽지를 고쳐 써요. 마지막 쪽지에 문장 전체의 뜻이 담겨요." },
    { id: "s4", sec: 10, narration: "디코더는 그 쪽지를 받아 영어를 한 단어씩 써요. 쓴 단어는 다시 입력으로 들어가요. 2장의 자기회귀와 같아요." },
    { id: "s5", sec: 11, narration: "그런데 쪽지 크기는 정해져 있어요. 네 단어든 마흔 단어든, 문장 전체를 같은 크기의 쪽지 하나에 꾹 눌러 담아야 해요." },
    { id: "s6", sec: 10, narration: "이게 병목이에요. 병의 좁은 목으로 모든 뜻이 지나가야 하죠. 그래서 문장이 길수록 번역이 나빠졌어요." },
    { id: "s7", sec: 9, narration: "디코더가 단어를 쓸 때마다 원문을 다시 볼 수 있다면 어떨까요? 그 아이디어가 43장의 어텐션이에요." },
  ],
  playgroundTitle: "꾹 눌러 담기",
  playgroundIntro: "문장에 넣을 부분을 골라 보세요. 문장이 길어질수록 한 장짜리 요약 쪽지에서 앞부분의 흔적이 옅어지고, 번역에서 빠져요.",
  summary: [
    "seq2seq(2014): 인코더 RNN이 읽고, 디코더 RNN이 한 단어씩 쓴다.",
    "인코더는 문장 전체를 정해진 크기의 쪽지(벡터) 하나에 담아 넘긴다.",
    "병목: 문장이 길수록 쪽지 하나에 다 못 담아서 번역이 나빠진다.",
  ],
  unlocks: "2014 seq2seq",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "seq2seq 번역기에서 인코더와 디코더가 하는 일은?",
      choices: ["인코더는 원문을 읽어 쪽지에 담고, 디코더는 그 쪽지로 번역문을 쓴다", "둘 다 원문을 읽기만 한다", "인코더가 번역문을 쓰고, 디코더가 검사한다"],
      answer: 0,
      explain: "읽는 쪽(인코더)과 쓰는 쪽(디코더), RNN 두 개를 이어 붙인 구조예요.",
      review: "s2",
    },
    {
      q: "디코더가 영어를 쓰는 방식은?",
      choices: ["모든 단어를 한꺼번에 쓴다", "한 단어씩 쓰고, 쓴 단어를 다시 입력으로 넣는다", "한국어 단어 순서대로 하나씩 바꾼다"],
      answer: 1,
      explain: "2장에서 본 자기회귀와 같아요. 〈끝〉이 나올 때까지 한 단어씩 써요.",
      review: "s4",
    },
    {
      q: "seq2seq의 '병목'이란?",
      choices: ["단어 사전이 너무 작은 것", "디코더가 너무 느린 것", "문장 전체를 크기가 정해진 쪽지 하나에 눌러 담아야 하는 것"],
      answer: 2,
      explain: "길든 짧든 쪽지 하나로만 넘겨서, 긴 문장일수록 뜻이 빠져요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "42장 번역기의 구조",
    diff: "순서도, 단어 수도 달라요",
    noOneByOne: "하나씩 바꾸면 안 돼요",
    year: "2014 · 서츠케버(Sutskever) 연구팀",
    s2s: "seq2seq",
    s2sD: "sequence to sequence: 단어 줄 → 단어 줄",
    enc: "인코더",
    encD: "읽는 쪽 RNN",
    dec: "디코더",
    decD: "쓰는 쪽 RNN",
    summary: "요약 쪽지",
    start: "〈시작〉",
    end: "〈끝〉",
    whole: "문장 전체의 뜻",
    auto: "쓴 단어가 다시 입력으로 (2장 자기회귀)",
    fixed: "쪽지 크기는 항상 같아요",
    slots: "숫자 4칸",
    both: "짧은 문장도 긴 문장도 똑같이 숫자 4칸",
    correct: "정답:",
    real: "* 실제로는 숫자 수백~수천 개지만, 크기가 정해진 건 같아요",
    squeeze: "꾹!",
    bottleneck: "병목 (bottleneck)",
    longer: "길수록 번역이 나빠져요",
    longKo: "어제 나는 친구와 함께 도서관에서 수학 숙제를 했다",
    demo: "* 설명용 장난감 모델",
    lostLabel: "빠진 뜻",
    ask: "쓸 때마다 원문을 다시 볼 수 있다면?",
    next: "43장: 어텐션의 탄생",
  },
};
