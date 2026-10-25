import type { ChapterSpec, Highlighter } from "../../../data/types";

export type P2 = [number, number];
export type WordMap = { key: string; name: string; c: Highlighter; words: { w: string; v: P2 }[]; presets: [string, string, string][] };

// illustrative 2-D word maps (示意数据). Same coordinates as the Korean maps, so every preset analogy still lands nearest
// its target (checked with this file's analogy()). zh: the capital map uses 中国/北京; Chinese verbs have no past tense,
// so the third map is singular → plural with 们 (朋友 → 朋友们), a grammatical relation Chinese does mark.
export const MAPS: WordMap[] = [
  {
    key: "people",
    name: "人物",
    c: "yellow",
    words: [
      { w: "男人", v: [2, 2] },
      { w: "女人", v: [2, 5] },
      { w: "国王", v: [7, 2.5] },
      { w: "女王", v: [7.2, 5.3] },
      { w: "男孩", v: [0.8, 1.2] },
      { w: "女孩", v: [0.9, 4.3] },
      { w: "王子", v: [5.4, 1.6] },
      { w: "公主", v: [5.6, 4.7] },
      { w: "爸爸", v: [3.5, 2.8] },
      { w: "妈妈", v: [3.6, 5.9] },
    ],
    presets: [
      ["国王", "男人", "女人"],
      ["王子", "男孩", "女孩"],
      ["爸爸", "男人", "女人"],
    ],
  },
  {
    key: "capital",
    name: "国家和首都",
    c: "sky",
    words: [
      { w: "中国", v: [1.5, 6] },
      { w: "北京", v: [2.1, 2.6] },
      { w: "日本", v: [4.2, 6.4] },
      { w: "东京", v: [4.9, 3.1] },
      { w: "法国", v: [7.2, 6.1] },
      { w: "巴黎", v: [7.7, 2.6] },
    ],
    presets: [
      ["北京", "中国", "日本"],
      ["巴黎", "法国", "中国"],
      ["东京", "日本", "法国"],
    ],
  },
  {
    key: "tense",
    name: "单数和复数",
    c: "mint",
    words: [
      { w: "朋友", v: [1.4, 6] },
      { w: "朋友们", v: [2.2, 2.7] },
      { w: "同学", v: [4.4, 6.5] },
      { w: "同学们", v: [5.1, 3.1] },
      { w: "老师", v: [7.3, 5.9] },
      { w: "老师们", v: [8.1, 2.4] },
    ],
    presets: [
      ["朋友们", "朋友", "同学"],
      ["老师们", "老师", "朋友"],
      ["同学们", "同学", "老师"],
    ],
  },
];

export const vecOf = (m: WordMap, w: string) => m.words.find((x) => x.w === w)!.v;
/** a − b + c, and the nearest word that is not one of the inputs (as Word2Vec demos do) */
export function analogy(m: WordMap, a: string, b: string, c: string) {
  const [va, vb, vc] = [vecOf(m, a), vecOf(m, b), vecOf(m, c)];
  const r: P2 = [va[0] - vb[0] + vc[0], va[1] - vb[1] + vc[1]];
  const ranked = m.words
    .filter((x) => x.w !== a && x.w !== b && x.w !== c)
    .map((x) => ({ w: x.w, d: Math.hypot(x.v[0] - r[0], x.v[1] - r[1]) }))
    .sort((p, q) => p.d - q.d);
  return { r, best: ranked[0] };
}

// s1–s2: guess a word from its neighbours (zh: the blank is the last chip; the scene overlay marks 1–3 as hints)
export const CONTEXT = ["昨天", "在咖啡馆", "喝了", "一杯热", "＿＿"];
export const CANDIDATES = [
  { w: "咖啡", fits: true },
  { w: "绿茶", fits: true },
  { w: "可可", fits: true },
  { w: "自行车", fits: false },
];
// s3: a sliding window over a sentence (Word2Vec practice); the window ends centred on index 2 (咖啡)
export const WINDOW = ["早上", "喝", "咖啡", "是", "我的", "习惯"];
// s4: before/after training on a small map
export const DRINKS: { w: string; from: P2; to: P2; c: Highlighter }[] = [
  { w: "咖啡", from: [6.8, 5.6], to: [2.3, 5.2], c: "orange" },
  { w: "绿茶", from: [1.6, 1.8], to: [3.1, 5.9], c: "orange" },
  { w: "可可", from: [4.6, 3.4], to: [2.2, 6.4], c: "orange" },
  { w: "自行车", from: [3.0, 6.2], to: [7.0, 1.8], c: "sky" },
  { w: "地铁", from: [7.6, 2.4], to: [7.8, 2.8], c: "sky" },
];

export const ch34: ChapterSpec = {
  id: 34,
  part: 3,
  title: "周围的词透露意思",
  core: false,
  hook: "从来没人教过 AI 词的意思，它怎么知道“咖啡”和“绿茶”很像？",
  steps: [
    { id: "s1", sec: 8.5, narration: "“昨天在咖啡馆喝了一杯热＿＿。”空格里该填什么？就算第一次见到这句话，看看周围的词也能猜出来。", tts: "昨天在咖啡馆喝了一杯热什么呢？空格里该填什么？就算第一次见到这句话，看看周围的词也能猜出来。" },
    { id: "s2", sec: 8.5, narration: "咖啡、绿茶、可可，能出现在同一个位置的词，意思也相近。词的意思由周围的词透露，这叫分布假说。" },
    { id: "s3", sec: 9, narration: "2013 年的 Word2Vec 把这个想法变成了训练：看一个词，猜它周围的词，反复练习非常多次。" },
    { id: "s4", sec: 7.5, narration: "练完以后，周围的词相似的那些词，向量就靠近了。而这期间没有任何人告诉它意思。" },
    { id: "s5", sec: 8, narration: "神奇的是，方向里也藏着意思。从男人指向女人的箭头，和从国王指向女王的箭头几乎一样。" },
    { id: "s6", sec: 9, narration: "所以算一算国王 − 男人 + 女人，就会落在女王旁边：(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)。", tts: "所以算一算国王减男人加女人，就会落在女王旁边：7、2.5 减 2、2，加 2、5，等于 7、5.5。" },
    { id: "s7", sec: 8.5, narration: "北京 − 中国 + 日本 ≈ 东京也成立。真正的 Word2Vec 有几百维，不会总是这么准。这张地图是示意数据。", tts: "北京减中国加日本，约等于东京，也成立。真正的 Word2Vec 有几百维，不会总是这么准。这张地图是示意数据。" },
    { id: "s8", sec: 7.5, narration: "词的意思由周围的词透露。GPT 的嵌入也是在猜下一个片段的过程中，用同样的方式学到意思的。" },
  ],
  playgroundTitle: "词语计算器",
  playgroundIntro: "选好 A − B + C。顺着箭头走到终点，离终点最近的词就是答案。找找算得刚好的组合吧。",
  summary: [
    "分布假说：能出现在同一位置（周围的词相似）的词，意思也相近。",
    "Word2Vec（2013）：通过猜周围的词来练习，做出词向量。",
    "方向里也藏着意思：国王 − 男人 + 女人 ≈ 女王。",
  ],
  unlocks: "分布假说",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "“词的意思由周围的词透露”这个想法叫什么？",
      choices: ["概率分布", "独热编码", "分布假说"],
      answer: 2,
      explain: "能出现在同一位置的词，意思相近。Word2Vec 把它变成了训练。",
      review: "s2",
    },
    {
      q: "Word2Vec 用什么练习来做出词向量？",
      choices: ["背词典里的释义", "看一个词，猜它周围的词", "把词按拼音排序"],
      answer: 1,
      explain: "反复猜周围的词，周围相似的词的向量就会靠近。",
      review: "s3",
    },
    {
      q: "在本章的地图里，国王 (7, 2.5) − 男人 (2, 2) + 女人 (2, 5) = ？",
      choices: ["(11, 9.5) → 什么也没有", "(3, 0.5) → 男孩附近", "(7, 5.5) → 女王附近"],
      answer: 2,
      explain: "横向 7 − 2 + 2 = 7，纵向 2.5 − 2 + 5 = 5.5。就在女王 (7.2, 5.3) 旁边。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 34 章 周围的词透露意思",
    guess: "空格里该填什么？",
    hint: "周围的词就是提示！",
    fits: "都说得通",
    nofit: "说不通",
    hypo: "词的意思由周围的词透露",
    hypoName: "分布假说",
    w2v: "Word2Vec（2013）",
    practice: "看中间的词，猜周围的词",
    guessIt: "猜猜看！",
    millions: "用海量句子反复练习",
    before: "练习前",
    after: "练习后：周围相似就靠近",
    noOne: "没人告诉过它意思",
    dir: "方向里也有意思",
    same: "同一个箭头！",
    calc: "国王 − 男人 + 女人",
    calcNum: "(7, 2.5) − (2, 2) + (2, 5) = (7, 5.5)",
    land: "≈ 女王",
    capital: "北京 − 中国 + 日本 ≈ 东京",
    real: "真实的有几百维，不总是这么准",
    example: "示意数据地图",
    sum: "意思 = 周围的词",
    gpt: "GPT 的嵌入也靠猜下一个片段学到意思",
    minus: "− 男人",
    minusKor: "中国 → 日本",
    ok: "○",
    no: "✕",
    plus: "+ 女人",
  },
};
