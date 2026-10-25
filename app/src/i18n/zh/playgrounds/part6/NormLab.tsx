import { useState } from "react";
import { layerNorm, wordsAt } from "../../../../data/ch57";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LIMIT = 20;

/** 第 57 章: grow the word vectors layer by layer, then switch layer normalisation on. */
export function NormLab() {
  const [layer, setLayer] = useState(1);
  const [on, setOn] = useState(false);
  const [gain, setGain] = useState(1);
  const [seen, setSeen] = useState({ big: false, fixed: false, gain: false });

  const words = wordsAt(layer);
  const rows = words.map((w) => {
    const n = layerNorm(w.v, gain);
    const into = on ? n.out : w.v;
    return { ...w, ...n, into, max: Math.max(...into.map(Math.abs)) };
  });
  const worst = Math.max(...rows.map((r) => r.max));
  const shaky = worst > LIMIT;

  const mark = (next: Partial<typeof seen>) => setSeen((s) => ({ big: s.big || !!next.big, fixed: s.fixed || !!next.fixed, gain: s.gain || !!next.gain }));
  const setL = (v: number) => {
    setLayer(v);
    if (v === 96) mark({ big: !on, fixed: on });
  };
  const setNorm = (v: boolean) => {
    setOn(v);
    if (layer === 96) mark({ big: !v, fixed: v });
  };

  let tip = "先关掉归一化，把层数滑块拉到 96。";
  if (!on && shaky) tip = "数字变得太大了！每个词的大小还各不相同，部件就不稳了。打开层归一化试试。";
  else if (!on) tip = "层越深，数字越大，而且每个词的大小都不一样。";
  else if (gain !== 1) tip = `倍率 ${fmt(gain)} 倍：归一化后的值乘上了倍率。实际上，这个值每个数字各有一个，靠训练决定。`;
  else tip = "不管第几层，每个词都统一成平均值 0、分散程度 1。也改改倍率试试。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="层归一化">
        <button aria-pressed={!on} onClick={() => setNorm(false)}>
          关掉归一化
        </button>
        <button aria-pressed={on} onClick={() => setNorm(true)}>
          打开层归一化
        </button>
      </div>
      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>层</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="第几层" onChange={(e) => setL(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
        <div className="lab-row">
          <span>倍率</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={gain}
            disabled={!on}
            aria-label="倍率"
            onChange={(e) => {
              setGain(Number(e.target.value));
              mark({ gain: true });
            }}
          />
          <span className="val">{fmt(gain)}</span>
        </div>
      </div>

      <div className="p6-rows">
        {rows.map((r) => (
          <div className="p6-wrow" key={r.w}>
            <div className="p6-wrow-head">
              <span className="chip outline">{r.w}</span>
              <span className="muted">
                平均值 {fmt(r.mean)} · 分散程度 {fmt(r.sd)}
              </span>
            </div>
            <Vec v={r.v} label={`“${r.w}”的向量`} />
            {on && (
              <>
                <p className="p6-label">↓ 送进部件的值</p>
                <Vec v={r.into} label={`“${r.w}”归一化后的值`} />
              </>
            )}
            <div className="bars" style={{ marginTop: 6 }}>
              <div className="bar-row">
                <span className="label">大小</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.min(100, (r.max / 80) * 100)}%`, background: r.max > LIMIT ? "var(--pen)" : "var(--hl-mint)" }} />
                </span>
                <span className="val">{fmt(r.max)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="p6-note">“大小”是送进部件的数字里最大的那个（不看正负号）。数字是示意数据。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.big}>{seen.big ? "✓" : "○"} 关掉归一化，拉到第 96 层</li>
        <li data-done={seen.fixed}>{seen.fixed ? "✓" : "○"} 在第 96 层打开层归一化</li>
        <li data-done={seen.gain}>{seen.gain ? "✓" : "○"} 改改倍率</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
