// en: overlay of src/playgrounds/part5/MaskLab.tsx (strings only)
import { useState } from "react";
import { MASKED, PAINT, WEIGHT, WORDS, allowed, pct } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

/** ch. 51: switch the causal mask on and off and compare each word's ratios. */
export function MaskLab() {
  const [mask, setMask] = useState(false);
  const [row, setRow] = useState(0);
  const [seen, setSeen] = useState({ on: false, self: false, same: false, offSeen: [false, false, false, false], onSeen: [false, false, false, false] });

  const table = (mask ? MASKED : WEIGHT).map((r) => pct(r));
  const look = (r: number, m: boolean) =>
    setSeen((s) => {
      const offSeen = s.offSeen.map((v, i) => v || (!m && i === r));
      const onSeen = s.onSeen.map((v, i) => v || (m && i === r));
      return { on: s.on || m, self: s.self || (m && r === 0), same: s.same || (offSeen[3] && onSeen[3]), offSeen, onSeen };
    });
  const pickRow = (r: number) => {
    setRow(r);
    look(r, mask);
  };
  const toggle = (m: boolean) => {
    setMask(m);
    look(row, m);
  };

  const r = table[row];
  let tip = "First look at the row of 'I' without the curtain. It's looking at the later words too, see?";
  if (seen.on) tip = "With the curtain on, the future cells became 0%. The remaining cells share 100% again.";
  if (seen.self) tip = "'I' is the first word, so the only thing it can see is itself. Hence 100%.";
  if (seen.same) tip = "The row of 'school' is the same with the curtain on or off. It's the last word, so there's no future to cover.";

  return (
    <div>
      <label className="p5-toggle">
        <input type="checkbox" checked={mask} onChange={(e) => toggle(e.target.checked)} />
        Curtain (causal mask)
      </label>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={mask ? "Share table with the curtain" : "Share table"}>
          <thead>
            <tr>
              <th className="row" />
              {WORDS.map((w) => (
                <th key={w}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WORDS.map((w, i) => (
              <tr key={w}>
                <th className="row" style={{ color: i === row ? "var(--pen)" : undefined }}>
                  {w}
                </th>
                {WORDS.map((c, j) => {
                  const hidden = mask && !allowed(i, j);
                  return (
                    <td key={c} data-masked={hidden} data-hl={i === row && !hidden} style={hidden ? undefined : { background: `color-mix(in srgb, var(--hl-yellow) ${Math.round(Math.min(1, table[i][j] / 60) * 80)}%, var(--paper-2))`, color: table[i][j] >= 27 ? "var(--chip-ink)" : "var(--ink)" }}>
                      <button onClick={() => pickRow(i)} aria-label={`Show the row of ${w}`}>
                        {hidden ? "0%" : `${table[i][j].toFixed(1)}%`}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lab-out">
        <div style={{ fontSize: 15 }}>
          How much <b>'{WORDS[row]}'</b> looks at each word {mask ? "(curtain on)" : "(curtain off)"}
          <span className="p5-ex">illustrative example</span>
        </div>
        <div className="bars">
          {WORDS.map((w, j) => (
            <div className="bar-row" key={w}>
              <span className="label" style={{ color: mask && !allowed(row, j) ? "var(--ink-3)" : undefined }}>
                {w}
              </span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${r[j]}%`, background: `var(--hl-${PAINT[j]})` }} />
              </span>
              <span className="val">{r[j].toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.on}>{seen.on ? "○" : "□"} Turn the curtain on</li>
        <li data-done={seen.self}>{seen.self ? "○" : "□"} With the curtain on, look at the row of 'I'</li>
        <li data-done={seen.same}>{seen.same ? "○" : "□"} Find the row that stays the same, curtain on or off</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
