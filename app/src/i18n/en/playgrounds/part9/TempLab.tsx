import { useState } from "react";
import { SCORES81 } from "../../../../data/ch81";
import { TOY_PROMPT, generate, oddMask, softmaxT } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const SC = SCORES81.map((s) => s.s);
const PRESETS = [0, 0.5, 1, 2, 3];
const fmt = (v: number) => (v < -0.005 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const pct = (p: number) => (p > 0 && p < 0.001 ? "under 0.1%" : `${(p * 100).toFixed(1)}%`);

type Run = { pieces: string[]; odd: boolean[] };

export function TempLab() {
  const [t, setT] = useState(1);
  const [runs, setRuns] = useState<{ t: number; list: Run[] } | null>(null);
  const [done, setDone] = useState({ same: false, diff: false, pizza: false });
  const p = softmaxT(SC, t);

  const write = () => {
    const list = Array.from({ length: 5 }, () => {
      const pieces = generate(t, Math.random);
      return { pieces, odd: oddMask(pieces) };
    });
    setRuns({ t, list });
    const uniq = new Set(list.map((r) => r.pieces.join(" "))).size;
    setDone((d) => ({
      same: d.same || uniq === 1,
      diff: d.diff || uniq === 5,
      pizza: d.pizza || list.some((r) => r.pieces[0] === "pizza"),
    }));
  };

  const uniq = runs ? new Set(runs.list.map((r) => r.pieces.join(" "))).size : 0;
  const oddRuns = runs ? runs.list.filter((r) => r.odd.some(Boolean)).length : 0;

  const tip =
    t === 0
      ? "We agree that temperature 0 means greedy. First place gets 100%, so the sentence is the same every time."
      : t < 0.6
        ? "Sharp. 'school' takes almost everything. The sentences will look alike too."
        : t <= 1.3
          ? "A normal temperature. First place is picked often, but other words show up quite a bit."
          : "Flat. Low candidates like pizza shoot up. You'll get more strange sentences.";

  return (
    <div>
      <div className="lab-row">
        <span>Temp</span>
        <input type="range" min={0} max={3} step={0.1} value={t} aria-label="Temperature" onChange={(e) => setT(Number(e.target.value))} />
        <span className="val">{t.toFixed(1)}</span>
      </div>
      <div className="p9-seg" role="group" aria-label="Quick temperature presets" style={{ marginTop: 8 }}>
        {PRESETS.map((v) => (
          <button key={v} aria-pressed={Math.abs(t - v) < 0.05} onClick={() => setT(v)}>
            {v === 0 ? "0 (greedy)" : v.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="lab-out">
        <div className="bars">
          {SCORES81.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label">{c.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{pct(p[i])}</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          {t === 0 ? "Temperature 0 → no dividing, first place gets 100%" : `score ÷ ${t.toFixed(1)} = ${SC.map((s) => fmt(s / t)).join(", ")} → softmax`}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={write}>
          Write 5 sentences at this temperature
        </button>
      </div>

      {runs && (
        <>
          <p className="p9-note" style={{ marginTop: 12 }}>
            Written at temperature {runs.t.toFixed(1)} · {uniq} different · {oddRuns} with a strange word
          </p>
          <ol className="p9-runs" aria-live="polite">
            {runs.list.map((r, i) => (
              <li key={i}>
                <span className="muted">{TOY_PROMPT.join(" ")} </span>
                {r.pieces.map((w, k) => {
                  const sep = k === 0 || w === "." || w === "…" ? "" : " ";
                  return (
                    <span key={k}>
                      {sep}
                      <span className={r.odd[k] ? "p9-odd" : undefined}>{w}</span>
                    </span>
                  );
                })}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.same}>{done.same ? "○" : "□"} Get 5 sentences that are all the same</li>
        <li data-done={done.diff}>{done.diff ? "○" : "□"} Get 5 sentences that are all different</li>
        <li data-done={done.pizza}>{done.pizza ? "○" : "□"} Make a sentence that starts 'I walk to pizza…'</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">The scores are the same illustrative example as chapter 14. A toy model that looks only at the last word writes the sentences. Pink marks strange words that had low scores.</p>
    </div>
  );
}
