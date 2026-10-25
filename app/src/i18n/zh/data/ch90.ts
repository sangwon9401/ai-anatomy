import type { ChapterSpec } from "../../../data/types";

/** bytes = parameters × bits ÷ 8; GB here means 10 亿 (10⁹) bytes */
export const sizeGB = (params: number, bits: number) => (params * bits) / 8 / 1e9;

export const GPT3 = 175e9;
export const SMALL = 3e9; // a 30 亿-parameter model for the worked example
export const BITS = [32, 16, 8, 4] as const;
export const PHONE_GB = [8, 12] as const; // a typical range for phone memory (RAM) today

/**
 * Quantise onto a ruler with 2^bits evenly spaced ticks from −range to +range.
 * Returns the tick value nearest to w.
 */
export function quantize(w: number, bits: number, range: number) {
  const n = 2 ** bits - 1;
  const step = (2 * range) / n;
  const k = Math.round((w + range) / step);
  return -range + k * step;
}

export const WEIGHTS = [0.82, -0.35, 0.07, -1.2]; // illustrative knob values (示意数据)
export const RANGE = 1.2;

// distillation: teacher's next-piece probabilities for "我 今天 去" (ch01), and a student before/after
export const NEXT = ["学校", "图书馆", "公园", "其他"];
export const TEACHER = [0.52, 0.21, 0.12, 0.15];
export const STUDENT_BEFORE = [0.3, 0.1, 0.35, 0.25];
export const STUDENT_AFTER = [0.49, 0.22, 0.13, 0.16];

export const PARAM_PRESETS = [
  { key: "1b", label: "10 亿个", n: 1e9 },
  { key: "3b", label: "30 亿个", n: 3e9 },
  { key: "8b", label: "80 亿个", n: 8e9 },
  { key: "gpt3", label: "1750 亿个（GPT-3）", n: GPT3 },
];

export const ch90: ChapterSpec = {
  id: 90,
  part: 10,
  title: "我手机里的 AI",
  core: false,
  hook: "那么庞大的 AI，怎么能不联网就在我的手机里运行？",
  steps: [
    { id: "s1", sec: 8, narration: "GPT-3 有 1750 亿个参数，也就是“旋钮”（第 12 章）。每个用 32 位（4 字节）来存，一共多大？" },
    { id: "s2", sec: 8, narration: "1750 亿 × 4 字节 = 7000 亿字节，大约 700GB。现在手机内存一般是 8～12GB，差得远呢。" },
    { id: "s3", sec: 8, narration: "第一种方法是做小模型：让小小的学生模型学着模仿大大的老师模型的回答。这叫蒸馏。" },
    { id: "s4", sec: 9, narration: "它模仿的不只是一个正确答案，而是老师的整组概率柱子。连“图书馆也挺像样”这一点也学到了。" },
    { id: "s5", sec: 9, narration: "第二种方法是把数记得粗一点。8 位就像有 256 个刻度的尺子，4 位只有 16 个刻度。这叫量化。" },
    { id: "s6", sec: 8, narration: "用 8 位的尺子量 0.82，得到 0.824；用 4 位的尺子量，得到 0.88。有点偏差，但模型大体上照样能用。" },
    { id: "s7", sec: 8, narration: "拿 30 亿参数的模型算一算：32 位是 12GB，8 位是 3GB，4 位是 1.5GB。这下装得进手机了！" },
    { id: "s8", sec: 9, narration: "在手机里运行，不联网也能用，我写的内容也不会离开手机。不过小模型遇到难题可能会吃力。" },
  ],
  playgroundTitle: "模型压缩计算器",
  playgroundIntro: "选好参数个数和位数，算算模型有多大。装得进手机内存吗？下面还能看看用刻度尺子量数时会差多少。",
  summary: [
    "模型大小 = 参数个数 × 每个数的字节数。GPT-3 用 32 位存，大约 700GB。",
    "蒸馏：小的学生模型模仿大的老师模型的概率柱子来学习。",
    "量化：不用 32 位，改用 8 位、4 位粗略地记。小模型 + 量化 = 手机里的 AI。",
  ],
  unlocks: "模型压缩",
  unlockLabel: "又得到一张新能力卡",
  quiz: [
    {
      q: "30 亿个参数用 8 位（1 字节）来存，有多少 GB？",
      choices: ["3GB", "12GB", "30GB"],
      answer: 0,
      explain: "30 亿 × 1 字节 = 30 亿字节 = 3GB。如果用 32 位（4 字节），就是 12GB。",
      review: "s7",
    },
    {
      q: "蒸馏（distillation）中，学生模型模仿的是什么？",
      choices: ["老师模型的参数个数", "老师模型给出的概率柱子", "老师模型的名字"],
      answer: 1,
      explain: "它模仿的是老师的整组概率柱子，里面的信息比单个正确答案多得多。",
      review: "s4",
    },
    {
      q: "量化之后会发生什么？",
      choices: ["模型变得更准确", "参数个数变多", "体积变小，数值稍有偏差"],
      answer: 2,
      explain: "就像用刻度更少的尺子去量，数值会有点偏差。但体积能大大缩小。",
      review: "s6",
    },
  ],
  labels: {
    tag: "第 90 章 我手机里的 AI",
    knobs: "1750 亿个旋钮",
    oneKnob: "1 个旋钮 = 32 位 = 4 字节",
    byte: "1 字节",
    bitsOf: "例：用 32 位记下 0.82 的样子",
    gb700: "700GB",
    eq: "1750 亿 × 4 字节 = 7000 亿字节",
    total: "≈ 700GB",
    phone: "内存 8~12GB",
    noWay: "差得远呢！",
    teacher: "老师模型",
    student: "学生模型",
    big: "又大又聪明",
    small: "又小又轻",
    copy: "模仿",
    distill: "蒸馏（distillation）",
    context: "我 今天 去 ___",
    tBars: "老师的概率",
    sBars: "学生的概率",
    oneHot: "只看正确答案：学校 100%，其余 0%",
    more: "连“图书馆也挺像样”都学到！",
    example: "* 示意数据",
    r32: "32 位：刻度几乎无限密",
    r8: "8 位：256 个刻度",
    r4: "4 位：16 个刻度",
    quant: "量化（quantization）",
    w: "0.82",
    q8: "→ 0.824",
    q4: "→ 0.88",
    off: "稍有偏差，但大体照样能用",
    model3: "30 亿参数的模型",
    line: "手机内存 8GB",
    fits: "装得进手机！",
    tight: "勉强",
    gb12: "12GB",
    gb6: "6GB",
    gb3: "3GB",
    gb15: "1.5GB",
    b32: "32 位",
    b16: "16 位",
    b8: "8 位",
    b4: "4 位",
    offline: "不联网也能用",
    private: "我写的内容不出手机",
    npu: "现在的手机芯片还有专门做 AI 计算的部件（NPU）",
    weak: "不过遇到难题可能吃力",
    chatQ: "帮我整理一下明天的安排",
    chatA: "好的！分三件事来看……",
    onDevice: "正在手机里计算",
  },
};
