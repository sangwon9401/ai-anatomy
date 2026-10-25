// Loads an offline checkpoint (src/data/part11-checkpoints.ts) into a runnable mini GPT.
import type { Checkpoint } from "../../data/part11-checkpoints";
import { NL, SP, tokenizerFromVocab, type Tokenizer } from "./bpe";
import { dequantize, miniConfig, modelFromParams, type Model } from "./minigpt";

export function loadCheckpoint(cp: Checkpoint): { model: Model; tok: Tokenizer } {
  const tok = tokenizerFromVocab([NL, SP, ...cp.vocab]);
  const cfg = miniConfig(tok.vocab.length);
  const bin = atob(cp.weights);
  const q = new Int8Array(bin.length);
  for (let i = 0; i < bin.length; i++) q[i] = (bin.charCodeAt(i) << 24) >> 24;
  return { model: modelFromParams(cfg, dequantize(cfg, q, cp.scales)), tok };
}
