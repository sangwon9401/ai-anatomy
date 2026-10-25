import type { ChapterSpec } from "../../../data/types";

/** bytes = parameters × bits ÷ 8; GB here means 10億 (10⁹) bytes */
export const sizeGB = (params: number, bits: number) => (params * bits) / 8 / 1e9;

export const GPT3 = 175e9;
export const SMALL = 3e9; // a 30億-parameter model for the worked example
export const BITS = [32, 16, 8, 4] as const;
export const PHONE_GB = [8, 12] as const; // a typical range for phone memory (RAM) today

/**
 * Quantise onto a ruler with 2^bits evenly spaced ticks from −range to +range.
 * Returns the tick value nearest to w.
 */
export function quantize(w: number, bits: number, range: number) {
  const n = 2 ** bits - 1;
  const step = (2 * range) / n;
  const k = Math.round((w + range) / step);
  return -range + k * step;
}

export const WEIGHTS = [0.82, -0.35, 0.07, -1.2]; // illustrative knob values (説明用の例)
export const RANGE = 1.2;

// distillation: teacher's next-piece probabilities for "私は 今日 学校に" (ch01), and a student before/after
export const NEXT = ["行く", "行った", "遅れた", "その他"];
export const TEACHER = [0.52, 0.21, 0.12, 0.15];
export const STUDENT_BEFORE = [0.3, 0.1, 0.35, 0.25];
export const STUDENT_AFTER = [0.49, 0.22, 0.13, 0.16];

export const PARAM_PRESETS = [
  { key: "1b", label: "10億個", n: 1e9 },
  { key: "3b", label: "30億個", n: 3e9 },
  { key: "8b", label: "80億個", n: 8e9 },
  { key: "gpt3", label: "1,750億個（GPT-3）", n: GPT3 },
];

export const ch90: ChapterSpec = {
  id: 90,
  part: 10,
  title: "スマホの中のAI",
  core: false,
  hook: "巨大なAIが、どうやってインターネットなしでスマホの中で動くのでしょう？",
  steps: [
    { id: "s1", sec: 12, narration: "GPT-3のつまみ（パラメータ）は1,750億個です（第12章）。1つを32ビット、つまり4バイトで保存すると、全部でどれくらいでしょう？" },
    { id: "s2", sec: 11.5, narration: "1,750億 × 4バイト = 7,000億バイト、約700GBです。いまのスマホのメモリは8〜12GBくらいなので、とても入りません。" },
    { id: "s3", sec: 10.5, narration: "1つめの方法は、小さなモデルを作ること。大きな先生モデルの答えを、小さな生徒モデルにまねさせて教えます。これを蒸留といいます。" },
    { id: "s4", sec: 9.5, narration: "正解1つだけでなく、先生の確率の棒全体をまねします。「行った」もけっこうありそうだ、ということまで学ぶのです。" },
    { id: "s5", sec: 12, narration: "2つめは、数字をざっくり書くこと。8ビットは目盛り256個、4ビットは目盛り16個のものさしで測るようなものです。これが量子化です。" },
    { id: "s6", sec: 11, narration: "0.82を8ビットのものさしで測ると0.824、4ビットでは0.88になります。少しずれますが、モデルはだいたい同じように動きます。" },
    { id: "s7", sec: 11, narration: "30億個のモデルで計算してみましょう。32ビットなら12GB、8ビットなら3GB、4ビットなら1.5GB。これでスマホに入ります！" },
    { id: "s8", sec: 12, narration: "スマホの中で動けば、ネットなしでも使えて、自分の文章も外に出ません。そのかわり小さなモデルなので、難しい質問は苦手かもしれません。" },
  ],
  playgroundTitle: "モデル圧縮計算機",
  playgroundIntro: "パラメータの数とビット数を選んで、モデルの大きさを計算してみましょう。スマホのメモリに入るでしょうか？下では、目盛りのものさしで数字がどれくらいずれるかも見ます。",
  summary: [
    "モデルの大きさ = パラメータの数 × 数字1つのバイト数。GPT-3を32ビットで入れると約700GB。",
    "蒸留：小さな生徒モデルが、大きな先生モデルの確率の棒をまねして学ぶ。",
    "量子化：32ビットのかわりに8ビット・4ビットでざっくり書く。小さなモデル + 量子化 = スマホの中のAI。",
  ],
  unlocks: "モデルの圧縮",
  unlockLabel: "新しい能力カードをひとつ手に入れました",
  quiz: [
    {
      q: "パラメータ30億個を8ビット（1バイト）で保存すると、何GBでしょう？",
      choices: ["3GB", "12GB", "30GB"],
      answer: 0,
      explain: "30億 × 1バイト = 30億バイト = 3GBです。32ビット（4バイト）なら12GB。",
      review: "s7",
    },
    {
      q: "蒸留（distillation）で、生徒モデルは何をまねするでしょう？",
      choices: ["先生モデルのパラメータの数", "先生モデルが出した確率の棒", "先生モデルの名前"],
      answer: 1,
      explain: "正解1つよりも多くのことがつまった、先生の確率の棒全体をまねします。",
      review: "s4",
    },
    {
      q: "量子化をすると、どうなるでしょう？",
      choices: ["モデルがもっと正確になる", "パラメータの数が増える", "大きさは小さくなり、数字は少しずれる"],
      answer: 2,
      explain: "目盛りの少ないものさしで測るようなものなので、数字が少しずれます。そのかわり大きさがぐっと小さくなります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第90章 スマホの中のAI",
    knobs: "つまみ1,750億個",
    oneKnob: "つまみ1個 = 32ビット = 4バイト",
    byte: "1バイト",
    bitsOf: "例：0.82を32ビットで書いたところ",
    gb700: "700GB",
    eq: "1,750億 × 4バイト = 7,000億バイト",
    total: "≈ 700GB",
    phone: "スマホのメモリ 8〜12GB",
    noWay: "とても無理！",
    teacher: "先生モデル",
    student: "生徒モデル",
    big: "大きくて賢い",
    small: "小さくて軽い",
    copy: "まねする",
    distill: "蒸留（distillation）",
    context: "私は今日学校に ___",
    tBars: "先生の確率",
    sBars: "生徒の確率",
    oneHot: "正解だけ見ると：行く100%、ほか0%",
    more: "「行った」もありそう、ということまで！",
    example: "* 説明用の例",
    r32: "32ビット：ほぼ無限に細かい",
    r8: "8ビット：目盛り256個",
    r4: "4ビット：目盛り16個",
    quant: "量子化（quantization）",
    w: "0.82",
    q8: "→ 0.824",
    q4: "→ 0.88",
    off: "少しずれても、だいたい同じように動く",
    model3: "30億個のモデル",
    line: "スマホのメモリ 8GB",
    fits: "スマホに入る！",
    tight: "ぎりぎり",
    gb12: "12GB",
    gb6: "6GB",
    gb3: "3GB",
    gb15: "1.5GB",
    b32: "32ビット",
    b16: "16ビット",
    b8: "8ビット",
    b4: "4ビット",
    offline: "ネットなしでも使える",
    private: "自分の文章が外に出ない",
    npu: "最近のスマホのチップには、AI計算専用の部品（NPU）もあります",
    weak: "難しい質問は苦手かも",
    chatQ: "明日やることを整理して",
    chatA: "はい！3つにまとめると…",
    onDevice: "スマホの中で計算中",
  },
};
