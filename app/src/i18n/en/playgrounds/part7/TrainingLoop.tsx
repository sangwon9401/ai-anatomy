import { useState } from "react";
import { CANDS, LR, START_Z, STATIONS, blameOf, softmax66, surprise66 } from "../../../../data/ch66";
import { Gauge } from "../../../../playgrounds/part7/SurpriseMeter";
import "../../../../playgrounds/part7/style.css";

type St = { z: number[]; phase: number; lap: number; history: number[] };

const fresh = (): St => ({ z: [...START_Z], phase: 0, lap: 0, history: [] });
const f2 = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));
const sign = (v: number) => (v < 0 ? `−${Math.abs(v).toFixed(2)}` : `+${v.toFixed(2)}`);
const HINT = ["① Predict comes first: you can't know it's wrong until it answers.", "Next is ② Loss: measure how wrong it was.", "Next is ③ Backprop: share out the blame.", "Next is ④ Update: fix each number by its blame."];

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
    if (st.lap === 0 && shown === 0) tip = "Press ① Predict to make the mini model answer.";
    else if (shown === 1) tip = `It gave ${CANDS[target].w} ${(p[target] * 100).toFixed(1)}%. Shall we measure how wrong that is with ② Loss?`;
    else if (shown === 2) tip = loss < 0.5 ? `Surprise ${loss.toFixed(2)}. Goal reached: it's below 0.5! Keep going and it shrinks further.` : `Surprise ${loss.toFixed(2)}. Use ③ Backprop to share the blame among the scores.`;
    else if (shown === 3) tip = `${CANDS[target].w}'s score goes up, and the others go down by their probabilities. ④ Update!`;
    else if (best < 0.5) tip = `Lap ${st.lap} done. The surprise is below 0.5 (lowest ${best.toFixed(2)}). Each lap, it's a little less surprised.`;
    else tip = `Lap ${st.lap} done. Back to ① Predict for another lap!`;
  }

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="Choose the right answer">
        <span className="muted" style={{ alignSelf: "center", fontSize: 14 }}>
          Answer:
        </span>
        {CANDS.map((c, i) => (
          <button key={c.w} aria-pressed={target === i} onClick={() => reset(i)}>
            {c.w}
          </button>
        ))}
      </div>
      <div className="p7-loop" role="group" aria-label="Training loop">
        {STATIONS.map((s, i) => (
          <button key={s.n} className="p7-station" data-next={st.phase === i} data-done={i < st.phase} onClick={() => press(i)}>
            <b>{s.n}</b>
            <span>{s.ref}</span>
          </button>
        ))}
      </div>
      <p className="lab-sum num">
        Laps done: {st.lap} · learning rate {LR}
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
              <th>Word</th>
              <th>Score</th>
              <th>Blame</th>
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
          <Gauge v={shown >= 2 ? loss : 0} max={4} label={shown >= 2 ? `Surprise ${loss.toFixed(2)}` : "Surprise not measured yet"} />
          <p className="p7-big" style={{ textAlign: "center", margin: 0 }}>
            Surprise {shown >= 2 ? loss.toFixed(2) : "?"}
          </p>
        </div>
        {hist.length > 0 && (
          <svg viewBox="0 0 300 120" className="p7-svg" role="img" aria-label={`Surprise after each lap: ${hist.map((h) => h.toFixed(2)).join(", ")}`}>
            <line x1={20} y1={100} x2={290} y2={100} stroke="var(--ink-3)" strokeWidth={1.5} />
            <text x={20} y={114} fontSize={10} fill="var(--ink-2)">
              Surprise per lap
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
          One lap, automatic
        </button>
        <button className="btn ghost" onClick={() => reset()}>
          Start over
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">An illustrative mini model: its only numbers are 4 scores, and blame = probability − (1 if it's the answer, else 0).</p>
    </div>
  );
}
