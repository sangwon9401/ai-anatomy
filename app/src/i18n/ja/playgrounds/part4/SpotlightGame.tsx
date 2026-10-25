// ja overlay of src/playgrounds/part4/SpotlightGame.tsx (strings only)
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
    if (accepted(w, pick!) && pick !== best) feedback = `いいですね！ モデルは「${pair.src[best]}」${W[t].pct[best]}%、「${pair.src[pick!]}」${W[t].pct[pick!]}%で、両方をたくさん見ました。`;
    else if (pick === best)
      feedback =
        second.v >= 0.6 * w[best]
          ? `正解！ モデルは「${pair.src[best]}」${W[t].pct[best]}%、「${pair.src[second.i]}」${W[t].pct[second.i]}%で、2つをいっしょに見ました。`
          : `正解！ モデルも「${pair.src[best]}」をいちばん明るく照らしました (${W[t].pct[best]}%)。`;
    else feedback = `モデルは「${pair.src[best]}」をいちばん明るく照らしました (${W[t].pct[best]}%)。「${pair.tgt[t]}」の意味がそこにあるからです。`;
  }

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="翻訳する文をえらぶ">
        {PAIRS.map((p, i) => (
          <button key={p.label} aria-pressed={i === pi} onClick={() => choosePair(i)} style={i === pi ? { borderStyle: "solid", color: "var(--ink)", borderColor: "var(--ink)" } : undefined}>
            {p.label}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        もとの文 (エンコーダーが残したメモ)
      </h4>
      <div className="p4-src" role="group" aria-label={`「${pair.tgt[t]}」を書くときに照らす日本語の語をえらぶ`}>
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
        デコーダーが書く英語
      </h4>
      <div className="p4-sentence" aria-live="polite">
        {pair.tgt.map((w, i) => (
          <span key={w} className={`chip ${i < t || (i === t && revealed) ? "hl-orange" : i === t ? "outline" : "p4-start"}`} style={i === t ? { outline: "2.5px solid var(--pen)", outlineOffset: 2 } : undefined}>
            {i <= t ? w : "?"}
          </span>
        ))}
      </div>

      <p className="lab-tip">{revealed ? feedback : `「${pair.tgt[t]}」を書くには、もとの文のどの語を見ればいいでしょう？ 上で押してみましょう。`}</p>

      <div className="lab-actions">
        {revealed && !last && (
          <button className="btn" onClick={() => setT(t + 1)}>
            次の語
          </button>
        )}
        {done && (
          <button className="btn" onClick={() => choosePair((pi + 1) % PAIRS.length)}>
            ほかの文
          </button>
        )}
        <button className="btn ghost" onClick={() => choosePair(pi)}>
          最初から
        </button>
      </div>

      {picks.some((p) => p !== null) && (
        <div className="matrix-wrap" style={{ marginTop: 14 }}>
          <table className="matrix" aria-label="アラインメントの表：英語の語ごとに照らした日本語の語">
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
          {pair.tgt.length}個のうち{score}個を、モデルと同じ所に照らしました。表の明るいマスをつなぐと、順番がずれています。これがアラインメントです。
        </p>
      )}
      <p className="p4-note">* 割合は説明用の例です。関連度のスコアをソフトマックス(第14章)で変えて、合計が100%になるようにしました。赤いわくは自分がえらんだマスです。</p>
    </div>
  );
}
