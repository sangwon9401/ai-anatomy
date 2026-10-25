// zh overlay of src/playgrounds/part4/SpotlightGame.tsx (strings only)
import { useState } from "react";
import { PAIRS, weightsOf } from "../../../../data/ch43";
import "../../../../playgrounds/part4/style.css";

/** a pick counts if the model looked there at least 60% as much as at its brightest word */
export const accepted = (w: number[], pick: number) => w[pick] >= 0.6 * Math.max(...w);
const heat = (w: number) => `color-mix(in srgb, var(--hl-yellow) ${Math.round(Math.min(1, w * 1.15) * 100)}%, var(--paper-2))`;

export function SpotlightGame() {
  const [pi, setPi] = useState(0);
  const pair = PAIRS[pi];
  const W = weightsOf(pair);
  const [t, setT] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(pair.tgt.map(() => null));
  const pick = picks[t];
  const revealed = pick !== null;
  const last = t === pair.tgt.length - 1;
  const done = last && revealed;
  const score = picks.filter((p, i) => p !== null && accepted(W[i].w, p)).length;

  const choosePair = (i: number) => {
    setPi(i);
    setT(0);
    setPicks(PAIRS[i].tgt.map(() => null));
  };

  let feedback = "";
  if (revealed) {
    const w = W[t].w;
    const best = w.indexOf(Math.max(...w));
    const second = w.map((v, i) => ({ v, i })).filter((x) => x.i !== best).sort((a, b) => b.v - a.v)[0];
    if (accepted(w, pick!) && pick !== best) feedback = `不错！模型看“${pair.src[best]}”${W[t].pct[best]}%、“${pair.src[pick!]}”${W[t].pct[pick!]}%，两个都看得很多。`;
    else if (pick === best)
      feedback =
        second.v >= 0.6 * w[best]
          ? `对了！模型看“${pair.src[best]}”${W[t].pct[best]}%、“${pair.src[second.i]}”${W[t].pct[second.i]}%，两个一起看。`
          : `对了！模型也把“${pair.src[best]}”照得最亮（${W[t].pct[best]}%）。`;
    else feedback = `模型把“${pair.src[best]}”照得最亮（${W[t].pct[best]}%），因为“${pair.tgt[t]}”的意思在那里。`;
  }

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择要翻译的句子">
        {PAIRS.map((p, i) => (
          <button key={p.label} aria-pressed={i === pi} onClick={() => choosePair(i)} style={i === pi ? { borderStyle: "solid", color: "var(--ink)", borderColor: "var(--ink)" } : undefined}>
            {p.label}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        原文（编码器留下的纸条）
      </h4>
      <div className="p4-src" role="group" aria-label={`写“${pair.tgt[t]}”时要照的中文词`}>
        {pair.src.map((s, i) => (
          <button
            key={s}
            className="p4-srcbtn"
            disabled={revealed}
            aria-pressed={pick === i}
            onClick={() => setPicks(picks.map((p, k) => (k === t ? i : p)))}
            style={revealed ? { background: heat(W[t].w[i]) } : undefined}
          >
            <span>{s}</span>
            {revealed && <span className="pct">{W[t].pct[i]}%</span>}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        解码器写的英文
      </h4>
      <div className="p4-sentence" aria-live="polite">
        {pair.tgt.map((w, i) => (
          <span key={w} className={`chip ${i < t || (i === t && revealed) ? "hl-orange" : i === t ? "outline" : "p4-start"}`} style={i === t ? { outline: "2.5px solid var(--pen)", outlineOffset: 2 } : undefined}>
            {i <= t ? w : "?"}
          </span>
        ))}
      </div>

      <p className="lab-tip">{revealed ? feedback : `要写“${pair.tgt[t]}”，该看原文的哪个词？在上面点一下。`}</p>

      <div className="lab-actions">
        {revealed && !last && (
          <button className="btn" onClick={() => setT(t + 1)}>
            下一个词
          </button>
        )}
        {done && (
          <button className="btn" onClick={() => choosePair((pi + 1) % PAIRS.length)}>
            换个句子
          </button>
        )}
        <button className="btn ghost" onClick={() => choosePair(pi)}>
          从头开始
        </button>
      </div>

      {picks.some((p) => p !== null) && (
        <div className="matrix-wrap" style={{ marginTop: 14 }}>
          <table className="matrix" aria-label="对齐表：每个英文单词照着的中文词">
            <thead>
              <tr>
                <th className="p4-th" />
                {pair.src.map((s) => (
                  <th key={s} scope="col" className="p4-th">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pair.tgt.map((w, i) =>
                picks[i] === null ? null : (
                  <tr key={w}>
                    <th scope="row" className="p4-th">
                      {w}
                    </th>
                    {W[i].w.map((v, s) => (
                      <td key={s} style={{ background: heat(v), color: "var(--chip-ink)", outline: picks[i] === s ? "2px solid var(--pen)" : undefined, outlineOffset: -2 }}>
                        {W[i].pct[s]}%
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      {done && (
        <p className="p4-verdict">
          {pair.tgt.length} 个词里有 {score} 个照的地方和模型一样。把表里亮的格子连起来，就能看到词和词的对应，这就是对齐。
        </p>
      )}
      <p className="p4-note">* 比例是示意数据：把相关度分数用 Softmax（第 14 章）变成比例，合起来是 100%。红框是我选的格子。</p>
    </div>
  );
}
