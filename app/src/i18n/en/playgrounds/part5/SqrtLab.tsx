// en: overlay of src/playgrounds/part5/SqrtLab.tsx (strings only)
import { useState } from "react";
import { FOCUS, PAINT, SCORE, WORDS, fmt, pct, randomScores, softmax } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

const DIMS = [2, 8, 32, 128, 512];

/** ch. 48: how big dot products get as vectors get longer, and what dividing by √d does. */
export function SqrtLab() {
  const [d, setD] = useState(2);
  const [seed, setSeed] = useState(1);
  const [divide, setDivide] = useState(true);
  const [seen, setSeen] = useState({ peak: false, fixed: false });

  // d = 2 is the chapter's own example; longer vectors are drawn at random (+1 or −1 in every entry)
  const scores = d === 2 ? SCORE[FOCUS] : randomScores(d, seed);
  const root = Math.sqrt(d);
  const used = divide ? scores.map((s) => s / root) : scores;
  const p = softmax(used);
  const shown = pct(p);
  const top = Math.max(...p);
  const topWord = WORDS[p.indexOf(top)];

  if (d >= 128 && !divide && top > 0.9 && !seen.peak) setSeen((s) => ({ ...s, peak: true }));
  if (d >= 128 && divide && seen.peak && !seen.fixed) setSeen((s) => ({ ...s, fixed: true }));

  let tip = "Raise d to 128 and switch 'Divide by √d' off.";
  if (d >= 32 && !divide) tip = top > 0.9 ? `'${topWord}' took ${(top * 100).toFixed(1)}%. It looks at almost only one word. Now switch dividing on.` : "Press 'Draw again' a few times. Often everything piles onto one word.";
  if (d >= 32 && divide) tip = `Dividing by √${d} ≈ ${root.toFixed(1)} made the scores smaller, so the shares spread out evenly.`;
  if (d === 2) tip = divide ? "This is our example (ch. 48). Switch dividing off and you get chapter 14's 65.7%." : "Without dividing it's exactly chapter 14. With only 2 entries the difference is small. Raise d.";

  return (
    <div>
      <div className="p5-seg" role="group" aria-label="Number of entries d">
        {DIMS.map((v) => (
          <button key={v} aria-pressed={d === v} onClick={() => setD(v)}>
            d = {v}
          </button>
        ))}
      </div>
      <label className="p5-toggle">
        <input type="checkbox" checked={divide} onChange={(e) => setDivide(e.target.checked)} />
        Divide by √d {divide && <span className="p5-vec muted">(÷ {root.toFixed(2)})</span>}
      </label>

      <div className="lab-out">
        <div className="p5-vec" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          Scores (Q · K): {scores.map((s) => fmt(s)).join(", ")}
          {divide && <> → {used.map((s) => fmt(s)).join(", ")}</>}
          {d === 2 ? <span className="p5-ex">our example</span> : <span className="p5-ex">illustrative: random vectors</span>}
        </div>
        <div className="bars">
          {WORDS.map((w, i) => (
            <div className="bar-row" key={w}>
              <span className="label">{w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${PAINT[i]})` }} />
              </span>
              <span className="val">{shown[i].toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setSeed((s) => s + 1)} disabled={d === 2}>
          Draw again
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.peak}>{seen.peak ? "○" : "□"} With d ≥ 128 and dividing off, see one word take over 90%</li>
        <li data-done={seen.fixed}>{seen.fixed ? "○" : "□"} Then switch dividing on to spread it out</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
