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
      <div className="ctx-presets" role="group" aria-label="点数のまとまりを選ぶ">
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
        平均 {fmt(mean)} · 標準偏差 {fmt(sd)}
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
          ① 平均を引く
        </button>
        <button className="btn" disabled={stage !== 1} onClick={() => setStage(2)}>
          ② 標準偏差で割る
        </button>
        <button className="btn ghost" disabled={stage === 0} onClick={() => setStage(0)}>
          元に戻す
        </button>
      </div>
      <p className="lab-tip">
        {stage === 0 && "棒の長さは点数そのままです。まとまりごとに大きさがばらばらですね。"}
        {stage === 1 && "真ん中の線が平均です。平均より高ければ右、低ければ左。"}
        {stage === 2 && "どのまとまりも、ほとんどが−2から+2の間に集まりました。これで同じものさしです。"}
      </p>
    </div>
  );
}
