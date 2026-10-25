import type { ChapterSpec } from "../../../data/types";

// A made-up school's documents (星空祭 = the school's culture festival, 文化祭). 2026-11-06 and 2025-11-07 are both Fridays.
export type Doc = { id: string; title: string; text: string; c: "yellow" | "mint" | "sky" | "pink" | "orange" | "violet" };
export const DOCS: Doc[] = [
  { id: "fest", title: "2026 星空祭のお知らせ", text: "2026 星空祭（文化祭）は11月6日（金）に開かれます。クラスの出し物は午前10時から午後2時30分までです。", c: "yellow" },
  { id: "old", title: "2025 星空祭のお礼", text: "2025 星空祭（文化祭）は11月7日（金）に開かれました。たくさんのご参加、ありがとうございました。", c: "orange" },
  { id: "lunch", title: "11月の給食のお知らせ", text: "11月第2週の金曜日の給食は、カレーライスとわかめスープです。アレルギーの情報は学校のホームページにあります。", c: "mint" },
  { id: "lib", title: "図書館の利用時間", text: "図書館は平日の午前8時から午後5時まで開いています。テスト期間は午後7時まで開いています。", c: "sky" },
  { id: "pe", title: "冬の体操服のお知らせ", text: "冬の体操服は11月2日から着られます。", c: "violet" },
  { id: "club", title: "放課後プログラミング講座の募集", text: "放課後プログラミング講座の申しこみは11月3日までです。担任の先生に申しこんでください。", c: "pink" },
];

export type Question = {
  key: string;
  q: string;
  /** search words; a document's score = how many of them it contains (a simple stand-in for vector search) */
  keys: string[];
  answer?: { doc: string; text: string };
  /** what comes out when only this (misleading) document is given */
  trap?: { doc: string; text: string };
  /** what the model makes up when no documents are given (illustrative) */
  madeUp: string;
};
export const QUESTIONS: Question[] = [
  {
    key: "date",
    q: "2026 星空祭はいつですか？",
    keys: ["2026", "星空祭", "文化祭"],
    answer: { doc: "fest", text: "11月6日の金曜日です。" },
    trap: { doc: "old", text: "11月7日の金曜日です。" },
    madeUp: "10月16日の金曜日です！",
  },
  {
    key: "booth",
    q: "文化祭の日、クラスの出し物は何時から何時までですか？",
    keys: ["文化祭", "出し物", "時間"],
    answer: { doc: "fest", text: "午前10時から午後2時30分までです。" },
    madeUp: "午前9時から午後4時までです！",
  },
  {
    key: "lib",
    q: "図書館は何時まで開いていますか？",
    keys: ["図書館", "時間"],
    answer: { doc: "lib", text: "平日は午後5時まで、テスト期間は午後7時まで開いています。" },
    madeUp: "午後6時まで開いています！",
  },
  {
    key: "trip",
    q: "修学旅行はどこに行きますか？",
    keys: ["修学旅行", "行き先"],
    madeUp: "沖縄に行きます！",
  },
];

export const scoreDoc = (q: Question, d: Doc) => q.keys.filter((k) => d.title.includes(k) || d.text.includes(k));

// Scene: four documents and their (illustrative) closeness to the question vector, best first.
export const SCENE_Q = "うちの文化祭はいつ？";
export const SCENE_DOCS = [
  { title: "星空祭のお知らせ", sim: 0.86, c: "yellow" as const },
  { title: "図書館の利用時間", sim: 0.31, c: "sky" as const },
  { title: "11月の給食", sim: 0.24, c: "mint" as const },
  { title: "冬の体操服", sim: 0.12, c: "violet" as const },
];

export const ch88: ChapterSpec = {
  id: 88,
  part: 10,
  title: "調べてから答える",
  core: false,
  hook: "うちの学校の文化祭の日のように、AIが学んだことのない情報は、どうやって聞けばいいのでしょう？",
  steps: [
    { id: "s1", sec: 11.5, narration: "うちの学校の文化祭がいつか、モデルに聞いてみましょう。モデルは学習のときに見た文章しか知りません。学校のお知らせは見たことがないのです。" },
    { id: "s2", sec: 9.5, narration: "それでもモデルは次のかけらを書き続けます。もっともらしい日付を作ってしまうかも。第84章のハルシネーションです。" },
    { id: "s3", sec: 8.5, narration: "解決策はかんたん。答える前に、まず調べる！学校の文書の山から、質問に関係する文書を探します。" },
    { id: "s4", sec: 9.5, narration: "質問と文書をそれぞれ数字のベクトルに変え、質問に近い文書を選びます（第8章）。文化祭のお知らせがいちばん近いですね。" },
    { id: "s5", sec: 10.5, narration: "見つけた文書を、質問といっしょにひとまとまりの文章としてモデルに入れます。「下の文書を見て答えて」というお願いもいっしょに。" },
    { id: "s6", sec: 9, narration: "あとはモデルが、文書に書かれた日付を写すだけ。どの文書を見て答えたか、出典もつけられます。" },
    { id: "s7", sec: 10.5, narration: "この方法を検索拡張生成、略してRAGといいます。2020年に生まれた名前です。モデルを学習し直さなくても、新しい情報を使えます。" },
    { id: "s8", sec: 11.5, narration: "ただし、見つけた文書がまちがっていれば答えもまちがいます。去年のお知らせを見つければ、去年の日付で答えます。だから出典を自分で確かめます。" },
  ],
  playgroundTitle: "検索して答える",
  playgroundIntro: "質問を選んで、学校の文書を検索してみましょう。プロンプトに入れる文書を選んで、答えをもらいます。わなの文書もまじっています！",
  summary: [
    "モデルは学習のときに見た文章しか知らない。知らないことを聞くと作り話をすることがある（ハルシネーション、第84章）。",
    "RAG：質問に近い文書を検索して、プロンプトにいっしょに入れて答えさせる。",
    "出典つきの答えでも、文書がまちがっていればまちがう。出典は自分で確かめよう。",
  ],
  unlocks: "調べてから答える",
  unlockLabel: "新しい能力カードをひとつ手に入れました",
  quiz: [
    {
      q: "モデルがうちの学校の文化祭の日を知らないのは、なぜでしょう？",
      choices: ["学習のときに見た文章に、その情報がなかったから", "日付は数字だから", "質問が短すぎるから"],
      answer: 0,
      explain: "モデルは学習データにあった内容しか知りません。それでも続きは書くので、作り話をすることがあります（第84章）。",
      review: "s1",
    },
    {
      q: "RAGで「検索した文書」はどこに入るでしょう？",
      choices: ["モデルのパラメータを変えるのに使う", "質問といっしょにプロンプト（入力の文章）に入る", "答えが出たあと、最後につける"],
      answer: 1,
      explain: "見つけた文書を、質問とひとまとまりの文章にして入れます。モデルは学習し直しません。",
      review: "s5",
    },
    {
      q: "出典つきの答えなのに、出典が去年のお知らせだったら？",
      choices: ["出典があるので必ず正しい", "モデルが自分で今年の日付に直してくれる", "文書がまちがっているので答えもまちがうかもしれない。出典を確かめる"],
      answer: 2,
      explain: "モデルは入れてもらった文書を信じて答えます。見つけた文書がまちがっていれば、答えもまちがいます。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第88章 調べてから答える",
    q: "うちの文化祭はいつ？",
    model: "モデル",
    seen: "学習のときに見た文章",
    notice: "学校のお知らせ",
    noticeTitle: "2026 星空祭",
    never: "見たことがない",
    madeUp: "10月16日の金曜日です！",
    halluc: "作り話 = ハルシネーション（第84章）",
    pile: "学校の文書の山",
    search: "検索",
    closeness: "質問に近い順（第8章）",
    example: "* 説明用の例",
    promptTitle: "モデルに入る文章",
    docTag: "[文書] 2026 星空祭のお知らせ",
    docText: "2026 星空祭は11月6日（金）に開かれます。",
    ask: "下の文書を見て答えてください。",
    qLine: "質問：うちの文化祭はいつ？",
    answer: "11月6日の金曜日です。",
    date: "11月6日（金）",
    docPre: "2026 星空祭は",
    docPost: "に開かれます。",
    source: "出典：2026 星空祭のお知らせ",
    copy: "書いてあるとおりに写す",
    rag: "検索拡張生成（RAG、2020年）",
    r: "R 検索（Retrieval）",
    a: "A 拡張（Augmented）",
    g: "G 生成（Generation）",
    step1: "① 検索",
    step2: "② 貼りつけ",
    step3: "③ 答え+出典",
    same: "モデルはそのまま、情報だけ新しく！",
    oldTitle: "2025 星空祭のお礼",
    oldText: "2025 星空祭は11月7日（金）でした。",
    lastYear: "去年の文書",
    oldAnswer: "11月7日の金曜日です。",
    oldSource: "出典：2025 星空祭のお礼",
    wrongDoc: "文書がまちがえば答えもまちがう",
    checkIt: "出典を開いて自分で確かめる",
  },
};
