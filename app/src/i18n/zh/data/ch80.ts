import { ROUND1 } from "../../../data/ch01";
import { TOY_PROMPT, generate } from "../../../data/part9-toy";
import type { ChapterSpec } from "../../../data/types";

// The ch01 distribution for "我 今天 去 ___" (illustrative): 学校 52, 图书馆 21, 公园 12, (ch01's 4th word) 9, 披萨 1, 其他 5.
export const WHEEL = ROUND1;
export const PROMPT80 = TOY_PROMPT;

// Greedy with the Part 9 toy model loops: 学校 然后 见到 朋友 然后 见到 朋友 …
export const GREEDY_LOOP = generate(0, () => 0).slice(0, 8);

// The s5 spin lands on 图书馆; the s6 spins give these twelve results (same pattern as the Korean video, by index into
// WHEEL, so the 4th word follows whatever ch01 uses).
export const SPIN_FIRST = WHEEL[1].w;
export const SPINS = [0, 1, 0, 0, 2, 0, 1, 0, 3, 0, 2, 1].map((i) => WHEEL[i].w);

export const ch80: ChapterSpec = {
  id: 80,
  part: 9,
  title: "挑选的方法",
  core: false,
  hook: "直接挑概率最高的词不就行了吗？",
  steps: [
    { id: "s1", sec: 7, narration: "“我 今天 去”后面接什么词，概率已经算出来了。现在要从中挑一个。该怎么挑呢？" },
    { id: "s2", sec: 8, narration: "第一种方法叫贪心。像个贪心鬼一样，每次只挑概率最高的第 1 名。这里就是“学校”。" },
    { id: "s3", sec: 7, narration: "贪心法很专一。同一句话输入多少遍，它都只挑第 1 名，所以每次的答案都一模一样。" },
    { id: "s4", sec: 8, narration: "但它容易原地打转。一路只跟着第 1 名走，“然后 见到 朋友”就会一遍又一遍地重复。" },
    { id: "s5", sec: 8, narration: "第二种方法是采样：转一个按概率分好格子的转盘。这和第 13 章的抽签是一回事。" },
    { id: "s6", sec: 8, narration: "多转几次，“学校”出现得最多，但“图书馆”“公园”也会出现。每次结果都不一样。" },
    { id: "s7", sec: 9, narration: "ChatGPT 通常用采样，所以同一个问题，回答也会略有不同。转盘格子的大小，下一章用温度来调。" },
  ],
  playgroundTitle: "贪心 vs 转盘",
  playgroundIntro: "用同一张概率表比较两种方法。“挑一个词”和“写完整句话”都多按几次试试。",
  summary: [
    "贪心：每次只挑概率第 1 名。很专一，但容易原地打转。",
    "采样：转一个按概率分好格子的转盘。每转一次，结果都可能不同。",
    "ChatGPT 通常用采样，所以同一个问题，回答也会略有不同。",
  ],
  unlocks: "贪心 · 采样",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "贪心法是怎样挑下一个词的？",
      choices: ["每次都挑概率最高的词", "转一个按概率分好格子的转盘", "挑最长的那个词"],
      answer: 0,
      explain: "贪心法像个贪心鬼，永远只挑第 1 名。",
      review: "s2",
    },
    {
      q: "让贪心法把同一句话续写三遍，会怎样？",
      choices: ["每次答案都不同", "三次答案完全一样", "答案越写越短"],
      answer: 1,
      explain: "概率表一样，第 1 名就一样，所以贪心法总是给出同一个答案。",
      review: "s3",
    },
    {
      q: "同一个问题问 ChatGPT 两次，回答会略有不同，这是为什么？",
      choices: ["网上的搜索结果随时在变", "模型偶尔会出故障", "它按概率像转盘一样抽出下一个词"],
      answer: 2,
      explain: "采样每转一次结果都可能不同，所以回答也会略有不同（第 2 章）。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 80 章 挑选的方法",
    example: "概率为示意数据",
    how: "怎么挑？",
    way1: "方法 1",
    way2: "方法 2",
    greedy: "贪心",
    greedyEn: "greedy = 贪心鬼",
    top: "每次只要第 1 名！",
    runPre: "第 ",
    run: " 次",
    same: "输入多少遍都一样",
    loop: "原地打转",
    again: "又来了！",
    sampling: "采样",
    wheel: "按概率分格子的转盘",
    other: "其他",
    thisTime: "这次是“图书馆”！",
    spins: "转了 12 次",
    times: " 次",
    vary: "每次都不一样",
    gTop: "永远只挑第 1 名",
    gSame: "每次答案相同",
    gLoop: "容易原地打转",
    sTop: "按概率转转盘",
    sVary: "每次答案不同",
    sOdd: "偶尔冒出怪词",
    chatgpt: "ChatGPT 通常用采样",
    next: "格子大小由第 81 章的温度来调",
  },
};
