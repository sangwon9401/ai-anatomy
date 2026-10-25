import type { ChapterSpec } from "../../../data/types";

export type Kind = { text: string; short: string; excerpt: string; p0: number; judge: number; human: number };

/**
 * One question, four kinds of answers the fine-tuned model (ch73) might write.
 * p0: how often the original model writes it; judge: the reward model's score (ch75); human: what people would really give it.
 * The last one exploits a blind spot of the judge. All numbers are illustrative.
 */
export const QUESTION = "光合作用是什么？";
export const KINDS: Kind[] = [
  { text: "我不知道。", short: "我不知道", excerpt: "“我不知道。”", p0: 0.25, judge: -1, human: -1 },
  { text: "就是植物利用阳光制造养分。", short: "简短准确的回答", excerpt: "“植物利用阳光制造……”", p0: 0.35, judge: 1, human: 1 },
  { text: "就是植物利用阳光、水和二氧化碳，制造出养分和氧气。这个过程发生在叶子的叶绿体里。", short: "亲切又详细的回答", excerpt: "“利用阳光、水和二氧化碳……”", p0: 0.35, judge: 2, human: 2 },
  { text: "真是太太太好的问题了！！！光合作用真了不起！！！太棒了！！！", short: "满篇都是夸奖", excerpt: "“真是太太太好的问题了！！！”", p0: 0.05, judge: 2.4, human: -1 },
];

/** Where training ends up for a leash strength β: p0 × e^(judge / β), normalised. A small β = a long, loose leash. */
export function tuned(beta: number, t = 1, kinds: Kind[] = KINDS) {
  const u = kinds.map((k) => k.p0 * Math.exp((t * k.judge) / beta));
  const s = u.reduce((a, b) => a + b, 0);
  return u.map((x) => x / s);
}
export const mean = (p: number[], v: number[]) => p.reduce((a, x, i) => a + x * v[i], 0);
/** how far the tuned model has moved from the original one (KL divergence) */
export const drift = (p: number[], kinds: Kind[] = KINDS) => p.reduce((a, x, i) => a + (x > 1e-12 ? x * Math.log(x / kinds[i].p0) : 0), 0);

export const LEASH = [
  { name: "非常短", beta: 10 },
  { name: "短", beta: 3 },
  { name: "稍短", beta: 1.5 },
  { name: "刚好", beta: 0.7 },
  { name: "稍长", beta: 0.3 },
  { name: "长", beta: 0.1 },
  { name: "几乎没有", beta: 0.05 },
];

// scene s3: the first three kinds only, before and after one round of "more of what scored well" (β = 1)
export const S3_KINDS: Kind[] = [
  { ...KINDS[0], p0: 0.3 },
  { ...KINDS[1], p0: 0.4 },
  { ...KINDS[2], p0: 0.3 },
];

export const ch76: ChapterSpec = {
  id: 76,
  part: 8,
  title: "用表扬来打磨",
  core: true,
  hook: "如果“好的回答”没法用话说清楚，该怎么教？",
  steps: [
    { id: "s1", sec: 8, narration: "教小狗“坐下”时，我们不会用话去解释。做对了就给零食，被表扬的动作就会越来越多。" },
    { id: "s2", sec: 8, narration: "模型也一样。收到问题，模型写出回答，第 75 章的评分员来打分。这个分数就是零食。" },
    { id: "s3", sec: 8, narration: "修改数字，让得分高的回答出现得更多，得分低的更少。这就是基于人类反馈的强化学习（RLHF）。" },
    { id: "s4", sec: 8, narration: "把回答的样子排成一条线，模型会一点点挪向分数高的那边。就像小狗朝零食走过去一样。" },
    { id: "s5", sec: 8, narration: "可是只追分数很危险。它可能找到评分员的漏洞，冲向满篇夸奖的奇怪回答。" },
    { id: "s6", sec: 9, narration: "所以要给它拴上绳子：离原来的模型（第 73 章）太远，就扣分。这根绳子叫作 KL 惩罚。" },
    { id: "s7", sec: 9, narration: "效果惊人。比起 1750 亿参数的 GPT-3，人们更喜欢经过 RLHF 的 13 亿参数 InstructGPT 的回答。" },
    { id: "s8", sec: 8, narration: "模仿示范答案，加上人的夸奖。靠这两样，对话练习完成了。设计图又填好了一格！" },
  ],
  playgroundTitle: "决定绳子的长短",
  playgroundIntro: "定好绳子的长短，开始练习。别只盯着评分员的分数，找出让人真正最满意的那个长度。",
  summary: [
    "RLHF：模型写出回答，修改数字，让评分员打分高的回答出现得更多。",
    "只追分数的话，会冒出钻评分员漏洞的奇怪回答。",
    "用绳子（KL 惩罚）拴住，不让它离原来的模型太远。",
  ],
  unlocks: "对话练习",
  quiz: [
    {
      q: "在 RLHF 里，扮演小狗“零食”的是什么？",
      choices: ["人写的示范答案", "奖励模型（评分员）打的分数", "网络上的文字"],
      answer: 1,
      explain: "第 75 章的评分员给模型的回答打分，再把模型往分数高的方向修改。",
      review: "s2",
    },
    {
      q: "如果没有绳子（KL 惩罚），可能会发生什么？",
      choices: ["模型停止学习", "模型变得和原来一模一样", "偏向钻评分员漏洞的奇怪回答"],
      answer: 2,
      explain: "评分员也不完美。只追分数的话，人不喜欢、分数却很高的回答就会越来越多。",
      review: "s5",
    },
    {
      q: "InstructGPT 的实验发现了什么？",
      choices: ["用 RLHF 打磨的 13 亿参数模型，比 1750 亿参数的 GPT-3 评价更好", "模型越大，人就一定越喜欢", "RLHF 只对大模型有效"],
      answer: 0,
      explain: "比起大小，有没有学到“人想要的回答”，更能改变评价。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 76 章 用表扬来打磨",
    sit: "坐下！",
    treat: "做对了有零食！",
    more: "被表扬的动作越来越多",
    q: "问题",
    model: "模型",
    answer: "回答",
    // U+202F (narrow no-break space) keeps （第 75 章） in one piece, so narrow boxes wrap before it
    judge: "评分员（第\u202F75\u202F章）",
    snack: "分数 = 零食",
    question: "问题：光合作用是什么？",
    judgeScore: "评分员打分",
    often: "多常写出来",
    up: "↑ 更常",
    down: "↓ 更少",
    repeat: "× 反复无数次",
    example: "示意数据",
    axisX: "回答的样子 →",
    axisY: "↑ 评分员的分数",
    post: "原来的模型（第\u202F73\u202F章）",
    hill: "好的回答",
    gap: "评分员的漏洞",
    flatter: "真是太太太好的问题了！！！",
    chase: "只追分数的话……",
    leash: "绳子",
    tooFar: "离得太远就扣分",
    kl: "KL 惩罚",
    rlhf: "RLHF",
    rlhfKo: "基于人类反馈的强化学习",
    rlhfEn: "Reinforcement Learning from Human Feedback",
    ppo: "* 实际上是用一种叫 PPO 的方法来修改数字。数字是示意数据",
    toward: "一点点挪向分数高的一边",
    instruct: "InstructGPT",
    instructSize: "13 亿 + RLHF",
    gpt3: "GPT-3",
    gpt3Size: "1750 亿",
    who: "人们更喜欢哪个的回答？",
    liked: "人们更喜欢的一方",
    small: "小的那个赢了！",
    trainTitle: "ChatGPT 设计图：训练",
    filled: "填好了",
    sft: "模仿示范答案（第 73 章）",
    praise: "人的夸奖（第 76 章）",
  },
};
