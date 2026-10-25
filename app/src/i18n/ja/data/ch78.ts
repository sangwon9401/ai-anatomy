import type { ChapterSpec } from "../../../data/types";

/**
 * Time each service took to reach 1 million users. These figures are widely quoted (e.g. in a 2023 Statista chart)
 * but rough: each company counted "users" differently. They are labelled 広く引用される推定値 wherever they appear.
 */
export type Service = { name: string; days: number; label: string };
export const SERVICES: Service[] = [
  { name: "Netflix", days: 1278, label: "約3.5年" },
  { name: "Twitter", days: 730, label: "約2年" },
  { name: "Facebook", days: 304, label: "約10か月" },
  { name: "Instagram", days: 76, label: "約2.5か月" },
  { name: "ChatGPT", days: 5, label: "5日" },
];

export const RECIPE = [
  { name: "GPT-3.5系列のモデル", sub: "事前学習（Part 7）", color: "sky" as const },
  { name: "+ お手本の答えをまねる", sub: "73章", color: "violet" as const },
  { name: "+ 人のほめ言葉", sub: "74〜76章", color: "pink" as const },
];

export const ch78: ChapterSpec = {
  id: 78,
  part: 8,
  title: "2022年11月30日",
  core: false,
  hook: "ChatGPTは、どうやってたった5日で100万人を集めたのでしょう？",
  steps: [
    { id: "s1", sec: 8, narration: "2022年11月30日、OpenAIがChatGPTを公開しました。だれでも無料で使える、研究用のプレビュー版でした。" },
    { id: "s2", sec: 8, narration: "中身はこのPartで見たとおりです。GPT-3.5系列のモデルを、お手本の答えと人のほめ言葉で会話向けに磨きました。" },
    { id: "s3", sec: 7, narration: "変わったのは使い方でした。難しい設定なしで、友だちに話しかけるように入力欄に書くだけでよかったのです。" },
    { id: "s4", sec: 7, narration: "反応は爆発的でした。公開からたった5日で、ユーザーが100万人を超えました。" },
    { id: "s5", sec: 8, narration: "ほかの人気サービスが100万人を集めるのにかかった時間とくらべてみましょう。広く引用される推定値です。" },
    { id: "s6", sec: 9, narration: "2か月ほどたつと、1か月のユーザーは約1億人と推定されました。それまでで最も速く成長したアプリだという分析も出ました。" },
    { id: "s7", sec: 9, narration: "でも問題も見えてきました。それらしくまちがえたり、危ないお願いに答えたりもしたのです。だから安全がもっと大切になりました。" },
  ],
  playgroundTitle: "100万人レース",
  playgroundIntro: "まず、ChatGPTがユーザー100万人を集めるのに何日かかったか予想してみましょう。それからほかのサービスと競争させます。",
  summary: [
    "ChatGPTは2022年11月30日に、無料の研究用プレビュー版として公開された。",
    "中身はGPT-3.5系列のモデル + お手本の答え + 人のほめ言葉（RLHF）。",
    "5日で100万人、2か月ほどあとに1か月のユーザー約1億人（推定）。",
  ],
  unlocks: "ChatGPTの公開",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "ChatGPTがはじめて公開された日は？",
      choices: ["2020年6月", "2022年11月30日", "2017年12月"],
      answer: 1,
      explain: "2022年11月30日です。2017年はトランスフォーマーの論文（第44章）、2020年はGPT-3が出た年です。",
      review: "s1",
    },
    {
      q: "ChatGPTの中身はどうやって作られた？",
      choices: ["まったく新しい構造をゼロから発明した", "ネットの検索結果をそのまま見せている", "GPT-3.5系列のモデルを、お手本の答えと人のほめ言葉で磨いた"],
      answer: 2,
      explain: "このPartで学んだSFTとRLHFが、まさにその方法です。",
      review: "s2",
    },
    {
      q: "「100万人までにかかった時間」の比較表を見るときに気をつけることは？",
      choices: ["サービスごとに「ユーザー」の数え方がちがうので、おおよその推定値だ", "全部の数が正確に測った値だ", "ChatGPTがいちばん遅かった"],
      answer: 0,
      explain: "広く引用されていますが、会社ごとに基準がちがいます。大きな流れを見るためだけに使うのがよいでしょう。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第78章 2022年11月30日",
    month: "2022年11月",
    day: "30",
    weekday: "水曜日",
    launch: "ChatGPT公開",
    preview: "無料の研究用プレビュー",
    equals: "= ChatGPT",
    sameWay: "* OpenAIの発表：InstructGPT（第76章）と同じ方法で学習",
    appName: "ChatGPT",
    ask: "週末に読む本をすすめて",
    reply: "いいですね！ どんなお話が好きか教えてくれたら、選んでみます。",
    input: "メッセージを入力",
    send: "↑",
    justTalk: "話しかけるだけ！",
    dayN: "日め",
    users: "人",
    dot: "● 1個 = 1万人",
    million: "5日で100万人！",
    chartTitle: "ユーザー100万人までにかかった時間",
    estimate: "* 広く引用される推定値。サービスごとに「ユーザー」の数え方がちがう",
    wow: "5日！",
    m1: "100万人・5日 →",
    m100: "← 約1億人\n（2か月後）",
    monthly: "1か月のユーザー約1億人（推定）",
    fastest: "最も速く成長したアプリという分析も",
    cell: "□ 1マス = 100万人",
    problems: "見えてきた問題",
    wrong: "それらしいまちがい（第84章）",
    danger: "危ないお願いにも答える",
    safety: "安全にする",
    next: "第79章",
  },
};
