import { CONTINUE, FRAMES, PROBES, QLIKE, READ, ch72 } from "../../data/ch72";
import { DEMOS, STRIP_A, STRIP_Q, STYLES, TESTS, ch73 } from "../../data/ch73";
import { ROUNDS, ch74 } from "../../data/ch74";
import { PAIRS, TEST, TRAIN, ch75 } from "../../data/ch75";
import { KINDS, LEASH, ch76 } from "../../data/ch76";
import { TRAINING } from "../../data/ch05";
import { CHATML, MESSAGES, NEXT, REPLY, SYSTEM, SYSTEMS, TURNS, ch77 } from "../../data/ch77";
import { RECIPE, SERVICES, ch78 } from "../../data/ch78";
import { BANNED, RECAP, REQUESTS, REQUESTS_FLOW, TEASER, ch79 } from "../../data/ch79";
import type { BuiltChapter } from "../built";
import { Ch72Scene } from "../Ch72Scene";
import { Ch73Scene } from "../Ch73Scene";
import { Ch74Scene } from "../Ch74Scene";
import { Ch75Scene } from "../Ch75Scene";
import { Ch76Scene } from "../Ch76Scene";
import { Ch77Scene } from "../Ch77Scene";
import { Ch78Scene } from "../Ch78Scene";
import { Ch79Scene } from "../Ch79Scene";

// Part 8 chapters in chapter order. Owned by the Part 8 build; see CHAPTER_GUIDE.md.
export const PART8: BuiltChapter[] = [
  { spec: ch72, Scene: Ch72Scene, corpus: [CONTINUE, READ, QLIKE, FRAMES, PROBES] },
  { spec: ch73, Scene: Ch73Scene, corpus: [DEMOS, STRIP_Q, STRIP_A, STYLES, TESTS] },
  { spec: ch74, Scene: Ch74Scene, corpus: [ROUNDS] },
  { spec: ch75, Scene: Ch75Scene, corpus: [TRAIN, PAIRS, TEST, ROUNDS] },
  { spec: ch76, Scene: Ch76Scene, corpus: [KINDS, LEASH, TRAINING] },
  { spec: ch77, Scene: Ch77Scene, corpus: [SYSTEM, TURNS, REPLY, NEXT, CHATML, SYSTEMS, MESSAGES] },
  { spec: ch78, Scene: Ch78Scene, corpus: [SERVICES, RECIPE] },
  { spec: ch79, Scene: Ch79Scene, corpus: [REQUESTS_FLOW, REQUESTS, BANNED, RECAP, TEASER] },
];
