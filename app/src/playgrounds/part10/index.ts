import type { FC } from "react";
import { AgentLoop } from "./AgentLoop";
import { DebateCards } from "./DebateCards";
import { PatchCutter } from "./PatchCutter";
import { RagLab } from "./RagLab";
import { ShrinkLab } from "./ShrinkLab";
import { ThinkSteps } from "./ThinkSteps";

// chapter id → "직접 해보기" component for Part 10
export const PART10_PLAYGROUNDS: Record<number, FC> = {
  86: PatchCutter,
  87: ThinkSteps,
  88: RagLab,
  89: AgentLoop,
  90: ShrinkLab,
  91: DebateCards,
};
