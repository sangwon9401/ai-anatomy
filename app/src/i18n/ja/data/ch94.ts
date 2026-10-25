import type { ChapterSpec } from "../../../data/types";

// Everything on screen is from the real offline ことわざ run on the ja corpus (part11-run.ts, CHECKPOINTS.proverb).

/** one training window, shortened to its first 10 tokens: input row and the target row (next token). "\n" = line break */
export const WINDOW_IN = ["\n", "千", "里", "の", "道", "も", "一", "歩", "か", "ら"];
export const WINDOW_OUT = ["千", "里", "の", "道", "も", "一", "歩", "か", "ら", "\n"];

/** lines the model wrote during the run (temperature 0.8), with the corpus loss at that step */
export const DIARY = [
  { step: "0歩", loss: "5.85", text: "能藪用返え後喉べ絵目火主豚捕…" },
  { step: "100歩", loss: "3.40", text: "負ねるには時の憎は渡あるろ" },
  { step: "500歩", loss: "0.99", text: "逃がした魚心あれば苦あり" },
  { step: "1,000歩", loss: "0.79", text: "猿のれんに腕押し" },
  { step: "1,500歩", loss: "0.73", text: "かわいい子には育つ" },
];

/** s7: one line copied from the data, one new (both written at step 1,500) */
export const COPIED = "千里の道も一歩から";
export const FRESH = "嘘から出る杭は打たれる";

export const LOOP = [
  { name: "予測", ch: "第64章" },
  { name: "損失", ch: "第65章" },
  { name: "誤差逆伝播", ch: "第23章" },
  { name: "つまみを回す", ch: "第21・67章" },
];

export const ch94: ChapterSpec = {
  id: 94,
  part: 11,
  title: "ブラウザで訓練する",
  core: true,
  hook: "モデルは本当はどうやって学ぶのでしょう？自分のスマホの中で、じかに見てみましょう。",
  steps: [
    { id: "s1", sec: 10, narration: "いよいよ訓練です。はじめのミニGPTのつまみ24,793個はでたらめに決まっているので、文字をめちゃくちゃに並べます。" },
    { id: "s2", sec: 10.5, narration: "訓練の1歩はこうです。データから24トークンのかたまりを8つ取り出し、位置ごとに次のトークンを当てさせます（第64章）。" },
    { id: "s3", sec: 10, narration: "まちがえた分だけ損失が出ます（第65章）。はじめの損失は約5.85。345種類からでたらめに選ぶときの驚きと同じです。" },
    { id: "s4", sec: 10, narration: "誤差逆伝播法でつまみごとの責任を計算し（第23章）、損失が減る向きに少し回します。これが訓練の1歩です。" },
    { id: "s5", sec: 10.5, narration: "この1周を1,500回くり返すと、損失はぐんぐん下がります。275歩で2を、500歩で1を下回りました。" },
    { id: "s6", sec: 10.5, narration: "そのあいだにモデルが書く文も変わります。100歩ではでたらめ、500歩では言葉が見え、1,500歩ではことわざらしくなります。" },
    { id: "s7", sec: 10.5, narration: "ただし長く訓練すると、データを丸ごと覚えます。1,500歩のモデルが書いた80行のうち65行は、覚えた文でした（第25章）。" },
    { id: "s8", sec: 9.5, narration: "では「やってみよう」で訓練ボタンを押してみましょう。サーバーなしで、スマホの中で本物の計算が動きます。" },
  ],
  playgroundTitle: "スマホで訓練する",
  playgroundIntro: "「訓練スタート」を押すと、このスマホの中で本物のミニGPTが訓練されます。損失のグラフと生成日記を見守りましょう。いつでも止めて、続きからできます。",
  summary: [
    "1歩 = 8つのかたまりで次のトークン当て → 損失 → 誤差逆伝播 → つまみを回す。",
    "損失は5.85（でたらめに選ぶ）から、1,500歩で0.73まで下がる。",
    "長く訓練すると覚えはじめる。新しい文と覚えた文を見分けよう。",
  ],
  unlocks: "自分で訓練したミニGPT",
  unlockLabel: "卒業プロジェクトの1段階を終えました",
  quiz: [
    {
      q: "訓練の1歩で起きることの順番は？",
      choices: ["つまみを回す → 予測 → 損失 → 誤差逆伝播", "誤差逆伝播 → 予測 → つまみを回す → 損失", "予測 → 損失 → 誤差逆伝播 → つまみを回す"],
      answer: 2,
      explain: "まず当ててみて（予測）、まちがえた分を測り（損失）、責任を分け（誤差逆伝播）、つまみを回します（第66章）。",
      review: "s4",
    },
    {
      q: "訓練を始めるとき、損失が約5.85なのはなぜでしょう？",
      choices: ["345種類からでたらめに選ぶのと同じだから", "モデルがもうことわざを少し知っているから", "データが5.85KBだから"],
      answer: 0,
      explain: "はじめはどのトークンにも同じ確率をあたえます。345種類から1つを当てるときの驚きが約5.85です。",
      review: "s3",
    },
    {
      q: "損失がとても低くなるまで訓練すると、どうなるでしょう？",
      choices: ["モデルがこわれる", "データを丸ごと覚えた文が増える", "トークンの種類が減る"],
      answer: 1,
      explain: "小さなデータを長く見ると、覚えてしまいます。過去問だけ覚えた生徒のように（第25章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第94章 ブラウザで訓練する",
    model: "ミニGPT",
    knobs: "つまみ24,793個",
    random: "はじめはでたらめ",
    first: "はじめのモデルが書いた文",
    input: "入力",
    target: "正解",
    newline: "改行",
    space: "空白",
    window: "24トークン × 8つ",
    eachNext: "位置ごとに次のトークンを当てる",
    loss: "損失",
    lossStart: "5.85",
    guess: "でたらめに選ぶ",
    flat: "どのトークンも同じ 1/345",
    oneStep: "訓練の 1歩",
    axisSteps: "歩",
    below2: "275歩：2を下回る",
    below1: "500歩：1を下回る",
    end: "1,500歩：0.73",
    diary: "生成日記",
    copied: "覚えた文",
    inData: "データにそのままある",
    fresh: "新しい文",
    notInData: "データにない言葉",
    stat: "80行のうち65行は覚えた文",
    exam: "過去問だけ覚えた生徒（第25章）",
    start: "訓練スタート",
    noServer: "サーバーなし、スマホの中で！",
    realRun: "本物の訓練記録",
  },
};
