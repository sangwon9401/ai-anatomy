import { useState } from "react";
import { DOCS, QUESTIONS, scoreDoc } from "../../data/ch88";
import "./style.css";

type Result = { kind: "answer" | "trap" | "none" | "madeup"; text: string; source?: string };
const MAX_PICK = 2;
const title = (id: string) => DOCS.find((d) => d.id === id)?.title ?? "";

export function RagLab() {
  const [qi, setQi] = useState(0);
  const [searched, setSearched] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [done, setDone] = useState({ cited: false, trap: false, unknown: false });
  const q = QUESTIONS[qi];

  const ranked = DOCS.map((d, i) => ({ d, i, hits: scoreDoc(q, d) })).sort((a, b) => b.hits.length - a.hits.length || a.i - b.i);

  const chooseQ = (i: number) => {
    setQi(i);
    setSearched(false);
    setPicked([]);
    setResult(null);
  };
  const search = () => {
    setSearched(true);
    const top = ranked[0];
    setPicked(top.hits.length > 0 ? [top.d.id] : []);
    setResult(null);
  };
  const toggle = (id: string) => {
    setResult(null);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_PICK ? [...p, id] : p));
  };
  const answer = () => {
    let r: Result;
    if (q.answer && picked.includes(q.answer.doc)) r = { kind: "answer", text: q.answer.text, source: title(q.answer.doc) };
    else if (q.trap && picked.includes(q.trap.doc)) r = { kind: "trap", text: q.trap.text, source: title(q.trap.doc) };
    else r = { kind: "none", text: "넣어 준 문서에서는 답을 찾을 수 없어요." };
    setResult(r);
    if (r.kind === "answer") setDone((d) => ({ ...d, cited: true }));
    if (r.kind === "trap") setDone((d) => ({ ...d, trap: true }));
    if (r.kind === "none" && !q.answer) setDone((d) => ({ ...d, unknown: true }));
  };
  const noDocs = () => setResult({ kind: "madeup", text: q.madeUp });

  const tip = !result
    ? !searched
      ? "먼저 문서를 검색해 보세요. 검색어가 많이 겹치는 문서가 위로 올라와요."
      : picked.length === 0
        ? "넣을 문서를 골라 보세요(최대 2개). 아무것도 안 넣고 답하게 해도 돼요."
        : "프롬프트를 확인하고 '답하기'를 눌러 보세요."
    : result.kind === "answer"
      ? "출처가 달린 답이에요! 출처 문서를 열어 정말 그렇게 적혀 있는지 확인하는 게 습관이 되면 좋아요."
      : result.kind === "trap"
        ? "작년 문서를 보고 답했어요! 모델은 넣어 준 문서를 그대로 믿어요. 출처의 연도를 확인해 보세요."
        : result.kind === "none"
          ? q.answer
            ? "알맞은 문서가 빠졌어요. 검색 순위를 보고 다른 문서를 넣어 보세요."
            : "문서에 없는 내용은 '모른다'고 답하는 게 정직한 답이에요. 학교 문서에 수학여행 안내가 없거든요."
          : "출처 없이 그럴듯하게 지어냈어요(84장 환각). 정말인지 확인할 방법이 없죠.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="질문 고르기">
        {QUESTIONS.map((x, i) => (
          <button key={x.key} className="p10-seg" aria-pressed={qi === i} onClick={() => chooseQ(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        검색어: {q.keys.map((k) => `'${k}'`).join(", ")}
      </p>
      <div className="lab-actions" style={{ marginTop: 6 }}>
        <button className="btn" onClick={search}>
          ① 문서 검색하기
        </button>
      </div>

      {searched && (
        <>
          <h4 className="p10-h">검색 결과 · 눌러서 프롬프트에 넣기 (최대 {MAX_PICK}개)</h4>
          <div className="p10-docs">
            {ranked.map(({ d, hits }) => (
              <button key={d.id} className="p10-doc" aria-pressed={picked.includes(d.id)} disabled={!picked.includes(d.id) && picked.length >= MAX_PICK} onClick={() => toggle(d.id)}>
                <span className="p10-doc-head">
                  <span className={`chip hl-${d.c}`}>{d.title}</span>
                  <span className="p10-score">{hits.length}점</span>
                </span>
                <span className="p10-doc-text">{d.text}</span>
                {hits.length > 0 && <span className="p10-hits">겹친 검색어: {hits.join(", ")}</span>}
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            여기선 검색어가 몇 개 겹치는지로 점수를 매겨요. 실제 검색은 질문과 문서를 벡터로 바꿔 가까운 것을 찾아요(8장).
          </p>

          <h4 className="p10-h">모델에 들어가는 글 (프롬프트)</h4>
          <div className="p10-prompt">
            {picked.map((id) => (
              <p key={id}>
                <b>[문서: {title(id)}]</b> {DOCS.find((d) => d.id === id)?.text}
              </p>
            ))}
            {picked.length === 0 && <p className="muted">(넣은 문서 없음)</p>}
            <p>위 문서만 보고 답하세요. 문서에 없으면 모른다고 하세요.</p>
            <p>
              <b>질문:</b> {q.q}
            </p>
          </div>
        </>
      )}

      <div className="lab-actions">
        <button className="btn" disabled={!searched} onClick={answer}>
          ② 답하기
        </button>
        <button className="btn ghost" onClick={noDocs}>
          문서 없이 물어보기
        </button>
      </div>

      {result && (
        <div className="p10-answer" data-kind={result.kind} aria-live="polite">
          <p className="p10-answer-text">{result.text}</p>
          {result.source && <span className="p10-source">출처: {result.source}</span>}
          {result.kind === "madeup" && <span className="p10-source bad">출처 없음 · 설명용 예시</span>}
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.cited}>{done.cited ? "✓" : "○"} 출처가 달린 답 받기</li>
        <li data-done={done.trap}>{done.trap ? "✓" : "○"} 작년 문서 함정 찾기</li>
        <li data-done={done.unknown}>{done.unknown ? "✓" : "○"} 문서에 없는 질문에 '모른다'는 답 받기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
