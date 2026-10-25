import { useState } from "react";
import { DATASETS, stats } from "../../../data/ch15";

type Stage = 0 | 1 | 2;
const fmt = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? `−${Math.abs(r)}` : String(r);
};

export function NormalizeLab() {
  const [key, setKey] = useState(DATASETS[0].key);
  const [stage, setStage] = useState<Stage>(0);
  const data = DATASETS.find((d) => d.key === key)!;
  const { mean, sd } = stats(data.xs);
  const vals = data.xs.map((x) => (stage === 0 ? x : stage === 1 ? x - mean : (x - mean) / sd));
  const maxAbs = Math.max(...vals.map(Math.abs), 1e-9);

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择一组分数">
        {DATASETS.map((d) => (
          <button
            key={d.key}
            aria-pressed={d.key === key}
            style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}
            onClick={() => {
              setKey(d.key);
              setStage(0);
            }}
          >
            {d.name}
          </button>
        ))}
      </div>
      <p className="lab-sum num">
        平均 {fmt(mean)} · 标准差 {fmt(sd)}
      </p>
      <div className="norm-bars">
        {vals.map((v, i) => (
          <div className="norm-row" key={i}>
            <span className="num muted">{data.xs[i]}</span>
            <span className="norm-track">
              <span className="norm-mid" />
              <span
                className="norm-fill"
                style={{
                  left: stage === 0 ? 0 : v >= 0 ? "50%" : `${50 - (Math.abs(v) / maxAbs) * 50}%`,
                  width: stage === 0 ? `${(v / maxAbs) * 100}%` : `${(Math.abs(v) / maxAbs) * 50}%`,
                  background: v >= 0 ? "var(--hl-sky)" : "var(--hl-pink)",
                }}
              />
            </span>
            <span className="num val">{fmt(v)}</span>
          </div>
        ))}
      </div>
      <div className="lab-actions">
        <button className="btn" disabled={stage !== 0} onClick={() => setStage(1)}>
          ① 减去平均
        </button>
        <button className="btn" disabled={stage !== 1} onClick={() => setStage(2)}>
          ② 除以标准差
        </button>
        <button className="btn ghost" disabled={stage === 0} onClick={() => setStage(0)}>
          还原
        </button>
      </div>
      <p className="lab-tip">
        {stage === 0 && "柱子的长度就是原始分数。每组数字的大小都不一样。"}
        {stage === 1 && "中间的线就是平均。比平均高的在右边，低的在左边。"}
        {stage === 2 && "不管哪一组，大部分都落在 −2 到 +2 之间了。现在用的是同一把尺子。"}
      </p>
    </div>
  );
}
