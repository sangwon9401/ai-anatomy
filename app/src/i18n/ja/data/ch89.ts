import { DOCS } from "../../../data/ch88";
import type { ChapterSpec } from "../../../data/types";

// Scene numbers: 4837 × 2961 = 14,322,357. The model's guess without a calculator is made up (説明用の例).
export const MUL = { a: 4837, b: 2961, product: 4837 * 2961, guess: "14,328,557" };

export type Tool = "calc" | "search";
export type AgentEvent = { t: "think" | "answer"; text: string } | { t: "call"; tool: Tool; arg: string };
export type Task = { key: string; title: string; q: string; events: AgentEvent[]; guess: string };

/** Playground tasks. The program (the student) runs each tool call; results are computed live.
 * (ja: the class snack is たこ焼き at 450円, so the numbers are one tenth of the Korean won amounts.) */
export const TASKS: Task[] = [
  {
    key: "tteok",
    title: "たこ焼き代",
    q: "クラスの27人で、1人前450円のたこ焼きを食べます。学級費12,000円で足りるでしょうか？",
    events: [
      { t: "think", text: "まず、たこ焼き代を全部合わせる必要があります。" },
      { t: "call", tool: "calc", arg: "27 × 450" },
      { t: "think", text: "12,000円より多いですね。足りない金額を計算してみます。" },
      { t: "call", tool: "calc", arg: "12150 − 12000" },
      { t: "answer", text: "全部で12,150円なので、学級費では150円足りません。" },
    ],
    guess: "学級費で足ります！",
  },
  {
    key: "big",
    title: "大きなかけ算",
    q: "4837 × 2961はいくつですか？",
    events: [
      { t: "think", text: "大きな数のかけ算は、電卓で正確に計算します。" },
      { t: "call", tool: "calc", arg: "4837 × 2961" },
      { t: "answer", text: "4837 × 2961 = 14,322,357です。" },
    ],
    guess: "14,328,557です。",
  },
  {
    key: "booth",
    title: "文化祭の出し物の時間",
    q: "星空祭で、うちのクラスの出し物は何時間やりますか？",
    events: [
      { t: "think", text: "学校の文化祭のお知らせを調べる必要があります。" },
      { t: "call", tool: "search", arg: "星空祭 出し物 時間" },
      { t: "think", text: "午前10時から午後2時30分までだそうです。午後2時30分は14.5時なので、引いてみます。" },
      { t: "call", tool: "calc", arg: "14.5 − 10" },
      { t: "answer", text: "4.5時間、つまり4時間30分です。（出典：2026 星空祭のお知らせ）" },
    ],
    guess: "4時間です。",
  },
];

/** A tiny, safe calculator for "a op b" (no eval). */
export function calc(expr: string): number | null {
  const m = expr.replace(/,/g, "").match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-−×x*÷/])\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  switch (m[2]) {
    case "+":
      return a + b;
    case "-":
    case "−":
      return a - b;
    case "×":
    case "x":
    case "*":
      return a * b;
    default:
      return b === 0 ? null : a / b;
  }
}

/** A tiny search over the school documents of ch88: the document sharing the most query words wins. */
export function search(query: string) {
  const words = query.split(/\s+/).filter(Boolean);
  let best: { title: string; text: string; hits: number } | null = null;
  for (const d of DOCS) {
    const hits = words.filter((w) => d.title.includes(w) || d.text.includes(w)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { title: d.title, text: d.text, hits };
  }
  return best;
}

export const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString("ja-JP") : String(n));

// scene strips (pieces of the running text)
export const STRIP_CALC = { q: "4837 × 2961は？", call: "電卓(4837 × 2961)", result: "→ 14,322,357", answer: ["答えは", "14,322,357です。"] };
export const STRIP_SEARCH = { q: "星空祭はいつ？", call: "検索(星空祭 日付)", result: "→ 11月6日（金）", answer: ["11月6日の", "金曜日です。"] };

export const ch89: ChapterSpec = {
  id: 89,
  part: 10,
  title: "手足を持ったAI",
  core: false,
  hook: "文章を書くだけのAIが、どうやって電卓をたたいたり、検索したりできるのでしょう？",
  steps: [
    { id: "s1", sec: 11.5, narration: "モデルは文章を書くことしかできません。4837 × 2961のような大きなかけ算はまちがえやすく、いまの外の天気のような情報もわかりません。" },
    { id: "s2", sec: 11, narration: "そこで約束を決めます。モデルが「電卓(4837 × 2961)」のように決まった形の文章を書いたら、道具を呼んでほしいという意味です。" },
    { id: "s3", sec: 10.5, narration: "モデルを包むプログラムがこの文章に気づいて、続きを書くのを止めます。そして本物の電卓を動かして、14,322,357を得ます。" },
    { id: "s4", sec: 11, narration: "結果を文章の最後につなげて、もう一度モデルに入れます。モデルは結果を読んで答えを続けます。第2章の「つなげて、もう一度」と同じです。" },
    { id: "s5", sec: 11.5, narration: "検索も同じやり方です。「検索(…)」と書けば、プログラムが探して結果をつなげてくれます。第88章のRAGを、モデルが自分で呼ぶわけです。" },
    { id: "s6", sec: 9.5, narration: "考えて、道具を呼んで、結果を見て、また考える。このループを何回も回って仕事をやりとげるAIを、エージェントといいます。" },
    { id: "s7", sec: 10, narration: "手足ができたぶん、注意も必要です。メール送信や支払いのように取り消しにくいことは、人が確かめてから行うようにつくります。" },
  ],
  playgroundTitle: "エージェントを1ステップずつ",
  playgroundIntro: "自分がモデルを包むプログラムになってみましょう。モデルが道具を呼んだら、合う道具を動かして結果をつなげます。",
  summary: [
    "モデルが決まった形の文章（道具の呼び出し）を書くと、プログラムが止まってその道具を動かす。",
    "道具の結果を文章の最後につなげてもう一度入れると、モデルが読んで続きを書く。",
    "考える → 道具 → 結果のループを何回も回るAIがエージェント。大事なことは人が確かめる。",
  ],
  unlocks: "道具を使う",
  unlockLabel: "新しい能力カードをひとつ手に入れました",
  quiz: [
    {
      q: "モデルが「電卓(27 × 450)」と書いたら、実際の計算はだれがするでしょう？",
      choices: ["モデルが頭の中で", "モデルを包むプログラムが本物の電卓で", "使う人が自分で"],
      answer: 1,
      explain: "モデルは文章を書くだけです。約束した形の文章にプログラムが気づいて、道具を動かします。",
      review: "s3",
    },
    {
      q: "道具の結果は、どうやってモデルに伝わるでしょう？",
      choices: ["文章の最後につなげて、もう一度入力に入れる", "モデルのパラメータを変える", "モデルには伝えず、使う人にだけ見せる"],
      answer: 0,
      explain: "結果も文章のかけらとしてつなげます。第2章の「つなげて、もう一度」と同じです。",
      review: "s4",
    },
    {
      q: "エージェントに支払いをまかせるとき、合っている設計は？",
      choices: ["速くするため、全部ひとりでやらせる", "支払いを完全にできなくすることしかできない", "取り消しにくいことは、人が確かめてからやらせる"],
      answer: 2,
      explain: "道具を持てば、まちがいの影響も大きくなります。大事なことは、最後に人が確かめます。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第89章 手足を持ったAI",
    q1: "4837 × 2961 = ?",
    a1: "14,328,557です。",
    q2: "いま外の天気は？",
    a2: "わかりません…",
    hard: "まちがえやすい",
    blind: "外が見えない",
    textOnly: "モデル = 文章を書くだけの機械",
    example: "* 説明用の例",
    model: "モデル",
    promise: "決まった形 = 道具を呼んでほしいサイン",
    program: "プログラム",
    stop: "ストップ！",
    calc: "電卓",
    real: "本物の計算",
    again: "つなげて、もう一度（第2章）",
    searchTool: "検索",
    rag: "第88章のRAGを、モデルが自分で呼ぶ",
    agent: "エージェント（agent）",
    think: "考える",
    callTool: "道具を呼ぶ",
    see: "結果を見る",
    done: "答えへ！",
    loops: "ループを何回も！",
    mail: "メールを送る",
    pay: "支払いをする",
    ok: "すぐ使ってOK",
    human: "人が確かめてから",
    careful: "取り消しにくいことは、人が確認！",
    found: "2026 星空祭",
    foundText: "11月6日（金）に開催",
  },
};
