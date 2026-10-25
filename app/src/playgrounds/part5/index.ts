import type { FC } from "react";
import { AttnExplorer } from "./AttnExplorer";
import { CardFactory } from "./CardFactory";
import { HeadDetective } from "./HeadDetective";
import { MaskLab } from "./MaskLab";
import { MatMulTrace } from "./MatMulTrace";
import { PaintLab } from "./PaintLab";
import { QDrag } from "./QDrag";
import { RaceLab } from "./RaceLab";
import { SqrtLab } from "./SqrtLab";

// chapter id → "직접 해보기" component for Part 5
export const PART5_PLAYGROUNDS: Record<number, FC> = {
  44: RaceLab,
  46: CardFactory,
  47: QDrag,
  48: SqrtLab,
  49: PaintLab,
  50: MatMulTrace,
  51: MaskLab,
  52: HeadDetective,
  53: AttnExplorer,
};
