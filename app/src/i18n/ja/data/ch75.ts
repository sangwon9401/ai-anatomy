import type { ChapterSpec } from "../../../data/types";

/**
 * A toy reward model for the lesson: it looks at three yes/no features of an answer and adds up weights.
 * (A real reward model is a transformer that finds its own features; this keeps the idea visible.)
 */
export const FEATURES = ["質問に合った答え", "理由や方法を教えている", "まちがい・有害な内容"];

export type Scored = { id: string; text: string; f: number[] };

// The answers ranked in ch74 (questions 1 and 2), with their features
export const TRAIN: { q: string; answers: Scored[]; order: string[] }[] = [
  {
    q: "テストの前の日なのに眠れません。どうしよう？",
    answers: [
      { id: "A", text: "眠れないなら徹夜で勉強しよう。", f: [1, 0, 1] },
      { id: "B", text: "スマホを遠ざけ、電気を消して横になってみましょう。眠れなくても、目を閉じて休むと助けになります。", f: [1, 1, 0] },
      { id: "C", text: "睡眠は大事です。", f: [0, 0, 0] },
    ],
    order: ["B", "C", "A"],
  },
  {
    q: "「はし」を英語で言うと？",
    answers: [
      { id: "A", text: "川にかかる橋ならbridge、食べるときの箸ならchopsticksです。", f: [1, 1, 0] },
      { id: "B", text: "bridge", f: [1, 0, 0] },
      { id: "C", text: "はしは川の上にかかっています。", f: [0, 0, 0] },
    ],
    order: ["A", "B", "C"],
  },
];

export type Pair = { q: number; better: Scored; worse: Scored };
export const PAIRS: Pair[] = TRAIN.flatMap((t, q) => {
  const by = (id: string) => t.answers.find((a) => a.id === id)!;
  const out: Pair[] = [];
  for (let i = 0; i < t.order.length; i++) for (let j = i + 1; j < t.order.length; j++) out.push({ q, better: by(t.order[i]), worse: by(t.order[j]) });
  return out;
});

// A question the reward model has never seen
export const TEST = {
  q: "友だちとけんかしました。どうやって仲直りしよう？",
  answers: [
    { id: "X", text: "まず短いあやまりのメッセージを送ってみましょう。いやだったことは、あとで落ち着いて話しても大丈夫です。", f: [1, 1, 0] },
    { id: "Y", text: "時間がたてば、きっと大丈夫になります。", f: [1, 0, 0] },
    { id: "Z", text: "同じように悪口を言って、やり返しましょう。", f: [1, 0, 1] },
    { id: "W", text: "けんかはだれでもします。", f: [0, 0, 0] },
  ] as Scored[],
};

export const W0 = [0.5, -0.5, 1.0]; // a clumsy untrained judge
export const LR = 1.0;
export const DECAY = 0.04;

export const scoreOf = (w: number[], f: number[]) => f.reduce((a, x, i) => a + x * w[i], 0);
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
/** chance that `better` wins = softmax over the two scores (ch.14) */
export const winChance = (w: number[], p: Pair) => sigmoid(scoreOf(w, p.better.f) - scoreOf(w, p.worse.f));

/** One pass over all pairs: nudge the weights so the better answer's score goes up and the worse one's goes down. */
export function trainStep(w: number[]): number[] {
  const g = w.map(() => 0);
  for (const p of PAIRS) {
    const miss = 1 - winChance(w, p);
    for (let i = 0; i < w.length; i++) g[i] += miss * (p.better.f[i] - p.worse.f[i]);
  }
  return w.map((x, i) => x + LR * (g[i] / PAIRS.length) - LR * DECAY * x);
}

export function trainN(w: number[], n: number) {
  let v = w;
  for (let i = 0; i < n; i++) v = trainStep(v);
  return v;
}

// numbers for the scene, computed from the same toy model the playground's auto-train button runs
export const TRAIN_STEPS = 40;
export const W_TRAINED = trainN(W0, TRAIN_STEPS);
const R1 = TRAIN[0].answers;
export const SCENE = {
  before: { B: scoreOf(W0, R1[1].f), A: scoreOf(W0, R1[0].f) },
  after: { B: scoreOf(W_TRAINED, R1[1].f), A: scoreOf(W_TRAINED, R1[0].f) },
  test: TEST.answers.slice(0, 3).map((a) => ({ ...a, s: scoreOf(W_TRAINED, a.f) })),
};

export const ch75: ChapterSpec = {
  id: 75,
  part: 8,
  title: "AIの採点係",
  core: false,
  hook: "人のかわりに答えに点数をつけてくれるAIがあったら、どうでしょう？",
  steps: [
    { id: "s1", sec: 8, narration: "人のかわりに採点するAIを作ります。答えを入れると点数が1つ出てくる機械、報酬モデル（reward model）です。" },
    { id: "s2", sec: 8, narration: "中身はGPTと同じトランスフォーマーです。ただ最後に、次のかけらの確率のかわりに、点数を1つ出すように変えました。" },
    { id: "s3", sec: 7, narration: "最初はでたらめに採点します。人はBがよいと言ったのに、採点係はAのほうに高い点数をつけました。" },
    { id: "s4", sec: 8, narration: "そこで、間違えた分だけ数を直します（第21章）。Bの点数は上がり、Aの点数は下がる向きにです。" },
    { id: "s5", sec: 9, narration: "2つの点数を第14章のソフトマックスに入れると、「Bが勝つ確率」になります。この確率が人の選択と合うように練習します。" },
    { id: "s6", sec: 8, narration: "とてもたくさんの比較ペアで練習すると、はじめて見る答えにも、人が気に入りそうな度合いを点数でつけます。" },
    { id: "s7", sec: 9, narration: "でも採点係も完璧ではありません。ほめ言葉ばかり並べた答えにだまされて、高い点数をつけることもあります。第76章でまた見ます。" },
  ],
  playgroundTitle: "採点係のトレーニング",
  playgroundIntro: "おもちゃの採点係は、答えの3つの特徴に重みをかけて点数を出します。スライダーで重みを直して、人が決めた比較6組を全部当ててみましょう。",
  summary: [
    "報酬モデル：質問と答えを入れると点数を1つ出す、採点係のAI。",
    "人の比較ペアで「よいほうの答え」の点数が高くなるように、数を直しながら学ぶ。",
    "2つの点数のソフトマックス = よいほうの答えが勝つ確率。採点係もときどきだまされる。",
  ],
  unlocks: "報酬モデル",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "報酬モデルに答えを入れると、何が出てくる？",
      choices: ["点数1つ", "次のかけらの確率", "もっとよい答え"],
      answer: 0,
      explain: "胴体はGPTと同じトランスフォーマーですが、最後に点数を1つ出すように変えました。",
      review: "s2",
    },
    {
      q: "人はB > Aと言ったのに、採点係はAに高い点数をつけました。どう学習する？",
      choices: ["Aの点数をもっと上げる", "その比較ペアを消す", "Bの点数は上げ、Aの点数は下げる向きに数を直す"],
      answer: 2,
      explain: "間違えた分だけ数を直して、よいほうの答えの点数が上に来るようにします。",
      review: "s4",
    },
    {
      q: "2つの答えの点数がまったく同じなら、採点係の「Bが勝つ確率」は？",
      choices: ["0%", "50%", "100%"],
      answer: 1,
      explain: "点数が同じなら、ソフトマックスも半分ずつに分けます（第14章）。まだ2つを見分けられていないのです。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第75章 AIの採点係",
    rm: "報酬モデル",
    rmEn: "reward model",
    input: "質問 + 答え",
    score: "点数",
    oneNumber: "答え → 点数1つ",
    example: "説明用の例",
    block: "トランスフォーマー",
    layers: "× たくさんの層",
    sameBody: "胴体はGPTと同じ",
    probs: "次のかけらの確率",
    oneScore: "点数1つ",
    newHead: "頭だけ取りかえた",
    humanSays: "人の判定（第74章）：B > A",
    backwards: "逆に採点した！",
    fix: "間違えた分を直す（21章）",
    beforeTrain: "直す前",
    afterTrain: "直したあと",
    winTitle: "Bが勝つ確率",
    winSub: "2つの点数のソフトマックス（第14章）",
    winB: "Bの勝ち",
    winA: "Aの勝ち",
    match: "人の選択（B）と合った！",
    newQ: "友だちとけんかしました。どうやって仲直りしよう？",
    newAns: "はじめて見る答えも採点する",
    flatter: "本当に最高の質問です！！！ あなたは天才です！！！ 仲直りもきっとうまくいきます！！！",
    fooled: "やられた",
    notPerfect: "採点係も完璧ではない",
    next: "第76章",
    gaugeMin: "−3",
    gaugeMax: "+3",
    arrowUp: "↑",
    arrowDown: "↓",
    expA: "Aの点数",
    expB: "Bの点数",
    sep: " · ",
    digits: "0123456789.−+%",
  },
};
