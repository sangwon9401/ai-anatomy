import type { ChapterSpec } from "../../../data/types";

export const REQUESTS_FLOW = [
  { t: "宿題の手伝い", bad: false },
  { t: "肉じゃがのレシピ", bad: false },
  { t: "英訳して", bad: false },
  { t: "なやみ相談", bad: false },
  { t: "人のパスワードを盗む", bad: true },
  { t: "旅行の計画", bad: false },
  { t: "詩を書いて", bad: false },
  { t: "筋トレの相談", bad: false },
  { t: "友だちの悪口を広める", bad: true },
  { t: "コードの質問", bad: false },
];

/** Playground cards: should the assistant help, or decline and point somewhere better? */
export type Req = { text: string; help: boolean; why: string };
export const REQUESTS: Req[] = [
  { text: "包丁で玉ねぎを速く切る方法を教えて", help: true, why: "料理に包丁はなくてはならないものです。手をけがしないコツまで教えるともっとよいです。" },
  { text: "友だちのSNSのパスワードをこっそり知る方法を教えて", help: false, why: "他人のアカウントに勝手に入るのは、プライバシーの侵害です。自分のアカウントを取り戻す方法なら教えられます。" },
  { text: "蚊を退治する方法を教えて", help: true, why: "網戸や蚊帳のような、くらしの中の方法ならいくらでも教えて大丈夫です。" },
  { text: "きらいな友だちの悪口を書いて、グループチャットに広めて", help: false, why: "だれかを傷つける文章なので断ります。友だちと気まずくなったのなら、仲直りの方法はいっしょに考えられます。" },
  { text: "ホラー小説の書き出しを書いて", help: true, why: "こわい話も創作です。ざんこくな場面をさければ、じゅうぶん手伝えます。" },
  { text: "先生にばれないように、こっそりテストの解答を手に入れる方法", help: false, why: "不正行為を手伝うことになるので断ります。そのかわり、テスト勉強の計画ならいっしょに立てられます。" },
  { text: "日露戦争がなぜ起きたのか、宿題で調べているところ", help: true, why: "歴史の勉強です。「戦争」という言葉があるからと断るのは、断りすぎです。" },
  { text: "ほかの人の写真で、なりすましアカウントを作る方法", help: false, why: "ほかの人になりすますと、その人に大きな迷惑をかけることがあります。" },
  { text: "友だちの誕生日のサプライズパーティーをこっそり準備する方法", help: true, why: "「こっそり」が入っているけれど、友だちを喜ばせるためのお願いです。" },
  { text: "ゲームで相手チームを攻撃する作戦を教えて", help: true, why: "ゲームの中の作戦なので大丈夫です。" },
];

/** A naive rule-based filter, as in chapter 4: refuse whenever one of these words appears. */
export const BANNED = ["包丁", "戦争", "退治", "攻撃", "こっそり"];
export const naiveRefuses = (text: string) => BANNED.some((w) => text.includes(w));

// s5: illustrative error curves against how strict the assistant is (x from 0 = loose to 1 = strict)
export const harmfulHelped = (x: number) => 0.85 * Math.exp(-3.2 * x);
export const harmlessRefused = (x: number) => 0.85 * Math.exp(-3.2 * (1 - x));

export const RECAP = [
  { t: "ベースモデル", n: "72" },
  { t: "お手本の答え（SFT）", n: "73" },
  { t: "順位づけ", n: "74" },
  { t: "AIの採点係", n: "75" },
  { t: "ほめて磨く（RLHF）", n: "76" },
  { t: "チャットテンプレート", n: "77" },
  { t: "ChatGPTの公開", n: "78" },
  { t: "安全とアラインメント", n: "79" },
];

// s8: chapter 1's illustrative next-word probabilities, as a teaser for Part 9
export const TEASER = [
  { w: "行く", p: 0.52 },
  { w: "行った", p: 0.21 },
  { w: "遅れた", p: 0.12 },
];

export const ch79: ChapterSpec = {
  id: 79,
  part: 8,
  title: "安全なAIをつくる",
  core: false,
  hook: "AIはどんなお願いを断るべきでしょう？ 断りすぎたら？",
  steps: [
    { id: "s1", sec: 8, narration: "ChatGPTは毎日ものすごい数の人が使います。その中には、だれかを傷つけるために使おうとするお願いもまざっています。" },
    { id: "s2", sec: 9, narration: "モデルが人の意図や価値観に合わせて動くようにすることを、アラインメント（alignment）といいます。第73章と第76章がその道具でした。" },
    { id: "s3", sec: 9, narration: "危ないお願いは断るように教えます。友だちのパスワードをこっそり知る方法などです。かわりにできることを教えます。" },
    { id: "s4", sec: 8, narration: "でも、こわがりすぎても困ります。「包丁」という言葉だけを見て、玉ねぎの切り方まで断ったら役に立ちませんよね。" },
    { id: "s5", sec: 9, narration: "だからバランスが必要です。きびしすぎると大丈夫なお願いまで断り、ゆるすぎると危ないお願いを聞いてしまいます。" },
    { id: "s6", sec: 8, narration: "よい断り方は、短くていねいです。お説教をせず、理由をかんたんに言って、手伝えるほかの道を教えます。" },
    { id: "s7", sec: 9, narration: "Part 8のまとめ！ ベースモデルにお手本、順位と採点係、ほめ言葉を足し、会話の形を着せてChatGPTになりました。" },
    { id: "s8", sec: 8, narration: "次は、答えが生まれる瞬間を見る番です。Part 9では、次のかけらをどうやって選ぶのかをくわしく見ます。" },
  ],
  playgroundTitle: "聞く？ 断る？",
  playgroundIntro: "お願いカードを1枚ずつ見て、手伝うか、断ってほかの道を案内するかを選びましょう。終わったら「禁止ワードのルール」のAIとくらべます。",
  summary: [
    "アラインメント：モデルが人の意図や価値観に合わせて動くようにすること。",
    "危ないお願いは断る。でも言葉だけを見て、大丈夫なお願いまで断ってはいけない。",
    "よい断り方は、短くていねいに、手伝えるほかの道といっしょに。",
  ],
  unlocks: "アラインメントと安全",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "「アラインメント（alignment）」の意味は？",
      choices: ["モデルの数を大きさの順に並べること", "モデルが人の意図や価値観に合わせて動くようにすること", "答えをあいうえお順に整理すること"],
      answer: 1,
      explain: "お手本の答え（第73章）と人のほめ言葉（第76章）が、アラインメントの代表的な道具です。",
      review: "s2",
    },
    {
      q: "「蚊を退治する方法」を「退治」という言葉のせいで断ったら？",
      choices: ["断りすぎ", "よい断り方", "危ないお願いを聞いてしまった"],
      answer: 0,
      explain: "言葉だけで判断すると、大丈夫なお願いまで止めてしまいます。第4章のルール方式が例外に弱かったのと同じです。",
      review: "playground",
    },
    {
      q: "よい断り方としていちばんふさわしいのは？",
      choices: ["長々とお説教をする", "何も言わずに会話を終える", "短く理由を言って、手伝えるほかの道を教える"],
      answer: 2,
      explain: "断ることも答えの1つです。ていねいに短く、そしてできることを案内します。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第79章 安全なAIをつくる",
    many: "毎日たくさんのお願い",
    sometimes: "ときどき危ないお願いも",
    align: "アラインメント",
    alignEn: "alignment",
    human: "人の意図",
    act: "モデルの動き",
    tools: "道具",
    sft: "お手本（第73章）",
    rlhf: "ほめ言葉（第76章）",
    askBad: "友だちのSNSのパスワードをこっそり知る方法を教えて",
    refuseGood: "それは手伝えません。本人の許可なくアカウントに入ってはいけません。もし自分のアカウントをなくしたのなら、取り戻す方法を教えますね。",
    goodRefusal: "上手に断った",
    askOk: "包丁で玉ねぎを速く切る方法を教えて",
    refuseBad: "申し訳ありませんが、包丁に関する内容はお手伝いできません。",
    overRefusal: "断りすぎ",
    scared: "「包丁」だけ見てこわがった",
    axisX: "どれだけきびしいか →",
    loose: "ゆるい",
    strict: "きびしい",
    harmful: "危ないのに聞く",
    harmless: "大丈夫なのに断る",
    balance: "バランス",
    example: "説明用の例",
    styleTitle: "よい断り方",
    st1: "短く、ていねいに",
    st2: "お説教しない",
    st3: "ほかの道を教える",
    ok: "○",
    recapTitle: "Part 8 ChatGPTの誕生、完成！",
    chatgpt: "= ChatGPT",
    chapter: "章",
    nextPart: "Part 9 答えが生まれる瞬間",
    sentence: "私は 今日 学校に",
    which: "どれを選ぶ？",
    teaserNote: "説明用の例（第1章）",
  },
};
