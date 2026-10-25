import type { ChapterSpec } from "../../../data/types";

export type Kind = { text: string; short: string; excerpt: string; p0: number; judge: number; human: number };

/**
 * One question, four kinds of answers the fine-tuned model (ch73) might write.
 * p0: how often the original model writes it; judge: the reward model's score (ch75); human: what people would really give it.
 * The last one exploits a blind spot of the judge. All numbers are illustrative.
 */
export const QUESTION = "光合成って何？";
export const KINDS: Kind[] = [
  { text: "わかりません。", short: "わかりません", excerpt: "「わかりません。」", p0: 0.25, judge: -1, human: -1 },
  { text: "植物が日光で養分をつくることです。", short: "短くて正確な答え", excerpt: "「植物が日光で養分を…」", p0: 0.35, judge: 1, human: 1 },
  { text: "植物が日光と水と二酸化炭素から、養分と酸素をつくることです。葉の葉緑体で起きます。", short: "親切でくわしい答え", excerpt: "「日光と水と二酸化炭素から…」", p0: 0.35, judge: 2, human: 2 },
  { text: "本当に本当にいい質問です！！！ 光合成って本当にすごい！！！ 最高です！！！", short: "ほめ言葉ばかり", excerpt: "「本当に本当にいい質問です！！！」", p0: 0.05, judge: 2.4, human: -1 },
];

/** Where training ends up for a leash strength β: p0 × e^(judge / β), normalised. A small β = a long, loose leash. */
export function tuned(beta: number, t = 1, kinds: Kind[] = KINDS) {
  const u = kinds.map((k) => k.p0 * Math.exp((t * k.judge) / beta));
  const s = u.reduce((a, b) => a + b, 0);
  return u.map((x) => x / s);
}
export const mean = (p: number[], v: number[]) => p.reduce((a, x, i) => a + x * v[i], 0);
/** how far the tuned model has moved from the original one (KL divergence) */
export const drift = (p: number[], kinds: Kind[] = KINDS) => p.reduce((a, x, i) => a + (x > 1e-12 ? x * Math.log(x / kinds[i].p0) : 0), 0);

export const LEASH = [
  { name: "とても短く", beta: 10 },
  { name: "短く", beta: 3 },
  { name: "少し短く", beta: 1.5 },
  { name: "ちょうどよく", beta: 0.7 },
  { name: "少し長く", beta: 0.3 },
  { name: "長く", beta: 0.1 },
  { name: "ほぼなし", beta: 0.05 },
];

// scene s3: the first three kinds only, before and after one round of "more of what scored well" (β = 1)
export const S3_KINDS: Kind[] = [
  { ...KINDS[0], p0: 0.3 },
  { ...KINDS[1], p0: 0.4 },
  { ...KINDS[2], p0: 0.3 },
];

export const ch76: ChapterSpec = {
  id: 76,
  part: 8,
  title: "ほめて磨く",
  core: true,
  hook: "「よい答え」を言葉で全部説明できないなら、どうやって教えればいいのでしょう？",
  steps: [
    { id: "s1", sec: 8, narration: "犬に「おすわり」を教えるとき、言葉で説明はしませんよね。うまくできたらおやつをあげると、ほめられる行動がだんだん増えます。" },
    { id: "s2", sec: 8, narration: "モデルも同じです。質問を受けるとモデルが答えを書き、第75章の採点係が点数をつけます。この点数がおやつです。" },
    { id: "s3", sec: 8, narration: "点数が高かった答えはもっと多く、低かった答えは少なく出るように数を直します。これが人間のフィードバックによる強化学習（RLHF）です。" },
    { id: "s4", sec: 8, narration: "答えの形を1列に並べると、モデルは点数が高いほうへ少しずつ移っていきます。犬がおやつのほうへ行くように。" },
    { id: "s5", sec: 8, narration: "でも点数だけを追うと危険です。採点係のすきを見つけて、ほめ言葉ばかり並べるおかしな答えへ走ることがあるからです。" },
    { id: "s6", sec: 9, narration: "そこでリードをつけます。元のモデル（第73章）から離れすぎたら点数を減らします。このリードをKLペナルティと呼びます。" },
    { id: "s7", sec: 9, narration: "効果はおどろくほどでした。人々は1,750億のGPT-3より、RLHFを通した13億のInstructGPTの答えのほうを好んだのです。" },
    { id: "s8", sec: 8, narration: "お手本の答えをまねることと、人のほめ言葉。この2つで会話の練習が終わりました。設計図の空欄が1つ埋まりました！" },
  ],
  playgroundTitle: "リードの長さを決めよう",
  playgroundIntro: "リードの長さを決めて、練習させてみましょう。採点係の点数だけを見ずに、人が本当に感じる満足度がいちばん高くなる長さを見つけましょう。",
  summary: [
    "RLHF：モデルが答えを書き、採点係の点数が高い答えがもっと多く出るように数を直す。",
    "点数だけを追うと、採点係のすきをねらったおかしな答えが出てくる。",
    "リード（KLペナルティ）で、元のモデルから離れすぎないようにする。",
  ],
  unlocks: "会話の練習",
  quiz: [
    {
      q: "RLHFで、犬の「おやつ」の役をするものは？",
      choices: ["人が書いたお手本の答え", "報酬モデル（採点係）がつけた点数", "ネットの文章"],
      answer: 1,
      explain: "モデルが書いた答えを第75章の採点係が採点し、その点数が高いほうへモデルを直します。",
      review: "s2",
    },
    {
      q: "リード（KLペナルティ）がないと、どんなことが起こりうる？",
      choices: ["モデルが学習をやめる", "モデルが最初のモデルとまったく同じになる", "採点係のすきをねらったおかしな答えにかたよる"],
      answer: 2,
      explain: "採点係も完璧ではないので、点数だけを追うと、人はいやがるのに点数だけ高い答えが増えます。",
      review: "s5",
    },
    {
      q: "InstructGPTの実験でわかったことは？",
      choices: ["RLHFで磨いた13億のモデルが、1,750億のGPT-3よりよい評価を受けた", "モデルが大きいほど、必ず人に好まれる", "RLHFは大きなモデルでしか効果がない"],
      answer: 0,
      explain: "大きさよりも、「人がほしい答え」を学んだかどうかが評価を大きく変えました。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第76章 ほめて磨く",
    sit: "おすわり！",
    treat: "できたらおやつ！",
    more: "ほめられる行動が増える",
    q: "質問",
    model: "モデル",
    answer: "答え",
    judge: "採点係",
    snack: "点数 = おやつ",
    question: "質問：光合成って何？",
    judgeScore: "点数",
    often: "書く頻度",
    up: "↑ もっと多く",
    down: "↓ 少なく",
    repeat: "× 何度もくり返す",
    example: "説明用の例",
    axisX: "答えの形 →",
    axisY: "↑ 採点係の点数",
    post: "元のモデル",
    hill: "よい答え",
    gap: "採点係のすき",
    flatter: "本当に最高の質問です！！！",
    chase: "点数だけを追うと…",
    leash: "リード",
    tooFar: "離れすぎたら点数を減らす",
    kl: "KLペナルティ",
    rlhf: "RLHF",
    rlhfKo: "人間のフィードバックによる強化学習",
    rlhfEn: "Reinforcement Learning from Human Feedback",
    ppo: "* 実際にはPPOという方法で数を直します。数は説明用の例",
    toward: "点数が高いほうへ少しずつ",
    instruct: "InstructGPT",
    instructSize: "13億 + RLHF",
    gpt3: "GPT-3",
    gpt3Size: "1,750億",
    who: "人々が好んだ答えは？",
    liked: "人々が好んだほう",
    small: "小さいほうが勝った！",
    trainTitle: "ChatGPTの設計図：学習",
    filled: "完成",
    sft: "お手本の答えをまねる（第73章）",
    praise: "人のほめ言葉（第76章）",
  },
};
