import { PAIRS, TOKENIZERS } from "../../../data/part3-tokens";
import type { ChapterSpec } from "../../../data/types";

// ja: Japanese vs English. All counts come from tiktoken (see the ja part3-tokens.ts); checked with a script.
export const MAIN = PAIRS[0]; // 私は今日学校に行く。 / I am going to school today.  → 17·11·7 vs 7·7·7
export const LONG = PAIRS[PAIRS.length - 1]; // a 3-sentence paragraph → 72·49·36 vs 29·28·27
// '学校' in GPT-3's tokenizer: bytes [229 173] [166] [230 160] [161] (each kanji = 2 byte pieces)
export const SCHOOL_BYTES = ["229 173", "166", "230 160", "161"];
// a few real single tokens of GPT-3's vocabulary (r50k_base)
export const EN_SAMPLES = [" the", " school", "ing", " today", " going", "tion", " and", " you", " computer", " cat"];
// vocabulary entries that hold at least one whole kana or kanji (counted over every token id; ー counts, ・ does not)
export const HANGUL_TOKENS = [168, 997, 8248];
export { TOKENIZERS };

export const ch31: ChapterSpec = {
  id: 31,
  part: 3,
  title: "日本語はトークンが多い？",
  core: false,
  hook: "同じことを言っても、日本語だとAIの料金が高くなるって本当でしょうか？",
  steps: [
    { id: "s1", sec: 7.5, narration: "同じ意味の文を日本語と英語で書いて、トークンの数を数えてみましょう。トークンの数は、AIが読み書きする量です。" },
    { id: "s2", sec: 7.5, narration: "GPT-3のトークナイザーで切ると、英語は7かけらなのに、日本語は17かけら。同じ意味なのに2倍以上です。" },
    { id: "s3", sec: 8, narration: "点線のかけらが多いですね。かなも漢字も1文字3バイト(第28章)。このトークナイザーは、漢字をバイトのかけらに切りました。" },
    { id: "s4", sec: 8, narration: "GPT-3のトークナイザーはほぼ英語の文章で作られたので、約5万個のかけらのうち、日本語の文字が入ったかけらは168個だけです。" },
    { id: "s5", sec: 8, narration: "トークンが多いと損をします。料金はトークンの数で決まり、一度に読める量もトークンの数で決まり、答えも遅くなります。" },
    { id: "s6", sec: 8.5, narration: "新しいトークナイザーは、日本語のかけらをたくさん覚えました。同じ文がGPT-4では11かけら、GPT-4oでは7かけら。英語と同じです。" },
    { id: "s7", sec: 8, narration: "長い文章で測ると、GPT-4oでも日本語は約1.3倍。GPT-3のときの約2.5倍に比べると、ずいぶん減りました。" },
    { id: "s8", sec: 8, narration: "日本語はトークンが多い？ 昔はずっと多く、今は少し多い。トークナイザーがどんな文章で学んだかで決まります。" },
  ],
  playgroundTitle: "トークン数対決",
  playgroundIntro: "同じ意味の日本語と英語の文をえらんでみましょう。まずどちらのトークンが多いか予想してから、3つのトークナイザーの結果をくらべます。",
  summary: [
    "同じ意味でも、言語によってトークンの数がちがう。料金・読める量・速さはトークンの数で決まる。",
    "GPT-3のトークナイザーは英語の文章で作られ、漢字をバイト単位で細かく切っていた。",
    "日本語のかけらをたくさん覚えたGPT-4oでは、差がぐっと縮んだ(長い文章で約2.5倍 → 約1.3倍)。",
  ],
  unlocks: "トークン効率",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "GPT-3のトークナイザーで、日本語の文のトークンが特に多かった理由は？",
      choices: ["日本語の文がもともと長いから", "日本語のかけらをほとんど覚えておらず、漢字をバイトごとに切ったから", "日本語は単語の間にスペースを入れないから"],
      answer: 1,
      explain: "英語の文章で作ったトークナイザーなので、日本語のかけらは168個だけ。漢字1文字が2〜3かけらになりました。",
      review: "s4",
    },
    {
      q: "トークンが多いと起きることではないものは？",
      choices: ["料金が高くなる", "一度に読める文章が減る", "答えがより正確になる"],
      answer: 2,
      explain: "トークンが多くても、かしこくはなりません。料金、読める量、速さで損をするだけです。",
      review: "s5",
    },
    {
      q: "GPT-4oで同じ意味の長い文章を測ると、日本語のトークンは英語の約何倍だったでしょう？",
      choices: ["約1.3倍", "約2.5倍", "約10倍"],
      answer: 0,
      explain: "日本語36かけら、英語27かけら。GPT-3のときは72対29で、約2.5倍でした。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第31章 日本語はトークンが多い？",
    ko: "日本語",
    en: "英語",
    amount: "トークンの数＝AIが読み書きする量",
    gpt3src: "GPT-3のトークナイザー (r50k_base)",
    times4: "約2.4倍！",
    dashed: "点線＝1文字のバイトの一部",
    school: "「学校」→",
    hak: "学",
    gyo: "校",
    bytesNote: "漢字1文字がバイトのかけら2つに",
    vocab3: "GPT-3の語彙 50,257個",
    hangul0: "日本語のかけら：",
    zero: "168個",
    mostlyEn: "ほぼ英語の文章で作った一覧",
    cost: "トークンが多いと",
    c1: "料金",
    c1d: "トークンの数だけ払う",
    c2: "読める量",
    c2d: "GPT-3は2,048トークンまで",
    c3: "速さ",
    c3d: "1かけらずつ書く (第2章)",
    model3: "GPT-3",
    model4: "GPT-4",
    model4o: "GPT-4o",
    hangulN: "日本語のかけら",
    same: "同じに！",
    long: "長い文章 (3文) で測ると",
    r1: "約2.5倍",
    r2: "約1.8倍",
    r3: "約1.3倍",
    q: "日本語はトークンが多い？",
    a1: "昔 (GPT-3)：ずっと多かった",
    a2: "今 (GPT-4o)：少し多い",
    dep: "どんな文章で学んだかで決まる",
    pieces: "かけら",
    src: "tiktokenで数えた本物のトークン数",
  },
};
