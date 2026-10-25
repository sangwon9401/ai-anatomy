import { useState } from "react";
import { SCORES, softmax } from "../../../data/ch14";

const START = SCORES.map((s) => s.s);

export function SoftmaxLab() {
  const [scores, setScores] = useState(START);
  const [tip, setTip] = useState("只把一个分数调高试试，概率会一下子偏向它。");
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
              aria-label={`${c.w}的分数`}
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
          e<sup>分数</sup> = {ex.map((e) => e.toFixed(2)).join(", ")} → 总和 {sum.toFixed(2)} → 概率总和 100%
        </div>
      </div>

      <div className="lab-actions">
        <button
          className="btn ghost"
          disabled={!canShift}
          onClick={() => {
            setScores((prev) => prev.map((x) => Math.round((x + 1) * 10) / 10));
            setTip("概率没变吧？所有分数加上同一个数，结果都一样。只有分数之间的差距才重要。");
          }}
        >
          所有分数 +1
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setScores(START);
            setTip("只把一个分数调高试试，概率会一下子偏向它。");
          }}
        >
          恢复初始值
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
