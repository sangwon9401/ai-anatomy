import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];

// an illustrative 2-D embedding map (示意数据): six themed groups of five words, plus '包' between 食物, 随身物品 and 身体.
// zh: the Korean map's '배' (pear / boat / belly) becomes '包' (包子 bun / 背包 bag / a bump on the skin), the word chapter 45
// uses, so the fruit and vehicle groups become food and things you carry. Every word keeps its Korean counterpart's
// coordinates, so neighbours and odd-one-out answers are unchanged (checked with a script).
export const UNIVERSE: { w: string; v: P2; g: number }[] = [
  { w: "小狗", v: [1.4, 9.1], g: 0 },
  { w: "小猫", v: [0.55, 8.55], g: 0 },
  { w: "兔子", v: [2.1, 8.45], g: 0 },
  { w: "仓鼠", v: [1.25, 7.9], g: 0 },
  { w: "老虎", v: [1.95, 7.4], g: 0 },
  { w: "饺子", v: [8.5, 8.6], g: 1 },
  { w: "面条", v: [7.65, 8.05], g: 1 },
  { w: "米饭", v: [9.2, 7.95], g: 1 },
  { w: "馒头", v: [8.35, 7.4], g: 1 },
  { w: "粽子", v: [9.05, 6.9], g: 1 },
  { w: "钥匙", v: [8.3, 2.7], g: 2 },
  { w: "雨伞", v: [7.45, 2.15], g: 2 },
  { w: "手机", v: [9, 2.05], g: 2 },
  { w: "水杯", v: [8.15, 1.5], g: 2 },
  { w: "眼镜", v: [8.85, 1], g: 2 },
  { w: "头", v: [4.3, 2.5], g: 3 },
  { w: "腿", v: [3.45, 1.95], g: 3 },
  { w: "胳膊", v: [5, 1.85], g: 3 },
  { w: "手", v: [4.15, 1.3], g: 3 },
  { w: "肩膀", v: [4.85, 0.8], g: 3 },
  { w: "学校", v: [1.4, 5.5], g: 4 },
  { w: "老师", v: [0.55, 4.95], g: 4 },
  { w: "作业", v: [2.1, 4.85], g: 4 },
  { w: "教室", v: [1.25, 4.3], g: 4 },
  { w: "考试", v: [1.95, 3.8], g: 4 },
  { w: "云", v: [5, 9.6], g: 5 },
  { w: "风", v: [4.15, 9.05], g: 5 },
  { w: "台风", v: [5.7, 8.95], g: 5 },
  { w: "梅雨", v: [4.85, 8.4], g: 5 },
  { w: "阳光", v: [5.55, 7.9], g: 5 },
  { w: "包", v: [6.6, 4.8], g: -1 },
];
export const UNI_GROUPS: { name: string; c: Highlighter }[] = [
  { name: "动物", c: "yellow" },
  { name: "食物", c: "pink" },
  { name: "随身物品", c: "sky" },
  { name: "身体", c: "orange" },
  { name: "学校", c: "mint" },
  { name: "天气", c: "violet" },
];

export const dist2 = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const wordAt = (w: string) => UNIVERSE.find((x) => x.w === w)!;
export function nearest(w: string, k = 5) {
  const me = wordAt(w);
  return UNIVERSE.filter((x) => x.w !== w)
    .map((x) => ({ ...x, d: dist2(me.v, x.v) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
}
/** the word whose average distance to the other three is largest */
export function oddOne(words: string[]) {
  const avg = words.map((w) => words.filter((x) => x !== w).reduce((s, x) => s + dist2(wordAt(w).v, wordAt(x).v), 0) / (words.length - 1));
  return words[avg.indexOf(Math.max(...avg))];
}
export const ODD_ROUNDS = [
  ["饺子", "面条", "米饭", "钥匙"],
  ["小狗", "小猫", "水杯", "兔子"],
  ["老师", "作业", "教室", "馒头"],
  ["云", "风", "台风", "胳膊"],
  ["头", "腿", "眼镜", "手"],
];
// s6: two sentences that pull '包' toward one meaning (ch45)
export const BAE_SENTENCES = [
  { text: "腿上被蚊子叮了个包", g: 3 },
  { text: "她背着包去上学", g: 2 },
];

export const ch35: ChapterSpec = {
  id: 35,
  part: 3,
  title: "探索嵌入宇宙",
  core: false,
  hook: "在词语地图上，“小狗”旁边住着谁？“包”又在哪儿？",
  steps: [
    { id: "s1", sec: 7.5, narration: "来探索一下我们做出的嵌入宇宙吧。31 个词摊在一张二维地图上，位置是示意数据。" },
    { id: "s2", sec: 7, narration: "搜索“小狗”，离得近的词会依次亮起来：兔子、小猫、仓鼠……全都是动物。" },
    { id: "s3", sec: 8.5, narration: "远近是按距离排的（第 8 章）。真正的 AI 搜索更常用点积（第 9 章），比较方向有多一致。" },
    { id: "s4", sec: 7, narration: "还可以玩“找不同”：饺子、面条、米饭、钥匙。只有钥匙孤零零地离得很远。" },
    { id: "s5", sec: 8, narration: "那“包”在哪儿呢？它夹在食物、随身物品和身体三群之间，因为它有好几个意思。" },
    { id: "s6", sec: 8.5, narration: "一个词只有一个位置，到底是哪种包，要看句子才知道。这个问题由第 45 章的注意力来解决。" },
    { id: "s7", sec: 8.5, narration: "真实的嵌入，以 GPT-3 为例有 12,288 维。这张地图是把它压成二维的影子，所以有些地方会变形。" },
    { id: "s8", sec: 7, narration: "在嵌入宇宙里，近就是像，方向代表关系。现在，词变成了带着意思的数字。" },
  ],
  playgroundTitle: "探索嵌入宇宙",
  playgroundIntro: "点一个词，离它近的邻居会按顺序亮起来。也来挑战下面的“找不同”吧。",
  summary: [
    "在嵌入空间里，离得近的词意思也相近。搜索 = 找最近的点。",
    "像“包”这样有好几个意思的词，会夹在几群词之间。",
    "到底是哪个意思，要看句子才知道。这件事由注意力（第 45 章）来做。",
  ],
  unlocks: "语义搜索",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "在嵌入地图上，离“小狗”最近的会是哪个词？",
      choices: ["钥匙", "小猫", "云"],
      answer: 1,
      explain: "和相似的周围词一起出现的动物们聚在一起。",
      review: "s2",
    },
    {
      q: "“包”夹在食物、随身物品和身体三群之间，原因是？",
      choices: ["因为它只有一个字", "因为它有好几个意思，会和几群词的周围词一起出现", "因为它是最常用的词"],
      answer: 1,
      explain: "吃的包子、背的包、身上起的包。周围的词混在一起，所以坐标也在中间。",
      review: "s5",
    },
    {
      q: "在每个句子里替“包”选出意思的，是第几章要学的内容？",
      choices: ["第 29 章 分词器", "第 32 章 独热编码", "第 45 章 注意力"],
      answer: 2,
      explain: "注意力会看周围的词，把“包”的向量改成适合这句话的意思。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 35 章 探索嵌入宇宙",
    title: "嵌入宇宙（示意数据）",
    search: "搜索：",
    dog: "小狗",
    ranks: "由近到远",
    distNote: "按距离排序（第 8 章）",
    cosine1: "真正的搜索常比较方向",
    cosine2: "（点积，第 9 章）",
    odd: "找不同",
    oddAns: "只有钥匙离得远！",
    bae: "包",
    baeQ: "“包”在哪儿？",
    fruit: "吃的包",
    boat: "背的包",
    belly: "身上的包",
    many: "意思有好几个，所以夹在中间",
    one: "一个词 = 一个位置",
    attn: "是哪种包，句子会告诉你 → 第 45 章 注意力",
    dims: "真实的：12,288 维（GPT-3）",
    shadow: "地图 = 压成二维的影子",
    twist: "所以有些地方会变形",
    sum1: "近就是像",
    sum2: "方向是关系",
    sum3: "词 → 带着意思的数字，完成",
  },
};
