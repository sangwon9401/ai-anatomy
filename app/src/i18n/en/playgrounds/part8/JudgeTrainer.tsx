import { useEffect, useRef, useState } from "react";
import { ROUNDS } from "../../../../data/ch74";
import { FEATURES, PAIRS, TEST, TRAIN_STEPS, W0, scoreOf, trainStep, type Scored } from "../../../../data/ch75";
import "../../../../playgrounds/part8/style.css";

const TAGS = ["answers", "reason/how-to", "wrong/harmful"];
const AUTO_STEPS = TRAIN_STEPS;
const fmt = (v: number) => (Math.abs(v) < 0.05 ? "0.0" : v < 0 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const shortOf = (q: number, id: string) => ROUNDS[q].answers.find((a) => a.id === id)?.short ?? id;

const Tags = ({ f }: { f: number[] }) => (
  <span className="p8-feat">
    {f.map((x, i) => (
      <span key={i} className={x ? `on${i === 2 ? " neg" : ""}` : ""}>
        {TAGS[i]}
      </span>
    ))}
  </span>
);

export function JudgeTrainer() {
  const [w, setW] = useState<number[]>(W0);
  const [steps, setSteps] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const ok = PAIRS.filter((p) => scoreOf(w, p.better.f) > scoreOf(w, p.worse.f)).length;
  const ranked = [...TEST.answers].map((a) => ({ ...a, s: scoreOf(w, a.f) })).sort((a, b) => b.s - a.s);

  const auto = () => {
    cancelAnimationFrame(raf.current);
    setRunning(true);
    let n = 0;
    const tick = () => {
      setW((v) => trainStep(v));
      setSteps((s) => s + 1);
      n += 1;
      if (n < AUTO_STEPS) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const cell = (q: number, a: Scored) => (
    <span style={{ minWidth: 0 }}>
      <b>{a.id}</b> {shortOf(q, a.id)} <b className="num">({fmt(scoreOf(w, a.f))})</b>
      <Tags f={a.f} />
    </span>
  );

  return (
    <div>
      <h4 className="p8-h4" style={{ marginTop: 0 }}>
        The grader's weights {steps > 0 && <span className="muted">· practice rounds: {steps}</span>}
      </h4>
      <div className="p8-weights">
        {FEATURES.map((name, i) => (
          <label className="p8-weight" key={name}>
            <span>
              {name} <span className="muted">× weight</span>
            </span>
            <b>{fmt(w[i])}</b>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={w[i]}
              disabled={running}
              aria-label={`${name} weight`}
              onChange={(e) => setW(w.map((x, k) => (k === i ? Number(e.target.value) : x)))}
            />
          </label>
        ))}
      </div>
      <p className="lab-sum" style={{ margin: "8px 0 0" }}>
        Score = the sum of the weights of the features the answer has
      </p>

      <h4 className="p8-h4">
        Pairs chosen by people (ch. 74) · correct: <b className="num">{ok}</b> of {PAIRS.length}
      </h4>
      <div className="p8-scored">
        {PAIRS.map((p, i) => {
          const good = scoreOf(w, p.better.f) > scoreOf(w, p.worse.f);
          return (
            <div className="p8-srow" key={i} style={{ gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr) 1.4em" }}>
              {cell(p.q, p.better)}
              <span className="p8-gt" style={{ fontWeight: 700 }}>
                &gt;
              </span>
              {cell(p.q, p.worse)}
              <span className={`p8-ok ${good ? "" : "bad"}`} aria-label={good ? "correct" : "wrong"}>
                {good ? "○" : "×"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={auto} disabled={running}>
          Learn automatically ({AUTO_STEPS} rounds)
        </button>
        <button className="btn ghost" onClick={() => {
            setW(trainStep(w));
            setSteps((n) => n + 1);
          }}
          disabled={running}
        >
          Practice once
        </button>
        <button
          className="btn ghost"
          disabled={running}
          onClick={() => {
            setW(W0);
            setSteps(0);
          }}
        >
          Back to the first grader
        </button>
      </div>

      <p className="lab-tip">
        {ok === PAIRS.length
          ? "All 6 pairs: the higher score went to the same answer people chose! See how the 'wrong/harmful' weight turned negative? That feature now costs points."
          : "Look at the pairs marked ×. Raise the weights of features only the better answer has, and lower the ones only the worse answer has."}
      </p>

      <h4 className="p8-h4">A new question: {TEST.q}</h4>
      <div className="p8-scored">
        {ranked.map((a, i) => (
          <div className="p8-srow" key={a.id} style={{ gridTemplateColumns: "1.6em minmax(0, 1fr) 3.4em" }}>
            <span className="p8-ok">{i + 1}</span>
            <span>
              {a.text}
              <Tags f={a.f} />
            </span>
            <span className="p8-num">{fmt(a.s)}</span>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        This toy grader looks at only three features. A real reward model scores with countless features its transformer finds on its own. The scores are illustrative examples.
      </p>
    </div>
  );
}
