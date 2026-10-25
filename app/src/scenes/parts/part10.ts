import { PALETTE, QUESTION_TOKENS, TEXT_TOKENS, ch86 } from "../../data/ch86";
import { FAST, FAST_CHECK, PROBLEM, PROBLEMS, THINK, ch87 } from "../../data/ch87";
import { DOCS, QUESTIONS, SCENE_DOCS, ch88 } from "../../data/ch88";
import { STRIP_CALC, STRIP_SEARCH, TASKS, ch89 } from "../../data/ch89";
import { NEXT, PARAM_PRESETS, ch90 } from "../../data/ch90";
import { ABILITIES, CARDS, ch91 } from "../../data/ch91";
import type { BuiltChapter } from "../built";
import { Ch86Scene } from "../Ch86Scene";
import { Ch87Scene } from "../Ch87Scene";
import { Ch88Scene } from "../Ch88Scene";
import { Ch89Scene } from "../Ch89Scene";
import { Ch90Scene } from "../Ch90Scene";
import { Ch91Scene } from "../Ch91Scene";

// Part 10 chapters in chapter order. Owned by the Part 10 build; see CHAPTER_GUIDE.md.
export const PART10: BuiltChapter[] = [
  { spec: ch86, Scene: Ch86Scene, corpus: [QUESTION_TOKENS, TEXT_TOKENS, PALETTE.map((p) => p.name)] },
  { spec: ch87, Scene: Ch87Scene, corpus: [PROBLEM, FAST, FAST_CHECK, THINK, PROBLEMS] },
  { spec: ch88, Scene: Ch88Scene, corpus: [SCENE_DOCS, DOCS, QUESTIONS] },
  { spec: ch89, Scene: Ch89Scene, corpus: [STRIP_CALC, STRIP_SEARCH, TASKS] },
  { spec: ch90, Scene: Ch90Scene, corpus: [NEXT, PARAM_PRESETS] },
  { spec: ch91, Scene: Ch91Scene, corpus: [CARDS, ABILITIES] },
];
