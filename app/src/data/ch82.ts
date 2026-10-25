import type { ChapterSpec, Highlighter } from "./types";

export type Cand = { w: string; p: number; c: Highlighter | null };

// "나는 오늘 학교에 ___" with ch01's numbers; ch01's 기타 5% is split into 왔다 3% and "그 밖의 수만 개" 2% (illustrative).
// The odd tail = 피자 1% + 그 밖의 수만 개 2% = 3%.
export const DIST82: Cand[] = [
  { w: "간다", p: 0.52, c: "yellow" },
  { w: "갔다", p: 0.21, c: "mint" },
  { w: "늦었다", p: 0.12, c: "sky" },
  { w: "가기", p: 0.09, c: "violet" },
  { w: "왔다", p: 0.03, c: "orange" },
  { w: "피자", p: 0.01, c: "pink" },
  { w: "기타", p: 0.02, c: null },
];
export const TAIL = 0.03;
export const TAIL_RUN = 100; // 1 − 0.97^100 ≈ 0.952

// s6: when the model is sure vs unsure (illustrative)
export const SURE: Cand[] = [
  { w: "9", p: 0.92, c: "yellow" },
  { w: "8", p: 0.04, c: "mint" },
  { w: "11", p: 0.02, c: "sky" },
  { w: "10", p: 0.01, c: "violet" },
  { w: "13", p: 0.01, c: "pink" },
];
export const UNSURE: Cand[] = [
  { w: "사과", p: 0.24, c: "yellow" },
  { w: "딸기", p: 0.21, c: "mint" },
  { w: "바나나", p: 0.17, c: "sky" },
  { w: "포도", p: 0.14, c: "violet" },
  { w: "수박", p: 0.11, c: "orange" },
  { w: "복숭아", p: 0.09, c: "pink" },
  { w: "의자", p: 0.04, c: null },
];
export const PRESETS82 = [
  { key: "school", name: "나는 오늘 학교에", items: DIST82 },
  { key: "sure", name: "1, 3, 5, 7,", items: SURE },
  { key: "unsure", name: "내가 좋아하는 과일은", items: UNSURE },
];

/** How many candidates each rule keeps (lists are sorted from most to least likely). */
export const keepTopK = (items: Cand[], k: number) => Math.min(k, items.length);
export function keepTopP(items: Cand[], p: number) {
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += items[i].p;
    if (acc >= p - 1e-9) return i + 1;
  }
  return items.length;
}
/** Probabilities after cutting to the first n and sharing out again so they add up to 1. */
export function renorm(items: Cand[], n: number) {
  const s = items.slice(0, n).reduce((a, b) => a + b.p, 0);
  return items.map((it, i) => (i < n ? it.p / s : 0));
}

export const PIPE = [
  { a: "점수", b: "" },
  { a: "÷ 온도", b: "81장" },
  { a: "소프트맥스", b: "14장" },
  { a: "꼬리 자르기", b: "82장" },
  { a: "룰렛 돌리기", b: "80장" },
  { a: "다음 조각!", b: "" },
];

export const ch82: ChapterSpec = {
  id: 82,
  part: 9,
  title: "후보 줄이기",
  core: false,
  hook: "룰렛에 '피자' 칸이 있으면, 언젠가는 정말 '피자'가 뽑히지 않을까요?",
  steps: [
    { id: "s1", sec: 7, narration: "샘플링에는 함정이 있어요. 후보는 수만 개라서, 아주 작은 막대들도 다 모으면 꼬리가 꽤 두꺼워져요." },
    { id: "s2", sec: 8, narration: "꼬리가 3%뿐이어도, 100조각짜리 답을 쓰면 어딘가 한 번은 엉뚱한 말이 섞일 확률이 95%나 돼요." },
    { id: "s3", sec: 8, narration: "그래서 꼬리를 잘라요. 첫째, Top-k. 확률 순서로 위에서 k개만 남겨요. k가 3이면 세 개만 남죠." },
    { id: "s4", sec: 9, narration: "남은 85%를 다시 나눠서 합을 1로 맞춰요. 간다 61.2%, 갔다 24.7%, 늦었다 14.1%. 이제 룰렛을 돌려요." },
    { id: "s5", sec: 9, narration: "둘째, Top-p. 위에서부터 확률을 더해 가다가 p, 예를 들어 90%를 넘는 순간 멈추고 나머지를 잘라요." },
    { id: "s6", sec: 9, narration: "Top-k는 늘 3개를 남기지만, Top-p는 모델이 확신하면 1개, 헷갈리면 6개처럼 상황에 맞춰 남겨요." },
    { id: "s7", sec: 9, narration: "정리하면, 점수를 온도로 나누고, 소프트맥스로 확률을 만들고, 꼬리를 자르고, 룰렛을 돌려요. 이게 조각 하나가 뽑히는 길이에요." },
  ],
  playgroundTitle: "꼬리 자르기 실험실",
  playgroundIntro: "문장을 고르고 Top-k나 Top-p로 후보를 잘라 보세요. 남은 후보로 룰렛을 돌리면 무엇이 뽑힐까요?",
  summary: [
    "후보가 수만 개라, 작은 꼬리도 모이면 엉뚱한 말이 뽑힐 수 있다.",
    "Top-k는 위에서 k개만, Top-p는 위에서부터 더해 p를 넘을 때까지 남긴다.",
    "자른 뒤 남은 것끼리 다시 나눠 합을 1로 맞추고, 룰렛을 돌린다.",
  ],
  unlocks: "Top-k · Top-p",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "Top-k에서 k = 2로 정하면?",
      choices: ["확률이 2%보다 큰 후보만 남긴다", "룰렛을 두 번 돌려서 고른다", "확률 1등과 2등만 남기고 나머지는 자른다"],
      answer: 2,
      explain: "Top-k는 확률 순서로 위에서 k개만 남겨요.",
      review: "s3",
    },
    {
      q: "확률이 [60%, 25%, 10%, 5%]인 후보에 Top-p(p = 80%)를 쓰면 몇 개가 남을까요?",
      choices: ["1개", "2개", "4개"],
      answer: 1,
      explain: "위에서부터 더하면 60%, 85%. 두 번째에서 80%를 넘으니 2개가 남아요.",
      review: "s5",
    },
    {
      q: "모델이 아주 확신할 때(1등이 92%) Top-p(90%)는 후보를 몇 개 남길까요?",
      choices: ["1등 하나", "늘 3개", "모든 후보"],
      answer: 0,
      explain: "1등 하나만으로 이미 90%를 넘어요. Top-p는 분포 모양에 맞춰 남기는 개수가 바뀌어요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "82장 후보 줄이기",
    example: "설명용 예시 확률",
    tailNote: "기타 = 수만 개 조각을 합친 것",
    tail: "엉뚱한 꼬리 = 3%",
    long: "100조각짜리 답을 쓴다면",
    avoid: "꼬리를 100번 연속 피할 확률",
    mult: "0.97 × 0.97 × … × 0.97",
    times: "100번",
    approx: "≈ 0.05",
    once: "한 번이라도 꼬리가 뽑힐 확률 ≈ 95%",
    calc: "* 설명용 계산",
    way1: "방법 1",
    way2: "방법 2",
    topk: "Top-k",
    k3: "k = 3",
    topkNote: "위에서 k개만!",
    snip: "싹둑!",
    renorm: "÷ 0.85 → 합이 다시 1",
    topp: "Top-p",
    p90: "p = 90%",
    toppNote: "더해서 90%를 넘을 때까지",
    sum: "더한 값",
    over: "90% 넘음!",
    toppRenorm: "남은 4개로 다시 나누면 55.3 · 22.3 · 12.8 · 9.6%",
    sureQ: "1, 3, 5, 7, ___",
    unsureQ: "내가 좋아하는 과일은 ___",
    sure: "확신할 때",
    unsure: "헷갈릴 때",
    kLine: "Top-k",
    pLine: "Top-p",
    keepSure: "Top-k 3개 · Top-p 1개",
    keepUnsure: "Top-k 3개 · Top-p 6개",
    adapt: "Top-p는 상황 따라 늘었다 줄었다!",
    pipeTitle: "조각 하나가 뽑히는 길",
    again: "다음 조각을 붙이고 다시 처음부터 (2장)",
  },
};
