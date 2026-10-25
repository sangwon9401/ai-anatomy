// zh overlay of src/playgrounds/part5/MaskLab.tsx (strings only)
import { useState } from "react";
import { MASKED, PAINT, WEIGHT, WORDS, allowed, pct } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

/** ch51: switch the causal mask on and off and compare each word's ratios. */
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
  let tip = "先在没有帘子的情况下看“我”这一行。它是不是连后面的词也在看？";
  if (seen.on) tip = "拉下帘子，未来的格子就变成 0%，剩下的格子重新分 100%。";
  if (seen.self) tip = "“我”是第一个词，能看的只有自己，所以是 100%。";
  if (seen.same) tip = "“学校”这一行，拉不拉帘子都一样。它是最后一个词，没有要遮的未来。";

  return (
    <div>
      <label className="p5-toggle">
        <input type="checkbox" checked={mask} onChange={(e) => toggle(e.target.checked)} />
        帘子（因果掩码）
      </label>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={mask ? "拉下帘子的比例表" : "比例表"}>
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
                      <button onClick={() => pickRow(i)} aria-label={`看 ${w} 这一行`}>
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
          <b>“{WORDS[row]}”</b>看各个词的比例 {mask ? "（帘子拉下）" : "（帘子收起）"}
          <span className="p5-ex">示意数据</span>
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
        <li data-done={seen.on}>{seen.on ? "○" : "□"} 拉下帘子</li>
        <li data-done={seen.self}>{seen.self ? "○" : "□"} 拉下帘子，看“我”这一行</li>
        <li data-done={seen.same}>{seen.same ? "○" : "□"} 找出拉不拉帘子都一样的那一行</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
