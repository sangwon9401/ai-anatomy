import type { ChapterSpec } from "../../../data/types";

// more classmates for the clustering beat: two taste groups
export const CLASS: { name: string; v: [number, number] }[] = [
  { name: "そうた", v: [8.5, 2] },
  { name: "りく", v: [9, 4] },
  { name: "あおい", v: [7.5, 1.5] },
  { name: "れん", v: [6.5, 2.5] },
  { name: "ひな", v: [3, 8] },
  { name: "みなと", v: [1.5, 7.5] },
  { name: "ゆうと", v: [2.5, 10] },
  { name: "めい", v: [3.5, 9] },
];

// an illustrative 2-D word map (real embeddings have thousands of dimensions)
export const WORDS: { w: string; v: [number, number] }[] = [
  { w: "りんご", v: [1.6, 8.2] },
  { w: "なし", v: [3.4, 8.8] },
  { w: "ぶどう", v: [2.2, 9.9] },
  { w: "犬", v: [8, 8.2] },
  { w: "ねこ", v: [8.9, 7] },
  { w: "うさぎ", v: [7.3, 6.2] },
  { w: "バス", v: [6.4, 2.4] },
  { w: "電車", v: [8.2, 1.4] },
  { w: "自転車", v: [5.6, 0.6] },
];

export const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const ch08: ChapterSpec = {
  id: 8,
  part: 1,
  title: "近ければ似ている",
  core: false,
  hook: "好みの似ている友だちを、数字で見つけられるでしょうか？",
  steps: [
    { id: "s1", sec: 7, narration: "前の章の矢印から、先の点だけを残してみましょう。点1つが友だち1人の好みです。" },
    { id: "s2", sec: 10, narration: "2つの点が近ければ、好みが似ているということ。距離は中学で習った三平方の定理（ピタゴラスの定理）ではかれます。" },
    { id: "s3", sec: 11, narration: "ゆいとさくらは横に1、縦に1のちがい。距離はルート2、約1.4です。ゆいとはるとは約8.5。さくらのほうがずっと近いですね。" },
    { id: "s4", sec: 8, narration: "友だちが増えると、点が集まってグループになります。辛い派と甘い派。近い点どうしが集まるのです。" },
    { id: "s5", sec: 8, narration: "AIもこのしくみで似たものを探します。曲のおすすめも、似た写真さがしも、結局は近い点さがしです。" },
    { id: "s6", sec: 10, narration: "単語も点として置けます。意味の似た単語どうしが近くに集まります。果物は果物、動物は動物と。第33章でくわしく見ます。" },
    { id: "s7", sec: 8, narration: "近ければ似ている。次の章では、距離の代わりに向きで似ているかをはかる、内積を学びます。" },
  ],
  playgroundTitle: "自分にいちばん似ている友だち",
  playgroundIntro: "平面を押して、自分の好みの点を置いてみましょう。友だちまでの距離をはかって、近い順に表示します。",
  summary: [
    "ベクトルの先の点どうしが近ければ、似ている。",
    "距離は三平方の定理：√(横のちがい² + 縦のちがい²)。",
    "似たものどうしは集まる。おすすめも単語の意味も「近い点さがし」。",
  ],
  unlocks: "距離",
  unlockLabel: "数学の道具をひとつ手に入れました",
  quiz: [
    {
      q: "(8, 3)と(7, 4)の間の距離は？",
      choices: ["√2、約1.4", "2", "15"],
      answer: 0,
      explain: "横のちがい1、縦のちがい1。√(1² + 1²) = √2です。",
      review: "s3",
    },
    {
      q: "2つの点が近いとは、どういうことでしょう？",
      choices: ["数字が大きい", "好み（性質）が似ている", "どちらも原点にある"],
      answer: 1,
      explain: "マスごとに意味があるので、数字が似ていれば性質も似ています。",
      review: "s2",
    },
    {
      q: "AIが似た曲をおすすめするときに使うしくみは？",
      choices: ["いちばん新しい曲を選ぶ", "いちばん近い点を探す", "曲名が似た曲を選ぶ"],
      answer: 1,
      explain: "曲をベクトルに変えて、自分が好きな曲に近い点を探します。",
      review: "s5",
    },
  ],
  labels: {
    tag: "第8章 近ければ似ている",
    spicy: "辛さ",
    sweet: "甘さ",
    minji: "ゆい",
    junho: "はると",
    seoyeon: "さくら",
    pyth: "距離 = √(横² + 縦²)",
    d1: "√(1² + 1²) = √2 ≈ 1.4",
    d2: "√(6² + 6²) ≈ 8.5",
    closer: "さくらがずっと近い",
    spicyTeam: "辛い派",
    sweetTeam: "甘い派",
    recommend: "おすすめ = 近い点さがし",
    song: "自分が好きな曲",
    suggest: "おすすめ！",
    fruit: "果物",
    animal: "動物",
    ride: "乗り物",
    wordMap: "単語の地図（説明用の例）",
    sum: "近ければ似ている",
    next: "次：向きではかる内積",
  },
};
