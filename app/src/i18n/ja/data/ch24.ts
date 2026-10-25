import { bookLoss, train } from "../../../data/part2-batch";
import { NEURON, STORES, TUNED_LINE_W, neuron } from "../../../data/part2-toy";
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** s1: tuning the 줄 knob for 가게 A alone (16장, 21장) helps A but hurts the five stores overall */
export const ONLY_A = STORES.map((s) => {
  const before = neuron(s.x, NEURON.w, NEURON.b) - s.real;
  const after = neuron(s.x, [NEURON.w[0], TUNED_LINE_W, NEURON.w[2]], NEURON.b) - s.real;
  return { name: s.name, before, after };
});
export const LOSS_BEFORE = ONLY_A.reduce((a, r) => a + r.before ** 2, 0) / ONLY_A.length;
export const LOSS_AFTER = ONLY_A.reduce((a, r) => a + r.after ** 2, 0) / ONLY_A.length;

export const BATCH_LR = 0.05;
export const CMP_EPOCHS = 3;
/** s5: loss over the whole book after every update, three epochs, three batch sizes */
export const CURVES: { batch: number; c: Highlighter; loss: number[] }[] = [1, 10, 60].map((batch, i) => ({
  batch,
  c: (["pink", "mint", "sky"] as Highlighter[])[i],
  loss: train(batch, CMP_EPOCHS, BATCH_LR).map(([w, b]) => bookLoss(w, b)),
}));

export const ch24: ChapterSpec = {
  id: 24,
  part: 2,
  title: "問題集を分けて解く",
  core: false,
  hook: "問題が何百万個もある問題集。1問ずつ直す？それとも全部解いてから一気に直す？",
  steps: [
    { id: "s1", sec: 11, narration: "Aに合わせて待ちの重みを1.5にすると、Aはぴったりですが、Bが大きくずれて、5軒全体の損失は0.7から1.95に増えます。" },
    { id: "s2", sec: 11, narration: "だから問題集全体を見て直す必要があります。でも問題が何百万個もあると、全部解いてから1回直すのでは遅すぎます。" },
    { id: "s3", sec: 10, narration: "そこで何問かずつ束にして解きます。1束解いて、採点して、つまみを直して、次の束へ。この束がミニバッチです。" },
    { id: "s4", sec: 10, narration: "問題集を最初から最後まで1回全部解くことを、1エポック（epoch）といいます。ふつうは何エポックもくり返します。" },
    { id: "s5", sec: 11, narration: "問題180個を解く間でくらべます。1問ずつは速く下がりますがガタガタ、全部まとめてはたった3回。10問ずつはなめらかです。" },
    { id: "s6", sec: 11, narration: "コンピューターは1つの束をまとめて計算するので速いのです（第68章）。GPT-3は1つの束にトークンを約320万個入れました。" },
    { id: "s7", sec: 9, narration: "ミニバッチに分けて解き、エポックをくり返す。でも同じ問題集ばかり解きすぎると、起きる問題があります（第25章）。" },
  ],
  playgroundTitle: "束の大きさ実験",
  playgroundIntro: "60軒の問題集で、第16章のニューロンのつまみ2つ（待ちの重み、バイアス）を学習させます。束の大きさを選んで「1エポック解く」を押してみましょう。",
  summary: [
    "1問だけ見て直すと、ほかの問題がずれる。問題集全体を見る必要がある。",
    "ミニバッチ：何問かずつ束にして解き、採点して直す。エポック：問題集を1周。",
    "1問ずつはフラフラ、全部まとめては遅い。ほどよい束が速くてぶれにくい。",
  ],
  unlocks: "ミニバッチ・エポック",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "問題1,000個を100個ずつ束にして解くと、1エポックの間につまみを何回直すでしょう？",
      choices: ["10回", "100回", "1,000回"],
      answer: 0,
      explain: "1,000 ÷ 100 = 10束です。束ごとに1回ずつ直すので10回です。",
      review: "s3",
    },
    {
      q: "「1エポック」とは？",
      choices: ["つまみを1回直したこと", "問題集全体を最初から最後まで1回解いたこと", "問題を1つ解いたこと"],
      answer: 1,
      explain: "エポックは、学習データ全体をひととおり見たことです。",
      review: "s4",
    },
    {
      q: "1問ずつ見てすぐ直すときの特徴は？",
      choices: ["よく直すけれど、向きがばらばら", "1エポックに1回だけ直す", "いつもいちばん正確"],
      answer: 0,
      explain: "1問だけ見て直すので、その問題の方へかたよったり、別の問題の方へかたよったりします。だから道がフラフラします。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第24章 問題集を分けて解く",
    s1title: "A店だけに合わせたら",
    col0: "店",
    col1: "最初の誤差",
    col2: "Aに合わせた後",
    total: "5軒全体の損失",
    worse: "Aだけ見て直すとBがくずれる",
    book: "問題集",
    probs: "問題が何百万個",
    allAtOnce: "全部解いてから1回直す？",
    tooSlow: "1回直すのにすごく時間がかかる",
    bundle: "10問",
    station: "採点 → つまみを直す",
    done: "解いた束",
    count: "束",
    minibatch: "ミニバッチ = 1つの束",
    epoch: "1エポック完了！",
    again: "また最初から：2エポック目",
    cmp: "同じ3エポック（問題180個）の間",
    solved: "解いた問題の数",
    lossAxis: "損失",
    jump: "ときどき大きくはねる",
    axisW: "待ちの重み",
    axisB: "バイアス",
    b1: "1問ずつ：180回直す",
    b10: "10問ずつ：18回",
    b60: "全部まとめて：3回",
    bottom: "谷底",
    start: "出発",
    example: "60軒 · 説明用の例",
    gpu: "1つの束をまとめて計算（第68章）",
    gptBatch: "GPT-3の1束：トークン約320万個",
    gptAll: "問題集全体：約3,000億トークン",
    sumA: "ミニバッチ：何問かずつ解いて直す",
    sumB: "エポック：問題集を1周",
    next: "同じ問題集ばかり解くと？ → 第25章",
  },
};
