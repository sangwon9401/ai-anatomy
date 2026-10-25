import { useState } from "react";
import { FFN_WORDS, NEURON_NAMES, ffn } from "../../../../data/ch55";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

/** ch. 55: one word through the toy 4 → 16 → 4 feed-forward layer. */
export function FfnLab() {
  const [wi, setWi] = useState(2);
  const [bend, setBend] = useState(true);
  const [pick, setPick] = useState<number | null>(null);
  const [tried, setTried] = useState<number[]>([2]);
  const [foundTop, setFoundTop] = useState(false);
  const [unbent, setUnbent] = useState(false);

  const word = FFN_WORDS[wi];
  const run = ffn(word.x, bend);
  const maxAbs = Math.max(...run.h.map(Math.abs), 1e-9);
  const top = run.h.indexOf(Math.max(...run.h));

  const choose = (i: number) => {
    setWi(i);
    setPick(null);
    if (!tried.includes(i)) setTried([...tried, i]);
  };
  const tapNeuron = (j: number) => {
    setPick(j);
    if (wi === 2 && bend && j === top) setFoundTop(true);
  };

  let tip = "Tap the brightest neuron. What does it react to?";
  if (!bend) tip = "Without the bend, negative numbers (pink) pass straight through. Then the whole machine acts like one straight-line function, and widening it is wasted (ch. 17).";
  else if (pick !== null && NEURON_NAMES[pick]) tip = `This neuron reacts to ${NEURON_NAMES[pick]}. (illustrative name tag)`;
  else if (pick !== null) tip = "This neuron is hard to name. Real models have lots of neurons like this.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="Choose a word">
        {FFN_WORDS.map((w, i) => (
          <button key={w.w} aria-pressed={i === wi} onClick={() => choose(i)}>
            {w.w}
          </button>
        ))}
      </div>

      <p className="p6-label">Incoming vector (after attention)</p>
      <Vec v={word.x} label="Incoming vector" />

      <p className="p6-label">Wide layer: 16 neurons (4×) · tap one</p>
      <div className="p6-neurons" role="group" aria-label="16 neurons">
        {run.h.map((h, j) => {
          const a = Math.min(1, Math.abs(h) / maxAbs);
          const c = h >= 0 ? "var(--hl-yellow)" : "var(--hl-pink)";
          return (
            <button
              key={j}
              aria-pressed={pick === j}
              aria-label={`Neuron ${j + 1}, value ${fmt(h, 2)}`}
              style={{ background: `color-mix(in srgb, ${c} ${Math.round(a * 100)}%, var(--paper))`, color: a > 0.45 ? "var(--chip-ink)" : "var(--ink)" }}
              onClick={() => tapNeuron(j)}
            >
              {fmt(h)}
            </button>
          );
        })}
      </div>

      <div className="lab-actions">
        <button
          className="btn ghost"
          aria-pressed={!bend}
          onClick={() => {
            setBend(!bend);
            if (bend) setUnbent(true);
          }}
        >
          {bend ? "Turn off the GELU bend" : "Turn the GELU bend back on"}
        </button>
      </div>

      <p className="p6-label">The thought (narrowed back to 4)</p>
      <Vec v={run.y} label="The thought" />
      <p className="p6-label">Original vector + thought = new vector</p>
      <Vec v={run.out} label="New vector" />
      <p className="p6-note">All numbers and neuron names are illustrative examples. GPT-3 goes 12,288 → 49,152 → 12,288.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={tried.length === 3}>{tried.length === 3 ? "✓" : "○"} Send in all three words</li>
        <li data-done={foundTop}>{foundTop ? "✓" : "○"} Tap the brightest neuron for 'to'</li>
        <li data-done={unbent}>{unbent ? "✓" : "○"} Turn off the GELU bend</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
