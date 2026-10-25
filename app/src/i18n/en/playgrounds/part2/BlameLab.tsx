import { useState } from "react";
import { LR23, blame, step } from "../../../../data/ch23";
import { NET, STORES, num, type Net } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const IN_NAMES = ["spicy", "line", "price"];
const H_NAMES = ["popular", "too spicy"];
type Knob = { id: string; label: string; kind: "w" | "b" | "v" | "c"; j: number; i: number };
const KNOBS: Knob[] = [
  ...[0, 1].flatMap((j) => [0, 1, 2].map((i) => ({ id: `w${j}${i}`, label: `${IN_NAMES[i]}→${H_NAMES[j]}`, kind: "w" as const, j, i }))),
  { id: "b0", label: "popular bias", kind: "b", j: 0, i: 0 },
  { id: "b1", label: "too spicy bias", kind: "b", j: 1, i: 0 },
  { id: "v0", label: "popular→rating", kind: "v", j: 0, i: 0 },
  { id: "v1", label: "too spicy→rating", kind: "v", j: 1, i: 0 },
  { id: "c", label: "rating bias", kind: "c", j: 0, i: 0 },
];
const PICK = [0, 1]; // Truck A, Truck B
// Truck B has bigger inputs, so bigger blame: a smaller step keeps it from bouncing out (chapter 22)
const LRS = [LR23, 0.002];
const valueOf = (n: Net, k: Knob) => (k.kind === "w" ? n.W1[k.j][k.i] : k.kind === "b" ? n.b1[k.j] : k.kind === "v" ? n.v[k.j] : n.c);
const nudged = (n: Net, k: Knob, d: number): Net => {
  const m: Net = JSON.parse(JSON.stringify(n));
  if (k.kind === "w") m.W1[k.j][k.i] += d;
  else if (k.kind === "b") m.b1[k.j] += d;
  else if (k.kind === "v") m.v[k.j] += d;
  else m.c += d;
  return m;
};
const paren = (v: number) => (v < 0 ? `(${num(v, 3)})` : num(v, 3));

export function BlameLab() {
  const [store, setStore] = useState(0);
  const [net, setNet] = useState<Net>(NET);
  const [sel, setSel] = useState("w01");
  const [steps, setSteps] = useState(0);
  const s = STORES[PICK[store]];
  const g = blame(net, s.x, s.real);
  const knob = KNOBS.find((k) => k.id === sel)!;
  const grad = (k: Knob) => (k.kind === "w" ? g.dW1[k.j][k.i] : k.kind === "b" ? g.db1[k.j] : k.kind === "v" ? g.dv[k.j] : g.dc);
  const maxG = Math.max(...KNOBS.map((k) => Math.abs(grad(k))), 1e-9);
  const on = g.f.z[knob.j] > 0;

  // the chain for the selected knob, read from the output backwards
  let chain: string;
  if (knob.kind === "c") chain = `loss←rating ${paren(g.dy)} × 1 = ${num(grad(knob), 3)}`;
  else if (knob.kind === "v") chain = `loss←rating ${paren(g.dy)} × ${H_NAMES[knob.j]} value ${paren(g.f.h[knob.j])} = ${num(grad(knob), 3)}`;
  else {
    const last = knob.kind === "w" ? `input ${IN_NAMES[knob.i]} ${s.x[knob.i]}` : "1";
    chain = `loss←rating ${paren(g.dy)} × rating←${H_NAMES[knob.j]} ${paren(net.v[knob.j])} × ReLU ${on ? "on 1" : "off 0"} × ${last} = ${num(grad(knob), 3)}`;
  }
  const dl = (blame(nudged(net, knob, 0.01), s.x, s.real).loss - g.loss);

  const tip =
    g.loss < 0.01
      ? `Loss ${num(g.loss, 4)}! Fixing each knob against its blame, over and over, got it almost right. Try another truck too.`
      : !on && (knob.kind === "w" || knob.kind === "b")
        ? `The ${H_NAMES[knob.j]} neuron is off, so this knob's blame is 0. Changing it wouldn't help, so it stays as it is.`
        : "The bigger the blame (the longer the bar), the more a knob gets fixed. Use \"Fix one step\" to bring the loss below 0.01.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Pick a truck">
        {PICK.map((p, k) => (
          <button
            key={p}
            aria-pressed={store === k}
            style={store === k ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}
            onClick={() => {
              setStore(k);
              setNet(NET);
              setSteps(0);
            }}
          >
            {STORES[p].name} ({STORES[p].x.join(", ")}) real {num(STORES[p].real)}
          </button>
        ))}
      </div>
      <p className="p2-calc">
        guess <b>{num(g.f.y, 3)}</b> · real {num(s.real)} · loss <b>{num(g.loss, 4)}</b>
        <br />
        popular = {num(g.f.h[0], 3)}, too spicy = {num(g.f.h[1], 3)} {g.f.h[1] === 0 ? "(off)" : "(on)"} · fixes so far {steps}
      </p>

      <div className="p2-knobs" role="group" aria-label="Pick a knob">
        {KNOBS.map((k) => {
          const gk = grad(k);
          return (
            <button key={k.id} className="p2-knob" aria-pressed={k.id === sel} onClick={() => setSel(k.id)}>
              <span className="lbl">{k.label}</span>
              <span className="num val">{num(valueOf(net, k), 3)}</span>
              <span className="bar" aria-hidden="true">
                <span style={{ width: `${(Math.abs(gk) / maxG) * 100}%` }} />
              </span>
              <span className="num g">{gk === 0 ? "0" : num(gk, 2)}</span>
            </button>
          );
        })}
      </div>
      <p className="p2-note">Left number = the knob's value, red number on the right = its blame. The weights are an illustrative example.</p>

      <div className="p2-calc">
        Blame of <b>{knob.label}</b>
        <br />
        {chain}
        <br />
        Check: raise it by 0.01 and the loss changes {dl < 0 ? "−" : "+"}
        {num(Math.abs(dl), 4)} (≈ blame × 0.01 = {num(grad(knob) * 0.01, 4)})
      </div>

      <div className="lab-actions">
        <button
          className="btn"
          onClick={() => {
            setNet((n) => step(n, s.x, s.real, LRS[store]));
            setSteps((k) => k + 1);
          }}
        >
          Fix one step
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setNet(NET);
            setSteps(0);
          }}
        >
          Reset
        </button>
      </div>
      <p className="p2-note">
        One step = fix every knob at once to "knob − {LRS[store]} × blame".{store === 1 && " Truck B has bigger inputs, so bigger blame. That's why its step size (learning rate) is smaller (chapter 22)."}
      </p>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
