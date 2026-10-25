// en: overlay of src/playgrounds/part3/TokenDuel.tsx. Chapter 31 compares English with Korean, Japanese and Chinese,
// so a language picker is added; the duel itself (guess, three tokenizers, chips) works as in the Korean original.
// In the English data each PAIRS entry is (other language, English); `ko` holds the other language's text.
import { useState } from "react";
import { PAIRS, TOKENIZERS, type TokenizerKey } from "../../../../data/part3-tokens";
import { TokenChips } from "../../../../playgrounds/part3/TokenChips";
import "../../../../playgrounds/part3/style.css";

const LANGS = [
  { name: "Korean", color: "pink" },
  { name: "Japanese", color: "yellow" },
  { name: "Chinese", color: "mint" },
];
const langOf = (t: string) => (/[가-힣]/.test(t) ? 0 : /[぀-ヿ]/.test(t) ? 1 : 2);
const SENTENCES = [...new Set(PAIRS.map((p) => p.en))];

type Guess = "ko" | "en" | "same";

export function TokenDuel() {
  const [k, setK] = useState(0);
  const [lang, setLang] = useState(0);
  const [tk, setTk] = useState<TokenizerKey>("o200k_base");
  const [guess, setGuess] = useState<Guess | null>(null);
  const p = PAIRS.find((q) => q.en === SENTENCES[k] && langOf(q.ko) === lang) ?? PAIRS[0];
  const other = LANGS[lang];
  const ko = p.o200k_base.ko.length;
  const en = p.o200k_base.en.length;
  const truth: Guess = ko > en ? "ko" : ko < en ? "en" : "same";
  const max = Math.max(...TOKENIZERS.map((t) => Math.max(p[t.key].ko.length, p[t.key].en.length)));
  const model = TOKENIZERS.find((t) => t.key === tk)!.model;
  const GUESSES: { g: Guess; label: string }[] = [
    { g: "ko", label: `${other.name} has more` },
    { g: "en", label: "English has more" },
    { g: "same", label: "The same" },
  ];

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="Pick a sentence">
        {SENTENCES.map((q, i) => (
          <button
            key={q}
            aria-pressed={i === k}
            className={i === k ? "p3-on" : undefined}
            onClick={() => {
              setK(i);
              setGuess(null);
            }}
          >
            {i === SENTENCES.length - 1 ? "Long text (3 sentences)" : q}
          </button>
        ))}
      </div>

      <div className="seg p3-seg" role="group" aria-label="Compare English with">
        {LANGS.map((l, i) => (
          <button
            key={l.name}
            aria-pressed={i === lang}
            onClick={() => {
              setLang(i);
              setGuess(null);
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="p3-duel-text">
        <p>
          <span className={`chip hl-${other.color}`}>{other.name}</span> {p.ko}
        </p>
        <p>
          <span className="chip hl-sky">English</span> {p.en}
        </p>
      </div>

      {guess === null ? (
        <div className="p3-guess">
          <p className="lab-sum">Cut with GPT-4o's tokenizer, which side has more tokens?</p>
          <div className="lab-actions">
            {GUESSES.map((x) => (
              <button key={x.g} className="btn ghost" onClick={() => setGuess(x.g)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="lab-tip">
            {guess === truth ? "You got it! " : "Not quite. "}
            In GPT-4o: {other.name} {ko}, English {en}
            {ko > en ? ` (about ${(ko / en).toFixed(1)}×)` : ko === en ? ", exactly the same" : ` (about ${(ko / en).toFixed(1)}×, fewer)`}. What about the older tokenizers?
          </p>

          <div className="p3-duel-bars" role="table" aria-label="Token counts per tokenizer">
            {TOKENIZERS.map((t) => (
              <div className="p3-duel-row" role="row" key={t.key}>
                <span className="p3-duel-name" role="rowheader">
                  {t.model}
                </span>
                <span className="p3-duel-pair" role="cell">
                  <span className={`p3-hbar hl-${other.color}`} style={{ width: `${(p[t.key].ko.length / max) * 100}%` }}>
                    {p[t.key].ko.length}
                  </span>
                  <span className="p3-hbar hl-sky" style={{ width: `${(p[t.key].en.length / max) * 100}%` }}>
                    {p[t.key].en.length}
                  </span>
                </span>
                <span className="p3-duel-ratio num" role="cell">
                  ×{(p[t.key].ko.length / p[t.key].en.length).toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          <div className="seg p3-seg" role="group" aria-label="Pick a tokenizer">
            {TOKENIZERS.map((t) => (
              <button key={t.key} aria-pressed={t.key === tk} onClick={() => setTk(t.key)}>
                {t.model}
              </button>
            ))}
          </div>
          <div className="p3-duel-chips">
            <div className="p3-sub">
              {model} · {other.name}: {p[tk].ko.length} pieces
            </div>
            <TokenChips toks={p[tk].ko} />
            <div className="p3-sub" style={{ marginTop: 10 }}>
              {model} · English: {p[tk].en.length} pieces
            </div>
            <TokenChips toks={p[tk].en} />
          </div>
        </>
      )}
      <p className="lab-sum">
        Counted in advance with the real tokenizers (GPT-3 r50k_base, GPT-4 cl100k_base, GPT-4o o200k_base). ×number = how many times English's token count the other language needs. A dashed piece holds only some of one character's bytes.
      </p>
    </div>
  );
}
