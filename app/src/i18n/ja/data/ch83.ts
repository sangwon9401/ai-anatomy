import type { ChapterSpec } from "../../../data/types";

export type Msg = { me: boolean; text: string };

// The chat in the scene. In the picture the window holds five speech bubbles (illustrative; real windows count tokens).
export const CHAT: Msg[] = [
  { me: true, text: "やあ！私はゆいだよ。" },
  { me: false, text: "はじめまして！何をお手伝いしましょう？" },
  { me: true, text: "週末に見る映画をおすすめして。" },
  { me: false, text: "家族で見るならアニメはどうですか？" },
  { me: true, text: "ポップコーンは何味がおいしい？" },
  { me: false, text: "キャラメル味が人気ですよ。" },
  { me: true, text: "私の名前、何だっけ？" },
];
export const GUESS = "えっと…あやかさん？";
export const WINDOW_SLOTS = 5;

export const GPT3_CTX = 2048;
export const GPT3_CELLS = GPT3_CTX * GPT3_CTX; // 4,194,304 ≈ 約419万

// s6–s7: generating after "私は 今日 学校に" (the greedy loop from ch80)
export const KV_TOKENS = ["私は", "今日", "学校に", "行く", "そして", "友と"];
export const KV_PROMPT = 3;
export const KV_ROUNDS = 4; // rows: 3, 4, 5, 6 tokens
export const noCache = (m: number, n: number) => n * m + (n * (n - 1)) / 2; // 3+4+5+6 = 18
export const withCache = (m: number, n: number) => m + (n - 1); // 3+1+1+1 = 6

// playground: extra turns the student can add (user message + canned reply)
export const TURNS: { label: string; me: string; ai: string }[] = [
  { label: "映画", me: "週末に見る映画をおすすめして。", ai: "家族で見るならアニメはどうですか？" },
  { label: "ポップコーン", me: "ポップコーンは何味がおいしい？", ai: "キャラメル味が人気ですよ。" },
  { label: "宿題", me: "数学の宿題を手伝って。", ai: "いいですよ。どんな問題ですか？" },
  { label: "遠足", me: "明日の遠足、行けるかな？", ai: "まず天気予報を確かめてみましょう。" },
  { label: "音楽", me: "元気が出る曲を選んで。", ai: "運動中に聞きやすい曲を探してみますね。" },
];

export const ch83: ChapterSpec = {
  id: 83,
  part: 9,
  title: "AIの記憶の限界",
  core: false,
  hook: "ChatGPTと長く話していると、最初に言ったことを忘れてしまうことがあります。なぜでしょう？",
  steps: [
    { id: "s1", sec: 9, narration: "第77章で見たように、会話はモデルにとってひとつの長い文章です。でも、一度に読める長さには限りがあります。" },
    { id: "s2", sec: 11, narration: "この限界をコンテキストウィンドウ（文脈の窓）といいます。GPT-3は2,048トークンまででした。窓の中の文章だけが予測に使われます。" },
    { id: "s3", sec: 8, narration: "会話が長くなると、新しい言葉が入るたびに、いちばん古い言葉が窓の外へ押し出されます。" },
    { id: "s4", sec: 11, narration: "ここで名前を聞くと？名前は窓の外なので、モデルには見えません。わからないと答えるか、名前を作ってしまうこともあります（第84章）。" },
    { id: "s5", sec: 10, narration: "窓をどこまでも広げるのは大変です。アテンションはかけらのペアごとにスコアをつけるので（第47章）、長さが2倍なら表は4倍です。" },
    { id: "s6", sec: 11, narration: "答えを書くときは、かけらを1つ作るたびに、前のかけら全部のKeyとValueが必要です（第46章）。毎回計算し直すのはむだですね。" },
    { id: "s7", sec: 11, narration: "KVキャッシュは、計算ずみのKey・Valueのメモを使い回す方法です。前のかけらは後ろを見ないので（第51章）、値が変わりません。" },
    { id: "s8", sec: 9, narration: "ただし、メモは会話が長いほどたまり、メモリを使います。長い会話では、大事なことをもう一度伝えるとよいでしょう。" },
  ],
  playgroundTitle: "記憶の窓シミュレーター",
  playgroundIntro: "会話を続けてから「私の名前、何だっけ？」を押し、窓の大きさも変えてみましょう。下では、KVキャッシュが節約する計算を数えます。",
  summary: [
    "コンテキストウィンドウ（context window）：モデルが一度に見られるトークン数。GPT-3は2,048トークン。",
    "窓をこえると古い言葉から押し出され、モデルはその内容を見られない。",
    "KVキャッシュ：計算ずみのKey・Valueをメモしておいて使い回し、答えを速く作る。",
  ],
  unlocks: "コンテキストウィンドウ・KVキャッシュ",
  unlockLabel: "推論の道具をひとつ手に入れました",
  quiz: [
    {
      q: "会話がコンテキストウィンドウより長くなると、どうなるでしょう？",
      choices: ["モデルが会話全体を要約して覚える", "いちばん古い部分から窓の外へ押し出され、見えなくなる", "会話が自動的に終わる"],
      answer: 1,
      explain: "窓の中の文章しか見られません。押し出された前の部分は、モデルにとってないのと同じです。",
      review: "s3",
    },
    {
      q: "かけらの数が2倍になると、アテンションのスコア表のマスの数は？",
      choices: ["4倍", "2倍", "そのまま"],
      answer: 0,
      explain: "スコア表は縦も横もかけらの数だけあるので、2倍 × 2倍 = 4倍になります。",
      review: "s5",
    },
    {
      q: "KVキャッシュが取り出して使い回すものは？",
      choices: ["ユーザーが前にした質問", "インターネットの検索結果", "前のかけらの、計算ずみのKeyとValue"],
      answer: 2,
      explain: "前のかけらのKey・Valueは、後ろにかけらがついても変わらないので、メモしておいて使い回せます。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第83章 AIの記憶の限界",
    longText: "会話全体 = ひとつの長い文章（第77章）",
    window: "コンテキストウィンドウ",
    gpt3: "GPT-3：2,048トークン",
    toy: "この図では吹き出し5つ（説明用）",
    out: "窓の外 = 見えない",
    here: "ここだよ…",
    mayMake: "作り話かも！（第84章）",
    me: "私",
    ai: "AI",
    t4: "4かけら",
    t8: "8かけら",
    c16: "16マス",
    c64: "64マス",
    x4: "長さ2倍 → マスは4倍",
    big: "2,048かけら → 約419万マス",
    every: "層ごとに、ヘッドごとに！",
    round: "回目",
    calc: "新しく計算",
    memo: "メモから取り出す",
    noCacheSum: "キャッシュなし：3 + 4 + 5 + 6 = 18回",
    cacheSum: "KVキャッシュ：3 + 1 + 1 + 1 = 6回",
    kv: "Key・Valueの計算",
    why: "前のかけらは後ろを見ない（第51章）",
    cacheName: "KVキャッシュ＝メモ帳",
    stack: "メモがどんどん増える",
    full: "メモリが満杯！",
    tipTitle: "長い会話のコツ",
    tip1: "大事なことは言い直す",
    tip2: "話題ごとに新しい会話",
    tokens: "トークン",
  },
};
