import type { ChapterSpec } from "./types";

// A toy feed-forward layer, 4 → 16 → 4 (the same 4× widening as GPT-3's 12,288 → 49,152 → 12,288).
// All numbers are 설명용 예시; the scene and the playground compute from these same weights.

export const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));

/** each word's vector after attention (설명용) */
export const FFN_WORDS: { w: string; x: number[] }[] = [
  { w: "나는", x: [1.2, 0.1, -0.3, -0.5] },
  { w: "오늘", x: [-0.2, 1.3, 0.2, -0.1] },
  { w: "학교에", x: [-0.3, 0.2, 1.1, 1.0] },
];

export const W1 = [
  [0.3, -0.6, -0.1, -0.6], [0.4, 0, 0, -0.5], [1.4, -0.4, -0.4, -0.4], [-0.3, 0.1, -0.4, -0.6],
  [0.3, 0, 0.4, 0.5], [-0.2, 0.3, -0.3, 0.2], [0, 0.5, 0.1, -0.7], [-0.4, 1.4, -0.3, -0.3],
  [0.5, -0.3, 0.6, 0.4], [-0.1, 0.3, -0.5, -0.2], [0.3, -0.7, -0.7, 0], [0.5, 0.1, 0.3, 0.4],
  [-0.4, -0.3, 1, 1], [0.1, 0.1, -0.6, -0.2], [0, 0.5, -0.1, -0.1], [0, 0.1, 0.4, 0.5],
];
export const B1 = [-0.3, -0.2, -0.3, -0.3, -0.3, -0.2, -0.4, -0.3, -0.4, -0.3, -0.3, -0.4, -0.3, -0.3, -0.1, -0.1];
export const W2 = [
  [0, 0.4, 0.2, 0, -0.2, 0, 0.1, -0.1, -0.1, 0.3, -0.3, 0.5, 0.1, 0.3, 0.3, -0.4],
  [-0.1, -0.3, -0.1, 0.3, 0.1, 0.5, 0.5, 0.4, 0.1, 0.4, 0.5, 0.3, 0, 0.1, 0.4, -0.1],
  [0.1, -0.4, 0, 0, -0.2, 0.4, -0.5, 0.1, -0.4, -0.1, 0.4, -0.5, 0.3, -0.4, -0.2, 0.5],
  [0, -0.3, 0.3, -0.3, 0.1, 0.1, 0.3, 0.2, 0.3, -0.4, -0.3, -0.4, 0.8, 0.2, 0.1, 0.2],
];

/** Neurons with a (made-up) name tag; the rest are hard to name, as in real models. */
export const NEURON_NAMES: Record<number, string> = {
  2: "'나'처럼 사람을 가리키는 말",
  7: "때를 나타내는 말",
  12: "장소 + '에' → 곧 움직이는 말이 올 차례",
};

export function ffn(x: number[], bend = true) {
  const pre = W1.map((w, i) => w.reduce((a, wk, k) => a + wk * x[k], B1[i]));
  const h = bend ? pre.map(gelu) : pre;
  const y = W2.map((w) => w.reduce((a, wj, j) => a + wj * h[j], 0));
  return { pre, h, y, out: x.map((v, k) => v + y[k]) };
}

// GPT-3 sizes: d = 12,288, the wide layer is 4d. Per layer: attention 4·d², feed-forward 8·d² weights.
export const D = 12288;
export const FFN_PARAMS = 8 * D * D * 96; // 115,964,116,992 ≈ 1,160억
export const ATT_PARAMS = 4 * D * D * 96; // 57,982,058,496 ≈ 580억

export const ch55: ChapterSpec = {
  id: 55,
  part: 6,
  title: "생각하는 층",
  core: true,
  hook: "어텐션으로 단어끼리 정보를 나눴어요. 그다음, 각 단어는 무엇을 할까요?",
  steps: [
    { id: "s1", sec: 8, narration: "어텐션으로 단어들이 서로의 의미를 섞었어요. 이제 블록의 두 번째 부품, 피드포워드 차례예요." },
    { id: "s2", sec: 9, narration: "피드포워드는 단어마다 따로 통과하는 작은 신경망이에요(18장). 모든 단어가 똑같은 기계를 써요." },
    { id: "s3", sec: 10, narration: "안에서는 숫자 4개가 16개로 4배 넓어졌다가 다시 4개로 줄어요. 넓은 층에서는 GELU로 꺾어요(17장)." },
    { id: "s4", sec: 9, narration: "넓은 층의 뉴런은 저마다 어떤 패턴에 반응해요. 이 뉴런은 '장소 + 에'를 보면 켜진다고 해 볼게요." },
    { id: "s5", sec: 8.5, narration: "켜진 뉴런들이 낸 결과를 원래 벡터에 더해요. 이렇게 단어마다 지식이 덧붙어요." },
    { id: "s6", sec: 10.5, narration: "GPT-3에서는 숫자 12,288개가 49,152개로 넓어졌다가 다시 12,288개로 돌아와요. 똑같이 4배예요." },
    { id: "s7", sec: 9, narration: "GPT-3 숫자 1,750억 개 중 약 3분의 2가 피드포워드에 있어요. 배운 지식의 창고인 셈이에요." },
    { id: "s8", sec: 8.5, narration: "어텐션은 단어끼리 대화, 피드포워드는 단어 혼자 생각. 설계도에 피드포워드가 채워졌어요!" },
  ],
  playgroundTitle: "생각하는 층 들여다보기",
  playgroundIntro: "단어를 골라 피드포워드에 넣어 보세요. 넓은 층에서 어떤 뉴런이 켜지는지, 뉴런을 눌러 확인해 보세요.",
  summary: [
    "피드포워드: 단어마다 따로 통과하는 작은 신경망. 모든 단어가 같은 기계를 쓴다.",
    "4배로 넓혔다가(GELU로 꺾고) 다시 줄인다. GPT-3: 12,288 → 49,152 → 12,288.",
    "결과를 원래 벡터에 더해 지식을 덧붙인다. 모델 숫자의 약 3분의 2가 여기 있다.",
  ],
  unlocks: "피드포워드",
  quiz: [
    {
      q: "피드포워드는 단어들을 어떻게 처리할까요?",
      choices: ["단어마다 따로, 모두 같은 기계로", "모든 단어를 한데 섞어서", "마지막 단어 하나만"],
      answer: 0,
      explain: "단어끼리 섞는 건 어텐션의 일이에요. 피드포워드는 단어마다 따로, 같은 숫자의 기계를 통과시켜요.",
      review: "s2",
    },
    {
      q: "GPT-3의 피드포워드 안에서 숫자 12,288개는 몇 개로 넓어질까요?",
      choices: ["24,576개", "49,152개", "96개"],
      answer: 1,
      explain: "12,288 × 4 = 49,152예요. 넓혔다가 다시 12,288개로 돌아와요.",
      review: "s6",
    },
    {
      q: "넓은 층에서 GELU로 숫자를 꺾는 이유는?",
      choices: ["숫자를 확률로 바꾸려고", "단어 순서를 알려 주려고", "직선 하나로는 못 하는 일을 하려고"],
      answer: 2,
      explain: "꺾지 않으면 기계 전체가 직선 같은 함수 하나가 돼요. 꺾어야 복잡한 패턴을 잡을 수 있어요(17장).",
      review: "s3",
    },
  ],
  labels: {
    tag: "55장 생각하는 층",
    here: "이번 장의 주인공",
    same: "똑같은 기계 (숫자도 같아요)",
    alone: "단어끼리 섞지 않아요",
    ffn: "피드포워드",
    inside: "피드포워드 속",
    four: "숫자 4개",
    wide: "16개 (4배로 넓게)",
    back: "다시 4개",
    gelu: "GELU로 꺾기 (17장)",
    tagN: "장소 + '에' → 곧 움직이는 말",
    toy: "설명용 예시",
    orig: "원래 벡터",
    thought: "+ 생각한 것",
    result: "= 새 벡터",
    knowledge: "지식이 덧붙었어요!",
    real: "진짜 GPT-3에서는",
    n1: "12,288",
    n2: "49,152",
    times: "× 4",
    total: "GPT-3 숫자 1,750억 개",
    ffnPart: "피드포워드 약 1,160억",
    attPart: "어텐션 약 580억",
    twoThirds: "약 3분의 2",
    store: "지식의 창고",
    filled: "채움!",
    talk: "어텐션 = 단어끼리 대화",
    think: "피드포워드 = 단어 혼자 생각",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
  },
};
