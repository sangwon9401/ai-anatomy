import { useState } from "react";
import { DATASETS, stats } from "../data/ch15";

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
      <div className="ctx-presets" role="group" aria-label="점수 묶음 고르기">
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
        평균 {fmt(mean)} · 표준편차 {fmt(sd)}
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
          ① 평균 빼기
        </button>
        <button className="btn" disabled={stage !== 1} onClick={() => setStage(2)}>
          ② 표준편차로 나누기
        </button>
        <button className="btn ghost" disabled={stage === 0} onClick={() => setStage(0)}>
          되돌리기
        </button>
      </div>
      <p className="lab-tip">
        {stage === 0 && "막대 길이는 점수 그대로예요. 묶음마다 크기가 제각각이죠."}
        {stage === 1 && "가운데 선이 평균이에요. 평균보다 높으면 오른쪽, 낮으면 왼쪽."}
        {stage === 2 && "어떤 묶음이든 대부분 −2에서 +2 사이로 모였어요. 이제 같은 잣대예요."}
      </p>
    </div>
  );
}
