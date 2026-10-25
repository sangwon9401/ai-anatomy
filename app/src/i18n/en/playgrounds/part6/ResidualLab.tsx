import { useState } from "react";
import { GARBLE, PHONE, TOY_X0, garble, runLayers } from "../../../../data/ch56";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

/** ch. 56: push a vector through up to 48 layers with and without the highway. */
export function ResidualLab() {
  const [n, setN] = useState(4);
  const [highway, setHighway] = useState(false);
  const [done, setDone] = useState({ off: false, on: false });
  const r = runLayers(n, highway);
  const pct = Math.round(r.keep * 100);
  const msg = garble(PHONE[0], Math.round((1 - r.keep) * GARBLE.length));

  const update = (nextN: number, nextHw: boolean) => {
    setN(nextN);
    setHighway(nextHw);
    if (nextN === 48) setDone((d) => ({ off: d.off || !nextHw, on: d.on || nextHw }));
  };

  let tip = "First, with the highway off, raise the number of layers to 48.";
  if (!highway && pct < 20) tip = "The original information is almost gone. That's what happens when every layer replaces the whole vector.";
  else if (!highway) tip = "The more layers you stack, the less it looks like the start.";
  else if (n >= 24) tip = `${pct}% of the original information is still there! But did you notice the size grew from ${fmt(r.size0)} to ${fmt(r.size)}? Chapter 57 fixes that.`;
  else tip = "With the highway on, the original information survives as the layers pile up. Go all the way to 48.";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="Highway">
        <button aria-pressed={!highway} onClick={() => update(n, false)}>
          Highway off (swap)
        </button>
        <button aria-pressed={highway} onClick={() => update(n, true)}>
          Highway on (add)
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>Layers</span>
          <input type="range" min={1} max={48} step={1} value={n} aria-label="Number of layers" onChange={(e) => update(Number(e.target.value), highway)} />
          <span className="val">{n}</span>
        </div>
      </div>

      <p className="p6-label">Starting vector</p>
      <Vec v={TOY_X0} label="Starting vector" />
      <p className="p6-label">After {n} layer{n === 1 ? "" : "s"}</p>
      <Vec v={r.x} label={`After ${n} layer${n === 1 ? "" : "s"}`} />

      <div className="lab-out">
        <div className="bars">
          <div className="bar-row">
            <span className="label">Similarity</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${pct}%`, background: "var(--hl-mint)" }} />
            </span>
            <span className="val">{pct}%</span>
          </div>
        </div>
        <p className="p6-msg" aria-label="Telephone game comparison">
          {[...msg].map((ch, i) => (
            <span key={i} className={ch !== PHONE[0][i] ? "bad" : undefined}>
              {ch}
            </span>
          ))}
        </p>
        <p className="p6-note">Similarity is how closely the vector still points the same way as the starting vector (ch. 9). The sentence is the telephone game, garbled by the same amount. The numbers are illustrative examples.</p>
      </div>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.off}>{done.off ? "✓" : "○"} Stack 48 layers with the highway off</li>
        <li data-done={done.on}>{done.on ? "✓" : "○"} Stack 48 layers with the highway on</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
