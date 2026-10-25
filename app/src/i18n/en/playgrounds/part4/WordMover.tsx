// en: overlay of src/playgrounds/part4/WordMover.tsx (strings; it compares the English verbs and group names)
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { DOG, KNOWN, NEXT, NEXT_COLORS, nnlm } from "../../../../data/ch39";
import "../../../../playgrounds/part4/style.css";

// plane: x, y in −1…1 drawn in a 300 × 300 box
const U = 130;
const X = (x: number) => 150 + x * U;
const Y = (y: number) => 150 - y * U;
const clamp = (v: number) => Math.max(-1, Math.min(1, Math.round(v * 100) / 100));
const dist = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const START: [number, number] = [0, 0];

const topWord = (q: readonly [number, number]) => {
  const { p } = nnlm(q);
  return NEXT[p.indexOf(Math.max(...p))];
};
/** which missions this position completes */
const missionsAt = (q: readonly [number, number]) => {
  const t = topWord(q);
  return [dist(KNOWN[0].e, q) < 0.22, t === NEXT[5] || t === NEXT[6], t === NEXT[3] || t === NEXT[4]]; // falls / blows, studies / teaches
};
const MISSIONS = [
  "Put 'dog' right next to 'cat' and see if the predictions match the cat's",
  "Find a spot where 'falls' or 'blows' comes first",
  "Find a spot where 'studies' or 'teaches' comes first",
];

const PRESETS: { label: string; at: [number, number] }[] = [
  { label: "Next to cat", at: [-0.45, 0.6] },
  { label: "Next to student", at: [0.38, 0.42] },
  { label: "Next to rain", at: [-0.3, -0.42] },
  { label: "To the center", at: START },
];

export function WordMover() {
  const svg = useRef<SVGSVGElement>(null);
  const [pos, setPos] = useState<[number, number]>(START);
  const [drag, setDrag] = useState(false);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const move = (q: [number, number]) => {
    setPos(q);
    const now = missionsAt(q);
    setDone((d) => d.map((x, i) => x || now[i]));
  };
  const { h, p } = nnlm(pos);
  const ranked = p.map((v, i) => ({ w: NEXT[i], p: v, c: NEXT_COLORS[i] })).sort((a, b) => b.p - a.p);
  const near = KNOWN.map((k) => ({ k, d: dist(k.e, pos) })).sort((a, b) => a.d - b.d)[0];

  const fromPointer = (e: PointerEvent<SVGSVGElement>): [number, number] => {
    const r = svg.current!.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * 300;
    const sy = ((e.clientY - r.top) / r.height) * 300;
    return [clamp((sx - 150) / U), clamp((150 - sy) / U)];
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = 0.05;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    move([clamp(pos[0] + m[0]), clamp(pos[1] + m[1])]);
  };


  const tip =
    near.d > 0.45
      ? "It's far from every group, so the prediction is unsure. Move the dot close to some words."
      : near.k.group === "animals"
        ? "It's next to 'cat', so even 'dog', which it never learned, scores sleeps, eats and runs high."
        : near.k.group === "people"
          ? "Next to the people words, 'studies' and 'teaches' moved up. Where the vector sits is what it means."
          : "It's next to the weather words. Now the network guesses 'the dog falls / blows'. Put a word in the wrong spot and the guesses go strange.";

  return (
    <div>
      <div className="plane-lab">
        <svg
          ref={svg}
          viewBox="0 0 300 300"
          style={{ width: "100%", maxWidth: 340, display: "block", touchAction: "none", cursor: drag ? "grabbing" : "pointer" }}
          role="img"
          tabIndex={0}
          aria-label={`Word vector plane. Position of 'dog': (${pos[0]}, ${pos[1]}). Use the arrow keys to move it.`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrag(true);
            move(fromPointer(e));
          }}
          onPointerMove={(e) => drag && move(fromPointer(e))}
          onPointerUp={() => setDrag(false)}
          onPointerCancel={() => setDrag(false)}
        >
          <rect x={X(-1)} y={Y(1)} width={2 * U} height={2 * U} fill="var(--paper-2)" rx={10} />
          <line x1={X(-1)} y1={Y(0)} x2={X(1)} y2={Y(0)} stroke="var(--line)" strokeWidth={1.5} />
          <line x1={X(0)} y1={Y(-1)} x2={X(0)} y2={Y(1)} stroke="var(--line)" strokeWidth={1.5} />
          {KNOWN.map((k) => {
            const right = k.e[0] > 0.3;
            return (
              <g key={k.w}>
                <circle cx={X(k.e[0])} cy={Y(k.e[1])} r={6} fill="var(--ink)" />
                <text x={X(k.e[0]) + (right ? -10 : 10)} y={Y(k.e[1]) + 4} textAnchor={right ? "end" : "start"} fontSize={12} fill="var(--ink-2)">
                  {k.w}
                </text>
              </g>
            );
          })}
          <line x1={X(pos[0])} y1={Y(pos[1])} x2={X(near.k.e[0])} y2={Y(near.k.e[1])} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="4 4" />
          <circle cx={X(pos[0])} cy={Y(pos[1])} r={11} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={2.5} />
          <text x={X(pos[0])} y={Y(pos[1]) - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
            {DOG.w}
          </text>
        </svg>

        <div className="plane-side">
          <div className="vec-big num">
            {DOG.w} = ({pos[0].toFixed(2)}, {pos[1].toFixed(2)})
          </div>
          <div className="p4-neurons" aria-label="Outputs of the 3 neurons">
            <span className="muted">3 neurons</span>
            {h.map((v, i) => (
              <span key={i} className="p4-neuron" style={{ background: v >= 0 ? "var(--hl-yellow)" : "var(--hl-sky)", opacity: 0.35 + 0.65 * Math.abs(v) }}>
                {v.toFixed(2)}
              </span>
            ))}
          </div>
          <div className="bars">
            {ranked.slice(0, 5).map((r) => (
              <div className="bar-row" key={r.w}>
                <span className="label">{r.w}</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${r.p * 100}%`, background: `var(--hl-${r.c})` }} />
                </span>
                <span className="val">{(r.p * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <p className="p4-note" style={{ marginTop: 0 }}>
            An n-gram? It counted what follows '{DOG.w}' 0 times, so it can't give any probability.
          </p>
        </div>
      </div>

      <div className="ctx-presets">
        {PRESETS.map((pr) => (
          <button key={pr.label} onClick={() => move(pr.at)}>
            {pr.label}
          </button>
        ))}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {MISSIONS.map((m, i) => (
          <li key={m} data-done={done[i]}>
            {done[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* The word positions and training sentences are an illustrative example. The network (3 neurons) really was trained on those sentences.</p>
    </div>
  );
}
