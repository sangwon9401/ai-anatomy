import type { FC } from "react";
import type { ChapterSpec } from "../data/types";
import type { SceneProps } from "./kit";

/** `corpus`: scene data with strings outside `spec.labels`, so the renderer preloads the right font slices. */
export type BuiltChapter = { spec: ChapterSpec; Scene: FC<SceneProps>; corpus: unknown[] };

export const compId = (id: number) => `ch${String(id).padStart(2, "0")}`;
