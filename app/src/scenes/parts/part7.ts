import type { BuiltChapter } from "../built";
import { BIN_CUTS, FACTORY_DOCS, MIX, SOURCES, ch63 } from "../../data/ch63";
import { SENT, ch64 } from "../../data/ch64";
import { LADDER, NEXT, QUESTIONS65, ch65 } from "../../data/ch65";
import { CANDS, STATIONS, ch66 } from "../../data/ch66";
import { ch67 } from "../../data/ch67";
import { ch68 } from "../../data/ch68";
import { MODELS, TOWER, ch69 } from "../../data/ch69";
import { ch70 } from "../../data/ch70";
import { ACCURACY, PART7_TOOLS, TASKS, ch71 } from "../../data/ch71";
import { Ch63Scene } from "../Ch63Scene";
import { Ch64Scene } from "../Ch64Scene";
import { Ch65Scene } from "../Ch65Scene";
import { Ch66Scene } from "../Ch66Scene";
import { Ch67Scene } from "../Ch67Scene";
import { Ch68Scene } from "../Ch68Scene";
import { Ch69Scene } from "../Ch69Scene";
import { Ch70Scene } from "../Ch70Scene";
import { Ch71Scene } from "../Ch71Scene";

// Part 7 chapters in chapter order. Owned by the Part 7 build; see CHAPTER_GUIDE.md.
export const PART7: BuiltChapter[] = [
  { spec: ch63, Scene: Ch63Scene, corpus: [SOURCES, MIX, FACTORY_DOCS, BIN_CUTS] },
  { spec: ch64, Scene: Ch64Scene, corpus: [SENT] },
  { spec: ch65, Scene: Ch65Scene, corpus: [NEXT, LADDER, QUESTIONS65] },
  { spec: ch66, Scene: Ch66Scene, corpus: [CANDS, STATIONS] },
  { spec: ch67, Scene: Ch67Scene, corpus: [] },
  { spec: ch68, Scene: Ch68Scene, corpus: [] },
  { spec: ch69, Scene: Ch69Scene, corpus: [MODELS, TOWER] },
  { spec: ch70, Scene: Ch70Scene, corpus: [] },
  { spec: ch71, Scene: Ch71Scene, corpus: [TASKS, ACCURACY, PART7_TOOLS] },
];
