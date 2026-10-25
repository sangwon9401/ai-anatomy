import type { ChapterSpec } from "../../../data/types";

// more classmates for the clustering beat: two taste groups
export const CLASS: { name: string; v: [number, number] }[] = [
  { name: "子涵", v: [8.5, 2] },
  { name: "浩宇", v: [9, 4] },
  { name: "欣怡", v: [7.5, 1.5] },
  { name: "宇轩", v: [6.5, 2.5] },
  { name: "思彤", v: [3, 8] },
  { name: "梓萱", v: [1.5, 7.5] },
  { name: "一诺", v: [2.5, 10] },
  { name: "俊熙", v: [3.5, 9] },
];

// an illustrative 2-D word map (real embeddings have thousands of dimensions)
export const WORDS: { w: string; v: [number, number] }[] = [
  { w: "苹果", v: [1.6, 8.2] },
  { w: "梨", v: [3.4, 8.8] },
  { w: "葡萄", v: [2.2, 9.9] },
  { w: "小狗", v: [8, 8.2] },
  { w: "小猫", v: [8.9, 7] },
  { w: "兔子", v: [7.3, 6.2] },
  { w: "公交车", v: [6.4, 2.4] },
  { w: "地铁", v: [8.2, 1.4] },
  { w: "自行车", v: [5.6, 0.6] },
];

export const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const ch08: ChapterSpec = {
  id: 8,
  part: 1,
  title: "离得近就相似",
  core: false,
  hook: "能用数字找出和自己口味相近的同学吗？",
  steps: [
    { id: "s1", sec: 6, narration: "把上一章的箭头只留下终点。一个点就代表一位同学的口味。" },
    { id: "s2", sec: 8, narration: "两个点离得近，说明口味相近。距离可以用初中学过的勾股定理来算。" },
    { id: "s3", sec: 9, narration: "小雨和小美横向差 1，纵向差 1，距离是根号 2，约 1.4。小雨和小杰约 8.5。小美近得多。" },
    { id: "s4", sec: 7, narration: "同学一多，点就会聚成几群：爱辣派和爱甜派。离得近的点会凑到一起。" },
    { id: "s5", sec: 7, narration: "AI 也用这个原理找相似的东西。推荐歌曲、找相似的照片，说到底都是找最近的点。" },
    { id: "s6", sec: 8, narration: "词也能画成点。意思相近的词会聚在一起：水果挨着水果，动物挨着动物。第 33 章会细讲。" },
    { id: "s7", sec: 6, narration: "离得近就相似。下一章，我们用方向而不是距离来衡量相似：点积。" },
  ],
  playgroundTitle: "和我最像的同学",
  playgroundIntro: "点一下平面，标出你的口味。程序会量出到每位同学的距离，按从近到远排好。",
  summary: [
    "向量的终点离得近，就说明相似。",
    "距离用勾股定理算：√(横向差² + 纵向差²)。",
    "相似的东西会聚在一起。推荐和词义都是“找最近的点”。",
  ],
  unlocks: "距离",
  unlockLabel: "得到了一件数学工具",
  quiz: [
    {
      q: "(8, 3) 和 (7, 4) 之间的距离是多少？",
      choices: ["√2，约 1.4", "2", "15"],
      answer: 0,
      explain: "横向差 1，纵向差 1。√(1² + 1²) = √2。",
      review: "s3",
    },
    {
      q: "两个点离得近，说明什么？",
      choices: ["数字很大", "口味（性质）相近", "两个点都在原点"],
      answer: 1,
      explain: "每一格都有意思，所以数字相近，性质也相近。",
      review: "s2",
    },
    {
      q: "AI 推荐相似的歌曲时，用的是什么原理？",
      choices: ["挑最新的歌", "找最近的点", "挑歌名相似的歌"],
      answer: 1,
      explain: "把歌曲变成向量，再找离你喜欢的歌最近的点。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 8 章 离得近就相似",
    spicy: "辣味",
    sweet: "甜味",
    minji: "小雨",
    junho: "小杰",
    seoyeon: "小美",
    pyth: "距离 = √(横² + 纵²)",
    d1: "√(1² + 1²) = √2 ≈ 1.4",
    d2: "√(6² + 6²) ≈ 8.5",
    closer: "小美近得多",
    spicyTeam: "爱辣派",
    sweetTeam: "爱甜派",
    recommend: "推荐 = 找最近的点",
    song: "我喜欢的歌",
    suggest: "推荐！",
    fruit: "水果",
    animal: "动物",
    ride: "交通工具",
    wordMap: "词语地图（示意数据）",
    sum: "离得近就相似",
    next: "下一章：用方向来量的点积",
  },
};
