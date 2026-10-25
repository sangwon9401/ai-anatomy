import { DATASETS, accOf, boundary, run } from "../../../data/part2-boss";
import type { ChapterSpec } from "../../../data/types";

/** the scene's run: 当たりマップ, 8 hidden neurons, learning rate 0.1, minibatches of 10 stores, 300 epochs (seed chosen so the story reads cleanly) */
export const BOSS_DS = DATASETS[0];
export const BOSS = { hidden: 8, lr: 0.1, batch: 10, epochs: 300, seed: 21 };
/** dense snapshots so the scene can show the boundary, epoch and accuracy of the same moment */
export const SNAP_EPOCHS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 25, 30, 40, 50, 60, 80, 100, 130, 160, 200, 250, 300];
export const BOSS_RUN = run(BOSS_DS, BOSS.hidden, BOSS.lr, BOSS.batch, BOSS.epochs, SNAP_EPOCHS, BOSS.seed);
export const SNAPS = BOSS_RUN.snaps.map((s) => ({ epoch: s.epoch, acc: accOf(s.net, BOSS_DS, BOSS_DS.train), segs: boundary(s.net, BOSS_DS) }));
export const FINAL_VAL = accOf(BOSS_RUN.net, BOSS_DS, BOSS_DS.val);
export const KNOBS = BOSS.hidden * 2 + BOSS.hidden + BOSS.hidden + 1;

export const TOOLS2 = ["ニューロン", "活性化関数", "層を重ねる", "順伝播", "損失", "勾配降下法", "学習率", "誤差逆伝播法", "ミニバッチ・エポック", "過学習を防ぐ", "手書き数字認識器"];

export const ch27: ChapterSpec = {
  id: 27,
  part: 2,
  title: "Part 2 ボス戦",
  core: false,
  hook: "ここまで学んだことを全部集めれば、ニューラルネットワークを一から学習させられるでしょうか？",
  steps: [
    { id: "s1", sec: 11, narration: "Part 2のボス戦です！第17章の当たりマップを60軒に増やしました。今回は境界を手で決めず、ネットワークが自分で見つけます。" },
    { id: "s2", sec: 11, narration: "入力2つ → ReLUニューロン8個 → 出力1つ（第18章）。つまみ33個は、最初はでたらめに決めます。0.5を超えたら当たりです。" },
    { id: "s3", sec: 12, narration: "学習ループを回します。順伝播（第19章）、損失をはかる（第20章）、誤差逆伝播で責任を分ける（第23章）、勾配降下で直す（第21章）。" },
    { id: "s4", sec: 12, narration: "10軒ずつのミニバッチで300エポック（第24章）。損失が下がるにつれて境界がV字になり、正解率は23%から100%になります。" },
    { id: "s5", sec: 11, narration: "別にとっておいた、初めて見る30軒で検証します（第25章）。30軒すべて正解。暗記ではなく、V字のルールを学んだのです。" },
    { id: "s6", sec: 10, narration: "GPTも同じように学びます。ただし、つまみ33個ではなく1,750億個、60軒ではなくトークン3,000億個で。" },
    { id: "s7", sec: 11, narration: "Part 2の学習の道具が完成！次のPart 3では、ネットワークに文章を入れるために、文字を数字に変える方法を学びます。" },
  ],
  playgroundTitle: "ネットワークを自分で学習させよう",
  playgroundIntro: "問題を選び、ニューロンの数と学習率を決めて「学習スタート」を押してみましょう。損失の曲線が下がり、境界が育っていくのを見守りましょう。最後のボスは「的」です！",
  summary: [
    "学習ループ：順伝播 → 損失 → 誤差逆伝播 → 勾配降下で直す、をミニバッチでエポックごとにくり返す。",
    "ニューロンの数、学習率、エポック数は人が決める。つまみ（重み、バイアス）は学習が見つける。",
    "検証データで確かめてこそ本当の実力。GPTも同じ方法で、ずっと大きく学ぶ。",
  ],
  unlocks: "学習ループ（Part 2 完成）",
  unlockLabel: "学習の道具をひとつ手に入れました",
  quiz: [
    {
      q: "学習ループ1周の順番として正しいのは？",
      choices: ["損失 → 順伝播 → 直す → 誤差逆伝播", "順伝播 → 損失 → 誤差逆伝播 → 直す", "誤差逆伝播 → 順伝播 → 損失 → 直す"],
      answer: 1,
      explain: "まず予想して（順伝播）、どれだけまちがえたかをはかり（損失）、責任を分けてから（誤差逆伝播）、つまみを直します（勾配降下）。",
      review: "s3",
    },
    {
      q: "入力2つ → ニューロン8個 → 出力1つのネットワークのつまみ（重み + バイアス）はいくつでしょう？",
      choices: ["11個", "24個", "33個"],
      answer: 2,
      explain: "1層目の重み 2 × 8 = 16、バイアス8、出力の重み8、出力のバイアス1。全部で33個です。",
      review: "s2",
    },
    {
      q: "学習率をとても大きく（例：1）すると、このネットワークはどうなるでしょう？",
      choices: ["損失がはね上がって学習がこわれる", "ずっと速く100%になる", "何も変わらない"],
      answer: 0,
      explain: "歩幅が大きすぎると、谷底を通りこしてはね返ります（第22章）。「やってみよう」で確かめてみましょう。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第27章 Part 2 ボス戦",
    boss: "Part 2 ボス戦",
    map: "当たりマップ：60軒",
    self: "境界は自分で見つける！",
    spicy: "辛さ",
    line: "待ち",
    example: "説明用の例",
    netTitle: "小さなネットワーク",
    in1: "辛さ",
    in2: "待ち",
    out: "当たり度",
    rule: "0.5超で当たり",
    knobs: "つまみ33個",
    random: "最初はでたらめ",
    loopTitle: "学習ループ",
    l1: "① 順伝播",
    l2: "② 損失",
    l3: "③ 誤差逆伝播",
    l4: "④ 直す",
    l1s: "第19章",
    l2s: "第20章",
    l3s: "第23章",
    l4s: "第21・22章",
    center: "ミニバッチ",
    centerS: "×エポック・第24章",
    epoch: "エポック",
    acc: "正解率",
    lossT: "損失",
    trainTitle: "学習中",
    valTitle: "初めて見る30軒",
    valOk: "検証：30軒中30軒正解！",
    learned: "暗記ではなく、ルールを学んだ",
    gptTitle: "GPTも同じように、ずっと大きく",
    rowBoss: "ボス戦ネット",
    rowGpt: "GPT-3",
    colKnobs: "つまみ",
    colData: "学習データ",
    bossKnobs: "33個",
    bossData: "60軒",
    gptKnobs: "1,750億個",
    gptData: "3,000億トークン",
    done: "Part 2 学習の道具、完成！",
    next: "次：Part 3 文字を数字に",
  },
};
