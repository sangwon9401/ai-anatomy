import { useState } from "react";
import { CASES, INGREDIENTS, WHAT_IT_DOES, type Ingredient } from "../../data/ch85";
import "./style.css";

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

  const addBefore = c.right === "역할";
  const fullPrompt = right ? (addBefore ? `${c.add}\n${c.prompt}` : c.right === "예시" ? c.add : `${c.prompt}\n${c.add}`) : c.prompt;

  return (
    <div>
      <div className="p9-seg" role="group" aria-label="처방 고르기">
        {CASES.map((k, i) => (
          <button key={k.goal} aria-pressed={i === idx} onClick={() => go(i)}>
            {solved[i] ? "○ " : ""}
            {i + 1}
          </button>
        ))}
      </div>

      <p className="p9-goal">
        <span className="chip hl-yellow">목표</span> {c.goal}
      </p>

      <div className="p9-prompt" aria-live="polite">
        <span className="p9-tag">프롬프트</span>
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
        <span className="p9-tag">AI의 답</span>
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
        어떤 재료를 넣을까요?
      </p>
      <div className="p9-ings" role="group" aria-label="프롬프트 재료">
        {INGREDIENTS.map((ing) => (
          <button key={ing} className="p9-ing" aria-pressed={picked === ing} data-wrong={wrong.includes(ing)} onClick={() => pick(ing)}>
            {ing}
          </button>
        ))}
      </div>

      <p className="lab-tip">
        {picked === null
          ? "답이 목표와 어떻게 다른지 보고, 재료를 하나 골라 보세요."
          : right
            ? c.why
            : `${WHAT_IT_DOES[picked]} 목표가 '${c.goal}'이라면 다른 재료가 더 알맞아요.`}
      </p>
      {right && !allDone && (
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button className="btn ghost" onClick={() => go(solved.findIndex((v, i) => !v && i !== idx) >= 0 ? solved.findIndex((v, i) => !v && i !== idx) : (idx + 1) % CASES.length)}>
            다음 처방
          </button>
        </div>
      )}
      {allDone && <p className="p9-note">네 처방을 모두 풀었어요! 넷 다 결국 '앞부분을 바꿔서 다음 조각 확률을 바꾸는' 방법이에요.</p>}

      <ul className="missions" style={{ marginTop: 12 }}>
        {CASES.map((k, i) => (
          <li key={k.goal} data-done={solved[i]}>
            {solved[i] ? "○" : "□"} {i + 1}. {k.goal}
          </li>
        ))}
      </ul>
      <p className="p9-note">AI의 답은 설명용 예시예요. 실제 답은 모델마다, 그리고 매번 조금씩 달라요.</p>
    </div>
  );
}
