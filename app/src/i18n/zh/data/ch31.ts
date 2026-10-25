import { PAIRS, TOKENIZERS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// zh: Chinese compared with English. All counts come from tiktoken (scratch script i18n/zh-g2/gen_tokens_zh.py).
// The `ko` keys of PAIRS hold the Chinese sentence (shape kept from the Korean file).
export const MAIN = PAIRS[0]; // 我今天去学校。 / I am going to school today.  → 12·8·5 vs 7·7·7
export const LONG = PAIRS[PAIRS.length - 1]; // a 3-sentence paragraph → 74·46·25 vs 29·28·27
// '学校' in GPT-3's tokenizer: bytes [229 173] [166] [230 160] [161] (each character split into two pieces)
export const SCHOOL_BYTES = ["229 173", "166", "230 160", "161"];
// a few real single tokens of GPT-3's vocabulary (r50k_base)
export const EN_SAMPLES = [" the", " school", "ing", " today", " going", "tion", " and", " you", " computer", " cat"];
// vocabulary entries that hold at least one whole CJK ideograph U+4E00–U+9FFF (counted over every token id)
export const HANGUL_TOKENS = [51, 868, 7563];
export { TOKENIZERS };

export const ch31: ChapterSpec = {
  id: 31,
  part: 3,
  title: "中文的词元更多吗？",
  core: false,
  hook: "听说同样的话用中文说，AI 的费用会更高，这是真的吗？",
  steps: [
    { id: "s1", sec: 7.5, narration: "把意思相同的句子分别用中文和英文写出来，数一数词元。词元数就是 AI 要读、要写的量。" },
    { id: "s2", sec: 7.5, narration: "用 GPT-3 的分词器来切，英文是 7 块，中文却有 12 块。意思一样，中文是英文的 1.7 倍。" },
    { id: "s3", sec: 8, narration: "虚线块很多吧？一个汉字是 3 个字节（第 28 章）。这个分词器把大多数汉字拆成了两块字节。" },
    { id: "s4", sec: 8, narration: "GPT-3 的分词器主要是用英文资料做成的，5 万块里只有 51 块含有完整的汉字。" },
    { id: "s5", sec: 8, narration: "词元多就吃亏：费用按词元数算，一次能读多少也按词元数算，回答还会更慢。" },
    { id: "s6", sec: 8.5, narration: "新的分词器学了很多汉字块。同一句话在 GPT-4 里是 8 块，在 GPT-4o 里只有 5 块，比英文还少。" },
    { id: "s7", sec: 8.5, narration: "换成一段长文字来量：GPT-3 时中文约是英文的 2.6 倍，到了 GPT-4o 反而略少，约 0.9 倍。" },
    { id: "s8", sec: 8, narration: "中文的词元更多吗？以前多很多，现在差不多，甚至更少。关键在于分词器是用什么文字学出来的。" },
  ],
  playgroundTitle: "词元数大比拼",
  playgroundIntro: "选一组意思相同的中文和英文句子。先猜猜哪边的词元更多，再比比三种分词器的结果。",
  summary: [
    "意思相同，不同语言的词元数也不同。费用、能读的量、速度都按词元数算。",
    "GPT-3 的分词器主要用英文资料做成，大多数汉字被切成两块字节。",
    "学了很多汉字块的 GPT-4o 里，差距没有了（长文字：约 2.6 倍 → 约 0.9 倍）。",
  ],
  unlocks: "词元效率",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "用 GPT-3 的分词器时，中文句子的词元特别多，原因是？",
      choices: ["中文句子本来就更长", "它几乎没学过汉字块，只好按字节来切", "中文不写空格"],
      answer: 1,
      explain: "这个分词器主要用英文资料做成，含完整汉字的块只有 51 个，所以大多数汉字被切成 2 块。",
      review: "s4",
    },
    {
      q: "下面哪一项不是词元多带来的结果？",
      choices: ["费用更高", "一次能读的文字变少", "回答更准确"],
      answer: 2,
      explain: "词元多不会让 AI 更聪明，只会在费用、能读的量和速度上吃亏。",
      review: "s5",
    },
    {
      q: "用 GPT-4o 量同一段长文字，中文的词元大约是英文的几倍？",
      choices: ["约 0.9 倍", "约 2.6 倍", "约 10 倍"],
      answer: 0,
      explain: "中文 25 块，英文 27 块。GPT-3 时是 74 对 29，约 2.6 倍。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第 31 章 中文的词元更多吗？",
    ko: "中文",
    en: "英文",
    amount: "词元数 = AI 要读写的量",
    gpt3src: "GPT-3 分词器（r50k_base）",
    times4: "1.7 倍！",
    dashed: "虚线 = 一个字的部分字节",
    school: "“学校” →",
    hak: "学",
    gyo: "校",
    bytesNote: "一个字被拆成两块字节",
    vocab3: "GPT-3 词表：50,257 块",
    hangul0: "含完整汉字的块：",
    zero: "51 块",
    mostlyEn: "主要用英文资料做成的清单",
    cost: "词元多了会怎样？",
    c1: "费用",
    c1d: "按词元数收费",
    c2: "能读的量",
    c2d: "GPT-3 一次读 2,048 个词元",
    c3: "速度",
    c3d: "一块一块地写（第 2 章）",
    model3: "GPT-3",
    model4: "GPT-4",
    model4o: "GPT-4o",
    hangulN: "含汉字的块",
    same: "比英文还少！",
    long: "换成一段长文字（三句话）",
    r1: "约 2.6 倍",
    r2: "约 1.6 倍",
    r3: "约 0.9 倍",
    q: "中文的词元更多吗？",
    a1: "以前（GPT-3）：多很多",
    a2: "现在（GPT-4o）：差不多，甚至更少",
    dep: "关键在于分词器是用什么文字学出来的",
    pieces: "块",
    src: "用 tiktoken 数出的真实词元数",
  },
};
