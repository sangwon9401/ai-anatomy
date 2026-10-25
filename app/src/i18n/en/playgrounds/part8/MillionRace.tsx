import { useState } from "react";
import { SERVICES } from "../../../../data/ch78";
import "../../../../playgrounds/part8/style.css";

const MAX_GUESS = 1826; // about five years
const TRUE_DAYS = SERVICES.find((s) => s.name === "ChatGPT")!.days;
const MAX_DAYS = Math.max(...SERVICES.map((s) => s.days));
const daysOf = (v: number) => Math.max(1, Math.round(Math.pow(10, (v / 100) * Math.log10(MAX_GUESS))));
const friendly = (d: number) => (d < 60 ? `about ${d} day${d === 1 ? "" : "s"}` : d < 730 ? `about ${Math.round(d / 30.4)} months` : `about ${(d / 365).toFixed(1)} years`);

export function MillionRace() {
  const [v, setV] = useState(60);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState(false);
  const [usedLog, setUsedLog] = useState(false);
  const guess = daysOf(v);
  const ratio = guess / TRUE_DAYS;

  const width = (d: number) => (log ? (Math.log10(d) / Math.log10(MAX_DAYS)) * 100 : (d / MAX_DAYS) * 100);

  return (
    <div>
      <label className="p8-guess">
        <span>How long did ChatGPT take to reach 1 million users?</span>
        <span className="p8-big">{friendly(guess)}</span>
        <input type="range" min={0} max={100} step={1} value={v} disabled={revealed} aria-label="Guess the time it took" onChange={(e) => setV(Number(e.target.value))} />
        <span className="p8-ends" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
          <span>1 day</span>
          <span>about 5 years</span>
        </span>
      </label>
      {!revealed ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setRevealed(true)}>
            Show the answer
          </button>
        </div>
      ) : (
        <p className="lab-tip">
          Just {TRUE_DAYS} days!{" "}
          {ratio >= 1.5 ? `Your guess was ${Math.round(ratio)}× too long.` : ratio <= 0.67 ? `You guessed even faster than it really was!` : "Almost exactly right!"}
        </p>
      )}

      {revealed && (
        <>
          <div className="p8-seg" role="group" aria-label="Scale" style={{ marginTop: 14 }}>
            <button aria-pressed={!log} onClick={() => setLog(false)}>
              Normal scale
            </button>
            <button
              aria-pressed={log}
              onClick={() => {
                setLog(true);
                setUsedLog(true);
              }}
            >
              Log scale (ch. 70)
            </button>
          </div>
          <div className="p8-race" aria-label="Time to reach 1 million users">
            {SERVICES.map((s) => (
              <div className="p8-lane" key={s.name}>
                <span style={{ fontWeight: s.name === "ChatGPT" ? 700 : 400 }}>{s.name}</span>
                <span className="p8-track">
                  <span className="p8-fill" style={{ width: started ? `${width(s.days)}%` : 0, background: s.name === "ChatGPT" ? "var(--pen)" : "var(--hl-sky)" }} />
                </span>
                <span className="p8-when">{started ? s.label : ""}</span>
              </div>
            ))}
          </div>
          <div className="lab-actions">
            <button className="btn" onClick={() => setStarted(true)} disabled={started}>
              Go!
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setRevealed(false);
                setStarted(false);
              }}
            >
              Guess again
            </button>
          </div>
          {started && (
            <p className="lab-tip">
              {log
                ? "On a log scale, every 10× difference takes the same space (ch. 70). Even values as far apart as 5 days and 3.5 years fit in one picture."
                : "On the normal scale, ChatGPT's bar is so short you can barely see it. Switch to the log scale."}
            </p>
          )}
        </>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={revealed}>{revealed ? "○" : "□"} Guess the number of days and see the answer</li>
        <li data-done={usedLog && started}>{usedLog && started ? "○" : "□"} Watch the race on the log scale too</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        The other services' times are widely quoted estimates. Each service counted 'users' differently, so treat this as a rough comparison.
      </p>
    </div>
  );
}
