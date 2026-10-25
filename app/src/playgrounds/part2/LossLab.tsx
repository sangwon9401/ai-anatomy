import { useState } from "react";
import { GRADED } from "../../data/ch20";
import { num } from "../../data/part2-toy";
import "./style.css";

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
    { done: near(sum, 0) && mse > 0, text: "오차의 합은 0인데, 손실은 0이 아니게" },
    { done: near(mse, 0), text: "손실 0 만들기 (세 곳 모두 명중)" },
    { done: near(mae, 0.5) && near(mse, 0.75), text: "절댓값 평균 0.5, 손실 0.75 만들기" },
  ];
  let tip: string;
  if (near(mse, 0)) tip = "손실 0! 세 화살이 모두 과녁 한가운데예요. 실제 학습에서는 손잡이를 돌려서 이 숫자를 줄여요.";
  else if (missions[0].done) tip = "합은 0인데 손실은 0이 아니죠? +와 −가 지워졌을 뿐, 실제로는 틀렸어요. 그래서 제곱해요.";
  else if (missions[2].done) tip = "한 곳만 1.5점 틀렸더니 손실이 0.75! 세 곳이 0.5씩 틀리면 절댓값 평균은 똑같이 0.5지만 손실은 0.25예요. 제곱은 크게 틀린 걸 더 혼내요.";
  else tip = "슬라이더로 화살을 옮겨 보세요. 미션 3: 한 곳만 크게 틀리게 해 보면 어떨까요?";

  return (
    <div>
      <div className="p2-loss">
        {GRADED.map((g, i) => (
          <div className="p2-loss-row" key={g.name}>
            <div className="p2-loss-head num">
              <b>{g.name}</b> 예측 <b>{num(pred[i])}</b> · 진짜 {num(g.real)} · 오차 <span className="pen">{signed(errs[i])}</span> → 제곱 <b>{num(errs[i] ** 2, 4)}</b>
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
              aria-label={`${g.name} 예측 별점`}
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
          <span>오차의 합</span>
          <b>{signed(sum)}</b>
          <span>절댓값 평균</span>
          <b>{num(mae, 3)}</b>
          <span>손실 (제곱 평균)</span>
          <b className="p2-loss-big">{num(mse, 3)}</b>
        </div>
      </div>
      <p className="p2-note">과녁 = 친구들이 매긴 진짜 별점, 화살 = 예측이에요. 가게와 별점은 설명용 예시예요.</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {missions.map((m) => (
          <li key={m.text} data-done={m.done}>
            {m.done ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setPred(GRADED.map((g) => g.pred))}>
          16장 뉴런의 예측으로
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
