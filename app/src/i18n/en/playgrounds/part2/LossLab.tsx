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
    { done: near(sum, 0) && mse > 0, text: "Make the sum of errors 0, but the loss not 0" },
    { done: near(mse, 0), text: "Make the loss 0 (all three hit the bullseye)" },
    { done: near(mae, 0.5) && near(mse, 0.75), text: "Make the mean absolute error 0.5 and the loss 0.75" },
  ];
  let tip: string;
  if (near(mse, 0)) tip = "Loss 0! All three darts are in the bullseye. In real learning, turning the knobs is what shrinks this number.";
  else if (missions[0].done) tip = "The sum is 0 but the loss isn't, right? The + and − just canceled out; the guesses are still wrong. That's why we square.";
  else if (missions[2].done) tip = "One truck off by 1.5 makes the loss 0.75! If all three were off by 0.5, the mean absolute error would also be 0.5, but the loss only 0.25. Squaring punishes big misses more.";
  else tip = "Move the darts with the sliders. Mission 3: what if just one truck is way off?";

  return (
    <div>
      <div className="p2-loss">
        {GRADED.map((g, i) => (
          <div className="p2-loss-row" key={g.name}>
            <div className="p2-loss-head num">
              <b>{g.name}</b> guess <b>{num(pred[i])}</b> · real {num(g.real)} · error <span className="pen">{signed(errs[i])}</span> → squared <b>{num(errs[i] ** 2, 4)}</b>
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
              aria-label={`${g.name} predicted rating`}
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
          <span>Sum of errors</span>
          <b>{signed(sum)}</b>
          <span>Mean absolute error</span>
          <b>{num(mae, 3)}</b>
          <span>Loss (mean of squares)</span>
          <b className="p2-loss-big">{num(mse, 3)}</b>
        </div>
      </div>
      <p className="p2-note">Target = the real rating from friends, dart = the guess. The trucks and ratings are an illustrative example.</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {missions.map((m) => (
          <li key={m.text} data-done={m.done}>
            {m.done ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setPred(GRADED.map((g) => g.pred))}>
          Use the ch. 16 neuron's guesses
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
