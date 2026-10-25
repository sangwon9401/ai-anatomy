import { AUTHORS, ROADMAP5, TIMELINE44, ch44 } from "../../data/ch44";
import { BOOKS, KEY_WORDS, ch46 } from "../../data/ch46";
import { ch47 } from "../../data/ch47";
import { ch48 } from "../../data/ch48";
import { ch49 } from "../../data/ch49";
import { ch50 } from "../../data/ch50";
import { ch51 } from "../../data/ch51";
import { HEADS52, ch52 } from "../../data/ch52";
import { GPT2_HEADS, PART5_TOOLS, ch53 } from "../../data/ch53";
import { PIPELINE } from "../../data/ch05";
import { GPT2_SENTENCES } from "../../data/part5-gpt2";
import { TOY_CORPUS } from "../../data/part5-toy";
import type { BuiltChapter } from "../built";
import { Ch44Scene } from "../Ch44Scene";
import { Ch46Scene } from "../Ch46Scene";
import { Ch47Scene } from "../Ch47Scene";
import { Ch48Scene } from "../Ch48Scene";
import { Ch49Scene } from "../Ch49Scene";
import { Ch50Scene } from "../Ch50Scene";
import { Ch51Scene } from "../Ch51Scene";
import { Ch52Scene } from "../Ch52Scene";
import { Ch53Scene } from "../Ch53Scene";

// Part 5 chapters in chapter order. Owned by the Part 5 build; see CHAPTER_GUIDE.md.
// (45 is registered with the first chapters in registry.ts.)
export const PART5: BuiltChapter[] = [
  { spec: ch44, Scene: Ch44Scene, corpus: [AUTHORS, ROADMAP5, TIMELINE44] },
  { spec: ch46, Scene: Ch46Scene, corpus: [BOOKS, KEY_WORDS, TOY_CORPUS] },
  { spec: ch47, Scene: Ch47Scene, corpus: [TOY_CORPUS] },
  { spec: ch48, Scene: Ch48Scene, corpus: [TOY_CORPUS] },
  { spec: ch49, Scene: Ch49Scene, corpus: [TOY_CORPUS] },
  { spec: ch50, Scene: Ch50Scene, corpus: [TOY_CORPUS] },
  { spec: ch51, Scene: Ch51Scene, corpus: [TOY_CORPUS] },
  { spec: ch52, Scene: Ch52Scene, corpus: [HEADS52, TOY_CORPUS] },
  { spec: ch53, Scene: Ch53Scene, corpus: [GPT2_HEADS, GPT2_SENTENCES, PART5_TOOLS, PIPELINE] },
];
