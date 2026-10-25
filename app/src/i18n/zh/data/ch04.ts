import type { ChapterSpec } from "../../../data/types";

// Word scores the "trained" filter ended up with. Illustrative values (labelled so in the UI),
// standing in for what a real filter would learn from thousands of examples.
// Same values as the Korean original, word for word (광고 → 广告, 쿠폰 → 优惠券, 급식 → 午餐, ...).
export const WEIGHTS: Record<string, number> = {
  广告: 1.8, 免费: 0.9, 优惠券: 2.1, 中奖: 2.4, 奖品: 1.9, 链接: 1.5, 点击: 1.3, 特价: 1.7, 打折: 1.4,
  现在: 0.6, 领取: 0.7, 恭喜: 0.8, 课程: 0.4, 首映: 0.3, 仅限今天: 0.8, 查看: 0.5, 抽奖活动: 1.0,
  幸运用户: 1.6, 午餐: -1.6, 申请: -0.3, 通知: -0.6, 作业: -1.2, 学校: -1.9, 老师: -1.4,
  明天: -0.8, 一起: -1.0, 周末: -0.4, 电影: -0.2, 去吗: -0.9, 数学: -0.7, 范围: -0.5,
  告诉我: -0.8, 补习班: -0.2, 活动: -0.3, 家长信: -1.5, 朋友: -1.1, 炸鸡: -0.3, 要不要: -0.9,
  菜单: -0.4, 换了: -0.7, 发的: -0.6, 看了吗: -0.8,
};

export type Msg = { text: string; spam: boolean };

export const KNOWN: Msg[] = [
  { text: "【广告】免费优惠券现在领取", spam: true },
  { text: "【广告】免.费优惠券中奖！", spam: true },
  { text: "恭喜中奖！点击链接领取奖品", spam: true },
  { text: "家长信：免费午餐申请通知", spam: false },
  { text: "告诉我明天数学作业的范围", spam: false },
  { text: "老师：明天学校活动通知", spam: false },
  { text: "这周末免费电影首映，一起去吗？", spam: false },
  { text: "【广告】补习班特价课程优惠券", spam: true },
];

export const FRESH: Msg[] = [
  { text: "仅限今天特价打折！现在查看", spam: true },
  { text: "朋友，我有张优惠券，要不要一起吃炸鸡？", spam: false },
  { text: "抽奖活动：您被选为幸运用户", spam: true },
  { text: "听说免费午餐的菜单换了", spam: false },
  { text: "老师发的链接你看了吗？", spam: false },
];

export const RULE_WORDS = ["免费", "优惠券", "中奖", "广告", "链接"];

const VOCAB = Object.keys(WEIGHTS).sort((a, b) => b.length - a.length);

/** Chinese has no spaces, so split at punctuation and then match the longest known word at each position.
 * Characters that start no known word are kept together as one unknown word, so "免.费" stays a different word from "免费". */
export const words = (text: string) => {
  const out: string[] = [];
  for (const part of text.split(/[\s【】[\](){}:：!！?？,，、。]+/)) {
    let unknown = "";
    let i = 0;
    while (i < part.length) {
      const hit = VOCAB.find((v) => part.startsWith(v, i));
      if (hit) {
        if (unknown) out.push(unknown);
        unknown = "";
        out.push(hit);
        i += hit.length;
      } else {
        unknown += part[i];
        i += 1;
      }
    }
    if (unknown) out.push(unknown);
  }
  return out.filter(Boolean);
};

export const scoreOf = (text: string) => words(text).reduce((a, w) => a + (WEIGHTS[w] ?? 0), 0);

export const SCENE_SCALE = ["中奖", "优惠券", "广告", "免费", "通知", "作业", "午餐", "学校"];

export const ch04: ChapterSpec = {
  id: 4,
  part: 0,
  title: "靠规则 vs 靠数据",
  core: false,
  hook: "过滤垃圾短信的程序，要怎么做出来？",
  steps: [
    { id: "s1", sec: 6, narration: "假设我们要做一个过滤垃圾短信的程序。最简单的办法，是自己动手写规则。" },
    { id: "s2", sec: 7, narration: "有“免费”就是垃圾短信！好像挺管用？可要是发垃圾短信的人写成“免.费”，它就直接漏过去了。" },
    { id: "s3", sec: 7, narration: "反过来，学校发的“免费午餐通知”却被当成垃圾短信拦下。规则改了又改，永远改不完。" },
    { id: "s4", sec: 8, narration: "于是人们把方法反过来：不写规则，而是给电脑看大量“这条是垃圾、这条正常”的例子，让它自己找出规则。" },
    { id: "s5", sec: 8, narration: "学完的模型里，每个词都有了分数。中奖、优惠券偏向垃圾短信，午餐、学校偏向正常。这些分数没有人规定过。" },
    { id: "s6", sec: 8, narration: "现在，没见过的短信也能靠分数相加来判断。就算耍了“免.费”的花招，也会因为同时出现的优惠券和中奖被抓住。" },
    { id: "s7", sec: 8, narration: "规则由人来写，学习则由数据来教。ChatGPT 也不是一条条学语法规则，而是读了海量文字自己学会的。" },
  ],
  playgroundTitle: "垃圾短信过滤大比拼",
  playgroundIntro: "选几个词，做出你的规则：只要出现其中任何一个，就算垃圾短信。然后用没见过的短信来测试。",
  summary: [
    "规则方式：人亲手写“如果……就……”的规则，例外永远补不完。",
    "学习方式：给出带正确答案的例子，电脑自己找出规则（分数）。",
    "ChatGPT 也是从海量文字中自己学会的。",
  ],
  unlocks: "训练数据",
  quiz: [
    {
      q: "规则方式和学习方式最大的区别是什么？",
      choices: ["规则方式总是更准确", "规则由人来写，学习则是从例子中找出规则", "学习方式不需要电脑"],
      answer: 1,
      explain: "在学习方式里，人只提供带正确答案的例子，规则由电脑来找。",
      review: "s7",
    },
    {
      q: "要训练一个垃圾短信过滤器，需要什么？",
      choices: ["很多标好“垃圾/正常”的短信例子", "发垃圾短信的人的电话号码", "短信的发送时间"],
      answer: 0,
      explain: "带正确答案（垃圾/正常）的例子，就是它的课本。",
      review: "s4",
    },
    {
      q: "用“有免费就是垃圾短信”的规则检查“免费午餐通知”，会怎样？",
      choices: ["当作正常短信通过", "被错误地当成垃圾短信拦下", "规则会自己找出例外"],
      answer: 1,
      explain: "规则只会照写好的那样执行。例外得由人再写进去。",
      review: "s3",
    },
  ],
  labels: {
    tag: "第 4 章 靠规则 vs 靠数据",
    ruleTitle: "我写的规则",
    rule: "如果有“免费” → 垃圾短信",
    spam: "垃圾短信",
    ok: "正常",
    m1: "【广告】免费优惠券领取",
    m2: "【广告】免.费优惠券中奖！",
    m3: "家长信：免费午餐申请通知",
    pass: "漏网？！",
    blocked: "误拦？！",
    add1: "+ “免.费”也算垃圾短信",
    add2: "+ 但有“午餐”就算正常",
    add3: "+ 但有“首映”也算正常",
    add4: "+ 但……",
    endless: "改不完",
    examples: "几千条示例短信",
    learn: "学习",
    modelBox: "模型",
    findRule: "自己找出规则",
    scaleL: "偏正常",
    scaleR: "偏垃圾",
    made: "没有人规定过的分数",
    example: "示意数据",
    newMsg: "没见过的短信",
    total: "合计",
    unknown: "不认识的词 = 0",
    rWay: "规则方式",
    lWay: "学习方式",
    input: "输入",
    rules: "规则",
    answer: "答案",
    model: "规则（模型）",
    ex3: "恭喜中奖！点击链接",
    ex4: "明天数学作业范围",
    ex5: "【广告】补习班特价",
    dataMakes: "由数据来生成",
  },
};
