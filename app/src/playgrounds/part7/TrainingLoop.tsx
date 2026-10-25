import { useState } from "react";
import { CANDS, LR, START_Z, STATIONS, blameOf, softmax66, surprise66 } from "../../data/ch66";
import { Gauge } from "./SurpriseMeter";
import "./style.css";

type St = { z: number[]; phase: number; lap: number; history: number[] };

const fresh = (): St => ({ z: [...START_Z], phase: 0, lap: 0, history: [] });
const f2 = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));
const sign = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : `+${v.toFixed(2)}`);
const HINT = ["먼저 ① 예측부터: 답을 내 봐야 틀렸는지 알 수 있어요.", "다음은 ② 손실: 얼마나 틀렸는지 재요.", "다음은 ③ 역전파: 누구 책임인지 나눠요.", "다음은 ④ 업데이트: 책임만큼 숫자를 고쳐요."];

export function TrainingLoop() {
  const [st, setSt] = useState<St>(fresh);
  const [target, setTarget] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const p = softmax66(st.z);
  const loss = surprise66(p[target]);
  const blame = blameOf(p, target);
  const best = st.history.length ? Math.min(...st.history) : loss;

  const press = (i: number) => {
    if (i !== st.phase) {
      setMsg(HINT[st.phase]);
      return;
    }
    setMsg(null);
    if (i < 3) setSt({ ...st, phase: i + 1 });
    else setSt({ z: st.z.map((v, k) => v - LR * blame[k]), phase: 0, lap: st.lap + 1, history: [...st.history, loss] });
  };
  const fullLap = () => {
    setMsg(null);
    setSt((s) => {
      const pp = softmax66(s.z);
      const b = blameOf(pp, target);
      return { z: s.z.map((v, k) => v - LR * b[k]), phase: 0, lap: s.lap + 1, history: [...s.history, surprise66(pp[target])] };
    });
  };
  const reset = (t = target) => {
    setTarget(t);
    setSt(fresh());
    setMsg(null);
  };

  const shown = st.phase; // how many stations of this lap are done
  const hist = [...st.history, ...(shown >= 2 ? [loss] : [])];
  const maxH = Math.max(4, ...hist);
  const last = hist.slice(-10);
  const step = last.length > 1 ? 250 / (last.length - 1) : 0;
  const pts = last.map((h, k) => ({ h, x: 30 + k * step, y: 100 - (h / maxH) * 85 }));

  let tip = msg ?? "";
  if (!msg) {
    if (st.lap === 0 && shown === 0) tip = "① 예측을 눌러 미니 모델이 답을 내게 해 보세요.";
    else if (shown === 1) tip = `${CANDS[target].w}에 ${(p[target] * 100).toFixed(1)}%를 줬어요. ② 손실로 얼마나 틀렸는지 재 볼까요?`;
    else if (shown === 2) tip = loss < 0.5 ? `놀람 ${loss.toFixed(2)}. 목표 달성! 0.5 아래로 내려왔어요. 계속 돌리면 더 줄어요.` : `놀람 ${loss.toFixed(2)}. ③ 역전파로 점수마다 책임을 나눠요.`;
    else if (shown === 3) tip = `${CANDS[target].w} 점수는 올리고, 나머지는 확률만큼 내려야 해요. ④ 업데이트!`;
    else if (best < 0.5) tip = `${st.lap}바퀴 완료. 놀람이 0.5 아래로 내려왔어요(최저 ${best.toFixed(2)}). 한 바퀴마다 조금씩 덜 놀라요.`;
    else tip = `${st.lap}바퀴 돌았어요. 다시 ① 예측부터, 한 바퀴 더!`;
  }

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="정답 고르기">
        <span className="muted" style={{ alignSelf: "center", fontSize: 14 }}>
          정답:
        </span>
        {CANDS.map((c, i) => (
          <button key={c.w} aria-pressed={target === i} onClick={() => reset(i)}>
            {c.w}
          </button>
        ))}
      </div>
      <div className="p7-loop" role="group" aria-label="훈련 고리">
        {STATIONS.map((s, i) => (
          <button key={s.n} className="p7-station" data-next={st.phase === i} data-done={i < st.phase} onClick={() => press(i)}>
            <b>{s.n}</b>
            <span>{s.ref}</span>
          </button>
        ))}
      </div>
      <p className="lab-sum num">
        {st.lap}바퀴 완료 · 학습률 {LR}
      </p>

      <div className="p7-loop-out">
        <div className="bars">
          {CANDS.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label" style={i === target ? { fontWeight: 700 } : undefined}>
                {c.w}
                {i === target ? " ✓" : ""}
              </span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: shown >= 1 ? `${p[i] * 100}%` : 0, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{shown >= 1 ? `${(p[i] * 100).toFixed(1)}%` : "?"}</span>
            </div>
          ))}
        </div>
        <table className="p7-table num">
          <thead>
            <tr>
              <th>후보</th>
              <th>점수</th>
              <th>책임</th>
            </tr>
          </thead>
          <tbody>
            {CANDS.map((c, i) => (
              <tr key={c.w}>
                <td>{c.w}</td>
                <td>{f2(st.z[i])}</td>
                <td className={shown >= 3 ? "pen" : "muted"}>{shown >= 3 ? sign(blame[i]) : "·"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <Gauge v={shown >= 2 ? loss : 0} max={4} label={shown >= 2 ? `놀람 ${loss.toFixed(2)}` : "놀람 아직 모름"} />
          <p className="p7-big" style={{ textAlign: "center", margin: 0 }}>
            놀람 {shown >= 2 ? loss.toFixed(2) : "?"}
          </p>
        </div>
        {hist.length > 0 && (
          <svg viewBox="0 0 300 120" className="p7-svg" role="img" aria-label={`바퀴마다 놀람: ${hist.map((h) => h.toFixed(2)).join(", ")}`}>
            <line x1={20} y1={100} x2={290} y2={100} stroke="var(--ink-3)" strokeWidth={1.5} />
            <text x={20} y={114} fontSize={10} fill="var(--ink-2)">
              바퀴마다 놀람
            </text>
            {pts.map((pt, k) => (
              <g key={k}>
                {k > 0 && <line x1={pts[k - 1].x} y1={pts[k - 1].y} x2={pt.x} y2={pt.y} stroke="var(--pen)" strokeWidth={2} />}
                <circle cx={pt.x} cy={pt.y} r={4} fill="var(--hl-pink)" stroke="var(--ink)" strokeWidth={1.5} />
                <text x={pt.x} y={pt.y - 8} fontSize={10} textAnchor="middle" fill="var(--ink)">
                  {pt.h.toFixed(2)}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      <div className="lab-actions">
        <button className="btn ghost" onClick={fullLap}>
          한 바퀴 자동
        </button>
        <button className="btn ghost" onClick={() => reset()}>
          처음부터
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">설명용 미니 모델이에요. 숫자가 점수 4개뿐이고, 책임 = 확률 − (정답이면 1, 아니면 0).</p>
    </div>
  );
}
