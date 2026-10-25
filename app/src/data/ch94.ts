import type { ChapterSpec } from "./types";

// Everything on screen is from the real offline 속담 run (part11-run.ts, CHECKPOINTS.proverb).

/** one training window, shortened to its first 10 tokens: input row and the target row (next token). "\n" = line break */
export const WINDOW_IN = ["\n", "가", "는", " ", "말", "이", " ", "고", "와", "야"];
export const WINDOW_OUT = ["가", "는", " ", "말", "이", " ", "고", "와", "야", " "];

/** lines the model wrote during the run (temperature 0.8), with the corpus loss at that step */
export const DIARY = [
  { step: "0걸음", loss: "5.82", text: "저죽올천갈문뛰꼬익외약눈짝붓…" },
  { step: "100걸음", loss: "3.54", text: "살 배 날지 발 찍등고이 나한다" },
  { step: "500걸음", loss: "1.88", text: "티끌 날 키고 석 준다" },
  { step: "1,000걸음", loss: "0.84", text: "닭 쫓던 개 년 지붕 쳐다본다" },
  { step: "1,500걸음", loss: "0.68", text: "남의 떡이 커 간다" },
];

/** s7: one line copied from the data, one new (both written at step 1,500) */
export const COPIED = "벼는 익을수록 고개를 숙인다";
export const FRESH = "누워서 계란 바위 치기";

export const LOOP = [
  { name: "예측", ch: "64장" },
  { name: "손실", ch: "65장" },
  { name: "역전파", ch: "23장" },
  { name: "손잡이 돌리기", ch: "21장, 67장" },
];

export const ch94: ChapterSpec = {
  id: 94,
  part: 11,
  title: "브라우저에서 훈련하기",
  core: true,
  hook: "모델은 진짜로 어떻게 배울까요? 내 폰 안에서 직접 지켜봐요.",
  steps: [
    { id: "s1", sec: 10, narration: "드디어 훈련이에요. 처음 미니 GPT의 손잡이 24,529개는 아무렇게나 정해져 있어서, 글자를 마구 찍어요." },
    { id: "s2", sec: 10.5, narration: "훈련 한 걸음은 이래요. 데이터에서 24토큰짜리 조각 8개를 꺼내, 자리마다 다음 토큰을 맞혀 보게 해요(64장)." },
    { id: "s3", sec: 10, narration: "틀린 만큼 손실이 나와요(65장). 처음 손실은 약 5.8, 337가지 중 아무거나 찍을 때의 놀람과 같아요." },
    { id: "s4", sec: 10, narration: "역전파로 손잡이마다 책임을 계산하고(23장), 손실이 줄어드는 쪽으로 살짝 돌려요. 이게 훈련 한 걸음이에요." },
    { id: "s5", sec: 10.5, narration: "이 한 바퀴를 1,500번 돌면 손실이 쭉 내려가요. 475걸음에 2 아래로, 850걸음에 1 아래로 내려갔어요." },
    { id: "s6", sec: 10.5, narration: "그동안 모델이 쓴 문장도 달라져요. 100걸음엔 엉터리, 500걸음엔 낱말이 보이고, 1,500걸음엔 속담 같아요." },
    { id: "s7", sec: 10.5, narration: "단, 오래 훈련하면 데이터를 통째로 외워요. 1,500걸음 모델이 쓴 80줄 중 35줄은 외운 문장이었어요(25장)." },
    { id: "s8", sec: 9, narration: "이제 직접 해보기에서 훈련 버튼을 눌러 보세요. 서버 없이, 폰 안에서 진짜 계산이 돌아가요." },
  ],
  playgroundTitle: "내 폰에서 훈련하기",
  playgroundIntro: "'훈련 시작'을 누르면 이 폰 안에서 진짜 미니 GPT가 훈련돼요. 손실 그래프와 생성 일기를 지켜보세요. 언제든 멈췄다 이어 할 수 있어요.",
  summary: [
    "한 걸음 = 조각 8개로 다음 토큰 맞히기 → 손실 → 역전파 → 손잡이 돌리기.",
    "손실은 5.8(아무거나 찍기)에서 1,500걸음 뒤 0.7까지 내려간다.",
    "오래 훈련하면 외우기 시작한다. 새 문장과 외운 문장을 구별하자.",
  ],
  unlocks: "내가 훈련한 미니 GPT",
  unlockLabel: "졸업 프로젝트 한 단계를 마쳤어요",
  quiz: [
    {
      q: "훈련 한 걸음에서 일어나는 일의 순서는?",
      choices: ["손잡이 돌리기 → 예측 → 손실 → 역전파", "역전파 → 예측 → 손잡이 돌리기 → 손실", "예측 → 손실 → 역전파 → 손잡이 돌리기"],
      answer: 2,
      explain: "먼저 맞혀 보고(예측), 틀린 만큼 재고(손실), 책임을 나누고(역전파), 손잡이를 돌려요(66장).",
      review: "s4",
    },
    {
      q: "훈련을 시작할 때 손실이 약 5.8인 이유는?",
      choices: ["337가지 중 아무거나 찍는 것과 같아서", "모델이 이미 속담을 조금 알아서", "데이터가 5.8KB라서"],
      answer: 0,
      explain: "처음엔 모든 토큰에 확률을 똑같이 줘요. 337가지 중 하나를 찍을 때의 놀람이 약 5.8이에요.",
      review: "s3",
    },
    {
      q: "손실이 아주 낮아질 때까지 훈련하면 생기는 일은?",
      choices: ["모델이 고장 난다", "데이터를 통째로 외운 문장이 많아진다", "토큰 종류가 줄어든다"],
      answer: 1,
      explain: "작은 데이터를 오래 보면 외워 버려요. 기출만 외운 학생처럼요(25장).",
      review: "s7",
    },
  ],
  labels: {
    tag: "94장 브라우저에서 훈련하기",
    model: "미니 GPT",
    knobs: "손잡이 24,529개",
    random: "처음엔 아무렇게나",
    first: "처음 모델이 쓴 글",
    input: "입력",
    target: "정답",
    newline: "줄바꿈",
    space: "띄어쓰기",
    window: "24토큰 × 조각 8개",
    eachNext: "자리마다 다음 토큰 맞히기",
    loss: "손실",
    lossStart: "5.82",
    guess: "337가지 중 아무거나 찍기",
    flat: "모든 토큰이 똑같이 1/337",
    oneStep: "훈련 한 걸음",
    axisSteps: "걸음",
    below2: "475걸음: 2 아래",
    below1: "850걸음: 1 아래",
    end: "1,500걸음: 0.68",
    diary: "생성 일기",
    copied: "외운 문장",
    inData: "데이터에 그대로 있어요",
    fresh: "새 문장",
    notInData: "데이터에 없는 말",
    stat: "80줄 중 35줄은 외운 문장",
    exam: "기출만 외운 학생 (25장)",
    start: "훈련 시작",
    noServer: "서버 없이, 폰 안에서!",
    realRun: "실제 훈련 기록",
  },
};
