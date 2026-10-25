import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Canonical parameter counts (CHAPTER_GUIDE "Canonical facts"); floors = parameters / 1 亿. */
export const MODELS: { key: string; name: string; year: number; params: number; paramsText: string; c: Highlighter }[] = [
  { key: "gpt1", name: "GPT-1", year: 2018, params: 1.17e8, paramsText: "1.17 亿个", c: "mint" },
  { key: "gpt2", name: "GPT-2", year: 2019, params: 1.5e9, paramsText: "15 亿个", c: "sky" },
  { key: "gpt3", name: "GPT-3", year: 2020, params: 1.75e11, paramsText: "1750 亿个", c: "yellow" },
];
export const FLOOR = 1e8; // 1 亿 parameters = one floor
export const floors = (params: number) => params / FLOOR;

/** 上海中心大厦 (Shanghai Tower, 632 m): 128 floors above ground per CTBUH (some Chinese sources say 127; the ratio is ≈14 either way).
 *  A real building, used only as a yardstick: 1750 ÷ 128 ≈ 13.7 → about 14 towers. */
export const TOWER = { key: "tower", name: "上海中心大厦", floors: 128 };

export const ratio = (a: number, b: number) => a / b;
/** "约 13 倍" style: whole numbers, thousands separated. */
export const timesText = (r: number) => `约 ${Math.round(r)} 倍`;

export const GUESSES = [175, 1750, 17500];

export const ch69: ChapterSpec = {
  id: 69,
  part: 7,
  title: "GPT-1 → 2 → 3",
  core: false,
  hook: "从 GPT-1 到 GPT-3，两年里变大了多少？",
  steps: [
    { id: "s1", sec: 11, narration: "GPT 不是一下子诞生的。2018 年 GPT-1，2019 年 GPT-2，2020 年 GPT-3，个头一年比一年大。" },
    { id: "s2", sec: 10, narration: "把 1 亿个参数（第 12 章的旋钮）当作楼房的 1 层。GPT-1 有 1.17 亿个，只是一座 1 层的小房子。" },
    { id: "s3", sec: 7, narration: "GPT-2 有 15 亿个，成了 15 层的楼房。一年就长大了约 13 倍。" },
    { id: "s4", sec: 9, narration: "GPT-3 有 1750 亿个。会有多少层呢？屏幕都装不下了，我们往后退一退。" },
    { id: "s5", sec: 11, narration: "足足 1750 层！是 GPT-2 的约 117 倍，GPT-1 的约 1500 倍。GPT-1 连一个点都看不见了。" },
    { id: "s6", sec: 8, narration: "要把 128 层的上海中心大厦叠上约 14 座，才有这么高。是不是很惊人？" },
    { id: "s7", sec: 11, narration: "个头变大的 GPT-3，只看几个例子就能解出新题（第 71 章）。为什么越大越聪明？下一章揭晓。" },
  ],
  playgroundTitle: "比比楼有多高",
  playgroundIntro: "1 亿个 = 1 层。先猜一猜 GPT-3 有多少层，再打开、关上各座楼，比比大小。",
  summary: [
    "GPT-1（2018）1.17 亿 → GPT-2（2019）15 亿 → GPT-3（2020）1750 亿个参数。",
    "如果 1 亿个 = 1 层：1 层小房子 → 15 层楼房 → 1750 层高塔。",
    "两年变大约 1500 倍。个头变大后，出现了新的能力（第 71 章）。",
  ],
  unlocks: "GPT 模型的大小",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "GPT-1、GPT-2、GPT-3 分别是哪一年发布的？",
      choices: ["2016、2017、2018", "2018、2019、2020", "2020、2021、2022"],
      answer: 1,
      explain: "GPT-1 在 2018 年，GPT-2 在 2019 年，GPT-3 在 2020 年发布。",
      review: "s1",
    },
    {
      q: "如果 1 亿个 = 1 层，GPT-3（1750 亿个）有多少层？",
      choices: ["175 层", "17 层", "1750 层"],
      answer: 2,
      explain: "1750 亿 ÷ 1 亿 = 1750 层。",
      review: "s5",
    },
    {
      q: "GPT-3 的参数大约是 GPT-2 的多少倍？",
      choices: ["约 117 倍", "约 2 倍", "约 10 倍"],
      answer: 0,
      explain: "1750 亿 ÷ 15 亿 ≈ 117 倍。一年就变大了这么多。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 69 章 GPT-1 → 2 → 3",
    grow: "个头一年比一年大",
    floorRule: "1 亿个参数 = 1 层",
    f1: "≈ 1 层",
    f2: "= 15 层",
    f3: "= 1750 层",
    tiny: "只有 1 层！",
    x13: "约 13 倍",
    howTall: "多少层？",
    offScreen: "一直伸到屏幕外……",
    back: "往后退一退",
    x117: "GPT-2 的约 117 倍",
    x1500: "GPT-1 的约 1500 倍",
    dot: "GPT-1 在这里（比一个点还小）",
    tower: "上海中心 128 层",
    x14: "约 14 座",
    huge: "太惊人了！",
    fewShot: "只看几个例子，就解出了新题（第 71 章）",
    why: "为什么越大越聪明？",
    next: "第 70 章：缩放定律",
  },
};
