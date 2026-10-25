// zh overlay of src/playgrounds/part3/TokenScope.tsx: strings, and the word count becomes a byte count (no spaces in Chinese)
import { useState } from "react";
import { PRESETS } from "../../../../data/part3-tokens";
import { TokenChips } from "./TokenChips";
import "../../../../playgrounds/part3/style.css";

export function TokenScope() {
  const [k, setK] = useState(0);
  const [ids, setIds] = useState(false);
  const p = PRESETS[k];
  const chars = [...p.text].length;
  // zh: Chinese has no spaces to count words by, so the middle count is UTF-8 bytes (ch28) instead
  const bytes = new TextEncoder().encode(p.text).length;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="选择句子">
        {PRESETS.map((q, i) => (
          <button key={q.text} aria-pressed={i === k} className={i === k ? "p3-on" : undefined} onClick={() => setK(i)}>
            {q.text.length > 12 ? `${[...q.text].slice(0, 11).join("")}…` : q.text}
          </button>
        ))}
      </div>

      <div className="p3-sentence">{p.text}</div>
      <div className="p3-counts num">
        <span>
          字符 <b>{chars}</b>
        </span>
        <span>
          字节 <b>{bytes}</b>
        </span>
        <span className="p3-count-tok">
          词元 <b>{p.o200k.length}</b>
        </span>
      </div>

      <TokenChips toks={p.o200k} ids={ids} />

      <div className="lab-actions">
        <button className="btn ghost" aria-pressed={ids} onClick={() => setIds((v) => !v)}>
          {ids ? "看词元" : "看编号"}
        </button>
      </div>
      <p className="lab-tip">{ids ? "模型真正收到的是这串编号。同一块永远是同一个编号。" : p.note}</p>
      <p className="lab-sum">这是用真实的 GPT-4o 分词器（o200k_base）预先切好的结果。␣ 表示空格，虚线块是组成一个字的部分字节（第 28 章）。</p>
    </div>
  );
}
