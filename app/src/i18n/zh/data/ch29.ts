import { PRESETS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// zh: the running sentence 我 今天 去 学校 with “骑自行车” added, so the real split lands between characters and words:
// 11 characters, 8 GPT-4o tokens (o200k_base: 我/今天/骑/自行/车/去/学校/。), 6 words. Chinese has no spaces, so the
// word split is written out by hand (自行车 is one word; the full stop stays on the last word, as in the Korean file).
export const SENT = PRESETS[0];
export const SENT_CHARS = [...SENT.text];
export const SENT_WORDS = ["我", "今天", "骑", "自行车", "去", "学校。"];
export const RARE = { unbelievable: PRESETS[6], slang: PRESETS[4] };

// s6: a few rows of the GPT-4o vocabulary (ids checked with tiktoken)
export const VOCAB_ROWS: [string, string][] = [
  ["0", "!"],
  ["1", '"'],
  ["2", "#"],
  ["⋮", ""],
  ["7522", "我"],
  ["⋮", ""],
  ["73048", "学校"],
  ["⋮", ""],
];

export const ch29: ChapterSpec = {
  id: 29,
  part: 3,
  title: "词元：AI 读文字的单位",
  core: true,
  hook: "ChatGPT 读文章，是一个字一个字地读，还是一个词一个词地读？",
  steps: [
    { id: "s1", sec: 7, narration: "ChatGPT 读文字之前，会先把它切成小块。这些小块叫词元，负责切的零件叫分词器。" },
    { id: "s2", sec: 7.5, narration: "按字切怎么样？块数太多，而且把“自行车”拆成“自”“行”“车”，单看“行”，意思就说不清了。" },
    { id: "s3", sec: 8.5, narration: "按词切呢？中文不写空格，得先判断词在哪里断开；词也多得数不完，“尊嘟假嘟”这样的新词不在词表里，就读不了。" },
    { id: "s4", sec: 9, narration: "所以取中间。真实的 GPT-4o 分词器把这句话切成 8 块：常见的“今天”“学校”是整块，“自行车”却被切成了两块。" },
    { id: "s5", sec: 8.5, narration: "每一块都有编号，“学校”是 73048 号。模型真正收到的不是文字，而是这一串编号。" },
    { id: "s6", sec: 7.5, narration: "所有块的清单叫词表。GPT-3 认识大约 5 万块，GPT-4o 认识大约 20 万块。" },
    { id: "s7", sec: 8.5, narration: "少见的词就拆成认识的小块：unbelievable 是 3 块，“尊嘟假嘟”是 6 块。所以没有读不了的词。" },
    { id: "s8", sec: 7.5, narration: "把文字切块、编号的分词器，是设计图上的第一个零件。那么，这份块的清单是怎么做出来的？" },
  ],
  playgroundTitle: "词元显微镜",
  playgroundIntro: "选一个句子，看看真实的 GPT-4o 分词器把它切成了哪些块（用颜色区分）。点“看编号”，就能看到模型收到的数字。",
  summary: [
    "词元：AI 读文字的小块。常常比字大、比词小。",
    "常见的组合是一整块，少见的词拆成好几个小块。",
    "每块都有编号，模型收到的是这串编号。所有块的清单 = 词表。",
  ],
  unlocks: "分词器",
  quiz: [
    {
      q: "分词器做的事是？",
      choices: ["把文字切成块（词元）并编上号", "计算下一个词的概率", "改正错别字"],
      answer: 0,
      explain: "文字 → 块 → 编号。它是设计图最前面的零件。",
      review: "s1",
    },
    {
      q: "只按词来切，会遇到什么问题？",
      choices: ["块数太多", "词表里没有的新词就读不了", "标点符号会消失"],
      answer: 1,
      explain: "“尊嘟假嘟”这样的新词不在词表里。词元就算拆成小块也能读。",
      review: "s3",
    },
    {
      q: "真正送进模型的是什么？",
      choices: ["文字的图片", "原封不动的句子", "一串词元编号"],
      answer: 2,
      explain: "对 GPT-4o 来说，“我今天骑自行车去学校。”是 7522、47256、112432……这样的 8 个编号。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 29 章 词元：AI 读文字的单位",
    machine: "分词器 ✂",
    token: "词元 = AI 读的小块",
    byChar: "按字切？",
    byWord: "按词切？",
    byToken: "词元：介于两者之间",
    n13: "11 块",
    n4: "6 块",
    n7: "8 块",
    tooMany: "太碎了",
    noMeaning: "单看一个字，意思说不清",
    looksOk: "看起来不错，可是……",
    unknown: "词表里没有的新词！",
    endless: "中文不写空格，词也数不完",
    cmp: "字 11 · 词元 8 · 词 6",
    source: "GPT-4o 分词器（o200k_base）",
    space: "“自行车” → “自行” + “车”",
    ids: "模型真正收到的东西",
    vocab: "词表（vocabulary）= 块的清单",
    rows: "大约 20 万行",
    gpt3: "GPT-3",
    gpt4o: "GPT-4o",
    v3: "约 5 万",
    v4o: "约 20 万",
    rare: "少见的词拆成小块",
    bytes: "虚线 = 一个字被拆成两块字节（第 28 章）",
    canRead: "所以没有读不了的词",
    bp: "设计图第一个零件完成！",
    empty: "空着",
    next: "下一章：块的清单是怎么做出来的？（第 30 章）",
    q: "?",
    zoom: "行",
  },
};
