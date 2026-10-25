import { useState } from "react";
import { FRAMES, PROBES } from "../../../../data/ch72";
import "../../../../playgrounds/part8/style.css";

const TIPS: Record<string, string> = {
  plain: "A question on its own looks like part of a question list, so more questions tend to follow.",
  exam: "On a quiz sheet, question 2 comes after question 1. The answers aren't written on the sheet.",
  qa: "The 'Answer:' spot is empty, so an answer is the most plausible next piece.",
  script: "In a script, when the student asks, the next line is the teacher's answer. The shape of the text drew out an answer.",
};

export function DocStarter() {
  const [probe, setProbe] = useState(0);
  const [frame, setFrame] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const p = PROBES[probe];
  const f = FRAMES.find((x) => x.key === frame);
  const out = frame ? p.out[frame] : null;
  const answerKeys = FRAMES.filter((x) => p.out[x.key].isAnswer).map((x) => x.key);
  const done = answerKeys.every((k) => found.includes(k));

  const pick = (key: string) => {
    setFrame(key);
    if (p.out[key].isAnswer && !found.includes(key)) setFound([...found, key]);
  };

  return (
    <div>
      <div className="p8-seg" role="group" aria-label="Choose a question">
        {PROBES.map((x, i) => (
          <button
            key={x.q}
            aria-pressed={probe === i}
            onClick={() => {
              setProbe(i);
              setFrame(null);
            }}
          >
            {x.q}
          </button>
        ))}
      </div>

      <p className="p8-label">How should the text start?</p>
      <div className="p8-grid2" role="group" aria-label="How the text starts">
        {FRAMES.map((x) => (
          <button key={x.key} className="p8-opt" aria-pressed={frame === x.key} onClick={() => pick(x.key)}>
            {x.name}
            {found.includes(x.key) && <span className="p8-sub">Got an answer ○</span>}
          </button>
        ))}
      </div>

      {f && out ? (
        <>
          <div className="p8-doc" aria-live="polite">
            {f.before}
            {p.q}
            {f.after}
            <span key={`${probe}-${frame}`} className="p8-cont">
              {out.text}
            </span>
          </div>
          <p className="p8-doc-cap">The green part is what the base model wrote next.</p>
          <div className="p8-meter">
            <span className="p8-name">Chance the next piece is an answer</span>
            <span className="p8-track">
              <span className="p8-fill" style={{ width: `${out.answer * 100}%`, background: out.isAnswer ? "var(--hl-mint)" : "var(--ink-3)" }} />
            </span>
            <span className="p8-val">{Math.round(out.answer * 100)}%</span>
          </div>
          <p className="lab-tip">{done ? `You found both starts that get an answer! The model didn't change; just changing the shape of the text drew out an answer. ${TIPS[f.key]}` : TIPS[f.key]}</p>
        </>
      ) : (
        <p className="lab-tip">Pick one of the starts above.</p>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={answerKeys.filter((k) => found.includes(k)).length >= 1}>{answerKeys.filter((k) => found.includes(k)).length >= 1 ? "○" : "□"} Find one start that gets an answer</li>
        <li data-done={done}>{done ? "○" : "□"} Find both starts that get an answer</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        The continuations and chances are illustrative examples that imitate how base models often behave.
      </p>
    </div>
  );
}
