import { NET, STORE_A, forward, type Net } from "../../../data/part2-toy";
import type { ChapterSpec } from "../../../data/types";

/**
 * 책임 of every knob for loss = (별점 − 정답)²: how much the loss changes per unit nudge.
 * Computed backwards, one multiplication per edge (the chain the chapter shows).
 */
export function blame(net: Net, x: readonly number[], target: number) {
  const f = forward(net, x);
  const dy = 2 * (f.y - target);
  const dh = net.v.map((v) => dy * v);
  const dz = dh.map((d, j) => (f.z[j] > 0 ? d : 0));
  const dW1 = net.W1.map((row, j) => row.map((_, i) => dz[j] * x[i]));
  const db1 = dz;
  const dv = f.h.map((h) => dy * h);
  const dc = dy;
  return { f, loss: (f.y - target) ** 2, dy, dh, dz, dW1, db1, dv, dc };
}

export function step(net: Net, x: readonly number[], target: number, lr: number): Net {
  const g = blame(net, x, target);
  const r = (v: number) => Math.round(v * 1e6) / 1e6;
  return {
    W1: net.W1.map((row, j) => row.map((w, i) => r(w - lr * g.dW1[j][i]))) as Net["W1"],
    b1: net.b1.map((b, j) => r(b - lr * g.db1[j])) as Net["b1"],
    v: net.v.map((v, j) => r(v - lr * g.dv[j])) as Net["v"],
    c: r(net.c - lr * g.dc),
  };
}

export const B0 = blame(NET, STORE_A.x, STORE_A.real);
export const LR23 = 0.005;
export const NET_AFTER = step(NET, STORE_A.x, STORE_A.real, LR23);
export const AFTER = blame(NET_AFTER, STORE_A.x, STORE_A.real);

export const ch23: ChapterSpec = {
  id: 23,
  part: 2,
  title: "反向传播：分摊责任",
  core: true,
  hook: "旋钮有几十亿个，猜错的时候，该改哪个、改多少？",
  steps: [
    { id: "s1", sec: 8, narration: "第 19 章的神经网络预测 A 店是 3.5 分，真实是 4.5 分，损失是 1。11 个旋钮里，该怪谁？" },
    { id: "s2", sec: 8, narration: "像第 21 章那样一个个稍微改改，就能知道。可 GPT-⁠3 有 1750 亿个旋钮，根本试不完。" },
    { id: "s3", sec: 8, narration: "所以从末端开始，倒着分摊责任。评分调高 0.01，损失就少 0.02，所以评分的责任是 −2。" },
    { id: "s4", sec: 9, narration: "评分是由“人气 × 1.5”得来的，所以人气的责任是 −2 × 1.5 = −3。责任沿着线倒着流回去。" },
    { id: "s5", sec: 9, narration: "排队权重和排队 2 相乘，得出人气，所以它的责任是 −3 × 2 = −6。乘法就这样一环扣一环。" },
    { id: "s6", sec: 8, narration: "“太辣”神经元当时是关着的。关着的神经元改变不了结果，责任也是 0，那些旋钮就不动。" },
    { id: "s7", sec: 8, narration: "这样倒着走一遍，所有旋钮的责任一下子都出来了。这就是反向传播（backpropagation）。" },
    { id: "s8", sec: 9.5, narration: "朝责任的反方向一点点调整，预测变成 4.2 分，损失从 1 降到 0.09。这个方法在 1986 年广为人知（第 3 章）。" },
  ],
  playgroundTitle: "责任追踪器",
  playgroundIntro: "选一个旋钮，看看它的责任是怎样从输出那边倒着一路乘过来的。再用“改一步”把损失降下来。",
  summary: [
    "反向传播：从损失出发倒着走，沿着线把责任一路乘下去。",
    "旋钮的责任 = 稍微改一点，损失变多少。关着的神经元后面是 0。",
    "倒着走一遍，就得到所有旋钮的责任，再朝反方向一点点调整。",
  ],
  unlocks: "反向传播",
  unlockLabel: "得到了一件学习工具",
  quiz: [
    {
      q: "评分的责任是 −2，评分 = 人气 × 1.5，人气的责任是多少？",
      choices: ["−3", "−0.5", "3.5"],
      answer: 0,
      explain: "人气稍微调高一点，评分就会涨它的 1.5 倍，所以责任是 −2 × 1.5 = −3。",
      review: "s4",
    },
    {
      q: "被 ReLU 关掉（输出 0）的神经元，连进去的那些权重的责任是多少？",
      choices: ["最大", "负数", "0"],
      answer: 2,
      explain: "关着的神经元，输入稍微变一点也还是 0，结果不会变，所以责任是 0。",
      review: "s6",
    },
    {
      q: "为什么一定需要反向传播？",
      choices: ["为了算损失", "为了一次就快速求出所有旋钮的责任", "为了增加输入数据"],
      answer: 1,
      explain: "一个个旋钮去试，要算 1750 亿次。反向传播倒着走一遍就全部求出来了。",
      review: "s2",
    },
  ],
  labels: {
    tag: "第 23 章 反向传播：分摊责任",
    title: "该怪谁？",
    example: "第 19 章的神经网络 · A 店 · 示意数据",
    spicy: "辣度",
    line: "排队",
    price: "价格",
    h1: "人气",
    h2: "太辣",
    out: "评分",
    loss: "损失",
    knobs: "11 个旋钮",
    knobsSub: "8 个权重 + 3 个偏置",
    target: "答案 4.5",
    gpt: "GPT-3：1750 亿个",
    oneByOne: "一个个稍微改改？试不完",
    backward: "倒着分摊责任",
    blame: "责任",
    nudge: "评分 +0.01 → 损失 −0.02",
    chainTitle: "排队权重的责任",
    chain: "−2 × 1.5 × 2 = −6",
    off: "关着 → 责任 0",
    bp: "反向传播（backpropagation）",
    all: "一次得到所有责任！",
    update: "新旋钮 = 旋钮 − 0.005 × 责任",
    before: "预测 3.5 · 损失 1",
    after: "预测 4.2 · 损失 0.09",
    year: "1986 反向传播广为人知（第 3 章）",
    big: "责任越大，线越粗",
  },
};
