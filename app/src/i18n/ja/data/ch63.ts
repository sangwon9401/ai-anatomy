import type { ChapterSpec, Highlighter } from "../../../data/types";

export const SOURCES = ["ニュース", "百科事典", "ブログ", "本", "コード", "掲示板"];

export type Kind = "ok" | "dup" | "quality" | "harm";

/** Illustrative mix of 100 collected units (labelled 説明用の例 in the scene); real ratios differ by dataset. */
export const MIX: { kind: Kind; n: number; c: Highlighter }[] = [
  { kind: "dup", n: 40, c: "violet" },
  { kind: "quality", n: 30, c: "orange" },
  { kind: "harm", n: 5, c: "pink" },
  { kind: "ok", n: 25, c: "sky" },
];

/** "−40", "−30", "−5": what each filter removes (drawn on the bins). */
export const BIN_CUTS = MIX.slice(0, 3).map((m) => `−${m.n}`);

export type FactoryDoc = { text: string; kind: Kind; why: string };

/** Playground: snippets the student sorts before the filters check them. */
export const FACTORY_DOCS: FactoryDoc[] = [
  { text: "光合成とは、植物が光のエネルギーで養分をつくるしくみである。", kind: "ok", why: "学べることがある百科事典の文" },
  { text: "★★超特価★★ 今すぐクリック！クリック！無料クーポンをゲット", kind: "quality", why: "広告：学べる内容がありません" },
  { text: "今日の給食はカレーだった。おいしかったのでおかわりした。", kind: "ok", why: "ふつうの日常の文も、よい教科書です" },
  { text: "光合成とは、植物が光のエネルギーで養分をつくるしくみである。", kind: "dup", why: "1番の文とまったく同じコピー" },
  { text: "wwwwwwwwwwwwwwwwwwwwww", kind: "quality", why: "意味のない文字の羅列" },
  { text: "for (let i = 0; i < 10; i++) { sum += i; }", kind: "ok", why: "コードも学びます" },
  { text: "うちのクラスの○○の電話番号 090-XXXX-XXXX ここにさらす", kind: "harm", why: "個人情報が入った文" },
  { text: "関ヶ原の戦いは1600年に起きた。", kind: "ok", why: "歴史の知識が入った文" },
  { text: "おい、この@#$%！ほんとに@#$%だな", kind: "harm", why: "ひどい悪口" },
  { text: "今日の給食はカレーだった。おいしかったのでおかわりした。", kind: "dup", why: "3番の文とまったく同じコピー" },
];

export const KIND_NAME: Record<Kind, string> = { ok: "合格", dup: "重複", quality: "品質", harm: "有害" };

export const ch63: ChapterSpec = {
  id: 63,
  part: 7,
  title: "教科書はインターネット",
  core: false,
  hook: "ChatGPTは、いったいどんな本で勉強したのでしょう？",
  steps: [
    { id: "s1", sec: 10, narration: "ChatGPTの教科書はインターネットです。ニュース、百科事典、ブログ、本、コードまで、人が書いた文章をものすごい量集めます。" },
    { id: "s2", sec: 10, narration: "でも、集めた文章をそのまま使ってはいけません。同じ文章が何度もコピーされ、広告や壊れた文、悪い言葉もまざっています。" },
    { id: "s3", sec: 9, narration: "そこで文章の工場を通します。1つめは重複の削除。同じ、またはほぼ同じ文章は1つだけ残して消します。" },
    { id: "s4", sec: 9, narration: "2つめは品質フィルター。広告、意味のない文字の羅列、同じ言葉のくり返しなど、学べることがない文章を取り除きます。" },
    { id: "s5", sec: 9, narration: "3つめは有害コンテンツのフィルター。悪口、危ない内容、電話番号のような個人情報が入った文章を外します。" },
    { id: "s6", sec: 8, narration: "説明用の例では、100集めたら25しか残りません。実際の割合はデータによってちがいます。" },
    { id: "s7", sec: 11, narration: "GPT-3は、こうして選んだ文章で約3,000億トークンを勉強しました。第4章で見たとおり、よいデータがよいモデルをつくります。" },
  ],
  playgroundTitle: "文章工場の検査係",
  playgroundIntro: "文ごとに、残すか捨てるかをまず選んでみましょう。全部選ぶと、工場の3つのフィルターが正解を教えてくれます。",
  summary: [
    "ChatGPTの教科書 = インターネットの膨大な文章（ニュース、百科事典、本、コード…）。",
    "そのままは使わず、重複の削除 → 品質フィルター → 有害コンテンツのフィルターを通す。",
    "取り除くと量は減るけれど、よいデータがよいモデルをつくる。",
  ],
  unlocks: "データの選別",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "同じ文章が1,000回コピーされていたら、どうする？",
      choices: ["1つだけ残して消す", "1,000回全部勉強させる", "全部消す"],
      answer: 0,
      explain: "同じ文章を何度も見ると、その文章だけを丸暗記しやすくなります。1つだけ残すのが重複の削除です。",
      review: "s3",
    },
    {
      q: "品質フィルターが取り除く文章は？",
      choices: ["光合成を説明した百科事典の文", "「wwww」だけが並んだ文", "給食の感想を書いたブログ"],
      answer: 1,
      explain: "意味のない文字の羅列からは何も学べません。ふつうの日常の文は、よい教科書です。",
      review: "s4",
    },
    {
      q: "フィルターを全部通ったあと、文章の量は？",
      choices: ["そのまま", "もっと増える", "かなり減る"],
      answer: 2,
      explain: "重複・品質・有害のフィルターで、たくさんの文章が外れます。量は減っても、ずっとよい教科書になります。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第63章 教科書はインターネット",
    collected: "集めた文章（1マス = 1%）",
    people: "人が書いた\n大量の文章",
    dup: "同じ文章",
    dupX: "×1000",
    junk: "広告・壊れた文",
    bad: "悪口・個人情報",
    good: "学べる文章",
    mixed: "このままでは教科書に使えない",
    f1: "① 重複の削除",
    f2: "② 品質フィルター",
    f3: "③ 有害フィルター",
    bin1: "重複",
    bin2: "品質",
    bin3: "有害",
    sameText: "今日は晴れ",
    keepOne: "1つだけ残す",
    junk1: "wwwwwww",
    junk2: "★特価★ クリック！",
    noLearn: "学べることがない",
    harm1: "@#$% 悪口",
    harm2: "090-XXXX-XXXX",
    harmNote: "危ない内容も外す",
    ratio: "100 → 25",
    example: "説明用の例の割合",
    differs: "実際の割合は\nデータ次第",
    book: "きれいな教科書",
    gpt3: "GPT-3が勉強した文章",
    tokens: "約3,000億トークン",
    goodData: "よいデータ → よいモデル",
    next: "第64章：この文章でどう勉強する？",
  },
};
