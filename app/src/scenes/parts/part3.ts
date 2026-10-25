import { CHO, JONG, JUNG, NEXT_TO_GA, WORLD, ch28 } from "../../data/ch28";
import { RARE, SENT, VOCAB_ROWS, ch29 } from "../../data/ch29";
import { DIARY, NEW_WORDS, ch30 } from "../../data/ch30";
import { EN_SAMPLES, LONG, MAIN, SCHOOL_BYTES, ch31 } from "../../data/ch31";
import { VOCAB5, ch32 } from "../../data/ch32";
import { GROUPS, STARS, ch33 } from "../../data/ch33";
import { CANDIDATES, CONTEXT, DRINKS, MAPS, WINDOW, ch34 } from "../../data/ch34";
import { BAE_SENTENCES, UNIVERSE, UNI_GROUPS, ch35 } from "../../data/ch35";
import { PARTICLE_ROWS, PART3_TOOLS, TIME_A, WAVE_NAMES, ch36 } from "../../data/ch36";
import { PIPELINE } from "../../data/ch05";
import { PRESETS } from "../../data/part3-tokens";
import type { BuiltChapter } from "../built";
import { Ch28Scene } from "../Ch28Scene";
import { Ch29Scene } from "../Ch29Scene";
import { Ch30Scene } from "../Ch30Scene";
import { Ch31Scene } from "../Ch31Scene";
import { Ch32Scene } from "../Ch32Scene";
import { Ch33Scene } from "../Ch33Scene";
import { Ch34Scene } from "../Ch34Scene";
import { Ch35Scene } from "../Ch35Scene";
import { Ch36Scene } from "../Ch36Scene";

// Part 3 chapters in chapter order. Owned by the Part 3 build; see CHAPTER_GUIDE.md.
export const PART3: BuiltChapter[] = [
  { spec: ch28, Scene: Ch28Scene, corpus: [CHO, JUNG, JONG, WORLD, NEXT_TO_GA] },
  { spec: ch29, Scene: Ch29Scene, corpus: [SENT, RARE, VOCAB_ROWS, PIPELINE] },
  { spec: ch30, Scene: Ch30Scene, corpus: [DIARY, NEW_WORDS, PRESETS[9]] },
  { spec: ch31, Scene: Ch31Scene, corpus: [MAIN, LONG, SCHOOL_BYTES, EN_SAMPLES] },
  { spec: ch32, Scene: Ch32Scene, corpus: [VOCAB5] },
  { spec: ch33, Scene: Ch33Scene, corpus: [STARS, GROUPS, PIPELINE] },
  { spec: ch34, Scene: Ch34Scene, corpus: [MAPS, CONTEXT, CANDIDATES, WINDOW, DRINKS] },
  { spec: ch35, Scene: Ch35Scene, corpus: [UNIVERSE, UNI_GROUPS, BAE_SENTENCES] },
  { spec: ch36, Scene: Ch36Scene, corpus: [PARTICLE_ROWS, TIME_A, WAVE_NAMES, PART3_TOOLS, PIPELINE] },
];
