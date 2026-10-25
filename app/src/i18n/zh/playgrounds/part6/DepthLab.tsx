import { useState } from "react";
import { DEPTH_NOTES, peekAt } from "../../../../data/ch58";
import "../../../../playgrounds/part6/style.css";

/** 学校 is ahead of every other single word (by more than a rounding hair) */
const ganLeads = (layer: number) => {
  const p = peekAt(layer);
  return p[0].now > Math.max(...p.slice(1).map((r) => r.now)) + 0.2;
};
const FIRST_GAN = Array.from({ length: 96 }, (_, i) => i + 1).find(ganLeads) ?? 96;

/** 第 58 章: walk down the 96 layers and watch 去 fill up. */
export function DepthLab() {
  const [layer, setLayer] = useState(1);
  const [found, setFound] = useState(false);
  const [bottom, setBottom] = useState(false);
  const peek = peekAt(layer);
  const rest = 100 - peek.reduce((a, r) => a + r.now, 0);
  const leads = ganLeads(layer);
  const tint = Math.round(12 + (layer / 96) * 88);

  const move = (v: number) => {
    setLayer(v);
    if (v === FIRST_GAN) setFound(true);
    if (v === 96) setBottom(true);
  };

  let tip = "慢慢往下拉滑块。“学校”从第几层开始变成第一名？";
  if (layer === FIRST_GAN) tip = `就是从第 ${layer} 层开始，“学校”成了第一名！`;
  else if (leads && layer === 96) tip = "走完 96 层：学校 52%，图书馆 21%，公园 12%。就是第 1 章看到的那些数字！";
  else if (leads) tip = "“学校”是第一名。越往深处走，就越有把握。";
  else if (layer < 12) tip = "在浅层还没什么头绪，候选词都差不多。";

  return (
    <div>
      <div className="lab-rows">
        <div className="lab-row">
          <span>层</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="第几层" onChange={(e) => move(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
      </div>

      <div className="p6-depth">
        <span
          className="chip"
          style={{ fontSize: 20, background: `color-mix(in srgb, var(--hl-yellow) ${tint}%, var(--paper))`, color: tint > 50 ? "var(--chip-ink)" : "var(--ink)", border: "2px solid var(--ink)" }}
        >
          去
        </span>
        <span className="muted">经过 {layer} 层的向量</span>
      </div>

      <p className="p6-label">这个向量里累积的信息（示意）</p>
      <ul className="p6-notes">
        {DEPTH_NOTES.map((d) => (
          <li key={d.layer} data-on={layer >= d.layer}>
            <span className="n">{d.layer} 层起</span>
            <span>{layer >= d.layer ? d.note : "?"}</span>
          </li>
        ))}
      </ul>

      <p className="p6-label">在这里偷看一下下一个词</p>
      <div className="bars">
        {peek.map((r) => (
          <div className="bar-row" key={r.w}>
            <span className="label">{r.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${r.now}%`, background: `var(--hl-${r.c})` }} />
            </span>
            <span className="val">{Math.round(r.now)}%</span>
          </div>
        ))}
        <div className="bar-row">
          <span className="label">其余</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${rest}%`, background: "var(--line)" }} />
          </span>
          <span className="val">{Math.round(rest)}%</span>
        </div>
      </div>
      <p className="p6-note">“其余”是约 5 万个词元加在一起的份额。各层的数字是示意数据。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={found}>{found ? "✓" : "○"} 找出“学校”第一次变成第一名的那一层</li>
        <li data-done={bottom}>{bottom ? "✓" : "○"} 一直走到第 96 层</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
