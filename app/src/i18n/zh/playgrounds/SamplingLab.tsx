import { useState } from "react";
import { DISTS } from "../../../data/ch13";

function drawOne(items: { p: number }[]) {
  let r = Math.random();
  for (let i = 0; i < items.length; i++) {
    r -= items[i].p;
    if (r <= 0) return i;
  }
  return items.length - 1;
}

export function SamplingLab() {
  const [key, setKey] = useState(DISTS[1].key);
  const dist = DISTS.find((d) => d.key === key)!;
  const [counts, setCounts] = useState<number[]>(() => dist.items.map(() => 0));
  const [last, setLast] = useState<number | null>(null);
  const total = counts.reduce((a, b) => a + b, 0);

  const pick = (k: string) => {
    setKey(k);
    setCounts(DISTS.find((d) => d.key === k)!.items.map(() => 0));
    setLast(null);
  };
  const draw = (n: number) => {
    const next = [...counts];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = drawOne(dist.items);
      next[i]++;
    }
    setCounts(next);
    setLast(i);
  };

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择分布">
        {DISTS.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => pick(d.key)} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name}
          </button>
        ))}
      </div>
      <div className="sample-head">
        <span>候选</span>
        <span>概率</span>
        <span>抽中比例</span>
      </div>
      <div className="bars">
        {dist.items.map((it, i) => (
          <div className="sample-row" key={it.w} data-last={last === i}>
            <span className="label">{it.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${it.p * 100}%`, background: `var(--hl-${it.c})` }} />
            </span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${total ? (counts[i] / total) * 100 : 0}%`, background: "var(--ink-2)" }} />
            </span>
            <span className="val num">{counts[i]}</span>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" onClick={() => draw(1)}>
          抽 1 次
        </button>
        <button className="btn ghost" onClick={() => draw(100)}>
          抽 100 次
        </button>
        <button className="btn ghost" onClick={() => pick(key)}>
          清零
        </button>
      </div>
      <p className="lab-tip">
        {total === 0
          ? "点“抽”试试看。"
          : total < 50
            ? `已经抽了 ${total} 次。只抽几次的话，比例会忽高忽低。`
            : `已经抽了 ${total} 次。抽得越多，灰色柱子就越接近彩色柱子（概率）。`}
      </p>
    </div>
  );
}
