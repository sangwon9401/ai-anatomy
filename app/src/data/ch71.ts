import type { ChapterSpec, Highlighter } from "./types";

export type FewShotTask = {
  key: string;
  name: string;
  query: string;
  /** candidates: [the rule's answer, the odd example's answer, two plain continuations] */
  cands: string[];
  base: number[];
  examples: string[];
  odd: string;
};

// 설명용 예시: a made-up scoring rule, not a real model. Every matching example adds RULE_BOOST to the
// rule's answer; the odd example (from another pattern) adds ODD_BOOST to its own answer.
export const RULE_BOOST = 1.2;
export const ODD_BOOST = 2.0;

export const TASKS: FewShotTask[] = [
  {
    key: "opp",
    name: "반대말",
    query: "빠르다 →",
    cands: ["느리다", "fast", "빠르게", "빨리"],
    base: [0.6, 0, 1.6, 1.2],
    examples: ["크다 → 작다", "높다 → 낮다", "밝다 → 어둡다"],
    odd: "사과 → apple",
  },
  {
    key: "eng",
    name: "영어로",
    query: "강아지 →",
    cands: ["dog", "멍멍", "귀엽다", "강아지풀"],
    base: [0.6, 0.2, 1.6, 1.1],
    examples: ["사과 → apple", "학교 → school", "책 → book"],
    odd: "고양이 → 야옹",
  },
  {
    key: "cap",
    name: "수도",
    query: "영국 →",
    cands: ["런던", "영어", "축구", "여행"],
    base: [0.7, 0.3, 1.5, 1.2],
    examples: ["한국 → 서울", "일본 → 도쿄", "프랑스 → 파리"],
    odd: "독일 → 독일어",
  },
];

export const softmax71 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** The model's guess after `k` matching examples (and the odd one, if included). */
export const guess = (task: FewShotTask, k: number, odd = false) =>
  softmax71(task.base.map((b, i) => b + (i === 0 ? RULE_BOOST * k : 0) + (i === 1 && odd ? ODD_BOOST : 0)));

export const CAND_COLORS: Highlighter[] = ["mint", "orange", "sky", "violet"];

/** s6: 정답률 by number of examples, 설명용 예시 (the shape follows the GPT-3 paper: bigger models gain more). */
export const SHOTS = [0, 1, 2, 4, 8];
export const ACCURACY = [
  { name: "작은 모델", c: "sky" as Highlighter, v: [5, 7, 8, 9, 10] },
  { name: "중간 모델", c: "mint" as Highlighter, v: [10, 22, 28, 33, 36] },
  { name: "큰 모델", c: "pink" as Highlighter, v: [20, 45, 56, 64, 68] },
];

/** Part 7 recap chips (the unlocks of 63–71). */
export const PART7_TOOLS = ["데이터 정제", "자기지도학습", "교차 엔트로피", "사전학습", "Adam 옵티마이저", "GPU 병렬 계산", "GPT 모델 크기", "스케일링 법칙", "인컨텍스트 러닝"];

export const ch71: ChapterSpec = {
  id: 71,
  part: 7,
  title: "예시만 보여줘도 배운다",
  core: false,
  hook: "숫자를 하나도 안 고쳤는데, 모델이 새 일을 배울 수 있을까요?",
  steps: [
    { id: "s1", sec: 11, narration: "GPT-3를 소개한 2020년 논문의 제목은 '언어 모델은 퓨샷 학습자'예요. 예시 몇 개만 보고 새 일을 해낸다는 뜻이에요." },
    { id: "s2", sec: 11, narration: "'빠르다 →'만 주면 모델은 뭘 원하는지 몰라요. 반대말을 원했는데, '빠르게 달린다'처럼 그냥 글을 이어 쓰기 쉬워요." },
    { id: "s3", sec: 10, narration: "앞에 예시 하나를 붙여 볼게요. '크다 → 작다'. 이제 화살표 뒤에 반대말이 온다는 걸 눈치채기 시작해요." },
    { id: "s4", sec: 9, narration: "예시를 세 개 붙이면 '느리다'가 거의 확실해져요. 놀랍게도 모델 안의 숫자는 하나도 안 바뀌었어요." },
    { id: "s5", sec: 10, narration: "이게 인컨텍스트 러닝이에요. 66장처럼 숫자를 고치는 학습이 아니라, 프롬프트 속 예시에서 규칙을 읽어 내는 거예요." },
    { id: "s6", sec: 10, narration: "예시 개수에 따른 정답률을 그려 보면, 예시가 늘수록 올라가요. 그리고 큰 모델일수록 예시 덕을 더 많이 봐요." },
    { id: "s7", sec: 10, narration: "예시 없이 주면 제로샷, 하나면 원샷, 여러 개면 퓨샷이에요. 예시를 넣는 요령은 85장 프롬프트에서 또 써먹어요." },
    { id: "s8", sec: 11, narration: "Part 7에서 GPT를 공부시켰어요. 교과서, 다음 조각 맞히기, 놀람 줄이기, 훈련 고리, 크기의 힘. 다음은 대화를 배울 차례!" },
  ],
  playgroundTitle: "예시 넣기",
  playgroundIntro: "예시 카드를 눌러 프롬프트에 넣었다 뺐다 해 보세요. 모델의 숫자는 그대로인데, 예시만으로 대답이 바뀌어요. 엉뚱한 예시도 넣어 보세요.",
  summary: [
    "프롬프트에 예시를 보여 주면, 모델이 그 자리에서 규칙을 읽고 따라 한다 = 인컨텍스트 러닝.",
    "모델 안의 숫자는 그대로. 예시 0개 제로샷, 1개 원샷, 여러 개 퓨샷.",
    "Part 7: 인터넷 교과서 → 다음 조각 맞히기 → 놀람 줄이기 → 훈련 고리 → 크기의 힘.",
  ],
  unlocks: "인컨텍스트 러닝",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "인컨텍스트 러닝에서 바뀌는 것은?",
      choices: ["모델 안의 숫자(파라미터)", "프롬프트 속 예시", "토크나이저"],
      answer: 1,
      explain: "숫자는 하나도 안 고쳐요. 프롬프트에 넣은 예시만 바뀌고, 모델이 거기서 규칙을 읽어요.",
      review: "s5",
    },
    {
      q: "'크다 → 작다, 높다 → 낮다, 빠르다 →'처럼 예시 2개를 주는 방식은?",
      choices: ["퓨샷", "제로샷", "사전학습"],
      answer: 0,
      explain: "예시가 여러 개면 퓨샷, 하나면 원샷, 없으면 제로샷이에요.",
      review: "s7",
    },
    {
      q: "예시를 늘릴 때 정답률이 가장 크게 오르는 쪽은? (설명용 예시 그래프)",
      choices: ["작은 모델", "모두 똑같다", "큰 모델"],
      answer: 2,
      explain: "GPT-3 논문에서도 큰 모델일수록 프롬프트 속 예시를 더 잘 활용했어요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "71장 예시만 보여줘도 배운다",
    paperEn: "Language Models are Few-Shot Learners",
    paperKo: "언어 모델은 퓨샷 학습자",
    paperMeta: "2020 · GPT-3 논문",
    fewMeaning: "예시 몇 개 → 새 일",
    prompt: "프롬프트",
    guess: "모델의 다음 조각",
    example: "설명용 예시",
    wanted: "반대말을 원했는데…",
    notice: "눈치채기 시작!",
    sure: "거의 확실!",
    frozen: "모델 안의 숫자: 그대로",
    train: "학습 (66장)",
    trainDo: "숫자를 고친다",
    icl: "인컨텍스트 러닝",
    iclEn: "(in-context learning)",
    zeroEn: "zero-shot",
    oneEn: "one-shot",
    fewEn: "few-shot",
    iclDo: "숫자는 그대로, 예시에서 규칙 읽기",
    axisX: "프롬프트 속 예시 수 →",
    axisY: "↑ 정답률",
    bigGain: "큰 모델일수록 예시 덕을 더 봐요",
    zero: "제로샷",
    one: "원샷",
    few: "퓨샷",
    zeroN: "예시 0개",
    oneN: "예시 1개",
    fewN: "예시 여러 개",
    ch85: "85장: 프롬프트 요령",
    recap: "Part 7에서 얻은 도구",
    next: "다음: Part 8 ChatGPT의 탄생",
    nextQ: "72장: 똑똑하지만 말을 안 듣는 모델",
    q: "?",
  },
};
