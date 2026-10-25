// ja overlay of src/data/ch30.ts
import type { ChapterSpec, Highlighter } from "../../../data/types";

/** A toy corpus: each word with how many times it appeared. Pieces start as single syllables. */
export type Corpus = { w: string; n: number }[];
export type Pair = { a: string; b: string; n: number };

// ja: the same toy diary in Japanese, every word four characters like the Korean one, so the counts match.
// merges checked with a script: した 9 → 勉強 7 → 運動 6 → する 5, pieces 56 → 47 → 40 → 34 → 29
export const DIARY: Corpus = [
  { w: "勉強した", n: 4 },
  { w: "運動した", n: 4 },
  { w: "勉強する", n: 3 },
  { w: "運動する", n: 2 },
  { w: "掃除した", n: 1 },
];
export const SCHOOL: Corpus = [
  { w: "学校に", n: 5 },
  { w: "学校が", n: 3 },
  { w: "学年に", n: 3 },
  { w: "学生が", n: 2 },
  { w: "友だちが", n: 4 },
  { w: "友だちと", n: 3 },
  { w: "給食が", n: 2 },
  { w: "給食は", n: 1 },
  { w: "おいしい", n: 3 },
  { w: "たのしい", n: 2 },
];

export const split0 = (w: string) => [...w];

/** Count neighbouring pairs, most frequent first (ties keep first-seen order). */
export function countPairs(pieces: string[][], corpus: Corpus): Pair[] {
  const m = new Map<string, Pair>();
  pieces.forEach((ps, i) => {
    for (let k = 0; k + 1 < ps.length; k++) {
      const key = `${ps[k]}\u0000${ps[k + 1]}`;
      const p = m.get(key) ?? { a: ps[k], b: ps[k + 1], n: 0 };
      p.n += corpus[i].n;
      m.set(key, p);
    }
  });
  return [...m.values()].sort((x, y) => y.n - x.n);
}

export function applyMerge(ps: string[], a: string, b: string) {
  const out: string[] = [];
  for (let k = 0; k < ps.length; k++) {
    if (k + 1 < ps.length && ps[k] === a && ps[k + 1] === b) {
      out.push(a + b);
      k++;
    } else out.push(ps[k]);
  }
  return out;
}

export const totalPieces = (pieces: string[][], corpus: Corpus) => pieces.reduce((s, ps, i) => s + ps.length * corpus[i].n, 0);

/** Run BPE for `steps` merges; returns the pieces after each stage (stage 0 = single syllables). */
export function runBpe(corpus: Corpus, steps: number) {
  const stages = [corpus.map((c) => split0(c.w))];
  const merges: Pair[] = [];
  for (let s = 0; s < steps; s++) {
    const cur = stages[stages.length - 1];
    const top = countPairs(cur, corpus)[0];
    if (!top) break;
    merges.push(top);
    stages.push(cur.map((ps) => applyMerge(ps, top.a, top.b)));
  }
  return { stages, merges };
}

/** Cut new text with learned merges, applied in the order they were learned. */
export function encode(text: string, merges: { a: string; b: string }[]) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => merges.reduce((ps, m) => applyMerge(ps, m.a, m.b), split0(w)));
}

export const SCENE_BPE = runBpe(DIARY, 4);
export const MERGE_COLORS: Highlighter[] = ["yellow", "sky", "mint", "pink"];
export const NEW_WORDS = ["宿題した", "掃除する"];

export const ch30: ChapterSpec = {
  id: 30,
  part: 3,
  title: "よく続くかけらをくっつける",
  core: false,
  hook: "トークンの一覧は20万個。だれかがひとつずつ決めたのでしょうか？",
  steps: [
    { id: "s1", sec: 8.5, narration: "トークンの一覧は、人が決めたものではありません。文章をたくさん集めて、よく続けて出てくるかけら同士をくっつけて作ります。これがBPEです。" },
    { id: "s2", sec: 7.5, narration: "日記から集めた5つの単語でやってみましょう。最初は1文字ずつがかけら。出てきた回数まで数えると、かけらは56個です。" },
    { id: "s3", sec: 7.5, narration: "次に、となり合う2つのかけらのペアを数えます。「し」と「た」のペアが9回で、いちばん多いですね。" },
    { id: "s4", sec: 7, narration: "いちばん多いペアを1つのかけらにくっつけて、一覧にのせます。「した」が新しいトークンに。かけらは47個に減りました。" },
    { id: "s5", sec: 8, narration: "また数えて、またくっつけます。勉強、運動、する。4回くっつけたら、かけらは56個から29個に減りました。" },
    { id: "s6", sec: 8, narration: "文法を教えたことはないのに、「勉強」と「した」が別々のかけらになりました。よく出るかたまりを数えただけです。" },
    { id: "s7", sec: 7.5, narration: "だから、はじめて見る「宿題した」も、知っているかけらで切れます。宿、題、した。「掃除する」は掃、除、する。" },
    { id: "s8", sec: 8, narration: "GPT-4oのトークナイザーも、こうしてくっつけて約20万個のかけらを作りました。だから「学校に」を「学校」と「に」に切ります。" },
  ],
  playgroundTitle: "くっつけ工場",
  playgroundIntro: "いちばん多く出てきたペアを見つけて押してみましょう。ペアが1つにくっついて新しいトークンになります。作り終えたら、下の欄に単語を書いて切ってみましょう。",
  summary: [
    "BPE：文章の集まりの中で、いちばんよく続けて出てくるペアを1つにくっつける。",
    "数えてくっつけるのを、一覧がほしい大きさになるまでくり返す。",
    "よく出るかたまりがかけらになり、はじめて見ることばも知っているかけらで切れる。",
  ],
  unlocks: "BPE",
  unlockLabel: "ことばの道具をひとつ手に入れました",
  quiz: [
    {
      q: "BPEは毎回、どのペアをくっつけるでしょう？",
      choices: ["意味がいちばん大事なペア", "文章の集まりでいちばんよく続けて出てきたペア", "五十音順で最初のペア"],
      answer: 1,
      explain: "意味は知りません。ただ数えて、いちばん多いペアをくっつけます。",
      review: "s3",
    },
    {
      q: "くっつけるのをくり返すと、文章の集まり全体のかけらの数は？",
      choices: ["増える", "変わらない", "減る"],
      answer: 2,
      explain: "2つのかけらが1つになるので減ります。例では56個 → 29個。",
      review: "s5",
    },
    {
      q: "「した」を覚えたトークナイザーが、はじめて見る「宿題した」に出会うと？",
      choices: ["宿 + 題 + した に切る", "読めずに止まる", "1かけらのままにする"],
      answer: 0,
      explain: "知っているかけら「した」はまとめ、残りは1文字ずつのかけらにします。読めないことばはありません。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第30章 よく続くかけらをくっつける",
    title: "BPE：よく続くペアをくっつける",
    sub: "Byte Pair Encoding",
    often: "よく続けて出てくると → 1かけらに",
    corpus: "日記から集めた単語 (説明用の例)",
    pieces: "かけらの数",
    pairs: "ペアを数える",
    vocab: "新しいトークンの一覧",
    times: "回",
    most: "最多！",
    merge: "くっつける",
    noGrammar: "文法なしで",
    noGrammar2: "勉強＋した！",
    justCount: "ただ数えただけ",
    newWord: "新しいことば",
    known: "知っているかけらで",
    knownList: "知っているかけら：",
    real: "本物のGPT-4oのトークナイザー",
    realSrc: "o200k_baseで切った結果",
    size: "こうしてくっつけて約20万かけら",
    bytes: "* 本物は文字より小さいバイトから始めます (第28章)",
    x: "×",
    arrow: "→",
    pairA: "し",
    pairB: "た",
    pairAB: "した",
  },
};
