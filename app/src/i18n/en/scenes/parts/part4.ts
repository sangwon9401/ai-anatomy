// en: overlay of src/scenes/parts/part4.ts: only the extra font corpus for ch40 (the note's handwritten words) changes.
import { CHAIN, NOVEL, PIZZA, ch37 } from "../../../../data/ch37";
import { CORPUS, END, START, ch38 } from "../../../../data/ch38";
import { LENGTHS, RELAY, RELAY_B, SLOTS, VERBS, ch40 } from "../../../../data/ch40";
import { GPU_WORDS, LONG, ch41 } from "../../../../data/ch41";
import { CORRECT, EN, FULL, KO, PHRASES, ch42 } from "../../../../data/ch42";
import { MAIN, RECAP, ch43 } from "../../../../data/ch43";
import { CONTEXT, DOG, KNOWN, NEXT, OUTPUTS, WINDOW_SENT, ch39 } from "../../../../data/ch39";
import { Ch37Scene } from "../../../../scenes/Ch37Scene";
import { Ch38Scene } from "../../../../scenes/Ch38Scene";
import { Ch39Scene } from "../../../../scenes/Ch39Scene";
import { Ch40Scene } from "../../../../scenes/Ch40Scene";
import { Ch41Scene } from "../../../../scenes/Ch41Scene";
import { Ch42Scene } from "../../../../scenes/Ch42Scene";
import { Ch43Scene } from "../../../../scenes/Ch43Scene";
import type { BuiltChapter } from "../../../../scenes/built";

// Part 4 chapters in chapter order. Owned by the Part 4 build; see CHAPTER_GUIDE.md.
export const PART4: BuiltChapter[] = [
  { spec: ch37, Scene: Ch37Scene, corpus: [CHAIN, PIZZA, NOVEL] },
  { spec: ch38, Scene: Ch38Scene, corpus: [CORPUS, START, END] },
  { spec: ch39, Scene: Ch39Scene, corpus: [KNOWN, DOG, NEXT, CONTEXT, OUTPUTS, WINDOW_SENT] },
  { spec: ch40, Scene: Ch40Scene, corpus: [LENGTHS, RELAY, RELAY_B, SLOTS, VERBS, ["past", "future", "me", "school"]] },
  { spec: ch41, Scene: Ch41Scene, corpus: [LONG, GPU_WORDS, VERBS] },
  { spec: ch42, Scene: Ch42Scene, corpus: [KO, EN, PHRASES, FULL.out, CORRECT] },
  { spec: ch43, Scene: Ch43Scene, corpus: [MAIN, RECAP] },
];
