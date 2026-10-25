import { useState } from "react";
import { DOCS, QUESTIONS, scoreDoc } from "../../../../data/ch88";
import "../../../../playgrounds/part10/style.css";

type Result = { kind: "answer" | "trap" | "none" | "madeup"; text: string; source?: string };
const MAX_PICK = 2;
const title = (id: string) => DOCS.find((d) => d.id === id)?.title ?? "";

export function RagLab() {
  const [qi, setQi] = useState(0);
  const [searched, setSearched] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [done, setDone] = useState({ cited: false, trap: false, unknown: false });
  const q = QUESTIONS[qi];

  const ranked = DOCS.map((d, i) => ({ d, i, hits: scoreDoc(q, d) })).sort((a, b) => b.hits.length - a.hits.length || a.i - b.i);

  const chooseQ = (i: number) => {
    setQi(i);
    setSearched(false);
    setPicked([]);
    setResult(null);
  };
  const search = () => {
    setSearched(true);
    const top = ranked[0];
    setPicked(top.hits.length > 0 ? [top.d.id] : []);
    setResult(null);
  };
  const toggle = (id: string) => {
    setResult(null);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_PICK ? [...p, id] : p));
  };
  const answer = () => {
    let r: Result;
    if (q.answer && picked.includes(q.answer.doc)) r = { kind: "answer", text: q.answer.text, source: title(q.answer.doc) };
    else if (q.trap && picked.includes(q.trap.doc)) r = { kind: "trap", text: q.trap.text, source: title(q.trap.doc) };
    else r = { kind: "none", text: "I can't find the answer in the documents I was given." };
    setResult(r);
    if (r.kind === "answer") setDone((d) => ({ ...d, cited: true }));
    if (r.kind === "trap") setDone((d) => ({ ...d, trap: true }));
    if (r.kind === "none" && !q.answer) setDone((d) => ({ ...d, unknown: true }));
  };
  const noDocs = () => setResult({ kind: "madeup", text: q.madeUp });

  const tip = !result
    ? !searched
      ? "Search the documents first. Documents that share more search words rise to the top."
      : picked.length === 0
        ? "Choose documents to put in (up to 2). You can also let it answer with none."
        : "Check the prompt, then press 'Answer'."
    : result.kind === "answer"
      ? "An answer with a source! Make it a habit to open the source and check that it really says that."
      : result.kind === "trap"
        ? "It answered from last year's document! The model trusts whatever documents you give it. Check the year of the source."
        : result.kind === "none"
          ? q.answer
            ? "The right document is missing. Look at the search ranking and put in a different one."
            : "If it's not in the documents, 'I don't know' is the honest answer. The school documents say nothing about a class trip."
          : "It made up something plausible with no source (hallucination, chapter 84). There's no way to check it.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Choose a question">
        {QUESTIONS.map((x, i) => (
          <button key={x.key} className="p10-seg" aria-pressed={qi === i} onClick={() => chooseQ(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        Search words: {q.keys.map((k) => `'${k}'`).join(", ")}
      </p>
      <div className="lab-actions" style={{ marginTop: 6 }}>
        <button className="btn" onClick={search}>
          ① Search the documents
        </button>
      </div>

      {searched && (
        <>
          <h4 className="p10-h">Search results · tap to put in the prompt (up to {MAX_PICK})</h4>
          <div className="p10-docs">
            {ranked.map(({ d, hits }) => (
              <button key={d.id} className="p10-doc" aria-pressed={picked.includes(d.id)} disabled={!picked.includes(d.id) && picked.length >= MAX_PICK} onClick={() => toggle(d.id)}>
                <span className="p10-doc-head">
                  <span className={`chip hl-${d.c}`}>{d.title}</span>
                  <span className="p10-score">{hits.length} pts</span>
                </span>
                <span className="p10-doc-text">{d.text}</span>
                {hits.length > 0 && <span className="p10-hits">Matching words: {hits.join(", ")}</span>}
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            Here the score is just how many search words match. Real search turns the question and documents into vectors and finds the closest ones (chapter 8).
          </p>

          <h4 className="p10-h">Text going into the model (the prompt)</h4>
          <div className="p10-prompt">
            {picked.map((id) => (
              <p key={id}>
                <b>[Document: {title(id)}]</b> {DOCS.find((d) => d.id === id)?.text}
              </p>
            ))}
            {picked.length === 0 && <p className="muted">(no documents)</p>}
            <p>Answer using only the documents above. If the answer isn't there, say you don't know.</p>
            <p>
              <b>Question:</b> {q.q}
            </p>
          </div>
        </>
      )}

      <div className="lab-actions">
        <button className="btn" disabled={!searched} onClick={answer}>
          ② Answer
        </button>
        <button className="btn ghost" onClick={noDocs}>
          Ask with no documents
        </button>
      </div>

      {result && (
        <div className="p10-answer" data-kind={result.kind} aria-live="polite">
          <p className="p10-answer-text">{result.text}</p>
          {result.source && <span className="p10-source">Source: {result.source}</span>}
          {result.kind === "madeup" && <span className="p10-source bad">No source · illustrative example</span>}
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.cited}>{done.cited ? "✓" : "○"} Get an answer with a source</li>
        <li data-done={done.trap}>{done.trap ? "✓" : "○"} Find the trap: last year's document</li>
        <li data-done={done.unknown}>{done.unknown ? "✓" : "○"} Get an 'I don't know' for a question the documents can't answer</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
