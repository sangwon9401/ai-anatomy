import { useState } from "react";
import { HONEST, QUESTION84, TREE, type Opt } from "../../../../data/ch84";
import { pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

type Sim = { fake: number; honest: number; examples: string[] };

function sampleAnswer() {
  const out: string[] = [];
  let node = "start";
  while (node !== "end") {
    const opts = TREE[node];
    const o = opts[pickIndex(opts.map((x) => x.p), Math.random())];
    out.push(o.w);
    node = o.next ?? "end";
  }
  return out;
}

export function HalluLab() {
  const [path, setPath] = useState<string[]>([]);
  const [node, setNode] = useState("start");
  const [checked, setChecked] = useState(false);
  const [sim, setSim] = useState<Sim | null>(null);
  const [done, setDone] = useState({ fake: false, honest: false, sim: false });

  const finished = node === "end";
  const isHonest = path[0] === HONEST;
  const opts = finished ? [] : TREE[node];

  const choose = (o: Opt) => {
    const next = [...path, o.w];
    setPath(next);
    const nn = o.next ?? "end";
    setNode(nn);
    if (nn === "end") setDone((d) => ({ ...d, fake: d.fake || next[0] !== HONEST, honest: d.honest || next[0] === HONEST }));
  };
  const auto = () => choose(opts[pickIndex(opts.map((x) => x.p), Math.random())]);
  const reset = () => {
    setPath([]);
    setNode("start");
    setChecked(false);
  };
  const run100 = () => {
    let fake = 0;
    let honest = 0;
    const examples = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const a = sampleAnswer();
      if (a[0] === HONEST) honest++;
      else {
        fake++;
        if (examples.size < 4) examples.add(a.join(" "));
      }
    }
    setSim({ fake, honest, examples: [...examples] });
    setDone((d) => ({ ...d, sim: true }));
  };

  return (
    <div>
      <p className="p9-q">
        <span className="muted">Question</span> {QUESTION84}
      </p>
      <div className="p9-sent" aria-live="polite" style={{ marginTop: 8 }}>
        <span className="muted" style={{ fontSize: 14 }}>
          AI:
        </span>
        {path.length === 0 && <span className="p9-blank">?</span>}
        {path.map((w, i) => (
          <span key={i} className={`chip ${checked && !isHonest ? "p9-false" : "hl-yellow"}`}>
            {w}
          </span>
        ))}
        {!finished && path.length > 0 && <span className="p9-blank">?</span>}
      </div>

      {!finished && (
        <>
          <div className="p9-opts" role="group" aria-label="Candidates for the next piece">
            {opts.map((o) => (
              <button key={o.w} className="p9-opt" onClick={() => choose(o)}>
                <span>{o.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${o.p * 100}%`, background: `var(--hl-${o.c ?? "yellow"})` }} />
                </span>
                <span className="val">{Math.round(o.p * 100)}%</span>
              </button>
            ))}
          </div>
          <div className="lab-actions">
            <button className="btn ghost" onClick={auto}>
              Draw by probability
            </button>
          </div>
        </>
      )}

      {finished && (
        <div className="lab-actions">
          {!checked && (
            <button className="btn" onClick={() => setChecked(true)}>
              Check the facts
            </button>
          )}
          <button className="btn ghost" onClick={reset}>
            Answer again
          </button>
        </div>
      )}
      {finished && checked && (
        <p className="lab-tip">
          {isHonest
            ? "An honest answer! The title was made up for this example, so the book doesn't exist. But the chance of taking this path was only 4% at the first piece."
            : "The title was made up, so this book doesn't exist. Each piece sounded plausible, but the answer they make together is a fake fact. Next time, start with 'I can't find'."}
        </p>
      )}

      <h4 className="p9-h">Answer 100 times</h4>
      <p className="muted" style={{ margin: 0, fontSize: 15 }}>
        Ask the same question 100 times and let it answer by drawing pieces by probability each time.
      </p>
      <div className="lab-actions">
        <button className="btn" onClick={run100}>
          Answer 100 times
        </button>
      </div>
      {sim && (
        <div className="lab-out" aria-live="polite">
          <div className="bars">
            <div className="bar-row">
              <span className="label">Made up</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.fake}%`, background: "var(--hl-pink)" }} />
              </span>
              <span className="val">{sim.fake}×</span>
            </div>
            <div className="bar-row">
              <span className="label">"Can't find"</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${sim.honest}%`, background: "var(--hl-mint)" }} />
              </span>
              <span className="val">{sim.honest}×</span>
            </div>
          </div>
          <ul className="p9-examples">
            {sim.examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <p className="lab-tip" style={{ marginTop: 4 }}>
            The made-up answers change the year and the genre every time. If the same question gets a different answer each time, it may be made up. Still, the sure way is to look it up yourself.
          </p>
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.fake}>{done.fake ? "○" : "□"} Pick only plausible pieces to finish a fake description</li>
        <li data-done={done.honest}>{done.honest ? "○" : "□"} Make an honest answer that starts with 'I can't find'</li>
        <li data-done={done.sim}>{done.sim ? "○" : "□"} Answer 100 times and count how often it makes things up</li>
      </ul>
      <p className="p9-note">The book title and the probabilities are made up for this example.</p>
    </div>
  );
}
