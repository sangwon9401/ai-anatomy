import { SCORES } from "./ch14";
import type { ChapterSpec } from "./types";

// ch14's scores (간다 3, 갔다 2, 늦었다 1, 피자 −1); probabilities = softmax(score ÷ temperature), see part9-toy.ts.
export const SCORES81 = SCORES;

// s6: continuations of "나는 오늘 학교에" written by the Part 9 toy model at three temperatures (illustrative picks;
// every one is a real path through the toy table, checked by script). At 0.2 the loop comes out about 78% of the time.
export const RUNS = [
  { t: 0.2, runs: [["간다", "그리고", "친구를", "만났다", "그리고", "친구를", "만났다", "…"]] },
  {
    t: 1,
    runs: [
      ["간다", "그리고", "급식을", "먹었다", "."],
      ["갔다", "."],
      ["늦었다", "그래서", "뛰었다", "."],
    ],
  },
  {
    t: 2,
    runs: [
      ["피자", "타고", "우주로", "날아갔다", "."],
      ["갔다", "그런데", "공룡이", "나타났다", "."],
      ["간다", "."],
    ],
  },
];

export const ch81: ChapterSpec = {
  id: 81,
  part: 9,
  title: "창의력 다이얼",
  core: true,
  hook: "AI의 '창의력'을 숫자 하나로 조절할 수 있을까요?",
  steps: [
    { id: "s1", sec: 9, narration: "14장에서 점수 3, 2, 1, −1을 소프트맥스에 넣었더니 '간다'가 65.7%였죠. 여기에 다이얼을 하나 달아 볼게요." },
    { id: "s2", sec: 9, narration: "이 다이얼이 온도(temperature)예요. 점수를 온도로 나눈 다음 소프트맥스에 넣어요. 온도가 1이면 그대로예요." },
    { id: "s3", sec: 9, narration: "온도를 0.5로 내리면 점수가 6, 4, 2, −2가 돼요. 차이가 두 배로 벌어져서 '간다'가 86.7%, 확 뾰족해져요." },
    { id: "s4", sec: 9, narration: "온도를 2로 올리면 점수는 1.5, 1, 0.5, −0.5. 차이가 줄어서 분포가 평평해지고, 피자도 6.4%가 돼요." },
    { id: "s5", sec: 9, narration: "끝까지 돌리면? 온도가 0에 가까우면 1등만 남아 그리디(80장)가 되고, 아주 높으면 모든 후보가 비슷해져요." },
    { id: "s6", sec: 9, narration: "장난감 모델로 문장을 써 보면, 온도 0.2에선 같은 말을 맴돌고, 1에선 자연스럽고, 2에선 엉뚱해져요." },
    { id: "s7", sec: 9, narration: "정확해야 하는 답엔 낮은 온도, 새 아이디어엔 높은 온도가 어울려요. 온도는 지식은 그대로 두고 확률만 다시 나눠요." },
  ],
  playgroundTitle: "온도 다이얼",
  playgroundIntro: "온도를 바꿔 가며 확률 막대를 보고, 같은 온도로 문장 5개를 써 보세요. 문장이 어떻게 달라지나요?",
  summary: [
    "온도: 점수를 온도로 나눈 다음 소프트맥스에 넣는다.",
    "온도가 낮으면 뾰족해서 1등이 독차지, 높으면 평평해서 골고루 뽑힌다.",
    "낮은 온도는 한결같고, 높은 온도는 다양하다. 모델의 지식은 그대로다.",
  ],
  unlocks: "온도",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "온도를 0.5로 내리면, 소프트맥스에 들어가는 점수 [3, 2, 1, −1]은?",
      choices: ["[1.5, 1, 0.5, −0.5]", "[6, 4, 2, −2]", "[3.5, 2.5, 1.5, −0.5]"],
      answer: 1,
      explain: "점수를 온도로 나눠요. 0.5로 나누면 두 배가 되고, 점수 차이도 두 배로 벌어져요.",
      review: "s3",
    },
    {
      q: "온도를 아주 높이면 확률 분포는 어떻게 될까요?",
      choices: ["모든 후보가 비슷해진다", "1등만 100%가 된다", "전혀 변하지 않는다"],
      answer: 0,
      explain: "점수를 큰 수로 나누면 차이가 거의 없어져서, 막대들이 비슷한 높이가 돼요.",
      review: "s5",
    },
    {
      q: "수학 문제처럼 정확한 답이 필요할 때 어울리는 온도는?",
      choices: ["아주 높은 온도", "높든 낮든 상관없다", "낮은 온도"],
      answer: 2,
      explain: "낮은 온도는 가장 그럴듯한 답을 거의 매번 골라서 한결같아요. 높은 온도는 이야기 짓기처럼 다양함이 필요할 때 써요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "81장 창의력 다이얼",
    example: "* 설명용 예시 점수 (14장)",
    recap: "14장: 점수 → 소프트맥스 → 확률",
    dial: "다이얼 달기!",
    temp: "온도",
    fLeft: "확률 =",
    fRight: "소프트맥스(점수 ÷ 온도)",
    score: "점수",
    divided: "점수÷온도",
    same: "÷ 1 → 그대로",
    sharp: "차이 2배 → 뾰족!",
    flat: "차이 절반 → 평평",
    near0: "온도 0.1",
    high: "온도 10",
    greedy: "1등만 남아요 = 그리디",
    even: "모두 비슷해요 = 평평",
    runsHead: "'나는 오늘 학교에' 다음을 써 보면",
    toy: "* 장난감 모델로 뽑은 설명용 예시",
    allSame: "몇 번을 써도 똑같아요",
    loop: "맴돌기",
    natural: "자연스러움",
    odd: "엉뚱함",
    low: "낮은 온도",
    highT: "높은 온도",
    lowWhen: "정확해야 할 때",
    lowEx: "수학 풀이, 사실 질문",
    highWhen: "다양해야 할 때",
    highEx: "아이디어, 이야기 짓기",
    key: "지식은 그대로, 확률만 다시 나누기",
    name: "'창의력 다이얼'은 별명이에요",
    go: "간다",
    went: "갔다",
    late: "늦었다",
    pizza: "피자",
  },
};
