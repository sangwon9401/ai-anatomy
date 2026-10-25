import { useState } from "react";
import { FACTORY_DOCS, KIND_NAME, type Kind } from "../../../../data/ch63";
import "../../../../playgrounds/part7/style.css";

type Pick = "keep" | "drop" | null;

const FILTER_OF: Record<Exclude<Kind, "ok">, string> = {
  dup: "① 去重",
  quality: "② 质量过滤",
  harm: "③ 有害内容过滤",
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
  let tip = "一条条读，然后点“留下”或“扔掉”。";
  if (!checked && nPicked > 0) tip = allPicked ? "全部选好了！用工厂的过滤器检查一下吧。" : `已选 ${nPicked} / ${FACTORY_DOCS.length} 条。`;
  if (checked)
    tip =
      nRight === FACTORY_DOCS.length
        ? "全部正确！你已经是能做出干净教科书的质检员了。"
        : missedDup
          ? `答对了 ${nRight} 条。内容再好，一模一样的复制品也只留一份。去重是第一道过滤。`
          : `答对了 ${nRight} 条。看看标红的那几条，读一读原因。`;

  return (
    <div>
      <ol className="p7-docs">
        {FACTORY_DOCS.map((d, i) => (
          <li key={i} className="p7-doc" data-result={checked ? (d.kind === "ok" ? "keep" : "drop") : undefined}>
            <span className="p7-doc-n">{i + 1}</span>
            <p className="p7-doc-text">{d.text}</p>
            <div className="p7-doc-pick" role="group" aria-label={`第 ${i + 1} 条`}>
              {(["keep", "drop"] as const).map((v) => (
                <button key={v} data-v={v} aria-pressed={picks[i] === v} disabled={checked} onClick={() => pick(i, v)}>
                  {v === "keep" ? "留下" : "扔掉"}
                </button>
              ))}
            </div>
            {checked && (
              <p className="p7-doc-res">
                {right[i] ? "○ " : <span className="bad">✗ </span>}
                <b>{d.kind === "ok" ? "通过 → 教科书" : `在${FILTER_OF[d.kind]}被筛掉`}</b> · {d.why}
              </p>
            )}
          </li>
        ))}
      </ol>
      {checked && (
        <div className="p7-counts num">
          <span>
            {KIND_NAME.dup} {count("dup")} 条
          </span>
          <span>
            {KIND_NAME.quality} {count("quality")} 条
          </span>
          <span>
            {KIND_NAME.harm} {count("harm")} 条
          </span>
          <span>
            <b>
              留作教科书的 {kept} / {FACTORY_DOCS.length}
            </b>
          </span>
        </div>
      )}
      <div className="lab-actions">
        <button className="btn" disabled={!allPicked || checked} onClick={() => setChecked(true)}>
          用工厂过滤器检查
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setPicks(FACTORY_DOCS.map(() => null));
            setChecked(false);
          }}
        >
          重来一次
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
