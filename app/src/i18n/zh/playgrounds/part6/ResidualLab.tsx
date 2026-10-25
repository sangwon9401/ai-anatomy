import { useState } from "react";
import { GARBLE, PHONE, TOY_X0, garble, runLayers } from "../../../../data/ch56";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

/** 第 56 章: push a vector through up to 48 layers with and without the highway. */
export function ResidualLab() {
  const [n, setN] = useState(4);
  const [highway, setHighway] = useState(false);
  const [done, setDone] = useState({ off: false, on: false });
  const r = runLayers(n, highway);
  const pct = Math.round(r.keep * 100);
  const msg = garble(PHONE[0], Math.round((1 - r.keep) * GARBLE.length));

  const update = (nextN: number, nextHw: boolean) => {
    setN(nextN);
    setHighway(nextHw);
    if (nextN === 48) setDone((d) => ({ off: d.off || !nextHw, on: d.on || nextHw }));
  };

  let tip = "先关掉高速公路，把层数调到 48。";
  if (!highway && pct < 20) tip = "最初的信息几乎全没了。每层都把向量整个换掉，就会变成这样。";
  else if (!highway) tip = "层叠得越多，就和最初的越不像。";
  else if (n >= 24) tip = `最初的信息还留着 ${pct}%！不过数字的大小从 ${fmt(r.size0)} 变成了 ${fmt(r.size)}，变大了吧？这个问题第 57 章来解决。`;
  else tip = "打开高速公路，层叠多了，最初的信息也能好好留着。调到 48 层试试。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="高速公路">
        <button aria-pressed={!highway} onClick={() => update(n, false)}>
          关掉高速公路（换掉）
        </button>
        <button aria-pressed={highway} onClick={() => update(n, true)}>
          打开高速公路（相加）
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>层数</span>
          <input type="range" min={1} max={48} step={1} value={n} aria-label="层数" onChange={(e) => update(Number(e.target.value), highway)} />
          <span className="val">{n}</span>
        </div>
      </div>

      <p className="p6-label">最初的向量</p>
      <Vec v={TOY_X0} label="最初的向量" />
      <p className="p6-label">经过 {n} 层之后</p>
      <Vec v={r.x} label={`经过 ${n} 层之后`} />

      <div className="lab-out">
        <div className="bars">
          <div className="bar-row">
            <span className="label">相似度</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${pct}%`, background: "var(--hl-mint)" }} />
            </span>
            <span className="val">{pct}%</span>
          </div>
        </div>
        <p className="p6-msg" aria-label="传话游戏的比喻">
          {[...msg].map((ch, i) => (
            <span key={i} className={ch !== PHONE[0][i] ? "bad" : undefined}>
              {ch}
            </span>
          ))}
        </p>
        <p className="p6-note">相似度表示和最初的向量方向有多一致（第 9 章）。下面的句子是传话游戏的比喻，按这个程度把话传走了样。数字是示意数据。</p>
      </div>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.off}>{done.off ? "✓" : "○"} 关掉高速公路，叠到 48 层</li>
        <li data-done={done.on}>{done.on ? "✓" : "○"} 打开高速公路，叠到 48 层</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
