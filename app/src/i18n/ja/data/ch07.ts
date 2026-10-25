import type { ChapterSpec, Highlighter } from "../../../data/types";

export type Friend = { name: string; v: [number, number]; c: Highlighter };

// taste vectors: (辛さ, 甘さ), each 0–10. Reused in chapters 8 and 9.
export const FRIENDS: Friend[] = [
  { name: "ゆい", v: [8, 3], c: "pink" },
  { name: "はると", v: [2, 9], c: "mint" },
  { name: "さくら", v: [7, 4], c: "sky" },
];

export const FLAVORS4 = [
  { name: "辛さ", v: 8 },
  { name: "甘さ", v: 3 },
  { name: "しょっぱさ", v: 5 },
  { name: "すっぱさ", v: 2 },
];

export const ch07: ChapterSpec = {
  id: 7,
  part: 1,
  title: "ベクトル：数字の列",
  core: true,
  hook: "友だちと自分の食べ物の好みがどれくらい似ているか、数字で表せるでしょうか？",
  steps: [
    { id: "s1", sec: 7, narration: "好みを数字で書いてみましょう。辛いものがどれくらい好きかを0から10、甘いものも0から10で。" },
    { id: "s2", sec: 9, narration: "ゆいは辛さ8、甘さ3。これをかっこでまとめて(8, 3)と書きます。このように数字を順番に並べたものをベクトルといいます。" },
    { id: "s3", sec: 8, narration: "ベクトルは矢印でかけます。横は辛さ、縦は甘さ。原点から(8, 3)まで矢印を引くと、それがゆいの好みです。" },
    { id: "s4", sec: 8, narration: "はるとは(2, 9)、さくらは(7, 4)。矢印の向きを見るだけで、だれとだれの好みが似ているかわかります。" },
    { id: "s5", sec: 10, narration: "マスを増やすともっとくわしくなります。しょっぱさ、すっぱさも入れれば数字4つのベクトル。マスの数を次元といいます。" },
    { id: "s6", sec: 10, narration: "GPTは単語1つをとても長いベクトルで表します。GPT-3は単語ごとに数字を12,288個使います。図にはかけませんが、しくみは同じです。" },
    { id: "s7", sec: 8, narration: "ベクトルは意味のある数字の列。次の章では、2つのベクトルがどれくらい近いかをはかります。" },
  ],
  playgroundTitle: "自分の好みの矢印",
  playgroundIntro: "スライダーで自分の好みを決めてみましょう。矢印とベクトルがいっしょに変わります。",
  summary: [
    "ベクトル：数字を順番に並べてまとめたもの。マスごとに意味がある。",
    "2マスのベクトルは、平面の上の矢印としてかける。",
    "マスの数 = 次元。GPT-3の単語ベクトルは12,288次元。",
  ],
  unlocks: "ベクトル",
  unlockLabel: "数学の道具をひとつ手に入れました",
  quiz: [
    {
      q: "ゆいの好み(8, 3)の8は何でしょう？",
      choices: ["辛さの点数", "甘さの点数", "ゆいの年齢"],
      answer: 0,
      explain: "ベクトルはマスの順番が大事です。1つ目のマス = 辛さ、2つ目のマス = 甘さと決めました。",
      review: "s2",
    },
    {
      q: "(8, 3, 5, 2)は何次元のベクトルでしょう？",
      choices: ["2次元", "4次元", "18次元"],
      answer: 1,
      explain: "数字が4つなので4次元です。数字を足した値とは関係ありません。",
      review: "s5",
    },
    {
      q: "GPT-3が単語1つを表すのに使う数字はいくつでしょう？",
      choices: ["2個", "100個", "12,288個"],
      answer: 2,
      explain: "図にかけないほど多いマスですが、「数字の列」というしくみはまったく同じです。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第7章 ベクトル：数字の列",
    spicy: "辛さ",
    sweet: "甘さ",
    salty: "しょっぱさ",
    sour: "すっぱさ",
    minji: "ゆい",
    junho: "はると",
    seoyeon: "さくら",
    vector: "ベクトル",
    origin: "原点",
    similar: "似てる",
    arrowSE: "↘",
    dims: "4次元ベクトル",
    dimNote: "マスの数 = 次元",
    noDraw: "4次元は矢印ではかけません。棒グラフなら見られます",
    gpt: "GPT-3の単語1つ",
    count: "数字12,288個",
    same: "しくみは同じ",
    sum: "ベクトル = 意味のある数字の列",
    word: "学校",
    examples: "(8, 3)·(8, 3, 5, 2)·(…12,288個)",
  },
};
