// ja overlay of src/playgrounds/part5/SqrtLab.tsx (strings only)
import { useState } from "react";
import { FOCUS, PAINT, SCORE, WORDS, fmt, pct, randomScores, softmax } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

const DIMS = [2, 8, 32, 128, 512];

/** ch48: how big dot products get as vectors get longer, and what dividing by √d does. */
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

  let tip = "dを128に上げて、「√dで割る」をオフにしてみましょう。";
  if (d >= 32 && !divide) tip = top > 0.9 ? `「${topWord}」が${(top * 100).toFixed(1)}%を取りました。ほぼ1語しか見ていません。では、割り算をオンにしてみましょう。` : "「引き直す」を何回か押してみましょう。1語にかたよることが多いです。";
  if (d >= 32 && divide) tip = `√${d} ≈ ${root.toFixed(1)}で割ったらスコアが小さくなり、割合が平らに分かれました。`;
  if (d === 2) tip = divide ? "この章の例です(第48章)。割り算をオフにすると、第14章と同じ65.7%が出ます。" : "割らないと第14章とまったく同じです。欄が2つだけなので差は小さいです。dを上げてみましょう。";

  return (
    <div>
      <div className="p5-seg" role="group" aria-label="ベクトルの欄の数d">
        {DIMS.map((v) => (
          <button key={v} aria-pressed={d === v} onClick={() => setD(v)}>
            d = {v}
          </button>
        ))}
      </div>
      <label className="p5-toggle">
        <input type="checkbox" checked={divide} onChange={(e) => setDivide(e.target.checked)} />
        √dで割る {divide && <span className="p5-vec muted">(÷ {root.toFixed(2)})</span>}
      </label>

      <div className="lab-out">
        <div className="p5-vec" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          スコア (Q・K)：{scores.map((s) => fmt(s)).join(", ")}
          {divide && <> → {used.map((s) => fmt(s)).join(", ")}</>}
          {d === 2 ? <span className="p5-ex">この章の例</span> : <span className="p5-ex">説明用：ランダムなベクトル</span>}
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
          引き直す
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.peak}>{seen.peak ? "○" : "□"} d ≥ 128、割り算オフで、1語が90%以上を取るところを見る</li>
        <li data-done={seen.fixed}>{seen.fixed ? "○" : "□"} そのまま割り算をオンにして、平らにする</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
