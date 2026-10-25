import { useState } from "react";
import { layerNorm, wordsAt } from "../../../../data/ch57";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LIMIT = 20;

/** ch. 57: grow the word vectors layer by layer, then switch layer normalisation on. */
export function NormLab() {
  const [layer, setLayer] = useState(1);
  const [on, setOn] = useState(false);
  const [gain, setGain] = useState(1);
  const [seen, setSeen] = useState({ big: false, fixed: false, gain: false });

  const words = wordsAt(layer);
  const rows = words.map((w) => {
    const n = layerNorm(w.v, gain);
    const into = on ? n.out : w.v;
    return { ...w, ...n, into, max: Math.max(...into.map(Math.abs)) };
  });
  const worst = Math.max(...rows.map((r) => r.max));
  const shaky = worst > LIMIT;

  const mark = (next: Partial<typeof seen>) => setSeen((s) => ({ big: s.big || !!next.big, fixed: s.fixed || !!next.fixed, gain: s.gain || !!next.gain }));
  const setL = (v: number) => {
    setLayer(v);
    if (v === 96) mark({ big: !on, fixed: on });
  };
  const setNorm = (v: boolean) => {
    setOn(v);
    if (layer === 96) mark({ big: !v, fixed: v });
  };

  let tip = "First, with normalization off, raise the layer slider to 96.";
  if (!on && shaky) tip = "The numbers got too big! And every word has a different size, so the parts get shaky. Turn on layer normalization.";
  else if (!on) tip = "The deeper the layer, the bigger the numbers, and each word ends up a different size.";
  else if (gain !== 1) tip = `Scale ${fmt(gain)}×: the normalized values are multiplied by the scale. In a real model, each number has its own scale, learned in training.`;
  else tip = "At any layer, every word is evened out to mean 0 and spread 1. Try changing the scale too.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="Layer normalization">
        <button aria-pressed={!on} onClick={() => setNorm(false)}>
          Normalization off
        </button>
        <button aria-pressed={on} onClick={() => setNorm(true)}>
          Layer normalization on
        </button>
      </div>
      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>Layer</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="Which layer" onChange={(e) => setL(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
        <div className="lab-row">
          <span>Scale</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={gain}
            disabled={!on}
            aria-label="Scale"
            onChange={(e) => {
              setGain(Number(e.target.value));
              mark({ gain: true });
            }}
          />
          <span className="val">{fmt(gain)}</span>
        </div>
      </div>

      <div className="p6-rows">
        {rows.map((r) => (
          <div className="p6-wrow" key={r.w}>
            <div className="p6-wrow-head">
              <span className="chip outline">{r.w}</span>
              <span className="muted">
                mean {fmt(r.mean)} · spread {fmt(r.sd)}
              </span>
            </div>
            <Vec v={r.v} label={`${r.w} vector`} />
            {on && (
              <>
                <p className="p6-label">↓ What goes into the part</p>
                <Vec v={r.into} label={`${r.w} normalized`} />
              </>
            )}
            <div className="bars" style={{ marginTop: 6 }}>
              <div className="bar-row">
                <span className="label">Size</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.min(100, (r.max / 80) * 100)}%`, background: r.max > LIMIT ? "var(--pen)" : "var(--hl-mint)" }} />
                </span>
                <span className="val">{fmt(r.max)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="p6-note">'Size' is the biggest number going into the part (ignoring the sign). The numbers are illustrative examples.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.big}>{seen.big ? "✓" : "○"} Go to layer 96 with normalization off</li>
        <li data-done={seen.fixed}>{seen.fixed ? "✓" : "○"} Turn on layer normalization at layer 96</li>
        <li data-done={seen.gain}>{seen.gain ? "✓" : "○"} Change the scale</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
