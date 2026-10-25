import type { ChapterSpec, Highlighter } from "./types";

/** Canonical parameter counts (CHAPTER_GUIDE "Canonical facts"); floors = parameters / 1억. */
export const MODELS: { key: string; name: string; year: number; params: number; paramsText: string; c: Highlighter }[] = [
  { key: "gpt1", name: "GPT-1", year: 2018, params: 1.17e8, paramsText: "1.17억 개", c: "mint" },
  { key: "gpt2", name: "GPT-2", year: 2019, params: 1.5e9, paramsText: "15억 개", c: "sky" },
  { key: "gpt3", name: "GPT-3", year: 2020, params: 1.75e11, paramsText: "1,750억 개", c: "yellow" },
];
export const FLOOR = 1e8; // 1억 parameters = one floor
export const floors = (params: number) => params / FLOOR;

/** 롯데월드타워: 123 floors above ground (real building, used only as a yardstick). */
export const TOWER = { key: "tower", name: "롯데월드타워", floors: 123 };

export const ratio = (a: number, b: number) => a / b;
/** "약 13배" style: whole numbers, thousands separated. */
export const timesText = (r: number) => `약 ${Math.round(r).toLocaleString("ko-KR")}배`;

export const GUESSES = [175, 1750, 17500];

export const ch69: ChapterSpec = {
  id: 69,
  part: 7,
  title: "GPT-1 → 2 → 3",
  core: false,
  hook: "GPT-1에서 GPT-3까지, 2년 동안 얼마나 커졌을까요?",
  steps: [
    { id: "s1", sec: 11, narration: "GPT는 한 번에 태어나지 않았어요. 2018년 GPT-1, 2019년 GPT-2, 2020년 GPT-3. 해마다 몸집이 커졌어요." },
    { id: "s2", sec: 10, narration: "파라미터(12장의 손잡이) 1억 개를 건물 1층이라고 해 볼게요. GPT-1은 1.17억 개, 겨우 1층짜리 집이에요." },
    { id: "s3", sec: 7, narration: "GPT-2는 15억 개. 15층 아파트가 됐어요. 1년 만에 약 13배로 커졌죠." },
    { id: "s4", sec: 9, narration: "GPT-3는 1,750억 개예요. 몇 층일까요? 화면에 다 안 들어가요. 뒤로 물러나 볼게요." },
    { id: "s5", sec: 11, narration: "무려 1,750층! GPT-2의 약 117배, GPT-1의 약 1,500배예요. GPT-1은 점 하나로도 안 보여요." },
    { id: "s6", sec: 8, narration: "123층짜리 롯데월드타워를 약 14개 쌓아야 닿는 높이예요. 어마어마하죠." },
    { id: "s7", sec: 11, narration: "덩치를 키운 GPT-3는 예시 몇 개만 보고도 새 문제를 풀어냈어요(71장). 왜 클수록 똑똑해질까요? 다음 장에서 봐요." },
  ],
  playgroundTitle: "건물 높이 비교",
  playgroundIntro: "1억 개 = 1층이에요. 먼저 GPT-3가 몇 층일지 맞혀 보세요. 그다음 건물을 켜고 끄면서 크기를 비교해 봐요.",
  summary: [
    "GPT-1(2018) 1.17억 → GPT-2(2019) 15억 → GPT-3(2020) 1,750억 개.",
    "1억 개 = 1층이면 1층 집 → 15층 아파트 → 1,750층 탑.",
    "2년 만에 약 1,500배. 크기를 키우자 새로운 능력이 나타났다(71장).",
  ],
  unlocks: "GPT 모델 크기",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "GPT-1, GPT-2, GPT-3가 나온 해는?",
      choices: ["2016, 2017, 2018", "2018, 2019, 2020", "2020, 2021, 2022"],
      answer: 1,
      explain: "GPT-1은 2018년, GPT-2는 2019년, GPT-3는 2020년에 나왔어요.",
      review: "s1",
    },
    {
      q: "1억 개 = 1층이라면, GPT-3(1,750억 개)는 몇 층?",
      choices: ["175층", "17층", "1,750층"],
      answer: 2,
      explain: "1,750억 ÷ 1억 = 1,750층이에요.",
      review: "s5",
    },
    {
      q: "GPT-3의 파라미터는 GPT-2의 약 몇 배?",
      choices: ["약 117배", "약 2배", "약 10배"],
      answer: 0,
      explain: "1,750억 ÷ 15억 ≈ 117배예요. 1년 만에 이만큼 커졌어요.",
      review: "s5",
    },
  ],
  labels: {
    tag: "69장 GPT-1 → 2 → 3",
    grow: "해마다 몸집이 커졌어요",
    floorRule: "파라미터 1억 개 = 1층",
    f1: "≈ 1층",
    f2: "= 15층",
    f3: "= 1,750층",
    tiny: "겨우 1층!",
    x13: "약 13배",
    howTall: "몇 층?",
    offScreen: "화면 밖까지…",
    back: "뒤로 물러나기",
    x117: "GPT-2의 약 117배",
    x1500: "GPT-1의 약 1,500배",
    dot: "GPT-1은 여기 (점보다 작아요)",
    tower: "롯데월드타워 123층",
    x14: "× 약 14개",
    huge: "어마어마하죠!",
    fewShot: "예시 몇 개만 보고 새 문제를 풀었어요 (71장)",
    why: "왜 클수록 똑똑해질까?",
    next: "70장: 스케일링 법칙",
  },
};
