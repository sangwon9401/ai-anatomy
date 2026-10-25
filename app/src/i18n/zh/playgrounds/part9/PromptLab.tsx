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

  const addBefore = c.right === INGREDIENTS[0];
  const fullPrompt = right ? (addBefore ? `${c.add}\n${c.prompt}` : c.right === INGREDIENTS[1] ? c.add : `${c.prompt}\n${c.add}`) : c.prompt;

  return (
    <div>
      <div className="p9-seg" role="group" aria-label="选择处方">
        {CASES.map((k, i) => (
          <button key={k.goal} aria-pressed={i === idx} onClick={() => go(i)}>
            {solved[i] ? "○ " : ""}
            {i + 1}
          </button>
        ))}
      </div>

      <p className="p9-goal">
        <span className="chip hl-yellow">目标</span> {c.goal}
      </p>

      <div className="p9-prompt" aria-live="polite">
        <span className="p9-tag">提示词</span>
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
        <span className="p9-tag">AI 的回答</span>
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
        加上哪个要素呢？
      </p>
      <div className="p9-ings" role="group" aria-label="提示词要素">
        {INGREDIENTS.map((ing) => (
          <button key={ing} className="p9-ing" aria-pressed={picked === ing} data-wrong={wrong.includes(ing)} onClick={() => pick(ing)}>
            {ing}
          </button>
        ))}
      </div>

      <p className="lab-tip">
        {picked === null
          ? "看看回答和目标差在哪里，再挑一个要素。"
          : right
            ? c.why
            : `${WHAT_IT_DOES[picked]}目标是“${c.goal}”的话，别的要素更合适。`}
      </p>
      {right && !allDone && (
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={() => go(solved.findIndex((v, i) => !v && i !== idx) >= 0 ? solved.findIndex((v, i) => !v && i !== idx) : (idx + 1) % CASES.length)}>
            下一个处方
          </button>
        </div>
      )}
      {allDone && <p className="p9-note">四个处方全部完成！说到底，四招都是“改变开头，从而改变下一个片段的概率”。</p>}

      <ul className="missions" style={{ marginTop: 12 }}>
        {CASES.map((k, i) => (
          <li key={k.goal} data-done={solved[i]}>
            {solved[i] ? "○" : "□"} {i + 1}. {k.goal}
          </li>
        ))}
      </ul>
      <p className="p9-note">AI 的回答是示意例子。真实的回答因模型而异，每次也会略有不同。</p>
    </div>
  );
}
