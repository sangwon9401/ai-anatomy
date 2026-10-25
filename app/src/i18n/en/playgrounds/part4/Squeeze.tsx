// en: overlay of src/playgrounds/part4/Squeeze.tsx (strings; the start selection names the English phrases)
import { useState } from "react";
import { KEEP_MIN, NOTE_SLOTS, PHRASES, squeeze } from "../../../../data/ch42";
import "../../../../playgrounds/part4/style.css";

const START = PHRASES.map((p) => p.ko === "my friend and I" || p.ko === "our homework" || !!p.fixed);
const MAX_WORDS = PHRASES.reduce((a, p) => a + p.ko.split(" ").length, 0);
// en: the longest sentence that loses nothing (8 words with the English phrases; the Korean original hard-codes 6)
const BEST_LOSSLESS = Math.max(
  ...Array.from({ length: 2 ** PHRASES.length }, (_, m) => PHRASES.map((p, i) => !!p.fixed || ((m >> i) & 1) === 1))
    .map((o) => squeeze(o))
    .filter((r) => r.lost.length === 0)
    .map((r) => r.words),
);

export function Squeeze() {
  const [on, setOn] = useState<boolean[]>(START);
  const [attn, setAttn] = useState(false);
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const r = squeeze(on, attn);

  const apply = (nextOn: boolean[], nextAttn: boolean) => {
    setOn(nextOn);
    setAttn(nextAttn);
    const q = squeeze(nextOn, nextAttn);
    const all = nextOn.every(Boolean);
    const plain = squeeze(nextOn, false);
    const now = [!nextAttn && plain.lost.length === 0 && plain.words === BEST_LOSSLESS, all && !nextAttn, all && nextAttn && q.lost.length === 0];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  const missions = ["Make the longest sentence that loses nothing (how many words can it be?)", "Put everything in and see what drops out of the translation", "Turn on attention and put everything in (a preview of ch. 43)"];
  const tip = attn
    ? "The decoder looks back at the original every time it writes, so nothing has to fit in one note. That's chapter 43's attention."
    : r.lost.length === 0
      ? `${r.words} words all fit in one note. Try making it a bit longer.`
      : `Squeezing ${r.words} words into a ${NOTE_SLOTS}-number note, the traces of '${r.lost.join("', '")}' near the start got too faint and dropped out of the translation.`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="Choose the parts to include" style={{ display: "flex" }}>
        {PHRASES.map((p, i) => (
          <button
            key={p.ko}
            aria-pressed={on[i]}
            disabled={p.fixed}
            onClick={() => {
              const next = on.map((x, j) => (j === i ? !x : x));
              apply(next, attn);
            }}
          >
            {p.ko}
          </button>
        ))}
      </div>

      <div className="p4-sentence" style={{ marginTop: 12 }} aria-label="Original sentence">
        {PHRASES.map((p, i) =>
          on[i] ? (
            <span key={p.ko} className="chip hl-violet">
              {p.ko}
            </span>
          ) : null,
        )}
      </div>
      <p className="p4-note" style={{ marginTop: 4 }}>
        {r.words} of {MAX_WORDS} words go into one summary note ({NOTE_SLOTS} numbers).
      </p>

      <div className="p4-box">
        <h4>Traces left on the summary note (below the line, they drop out)</h4>
        <div className="bars">
          {r.traces.map((t) => (
            <div className="bar-row" key={t.p.ko} style={{ gridTemplateColumns: "6.4em minmax(0, 1fr) 3.4em" }}>
              <span className="label" style={{ color: t.kept ? undefined : "var(--pen)" }}>
                {t.p.ko}
              </span>
              <span className="track p4-thresh" style={{ ["--t" as string]: `${KEEP_MIN * 100}%` }}>
                <span className="fill" style={{ display: "block", width: `${t.s * 100}%`, background: attn ? "var(--hl-mint)" : t.kept ? "var(--hl-yellow)" : "var(--hl-pink)" }} />
              </span>
              <span className="val">{t.s.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <h4 className="p4-h4">The decoder's Spanish translation</h4>
        <div className="p4-sentence" aria-live="polite">
          {r.out.map((w, i) => (
            <span key={i} className={`chip ${w === "???" ? "p4-lost" : "hl-orange"}`}>
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className={attn ? "btn" : "btn ghost"} aria-pressed={attn} onClick={() => apply(on, !attn)}>
          {attn ? "Turn attention off" : "Turn attention on (ch. 43 preview)"}
        </button>
        <button className="btn ghost" onClick={() => apply(PHRASES.map(() => true), attn)}>
          Put everything in
        </button>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m, i) => (
          <li key={m} data-done={seen[i]}>
            {seen[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* An illustrative toy model. A trace fades to 0.8× for every word read after it (ch. 41), and we decided that anything fainter than {KEEP_MIN} drops out of the translation.</p>
    </div>
  );
}
