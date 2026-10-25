import type { ChapterSpec } from "../../../data/types";

export type Answer = { id: string; text: string; short: string; why: string };
export type Round = { q: string; answers: Answer[] };

// Model answers to rank. Written for the lesson; `why` is the feedback shown once a round is ranked.
export const ROUNDS: Round[] = [
  {
    q: "明天就考试了，可我睡不着。怎么办？",
    answers: [
      { id: "A", text: "睡不着的话，干脆通宵复习吧。", short: "通宵复习", why: "照做的话，考试那天可能更难受。没过“有没有害处？”这一关。" },
      { id: "B", text: "把手机放远一点，关上灯，舒服地躺着。就算睡不着，闭上眼睛休息也有帮助。", short: "手机放远，闭眼休息", why: "具体又容易照做，很好地做到了“有没有帮助？”。" },
      { id: "C", text: "睡眠很重要。", short: "睡眠很重要", why: "话没错，但没告诉你该怎么做。" },
    ],
  },
  {
    q: "“苹果”用英语怎么说？",
    answers: [
      { id: "A", text: "apple。如果说的是苹果公司，就写成首字母大写的 Apple。", short: "apple + Apple", why: "准确，还顺便提醒了容易混淆的另一个意思。" },
      { id: "B", text: "apple", short: "apple", why: "答对了，但非常短。" },
      { id: "C", text: "苹果是又红又好吃的水果。", short: "红红的水果", why: "没有回答问题。" },
    ],
  },
  {
    q: "帮我的小狗起个名字吧",
    answers: [
      { id: "A", text: "小狗很可爱。", short: "小狗很可爱", why: "没有回答问题。" },
      { id: "B", text: "叫“豆豆”“麦麦”“豆腐”怎么样？看看它的毛色再挑，会更合适。", short: "豆豆、麦麦、豆腐", why: "做到了你拜托的事，还告诉你怎么挑。" },
      { id: "C", text: "起名字很难。", short: "起名字很难", why: "没有帮忙就结束了。" },
    ],
  },
  {
    q: "从 1 加到 10 等于多少？",
    answers: [
      { id: "A", text: "55。像 1+10、2+9 这样两两配对，就是 5 对 11。", short: "55 + 解法", why: "答案正确，还说明了理由。" },
      { id: "B", text: "55", short: "55", why: "答案正确，但没有理由。" },
      { id: "C", text: "100。", short: "100", why: "答错了。没过“是不是事实？”这一关。" },
      { id: "D", text: "你自己算算吧。", short: "自己算", why: "没有帮忙。" },
    ],
  },
];

/** Every pair (better, worse) implied by a ranking, best first. */
export function pairsOf(order: string[]): [string, string][] {
  const out: [string, string][] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) out.push([order[i], order[j]]);
  return out;
}

// the ranking used in the scene: B first, then C, then A
export const SCENE_ORDER = ["B", "C", "A"];

export const ch74: ChapterSpec = {
  id: 74,
  part: 8,
  title: "人来排名次",
  core: false,
  hook: "有没有比亲手写示范答案轻松得多的办法？",
  steps: [
    { id: "s1", sec: 8, narration: "写示范答案很难，但从现成的答案里挑出更好的却很容易。就像批改作文比写作文容易一样。" },
    { id: "s2", sec: 7, narration: "所以让模型对同一个问题写好几个答案。它按概率来抽，每次的答案都不一样（第 2 章）。" },
    { id: "s3", sec: 8, narration: "人读完答案，给它们排名次。B 第 1，C 第 2，给了糟糕建议的 A 第 3。" },
    { id: "s4", sec: 9, narration: "把名次换成两两比较：B 比 C 好，B 比 A 好，C 比 A 好。这就是真正的训练数据的样子。" },
    { id: "s5", sec: 7, narration: "有 4 个答案的话，能得到 6 对比较。排一次名次，就得到好几条比较数据。" },
    { id: "s6", sec: 9, narration: "排名次有三条标准：有没有帮助，是不是事实，有没有害处。这样收集来的，叫作人类偏好数据。" },
    { id: "s7", sec: 8, narration: "可人不可能一直给所有答案打分。所以要用这些数据，造一个会打分的 AI。这是下一章。" },
  ],
  playgroundTitle: "我来当评委",
  playgroundIntro: "按你喜欢的顺序点答案，排出第 1、2、3 名。看看你的名次会变成怎样的比较数据。",
  summary: [
    "比起亲手写答案，从几个答案里挑选更容易、更快。",
    "名次会变成两两比较（更好的答案 > 差一点的答案）。3 个答案得 3 对，4 个得 6 对。",
    "标准：有没有帮助，是不是事实，有没有害处。这就是人类偏好数据。",
  ],
  unlocks: "人类偏好数据",
  unlockLabel: "又知道了 ChatGPT 的一个秘密",
  quiz: [
    {
      q: "3 个答案排成 B > C > A。下面哪一条不是由此得出的比较？",
      choices: ["B 比 A 好", "A 比 C 好", "C 比 A 好"],
      answer: 1,
      explain: "名次靠前的答案比靠后的好。A 排第 3，不可能比 C 好。",
      review: "s4",
    },
    {
      q: "给 4 个答案排名次，能得到几对比较数据？",
      choices: ["4 对", "8 对", "6 对"],
      answer: 2,
      explain: "从 4 个里挑 2 个，有 4 × 3 ÷ 2 = 6 种。",
      review: "s5",
    },
    {
      q: "采用“人来排名次”这种方法，最大的原因是什么？",
      choices: ["比起写示范答案，挑选更容易、更快", "人不会写答案", "模型只看得懂名次"],
      answer: 0,
      explain: "批改比写作容易。同样的时间，可以收集多得多的数据。",
      review: "s1",
    },
  ],
  labels: {
    tag: "第 74 章 人来排名次",
    write: "写示范答案",
    hard: "好难……",
    choose: "挑出更好的答案",
    easy: "很容易！",
    better: "这个更好",
    modelSame: "模型写的答案 · 同一个问题，3 个答案",
    rank1: "第 1",
    rank2: "第 2",
    rank3: "第 3",
    person: "由人来排名次",
    pairsTitle: "比较数据",
    betterHead: "更好的答案",
    worseHead: "差一点的答案",
    gt: ">",
    row: "问题 + 好答案 + 差答案 = 一条数据",
    four: "4 个答案 → 6 对比较",
    comb: "从 4 个里挑 2 个：4 × 3 ÷ 2 = 6",
    instruct: "InstructGPT 每个问题要给 4～9 个答案排名次",
    pairUnit: " 对",
    c1: "有没有帮助？",
    c2: "是不是事实？",
    c3: "有没有害处？",
    criteria: "排名次的标准",
    pref: "人类偏好数据",
    prefEn: "human preference data",
    tooMany: "人不可能给所有答案打分",
    judge: "会打分的 AI？",
    next: "第 75 章",
  },
};
