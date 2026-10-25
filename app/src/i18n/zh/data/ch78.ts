import type { ChapterSpec } from "../../../data/types";

/**
 * Time each service took to reach 1 million users. These figures are widely quoted (e.g. in a 2023 Statista chart)
 * but rough: each company counted "users" differently. They are labelled 广为引用的估计 wherever they appear.
 */
export type Service = { name: string; days: number; label: string };
export const SERVICES: Service[] = [
  { name: "奈飞", days: 1278, label: "约 3.5 年" },
  { name: "推特", days: 730, label: "约 2 年" },
  { name: "脸书", days: 304, label: "约 10 个月" },
  { name: "Instagram", days: 76, label: "约 2.5 个月" },
  { name: "ChatGPT", days: 5, label: "5 天" },
];

export const RECIPE = [
  { name: "GPT-3.5 系列模型", sub: "预训练（Part 7）", color: "sky" as const },
  { name: "+ 模仿示范答案", sub: "第 73 章", color: "violet" as const },
  { name: "+ 人的夸奖", sub: "第 74～76 章", color: "pink" as const },
];

export const ch78: ChapterSpec = {
  id: 78,
  part: 8,
  title: "2022 年 11 月 30 日",
  core: false,
  hook: "ChatGPT 是怎样在五天里吸引到 100 万人的？",
  steps: [
    { id: "s1", sec: 8, narration: "2022 年 11 月 30 日，OpenAI 发布了 ChatGPT。这是一个谁都能免费试用的研究预览版。" },
    { id: "s2", sec: 8, narration: "它的内部就是这个 Part 讲的内容：用示范答案和人的夸奖，把 GPT-3.5 系列模型打磨得适合对话。" },
    { id: "s3", sec: 7, narration: "变的是使用方式。不用复杂的设置，像跟朋友聊天一样，在对话框里打字就行。" },
    { id: "s4", sec: 7, narration: "反响非常火爆。发布后仅仅 5 天，用户就超过了 100 万。" },
    { id: "s5", sec: 8, narration: "和其他热门服务达到 100 万用户所用的时间比一比？这些是广为引用的估计数字。" },
    { id: "s6", sec: 9, narration: "大约两个月后，月活跃用户估计达到约 1 亿。当时还有分析说，它是增长最快的应用。" },
    { id: "s7", sec: 9, narration: "可问题也暴露出来了：它会一本正经地答错，也会回应危险的请求。于是安全变得更加重要。" },
  ],
  playgroundTitle: "百万用户赛跑",
  playgroundIntro: "先猜一猜，ChatGPT 用了几天达到 100 万用户。然后让它和其他服务赛跑。",
  summary: [
    "ChatGPT 于 2022 年 11 月 30 日以免费研究预览版的形式发布。",
    "内部是 GPT-3.5 系列模型 + 示范答案 + 人的夸奖（RLHF）。",
    "5 天达到 100 万用户，约两个月后月活跃用户约 1 亿（估计）。",
  ],
  unlocks: "ChatGPT 发布",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "ChatGPT 第一次发布是在哪一天？",
      choices: ["2020 年 6 月", "2022 年 11 月 30 日", "2017 年 12 月"],
      answer: 1,
      explain: "是 2022 年 11 月 30 日。2017 年是 Transformer 论文（第 44 章），2020 年是 GPT-3 发布的那一年。",
      review: "s1",
    },
    {
      q: "ChatGPT 的内部是怎样做出来的？",
      choices: ["从头发明了一种全新的结构", "把网上搜索的结果原样显示出来", "用示范答案和人的夸奖打磨了 GPT-3.5 系列模型"],
      answer: 2,
      explain: "这个 Part 学过的 SFT 和 RLHF，就是它用的方法。",
      review: "s2",
    },
    {
      q: "看“达到 100 万用户所用的时间”对比表时，要注意什么？",
      choices: ["各个服务统计“用户”的标准不同，只是大致的估计", "所有数字都是精确测量的", "ChatGPT 是最慢的"],
      answer: 0,
      explain: "这些数字流传很广，但各家公司的标准不一样。最好只用来看大的趋势。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第 78 章 2022 年 11 月 30 日",
    month: "2022 年 11 月",
    day: "30",
    weekday: "星期三",
    launch: "ChatGPT 发布",
    preview: "免费研究预览版",
    equals: "= ChatGPT",
    sameWay: "* OpenAI 发布说明：用和 InstructGPT（第 76 章）相同的方法训练",
    appName: "ChatGPT",
    ask: "推荐一本周末读的书吧",
    reply: "好呀！告诉我你喜欢什么样的故事，我来帮你挑。",
    input: "输入消息",
    send: "↑",
    justTalk: "直接开口聊就行！",
    dayN: " 天",
    users: " 人",
    dot: "● 1 个 = 1 万人",
    million: "5 天突破 100 万人！",
    chartTitle: "达到 100 万用户所用的时间",
    estimate: "* 广为引用的估计数字。各个服务统计“用户”的标准不同",
    wow: "5 天！",
    m1: "100 万 (5 天) →",
    m100: "← 约 1 亿人\n（约两个月后）",
    monthly: "月活跃用户约 1 亿（估计）",
    fastest: "还有分析说它是增长最快的应用",
    cell: "□ 1 格 = 100 万人",
    problems: "暴露出的问题",
    wrong: "一本正经地答错（第 84 章）",
    danger: "危险的请求也回应",
    safety: "打造安全的 AI",
    next: "第 79 章",
  },
};
