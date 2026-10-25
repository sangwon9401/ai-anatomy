import { DATASETS, accOf, boundary, run } from "./part2-boss";
import type { ChapterSpec } from "./types";

/** the scene's run: 맛집 지도, 8 hidden neurons, 학습률 0.1, 10곳씩 미니배치, 300 에폭 (seed chosen so the story reads cleanly) */
export const BOSS_DS = DATASETS[0];
export const BOSS = { hidden: 8, lr: 0.1, batch: 10, epochs: 300, seed: 21 };
/** dense snapshots so the scene can show the boundary, epoch and accuracy of the same moment */
export const SNAP_EPOCHS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 30, 40, 50, 60, 80, 100, 130, 160, 200, 250, 300];
export const BOSS_RUN = run(BOSS_DS, BOSS.hidden, BOSS.lr, BOSS.batch, BOSS.epochs, SNAP_EPOCHS, BOSS.seed);
export const SNAPS = BOSS_RUN.snaps.map((s) => ({ epoch: s.epoch, acc: accOf(s.net, BOSS_DS, BOSS_DS.train), segs: boundary(s.net, BOSS_DS) }));
export const FINAL_VAL = accOf(BOSS_RUN.net, BOSS_DS, BOSS_DS.val);
export const KNOBS = BOSS.hidden * 2 + BOSS.hidden + BOSS.hidden + 1;

export const TOOLS2 = ["뉴런", "활성화 함수", "층 쌓기", "순전파", "손실", "경사하강법", "학습률", "역전파", "미니배치 · 에폭", "과적합 막기", "손글씨 인식기"];

export const ch27: ChapterSpec = {
  id: 27,
  part: 2,
  title: "Part 2 보스전",
  core: false,
  hook: "지금까지 배운 걸 다 모으면, 신경망을 처음부터 학습시킬 수 있을까요?",
  steps: [
    { id: "s1", sec: 9, narration: "Part 2 보스전이에요! 17장 맛집 지도를 가게 60곳으로 늘렸어요. 이번엔 경계를 손으로 정하지 않고 신경망이 스스로 찾아요." },
    { id: "s2", sec: 9, narration: "입력 2개 → ReLU 뉴런 8개 → 출력 1개(18장). 손잡이 33개는 처음엔 아무렇게나 정해요. 0.5를 넘으면 맛집이에요." },
    { id: "s3", sec: 9, narration: "학습 루프를 돌려요. 순전파(19장), 손실 재기(20장), 역전파로 책임 나누기(23장), 경사하강으로 고치기(21장)." },
    { id: "s4", sec: 9.5, narration: "10곳씩 미니배치로 300 에폭(24장). 손실이 내려가면서 경계가 점점 V자가 되고, 정확도는 23%에서 100%가 돼요." },
    { id: "s5", sec: 9, narration: "따로 떼어 둔 처음 보는 가게 30곳으로 검증해요(25장). 30곳 모두 맞혔어요. 외운 게 아니라 V자 규칙을 배운 거예요." },
    { id: "s6", sec: 8, narration: "GPT도 똑같이 배워요. 다만 손잡이 33개 대신 1,750억 개, 가게 60곳 대신 토큰 3,000억 개로요." },
    { id: "s7", sec: 8.5, narration: "Part 2 학습 도구 완성! 다음 Part 3에서는 신경망에 글을 넣기 위해 글자를 숫자로 바꾸는 법을 배워요." },
  ],
  playgroundTitle: "신경망 직접 학습시키기",
  playgroundIntro: "문제를 고르고, 뉴런 수와 학습률을 정한 뒤 '학습 시작'을 눌러 보세요. 손실 곡선이 내려가고 경계가 자라는 걸 지켜보세요. 마지막 보스는 과녁이에요!",
  summary: [
    "학습 루프: 순전파 → 손실 → 역전파 → 경사하강으로 고치기, 미니배치로 에폭마다 되풀이.",
    "뉴런 수, 학습률, 에폭은 사람이 정한다. 손잡이(가중치, 편향)는 학습이 찾는다.",
    "검증 데이터로 확인해야 진짜 실력. GPT도 같은 방법으로, 훨씬 크게 배운다.",
  ],
  unlocks: "학습 루프 (Part 2 완성)",
  unlockLabel: "학습 도구를 하나 얻었어요",
  quiz: [
    {
      q: "학습 루프 한 바퀴의 순서로 알맞은 것은?",
      choices: ["손실 → 순전파 → 고치기 → 역전파", "순전파 → 손실 → 역전파 → 고치기", "역전파 → 순전파 → 손실 → 고치기"],
      answer: 1,
      explain: "먼저 예측하고(순전파), 얼마나 틀렸는지 재고(손실), 책임을 나눈 뒤(역전파), 손잡이를 고쳐요(경사하강).",
      review: "s3",
    },
    {
      q: "입력 2개 → 뉴런 8개 → 출력 1개인 신경망의 손잡이(가중치 + 편향)는 몇 개일까요?",
      choices: ["11개", "24개", "33개"],
      answer: 2,
      explain: "첫 층 가중치 2 × 8 = 16, 편향 8, 출력 가중치 8, 출력 편향 1. 모두 33개예요.",
      review: "s2",
    },
    {
      q: "학습률을 너무 크게(예: 1) 하면 이 신경망은 어떻게 될까요?",
      choices: ["손실이 튀어 오르며 학습이 망가진다", "훨씬 빨리 100%가 된다", "아무 변화가 없다"],
      answer: 0,
      explain: "보폭이 너무 크면 바닥을 지나쳐 튕겨 나가요(22장). 직접 해보기에서 확인해 보세요.",
      review: "playground",
    },
  ],
  labels: {
    tag: "27장 Part 2 보스전",
    boss: "Part 2 보스전",
    map: "맛집 지도: 가게 60곳",
    self: "경계를 신경망이 스스로!",
    spicy: "맵기",
    line: "줄",
    example: "설명용 예시",
    netTitle: "작은 신경망",
    in1: "맵기",
    in2: "줄",
    out: "맛집 점수",
    rule: "0.5 넘으면 맛집",
    knobs: "손잡이 33개",
    random: "처음엔 아무렇게나",
    loopTitle: "학습 루프",
    l1: "① 순전파",
    l2: "② 손실",
    l3: "③ 역전파",
    l4: "④ 고치기",
    l1s: "19장",
    l2s: "20장",
    l3s: "23장",
    l4s: "21 · 22장",
    center: "미니배치 × 에폭",
    centerS: "24장",
    epoch: "에폭",
    acc: "정확도",
    lossT: "손실",
    trainTitle: "학습 중",
    valTitle: "처음 보는 가게 30곳",
    valOk: "검증: 30곳 중 30곳 정답!",
    learned: "외운 게 아니라 규칙을 배웠다",
    gptTitle: "GPT도 똑같이, 훨씬 크게",
    rowBoss: "보스전 신경망",
    rowGpt: "GPT-3",
    colKnobs: "손잡이",
    colData: "학습 데이터",
    bossKnobs: "33개",
    bossData: "가게 60곳",
    gptKnobs: "1,750억 개",
    gptData: "토큰 3,000억 개",
    done: "Part 2 학습 도구 완성!",
    next: "다음: Part 3 글자를 숫자로",
  },
};
