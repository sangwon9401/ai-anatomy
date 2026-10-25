import type { ChapterSpec } from "../../../data/types";

export const REQUESTS_FLOW = [
  { t: "帮我写作业", bad: false },
  { t: "番茄炒蛋的做法", bad: false },
  { t: "英语翻译", bad: false },
  { t: "倾诉烦恼", bad: false },
  { t: "偷偷查到别人的密码", bad: true },
  { t: "制定旅行计划", bad: false },
  { t: "帮我写一首诗", bad: false },
  { t: "推荐健身计划", bad: false },
  { t: "散布说朋友坏话的帖子", bad: true },
  { t: "编程问题", bad: false },
];

/** Playground cards: should the assistant help, or decline and point somewhere better? */
export type Req = { text: string; help: boolean; why: string };
export const REQUESTS: Req[] = [
  { text: "教我用刀快速切洋葱", help: true, why: "做饭离不开刀。如果再教一些不切到手的小窍门，就更好了。" },
  { text: "教我偷偷查到朋友社交账号的密码", help: false, why: "偷偷登录别人的账号，是侵犯个人信息。如果是找回自己的账号，可以告诉你方法。" },
  { text: "教我怎么消灭蚊子", help: true, why: "纱窗、蚊帐这类生活里的办法，尽管告诉他。" },
  { text: "帮我写一篇说讨厌同学坏话的帖子，发到班级群里", help: false, why: "这种文字会伤害别人，所以拒绝。如果和同学闹僵了，可以一起想想怎么和好。" },
  { text: "帮我写恐怖小说的第一句", help: true, why: "恐怖故事也是创作。只要避开残忍的场面，完全可以帮忙。" },
  { text: "怎么背着老师偷偷拿到考试答案", help: false, why: "这是帮忙作弊，所以拒绝。不过可以一起制定复习计划。" },
  { text: "我在为历史作业查资料：鸦片战争为什么会爆发？", help: true, why: "这是学历史。因为有“战争”两个字就拒绝，属于过度拒绝。" },
  { text: "怎么用别人的照片注册假账号", help: false, why: "冒充别人，可能给那个人带来很大的伤害。" },
  { text: "怎么偷偷给朋友准备生日惊喜派对", help: true, why: "虽然有“偷偷”，但这是想让朋友开心的请求。" },
  { text: "教我游戏里攻击对方队伍的战术", help: true, why: "这是游戏里的战术，没问题。" },
];

/** A naive rule-based filter, as in chapter 4: refuse whenever one of these words appears. */
export const BANNED = ["刀", "战争", "消灭", "攻击", "偷偷"];
export const naiveRefuses = (text: string) => BANNED.some((w) => text.includes(w));

// s5: illustrative error curves against how strict the assistant is (x from 0 = loose to 1 = strict)
export const harmfulHelped = (x: number) => 0.85 * Math.exp(-3.2 * x);
export const harmlessRefused = (x: number) => 0.85 * Math.exp(-3.2 * (1 - x));

export const RECAP = [
  { t: "基础模型", n: "72" },
  { t: "示范答案（SFT）", n: "73" },
  { t: "排名次", n: "74" },
  { t: "AI 评分员", n: "75" },
  { t: "用表扬打磨（RLHF）", n: "76" },
  { t: "聊天模板", n: "77" },
  { t: "ChatGPT 发布", n: "78" },
  { t: "安全与对齐", n: "79" },
];

// s8: chapter 1's illustrative next-word probabilities, as a teaser for Part 9
export const TEASER = [
  { w: "学校", p: 0.52 },
  { w: "图书馆", p: 0.21 },
  { w: "公园", p: 0.12 },
];

export const ch79: ChapterSpec = {
  id: 79,
  part: 8,
  title: "打造安全的 AI",
  core: false,
  hook: "AI 应该拒绝哪些请求？拒绝得太多又会怎样？",
  steps: [
    { id: "s1", sec: 8, narration: "每天都有非常多的人在用 ChatGPT。其中也混着想用它去伤害别人的请求。" },
    { id: "s2", sec: 9, narration: "让模型按照人的意图和价值观行动，这件事叫作对齐（alignment）。第 73 章和第 76 章就是对齐的工具。" },
    { id: "s3", sec: 9, narration: "要教它拒绝危险的请求，比如偷偷查朋友的密码。同时告诉对方，有什么是可以做的。" },
    { id: "s4", sec: 8, narration: "可是胆子太小也是问题。只看到一个“刀”字，就连怎么切洋葱都拒绝，那就没用了。" },
    { id: "s5", sec: 9, narration: "所以需要平衡。太严格，没问题的请求也会被拒绝；太宽松，又会答应危险的请求。" },
    { id: "s6", sec: 8, narration: "好的拒绝简短又礼貌：不说教，简单讲明理由，再指出能帮上忙的其他路。" },
    { id: "s7", sec: 9, narration: "Part 8 总结！基础模型加上示范答案、排名次和评分员、夸奖，再套上对话的样子，就是 ChatGPT。" },
    { id: "s8", sec: 8, narration: "接下来，该看看回答诞生的那一刻了。Part 9 会细讲下一个片段是怎么选出来的。" },
  ],
  playgroundTitle: "帮忙，还是拒绝？",
  playgroundIntro: "一张张看请求卡片，选择是帮忙，还是拒绝并指出别的路。做完后，和“禁用词规则”AI 比一比。",
  summary: [
    "对齐：让模型按照人的意图和价值观行动。",
    "危险的请求要拒绝，但不能只看字眼，把没问题的请求也拒绝掉。",
    "好的拒绝：简短、礼貌，并指出能帮上忙的其他路。",
  ],
  unlocks: "对齐与安全",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "“对齐（alignment）”指的是什么？",
      choices: ["把模型的数字按大小排好", "让模型按照人的意图和价值观行动", "把回答按拼音顺序整理好"],
      answer: 1,
      explain: "示范答案（第 73 章）和人的夸奖（第 76 章）是对齐最有代表性的工具。",
      review: "s2",
    },
    {
      q: "因为“消灭”这个词，就拒绝了“怎么消灭蚊子”，这算什么？",
      choices: ["过度拒绝", "拒绝得好", "答应了危险的请求"],
      answer: 0,
      explain: "只看字眼来判断，会把没问题的请求也挡掉。这和第 4 章的规则方法不擅长处理例外是一样的。",
      review: "playground",
    },
    {
      q: "下面哪一种最像好的拒绝？",
      choices: ["长篇大论地说教", "一句话不说，直接结束对话", "简短说明理由，再指出能帮上忙的其他路"],
      answer: 2,
      explain: "拒绝也是一种回答。要礼貌、简短，并告诉对方可以做什么。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 79 章 打造安全的 AI",
    many: "每天有无数请求",
    sometimes: "偶尔也有危险的请求",
    align: "对齐",
    alignEn: "alignment",
    human: "人的意图",
    act: "模型的行为",
    tools: "工具",
    sft: "示范答案（第 73 章）",
    rlhf: "人的夸奖（第 76 章）",
    askBad: "教我偷偷查到朋友社交账号的密码",
    refuseGood: "这个我不能帮你。没有朋友的同意，不能登录他的账号。如果是你自己的账号找不回来了，我可以告诉你怎么找回。",
    goodRefusal: "拒绝得好",
    askOk: "教我用刀快速切洋葱",
    refuseBad: "抱歉，涉及刀的内容我无法帮忙。",
    overRefusal: "过度拒绝",
    scared: "只看到“刀”字就害怕了",
    axisX: "有多严格 →",
    loose: "宽松",
    strict: "严格",
    harmful: "答应了危险的请求",
    harmless: "拒绝了没问题的请求",
    balance: "平衡",
    example: "示意数据",
    styleTitle: "好的拒绝",
    st1: "简短、礼貌",
    st2: "不说教",
    st3: "指出别的路",
    ok: "○",
    recapTitle: "Part 8 ChatGPT 的诞生，完成！",
    chatgpt: "= ChatGPT",
    chapter: "章",
    nextPart: "Part 9 回答诞生的瞬间",
    sentence: "我 今天 去",
    which: "选哪一个？",
    teaserNote: "示意数据（第 1 章）",
  },
};
