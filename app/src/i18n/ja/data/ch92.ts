import type { ChapterSpec } from "../../../data/types";

/** GPT-3 (canonical facts) next to the Part 11 mini GPT with the ことわざ data (computed from minigpt.ts / bpe.ts on the ja corpus). */
export const COMPARE = [
  { k: "layers", gpt3: "96", mini: "1" },
  { k: "width", gpt3: "12,288", mini: "32" },
  { k: "heads", gpt3: "96", mini: "1" },
  { k: "context", gpt3: "2,048", mini: "24" },
  { k: "vocab", gpt3: "50,257", mini: "345" },
];

export const PROJECT = [
  { n: "①", name: "データを選ぶ", ch: "第92章" },
  { n: "②", name: "トークナイザーを作る", ch: "第93章" },
  { n: "③", name: "訓練する", ch: "第94章" },
  { n: "④", name: "文章を書かせる", ch: "第95章" },
];

/** Real outputs of the offline ja checkpoints (temperature 0.8 / 1.0), none of them a line of the data. */
export const STYLES = [
  { name: "ことわざ", seen: "石の上にも三年", wrote: "石の上には上がある", color: "yellow" as const },
  { name: "わらべうた", seen: "雲さん 雲さん ふわふわ 流れてく", wrote: "雲さん 雲さん どんぐり一つ 分けてよ", color: "sky" as const },
  { name: "教科書の文", seen: "動物はえさを食べて力を得る。", wrote: "魚はえさを食べて力を得る。", color: "mint" as const },
];

/** Real next-token probabilities of the ことわざ checkpoint after "石" (temperature 1). */
export const NEXT = [
  { w: "の", p: 56.7 },
  { w: "二", p: 31.8 },
  { w: "橋", p: 7.9 },
];

export const ch92: ChapterSpec = {
  id: 92,
  part: 11,
  title: "ミニGPTを設計する",
  core: false,
  hook: "ChatGPTをうんと小さくしたら、自分の手で作れるでしょうか？",
  steps: [
    { id: "s1", sec: 10, narration: "いよいよ卒業プロジェクトです。これまで学んだ部品で本物の小さなGPTを作り、自分のスマホで訓練します。" },
    { id: "s2", sec: 9, narration: "手順は4段階。データを選び、トークナイザーを作り、訓練して、最後に文章を書かせます。" },
    { id: "s3", sec: 10.5, narration: "設計図はGPT-3と同じです（第5章）。ただしブロックは96層ではなく1層、トークンのベクトルは12,288マスではなく32マスです。" },
    { id: "s4", sec: 11, narration: "ヘッドも1つ、一度に読むのは24トークン。トークンの種類は345。ことわざに出てくる文字に、改行と空白を足した数です。" },
    { id: "s5", sec: 10.5, narration: "つまみ（パラメータ）を数えると、GPT-3は1,750億個、ミニGPTは24,793個。約700万分の1です。" },
    { id: "s6", sec: 10, narration: "それでも、やることは同じ。文章を読んで、次のかけらの確率を出します。前もって訓練したミニGPTの本当の答えです。" },
    { id: "s7", sec: 10.5, narration: "ことわざを読ませればことわざを、わらべうたなら歌詞を、教科書の文なら説明文を書きます。モデルは読んだ文章に似てきます。" },
    { id: "s8", sec: 11, narration: "データは約3KB、トークン約1,100個。GPT-3が読んだ3,000億トークンにくらべればちりのようですが、十分です。選んでみましょう！" },
  ],
  playgroundTitle: "データを選ぶ",
  playgroundIntro: "ミニGPTに読ませる文章を選びましょう。ここで選んだデータで、第93〜95章でトークナイザーを作り、訓練して、文章を書かせます。",
  summary: [
    "ミニGPTもGPT-3と同じ設計図。層、ベクトル、ヘッドの数だけが小さい。",
    "つまみは24,793個。GPT-3の約700万分の1。",
    "モデルは読んだ文章に似てくる。だからデータ選びが最初の一歩。",
  ],
  unlocks: "自分のデータセット",
  unlockLabel: "卒業プロジェクトの1段階を終えました",
  quiz: [
    {
      q: "ミニGPTとGPT-3の設計図をくらべると？",
      choices: ["部品の組み合わせは同じで、数の大きさだけがちがう", "まったくちがう構造", "ミニGPTにはアテンションがない"],
      answer: 0,
      explain: "トークナイザーからソフトマックスまで、部品は同じです。層の数、ベクトルのマス数、ヘッドの数がずっと小さいだけです。",
      review: "s3",
    },
    {
      q: "ミニGPTのつまみ（パラメータ）は何個くらいでしょう？",
      choices: ["1,750億個", "約2万5千個", "96個"],
      answer: 1,
      explain: "ことわざのデータでは24,793個です。GPT-3（1,750億個）の約700万分の1です。",
      review: "s5",
    },
    {
      q: "わらべうただけを読ませて訓練したモデルは、どんな文章を書くでしょう？",
      choices: ["教科書のような説明文", "何も書けない", "歌詞のような文章"],
      answer: 2,
      explain: "モデルは読んだ文章に似てきます。くり返しの多いわらべうたを読めば、歌詞のように書きます。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第92章 ミニGPTを設計する",
    title: "卒業プロジェクト",
    tok: "トークナイザー",
    emb: "埋め込み",
    pos: "位置情報",
    att: "アテンション",
    ffn: "フィードフォワード",
    out: "出力 + ソフトマックス",
    loop: "選んでつなげる",
    mine: "自分だけのミニGPT",
    real: "本当に訓練します！",
    ch96: "⑤ 卒業式 第96章",
    gpt3: "GPT-3",
    mini: "ミニGPT",
    layers: "ブロックの層の数",
    width: "ベクトルのマス数",
    heads: "アテンションのヘッド",
    context: "一度に読むトークン",
    vocab: "トークンの種類",
    same: "部品は同じ、数だけ小さく",
    knobs: "つまみ（パラメータ）の数",
    gpt3Knobs: "175,000,000,000",
    miniKnobs: "24,793",
    ratio: "約700万分の1",
    prompt: "石",
    next: "次のかけらの確率",
    realOut: "前もって訓練したミニGPTの本当の答え",
    seen: "読んだ文",
    wrote: "書いた文",
    alike: "読んだ文章に似てくる",
    noCopy: "3つともデータにない新しい文",
    size: "約3KB・トークン約1,100個",
    gptData: "GPT-3：3,000億トークン",
    dust: "塵も積もれば山となる？",
    pick: "選んでみよう",
    lines120: "131行",
    lines69: "72行",
    lines82: "82行",
    loss: "損失",
    vocabNote: "文字・改行・空白",
  },
};
