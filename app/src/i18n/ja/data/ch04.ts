import type { ChapterSpec } from "../../../data/types";

// Word scores the "trained" filter ended up with. Illustrative values (labelled so in the UI),
// standing in for what a real filter would learn from thousands of examples.
// Same numbers as the Korean original, word for word. "ある" is listed with 0 so the splitter below knows it.
export const WEIGHTS: Record<string, number> = {
  広告: 1.8, 無料: 0.9, クーポン: 2.1, 当選: 2.4, 賞品: 1.9, リンク: 1.5, クリック: 1.3, 特価: 1.7, 割引: 1.4,
  今すぐ: 0.6, ゲット: 0.7, おめでとう: 0.8, 受講: 0.4, 試写会: 0.3, 今日だけ: 0.8, 確認: 0.5, イベント: 1.0,
  選ばれました: 1.6, 補習: -1.6, 申し込み: -0.3, 案内: -0.6, 宿題: -1.2, 学校: -1.9, 先生: -1.4,
  明日: -0.8, 一緒に: -1.0, 今週末: -0.4, 映画: -0.2, 行かない: -0.9, 数学: -0.7, 範囲: -0.5,
  教えて: -0.8, 塾: -0.2, 行事: -0.3, ねえ: -1.1, ラーメン: -0.3, 食べない: -0.9,
  時間: -0.4, 変わったって: -0.7, 送ってくれた: -0.7, 見た: -0.8, ある: 0,
};

export type Msg = { text: string; spam: boolean };

export const KNOWN: Msg[] = [
  { text: "【広告】無料クーポンを今すぐゲット", spam: true },
  { text: "【広告】無.料クーポン当選！", spam: true },
  { text: "おめでとう！賞品に当選！リンクをクリック", spam: true },
  { text: "【学校】無料補習の申し込み案内", spam: false },
  { text: "明日の数学の宿題の範囲を教えて", spam: false },
  { text: "先生：明日の学校行事の案内", spam: false },
  { text: "今週末、映画の無料試写会に一緒に行かない？", spam: false },
  { text: "【広告】塾の特価受講クーポン", spam: true },
];

export const FRESH: Msg[] = [
  { text: "今日だけ特価割引！今すぐ確認", spam: true },
  { text: "ねえ、クーポンあるから一緒にラーメン食べない？", spam: false },
  { text: "賞品イベントに選ばれました", spam: true },
  { text: "無料補習の時間が変わったって", spam: false },
  { text: "先生が送ってくれたリンク見た？", spam: false },
];

export const RULE_WORDS = ["無料", "クーポン", "当選", "広告", "リンク"];

// Japanese has no spaces between words, so a message is split by longest match against the known words;
// particles (の, を, に …) are dropped, brackets and punctuation separate words, and anything else is kept as an
// unknown word. So "無.料" stays one unknown word, different from "無料", just like the Korean "무.료".
const VOCAB = Object.keys(WEIGHTS).sort((a, b) => b.length - a.length);
const PARTICLES = ["から", "の", "を", "に", "が", "は", "で", "と", "も", "へ", "て"];
const SEPARATOR = /[\s【】[\](){}「」：:！!？?、。,・]/;

/** Split a message into words; brackets/punctuation are trimmed, so "無.料" stays a different word from "無料". */
export const words = (text: string) => {
  const out: string[] = [];
  let unknown = "";
  const flush = () => {
    const w = unknown.replace(/^[.]+|[.]+$/g, "");
    if (w) out.push(w);
    unknown = "";
  };
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    if (SEPARATOR.test(text[i])) {
      flush();
      i += 1;
      continue;
    }
    const known = VOCAB.find((w) => rest.startsWith(w));
    if (known) {
      flush();
      out.push(known);
      i += known.length;
      continue;
    }
    const particle = unknown ? undefined : PARTICLES.find((p) => rest.startsWith(p));
    if (particle) {
      i += particle.length;
      continue;
    }
    unknown += text[i];
    i += 1;
  }
  flush();
  return out;
};

export const scoreOf = (text: string) => words(text).reduce((a, w) => a + (WEIGHTS[w] ?? 0), 0);

export const SCENE_SCALE = ["当選", "クーポン", "広告", "無料", "案内", "宿題", "補習", "学校"];

export const ch04: ChapterSpec = {
  id: 4,
  part: 0,
  title: "ルールで vs データで",
  core: false,
  hook: "迷惑メッセージをはじくプログラムは、どうすれば作れるでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "迷惑メッセージ（スパム）をはじくプログラムを作るとします。いちばん簡単なのは、ルールを自分で書くことです。" },
    { id: "s2", sec: 8, narration: "「無料」が入っていたらスパム！うまくいきそうですよね。でも送る側が「無.料」と書けば、そのまま通ってしまいます。" },
    { id: "s3", sec: 9, narration: "逆に学校の「無料補習の案内」は止められます。直しても直しても、きりがありません。" },
    { id: "s4", sec: 10, narration: "そこでやり方を逆にしました。ルールの代わりに「これはスパム、これは正常」と例をたくさん見せると、コンピューターがルールを自分で見つけます。" },
    { id: "s5", sec: 11, narration: "学習を終えたモデルには、単語ごとに点数ができます。当選やクーポンはスパム側、補習や学校は正常側。人が決めたわけではない点数です。" },
    { id: "s6", sec: 11, narration: "これで初めて見るメッセージも、点数を足して判断できます。「無.料」とごまかしても、いっしょに使われたクーポンと当選で見つかります。" },
    { id: "s7", sec: 10, narration: "ルールは人が書き、学習ではデータが教えます。ChatGPTも文法のルールを一つずつ習ったのではなく、膨大な文章を見て身につけました。" },
  ],
  playgroundTitle: "スパムフィルター対決",
  playgroundIntro: "単語を選んで自分のルールを作りましょう。「この単語が1つでもあればスパム」というルールです。そのあと、初めて見るメッセージで試します。",
  summary: [
    "ルール方式：人が「もし〜なら」というルールを直接書く。例外がきりなく出てくる。",
    "学習方式：正解つきの例を与えると、コンピューターがルール（点数）を見つける。",
    "ChatGPTも膨大な文章から自分で身につけた。",
  ],
  unlocks: "学習データ",
  quiz: [
    {
      q: "ルール方式と学習方式のいちばん大きなちがいは？",
      choices: ["ルール方式のほうがいつも正確", "ルールは人が書き、学習は例からルールを見つけ出す", "学習方式にはコンピューターがいらない"],
      answer: 1,
      explain: "学習方式では、人は正解つきの例を渡し、ルールはコンピューターが見つけます。",
      review: "s7",
    },
    {
      q: "スパムフィルターを学習させるには、何が必要でしょう？",
      choices: ["スパムかどうかの印がついたメッセージの例をたくさん", "スパムを送る人の連絡先", "メッセージが送られた時刻"],
      answer: 0,
      explain: "正解（スパム／正常）がついた例が、そのまま教科書になります。",
      review: "s4",
    },
    {
      q: "「無料があればスパム」というルールで「無料補習の案内」を調べると？",
      choices: ["正常として通る", "スパムとしてまちがって止められる", "ルールが自分で例外を見つける"],
      answer: 1,
      explain: "ルールは書かれたとおりにしか動きません。例外は人がまた書き足す必要があります。",
      review: "s3",
    },
  ],
  labels: {
    tag: "第4章 ルールで vs データで",
    ruleTitle: "自分で書いたルール",
    rule: "もし「無料」があれば → スパム",
    spam: "スパム",
    ok: "正常",
    m1: "【広告】無料クーポン進呈",
    m2: "【広告】無.料クーポン当選！",
    m3: "【学校】無料補習の案内",
    pass: "通過？！",
    blocked: "ブロック？！",
    add1: "+ 「無.料」もスパム",
    add2: "+ ただし「補習」があれば正常",
    add3: "+ ただし「試写会」なら正常",
    add4: "+ ただし、…",
    endless: "きりがない",
    examples: "例のメッセージ数千通",
    learn: "学習",
    modelBox: "モデル",
    findRule: "ルールを自分で発見",
    scaleL: "正常側",
    scaleR: "スパム側",
    made: "人が決めたわけではない点数",
    example: "説明用の例の点数",
    newMsg: "初見のメッセージ",
    total: "合計",
    unknown: "知らない単語 = 0",
    rWay: "ルール方式",
    lWay: "学習方式",
    input: "入力",
    rules: "ルール",
    answer: "答え",
    model: "ルール（モデル）",
    ex3: "おめでとう！賞品に当選",
    ex4: "明日の数学の宿題の範囲",
    ex5: "【広告】塾の特価セール",
    dataMakes: "をデータが作る",
  },
};
