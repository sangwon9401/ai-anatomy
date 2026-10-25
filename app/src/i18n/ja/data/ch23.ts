import { NET, STORE_A, forward, type Net } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/**
 * 責任 (blame) of every knob for loss = (stars − answer)²: how much the loss changes per unit nudge.
 * Computed backwards, one multiplication per edge (the chain the chapter shows).
 */
export function blame(net: Net, x: readonly number[], target: number) {
  const f = forward(net, x);
  const dy = 2 * (f.y - target);
  const dh = net.v.map((v) => dy * v);
  const dz = dh.map((d, j) => (f.z[j] > 0 ? d : 0));
  const dW1 = net.W1.map((row, j) => row.map((_, i) => dz[j] * x[i]));
  const db1 = dz;
  const dv = f.h.map((h) => dy * h);
  const dc = dy;
  return { f, loss: (f.y - target) ** 2, dy, dh, dz, dW1, db1, dv, dc };
}

export function step(net: Net, x: readonly number[], target: number, lr: number): Net {
  const g = blame(net, x, target);
  const r = (v: number) => Math.round(v * 1e6) / 1e6;
  return {
    W1: net.W1.map((row, j) => row.map((w, i) => r(w - lr * g.dW1[j][i]))) as Net["W1"],
    b1: net.b1.map((b, j) => r(b - lr * g.db1[j])) as Net["b1"],
    v: net.v.map((v, j) => r(v - lr * g.dv[j])) as Net["v"],
    c: r(net.c - lr * g.dc),
  };
}

export const B0 = blame(NET, STORE_A.x, STORE_A.real);
export const LR23 = 0.005;
export const NET_AFTER = step(NET, STORE_A.x, STORE_A.real, LR23);
export const AFTER = blame(NET_AFTER, STORE_A.x, STORE_A.real);

export const ch23: ChapterSpec = {
  id: 23,
  part: 2,
  title: "誤差逆伝播法：責任の分け合い",
  core: true,
  hook: "つまみが何十億個もあるのに、まちがえたとき、どのつまみをどれだけ直せばよいのでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "第19章のネットワークはA店を3.5点と予想し、本当は4.5なので損失は1。11個のつまみのうち、だれのせいでしょう？" },
    { id: "s2", sec: 10, narration: "第21章のように1つずつ少し変えてみればわかります。でもGPT-3はつまみが1,750億個あるので、きりがありません。" },
    { id: "s3", sec: 9, narration: "そこで後ろから逆向きに責任を分けます。星を0.01上げると損失は0.02減ります。星の責任は −2 です。" },
    { id: "s4", sec: 10, narration: "星は「人気 × 1.5」で作られました。だから人気の責任は −2 × 1.5 = −3。責任が線にそって逆向きに流れます。" },
    { id: "s5", sec: 11, narration: "待ちの重みは、待ち2とかけられて人気を作ります。だから責任は −3 × 2 = −6。こうしてかけ算が鎖のようにつながります。" },
    { id: "s6", sec: 9, narration: "「辛すぎ」ニューロンはオフでしたね。オフのニューロンは結果を変えられないので、責任も0。そのつまみはそのままにします。" },
    { id: "s7", sec: 11, narration: "こうして一度逆向きにたどると、すべてのつまみの責任がいっぺんに出ます。これが誤差逆伝播法（backpropagation）です。" },
    { id: "s8", sec: 12, narration: "責任と反対の向きに少しずつ直すと、予想は4.2点、損失は1から0.09に減ります。1986年に広く知られた方法です（第3章）。" },
  ],
  playgroundTitle: "責任トラッカー",
  playgroundIntro: "つまみを1つ選んでみましょう。そのつまみの責任が、出力側から逆向きにどうかけ合わされてくるかが見えます。「一歩直す」で損失を減らしてみましょう。",
  summary: [
    "誤差逆伝播法：損失から出発して逆向きに、線にそって責任をかけていく。",
    "つまみの責任 = 少し変えたとき、損失がどれだけ変わるか。オフのニューロンの先は0。",
    "一度逆向きにたどれば全部のつまみの責任が出る。その反対へ少しずつ直す。",
  ],
  unlocks: "誤差逆伝播法",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "星の責任が −2 で、星 = 人気 × 1.5 なら、人気の責任は？",
      choices: ["−3", "−0.5", "3.5"],
      answer: 0,
      explain: "人気を少し上げると星はその1.5倍上がるので、責任も −2 × 1.5 = −3です。",
      review: "s4",
    },
    {
      q: "ReLUが0にしてオフにしたニューロンへ入る重みの責任は？",
      choices: ["いちばん大きい", "マイナス", "0"],
      answer: 2,
      explain: "オフのニューロンは、入力が少し変わってもずっと0なので、結果が変わりません。だから責任は0です。",
      review: "s6",
    },
    {
      q: "誤差逆伝播法がどうしても必要な理由は？",
      choices: ["損失を計算するため", "すべてのつまみの責任を一度に速く求めるため", "入力データを増やすため"],
      answer: 1,
      explain: "つまみを1つずつ少し変えてみると、1,750億回も計算が必要です。誤差逆伝播法は一度逆向きにたどるだけで全部求めます。",
      review: "s2",
    },
  ],
  labels: {
    tag: "第23章 誤差逆伝播法：責任の分け合い",
    title: "だれのせい？",
    example: "第19章 · A店 · 説明用の例",
    spicy: "辛さ",
    line: "待ち",
    price: "値段",
    h1: "人気",
    h2: "辛すぎ",
    out: "星",
    loss: "損失",
    knobs: "つまみ11個",
    knobsSub: "重み8個 + バイアス3個",
    target: "正解 4.5",
    gpt: "GPT-3：1,750億個",
    oneByOne: "1つずつ？きりがない",
    backward: "後ろから責任を分ける",
    blame: "責任",
    nudge: "星 +0.01 → 損失 −0.02",
    chainTitle: "待ちの重みの責任",
    chain: "−2 × 1.5 × 2 = −6",
    off: "オフ → 責任0",
    bp: "誤差逆伝播法（backpropagation）",
    all: "一度に全部の責任！",
    update: "新しいつまみ = つまみ − 0.005 × 責任",
    before: "予想 3.5 · 損失 1",
    after: "予想 4.2 · 損失 0.09",
    year: "1986 誤差逆伝播法が広く知られる（第3章）",
    big: "責任が大きいほど太く",
  },
};
