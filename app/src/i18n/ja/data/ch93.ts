import type { ChapterSpec } from "../../../data/types";

// All numbers below come from bpe.ts run on the ja ことわざ corpus (i18n/ja/data/part11-corpus.ts).
// Japanese has no spaces, so a whole proverb is one "word" for bpe.ts and merges may cross word boundaries (は一, に水).

/** "蛙の子は蛙" in the character tokenizer: [piece, id] (the same character gets the same id) */
export const IDS: [string, number][] = [
  ["蛙", 286],
  ["の", 33],
  ["子", 123],
  ["は", 34],
  ["蛙", 286],
];

/** the start of the 345-token dictionary (after the line break and the space) */
export const VOCAB_HEAD = ["あ", "い", "う", "え", "か", "が", "き", "ぎ", "く", "け", "こ", "ご", "さ", "し"];

/** most frequent neighbouring pairs inside lines, before any merge */
export const PAIRS = [
  { a: "れ", b: "ば", n: 9 },
  { a: "か", b: "ら", n: 7 },
  { a: "っ", b: "て", n: 6 },
  { a: "に", b: "は", n: 6 },
];

/** three of the nine lines where れ+ば appears */
export const DEMO_LINES = ["塵も積もれば山となる", "三人寄れば文殊の知恵", "備えあれば憂いなし"];

/** total tokens after 0…30 merges (most frequent pair each time) */
export const TOKENS_BY_MERGE = [
  1140, 1131, 1124, 1118, 1112, 1107, 1102, 1097, 1093, 1089, 1085, 1082, 1079, 1076, 1073, 1070, 1067, 1064, 1061, 1059, 1057, 1055, 1053, 1051, 1049, 1047, 1045, 1043,
  1041, 1039, 1037,
];

/** the first 30 merged tokens, in order */
export const MERGED30 = [
  "れば", "から", "って", "には", "あり", "ある", "より", "は一", "らず", "あれば", "人の", "いて", "こと", "に水", "にも",
  "まで", "らぬ", "れる", "見て", "起き", "年の", "待て", "渡る", "立た", "明日", "三度", "笑う", "手な", "一難", "子は",
];

/** "二度あることは三度ある" after 30 merges */
export const AFTER30 = ["二", "度", "ある", "こと", "は", "三度", "ある"];

export const TRADE = [
  { merges: "0回", tokens: "1,140個", vocab: "345種類" },
  { merges: "30回", tokens: "1,037個", vocab: "375種類" },
  { merges: "60回", tokens: "980個", vocab: "405種類" },
];

export const ch93: ChapterSpec = {
  id: 93,
  part: 11,
  title: "自分のトークナイザーをつくる",
  core: false,
  hook: "自分のデータにぴったりのトークンは、どうやって決めるのでしょう？",
  steps: [
    { id: "s1", sec: 10.5, narration: "モデルは文章をそのまま読めず、トークンの番号だけを読みます（第29章）。いちばんかんたんなのは、1文字を1トークンにする方法です。" },
    { id: "s2", sec: 10, narration: "ことわざを文字で切ると、トークンは1,140個、種類は345。行の終わりの改行も1トークンです。" },
    { id: "s3", sec: 10.5, narration: "BPEは、となり合って出てくる2つのかけらを数えます（第30章）。ことわざでいちばん多いペアは「れ」と「ば」で、9回です。" },
    { id: "s4", sec: 10.5, narration: "いちばん多いペアを1つのトークンにくっつけます。種類は346に1つ増え、トークン全体は9個減って1,131個です。" },
    { id: "s5", sec: 11, narration: "これをくり返します。30回くっつけると、トークンは1,037個に。空白のない日本語では、「は一」のように言葉の境目をまたぐこともあります。" },
    { id: "s6", sec: 11, narration: "たくさんくっつけるほどいいのでしょうか？トークン数は減りますが、種類が増えて、モデルが覚える埋め込みも増えます。GPT-3は約5万種類です。" },
    { id: "s7", sec: 10.5, narration: "「やってみよう」で作ったトークナイザーを、第94章のミニGPTがそのまま使います。一度もくっつけなければ、1文字が1トークンです。" },
  ],
  playgroundTitle: "BPEくっつけボタン",
  playgroundIntro: "黄色のペアが、いまいちばん多いペアです。押してくっつけてみましょう。くっつけるたびに、トークン数と種類がどう変わるか見てみましょう。",
  summary: [
    "はじめは1文字 = 1トークン。ことわざはトークン1,140個、345種類。",
    "BPE：いちばん多いペアをくっつけると、種類は1つ増え、トークン数は減る。",
    "自分で作ったトークナイザーを第94章のモデルが使う。くっつけなければ文字単位。",
  ],
  unlocks: "自分のトークナイザー",
  unlockLabel: "卒業プロジェクトの1段階を終えました",
  quiz: [
    {
      q: "BPEは、どのペアからくっつけるでしょう？",
      choices: ["いちばんめずらしいペア", "いちばんよくとなり合って出てくるペア", "どのペアでもいい"],
      answer: 1,
      explain: "よくとなり合って出てくるペアを1つにまとめるほど、トークン数がいちばん減ります（第30章）。",
      review: "s3",
    },
    {
      q: "1回くっつけると、どうなるでしょう？",
      choices: ["トークンの種類は1つ増え、トークン全体の数は減る", "種類も数も減る", "どちらも変わらない"],
      answer: 0,
      explain: "「れば」という新しいトークンが辞書に1つ増え、「れ」+「ば」の2つが1つになります。",
      review: "s4",
    },
    {
      q: "一度もくっつけずに第94章へ進むと、モデルは？",
      choices: ["訓練できない", "GPT-3のトークナイザーを借りる", "1文字を1トークンとして使う"],
      answer: 2,
      explain: "くっつけなければ、文字単位のトークナイザーになります。それでも訓練はちゃんとできます。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第93章 自分のトークナイザーをつくる",
    reads: "モデルが読む番号",
    oneToOne: "1文字 = 1トークン",
    space: "空白もトークン",
    tokens: "トークン",
    tokensN: "1,140個",
    vocab: "トークンの種類",
    vocabN: "345種類",
    dict: "トークン辞書",
    more: "… 345種類",
    newline: "改行と空白も辞書に入っています",
    count: "となり合うペアを数える",
    times: "回",
    top: "1位！",
    merge: "くっつけ！",
    after: "くっつけ1回のあと",
    t1: "トークン 1,140 → 1,131個",
    v1: "種類 345 → 346",
    again: "30回くり返すと",
    t30: "トークン 1,037個",
    v30: "種類 375",
    merged: "新しくできたトークン",
    example: "二度あることは三度ある",
    mergesCol: "くっつけ",
    tokensCol: "トークン数",
    vocabCol: "トークンの種類",
    fewer: "減る",
    moreV: "増える",
    emb: "種類ごとに埋め込みが1行ずつ（第33章）",
    gpt3: "GPT-3：50,257種類",
    mine: "トークナイザー",
    mineSub: "第93章で自分で作った",
    model: "第94章 ミニGPT",
    zero: "0回なら 1文字 = 1トークン",
  },
};
