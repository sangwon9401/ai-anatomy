import { ch01, EXAMPLES, GAME_ROUNDS, ROUND1, ROUND2 } from "../data/ch01";
import { ANSWER, BRANCH, MISTAKE, QUESTION, STORY, ch02 } from "../data/ch02";
import { ERAS, ORDER_ITEMS, ch03 } from "../data/ch03";
import { FRESH, KNOWN, RULE_WORDS, ch04 } from "../data/ch04";
import { PIPELINE, TRAINING, ch05 } from "../data/ch05";
import { CODES, NEIGHBORS, ch06 } from "../data/ch06";
import { FLAVORS4, FRIENDS, ch07 } from "../data/ch07";
import { CLASS, WORDS, ch08 } from "../data/ch08";
import { ch09 } from "../data/ch09";
import { GRADES, SENTENCE_ROWS, ch10 } from "../data/ch10";
import { PRESETS, ch11 } from "../data/ch11";
import { TARGETS, ch12 } from "../data/ch12";
import { DISTS, DRAWS, ch13 } from "../data/ch13";
import { ch14, SCORES } from "../data/ch14";
import { DATASETS, TOOLS, ch15 } from "../data/ch15";
import { BANK, MEANING_NAMES, ch45 } from "../data/ch45";
import { Ch01Scene } from "./Ch01Scene";
import { Ch02Scene } from "./Ch02Scene";
import { Ch03Scene } from "./Ch03Scene";
import { Ch04Scene } from "./Ch04Scene";
import { Ch05Scene } from "./Ch05Scene";
import { Ch06Scene } from "./Ch06Scene";
import { Ch07Scene } from "./Ch07Scene";
import { Ch08Scene } from "./Ch08Scene";
import { Ch09Scene } from "./Ch09Scene";
import { Ch10Scene } from "./Ch10Scene";
import { Ch11Scene } from "./Ch11Scene";
import { Ch12Scene } from "./Ch12Scene";
import { Ch13Scene } from "./Ch13Scene";
import { Ch14Scene } from "./Ch14Scene";
import { Ch15Scene } from "./Ch15Scene";
import { Ch45Scene } from "./Ch45Scene";
import { compId, type BuiltChapter } from "./built";
import { PART2 } from "./parts/part2";
import { PART3 } from "./parts/part3";
import { PART4 } from "./parts/part4";
import { PART5 } from "./parts/part5";
import { PART6 } from "./parts/part6";
import { PART7 } from "./parts/part7";
import { PART8 } from "./parts/part8";
import { PART9 } from "./parts/part9";
import { PART10 } from "./parts/part10";
import { PART11 } from "./parts/part11";

export { compId, type BuiltChapter };

const FIRST: BuiltChapter[] = [
  { spec: ch01, Scene: Ch01Scene, corpus: [ROUND1, ROUND2, EXAMPLES, GAME_ROUNDS] },
  { spec: ch02, Scene: Ch02Scene, corpus: [QUESTION, ANSWER, MISTAKE, BRANCH, STORY] },
  { spec: ch03, Scene: Ch03Scene, corpus: [ERAS, ORDER_ITEMS] },
  { spec: ch04, Scene: Ch04Scene, corpus: [KNOWN, FRESH, RULE_WORDS] },
  { spec: ch05, Scene: Ch05Scene, corpus: [PIPELINE, TRAINING] },
  { spec: ch06, Scene: Ch06Scene, corpus: [CODES, NEIGHBORS] },
  { spec: ch07, Scene: Ch07Scene, corpus: [FRIENDS, FLAVORS4] },
  { spec: ch08, Scene: Ch08Scene, corpus: [CLASS, WORDS] },
  { spec: ch09, Scene: Ch09Scene, corpus: [] },
  { spec: ch10, Scene: Ch10Scene, corpus: [GRADES, SENTENCE_ROWS] },
  { spec: ch11, Scene: Ch11Scene, corpus: [PRESETS] },
  { spec: ch12, Scene: Ch12Scene, corpus: [TARGETS] },
  { spec: ch13, Scene: Ch13Scene, corpus: [DISTS, DRAWS] },
  { spec: ch14, Scene: Ch14Scene, corpus: [SCORES] },
  { spec: ch15, Scene: Ch15Scene, corpus: [DATASETS, TOOLS] },
  { spec: ch45, Scene: Ch45Scene, corpus: [BANK, MEANING_NAMES] },
];

// sorted by chapter: "next chapter" links follow this list
export const BUILT: BuiltChapter[] = [
  ...FIRST,
  ...PART2,
  ...PART3,
  ...PART4,
  ...PART5,
  ...PART6,
  ...PART7,
  ...PART8,
  ...PART9,
  ...PART10,
  ...PART11,
].sort((a, b) => a.spec.id - b.spec.id);

export const builtById = (id: number) => BUILT.find((c) => c.spec.id === id);
