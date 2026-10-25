import type { ChapterSpec, Highlighter } from "../../../data/types";

// An invented book (为了讲解而编出来的书名; checked: no real book with this title). The model's answer about it is built
// one chunk at a time from illustrative next-chunk probabilities; every chunk is plausible, the whole is false.
export const BOOK = "《兔子星球的最后一座图书馆》";
export const QUESTION84 = `${BOOK}是本什么书？`;

export type Opt = { w: string; p: number; c: Highlighter | null; next?: string };
export const HONEST = "我没听说过";
export const END84 = "〈完〉";

/** chunk → options for the next chunk (illustrative, each list adds up to 1) */
export const TREE: Record<string, Opt[]> = {
  start: [
    { w: "2018 年", p: 0.4, c: "yellow", next: "year" },
    { w: "2015 年", p: 0.32, c: "orange", next: "year" },
    { w: "2020 年", p: 0.24, c: "violet", next: "year" },
    { w: HONEST, p: 0.04, c: "mint", next: "honest" },
  ],
  year: [
    { w: "出版的", p: 0.66, c: "yellow", next: "came" },
    { w: "问世的", p: 0.34, c: "orange", next: "came" },
  ],
  came: [
    { w: "童话，", p: 0.54, c: "yellow", next: "kind" },
    { w: "小说，", p: 0.32, c: "orange", next: "kind" },
    { w: "绘本，", p: 0.14, c: "violet", next: "kind" },
  ],
  kind: [
    { w: "获得过", p: 0.46, c: "yellow", next: "got" },
    { w: "深受", p: 0.4, c: "orange", next: "loved" },
    { w: "引起过", p: 0.14, c: "violet", next: "drew" },
  ],
  got: [{ w: "儿童文学奖。", p: 1, c: "yellow", next: "end" }],
  loved: [{ w: "读者喜爱。", p: 1, c: "yellow", next: "end" }],
  drew: [{ w: "不小的轰动。", p: 1, c: "yellow", next: "end" }],
  honest: [
    { w: "这本书。", p: 0.8, c: "mint", next: "end" },
    { w: "这个书名。", p: 0.2, c: "mint", next: "end" },
  ],
};

// the path the scene follows (always the top option)
export const SCENE_ROUNDS = ["start", "year", "came", "kind"] as const;
export const ANSWER84 = ["2018 年", "出版的", "童话，", "获得过", "儿童文学奖。"];

export const RISKY = [
  { w: "冷门事实", ex: "小地方的历史", c: "yellow" as const },
  { w: "数字 · 日期", ex: "年份、统计、分数", c: "sky" as const },
  { w: "人名", ex: "谁做的、谁说的", c: "mint" as const },
  { w: "出处 · 引用", ex: "书名、论文、链接", c: "pink" as const },
];

export const HELPS = [
  { n: "①", w: "亲自核对出处", ex: "上网搜、去图书馆、问老师" },
  { n: "②", w: "AI 给的出处也要查真假", ex: "连出处它都可能编出来" },
  { n: "③", w: "把可靠的资料一起交给它", ex: "先查资料再回答（第 88 章）" },
];

export const ch84: ChapterSpec = {
  id: 84,
  part: 9,
  title: "一本正经地胡说",
  core: true,
  hook: "AI 说得很有把握，就一定是事实吗？",
  steps: [
    { id: "s1", sec: 10, narration: "问一本根本不存在的书，它却把出版年份、获奖经历说得头头是道。这种像模像样的瞎话，叫作幻觉（hallucination）。" },
    { id: "s2", sec: 9, narration: "逐个片段回放。介绍书常从出版年份说起，“2018 年”很像样；“我没听说过”只占 4%。" },
    { id: "s3", sec: 10, narration: "接下来也一样：出版的、童话、获得过、儿童文学奖。每次都挑最像样的词，连起来却成了假事实。" },
    { id: "s4", sec: 8, narration: "模型学的是“可能接着出现的词”（第 1 章）。它并没有专门核对这些话是不是真的。" },
    { id: "s5", sec: 9, narration: "而且写出去的话收不回来（第 2 章）。一旦写下“2018 年”，后面就会顺着它像模像样地接下去。" },
    { id: "s6", sec: 9, narration: "幻觉特别容易出现在冷门事实、数字和日期、人名、出处上。它甚至会编出看起来像真的假出处。" },
    { id: "s7", sec: 9, narration: "所以重要的内容要亲自核对出处。把可靠的资料一起交给它，它就会少编很多（第 88 章）。" },
    { id: "s8", sec: 9, narration: "把温度调低呢？古怪的抽签会变少，但第 1 名的答案如果本身是编的，照样会说出来。像样不等于真实。" },
  ],
  playgroundTitle: "幻觉实验室",
  playgroundIntro: "你来当模型，一个片段一个片段地挑词，介绍一本不存在的书。然后按“让它回答 100 次”，数一数模型有多常瞎编。",
  summary: [
    "幻觉：把不是事实的内容编得像模像样。",
    "模型只挑“可能接着出现的词”，并不核对这话是不是事实。",
    "数字、人名、出处要亲自核对；附上资料，它就会少编一些（第 88 章）。",
  ],
  unlocks: "识破幻觉",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "AI 产生幻觉，最主要的原因是？",
      choices: ["它故意想骗人", "网速太慢", "它只挑接下来像样的词，不核对是不是事实"],
      answer: 2,
      explain: "模型被训练成擅长挑“接得上的词”。核对事实并不在这个目标里。",
      review: "s4",
    },
    {
      q: "把温度调到 0，幻觉会怎样？",
      choices: ["古怪的抽签变少，但第 1 名的答案若是错的，照样会说出来", "完全消失", "一定会变多"],
      answer: 0,
      explain: "温度只是重新分配概率（第 81 章）。最像样的答案如果是假的，它每次都会说这个假话。",
      review: "s8",
    },
    {
      q: "想把 AI 告诉你的书名和出处写进作业，应该怎么做？",
      choices: ["AI 说得很有把握，直接照抄", "通过搜索或去图书馆，亲自确认它是否真的存在", "调高温度再问一遍"],
      answer: 1,
      explain: "AI 连出处都可能编。重要的内容一定要亲自核对。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 84 章 一本正经地胡说",
    answer1: "2018 年出版的童话，",
    answer2: "获得过儿童文学奖。",
    none: "可这本书根本不存在！",
    madeUp: "* 这个书名是为了讲解而编出来的",
    halluc: "幻觉 = 一本正经地胡说",
    q: "Q.",
    example: "示意数据",
    honestNote: "← 诚实的回答只有 4%",
    chatgpt: "ChatGPT",
    markO: "○",
    markX: "×",
    plausible: "像样 ○",
    fake: "连起来就成了假事实！",
    learned: "学到的",
    learnedWhat: "可能接着出现的词",
    notLearned: "不核对的",
    notWhat: "这话是不是真的",
    score: "模型的分数 = 像不像样",
    first: "第一颗扣子",
    follow: "顺着往下写",
    noErase: "写出去的话收不回来（第 2 章）",
    button: "第一颗扣子扣错，就一路错到底……",
    risky: "特别当心！",
    helpsTitle: "这样应对",
    temp: "温度",
    low: "就算调低温度",
    same: "第 1 名是假的，照样说！",
    key: "像样 ≠ 真实",
  },
};
