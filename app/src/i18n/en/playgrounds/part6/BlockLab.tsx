import { useState } from "react";
import { MISSING } from "../../../../data/ch54";
import { BLOCK_ORDER, KIND, kindOf, type BlockKey, type BlockKind } from "../../../../data/part6-block";
import "../../../../playgrounds/part6/style.css";
import { iga } from "../../../../playgrounds/part6/util";

const KINDS: BlockKind[] = ["att", "ffn", "add", "norm"];
const MISSION: Record<BlockKind, string> = {
  att: "Pull out attention",
  ffn: "Pull out feed-forward",
  add: "Pull out add (the highway)",
  norm: "Pull out normalize",
};

/** ch. 54: pull parts out of the block and read what breaks. */
export function BlockLab() {
  const [out, setOut] = useState<BlockKey[]>([]);
  const [seen, setSeen] = useState<BlockKind[]>([]);
  const missingKinds = KINDS.filter((k) => out.some((o) => kindOf(o) === k));
  const allSeen = KINDS.every((k) => seen.includes(k));

  const toggle = (k: BlockKey) => {
    if (out.includes(k)) {
      setOut(out.filter((o) => o !== k));
    } else {
      setOut([...out, k]);
      if (!seen.includes(kindOf(k))) setSeen([...seen, kindOf(k)]);
    }
  };

  return (
    <div>
      <div className="p6-io">
        <span className="chip outline">I</span>
        <span className="chip outline">walk</span>
        <span className="chip outline">to</span>
        <span>↓ 3 word vectors</span>
      </div>
      <div className="p6-blk" role="group" aria-label="One transformer block layer">
        <span className="p6-blk-title">Transformer block</span>
        <span className="p6-road" data-on={!out.some((o) => kindOf(o) === "add")} aria-hidden="true" />
        {BLOCK_ORDER.map((k) => {
          const kind = kindOf(k);
          const meta = KIND[kind];
          const isIn = !out.includes(k);
          if (kind === "add")
            return (
              <button key={k} className="p6-add" aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`Add: ${isIn ? "pull out" : "put back"}`}>
                <span className="plus">+</span>
                <span>{isIn ? `${meta.name}: ${meta.does}` : "Add has been pulled out"}</span>
              </button>
            );
          return (
            <button key={k} className="p6-part" data-kind={kind} aria-pressed={isIn} onClick={() => toggle(k)} aria-label={`${meta.name}: ${isIn ? "pull out" : "put back"}`}>
              <span>
                <b>{meta.name}</b>
                {kind !== "norm" && <small>{isIn ? meta.does : "pulled out"}</small>}
                {kind === "norm" && !isIn && <small>pulled out</small>}
              </span>
              <span className="ref">{meta.where}</span>
            </button>
          );
        })}
      </div>
      <div className="p6-io">
        <span>↓ 3 vectors of the same shape</span>
      </div>

      <div className="p6-diag" aria-live="polite">
        {missingKinds.length === 0 && <p className="ok">Every part is in place. The block works fine.</p>}
        {missingKinds.map((k) => (
          <p key={k}>
            <b>{iga(KIND[k].name)} pulled out:</b> {MISSING[k]}
          </p>
        ))}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {KINDS.map((k) => (
          <li key={k} data-done={seen.includes(k)}>
            {seen.includes(k) ? "✓" : "○"} {MISSION[k]}
          </li>
        ))}
      </ul>
      <div className="lab-actions">
        <button className="btn ghost" disabled={out.length === 0} onClick={() => setOut([])}>
          Put everything back
        </button>
      </div>
      <p className="lab-tip">
        {allSeen ? "The block only works properly with all four kinds of parts. From chapter 55 on, we'll open them up one by one!" : "Tap a part to pull it out. Tap it again to put it back."}
      </p>
    </div>
  );
}
