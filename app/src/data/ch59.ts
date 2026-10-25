import { UNLOCK6 } from "./ch54";
import type { ChapterSpec } from "./types";

export const SENT = ["나는", "오늘", "학교에", "간다"];

/** The words a model may look at when guessing SENT[target]. */
export function visible(mode: "bert" | "gpt", target: number) {
  return SENT.map((_, i) => i).filter((i) => (mode === "bert" ? i !== target : i < target));
}

/** A sentence about a (mode, target) pair for the playground. */
export function explain(mode: "bert" | "gpt", target: number) {
  const seen = visible(mode, target).map((i) => `'${SENT[i]}'`);
  if (mode === "bert" && target === 2) return "앞의 '나는 오늘'과 뒤의 '간다'를 다 봐요. '간다' 앞이니까 '피자를'은 어색하죠. 양쪽을 보면 빈칸이 쉬워져요.";
  if (mode === "gpt" && target === 2) return "'나는 오늘'까지만 보여요. '학교에', '집에', '피자를'… 여러 말이 다 그럴듯해서 확률로 골라요(1장).";
  if (mode === "gpt" && target === 3) return "'나는 오늘 학교에'를 보고 다음 말을 맞혀요. 우리가 계속 본 바로 그 문제예요. 간다 52%!";
  if (mode === "gpt" && target === 0) return "맨 앞 단어는 앞에 볼 단어가 없어요. 그래서 GPT에겐 첫 단어가 가장 맞히기 어려워요.";
  if (mode === "bert") return `가려진 단어 말고 나머지를 모두 봐요: ${seen.join(", ")}.`;
  return `앞의 ${seen.join(", ")}만 보고 맞혀요. 뒤 단어는 가림막에 가려 있어요(51장).`;
}

export const ch59: ChapterSpec = {
  id: 59,
  part: 6,
  title: "인코더 vs 디코더",
  core: false,
  hook: "ChatGPT의 'GPT'와 구글의 'BERT', 둘 다 트랜스포머인데 뭐가 다를까요?",
  steps: [
    { id: "s1", sec: 9.5, narration: "2017년 처음 나온 트랜스포머는 번역기였어요. 원문을 읽는 인코더와 번역문을 쓰는 디코더로 되어 있었죠(44장)." },
    { id: "s2", sec: 9, narration: "2018년에는 둘 중 한쪽만 떼어 쓴 모델이 나왔어요. 인코더만 쌓은 BERT와 디코더만 쌓은 GPT예요." },
    { id: "s3", sec: 9, narration: "BERT는 문장 전체를 양쪽에서 봐요. 중간 단어를 가려 놓고, 앞뒤 단어로 빈칸을 맞히는 연습을 해요." },
    { id: "s4", sec: 9, narration: "GPT는 앞 단어만 봐요. 51장의 가림막으로 미래를 가린 채, 다음 단어를 맞히는 연습을 해요." },
    { id: "s5", sec: 9, narration: "어텐션 표로 보면 BERT는 모든 칸이 열려 있고, GPT는 대각선과 그 아래 삼각형만 열려 있어요." },
    { id: "s6", sec: 8.5, narration: "그래서 BERT는 문장을 이해하는 일에, GPT는 글을 한 단어씩 이어 쓰는 일에 강해요." },
    { id: "s7", sec: 9.5, narration: "ChatGPT는 디코더 블록만 쌓은 GPT예요. 54장부터 조립한 블록이 바로 이 디코더 블록이에요." },
  ],
  playgroundTitle: "빈칸 vs 다음 말",
  playgroundIntro: "BERT와 GPT 중 하나를 고르고, 맞힐 단어를 눌러 보세요. 그 단어를 맞힐 때 볼 수 있는 단어가 달라져요.",
  summary: [
    "원래 트랜스포머(2017)는 인코더 + 디코더로 된 번역기였다.",
    "BERT = 인코더만 쌓음: 양쪽을 다 보고 빈칸 맞히기. 문장 이해에 강하다.",
    "GPT = 디코더만 쌓음: 앞만 보고(가림막) 다음 단어 맞히기. 글 이어 쓰기에 강하다. ChatGPT도 이쪽.",
  ],
  unlocks: "디코더 블록",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "BERT가 연습하는 문제는?",
      choices: ["가려진 빈칸을 앞뒤 단어로 맞히기", "다음 단어 맞히기", "문장 번역하기"],
      answer: 0,
      explain: "BERT는 문장 중간을 가리고 양쪽 단어를 보며 빈칸을 맞혀요. 다음 단어 맞히기는 GPT의 연습이에요.",
      review: "s3",
    },
    {
      q: "GPT의 어텐션 표에서 열려 있는 칸은?",
      choices: ["모든 칸", "대각선과 그 아래 삼각형", "대각선 위 삼각형"],
      answer: 1,
      explain: "각 단어는 자기와 앞 단어만 볼 수 있어요. 미래 칸은 가림막으로 가려요(51장).",
      review: "s5",
    },
    {
      q: "글을 한 단어씩 이어 쓰는 일에 맞는 것은?",
      choices: ["BERT (인코더)", "둘 다 똑같다", "GPT (디코더)"],
      answer: 2,
      explain: "GPT는 앞 단어만 보고 다음 단어를 맞히도록 배워서, 하나씩 이어 쓰기에 딱 맞아요(2장).",
      review: "s6",
    },
  ],
  labels: {
    tag: "59장 인코더 vs 디코더",
    y2017: "2017년 트랜스포머 = 번역기",
    src: "I go to school today",
    dst: "나는 오늘 학교에 간다",
    enc: "인코더",
    dec: "디코더",
    encDo: "원문을 읽는 쪽",
    decDo: "번역문을 쓰는 쪽",
    x6: "× 6층",
    bert: "BERT",
    gpt: "GPT",
    bertBy: "2018, 구글",
    gptBy: "2018, OpenAI",
    encOnly: "인코더만 쌓음",
    decOnly: "디코더만 쌓음",
    blank: "?",
    both: "양쪽을 다 봐요",
    front: "앞만 봐요",
    fill: "빈칸 맞히기",
    next: "다음 말 맞히기",
    mask: "가림막 (51장)",
    future: "미래",
    rows: "가로줄: 쳐다보는 단어",
    cols: "세로줄: 보이는 단어",
    understand: "문장 이해",
    understandEx: "검색, 문장 분류",
    write: "글 이어 쓰기",
    writeEx: "대화, 글쓰기",
    decoderBlock: "GPT의 블록 = 디코더 블록",
    chatgpt: "ChatGPT도 이 블록!",
    masked: "가림막 어텐션 (51장)",
    w1: "나는",
    w2: "오늘",
    w3: "학교에",
    w4: "간다",
  },
};
