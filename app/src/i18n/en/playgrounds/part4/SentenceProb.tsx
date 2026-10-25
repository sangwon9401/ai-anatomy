// en: overlay of src/playgrounds/part4/SentenceProb.tsx (strings, the best sentence, and English number words)
import { useState } from "react";
import { LM_COLORS, fmtPct, nextProbs, sentenceProb } from "../../../../data/ch37";
import "../../../../playgrounds/part4/style.css";

const LEN = 4;
const BEST = "I walk to school";

/** "about 1 in 385" style count, with million/billion for big numbers. */
function oneIn(p: number) {
  const n = Math.round(1 / p);
  if (n < 1_000_000) return `about 1 in ${n.toLocaleString("en-US")}`;
  if (n < 1_000_000_000) return `about 1 in ${Math.round(n / 1_000_000).toLocaleString("en-US")} million`;
  return `about 1 in ${Math.round(n / 1_000_000_000).toLocaleString("en-US")} billion`;
}

type Rec = { s: string; p: number };

export function SentenceProb() {
  const [words, setWords] = useState<string[]>([]);
  const [records, setRecords] = useState<Rec[]>([]);
  const done = words.length === LEN;
  const { options, rest } = nextProbs(words);
  const { p, factors } = sentenceProb(words);
  const text = words.join(" ");

  const add = (w: string) => {
    const next = [...words, w];
    setWords(next);
    if (next.length === LEN) {
      const s = next.join(" ");
      const pr = sentenceProb(next).p;
      setRecords((r) => (r.some((x) => x.s === s) ? r : [...r, { s, p: pr }].sort((a, b) => b.p - a.p)));
    }
  };

  const missions = [
    { label: "Find the sentence with the highest probability", done: records.some((r) => r.s === BEST) },
    { label: "Using the same words in another order, find one more sentence above 0.1%", done: records.some((r) => r.s !== BEST && r.p >= 0.001) },
    { label: "See the probability of a sentence with 'pizza'", done: records.some((r) => r.s.includes("pizza")) },
  ];

  let tip: string;
  if (!done && words.length === 0) tip = "Start with the first word. The longer the bar, the more likely that word fits there.";
  else if (!done) tip = `You're at '${words[words.length - 1]}'. The next word's chances depend on all ${words.length} word${words.length > 1 ? "s" : ""} so far.`;
  else if (text === BEST) tip = "That's the winner! Every word has a high chance, so the product is the biggest.";
  else if (text.includes("pizza")) tip = "With 'pizza' in it, the probability dropped sharply. One odd word makes the whole product small.";
  else if (p >= 0.001) tip = "English word order is strict, but this poetic order still works. It scores a bit lower than the winner.";
  else if (p < 0.00001) tip = "An awkward order gives each word a low chance, and multiplying makes it tiny.";
  else tip = "It could be said, but it's not a common order, so the probability is low.";

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="Your sentence">
        {words.map((w) => (
          <span key={w} className={`chip hl-${LM_COLORS[w]}`}>
            {w}
          </span>
        ))}
        {Array.from({ length: LEN - words.length }, (_, i) => (
          <span key={i} className="p4-blank">
            {i === 0 ? "?" : ""}
          </span>
        ))}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="Next-word candidates">
          {options.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => add(o.w)} aria-label={`${o.w}, ${fmtPct(o.p)}`}>
              <span>{o.w}</span>
              <span className="track">
                <span className="fill" style={{ width: `${Math.max(o.p * 100, 1)}%`, background: `var(--hl-${LM_COLORS[o.w]})` }} />
              </span>
              <span className="val">{fmtPct(o.p)}</span>
            </button>
          ))}
          <div className="p4-opt p4-rest" aria-label={`All other words, ${fmtPct(rest)}`}>
            <span>other words</span>
            <span className="track">
              <span className="fill" style={{ width: `${rest * 100}%`, background: "var(--line)" }} />
            </span>
            <span className="val">{fmtPct(rest)}</span>
          </div>
        </div>
      )}

      <p className="p4-product" aria-live="polite">
        {words.length === 0 ? (
          "sentence probability = (the chances of the words you pick, multiplied in order)"
        ) : (
          <>
            {factors.map((f, i) => (
              <span key={i}>
                {i > 0 && <span className="p4-x">×</span>}
                {fmtPct(f)}
              </span>
            ))}
            <span className="p4-x">=</span>
            <b>{fmtPct(p)}</b>
          </>
        )}
      </p>
      {done && (
        <p className="p4-result">
          The probability of '{text}' is <b>{fmtPct(p)}</b>: {oneIn(p)} four-word sentences.
        </p>
      )}

      <div className="lab-actions">
        {done ? (
          <button className="btn" onClick={() => setWords([])}>
            New sentence
          </button>
        ) : (
          <button className="btn ghost" disabled={words.length === 0} onClick={() => setWords(words.slice(0, -1))}>
            Remove a word
          </button>
        )}
        {records.length > 0 && (
          <button
            className="btn ghost"
            onClick={() => {
              setWords([]);
              setRecords([]);
            }}
          >
            Clear the list
          </button>
        )}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m) => (
          <li key={m.label} data-done={m.done}>
            {m.done ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>

      {records.length > 0 && (
        <div className="p4-records">
          <h4>My sentences (highest first)</h4>
          <ol>
            {records.slice(0, 6).map((r, i) => (
              <li key={r.s} data-now={done && r.s === text}>
                <span className="n">{i + 1}</span>
                <span>{r.s}</span>
                <span className="v">{fmtPct(r.p)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* The probabilities are an illustrative example. A real language model scores tens of thousands of candidate words.</p>
    </div>
  );
}
