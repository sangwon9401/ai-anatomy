import type { ChapterSpec, Highlighter } from "../../../data/types";

export type FewShotTask = {
  key: string;
  name: string;
  query: string;
  /** candidates: [the rule's answer, the odd example's answer, two plain continuations] */
  cands: string[];
  base: number[];
  examples: string[];
  odd: string;
};

// 説明用の例: a made-up scoring rule, not a real model. Every matching example adds RULE_BOOST to the
// rule's answer; the odd example (from another pattern) adds ODD_BOOST to its own answer.
export const RULE_BOOST = 1.2;
export const ODD_BOOST = 2.0;

export const TASKS: FewShotTask[] = [
  {
    key: "opp",
    name: "反対語",
    query: "速い →",
    cands: ["遅い", "fast", "速く", "速さ"],
    base: [0.6, 0, 1.6, 1.2],
    examples: ["大きい → 小さい", "高い → 低い", "明るい → 暗い"],
    odd: "りんご → apple",
  },
  {
    key: "eng",
    name: "英語に",
    query: "犬 →",
    cands: ["dog", "ワンワン", "かわいい", "小屋"],
    base: [0.6, 0.2, 1.6, 1.1],
    examples: ["りんご → apple", "学校 → school", "本 → book"],
    odd: "ねこ → ニャー",
  },
  {
    key: "cap",
    name: "首都",
    query: "イギリス →",
    cands: ["ロンドン", "英語", "サッカー", "旅行"],
    base: [0.7, 0.3, 1.5, 1.2],
    examples: ["日本 → 東京", "韓国 → ソウル", "フランス → パリ"],
    odd: "ドイツ → ドイツ語",
  },
];

export const softmax71 = (z: number[]) => {
  const ex = z.map((v) => Math.exp(v));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
};

/** The model's guess after `k` matching examples (and the odd one, if included). */
export const guess = (task: FewShotTask, k: number, odd = false) =>
  softmax71(task.base.map((b, i) => b + (i === 0 ? RULE_BOOST * k : 0) + (i === 1 && odd ? ODD_BOOST : 0)));

export const CAND_COLORS: Highlighter[] = ["mint", "orange", "sky", "violet"];

/** s6: 正解率 by number of examples, 説明用の例 (the shape follows the GPT-3 paper: bigger models gain more). */
export const SHOTS = [0, 1, 2, 4, 8];
export const ACCURACY = [
  { name: "小型", c: "sky" as Highlighter, v: [5, 7, 8, 9, 10] },
  { name: "中型", c: "mint" as Highlighter, v: [10, 22, 28, 33, 36] },
  { name: "大型", c: "pink" as Highlighter, v: [20, 45, 56, 64, 68] },
];

/** Part 7 recap chips (the unlocks of 63–71). */
export const PART7_TOOLS = ["データの選別", "自己教師あり学習", "交差エントロピー", "事前学習", "Adam", "GPU並列計算", "モデルの大きさ", "スケーリング則", "文脈内学習"];

export const ch71: ChapterSpec = {
  id: 71,
  part: 7,
  title: "例を見せるだけで学ぶ",
  core: false,
  hook: "数を1つも直していないのに、モデルが新しい仕事を覚えられるのでしょうか？",
  steps: [
    { id: "s1", sec: 11, narration: "GPT-3を紹介した2020年の論文の題名は「言語モデルはフューショット学習者」。例をいくつか見るだけで新しい仕事ができる、という意味です。" },
    { id: "s2", sec: 11, narration: "「速い →」だけでは、モデルは何をしてほしいのかわかりません。反対語がほしいのに、「速く走る」のようにただ文を続けがちです。" },
    { id: "s3", sec: 10, narration: "前に例を1つつけてみましょう。「大きい → 小さい」。すると、矢印のあとには反対語が来ると気づきはじめます。" },
    { id: "s4", sec: 9, narration: "例を3つつけると「遅い」がほぼ確実になります。おどろいたことに、モデルの中の数は1つも変わっていません。" },
    { id: "s5", sec: 10, narration: "これが文脈内学習（インコンテキスト学習）です。第66章のように数を直す学習ではなく、プロンプトの中の例から決まりを読みとるのです。" },
    { id: "s6", sec: 10, narration: "例の数ごとの正解率を描くと、例が増えるほど上がります。そして大きいモデルほど、例のおかげをたくさん受けます。" },
    { id: "s7", sec: 10, narration: "例なしならゼロショット、1つならワンショット、いくつもならフューショット。例の入れ方のコツは第85章のプロンプトでまた使います。" },
    { id: "s8", sec: 11, narration: "Part 7ではGPTに勉強させました。教科書、次のかけら当て、驚きを減らす、訓練の輪、大きさの力。次は会話を学ぶ番です！" },
  ],
  playgroundTitle: "例を入れてみよう",
  playgroundIntro: "例のカードを押して、プロンプトに入れたり出したりしてみましょう。モデルの数はそのままなのに、例だけで答えが変わります。おかしな例も入れてみましょう。",
  summary: [
    "プロンプトで例を見せると、モデルがその場で決まりを読みとってまねする = 文脈内学習。",
    "モデルの中の数はそのまま。例0個はゼロショット、1個はワンショット、いくつもならフューショット。",
    "Part 7：ネットの教科書 → 次のかけら当て → 驚きを減らす → 訓練の輪 → 大きさの力。",
  ],
  unlocks: "文脈内学習",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "文脈内学習で変わるものは？",
      choices: ["モデルの中の数（パラメータ）", "プロンプトの中の例", "トークナイザー"],
      answer: 1,
      explain: "数は1つも直しません。プロンプトに入れた例だけが変わり、モデルがそこから決まりを読みとります。",
      review: "s5",
    },
    {
      q: "「大きい → 小さい、高い → 低い、速い →」のように例を2つ見せるやり方は？",
      choices: ["フューショット", "ゼロショット", "事前学習"],
      answer: 0,
      explain: "例がいくつもあればフューショット、1つならワンショット、なければゼロショットです。",
      review: "s7",
    },
    {
      q: "例を増やしたとき、正解率がいちばん大きく上がるのは？（説明用の例のグラフ）",
      choices: ["小さいモデル", "どれも同じ", "大きいモデル"],
      answer: 2,
      explain: "GPT-3の論文でも、大きいモデルほどプロンプトの中の例をうまく使いました。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第71章 例を見せるだけで学ぶ",
    paperEn: "Language Models are Few-Shot Learners",
    paperKo: "言語モデルはフューショット学習者",
    paperMeta: "2020 · GPT-3の論文",
    fewMeaning: "例をいくつか → 新しい仕事",
    prompt: "プロンプト",
    guess: "モデルの次のかけら",
    example: "説明用の例",
    wanted: "反対語がほしい",
    notice: "気づきはじめた！",
    sure: "ほぼ確実！",
    frozen: "数はそのまま",
    train: "学習（第66章）",
    trainDo: "数を直す",
    icl: "文脈内学習",
    iclEn: "（in-context learning）",
    zeroEn: "zero-shot",
    oneEn: "one-shot",
    fewEn: "few-shot",
    iclDo: "数はそのまま、例から決まりを読む",
    axisX: "例の数 →",
    axisY: "↑ 正解率",
    bigGain: "大きいモデルほど例が効く",
    zero: "ゼロショット",
    one: "ワンショット",
    few: "フューショット",
    zeroN: "例0個",
    oneN: "例1個",
    fewN: "例いくつも",
    ch85: "第85章：プロンプトのコツ",
    recap: "Part 7で手に入れた道具",
    next: "次：Part 8 ChatGPTの誕生",
    nextQ: "賢いけれど言うことを聞かないモデル",
    q: "?",
  },
};
