import type { ChapterSpec } from "../../../data/types";

/** 説明用の例 curve: every ×10 in size takes 0.5 off the loss. (Kaplan 2020 found straight lines on ×10 axes;
 *  these numbers are made up to keep the arithmetic simple.) */
export const LOSS_AT_1E7 = 5;
export const DROP_PER_10X = 0.5;
export const lossOf = (n: number) => LOSS_AT_1E7 - DROP_PER_10X * (Math.log10(n) - 7);

export const SIZES70 = [1e7, 1e8, 1e9, 1e10, 1e11];
export const GPT3_N = 1.75e11;

/** Japanese number words for model sizes: 1,000万, 1億, 10億, 1,750億, 1兆 (the export keeps its Korean-era name). */
export function koN(n: number): string {
  if (n >= 1e12) return `${Number((n / 1e12).toFixed(1)).toLocaleString("ja-JP")}兆`;
  if (n >= 1e8) return `${Math.round(n / 1e8).toLocaleString("ja-JP")}億`;
  return `${Math.round(n / 1e4).toLocaleString("ja-JP")}万`;
}

/** Chinchilla (2022): about 20 training tokens per parameter. */
export const TOKENS_PER_PARAM = 20;

export const ch70: ChapterSpec = {
  id: 70,
  part: 7,
  title: "大きいほど賢くなる",
  core: true,
  hook: "モデルを10倍大きくすると、どれだけよくなるのでしょう？ 前もってわかるのでしょうか？",
  steps: [
    { id: "s1", sec: 10, narration: "モデルを大きくすると、本当に賢くなるのでしょうか？ 2020年、研究者たちは大きさのちがうモデルをいくつも作って損失を比べました。" },
    { id: "s2", sec: 9, narration: "ふつうの目盛りで描いてみます。小さいモデルたちは左はしに集まっていて、そのあとはほとんど平らに見えます。" },
    { id: "s3", sec: 9, narration: "今度は横の目盛りを変えます。1マス進むごとに1を足すのではなく、10倍ずつかけていく目盛りです。" },
    { id: "s4", sec: 10, narration: "すると、点がまっすぐ1本の線に並びます。説明用の例では、大きさを10倍にするたびに損失が0.5ずつ減ります。" },
    { id: "s5", sec: 10, narration: "10倍ずつ大きくなるこの目盛りを、対数目盛りといいます。第65章の驚きのように「何回かけたか」を数える目盛りです。" },
    { id: "s6", sec: 9, narration: "データの量や計算量を増やしても、同じようにまっすぐな線が出ました。この決まりをスケーリング則といいます。" },
    { id: "s7", sec: 10, narration: "線をのばせば、もっと大きなモデルの損失も前もって予想できます。だからGPT-3のような大きなモデルに挑戦したのです。" },
    { id: "s8", sec: 11, narration: "2022年のチンチラの研究は、モデルだけを大きくせず、パラメータ1個あたり約20トークンの割合でデータも増やそうと言いました。" },
  ],
  playgroundTitle: "目盛りを変えてみよう",
  playgroundIntro: "モデルの大きさを変えて、ふつうの目盛りと10倍目盛りを切りかえながら、同じ点がどう見えるか比べてみましょう。",
  summary: [
    "横の目盛りを10倍ずつに変えると（対数目盛り）、損失はまっすぐな線で減っていく。",
    "大きさ・データ・計算量を増やすと、損失は予想どおりに減る = スケーリング則（2020）。",
    "線をのばして大きなモデルを予想する。データもいっしょに増やすべき（チンチラ、2022）。",
  ],
  unlocks: "スケーリング則",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "「10倍目盛り」で1マス右へ進むと、値は？",
      choices: ["1増える", "10倍になる", "2倍になる"],
      answer: 1,
      explain: "1 → 10 → 100 → 1,000のように、1マスごとに10をかけます。こういう目盛りが対数目盛りです。",
      review: "s3",
    },
    {
      q: "スケーリング則が言っていることは？",
      choices: ["モデルが大きいと損失は0になる", "モデルが大きすぎると学習できない", "大きさ・データ・計算を増やすと、損失は予想どおりに減る"],
      answer: 2,
      explain: "10倍目盛りの上で、損失がまっすぐな線にそって減るので、もっと大きなモデルの結果も前もって予想できます。",
      review: "s6",
    },
    {
      q: "チンチラの研究（2022）がすすめたことは？",
      choices: ["データもモデルの大きさに合わせていっしょに増やす", "モデルだけをできるだけ大きくする", "データを減らす"],
      answer: 0,
      explain: "パラメータ1個あたり約20トークンの割合で、モデルとデータをいっしょに大きくするのがよいとしました。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第70章 大きいほど賢くなる",
    study: "2020 · Kaplanら",
    sizes: "モデルの大きさ（パラメータ数）",
    q: "大きいほど損失は減る？",
    axisX: "モデルの大きさ",
    axisXArrow: "モデルの大きさ →",
    axisY: "↑ 損失",
    example: "説明用の例の曲線",
    crowd: "← 左はしに集まっている",
    flatQ: "ほぼ平ら？",
    rulerA: "ふつうの目盛り：1マスで +1",
    rulerB: "10倍目盛り：1マスで ×10",
    plus1: "+1",
    times10: "×10",
    line: "1本の線に！",
    minus: "−0.5",
    logName: "対数目盛り（log scale）",
    link65: "65章：半分ごとに驚き +1",
    link70: "70章：10倍ごとに1マス",
    data: "データの量",
    compute: "計算量",
    law: "スケーリング則",
    predict: "前もって予想 →",
    gpt3: "GPT-3",
    chinchilla: "2022 · チンチラ",
    perParam: "パラメータ1個あたり約20トークン",
    exampleCalc: "10億個のモデル → 約200億トークン",
    together: "モデルとデータをいっしょに大きく",
    // ja: unit characters that koN() draws on the size axis, so their font slice is loaded for MP4 renders
    units: "万億兆",
  },
};
