import { PIPELINE } from "../../../data/ch05";
import type { Highlighter } from "../../../data/types";

// zh overlay of src/data/part6-block.ts.
// The transformer block as Part 6 draws it, everywhere: the ch05 blueprint's 注意力 and 前馈网络
// (same names, same yellow, taken from ch05 so they always match it), plus the two helpers this Part adds:
// 归一化 before each part, and 相加 (the residual "highway") after it.
// GPT-2/3 order (pre-LN): 归一化 → 注意力 → 相加 → 归一化 → 前馈网络 → 相加.

export type BlockKey = "norm1" | "att" | "add1" | "norm2" | "ffn" | "add2";
export type BlockKind = "norm" | "att" | "add" | "ffn";

const att = PIPELINE.find((p) => p.key === "att")!;
const ffn = PIPELINE.find((p) => p.key === "ffn")!;

export const KIND: Record<BlockKind, { name: string; does: string; where: string; color: Highlighter }> = {
  norm: { name: "归一化", does: "统一数字的大小", where: "第57章", color: "violet" },
  att: { name: att.name, does: "词与词互相看，混合意思", where: "第45章", color: att.color },
  add: { name: "相加", does: "把结果加回原来的向量", where: "第56章", color: "orange" },
  ffn: { name: ffn.name, does: "给每个词加上“思考”", where: "第55章", color: ffn.color },
};

export const BLOCK_ORDER: BlockKey[] = ["norm1", "att", "add1", "norm2", "ffn", "add2"];

export const kindOf = (k: BlockKey): BlockKind => (k === "norm1" || k === "norm2" ? "norm" : k === "add1" || k === "add2" ? "add" : k);

export const BLOCK_TEXT = {
  block: "Transformer 模块",
  plus: "+",
  road: "高速公路",
};

/** Parts of the whole GPT blueprint outside the block, from ch05 (same names and colours). */
export const OUTER = PIPELINE.filter((p) => p.key !== "att" && p.key !== "ffn");

/** Strings drawn by the Part 6 helpers; pass this as `corpus` for every chapter that draws a block or blueprint. */
export const PART6_CORPUS = [KIND, BLOCK_TEXT, OUTER];
