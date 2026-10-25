import type { ChapterSpec } from "./types";

export const MA = [
  [1, 2, 0, 1],
  [2, 0, 1, 3],
  [0, 1, 2, 1],
  [3, 1, 0, 2],
];
export const MB = [
  [2, 0, 1, 1],
  [1, 3, 0, 2],
  [0, 1, 2, 0],
  [1, 2, 1, 3],
];
export const matmul = (a: number[][], b: number[][]) => a.map((row) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
export const MC = matmul(MA, MB);

/** The cell picked out in the scene: row 2, column 3 (0-based 1, 2). */
export const PICK = { i: 1, j: 2 };
export const pickTerms = () => MA[PICK.i].map((a, k) => `${a}×${MB[k][PICK.j]}`).join(" + ");

/** GPT-3's attention matrices are d_model × d_model = 12,288 × 12,288 (canonical d_model). */
export const D_MODEL = 12288;
export const GPT3_CELLS = D_MODEL * D_MODEL;

// 설명용 예시 speeds for the race
export const CALC_RATE = 20; // one fast calculator: 20 cells per second
export const STUDENT_RATE = 1; // one student: 1 cell per second
export const STUDENTS = 10000;
export const calcTime = (cells: number) => cells / CALC_RATE;
export const studentTime = (cells: number, students = STUDENTS) => Math.ceil(cells / students) / STUDENT_RATE;
export const RACE_CELLS = 10000;

export const ch68: ChapterSpec = {
  id: 68,
  part: 7,
  title: "왜 GPU일까?",
  core: false,
  hook: "AI 회사들은 왜 컴퓨터 대신 '그래픽카드'를 잔뜩 살까요?",
  steps: [
    { id: "s1", sec: 10, narration: "GPT 계산은 대부분 행렬 곱이에요(11장). GPT-3는 한 층에만 12,288 × 12,288 행렬이 여러 개 있어요." },
    { id: "s2", sec: 10, narration: "작게 4 × 4 행렬 두 개를 곱해 볼게요. 결과 칸은 16개. 칸마다 줄 하나와 열 하나를 곱해서 더해요(9장)." },
    { id: "s3", sec: 10, narration: "CPU를 아주 빠른 계산기 1대라고 해 볼게요. 칸을 하나씩 차례로 채우니까, 16칸이면 16번 차례를 기다려요." },
    { id: "s4", sec: 10, narration: "그런데 칸들은 서로를 기다릴 필요가 없어요. 각 칸은 자기 줄과 자기 열만 있으면 바로 계산할 수 있거든요." },
    { id: "s5", sec: 9, narration: "GPU는 단순한 계산기 수천 개예요. 학생 1만 명이 한 칸씩 맡듯이, 모든 칸을 한꺼번에 채워요." },
    { id: "s6", sec: 11, narration: "설명용 예시로 계산기는 1초에 20칸, 학생은 1초에 1칸. 1만 칸이면 계산기는 500초, 학생 1만 명은 1초면 끝!" },
    { id: "s7", sec: 11, narration: "그래서 큰 AI는 GPU 수천 개를 이어 붙여 학습해요. 단어를 한꺼번에 계산하는 트랜스포머는 GPU와 찰떡궁합이에요(41장)." },
  ],
  playgroundTitle: "계산 경주",
  playgroundIntro: "행렬 크기와 학생 수를 고르고 출발! 빠른 계산기 1대와 학생 여러 명 중 누가 먼저 모든 칸을 채울까요?",
  summary: [
    "행렬 곱의 결과 칸은 각각 '줄 하나 · 열 하나' 계산. 서로 기다릴 필요가 없다.",
    "CPU = 빠른 계산기 몇 대가 차례로, GPU = 단순한 계산기 수천 개가 동시에.",
    "칸이 많을수록 GPU가 유리하다. 그래서 AI 학습은 GPU로 한다.",
  ],
  unlocks: "GPU 병렬 계산",
  unlockLabel: "학습 도구를 하나 더 얻었어요",
  quiz: [
    {
      q: "4 × 4 행렬 두 개를 곱하면 결과 칸은 몇 개?",
      choices: ["8개", "16개", "4개"],
      answer: 1,
      explain: "결과도 4 × 4 행렬이라 16칸이에요. 칸마다 줄 하나와 열 하나를 곱해 더해요.",
      review: "s2",
    },
    {
      q: "GPU가 행렬 곱을 빨리 하는 이유는?",
      choices: ["칸들을 나눠 맡아 동시에 계산해서", "계산기 한 대가 엄청 똑똑해서", "계산을 몇 개 건너뛰어서"],
      answer: 0,
      explain: "하나하나는 단순해도, 수천 개가 동시에 칸을 나눠 채워요.",
      review: "s5",
    },
    {
      q: "행렬 곱의 결과 칸들을 동시에 계산할 수 있는 까닭은?",
      choices: ["결과가 모두 같아서", "앞 칸의 답이 있어야 다음 칸을 계산해서", "각 칸은 자기 줄과 열만 있으면 되어서"],
      answer: 2,
      explain: "어떤 칸도 다른 칸의 답을 쓰지 않아요. 그래서 기다리지 않고 한꺼번에 계산해요.",
      review: "s4",
    },
  ],
  labels: {
    tag: "68장 왜 GPU일까?",
    gpt3Layer: "GPT-3 한 층의 행렬 하나",
    size: "12,288 × 12,288",
    cells: "약 1억 5천만 칸",
    times: "×",
    equals: "=",
    cellCount: "결과 칸 16개",
    rowCol: "줄 · 열 = 칸 하나",
    cpu: "CPU: 빠른 계산기 1대",
    turn: "차례",
    wait: "16번 기다려요",
    noWait: "서로 기다릴 필요 없음!",
    onlyNeeds: "자기 줄 + 자기 열만 있으면 OK",
    gpu: "GPU: 단순한 계산기 수천 개",
    allAtOnce: "모든 칸을 한꺼번에!",
    example: "설명용 예시",
    task: "1만 칸 채우기",
    calc: "계산기 1대 (1초에 20칸)",
    students: "학생 1만 명 (1명이 1초에 1칸)",
    sec1: "1초",
    sec500: "500초 (약 8분)",
    done: "끝!",
    ff: "빨리 감기 ▶▶",
    sec: "초",
    many: "GPU 수천 개를 이어 붙여요",
    gpuChip: "GPU",
    sentence: "나는 오늘 학교에 간다",
    together: "트랜스포머: 단어를 한꺼번에 계산 (41장)",
    next: "69장: GPT는 얼마나 커졌을까?",
  },
};
