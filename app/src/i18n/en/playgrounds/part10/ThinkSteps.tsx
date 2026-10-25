import { useState } from "react";
import { PROBLEMS } from "../../../../data/ch87";
import "../../../../playgrounds/part10/style.css";

const chars = (s: string) => [...s.replace(/\s/g, "")].length;

export function ThinkSteps() {
  const [pi, setPi] = useState(0);
  const [mine, setMine] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [shown, setShown] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const p = PROBLEMS[pi];
  const done = shown >= p.steps.length;
  const fastChars = chars(`Answer: ${p.fast}`);
  const slowChars = p.steps.reduce((a, s) => a + chars(s), 0) + chars(`Answer: ${p.answer}`);

  const choose = (i: number) => {
    setPi(i);
    setMine(null);
    setFast(false);
    setShown(0);
  };
  const next = () => {
    const n = shown + 1;
    setShown(n);
    if (n >= p.steps.length && !solved.includes(p.key)) setSolved([...solved, p.key]);
  };

  const tip =
    mine === null
      ? "Pick your own answer first. Go with your gut, fast!"
      : !done
        ? shown > 0
          ? "Each time it writes a line, the model rereads the lines it already wrote. Keep pressing."
          : fast
            ? "The instant answer sounded right but failed the check. Now have it work through one line at a time."
            : "Now ask the model both ways."
        : mine === p.answer
          ? `You got it right from the start! Writing the working also shows why it's '${p.answer}'.`
          : `Your first answer was '${mine}'; working it out gave '${p.answer}'. ${mine === p.fast ? "The answer that jumps to mind was the trap!" : "The working shows where the paths split."}`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Choose a problem">
        {PROBLEMS.map((q, i) => (
          <button key={q.key} className="p10-seg" aria-pressed={pi === i} onClick={() => choose(i)}>
            {solved.includes(q.key) ? "✓ " : ""}
            {q.title}
          </button>
        ))}
      </div>
      <p className="p10-q">{p.q}</p>

      <h4 className="p10-h">① Your answer first (fast!)</h4>
      <div className="p10-choices" role="group" aria-label="Your answer">
        {p.choices.map((c) => (
          <button key={c} aria-pressed={mine === c} onClick={() => setMine(c)}>
            {c}
          </button>
        ))}
      </div>

      <h4 className="p10-h">② Ask the model</h4>
      <div className="p10-duo">
        <section className="p10-panel">
          <h5>Answer at once</h5>
          <button className="btn ghost" disabled={mine === null || fast} onClick={() => setFast(true)}>
            "Answer only!"
          </button>
          {fast && (
            <>
              <p className="p10-line">
                <span className="chip hl-pink">Answer: {p.fast}</span>
              </p>
              <p className="p10-line bad">{p.fastCheck}</p>
              <p className="lab-sum">{fastChars} characters written · illustrative example</p>
            </>
          )}
        </section>
        <section className="p10-panel">
          <h5>Work it out first</h5>
          <button className="btn" disabled={mine === null || done} onClick={next}>
            {shown === 0 ? '"Think step by step."' : "Write one more line"}
          </button>
          <ol className="p10-think" aria-live="polite">
            {p.steps.slice(0, shown).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {done && (
            <>
              <p className="p10-line">
                <span className="chip hl-mint">Answer: {p.answer}</span>
              </p>
              <p className="lab-sum">
                {slowChars} characters written · about {Math.round(slowChars / fastChars)}× the instant answer
              </p>
            </>
          )}
        </section>
      </div>
      {done && (
        <p className="lab-sum">
          The more it writes, the more times the model runs (chapter 2). That takes time, but it can split hard math into one line at a time.
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {PROBLEMS.map((q) => (
          <li key={q.key} data-done={solved.includes(q.key)}>
            {solved.includes(q.key) ? "✓" : "○"} Work out '{q.title}' correctly
          </li>
        ))}
      </ul>
      <p className="lab-tip">{solved.length === PROBLEMS.length && done ? "You solved all three! In each one, the answer that jumped to mind was the trap. That's why important problems deserve written working and a check." : tip}</p>
      <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
        The model's instant answers are made up for this example. Real large models sometimes get these famous puzzles right.
      </p>
    </div>
  );
}
