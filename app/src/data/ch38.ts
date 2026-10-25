import type { ChapterSpec } from "./types";

/** A small original corpus (말뭉치) written for this chapter. Words are split on spaces (어절). */
export const CORPUS = [
  "나는 오늘 학교에 간다",
  "나는 어제 학교에 늦었다",
  "나는 아침에 학교에 간다",
  "동생은 오늘 학교에 간다",
  "친구는 오늘 학원에 간다",
  "친구는 어제 학원에 늦었다",
  "고양이는 오늘 소파에서 잔다",
  "고양이는 어제 소파에서 잤다",
  "고양이는 생선을 맛있게 먹었다",
  "고양이는 집에서 낮잠을 잤다",
  "나는 점심에 급식을 맛있게 먹었다",
  "친구는 급식을 빨리 먹었다",
  "동생은 급식을 몰래 남겼다",
  "선생님은 아침에 교실에서 책을 읽었다",
  "선생님은 오늘 숙제를 냈다",
  "나는 집에서 숙제를 했다",
  "나는 도서관에서 책을 읽었다",
  "친구는 운동장에서 축구를 했다",
  "나는 어제 운동장에서 축구를 했다",
  "동생은 집에서 낮잠을 잤다",
  "친구는 도서관에서 숙제를 했다",
  "선생님은 교실에서 노래를 불렀다",
  "나는 오늘 일찍 잔다",
  "동생은 아침에 늦게 일어났다",
];

export const START = "〈시작〉";
export const END = "〈끝〉";

export const TOKENS = CORPUS.map((s) => [START, ...s.split(" "), END]);

/** How many times the word sequence `seq` appears in the corpus (sentence edges count as tokens). */
export function countSeq(seq: string[]) {
  let n = 0;
  for (const t of TOKENS)
    for (let i = 0; i + seq.length <= t.length; i++) if (seq.every((w, k) => t[i + k] === w)) n++;
  return n;
}

/** Next-word counts after the context `ctx` (the last 1 word for a 2-gram, the last 2 for a 3-gram), most frequent first. */
export function followers(ctx: string[]) {
  const counts = new Map<string, number>();
  for (const t of TOKENS)
    for (let i = 0; i + ctx.length < t.length; i++)
      if (ctx.every((w, k) => t[i + k] === w)) counts.set(t[i + ctx.length], (counts.get(t[i + ctx.length]) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()].map(([w, c]) => ({ w, c, p: c / total })).sort((a, b) => b.c - a.c);
}

/** The sentence the scene builds from the 2-gram table (every pair appears in the corpus). */
export const PATH = ["고양이는", "어제", "운동장에서", "축구를", "했다"];
/** rows of the pair table shown in the scene */
export const TABLE_ROWS = [START, ...PATH];

export const ch38: ChapterSpec = {
  id: 38,
  part: 4,
  title: "앞 몇 단어만 보기",
  core: false,
  hook: "옛날 AI는 '다음 단어의 확률'을 어떻게 알아냈을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "확률을 구하는 가장 쉬운 방법은 세어 보기예요. 먼저 문장을 잔뜩 모은 공책, 말뭉치(corpus)가 필요해요." },
    { id: "s2", sec: 10, narration: "'나는 오늘 학교에' 뒤를 세려면 이 세 단어가 통째로 나와야 해요. 딱 한 번뿐이고, '고양이는 오늘 학교에'는 0번이에요." },
    { id: "s3", sec: 9, narration: "그래서 꾀를 내요. 바로 앞 한 단어만 보는 거예요. '학교에' 다음에 무엇이 왔는지만 세면 돼요." },
    { id: "s4", sec: 9, narration: "'학교에' 다음엔 '간다'가 3번, '늦었다'가 1번. 그러니 '간다'는 4번 중 3번, 75%예요." },
    { id: "s5", sec: 10, narration: "모든 단어마다 이렇게 세면 짝 빈도표가 돼요. 앞 단어 몇 개만 보는 이 방법을 n-gram이라고 불러요." },
    { id: "s6", sec: 9, narration: "이 표만 보고 문장을 지어 볼게요. 1948년 섀넌도 이렇게 영어 문장을 지어 봤어요." },
    { id: "s7", sec: 10, narration: "짝끼리는 다 자연스러운데, 문장은 이상하죠? 바로 앞 단어만 보니, 주인공이 고양이란 걸 잊었어요." },
    { id: "s8", sec: 10, narration: "앞을 더 길게 보면 어떨까요? 긴 단어 줄일수록 말뭉치에 거의 없어서 0번이 돼요. 이걸 39장의 신경망이 풀어요." },
  ],
  playgroundTitle: "짝 빈도표로 문장 짓기",
  playgroundIntro: "24문장짜리 말뭉치에서 센 짝 빈도표로 문장을 지어요. 후보를 직접 고르거나 '확률대로 뽑기'를 눌러 보세요. 말뭉치에 없던 새 문장이 나올까요?",
  summary: [
    "n-gram: 앞 단어 몇 개만 보고, 말뭉치에서 다음 단어를 세어 확률을 정한다.",
    "짝끼리는 자연스러워도, 앞 내용을 잊어서 문장 전체는 엉뚱해지기 쉽다.",
    "앞을 길게 보면 그런 단어 줄이 말뭉치에 거의 없어서 0번이 된다.",
  ],
  unlocks: "n-gram",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "말뭉치에서 '학교에' 다음에 '간다'가 3번, '늦었다'가 1번 나왔어요. 2-gram이 매기는 '간다'의 확률은?",
      choices: ["3%", "75%", "33%"],
      answer: 1,
      explain: "'학교에' 뒤에 온 단어는 모두 4번, 그중 '간다'가 3번이니까 3 ÷ 4 = 75%예요.",
      review: "s4",
    },
    {
      q: "2-gram으로 지은 문장이 자주 엉뚱해지는 이유는?",
      choices: ["바로 앞 한 단어만 보고 다음 단어를 고르니까", "단어를 무작위로 고르니까", "말뭉치에 틀린 문장이 있어서"],
      answer: 0,
      explain: "짝끼리는 말뭉치에서 본 대로 자연스럽지만, 더 앞의 내용(주인공, 때)은 보지 않아요.",
      review: "s7",
    },
    {
      q: "앞 단어를 더 많이(예: 4개) 보는 n-gram의 문제는?",
      choices: ["계산이 너무 쉬워진다", "문장이 짧아진다", "그런 긴 단어 줄이 말뭉치에 거의 없어서 0번이 많다"],
      answer: 2,
      explain: "단어 줄이 길수록 똑같이 나온 적이 드물어서, 셀 게 없어요. 39장의 신경망이 이 문제를 풀어요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "38장 앞 몇 단어만 보기",
    corpus: "말뭉치 (corpus)",
    more: "… 모두 24문장",
    count: "세어 보기!",
    times: "번",
    only: "딱 한 번",
    zero: "0번",
    trick: "바로 앞 한 단어만 보기",
    after: "'학교에' 다음에 온 단어",
    total: "모두 4번",
    pairTitle: "짝 빈도표",
    gram2: "앞 1단어 → 2-gram",
    gram3: "앞 2단어 → 3-gram",
    rowsMore: "… 단어마다 한 줄씩",
    shannon: "1948년 섀넌도 이렇게!",
    pairOk: "짝은 다 자연스러운데…",
    huh: "고양이가 축구를?!",
    forgot: "바로 앞만 보니 주인공을 잊었어요",
    look1: "앞 1단어",
    look2: "앞 2단어",
    look3: "앞 3단어",
    longer: "길게 볼수록 셀 게 없어요",
    next: "39장: 신경망 언어 모델",
    arrow: "→",
  },
};
