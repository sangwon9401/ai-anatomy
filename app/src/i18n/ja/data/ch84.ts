import type { ChapterSpec, Highlighter } from "../../../data/types";

// An invented book (説明のために作った題名; it does not exist). The model's answer about it is built one chunk at a time from
// illustrative next-chunk probabilities; every chunk is plausible, the whole is false.
export const BOOK = "『ウサギ星の最後の図書館』";
export const QUESTION84 = `${BOOK}ってどんな本？`;

export type Opt = { w: string; p: number; c: Highlighter | null; next?: string };
export const HONEST = "そんな本は";
export const END84 = "〈終わり〉";

/** chunk → options for the next chunk (illustrative, each list adds up to 1) */
export const TREE: Record<string, Opt[]> = {
  start: [
    { w: "2018年に", p: 0.4, c: "yellow", next: "year" },
    { w: "2015年に", p: 0.32, c: "orange", next: "year" },
    { w: "2020年に", p: 0.24, c: "violet", next: "year" },
    { w: HONEST, p: 0.04, c: "mint", next: "honest" },
  ],
  year: [
    { w: "出た", p: 0.66, c: "yellow", next: "came" },
    { w: "出版された", p: 0.34, c: "orange", next: "came" },
  ],
  came: [
    { w: "童話で、", p: 0.54, c: "yellow", next: "kind" },
    { w: "小説で、", p: 0.32, c: "orange", next: "kind" },
    { w: "絵本で、", p: 0.14, c: "violet", next: "kind" },
  ],
  kind: [
    { w: "文学賞を", p: 0.46, c: "yellow", next: "got" },
    { w: "多くの人に", p: 0.4, c: "orange", next: "loved" },
    { w: "話題を", p: 0.14, c: "violet", next: "drew" },
  ],
  got: [{ w: "とりました。", p: 1, c: "yellow", next: "end" }],
  loved: [{ w: "愛されました。", p: 1, c: "yellow", next: "end" }],
  drew: [{ w: "呼びました。", p: 1, c: "yellow", next: "end" }],
  honest: [
    { w: "見つかりません。", p: 0.8, c: "mint", next: "end" },
    { w: "聞いたことがありません。", p: 0.2, c: "mint", next: "end" },
  ],
};

// the path the scene follows (always the top option)
export const SCENE_ROUNDS = ["start", "year", "came", "kind"] as const;
export const ANSWER84 = ["2018年に", "出た", "童話で、", "文学賞を", "とりました。"];

export const RISKY = [
  { w: "めずらしい事実", ex: "小さな町の歴史", c: "yellow" as const },
  { w: "数字・日付", ex: "年、統計、点数", c: "sky" as const },
  { w: "人の名前", ex: "だれが言った・した", c: "mint" as const },
  { w: "出典・引用", ex: "本の題名、論文、リンク", c: "pink" as const },
];

export const HELPS = [
  { n: "①", w: "出典を自分で確かめる", ex: "検索、図書館、先生に聞く" },
  { n: "②", w: "AIが挙げた出典も本物か確かめる", ex: "出典まで作ってしまうことがあります" },
  { n: "③", w: "信頼できる資料をいっしょに渡す", ex: "調べてから答える（第88章）" },
];

export const ch84: ChapterSpec = {
  id: 84,
  part: 9,
  title: "もっともらしいウソ",
  core: true,
  hook: "AIが自信たっぷりに言うことは、全部本当なのでしょうか？",
  steps: [
    { id: "s1", sec: 10.5, narration: "ない本について聞いたのに、出版年や受賞歴まですらすら答えました。このようなもっともらしいウソを、ハルシネーション（幻覚）といいます。" },
    { id: "s2", sec: 10.5, narration: "1かけらずつ見直します。本の紹介はふつう出版年から始まるので「2018年に」がもっともらしく、「そんな本は」は4%だけです。" },
    { id: "s3", sec: 10.5, narration: "次のかけらも同じです。出た、童話で、文学賞を。毎回もっともらしい言葉を選んだだけなのに、つなげるとウソの事実になりました。" },
    { id: "s4", sec: 9, narration: "モデルが学んだのは「次に来そうな言葉」です（第1章）。その言葉が本当かどうかを確かめるしくみは、別にありません。" },
    { id: "s5", sec: 10, narration: "しかも、一度書いた言葉は消せません（第2章）。「2018年に」と書いた瞬間から、後ろはそれに合わせてもっともらしく続きます。" },
    { id: "s6", sec: 10.5, narration: "ハルシネーションは、めずらしい事実、数字や日付、人の名前、出典で特に起きやすいです。本物そっくりのにせの出典を作ることもあります。" },
    { id: "s7", sec: 9.5, narration: "だから大事なことは、出典を自分で確かめましょう。信頼できる資料をいっしょに渡すと、作り話はずっと減ります（第88章）。" },
    { id: "s8", sec: 10, narration: "温度を下げたら？へんてこな選び方は減りますが、1位の答えが作り話ならそのままです。もっともらしさと事実は別ものです。" },
  ],
  playgroundTitle: "ハルシネーション実験室",
  playgroundIntro: "モデルになって、存在しない本を紹介する答えを1かけらずつ選んでみましょう。そのあと「100回答えさせる」で、モデルがどれくらい作り話をするか数えます。",
  summary: [
    "ハルシネーション：本当ではない内容を、もっともらしく作ってしまうこと。",
    "モデルは「次に来そうな言葉」を選ぶだけで、その言葉が本当かどうかは確かめない。",
    "数字・名前・出典は自分で確かめ、資料をいっしょに渡すと作り話が減る（第88章）。",
  ],
  unlocks: "ハルシネーションを見抜く",
  unlockLabel: "推論の道具をひとつ手に入れました",
  quiz: [
    {
      q: "AIがハルシネーションを起こすいちばんの理由は？",
      choices: ["わざと人をだまそうとしているから", "インターネットが遅いから", "次に来るもっともらしい言葉を選ぶだけで、本当かどうか確かめないから"],
      answer: 2,
      explain: "モデルは「続きそうな言葉」をうまく選ぶように学びました。事実の確認は、その目標に入っていません。",
      review: "s4",
    },
    {
      q: "温度を0まで下げると、ハルシネーションは？",
      choices: ["へんてこな選び方は減るが、1位の答えがまちがっていればそのまま出る", "完全になくなる", "必ず増える"],
      answer: 0,
      explain: "温度は確率を配り直すだけです（第81章）。いちばんもっともらしい答えがウソなら、そのウソを毎回言います。",
      review: "s8",
    },
    {
      q: "AIが教えてくれた本の題名と出典を、宿題に使うには？",
      choices: ["AIが自信たっぷりに言ったので、そのまま使う", "検索や図書館で、本当にあるか自分で確かめる", "温度を上げてもう一度聞く"],
      answer: 1,
      explain: "AIは出典まで作ってしまうことがあります。大事な内容は、必ず自分で確かめましょう。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第84章 もっともらしいウソ",
    answer1: "2018年に 出た 童話で、",
    answer2: "文学賞を とりました。",
    none: "実在しない本です！",
    madeUp: "* 説明のために作った本の題名です",
    halluc: "ハルシネーション（幻覚）",
    q: "Q.",
    example: "確率は説明用の例",
    honestNote: "← 正直な答えは4%だけ",
    chatgpt: "ChatGPT",
    markO: "○",
    markX: "×",
    plausible: "自然 ○",
    fake: "つなげたらウソの事実に！",
    learned: "学んだこと",
    learnedWhat: "次に来そうな言葉",
    notLearned: "確かめないこと",
    notWhat: "本当かどうか",
    score: "モデルの点数 = もっともらしさ",
    first: "最初のボタン",
    follow: "合わせて続ける",
    noErase: "一度書いた言葉は消せない（第2章）",
    button: "ボタンをかけちがえると最後まで…",
    risky: "特に注意！",
    helpsTitle: "こうして対処しよう",
    temp: "温度",
    low: "温度を下げても",
    same: "1位がウソなら同じ！",
    key: "もっともらしさ ≠ 事実",
  },
};
