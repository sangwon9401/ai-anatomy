import { percents } from "./ch45";
import { ffn } from "./ch55";
import { UNLOCK6 } from "./ch54";
import { layerNorm } from "./ch57";
import { LAST_VEC, LOGITS, REST_N, outputProbs } from "./ch60";
import type { ChapterSpec } from "./types";

// The whole forward pass of 나는 오늘 학교에 → 간다 with toy 4-number vectors (설명용 예시).
// Every stage is rounded to one decimal before the next, so the sums on screen add up exactly.
const r1 = (v: number) => Math.round(v * 10) / 10;

export const TOKENS = ["나는", "오늘", "학교에"];
/** 설명용 번호 (a real tokenizer gives other numbers and cuts Korean into more pieces) */
export const IDS = [1043, 2517, 8820];
export const EMB = [
  [0.8, -0.2, 0.1, 0.4],
  [-0.1, 0.9, 0.2, -0.3],
  [0.2, 0.1, 0.9, 0.6],
];
export const POS = [
  [0.2, 0.1, 0.0, 0.1],
  [0.1, 0.2, 0.1, 0.0],
  [0.0, 0.1, 0.2, 0.1],
];
export const X0 = EMB.map((e, i) => e.map((v, k) => r1(v + POS[i][k])));

/** attention scores; each word only sees itself and the words before it (51장) */
const SCORES = [[0], [0.5, 0.9], [0.6, 0.8, 1.2]];
export const ATT_W = SCORES.map((row) => {
  const ex = row.map(Math.exp);
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
});
export const ATT_PCT = ATT_W.map((w) => percents(w));
const MIX = ATT_W.map((w) => [0, 1, 2, 3].map((k) => w.reduce((a, wj, j) => a + wj * X0[j][k], 0)));
export const D_ATT = MIX.map((m) => m.map((v) => r1(0.5 * v)));
export const X1 = X0.map((x, i) => x.map((v, k) => r1(v + D_ATT[i][k])));
export const D_FFN = X1.map((x) => ffn(layerNorm(x).z).y.map((v) => r1(0.4 * v)));
export const X2 = X1.map((x, i) => x.map((v, k) => r1(v + D_FFN[i][k])));
/** after all 96 layers (설명용); the last one is the vector 60장 scores */
export const FINAL = [[1.3, -0.8, 0.9, 1.6], [-0.5, 2.4, 0.7, 0.4], LAST_VEC];

export const OUT = outputProbs(LOGITS.map((l) => l.s));
export const OUT_PCT = percents([...OUT.p, OUT.restP]);
export { LOGITS, REST_N };

/** The stations of the trip, in order (used by the scene's header and the playground). */
export const STATIONS = [
  { key: "tok", name: "토크나이저", where: "29장", color: "sky" },
  { key: "emb", name: "임베딩", where: "33장", color: "sky" },
  { key: "pos", name: "위치 정보", where: "36장", color: "sky" },
  { key: "att", name: "블록: 정규화 → 어텐션", where: "57, 45장", color: "yellow" },
  { key: "add", name: "블록: 더하기", where: "56장", color: "yellow" },
  { key: "ffn", name: "블록: 정규화 → 피드포워드 → 더하기", where: "55장", color: "yellow" },
  { key: "x96", name: "블록 × 96층", where: "58장", color: "yellow" },
  { key: "out", name: "출력: 점수 매기기", where: "60장", color: "mint" },
  { key: "soft", name: "소프트맥스", where: "14장", color: "mint" },
  { key: "loop", name: "뽑아서 붙이기", where: "1, 2장", color: "mint" },
] as const;

export const ch61: ChapterSpec = {
  id: 61,
  part: 6,
  title: "처음부터 끝까지 따라가기",
  core: true,
  hook: "ChatGPT가 단어 하나를 쓰는 동안, 안에서는 정확히 무슨 일이 일어날까요?",
  steps: [
    { id: "s1", sec: 8, narration: "지금까지 조립한 GPT에 '나는 오늘 학교에'를 넣고, 처음부터 끝까지 따라가 볼게요." },
    { id: "s2", sec: 8.5, narration: "먼저 토크나이저가 글을 조각(토큰)으로 잘라요. 조각마다 단어장 번호가 붙어요(29장)." },
    { id: "s3", sec: 10, narration: "임베딩이 번호마다 의미가 담긴 숫자 줄을 꺼내 와요. GPT-3에선 조각 하나가 숫자 12,288개예요(33장)." },
    { id: "s4", sec: 9.5, narration: "여기에 몇 번째 조각인지 알려 주는 위치 정보를 더해요(36장). 이제 벡터 3개가 블록으로 들어가요." },
    { id: "s5", sec: 10.5, narration: "블록 안. 정규화로 크기를 맞추고 어텐션! '학교에'는 앞의 '나는', '오늘'과 자기 자신을 쳐다봐요(45장)." },
    { id: "s6", sec: 9, narration: "쳐다본 만큼 섞어 온 결과를 고속도로 위 원래 벡터에 더해요(56장). 숫자가 조금씩 바뀌었죠?" },
    { id: "s7", sec: 9.5, narration: "다시 정규화하고 피드포워드가 단어마다 생각을 더해요. 그 결과도 원래 벡터에 더하고요(55장)." },
    { id: "s8", sec: 9.5, narration: "이게 블록 한 층이에요. 똑같은 일을 96층 되풀이하면, 벡터마다 문맥이 차곡차곡 쌓여요(58장)." },
    { id: "s9", sec: 10, narration: "96층을 나온 '학교에' 벡터로 토큰 50,257개의 점수를 매겨요. 간다 3.0, 갔다 2.1, 늦었다 1.5(60장)." },
    { id: "s10", sec: 9.5, narration: "소프트맥스로 확률로 바꾸면 간다 52%, 갔다 21%, 늦었다 12%. 다 더하면 100%예요(14장)." },
    { id: "s11", sec: 9, narration: "확률대로 하나를 뽑아요. '간다'! 글 끝에 붙이면 '나는 오늘 학교에 간다'가 돼요(1장)." },
    { id: "s12", sec: 10, narration: "그리고 이 문장을 다시 맨 위로 넣어 다음 조각을 만들어요(2장). ChatGPT의 답은 전부 이 여행으로 나와요." },
  ],
  playgroundTitle: "한 단계씩 따라가기",
  playgroundIntro: "'다음 부품' 버튼으로 '나는 오늘 학교에'를 GPT 속으로 보내 보세요. 어텐션에서는 단어를 눌러 누구를 쳐다보는지도 보세요.",
  summary: [
    "토크나이저 → 임베딩 + 위치 정보 → [정규화·어텐션·더하기·정규화·피드포워드·더하기] × 96 → 출력 + 소프트맥스 → 뽑아서 붙이기.",
    "단어 벡터는 층을 지날 때마다 문맥이 더해지고, 맨 끝 단어의 벡터가 다음 말을 정한다.",
    "다음 조각 하나 = 이 여행 한 번. 붙인 문장으로 다시 처음부터.",
  ],
  unlocks: "전체 순전파",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "'나는 오늘 학교에'가 GPT를 지나는 순서로 맞는 것은?",
      choices: [
        "임베딩 → 토크나이저 → 블록 → 위치 정보 → 소프트맥스",
        "토크나이저 → 임베딩 + 위치 정보 → 블록 × 96 → 출력 + 소프트맥스",
        "블록 × 96 → 토크나이저 → 소프트맥스 → 임베딩",
      ],
      answer: 1,
      explain: "글을 자르고(토크나이저), 숫자로 바꾸고(임베딩 + 위치), 블록 96층을 지난 뒤, 점수를 확률로 바꿔요.",
      review: "s1",
    },
    {
      q: "블록 안에서 '학교에'가 앞 단어들을 쳐다보는 부품은?",
      choices: ["어텐션", "피드포워드", "소프트맥스"],
      answer: 0,
      explain: "어텐션이 앞 단어들을 보고 의미를 섞어 와요(45장). 피드포워드는 단어마다 따로 생각해요.",
      review: "s5",
    },
    {
      q: "다음 단어를 하나 뽑아 붙인 뒤에는 무슨 일이 생길까요?",
      choices: ["그대로 끝난다", "사람이 정답을 고친다", "늘어난 문장을 다시 맨 위로 넣는다"],
      answer: 2,
      explain: "붙인 문장으로 다시 처음부터 여행해서 그다음 조각을 만들어요(2장 자기회귀).",
      review: "s12",
    },
  ],
  labels: {
    tag: "61장 처음부터 끝까지 따라가기",
    title: "처음부터 끝까지 따라가기",
    sentence: "나는 오늘 학교에",
    q: "?",
    arrow: "→",
    idToy: "번호는 설명용 예시",
    vocab: "단어장 (토큰 50,257개)",
    vdots: "⋮",
    table: "임베딩 표: 50,257줄 × 12,288칸",
    lookup: "번호 줄을 꺼내 와요",
    real: "진짜는 숫자 12,288개",
    toy: "설명용 예시",
    nth: "번째",
    posNote: "+ 몇 번째인지",
    toBlock: "블록으로!",
    norm: "정규화",
    looks: "'학교에'가 쳐다보는 비율",
    mask: "가림막 (51장)",
    addNote: "섞어 온 결과를 원래 벡터에 더하기",
    ffn: "피드포워드",
    ffnNote: "단어마다 따로 생각 더하기",
    layer: "층",
    same: "같은 일을 96번",
    lastVec: "96층을 나온 '학교에'",
    compare: "토큰마다 비교 (9장)",
    rest: "나머지",
    restN: "50,253개",
    restScore: "약 −9.1",
    pt: "점",
    total: "합 = 100%",
    pick: "뽑기!",
    again: "다시 맨 위로",
    oneWord: "단어 하나 = 이 여행 한 번",
    all: "숫자 1,750억 개가 모두 계산에 참여해요",
    w4: "간다",
  },
};
