import type { FC } from "react";
import { BlockLab } from "./BlockLab";
import { BossBuild } from "./BossBuild";
import { DepthLab } from "./DepthLab";
import { FfnLab } from "./FfnLab";
import { LogitLab } from "./LogitLab";
import { MaskLab } from "./MaskLab";
import { NormLab } from "./NormLab";
import { ResidualLab } from "./ResidualLab";
import { TripLab } from "./TripLab";

// chapter id → "직접 해보기" component for Part 6
export const PART6_PLAYGROUNDS: Record<number, FC> = {
  54: BlockLab,
  55: FfnLab,
  56: ResidualLab,
  57: NormLab,
  58: DepthLab,
  59: MaskLab,
  60: LogitLab,
  61: TripLab,
  62: BossBuild,
};
