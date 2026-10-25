// ja overlay of src/data/ch52.ts: same made-up maps
import type { ChapterSpec, Highlighter } from "../../../data/types";

/**
 * illustrative (説明用の例): three made-up heads on 私は 今日 学校に 行く (with the causal mask, ch51).
 * Each map is in percent, row = the word looking, column = the word looked at; every row adds up to 100.
 */
export const HEADS52: { name: string; ask: string; target: number; c: Highlighter; map: number[][] }[] = [
  {
    name: "ヘッド1",
    ask: "だれ",
    target: 0,
    c: "pink",
    map: [
      [100, 0, 0, 0],
      [85, 15, 0, 0],
      [80, 8, 12, 0],
      [75, 5, 10, 10],
    ],
  },
  {
    name: "ヘッド2",
    ask: "いつ",
    target: 1,
    c: "violet",
    map: [
      [100, 0, 0, 0],
      [20, 80, 0, 0],
      [10, 75, 15, 0],
      [8, 70, 12, 10],
    ],
  },
  {
    name: "ヘッド3",
    ask: "どこ",
    target: 2,
    c: "orange",
    map: [
      [100, 0, 0, 0],
      [50, 50, 0, 0],
      [15, 10, 75, 0],
      [7, 5, 80, 8],
    ],
  },
];

export const ch52: ChapterSpec = {
  id: 52,
  part: 5,
  title: "たくさんの目で見る",
  core: false,
  hook: "「行く」は、だれが行くのかも、どこへ行くのかも知りたい。1回見つめるだけで足りるでしょうか？",
  steps: [
    { id: "s1", sec: 7, narration: "1つの文の中にも、関係はいろいろあります。だれがするのか、いつなのか、どこへ行くのか。" },
    { id: "s2", sec: 10, narration: "でも、アテンション1回では、割合を1通りにしか決められません。そこでQ、K、Vのセットをいくつも作ります。1セットをヘッド(head)といいます。" },
    { id: "s3", sec: 9, narration: "たとえばヘッド1は「だれが」を、ヘッド2は「いつ」を、ヘッド3は「どこへ」を探します。同じ「行く」なのに、見る場所がちがいます。" },
    { id: "s4", sec: 8, narration: "ヘッドどうしは待ち合わせず、同時に、別々に計算します。それぞれが「行く」の新しいベクトルを1つずつ出します。" },
    { id: "s5", sec: 9, narration: "結果を横につなげ、行列をもう1回かけて1つにまぜます。たくさんの目で見た情報が、1つのベクトルに集まります。" },
    { id: "s6", sec: 9, narration: "GPT-3は層ごとにヘッドが96個、ヘッド1つは128欄です。96 × 128 = 12,288、語のベクトルの大きさとぴったり合います。" },
    { id: "s7", sec: 9, narration: "どのヘッドが何を見るかは、人が決めるのではありません。学習しながら自然に分かれます。第53章で本物のヘッドをのぞきます。" },
  ],
  playgroundTitle: "ヘッド探偵",
  playgroundIntro: "アテンションの地図を見て、このヘッドが何を探しているか当ててみましょう。こいマスほど、たくさん見つめています。",
  summary: [
    "Q、K、Vの1セット ＝ ヘッド1つ。ヘッドごとに見る関係がちがう。",
    "ヘッドどうしは同時に計算し、結果をつなげて、行列でもう1回まぜる。",
    "GPT-3：層ごとにヘッド96個 × 128欄 ＝ 12,288。役割は学習で自然に分かれる。",
  ],
  unlocks: "マルチヘッドアテンション",
  unlockLabel: "アテンションの秘密をひとつ解きました",
  quiz: [
    {
      q: "ヘッドをいくつも使ういちばんの理由は？",
      choices: ["いろいろな関係を同時に見るため", "計算を減らすため", "語の数をふやすため"],
      answer: 0,
      explain: "ヘッド1つは割合を1通りにしか決められません。たくさんのヘッドが、それぞれちがう関係を見ます。",
      review: "s2",
    },
    {
      q: "GPT-3の1つの層には、ヘッドがいくつあるでしょう？",
      choices: ["12個", "96個", "128個"],
      answer: 1,
      explain: "96個です。ヘッド1つが128欄なので、96 × 128 = 12,288欄です。",
      review: "s6",
    },
    {
      q: "ヘッドごとに何を見るかは、どうやって決まるでしょう？",
      choices: ["人がルールで決める", "学習しながら自然に分かれる", "語の順番で決まる"],
      answer: 1,
      explain: "Q、K、Vを作る行列が学習で決まるので、役割も学習で分かれます(第46章)。",
      review: "s7",
    },
  ],
  labels: {
    tag: "第52章 たくさんの目で見る",
    // symbols drawn directly in the scene, listed so their font slices load
    glyphs: "·",
    many: "1つの文、いろいろな関係",
    wants: "「行く」は3つとも知りたい",
    who: "だれが？",
    when: "いつ？",
    where: "どこへ？",
    oneHead: "アテンション1回 ＝ 割合1行",
    oneWay: "1つの基準だけで",
    sets: "Q、K、Vのセットをいくつも",
    head: "ヘッド",
    headEn: "ヘッド (head)",
    differ: "同じ「行く」、ちがう目",
    parallel: "同時に、別々に",
    result: "結果",
    concat: "つなげる",
    mixM: "× 行列",
    final: "新「行く」",
    gather: "たくさんの目の情報が1つのベクトルに",
    gpt3: "GPT-3の1層",
    heads96: "ヘッド96個",
    dim128: "ヘッド1つ ＝ 128欄",
    product: "96 × 128 = 12,288",
    tokenVec: "= 語のベクトルの大きさ (第33章)",
    learned: "役割は学習で自然に",
    next: "次の章：第53章 本物のGPTの頭の中をのぞく",
    ex: "説明用の例",
    q: "Q",
    k: "K",
    v: "V",
    w0: "私は",
    w1: "今日",
    w2: "学校に",
    w3: "行く",
  },
};
