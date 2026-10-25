// en: overlay of src/playgrounds/part3/TokenScope.tsx (strings only)
import { useState } from "react";
import { PRESETS } from "../../../../data/part3-tokens";
import { TokenChips } from "../../../../playgrounds/part3/TokenChips";
import "../../../../playgrounds/part3/style.css";

export function TokenScope() {
  const [k, setK] = useState(0);
  const [ids, setIds] = useState(false);
  const p = PRESETS[k];
  const chars = [...p.text].length;
  const words = p.text.trim().split(/\s+/).length;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="Pick a sentence">
        {PRESETS.map((q, i) => (
          <button key={q.text} aria-pressed={i === k} className={i === k ? "p3-on" : undefined} onClick={() => setK(i)}>
            {q.text.length > 16 ? `${[...q.text].slice(0, 15).join("")}…` : q.text}
          </button>
        ))}
      </div>

      <div className="p3-sentence">{p.text}</div>
      <div className="p3-counts num">
        <span>
          characters <b>{chars}</b>
        </span>
        <span>
          words <b>{words}</b>
        </span>
        <span className="p3-count-tok">
          tokens <b>{p.o200k.length}</b>
        </span>
      </div>

      <TokenChips toks={p.o200k} ids={ids} />

      <div className="lab-actions">
        <button className="btn ghost" aria-pressed={ids} onClick={() => setIds((v) => !v)}>
          {ids ? "Show pieces" : "Show numbers"}
        </button>
      </div>
      <p className="lab-tip">{ids ? "This row of numbers is what the model really receives. The same piece always gets the same number." : p.note}</p>
      <p className="lab-sum">Cut in advance with the real GPT-4o tokenizer (o200k_base). ␣ is a space; a dashed piece holds only some of one character's bytes (chapter 28).</p>
    </div>
  );
}
