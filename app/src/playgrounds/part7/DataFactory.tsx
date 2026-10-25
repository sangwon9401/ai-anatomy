import { useState } from "react";
import { FACTORY_DOCS, KIND_NAME, type Kind } from "../../data/ch63";
import "./style.css";

type Pick = "keep" | "drop" | null;

const FILTER_OF: Record<Exclude<Kind, "ok">, string> = {
  dup: "① 중복 제거",
  quality: "② 품질 필터",
  harm: "③ 유해 콘텐츠 필터",
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
  let tip = "글을 하나씩 읽고 '남기기' 또는 '버리기'를 눌러 보세요.";
  if (!checked && nPicked > 0) tip = allPicked ? "다 골랐어요! 공장 필터로 확인해 보세요." : `${nPicked} / ${FACTORY_DOCS.length}개 골랐어요.`;
  if (checked)
    tip =
      nRight === FACTORY_DOCS.length
        ? "모두 맞혔어요! 이제 당신은 깨끗한 교과서를 만드는 검사관이에요."
        : missedDup
          ? `${nRight}개 맞혔어요. 내용이 좋아도 똑같은 복사본은 하나만 남겨요. 중복 제거가 제일 먼저 걸러요.`
          : `${nRight}개 맞혔어요. 빨간 표시가 있는 글의 이유를 읽어 보세요.`;

  return (
    <div>
      <ol className="p7-docs">
        {FACTORY_DOCS.map((d, i) => (
          <li key={i} className="p7-doc" data-result={checked ? (d.kind === "ok" ? "keep" : "drop") : undefined}>
            <span className="p7-doc-n">{i + 1}</span>
            <p className="p7-doc-text">{d.text}</p>
            <div className="p7-doc-pick" role="group" aria-label={`${i + 1}번 글`}>
              {(["keep", "drop"] as const).map((v) => (
                <button key={v} data-v={v} aria-pressed={picks[i] === v} disabled={checked} onClick={() => pick(i, v)}>
                  {v === "keep" ? "남기기" : "버리기"}
                </button>
              ))}
            </div>
            {checked && (
              <p className="p7-doc-res">
                {right[i] ? "○ " : <span className="bad">✗ </span>}
                <b>{d.kind === "ok" ? "통과 → 교과서" : `${FILTER_OF[d.kind]}에서 빠짐`}</b> · {d.why}
              </p>
            )}
          </li>
        ))}
      </ol>
      {checked && (
        <div className="p7-counts num">
          <span>
            {KIND_NAME.dup} {count("dup")}개
          </span>
          <span>
            {KIND_NAME.quality} {count("quality")}개
          </span>
          <span>
            {KIND_NAME.harm} {count("harm")}개
          </span>
          <span>
            <b>
              교과서로 남은 글 {kept} / {FACTORY_DOCS.length}
            </b>
          </span>
        </div>
      )}
      <div className="lab-actions">
        <button className="btn" disabled={!allPicked || checked} onClick={() => setChecked(true)}>
          공장 필터로 확인
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setPicks(FACTORY_DOCS.map(() => null));
            setChecked(false);
          }}
        >
          다시 하기
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
