import type { ChapterSpec } from "../../../data/types";

export type Demo = { q: string; a: string };

// Demonstrations people write (scene, s2). Contents are examples, not taken from a real dataset.
export const DEMOS: Demo[] = [
  { q: "英訳して：ありがとう", a: "Thank you." },
  { q: "3 × 4は？", a: "12です。" },
  { q: "「秋」で詩を1行書いて", a: "落ち葉が手紙のように舞いおりる午後" },
  { q: "光合成って何？", a: "植物が日光で養分をつくることです。" },
];

// s3: one demonstration as a strip of pieces; the answer pieces are what the model practises predicting
export const STRIP_Q = ["質問：", "光合成って", "何？", "答え："];
export const STRIP_A = ["植物が", "日光で", "養分を", "つくる", "ことです", "。"];

// s4: a few of the model's numbers before and after fine-tuning (illustrative)
export const WEIGHTS_BEFORE = [0.42, -1.07, 0.88, 0.15, -0.33, 1.26, -0.71, 0.04, 0.59, -0.2, 0.97, -0.48, 0.31, -0.86, 0.12, 0.67, -0.05, 0.74, -1.12, 0.26];
export const WEIGHTS_AFTER = [0.43, -1.07, 0.86, 0.15, -0.31, 1.26, -0.72, 0.05, 0.59, -0.2, 0.98, -0.48, 0.3, -0.86, 0.12, 0.69, -0.05, 0.74, -1.1, 0.26];

/** Playground: three sets of model answers written in different voices, and what a fine-tuned model then says.
 *  ja: the Korean "Joseon scholar" voice becomes 武士の話し方 (…でござる); the key stays "joseon". */
export type Style = { key: string; name: string; demos: Demo[] };
export const STYLES: Style[] = [
  {
    key: "kind",
    name: "やさしい先生",
    demos: [
      { q: "3 × 4は？", a: "12です！ 3を4回足したのと同じですよ。" },
      { q: "「ありがとう」を英語で言うと？", a: "Thank youです。友だちどうしならThanksもよく使います。" },
      { q: "地球からいちばん近い恒星は？", a: "太陽です！ 太陽の次に近い恒星はプロキシマ・ケンタウリです。" },
    ],
  },
  {
    key: "short",
    name: "1行で短く",
    demos: [
      { q: "3 × 4は？", a: "12。" },
      { q: "「ありがとう」を英語で言うと？", a: "Thank you." },
      { q: "地球からいちばん近い恒星は？", a: "太陽。" },
    ],
  },
  {
    key: "joseon",
    name: "武士の話し方",
    demos: [
      { q: "3 × 4は？", a: "十二でござる。三を四たび足す道理でござる。" },
      { q: "「ありがとう」を英語で言うと？", a: "「Thank you」と申すでござる。" },
      { q: "地球からいちばん近い恒星は？", a: "お天道様でござる。その次に近き星はプロキシマ・ケンタウリと申す。" },
    ],
  },
];

export type TestQ = { q: string; base: string; replies: Record<string, string> };
export const TESTS: TestQ[] = [
  {
    q: "空はなぜ青いの？",
    base: "海はなぜ青いの？ 夕焼けはなぜ赤いの？ 雲はなぜ白いの？",
    replies: {
      kind: "いい質問ですね！ 日光が空気の中を通るとき、青い光のほうがたくさん散らばるからです。",
      short: "青い光がたくさん散らばるから。",
      joseon: "日の光が空気を通るとき、青き光が多く散るゆえでござる。",
    },
  },
  {
    q: "水は何度で沸とうする？",
    base: "氷は何度でとける？ 水は何度でこおる？",
    replies: {
      kind: "ふつうは100度で沸とうします。高い山の上では、それより低い温度で沸とうします。",
      short: "ふつうは100度。",
      joseon: "ふつうは百度で煮え立つでござる。高き山ではそれより低いと申す。",
    },
  },
];

export const ch73: ChapterSpec = {
  id: 73,
  part: 8,
  title: "模範解答をまねる",
  core: true,
  hook: "言うことを聞かないモデルに、「答え方」はどうやって教えるのでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "解決策は意外とシンプルです。人が自分で質問とお手本の答えを書いて、モデルに見せるのです。" },
    { id: "s2", sec: 8, narration: "翻訳、計算、詩、説明まで、いろいろな質問ごとに、やさしく正確な答えを書きます。こんな例をとてもたくさん集めます。" },
    { id: "s3", sec: 9, narration: "学習のしかたはPart 7とまったく同じ、次のかけら当てです。ただ、教科書がネットの文章からお手本の答えに変わりました。" },
    { id: "s4", sec: 9, narration: "もう賢いモデルなので、数を少しだけ整えます。お手本の答えでこう整える方法を、教師ありファインチューニング（SFT）といいます。" },
    { id: "s5", sec: 7, narration: "結果はおどろくほどです。同じ質問に、もう質問を書き続けず、ちゃんと答えます。" },
    { id: "s6", sec: 8, narration: "はじめて見る質問にも答えます。答えを覚えたのではなく、「質問のあとは答え」という形と話し方を学んだのです。" },
    { id: "s7", sec: 8, narration: "でも、お手本の答えを書くのは大変で時間がかかります。そこで人々は、もっと楽な方法を考えました。次の章で見ます。" },
  ],
  playgroundTitle: "話し方を教えよう",
  playgroundIntro: "お手本の答えのセットを1つ選んで、ファインチューニングしてみましょう。それからはじめて見る質問を投げて、モデルが何をまねしたか確かめます。",
  summary: [
    "SFT：人が書いた質問とお手本の答えで、モデルをもう少しだけ学習させる。",
    "学習のしかたは事前学習と同じ次のかけら当て。教科書だけが変わる。",
    "モデルは答えを覚えるのではなく、答える形と話し方をまねする。",
  ],
  unlocks: "SFT（教師ありファインチューニング）",
  unlockLabel: "ChatGPTのひみつをひとつ知りました",
  quiz: [
    {
      q: "SFTでモデルが勉強する教科書は？",
      choices: ["人が自分で書いた質問とお手本の答え", "ネットから集めたいろいろな文章", "モデルが自分で書いた文章"],
      answer: 0,
      explain: "人が質問ごとにお手本の答えを書いて見せます。学習のしかたは次のかけら当てのままです。",
      review: "s3",
    },
    {
      q: "SFTを終えたモデルが、はじめて見る質問にも答えられるのはなぜ？",
      choices: ["世界中の質問と答えを全部覚えたから", "質問されるとネットを検索するから", "「質問のあとは答え」という形を学んだから"],
      answer: 2,
      explain: "答えを1つずつ覚えたのではなく、答える形と話し方を学んだのです。",
      review: "s6",
    },
    {
      q: "お手本の答えを全部「武士の話し方（〜でござる）」で書いたら、ファインチューニングしたモデルは？",
      choices: ["話し方はそのままで、内容だけを学ぶ", "はじめて見る質問にも武士の話し方で答える", "お手本の答えを無視する"],
      answer: 1,
      explain: "モデルは内容だけでなく、話し方や長さまでまねします。だから、だれがどんなお手本を書くかが大切です。",
      review: "playground",
    },
  ],
  labels: {
    tag: "第73章 模範解答をまねる",
    byHand: "人が自分で書く",
    qHead: "質問",
    aHead: "お手本の答え",
    q1: "光合成って何？",
    a1: "植物が日光を受けて、水と二酸化炭素から養分をつくることです。このとき酸素も出ます。",
    many: "× たくさん",
    eachQ: "質問ごとにお手本の答えを1つずつ",
    sample: "* 内容は例です",
    guess: "次のかけら当て",
    same: "学習のしかたはPart 7のまま",
    book: "教科書",
    oldBook: "ネットの文章",
    newBook: "お手本の答え",
    arrow: "→",
    numbers: "モデルの中の数（説明用の例）",
    tweak: "少しだけ整える",
    sft: "SFT",
    sftKo: "教師ありファインチューニング",
    sftEn: "Supervised Fine-Tuning",
    ask: "日本の首都はどこですか？",
    before: "SFT前（第72章）",
    after: "SFT後",
    beforeOut: "韓国の首都はどこですか？ 中国の首都はどこですか？",
    afterOut: "日本の首都は東京です。",
    newQ: "ねこの名前を考えて",
    newA: "「ミケ」「こむぎ」「マロン」はどうですか？ 毛の色や性格を見て選ぶと、もっとぴったりです。",
    neverSeen: "初めての質問でも！",
    shape: "覚えたのではなく「質問 → 答え」の形を学んだ",
    hard: "書くのは大変で時間がかかる",
    write: "お手本の答えを書く",
    pick: "もっと楽な方法は？",
    next: "第74章",
  },
};
