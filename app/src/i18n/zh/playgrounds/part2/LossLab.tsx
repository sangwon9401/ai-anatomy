import { useState } from "react";
import { GRADED } from "../../../../data/ch20";
import { num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const RX = (v: number) => 16 + v * 53.6;
const signed = (v: number) => (v > 0 ? `+${num(v)}` : num(v));

export function LossLab() {
  const [pred, setPred] = useState(GRADED.map((g) => g.pred));
  const errs = GRADED.map((g, i) => pred[i] - g.real);
  const sum = errs.reduce((a, e) => a + e, 0);
  const mae = errs.reduce((a, e) => a + Math.abs(e), 0) / errs.length;
  const mse = errs.reduce((a, e) => a + e * e, 0) / errs.length;
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

  const missions = [
    { done: near(sum, 0) && mse > 0, text: "误差之和是 0，损失却不是 0" },
    { done: near(mse, 0), text: "让损失变成 0（三家都命中）" },
    { done: near(mae, 0.5) && near(mse, 0.75), text: "让绝对值平均是 0.5、损失是 0.75" },
  ];
  let tip: string;
  if (near(mse, 0)) tip = "损失 0！三支箭都正中靶心。真正训练时，就是靠转动旋钮把这个数降下来。";
  else if (missions[0].done) tip = "和是 0，损失却不是 0 吧？只是正负抵消了，其实是错的。所以要平方。";
  else if (missions[2].done) tip = "只有一家错了 1.5 分，损失就是 0.75！如果三家各错 0.5，绝对值平均同样是 0.5，损失却只有 0.25。平方会把大错罚得更重。";
  else tip = "用滑块移动箭。任务 3：只让一家错得很多，会怎样？";

  return (
    <div>
      <div className="p2-loss">
        {GRADED.map((g, i) => (
          <div className="p2-loss-row" key={g.name}>
            <div className="p2-loss-head num">
              <b>{g.name}</b> 预测 <b>{num(pred[i])}</b> · 真实 {num(g.real)} · 误差 <span className="pen">{signed(errs[i])}</span> → 平方 <b>{num(errs[i] ** 2, 4)}</b>
            </div>
            <svg viewBox="0 0 300 40" className="p2-ruler" aria-hidden="true">
              <line x1={RX(0)} y1={26} x2={RX(5)} y2={26} stroke="var(--ink)" strokeWidth={1.5} />
              {[0, 1, 2, 3, 4, 5].map((v) => (
                <g key={v}>
                  <line x1={RX(v)} y1={22} x2={RX(v)} y2={30} stroke="var(--ink)" strokeWidth={1} />
                  <text x={RX(v)} y={39.5} textAnchor="middle" fontSize={8.5} fill="var(--ink-3)">
                    {v}
                  </text>
                </g>
              ))}
              <line x1={RX(pred[i])} y1={15} x2={RX(g.real)} y2={15} stroke="var(--pen)" strokeWidth={2} />
              <circle cx={RX(g.real)} cy={26} r={8} fill="var(--hl-pink)" stroke="var(--ink)" strokeWidth={1.2} />
              <circle cx={RX(g.real)} cy={26} r={3} fill="var(--pen)" />
              <path d={`M ${RX(pred[i])} 26 l -5 -11 l 10 0 Z`} fill="var(--ink)" />
              <line x1={RX(pred[i])} y1={15} x2={RX(pred[i])} y2={2} stroke="var(--ink)" strokeWidth={2} />
            </svg>
            <input
              type="range"
              min={0}
              max={5}
              step={0.25}
              value={pred[i]}
              aria-label={`${g.name}的预测评分`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPred((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
          </div>
        ))}
      </div>

      <div className="lab-out">
        <div className="p2-loss-sum num">
          <span>误差之和</span>
          <b>{signed(sum)}</b>
          <span>绝对值平均</span>
          <b>{num(mae, 3)}</b>
          <span>损失（平方的平均）</span>
          <b className="p2-loss-big">{num(mse, 3)}</b>
        </div>
      </div>
      <p className="p2-note">靶心 = 朋友们打的真实评分，箭 = 预测。店和评分都是示意数据。</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {missions.map((m) => (
          <li key={m.text} data-done={m.done}>
            {m.done ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setPred(GRADED.map((g) => g.pred))}>
          用第 16 章神经元的预测
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
