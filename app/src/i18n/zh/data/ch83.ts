import type { ChapterSpec } from "../../../data/types";

export type Msg = { me: boolean; text: string };

// The chat in the scene. In the picture the window holds five speech bubbles (illustrative; real windows count tokens).
export const CHAT: Msg[] = [
  { me: true, text: "你好！我叫小雨。" },
  { me: false, text: "很高兴认识你！需要什么帮助？" },
  { me: true, text: "推荐一部周末看的电影吧。" },
  { me: false, text: "全家一起看的话，动画片怎么样？" },
  { me: true, text: "爆米花什么口味好吃？" },
  { me: false, text: "焦糖爆米花很受欢迎。" },
  { me: true, text: "我叫什么名字来着？" },
];
export const GUESS = "嗯……你是小敏吧？";
export const WINDOW_SLOTS = 5;

export const GPT3_CTX = 2048;
export const GPT3_CELLS = GPT3_CTX * GPT3_CTX; // 4,194,304 ≈ 约 419 万

// s6–s7: generating after "我 今天 去" (the greedy loop from ch80)
export const KV_TOKENS = ["我", "今天", "去", "学校", "然后", "见到"];
export const KV_PROMPT = 3;
export const KV_ROUNDS = 4; // rows: 3, 4, 5, 6 tokens
export const noCache = (m: number, n: number) => n * m + (n * (n - 1)) / 2; // 3+4+5+6 = 18
export const withCache = (m: number, n: number) => m + (n - 1); // 3+1+1+1 = 6

// playground: extra turns the student can add (user message + canned reply)
export const TURNS: { label: string; me: string; ai: string }[] = [
  { label: "推荐电影", me: "推荐一部周末看的电影吧。", ai: "全家一起看的话，动画片怎么样？" },
  { label: "爆米花", me: "爆米花什么口味好吃？", ai: "焦糖爆米花很受欢迎。" },
  { label: "作业", me: "帮我看看数学作业。", ai: "好的，是哪道题？" },
  { label: "春游", me: "明天可以去春游吗？", ai: "先看看天气预报吧。" },
  { label: "歌曲", me: "帮我挑一首欢快的歌。", ai: "我来找找适合运动时听的歌。" },
];

export const ch83: ChapterSpec = {
  id: 83,
  part: 9,
  title: "AI 的记忆上限",
  core: false,
  hook: "和 ChatGPT 聊久了，它有时会忘记一开始说过的话。这是为什么？",
  steps: [
    { id: "s1", sec: 7, narration: "第 77 章说过，对模型来说，对话就是一篇长文。但它一次能读的长度是有上限的。" },
    { id: "s2", sec: 8, narration: "这个上限叫上下文窗口。GPT-3 最多能看 2,048 个词元。只有窗口里的文字才会用来预测。" },
    { id: "s3", sec: 7, narration: "对话越来越长，每进来一句新话，最早的那句就会被挤出窗口。" },
    { id: "s4", sec: 9, narration: "这时再问名字呢？名字已经在窗口外，模型看不到。它可能说不知道，也可能编一个名字（第 84 章）。" },
    { id: "s5", sec: 9, narration: "窗口也不能随便加大。注意力要给每一对片段打分（第 47 章），长度翻倍，分数表就变成 4 倍。" },
    { id: "s6", sec: 9, narration: "每生成一个片段，都要用到前面所有片段的 Key 和 Value（第 46 章）。每次都重算就太浪费了。" },
    { id: "s7", sec: 9, narration: "KV 缓存就是把算好的 Key·Value 记下来重复使用。前面的片段不看后面（第 51 章），所以值不会变。" },
    { id: "s8", sec: 8, narration: "代价是对话越长，笔记越多，越占内存。长对话里，最好把重要的内容再提醒一遍。" },
  ],
  playgroundTitle: "记忆窗口模拟器",
  playgroundIntro: "继续聊几句，再按“我叫什么名字来着？”，也试试改变窗口大小。下面还能数一数 KV 缓存省下了多少计算。",
  summary: [
    "上下文窗口（context window）：模型一次能看的词元数。GPT-3 是 2,048 个词元。",
    "超出窗口后，最早的话先被挤出去，模型就看不到那部分内容了。",
    "KV 缓存：把算好的 Key·Value 记下来重复使用，回答就能生成得更快。",
  ],
  unlocks: "上下文窗口 · KV 缓存",
  unlockLabel: "又拿到一件推理工具",
  quiz: [
    {
      q: "对话比上下文窗口还长时，会发生什么？",
      choices: ["模型会把整段对话总结后记住", "最早的部分先被挤出窗口，再也看不到", "对话会自动结束"],
      answer: 1,
      explain: "模型只能看到窗口里的文字。被挤出去的开头，对模型来说就跟不存在一样。",
      review: "s3",
    },
    {
      q: "片段数变成 2 倍，注意力分数表的格子数会变成多少？",
      choices: ["4 倍", "2 倍", "不变"],
      answer: 0,
      explain: "分数表横竖都等于片段数，2 倍 × 2 倍 = 4 倍。",
      review: "s5",
    },
    {
      q: "KV 缓存重复使用的是什么？",
      choices: ["用户以前问过的问题", "网上的搜索结果", "前面各片段已经算好的 Key 和 Value"],
      answer: 2,
      explain: "后面接上新片段，前面片段的 Key·Value 也不会变，所以可以记下来重复使用。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 83 章 AI 的记忆上限",
    longText: "整段对话 = 一篇长文（第 77 章）",
    window: "上下文窗口",
    gpt3: "GPT-3：2,048 个词元",
    toy: "这张图里只放得下 5 个气泡（示意）",
    out: "窗口外 = 看不见",
    here: "明明在这儿",
    mayMake: "看不见就会瞎编！（第 84 章）",
    me: "我",
    ai: "AI",
    t4: "4 个片段",
    t8: "8 个片段",
    c16: "16 格",
    c64: "64 格",
    x4: "长度 2 倍 → 格子 4 倍",
    big: "2,048 个片段 → 约 419 万格",
    every: "每一层、每个头都要！",
    roundPre: "第 ",
    round: " 轮",
    calc: "重新计算",
    memo: "从笔记里取",
    noCacheSum: "不用缓存：3 + 4 + 5 + 6 = 18 次",
    cacheSum: "KV 缓存：3 + 1 + 1 + 1 = 6 次",
    cacheN: "6 次",
    kv: "计算 Key·Value",
    why: "前面的片段不看后面（第 51 章）",
    cacheName: "KV 缓存 = 计算笔记本",
    stack: "对话越长，笔记越厚",
    full: "内存满了！",
    tipTitle: "长对话小窍门",
    tip1: "重要的事再提醒一遍",
    tip2: "换话题就开个新对话",
    tokens: "个词元",
  },
};
