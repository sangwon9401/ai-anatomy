import type { FC } from "react";
import { BpeLab } from "./BpeLab";
import { CertLab } from "./CertLab";
import { DatasetLab } from "./DatasetLab";
import { GenLab } from "./GenLab";
import { TrainLab } from "./TrainLab";

// chapter id → "직접 해보기" component for Part 11
export const PART11_PLAYGROUNDS: Record<number, FC> = {
  92: DatasetLab,
  93: BpeLab,
  94: TrainLab,
  95: GenLab,
  96: CertLab,
};
