import { useState } from "react";
import { MAX_PIECES, PRESETS64, pieces, questions } from "../../../../data/ch64";
import "../../../../playgrounds/part7/style.css";

const COLORS = ["yellow", "mint", "sky", "orange", "violet", "pink"];

export function QuestionFactory() {
  const [text, setText] = useState(PRESETS64[0]);
  const [shown, setShown] = useState<boolean[]>([]);
  const all = pieces(text);
  const ps = all.slice(0, MAX_PIECES);
  const qs = questions(ps);
  const nShown = qs.filter((_, i) => shown[i]).length;

  const load = (t: string) => {
    setText(t);
    setShown([]);
  };
  const reveal = (i: number) =>
    setShown((s) => {
      const next = [...s];
      next[i] = true;
      return next;
    });

  let tip = "Guess the hidden piece (?) in your head first, then tap it.";
  if (ps.length < 2) tip = "You need at least 2 pieces to get a question. Spaces split the pieces.";
  else if (nShown === qs.length) tip = `${ps.length} pieces → ${qs.length} questions. Every answer was right there in the sentence, so no person has to grade them.`;
  else if (nShown > 0) tip = `${nShown} of ${qs.length} questions checked. The answer is always the very next piece.`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Choose a sentence">
        {PRESETS64.map((p) => (
          <button key={p} aria-pressed={p === text} onClick={() => load(p)} style={p === text ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {p}
          </button>
        ))}
      </div>
      <label className="code-label" htmlFor="p7-q-input">
        Write your own (spaces split the pieces)
      </label>
      <input id="p7-q-input" className="code-input" value={text} maxLength={60} onChange={(e) => load(e.target.value)} />

      <div className="p7-pieces" aria-label="Pieces">
        {ps.map((p, i) => (
          <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
            {p}
          </span>
        ))}
      </div>
      {all.length > MAX_PIECES && <p className="p7-note">Only the first {MAX_PIECES} pieces were turned into questions.</p>}

      <ol className="p7-qs">
        {qs.map((q, i) => (
          <li key={i} className="p7-q">
            <span className="p7-q-n">{i + 1}</span>
            <span className="p7-q-ctx">
              {q.context.map((c, j) => (
                <span key={j} className={`chip hl-${COLORS[j % COLORS.length]}`}>
                  {c}
                </span>
              ))}
              {shown[i] ? (
                <span className={`chip hl-${COLORS[(i + 1) % COLORS.length]} p7-q-ans`}>{q.answer}</span>
              ) : (
                <button className="p7-q-slot" onClick={() => reveal(i)} aria-label={`Show the answer to question ${i + 1}`}>
                  ?
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="lab-sum num">
        {ps.length} pieces → {qs.length} questions
      </p>
      <div className="lab-actions">
        <button className="btn ghost" disabled={qs.length === 0} onClick={() => setShown(qs.map(() => true))}>
          Show all answers
        </button>
        <button className="btn ghost" onClick={() => setShown([])}>
          Hide them again
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
