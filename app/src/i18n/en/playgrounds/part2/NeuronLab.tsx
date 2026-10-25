import { useState } from "react";
import { FEATURES, GOOD, NEURON, STORES, neuron, num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const fmtW = (w: number) => (w < 0 ? `(${num(w)})` : num(w));

export function NeuronLab() {
  const [w, setW] = useState<number[]>([...NEURON.w]);
  const [b, setB] = useState(NEURON.b);
  const [sel, setSel] = useState(0);

  const rows = STORES.map((s) => {
    const score = neuron(s.x, w, b);
    const says = score >= GOOD;
    const truth = s.real >= GOOD;
    return { ...s, score, says, truth, ok: says === truth };
  });
  const okCount = rows.filter((r) => r.ok).length;
  const firstWrong = rows.find((r) => !r.ok);
  const cur = rows[sel];

  let tip: string;
  if (!firstWrong) tip = "All five trucks now match your friends! Setting the knobs like this is \"learning\". From chapter 20 on, the computer does it by itself.";
  else if (firstWrong.truth) tip = `${okCount} of 5 match. Your friends say ${firstWrong.name} is a hit. Which knob should you turn so ${firstWrong.name} scores 4 or more?`;
  else tip = `${okCount} of 5 match. Your friends say ${firstWrong.name} is not a hit. Bring its score below 4, and watch whether the other trucks change too.`;

  return (
    <div>
      <div className="lab-rows p2-sliders">
        {FEATURES.map((f, i) => (
          <div className="lab-row" key={f.key}>
            <span>{f.name} weight</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.5}
              value={w[i]}
              aria-label={`${f.name} weight`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setW((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
            <span className="val">{num(w[i])}</span>
          </div>
        ))}
        <div className="lab-row">
          <span>Bias</span>
          <input type="range" min={-4} max={6} step={0.5} value={b} aria-label="Bias" onChange={(e) => setB(Number(e.target.value))} />
          <span className="val">{num(b)}</span>
        </div>
      </div>

      <div className="p2-stores" role="group" aria-label="Pick a truck">
        <div className="p2-store-head">
          <span>Truck</span>
          <span>spicy · line · price</span>
          <span>Neuron</span>
          <span>Friends</span>
        </div>
        {rows.map((r, i) => (
          <button key={r.name} className="p2-store" aria-pressed={i === sel} onClick={() => setSel(i)}>
            <span className="name">{r.name.replace("Truck ", "")}</span>
            <span className="ins">
              {r.x[0]} · {r.x[1]} · {r.x[2]}
            </span>
            <span className="score" style={{ background: r.says ? "var(--hl-mint)" : "var(--hl-pink)" }}>
              {num(r.score)} {r.says ? "hit" : "no"}
            </span>
            <span className="friend">
              {r.truth ? "hit" : "no"}
              <span className={`p2-mark${r.ok ? " ok" : ""}`}>{r.ok ? "○" : "✗"}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="p2-calc">
        {cur.name}: {cur.x.map((x, i) => `${x}×${fmtW(w[i])}`).join(" + ")} + {fmtW(b)} = <b>{num(cur.score)}</b>
        {" → "}
        {cur.score >= GOOD ? "4 or more: a hit" : "under 4: not a hit"}
      </p>
      <p className="p2-note">Spicy is a level from 1 to 5, line is people waiting, price is dollars per taco. The trucks and numbers are an illustrative example.</p>

      <div className="lab-actions">
        <button
          className="btn ghost"
          onClick={() => {
            setW([...NEURON.w]);
            setB(NEURON.b);
          }}
        >
          Reset
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
