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
    { done: near(sum, 0) && mse > 0, text: "誤差の合計は0なのに、損失は0でないようにする" },
    { done: near(mse, 0), text: "損失を0にする（3軒とも命中）" },
    { done: near(mae, 0.5) && near(mse, 0.75), text: "絶対値の平均0.5、損失0.75にする" },
  ];
  let tip: string;
  if (near(mse, 0)) tip = "損失0！3本の矢がすべて的のど真ん中です。実際の学習では、つまみを回してこの数字を減らします。";
  else if (missions[0].done) tip = "合計は0なのに損失は0ではありませんね？+と−が打ち消し合っただけで、実際はまちがえています。だから2乗するのです。";
  else if (missions[2].done) tip = "1軒だけ1.5点まちがえたら損失は0.75！3軒が0.5ずつまちがえても絶対値の平均は同じ0.5ですが、損失は0.25です。2乗は大きなまちがいをより強くしかります。";
  else tip = "スライダーで矢を動かしてみましょう。ミッション3：1軒だけ大きくまちがえさせてみたら？";

  return (
    <div>
      <div className="p2-loss">
        {GRADED.map((g, i) => (
          <div className="p2-loss-row" key={g.name}>
            <div className="p2-loss-head num">
              <b>{g.name}</b> 予想 <b>{num(pred[i])}</b> · 本当 {num(g.real)} · 誤差 <span className="pen">{signed(errs[i])}</span> → 2乗 <b>{num(errs[i] ** 2, 4)}</b>
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
              aria-label={`${g.name}の予想の星`}
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
          <span>誤差の合計</span>
          <b>{signed(sum)}</b>
          <span>絶対値の平均</span>
          <b>{num(mae, 3)}</b>
          <span>損失（2乗の平均）</span>
          <b className="p2-loss-big">{num(mse, 3)}</b>
        </div>
      </div>
      <p className="p2-note">的 = 友だちがつけた本当の星、矢 = 予想です。店と星は説明用の例です。</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {missions.map((m) => (
          <li key={m.text} data-done={m.done}>
            {m.done ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setPred(GRADED.map((g) => g.pred))}>
          第16章のニューロンの予想に戻す
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
