import type { ChapterSpec, Highlighter } from "./types";

// --- a toy RNN (설명용 장난감 모델), shared with ch41–42 ---
// The note (hidden state) has three slots. Each word writes into a slot; the old note is copied a little fainter.
// new note = squash(0.8 × old note + word), squash = tanh (keeps every number between −1 and 1).
export const SLOTS = ["때", "누가", "어디"] as const;
export const DECAY = 0.8;
export const WORD_VEC: Record<string, [number, number, number]> = {
  어제: [-2, 0, 0],
  내일: [2, 0, 0],
  나는: [0, 2, 0],
  친구와: [0, 1, 0],
  학교에: [0, 0, 2],
};
/** what each word writes on the note, in words */
export const GIST: Record<string, string> = { 어제: "어제", 내일: "내일", 나는: "나", 친구와: "친구", 학교에: "학교" };
export type Note = { h: [number, number, number]; gist: [string, string, string] };
export const EMPTY: Note = { h: [0, 0, 0], gist: ["", "", ""] };

/** One relay step of the toy RNN. `keep` is how much of the old note survives (0.8 here; ch41's LSTM mode keeps more). */
export function rnnStep(n: Note, w: string, keep = DECAY): Note {
  const x = WORD_VEC[w] ?? [0, 0, 0];
  const h = n.h.map((v, i) => Math.tanh(keep * v + x[i])) as [number, number, number];
  const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
  return { h, gist };
}

export function rnnRun(words: string[], keep = DECAY) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) notes.push((n = rnnStep(n, w, keep)));
  return notes;
}

export const VERBS: { w: string; c: Highlighter }[] = [
  { w: "갔다", c: "mint" },
  { w: "간다", c: "yellow" },
  { w: "갈 거야", c: "sky" },
];
/** next-word probabilities from the last note: past ↔ future is read from the 때 slot */
export function predictVerb(h: readonly number[]) {
  const s = [-4 * h[0], 1, 4 * h[0]];
  const ex = s.map(Math.exp);
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

export const RELAY = ["어제", "나는", "학교에"];
export const RELAY_B = ["내일", "나는", "학교에"];
export const LENGTHS = [
  ["나는", "학교에", "간다"],
  ["어제", "나는", "친구와", "학교에"],
  ["어제", "나는", "친구와", "함께", "버스를", "타고", "학교에"],
];

export const ch40: ChapterSpec = {
  id: 40,
  part: 4,
  title: "RNN: 쪽지 릴레이",
  core: false,
  hook: "문장 길이는 제각각인데, AI는 앞 내용을 어떻게 기억하며 읽을까요?",
  steps: [
    { id: "s1", sec: 10, narration: "39장의 신경망은 앞 세 단어만 봤어요. 문장 길이는 제각각인데요. 그래서 나온 생각: 한 단어씩 읽으며 쪽지에 적어 넘기자!" },
    { id: "s2", sec: 10, narration: "칸마다 단어가 하나씩 있어요. 각 칸은 앞 칸이 준 쪽지를 받아, 지금 단어를 보고 고쳐 써서 다음 칸에 넘겨요." },
    { id: "s3", sec: 11, narration: "'어제'는 '때' 칸에, '나는'은 '누가' 칸에, '학교에'는 '어디' 칸에 적어요. 앞 내용은 조금 옅게 옮겨 적고요." },
    { id: "s4", sec: 10, narration: "고쳐 쓰는 규칙은 모든 칸이 똑같아요. 옛 쪽지에 0.8을 곱하고 지금 단어를 더한 뒤, −1과 1 사이로 눌러 줘요." },
    { id: "s5", sec: 11, narration: "마지막 쪽지만 보고 다음 단어를 맞혀요. 쪽지에 '어제'가 남아 있으니 '갔다'가 70%예요. 이 쪽지를 은닉 상태라고 불러요." },
    { id: "s6", sec: 10, narration: "첫 단어만 '내일'로 바꾸면 이번엔 '갈 거야'가 70%예요. 맨 앞 단어가 쪽지를 타고 끝까지 전해진 거예요." },
    { id: "s7", sec: 11, narration: "펼치면 릴레이, 접으면 같은 기계가 빙글빙글 도는 고리예요. 그래서 이름이 순환 신경망, RNN이에요. 문장이 길어도 괜찮아요." },
  ],
  playgroundTitle: "쪽지 릴레이 돌리기",
  playgroundIntro: "단어를 하나씩 넣어 문장을 만들어 보세요. 단어가 들어갈 때마다 쪽지의 세 칸이 고쳐 써지고, 마지막 쪽지로 다음 말을 맞혀요.",
  summary: [
    "RNN: 한 단어씩 읽으며 쪽지(은닉 상태)를 고쳐 써서 다음 칸에 넘긴다.",
    "모든 칸이 같은 규칙(같은 가중치)을 쓴다. 그래서 문장 길이가 달라도 된다.",
    "마지막 쪽지로 다음 단어를 맞힌다. 맨 앞 단어도 쪽지를 타고 끝까지 간다.",
  ],
  unlocks: "RNN 은닉 상태",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "RNN에서 '쪽지'라고 부른 것의 진짜 이름은?",
      choices: ["손실", "은닉 상태", "토큰"],
      answer: 1,
      explain: "지금까지 읽은 내용을 요약한 숫자 벡터예요. 겉으로 드러나지 않아서 은닉(hidden) 상태라고 해요.",
      review: "s5",
    },
    {
      q: "RNN의 칸들이 쪽지를 고쳐 쓰는 규칙은?",
      choices: ["모든 칸이 같은 규칙을 쓴다", "칸마다 규칙이 다르다", "마지막 칸만 규칙이 있다"],
      answer: 0,
      explain: "같은 기계(같은 가중치)를 단어마다 되풀이해서 써요. 그래서 문장 길이와 상관없이 쓸 수 있어요.",
      review: "s4",
    },
    {
      q: "'어제 나는 학교에' 다음에 RNN이 '갔다'를 고를 수 있는 이유는?",
      choices: ["마지막 단어 '학교에'에 과거라는 뜻이 있어서", "무작위로 골라서", "맨 앞 '어제'의 흔적이 쪽지에 남아 끝까지 전해져서"],
      answer: 2,
      explain: "'어제'를 읽을 때 적은 내용이 조금씩 옅어지면서도 마지막 쪽지까지 남아 있어요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "40장 RNN: 쪽지 릴레이",
    window: "앞 3단어 창",
    fixed: "창 크기는 고정인데, 문장 길이는 제각각",
    idea: "한 단어씩 읽으며 쪽지에 적어 넘기자!",
    cell: "RNN 칸",
    empty: "빈 쪽지로 시작",
    same: "칸마다 같은 규칙",
    rule: "새 쪽지 = 누르기( 0.8 × 옛 쪽지 + 지금 단어 )",
    squash: "누르기 = −1과 1 사이로",
    example: "때 칸:",
    toy: "* 설명용 장난감 모델: 실제로는 0.8 대신 학습된 가중치 행렬(11장)을 곱해요",
    lastNote: "마지막 쪽지 → 다음 단어",
    hidden: "쪽지 = 은닉 상태 (hidden state)",
    carried: "맨 앞 단어가 끝까지 전해졌어요",
    unrolled: "펼치면 릴레이",
    folded: "접으면 고리",
    rnn: "순환 신경망 (RNN)",
    rnnEn: "Recurrent Neural Network",
    anyLen: "문장이 아무리 길어도 OK",
    next: "41장: RNN의 한계",
    note: "쪽지",
    dot: "·",
  },
};
