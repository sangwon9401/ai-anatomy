import type { ChapterSpec, Highlighter } from "./types";

export const SOURCES = ["뉴스", "백과사전", "블로그", "책", "코드", "게시판"];

export type Kind = "ok" | "dup" | "quality" | "harm";

/** Illustrative mix of 100 collected units (labelled 설명용 예시 in the scene); real ratios differ by dataset. */
export const MIX: { kind: Kind; n: number; c: Highlighter }[] = [
  { kind: "dup", n: 40, c: "violet" },
  { kind: "quality", n: 30, c: "orange" },
  { kind: "harm", n: 5, c: "pink" },
  { kind: "ok", n: 25, c: "sky" },
];

/** "−40", "−30", "−5": what each filter removes (drawn on the bins). */
export const BIN_CUTS = MIX.slice(0, 3).map((m) => `−${m.n}`);

export type FactoryDoc = { text: string; kind: Kind; why: string };

/** Playground: snippets the student sorts before the filters check them. */
export const FACTORY_DOCS: FactoryDoc[] = [
  { text: "광합성은 식물이 빛 에너지로 양분을 만드는 과정이다.", kind: "ok", why: "배울 게 있는 백과사전 글" },
  { text: "★★초특가★★ 지금 클릭! 클릭! 무료 쿠폰 받기", kind: "quality", why: "광고: 배울 내용이 없어요" },
  { text: "오늘 급식은 카레였다. 맛있어서 두 번 받아 먹었다.", kind: "ok", why: "평범한 일상 글도 좋은 교과서예요" },
  { text: "광합성은 식물이 빛 에너지로 양분을 만드는 과정이다.", kind: "dup", why: "1번 글과 똑같은 복사본" },
  { text: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ", kind: "quality", why: "의미 없는 글자 나열" },
  { text: "for (let i = 0; i < 10; i++) { sum += i; }", kind: "ok", why: "코드도 배워요" },
  { text: "우리 반 OO이 전화번호 010-XXXX-XXXX 여기 공개함", kind: "harm", why: "개인정보가 담긴 글" },
  { text: "임진왜란은 1592년에 일어났다.", kind: "ok", why: "역사 지식이 담긴 글" },
  { text: "야 이 @#$%야 진짜 @#$% 같네", kind: "harm", why: "욕설" },
  { text: "오늘 급식은 카레였다. 맛있어서 두 번 받아 먹었다.", kind: "dup", why: "3번 글과 똑같은 복사본" },
];

export const KIND_NAME: Record<Kind, string> = { ok: "통과", dup: "중복", quality: "품질", harm: "유해" };

export const ch63: ChapterSpec = {
  id: 63,
  part: 7,
  title: "교과서는 인터넷",
  core: false,
  hook: "ChatGPT는 도대체 무슨 책으로 공부했을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "ChatGPT의 교과서는 인터넷이에요. 뉴스, 백과사전, 블로그, 책, 코드까지 사람이 쓴 글을 엄청나게 모아요." },
    { id: "s2", sec: 10, narration: "그런데 모은 글을 그대로 쓰면 안 돼요. 똑같은 글이 수없이 복사돼 있고, 광고와 깨진 글, 나쁜 말도 섞여 있어요." },
    { id: "s3", sec: 9, narration: "그래서 글 공장을 거쳐요. 첫 번째는 중복 제거. 똑같거나 거의 같은 글은 하나만 남기고 지워요." },
    { id: "s4", sec: 9, narration: "두 번째는 품질 필터. 광고, 의미 없는 글자 나열, 같은 말 반복처럼 배울 게 없는 글을 걸러요." },
    { id: "s5", sec: 9, narration: "세 번째는 유해 콘텐츠 필터. 욕설, 위험한 내용, 전화번호 같은 개인정보가 담긴 글을 빼요." },
    { id: "s6", sec: 8, narration: "설명용 예시로, 100만큼 모았다면 25만큼만 남아요. 실제 비율은 데이터마다 달라요." },
    { id: "s7", sec: 11, narration: "GPT-3는 이렇게 고른 글로 약 3,000억 토큰을 공부했어요. 4장에서 본 대로, 좋은 데이터가 좋은 모델을 만들어요." },
  ],
  playgroundTitle: "글 공장 검사관",
  playgroundIntro: "글마다 남길지 버릴지 먼저 골라 보세요. 다 고르면 공장의 필터 세 개가 정답을 알려 줘요.",
  summary: [
    "ChatGPT의 교과서 = 인터넷의 엄청난 글 (뉴스, 백과사전, 책, 코드…).",
    "그대로 쓰지 않고 중복 제거 → 품질 필터 → 유해 콘텐츠 필터를 거친다.",
    "걸러 내면 양은 줄지만, 좋은 데이터가 좋은 모델을 만든다.",
  ],
  unlocks: "데이터 정제",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "똑같은 글이 1,000번 복사돼 있으면 어떻게 할까요?",
      choices: ["하나만 남기고 지운다", "1,000번 다 공부시킨다", "전부 지운다"],
      answer: 0,
      explain: "같은 글을 계속 보면 그 글만 통째로 외우기 쉬워요. 하나만 남기는 게 중복 제거예요.",
      review: "s3",
    },
    {
      q: "품질 필터가 걸러 낼 글은?",
      choices: ["광합성을 설명한 백과사전 글", "'ㅋㅋㅋㅋ'만 가득한 글", "급식 메뉴 후기 블로그"],
      answer: 1,
      explain: "의미 없는 글자 나열은 배울 게 없어요. 평범한 일상 글은 좋은 교과서예요.",
      review: "s4",
    },
    {
      q: "필터를 모두 지나고 나면 글의 양은?",
      choices: ["그대로다", "더 많아진다", "꽤 줄어든다"],
      answer: 2,
      explain: "중복, 품질, 유해 필터에서 많은 글이 빠져요. 양은 줄어도 훨씬 좋은 교과서가 돼요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "63장 교과서는 인터넷",
    collected: "모은 글 (한 칸 = 1%)",
    people: "사람이 쓴\n엄청난 양의 글",
    dup: "똑같은 글",
    dupX: "×1000",
    junk: "광고 · 깨진 글",
    bad: "욕설 · 개인정보",
    good: "배울 게 있는 글",
    mixed: "이대로는 교과서로 못 써요",
    f1: "① 중복 제거",
    f2: "② 품질 필터",
    f3: "③ 유해 콘텐츠 필터",
    bin1: "중복",
    bin2: "품질",
    bin3: "유해",
    sameText: "오늘은 맑음",
    keepOne: "하나만 남기기",
    junk1: "ㅋㅋㅋㅋㅋㅋㅋ",
    junk2: "★특가★ 클릭!",
    noLearn: "배울 게 없어요",
    harm1: "@#$% 욕설",
    harm2: "010-XXXX-XXXX",
    harmNote: "위험한 내용도 빼요",
    ratio: "100 → 25",
    example: "설명용 예시 비율",
    differs: "실제 비율은\n데이터마다 달라요",
    book: "깨끗한 교과서",
    gpt3: "GPT-3가 공부한 글",
    tokens: "약 3,000억 토큰",
    goodData: "좋은 데이터 → 좋은 모델",
    next: "64장: 이 글로 어떻게 공부할까?",
  },
};
