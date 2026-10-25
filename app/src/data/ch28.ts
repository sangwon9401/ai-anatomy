import type { ChapterSpec, Highlighter } from "./types";

// Hangul jamo in Unicode order: the index of each one goes into the syllable formula
export const CHO = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"]; // 19 첫소리
export const JUNG = [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"]; // 21 가운뎃소리
export const JONG = ["", ..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"]; // 28 끝소리, 0 = 받침 없음

export const HANGUL_BASE = 44032; // '가' = U+AC00
export const compose = (cho: number, jung: number, jong: number) => HANGUL_BASE + (cho * 21 + jung) * 28 + jong;
export const decompose = (code: number): [number, number, number] | null => {
  const n = code - HANGUL_BASE;
  if (n < 0 || n > 11171) return null;
  return [Math.floor(n / 588), Math.floor((n % 588) / 28), n % 28];
};
/** UTF-8 bytes of one character (what the computer actually stores) */
export const utf8 = (ch: string) => [...new TextEncoder().encode(ch)];

// s2: one table for every script (code points checked with a script)
export const WORLD: { ch: string; code: number; c: Highlighter }[] = [
  { ch: "A", code: 65, c: "sky" },
  { ch: "中", code: 20013, c: "mint" },
  { ch: "가", code: 44032, c: "yellow" },
  { ch: "😀", code: 128512, c: "pink" },
];

// s7: neighbours of '가' by number
export const NEXT_TO_GA = [
  { ch: "가", code: 44032 },
  { ch: "각", code: 44033 },
  { ch: "갂", code: 44034 },
  { ch: "갃", code: 44035 },
  { ch: "간", code: 44036 },
];

export const ch28: ChapterSpec = {
  id: 28,
  part: 3,
  title: "컴퓨터 속 글자",
  core: false,
  hook: "한글은 11,172자나 되는데, 컴퓨터는 그 번호를 하나하나 외워서 붙였을까요?",
  steps: [
    { id: "s1", sec: 7.5, narration: "6장에서 글자마다 번호가 있다고 했죠. '가'는 44032번. 오늘은 이 번호가 어떻게 정해지는지 봐요." },
    { id: "s2", sec: 9.5, narration: "유니코드는 세계의 글자에 번호를 붙인 표예요. 'A'는 65, '中'은 20013, 웃는 이모지는 128512. 15만 자가 넘어요." },
    { id: "s3", sec: 7.5, narration: "한글은 자음과 모음을 모아 한 글자를 만들어요. '한'은 첫소리 ㅎ, 가운뎃소리 ㅏ, 끝소리 ㄴ이 모인 글자예요." },
    { id: "s4", sec: 9, narration: "첫소리 19개, 가운뎃소리 21개, 끝소리는 받침 없음까지 28가지. 곱하면 11,172자. 유니코드엔 전부 들어 있어요." },
    { id: "s5", sec: 8.5, narration: "번호는 외운 게 아니라 공식으로 정해져요. '가'의 번호 44032에서 출발해, 소리마다 붙은 번호를 넣어 계산해요." },
    { id: "s6", sec: 8.5, narration: "ㅎ은 18번, ㅏ는 0번, ㄴ은 4번. 넣어 보면 44032 + 10584 + 4 = 54620. 진짜 '한'의 번호와 똑같아요." },
    { id: "s7", sec: 8.5, narration: "그래서 번호가 1 늘면 받침이 바뀌어요. 가, 각, 갂, 갃, 간. 28 늘면 모음이, 588 늘면 첫소리가 바뀌어요." },
    { id: "s8", sec: 9, narration: "저장 칸 하나(바이트)엔 0~255만 들어가서, 큰 번호는 나눠 적어요. 'A'는 1칸, '한'은 3칸. 이 바이트가 토큰의 재료예요." },
  ],
  playgroundTitle: "한글 조립기",
  playgroundIntro: "첫소리, 가운뎃소리, 끝소리를 하나씩 눌러 글자를 조립해 보세요. 번호가 공식대로 계산되는 걸 볼 수 있어요.",
  summary: [
    "유니코드: 세계의 글자마다 번호를 붙인 표. 'A' 65, '가' 44032.",
    "한글 번호 = 44032 + (첫소리 × 21 + 가운뎃소리) × 28 + 끝소리.",
    "저장할 땐 0~255 숫자(바이트)로 나눠 적는다. 한글 한 글자 = 3바이트.",
  ],
  unlocks: "유니코드",
  unlockLabel: "언어 도구를 하나 얻었어요",
  quiz: [
    {
      q: "한글 글자는 모두 몇 자가 만들어질 수 있을까요?",
      choices: ["2,350자", "11,172자", "68자"],
      answer: 1,
      explain: "첫소리 19 × 가운뎃소리 21 × 끝소리 28 = 11,172자예요.",
      review: "s4",
    },
    {
      q: "'가'(44032) 바로 다음 번호 44033은 어떤 글자일까요?",
      choices: ["나", "개", "각"],
      answer: 2,
      explain: "번호가 1 늘면 끝소리(받침)가 바뀌어요. 받침 없음 → ㄱ, 그래서 '각'이에요.",
      review: "s7",
    },
    {
      q: "'한'을 저장하려면 바이트가 몇 개 필요할까요?",
      choices: ["3개", "1개", "54620개"],
      answer: 0,
      explain: "바이트 하나엔 0~255만 들어가요. 한글 한 글자는 237, 149, 156처럼 3바이트로 나눠 적어요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "28장 컴퓨터 속 글자",
    recap: "6장: 글자마다 번호가 있다",
    how: "이 번호는 어떻게 정할까?",
    unicode: "유니코드 = 세계 글자 번호표",
    many: "15만 자가 넘어요",
    cho: "첫소리",
    jung: "가운뎃소리",
    jong: "끝소리",
    none: "없음",
    han: "한",
    eq: "ㅎ + ㅏ + ㄴ = 한",
    total: "19 × 21 × 28 = 11,172",
    all: "한글 11,172자 전부 번호가 있어요",
    num: "번호",
    start: "'가'의 번호에서 출발",
    formula: "공식으로 정해져요",
    calc1: "(18 × 21 + 0) × 28 = 10584",
    calc2: "44032 + 10584 + 4 = 54620",
    real: "진짜 '한' = 54620",
    plus1: "+1 → 받침이 바뀜",
    vowel: "모음이 바뀜",
    first: "첫소리가 바뀜",
    ga: "가",
    gae: "개",
    kka: "까",
    byte: "바이트 = 0~255가 들어가는 칸",
    one: "1칸",
    three: "3칸",
    split: "큰 번호는 나눠 적어요 (UTF-8)",
    material: "이 바이트가 토큰의 재료 (29장)",
    jamo: "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣㄳㄵㄶㄺㄻㄼㄽㄾㄿㅀㅄ",
    chars: "A中가😀각갂갃간",
  },
};
