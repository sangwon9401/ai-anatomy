import type { ChapterSpec, Highlighter } from "../../../data/types";

// ja: the Korean chapter builds Hangul syllables from jamo with a formula. The Japanese chapter keeps the goal
// ("characters become numbers, and some are built from parts") with kana: Unicode keeps hiragana in 五十音 order,
// a dakuten is +1 (handakuten +2, a small kana −1) and katakana is hiragana + 96. Every number checked with a script.
// The export names stay the Korean file's (the Part 3 registration and the playground import them).

/** the hiragana block in Unicode order, U+3041 ぁ … U+3096 ゖ (86 characters) */
export const CHO = [..."ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ"];
/** the 46 base kana of the 五十音 table (the playground's first row of buttons) */
export const JUNG = [..."あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん"];
/** the marks: none, dakuten (+1), handakuten (+2), small (−1) */
export const JONG = ["", "゛", "゜", "小"];
export const MARK_DELTA = [0, 1, 2, -1];
/** katakana = hiragana + 96 */
export const KATA_SHIFT = 96;

export const HANGUL_BASE = 12354; // 'あ' = U+3042 (name kept from the Korean file)
const HIRA = new Set(CHO);
/** which marks a base kana can take (checked against Unicode with a script) */
export const marksOf = (base: number) => {
  const h = JUNG[base];
  const out = [0];
  const c = h.codePointAt(0)!;
  if ("かきくけこさしすせそたちつてとはひふへほ".includes(h)) out.push(1);
  if ("はひふへほ".includes(h)) out.push(2);
  if (HIRA.has(String.fromCodePoint(c - 1)) && "あいうえおつやゆよわ".includes(h)) out.push(3);
  return out;
};
/** base kana index, mark (0 none · 1 ゛ · 2 ゜ · 3 small), script (0 ひらがな · 1 カタカナ) → code point */
export const compose = (base: number, mark: number, script: number) => JUNG[base].codePointAt(0)! + MARK_DELTA[mark] + script * KATA_SHIFT;
export const decompose = (code: number): [number, number, number] | null => {
  const script = code >= 0x30a1 && code <= 0x30f6 ? 1 : 0;
  const h = code - script * KATA_SHIFT;
  for (let b = 0; b < JUNG.length; b++) {
    for (const m of marksOf(b)) if (JUNG[b].codePointAt(0)! + MARK_DELTA[m] === h) return [b, m, script];
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

// s7: neighbours of 'か' by number
export const NEXT_TO_GA = [
  { ch: "か", code: 12363 },
  { ch: "が", code: 12364 },
  { ch: "き", code: 12365 },
  { ch: "ぎ", code: 12366 },
  { ch: "く", code: 12367 },
];

export const ch28: ChapterSpec = {
  id: 28,
  part: 3,
  title: "コンピューターの中の文字",
  core: false,
  hook: "ひらがな、カタカナ、漢字。コンピューターは何万もの字の番号を、ひとつずつ覚えているのでしょうか？",
  steps: [
    { id: "s1", sec: 7.5, narration: "第6章で、文字には番号があると話しました。「あ」は12354番。今日は、この番号がどう決まるのかを見ます。" },
    { id: "s2", sec: 9.5, narration: "ユニコードは、世界の文字に番号をつけた表です。「A」は65、「中」は20013、笑顔の絵文字は128512。15万字以上あります。" },
    { id: "s3", sec: 8, narration: "日本語は、ひらがな・カタカナ・漢字の3種類の文字を使います。ユニコードでは、種類ごとに番号の区画が分かれています。" },
    { id: "s4", sec: 9, narration: "ひらがなの区画をのぞくと、五十音の順に並んでいます。小さい「ぁ」や、濁点のついた「が」も、すぐとなりにいます。" },
    { id: "s5", sec: 8.5, narration: "パーツを組み合わせた字もあります。「が」は「か」に濁点をつけた字。ユニコードには、濁点だけの番号もあります。" },
    { id: "s6", sec: 9, narration: "だから番号は計算で決まります。濁点をつけると+1、カタカナにすると+96。「か」12363に足すと12460、本物の「ガ」です。" },
    { id: "s7", sec: 8.5, narration: "番号が1増えると、濁点がついたりとれたりします。か、が、き、ぎ、く。96増えるとカタカナ、2増えると丸がつきます。" },
    { id: "s8", sec: 9, narration: "保存の箱1つ(バイト)には0〜255しか入らないので、大きな番号は分けて書きます。「A」は1つ、「あ」は3つ。これがトークンの材料です。" },
  ],
  playgroundTitle: "かな組み立て機",
  playgroundIntro: "もとの字、点、文字の種類をえらんで、かなを組み立ててみましょう。番号が計算どおりに決まるのが見えます。",
  summary: [
    "ユニコード：世界の文字に番号をつけた表。「A」は65、「あ」は12354。",
    "かなは五十音順に並ぶ。濁点をつけると+1、カタカナにすると+96。",
    "保存するときは0〜255の数(バイト)に分けて書く。かなも漢字も1文字＝3バイト。",
  ],
  unlocks: "ユニコード",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "カタカナの「カ」の番号は、ひらがなの「か」(12363)からいくつ離れているでしょう？",
      choices: ["+1", "+96", "+588"],
      answer: 1,
      explain: "ひらがなとカタカナは同じ順番で並んでいて、カタカナは96後ろにあります。12363 + 96 = 12459が「カ」です。",
      review: "s6",
    },
    {
      q: "「か」(12363)のすぐ次の番号、12364はどの字でしょう？",
      choices: ["き", "カ", "が"],
      answer: 2,
      explain: "濁点のついた字は、もとの字のすぐ次にいます。だから+1で「が」です。",
      review: "s7",
    },
    {
      q: "「あ」を保存するには、バイトがいくつ必要でしょう？",
      choices: ["3つ", "1つ", "12354個"],
      answer: 0,
      explain: "バイト1つには0〜255しか入りません。かなや漢字は1文字を227, 129, 130のように3バイトに分けて書きます。",
      review: "s8",
    },
  ],
  labels: {
    tag: "第28章 コンピューターの中の文字",
    recap: "第6章：文字には番号がある",
    how: "この番号はどう決まる？",
    unicode: "ユニコード＝世界の文字の番号表",
    many: "15万字以上あります",
    hira: "ひらがな",
    kata: "カタカナ",
    kanji: "漢字",
    blocks: "種類ごとに番号の区画がある",
    hiraRange: "12353〜12438",
    kataRange: "12449〜12538",
    kanjiRange: "19968〜40959",
    kanjiMany: "漢字の区画だけで2万字以上",
    hiraTable: "ひらがなの区画 (86字)",
    order: "番号の順＝ほぼ五十音の順",
    smallNote: "小さい字",
    dakuNote: "濁点の字",
    parts: "パーツを組み合わせた字",
    base: "もとの字",
    dakuten: "濁点",
    ka: "か",
    mark: "゛",
    ga: "が",
    eq: "か ＋ ゛ ＝ が",
    markCode: "濁点だけの番号もある (12441)",
    num: "番号",
    formula: "計算で決まります",
    slotBase: "もとの字",
    slotDaku: "濁点",
    slotKata: "カタカナ",
    calc1: "12363 + 1 + 96 = 12460",
    real: "本物の「ガ」＝12460",
    gaKata: "ガ",
    plus1: "+1 → 濁点がつく・とれる",
    toKata: "カタカナになる",
    maru: "丸(゜)がつく",
    kaKata: "カ",
    ha: "は",
    pa: "ぱ",
    byte: "バイト＝0〜255が入る箱",
    one: "1つ",
    three: "3つ",
    split: "大きな番号は分けて書きます (UTF-8)",
    material: "このバイトがトークンの材料 (第29章)",
    a: "あ",
    chars: "A中あア😀かがきぎくカガぱ字゛゜",
  },
};
