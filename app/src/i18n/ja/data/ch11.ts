import type { ChapterSpec } from "../../../data/types";

export type M2 = [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]

export const apply = (m: M2, v: [number, number]): [number, number] => [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
export const lerpM = (a: M2, b: M2, t: number): M2 => a.map((x, i) => x + (b[i] - x) * t) as M2;

export const I2: M2 = [1, 0, 0, 1];
export const WORKED: { m: M2; v: [number, number] } = { m: [2, 1, 0, 1], v: [1, 2] };

export const PRESETS: { key: string; m: M2 }[] = [
  { key: "stretch", m: [2, 0, 0, 1] },
  { key: "rotate", m: [0, -1, 1, 0] },
  { key: "shear", m: [1, 1, 0, 1] },
  { key: "flip", m: [-1, 0, 0, 1] },
];

export const ch11: ChapterSpec = {
  id: 11,
  part: 1,
  title: "行列の積 = 空間の変換",
  core: true,
  hook: "行列をベクトルにかけると、何が起きるのでしょう？",
  steps: [
    { id: "s1", sec: 7, narration: "行列にベクトルをかけてみましょう。かけると、新しいベクトルが出てきます。" },
    { id: "s2", sec: 11, narration: "計算は第9章の内積で行います。行列の1行目とベクトルの内積が結果の1つ目のマス、2行目との内積が2つ目のマスです。" },
    { id: "s3", sec: 9, narration: "図で見るとこうなります。方眼紙のすべての点に同じ行列をかけると、空間全体が横にのびます。" },
    { id: "s4", sec: 10, narration: "行列を変えると、変わり方も変わります。空間を回したり、ななめにずらしたりもします。" },
    { id: "s5", sec: 9, narration: "どんな行列でも、直線は直線のまま、原点はその場所のまま。このような変換を線形変換といいます。" },
    { id: "s6", sec: 10, narration: "GPTは単語ベクトルに行列をかけて、意味の空間をあちこち変えます。アテンションのQuery、Key、Valueも行列の積で作ります。" },
    { id: "s7", sec: 8, narration: "行列の積は空間を変える機械。この機械の中の数字を決めることこそ、AIの学習です。" },
  ],
  playgroundTitle: "空間を変える機械",
  playgroundIntro: "行列の4つの数字を変えたり、ボタンを押したりしてみましょう。方眼紙全体がどう変わるかが見えます。",
  summary: [
    "行列 × ベクトル = 新しいベクトル。各マスは「行列の行 · ベクトル」の内積。",
    "すべての点に同じ行列をかけると、空間がのびたり、回ったり、ずれたりする。",
    "直線は直線のまま、原点はそのまま（線形変換）。GPTの層も行列の積。",
  ],
  unlocks: "行列の積",
  unlockLabel: "数学の道具をひとつ手に入れました",
  quiz: [
    {
      q: "行列 [[1, 0], [0, 3]] にベクトル (2, 1) をかけると？",
      choices: ["(2, 3)", "(3, 2)", "(2, 1)"],
      answer: 0,
      explain: "1行目 (1, 0)·(2, 1) = 2、2行目 (0, 3)·(2, 1) = 3。だから (2, 3) です。",
      review: "s2",
    },
    {
      q: "行列 [[2, 0], [0, 1]] をすべての点にかけると、空間は？",
      choices: ["横に2倍のびる", "縦に2倍のびる", "そのまま"],
      answer: 0,
      explain: "横の座標だけが2倍になり、縦の座標はそのままです。",
      review: "s3",
    },
    {
      q: "線形変換で、いつも変わらないものは？",
      choices: ["原点の位置", "すべての点の位置", "すべての矢印の長さ"],
      answer: 0,
      explain: "原点にどんな行列をかけても (0, 0) です。直線も直線のまま残ります。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第11章 行列の積 = 空間の変換",
    times: "行列 × ベクトル = 新しいベクトル",
    row1: "1行目 · ベクトル",
    row2: "2行目 · ベクトル",
    stretch: "のばす",
    rotate: "回す",
    shear: "ずらす",
    flip: "裏返す",
    every: "どの点にも同じ行列",
    straight: "直線はまっすぐ",
    origin: "原点はそのまま",
    linear: "線形変換",
    gpt: "単語ベクトル × 行列",
    newSpace: "意味の空間が変わる",
    qkv: "Query、Key、Valueも行列の積（第46章）",
    learn: "行列の中の数字 = 学習で決める",
    sum: "行列の積 = 空間を変える機械",
    cat: "ねこ",
    dog: "犬",
    car: "車",
  },
};
