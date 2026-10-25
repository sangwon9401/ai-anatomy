import { useState } from "react";
import { LOGITS, OTHERS, REST_N, outputProbs } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";

const START = LOGITS.map((l) => l.s);

/** 第 60 章: scores → probabilities over the whole vocabulary, then draw one. */
export function LogitLab() {
  const [scores, setScores] = useState(START);
  const [whole, setWhole] = useState(true);
  const [drawn, setDrawn] = useState<string | null>(null);
  const [draws, setDraws] = useState(0);
  const [seen, setSeen] = useState({ ninety: false, four: false });
  const out = outputProbs(scores, whole);

  const setScore = (i: number, v: number) => {
    const next = scores.map((x, j) => (j === i ? v : x));
    setScores(next);
    if (outputProbs(next, whole).p[0] > 0.9) setSeen((s) => ({ ...s, ninety: true }));
  };
  const draw = () => {
    let r = Math.random();
    let pick = OTHERS[Math.floor(Math.random() * OTHERS.length)];
    for (let i = 0; i < out.p.length; i++) {
      if (r < out.p[i]) {
        pick = LOGITS[i].w;
        break;
      }
      r -= out.p[i];
    }
    setDrawn(pick);
    setDraws((d) => d + 1);
  };

  let tip = "把“学校”的分数调高，让它的概率超过 90%。";
  if (!whole) tip = "候选只有 4 个时，其余 5 万多个原本分走的那一份就没了，所以分数不变，概率却更大。";
  else if (out.p[0] > 0.9) tip = "分数差得越多，第一名就拿走越多概率。因为 Softmax 会把大的分数放得更大（第 14 章）。";
  else if (draws >= 10) tip = "抽很多次，大多是“学校”，偶尔也会冒出别的词。所以 ChatGPT 的回答每次都会有点不同。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="候选数量">
        <button aria-pressed={whole} onClick={() => setWhole(true)}>
          50,257 个候选（真实）
        </button>
        <button
          aria-pressed={!whole}
          onClick={() => {
            setWhole(false);
            setSeen((s) => ({ ...s, four: true }));
          }}
        >
          只有 4 个候选
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        {LOGITS.map((l, i) => (
          <div className="lab-row" key={l.w}>
            <span className={`chip hl-${l.c}`}>{l.w}</span>
            <input type="range" min={-4} max={9} step={0.1} value={scores[i]} aria-label={`“${l.w}”的分数`} onChange={(e) => setScore(i, Number(e.target.value))} />
            <span className="val">{fmt(scores[i])}</span>
          </div>
        ))}
        {whole && (
          <p className="p6-note" style={{ margin: 0 }}>
            其余 {REST_N.toLocaleString()} 个词元的分数大多固定在约 −9.1 分。
          </p>
        )}
      </div>

      <div className="lab-out">
        <div className="bars">
          {LOGITS.map((l, i) => (
            <div className="bar-row" key={l.w}>
              <span className="label">{l.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.p[i] * 100}%`, background: `var(--hl-${l.c})` }} />
              </span>
              <span className="val">{(out.p[i] * 100).toFixed(1)}%</span>
            </div>
          ))}
          {whole && (
            <div className="bar-row">
              <span className="label">其余</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.restP * 100}%`, background: "var(--ink-3)" }} />
              </span>
              <span className="val">{(out.restP * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="lab-sum num">
          e<sup>分数</sup> 的总和 {out.sum.toFixed(2)}
          {whole ? `（包括其余的 ${out.rest.toFixed(2)}）` : ""} → 概率总和 100%
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          抽一个
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setWhole(true);
            setDrawn(null);
          }}
        >
          恢复初始值
        </button>
      </div>
      <p className="p6-msg" aria-live="polite">
        我今天去<span className="bad">{drawn ?? "___"}</span>
      </p>
      <p className="p6-note">已抽 {draws} 次 · 分数是示意数据。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.ninety}>{seen.ninety ? "✓" : "○"} 让“学校”超过 90%</li>
        <li data-done={seen.four}>{seen.four ? "✓" : "○"} 换成只有 4 个候选</li>
        <li data-done={draws >= 10}>{draws >= 10 ? "✓" : "○"} 抽十次试试</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
