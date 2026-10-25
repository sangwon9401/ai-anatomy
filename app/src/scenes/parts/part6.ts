import { ch54 } from "../../data/ch54";
import { FFN_WORDS, ch55 } from "../../data/ch55";
import { DRIFT, PHONE, ch56 } from "../../data/ch56";
import { ROWS, ch57 } from "../../data/ch57";
import { DEPTH_NOTES, MODELS, ch58 } from "../../data/ch58";
import { SENT, ch59 } from "../../data/ch59";
import { LOGITS, ch60 } from "../../data/ch60";
import { STATIONS, TOKENS, ch61 } from "../../data/ch61";
import { BLOCK_CARDS, BP_CARDS, ch62 } from "../../data/ch62";
import { PART6_CORPUS } from "../../data/part6-block";
import { Ch54Scene } from "../Ch54Scene";
import { Ch55Scene } from "../Ch55Scene";
import { Ch56Scene } from "../Ch56Scene";
import { Ch57Scene } from "../Ch57Scene";
import { Ch58Scene } from "../Ch58Scene";
import { Ch59Scene } from "../Ch59Scene";
import { Ch60Scene } from "../Ch60Scene";
import { Ch61Scene } from "../Ch61Scene";
import { Ch62Scene } from "../Ch62Scene";
import type { BuiltChapter } from "../built";

// Part 6 chapters in chapter order. Owned by the Part 6 build; see CHAPTER_GUIDE.md.
export const PART6: BuiltChapter[] = [
  { spec: ch54, Scene: Ch54Scene, corpus: [PART6_CORPUS] },
  { spec: ch55, Scene: Ch55Scene, corpus: [PART6_CORPUS, FFN_WORDS] },
  { spec: ch56, Scene: Ch56Scene, corpus: [PART6_CORPUS, PHONE, DRIFT] },
  { spec: ch57, Scene: Ch57Scene, corpus: [PART6_CORPUS, ROWS] },
  { spec: ch58, Scene: Ch58Scene, corpus: [PART6_CORPUS, MODELS, DEPTH_NOTES] },
  { spec: ch59, Scene: Ch59Scene, corpus: [PART6_CORPUS, SENT] },
  { spec: ch60, Scene: Ch60Scene, corpus: [PART6_CORPUS, LOGITS] },
  { spec: ch61, Scene: Ch61Scene, corpus: [PART6_CORPUS, STATIONS, TOKENS, LOGITS] },
  { spec: ch62, Scene: Ch62Scene, corpus: [PART6_CORPUS, BLOCK_CARDS, BP_CARDS] },
];
