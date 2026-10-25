import { useMemo, useState } from "react";
import { CORPORA, corpusByKey, type CorpusKey } from "../../../../data/part11-corpus";
import { buildTokenizer, countTokens } from "../../../../playgrounds/part11/bpe";
import { miniConfig, paramCount } from "../../../../playgrounds/part11/minigpt";
import { getCorpus, getMerges, getSession, setCorpus } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

const COLORS: Record<CorpusKey, string> = { proverb: "yellow", song: "sky", textbook: "mint" };
const fmt = (n: number) => n.toLocaleString("en-US");

function stats(key: CorpusKey) {
  const c = corpusByKey(key);
  const tok = buildTokenizer(c.lines, []);
  const freq = new Map<string, number>();
  for (const line of c.lines) for (const ch of line) if (ch !== " ") freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    lines: c.lines.length,
    tokens: countTokens(c.lines, []),
    vocab: tok.vocab.length,
    params: paramCount(miniConfig(tok.vocab.length)),
    kb: new TextEncoder().encode(c.lines.join("\n")).length / 1024,
    top,
  };
}

const pickLines = (key: CorpusKey) => {
  const lines = corpusByKey(key).lines;
  const out = new Set<string>();
  while (out.size < 3) out.add(lines[Math.floor(Math.random() * lines.length)]);
  return [...out];
};

export function DatasetLab() {
  const [key, setKey] = useState<CorpusKey>(getCorpus);
  const [seen, setSeen] = useState<Set<CorpusKey>>(() => new Set([getCorpus()]));
  const [sample, setSample] = useState(() => pickLines(getCorpus()));
  const [lost, setLost] = useState<string | null>(null);
  const c = corpusByKey(key);
  const st = useMemo(() => stats(key), [key]);

  const choose = (k: CorpusKey) => {
    if (k === key) return;
    const had = getSession() ? "the model you trained in chapter 94" : getMerges().length ? "the tokenizer you built in chapter 93" : null;
    setCorpus(k);
    setKey(k);
    setSeen((s) => new Set(s).add(k));
    setSample(pickLines(k));
    setLost(had);
  };

  return (
    <div>
      <div className="p11-picks" role="group" aria-label="Choose the data">
        {CORPORA.map((d) => (
          <button key={d.key} className="p11-pick" aria-pressed={d.key === key} data-color={COLORS[d.key]} onClick={() => choose(d.key)}>
            <b>{d.name}</b>
            <span>{d.lines.length} lines</span>
          </button>
        ))}
      </div>

      <div className="p11-card">
        <p className="p11-blurb">{c.blurb}</p>
        <ul className="p11-lines">
          {sample.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <button className="btn ghost" onClick={() => setSample(pickLines(key))}>
          Show other lines
        </button>

        <dl className="p11-stats">
          <div>
            <dt>Lines</dt>
            <dd>{fmt(st.lines)}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{st.kb.toFixed(1)} KB</dd>
          </div>
          <div>
            <dt>Tokens (1 per character)</dt>
            <dd>{fmt(st.tokens)}</dd>
          </div>
          <div>
            <dt>Kinds of tokens</dt>
            <dd>{fmt(st.vocab)}</dd>
          </div>
        </dl>
        <p className="p11-note">
          With {fmt(st.vocab)} kinds of tokens, a mini GPT built on this data has <b className="num">{fmt(st.params)}</b> knobs. Every kind of token needs its own 32-number embedding (chapter 33), so the BPE merges of chapter 93 add more.
        </p>

        <h4 className="p11-h4">Most common characters</h4>
        <div className="bars">
          {st.top.map(([ch, n]) => (
            <div className="bar-row" key={ch}>
              <span className="label">{ch}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${(n / st.top[0][1]) * 100}%`, background: `var(--hl-${COLORS[key]})` }} />
              </span>
              <span className="val">{n}×</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        <li data-done={seen.size === 3}>
          {seen.size === 3 ? "✓" : "○"} Look at all three datasets ({seen.size}/3)
        </li>
      </ul>
      <p className="lab-tip">
        {lost
          ? `You changed the data, so ${lost} was cleared. The data now: ${c.name}.`
          : `Your data: ${c.name}. Chapters 93–95 build on it. After reading it all, the model will write ${c.expect}.`}
      </p>
    </div>
  );
}
