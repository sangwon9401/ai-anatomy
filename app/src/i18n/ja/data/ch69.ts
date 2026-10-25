import type { ChapterSpec, Highlighter } from "../../../data/types";

/** Canonical parameter counts (CHAPTER_GUIDE "Canonical facts"); floors = parameters / 1億. */
export const MODELS: { key: string; name: string; year: number; params: number; paramsText: string; c: Highlighter }[] = [
  { key: "gpt1", name: "GPT-1", year: 2018, params: 1.17e8, paramsText: "1.17億個", c: "mint" },
  { key: "gpt2", name: "GPT-2", year: 2019, params: 1.5e9, paramsText: "15億個", c: "sky" },
  { key: "gpt3", name: "GPT-3", year: 2020, params: 1.75e11, paramsText: "1,750億個", c: "yellow" },
];
export const FLOOR = 1e8; // 1億 parameters = one floor
export const floors = (params: number) => params / FLOOR;

/** ja: あべのハルカス (Osaka), 60 floors above ground (real building, used only as a yardstick).
 *  1,750 ÷ 60 ≈ 29 of them (the Korean original uses Lotte World Tower, 123 floors, ≈ 14). */
export const TOWER = { key: "tower", name: "あべのハルカス", floors: 60 };

export const ratio = (a: number, b: number) => a / b;
/** "約13倍" style: whole numbers, thousands separated. */
export const timesText = (r: number) => `約${Math.round(r).toLocaleString("ja-JP")}倍`;

export const GUESSES = [175, 1750, 17500];

export const ch69: ChapterSpec = {
  id: 69,
  part: 7,
  title: "GPT-1 → 2 → 3",
  core: false,
  hook: "GPT-1からGPT-3まで、2年でどれだけ大きくなったのでしょう？",
  steps: [
    { id: "s1", sec: 11, narration: "GPTは一度に生まれたのではありません。2018年にGPT-1、2019年にGPT-2、2020年にGPT-3と、毎年大きくなりました。" },
    { id: "s2", sec: 10, narration: "パラメータ（第12章のつまみ）1億個を、建物の1階分としましょう。GPT-1は1.17億個、たった1階建ての家です。" },
    { id: "s3", sec: 7, narration: "GPT-2は15億個。15階建てのマンションになりました。1年で約13倍です。" },
    { id: "s4", sec: 9, narration: "GPT-3は1,750億個です。何階建てでしょう？ 画面に入りきりません。うしろに下がってみましょう。" },
    { id: "s5", sec: 11, narration: "なんと1,750階！ GPT-2の約117倍、GPT-1の約1,500倍です。GPT-1は点ほどにも見えません。" },
    { id: "s6", sec: 8, narration: "60階建てのあべのハルカスを約29個積み上げて、やっと届く高さです。とてつもないですね。" },
    { id: "s7", sec: 11, narration: "体を大きくしたGPT-3は、例をいくつか見るだけで新しい問題を解きました（第71章）。なぜ大きいほど賢いのか、次の章で見ます。" },
  ],
  playgroundTitle: "建物の高さくらべ",
  playgroundIntro: "1億個 = 1階です。まずGPT-3が何階建てか当ててみましょう。それから建物をオン・オフして大きさを比べます。",
  summary: [
    "GPT-1（2018）1.17億 → GPT-2（2019）15億 → GPT-3（2020）1,750億個。",
    "1億個 = 1階なら、1階建ての家 → 15階建てのマンション → 1,750階の塔。",
    "2年で約1,500倍。大きくすると新しい能力が現れた（第71章）。",
  ],
  unlocks: "GPTモデルの大きさ",
  unlockLabel: "学習の道具をもうひとつ手に入れました",
  quiz: [
    {
      q: "GPT-1、GPT-2、GPT-3が出た年は？",
      choices: ["2016、2017、2018", "2018、2019、2020", "2020、2021、2022"],
      answer: 1,
      explain: "GPT-1は2018年、GPT-2は2019年、GPT-3は2020年に出ました。",
      review: "s1",
    },
    {
      q: "1億個 = 1階なら、GPT-3（1,750億個）は何階建て？",
      choices: ["175階", "17階", "1,750階"],
      answer: 2,
      explain: "1,750億 ÷ 1億 = 1,750階です。",
      review: "s5",
    },
    {
      q: "GPT-3のパラメータは、GPT-2の約何倍？",
      choices: ["約117倍", "約2倍", "約10倍"],
      answer: 0,
      explain: "1,750億 ÷ 15億 ≈ 117倍です。1年でこれだけ大きくなりました。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第69章 GPT-1 → 2 → 3",
    grow: "毎年、体が大きくなった",
    floorRule: "パラメータ1億個 = 1階",
    f1: "≈ 1階",
    f2: "= 15階",
    f3: "= 1,750階",
    tiny: "たった1階！",
    x13: "約13倍",
    howTall: "何階？",
    offScreen: "画面の外まで…",
    back: "うしろに下がる",
    x117: "GPT-2の約117倍",
    x1500: "GPT-1の約1,500倍",
    dot: "GPT-1はここ（点より小さい）",
    tower: "あべのハルカス 60階",
    x14: "× 約29",
    huge: "とてつもない！",
    fewShot: "例を見るだけで新しい問題を解いた（71章）",
    why: "なぜ大きいほど賢い？",
    next: "第70章：スケーリング則",
  },
};
