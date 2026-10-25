import type { ChapterSpec } from "./types";

/** bytes = parameters × bits ÷ 8; GB here means 10억(10⁹) bytes */
export const sizeGB = (params: number, bits: number) => (params * bits) / 8 / 1e9;

export const GPT3 = 175e9;
export const SMALL = 3e9; // a 30억-parameter model for the worked example
export const BITS = [32, 16, 8, 4] as const;
export const PHONE_GB = [8, 12] as const; // a typical range for phone memory (RAM) today

/**
 * Quantise onto a ruler with 2^bits evenly spaced ticks from −range to +range.
 * Returns the tick value nearest to w.
 */
export function quantize(w: number, bits: number, range: number) {
  const n = 2 ** bits - 1;
  const step = (2 * range) / n;
  const k = Math.round((w + range) / step);
  return -range + k * step;
}

export const WEIGHTS = [0.82, -0.35, 0.07, -1.2]; // illustrative knob values (설명용 예시)
export const RANGE = 1.2;

// distillation: teacher's next-piece probabilities for "나는 오늘 학교에" (ch01), and a student before/after
export const NEXT = ["간다", "갔다", "늦었다", "그 밖"];
export const TEACHER = [0.52, 0.21, 0.12, 0.15];
export const STUDENT_BEFORE = [0.3, 0.1, 0.35, 0.25];
export const STUDENT_AFTER = [0.49, 0.22, 0.13, 0.16];

export const PARAM_PRESETS = [
  { key: "1b", label: "10억 개", n: 1e9 },
  { key: "3b", label: "30억 개", n: 3e9 },
  { key: "8b", label: "80억 개", n: 8e9 },
  { key: "gpt3", label: "1,750억 개 (GPT-3)", n: GPT3 },
];

export const ch90: ChapterSpec = {
  id: 90,
  part: 10,
  title: "내 폰 속 AI",
  core: false,
  hook: "거대한 AI가 어떻게 인터넷도 없이 내 폰 안에서 돌아갈까요?",
  steps: [
    { id: "s1", sec: 8, narration: "GPT-3에는 손잡이(파라미터)가 1,750억 개 있어요(12장). 하나를 32비트, 즉 4바이트 숫자로 저장하면 모두 얼마나 클까요?" },
    { id: "s2", sec: 8, narration: "1,750억 × 4바이트 = 7,000억 바이트, 약 700GB예요. 요즘 폰 메모리는 8~12GB 정도라서 어림도 없어요." },
    { id: "s3", sec: 8, narration: "첫째 방법은 작은 모델 만들기예요. 큰 선생님 모델의 답을 작은 학생 모델이 따라 하게 가르쳐요. 이걸 증류라고 해요." },
    { id: "s4", sec: 9, narration: "정답 하나만이 아니라 선생님의 확률 막대 전체를 따라 해요. '갔다'도 꽤 그럴듯하다는 것까지 배우는 거죠." },
    { id: "s5", sec: 9, narration: "둘째 방법은 숫자를 덜 자세히 적기예요. 8비트는 눈금 256개, 4비트는 눈금 16개짜리 자로 재는 셈이죠. 이걸 양자화라고 해요." },
    { id: "s6", sec: 8, narration: "0.82를 8비트 자로 재면 0.824, 4비트 자로 재면 0.88이 돼요. 조금 어긋나지만, 모델은 대체로 비슷하게 움직여요." },
    { id: "s7", sec: 8, narration: "30억 개짜리 모델로 계산해 봐요. 32비트면 12GB, 8비트면 3GB, 4비트면 1.5GB. 이제 폰에 들어가요!" },
    { id: "s8", sec: 9, narration: "폰 안에서 돌면 인터넷 없이도 되고, 내 글이 폰 밖으로 나가지 않아요. 대신 작은 모델이라 어려운 질문엔 약할 수 있어요." },
  ],
  playgroundTitle: "모델 압축 계산기",
  playgroundIntro: "파라미터 수와 비트 수를 골라 모델 크기를 계산해 보세요. 폰 메모리에 들어갈까요? 아래에선 눈금 자로 숫자가 얼마나 어긋나는지도 봐요.",
  summary: [
    "모델 크기 = 파라미터 수 × 숫자 하나의 바이트. GPT-3를 32비트로 담으면 약 700GB.",
    "증류: 작은 학생 모델이 큰 선생님 모델의 확률 막대를 따라 하며 배운다.",
    "양자화: 32비트 대신 8비트·4비트로 거칠게 적는다. 작은 모델 + 양자화 = 폰 속 AI.",
  ],
  unlocks: "모델 압축",
  unlockLabel: "새 능력 카드를 하나 얻었어요",
  quiz: [
    {
      q: "파라미터 30억 개를 8비트(1바이트)로 저장하면 몇 GB일까요?",
      choices: ["3GB", "12GB", "30GB"],
      answer: 0,
      explain: "30억 × 1바이트 = 30억 바이트 = 3GB예요. 32비트(4바이트)라면 12GB.",
      review: "s7",
    },
    {
      q: "증류(distillation)에서 학생 모델은 무엇을 따라 할까요?",
      choices: ["선생님 모델의 파라미터 개수", "선생님 모델이 낸 확률 막대", "선생님 모델의 이름"],
      answer: 1,
      explain: "정답 하나보다 많은 걸 담은 선생님의 확률 막대 전체를 따라 해요.",
      review: "s4",
    },
    {
      q: "양자화를 하면 어떤 일이 생길까요?",
      choices: ["모델이 더 정확해진다", "파라미터 수가 늘어난다", "크기는 줄고, 숫자는 조금 어긋난다"],
      answer: 2,
      explain: "눈금이 적은 자로 재는 셈이라 숫자가 조금 어긋나요. 대신 크기가 크게 줄어요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "90장 내 폰 속 AI",
    knobs: "손잡이 1,750억 개",
    oneKnob: "손잡이 1개 = 32비트 = 4바이트",
    byte: "1바이트",
    bitsOf: "예: 0.82를 32비트로 적은 모습",
    gb700: "700GB",
    eq: "1,750억 × 4바이트 = 7,000억 바이트",
    total: "≈ 700GB",
    phone: "폰 메모리 8~12GB",
    noWay: "어림도 없어요!",
    teacher: "선생님 모델",
    student: "학생 모델",
    big: "크고 똑똑함",
    small: "작고 가벼움",
    copy: "따라 하기",
    distill: "증류 (distillation)",
    context: "나는 오늘 학교에 ___",
    tBars: "선생님의 확률",
    sBars: "학생의 확률",
    oneHot: "정답만 보면: 간다 100%, 나머지 0%",
    more: "'갔다'도 그럴듯하다는 것까지!",
    example: "* 설명용 예시",
    r32: "32비트: 거의 끝없이 촘촘",
    r8: "8비트: 눈금 256개",
    r4: "4비트: 눈금 16개",
    quant: "양자화 (quantization)",
    w: "0.82",
    q8: "→ 0.824",
    q4: "→ 0.88",
    off: "조금 어긋나도 대체로 비슷하게 동작",
    model3: "30억 개짜리 모델",
    line: "폰 메모리 8GB",
    fits: "폰에 들어가요!",
    tight: "빠듯",
    gb12: "12GB",
    gb6: "6GB",
    gb3: "3GB",
    gb15: "1.5GB",
    b32: "32비트",
    b16: "16비트",
    b8: "8비트",
    b4: "4비트",
    offline: "인터넷 없이도 돼요",
    private: "내 글이 폰 밖으로 안 나가요",
    npu: "요즘 폰 칩엔 AI 계산 전용 부품(NPU)도 있어요",
    weak: "대신 어려운 질문엔 약할 수도",
    chatQ: "내일 할 일 정리해 줘",
    chatA: "네! 세 가지로 정리하면…",
    onDevice: "폰 안에서 계산 중",
  },
};
