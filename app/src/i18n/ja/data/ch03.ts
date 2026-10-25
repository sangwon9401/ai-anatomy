import type { ChapterSpec } from "../../../data/types";

export type Era = {
  year: string;
  title: string;
  desc: string;
  kind: "learn" | "rule" | "event" | "winter" | "star";
  step: string;
};

// Spacing on the scene is by order, not to scale; years are written on every card.
export const ERAS: Era[] = [
  { year: "1950", title: "チューリング：機械は考えられるか？", desc: "アラン・チューリングが投げかけた問い", kind: "event", step: "s1" },
  { year: "1956", title: "「人工知能」という名前が生まれる", desc: "アメリカのダートマス会議", kind: "event", step: "s2" },
  { year: "1958", title: "パーセプトロン：自分で学ぶ機械", desc: "ローゼンブラット。第16章「ニューロン1つ」と同じしくみ", kind: "learn", step: "s2" },
  { year: "1970年代", title: "1回目のAIの冬", desc: "簡単な問題も解けず、期待がしぼんだ", kind: "winter", step: "s3" },
  { year: "1980年代", title: "エキスパートシステム", desc: "人がルールを一つひとつ書き込んだAI", kind: "rule", step: "s3" },
  { year: "1986", title: "誤差逆伝播法が広く知られる", desc: "何層もあるニューラルネットワークを学習させる方法（第23章）", kind: "learn", step: "s4" },
  { year: "1990年前後", title: "2回目のAIの冬", desc: "ルールで作るAIの限界が見えた", kind: "winter", step: "s4" },
  { year: "1997", title: "ディープ・ブルー、チェス王者に勝つ", desc: "ルールと膨大な計算で手を読んだ", kind: "rule", step: "s4" },
  { year: "2012", title: "ディープラーニングの時代へ", desc: "ニューラルネットワークが画像認識の大会で圧勝", kind: "learn", step: "s5" },
  { year: "2016", title: "アルファ碁、イ・セドル九段に勝つ", desc: "ソウルでの対局で4勝1敗", kind: "learn", step: "s5" },
  { year: "2017", title: "トランスフォーマーの発表", desc: "「Attention Is All You Need」（第44章）", kind: "star", step: "s6" },
  { year: "2018", title: "GPT-1", desc: "Generative Pre-trained Transformer", kind: "learn", step: "s6" },
  { year: "2020", title: "GPT-3", desc: "1,750億個の数字でできたモデル", kind: "learn", step: "s6" },
  { year: "2022", title: "ChatGPTの公開", desc: "11月30日。5日で利用者100万人", kind: "star", step: "s7" },
];

export const ORDER_ITEMS = [
  { key: "turing", label: "チューリングが「機械は考えられるか？」と問いかけた", year: "1950" },
  { key: "perceptron", label: "自分で学ぶ機械、パーセプトロンが登場した", year: "1958" },
  { key: "deepblue", label: "ディープ・ブルーがチェスの世界王者に勝った", year: "1997" },
  { key: "alphago", label: "アルファ碁がイ・セドル九段に勝った", year: "2016" },
  { key: "transformer", label: "トランスフォーマーが発表された", year: "2017" },
  { key: "chatgpt", label: "ChatGPTが公開された", year: "2022" },
];

export const ch03: ChapterSpec = {
  id: 3,
  part: 0,
  title: "AI 70年の年表",
  core: false,
  hook: "AIはChatGPTといっしょに、とつぜん現れたのでしょうか？",
  steps: [
    { id: "s1", sec: 8, narration: "AIはとつぜん現れたのではなく、70年以上の物語があります。1950年、アラン・チューリングは「機械は考えられるか？」と問いました。" },
    { id: "s2", sec: 9, narration: "1956年に「人工知能」という名前が生まれ、1958年には自分で学ぶ機械、パーセプトロンが登場しました。" },
    { id: "s3", sec: 8, narration: "でもパーセプトロンは簡単な問題も解けず、研究は冷えこみます。これが「AIの冬」です。その間はルールを書き込むAIが流行しました。" },
    { id: "s4", sec: 8, narration: "1986年には誤差逆伝播法が広まりますが、しばらくはまた冬でした。1997年、ルールと計算で戦うディープ・ブルーがチェス王者に勝ちます。" },
    { id: "s5", sec: 10, narration: "2012年、ニューラルネットワークが画像認識の大会で圧勝し、ディープラーニングの時代へ。2016年にはアルファ碁がイ・セドル九段に勝ちました。" },
    { id: "s6", sec: 11, narration: "2017年、Googleの研究者がトランスフォーマーを発表。GPTのTはこれです。翌年にGPT-1、2020年には1,750億個の数字のGPT-3が登場。" },
    { id: "s7", sec: 9, narration: "そして2022年11月30日、ChatGPTが登場。5日で100万人が使いました。この機械がどう作られたのか、一つずつ開けてみましょう。" },
  ],
  playgroundTitle: "年表を並べよう",
  playgroundIntro: "いちばん先に起きたことから順番に押してみましょう。",
  summary: [
    "1950年のチューリングの問いから始まり、70年以上続いてきた物語。",
    "期待と失望（AIの冬）をくり返し、2012年のディープラーニングで大きく飛躍した。",
    "2017年トランスフォーマー → GPT → 2022年ChatGPT。",
  ],
  unlocks: "2017 トランスフォーマー",
  unlockLabel: "年表カードを集めました",
  quiz: [
    {
      q: "ChatGPTの「T」は何の頭文字でしょう？",
      choices: ["Talk", "Transformer", "Turing"],
      answer: 1,
      explain: "GPT = Generative Pre-trained Transformer。2017年に発表されたトランスフォーマーのしくみを使っています。",
      review: "s6",
    },
    {
      q: "「AIの冬」とは？",
      choices: ["AIが冬にしか動かなかった時期", "期待がしぼんで研究が大きく減った時期", "AIが天気を予測していた時期"],
      answer: 1,
      explain: "大きな期待ほど成果が出ず、関心や研究費が減った時期です。2回ありました。",
      review: "s3",
    },
    {
      q: "次のうち、いちばん先に起きたことは？",
      choices: ["アルファ碁がイ・セドル九段に勝った", "トランスフォーマーが発表された", "ChatGPTが公開された"],
      answer: 0,
      explain: "アルファ碁 2016年 → トランスフォーマー 2017年 → ChatGPT 2022年の順です。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第3章 AI 70年の年表",
    learn: "学習",
    rule: "ルール",
    winter: "冬",
    gpt: "GPTのT",
    note: "年と年の間隔は実際の比率ではありません",
  },
};
