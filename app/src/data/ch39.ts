import type { ChapterSpec, Highlighter } from "./types";

// --- a tiny neural language model (설명용 예시) ---
// Each word has a hand-placed 2-number vector. A small network (2 → 3 tanh neurons → 8 scores → softmax)
// was trained on the imaginary counts below with a script; "강아지가" was never in the training data.
export const NEXT = ["잔다", "먹는다", "달린다", "공부한다", "가르친다", "온다", "분다", "그친다"] as const;
export const NEXT_COLORS: Highlighter[] = ["yellow", "mint", "sky", "violet", "violet", "orange", "orange", "pink"];

export type ToyWord = { w: string; e: [number, number]; group: string; counts?: Record<string, number> };
export const KNOWN: ToyWord[] = [
  { w: "고양이가", e: [-0.6, 0.5], group: "동물", counts: { 잔다: 9, 먹는다: 6, 달린다: 4, 공부한다: 1 } },
  { w: "학생이", e: [0.5, 0.6], group: "사람", counts: { 공부한다: 10, 잔다: 4, 먹는다: 3, 달린다: 3 } },
  { w: "선생님이", e: [0.75, 0.15], group: "사람", counts: { 가르친다: 12, 먹는다: 3, 공부한다: 3, 잔다: 2 } },
  { w: "비가", e: [-0.45, -0.6], group: "날씨", counts: { 온다: 16, 그친다: 4 } },
  { w: "바람이", e: [0.25, -0.75], group: "날씨", counts: { 분다: 16, 그친다: 4 } },
];
export const DOG: ToyWord = { w: "강아지가", e: [-0.32, 0.68], group: "동물" };

const W1 = [
  [-0.716, -2.838],
  [-2.381, 0.377],
  [-3.55, 2.615],
];
const B1 = [-0.508, 0.073, 1.299];
const W2 = [
  [-3.086, 0.777, 0.299],
  [-3.014, 0.753, -0.141],
  [-2.592, 0.083, 3.194],
  [-2.554, -1.216, 0.938],
  [-3.202, -1.034, -3.892],
  [5.054, 1.859, 2.506],
  [4.866, -1.559, -2.692],
  [4.532, 0.337, -0.212],
];
const B2 = [1.449, 1.563, -1.164, 0.961, -1.694, -0.911, -0.802, 1.642];

/** Forward pass: word vector → neuron outputs (−1…1) → scores → probabilities. */
export function nnlm(e: readonly [number, number]) {
  const h = W1.map((r, i) => Math.tanh(r[0] * e[0] + r[1] * e[1] + B1[i]));
  const s = W2.map((r, k) => r.reduce((a, w, i) => a + w * h[i], B2[k]));
  const m = Math.max(...s);
  const ex = s.map((v) => Math.exp(v - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { h, s, p: ex.map((v) => v / sum) };
}

/** The k most likely next words. */
export function top(e: readonly [number, number], k = 3) {
  const { p } = nnlm(e);
  return p
    .map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] }))
    .sort((a, b) => b.p - a.p)
    .slice(0, k);
}

// --- the scene's running example (설명용 예시): three word vectors → scores 3, 2, 1, −1 (ch14) ---
export const CONTEXT: { w: string; v: [number, number]; c: Highlighter }[] = [
  { w: "나는", v: [0.8, 0.1], c: "mint" },
  { w: "오늘", v: [-0.3, 0.9], c: "sky" },
  { w: "학교에", v: [0.5, -0.6], c: "violet" },
];
export const OUTPUTS: { w: string; s: number; c: Highlighter }[] = [
  { w: "간다", s: 3, c: "yellow" },
  { w: "갔다", s: 2, c: "mint" },
  { w: "늦었다", s: 1, c: "sky" },
  { w: "피자", s: -1, c: "pink" },
];
/** an older sentence the fixed window cannot see all of */
export const WINDOW_SENT = ["어제", "나는", "친구와", "함께", "학교에"];

export const ch39: ChapterSpec = {
  id: 39,
  part: 4,
  title: "신경망 언어 모델",
  core: false,
  hook: "한 번도 본 적 없는 문장인데, AI는 어떻게 다음 단어를 짐작할까요?",
  steps: [
    { id: "s1", sec: 10, narration: "n-gram은 '고양이가' 뒤는 많이 세어 봤어도, '강아지가'를 한 번도 못 봤다면 다음 단어를 전혀 몰라요. 0번이니까요." },
    { id: "s2", sec: 10, narration: "2003년, 벤지오(Bengio) 연구팀이 새 방법을 내놓았어요. 신경망으로 다음 단어를 맞히는 신경망 언어 모델이에요." },
    { id: "s3", sec: 9, narration: "먼저 단어마다 숫자 벡터를 줘요. 33장의 임베딩이에요. 비슷하게 쓰이는 단어는 가까운 자리에 놓여요." },
    { id: "s4", sec: 10, narration: "앞 단어 세 개의 벡터를 이어 붙여 신경망에 넣어요. Part 2의 뉴런 층을 지나면 후보 단어마다 점수가 나와요." },
    { id: "s5", sec: 10, narration: "점수는 소프트맥스(14장)로 확률이 돼요. 간다 65.7%, 갔다 24.2%, 늦었다 8.9%, 피자 1.2%." },
    { id: "s6", sec: 10, narration: "강아지 벡터는 고양이 벡터와 가까워서, 신경망을 지나도 비슷한 답이 나와요. 처음 보는 문장도 짐작할 수 있죠." },
    { id: "s7", sec: 10, narration: "학습할 때는 신경망의 가중치와 단어 벡터를 함께 고쳐요. 10년 뒤 Word2Vec(34장)은 이 벡터 만들기에만 집중했어요." },
    { id: "s8", sec: 10, narration: "그래도 한계가 있어요. 여전히 앞 몇 단어만 보는 고정된 창이에요. 문장 전체를 보려면? 40장에서 알아봐요." },
  ],
  playgroundTitle: "단어 자리 옮기기",
  playgroundIntro: "'강아지가'는 학습 문장에 한 번도 없던 단어예요. 노란 점(강아지가의 벡터)을 끌어 옮기면, 신경망이 내놓는 다음 단어 확률이 어떻게 바뀌는지 보세요.",
  summary: [
    "2003년 신경망 언어 모델: 단어 벡터(임베딩) + 신경망으로 다음 단어를 예측.",
    "비슷한 단어 = 가까운 벡터라서, 처음 보는 문장도 그럴듯하게 짐작한다.",
    "학습하면 단어 벡터도 함께 다듬어진다. 한계: 여전히 앞 몇 단어만 보는 창.",
  ],
  unlocks: "2003 신경망 언어 모델",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "신경망 언어 모델이 n-gram보다 나은 점은?",
      choices: ["비슷한 단어는 벡터도 가까워서, 처음 보는 문장도 그럴듯하게 짐작한다", "말뭉치가 전혀 필요 없다", "문장 전체를 한 번에 본다"],
      answer: 0,
      explain: "'강아지가'를 못 봤어도, 벡터가 '고양이가'와 가까우면 신경망이 비슷한 답을 내요.",
      review: "s6",
    },
    {
      q: "앞 단어들은 신경망에 어떤 모습으로 들어갈까요?",
      choices: ["단어 번호 하나로", "단어마다 벡터를 찾아 이어 붙여서", "글자 수로"],
      answer: 1,
      explain: "단어마다 임베딩 벡터를 찾고(33장), 그 벡터들을 한 줄로 이어 붙여 넣어요.",
      review: "s4",
    },
    {
      q: "신경망 언어 모델에 아직 남은 한계는?",
      choices: ["확률을 만들 수 없다", "단어 벡터를 쓸 수 없다", "여전히 앞 몇 단어만 보는 고정된 창이다"],
      answer: 2,
      explain: "창 밖에 있는 단어는 못 봐요. 문장 전체를 따라가는 방법이 40장의 RNN이에요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "39장 신경망 언어 모델",
    ngram: "n-gram의 짝 빈도표",
    catBlank: "고양이가 ___",
    dogBlank: "강아지가 ___",
    times: "번",
    never: "센 적 없음 → 모름",
    notKnow: "비슷한 단어인 줄 몰라요",
    year: "2003",
    who: "벤지오(Bengio) 연구팀",
    nnlm: "신경망 언어 모델",
    nnlmEn: "Neural Network Language Model",
    idea: "단어를 숫자 벡터로 바꾸고, 신경망에 넣자!",
    planeTitle: "단어마다 숫자 벡터 (33장 임베딩)",
    animal: "동물",
    people: "사람",
    weather: "날씨",
    close: "비슷한 단어 = 가까운 자리",
    emb: "임베딩 (33장)",
    concat: "이어 붙이기",
    layer: "뉴런 층 (18장)",
    score: "점수",
    softmax: "소프트맥스 (14장)",
    demo: "* 설명용 예시",
    nearIn: "가까운 벡터",
    sameOut: "비슷한 답",
    unseen: "처음 보는 문장도 짐작해요!",
    learnTitle: "학습하면 함께 다듬어져요",
    weights: "신경망 가중치",
    vectors: "단어 벡터",
    drift: "비슷하게 쓰이는 단어는 점점 가까이",
    w2v: "2013 Word2Vec: 벡터 만들기에 집중 (34장)",
    windowNote: "앞 3단어 창",
    outside: "창 밖은 안 보여요",
    which: "갔다? 간다?",
    next: "40장: RNN 쪽지 릴레이",
  },
};
