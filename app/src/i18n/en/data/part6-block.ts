import { PIPELINE } from "../../../data/ch05";
import type { Highlighter } from "../../../data/types";

// The transformer block as Part 6 draws it, everywhere: the ch05 blueprint's attention and feed-forward
// (same names, same yellow), plus the two helpers this Part adds: normalize before each part, and add
// (the residual "highway") after it. GPT-2/3 order (pre-LN): normalize → attention → add → normalize → feed-forward → add.

export type BlockKey = "norm1" | "att" | "add1" | "norm2" | "ffn" | "add2";
export type BlockKind = "norm" | "att" | "add" | "ffn";

const att = PIPELINE.find((p) => p.key === "att")!;
const ffn = PIPELINE.find((p) => p.key === "ffn")!;

export const KIND: Record<BlockKind, { name: string; does: string; where: string; color: Highlighter }> = {
  norm: { name: "Normalize", does: "even out the sizes", where: "ch. 57", color: "violet" },
  att: { name: att.name, does: "Words look and mix", where: att.where, color: att.color },
  add: { name: "Add", does: "add the result to the original", where: "ch. 56", color: "orange" },
  ffn: { name: ffn.name, does: "Each word 'thinks'", where: ffn.where, color: ffn.color },
};

export const BLOCK_ORDER: BlockKey[] = ["norm1", "att", "add1", "norm2", "ffn", "add2"];

export const kindOf = (k: BlockKey): BlockKind => (k === "norm1" || k === "norm2" ? "norm" : k === "add1" || k === "add2" ? "add" : k);

export const BLOCK_TEXT = {
  block: "Transformer block",
  plus: "+",
  road: "Highway",
};

/** Parts of the whole GPT blueprint outside the block, from ch05 (same names and colours). */
export const OUTER = PIPELINE.filter((p) => p.key !== "att" && p.key !== "ffn");

/** Strings drawn by the Part 6 helpers; pass this as `corpus` for every chapter that draws a block or blueprint. */
export const PART6_CORPUS = [KIND, BLOCK_TEXT, OUTER];
