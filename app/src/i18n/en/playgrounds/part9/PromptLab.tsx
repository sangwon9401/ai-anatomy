import { useState } from "react";
import { CASES, INGREDIENTS, WHAT_IT_DOES, type Ingredient } from "../../../../data/ch85";
import "../../../../playgrounds/part9/style.css";

export function PromptLab() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Ingredient | null>(null);
  const [solved, setSolved] = useState<boolean[]>(() => CASES.map(() => false));
  const [wrong, setWrong] = useState<Ingredient[]>([]);

  const c = CASES[idx];
  const right = picked === c.right;
  const allDone = solved.every(Boolean);

  const go = (i: number) => {
    setIdx(i);
    setPicked(solved[i] ? CASES[i].right : null);
    setWrong([]);
  };
  const pick = (ing: Ingredient) => {
    setPicked(ing);
    if (ing === c.right) setSolved((s) => s.map((v, i) => (i === idx ? true : v)));
    else setWrong((w) => (w.includes(ing) ? w : [...w, ing]));
  };

  const addBefore = c.right === INGREDIENTS[0]; // the role ingredient
  const fullPrompt = right ? (addBefore ? `${c.add}\n${c.prompt}` : c.right === INGREDIENTS[1] ? c.add : `${c.prompt}\n${c.add}`) : c.prompt;

  return (
    <div>
      <div className="p9-seg" role="group" aria-label="Choose a case">
        {CASES.map((k, i) => (
          <button key={k.goal} aria-pressed={i === idx} onClick={() => go(i)}>
            {solved[i] ? "○ " : ""}
            {i + 1}
          </button>
        ))}
      </div>

      <p className="p9-goal">
        <span className="chip hl-yellow">Goal</span> {c.goal}
      </p>

      <div className="p9-prompt" aria-live="polite">
        <span className="p9-tag">Prompt</span>
        {right ? (
          <p>
            {fullPrompt.split("\n").map((line, i) => (
              <span key={i} className={c.add.split("\n").includes(line) ? "p9-added" : undefined}>
                {line}
                <br />
              </span>
            ))}
          </p>
        ) : (
          <p>{c.prompt}</p>
        )}
      </div>
      <div className={`p9-answer${right ? " good" : ""}`}>
        <span className="p9-tag">AI's answer</span>
        <p>
          {(right ? c.good : c.bad).split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      <p className="muted" style={{ margin: "14px 0 0", fontSize: 15 }}>
        Which ingredient should you add?
      </p>
      <div className="p9-ings" role="group" aria-label="Prompt ingredients">
        {INGREDIENTS.map((ing) => (
          <button key={ing} className="p9-ing" aria-pressed={picked === ing} data-wrong={wrong.includes(ing)} onClick={() => pick(ing)}>
            {ing}
          </button>
        ))}
      </div>

      <p className="lab-tip">
        {picked === null
          ? "See how the answer misses the goal, then pick one ingredient."
          : right
            ? c.why
            : `${WHAT_IT_DOES[picked]} For the goal '${c.goal}', another ingredient fits better.`}
      </p>
      {right && !allDone && (
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={() => go(solved.findIndex((v, i) => !v && i !== idx) >= 0 ? solved.findIndex((v, i) => !v && i !== idx) : (idx + 1) % CASES.length)}>
            Next case
          </button>
        </div>
      )}
      {allDone && <p className="p9-note">You solved all four! Every one of them works by changing the start to change the next-piece odds.</p>}

      <ul className="missions" style={{ marginTop: 12 }}>
        {CASES.map((k, i) => (
          <li key={k.goal} data-done={solved[i]}>
            {solved[i] ? "○" : "□"} {i + 1}. {k.goal}
          </li>
        ))}
      </ul>
      <p className="p9-note">The AI answers are illustrative examples. Real answers differ from model to model, and a little every time.</p>
    </div>
  );
}
