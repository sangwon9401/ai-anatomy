import { useState } from "react";
import { MASKED, PAINT, WEIGHT, WORDS, allowed, pct } from "../../data/part5-toy";
import "./style.css";

/** 51장: switch the causal mask on and off and compare each word's ratios. */
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
  let tip = "먼저 가림막 없이 '나는' 줄을 보세요. 뒤 단어들도 쳐다보고 있죠?";
  if (seen.on) tip = "가림막을 켜니 미래 칸이 0%가 됐어요. 남은 칸끼리 다시 100%를 나눠 가져요.";
  if (seen.self) tip = "'나는'은 첫 단어라 볼 수 있는 게 자기 자신뿐이에요. 그래서 100%.";
  if (seen.same) tip = "'간다' 줄은 가림막을 켜도 꺼도 똑같아요. 마지막 단어라 가릴 미래가 없거든요.";

  return (
    <div>
      <label className="p5-toggle">
        <input type="checkbox" checked={mask} onChange={(e) => toggle(e.target.checked)} />
        가림막 (인과 마스크)
      </label>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={mask ? "가림막을 씌운 비율표" : "비율표"}>
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
                      <button onClick={() => pickRow(i)} aria-label={`${w} 줄 보기`}>
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
          <b>'{WORDS[row]}'</b>가 쳐다보는 비율 {mask ? "(가림막 켬)" : "(가림막 끔)"}
          <span className="p5-ex">설명용 예시</span>
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
        <li data-done={seen.on}>{seen.on ? "○" : "□"} 가림막 켜 보기</li>
        <li data-done={seen.self}>{seen.self ? "○" : "□"} 가림막을 켜고 '나는' 줄 보기</li>
        <li data-done={seen.same}>{seen.same ? "○" : "□"} 가림막을 켜도 꺼도 똑같은 줄 찾기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
