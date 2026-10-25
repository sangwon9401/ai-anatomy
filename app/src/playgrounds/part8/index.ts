import type { FC } from "react";
import { ChatDoc } from "./ChatDoc";
import { DocStarter } from "./DocStarter";
import { JudgeTrainer } from "./JudgeTrainer";
import { LeashLab } from "./LeashLab";
import { MillionRace } from "./MillionRace";
import { RankLab } from "./RankLab";
import { SafetySort } from "./SafetySort";
import { StyleTuner } from "./StyleTuner";

// chapter id → "직접 해보기" component for Part 8
export const PART8_PLAYGROUNDS: Record<number, FC> = {
  72: DocStarter,
  73: StyleTuner,
  74: RankLab,
  75: JudgeTrainer,
  76: LeashLab,
  77: ChatDoc,
  78: MillionRace,
  79: SafetySort,
};
