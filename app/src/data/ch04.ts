import type { ChapterSpec } from "./types";

// Word scores the "trained" filter ended up with. Illustrative values (labelled so in the UI),
// standing in for what a real filter would learn from thousands of examples.
export const WEIGHTS: Record<string, number> = {
  광고: 1.8, 무료: 0.9, 쿠폰: 2.1, 당첨: 2.4, 경품: 1.9, 링크: 1.5, 클릭: 1.3, 특가: 1.7, 할인: 1.4,
  지금: 0.6, 받기: 0.7, 축하합니다: 0.8, 수강: 0.4, 시사회: 0.3, 오늘만: 0.8, 확인: 0.5, 이벤트에: 1.0,
  뽑히셨습니다: 1.6, 급식: -1.6, 신청: -0.3, 안내: -0.6, 숙제: -1.2, 학교: -1.9, 선생님: -1.4,
  선생님이: -1.3, 내일: -0.8, 같이: -1.0, 주말: -0.4, 영화: -0.2, 갈래: -0.9, 수학: -0.7, 범위: -0.5,
  알려줘: -0.8, 학원: -0.2, 행사: -0.3, 가정통신문: -1.5, 친구야: -1.1, 치킨: -0.3, 먹을래: -0.9,
  메뉴: -0.4, 바뀌었대: -0.7, 보내: -0.1, 주신: -0.6, 봤어: -0.8,
};

export type Msg = { text: string; spam: boolean };

export const KNOWN: Msg[] = [
  { text: "[광고] 무료 쿠폰 지금 받기", spam: true },
  { text: "[광고] 무.료 쿠폰 당첨!", spam: true },
  { text: "축하합니다 경품 당첨! 링크 클릭", spam: true },
  { text: "가정통신문: 무료 급식 신청 안내", spam: false },
  { text: "내일 수학 숙제 범위 알려줘", spam: false },
  { text: "선생님: 내일 학교 행사 안내", spam: false },
  { text: "이번 주말 영화 무료 시사회 같이 갈래?", spam: false },
  { text: "[광고] 학원 특가 수강 쿠폰", spam: true },
];

export const FRESH: Msg[] = [
  { text: "오늘만 특가 할인! 지금 확인", spam: true },
  { text: "친구야 쿠폰 생겼는데 같이 치킨 먹을래?", spam: false },
  { text: "경품 이벤트에 뽑히셨습니다", spam: true },
  { text: "무료 급식 메뉴 바뀌었대", spam: false },
  { text: "선생님이 링크 보내 주신 거 봤어?", spam: false },
];

export const RULE_WORDS = ["무료", "쿠폰", "당첨", "광고", "링크"];

/** Split on spaces and trim brackets/punctuation at the edges only, so "무.료" stays a different word from "무료". */
export const words = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => w.replace(/^[[\](){}:!?,.]+|[[\](){}:!?,.]+$/g, ""))
    .filter(Boolean);

export const scoreOf = (text: string) => words(text).reduce((a, w) => a + (WEIGHTS[w] ?? 0), 0);

export const SCENE_SCALE = ["당첨", "쿠폰", "광고", "무료", "안내", "숙제", "급식", "학교"];

export const ch04: ChapterSpec = {
  id: 4,
  part: 0,
  title: "규칙으로 vs 데이터로",
  core: false,
  hook: "스팸 문자를 걸러내는 프로그램, 어떻게 만들 수 있을까요?",
  steps: [
    { id: "s1", sec: 6, narration: "스팸 문자를 걸러내는 프로그램을 만든다고 해 봐요. 가장 쉬운 방법은 규칙을 직접 쓰는 거예요." },
    { id: "s2", sec: 7, narration: "'무료'가 들어 있으면 스팸! 잘 되는 것 같죠? 그런데 스팸 보내는 사람이 '무.료'라고 쓰면 그냥 통과해요." },
    { id: "s3", sec: 7, narration: "반대로 학교에서 온 '무료 급식 안내'는 스팸으로 막혀요. 규칙을 고치고 또 고쳐도 끝이 없어요." },
    { id: "s4", sec: 8, narration: "그래서 방법을 뒤집었어요. 규칙 대신 '이건 스팸, 이건 정상' 하고 예시를 잔뜩 보여 주면, 컴퓨터가 규칙을 스스로 찾아내요." },
    { id: "s5", sec: 8, narration: "다 배운 모델 안에는 단어마다 점수가 생겨요. 당첨, 쿠폰은 스팸 쪽, 급식, 학교는 정상 쪽. 사람이 정해 준 적 없는 점수예요." },
    { id: "s6", sec: 8, narration: "이제 처음 보는 문자도 점수를 더해서 판단해요. '무.료' 꼼수를 써도 같이 쓰인 쿠폰과 당첨 때문에 걸려요." },
    { id: "s7", sec: 8, narration: "규칙은 사람이 쓰고, 학습은 데이터가 가르쳐요. ChatGPT도 문법 규칙을 하나하나 배운 게 아니라, 엄청난 양의 글을 보고 익혔어요." },
  ],
  playgroundTitle: "스팸 필터 대결",
  playgroundIntro: "단어를 골라 내 규칙을 만들어 보세요. '이 단어가 하나라도 있으면 스팸'이에요. 그다음 처음 보는 문자로 시험해요.",
  summary: [
    "규칙 방식: 사람이 '만약 ~면' 규칙을 직접 쓴다. 예외가 끝없이 생긴다.",
    "학습 방식: 정답이 붙은 예시를 주면 컴퓨터가 규칙(점수)을 찾는다.",
    "ChatGPT도 엄청난 양의 글에서 스스로 익혔다.",
  ],
  unlocks: "학습 데이터",
  quiz: [
    {
      q: "규칙 방식과 학습 방식의 가장 큰 차이는?",
      choices: ["규칙 방식이 항상 더 정확하다", "규칙은 사람이 쓰고, 학습은 예시에서 규칙을 찾아낸다", "학습 방식은 컴퓨터가 필요 없다"],
      answer: 1,
      explain: "학습 방식에서 사람은 정답이 붙은 예시를 주고, 규칙은 컴퓨터가 찾아요.",
      review: "s7",
    },
    {
      q: "스팸 필터를 학습시키려면 무엇이 필요할까요?",
      choices: ["스팸인지 아닌지 표시된 문자 예시 여러 개", "스팸 보내는 사람의 연락처", "문자를 보낸 시간"],
      answer: 0,
      explain: "정답(스팸/정상)이 붙은 예시가 곧 교과서예요.",
      review: "s4",
    },
    {
      q: "'무료가 있으면 스팸' 규칙으로 '무료 급식 안내'를 검사하면?",
      choices: ["정상으로 통과한다", "스팸으로 잘못 막힌다", "규칙이 알아서 예외를 찾는다"],
      answer: 1,
      explain: "규칙은 쓰인 그대로만 움직여요. 예외는 사람이 또 써 줘야 해요.",
      review: "s3",
    },
  ],
  labels: {
    tag: "4장 규칙으로 vs 데이터로",
    ruleTitle: "내가 쓴 규칙",
    rule: "만약 '무료'가 있으면 → 스팸",
    spam: "스팸",
    ok: "정상",
    m1: "[광고] 무료 쿠폰 받기",
    m2: "[광고] 무.료 쿠폰 당첨!",
    m3: "가정통신문: 무료 급식 신청 안내",
    pass: "통과?!",
    blocked: "막힘?!",
    add1: "+ '무.료'도 스팸",
    add2: "+ 단, '급식'이 있으면 정상",
    add3: "+ 단, '시사회'면 정상",
    add4: "+ 단, ...",
    endless: "끝이 없어요",
    examples: "예시 문자 수천 개",
    learn: "학습",
    modelBox: "모델",
    findRule: "규칙을 스스로 찾음",
    scaleL: "정상 쪽",
    scaleR: "스팸 쪽",
    made: "사람이 정한 적 없는 점수",
    example: "설명용 예시 점수",
    newMsg: "처음 보는 문자",
    total: "합계",
    unknown: "모르는 단어 = 0",
    rWay: "규칙 방식",
    lWay: "학습 방식",
    input: "입력",
    rules: "규칙",
    answer: "답",
    model: "규칙(모델)",
    ex3: "축하합니다 경품 당첨!",
    ex4: "내일 수학 숙제 범위",
    ex5: "[광고] 학원 특가",
    dataMakes: "을 데이터가 만들어요",
  },
};
