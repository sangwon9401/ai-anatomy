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

  let tip = "先在心里猜一猜被遮住的格子（?）的答案，再点开看。";
  if (ps.length < 2) tip = "至少要有 2 个片段才能出题。用空格把片段分开。";
  else if (nShown === qs.length) tip = `${ps.length} 个片段 → ${qs.length} 道题。答案全都在句子里吧？不需要人来批改。`;
  else if (nShown > 0) tip = `已看 ${nShown} / ${qs.length} 道题。答案总是紧跟着的下一个片段。`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选一个句子">
        {PRESETS64.map((p) => (
          <button key={p} aria-pressed={p === text} onClick={() => load(p)} style={p === text ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {p}
          </button>
        ))}
      </div>
      <label className="code-label" htmlFor="p7-q-input">
        自己写一句（用空格分开片段）
      </label>
      <input id="p7-q-input" className="code-input" value={text} maxLength={60} onChange={(e) => load(e.target.value)} />

      <div className="p7-pieces" aria-label="片段">
        {ps.map((p, i) => (
          <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
            {p}
          </span>
        ))}
      </div>
      {all.length > MAX_PIECES && <p className="p7-note">只用了前 {MAX_PIECES} 个片段来出题。</p>}

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
                <button className="p7-q-slot" onClick={() => reveal(i)} aria-label={`看第 ${i + 1} 题的答案`}>
                  ?
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="lab-sum num">
        {ps.length} 个片段 → {qs.length} 道题
      </p>
      <div className="lab-actions">
        <button className="btn ghost" disabled={qs.length === 0} onClick={() => setShown(qs.map(() => true))}>
          显示全部答案
        </button>
        <button className="btn ghost" onClick={() => setShown([])}>
          重新遮住
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
