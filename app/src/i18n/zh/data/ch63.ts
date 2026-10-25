import type { ChapterSpec, Highlighter } from "../../../data/types";

export const SOURCES = ["新闻", "百科全书", "博客", "书", "代码", "论坛"];

export type Kind = "ok" | "dup" | "quality" | "harm";

/** Illustrative mix of 100 collected units (labelled 示意数据 in the scene); real ratios differ by dataset. */
export const MIX: { kind: Kind; n: number; c: Highlighter }[] = [
  { kind: "dup", n: 40, c: "violet" },
  { kind: "quality", n: 30, c: "orange" },
  { kind: "harm", n: 5, c: "pink" },
  { kind: "ok", n: 25, c: "sky" },
];

/** "−40", "−30", "−5": what each filter removes (drawn on the bins). */
export const BIN_CUTS = MIX.slice(0, 3).map((m) => `−${m.n}`);

export type FactoryDoc = { text: string; kind: Kind; why: string };

/** Playground: snippets the student sorts before the filters check them. */
export const FACTORY_DOCS: FactoryDoc[] = [
  { text: "光合作用是植物利用光能制造养分的过程。", kind: "ok", why: "有知识可学的百科文章" },
  { text: "★★超低价★★ 马上点击！点击！免费领券", kind: "quality", why: "广告：没什么可学的" },
  { text: "今天食堂吃咖喱饭，太好吃了，我又去打了一份。", kind: "ok", why: "普通的日常文字也是好教材" },
  { text: "光合作用是植物利用光能制造养分的过程。", kind: "dup", why: "和第 1 条一模一样的复制品" },
  { text: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈", kind: "quality", why: "没有意义的字符堆砌" },
  { text: "for (let i = 0; i < 10; i++) { sum += i; }", kind: "ok", why: "代码也要学" },
  { text: "我们班 XX 的手机号 138-XXXX-XXXX 公开在这里", kind: "harm", why: "含有个人信息的文字" },
  { text: "秦始皇在公元前 221 年统一了六国。", kind: "ok", why: "含有历史知识的文字" },
  { text: "喂你这个 @#$% 真是 @#$%", kind: "harm", why: "脏话" },
  { text: "今天食堂吃咖喱饭，太好吃了，我又去打了一份。", kind: "dup", why: "和第 3 条一模一样的复制品" },
];

export const KIND_NAME: Record<Kind, string> = { ok: "通过", dup: "重复", quality: "质量", harm: "有害" };

export const ch63: ChapterSpec = {
  id: 63,
  part: 7,
  title: "教科书是互联网",
  core: false,
  hook: "ChatGPT 到底是用什么书学习的？",
  steps: [
    { id: "s1", sec: 10, narration: "ChatGPT 的教科书是互联网。新闻、百科、博客、书、代码……人写下的文字，被大量收集起来。" },
    { id: "s2", sec: 10, narration: "可是收来的文字不能直接用。同一篇文字被复制了无数遍，还混着广告、乱码和脏话。" },
    { id: "s3", sec: 9, narration: "所以要经过一座文字工厂。第一步是去重：一模一样或几乎一样的文字，只留一份，其余删掉。" },
    { id: "s4", sec: 9, narration: "第二步是质量过滤。广告、没有意义的字符堆砌、同一句话反复说，这类学不到东西的文字都要筛掉。" },
    { id: "s5", sec: 9, narration: "第三步是有害内容过滤。脏话、危险的内容，还有电话号码这类个人信息，都要拿掉。" },
    { id: "s6", sec: 8, narration: "举个示意的例子：收集了 100 份，最后只剩 25 份。真实的比例因数据而异。" },
    { id: "s7", sec: 11, narration: "GPT-3 用这样挑出来的文字，学了约 3000 亿个词元。正如第 4 章所说，好数据造就好模型。" },
  ],
  playgroundTitle: "文字工厂质检员",
  playgroundIntro: "先给每条文字选一选：留下还是扔掉。全部选完后，工厂的三道过滤器会告诉你正确答案。",
  summary: [
    "ChatGPT 的教科书 = 互联网上的海量文字（新闻、百科、书、代码……）。",
    "不直接使用，而是经过 去重 → 质量过滤 → 有害内容过滤。",
    "筛完之后量变少了，但好数据才能造就好模型。",
  ],
  unlocks: "数据清洗",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "同一篇文字被复制了 1000 遍，该怎么办？",
      choices: ["只留一份，其余删掉", "1000 遍全都拿来学", "全部删掉"],
      answer: 0,
      explain: "一直看同一篇文字，模型很容易把它整篇背下来。只留一份，这就是去重。",
      review: "s3",
    },
    {
      q: "质量过滤会筛掉哪一条？",
      choices: ["讲解光合作用的百科文章", "满屏都是“哈哈哈哈”的文字", "写食堂饭菜感想的博客"],
      answer: 1,
      explain: "没有意义的字符堆砌学不到东西。普通的日常文字反而是好教材。",
      review: "s4",
    },
    {
      q: "通过全部过滤器之后，文字的量会怎样？",
      choices: ["保持不变", "变得更多", "少了很多"],
      answer: 2,
      explain: "在去重、质量、有害这几道过滤中，会去掉很多文字。量虽然少了，却成了好得多的教科书。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 63 章 教科书是互联网",
    collected: "收集来的文字（一格 = 1%）",
    people: "人写下的\n海量文字",
    dup: "重复的文字",
    dupX: "×1000",
    junk: "广告 · 乱码",
    bad: "脏话 · 个人信息",
    good: "有东西可学的文字",
    mixed: "这样没法当教科书",
    f1: "① 去重",
    f2: "② 质量过滤",
    f3: "③ 有害内容过滤",
    bin1: "重复",
    bin2: "质量",
    bin3: "有害",
    sameText: "今天天气晴",
    keepOne: "只留一份",
    junk1: "哈哈哈哈哈哈哈",
    junk2: "★特价★ 点击！",
    noLearn: "学不到东西",
    harm1: "@#$% 脏话",
    harm2: "138-XXXX-XXXX",
    harmNote: "危险的内容也拿掉",
    ratio: "100 → 25",
    example: "示意的比例",
    differs: "真实的比例\n因数据而异",
    book: "干净的教科书",
    gpt3: "GPT-3 学过的文字",
    tokens: "约 3000 亿个词元",
    goodData: "好数据 → 好模型",
    next: "第 64 章：怎样用这些文字学习？",
  },
};
