import { PIPELINE } from "../../data/ch05";
import { COMPARE, NEXT, PROJECT, STYLES, ch92 } from "../../data/ch92";
import { AFTER30, DEMO_LINES, IDS, MERGED30, PAIRS, TRADE, VOCAB_HEAD, ch93 } from "../../data/ch93";
import { COPIED, DIARY, FRESH, LOOP, WINDOW_IN, WINDOW_OUT, ch94 } from "../../data/ch94";
import { HIGH_LINES, LOW_LINE, NEXT_AT, PROMPT, SOURCES, STITCH, WRONG, ch95 } from "../../data/ch95";
import { INPUT, NEXT96, VECS, ch96 } from "../../data/ch96";
import type { BuiltChapter } from "../built";
import { Ch92Scene } from "../Ch92Scene";
import { Ch93Scene } from "../Ch93Scene";
import { Ch94Scene } from "../Ch94Scene";
import { Ch95Scene } from "../Ch95Scene";
import { Ch96Scene } from "../Ch96Scene";

// Part 11 chapters in chapter order. Owned by the Part 11 build; see CHAPTER_GUIDE.md.
export const PART11: BuiltChapter[] = [
  { spec: ch92, Scene: Ch92Scene, corpus: [COMPARE, PROJECT, STYLES, NEXT, PIPELINE] },
  { spec: ch93, Scene: Ch93Scene, corpus: [IDS, VOCAB_HEAD, PAIRS, DEMO_LINES, MERGED30, AFTER30, TRADE] },
  { spec: ch94, Scene: Ch94Scene, corpus: [WINDOW_IN, WINDOW_OUT, DIARY, COPIED, FRESH, LOOP] },
  { spec: ch95, Scene: Ch95Scene, corpus: [PROMPT, LOW_LINE, NEXT_AT, SOURCES, STITCH, HIGH_LINES, WRONG] },
  { spec: ch96, Scene: Ch96Scene, corpus: [INPUT, NEXT96, VECS, PIPELINE] },
];
