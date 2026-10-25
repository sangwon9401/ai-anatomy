import { useState } from "react";
import { LOGITS, OTHERS, REST_N, outputProbs } from "../../../../data/ch60";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";

const START = LOGITS.map((l) => l.s);

/** ch. 60: scores → probabilities over the whole vocabulary, then draw one. */
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

  let tip = "Raise the score of 'school' until its probability is over 90%.";
  if (!whole) tip = "With only 4 candidates, the share the other 50,000-odd tokens used to take disappears, so the same scores give bigger probabilities.";
  else if (out.p[0] > 0.9) tip = "The bigger the score gap, the more the winner takes almost all the probability. Softmax makes big scores even bigger (ch. 14).";
  else if (draws >= 10) tip = "Draw many times: mostly 'school', but sometimes another word. That's why ChatGPT's answers differ a little every time.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="Number of candidates">
        <button aria-pressed={whole} onClick={() => setWhole(true)}>
          50,257 candidates (real)
        </button>
        <button
          aria-pressed={!whole}
          onClick={() => {
            setWhole(false);
            setSeen((s) => ({ ...s, four: true }));
          }}
        >
          Only 4 candidates
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        {LOGITS.map((l, i) => (
          <div className="lab-row" key={l.w}>
            <span className={`chip hl-${l.c}`}>{l.w}</span>
            <input type="range" min={-4} max={9} step={0.1} value={scores[i]} aria-label={`${l.w} score`} onChange={(e) => setScore(i, Number(e.target.value))} />
            <span className="val">{fmt(scores[i])}</span>
          </div>
        ))}
        {whole && (
          <p className="p6-note" style={{ margin: 0 }}>
            The other {REST_N.toLocaleString()} tokens' scores are fixed, mostly at about −9.1.
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
              <span className="label">the rest</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${out.restP * 100}%`, background: "var(--ink-3)" }} />
              </span>
              <span className="val">{(out.restP * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="lab-sum num">
          Sum of e<sup>score</sup>: {out.sum.toFixed(2)}
          {whole ? ` (including the rest's share, ${out.rest.toFixed(2)})` : ""} → probabilities add up to 100%
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          Pick one
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setWhole(true);
            setDrawn(null);
          }}
        >
          Reset
        </button>
      </div>
      <p className="p6-msg" aria-live="polite">
        I walk to <span className="bad">{drawn ?? "___"}</span>
      </p>
      <p className="p6-note">Picks so far: {draws} · The scores are illustrative examples.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.ninety}>{seen.ninety ? "✓" : "○"} Get 'school' over 90%</li>
        <li data-done={seen.four}>{seen.four ? "✓" : "○"} Switch to only 4 candidates</li>
        <li data-done={draws >= 10}>{draws >= 10 ? "✓" : "○"} Pick ten times</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
