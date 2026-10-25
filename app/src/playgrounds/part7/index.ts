import type { FC } from "react";
import { BallRace } from "./BallRace";
import { BuildingCompare } from "./BuildingCompare";
import { DataFactory } from "./DataFactory";
import { FewShotLab } from "./FewShotLab";
import { GpuRace } from "./GpuRace";
import { QuestionFactory } from "./QuestionFactory";
import { ScaleAxis } from "./ScaleAxis";
import { SurpriseMeter } from "./SurpriseMeter";
import { TrainingLoop } from "./TrainingLoop";

// chapter id → "직접 해보기" component for Part 7
export const PART7_PLAYGROUNDS: Record<number, FC> = {
  63: DataFactory,
  64: QuestionFactory,
  65: SurpriseMeter,
  66: TrainingLoop,
  67: BallRace,
  68: GpuRace,
  69: BuildingCompare,
  70: ScaleAxis,
  71: FewShotLab,
};
