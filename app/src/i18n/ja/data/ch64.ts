import type { ChapterSpec } from "../../../data/types";

/** The running example split into word-sized pieces (real tokenizers cut differently, 第29章). */
export const SENT = ["私は", "今日", "学校に", "行く", "。"];

export const PRESETS64 = [
  "私は 今日 学校に 行く。",
  "ちりも 積もれば 山と なる。",
  "1, 2, 3, 4, 5",
  "一難 去って また 一難。",
];

export const MAX_PIECES = 12;

/** Split on spaces and peel trailing punctuation into its own piece: "行く。" → "行く", "。". (ja: also 。、！？) */
export function pieces(text: string): string[] {
  const out: string[] = [];
  for (const w of text.trim().split(/\s+/).filter(Boolean)) {
    const m = w.match(/^(.*?)([.,!?。、！？]+)$/);
    if (m && m[1]) out.push(m[1], m[2]);
    else out.push(w);
  }
  return out;
}

/** Every prefix becomes a question whose answer is the next piece. */
export const questions = (ps: string[]) => ps.slice(1).map((answer, i) => ({ context: ps.slice(0, i + 1), answer }));

export const ch64: ChapterSpec = {
  id: 64,
  part: 7,
  title: "答えのない勉強",
  core: true,
  hook: "インターネットの文章には答えがついていないのに、GPTは何を見て採点したのでしょう？",
  steps: [
    { id: "s1", sec: 11, narration: "第4章のスパムフィルターは、人が「スパム」「ふつう」と答えをつける必要がありました。でも、ネットの文章全部に答えはつけられません。" },
    { id: "s2", sec: 9, narration: "ひみつは、文章そのものが答えになっていることです。1つの文を持ってきましょう。「私は 今日 学校に 行く。」" },
    { id: "s3", sec: 10, narration: "前の部分だけを見せて次のかけらを隠すと、問題になります。「私は」の次は？ 答えはすぐ後ろにあった「今日」です。" },
    { id: "s4", sec: 10, narration: "1マスずつのばすと、また問題ができます。「私は 今日」の次は「学校に」、「私は 今日 学校に」の次は「行く」。" },
    { id: "s5", sec: 10, narration: "かけら5つの文から問題が4つできました。答えは人ではなく文章が教えてくれます。これが自己教師あり学習です。" },
    { id: "s6", sec: 9, narration: "モデルはこの4問を一度に解きます。第51章の目かくしのおかげで、それぞれの位置は自分より前しか見られないからです。" },
    { id: "s7", sec: 11, narration: "GPT-3が読んだ約3,000億トークンは、全部こういう問題です。答えの紙が1枚もないのに、問題が約3,000億問できたのです。" },
  ],
  playgroundTitle: "問題づくり工場",
  playgroundIntro: "文を選ぶか、自分で書いてみましょう。1つの文が「次のかけら当て」の問題いくつかに変わります。答えを見る前に、まず当ててみましょう。",
  summary: [
    "文の前の部分だけを見せて、次のかけらを当てさせると問題になる。",
    "答えは文章の中のすぐ次のかけら。人が答えをつけなくていい = 自己教師あり学習。",
    "かけらN個の文1つ → 問題N − 1個。インターネット全体が問題集になる。",
  ],
  unlocks: "自己教師あり学習",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "「ねこが / 魚を / 食べた / 。」のように、かけらが4つの文からできる問題はいくつ？",
      choices: ["2問", "3問", "4問"],
      answer: 1,
      explain: "最初のかけらは前に何もないので問題になりません。そのあとの3つのかけらが、それぞれ答えになります。",
      review: "s5",
    },
    {
      q: "自己教師あり学習で、答えはどこから来る？",
      choices: ["先生が1つずつつけてくれる", "モデルが勝手に決める", "文章の中にもうある次のかけら"],
      answer: 2,
      explain: "前の部分を見せて隠した次のかけらが、そのまま答えです。文章そのものが答えになっています。",
      review: "s3",
    },
    {
      q: "「私は 今日」を見せた問題の答えは？",
      choices: ["学校に", "私は", "行く"],
      answer: 0,
      explain: "「私は 今日 学校に 行く。」で、「私は 今日」のすぐ次のかけらは「学校に」です。",
      review: "s4",
    },
  ],
  labels: {
    tag: "第64章 答えのない勉強",
    spamMsg: "【広告】無料クーポン",
    spam: "スパム",
    byPerson: "人がつけた答え",
    allWeb: "ネットの文章全部に？",
    impossible: "1つずつはつけられない",
    finer: "本物のトークンは別の切り方になります（第29章）",
    textIs: "文章 = 問題 + 答え",
    q: "問題",
    answerFrom: "答えは文章の中に！",
    count: "かけら5つ → 問題4つ",
    ssl: "自己教師あり学習",
    sslEn: "self-supervised",
    together: "4問を一度に",
    mask: "第51章の目かくし：自分より前だけ見る",
    gpt3: "GPT-3が読んだ文章",
    tokens: "約3,000億トークン",
    equals: "= 問題 約3,000億問",
    noKey: "答えの紙は1枚もなし！",
    next: "第65章：どれだけ間違えたかを測る",
  },
};
