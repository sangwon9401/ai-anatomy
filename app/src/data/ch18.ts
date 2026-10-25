import type { ChapterSpec } from "./types";

/** the first layer of 18장: two ReLU neurons on 맵기 (설명용 예시) */
export const FOLD_AT = 3;
export const FOLD_TABLE = [1, 2, 3, 4, 5].map((m) => {
  const h1 = Math.max(0, m - FOLD_AT);
  const h2 = Math.max(0, FOLD_AT - m);
  return { m, h1, h2, d: h1 + h2 };
});

export const ch18: ChapterSpec = {
  id: 18,
  part: 2,
  title: "층을 쌓으면",
  core: false,
  hook: "뉴런 하나로 못 푸는 문제, 뉴런을 여러 개 모으면 풀 수 있을까요?",
  steps: [
    { id: "s1", sec: 8, narration: "17장의 V자 경계는 어떻게 만들까요? 뉴런 하나로는 직선밖에 못 그리니까, 뉴런 여러 개를 모아 층을 만들어요." },
    { id: "s2", sec: 9, narration: "첫 층에 뉴런 두 개를 둬요. 하나는 맵기 − 3, 하나는 3 − 맵기를 계산하고, 둘 다 ReLU로 음수를 0으로 꺾어요." },
    { id: "s3", sec: 8, narration: "두 값을 더하면 '3단계에서 얼마나 먼가'가 돼요. 1단계와 5단계는 똑같이 2, 2단계와 4단계는 똑같이 1이에요." },
    { id: "s4", sec: 8, narration: "평면에서 보면 종이를 3단계 선에서 반으로 접은 거예요. 왼쪽 점들이 오른쪽으로 넘어가 포개져요." },
    { id: "s5", sec: 8, narration: "접힌 종이 위에서는 V자가 직선으로 펴져요. 이제 다음 층의 뉴런 하나가 직선 하나로 깔끔하게 갈라요." },
    { id: "s6", sec: 8, narration: "층을 더 쌓으면 접고 또 접을 수 있어요. 두 번 접으면 W자, 여러 번 접으면 아주 복잡한 경계도 만들어요." },
    { id: "s7", sec: 9, narration: "이렇게 층을 쌓은 신경망을 다층 퍼셉트론(MLP)이라고 해요. GPT-3는 층마다 이런 뉴런을 49,152개씩 써요." },
  ],
  playgroundTitle: "종이 접기 신경망",
  playgroundIntro: "접는 곳을 정하고 접기 슬라이더를 밀어 보세요. 접힌 종이 위에서 직선 하나로 13곳을 모두 가르면 성공이에요.",
  summary: [
    "뉴런 여러 개를 나란히 = 층. 층을 여러 개 이으면 다층 퍼셉트론(MLP).",
    "ReLU 뉴런 두 개로 공간을 '접을' 수 있다. 접으면 V자가 직선이 된다.",
    "층이 깊을수록 접고 또 접어서 더 복잡한 경계를 만든다.",
  ],
  unlocks: "층 쌓기 (MLP)",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "맵기가 5일 때, ReLU(맵기 − 3)과 ReLU(3 − 맵기)는 각각 얼마일까요?",
      choices: ["2와 0", "2와 −2", "0과 2"],
      answer: 0,
      explain: "5 − 3 = 2는 양수라 그대로 2, 3 − 5 = −2는 음수라 ReLU가 0으로 바꿔요.",
      review: "s2",
    },
    {
      q: "첫 층이 평면을 3단계 선에서 '접으면' 무엇이 좋아질까요?",
      choices: ["점의 개수가 줄어든다", "V자 경계가 직선이 되어 뉴런 하나로 가를 수 있다", "맛집이 모두 사라진다"],
      answer: 1,
      explain: "접힌 종이 위에서는 V자의 두 팔이 포개져 직선 하나가 돼요. 다음 층 뉴런은 직선만 그리면 돼요.",
      review: "s5",
    },
    {
      q: "GPT-3의 층 하나에 있는 이런 뉴런은 몇 개일까요? (피드포워드, 55장)",
      choices: ["12개", "약 1,000개", "49,152개"],
      answer: 2,
      explain: "GPT-3는 단어 벡터 12,288칸의 4배인 49,152개의 뉴런을 층마다 써요. 그런 층이 96개예요.",
      review: "s7",
    },
  ],
  labels: {
    tag: "18장 층을 쌓으면",
    q1: "V자 경계는 어떻게?",
    q2: "뉴런 하나 = 직선 하나",
    spicy: "맵기",
    line: "줄",
    example: "설명용 예시",
    layer1: "첫 번째 층",
    n1: "맵기 − 3",
    n2: "3 − 맵기",
    relu: "ReLU",
    h1: "h1 너무 매움",
    h2: "h2 너무 순함",
    sumRow: "h1 + h2",
    far: "3단계에서 먼 정도",
    fold: "3단계 선에서 반으로 접기",
    folded: "접으니 V자가 직선으로!",
    layer2: "다음 층 뉴런 하나면 끝",
    farAxis: "3단계에서 먼 정도",
    once: "1번 접기",
    twice: "2번 접기",
    many: "여러 번 접기",
    deeper: "층이 깊을수록 더 복잡한 경계",
    mlp: "다층 퍼셉트론 (MLP)",
    input: "입력",
    hidden: "층",
    output: "출력",
    gpt: "GPT-3: 층마다 뉴런 49,152개 × 96층",
    ffn: "55장 피드포워드에서 다시 만나요",
  },
};
