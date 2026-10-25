// en: overlay of src/playgrounds/part5/HeadDetective.tsx (strings only)
import { useState } from "react";
import { HEADS52 } from "../../../../data/ch52";
import { WORDS } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

// the order the mystery heads come in
const ROUNDS = [2, 0, 1];
// what each answer means, in the same order as HEADS52
const ROLE = ["who? (finds the doer)", "what? (finds the action)", "where? (finds the direction)"];
const CELL = 52;
const PAD = 70;

function HeatMap({ map, color, label }: { map: number[][]; color: string; label: string }) {
  const size = PAD + 4 * CELL;
  return (
    <svg className="p5-heat" viewBox={`0 0 ${size + 6} ${size + 6}`} role="img" aria-label={label}>
      {WORDS.map((w, j) => (
        <text key={`c${w}`} x={PAD + j * CELL + CELL / 2} y={PAD - 12} fontSize={13} textAnchor="middle" fill="var(--ink-2)">
          {w}
        </text>
      ))}
      {WORDS.map((w, i) => (
        <text key={`r${w}`} x={PAD - 8} y={PAD + i * CELL + CELL / 2 + 5} fontSize={13} textAnchor="end" fill="var(--ink-2)">
          {w}
        </text>
      ))}
      {map.map((row, i) =>
        row.map((v, j) => (
          <g key={`${i}${j}`}>
            <rect
              x={PAD + j * CELL + 2}
              y={PAD + i * CELL + 2}
              width={CELL - 4}
              height={CELL - 4}
              rx={6}
              style={{ fill: j > i ? "var(--line)" : `color-mix(in srgb, ${color} ${v}%, var(--paper-2))` }}
            />
            {j <= i && (
              <text x={PAD + j * CELL + CELL / 2} y={PAD + i * CELL + CELL / 2 + 5} fontSize={12} textAnchor="middle" fill={v >= 45 ? "var(--chip-ink)" : "var(--ink)"}>
                {v}
              </text>
            )}
          </g>
        )),
      )}
    </svg>
  );
}

/** ch. 52: read a (made-up) head's attention map and guess what it looks for. */
export function HeadDetective() {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = round >= ROUNDS.length;
  const h = HEADS52[ROUNDS[Math.min(round, ROUNDS.length - 1)]];
  const correct = picked !== null && HEADS52[picked].ask === h.ask;

  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (HEADS52[k].ask === h.ask) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setRound((r) => r + 1);
  };
  const restart = () => {
    setPicked(null);
    setRound(0);
    setScore(0);
  };

  if (finished)
    return (
      <div>
        <p style={{ margin: 0, fontSize: 17 }}>
          You got <b>{score}</b> of {ROUNDS.length} right.
        </p>
        <p className="lab-tip">The darkest cell in the row of 'school' (the bottom row) shows what a head looks for. Researchers study real GPT heads by reading maps like this (ch. 53).</p>
        <div className="lab-actions">
          <button className="btn" onClick={restart}>
            Play again
          </button>
        </div>
      </div>
    );

  return (
    <div>
      <p style={{ margin: "0 0 8px", fontSize: 15 }}>
        Mystery head {round + 1} / {ROUNDS.length}
        <span className="p5-ex">illustrative example</span>
      </p>
      <HeatMap map={h.map} color={picked === null ? "var(--ink-3)" : `var(--hl-${h.c})`} label={`Attention map of mystery head ${round + 1}`} />
      <p className="p5-note">Row = the word looking, column = the word looked at. The numbers are %. Gray cells are the curtain (ch. 51).</p>
      <div className="p5-quiz" role="group" aria-label="What this head looks for">
        {HEADS52.map((c, k) => (
          <button key={c.ask} onClick={() => choose(k)} data-state={picked === null ? undefined : c.ask === h.ask ? "right" : picked === k ? "wrong" : undefined} disabled={picked !== null}>
            {ROLE[k]}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <p className="lab-tip">
            {correct ? "Correct!" : "Not quite."} In the bottom row ('school'), the cell for '{WORDS[h.target]}' is darkest at {h.map[3][h.target]}%. This head looks for '{h.ask}'
          </p>
          <div className="lab-actions">
            <button className="btn" onClick={next}>
              {round + 1 < ROUNDS.length ? "Next head" : "See results"}
            </button>
          </div>
        </>
      )}
      {picked === null && <p className="lab-tip">Find the darkest cell in the bottom row of the map ('school').</p>}
    </div>
  );
}
