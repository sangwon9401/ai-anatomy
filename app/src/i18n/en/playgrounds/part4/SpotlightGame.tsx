// en: overlay of src/playgrounds/part4/SpotlightGame.tsx (strings only; English → Spanish)
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
    if (accepted(w, pick!) && pick !== best) feedback = `Nice! The model looked at both a lot: '${pair.src[best]}' ${W[t].pct[best]}%, '${pair.src[pick!]}' ${W[t].pct[pick!]}%.`;
    else if (pick === best)
      feedback =
        second.v >= 0.6 * w[best]
          ? `Right! The model looked at the two together: '${pair.src[best]}' ${W[t].pct[best]}%, '${pair.src[second.i]}' ${W[t].pct[second.i]}%.`
          : `Right! The model also lit up '${pair.src[best]}' the brightest (${W[t].pct[best]}%).`;
    else feedback = `The model lit up '${pair.src[best]}' the brightest (${W[t].pct[best]}%). That's where the meaning of '${pair.tgt[t]}' is.`;
  }

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Pick a sentence to translate">
        {PAIRS.map((p, i) => (
          <button key={p.label} aria-pressed={i === pi} onClick={() => choosePair(i)} style={i === pi ? { borderStyle: "solid", color: "var(--ink)", borderColor: "var(--ink)" } : undefined}>
            {p.label}
          </button>
        ))}
      </div>

      <h4 className="p4-h4" style={{ marginTop: 14 }}>
        Original (the notes the encoder kept)
      </h4>
      <div className="p4-src" role="group" aria-label={`Pick the English word to light up when writing '${pair.tgt[t]}'`}>
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
        The Spanish the decoder writes
      </h4>
      <div className="p4-sentence" aria-live="polite">
        {pair.tgt.map((w, i) => (
          <span key={w} className={`chip ${i < t || (i === t && revealed) ? "hl-orange" : i === t ? "outline" : "p4-start"}`} style={i === t ? { outline: "2.5px solid var(--pen)", outlineOffset: 2 } : undefined}>
            {i <= t ? w : "?"}
          </span>
        ))}
      </div>

      <p className="lab-tip">{revealed ? feedback : `To write '${pair.tgt[t]}', which word of the original should it look at? Tap one above.`}</p>

      <div className="lab-actions">
        {revealed && !last && (
          <button className="btn" onClick={() => setT(t + 1)}>
            Next word
          </button>
        )}
        {done && (
          <button className="btn" onClick={() => choosePair((pi + 1) % PAIRS.length)}>
            Another sentence
          </button>
        )}
        <button className="btn ghost" onClick={() => choosePair(pi)}>
          Start over
        </button>
      </div>

      {picks.some((p) => p !== null) && (
        <div className="matrix-wrap" style={{ marginTop: 14 }}>
          <table className="matrix" aria-label="Alignment table: the English word lit up for each Spanish word">
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
          You lit up the same place as the model for {score} of {pair.tgt.length} words. Connect the bright cells in the table and the order crosses. That's alignment.
        </p>
      )}
      <p className="p4-note">* The shares are an illustrative example: relevance scores turned by softmax (ch. 14) into shares that add up to 100%. A red border marks the cell you picked.</p>
    </div>
  );
}
