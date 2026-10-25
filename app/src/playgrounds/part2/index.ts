import type { FC } from "react";
import { BatchLab } from "./BatchLab";
import { BendLab } from "./BendLab";
import { BlameLab } from "./BlameLab";
import { BossLab } from "./BossLab";
import { DigitPad } from "./DigitPad";
import { FlowLab } from "./FlowLab";
import { FogLab } from "./FogLab";
import { FoldLab } from "./FoldLab";
import { LossLab } from "./LossLab";
import { OverfitLab } from "./OverfitLab";
import { StrideLab } from "./StrideLab";
import { NeuronLab } from "./NeuronLab";

// chapter id → "직접 해보기" component for Part 2
export const PART2_PLAYGROUNDS: Record<number, FC> = {
  16: NeuronLab,
  17: BendLab,
  18: FoldLab,
  19: FlowLab,
  20: LossLab,
  21: FogLab,
  22: StrideLab,
  23: BlameLab,
  24: BatchLab,
  25: OverfitLab,
  26: DigitPad,
  27: BossLab,
};
