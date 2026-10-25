import { GD_RUN, TRAIN, VAL, fitPoly, mseOf } from "../../../data/part2-fit";
import type { ChapterSpec } from "../../../data/types";

export const LINE = fitPoly(1, TRAIN);
export const LINE_TRAIN = mseOf(LINE, TRAIN);
export const LINE_VAL = mseOf(LINE, VAL);
export const WIGGLE = GD_RUN[GD_RUN.length - 1];
/** the point of the run where the validation loss was lowest */
export const BEST_STOP = GD_RUN.slice(1).reduce((a, r) => (r.val < a.val ? r : a), GD_RUN[1]);

export const ch25: ChapterSpec = {
  id: 25,
  part: 2,
  title: "過去問だけ覚えた生徒",
  core: false,
  hook: "練習問題は全部正解なのに、テストになるとまちがえるAI。なぜでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "過去問だけを丸暗記した生徒は、過去問では満点なのに、初めて見る問題ではボロボロ。AIにも同じことが起きます。" },
    { id: "s2", sec: 9, narration: "8軒の待ちと星で練習します。これが訓練データです。単純な直線は、点の間をほどよく通ります。" },
    { id: "s3", sec: 10, narration: "とても複雑なモデルを長く学習させると、8つの点を全部ぴったり通るくねくねの線になります。訓練損失は0です。" },
    { id: "s4", sec: 12, narration: "でも初めて見る7軒（検証データ）を入れると、とんでもない答えを出します。暗記しただけなのです。これが過学習（overfitting）です。" },
    { id: "s5", sec: 10, narration: "学習しながら2つの損失をいっしょにかくと、訓練損失は下がり続けるのに、検証損失はある時点からまた上がります。" },
    { id: "s6", sec: 12, narration: "検証損失がいちばん低いときに止めるか、データをもっと集めます。初めての問題もうまく解ける力を、汎化（generalization）といいます。" },
    { id: "s7", sec: 10, narration: "GPTも学習のとき、別にとっておいた文章で検証損失を見守ります。暗記ではなく、本当に学んだかを確かめるのです。" },
  ],
  playgroundTitle: "暗記探知機",
  playgroundIntro: "モデルの複雑さ（曲線がどれだけくねくねになれるか）を変えてみましょう。訓練損失と検証損失がどう変わるか、データを増やすとどうなるかを確かめましょう。",
  summary: [
    "過学習：訓練データを暗記して、訓練損失は低いのに、初めてのデータではまちがえる。",
    "検証データ（学習に使っていない問題）で確かめる。検証損失がまた上がったら危険信号。",
    "防ぐ方法：検証損失がいちばん低いときに止める、データを増やす。目標は汎化。",
  ],
  unlocks: "過学習・汎化",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "訓練損失は0なのに、検証損失が大きいなら？",
      choices: ["とてもよく学習できた", "過学習している", "学習率が0"],
      answer: 1,
      explain: "訓練データだけを暗記して、初めてのデータは当てられないということです。過学習です。",
      review: "s4",
    },
    {
      q: "検証データとは、どんなデータでしょう？",
      choices: ["学習に使わず、別にとっておいたデータ", "訓練データをもう一度使ったもの", "正解のないデータ"],
      answer: 0,
      explain: "モデルが一度も見たことのない問題でテストしてこそ、本当の実力がわかります。",
      review: "s4",
    },
    {
      q: "過学習を減らす方法ではないものは？",
      choices: ["データをもっと集める", "検証損失がいちばん低いときに止める", "同じデータでもっと長く学習する"],
      answer: 2,
      explain: "同じデータで長く学習するほど、もっと暗記してしまいます。検証損失が上がり始めたら止めるのがよいのです。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第25章 過去問だけ覚えた生徒",
    memo: "暗記した生徒",
    under: "理解した生徒",
    past: "過去問",
    fresh: "初めて見る問題",
    pts: "点",
    example: "説明用の例",
    trainTitle: "訓練データ：8軒",
    axisX: "待ち（組）",
    axisY: "星",
    simple: "単純な直線",
    trainLoss: "訓練損失",
    valLoss: "検証損失",
    complex: "複雑なモデル",
    zero: "8点すべて通過！",
    valTitle: "初めて見る7軒",
    weird: "星6？！",
    overfit: "過学習（overfitting）",
    curveTitle: "学習しながら2つの損失",
    time: "学習時間 →",
    timeNote: "目盛りは右ほど広がる",
    stop: "ここで止める！",
    apart: "離れていく",
    fix1: "検証損失がいちばん低いときに止める",
    fix2: "データをもっと集める",
    gen: "汎化 = 初めての問題もうまく解く",
    gpt: "GPTも別にとっておいた文章で検証",
    real: "暗記？それとも学習？",
    line: "直線",
    wiggle: "くねくね",
  },
};
