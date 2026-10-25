import type { ChapterSpec, Highlighter } from "../../../data/types";

/** 惊讶 in "halvings": how many times 1 must be halved to reach p, i.e. log₂(1/p). */
export const surprise = (p: number) => Math.log2(1 / p);

/** ch01's numbers for "我 今天 去 → ?" (illustrative), with the rest merged into 其他. */
export const NEXT: { w: string; p: number; c: Highlighter }[] = [
  { w: "学校", p: 0.52, c: "yellow" },
  { w: "图书馆", p: 0.21, c: "mint" },
  { w: "公园", p: 0.12, c: "sky" },
  { w: "其他", p: 0.15, c: "violet" },
];

/** The halving ladder: probability as a fraction label and its 惊讶. */
export const LADDER = [
  { label: "1", p: 1 },
  { label: "1/2", p: 1 / 2 },
  { label: "1/4", p: 1 / 4 },
  { label: "1/8", p: 1 / 8 },
];

/** 第 64 章's four questions with illustrative probabilities the model gave the right answer. */
export const QUESTIONS65 = [
  { ctx: "我", ans: "今天", p: 0.25 },
  { ctx: "我 今天", ans: "去", p: 0.5 },
  { ctx: "我 今天 去", ans: "学校", p: 0.52 },
  { ctx: "我 今天 去 学校", ans: "。", p: 0.8 },
];

export const meanSurprise = (ps: number[]) => ps.reduce((a, p) => a + surprise(p), 0) / ps.length;

export const ch65: ChapterSpec = {
  id: 65,
  part: 7,
  title: "惊讶有多大",
  core: true,
  hook: "模型给正确答案押了 52%，它算错了多少？能不能用一个数字来衡量错的程度？",
  steps: [
    { id: "s1", sec: 10, narration: "在“我 今天 去”后面，模型给“学校”打了 52%。正确答案正是“学校”。那模型错了多少呢？" },
    { id: "s2", sec: 11, narration: "换成人来说，就是“惊讶”。料到的事发生了，不太惊讶；没料到的事发生了，就会吓一跳。" },
    { id: "s3", sec: 11, narration: "我们把惊讶变成数字。确定的事（概率 1）发生了，惊讶是 0。概率每减半一次，惊讶就加 1。" },
    { id: "s4", sec: 11, narration: "1/4 是 2，1/8 是 3。也就是数一数，2 要乘几次才得到 8。2 × 2 × 2 = 8，所以是 3。" },
    { id: "s5", sec: 11, narration: "把点连起来看，概率越接近 0，惊讶就越往上猛涨。数学里把这种计算叫作对数，高中数学会学到。" },
    { id: "s6", sec: 10, narration: "“学校”52%，惊讶约 0.94；只给 12% 的话，约 3.06。押在正确答案上越多，越不惊讶。" },
    { id: "s7", sec: 11, narration: "每道题惊讶的平均，叫交叉熵（cross-entropy）。这就是 GPT 的损失，训练就是把它变小。" },
  ],
  playgroundTitle: "惊讶测量仪",
  playgroundIntro: "改一改给正确答案的概率。看看概率每减半一次，惊讶会增加多少。",
  summary: [
    "惊讶：给正确答案的概率越低，惊讶越大。概率是 1 时，惊讶是 0。",
    "概率每减半一次，惊讶 +1（1/2 → 1，1/4 → 2，1/8 → 3）。这种计算就是对数。",
    "每道题惊讶的平均 = 交叉熵 = GPT 的损失。训练就是把它变小。",
  ],
  unlocks: "交叉熵",
  unlockLabel: "又拿到一个学习工具",
  quiz: [
    {
      q: "给正确答案的概率是 1/4，惊讶是多少？（以 2 为底）",
      choices: ["1", "2", "4"],
      answer: 1,
      explain: "1 减半两次就是 1/4。2 × 2 = 4，所以惊讶是 2。",
      review: "s4",
    },
    {
      q: "模型给正确答案 90% 和给 10% 两种情况，哪一种损失更大？",
      choices: ["给了 10% 的情况", "给了 90% 的情况", "两种一样"],
      answer: 0,
      explain: "押在正确答案上越少，就越惊讶。惊讶越大，损失也越大。",
      review: "s6",
    },
    {
      q: "把交叉熵损失变小，意思是什么？",
      choices: ["减少候选的数量", "给所有候选相同的概率", "给正确的片段更高的概率"],
      answer: 2,
      explain: "给正确答案的概率越高，惊讶就越小，而惊讶的平均就是损失。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 65 章 惊讶有多大",
    ctx: "我 今天 去",
    example: "示意数据",
    answer: "正确答案！",
    howWrong: "错了多少？",
    rain90: "下雨概率 90%",
    rain10: "下雨概率 10%",
    rained: "→ 真下雨了！",
    little: "有点惊讶",
    big: "吓一跳！",
    prob: "概率",
    surprise: "惊讶",
    halve: "每减半一次 +1",
    times: "8 = 2 × 2 × 2 → 惊讶 3",
    axisP: "给正确答案的概率 →",
    axisS: "↑ 惊讶",
    soar: "越接近 0，涨得越猛",
    formula: "惊讶 = log₂(1 ÷ 概率)",
    log: "对数：高中数学会学到",
    go52: "学校 52%",
    go12: "学校 12%",
    lessSurprise: "押在正确答案上越多，越不惊讶",
    colQ: "题目",
    colP: "答案概率",
    colS: "惊讶",
    mean: "平均",
    ce: "交叉熵",
    loss: "= GPT 的损失（第 20 章）",
    learn: "训练 = 减少惊讶",
    base: "实际训练时用 e（第 14 章）代替 2，道理一样",
  },
};
