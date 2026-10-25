import { useState } from "react";
import { FACTORY_DOCS, KIND_NAME, type Kind } from "../../../../data/ch63";
import "../../../../playgrounds/part7/style.css";

type Pick = "keep" | "drop" | null;

const FILTER_OF: Record<Exclude<Kind, "ok">, string> = {
  dup: "① Remove copies",
  quality: "② Quality filter",
  harm: "③ Harm filter",
};

export function DataFactory() {
  const [picks, setPicks] = useState<Pick[]>(() => FACTORY_DOCS.map(() => null));
  const [checked, setChecked] = useState(false);
  const allPicked = picks.every((p) => p !== null);
  const right = FACTORY_DOCS.map((d, i) => (d.kind === "ok") === (picks[i] === "keep"));
  const nRight = right.filter(Boolean).length;
  const kept = FACTORY_DOCS.filter((d) => d.kind === "ok").length;
  const missedDup = FACTORY_DOCS.some((d, i) => d.kind === "dup" && picks[i] === "keep");

  const pick = (i: number, v: Pick) => setPicks((ps) => ps.map((p, j) => (j === i ? v : p)));
  const count = (k: Kind) => FACTORY_DOCS.filter((d) => d.kind === k).length;

  const nPicked = picks.filter((p) => p !== null).length;
  let tip = "Read each text and tap 'Keep' or 'Toss'.";
  if (!checked && nPicked > 0) tip = allPicked ? "All sorted! Check them with the factory filters." : `${nPicked} of ${FACTORY_DOCS.length} sorted.`;
  if (checked)
    tip =
      nRight === FACTORY_DOCS.length
        ? "All correct! You're now an inspector who makes clean textbooks."
        : missedDup
          ? `${nRight} correct. Even good text keeps only one copy: removing copies is the very first filter.`
          : `${nRight} correct. Read the reasons for the texts marked in red.`;

  return (
    <div>
      <ol className="p7-docs">
        {FACTORY_DOCS.map((d, i) => (
          <li key={i} className="p7-doc" data-result={checked ? (d.kind === "ok" ? "keep" : "drop") : undefined}>
            <span className="p7-doc-n">{i + 1}</span>
            <p className="p7-doc-text">{d.text}</p>
            <div className="p7-doc-pick" role="group" aria-label={`Text ${i + 1}`}>
              {(["keep", "drop"] as const).map((v) => (
                <button key={v} data-v={v} aria-pressed={picks[i] === v} disabled={checked} onClick={() => pick(i, v)}>
                  {v === "keep" ? "Keep" : "Toss"}
                </button>
              ))}
            </div>
            {checked && (
              <p className="p7-doc-res">
                {right[i] ? "○ " : <span className="bad">✗ </span>}
                <b>{d.kind === "ok" ? "Passed → textbook" : `Removed by ${FILTER_OF[d.kind]}`}</b> · {d.why}
              </p>
            )}
          </li>
        ))}
      </ol>
      {checked && (
        <div className="p7-counts num">
          <span>
            {KIND_NAME.dup}: {count("dup")}
          </span>
          <span>
            {KIND_NAME.quality}: {count("quality")}
          </span>
          <span>
            {KIND_NAME.harm}: {count("harm")}
          </span>
          <span>
            <b>
              Left for the textbook: {kept} of {FACTORY_DOCS.length}
            </b>
          </span>
        </div>
      )}
      <div className="lab-actions">
        <button className="btn" disabled={!allPicked || checked} onClick={() => setChecked(true)}>
          Check with the filters
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setPicks(FACTORY_DOCS.map(() => null));
            setChecked(false);
          }}
        >
          Start over
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
