import { ROUND1 } from "../../../data/ch01";
import { TOY_PROMPT, generate } from "../../../data/part9-toy";
import type { ChapterSpec } from "../../../data/types";

// The ch01 distribution for "私は 今日 学校に ___" (illustrative): 行く 52, 行った 21, 遅れた 12, (4th word of ch01) 9, ピザ 1, その他 5.
export const WHEEL = ROUND1;
export const PROMPT80 = TOY_PROMPT;

// Greedy with the Part 9 toy model loops: 行く そして 友と 会った そして 友と 会った …
export const GREEDY_LOOP = generate(0, () => 0).slice(0, 8);

// The s5 spin lands on 行った; the s6 spins give these twelve results (a typical-looking run, fixed for the video).
// Written as WHEEL positions so the words always match ch01's wheel.
export const SPIN_FIRST = WHEEL[1].w;
export const SPINS = [0, 1, 0, 0, 2, 0, 1, 0, 3, 0, 2, 1].map((i) => WHEEL[i].w);

export const ch80: ChapterSpec = {
  id: 80,
  part: 9,
  title: "選び方",
  core: false,
  hook: "いちばん確率の高い言葉を選ぶだけでいいのでは？",
  steps: [
    { id: "s1", sec: 7.5, narration: "「私は今日学校に」の次の言葉の確率が出ました。この中から1つを選びます。どう選びましょう？" },
    { id: "s2", sec: 8.5, narration: "1つめはグリーディ。欲張りのように、毎回確率1位だけを選びます。ここでは「行く」です。" },
    { id: "s3", sec: 8, narration: "グリーディはぶれません。同じ文を何回入れても1位を選ぶので、答えは毎回同じです。" },
    { id: "s4", sec: 8.5, narration: "そのかわり、同じ言葉をぐるぐる回りがちです。1位だけを追うと、「そして友と会った」が何度もくり返されます。" },
    { id: "s5", sec: 8.5, narration: "2つめはサンプリング。確率の大きさでマスを分けたルーレットを回します。第13章のくじ引きです。" },
    { id: "s6", sec: 8.5, narration: "何回も回すと「行く」がいちばん多く出ますが、「行った」や「遅れた」も出ます。毎回結果がちがいます。" },
    { id: "s7", sec: 10, narration: "ChatGPTはふつうサンプリングを使うので、同じ質問でも答えが少しずつちがいます。マスの大きさは次の章の温度で変えます。" },
  ],
  playgroundTitle: "グリーディ vs ルーレット",
  playgroundIntro: "同じ確率の表で、2つの方法をくらべてみましょう。「1語選ぶ」と「文の最後まで書く」を、それぞれ何回か押してみてください。",
  summary: [
    "グリーディ：毎回確率1位だけを選ぶ。ぶれないが、同じ言葉をぐるぐる回りやすい。",
    "サンプリング：確率の大きさでマスを分けたルーレットを回す。回すたびに結果が変わる。",
    "ChatGPTはふつうサンプリングを使うので、同じ質問でも答えが少しずつちがう。",
  ],
  unlocks: "グリーディ・サンプリング",
  unlockLabel: "推論の道具をひとつ手に入れました",
  quiz: [
    {
      q: "グリーディは次の言葉をどう選ぶでしょう？",
      choices: ["毎回いちばん確率の高い言葉を選ぶ", "確率の大きさでマスを分けたルーレットを回す", "いちばん長い言葉を選ぶ"],
      answer: 0,
      explain: "グリーディは欲張りのように、いつも1位だけを選びます。",
      review: "s2",
    },
    {
      q: "同じ文の続きを、グリーディで3回書かせると？",
      choices: ["毎回ちがう答えになる", "3回とも同じ答えになる", "だんだん答えが短くなる"],
      answer: 1,
      explain: "確率の表が同じなら1位も同じなので、グリーディはいつも同じ答えを出します。",
      review: "s3",
    },
    {
      q: "ChatGPTに同じ質問を2回すると答えが少しずつちがうのは、なぜでしょう？",
      choices: ["インターネットの検索結果がそのたびに変わるから", "モデルがときどき故障するから", "次の言葉を確率にしたがってルーレットのように選ぶから"],
      answer: 2,
      explain: "サンプリングは回すたびに結果が変わります。だから答えも少しずつ変わります（第2章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第80章 選び方",
    example: "確率は説明用の例",
    how: "どう選ぶ？",
    way1: "方法1",
    way2: "方法2",
    greedy: "グリーディ",
    greedyEn: "greedy = 欲張り",
    top: "毎回1位だけ！",
    run: "回目",
    same: "何回やっても同じです",
    loop: "ぐるぐる回る",
    again: "また！",
    sampling: "サンプリング",
    wheel: "確率どおりのマス",
    other: "その他",
    thisTime: `「${SPIN_FIRST}」！`,
    spins: "12回回してみると",
    times: "回",
    vary: "毎回ちがいます",
    gTop: "いつも1位だけ",
    gSame: "毎回同じ答え",
    gLoop: "同じ言葉をぐるぐる",
    sTop: "確率でルーレット",
    sVary: "毎回ちがう答え",
    sOdd: "たまに変な言葉",
    chatgpt: "ChatGPTはふつうサンプリング",
    next: "マスの大きさは第81章の温度で",
  },
};
