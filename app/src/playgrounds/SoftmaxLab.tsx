import { useState } from "react";
import { SCORES, softmax } from "../data/ch14";

const START = SCORES.map((s) => s.s);

export function SoftmaxLab() {
  const [scores, setScores] = useState(START);
  const [tip, setTip] = useState("한 점수만 크게 올려 보세요. 확률이 한쪽으로 쏠려요.");
  const { ex, sum, p } = softmax(scores);
  const canShift = scores.every((s) => s <= 5);

  return (
    <div>
      <div className="lab-rows">
        {SCORES.map((c, i) => (
          <div className="lab-row" key={c.w}>
            <span className={`chip hl-${c.c}`}>{c.w}</span>
            <input
              id={`score-${i}`}
              type="range"
              min={-4}
              max={6}
              step={0.1}
              value={scores[i]}
              aria-label={`${c.w} 점수`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setScores((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
            <span className="val">{scores[i].toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div className="lab-out">
        <div className="bars">
          {SCORES.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label">{c.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{(p[i] * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          e<sup>점수</sup> = {ex.map((e) => e.toFixed(2)).join(", ")} → 합 {sum.toFixed(2)} → 확률 합 100%
        </div>
      </div>

      <div className="lab-actions">
        <button
          className="btn ghost"
          disabled={!canShift}
          onClick={() => {
            setScores((prev) => prev.map((x) => Math.round((x + 1) * 10) / 10));
            setTip("확률이 그대로죠? 모든 점수에 같은 수를 더해도 결과는 같아요. 점수끼리의 차이만 중요해요.");
          }}
        >
          모든 점수 +1
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setTip("한 점수만 크게 올려 보세요. 확률이 한쪽으로 쏠려요.");
          }}
        >
          처음 값으로
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
