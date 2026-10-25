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

  let tip = "隠れたマス（?）の答えを、まず頭の中で当ててから押してみましょう。";
  if (ps.length < 2) tip = "かけらが2つ以上ないと問題になりません。スペースでかけらを区切ります。";
  else if (nShown === qs.length) tip = `かけら${ps.length}個 → 問題${qs.length}問。答えは全部、文の中にありましたね？ 人が採点する必要はありません。`;
  else if (nShown > 0) tip = `${nShown} / ${qs.length}問を確認。答えはいつも、すぐ次のかけらです。`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="文を選ぶ">
        {PRESETS64.map((p) => (
          <button key={p} aria-pressed={p === text} onClick={() => load(p)} style={p === text ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {p}
          </button>
        ))}
      </div>
      <label className="code-label" htmlFor="p7-q-input">
        自分で書いてみる（スペースでかけらを区切ります）
      </label>
      <input id="p7-q-input" className="code-input" value={text} maxLength={60} onChange={(e) => load(e.target.value)} />

      <div className="p7-pieces" aria-label="かけら">
        {ps.map((p, i) => (
          <span key={i} className={`chip hl-${COLORS[i % COLORS.length]}`}>
            {p}
          </span>
        ))}
      </div>
      {all.length > MAX_PIECES && <p className="p7-note">最初の{MAX_PIECES}個のかけらだけを問題にしました。</p>}

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
                <button className="p7-q-slot" onClick={() => reveal(i)} aria-label={`${i + 1}問めの答えを見る`}>
                  ?
                </button>
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="lab-sum num">
        かけら{ps.length}個 → 問題{qs.length}問
      </p>
      <div className="lab-actions">
        <button className="btn ghost" disabled={qs.length === 0} onClick={() => setShown(qs.map(() => true))}>
          答えを全部見る
        </button>
        <button className="btn ghost" onClick={() => setShown([])}>
          もう一度隠す
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
