// en: overlay of src/playgrounds/part4/NgramWriter.tsx (strings; mission 2 is a cat doing a person's activity
// instead of the Korean tense mismatch)
import { useState } from "react";
import { CORPUS, END, START, TOKENS, followers } from "../../../../data/ch38";
import "../../../../playgrounds/part4/style.css";

type Mode = 2 | 3;
type Made = { s: string; mode: Mode; novel: boolean };
const MAX_TOKENS = 16;

const contextOf = (toks: string[], mode: Mode) => (mode === 2 || toks.length < 2 ? toks.slice(-1) : toks.slice(-2));

function sampleNext(toks: string[], mode: Mode) {
  const opts = followers(contextOf(toks, mode));
  let r = Math.random();
  for (const o of opts) {
    r -= o.p;
    if (r <= 0) return o.w;
  }
  return opts[opts.length - 1].w;
}

// en: mission 2 looks for a cat doing something only people do
const ODD_CAT = (s: string) => /\bcat\b/.test(s) && /\b(homework|soccer|games|books|pizza|lunch|songs)\b/.test(s);

const hasSeq = (t: string[], seq: string[]) => t.some((_, i) => i + seq.length <= t.length && seq.every((w, k) => t[i + k] === w));

export function NgramWriter() {
  const [mode, setMode] = useState<Mode>(2);
  const [toks, setToks] = useState<string[]>([START]);
  const [made, setMade] = useState<Made[]>([]);
  const done = toks[toks.length - 1] === END;
  const ctx = contextOf(toks, mode);
  const opts = done ? [] : followers(ctx);
  const sentence = toks.slice(1, done ? -1 : undefined).join(" ");
  const corpusIdx = done ? CORPUS.indexOf(sentence) : -1;

  const finish = (t: string[]) => {
    setToks(t);
    if (t[t.length - 1] === END) {
      const s = t.slice(1, -1).join(" ");
      setMade((m) => [...m, { s, mode, novel: !CORPUS.includes(s) }]);
    }
  };
  const push = (w: string) => finish([...toks, w]);
  const auto = () => {
    const t = [...toks];
    while (t[t.length - 1] !== END && t.length < MAX_TOKENS) t.push(sampleNext(t, mode));
    finish(t);
  };
  const switchMode = (m: Mode) => {
    setMode(m);
    setToks([START]);
  };

  const novel2 = new Set(made.filter((m) => m.mode === 2 && m.novel).map((m) => m.s)).size;
  const made3 = made.filter((m) => m.mode === 3);
  const missions = [
    { label: `Make 3 new sentences that aren't in the corpus (now ${Math.min(novel2, 3)})`, done: novel2 >= 3 },
    { label: "Make an odd sentence where a cat does something only people do", done: made.some((m) => ODD_CAT(m.s)) },
    { label: "Switch to '2 words back' and write 3 sentences", done: made3.length >= 3 },
  ];

  let tip: string;
  if (!done && toks.length === 1) tip = mode === 2 ? "This table counts which words came right after ‹start›, and how often. Pick one." : "Now it counts using the last 2 words. See how much the list of candidates shrinks.";
  else if (!done) tip = `Right now it only counts the words that came right after '${ctx.join(" ")}'. It doesn't look any further back.`;
  else if (mode === 3 && corpusIdx >= 0) tip = "Looking 2 words back, it copied a corpus sentence exactly. The corpus is so small that a 2-word string is almost always followed by just one word.";
  else if (corpusIdx >= 0) tip = "It rewrote a sentence from the corpus exactly. Try another one.";
  else if (ODD_CAT(sentence)) tip = "A cat doing that? Looking only one word back, it forgot that the sentence was about a cat.";
  else tip = "A new sentence that isn't in the corpus! Every pair was seen in the corpus, but chained together they make something new.";

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="How many words back to look">
        <button aria-pressed={mode === 2} onClick={() => switchMode(2)}>
          1 word back (2-gram)
        </button>
        <button aria-pressed={mode === 3} onClick={() => switchMode(3)}>
          2 words back (3-gram)
        </button>
      </div>

      <div className="p4-sentence" style={{ marginTop: 14 }} aria-live="polite" aria-label="Your sentence">
        {toks.map((w, i) => (
          <span key={i} className={`chip ${w === START ? "p4-start" : w === END ? "p4-end" : !done && i >= toks.length - ctx.length ? "hl-sky" : "hl-mint"}`}>
            {w}
          </span>
        ))}
        {!done && <span className="p4-blank">?</span>}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="Next-word candidates">
          {opts.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => push(o.w)} aria-label={`${o.w}, ${o.c} times, ${Math.round(o.p * 100)}%`}>
              <span>
                {o.w}
                <span className="count">{o.c}×</span>
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${o.p * 100}%`, background: o.w === END ? "var(--ink-2)" : "var(--hl-yellow)" }} />
              </span>
              <span className="val">{Math.round(o.p * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {done && <p className="p4-verdict">{corpusIdx >= 0 ? `Exactly corpus sentence no. ${corpusIdx + 1}.` : "A new sentence, not in the corpus!"}</p>}

      <div className="lab-actions">
        {!done && (
          <>
            <button className="btn" onClick={() => push(sampleNext(toks, mode))}>
              Draw by chance
            </button>
            <button className="btn ghost" onClick={auto}>
              Finish automatically
            </button>
          </>
        )}
        <button className={done ? "btn" : "btn ghost"} onClick={() => setToks([START])}>
          {done ? "Write a new sentence" : "Start over"}
        </button>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m) => (
          <li key={m.label} data-done={m.done}>
            {m.done ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>

      {made.length > 0 && (
        <div className="p4-records">
          <h4>Your sentences (last 5)</h4>
          <ol>
            {made
              .slice(-5)
              .reverse()
              .map((m, i) => (
                <li key={made.length - i}>
                  <span className="n">{made.length - i}</span>
                  <span>{m.s}</span>
                  <span className="v">
                    {m.novel ? "new" : "from corpus"} · {m.mode}-gram
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>

      <details className="p4-corpus">
        <summary>See the 24-sentence corpus (where it's counting now is marked)</summary>
        <ol>
          {CORPUS.map((s, i) => (
            <li key={s} data-hit={!done && hasSeq(TOKENS[i], ctx)}>
              {s}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
