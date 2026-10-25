// zh overlay of src/playgrounds/part5/SqrtLab.tsx (strings only)
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

  let tip = "把 d 调到 128，再关掉“除以 √d”试试。";
  if (d >= 32 && !divide) tip = top > 0.9 ? `“${topWord}”拿走了 ${(top * 100).toFixed(1)}%，几乎只看一个词。现在打开除法试试。` : "多点几次“重新抽”。经常会全部偏到一个词上。";
  if (d >= 32 && divide) tip = `除以 √${d} ≈ ${root.toFixed(1)}，分数变小，比例就分得均匀了。`;
  if (d === 2) tip = divide ? "这是我们的例子（第 48 章）。关掉除法，就会出现和第 14 章一样的 65.7%。" : "不除的话和第 14 章一模一样。只有 2 格，差别很小。把 d 调大试试。";

  return (
    <div>
      <div className="p5-seg" role="group" aria-label="向量的格数 d">
        {DIMS.map((v) => (
          <button key={v} aria-pressed={d === v} onClick={() => setD(v)}>
            d = {v}
          </button>
        ))}
      </div>
      <label className="p5-toggle">
        <input type="checkbox" checked={divide} onChange={(e) => setDivide(e.target.checked)} />
        除以 √d {divide && <span className="p5-vec muted">（÷ {root.toFixed(2)}）</span>}
      </label>

      <div className="lab-out">
        <div className="p5-vec" style={{ fontSize: 14, color: "var(--ink-2)" }}>
          分数（Q · K）：{scores.map((s) => fmt(s)).join("，")}
          {divide && <> → {used.map((s) => fmt(s)).join(", ")}</>}
          {d === 2 ? <span className="p5-ex">我们的例子</span> : <span className="p5-ex">示意：随机向量</span>}
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
          重新抽
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.peak}>{seen.peak ? "○" : "□"} d ≥ 128，关掉除法，看一个词拿走 90% 以上</li>
        <li data-done={seen.fixed}>{seen.fixed ? "○" : "□"} 在那种情况下打开除法，让比例变均匀</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
