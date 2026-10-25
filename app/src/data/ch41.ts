import { DECAY, EMPTY, GIST, WORD_VEC, rnnRun, type Note } from "./ch40";
import type { ChapterSpec } from "./types";

export const LONG = ["어제", "나는", "친구와", "함께", "버스를", "타고", "비", "오는", "길을", "지나", "학교에"];
export const LONG_NOTES = rnnRun(LONG);

/** toy LSTM (설명용): important slots go into a 보관함 (cell) that is not squashed again each step, so they fade much more slowly. */
export const LSTM_KEEP = 0.95;
export function lstmRun(words: string[], keep = LSTM_KEEP) {
  const notes: Note[] = [];
  let n = EMPTY;
  for (const w of words) {
    const x = WORD_VEC[w] ?? [0, 0, 0];
    const h = n.h.map((v, i) => Math.max(-1, Math.min(1, keep * v + Math.tanh(x[i])))) as [number, number, number];
    const gist = n.gist.map((g, i) => (x[i] !== 0 ? GIST[w] : g)) as [string, string, string];
    notes.push((n = { h, gist }));
  }
  return notes;
}
export const LONG_LSTM = lstmRun(LONG);

/** backprop's blame signal shrinking by the same factor at every step back (23장) */
export const BACK = Array.from({ length: LONG.length }, (_, k) => DECAY ** k);

/** words handed to GPUs in s6 */
export const GPU_WORDS = LONG.slice(0, 6);

/** playground: words placed between 어제 and 학교에 (repeats when longer) */
export const FILLERS = ["나는", "친구와", "함께", "버스를", "타고", "비", "오는", "길을", "지나", "천천히", "걸어서", "다리를", "건너"];
export const sentenceWith = (middle: number) => ["어제", ...Array.from({ length: middle }, (_, i) => FILLERS[i % FILLERS.length]), "학교에"];

export const ch41: ChapterSpec = {
  id: 41,
  part: 4,
  title: "RNN의 한계",
  core: true,
  hook: "쪽지 릴레이가 그렇게 좋다면, 왜 ChatGPT는 RNN을 안 쓸까요?",
  steps: [
    { id: "s1", sec: 10, narration: "이번엔 긴 문장이에요. '어제 나는 친구와 함께 … 학교에' 다음은 '갔다'여야 해요. 맨 앞의 '어제' 때문이죠." },
    { id: "s2", sec: 9, narration: "쪽지를 한 칸씩 넘길 때마다 '어제'는 조금씩 옅어져요. 11칸을 지나니 글씨가 거의 안 보여요." },
    { id: "s3", sec: 10, narration: "그래서 마지막 쪽지만 본 RNN은 '간다'를 골라요. 멀리 떨어진 단어 사이의 관계, 장기 의존성을 놓친 거예요." },
    { id: "s4", sec: 10, narration: "학습할 때도 문제예요. 오차의 책임(23장)을 거꾸로 전할 때도 칸마다 줄어서, 10칸 앞에선 0.11배뿐이에요." },
    { id: "s5", sec: 11, narration: "1997년 LSTM은 쪽지에 보관함과 문을 달아, 중요한 내용은 덜 흐려지게 지켰어요. 그래도 아주 긴 글에선 결국 흐려져요." },
    { id: "s6", sec: 11, narration: "두 번째 문제는 줄 서기예요. 2번 칸은 1번 칸의 쪽지가 와야 시작해요. 나머지 GPU는 차례를 기다리며 놀고 있어요." },
    { id: "s7", sec: 10, narration: "GPU는 많은 계산을 동시에 하는 게 특기예요(68장). 그런데 단어가 1,000개면 1,000번을 차례로 해야 해요." },
    { id: "s8", sec: 11, narration: "정리하면 RNN은 쪽지가 흐려지고, 줄 서서 기다려요. 트랜스포머가 둘 다 풀어요(Part 5). 그 전에 42장 번역기부터 봐요." },
  ],
  playgroundTitle: "기억력 실험실",
  playgroundIntro: "'어제'와 '학교에' 사이에 단어를 점점 많이 넣어 보세요. RNN의 쪽지에서 '어제'가 얼마나 남는지, LSTM으로 바꾸면 어떻게 되는지 비교해 보세요.",
  summary: [
    "한계 ①: 쪽지가 칸마다 옅어져서, 멀리 떨어진 단어의 관계(장기 의존성)를 놓친다.",
    "1997년 LSTM은 보관함과 문으로 오래 기억했지만, 아주 긴 글에선 결국 흐려진다.",
    "한계 ②: 앞 칸이 끝나야 다음 칸을 계산해서, GPU가 줄 서서 기다린다.",
  ],
  unlocks: "장기 의존성",
  unlockLabel: "역사 카드를 모았어요",
  quiz: [
    {
      q: "긴 문장 끝에서 RNN이 맨 앞의 '어제'를 잊는 이유는?",
      choices: ["쪽지를 넘길 때마다 옛 내용이 조금씩 옅어져서", "'어제'라는 단어를 몰라서", "문장이 짧아서"],
      answer: 0,
      explain: "칸마다 옛 쪽지에 1보다 작은 수를 곱해 옮겨 적으니, 멀리 갈수록 흐려져요.",
      review: "s2",
    },
    {
      q: "1997년에 나온 LSTM의 아이디어는?",
      choices: ["단어를 거꾸로 읽는다", "쪽지에 보관함과 문을 달아 중요한 내용을 오래 지킨다", "쪽지를 아예 쓰지 않는다"],
      answer: 1,
      explain: "무엇을 지키고 무엇을 지울지 정하는 문(게이트)이 있어서, 중요한 내용이 덜 흐려져요.",
      review: "s5",
    },
    {
      q: "RNN을 학습시킬 때 GPU가 놀게 되는 이유는?",
      choices: ["GPU가 한국어를 몰라서", "단어가 너무 적어서", "앞 칸의 쪽지가 와야 다음 칸을 계산할 수 있어서"],
      answer: 2,
      explain: "칸들이 차례로만 계산할 수 있어서, 동시에 계산하는 GPU의 특기를 못 살려요.",
      review: "s6",
    },
  ],
  labels: {
    tag: "41장 RNN의 한계",
    far: "11칸이나 떨어져 있어요",
    survive: "쪽지의 '어제'가 끝까지 남을까?",
    answer: "정답은 '갔다' (맨 앞 '어제' 때문)",
    strength: "쪽지 속 '어제'의 진하기",
    faded: "11칸 뒤엔 거의 안 보여요",
    wrong: "어제였는데 '간다'?!",
    longdep: "장기 의존성 (long-term dependency)",
    longdepD: "멀리 떨어진 단어 사이의 관계",
    blame: "책임 신호 (23장 역전파)",
    back: "← 거꾸로 전하기",
    barely: "앞까지 책임이 거의 안 닿아요",
    lstm: "1997 LSTM",
    lstmD: "보관함 + 문(게이트)",
    rnnBars: "RNN",
    lstmBars: "LSTM",
    still: "그래도 아주 길면 흐려져요",
    queue: "줄 서서 기다리는 GPU",
    working: "계산 중",
    waiting: "기다리는 중",
    zzz: "zzz",
    done: "끝",
    wait: "앞 칸이 끝나야 다음 칸이 시작해요",
    gpu: "GPU",
    special: "GPU의 특기 = 동시에 계산하기 (68장)",
    seq: "RNN: 차례차례",
    par: "동시에 한다면",
    time: "시간",
    thousand: "단어 1,000개 = 1,000번 차례로",
    sumTitle: "RNN의 두 가지 한계",
    sum1: "① 쪽지가 흐려진다",
    sum1d: "장기 의존성을 놓침",
    sum2: "② 줄 서서 기다린다",
    sum2d: "GPU가 동시에 못 씀",
    fix: "트랜스포머가 둘 다 풀어요 (Part 5)",
    next: "그 전에, 42장: 번역기의 구조",
    toy: "* 설명용 장난감 모델",
  },
};
