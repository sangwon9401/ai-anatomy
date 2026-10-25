import { useState } from "react";
import { MAX_PIECES, PRESETS64, pieces, questions } from "../../data/ch64";
import "./style.css";

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

  let tip = "가린 칸(?)의 정답을 먼저 머릿속으로 맞혀 보고 눌러 보세요.";
  if (ps.length < 2) tip = "조각이 2개 이상 있어야 문제가 생겨요. 띄어쓰기로 조각을 나눠요.";
  else if (nShown === qs.length) tip = `조각 ${ps.length}개 → 문제 ${qs.length}개. 정답은 모두 문장 안에 있었죠? 사람이 채점할 필요가 없어요.`;
  else if (nShown > 0) tip = `${nShown} / ${qs.length}문제 확인. 정답은 늘 바로 다음 조각이에요.`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="문장 고르기">
        {PRESETS64.map((p) => (
          <button key={p} aria-pressed={p === text} onClick={() => load(p)} style={p === text ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {p}
          </button>
        ))}
      </div>
      <label className="code-label" htmlFor="p7-q-input">
        직접 써 보기 (띄어쓰기로 조각을 나눠요)
      </label>
      <input id="p7-q-input" className="code-input" value={text} maxLength={60} onChange={(e) => load(e.target.value)} />

      <div className="p7-pieces" aria-label="조각">
        {ps.map((p, i) => (
          <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
            {p}
          </span>
        ))}
      </div>
      {all.length > MAX_PIECES && <p className="p7-note">앞의 {MAX_PIECES}조각만 문제로 만들었어요.</p>}

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
                <button className="p7-q-slot" onClick={() => reveal(i)} aria-label={`${i + 1}번 문제 정답 보기`}>
                  ?
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="lab-sum num">
        조각 {ps.length}개 → 문제 {qs.length}개
      </p>
      <div className="lab-actions">
        <button className="btn ghost" disabled={qs.length === 0} onClick={() => setShown(qs.map(() => true))}>
          정답 모두 보기
        </button>
        <button className="btn ghost" onClick={() => setShown([])}>
          다시 가리기
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
