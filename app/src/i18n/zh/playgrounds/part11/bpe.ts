// A tiny BPE tokenizer for Part 11 (ch93), shared by the playgrounds and the Node training scripts.
// Pure: no imports. Merges happen only inside a word (never across a space), as in classic BPE.
// With no merges this is a plain character tokenizer: one character (汉字 or punctuation) = one token.
// Chinese has no spaces, so for the zh corpora a whole line is one "word" and merges can span it.

export type Merge = [string, string];

export const NL = "\n"; // line break: marks the start and end of every line
export const SP = " ";

export type Tokenizer = {
  /** id → token text. 0 is the line break, 1 the space, then single characters, then merged tokens. */
  vocab: string[];
  index: Map<string, number>;
  merges: Merge[];
  /** number of single-character tokens (incl. line break and space) */
  base: number;
};

const words = (lines: string[]) => {
  const counts = new Map<string, number>();
  for (const line of lines) for (const w of line.split(SP)) if (w) counts.set(w, (counts.get(w) ?? 0) + 1);
  return counts;
};

/** Split a word into characters, then apply the merges in order. */
export function segmentWord(word: string, merges: Merge[]) {
  let sym = [...word];
  for (const [a, b] of merges) {
    if (sym.length < 2) break;
    let out: string[] | null = null;
    for (let i = 0; i < sym.length; i++) {
      if (i < sym.length - 1 && sym[i] === a && sym[i + 1] === b) {
        out ??= sym.slice(0, i);
        out.push(a + b);
        i++;
      } else if (out) out.push(sym[i]);
    }
    if (out) sym = out;
  }
  return sym;
}

export function buildTokenizer(lines: string[], merges: Merge[] = []): Tokenizer {
  const chars = new Set<string>();
  for (const line of lines) for (const ch of line) if (ch !== SP) chars.add(ch);
  const vocab = [NL, SP, ...[...chars].sort()];
  const base = vocab.length;
  const index = new Map(vocab.map((t, i) => [t, i]));
  for (const [a, b] of merges) {
    const t = a + b;
    if (!index.has(t)) {
      index.set(t, vocab.length);
      vocab.push(t);
    }
  }
  return { vocab, index, merges, base };
}

/** A character-level tokenizer with a fixed vocabulary (used for the offline checkpoints). */
export function tokenizerFromVocab(vocab: string[]): Tokenizer {
  return { vocab, index: new Map(vocab.map((t, i) => [t, i])), merges: [], base: vocab.length };
}

/** Token pieces (strings) of one line, without the line break. */
export function pieces(tok: Tokenizer, line: string) {
  const out: string[] = [];
  line.split(SP).forEach((w, i) => {
    if (i > 0) out.push(SP);
    if (w) out.push(...segmentWord(w, tok.merges));
  });
  return out;
}

/** Token ids of one line. Characters the tokenizer has never seen are skipped and returned in `unknown`. */
export function encodeLine(tok: Tokenizer, line: string) {
  const ids: number[] = [];
  const unknown: string[] = [];
  for (const p of pieces(tok, line)) {
    const id = tok.index.get(p);
    if (id !== undefined) ids.push(id);
    else for (const ch of p) unknown.push(ch);
  }
  return { ids, unknown };
}

export const decode = (tok: Tokenizer, ids: number[]) => ids.map((i) => tok.vocab[i]).join("");

/** Total tokens in the corpus: every line's pieces plus one line break per line. */
export function countTokens(lines: string[], merges: Merge[]) {
  let n = 0;
  for (const [w, c] of words(lines)) n += segmentWord(w, merges).length * c;
  for (const line of lines) n += line.split(SP).filter(Boolean).length - 1 + 1; // spaces + line break
  return n;
}

/** How often each neighbouring pair of tokens appears inside words, most frequent first. */
export function pairCounts(lines: string[], merges: Merge[]) {
  const counts = new Map<string, { a: string; b: string; n: number }>();
  for (const [w, c] of words(lines)) {
    const sym = segmentWord(w, merges);
    for (let i = 0; i < sym.length - 1; i++) {
      const key = sym[i] + "\u0000" + sym[i + 1];
      const e = counts.get(key);
      if (e) e.n += c;
      else counts.set(key, { a: sym[i], b: sym[i + 1], n: c });
    }
  }
  // ties: shorter result first, then Chinese (pinyin) order, so the list is stable
  return [...counts.values()].sort((x, y) => y.n - x.n || (x.a + x.b).length - (y.a + y.b).length || (x.a + x.b).localeCompare(y.a + y.b, "zh"));
}
