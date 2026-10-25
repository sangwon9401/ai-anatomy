import { useState } from "react";
import { DEPTH_NOTES, peekAt } from "../../../../data/ch58";
import "../../../../playgrounds/part6/style.css";

/** 'school' is ahead of every other single word (by more than a rounding hair) */
const ganLeads = (layer: number) => {
  const p = peekAt(layer);
  return p[0].now > Math.max(...p.slice(1).map((r) => r.now)) + 0.2;
};
const FIRST_GAN = Array.from({ length: 96 }, (_, i) => i + 1).find(ganLeads) ?? 96;

/** ch. 58: walk down the 96 layers and watch 'to' fill up. */
export function DepthLab() {
  const [layer, setLayer] = useState(1);
  const [found, setFound] = useState(false);
  const [bottom, setBottom] = useState(false);
  const peek = peekAt(layer);
  const rest = 100 - peek.reduce((a, r) => a + r.now, 0);
  const leads = ganLeads(layer);
  const tint = Math.round(12 + (layer / 96) * 88);

  const move = (v: number) => {
    setLayer(v);
    if (v === FIRST_GAN) setFound(true);
    if (v === 96) setBottom(true);
  };

  let tip = "Slowly move the slider down. At which layer does 'school' take first place?";
  if (layer === FIRST_GAN) tip = `From layer ${layer} on, 'school' is in first place!`;
  else if (leads && layer === 96) tip = "After all 96 layers: school 52%, the 21%, work 12%. The very numbers from chapter 1!";
  else if (leads) tip = "'school' is in first place. The deeper you go, the more confident it gets.";
  else if (layer < 12) tip = "Shallow layers don't have a clue yet. The candidates are all about the same.";

  return (
    <div>
      <div className="lab-rows">
        <div className="lab-row">
          <span>Layer</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="Which layer" onChange={(e) => move(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
      </div>

      <div className="p6-depth">
        <span
          className="chip"
          style={{ fontSize: 20, background: `color-mix(in srgb, var(--hl-yellow) ${tint}%, var(--paper))`, color: tint > 50 ? "var(--chip-ink)" : "var(--ink)", border: "2px solid var(--ink)" }}
        >
          to
        </span>
        <span className="muted">Vector after layer {layer}</span>
      </div>

      <p className="p6-label">What has piled up in this vector (illustrative)</p>
      <ul className="p6-notes">
        {DEPTH_NOTES.map((d) => (
          <li key={d.layer} data-on={layer >= d.layer}>
            <span className="n">Layer {d.layer}+</span>
            <span>{layer >= d.layer ? d.note : "?"}</span>
          </li>
        ))}
      </ul>

      <p className="p6-label">Peeking at the next word from here</p>
      <div className="bars">
        {peek.map((r) => (
          <div className="bar-row" key={r.w}>
            <span className="label">{r.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${r.now}%`, background: `var(--hl-${r.c})` }} />
            </span>
            <span className="val">{Math.round(r.now)}%</span>
          </div>
        ))}
        <div className="bar-row">
          <span className="label">the rest</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${rest}%`, background: "var(--line)" }} />
          </span>
          <span className="val">{Math.round(rest)}%</span>
        </div>
      </div>
      <p className="p6-note">'the rest' is the share of all the other ~50,000 tokens together. The numbers for each layer are illustrative examples.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={found}>{found ? "✓" : "○"} Find the layer where 'school' first takes first place</li>
        <li data-done={bottom}>{bottom ? "✓" : "○"} Go all the way down to layer 96</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
