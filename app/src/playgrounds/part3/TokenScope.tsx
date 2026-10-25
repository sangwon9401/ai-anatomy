import { useState } from "react";
import { PRESETS } from "../../data/part3-tokens";
import { TokenChips } from "./TokenChips";
import "./style.css";

export function TokenScope() {
  const [k, setK] = useState(0);
  const [ids, setIds] = useState(false);
  const p = PRESETS[k];
  const chars = [...p.text].length;
  const words = p.text.trim().split(/\s+/).length;

  return (
    <div>
      <div className="ctx-presets p3-presets" role="group" aria-label="문장 고르기">
        {PRESETS.map((q, i) => (
          <button key={q.text} aria-pressed={i === k} className={i === k ? "p3-on" : undefined} onClick={() => setK(i)}>
            {q.text.length > 12 ? `${[...q.text].slice(0, 11).join("")}…` : q.text}
          </button>
        ))}
      </div>

      <div className="p3-sentence">{p.text}</div>
      <div className="p3-counts num">
        <span>
          글자 <b>{chars}</b>
        </span>
        <span>
          단어 <b>{words}</b>
        </span>
        <span className="p3-count-tok">
          토큰 <b>{p.o200k.length}</b>
        </span>
      </div>

      <TokenChips toks={p.o200k} ids={ids} />

      <div className="lab-actions">
        <button className="btn ghost" aria-pressed={ids} onClick={() => setIds((v) => !v)}>
          {ids ? "조각으로 보기" : "번호로 보기"}
        </button>
      </div>
      <p className="lab-tip">{ids ? "모델이 실제로 받는 건 이 번호 줄이에요. 같은 조각은 언제나 같은 번호예요." : p.note}</p>
      <p className="lab-sum">실제 GPT-4o 토크나이저(o200k_base)로 미리 잘라 둔 결과예요. ␣는 띄어쓰기, 점선 조각은 글자 하나를 이루는 바이트의 일부예요(28장).</p>
    </div>
  );
}
