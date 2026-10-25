import { useMemo, useState } from "react";
import { corpusByKey } from "../../../../data/part11-corpus";
import { buildTokenizer, countTokens, pairCounts, pieces, type Merge } from "../../../../playgrounds/part11/bpe";
import { getCorpus, getMerges, getSession, setMerges } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

// English: letters carry far less than Korean syllables, so many more merges are useful (the ready-made
// English models use 300). The Korean version stops at 60 and merges 10 at a time.
const MAX = 300;
const AUTO = 50;
const COLORS = ["yellow", "mint", "sky", "pink", "violet", "orange"];
const fmt = (n: number) => n.toLocaleString("en-US");

export function BpeLab() {
  const corpus = corpusByKey(getCorpus());
  const lines = corpus.lines;
  const [merges, setLocal] = useState<Merge[]>(getMerges);
  const [tip, setTip] = useState<string | null>(null);

  const base = useMemo(() => ({ tokens: countTokens(lines, []), vocab: buildTokenizer(lines, []).vocab.length }), [lines]);
  const tok = useMemo(() => buildTokenizer(lines, merges), [lines, merges]);
  const tokens = useMemo(() => countTokens(lines, merges), [lines, merges]);
  const pairs = useMemo(() => pairCounts(lines, merges).slice(0, 5), [lines, merges]);
  const top = pairs[0];
  const last = merges.length ? merges[merges.length - 1].join("") : null;
  const mergedIndex = useMemo(() => new Map(merges.map((m, i) => [m.join(""), i])), [merges]);

  // lines that show the last merge and the next candidate
  const shown = useMemo(() => {
    const has = (t: string) => (l: string) => l.split(" ").some((w) => w.includes(t));
    const out: string[] = [];
    if (last) out.push(...lines.filter(has(last)).slice(0, 2));
    if (top) for (const l of lines.filter(has(top.a + top.b))) if (out.length < 3 && !out.includes(l)) out.push(l);
    for (const l of lines) if (out.length < 3 && !out.includes(l)) out.push(l);
    return out;
  }, [lines, last, top]);

  const commit = (next: Merge[], message: string) => {
    const hadModel = getSession() !== null;
    setLocal(next);
    setMerges(next);
    setTip(hadModel ? `${message} The tokenizer changed, so the chapter 94 model will train again from scratch.` : message);
  };

  const mergePair = (a: string, b: string, n: number, isTop: boolean) => {
    if (merges.length >= MAX) return;
    const t = a + b;
    commit(
      [...merges, [a, b]],
      isTop
        ? `'${a}'+'${b}' → '${t}'. ${n} fewer tokens, and one more kind of token.`
        : `You merged '${t}'. Real BPE always merges the top pair (yellow) first, because that cuts the most tokens.`,
    );
  };

  const auto = (k: number) => {
    let next = merges;
    for (let i = 0; i < k && next.length < MAX; i++) {
      const p = pairCounts(lines, next)[0];
      if (!p) break;
      next = [...next, [p.a, p.b]];
    }
    commit(next, `Merged the most common pair ${next.length - merges.length} times in a row.`);
  };

  const saved = base.tokens - tokens;

  return (
    <div>
      <dl className="p11-stats p11-stats3">
        <div>
          <dt>Merges</dt>
          <dd>{merges.length}</dd>
        </div>
        <div>
          <dt>Total tokens</dt>
          <dd>{fmt(tokens)}</dd>
          <small>{saved > 0 ? `−${fmt(saved)} (${((saved / base.tokens) * 100).toFixed(1)}%)` : "1 per character"}</small>
        </div>
        <div>
          <dt>Kinds of tokens</dt>
          <dd>{fmt(tok.vocab.length)}</dd>
          <small>{tok.vocab.length > base.vocab ? `+${tok.vocab.length - base.vocab}` : "characters"}</small>
        </div>
      </dl>

      <ul className="p11-tokline" aria-label="Lines cut into tokens">
        {shown.map((l) => (
          <li key={l}>
            {pieces(tok, l).map((p, i, arr) => {
              if (p === " ") return <span key={i} className="p11-gap" />;
              const mi = mergedIndex.get(p);
              const cand = top && ((p === top.a && arr[i + 1] === top.b) || (p === top.b && arr[i - 1] === top.a));
              return (
                <span key={i} className={`p11-tok ${mi !== undefined ? `hl-${COLORS[mi % COLORS.length]}` : ""}`} data-cand={cand || undefined} data-new={p === last || undefined}>
                  {p}
                </span>
              );
            })}
          </li>
        ))}
      </ul>

      <h4 className="p11-h4">Pairs side by side inside words</h4>
      <div className="p11-pairs" role="group" aria-label="Choose a pair to merge">
        {pairs.map((p, i) => (
          <button key={p.a + "|" + p.b} className="p11-pair" data-top={i === 0 || undefined} disabled={merges.length >= MAX} onClick={() => mergePair(p.a, p.b, p.n, i === 0)}>
            <span className="p11-pair-ab">
              <span className="p11-tok">{p.a}</span>+<span className="p11-tok">{p.b}</span>
            </span>
            <span className="p11-pair-to">→ {p.a + p.b}</span>
            <span className="val num">{p.n}×</span>
          </button>
        ))}
        {pairs.length === 0 && <p className="p11-note">No pairs left to merge.</p>}
      </div>

      <div className="lab-actions">
        <button className="btn" disabled={!top || merges.length >= MAX} onClick={() => top && mergePair(top.a, top.b, top.n, true)}>
          Merge the top pair
        </button>
        <button className="btn ghost" disabled={!top || merges.length >= MAX} onClick={() => auto(AUTO)}>
          {AUTO} in a row
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit(merges.slice(0, -1), "Undid the last merge.")}>
          Undo
        </button>
        <button className="btn ghost" disabled={!merges.length} onClick={() => commit([], "Back to characters: 1 character = 1 token.")}>
          Start over
        </button>
      </div>

      {merges.length > 0 && (
        <div className="p11-history" aria-label="Merge order">
          {merges.map((m, i) => (
            <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
              {m[0] + m[1]}
            </span>
          ))}
        </div>
      )}

      <p className="p11-uses">
        Tokenizer for the chapter 94 model:{" "}
        <b>{merges.length ? `BPE, ${merges.length} merges (${fmt(tok.vocab.length)} kinds of tokens)` : `1 token per character (${fmt(tok.vocab.length)} kinds of tokens)`}</b>
      </p>
      <p className="lab-tip">
        {merges.length >= MAX
          ? `That's the limit! ${MAX} merges are plenty for this small data. Too many kinds of tokens means more for the model to learn.`
          : (tip ?? `Your data: ${corpus.name}. Press the yellow pair to make the first merge. A single letter says little, so English needs many merges: our ready-made models used 300.`)}
      </p>
    </div>
  );
}
