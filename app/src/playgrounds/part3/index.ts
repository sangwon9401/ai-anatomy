import type { FC } from "react";
import { BpeLab } from "./BpeLab";
import { HangulBuilder } from "./HangulBuilder";
import { OneHotLab } from "./OneHotLab";
import { PositionLab } from "./PositionLab";
import { StarMap } from "./StarMap";
import { TokenDuel } from "./TokenDuel";
import { TokenScope } from "./TokenScope";
import { UniverseLab } from "./UniverseLab";
import { WordCalc } from "./WordCalc";

// chapter id → "직접 해보기" component for Part 3
export const PART3_PLAYGROUNDS: Record<number, FC> = {
  28: HangulBuilder,
  29: TokenScope,
  30: BpeLab,
  31: TokenDuel,
  32: OneHotLab,
  33: StarMap,
  34: WordCalc,
  35: UniverseLab,
  36: PositionLab,
};
