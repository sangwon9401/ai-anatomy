// Loads an offline checkpoint (src/data/part11-checkpoints.ts) into a runnable mini GPT.
// English version: the English checkpoints also store their BPE merges (a Hangul syllable carries far more than an
// English letter, so the English models were trained on merged tokens, see ch93). The tokenizer is rebuilt exactly as
// bpe.ts buildTokenizer() builds it: line break, space, the single characters, then one token per merge.
import type { Checkpoint } from "../../../../data/part11-checkpoints";
import { NL, SP, type Merge, type Tokenizer } from "../../../../playgrounds/part11/bpe";
import { dequantize, miniConfig, modelFromParams, type Model } from "../../../../playgrounds/part11/minigpt";

export function loadCheckpoint(cp: Checkpoint): { model: Model; tok: Tokenizer } {
  const merges: Merge[] = (cp as Checkpoint & { merges?: Merge[] }).merges ?? [];
  const vocab = [NL, SP, ...cp.vocab];
  const base = vocab.length;
  for (const [a, b] of merges) if (!vocab.includes(a + b)) vocab.push(a + b);
  const tok: Tokenizer = { vocab, index: new Map(vocab.map((t, i) => [t, i])), merges, base };
  const cfg = miniConfig(tok.vocab.length);
  const bin = atob(cp.weights);
  const q = new Int8Array(bin.length);
  for (let i = 0; i < bin.length; i++) q[i] = (bin.charCodeAt(i) << 24) >> 24;
  return { model: modelFromParams(cfg, dequantize(cfg, q, cp.scales)), tok };
}
