import type { ChapterSpec, Highlighter } from "../../../data/types";

// zh: the Korean chapter builds Hangul syllables from jamo with a formula. The Chinese chapter keeps the goal
// ("characters become numbers, and some are built from parts") with 汉字: the CJK block, the 214 Kangxi radicals that
// order it (radical, then stroke count), characters built from a 部首 and a 声旁, and UTF-8 bytes. 汉字 have no formula:
// the code is looked up, not computed. Every number was checked with a script (Python unicodedata, Unicode 15.1).
// The export names stay the Korean file's (the Part 3 registration and the playground import them).

/** left parts (部首) offered in the playground; `means` is what the radical hints at */
export const RADICALS: { r: string; means: string }[] = [
  { r: "氵", means: "水" },
  { r: "亻", means: "人" },
  { r: "女", means: "女性" },
  { r: "口", means: "嘴、声音" },
  { r: "扌", means: "手" },
  { r: "讠", means: "说话" },
];
/** right parts (声旁) offered in the playground; `py` is the part's own reading */
export const PHONETICS: { p: string; py: string }[] = [
  { p: "青", py: "qīng" },
  { p: "也", py: "yě" },
  { p: "马", py: "mǎ" },
  { p: "包", py: "bāo" },
  { p: "工", py: "gōng" },
  { p: "主", py: "zhǔ" },
];
/** BUILT[radical][phonetic]: a common character with that left part and right part, or "" (checked by hand and with a dictionary) */
export const BUILT: { ch: string; py: string }[][] = [
  // 青        也              马              包              工              主
  [{ ch: "清", py: "qīng" }, { ch: "池", py: "chí" }, { ch: "", py: "" }, { ch: "泡", py: "pào" }, { ch: "江", py: "jiāng" }, { ch: "注", py: "zhù" }], // 氵
  [{ ch: "倩", py: "qiàn" }, { ch: "他", py: "tā" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "住", py: "zhù" }], // 亻
  [{ ch: "", py: "" }, { ch: "她", py: "tā" }, { ch: "妈", py: "mā" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "", py: "" }], // 女
  [{ ch: "", py: "" }, { ch: "", py: "" }, { ch: "吗", py: "ma" }, { ch: "咆", py: "páo" }, { ch: "", py: "" }, { ch: "", py: "" }], // 口
  [{ ch: "", py: "" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "抱", py: "bào" }, { ch: "扛", py: "káng" }, { ch: "拄", py: "zhǔ" }], // 扌
  [{ ch: "请", py: "qǐng" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "", py: "" }, { ch: "讧", py: "hòng" }, { ch: "", py: "" }], // 讠
];

// Names kept from the Korean file. CHO / JUNG / JONG feed the font loader: the parts and every character built from them.
export const CHO = RADICALS.map((x) => x.r);
export const JUNG = PHONETICS.map((x) => x.p);
export const JONG = BUILT.flat()
  .map((x) => x.ch)
  .filter(Boolean);

/** where the CJK Unified Ideographs block starts: '一' = U+4E00 (name kept from the Korean file) */
export const HANGUL_BASE = 19968;
/** the original block 一 U+4E00 … 龥 U+9FA5, sorted by radical and stroke count */
export const CJK_SORTED_END = 40869;
/** radical index, phonetic index → code point of the built character, or 0 when there is no common character */
export const compose = (radical: number, phonetic: number) => {
  const ch = BUILT[radical]?.[phonetic]?.ch;
  return ch ? ch.codePointAt(0)! : 0;
};
/** a character → [radical index, phonetic index, 0] when it is one of the built characters, otherwise null */
export const decompose = (code: number): [number, number, number] | null => {
  for (let r = 0; r < BUILT.length; r++) {
    const p = BUILT[r].findIndex((x) => x.ch && x.ch.codePointAt(0) === code);
    if (p >= 0) return [r, p, 0];
  }
  return null;
};
/** UTF-8 bytes of one character (what the computer actually stores) */
export const utf8 = (ch: string) => [...new TextEncoder().encode(ch)];

// s2: one table for every script (code points checked with a script)
export const WORLD: { ch: string; code: number; c: Highlighter }[] = [
  { ch: "A", code: 65, c: "sky" },
  { ch: "中", code: 20013, c: "mint" },
  { ch: "あ", code: 12354, c: "yellow" },
  { ch: "😀", code: 128512, c: "pink" },
];

// s6: neighbours by number — all five are radical 85 (水) + 3 strokes (Unihan kRSUnicode 85.3)
export const NEXT_TO_GA = [
  { ch: "汝", code: 27741 },
  { ch: "汞", code: 27742 },
  { ch: "江", code: 27743 },
  { ch: "池", code: 27744 },
  { ch: "污", code: 27745 },
];

// s4: the first characters of the CJK block, U+4E00 onwards
export const BLOCK_START = [..."一丁丂七丄丅丆万丈三上下丌不与丏丐丑丒专且丕世丗丘丙业丛东丝"];

// s7: same right part 工, far apart in the table
export const SAME_PART = [
  { ch: "扛", code: 25179 },
  { ch: "杠", code: 26464 },
  { ch: "江", code: 27743 },
  { ch: "红", code: 32418 },
  { ch: "虹", code: 34425 },
];

export const ch28: ChapterSpec = {
  id: 28,
  part: 3,
  title: "计算机里的文字",
  core: false,
  hook: "汉字有好几万个，计算机是怎么给它们一个个编号的？",
  steps: [
    { id: "s1", sec: 7.5, narration: "第 6 章说过，每个字都有编号，“中”是 20013 号。今天来看看这些编号是怎么排出来的。" },
    { id: "s2", sec: 9.5, narration: "Unicode 是给全世界文字编号的大表。“A”是 65，“中”是 20013，笑脸表情是 128512，一共超过 15 万个字符。" },
    { id: "s3", sec: 8, narration: "很多汉字是拼出来的。“江”就是左边的“氵”加上右边的“工”。“氵”是部首，表示和水有关；“工”提示读音。" },
    { id: "s4", sec: 9, narration: "汉字在 Unicode 里有一大片自己的区域，从“一”（19968）开始。加上后来补充的扩展区，一共超过 9 万个汉字。" },
    { id: "s5", sec: 8.5, narration: "编号不是乱排的：先按部首排，同一个部首再按笔画数排。部首用的是《康熙字典》的 214 个。" },
    { id: "s6", sec: 8.5, narration: "所以同部首的字住在隔壁。“江”是 27743，“池”是 27744，“污”是 27745，都是“氵”再加 3 画。" },
    { id: "s7", sec: 8.5, narration: "可是右边都是“工”的扛、杠、江、红、虹却离得很远。汉字没有公式，知道部件也算不出编号，只能查表。" },
    { id: "s8", sec: 9, narration: "一个存储格（字节）只能放 0～255，大编号要拆开写。“A”占 1 格，“中”占 3 格。这些字节就是词元的原料。" },
  ],
  playgroundTitle: "汉字拼装台",
  playgroundIntro: "左边选一个部首，右边选一个声旁，看看能不能拼出常用的汉字。拼出来的字会显示它的编号和存储用的字节。",
  summary: [
    "Unicode：给全世界每个字符编号的大表。“A”是 65，“中”是 20013。",
    "很多汉字由部首 + 声旁拼成。编号先按部首、再按笔画排，没有公式，要查表。",
    "存储时拆成 0～255 的数字（字节）。一个常用汉字 = 3 个字节。",
  ],
  unlocks: "Unicode",
  unlockLabel: "又得到了一件语言工具",
  quiz: [
    {
      q: "Unicode 里的汉字大致是按什么顺序排的？",
      choices: ["按拼音字母顺序", "先按部首，再按笔画数", "按使用频率从高到低"],
      answer: 1,
      explain: "基本区的汉字按《康熙字典》的 214 个部首排，同一部首再按笔画数排。",
      review: "s5",
    },
    {
      q: "“江”是 27743 号，那么 27744 号最可能是哪个字？",
      choices: ["红", "工", "池"],
      answer: 2,
      explain: "编号相邻的字往往部首相同、笔画数相同。27744 是“池”，也是“氵”加 3 画。",
      review: "s6",
    },
    {
      q: "存储“中”需要几个字节？",
      choices: ["3 个", "1 个", "20013 个"],
      answer: 0,
      explain: "一个字节只能放 0～255。“中”用 UTF-8 存成 228、184、173 这 3 个字节。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第 28 章 计算机里的文字",
    recap: "第 6 章：每个字都有编号",
    how: "这些编号是怎么定的？",
    unicode: "Unicode = 全世界文字编号表",
    many: "超过 15 万个字符",
    radical: "部首",
    radicalD: "和水有关",
    phon: "声旁",
    phonD: "提示读音",
    han: "江",
    eq: "氵 + 工 = 江",
    block: "Unicode 里的汉字区",
    from: "从“一”开始",
    sorted: "19968 ～ 40869：20,902 个按部首排好",
    total: "加上扩展区，超过 9 万个汉字",
    rule: "编号的排法",
    r1: "① 先按部首",
    r1n: "共 214 个",
    r2: "② 再按笔画数",
    rad1: "部首 1",
    rad85: "部首 85",
    rad214: "部首 214",
    jiang: "江 = 水部 + 3 画",
    plus1: "+1",
    water3: "氵 + 3 画",
    next: "同部首、同笔画，住在隔壁",
    same: "右边都是“工”",
    far: "却住得很远",
    noFormula: "没有公式，只能查表",
    byte: "字节 = 能放 0～255 的格子",
    one: "1 格",
    three: "3 格",
    split: "大编号拆开写（UTF-8）",
    material: "这些字节就是词元的原料（第 29 章）",
    chars: "A中あ😀氵工江一丁丂七丄丅丆万丈三上下丌不与丏丐丑丒专且丕世丗丘丙业丛东丝水龠龥汝汞池污扛杠红虹",
  },
};
