// en: overlay of src/playgrounds/part5/MatMulTrace.tsx (strings only)
import { useState } from "react";
import { K, OUT, Q, SCORE, V, WEIGHT, WORDS, dec3, fmt, fmtVec } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

type Tab = "qk" | "av";
const A3 = WEIGHT.map(dec3);
const MISSIONS: { tab: Tab; i: number; j: number; text: string }[] = [
  { tab: "qk", i: 2, j: 0, text: "In the score table, find the score 'to' gives 'I'" },
  { tab: "qk", i: 0, j: 1, text: "Find the top cell in the row of 'I'" },
  { tab: "av", i: 3, j: 0, text: "Find chapter 49's 2.25 among the new vectors" },
];

const t = (a: number, b: number, d = 0) => `${d ? a.toFixed(d) : fmt(a)}×${b < 0 ? `(${fmt(b)})` : fmt(b)}`;

/** ch. 50: tap a cell of Q × Kᵀ or (ratio table) × V to see which row and column made it. */
export function MatMulTrace() {
  const [tab, setTab] = useState<Tab>("qk");
  const [sel, setSel] = useState<[number, number]>([3, 2]);
  const [done, setDone] = useState<boolean[]>(MISSIONS.map(() => false));

  const pick = (i: number, j: number) => {
    setSel([i, j]);
    setDone((d) => d.map((x, k) => x || (MISSIONS[k].tab === tab && MISSIONS[k].i === i && MISSIONS[k].j === j)));
  };
  const switchTab = (next: Tab) => {
    setTab(next);
    setSel(next === "qk" ? [3, 2] : [3, 0]);
  };

  const [i, j] = sel;
  const cols = tab === "qk" ? WORDS.map((w) => w) : ["entry 1", "entry 2"];
  const value = (r: number, c: number) => (tab === "qk" ? fmt(SCORE[r][c]) : fmt(OUT[r][c]));

  let calc: string[];
  if (tab === "qk") {
    const q = Q[i];
    const k = K[j];
    calc = [`row '${WORDS[i]}' of Q ${fmtVec(q)}`, `column '${WORDS[j]}' of Kᵀ ${fmtVec(k)}`, `= ${t(q[0], k[0])} + ${t(q[1], k[1])} = ${fmt(SCORE[i][j])}`];
  } else {
    const w = A3[i];
    const col = V.map((v) => v[j]);
    calc = [
      `row '${WORDS[i]}' of the share table (${w.map((x) => x.toFixed(3)).join(", ")})`,
      `column ${j + 1} of V (${col.map((x) => fmt(x)).join(", ")})`,
      `= ${w.map((x, k) => t(x, col[k], 3)).join(" + ")} ≈ ${fmt(OUT[i][j])}`,
    ];
  }

  const tip = done.every(Boolean)
    ? "A cell of a matrix product is always 'row of the first · column of the second' (ch. 11). That's why one multiplication computes every word."
    : tab === "qk"
      ? "Tap a cell to see which row of Q and which column of Kᵀ were dotted together."
      : "A cell of the new vectors is one row of the share table dotted with one column of V: the same as chapter 49's paint mixing.";

  return (
    <div>
      <div className="p5-seg" role="tablist" aria-label="Which product">
        <button role="tab" aria-pressed={tab === "qk"} aria-selected={tab === "qk"} onClick={() => switchTab("qk")}>
          Q × Kᵀ = score table
        </button>
        <button role="tab" aria-pressed={tab === "av"} aria-selected={tab === "av"} onClick={() => switchTab("av")}>
          share table × V = new vectors
        </button>
      </div>
      <div className="p5-table-wrap">
        <table className="p5-table" aria-label={tab === "qk" ? "Score table" : "New vectors"}>
          <thead>
            <tr>
              <th className="row" />
              {cols.map((c, cj) => (
                <th key={c} style={{ color: cj === j ? "var(--pen)" : undefined }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WORDS.map((w, r) => (
              <tr key={w}>
                <th className="row" style={{ color: r === i ? "var(--pen)" : undefined }}>
                  {w}
                </th>
                {cols.map((c, cj) => (
                  <td key={c} data-hl={r === i && cj === j}>
                    <button onClick={() => pick(r, cj)} aria-label={`row ${w}, ${c}: ${value(r, cj)}`}>
                      {value(r, cj)}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p5-calc">
        {calc.map((c) => (
          <div key={c}>{c}</div>
        ))}
      </div>
      <p className="p5-note">The numbers are the same illustrative example as in chapters 46–49.</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        {MISSIONS.map((m, k) => (
          <li key={m.text} data-done={done[k]}>
            {done[k] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
