import type { ChapterSpec } from "./types";

/** 설명용 예시 curve: every ×10 in size takes 0.5 off the loss. (Kaplan 2020 found straight lines on ×10 axes;
 *  these numbers are made up to keep the arithmetic simple.) */
export const LOSS_AT_1E7 = 5;
export const DROP_PER_10X = 0.5;
export const lossOf = (n: number) => LOSS_AT_1E7 - DROP_PER_10X * (Math.log10(n) - 7);

export const SIZES70 = [1e7, 1e8, 1e9, 1e10, 1e11];
export const GPT3_N = 1.75e11;

/** Korean number words for model sizes: 1천만, 1억, 10억, 1,750억, 1조. */
export function koN(n: number): string {
  if (n >= 1e12) return `${Number((n / 1e12).toFixed(1)).toLocaleString("ko-KR")}조`;
  if (n >= 1e8) return `${Math.round(n / 1e8).toLocaleString("ko-KR")}억`;
  if (n >= 1e7) return `${Math.round(n / 1e7).toLocaleString("ko-KR")}천만`;
  return `${Math.round(n / 1e4).toLocaleString("ko-KR")}만`;
}

/** Chinchilla (2022): about 20 training tokens per parameter. */
export const TOKENS_PER_PARAM = 20;

export const ch70: ChapterSpec = {
  id: 70,
  part: 7,
  title: "클수록 똑똑해진다",
  core: true,
  hook: "모델을 10배 키우면 얼마나 좋아질까요? 미리 알 수 있을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "모델을 키우면 정말 똑똑해질까요? 2020년 연구자들은 크기가 다른 모델을 여러 개 만들어 손실을 비교했어요." },
    { id: "s2", sec: 9, narration: "보통 눈금으로 그려 볼게요. 작은 모델들은 왼쪽 끝에 몰려 있고, 그 뒤로는 거의 평평해 보여요." },
    { id: "s3", sec: 9, narration: "이번엔 가로 눈금을 바꿔요. 한 칸 갈 때마다 1씩 더하는 대신, 10배씩 곱하는 눈금이에요." },
    { id: "s4", sec: 10, narration: "그러면 점들이 한 줄로 쭉 늘어서요. 설명용 예시로, 크기를 10배 키울 때마다 손실이 0.5씩 줄어요." },
    { id: "s5", sec: 10, narration: "10배씩 커지는 이 눈금을 로그 눈금이라고 해요. 65장의 놀람처럼 '몇 번 곱했나'를 세는 눈금이죠." },
    { id: "s6", sec: 9, narration: "데이터 양이나 계산량을 늘려도 똑같이 곧은 선이 나왔어요. 이 규칙을 스케일링 법칙이라고 해요." },
    { id: "s7", sec: 10, narration: "선을 쭉 이으면 더 큰 모델의 손실도 미리 내다볼 수 있어요. 그래서 GPT-3 같은 큰 모델에 도전했죠." },
    { id: "s8", sec: 11, narration: "2022년 친칠라 연구는 모델만 키우지 말고, 파라미터 하나에 글 조각 약 20개꼴로 데이터도 함께 늘리라고 했어요." },
  ],
  playgroundTitle: "눈금 바꾸기",
  playgroundIntro: "모델 크기를 바꿔 보고, 보통 눈금과 10배 눈금을 오가며 같은 점들이 어떻게 보이는지 비교해 보세요.",
  summary: [
    "가로 눈금을 10배씩으로 바꾸면(로그 눈금) 손실이 곧은 선으로 줄어든다.",
    "크기·데이터·계산량을 늘리면 손실이 예측 가능하게 준다 = 스케일링 법칙(2020).",
    "선을 이어 큰 모델을 내다본다. 데이터도 함께 늘려야 한다(친칠라, 2022).",
  ],
  unlocks: "스케일링 법칙",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "'10배 눈금'에서 한 칸 오른쪽으로 가면 값은?",
      choices: ["1 커진다", "10배가 된다", "2배가 된다"],
      answer: 1,
      explain: "1 → 10 → 100 → 1,000처럼 한 칸마다 10을 곱해요. 이런 눈금이 로그 눈금이에요.",
      review: "s3",
    },
    {
      q: "스케일링 법칙이 말하는 것은?",
      choices: ["모델이 크면 손실이 0이 된다", "모델이 너무 크면 학습이 안 된다", "크기·데이터·계산을 늘리면 손실이 예측 가능하게 준다"],
      answer: 2,
      explain: "10배 눈금 위에서 손실이 곧은 선을 따라 줄어서, 더 큰 모델의 결과도 미리 내다볼 수 있어요.",
      review: "s6",
    },
    {
      q: "친칠라 연구(2022)가 권한 것은?",
      choices: ["데이터도 모델 크기에 맞춰 함께 늘리기", "모델만 최대한 키우기", "데이터를 줄이기"],
      answer: 0,
      explain: "파라미터 하나에 글 조각 약 20개꼴로, 모델과 데이터를 함께 키우는 게 좋다고 했어요.",
      review: "s8",
    },
  ],
  labels: {
    tag: "70장 클수록 똑똑해진다",
    study: "2020 · Kaplan 외",
    sizes: "모델 크기 (파라미터 수)",
    q: "클수록 손실이 줄어들까?",
    axisX: "모델 크기",
    axisXArrow: "모델 크기 →",
    axisY: "↑ 손실",
    example: "설명용 예시 곡선",
    crowd: "← 왼쪽 끝에 몰려 있어요",
    flatQ: "거의 평평?",
    rulerA: "보통 눈금: 한 칸에 +1",
    rulerB: "10배 눈금: 한 칸에 ×10",
    plus1: "+1",
    times10: "×10",
    line: "한 줄로 쭉!",
    minus: "−0.5",
    logName: "로그 눈금 (log scale)",
    link65: "65장: 반으로 나눌 때마다 놀람 +1",
    link70: "70장: 10배 할 때마다 한 칸",
    data: "데이터 양",
    compute: "계산량",
    law: "스케일링 법칙",
    predict: "미리 내다보기 →",
    gpt3: "GPT-3",
    chinchilla: "2022 · 친칠라",
    perParam: "파라미터 1개당 글 조각 약 20개",
    exampleCalc: "10억 개 모델 → 글 조각 약 200억 개",
    together: "모델과 데이터를 함께 키우기",
  },
};
