import type { ChapterSpec } from "./types";

// A made-up bumpy loss landscape (설명용 예시): a wide valley at x = 7 with a small dip near x = 2.7.
const A = 1.6;
const C = 2.6;
const SD = 0.4;
export const X_MIN = 0;
export const X_MAX = 10;
export const bumpy = (x: number) => 0.12 * (x - 7) ** 2 - A * Math.exp(-((x - C) ** 2) / (2 * SD * SD));
export const slope = (x: number) => 0.24 * (x - 7) + ((A * (x - C)) / (SD * SD)) * Math.exp(-((x - C) ** 2) / (2 * SD * SD));

/** Heavy-ball descent: v ← β·v − lr·기울기, x ← x + v. β = 0 is plain gradient descent (21장). */
export function roll(x0: number, beta: number, steps: number, lr = 0.05): number[] {
  const xs = [x0];
  let x = x0;
  let v = 0;
  for (let i = 0; i < steps; i++) {
    v = beta * v - lr * slope(x);
    x = Math.min(X_MAX, Math.max(X_MIN, x + v));
    xs.push(x);
  }
  return xs;
}

export const START_X = 0.4;
export const MOMENTUM = 0.85;
export const PLAIN_PATH = roll(START_X, 0, 160);
export const MOMENTUM_PATH = roll(START_X, MOMENTUM, 160);

// A long, narrow valley: knob A is gentle, knob B is steep (설명용 예시).
export const VA = 0.4;
export const VB = 18;
export const valley = (x: number, y: number) => 0.5 * (VA * x * x + VB * y * y);
const grad2 = ([x, y]: [number, number]): [number, number] => [VA * x, VB * y];
export const START_2D: [number, number] = [-3.6, 1.2];

/** Plain steps: every knob moves by learning rate × its slope. */
export function plain2D(steps: number, lr = 0.1): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  for (let i = 0; i < steps; i++) {
    const g = grad2(p);
    p = [p[0] - lr * g[0], p[1] - lr * g[1]];
    out.push(p);
  }
  return out;
}

/** Self-adjusting steps: each knob's step is divided by how big its slopes have been lately. */
export function adaptive2D(steps: number, lr = 0.3, decay = 0.9): [number, number][] {
  const out: [number, number][] = [START_2D];
  let p = START_2D;
  let v: [number, number] = [0, 0];
  for (let t = 1; t <= steps; t++) {
    const g = grad2(p);
    v = [decay * v[0] + (1 - decay) * g[0] ** 2, decay * v[1] + (1 - decay) * g[1] ** 2];
    const corr = 1 - decay ** t;
    p = [p[0] - (lr * g[0]) / (Math.sqrt(v[0] / corr) + 1e-8), p[1] - (lr * g[1]) / (Math.sqrt(v[1] / corr) + 1e-8)];
    out.push(p);
  }
  return out;
}

export const STEPS_2D = 30;
export const PLAIN_2D = plain2D(STEPS_2D);
export const ADAPT_2D = adaptive2D(STEPS_2D);

export const ch67: ChapterSpec = {
  id: 67,
  part: 7,
  title: "똑똑한 내리막",
  core: false,
  hook: "기울기만 보고 내려가는 공은 왜 길을 잃을까요?",
  steps: [
    { id: "s1", sec: 9, narration: "21장에서 공은 발밑 기울기만 보고 내려갔어요. 그런데 진짜 손실 지형은 이렇게 울퉁불퉁해요." },
    { id: "s2", sec: 10, narration: "기울기만 따르는 공은 작은 웅덩이에 빠지면 멈춰요. 웅덩이 바닥은 기울기가 0이라 더 갈 곳이 없거든요." },
    { id: "s3", sec: 10, narration: "그래서 관성을 줘요. 굴러온 기세를 기억해서, 그 힘으로 작은 언덕을 넘어 더 깊은 골짜기까지 가요." },
    { id: "s4", sec: 10, narration: "두 번째 문제는 보폭이에요. 손잡이마다 기울기가 달라서, 가파른 쪽은 이리저리 튀고 완만한 쪽은 거북이처럼 느려요." },
    { id: "s5", sec: 10, narration: "그래서 손잡이마다 보폭을 따로 맞춰요. 크게 흔들리던 손잡이는 조금씩, 잘 안 움직이던 손잡이는 성큼성큼." },
    { id: "s6", sec: 10, narration: "관성과 보폭 자동 조절을 합친 방법이 Adam이에요. 2014년에 나왔고, GPT를 학습시킬 때도 Adam을 써요." },
    { id: "s7", sec: 10, narration: "실제 계산은 조금 더 복잡하지만 핵심은 이 두 가지예요. 66장 고리의 ④ 업데이트가 더 똑똑해진 거죠." },
  ],
  playgroundTitle: "공 굴리기 대결",
  playgroundIntro: "출발점과 관성의 세기를 정하고 굴려 보세요. 파란 공은 기울기만, 분홍 공은 관성까지 써요. 분홍 공을 깊은 골짜기에 보내 보세요.",
  summary: [
    "기울기만 따라가면 작은 웅덩이에 갇히거나, 가파른 쪽에서 지그재그로 튄다.",
    "관성: 굴러온 기세를 기억해 작은 언덕을 넘는다.",
    "Adam = 관성 + 손잡이마다 보폭 자동 조절. GPT 학습에도 쓴다.",
  ],
  unlocks: "Adam 옵티마이저",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "기울기만 따라가는 공이 작은 웅덩이에서 멈추는 이유는?",
      choices: ["웅덩이 바닥에선 기울기가 0이라서", "공이 너무 무거워서", "손실이 0이 돼서"],
      answer: 0,
      explain: "기울기가 0이면 '이쪽으로 가라'는 신호가 없어요. 더 깊은 곳이 옆에 있어도 몰라요.",
      review: "s2",
    },
    {
      q: "공에 관성을 주면 무엇이 좋아질까요?",
      choices: ["기울기를 계산할 필요가 없어진다", "굴러온 기세로 작은 언덕을 넘을 수 있다", "항상 출발점으로 돌아온다"],
      answer: 1,
      explain: "지금까지 굴러온 방향과 속도를 기억하니까, 기울기가 0인 곳도 기세로 지나가요.",
      review: "s3",
    },
    {
      q: "Adam을 한 줄로 요약하면?",
      choices: ["기울기를 무시하고 아무 데나 이동", "학습률을 0으로 만들기", "관성 + 손잡이마다 보폭 자동 조절"],
      answer: 2,
      explain: "Adam은 관성과, 손잡이마다 따로 맞추는 보폭을 합친 방법이에요(2014년).",
      review: "s6",
    },
  ],
  labels: {
    tag: "67장 똑똑한 내리막",
    axisX: "손잡이 값 →",
    axisY: "↑ 손실",
    review: "21장: 발밑 기울기만 보고 내려가기",
    start: "출발",
    plain: "기울기만",
    inertia: "관성",
    stuck: "여기서 멈춤!",
    deeper: "더 깊은 골짜기",
    flat: "기울기 0",
    memory: "관성 = 굴러온 기세 기억",
    over: "언덕을 넘었다!",
    example: "설명용 예시 지형",
    knobA: "손잡이 A (완만)",
    knobB: "손잡이 B (가파름)",
    knobAAxis: "손잡이 A (완만) →",
    knobBAxis: "↑ 손잡이 B (가파름)",
    zigzag: "지그재그!",
    slow: "거북이…",
    adaptive: "보폭 자동 조절",
    same: "똑같이 30걸음",
    adamEq: "Adam = 관성 + 보폭 자동 조절",
    year: "2014 · Kingma, Ba",
    gptUses: "GPT 학습에도 Adam",
    smaller: "작게",
    bigger: "크게",
    update: "④ 업데이트",
    smarter: "④ 업데이트가 더 똑똑해졌어요",
    simple: "실제 계산은 더 복잡해요. 여기선 핵심만!",
    loop1: "① 예측",
    loop2: "② 손실",
    loop3: "③ 역전파",
    adam: "Adam",
    goal: "가장 낮은 곳",
  },
};
