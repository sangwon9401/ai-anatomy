import type { ChapterSpec } from "../../../data/types";

// 10×10 grayscale heart, 0 = black … 255 = white
export const HEART: number[][] = [
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [255, 255, 60, 30, 255, 255, 30, 60, 255, 255],
  [255, 60, 0, 0, 30, 30, 0, 0, 60, 255],
  [255, 30, 0, 0, 0, 0, 0, 0, 30, 255],
  [255, 30, 0, 0, 0, 0, 0, 0, 30, 255],
  [255, 255, 30, 0, 0, 0, 0, 30, 255, 255],
  [255, 255, 255, 30, 0, 0, 30, 255, 255, 255],
  [255, 255, 255, 255, 30, 30, 255, 255, 255, 255],
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
];

export const RGB = { r: 255, g: 200, b: 0 };

// Unicode code points (checked by script): 中 U+4E2D, A U+0041, 天 U+5929
export const CODES = [
  { ch: "中", code: 20013 },
  { ch: "A", code: 65 },
  { ch: "天", code: 22825 },
];
// "天" (sky) sits right next to "太" (too, very) by number, far from "空" (of 天空, "sky") — numbers carry no meaning.
// 太 U+592A, 空 U+7A7A. The zh scene overlay draws 太 below the line and highlights 天 (drawn after 太 so its dot stays on top).
export const NEIGHBORS = [
  { ch: "太", code: 22826 },
  { ch: "天", code: 22825 },
  { ch: "空", code: 31354 },
];

export const ch06: ChapterSpec = {
  id: 6,
  part: 1,
  title: "一切都是数字",
  core: false,
  hook: "电脑是怎样记住照片、歌曲和文字的？",
  steps: [
    { id: "s1", sec: 6, narration: "在电脑里，照片、歌曲、文字全都是以数字的形式存着的。今天我们就来亲眼看看这些数字。" },
    { id: "s2", sec: 8, narration: "把照片一直放大，就会看到一个个小方块，叫作像素。一个像素就是一个表示亮度的数字：0 是黑，255 是白。" },
    { id: "s3", sec: 7, narration: "彩色照片的每个像素要用红、绿、蓝三个数字。把三种光混在一起，就能调出各种颜色。" },
    { id: "s4", sec: 7, narration: "声音是空气的振动。每隔极短的一瞬间，量一下振动的大小，记成数字。CD 每秒要量 44100 次。" },
    { id: "s5", sec: 8, narration: "文字也一样，每个字都有固定的编号。“中”是 20013 号，“A”是 65 号。这张编号表叫作 Unicode（统一码）。" },
    { id: "s6", sec: 8, narration: "可是编号看不出意思。“天”和“太”编号紧挨着，和“天空”的“空”却离得很远。编号只是名牌。" },
    { id: "s7", sec: 7, narration: "所以 AI 会把词变成一串带有意思的数字。这串数字就是向量。下一章见。" },
  ],
  playgroundTitle: "用数字画画",
  playgroundIntro: "点格子画一幅画，旁边会马上显示这幅画的数字。下面还可以查一查文字的编号。",
  summary: [
    "照片按像素存成亮度数字（或红、绿、蓝三个数字）。",
    "声音是每一瞬间量到的振动大小，文字是 Unicode 编号。",
    "编号本身没有意思，所以 AI 要用带有意思的一串数字（向量）。",
  ],
  unlocks: "变成数字",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "黑白照片的一个像素表示什么？",
      choices: ["这一格的亮度", "拍照的日期", "整张照片的大小"],
      answer: 0,
      explain: "一个像素 = 一个亮度数字，通常从 0（黑）到 255（白）。",
      review: "s2",
    },
    {
      q: "彩色照片的一个像素需要几个数字？",
      choices: ["1 个", "3 个（红、绿、蓝）", "10 个"],
      answer: 1,
      explain: "用三个数字写下三种色光各要混多少。",
      review: "s3",
    },
    {
      q: "两个字的编号（Unicode）挨得近，意思就相近吗？",
      choices: ["是", "不是，编号只是名牌", "只有汉字是这样"],
      answer: 1,
      explain: "“天”和“太”编号紧挨着，意思却没关系。（汉字大致按部首排号，所以同部首的字常常挨着，但编号本身不表示意思。）因此需要另一种装着意思的数字：向量。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 6 章 一切都是数字",
    photo: "照片",
    song: "歌曲",
    letter: "文字",
    pixel: "像素",
    black: "0 = 黑",
    white: "255 = 白",
    red: "红",
    green: "绿",
    blue: "蓝",
    mixed: "混在一起是黄色",
    second: "每秒量 44100 次",
    unicode: "Unicode 编号",
    near: "编号紧挨着 ↘",
    far: "天空的“空”很远",
    nameTag: "编号 = 名牌，没有意思",
    vector: "带有意思的一串数字 = 向量",
    next: "下一章：第 7 章 向量",
    apple: "苹果",
  },
};
