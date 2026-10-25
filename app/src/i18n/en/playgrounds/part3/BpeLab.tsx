// en: overlay of src/playgrounds/part3/BpeLab.tsx (strings and the two word lists' sample text only)
import { useMemo, useState } from "react";
import { DIARY, SCHOOL, applyMerge, countPairs, encode, split0, totalPieces, type Corpus, type Pair } from "../../../../data/ch30";
import "../../../../playgrounds/part3/style.css";

const CORPORA: { key: string; name: string; c: Corpus; sample: string }[] = [
  { key: "diary", name: "Tiny word list", c: DIARY, sample: "lowest slower" },
  { key: "school", name: "Classroom words", c: SCHOOL, sample: "teach reader singing" },
];
const COLORS = ["yellow", "sky", "mint", "pink", "violet", "orange"];

export function BpeLab() {
  const [ck, setCk] = useState(0);
  const [merges, setMerges] = useState<Pair[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [text, setText] = useState(CORPORA[0].sample);
  const corpus = CORPORA[ck].c;

  const pieces = useMemo(() => merges.reduce((st, m) => st.map((ps) => applyMerge(ps, m.a, m.b)), corpus.map((c) => split0(c.w))), [merges, corpus]);
  const pairs = countPairs(pieces, corpus);
  const top = pairs[0]?.n ?? 0;
  const learned = merges.map((m) => m.a + m.b);
  const colorOf = (p: string) => {
    const i = learned.lastIndexOf(p);
    return i >= 0 ? `hl-${COLORS[i % COLORS.length]}` : "p3-plain";
  };
  const start = totalPieces(
    corpus.map((c) => split0(c.w)),
    corpus,
  );
  const now = totalPieces(pieces, corpus);
  const typed = encode(text, merges);

  const pick = (p: Pair) => {
    if (p.n < top) {
      setWrong(`${p.a}+${p.b}`);
      return;
    }
    setWrong(null);
    setMerges((ms) => [...ms, p]);
  };
  const reset = (k = ck) => {
    setCk(k);
    setMerges([]);
    setWrong(null);
    if (k !== ck) setText(CORPORA[k].sample);
  };

  const tip = wrong
    ? `Some pair appears more often than '${wrong}'. Find the pair with the biggest number.`
    : pairs.length === 0
      ? "No pairs left to merge. Every word is now one piece!"
      : merges.length === 0
        ? "BPE always merges the most frequent pair first."
        : `Every merge means fewer pieces: ${start} → ${now}. Type words below and cut them with your tokenizer.`;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="Pick a word list">
        {CORPORA.map((c, i) => (
          <button key={c.key} aria-pressed={i === ck} className={i === ck ? "p3-on" : undefined} onClick={() => reset(i)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="p3-bpe">
        <div className="p3-corpus" aria-label="Word list">
          {corpus.map((c, i) => (
            <div className="p3-crow" key={c.w}>
              <span className="p3-toks p3-tight">
                {pieces[i].map((p, k) => (
                  <span key={k} className={`p3-tok ${colorOf(p)}`}>
                    {p}
                  </span>
                ))}
              </span>
              <span className="p3-times num">×{c.n}</span>
            </div>
          ))}
          <div className="lab-sum num">
            Pieces: <b>{now}</b> (at first {start})
          </div>
        </div>

        <div className="p3-pairs">
          <div className="p3-sub">Pair counts · tap to merge</div>
          {pairs.slice(0, 6).map((p) => (
            <button key={`${p.a}+${p.b}`} className="p3-pair" data-wrong={wrong === `${p.a}+${p.b}`} onClick={() => pick(p)} aria-label={`${p.a} plus ${p.b}, ${p.n} times`}>
              <span className="p3-pair-name">
                {p.a}+{p.b}
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${(p.n / Math.max(1, top)) * 100}%` }} />
              </span>
              <span className="num">{p.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn ghost" disabled={!pairs.length} onClick={() => pairs[0] && pick(pairs[0])}>
          Merge one for me
        </button>
        <button className="btn ghost" onClick={() => reset()}>
          Start over
        </button>
      </div>

      {learned.length > 0 && (
        <div className="p3-learned">
          <span className="muted">New tokens:</span>
          {learned.map((m, i) => (
            <span key={i} className={`p3-tok hl-${COLORS[i % COLORS.length]}`}>
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="lab-tip">{tip}</p>

      <label className="code-label" htmlFor="p3-bpe-try">
        Cut with your practice tokenizer (it uses only the merges you made above)
      </label>
      <input id="p3-bpe-try" className="code-input" value={text} maxLength={30} onChange={(e) => setText(e.target.value)} />
      <div className="p3-toks">
        {typed.map((ps, w) => (
          <span key={w} className="p3-word">
            {ps.map((p, k) => (
              <span key={k} className={`p3-tok ${colorOf(p)}`}>
                {p}
              </span>
            ))}
          </span>
        ))}
      </div>
      <p className="lab-sum">This is not the real GPT tokenizer, just a small practice one that learned from this word list. The real one starts from bytes and merges up to about 200,000 pieces.</p>
    </div>
  );
}
