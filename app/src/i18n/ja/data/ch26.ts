import { MNIST_TEST_ACC } from "../../../data/part2-mnist";
import { predict, sampleDigit } from "../../../data/part2-mnist-net";
import type { ChapterSpec } from "../../../data/types";

/** the scene's 3 (an MNIST test image) and what the embedded network says about it */
export const THREE = sampleDigit(3);
export const THREE_OUT = predict(THREE);
/** s1 zoom: a 4×4 patch of the 3 (rows, cols) */
export const PATCH = { row: 10, col: 10, n: 4 };
export const PATCH_VALUES = Array.from({ length: PATCH.n }, (_, r) => Array.from({ length: PATCH.n }, (_, c) => THREE[(PATCH.row + r) * 28 + PATCH.col + c]));
export const ACC_PCT = (MNIST_TEST_ACC * 100).toFixed(2);
export const ACC_RIGHT = Math.round(MNIST_TEST_ACC * 10000);
/** s2 draws 8 of the 64 hidden neurons: the five most active for this 3, and three that stay off */
export const SHOWN_HIDDEN = (() => {
  const idx = Array.from(THREE_OUT.hidden, (v, i) => [i, v] as [number, number]);
  const on = [...idx].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const off = idx.filter(([, v]) => v === 0).slice(0, 3);
  return [on[0], off[0], on[1], on[2], off[1], on[3], off[2], on[4]];
})();
export const HIDDEN_MAX = Math.max(...THREE_OUT.hidden);
export const ACTIVE_COUNT = THREE_OUT.hidden.filter((v) => v > 0).length;

export const ch26: ChapterSpec = {
  id: 26,
  part: 2,
  title: "体験：手書き数字",
  core: false,
  hook: "自分が指でかいた数字を、ニューラルネットワークは本当に読み取れるのでしょうか？",
  steps: [
    { id: "s1", sec: 11, narration: "数字の画像は 28 × 28 = 784マス。マスごとに、0（空白）から1（濃いインク）までの数字が入っています（第6章）。" },
    { id: "s2", sec: 12, narration: "784個の数字が入力です。隠れ層のニューロン64個が、それぞれ (入力 × 重み) の合計 + バイアスを計算し、ReLUで折り曲げます（第16〜19章）。" },
    { id: "s3", sec: 11, narration: "出力ニューロン10個が0〜9の点数を出し、ソフトマックスで確率にします（第14章）。この画像は3が87.5%、5が11.3%。" },
    { id: "s4", sec: 12, narration: "学習には、MNISTという手書き数字6万枚を使いました。順伝播、損失、誤差逆伝播、修正をミニバッチでくり返しました（第19〜24章）。" },
    { id: "s5", sec: 12, narration: "学習のあと、初めて見るテスト画像1万枚で採点したら、97.96%正解しました。このアプリの中に入っている、まさにそのネットワークです。" },
    { id: "s6", sec: 10, narration: "隠れニューロンの重みを画像にすると、線のかけらのような模様が見えます。だれも教えていないのに、自分で見つけたのです。" },
    { id: "s7", sec: 8, narration: "さあ、自分でかいてみる番です。下のマスに指で数字をかくと、ブラウザの中のネットワークがすぐに当てます。" },
  ],
  playgroundTitle: "数字当て",
  playgroundIntro: "四角いマスに、指（またはマウス）で0から9までの数字を1つ大きくかいてみましょう。ネットワークが見ている28×28の画像と、数字ごとの確率がすぐに出ます。",
  summary: [
    "数字の画像 = 28 × 28 = 784個の数字。これがネットワークの入力。",
    "784 → 隠れニューロン64個（ReLU）→ 出力10個 → ソフトマックスで0〜9の確率。",
    "MNIST 6万枚で学習し、初めて見る1万枚のうち約98%を当てた。",
  ],
  unlocks: "手書き数字認識器",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "28 × 28 の白黒の数字画像は、いくつの数字で表せるでしょう？",
      choices: ["56個", "784個", "28個"],
      answer: 1,
      explain: "横28マス × 縦28マス = 784マスで、マスごとに数字が1つずつあります。",
      review: "s1",
    },
    {
      q: "出力ニューロン10個の点数を確率に変える計算は？",
      choices: ["ReLU", "正規化", "ソフトマックス"],
      answer: 2,
      explain: "点数をeで持ち上げて合計で割るソフトマックス（第14章）で、0〜9の確率を作ります。",
      review: "s3",
    },
    {
      q: "ネットワークの実力をはかるには、どんな画像で採点すべきでしょう？",
      choices: ["学習に使っていない、初めて見る画像", "学習に使った画像", "どんな画像でもよい"],
      answer: 0,
      explain: "暗記したものをもう一度聞いても、実力はわかりません（第25章）。初めて見るテスト画像1万枚で採点しました。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第26章 体験：手書き数字",
    title: "手書きの数字",
    grid: "28 × 28 = 784マス",
    scale: "0 = 空白、1 = 濃い",
    zoom: "拡大",
    mnist: "MNISTのテスト画像",
    inputs: "入力784個",
    hidden: "隠れ層64個",
    outputs: "出力10個",
    drawn: "64個中8個を表示",
    active: "この画像では64個中35個がオン",
    relu: "ReLUで折り曲げ",
    on: "オンは黄色",
    probTitle: "点数 → ソフトマックス → 確率",
    confuse: "5と少しまぎらわしい",
    trainTitle: "MNISTの手書き数字6万枚で学習",
    loop: "順伝播 → 損失 → 誤差逆伝播 → 修正",
    batch: "ミニバッチでくり返す",
    test: "初めて見るテスト画像1万枚",
    right: "枚正解",
    measured: "このアプリ内のネットワークで実測",
    seeTitle: "隠れニューロンが見ている模様",
    plus: "+ の重み：ここにインクがあるとオン",
    minus: "− の重み：ここにインクがあるとオフ",
    self: "だれも教えていないのに！",
    neuron: "ニューロン",
    go: "さあ、自分でかいてみよう！",
    down: "下のマスに数字をかいてみましょう",
    digits: "0 1 2 3 4 5 6 7 8 9 %",
  },
};
