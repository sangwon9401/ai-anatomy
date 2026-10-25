// en: overlay of src/playgrounds/part3/OneHotLab.tsx (strings only)
import { useState } from "react";
import { VOCAB8, VOCAB_SIZES, dist, dot, oneHot } from "../../../../data/ch32";
import "../../../../playgrounds/part3/style.css";

const N = VOCAB8.length;

export function OneHotLab() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [tried, setTried] = useState<Set<string>>(new Set(["0-1"]));
  const [size, setSize] = useState(0);
  const va = oneHot(a, N);
  const vb = oneHot(b, N);
  const d = dist(va, vb);
  const p = dot(va, vb);

  const choose = (which: "a" | "b", i: number) => {
    const na = which === "a" ? i : a;
    const nb = which === "b" ? i : b;
    if (which === "a") setA(i);
    else setB(i);
    setTried((t) => new Set(t).add(`${Math.min(na, nb)}-${Math.max(na, nb)}`));
  };

  const pairs = [...tried].filter((k) => k.split("-")[0] !== k.split("-")[1]).length;
  const tip =
    a === b
      ? "Only a word with itself gives distance 0 and dot product 1. Two different words always give √2 and 0."
      : pairs >= 4
        ? `You tried ${pairs} different pairs and every one is √2. With one-hot, 'dog–cat' is as far apart as 'dog–bus'.`
        : "Try other pairs too. Does the distance change?";
  const n = VOCAB_SIZES[size].n;

  return (
    <div>
      {(["a", "b"] as const).map((which) => (
        <div key={which} className="p3-oh-pick">
          <span className="p3-sub">{which === "a" ? "Word A" : "Word B"}</span>
          <div className="p3-oh-words" role="group" aria-label={which === "a" ? "Pick word A" : "Pick word B"}>
            {VOCAB8.map((w, i) => {
              const on = (which === "a" ? a : b) === i;
              return (
                <button key={w} className={`p3-wbtn${on ? (which === "a" ? " hl-yellow" : " hl-sky") : ""}`} aria-pressed={on} onClick={() => choose(which, i)}>
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="p3-oh-table" role="table" aria-label="One-hot vectors">
        <div className="p3-oh-row" role="row">
          <span role="rowheader" />
          {VOCAB8.map((w) => (
            <span key={w} className="p3-oh-head" role="columnheader">
              {w}
            </span>
          ))}
        </div>
        {[
          { w: VOCAB8[a], v: va, c: "hl-yellow" },
          { w: VOCAB8[b], v: vb, c: "hl-sky" },
        ].map((r, i) => (
          <div key={i} className="p3-oh-row" role="row">
            <span role="rowheader" className="p3-oh-name">
              {r.w}
            </span>
            {r.v.map((x, k) => (
              <span key={k} role="cell" className={`p3-oh-cell num${x ? ` on ${r.c}` : ""}`}>
                {x}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="dot-formula" style={{ marginTop: 12 }}>
        distance = <b>{d === 0 ? "0" : "√2 ≈ 1.41"}</b> · dot product = <b>{p}</b>
      </div>
      <p className="lab-tip">{tip}</p>

      <div className="p3-sub" style={{ marginTop: 16 }}>
        What if the vocabulary grows?
      </div>
      <div className="seg p3-seg" role="group" aria-label="Vocabulary size">
        {VOCAB_SIZES.map((s, i) => (
          <button key={s.name} aria-pressed={i === size} onClick={() => setSize(i)}>
            {s.name}
          </button>
        ))}
      </div>
      <p className="lab-sum num" style={{ marginTop: 8 }}>
        One word = <b>{n.toLocaleString("en-US")}</b> numbers. Just one of them is 1 and {(n - 1).toLocaleString("en-US")} are 0 (only {((1 / n) * 100).toPrecision(2)}% of the slots are useful).
      </p>
    </div>
  );
}
