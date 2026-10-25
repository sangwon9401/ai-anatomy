import { GREEDY_LOOP, SPINS, WHEEL, ch80 } from "../../data/ch80";
import { RUNS, ch81 } from "../../data/ch81";
import { DIST82, PIPE, PRESETS82, ch82 } from "../../data/ch82";
import { CHAT, GUESS, KV_TOKENS, TURNS, ch83 } from "../../data/ch83";
import { ANSWER84, HELPS, QUESTION84, RISKY, TREE as TREE84, ch84 } from "../../data/ch84";
import { CASES, COMPARES, INGREDIENTS, S1_BARS, TOOLS9, ch85 } from "../../data/ch85";
import { TOY } from "../../data/part9-toy";
import type { BuiltChapter } from "../built";
import { Ch80Scene } from "../Ch80Scene";
import { Ch81Scene } from "../Ch81Scene";
import { Ch82Scene } from "../Ch82Scene";
import { Ch83Scene } from "../Ch83Scene";
import { Ch84Scene } from "../Ch84Scene";
import { Ch85Scene } from "../Ch85Scene";

// Part 9 chapters in chapter order. Owned by the Part 9 build; see CHAPTER_GUIDE.md.
export const PART9: BuiltChapter[] = [
  { spec: ch80, Scene: Ch80Scene, corpus: [WHEEL, GREEDY_LOOP, SPINS, TOY] },
  { spec: ch81, Scene: Ch81Scene, corpus: [RUNS] },
  { spec: ch82, Scene: Ch82Scene, corpus: [DIST82, PRESETS82, PIPE] },
  { spec: ch83, Scene: Ch83Scene, corpus: [CHAT, GUESS, KV_TOKENS, TURNS] },
  { spec: ch84, Scene: Ch84Scene, corpus: [QUESTION84, ANSWER84, TREE84, RISKY, HELPS] },
  { spec: ch85, Scene: Ch85Scene, corpus: [COMPARES, INGREDIENTS, S1_BARS, TOOLS9, CASES] },
];
