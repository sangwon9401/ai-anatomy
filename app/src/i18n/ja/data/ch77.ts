import type { ChapterSpec } from "../../../data/types";

// Scene: a three-bubble chat, the hidden system prompt, and the answer the model writes next.
export type Turn = { role: "user" | "bot"; words: string[] };
export const SYSTEM = ["あなたは", "親切な", "アシスタントです。"];
export const TURNS: Turn[] = [
  { role: "user", words: ["やあ！", "宿題を", "手伝って！"] },
  { role: "bot", words: ["もちろん！", "何の", "宿題？"] },
  { role: "user", words: ["光合成って", "何？"] },
];
export const REPLY = ["光合成は", "植物が", "日光で", "養分を", "つくる", "ことです。"];
// next-piece candidates at the open assistant slot (illustrative)
export const NEXT = [
  { w: "光合成は", p: 0.61 },
  { w: "植物が", p: 0.22 },
  { w: "いい", p: 0.09 },
  { w: "その他", p: 0.08 },
];

// ChatML-style example ("たとえばこんな形"): [marker, text] per line
export const CHATML: [string, string][] = [
  ["<|im_start|>system", ""],
  ["", "あなたは親切なアシスタントです。"],
  ["<|im_start|>user", ""],
  ["", "やあ！ 宿題を手伝って！"],
  ["<|im_start|>assistant", ""],
  ["", "もちろん！ 何の宿題？"],
  ["<|im_start|>user", ""],
  ["", "光合成って何？"],
  ["<|im_start|>assistant", ""],
];
export const IM_END = "<|im_end|>";

/** Playground: system prompts × user messages → illustrative replies */
export const SYSTEMS = [
  { key: "kind", name: "親切なアシスタント", text: "あなたは親切なアシスタントです。高校生にわかるように説明してください。" },
  { key: "short", name: "一文アシスタント", text: "あなたは一文だけで答えるアシスタントです。" },
  { key: "eng", name: "英語の先生", text: "あなたは英語の先生です。答えたあと、英語の表現を1つ教えてください。" },
];
export const MESSAGES = [
  {
    text: "光合成って何？",
    reply: {
      kind: "光合成は、植物が日光を受けて、水と二酸化炭素から養分をつくることです。このとき酸素が出ます。",
      short: "植物が日光で養分をつくることです。",
      eng: "植物が日光で養分をつくることです。英語ではphotosynthesisと言います。",
    } as Record<string, string>,
    noMarker: "それと、呼吸とは何がちがうの？",
  },
  {
    text: "週末は何をしたらいいかな？",
    reply: {
      kind: "天気がよければ友だちと散歩やサイクリング、雨なら見たかった映画を見るのはどうですか？",
      short: "近くの公園へ散歩に行ってみましょう。",
      eng: "公園の散歩がおすすめです。英語で「散歩する」はtake a walkです。",
    } as Record<string, string>,
    noMarker: "友だちと行けそうな場所も教えて。",
  },
  {
    text: "ありがとう！",
    reply: {
      kind: "どういたしまして！ また気になることがあったら、いつでも聞いてくださいね。",
      short: "どういたしまして。",
      eng: "どういたしまして！ 英語ではYou're welcomeと言います。",
    } as Record<string, string>,
    noMarker: "おかげで宿題が終わったよ！",
  },
];

export const ch77: ChapterSpec = {
  id: 77,
  part: 8,
  title: "会話は実は長い文書",
  core: false,
  hook: "ChatGPTは、自分が言ったことと私が言ったことを、どうやって見分けているのでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "チャット画面では吹き出しが行き来します。私が聞いて、ChatGPTが答えて、私がまた聞きます。" },
    { id: "s2", sec: 7, narration: "でもモデルに入るときは、吹き出しはありません。会話全体がつなげられて、1つの長い文章になります。" },
    { id: "s3", sec: 8, narration: "だれの言葉かわかるように、特別な目印のトークンをはさみます。「ここからユーザー」「ここからアシスタント」のような目印です。" },
    { id: "s4", sec: 9, narration: "いちばん前には、ユーザーには見えないシステムプロンプト（system prompt）がつきます。モデルが守る役割と話し方を書いておくのです。" },
    { id: "s5", sec: 7, narration: "たとえばこんな形です。目印の見た目は会社やモデルごとにちがいますが、考え方は同じです。" },
    { id: "s6", sec: 8, narration: "文章の最後には「アシスタントの番」の目印だけを置いて、空けておきます。するとモデルは第1章のように次のかけらを予測して続けるだけです。" },
    { id: "s7", sec: 8, narration: "書き終えると終わりの目印を出して止まります（第2章）。第73章のお手本もこの形で学ぶので、この場所では答えが出てきます。" },
    { id: "s8", sec: 7, narration: "会話が長くなるほど、この文書も長くなります。モデルは毎回、前の会話を全部読み直します。第83章でまた見ます。" },
  ],
  playgroundTitle: "モデルが見ている文章",
  playgroundIntro: "システムプロンプトを選んで、メッセージを送ってみましょう。チャット画面と「モデルが見ている文章」を見くらべて、吹き出しがどう1つの文章になるか確かめます。",
  summary: [
    "会話は、目印のトークンで区切った1つの長い文書としてモデルに入る。",
    "いちばん前のシステムプロンプトは、ユーザーには見えない指示文。",
    "最後の「アシスタントの番」の場所で、モデルは次のかけらを書き続けるだけ。",
  ],
  unlocks: "チャットテンプレート",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "モデルの中に入るとき、会話はどんな形？",
      choices: ["吹き出しのまま", "目印のトークンで区切った1つの長い文章", "最後の質問1行だけ"],
      answer: 1,
      explain: "吹き出しは画面の上にしかありません。モデルは目印のトークンがはさまった長い文章を1つ読みます。",
      review: "s3",
    },
    {
      q: "システムプロンプトの説明として正しいのは？",
      choices: ["モデルが答えを書き終えたあとにつく", "ユーザーが毎回自分で入力する", "いちばん前について、モデルの役割と話し方を決める"],
      answer: 2,
      explain: "ユーザーには見えませんが、文書のいちばん前についていて、モデルが続きを書くときに影響します。",
      review: "s4",
    },
    {
      q: "文章の最後に「アシスタントの番」の目印を入れ忘れると、どうなりうる？",
      choices: ["モデルがユーザーの言葉の続きを書いてしまうかもしれない", "モデルがもっと正確に答える", "何も変わらない"],
      answer: 0,
      explain: "モデルはそれらしく続きを書くだけなので、目印がないとユーザーの文を書き続けることがあります（第72章）。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第77章 会話は実は長い文書",
    me: "私",
    bot: "ChatGPT",
    who: "だれの言葉？",
    oneDoc: "1つの長い文章",
    user: "ユーザー",
    assistant: "アシスタント",
    system: "システム",
    end: "終わり",
    markers: "目印",
    markerList: "= ユーザー / アシスタント / 終わり",
    hidden: "ユーザーには見えない",
    sysPrompt: "システムプロンプト",
    shape: "たとえばこんな形",
    chatml: "（ChatML形式。目印の形は会社・モデルごとにちがう）",
    empty: "空けておいた場所",
    nextPiece: "次のかけら？",
    same1: "第1章のかけら当て",
    example: "説明用の例",
    stop: "終わりの目印が出たら止まる（第2章）",
    sft: "第73章のお手本もこの形",
    grows: "会話が長いほど文書も長い",
    reread: "毎回読み直す",
    turn: "番目の会話",
    ch83: "第83章",
  },
};
