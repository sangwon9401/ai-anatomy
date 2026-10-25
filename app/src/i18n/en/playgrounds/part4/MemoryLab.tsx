// en: overlay of src/playgrounds/part4/MemoryLab.tsx (strings only)
import { useEffect, useState } from "react";
import { VERBS, predictVerb, rnnRun } from "../../../../data/ch40";
import { lstmRun, sentenceWith } from "../../../../data/ch41";
import "../../../../playgrounds/part4/style.css";

type Mode = "rnn" | "lstm";
const MAX_MIDDLE = 40;
const TICK_MS = 140;

export function MemoryLab() {
  const [middle, setMiddle] = useState(2);
  const [mode, setMode] = useState<Mode>("rnn");
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const words = sentenceWith(middle);
  const rnn = rnnRun(words).map((n) => n.h[0]);
  const lstm = lstmRun(words).map((n) => n.h[0]);
  const lastH = mode === "rnn" ? rnnRun(words)[words.length - 1].h : lstmRun(words)[words.length - 1].h;
  const probs = predictVerb(lastH);
  const top = probs.indexOf(Math.max(...probs));

  const update = (m: number, md: Mode) => {
    setMiddle(m);
    setMode(md);
    const w = sentenceWith(m);
    const h = md === "rnn" ? rnnRun(w)[w.length - 1].h : lstmRun(w)[w.length - 1].h;
    const p = predictVerb(h);
    const t = p.indexOf(Math.max(...p));
    const rnnTop = (() => {
      const q = predictVerb(rnnRun(w)[w.length - 1].h);
      return q.indexOf(Math.max(...q));
    })();
    const now = [md === "rnn" && t !== 0, md === "lstm" && t === 0 && rnnTop !== 0, md === "lstm" && t !== 0];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  // the queue race
  const total = words.length;
  const [race, setRace] = useState<number | null>(null);
  const [tick, setTick] = useState(-1);
  useEffect(() => {
    if (race === null) return;
    let id = 0;
    const loop = (now: number) => {
      const k = Math.floor((now - race) / TICK_MS);
      setTick(k);
      if (k <= total) id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [race, total]);
  const raceDone = race !== null && tick >= total;

  const W = 320;
  const bw = (W - 20) / total;
  const shown = words.length <= 7 ? words : [...words.slice(0, 3), `… ${words.length - 5} more …`, ...words.slice(-2)];

  const missions = [
    "Find the length where the RNN starts picking 'go'",
    "At that length, switch to LSTM and bring 'went' back",
    "Find a length where even the LSTM loses 'Yesterday'",
  ];
  const tip =
    top === 0
      ? `'Yesterday' is still on the note at ${Math.abs(lastH[0]).toFixed(2)}, so it picked 'went'.`
      : `'Yesterday' on the note faded to ${Math.abs(lastH[0]).toFixed(2)}, so it picked '${VERBS[top].w}'. The right answer is 'went'!`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="Pick a model">
        <button aria-pressed={mode === "rnn"} onClick={() => update(middle, "rnn")}>
          RNN
        </button>
        <button aria-pressed={mode === "lstm"} onClick={() => update(middle, "lstm")}>
          LSTM (storage box)
        </button>
      </div>

      <div className="lab-row" style={{ marginTop: 14, gridTemplateColumns: "6.4em minmax(0, 1fr) 3em" }}>
        <span>Words between</span>
        <input type="range" min={0} max={MAX_MIDDLE} step={1} value={middle} aria-label="Number of words between 'Yesterday' and 'I'" onChange={(e) => update(Number(e.target.value), mode)} />
        <span className="val">{middle}</span>
      </div>

      <div className="p4-sentence" style={{ marginTop: 8 }} aria-label={`Sentence: ${words.join(" ")}. What comes next?`}>
        {shown.map((w, i) => (
          <span key={i} className={`chip ${w === "Yesterday" && i === 0 ? "hl-mint" : w.startsWith("…") ? "hl-none" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">Strength of 'Yesterday' on the note</h4>
          <svg viewBox={`0 0 ${W} 130`} style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`At the last cell: RNN ${Math.abs(rnn[total - 1]).toFixed(2)}, LSTM ${Math.abs(lstm[total - 1]).toFixed(2)}`}>
            <line x1={10} y1={112} x2={W - 10} y2={112} stroke="var(--ink-3)" strokeWidth={1.5} />
            {words.map((_, i) => (
              <g key={i}>
                <rect x={10 + i * bw + bw * 0.1} y={112 - Math.abs(rnn[i]) * 100} width={bw * 0.38} height={Math.abs(rnn[i]) * 100} fill="var(--hl-sky)" opacity={mode === "rnn" ? 1 : 0.45} />
                <rect x={10 + i * bw + bw * 0.52} y={112 - Math.abs(lstm[i]) * 100} width={bw * 0.38} height={Math.abs(lstm[i]) * 100} fill="var(--hl-mint)" opacity={mode === "lstm" ? 1 : 0.45} />
              </g>
            ))}
            <text x={12} y={126} fontSize={10} fill="var(--ink-2)">
              Yesterday
            </text>
            <text x={W - 12} y={126} fontSize={10} fill="var(--ink-2)" textAnchor="end">
              I
            </text>
          </svg>
          <ul className="legend" style={{ marginTop: 4 }}>
            <li>
              <span className="swatch" style={{ background: "var(--hl-sky)" }} />
              RNN
            </li>
            <li>
              <span className="swatch" style={{ background: "var(--hl-mint)" }} />
              LSTM
            </li>
          </ul>
        </div>
        <div>
          <h4 className="p4-h4">Next word guessed by the {mode === "rnn" ? "RNN" : "LSTM"}</h4>
          <div className="bars">
            {VERBS.map((v, i) => (
              <div className="bar-row" key={v.w}>
                <span className="label" style={{ fontWeight: i === top ? 700 : 400 }}>
                  {v.w}
                </span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${probs[i] * 100}%`, background: `var(--hl-${v.c})` }} />
                </span>
                <span className="val">{Math.round(probs[i] * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m, i) => (
          <li key={m} data-done={seen[i]}>
            {seen[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>

      <div className="p4-box">
        <h4>Waiting-in-line race: computing {total} cells</h4>
        <div className="p4-race" aria-hidden="true">
          <span className="p4-race-label">RNN</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null ? "idle" : i < tick ? "done" : i === tick ? "now" : "idle"} />
            ))}
          </span>
          <span className="p4-race-label">at once</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null || tick < 0 ? "idle" : tick === 0 ? "now" : "par"} />
            ))}
          </span>
        </div>
        <p className="p4-note" aria-live="polite">
          {race === null
            ? "Press Start and both ways compute the cells."
            : raceDone
              ? `All at once finished in one go, but the RNN had to wait through ${total} turns in a row.`
              : `RNN: ${Math.max(0, Math.min(tick, total))} / ${total} cells · at once: ${tick >= 1 ? total : 0} / ${total} cells`}
        </p>
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button
            className="btn ghost"
            onClick={() => {
              setTick(-1);
              setRace(performance.now());
            }}
          >
            {race === null ? "Start" : "Start again"}
          </button>
        </div>
      </div>
      <p className="p4-note">* An illustrative toy model. The RNN copies its note at 0.8× each step; the LSTM's storage box at 0.95×.</p>
    </div>
  );
}
