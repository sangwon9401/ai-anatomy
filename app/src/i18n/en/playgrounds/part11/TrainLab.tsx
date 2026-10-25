import { useEffect, useReducer, useRef, useState } from "react";
import { corpusByKey } from "../../../../data/part11-corpus";
import { MINI, paramCount, trainStep } from "../../../../playgrounds/part11/minigpt";
// the English store (it exports effectiveMerges); same module the other Part 11 labs get through the overlay
import { effectiveMerges, getCorpus, getMerges, getSession, newSession, writeLine, type Session } from "./store";
import "../../../../playgrounds/part11/style.css";

// when the model writes a line into the diary on its own
const DIARY_AT = new Set([50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
const MAX_GOAL = 5000;
/** milliseconds of training per animation frame, so the page stays responsive */
const BUDGET = 12;
const fmt = (n: number) => n.toLocaleString("en-US");
const lossNow = (s: Session) => s.history[s.history.length - 1];

function Chart({ s }: { s: Session }) {
  const W = 320;
  const H = 170;
  const x0 = 30;
  const y0 = 146;
  const top = Math.ceil(s.start);
  const maxStep = Math.max(s.goal, s.model.step);
  const X = (step: number) => x0 + (step / maxStep) * (W - x0 - 8);
  const Y = (loss: number) => y0 - (Math.min(loss, top) / top) * (y0 - 10);
  const h = s.history;
  const every = Math.max(1, Math.ceil(h.length / 300));
  let pts = "";
  for (let i = 0; i < h.length; i += every) pts += `${X(i * 10).toFixed(1)},${Y(h[i]).toFixed(1)} `;
  const last = h.length - 1;
  pts += `${X(last * 10).toFixed(1)},${Y(h[last]).toFixed(1)}`;
  const ticks = [0, Math.round(top / 3), Math.round((2 * top) / 3), top];
  return (
    <svg className="p11-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Loss graph: step ${fmt(s.model.step)}, loss ${lossNow(s).toFixed(2)}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0} y1={Y(t)} x2={W - 8} y2={Y(t)} stroke="var(--grid-major)" strokeWidth={1} />
          <text x={x0 - 6} y={Y(t) + 4} textAnchor="end" fontSize={10} fill="var(--ink-2)">
            {t}
          </text>
        </g>
      ))}
      <line x1={x0} y1={Y(s.start)} x2={W - 8} y2={Y(s.start)} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 3" />
      <text x={W - 10} y={Y(s.start) - 4} textAnchor="end" fontSize={9} fill="var(--ink-2)">
        random guess {s.start.toFixed(2)}
      </text>
      <line x1={x0} y1={y0} x2={W - 8} y2={y0} stroke="var(--ink)" strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0} y2={8} stroke="var(--ink)" strokeWidth={1.5} />
      <polyline points={pts} fill="none" stroke="var(--pen)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(last * 10)} cy={Y(h[last])} r={3.5} fill="var(--pen)" />
      <text x={x0} y={H - 6} fontSize={10} fill="var(--ink-2)">
        0
      </text>
      <text x={W - 8} y={H - 6} textAnchor="end" fontSize={10} fill="var(--ink-2)">
        {fmt(maxStep)} steps
      </text>
    </svg>
  );
}

export function TrainLab() {
  const corpus = corpusByKey(getCorpus());
  const merges = effectiveMerges().length;
  const own = getMerges().length > 0;
  const [session, setSession] = useState<Session | null>(getSession);
  const [running, setRunning] = useState(false);
  const [, redraw] = useReducer((x: number) => x + 1, 0);
  const sref = useRef(session);
  sref.current = session;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let lastDraw = 0;
    const tick = (now: number) => {
      const s = sref.current;
      if (!s) return;
      const t0 = performance.now();
      while (s.model.step < s.goal) {
        const loss = trainStep(s.model, s.work, s.sample);
        if (!Number.isFinite(loss)) {
          setRunning(false);
          redraw();
          return;
        }
        s.pending.push(loss);
        if (s.pending.length === 10) {
          s.history.push(s.pending.reduce((a, b) => a + b, 0) / 10);
          s.pending = [];
        }
        if (DIARY_AT.has(s.model.step)) s.diary.push({ step: s.model.step, loss: lossNow(s), text: writeLine(s) });
        if (performance.now() - t0 > BUDGET) break;
      }
      s.ms += performance.now() - t0;
      if (s.model.step >= s.goal) {
        setRunning(false);
        redraw();
        return;
      }
      if (now - lastDraw > 120) {
        lastDraw = now;
        redraw();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const start = () => {
    if (!sref.current) {
      const s = newSession();
      sref.current = s;
      setSession(s);
    }
    setRunning(true);
  };
  const restart = () => {
    setRunning(false);
    const s = newSession();
    sref.current = s;
    setSession(s);
  };
  const more = () => {
    const s = sref.current;
    if (!s) return;
    s.goal = Math.min(MAX_GOAL, s.goal + 1000);
    setRunning(true);
  };
  const writeNow = () => {
    const s = sref.current;
    if (!s) return;
    s.diary.push({ step: s.model.step, loss: lossNow(s), text: writeLine(s) });
    redraw();
  };

  const s = session;
  const step = s?.model.step ?? 0;
  const loss = s ? lossNow(s) : null;
  const sec = s ? s.ms / 1000 : 0;
  const lineSet = new Set(corpus.lines);
  const V = s ? s.tok.vocab.length : 0;
  const epochs = s ? (step * MINI.batch * MINI.T) / s.lines.reduce((a, l) => a + l.length + 1, 0) : 0;
  const done = !!s && step >= s.goal;

  let tip: string;
  if (!s) tip = own ? "Press 'Start training'. The loss starts at the random-guess level." : "Press 'Start training'. The loss starts at the random-guess level. You didn't build a tokenizer in chapter 93, so this uses the ready-made one with 300 merges (single letters say too little to learn English in a minute).";
  else if (running && step < 100) tip = "Right now it guesses any token at random. The loss will start falling soon.";
  else if (loss !== null && loss > 3) tip = "It's learning the most common pieces and the spaces first.";
  else if (loss !== null && loss > 2) tip = "Words will start to show up one by one. Watch the writing diary.";
  else if (loss !== null && loss > 1.2) tip = "Plausible lines are starting to appear, including new combinations that aren't in the data.";
  else tip = "The loss is very low now. Lines copied word for word from the data (memorized lines) show up often.";
  if (done) tip = s.goal >= MAX_GOAL ? `Reached step ${fmt(step)}! Let this model write in chapter 95.` : `Reached the goal of ${fmt(s.goal)} steps! Let this model write in chapter 95, or train it some more.`;

  return (
    <div>
      <div className="p11-setup">
        <span className="chip hl-yellow">{corpus.name}</span>
        <span className="chip hl-sky">{merges ? `BPE, ${merges} merges${own ? "" : " (ready-made)"}` : "1 token per character"}</span>
        {s && <span className="chip hl-mint">{fmt(paramCount(s.model.cfg))} knobs</span>}
      </div>

      <div className="lab-actions">
        {!running ? (
          <button className="btn" onClick={done ? more : start} disabled={done && s.goal >= MAX_GOAL}>
            {!s ? "Start training" : done ? "1,000 more steps" : "Keep training"}
          </button>
        ) : (
          <button className="btn" onClick={() => setRunning(false)}>
            Pause
          </button>
        )}
        <button className="btn ghost" onClick={writeNow} disabled={!s}>
          Write a line now
        </button>
        <button className="btn ghost" onClick={restart} disabled={!s}>
          Start over
        </button>
      </div>

      <dl className="p11-stats p11-stats4">
        <div>
          <dt>Steps</dt>
          <dd>{fmt(step)}</dd>
          <small>goal {fmt(s?.goal ?? 2000)}</small>
        </div>
        <div>
          <dt>Loss</dt>
          <dd>{loss === null ? "–" : loss.toFixed(2)}</dd>
          <small>{s ? `start ${s.history[0].toFixed(2)}` : "lower = better guesses"}</small>
        </div>
        <div>
          <dt>Training time</dt>
          <dd>{sec.toFixed(1)} s</dd>
          <small>{sec > 0.5 ? `${Math.round(step / sec)} steps a second` : "computed in your phone"}</small>
        </div>
        <div>
          <dt>Times through the data</dt>
          <dd>{epochs.toFixed(0)}</dd>
          <small>{MINI.batch} chunks × {MINI.T} tokens</small>
        </div>
      </dl>

      {s && <Chart s={s} />}

      {s && (
        <>
          <h4 className="p11-h4">Writing diary (temperature 0.8)</h4>
          <ol className="p11-diary">
            {[...s.diary].reverse().slice(0, 12).map((d, i) => (
              <li key={s.diary.length - i}>
                <span className="p11-diary-step num">
                  step {fmt(d.step)} · loss {d.loss.toFixed(2)}
                </span>
                <span className="p11-diary-text">{d.text || "(line break right away)"}</span>
                {lineSet.has(d.text) && <span className="p11-badge">memorized</span>}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {[3, 2, 1].map((t) => {
          const ok = !!s && s.history.some((v, i) => i > 0 && v < t);
          return (
            <li key={t} data-done={ok}>
              {ok ? "✓" : "○"} Loss below {t}
            </li>
          );
        })}
        <li data-done={!!s && s.diary.some((d) => lineSet.has(d.text))}>
          {s && s.diary.some((d) => lineSet.has(d.text)) ? "✓" : "○"} Write a line exactly as it is in the data (memorizing begins!)
        </li>
      </ul>
      <p className="lab-tip">{tip}</p>

      <details className="p11-arch">
        <summary>This mini GPT's blueprint</summary>
        {s ? (
          <ul>
            <li>
              Token embedding {fmt(V)}×{MINI.d} + position embedding {MINI.T}×{MINI.d} (ch. 33, 36)
            </li>
            <li>1 transformer block: layer norm → 1 self-attention head with the future masked → residual connection (ch. 45–51, 56–57)</li>
            <li>
              → layer norm → feed-forward {MINI.d}→{MINI.h}→{MINI.d} (GELU) → residual connection (ch. 55)
            </li>
            <li>layer norm → scores for {fmt(V)} kinds of tokens → softmax (ch. 60, 14). The output knobs are shared with the token embedding.</li>
            <li>Loss: cross-entropy (ch. 65) · going downhill: Adam (ch. 67), {MINI.batch} chunks per step</li>
          </ul>
        ) : (
          <p>Shown once you start training.</p>
        )}
      </details>
    </div>
  );
}
