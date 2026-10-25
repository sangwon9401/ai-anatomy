// ja overlay of src/playgrounds/part5/PaintLab.tsx (strings only)
import { useState } from "react";
import { FOCUS, PAINT, SCORE, SQRT_D, V, WORDS, fmt, fmtVec, mixRow, paintMix, pct, softmax } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

const SIZE = 300;
const OX = 40;
const OY = 250;
const U = 72;
const at = (v: readonly number[]): [number, number] => [OX + v[0] * U, OY - v[1] * U];
const START = SCORE[FOCUS];
const near = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.25;

/** ch49: change the scores → the ratios → the mixed Value (paint colour and point). */
export function PaintLab() {
  const [scores, setScores] = useState<number[]>(START);
  const [hit, setHit] = useState<boolean[]>([false, false, false, false]);
  const w = softmax(scores.map((s) => s / SQRT_D));
  const shown = pct(w);
  const out = mixRow(w);
  const nowNear = V.map((v) => near(out, v));
  if (nowNear.some((n, i) => n && !hit[i])) setHit((h) => h.map((x, i) => x || nowNear[i]));

  const hull = [V[1], V[2], V[0]];
  const [mx, my] = at(out);
  const done = hit.filter(Boolean).length;

  let tip = "スコアを変えて、まざった点を「私は」のすぐそばまで連れていってみましょう。";
  if (done >= 1) tip = "いいですね！ ほかの語の点にもくっつけてみましょう。点はいつも点線の三角形の中にあります。";
  if (done >= 3) tip = "1語だけを大きく見ると、その語のValueとほぼ同じになります。まんべんなく見ると、まん中あたりにまざります。";

  return (
    <div className="plane-lab">
      <div>
        <svg className="p5-plane" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`まざったValue ${fmtVec(out)}`} style={{ touchAction: "manipulation" }}>
          {Array.from({ length: 5 }, (_, t) => (
            <g key={t}>
              <line x1={OX + t * U} y1={OY + 10} x2={OX + t * U} y2={10} stroke="var(--grid-minor)" />
              <line x1={OX - 10} y1={OY - t * U} x2={SIZE - 10} y2={OY - t * U} stroke="var(--grid-minor)" />
              <text x={OX + t * U} y={OY + 24} fontSize={11} textAnchor="middle" fill="var(--ink-2)">
                {t}
              </text>
            </g>
          ))}
          <line x1={OX} y1={OY} x2={SIZE - 10} y2={OY} stroke="var(--ink-3)" strokeWidth={1.5} />
          <line x1={OX} y1={OY} x2={OX} y2={10} stroke="var(--ink-3)" strokeWidth={1.5} />
          <polygon points={hull.map((v) => at(v).join(",")).join(" ")} fill="var(--paper-2)" stroke="var(--ink-3)" strokeDasharray="5 5" />
          {V.map((v, i) => (
            <line key={`l${i}`} x1={at(v)[0]} y1={at(v)[1]} x2={mx} y2={my} stroke="var(--pen)" strokeOpacity={0.6} strokeWidth={1 + w[i] * 8} />
          ))}
          {V.map((v, i) => (
            <g key={i}>
              <circle cx={at(v)[0]} cy={at(v)[1]} r={9} fill={`var(--hl-${PAINT[i]})`} stroke="var(--ink)" strokeWidth={1.5} />
              <text x={at(v)[0] + (i === 0 ? -12 : 12)} y={at(v)[1] + (i === 1 ? 18 : -10)} fontSize={12} fontWeight={700} textAnchor={i === 0 ? "end" : "start"} fill="var(--ink)">
                {WORDS[i]}
              </text>
            </g>
          ))}
          <circle cx={mx} cy={my} r={11} style={{ fill: paintMix(w) }} stroke="var(--pen)" strokeWidth={3} />
        </svg>
        <div className="p5-paint" style={{ marginTop: 8 }}>
          <div className="p5-cup" style={{ background: paintMix(w) }} aria-hidden="true" />
          <div className="p5-vec" style={{ fontSize: 15 }}>
            まざったValue
            <br />
            <b style={{ fontSize: 20 }}>{fmtVec(out)}</b>
          </div>
        </div>
      </div>
      <div className="plane-side">
        <div className="lab-rows">
          {WORDS.map((word, i) => (
            <div className="lab-row" key={word}>
              <span className={`chip hl-${PAINT[i]}`}>{word}</span>
              <input
                type="range"
                min={-3}
                max={5}
                step={0.5}
                value={scores[i]}
                aria-label={`「行く」が「${word}」につけたスコア`}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setScores((s) => s.map((x, j) => (j === i ? v : x)));
                }}
              />
              <span className="val">{fmt(scores[i], 1)}</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          割合 {WORDS.map((word, i) => `${word} ${shown[i].toFixed(1)}%`).join(" · ")}
          <span className="p5-ex">説明用の例</span>
        </div>
        <div className="dot-formula" style={{ fontSize: 13 }}>
          {V.map((v, i) => (
            <span key={i}>
              {i > 0 && " + "}
              {w[i].toFixed(2)}×{fmtVec(v)}
            </span>
          ))}
          <br />= <b style={{ fontSize: 16 }}>{fmtVec(out)}</b>
        </div>
        <ul className="missions">
          {WORDS.map((word, i) => (
            <li key={word} data-done={hit[i]}>
              {hit[i] ? "○" : "□"} まざった点を「{word}」のすぐそばへ
            </li>
          ))}
        </ul>
        <div className="lab-actions" style={{ marginTop: 0 }}>
          <button className="btn ghost" onClick={() => setScores(START)}>
            最初のスコアにもどす
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
