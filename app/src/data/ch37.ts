import type { ChapterSpec, Highlighter } from "./types";

/** Illustrative probabilities (설명용 예시). Each one is "the chance of this word, given every word before it". */
export const CHAIN: { w: string; p: number; c: Highlighter }[] = [
  { w: "나는", p: 0.2, c: "mint" },
  { w: "오늘", p: 0.25, c: "sky" },
  { w: "학교에", p: 0.1, c: "violet" },
  { w: "간다", p: 0.52, c: "yellow" },
];
/** the same prefix ending in 피자 instead (1%, as in ch01) */
export const PIZZA = { w: "피자", p: 0.01, c: "pink" as Highlighter };

export const NOVEL = ["나는 오늘 비를 맞으며 학교에 뛰어갔다", "우리 반 고양이가 급식을 먹는다"];

/** Format a probability as a percent with two significant digits, without scientific notation. */
export function fmtPct(p: number) {
  const v = p * 100;
  if (v >= 10) return `${Math.round(v)}%`;
  const decimals = Math.min(20, Math.max(0, 1 - Math.floor(Math.log10(v))));
  let s = v.toFixed(decimals);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return `${s}%`;
}

// --- the playground's toy language model (설명용 예시) ---
// Five words; the chance of the next word depends on the whole prefix, like a real language model.
export const LM_WORDS = ["나는", "오늘", "학교에", "간다", "피자"] as const;
export const LM_COLORS: Record<string, Highlighter> = { 나는: "mint", 오늘: "sky", 학교에: "violet", 간다: "yellow", 피자: "pink" };

function rule(prefix: string[], w: string): number {
  const k = prefix.length;
  const has = (x: string) => prefix.includes(x);
  const last = prefix[k - 1];
  const key = prefix.join(" ");
  if (has("피자")) return 0.01; // the sentence is already strange
  if (w === "피자") return k === 0 ? 0.01 : has("간다") ? 0.002 : last === "학교에" ? 0.01 : 0.005;
  if (has("간다")) return w === "나는" || w === "오늘" ? 0.01 : 0.002; // the sentence already ended
  const table: Record<string, Record<string, number>> = {
    나는: { "": 0.2, 오늘: 0.2, 학교에: 0.1, "오늘 학교에": 0.04, "학교에 오늘": 0.05 },
    오늘: { "": 0.15, 나는: 0.25, 학교에: 0.08, "나는 학교에": 0.03, "학교에 나는": 0.05 },
    학교에: { "": 0.03, 나는: 0.08, 오늘: 0.06, "나는 오늘": 0.1, "오늘 나는": 0.1 },
  };
  if (w === "간다") {
    if (has("학교에")) {
      if (last === "학교에") return k === 3 ? 0.52 : k === 2 ? (prefix[0] === "나는" ? 0.3 : 0.2) : 0.15;
      return k === 3 ? (last === "오늘" ? 0.45 : 0.4) : 0.25;
    }
    return ({ "": 0.005, 나는: 0.02, 오늘: 0.005, "나는 오늘": 0.02, "오늘 나는": 0.02 } as Record<string, number>)[key];
  }
  return table[w][key];
}

/** Candidates for the next word after `prefix` (words are used once each); `rest` = every other word in the language. */
export function nextProbs(prefix: string[]) {
  const options = LM_WORDS.filter((w) => !prefix.includes(w)).map((w) => ({ w, p: rule(prefix, w) }));
  const rest = 1 - options.reduce((a, o) => a + o.p, 0);
  return { options, rest };
}

export function sentenceProb(words: string[]) {
  let p = 1;
  const factors: number[] = [];
  words.forEach((w, i) => {
    const f = nextProbs(words.slice(0, i)).options.find((o) => o.w === w)!.p;
    factors.push(f);
    p *= f;
  });
  return { p, factors };
}

export const ch37: ChapterSpec = {
  id: 37,
  part: 4,
  title: "언어 모델 = 문장의 확률",
  core: false,
  hook: "AI는 어떤 문장이 '자연스럽다'는 걸 어떻게 알까요?",
  steps: [
    { id: "s1", sec: 9, narration: "두 문장을 볼게요. '나는 오늘 학교에 간다'와 '나는 오늘 학교에 피자'. 어느 쪽이 더 자연스러운가요?" },
    { id: "s2", sec: 9, narration: "언어 모델은 문장마다 '얼마나 나올 법한지'를 확률로 매기는 기계예요. ChatGPT도 언어 모델이에요." },
    { id: "s3", sec: 10, narration: "그런데 문장을 통째로 세기는 어려워요. 처음 보는 문장이 너무 많거든요. 그래서 단어 하나씩 쪼개요." },
    { id: "s4", sec: 10, narration: "첫 단어가 '나는'일 확률, 그 뒤에 '오늘'이 올 확률… 앞 단어들을 보고 다음 단어의 확률을 하나씩 구해요." },
    { id: "s5", sec: 9, narration: "이 확률들을 차례로 곱하면 문장의 확률이에요. 20% × 25% × 10% × 52% = 0.26%." },
    { id: "s6", sec: 10, narration: "'피자' 문장은 마지막만 1%라서 0.005%예요. 앞은 똑같은데, 마지막 한 단어 때문에 52배나 차이 나요." },
    { id: "s7", sec: 10, narration: "그러니 다음 단어를 잘 맞히는 모델이 문장의 확률도 잘 매겨요. 1장의 '다음 단어 맞히기'가 바로 이거예요." },
    { id: "s8", sec: 9, narration: "그럼 이 확률들은 어디서 구할까요? 가장 쉬운 방법은 세어 보기예요. 38장에서 직접 세어 봐요." },
  ],
  playgroundTitle: "문장 확률 계산기",
  playgroundIntro: "단어를 하나씩 골라 네 단어짜리 문장을 만들어 보세요. 고를 때마다 그 단어의 확률이 곱해져요. 확률이 가장 높은 문장은 뭘까요?",
  summary: [
    "언어 모델: 문장이 얼마나 나올 법한지 확률로 매기는 기계.",
    "문장의 확률 = 앞 단어들을 보고 구한 다음 단어 확률을 차례로 곱한 것.",
    "다음 단어를 잘 맞히는 모델 = 문장의 확률을 잘 매기는 모델(1장).",
  ],
  unlocks: "언어 모델",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "문장의 확률은 어떻게 구할까요?",
      choices: ["단어마다 확률을 모두 더한다", "다음 단어의 확률을 차례로 곱한다", "단어 수로 나눈다"],
      answer: 1,
      explain: "첫 단어의 확률 × 그다음 단어의 확률 × … 이렇게 차례로 곱해요.",
      review: "s5",
    },
    {
      q: "앞 세 단어는 똑같고, 마지막 단어의 확률만 52%와 1%로 다르다면 두 문장의 확률은 몇 배 차이 날까요?",
      choices: ["52배", "51배", "2배"],
      answer: 0,
      explain: "똑같은 앞부분은 양쪽에 똑같이 곱해지니까, 마지막 확률의 비율 52 ÷ 1 = 52배만 남아요.",
      review: "s6",
    },
    {
      q: "문장 끝에 단어를 하나 더 붙이면, 그 문장의 확률은 보통 어떻게 될까요?",
      choices: ["커진다", "항상 1이 된다", "작아진다"],
      answer: 2,
      explain: "확률은 1보다 작으니까, 하나 더 곱할수록 작아져요. 그래서 긴 문장은 확률이 아주 작아요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "37장 언어 모델 = 문장의 확률",
    which: "어느 쪽이 더 자연스러울까?",
    lm: "언어 모델",
    lmEn: "Language Model",
    inSent: "문장",
    outProb: "확률",
    high: "높다",
    low: "낮다",
    chatgpt: "ChatGPT도 언어 모델!",
    whole: "문장을 통째로 세면?",
    novel: "처음 보는 문장",
    tooMany: "처음 보는 문장이 끝없이 많아요",
    split: "단어 하나씩 쪼개기!",
    demo: "* 설명용 예시",
    first: "첫 단어가 '나는'",
    look: "앞 단어들을 보고",
    times: "×",
    vs: "vs",
    eq: "=",
    smaller: "곱할수록 작아져요",
    same: "앞부분은 똑같아요",
    was: "'간다'일 때",
    now: "'피자'일 때",
    ratio: "배 차이!",
    rule: "다음 단어를 잘 맞히기 = 문장의 확률을 잘 매기기",
    prefix: "나는 오늘 학교에",
    ch01: "1장의 다음 단어 맞히기",
    gaws: "갔다",
    late: "늦었다",
    mult: "이 확률들을 곱하면 문장의 확률!",
    where: "이 확률은 어디서 구할까?",
    count: "직접 세어 보기!",
    next: "38장: 앞 몇 단어만 보기",
  },
};
