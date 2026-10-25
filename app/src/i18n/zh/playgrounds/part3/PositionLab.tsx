// zh overlay of src/playgrounds/part3/PositionLab.tsx (strings only; the second '10' sits at position 2 in 11点10分)
import { useState } from "react";
import { SPEEDS, TIME_A, TIME_B, TOK_VEC, WAVE_NAMES, add4, fmt, pe, type V4 } from "../../../../data/ch36";
import "../../../../playgrounds/part3/style.css";

const show = (t: string) => (t === " " ? "␣" : t);
const key = (v: V4) => v.map((x) => x.toFixed(3)).join(",");

export function PositionLab() {
  const [order, setOrder] = useState<0 | 1>(0);
  const [withPos, setWithPos] = useState(false);
  const [p, setP] = useState(3);
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
        <div className="seg" role="group" aria-label="选择句子">
          <button aria-pressed={order === 0} onClick={() => setOrder(0)}>
            10点11分
          </button>
          <button aria-pressed={order === 1} onClick={() => setOrder(1)}>
            11点10分
          </button>
        </div>
        <button className={`btn${withPos ? "" : " ghost"}`} aria-pressed={withPos} onClick={() => setWithPos((v) => !v)}>
          加上位置信息：{withPos ? "开" : "关"}
        </button>
      </div>

      <div className="p3-pos-table" role="table" aria-label="每个词元送进模型的向量">
        {toks.map((t, i) => (
          <div className="p3-pos-row" role="row" key={i}>
            <span className="p3-pos-tok" role="rowheader">
              <span className="p3-sub">{i} 号</span> <b>{show(t)}</b>
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
          ? "两句话的向量只是顺序不同，内容完全一样。在模型眼里，“10”放在哪儿都是同一个“10”，分不出顺序。打开位置信息试试。"
          : `“10”的向量在 0 号位置是 [${tenA.map(fmt).join(", ")}]，在 2 号位置是 [${tenB.map(fmt).join(", ")}]。位置装进了向量，就能分辨顺序了。`}
      </p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        仔细看看位置花纹（快针每次转 1，慢针每次转 1/{1 / SPEEDS[1]}）
      </div>
      <div className="lab-row">
        <span>位置</span>
        <input type="range" min={0} max={15} step={1} value={p} aria-label="位置编号" onChange={(e) => setP(Number(e.target.value))} />
        <span className="val">{p}</span>
      </div>
      <div className="p3-pos-viz">
        <svg viewBox="0 0 200 96" className="p3-dials" role="img" aria-label={`位置 ${p} 的两根针`}>
          {[0, 1].map((h) => {
            const cx = 50 + h * 100;
            const a = p * SPEEDS[h];
            return (
              <g key={h}>
                <circle cx={cx} cy={46} r={34} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
                <line x1={cx} y1={46} x2={cx + Math.sin(a) * 28} y2={46 - Math.cos(a) * 28} stroke={h ? "var(--hl-sky)" : "var(--hl-orange)"} strokeWidth={5} strokeLinecap="round" />
                <circle cx={cx} cy={46} r={3} fill="var(--ink)" />
                <text x={cx} y={94} textAnchor="middle" fontSize={10} fill="var(--ink-2)">
                  {h ? "慢针" : "快针"}
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
      <p className="lab-sum">针尖的横、纵位置就是 sin、cos 的值。词元向量是示意数据；真正的 Transformer 用的速度多得多。GPT-2、GPT-3 的花纹也是训练出来的。</p>
    </div>
  );
}
