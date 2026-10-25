import type { ChapterSpec } from "../../../data/types";

// A made-up school's documents (星光节 = the school's culture festival). 2026-11-06 and 2025-11-07 are both Fridays.
export type Doc = { id: string; title: string; text: string; c: "yellow" | "mint" | "sky" | "pink" | "orange" | "violet" };
export const DOCS: Doc[] = [
  { id: "fest", title: "2026 星光节通知", text: "2026 星光节（校园文化节）将于 11 月 6 日（周五）举行。各班摊位上午 10 点至下午 2 点 30 分开放。", c: "yellow" },
  { id: "old", title: "2025 星光节致谢", text: "2025 星光节（校园文化节）已于 11 月 7 日（周五）举行。感谢大家踊跃参与！", c: "orange" },
  { id: "lunch", title: "11 月食堂菜单", text: "11 月第二周周五的午餐是咖喱饭和紫菜蛋花汤。过敏原信息见学校官网。", c: "mint" },
  { id: "lib", title: "图书馆开放时间", text: "图书馆工作日上午 8 点至下午 5 点开放。考试期间延长到晚上 7 点。", c: "sky" },
  { id: "pe", title: "冬季运动服通知", text: "冬季运动服从 11 月 2 日起可以穿。", c: "violet" },
  { id: "club", title: "课后编程班招生", text: "课后编程班报名截止到 11 月 3 日，请向班主任报名。", c: "pink" },
];

export type Question = {
  key: string;
  q: string;
  /** search words; a document's score = how many of them it contains (a simple stand-in for vector search) */
  keys: string[];
  answer?: { doc: string; text: string };
  /** what comes out when only this (misleading) document is given */
  trap?: { doc: string; text: string };
  /** what the model makes up when no documents are given (illustrative) */
  madeUp: string;
};
export const QUESTIONS: Question[] = [
  {
    key: "date",
    q: "2026 星光节是哪天？",
    keys: ["2026", "星光节", "文化节"],
    answer: { doc: "fest", text: "11 月 6 日，星期五。" },
    trap: { doc: "old", text: "11 月 7 日，星期五。" },
    madeUp: "10 月 16 日，星期五！",
  },
  {
    key: "booth",
    q: "文化节那天，各班摊位几点到几点开放？",
    keys: ["文化节", "摊位", "开放", "时间"],
    answer: { doc: "fest", text: "上午 10 点到下午 2 点 30 分开放。" },
    madeUp: "上午 9 点到下午 4 点！",
  },
  {
    key: "lib",
    q: "图书馆开到几点？",
    keys: ["图书馆", "时间"],
    answer: { doc: "lib", text: "工作日开到下午 5 点，考试期间开到晚上 7 点。" },
    madeUp: "开到下午 6 点！",
  },
  {
    key: "trip",
    q: "研学旅行去哪里？",
    keys: ["研学", "地点"],
    madeUp: "去杭州！",
  },
];

export const scoreDoc = (q: Question, d: Doc) => q.keys.filter((k) => d.title.includes(k) || d.text.includes(k));

// Scene: four documents and their (illustrative) closeness to the question vector, best first.
export const SCENE_Q = "我们学校的文化节是哪天？";
export const SCENE_DOCS = [
  { title: "2026 星光节通知", sim: 0.86, c: "yellow" as const },
  { title: "图书馆开放时间", sim: 0.31, c: "sky" as const },
  { title: "11 月食堂菜单", sim: 0.24, c: "mint" as const },
  { title: "冬季运动服通知", sim: 0.12, c: "violet" as const },
];

export const ch88: ChapterSpec = {
  id: 88,
  part: 10,
  title: "先查资料再回答",
  core: false,
  hook: "像我们学校文化节的日期这种 AI 从没学过的事，该怎么问它？",
  steps: [
    { id: "s1", sec: 9, narration: "问问模型我们学校的文化节是哪天？模型只知道训练时见过的文字，我们学校的通知它从来没见过。" },
    { id: "s2", sec: 7, narration: "可模型还是会续写下一个片段，可能编出一个像样的日期。这就是第 84 章说的幻觉。" },
    { id: "s3", sec: 7, narration: "解决办法很简单：回答之前先查资料！在学校的一堆文档里，检索和问题有关的文档。" },
    { id: "s4", sec: 8, narration: "把问题和文档都变成数字向量，挑出离问题近的文档（第 8 章）。文化节通知离得最近。" },
    { id: "s5", sec: 8, narration: "把找到的文档和问题拼成一段文字交给模型，再附上一句“请根据下面的文档回答”。" },
    { id: "s6", sec: 8, narration: "现在模型只要照抄文档里写的日期就行了。它还能注明是看了哪份文档回答的，也就是出处。" },
    { id: "s7", sec: 9, narration: "这个方法叫检索增强生成，简称 RAG，2020 年提出。不用重新训练模型，也能用上新信息。" },
    { id: "s8", sec: 9, narration: "不过，找到的文档错了，答案也会错。找到去年的通知，就会答出去年的日期。所以出处要亲自核对。" },
  ],
  playgroundTitle: "检索后回答",
  playgroundIntro: "选一个问题，检索学校的文档。挑出要放进提示词的文档，看看得到什么回答。里面还混着陷阱文档！",
  summary: [
    "模型只知道训练时见过的文字。问它不知道的事，它可能会编（幻觉，第 84 章）。",
    "RAG：检索离问题近的文档，和问题一起放进提示词，再让它回答。",
    "就算答案附了出处，文档错了答案也会错。出处要亲自核对。",
  ],
  unlocks: "先查资料再回答",
  unlockLabel: "又得到一张新能力卡",
  quiz: [
    {
      q: "模型不知道我们学校文化节日期的原因是？",
      choices: ["训练时见过的文字里没有这个信息", "日期是数字", "问题太短"],
      answer: 0,
      explain: "模型只知道训练数据里有的内容。可它照样会续写，所以可能会编（第 84 章）。",
      review: "s1",
    },
    {
      q: "在 RAG 里，“检索到的文档”会放到哪里？",
      choices: ["用来修改模型的参数", "和问题一起放进提示词（输入的文字）", "等回答出来后放在最后"],
      answer: 1,
      explain: "把找到的文档和问题拼成一段文字放进去。模型并不重新训练。",
      review: "s5",
    },
    {
      q: "答案附了出处，可出处是去年的通知，该怎么看？",
      choices: ["有出处就一定对", "模型会自动改成今年的日期", "文档错了答案也可能错，要核对出处"],
      answer: 2,
      explain: "模型相信放进来的文档并照着回答。找到的文档错了，答案也会错。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 88 章 先查资料再回答",
    q: "我们学校的文化节是哪天？",
    model: "模型",
    seen: "训练时见过的文字",
    notice: "学校通知",
    noticeTitle: "2026 星光节通知",
    never: "从没见过",
    madeUp: "10 月 16 日，星期五！",
    halluc: "像模像样地编 = 幻觉（第 84 章）",
    pile: "学校的一堆文档",
    search: "检索",
    closeness: "按离问题的远近排序（第 8 章）",
    example: "* 示意数据",
    promptTitle: "交给模型的文字",
    docTag: "[文档] 2026 星光节通知",
    docText: "2026 星光节将于 11 月 6 日（周五）举行。",
    ask: "请根据下面的文档回答。",
    qLine: "问题：我们学校的文化节是哪天？",
    answer: "11 月 6 日，星期五。",
    date: "11 月 6 日（周五）",
    docPre: "2026 星光节将于",
    docPost: "举行。",
    source: "出处：2026 星光节通知",
    copy: "照着文档写",
    rag: "检索增强生成（RAG，2020）",
    r: "R 检索 (Retrieval)",
    a: "A 增强 (Augmented)",
    g: "G 生成 (Generation)",
    step1: "① 检索",
    step2: "② 拼进去",
    step3: "③ 回答+出处",
    same: "模型不变，只换新信息！",
    oldTitle: "2025 星光节致谢",
    oldText: "2025 星光节已于 11 月 7 日（周五）举行。",
    lastYear: "去年的！",
    oldAnswer: "11 月 7 日，星期五。",
    oldSource: "出处：2025 星光节致谢",
    wrongDoc: "文档错了，答案就错",
    checkIt: "打开出处亲自核对",
  },
};
