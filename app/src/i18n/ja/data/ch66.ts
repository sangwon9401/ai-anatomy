import type { ChapterSpec, Highlighter } from "../../../data/types";

export const CANDS: { w: string; c: Highlighter }[] = [
  { w: "行く", c: "yellow" },
  { w: "行った", c: "mint" },
  { w: "遅れた", c: "sky" },
  { w: "その他", c: "violet" },
];

/** A mini model whose only numbers are the four scores (説明用の例). It starts out wrong:
 *  ch01's probabilities with 行く and 遅れた swapped. Scores are ln(p) + 3 (shifting all scores changes nothing, 第14章). */
export const START_P = [0.12, 0.21, 0.52, 0.15];
export const START_Z = START_P.map((p) => Math.log(p) + 3);
export const LR = 1;

export const softmax66 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** 驚き in halvings, as in 第65章. */
export const surprise66 = (p: number) => Math.log2(1 / p);

/** 責任 of each score: probability minus 1 for the right answer, minus 0 for the rest. */
export const blameOf = (p: number[], target: number) => p.map((v, i) => v - (i === target ? 1 : 0));

export type Lap = { z: number[]; p: number[]; loss: number; blame: number[] };

/** Run the loop: lap k holds the scores before its update. */
export function runLaps(z0: number[], target: number, n: number, lr = LR): Lap[] {
  const laps: Lap[] = [];
  let z = [...z0];
  for (let k = 0; k < n; k++) {
    const p = softmax66(z);
    const blame = blameOf(p, target);
    laps.push({ z, p, loss: surprise66(p[target]), blame });
    z = z.map((v, i) => v - lr * blame[i]);
  }
  return laps;
}

export const LAPS = runLaps(START_Z, 0, 4);

export const STATIONS = [
  { n: "① 予測", ref: "19章", c: "yellow" as Highlighter },
  { n: "② 損失", ref: "20・65章", c: "pink" as Highlighter },
  { n: "③ 逆伝播", ref: "23章", c: "violet" as Highlighter },
  { n: "④ 更新", ref: "21・22章", c: "mint" as Highlighter },
];

export const ch66: ChapterSpec = {
  id: 66,
  part: 7,
  title: "訓練ループを1周",
  core: true,
  hook: "GPTは何千億もの問題を、どんな順番で勉強するのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "ここまで学んだ部品を1つにつなげてみましょう。GPTは4つのステップでできた輪を、何度も何度も回って勉強します。" },
    { id: "s2", sec: 11, narration: "① 予測。「私は 今日 学校に」を入れて、次のかけらの確率を出します（第19章）。最初は数がでたらめで、行くはたった12%です。" },
    { id: "s3", sec: 10, narration: "② 損失。正解の行くにつけた確率で驚きを測ります（第65章）。12%しかつけていないので、驚きは3.06と大きくなります。" },
    { id: "s4", sec: 11, narration: "③ 誤差逆伝播（逆伝播）。損失を逆向きに送り、数ごとに責任を分けます（第23章）。行くの点数は上げ、遅れたの点数は下げるべきです。" },
    { id: "s5", sec: 11, narration: "④ 更新。責任の分だけ数を少し直します。どれだけ大きく直すかは学習率が決めます（第22章）。ここでは学習率1です。" },
    { id: "s6", sec: 10, narration: "そしてまた①へ。1周するたびに、行くの確率は32%、55%、69%と上がり、驚きはどんどん小さくなります。" },
    { id: "s7", sec: 11, narration: "本物のGPTは問題をたくさん束ねて（第24章）この輪を何度も回り、1,750億個の数を少しずつ直します。これが事前学習です。" },
  ],
  playgroundTitle: "訓練の輪を回そう",
  playgroundIntro: "① → ② → ③ → ④のボタンを順番に押して、ミニモデルを1周ずつ学習させてみましょう。目標は驚きを0.5より小さくすることです。",
  summary: [
    "① 予測（順伝播）→ ② 損失（驚き）→ ③ 誤差逆伝播（責任の分け合い）→ ④ 更新（数を直す）。",
    "1周するたびに、正解の確率は上がり、損失は小さくなる。",
    "この輪をものすごい回数回って、1,750億個の数を直すこと = 事前学習。",
  ],
  unlocks: "事前学習",
  quiz: [
    {
      q: "訓練の輪の正しい順番は？",
      choices: ["損失 → 予測 → 更新 → 誤差逆伝播", "予測 → 損失 → 誤差逆伝播 → 更新", "更新 → 予測 → 誤差逆伝播 → 損失"],
      answer: 1,
      explain: "まず答えを出し（予測）、どれだけ間違えたかを測り（損失）、責任を分けてから（誤差逆伝播）、数を直します（更新）。",
      review: "s1",
    },
    {
      q: "誤差逆伝播のステップですることは？",
      choices: ["次のかけらの確率を出す", "新しい問題をつくる", "数ごとに損失への責任を分ける"],
      answer: 2,
      explain: "損失を逆向きに送りながら、それぞれの数がどれだけ、どちら向きに責任があるかを計算します（第23章）。",
      review: "s4",
    },
    {
      q: "輪を1周すると、ふつうはどうなる？",
      choices: ["正解の確率は上がり、損失は小さくなる", "正解の確率も損失も上がる", "何も変わらない"],
      answer: 0,
      explain: "更新で正解の点数が上がるので、同じ問題をもう一度解くと驚きが小さくなります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第66章 訓練ループを1周",
    lap: "1周",
    repeat: "くり返す！",
    again: "また①へ",
    gpt: "GPT",
    ctx1: "私は",
    ctx2: "今日",
    ctx3: "学校に",
    example: "説明用の例",
    mess: "最初はでたらめ：行くはたった12%",
    lateFirst: "遅れたが1位？！",
    lossIs: "驚き = 損失",
    lossNote: "正解に12%だけ → 驚き3.06",
    colW: "候補",
    colZ: "点数",
    colB: "責任",
    colNew: "新しい点数",
    up: "↑ 上げる",
    down: "↓ 下げる",
    blameRule: "責任 = 確率 − （正解なら1、ちがえば0）",
    backward: "損失を逆向きに",
    real: "本物では1,750億個の数まで責任が流れる",
    update: "新しい点数 = 点数 − 学習率 × 責任",
    lr: "学習率 1",
    mini: "説明用のミニモデル：点数4つだけを直す",
    probGo: "行くの確率",
    lossTitle: "驚き（損失）",
    lap0: "最初",
    lap1: "1周",
    lap2: "2周",
    lap3: "3周",
    many: "1,750億個の数",
    pretrain: "事前学習",
    batch: "問題をたくさん束ねて（第24章）",
    loopAll: "予測 → 損失 → 逆伝播 → 更新、くり返し！",
  },
};
