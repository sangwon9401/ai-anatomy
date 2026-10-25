import { useState } from "react";
import { FACTORY_DOCS, KIND_NAME, type Kind } from "../../../../data/ch63";
import "../../../../playgrounds/part7/style.css";

type Pick = "keep" | "drop" | null;

const FILTER_OF: Record<Exclude<Kind, "ok">, string> = {
  dup: "① 重複の削除",
  quality: "② 品質フィルター",
  harm: "③ 有害コンテンツのフィルター",
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
  let tip = "文を1つずつ読んで、「残す」か「捨てる」を押してみましょう。";
  if (!checked && nPicked > 0) tip = allPicked ? "全部選びました！ 工場のフィルターで確かめてみましょう。" : `${nPicked} / ${FACTORY_DOCS.length}個選びました。`;
  if (checked)
    tip =
      nRight === FACTORY_DOCS.length
        ? "全問正解！ あなたはもう、きれいな教科書をつくる検査係です。"
        : missedDup
          ? `${nRight}個正解です。内容がよくても、まったく同じコピーは1つだけ残します。重複の削除がいちばん先に取り除きます。`
          : `${nRight}個正解です。赤い印がついた文の理由を読んでみましょう。`;

  return (
    <div>
      <ol className="p7-docs">
        {FACTORY_DOCS.map((d, i) => (
          <li key={i} className="p7-doc" data-result={checked ? (d.kind === "ok" ? "keep" : "drop") : undefined}>
            <span className="p7-doc-n">{i + 1}</span>
            <p className="p7-doc-text">{d.text}</p>
            <div className="p7-doc-pick" role="group" aria-label={`${i + 1}番の文`}>
              {(["keep", "drop"] as const).map((v) => (
                <button key={v} data-v={v} aria-pressed={picks[i] === v} disabled={checked} onClick={() => pick(i, v)}>
                  {v === "keep" ? "残す" : "捨てる"}
                </button>
              ))}
            </div>
            {checked && (
              <p className="p7-doc-res">
                {right[i] ? "○ " : <span className="bad">✗ </span>}
                <b>{d.kind === "ok" ? "合格 → 教科書" : `${FILTER_OF[d.kind]}で外れる`}</b> · {d.why}
              </p>
            )}
          </li>
        ))}
      </ol>
      {checked && (
        <div className="p7-counts num">
          <span>
            {KIND_NAME.dup} {count("dup")}個
          </span>
          <span>
            {KIND_NAME.quality} {count("quality")}個
          </span>
          <span>
            {KIND_NAME.harm} {count("harm")}個
          </span>
          <span>
            <b>
              教科書に残った文 {kept} / {FACTORY_DOCS.length}
            </b>
          </span>
        </div>
      )}
      <div className="lab-actions">
        <button className="btn" disabled={!allPicked || checked} onClick={() => setChecked(true)}>
          工場のフィルターで確かめる
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setPicks(FACTORY_DOCS.map(() => null));
            setChecked(false);
          }}
        >
          もう一度
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
