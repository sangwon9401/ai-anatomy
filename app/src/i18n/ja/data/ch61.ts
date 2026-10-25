import { percents } from "../../../data/ch45";
import { ffn } from "../../../data/ch55";
import { UNLOCK6 } from "../../../data/ch54";
import { layerNorm } from "../../../data/ch57";
import { LAST_VEC, LOGITS, REST_N, outputProbs } from "../../../data/ch60";
import type { ChapterSpec } from "../../../data/types";

// The whole forward pass of 私は 今日 学校に → 行く with toy 4-number vectors (説明用の例).
// Every stage is rounded to one decimal before the next, so the sums on screen add up exactly.
const r1 = (v: number) => Math.round(v * 10) / 10;

export const TOKENS = ["私は", "今日", "学校に"];
/** 説明用の番号 (a real tokenizer gives other numbers and may cut Japanese into more pieces) */
export const IDS = [1043, 2517, 8820];
export const EMB = [
  [0.8, -0.2, 0.1, 0.4],
  [-0.1, 0.9, 0.2, -0.3],
  [0.2, 0.1, 0.9, 0.6],
];
export const POS = [
  [0.2, 0.1, 0.0, 0.1],
  [0.1, 0.2, 0.1, 0.0],
  [0.0, 0.1, 0.2, 0.1],
];
export const X0 = EMB.map((e, i) => e.map((v, k) => r1(v + POS[i][k])));

/** attention scores; each word only sees itself and the words before it (第51章) */
const SCORES = [[0], [0.5, 0.9], [0.6, 0.8, 1.2]];
export const ATT_W = SCORES.map((row) => {
  const ex = row.map(Math.exp);
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / s);
});
export const ATT_PCT = ATT_W.map((w) => percents(w));
const MIX = ATT_W.map((w) => [0, 1, 2, 3].map((k) => w.reduce((a, wj, j) => a + wj * X0[j][k], 0)));
export const D_ATT = MIX.map((m) => m.map((v) => r1(0.5 * v)));
export const X1 = X0.map((x, i) => x.map((v, k) => r1(v + D_ATT[i][k])));
export const D_FFN = X1.map((x) => ffn(layerNorm(x).z).y.map((v) => r1(0.4 * v)));
export const X2 = X1.map((x, i) => x.map((v, k) => r1(v + D_FFN[i][k])));
/** after all 96 layers (説明用); the last one is the vector 第60章 scores */
export const FINAL = [[1.3, -0.8, 0.9, 1.6], [-0.5, 2.4, 0.7, 0.4], LAST_VEC];

export const OUT = outputProbs(LOGITS.map((l) => l.s));
export const OUT_PCT = percents([...OUT.p, OUT.restP]);
export { LOGITS, REST_N };

/** The stations of the trip, in order (used by the scene's header and the playground). */
export const STATIONS = [
  { key: "tok", name: "トークナイザー", where: "29章", color: "sky" },
  { key: "emb", name: "埋め込み", where: "33章", color: "sky" },
  { key: "pos", name: "位置情報", where: "36章", color: "sky" },
  { key: "att", name: "正規化 → アテンション", where: "57・45章", color: "yellow" },
  { key: "add", name: "足し算", where: "56章", color: "yellow" },
  { key: "ffn", name: "正規化 → フィードフォワード → 足し算", where: "55章", color: "yellow" },
  { key: "x96", name: "ブロック × 96層", where: "58章", color: "yellow" },
  { key: "out", name: "出力：点数をつける", where: "60章", color: "mint" },
  { key: "soft", name: "ソフトマックス", where: "14章", color: "mint" },
  { key: "loop", name: "選んでつなげる", where: "1・2章", color: "mint" },
] as const;

export const ch61: ChapterSpec = {
  id: 61,
  part: 6,
  title: "最初から最後までたどる",
  core: true,
  hook: "ChatGPTが単語を1つ書くあいだ、中ではいったい何が起きているのでしょう？",
  steps: [
    { id: "s1", sec: 8, narration: "ここまで組み立てたGPTに「私は 今日 学校に」を入れて、最初から最後までたどってみましょう。" },
    { id: "s2", sec: 8.5, narration: "まずトークナイザーが文章をかけら（トークン）に切ります。かけらごとに単語帳の番号がつきます（第29章）。" },
    { id: "s3", sec: 10, narration: "埋め込みが、番号ごとに意味のこもった数の列を取り出します。GPT-3では、かけら1つが数12,288個です（第33章）。" },
    { id: "s4", sec: 9.5, narration: "ここに、何番目のかけらかを教える位置情報を足します（第36章）。これでベクトル3本がブロックに入ります。" },
    { id: "s5", sec: 10.5, narration: "ブロックの中。正規化で大きさをそろえてアテンション！「学校に」は前の「私は」「今日」と自分自身を見ます（第45章）。" },
    { id: "s6", sec: 9, narration: "見た分だけ混ぜてきた結果を、高速道路の上の元のベクトルに足します（第56章）。数が少し変わりましたね。" },
    { id: "s7", sec: 9.5, narration: "もう一度正規化して、フィードフォワードが単語ごとに考えを足します。その結果も元のベクトルに足します（第55章）。" },
    { id: "s8", sec: 9.5, narration: "これがブロック1層です。同じことを96層くり返すと、ベクトルごとに文脈が積み重なります（第58章）。" },
    { id: "s9", sec: 10, narration: "96層を出た「学校に」のベクトルで、トークン50,257個に点数をつけます。行く3.0、行った2.1、遅れた1.5（第60章）。" },
    { id: "s10", sec: 9.5, narration: "ソフトマックスで確率に変えると、行く52%、行った21%、遅れた12%。全部足すと100%です（第14章）。" },
    { id: "s11", sec: 9, narration: "確率どおりに1つ選びます。「行く」！ 文の最後につなげると「私は 今日 学校に 行く」になります（第1章）。" },
    { id: "s12", sec: 10, narration: "そしてこの文をもう一度いちばん上に入れて、次のかけらを作ります（第2章）。ChatGPTの答えは全部この旅から生まれます。" },
  ],
  playgroundTitle: "1ステップずつたどる",
  playgroundIntro: "「次の部品」ボタンで「私は 今日 学校に」をGPTの中へ送ってみましょう。アテンションでは単語を押して、だれを見ているかも確かめましょう。",
  summary: [
    "トークナイザー → 埋め込み + 位置情報 → [正規化・アテンション・足し算・正規化・フィードフォワード・足し算] × 96 → 出力 + ソフトマックス → 選んでつなげる。",
    "単語ベクトルは層を通るたびに文脈が足され、最後の単語のベクトルが次の言葉を決める。",
    "次のかけら1つ = この旅1回。つなげた文で、また最初から。",
  ],
  unlocks: "全体の順伝播",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "「私は 今日 学校に」がGPTを通る順番として正しいのは？",
      choices: [
        "埋め込み → トークナイザー → ブロック → 位置情報 → ソフトマックス",
        "トークナイザー → 埋め込み + 位置情報 → ブロック × 96 → 出力 + ソフトマックス",
        "ブロック × 96 → トークナイザー → ソフトマックス → 埋め込み",
      ],
      answer: 1,
      explain: "文章を切り（トークナイザー）、数に変え（埋め込み + 位置）、ブロック96層を通ったあと、点数を確率に変えます。",
      review: "s1",
    },
    {
      q: "ブロックの中で「学校に」が前の単語たちを見る部品は？",
      choices: ["アテンション", "フィードフォワード", "ソフトマックス"],
      answer: 0,
      explain: "アテンションが前の単語たちを見て意味を混ぜてきます（第45章）。フィードフォワードは単語ごとに別々に考えます。",
      review: "s5",
    },
    {
      q: "次の単語を1つ選んでつなげたあと、何が起きる？",
      choices: ["そのまま終わる", "人が正解を直す", "長くなった文をまたいちばん上に入れる"],
      answer: 2,
      explain: "つなげた文でもう一度最初から旅をして、その次のかけらを作ります（第2章 自己回帰）。",
      review: "s12",
    },
  ],
  labels: {
    tag: "第61章 最初から最後までたどる",
    title: "最初から最後までたどる",
    sentence: "私は 今日 学校に",
    q: "?",
    arrow: "→",
    idToy: "番号は説明用の例",
    vocab: "単語帳（トークン50,257個）",
    vdots: "⋮",
    table: "埋め込みの表：50,257行 × 12,288列",
    lookup: "その番号の行を取り出す",
    real: "本物は数12,288個",
    toy: "説明用の例",
    nth: "番目",
    posNote: "+ 何番目か",
    toBlock: "ブロックへ！",
    norm: "正規化",
    looks: "「学校に」が見る割合",
    mask: "目かくし",
    addNote: "混ぜてきた結果を元のベクトルに足す",
    ffn: "フィード\nフォワード",
    ffnNote: "単語ごとに別々に考えを足す",
    layer: "層",
    same: "同じことを96回",
    lastVec: "96層を出た「学校に」",
    compare: "トークンごとに比べる（第9章）",
    rest: "その他",
    restN: "50,253個",
    restScore: "約−9.1",
    pt: "点",
    total: "合計 = 100%",
    pick: "選ぶ！",
    again: "また上へ",
    oneWord: "単語1つ = この旅1回",
    all: "1,750億個の数が全部計算に参加します",
    w4: "行く",
  },
};
