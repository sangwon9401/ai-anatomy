import { UNLOCK6 } from "../../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKind } from "../../../data/part6-block";
import { PIPELINE } from "../../../data/ch05";
import type { ChapterSpec, Highlighter } from "../../../data/types";

// ---- the boss playground: round 1 builds the block, round 2 the whole blueprint ----
export type Card = { id: string; kind: string; name: string; color: Highlighter | null };
export type Slot = { kind: string; hint: string };

const BLOCK_HINT: Record<BlockKind, string> = {
  norm: "部品に入る直前には、まず数の大きさをそろえます（第57章）。",
  att: "正規化の次には、単語どうしが見合う部品が来ます（第45章）。",
  add: "部品が出した結果は、高速道路の上の元のベクトルに足します（第56章）。",
  ffn: "2回めの正規化の次には、単語ごとに別々に考える部品が来ます（第55章）。",
};
export const BLOCK_SLOTS: Slot[] = BLOCK_ORDER.map((k) => ({ kind: kindOf(k), hint: BLOCK_HINT[kindOf(k)] }));
export const BLOCK_CARDS: Card[] = [
  ...BLOCK_ORDER.map((k, i) => ({ id: `b${i}`, kind: kindOf(k), name: KIND[kindOf(k)].name, color: KIND[kindOf(k)].color })),
  { id: "bx", kind: "softmax", name: "ソフトマックス", color: "mint" },
];

const outer = (key: string) => PIPELINE.find((p) => p.key === key)!;
export const BLOCK_CARD_NAME = "トランスフォーマーブロック × 96";
export const BP_SLOTS: Slot[] = [
  { kind: "tok", hint: "文章を最初に受け取る部品は、文章をかけらに切ります（第29章）。" },
  { kind: "emb", hint: "かけらの番号を、意味のこもった数に変える部品です（第33章）。" },
  { kind: "pos", hint: "何番目のかけらかを教える部品です（第36章）。" },
  { kind: "block", hint: "まん中には、いま組み立てたブロックが96層積まれています。" },
  { kind: "out", hint: "最後のベクトルから次の言葉の確率を出す部品です（第60章）。" },
  { kind: "loop", hint: "最後は確率どおりに1つ選んで、文の最後につなげます（第1、2章）。" },
];
export const BP_CARDS: Card[] = [
  ...["tok", "emb", "pos"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "block", kind: "block", name: BLOCK_CARD_NAME, color: "yellow" },
  ...["out", "loop"].map((k) => ({ id: k, kind: k, name: outer(k).name, color: outer(k).color })),
  { id: "enc", kind: "encoder", name: "エンコーダー（BERT）", color: "sky" },
];

export const DISTRACTOR_HINT: Record<string, string> = {
  softmax: "ソフトマックスはブロックの中ではなく、設計図のいちばん最後、出力にあります（第60章）。",
  encoder: "GPTはデコーダーブロックだけを積みます。エンコーダーはBERTのほうです（第59章）。",
};

/** A fixed shuffle, so every student sees the same tray (and it never starts in order). */
export function shuffled<T>(items: T[], seed = 11) {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const ch62: ChapterSpec = {
  id: 62,
  part: 6,
  title: "Part 6 ボス戦：設計図の完成",
  core: false,
  hook: "部品は全部そろいました。正しい順番に組み立てて、GPTを完成させられるでしょうか？",
  steps: [
    { id: "s1", sec: 8, narration: "Part 6でブロックの部品を1つずつ集めました。さあ、全部組み立てて設計図を完成させましょう。" },
    { id: "s2", sec: 10, narration: "まずはブロック1層から。正規化 → アテンション → 足し算、もう一度正規化 → フィードフォワード → 足し算。" },
    { id: "s3", sec: 8.5, narration: "このブロックを96層積みます。高速道路と正規化のおかげで、深く積んでもゆれません。" },
    { id: "s4", sec: 8.5, narration: "前では、トークナイザー、埋め込み、位置情報が文章をベクトルに変えて入れてくれます（Part 3）。" },
    { id: "s5", sec: 8.5, narration: "後ろでは、出力 + ソフトマックスが次の言葉の確率を出し、1つ選んで文の最後につなげます。" },
    { id: "s6", sec: 8.5, narration: "設計図の機械の部分が全部埋まりました！ 文章を入れると次の言葉が出てくるGPTの完成です。" },
    { id: "s7", sec: 9.5, narration: "でも、部品の中の1,750億個の数はまだでたらめです。Part 7ではこの数に勉強させます。事前学習です。" },
  ],
  playgroundTitle: "設計図を組み立てよう",
  playgroundIntro: "部品カードを空欄までドラッグするか、カードを押してから空欄を押してみましょう。まずブロック1層、次に設計図全体です。関係ないカードも1枚まざっています。",
  summary: [
    "ブロック1層：正規化 → アテンション → 足し算 → 正規化 → フィードフォワード → 足し算。これを96層積む。",
    "設計図：トークナイザー → 埋め込み → 位置情報 → ブロック × 96 → 出力 + ソフトマックス → 選んでつなげる。",
    "機械は完成！ 次は1,750億個の数に勉強させる事前学習（Part 7）。",
  ],
  unlocks: "完成した設計図",
  unlockLabel: UNLOCK6,
  quiz: [
    {
      q: "ブロック1層で、アテンションのすぐ前に来る部品は？",
      choices: ["足し算", "正規化", "フィードフォワード"],
      answer: 1,
      explain: "部品に入る直前に、正規化で大きさをそろえます。GPT-2やGPT-3がこの順番です（第57章）。",
      review: "s2",
    },
    {
      q: "設計図で、文章を最初に受け取る部品は？",
      choices: ["トークナイザー", "埋め込み", "出力 + ソフトマックス"],
      answer: 0,
      explain: "トークナイザーが文章をかけらに切り、埋め込みがかけらを数に変えます（第29章、第33章）。",
      review: "s4",
    },
    {
      q: "設計図を組み立て終えたGPTに、まだ残っている仕事は？",
      choices: ["部品をもう1つはめる", "ソフトマックスを外す", "部品の中の数を学習させる（事前学習）"],
      answer: 2,
      explain: "機械の形は完成しましたが、数は最初はでたらめです。Part 7で事前学習によって直します（第5章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第62章 Part 6 ボス戦：設計図の完成",
    boss: "Part 6 ボス戦",
    got: "集めた部品",
    oneLayer: "ブロック1層",
    layers: "× 96層",
    steady: "深く積んでもゆれないように",
    road: "高速道路（第56章）",
    norm: "正規化（第57章）",
    front: "文章 → ベクトル（Part 3）",
    back: "次の言葉の確率 → 選んでつなげる",
    done: "完成！",
    input: "私は 今日 学校に",
    output: "行く",
    mess: "最初は数がでたらめ",
    next: "次：Part 7 事前学習",
    nextSub: "1,750億個の数に勉強させる",
  },
};
