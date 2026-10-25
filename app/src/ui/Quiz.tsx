import { useEffect, useState } from "react";
import type { QuizItem } from "../data/types";
import { T } from "./strings";

const MARKS = ["①", "②", "③", "④"];

// Korean grading: a red ○ on the question number when right, a red slash when wrong.
const Grade = ({ right }: { right: boolean }) => (
  <svg viewBox="0 0 46 46" aria-hidden="true" className="grade">
    {right ? (
      <path d="M 10 14 C 16 2, 40 4, 41 22 C 42 38, 18 44, 8 32 C 2 24, 8 10, 24 7" pathLength={1} />
    ) : (
      <path d="M 8 40 L 40 4" pathLength={1} />
    )}
  </svg>
);

export function Quiz({ items, onReview, onComplete }: { items: QuizItem[]; onReview: (target: string) => void; onComplete?: () => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => items.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const right = picked.filter((p, i) => p === items[i].answer).length;
  const finished = answered === items.length;
  useEffect(() => {
    if (finished) onComplete?.();
  }, [finished, onComplete]);

  return (
    <div className="quiz">
      {items.map((it, qi) => {
        const p = picked[qi];
        const done = p !== null;
        const ok = p === it.answer;
        return (
          <div className="q-item" key={qi}>
            <h3>
              <span className="qn">
                {qi + 1}
                {done && <Grade right={ok} />}
              </span>
              <span>{it.q}</span>
            </h3>
            <div className="q-choices">
              {it.choices.map((c, ci) => (
                <button
                  key={ci}
                  className="q-choice"
                  disabled={done}
                  data-state={done ? (ci === it.answer ? "right" : ci === p ? "wrong" : undefined) : undefined}
                  onClick={() => setPicked((prev) => prev.map((v, i) => (i === qi ? ci : v)))}
                >
                  <span className="mark">{MARKS[ci]}</span>
                  {c}
                </button>
              ))}
            </div>
            {done && (
              <div className="q-feedback">
                <span className="verdict">{ok ? T.right : T.answerIs(MARKS[it.answer])}</span>
                <p>{it.explain}</p>
                <button className="btn ghost" onClick={() => onReview(it.review)}>
                  {it.review === "playground" ? T.toPlayground : T.reviewScene}
                </button>
                {!ok && (
                  <button className="btn ghost" onClick={() => setPicked((prev) => prev.map((v, i) => (i === qi ? null : v)))}>
                    {T.retry}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {answered === items.length && (
        <p className="q-score">
          {T.score(right, items.length)}
        </p>
      )}
    </div>
  );
}
