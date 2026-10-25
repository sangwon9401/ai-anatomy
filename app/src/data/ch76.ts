import type { ChapterSpec } from "./types";

export type Kind = { text: string; short: string; excerpt: string; p0: number; judge: number; human: number };

/**
 * One question, four kinds of answers the fine-tuned model (ch73) might write.
 * p0: how often the original model writes it; judge: the reward model's score (ch75); human: what people would really give it.
 * The last one exploits a blind spot of the judge. All numbers are illustrative.
 */
export const QUESTION = "광합성이 뭐야?";
export const KINDS: Kind[] = [
  { text: "모르겠어요.", short: "모르겠어요", excerpt: "'모르겠어요.'", p0: 0.25, judge: -1, human: -1 },
  { text: "식물이 햇빛으로 양분을 만드는 일이에요.", short: "짧고 정확한 답", excerpt: "'식물이 햇빛으로 양분을…'", p0: 0.35, judge: 1, human: 1 },
  { text: "식물이 햇빛과 물, 이산화탄소로 양분과 산소를 만드는 일이에요. 잎의 엽록체에서 일어나요.", short: "친절하고 자세한 답", excerpt: "'햇빛과 물, 이산화탄소로…'", p0: 0.35, judge: 2, human: 2 },
  { text: "정말 정말 좋은 질문이에요!!! 광합성은 정말 대단해요!!! 최고예요!!!", short: "칭찬만 잔뜩", excerpt: "'정말 정말 좋은 질문이에요!!!'", p0: 0.05, judge: 2.4, human: -1 },
];

/** Where training ends up for a leash strength β: p0 × e^(judge / β), normalised. A small β = a long, loose leash. */
export function tuned(beta: number, t = 1, kinds: Kind[] = KINDS) {
  const u = kinds.map((k) => k.p0 * Math.exp((t * k.judge) / beta));
  const s = u.reduce((a, b) => a + b, 0);
  return u.map((x) => x / s);
}
export const mean = (p: number[], v: number[]) => p.reduce((a, x, i) => a + x * v[i], 0);
/** how far the tuned model has moved from the original one (KL divergence) */
export const drift = (p: number[], kinds: Kind[] = KINDS) => p.reduce((a, x, i) => a + (x > 1e-12 ? x * Math.log(x / kinds[i].p0) : 0), 0);

export const LEASH = [
  { name: "아주 짧게", beta: 10 },
  { name: "짧게", beta: 3 },
  { name: "조금 짧게", beta: 1.5 },
  { name: "알맞게", beta: 0.7 },
  { name: "조금 길게", beta: 0.3 },
  { name: "길게", beta: 0.1 },
  { name: "거의 없음", beta: 0.05 },
];

// scene s3: the first three kinds only, before and after one round of "more of what scored well" (β = 1)
export const S3_KINDS: Kind[] = [
  { ...KINDS[0], p0: 0.3 },
  { ...KINDS[1], p0: 0.4 },
  { ...KINDS[2], p0: 0.3 },
];

export const ch76: ChapterSpec = {
  id: 76,
  part: 8,
  title: "칭찬으로 다듬기",
  core: true,
  hook: "'좋은 대답'을 말로 다 설명할 수 없다면, 어떻게 가르칠까요?",
  steps: [
    { id: "s1", sec: 8, narration: "강아지에게 '앉아'를 가르칠 때, 말로 설명하진 않죠. 잘했을 때 간식을 주면 칭찬받는 행동이 점점 늘어나요." },
    { id: "s2", sec: 8, narration: "모델도 똑같아요. 질문을 받으면 모델이 답을 쓰고, 75장의 채점관이 점수를 매겨요. 이 점수가 간식이에요." },
    { id: "s3", sec: 8, narration: "점수가 높았던 답은 더 자주, 낮았던 답은 덜 나오도록 숫자를 고쳐요. 이게 사람 피드백 강화학습(RLHF)이에요." },
    { id: "s4", sec: 8, narration: "답의 모양을 한 줄로 늘어놓으면, 모델은 점수가 높은 쪽으로 조금씩 옮겨 가요. 강아지가 간식 쪽으로 가듯이요." },
    { id: "s5", sec: 8, narration: "그런데 점수만 쫓으면 위험해요. 채점관의 빈틈을 찾아, 칭찬만 늘어놓는 이상한 답으로 달려갈 수 있거든요." },
    { id: "s6", sec: 9, narration: "그래서 목줄을 채워요. 원래 모델(73장)에서 너무 멀어지면 점수를 깎아요. 이 목줄을 KL 벌점이라고 불러요." },
    { id: "s7", sec: 9, narration: "효과는 놀라웠어요. 사람들은 1,750억 GPT-3보다 RLHF를 거친 13억 InstructGPT의 답을 더 좋아했어요." },
    { id: "s8", sec: 8, narration: "모범 답안 따라 하기와 사람의 칭찬. 이 두 가지로 대화 연습이 끝났어요. 설계도의 빈칸이 하나 채워졌어요!" },
  ],
  playgroundTitle: "목줄 길이 정하기",
  playgroundIntro: "목줄 길이를 정하고 연습을 시켜 보세요. 채점관 점수만 보지 말고, 사람이 실제로 느끼는 만족도가 가장 높아지는 길이를 찾아보세요.",
  summary: [
    "RLHF: 모델이 답을 쓰고, 채점관 점수가 높은 답이 더 자주 나오도록 숫자를 고친다.",
    "점수만 쫓으면 채점관의 빈틈을 노린 이상한 답이 나온다.",
    "목줄(KL 벌점)로 원래 모델에서 너무 멀어지지 않게 한다.",
  ],
  unlocks: "대화 연습",
  quiz: [
    {
      q: "RLHF에서 강아지의 '간식' 역할을 하는 것은?",
      choices: ["사람이 쓴 모범 답안", "보상 모델(채점관)이 매긴 점수", "인터넷 글"],
      answer: 1,
      explain: "모델이 쓴 답을 75장의 채점관이 채점하고, 그 점수가 높은 쪽으로 모델을 고쳐요.",
      review: "s2",
    },
    {
      q: "목줄(KL 벌점)이 없으면 무슨 일이 생길 수 있을까요?",
      choices: ["모델이 학습을 멈춘다", "모델이 처음 모델과 똑같아진다", "채점관의 빈틈을 노린 이상한 답으로 치우친다"],
      answer: 2,
      explain: "채점관도 완벽하지 않아서, 점수만 쫓으면 사람은 싫어하는데 점수만 높은 답이 늘어나요.",
      review: "s5",
    },
    {
      q: "InstructGPT 실험에서 알게 된 사실은?",
      choices: ["RLHF로 다듬은 13억 모델이 1,750억 GPT-3보다 더 좋은 평가를 받았다", "모델이 클수록 무조건 사람들이 더 좋아한다", "RLHF는 큰 모델에서만 효과가 있다"],
      answer: 0,
      explain: "크기보다 '사람이 원하는 답'을 배웠는지가 평가를 크게 바꿨어요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "76장 칭찬으로 다듬기",
    sit: "앉아!",
    treat: "잘하면 간식!",
    more: "칭찬받는 행동이 늘어요",
    q: "질문",
    model: "모델",
    answer: "답",
    judge: "채점관 (75장)",
    snack: "점수 = 간식",
    question: "질문: 광합성이 뭐야?",
    judgeScore: "채점관 점수",
    often: "얼마나 자주 쓰나",
    up: "↑ 더 자주",
    down: "↓ 덜",
    repeat: "× 수없이 반복",
    example: "설명용 예시",
    axisX: "답의 모양 →",
    axisY: "↑ 채점관 점수",
    post: "원래 모델 (73장)",
    hill: "좋은 답",
    gap: "채점관의 빈틈",
    flatter: "정말 최고의 질문이에요!!!",
    chase: "점수만 쫓으면…",
    leash: "목줄",
    tooFar: "너무 멀어지면 점수 깎기",
    kl: "KL 벌점",
    rlhf: "RLHF",
    rlhfKo: "사람 피드백 강화학습",
    rlhfEn: "Reinforcement Learning from Human Feedback",
    ppo: "* 실제로는 PPO라는 방법으로 숫자를 고쳐요. 숫자는 설명용 예시",
    toward: "점수가 높은 쪽으로 조금씩",
    instruct: "InstructGPT",
    instructSize: "13억 + RLHF",
    gpt3: "GPT-3",
    gpt3Size: "1,750억",
    who: "사람들이 더 좋아한 답은?",
    liked: "사람들이 더 좋아한 쪽",
    small: "작은 쪽이 이겼어요!",
    trainTitle: "ChatGPT 설계도: 학습",
    filled: "채움",
    sft: "모범 답안 따라 하기 (73장)",
    praise: "사람의 칭찬 (76장)",
  },
};
