import type { FC } from "react";
import { CutLab } from "./CutLab";
import { GreedyWheel } from "./GreedyWheel";
import { HalluLab } from "./HalluLab";
import { PromptLab } from "./PromptLab";
import { TempLab } from "./TempLab";
import { WindowLab } from "./WindowLab";

// chapter id → "직접 해보기" component for Part 9
export const PART9_PLAYGROUNDS: Record<number, FC> = {
  80: GreedyWheel,
  81: TempLab,
  82: CutLab,
  83: WindowLab,
  84: HalluLab,
  85: PromptLab,
};
