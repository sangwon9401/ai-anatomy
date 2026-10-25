import type { FC } from "react";
import { MemoryLab } from "./MemoryLab";
import { NgramWriter } from "./NgramWriter";
import { NoteRelay } from "./NoteRelay";
import { SentenceProb } from "./SentenceProb";
import { SpotlightGame } from "./SpotlightGame";
import { Squeeze } from "./Squeeze";
import { WordMover } from "./WordMover";

// chapter id → "직접 해보기" component for Part 4
export const PART4_PLAYGROUNDS: Record<number, FC> = {
  37: SentenceProb,
  38: NgramWriter,
  39: WordMover,
  40: NoteRelay,
  41: MemoryLab,
  42: Squeeze,
  43: SpotlightGame,
};
