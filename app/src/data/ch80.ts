import { ROUND1 } from "./ch01";
import { TOY_PROMPT, generate } from "./part9-toy";
import type { ChapterSpec } from "./types";

// The ch01 distribution for "나는 오늘 학교에 ___" (illustrative): 간다 52, 갔다 21, 늦었다 12, 가기 9, 피자 1, 기타 5.
export const WHEEL = ROUND1;
export const PROMPT80 = TOY_PROMPT;

// Greedy with the Part 9 toy model loops: 간다 그리고 친구를 만났다 그리고 친구를 만났다 …
export const GREEDY_LOOP = generate(0, () => 0).slice(0, 8);

// The s5 spin lands on 갔다; the s6 spins give these twelve results (a typical-looking run, fixed for the video).
export const SPIN_FIRST = "갔다";
export const SPINS = ["간다", "갔다", "간다", "간다", "늦었다", "간다", "갔다", "간다", "가기", "간다", "늦었다", "갔다"];

export const ch80: ChapterSpec = {
  id: 80,
  part: 9,
  title: "고르는 방법",
  core: false,
  hook: "그냥 확률이 제일 높은 말만 고르면 되지 않나요?",
  steps: [
    { id: "s1", sec: 7, narration: "'나는 오늘 학교에' 다음 말의 확률이 나왔어요. 이제 이 중에서 하나를 골라야 해요. 어떻게 고를까요?" },
    { id: "s2", sec: 8, narration: "첫 번째 방법은 그리디예요. 욕심쟁이처럼 매번 확률이 가장 높은 1등만 골라요. 여기선 '간다'죠." },
    { id: "s3", sec: 7, narration: "그리디는 한결같아요. 같은 문장을 몇 번 넣어도 늘 1등만 고르니까, 답이 매번 똑같아요." },
    { id: "s4", sec: 8, narration: "대신 같은 말을 맴돌기 쉬워요. 1등만 따라가다 보면 '그리고 친구를 만났다'가 계속 되풀이돼요." },
    { id: "s5", sec: 8, narration: "두 번째 방법은 샘플링이에요. 확률만큼 칸을 나눈 룰렛을 돌려요. 13장에서 본 뽑기와 같아요." },
    { id: "s6", sec: 8, narration: "여러 번 돌리면 '간다'가 가장 자주 나오지만, '갔다'나 '늦었다'도 나와요. 매번 결과가 달라요." },
    { id: "s7", sec: 9, narration: "ChatGPT는 보통 샘플링을 써서 같은 질문에도 답이 조금씩 달라요. 룰렛 칸 크기는 다음 장의 온도로 조절해요." },
  ],
  playgroundTitle: "그리디 vs 룰렛",
  playgroundIntro: "같은 확률표로 두 방법을 비교해 보세요. 한 단어 고르기와 문장 끝까지 쓰기를 각각 여러 번 눌러 보세요.",
  summary: [
    "그리디: 매번 확률 1등만 고른다. 한결같지만 같은 말을 맴돌기 쉽다.",
    "샘플링: 확률만큼 칸을 나눈 룰렛을 돌린다. 돌릴 때마다 결과가 다르다.",
    "ChatGPT는 보통 샘플링을 써서, 같은 질문에도 답이 조금씩 다르다.",
  ],
  unlocks: "그리디 · 샘플링",
  unlockLabel: "추론 도구를 하나 얻었어요",
  quiz: [
    {
      q: "그리디 방식은 다음 말을 어떻게 고를까요?",
      choices: ["매번 확률이 가장 높은 말을 고른다", "확률만큼 칸을 나눈 룰렛을 돌린다", "가장 긴 말을 고른다"],
      answer: 0,
      explain: "그리디는 욕심쟁이처럼 늘 1등만 골라요.",
      review: "s2",
    },
    {
      q: "같은 문장을 그리디로 세 번 이어 쓰게 하면?",
      choices: ["매번 다른 답이 나온다", "세 번 모두 똑같은 답이 나온다", "갈수록 답이 짧아진다"],
      answer: 1,
      explain: "확률표가 같으면 1등도 같으니까, 그리디는 늘 같은 답을 내요.",
      review: "s3",
    },
    {
      q: "ChatGPT에 같은 질문을 두 번 하면 답이 조금씩 다른 까닭은?",
      choices: ["인터넷 검색 결과가 그때그때 바뀌어서", "모델이 가끔 고장 나서", "다음 말을 확률에 따라 룰렛처럼 뽑아서"],
      answer: 2,
      explain: "샘플링은 돌릴 때마다 결과가 달라요. 그래서 답도 조금씩 달라져요(2장).",
      review: "s7",
    },
  ],
  labels: {
    tag: "80장 고르는 방법",
    example: "설명용 예시 확률",
    how: "어떻게 고를까?",
    way1: "방법 1",
    way2: "방법 2",
    greedy: "그리디",
    greedyEn: "greedy = 욕심쟁이",
    top: "매번 1등만!",
    run: "번째",
    same: "몇 번을 해도 똑같아요",
    loop: "제자리 맴돌기",
    again: "또!",
    sampling: "샘플링",
    wheel: "확률만큼 칸을 나눈 룰렛",
    other: "기타",
    thisTime: "이번엔 '갔다'!",
    spins: "12번 돌려 보니",
    times: "번",
    vary: "매번 달라요",
    gTop: "늘 1등만",
    gSame: "매번 같은 답",
    gLoop: "같은 말을 맴돌기 쉬움",
    sTop: "확률만큼 룰렛",
    sVary: "매번 다른 답",
    sOdd: "가끔 엉뚱한 말",
    chatgpt: "ChatGPT는 보통 샘플링",
    next: "칸 크기 조절은 81장 온도로",
  },
};
