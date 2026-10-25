import { useEffect, useState } from "react";
import { PRESETS82, keepTopK, keepTopP, renorm } from "../../../../data/ch82";
import { pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

type Mode = "k" | "p";
const pc = (p: number) => `${Math.round(p * 1000) / 10}%`;

export function CutLab() {
  const [key, setKey] = useState(PRESETS82[0].key);
  const [mode, setMode] = useState<Mode>("k");
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.9);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [seen, setSeen] = useState({ sure1: false, unsure6: false, pSure: false, pUnsure: false });

  const preset = PRESETS82.find((d) => d.key === key)!;
  const items = preset.items;
  const kk = Math.min(k, items.length);
  const keep = mode === "k" ? keepTopK(items, kk) : keepTopP(items, p);
  const probs = renorm(items, keep);
  const cum = items.map((_, i) => items.slice(0, i + 1).reduce((a, b) => a + b.p, 0));

  // missions stay done once reached
  const p90 = mode === "p" && Math.abs(p - 0.9) < 0.01;
  useEffect(() => {
    setSeen((s) => {
      const n = {
        sure1: s.sure1 || (key === "sure" && keep === 1),
        unsure6: s.unsure6 || (key === "unsure" && keep === 6),
        pSure: s.pSure || (key === "sure" && p90),
        pUnsure: s.pUnsure || (key === "unsure" && p90),
      };
      return n.sure1 === s.sure1 && n.unsure6 === s.unsure6 && n.pSure === s.pSure && n.pUnsure === s.pUnsure ? s : n;
    });
  }, [key, keep, p90]);
  const now = seen;

  const change = (f: () => void) => {
    f();
    setCounts(null);
  };
  const draw = () => {
    const c = items.map(() => 0);
    for (let i = 0; i < 10; i++) c[pickIndex(probs, Math.random())]++;
    setCounts(c);
  };

  const cutNames = items.slice(keep).map((it) => it.w);
  let tip: string;
  if (key === "school") tip = cutNames.includes("pizza") ? `You cut ${cutNames.length}. Pizza and the 'other' tail are gone, so no odd word can be drawn.` : "Pizza is still there. Cut a little more?";
  else if (key === "sure") tip = keep === 1 ? "Only the right answer, 9, is left. When the model is sure, keeping just one is safest." : `${keep} are left. Wrong answers like 8 or 11 get drawn now and then.`;
  else tip = keep <= 3 ? "Fine answers like plums, kiwis and figs got cut too. Try Top-p 90% instead." : cutNames.includes("chairs") ? `${keep} are left. Only the odd 'chairs' was cut, and plenty of fruits remain.` : "Even 'chairs' is still there. Cut a little more?";

  return (
    <div>
      <div className="ctx-presets p9-tall" role="group" aria-label="Choose a sentence" style={{ marginTop: 0 }}>
        {PRESETS82.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => change(() => setKey(d.key))} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name} ___
          </button>
        ))}
      </div>

      <div className="p9-seg" role="group" aria-label="How to cut" style={{ marginTop: 12 }}>
        <button aria-pressed={mode === "k"} onClick={() => change(() => setMode("k"))}>
          Top-k
        </button>
        <button aria-pressed={mode === "p"} onClick={() => change(() => setMode("p"))}>
          Top-p
        </button>
      </div>
      <div className="lab-row" style={{ marginTop: 10 }}>
        <span>{mode === "k" ? "k" : "p"}</span>
        {mode === "k" ? (
          <input type="range" min={1} max={items.length} step={1} value={kk} aria-label="Number of candidates to keep, k" onChange={(e) => change(() => setK(Number(e.target.value)))} />
        ) : (
          <input type="range" min={0.5} max={1} step={0.05} value={p} aria-label="Probability total to reach, p" onChange={(e) => change(() => setP(Number(e.target.value)))} />
        )}
        <span className="val">{mode === "k" ? `${kk}` : `${Math.round(p * 100)}%`}</span>
      </div>

      <div className="lab-out">
        <div className="p9-cut-head">
          <span>Word</span>
          <span>Original</span>
          <span>{mode === "p" ? "Sum" : ""}</span>
          <span>After</span>
        </div>
        <div className="bars">
          {items.map((it, i) => {
            const kept = i < keep;
            return (
              <div className="p9-cut-row" key={it.w} data-cut={!kept}>
                <span className="label">{it.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${it.p * 100}%`, background: kept ? (it.c ? `var(--hl-${it.c})` : "var(--ink-3)") : "var(--line)" }} />
                </span>
                <span className="n muted">{mode === "p" && i <= keep - 1 ? pc(cum[i]) : ""}</span>
                <span className="n">{kept ? pc(probs[i]) : "cut"}</span>
              </div>
            );
          })}
        </div>
        <div className="lab-sum">
          {keep} kept · their {pc(cum[keep - 1])} is shared out again to make 100%
          {key === "school" ? " · other = tens of thousands of pieces" : ""}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          Spin 10 times with what's left
        </button>
      </div>
      {counts && (
        <p className="p9-draws" aria-live="polite">
          {items.map((it, i) =>
            counts[i] > 0 ? (
              <span key={it.w} className={`chip ${it.c ? `hl-${it.c}` : "hl-none"}`}>
                {it.w} ×{counts[i]}
              </span>
            ) : null,
          )}
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={now.sure1}>{now.sure1 ? "○" : "□"} In '1, 3, 5, 7,' keep only the right answer, 9</li>
        <li data-done={now.unsure6}>{now.unsure6 ? "○" : "□"} In the fruit sentence, cut only the odd 'chairs'</li>
        <li data-done={now.pSure && now.pUnsure}>{now.pSure && now.pUnsure ? "○" : "□"} Compare both sentences (1, 3, 5, 7 / fruit) at Top-p 90%: do they keep the same number?</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">Illustrative probabilities.</p>
    </div>
  );
}
