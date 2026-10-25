import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "./types";

/** s1: the telephone game, each line one more person down the chain; changed syllables come from GARBLE. */
export const PHONE = ["나는 오늘 학교에 간다", "나는 오늘 학교에 갔다", "나는 어제 학교에 갔다", "너는 어제 핵교에 갔니", "너도 어제 핵꾜애 갔니"];

/** syllable swaps in the order they happen (the playground garbles the sentence the same way) */
export const GARBLE: [string, string][] = [
  ["간", "갔"],
  ["오늘", "어제"],
  ["나", "너"],
  ["학", "핵"],
  ["다", "니"],
  ["는", "도"],
  ["교", "꾜"],
  ["에", "애"],
];

export function garble(sentence: string, k: number) {
  let s = sentence;
  for (const [a, b] of GARBLE.slice(0, k)) s = s.replace(a, b);
  return s;
}

/** s2: one vector replaced layer after layer (설명용) */
export const DRIFT = [
  [2.0, 1.0, -1.0, 3.0],
  [2.5, -0.5, 0.5, 2.9],
  [2.4, -1.4, 1.4, 2.3],
  [2.0, -2.1, 2.1, 1.5],
  [1.6, -2.4, 2.4, 0.8],
];

/** s4: x + f(x) (설명용) */
export const RES_X = [2.0, 1.0, -1.0, 3.0];
export const RES_F = [0.3, -0.2, 0.5, 0.1];

export const cosine = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0) / Math.hypot(...a) / Math.hypot(...b);

// ---- playground: a toy 8-number vector through up to 48 layers ----
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(3);
const gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
export const TOY_D = 8;
export const TOY_X0 = [1.5, -0.8, 0.6, 1.2, -1.4, 0.3, -0.5, 0.9];
const LAYERS = Array.from({ length: 48 }, () =>
  Array.from({ length: TOY_D }, (_, i) => Array.from({ length: TOY_D }, (_, k) => (i === k ? 0.7 : 0) + (gauss() * 0.7) / Math.sqrt(TOY_D))),
);
const part = (W: number[][], x: number[]) => W.map((r) => Math.tanh(r.reduce((s, w, k) => s + w * x[k], 0)));

/** Run n layers. Without the highway each layer replaces the vector (kept at the same size, so only the direction changes). */
export function runLayers(n: number, highway: boolean) {
  let x = TOY_X0;
  const size0 = Math.hypot(...TOY_X0);
  for (const W of LAYERS.slice(0, n)) {
    const f = part(W, x);
    if (highway) x = x.map((v, k) => v + 0.15 * f[k]);
    else {
      const s = Math.hypot(...f);
      x = f.map((v) => (v / s) * size0);
    }
  }
  return { x, keep: Math.max(0, cosine(x, TOY_X0)), size: Math.hypot(...x), size0 };
}

export const ch56: ChapterSpec = {
  id: 56,
  part: 6,
  title: "정보 고속도로",
  core: false,
  hook: "층을 96개나 지나면, 처음 문장의 정보는 다 지워지지 않을까요?",
  steps: [
    { id: "s1", sec: 8.5, narration: "말 전달 게임을 해 본 적 있나요? 여러 사람을 거칠수록 처음 말이 점점 엉뚱하게 바뀌죠." },
    { id: "s2", sec: 9.5, narration: "층을 깊이 쌓아도 같은 일이 생겨요. 층마다 벡터를 통째로 바꾸면 처음 정보가 점점 흐려져요." },
    { id: "s3", sec: 10, narration: "그래서 블록은 벡터를 바꿔치기하지 않아요. 부품이 낸 결과를 원래 벡터에 더해요. x + f(x)예요." },
    { id: "s4", sec: 9.5, narration: "원래 x는 그대로 남고, 부품은 고칠 만큼만 조금 보태요. 그러니 처음 정보가 지워지지 않아요." },
    { id: "s5", sec: 10, narration: "그림으로 보면, 원래 정보는 고속도로를 곧게 달리고, 부품들은 옆길에서 계산한 결과를 보태요." },
    { id: "s6", sec: 10.5, narration: "학습할 때도 좋아요. 틀린 만큼 고치라는 신호가 고속도로를 타고 맨 앞 층까지 잘 전달돼요(23장)." },
    { id: "s7", sec: 9.5, narration: "결과를 원래 값에 더하는 이 길을 잔차 연결이라고 해요. 부품은 '고칠 차이'만 맡으면 돼요." },
  ],
  playgroundTitle: "고속도로 끄고 켜기",
  playgroundIntro: "층 수를 늘려 보세요. 고속도로(잔차 연결)를 끄면 처음 정보가 얼마나 남는지, 켜면 어떻게 되는지 비교해 보세요.",
  summary: [
    "층마다 벡터를 통째로 바꾸면 처음 정보가 흐려진다. 말 전달 게임처럼.",
    "잔차 연결: 내보내는 값 = x + f(x). 원래 정보는 고속도로로, 부품은 고칠 차이만 보탠다.",
    "고칠 신호도 고속도로를 타고 앞 층까지 잘 전달돼서 깊이 쌓을 수 있다.",
  ],
  unlocks: "잔차 연결",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "잔차 연결을 식으로 쓰면? (x는 원래 벡터, f는 부품)",
      choices: ["f(x)", "x + f(x)", "x × f(x)"],
      answer: 1,
      explain: "부품의 결과 f(x)를 원래 벡터 x에 더해요. 바꿔치기(f(x)만 남기기)가 아니에요.",
      review: "s3",
    },
    {
      q: "x = [2, 1]이고 부품의 결과가 f(x) = [0.5, −0.5]라면, 블록이 내보내는 값은?",
      choices: ["[0.5, −0.5]", "[2, 1]", "[2.5, 0.5]"],
      answer: 2,
      explain: "x + f(x) = [2 + 0.5, 1 − 0.5] = [2.5, 0.5]예요.",
      review: "s4",
    },
    {
      q: "잔차 연결 덕분에 학습이 쉬워지는 까닭은?",
      choices: ["고칠 신호가 고속도로를 타고 앞 층까지 잘 전달돼서", "계산할 숫자가 줄어들어서", "단어 수가 줄어서"],
      answer: 0,
      explain: "부품을 하나하나 거치면 신호가 약해지는데, 고속도로로는 약해지지 않고 전달돼요(23장 역전파).",
      review: "s6",
    },
  ],
  labels: {
    tag: "56장 정보 고속도로",
    person: "번째 사람",
    orig: "처음",
    layer: "층",
    keep: "처음과 닮은 정도",
    blur: "처음 정보가 흐려져요",
    toy: "설명용 예시",
    swap: "바꿔치기",
    add: "더하기",
    x: "x",
    fx: "f(x)",
    xfx: "x + f(x)",
    xMeans: "x = 원래 벡터",
    fMeans: "f(x) = 부품이 낸 결과",
    origVec: "원래 x",
    plusF: "+ f(x)",
    out: "= 내보내는 값",
    stays: "x가 그대로 살아 있어요!",
    road: "고속도로",
    straight: "원래 정보가 곧게 달려요",
    side: "옆길에서 계산",
    plusNote: "⊕ 결과를 보태요",
    lost: "x는 사라져요",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
    noRoad: "고속도로 없이",
    withRoad: "고속도로 있으면",
    part: "부품",
    weak: "점점 약해져요",
    strong: "그대로 전달!",
    signal: "↑ 틀린 만큼 고치라는 신호",
    name: "잔차 연결",
    en: "(residual connection)",
    diff: "잔차 = 남은 차이: 부품은 고칠 차이만",
    deep: "덕분에 96층도 쌓을 수 있어요",
    resnet: "2015년 이미지 인식 모델 ResNet이 이 방법으로 152층을 쌓았어요",
  },
};
