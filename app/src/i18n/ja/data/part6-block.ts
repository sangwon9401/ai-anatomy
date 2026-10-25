import { PIPELINE } from "../../../data/ch05";
import type { Highlighter } from "../../../data/types";

// The transformer block as Part 6 draws it, everywhere: the ch05 blueprint's アテンション and フィードフォワード
// (same names, same yellow), plus the two helpers this Part adds: 正規化 before each part, and 足し算
// (the residual "highway") after it. GPT-2/3 order (pre-LN): 正規化 → アテンション → 足し算 → 正規化 → フィードフォワード → 足し算.

export type BlockKey = "norm1" | "att" | "add1" | "norm2" | "ffn" | "add2";
export type BlockKind = "norm" | "att" | "add" | "ffn";

const att = PIPELINE.find((p) => p.key === "att")!;
const ffn = PIPELINE.find((p) => p.key === "ffn")!;

export const KIND: Record<BlockKind, { name: string; does: string; where: string; color: Highlighter }> = {
  norm: { name: "正規化", does: "数の大きさをそろえる", where: "57章", color: "violet" },
  att: { name: att.name, does: "見つめ合って混ぜる", where: att.where, color: att.color },
  add: { name: "足し算", does: "元のベクトルに結果を足す", where: "56章", color: "orange" },
  ffn: { name: ffn.name, does: "単語ごとに「考え」を足す", where: ffn.where, color: ffn.color },
};

export const BLOCK_ORDER: BlockKey[] = ["norm1", "att", "add1", "norm2", "ffn", "add2"];

export const kindOf = (k: BlockKey): BlockKind => (k === "norm1" || k === "norm2" ? "norm" : k === "add1" || k === "add2" ? "add" : k);

export const BLOCK_TEXT = {
  block: "トランスフォーマーブロック",
  plus: "+",
  road: "高速道路",
};

/** Parts of the whole GPT blueprint outside the block, from ch05 (same names and colours). */
export const OUTER = PIPELINE.filter((p) => p.key !== "att" && p.key !== "ffn");

/** Strings drawn by the Part 6 helpers; pass this as `corpus` for every chapter that draws a block or blueprint. */
export const PART6_CORPUS = [KIND, BLOCK_TEXT, OUTER];
