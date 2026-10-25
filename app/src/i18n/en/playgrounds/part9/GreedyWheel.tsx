import { useState } from "react";
import { PROMPT80, WHEEL } from "../../../../data/ch80";
import { generate, joinPieces, pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const CX = 120;
const CY = 124;
const R = 100;
const P = WHEEL.map((c) => c.p);
const label = (w: string, c: string | null) => (c ? w : "other");
const fill = (c: string | null) => (c ? `var(--hl-${c})` : "var(--paper-2)");

function starts() {
  let a = 0;
  return WHEEL.map((c) => {
    const s = a;
    a += c.p * 360;
    return s;
  });
}
const START = starts();
const pt = (r: number, deg: number) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];

/** rotation that puts slice i under the pointer, ahead of `from` by `turns` full turns */
function landOn(i: number, from: number, turns: number, at: number) {
  const phi = START[i] + WHEEL[i].p * 360 * at;
  const target = (((-phi - from) % 360) + 360) % 360;
  return from + target + turns * 360;
}

type Line = { how: "greedy" | "sampling"; text: string };

export function GreedyWheel() {
  const [rot, setRot] = useState(0);
  const [fast, setFast] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const [greedy, setGreedy] = useState<number[]>(() => WHEEL.map(() => 0));
  const [sample, setSample] = useState<number[]>(() => WHEEL.map(() => 0));
  const [lines, setLines] = useState<Line[]>([]);
  const [tip, setTip] = useState("First, press 'Pick greedily' a few times.");

  const gTotal = greedy.reduce((a, b) => a + b, 0);
  const sTotal = sample.reduce((a, b) => a + b, 0);
  const sNotTop = sTotal - sample[0];
  const gLines = lines.filter((l) => l.how === "greedy");
  const sLines = lines.filter((l) => l.how === "sampling");

  const pickGreedy = () => {
    setFast(true);
    setRot((r) => landOn(0, r, 0, 0.5));
    setLast(0);
    const next = greedy.map((n, i) => (i === 0 ? n + 1 : n));
    setGreedy(next);
    const total = next.reduce((a, b) => a + b, 0);
    setTip(total >= 3 ? `You picked greedily ${total} times and got 'school' every time. Same probability table, same first place.` : "Press it again. Will the result change?");
  };
  const spin = (n: number) => {
    const next = [...sample];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = pickIndex(P, Math.random());
      next[i]++;
    }
    setFast(n > 1);
    setRot((r) => landOn(i, r, n > 1 ? 2 : 4, 0.15 + Math.random() * 0.7));
    setLast(i);
    setSample(next);
    const total = next.reduce((a, b) => a + b, 0);
    if (total >= 30) setTip(`${total} spins. 'school' wins most often, but not every time. The more you spin, the closer the counts get to the probabilities (52%, 21%…).`);
    else if (i !== 0) setTip(`This time '${label(WHEEL[i].w, WHEEL[i].c)}'! Any word with a slice can be drawn, even if it isn't first.`);
    else setTip("This time 'school'. Spin a few more times.");
  };
  const write = (how: Line["how"]) => {
    const pieces = generate(how === "greedy" ? 0 : 1, Math.random);
    const text = joinPieces([...PROMPT80, ...pieces]);
    const nextLines = [{ how, text }, ...lines].slice(0, 6);
    setLines(nextLines);
    const g = nextLines.filter((l) => l.how === "greedy").length;
    const s = nextLines.filter((l) => l.how === "sampling");
    if (how === "greedy") setTip(g >= 2 ? "The greedy sentence is the same every time. It circles around 'and meet friends' until the length limit cuts it off (…)." : "Now press 'Write by sampling' too.");
    else setTip(new Set(s.map((l) => l.text)).size >= 2 ? "The sampled sentence changes every time you press. That's why ChatGPT answers the same question a little differently." : "Press it once more. Will the same sentence come out again?");
  };
  const reset = () => {
    setGreedy(WHEEL.map(() => 0));
    setSample(WHEEL.map(() => 0));
    setLast(null);
    setLines([]);
    setTip("First, press 'Pick greedily' a few times.");
  };

  const shown = last === null ? null : WHEEL[last];

  return (
    <div>
      <div className="p9-sent" aria-live="polite">
        {PROMPT80.map((w) => (
          <span key={w} className="chip outline">
            {w}
          </span>
        ))}
        {shown ? <span className={`chip ${shown.c ? `hl-${shown.c}` : "hl-none"}`}>{label(shown.w, shown.c)}</span> : <span className="p9-blank">?</span>}
      </div>

      <div className="p9-split" style={{ marginTop: 12 }}>
        <svg className={`p9-wheel${fast ? " fast" : ""}`} viewBox="0 0 240 240" role="img" aria-label="A wheel with slices sized by probability">
          <g className="spin" style={{ transform: `rotate(${rot}deg)` }}>
            {WHEEL.map((c, i) => {
              const a0 = START[i];
              const a1 = a0 + c.p * 360;
              const [x0, y0] = pt(R, a0);
              const [x1, y1] = pt(R, a1);
              const mid = a0 + c.p * 180;
              const [lx, ly] = pt(R * (c.p < 0.1 ? 0.78 : 0.6), mid);
              return (
                <g key={c.w}>
                  <path d={`M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={fill(c.c)} stroke="var(--ink)" strokeWidth={1.5} />
                  {c.p >= 0.04 && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={c.p < 0.1 ? 12 : 16} fontWeight={700} fill={c.c ? "var(--chip-ink)" : "var(--ink-2)"} transform={`rotate(${mid} ${lx} ${ly})`}>
                      {label(c.w, c.c)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
          <path d={`M ${CX - 9} 6 L ${CX + 9} 6 L ${CX} 30 Z`} fill="var(--pen)" />
        </svg>

        <div>
          <div className="p9-tally-head">
            <span>Word</span>
            <span>Chance</span>
            <span>Greedy</span>
            <span>Wheel</span>
          </div>
          <div className="bars" style={{ marginTop: 4 }}>
            {WHEEL.map((c, i) => (
              <div className="p9-tally-row" key={c.w} data-last={last === i}>
                <span className="label">{label(c.w, c.c)}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${c.p * 100}%`, background: c.c ? `var(--hl-${c.c})` : "var(--ink-3)" }} />
                </span>
                <span className="n">{greedy[i]}</span>
                <span className="n">{sample[i]}</span>
              </div>
            ))}
          </div>
          <p className="p9-note">Illustrative probabilities (the same numbers as chapter 1).</p>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={pickGreedy}>
          Pick greedily
        </button>
        <button className="btn" onClick={() => spin(1)}>
          Spin the wheel
        </button>
        <button className="btn ghost" onClick={() => spin(10)}>
          Spin 10 times
        </button>
      </div>

      <h4 className="p9-h">Write to the end of the sentence</h4>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <button className="btn ghost" onClick={() => write("greedy")}>
          Write greedily
        </button>
        <button className="btn ghost" onClick={() => write("sampling")}>
          Write by sampling
        </button>
        <button className="btn ghost" onClick={reset}>
          Start over
        </button>
      </div>
      {lines.length > 0 && (
        <ul className="p9-history" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i}>
              <span className="how">{l.how}</span>
              <span className="txt">{l.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="p9-note">A toy model writes the sentences. It looks only at the last word to choose the next one, and stops at 10 pieces.</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={gTotal >= 3}>{gTotal >= 3 ? "○" : "□"} Pick greedily three times: does the result change?</li>
        <li data-done={sNotTop > 0}>{sNotTop > 0 ? "○" : "□"} Spin the wheel and get a word other than 'school'</li>
        <li data-done={gLines.length > 0 && sLines.length >= 2}>{gLines.length > 0 && sLines.length >= 2 ? "○" : "□"} Write one sentence greedily and two by sampling</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
