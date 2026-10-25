import { PRESETS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// the running sentence, cut three ways (tokens: real GPT-4o tokenizer o200k_base, see the ja part3-tokens.ts)
// ja: Japanese has no spaces, so the "by word" row uses 文節 (the phrase units students learn in 国語), which is also
// how the course spaces its running sentence: 私は 今日 学校に 行く。
export const SENT = PRESETS[0];
export const SENT_CHARS = [...SENT.text];
export const SENT_WORDS = ["私は", "今日", "学校に", "行く。"];
export const RARE = { unbelievable: PRESETS[6], slang: PRESETS[4] };

// s6: a few rows of the GPT-4o vocabulary (ids checked with tiktoken)
export const VOCAB_ROWS: [string, string][] = [
  ["0", "!"],
  ["1", '"'],
  ["2", "#"],
  ["⋮", ""],
  ["5280", "に"],
  ["⋮", ""],
  ["73048", "学校"],
  ["⋮", ""],
];

export const ch29: ChapterSpec = {
  id: 29,
  part: 3,
  title: "トークン：AIの文字の単位",
  core: true,
  hook: "ChatGPTは文章を1文字ずつ読むのでしょうか、1単語ずつ読むのでしょうか？",
  steps: [
    { id: "s1", sec: 7, narration: "ChatGPTは文章を読む前に、まず細かく切ります。このかけらをトークン、切る部品をトークナイザーといいます。" },
    { id: "s2", sec: 7.5, narration: "1文字ずつ切るとどうでしょう？ かけらが多くなりすぎるし、「く」のようなかな1文字には意味がほとんどありません。" },
    { id: "s3", sec: 8, narration: "では文節ごとなら？ ことばのまとまりは無限にあって、「ぴえん」のような新しいことばは一覧になく、読めません。" },
    { id: "s4", sec: 8.5, narration: "そこで、その中間の大きさで切ります。本物のGPT-4oのトークナイザーは、この文を7かけらに切ります。" },
    { id: "s5", sec: 8.5, narration: "かけらごとに番号があります。「学校」は73048番。モデルが実際に受け取るのは、文字ではなくこの番号の列です。" },
    { id: "s6", sec: 7.5, narration: "かけらの一覧を語彙といいます。GPT-3は約5万個、GPT-4oは約20万個のかけらを知っています。" },
    { id: "s7", sec: 8.5, narration: "めずらしいことばは、知っている小さなかけらに分けます。unbelievableは3かけら、ぴえんは4かけら。だから読めないことばはありません。" },
    { id: "s8", sec: 7.5, narration: "文章を切って番号をつけるトークナイザー。設計図の最初の部品が埋まりました。このかけらの一覧はどう作るのでしょう？" },
  ],
  playgroundTitle: "トークン顕微鏡",
  playgroundIntro: "文をえらんでみましょう。本物のGPT-4oのトークナイザーが切ったかけらを色で見せます。「番号で見る」を押すと、モデルが受け取る数が見えます。",
  summary: [
    "トークン：AIが文章を読むときのかけら。文字より大きく、ことばのまとまりより小さいことが多い。",
    "よく出てくるかたまりは1かけら、めずらしいことばは小さなかけらいくつかに分かれる。",
    "かけらごとに番号があり、モデルはこの番号の列を受け取る。かけらの一覧＝語彙。",
  ],
  unlocks: "トークナイザー",
  quiz: [
    {
      q: "トークナイザーの仕事は？",
      choices: ["文章をかけら(トークン)に切って番号をつける", "次の単語の確率を計算する", "まちがった漢字を直す"],
      answer: 0,
      explain: "文章 → かけら → 番号。設計図のいちばん最初の部品です。",
      review: "s1",
    },
    {
      q: "ことばのまとまりごとにしか切らないと、どんな問題が起きる？",
      choices: ["かけらが多くなりすぎる", "一覧にない新しいことばが読めない", "句読点が消える"],
      answer: 1,
      explain: "「ぴえん」のような新しいことばは一覧にありません。トークンなら小さなかけらに分けてでも読めます。",
      review: "s3",
    },
    {
      q: "モデルに実際に入るものは？",
      choices: ["文字の絵", "文章そのまま", "トークン番号の列"],
      answer: 2,
      explain: "「私は今日学校に行く。」は、GPT-4oにとって158341, 45396, 73048, … という7つの番号です。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第29章 トークン：AIの文字の単位",
    machine: "トークナイザー ✂",
    token: "トークン＝AIが読むかけら",
    byChar: "1文字ずつ切ると？",
    byWord: "文節ごとに切ると？",
    byToken: "トークン：その中間の大きさ",
    n13: "10かけら",
    n4: "4かけら",
    n7: "7かけら",
    tooMany: "多すぎる",
    noMeaning: "かな1文字には意味がほとんどない",
    looksOk: "よさそうだけど…",
    unknown: "一覧にない新しいことば！",
    endless: "ことばのまとまりは無限にある",
    cmp: "文字 10 · トークン 7 · 文節 4",
    source: "GPT-4oのトークナイザー (o200k_base)",
    space: "よく一緒に出る「私は」は1かけら",
    ids: "モデルが実際に受け取るもの",
    vocab: "語彙(vocabulary)＝かけらの一覧",
    rows: "約20万行",
    gpt3: "GPT-3",
    gpt4o: "GPT-4o",
    v3: "約5万",
    v4o: "約20万",
    rare: "めずらしいことばは小さなかけらに",
    bytes: "点線＝1文字がバイトのかけら2つに (第28章)",
    canRead: "だから読めないことばはない",
    bp: "設計図の最初の部品が完成！",
    empty: "空き",
    next: "次：かけらの一覧はどう作る？ (第30章)",
    q: "?",
    ku: "く",
  },
};
