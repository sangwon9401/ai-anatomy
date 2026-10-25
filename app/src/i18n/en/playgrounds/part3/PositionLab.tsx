// en: overlay of src/playgrounds/part3/PositionLab.tsx (strings; starts at position 2, where '10' sits in 11:10)
import { useState } from "react";
import { SPEEDS, TIME_A, TIME_B, TOK_VEC, WAVE_NAMES, add4, fmt, pe, type V4 } from "../../../../data/ch36";
import "../../../../playgrounds/part3/style.css";

const show = (t: string) => (t === " " ? "␣" : t);
const key = (v: V4) => v.map((x) => x.toFixed(3)).join(",");

export function PositionLab() {
  const [order, setOrder] = useState<0 | 1>(0);
  const [withPos, setWithPos] = useState(false);
  const [p, setP] = useState(2);
  const toks = order === 0 ? TIME_A : TIME_B;
  const inputs = (ts: string[]) => ts.map((t, i) => (withPos ? add4(TOK_VEC[t], pe(i)) : TOK_VEC[t]));
  const mine = inputs(toks);
  // compare the two sentences as unordered bags of input vectors
  const bagA = inputs(TIME_A).map(key).sort().join("|");
  const bagB = inputs(TIME_B).map(key).sort().join("|");
  const same = bagA === bagB;
  const tenA = inputs(TIME_A)[TIME_A.indexOf("10")];
  const tenB = inputs(TIME_B)[TIME_B.indexOf("10")];

  return (
    <div>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <div className="seg" role="group" aria-label="Pick a time">
          <button aria-pressed={order === 0} onClick={() => setOrder(0)}>
            10:11
          </button>
          <button aria-pressed={order === 1} onClick={() => setOrder(1)}>
            11:10
          </button>
        </div>
        <button className={`btn${withPos ? "" : " ghost"}`} aria-pressed={withPos} onClick={() => setWithPos((v) => !v)}>
          Add position info: {withPos ? "on" : "off"}
        </button>
      </div>

      <div className="p3-pos-table" role="table" aria-label="The vector that goes into the model for each piece">
        {toks.map((t, i) => (
          <div className="p3-pos-row" role="row" key={i}>
            <span className="p3-pos-tok" role="rowheader">
              <span className="p3-sub">pos {i}</span> <b>{show(t)}</b>
            </span>
            {mine[i].map((x, k) => (
              <span key={k} role="cell" className={`p3-pos-cell num${t === "10" ? " hot" : ""}`}>
                {fmt(x)}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="lab-tip">
        {same
          ? "The two bundles of vectors are identical, just in a different order. To the model, '10' is the same '10' wherever it is, so it can't tell the order. Turn on position info."
          : `The vector of '10' is [${tenA.map(fmt).join(", ")}] at position ${TIME_A.indexOf("10")} and [${tenB.map(fmt).join(", ")}] at position ${TIME_B.indexOf("10")}. The position is inside the vector, so the order can be told apart.`}
      </p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        Look inside the position pattern (the fast hand turns 1 per position, the slow hand 1/{1 / SPEEDS[1]})
      </div>
      <div className="lab-row">
        <span>Position</span>
        <input type="range" min={0} max={15} step={1} value={p} aria-label="Position number" onChange={(e) => setP(Number(e.target.value))} />
        <span className="val">{p}</span>
      </div>
      <div className="p3-pos-viz">
        <svg viewBox="0 0 200 96" className="p3-dials" role="img" aria-label={`The two hands at position ${p}`}>
          {[0, 1].map((h) => {
            const cx = 50 + h * 100;
            const a = p * SPEEDS[h];
            return (
              <g key={h}>
                <circle cx={cx} cy={46} r={34} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
                <line x1={cx} y1={46} x2={cx + Math.sin(a) * 28} y2={46 - Math.cos(a) * 28} stroke={h ? "var(--hl-sky)" : "var(--hl-orange)"} strokeWidth={5} strokeLinecap="round" />
                <circle cx={cx} cy={46} r={3} fill="var(--ink)" />
                <text x={cx} y={94} textAnchor="middle" fontSize={10} fill="var(--ink-2)">
                  {h ? "slow hand" : "fast hand"}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="bars" style={{ flex: "1 1 180px", minWidth: 0 }}>
          {pe(p).map((v, k) => (
            <div className="bar-row" key={k}>
              <span className="label">{WAVE_NAMES[k]}</span>
              <span className="track p3-center-track">
                <span className="fill" style={{ display: "block", marginLeft: v < 0 ? `${50 + v * 50}%` : "50%", width: `${Math.abs(v) * 50}%`, background: k < 2 ? "var(--hl-orange)" : "var(--hl-sky)" }} />
              </span>
              <span className="val num">{fmt(v)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="lab-sum">The across and up positions of each hand's tip are the sin and cos values. The piece vectors are an illustrative example; the real Transformer uses many more speeds. GPT-2 and GPT-3 learn this pattern too.</p>
    </div>
  );
}
