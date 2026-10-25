import { useEffect, useRef, useState } from "react";
import { percents } from "../../../../data/ch45";
import { KINDS, LEASH, QUESTION, drift, mean, tuned } from "../../../../data/ch76";
import "../../../../playgrounds/part8/style.css";

const TRAIN_MS = 1300;
const BEST = 3; // "Just right"
const sgn = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : "0");
const fmt = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

export function LeashLab() {
  const [leash, setLeash] = useState(0);
  const [t, setT] = useState(0);
  const [tried, setTried] = useState<Record<number, number>>({});
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const beta = LEASH[leash].beta;
  const p = tuned(beta, t);
  const pct = percents(p);
  const p0 = KINDS.map((k) => k.p0);
  const judge = mean(p, KINDS.map((k) => k.judge));
  const human = mean(p, KINDS.map((k) => k.human));
  const humanStart = mean(p0, KINDS.map((k) => k.human));
  const done = t >= 1;
  const running = t > 0 && t < 1;
  const bestTried = Object.entries(tried).sort((a, b) => b[1] - a[1])[0];

  const train = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / TRAIN_MS);
      setT(x);
      if (x < 1) raf.current = requestAnimationFrame(tick);
      else setTried((r) => ({ ...r, [leash]: mean(tuned(beta), KINDS.map((k) => k.human)) }));
    };
    raf.current = requestAnimationFrame(tick);
  };

  const tip = !done
    ? running
      ? "Moving toward the answers the grader scores highly…"
      : "Pick a leash length and press 'Practice'. The dotted lines are the original model (ch. 73)."
    : leash >= 5
      ? "The grader's score is the highest, but people's satisfaction actually dropped. The leash was too long, so it rushed to the 'just flattery' answer."
      : leash <= 1
        ? "It's almost the same as the original model. The leash was too short to leave room to improve."
        : leash === BEST
          ? "You found the balance! Kind, detailed answers grew a lot and strange ones only a little. People's satisfaction is highest."
          : "Not bad. Make the leash one step longer or shorter and compare people's satisfaction.";

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        Question: {QUESTION}
      </p>
      <label className="p8-range">
        <span>Leash length</span>
        <b>{LEASH[leash].name}</b>
        <input
          type="range"
          min={0}
          max={LEASH.length - 1}
          step={1}
          value={leash}
          disabled={running}
          aria-label="Leash length"
          onChange={(e) => {
            setLeash(Number(e.target.value));
            setT(0);
          }}
        />
        <span className="p8-ends">
          <span>Short: near the original</span>
          <span>Long: chasing the score</span>
        </span>
      </label>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || done}>
          {done ? "Practice done" : "Practice"}
        </button>
        {done && (
          <button className="btn ghost" onClick={() => setT(0)}>
            Before practice
          </button>
        )}
      </div>

      <div className="p8-dist">
        {KINDS.map((k, i) => (
          <div className="p8-drow" key={k.short}>
            <span className="p8-txt">
              <b>{k.short}</b> <small>{k.excerpt}</small>
              <br />
              <small>
                grader {sgn(k.judge)} · people {sgn(k.human)}
              </small>
            </span>
            <span className="p8-twin" aria-hidden="true">
              <span className="p8-now" style={{ width: `${p[i] * 100}%`, background: i === 3 ? "var(--hl-pink)" : "var(--hl-yellow)" }} />
              <span className="p8-ghost" style={{ width: `${k.p0 * 100}%` }} />
            </span>
            <span className="p8-val">{pct[i]}%</span>
          </div>
        ))}
      </div>

      <div className="p8-stats">
        <div className="p8-stat">
          Grader's average score<b>{fmt(judge)}</b>
        </div>
        <div className="p8-stat">
          People's average satisfaction<b>{fmt(human)}</b>
        </div>
        <div className="p8-stat" style={{ gridColumn: "1 / -1" }}>
          Drift from the original model (KL)
          <span className="p8-track" style={{ display: "block", marginTop: 6 }}>
            <span className="p8-fill" style={{ width: `${Math.min(1, drift(p) / 3) * 100}%`, background: "var(--pen)" }} />
          </span>
        </div>
      </div>

      <p className="lab-tip">{tip}</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={Object.keys(tried).length >= 3}>
          {Object.keys(tried).length >= 3 ? "○" : "□"} Practice with at least three leash lengths ({Object.keys(tried).length}/3)
        </li>
        <li data-done={tried[BEST] !== undefined}>
          {tried[BEST] !== undefined ? "○" : "□"} Find the length with the highest satisfaction (original model: {fmt(humanStart)})
        </li>
      </ul>
      {bestTried && (
        <p className="lab-sum" style={{ margin: "6px 0 0" }}>
          Best length so far: {LEASH[Number(bestTried[0])].name} (satisfaction {fmt(bestTried[1])})
        </p>
      )}
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        The scores and probabilities are illustrative examples. It shows where the model settles once practice is over. The dotted lines are the original model's probabilities.
      </p>
    </div>
  );
}
