import { PIPELINE } from "./ch05";
import type { Highlighter } from "./types";

// The transformer block as Part 6 draws it, everywhere: the ch05 blueprint's 어텐션 and 피드포워드
// (same names, same yellow), plus the two helpers this Part adds: 정규화 before each part, and 더하기
// (the residual "highway") after it. GPT-2/3 order (pre-LN): 정규화 → 어텐션 → 더하기 → 정규화 → 피드포워드 → 더하기.

export type BlockKey = "norm1" | "att" | "add1" | "norm2" | "ffn" | "add2";
export type BlockKind = "norm" | "att" | "add" | "ffn";

const att = PIPELINE.find((p) => p.key === "att")!;
const ffn = PIPELINE.find((p) => p.key === "ffn")!;

export const KIND: Record<BlockKind, { name: string; does: string; where: string; color: Highlighter }> = {
  norm: { name: "정규화", does: "숫자 크기 맞추기", where: "57장", color: "violet" },
  att: { name: att.name, does: "단어끼리 쳐다보고 섞기", where: att.where, color: att.color },
  add: { name: "더하기", does: "원래 벡터에 결과 더하기", where: "56장", color: "orange" },
  ffn: { name: ffn.name, does: "단어마다 '생각' 더하기", where: ffn.where, color: ffn.color },
};

export const BLOCK_ORDER: BlockKey[] = ["norm1", "att", "add1", "norm2", "ffn", "add2"];

export const kindOf = (k: BlockKey): BlockKind => (k === "norm1" || k === "norm2" ? "norm" : k === "add1" || k === "add2" ? "add" : k);

export const BLOCK_TEXT = {
  block: "트랜스포머 블록",
  plus: "+",
  road: "고속도로",
};

/** Parts of the whole GPT blueprint outside the block, from ch05 (same names and colours). */
export const OUTER = PIPELINE.filter((p) => p.key !== "att" && p.key !== "ffn");

/** Strings drawn by the Part 6 helpers; pass this as `corpus` for every chapter that draws a block or blueprint. */
export const PART6_CORPUS = [KIND, BLOCK_TEXT, OUTER];
