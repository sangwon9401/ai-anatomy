// ja overlay of src/playgrounds/part3/TokenScope.tsx. Japanese is written without spaces, so the Korean
// "words" count (split on spaces) is left out; characters and tokens remain.
import { useState } from "react";
import { PRESETS } from "../../../../data/part3-tokens";
import { TokenChips } from "../../../../playgrounds/part3/TokenChips";
import "../../../../playgrounds/part3/style.css";

export function TokenScope() {
  const [k, setK] = useState(0);
  const [ids, setIds] = useState(false);
  const p = PRESETS[k];
  const chars = [...p.text].length;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="文をえらぶ">
        {PRESETS.map((q, i) => (
          <button key={q.text} aria-pressed={i === k} className={i === k ? "p3-on" : undefined} onClick={() => setK(i)}>
            {q.text.length > 12 ? `${[...q.text].slice(0, 11).join("")}…` : q.text}
          </button>
        ))}
      </div>

      <div className="p3-sentence">{p.text}</div>
      <div className="p3-counts num">
        <span>
          文字 <b>{chars}</b>
        </span>
        <span className="p3-count-tok">
          トークン <b>{p.o200k.length}</b>
        </span>
      </div>

      <TokenChips toks={p.o200k} ids={ids} />

      <div className="lab-actions">
        <button className="btn ghost" aria-pressed={ids} onClick={() => setIds((v) => !v)}>
          {ids ? "かけらで見る" : "番号で見る"}
        </button>
      </div>
      <p className="lab-tip">{ids ? "モデルが実際に受け取るのは、この番号の列です。同じかけらは、いつも同じ番号です。" : p.note}</p>
      <p className="lab-sum">本物のGPT-4oのトークナイザー(o200k_base)で前もって切った結果です。␣はスペース、点線のかけらは1文字をつくるバイトの一部です(第28章)。</p>
    </div>
  );
}
