import { useState } from "react";
import { DOCS, QUESTIONS, scoreDoc } from "../../../../data/ch88";
import "../../../../playgrounds/part10/style.css";

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
    else r = { kind: "none", text: "放进来的文档里找不到答案。" };
    setResult(r);
    if (r.kind === "answer") setDone((d) => ({ ...d, cited: true }));
    if (r.kind === "trap") setDone((d) => ({ ...d, trap: true }));
    if (r.kind === "none" && !q.answer) setDone((d) => ({ ...d, unknown: true }));
  };
  const noDocs = () => setResult({ kind: "madeup", text: q.madeUp });

  const tip = !result
    ? !searched
      ? "先检索文档。和检索词重合越多的文档，排得越靠前。"
      : picked.length === 0
        ? "挑出要放进去的文档（最多 2 份）。什么都不放，直接让它回答也可以。"
        : "检查一下提示词，再按“回答”。"
    : result.kind === "answer"
      ? "这是附了出处的回答！最好养成习惯：打开出处文档，确认上面真是这么写的。"
      : result.kind === "trap"
        ? "它看着去年的文档回答了！模型会完全相信放进来的文档。看看出处的年份吧。"
        : result.kind === "none"
          ? q.answer
            ? "合适的文档没放进去。看看检索排名，换一份文档试试。"
            : "文档里没有的内容，回答“不知道”才是诚实的。学校文档里根本没有研学旅行的通知。"
          : "没有出处，编得像模像样（第 84 章的幻觉）。根本没法确认是不是真的。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择问题">
        {QUESTIONS.map((x, i) => (
          <button key={x.key} className="p10-seg" aria-pressed={qi === i} onClick={() => chooseQ(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        检索词：{q.keys.map((k) => `“${k}”`).join("、")}
      </p>
      <div className="lab-actions" style={{ marginTop: 6 }}>
        <button className="btn" onClick={search}>
          ① 检索文档
        </button>
      </div>

      {searched && (
        <>
          <h4 className="p10-h">检索结果 · 点一下放进提示词（最多 {MAX_PICK} 份）</h4>
          <div className="p10-docs">
            {ranked.map(({ d, hits }) => (
              <button key={d.id} className="p10-doc" aria-pressed={picked.includes(d.id)} disabled={!picked.includes(d.id) && picked.length >= MAX_PICK} onClick={() => toggle(d.id)}>
                <span className="p10-doc-head">
                  <span className={`chip hl-${d.c}`}>{d.title}</span>
                  <span className="p10-score">{hits.length} 分</span>
                </span>
                <span className="p10-doc-text">{d.text}</span>
                {hits.length > 0 && <span className="p10-hits">重合的检索词：{hits.join("、")}</span>}
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            这里按检索词重合了几个来打分。真正的检索会把问题和文档变成向量，找离得近的（第 8 章）。
          </p>

          <h4 className="p10-h">交给模型的文字（提示词）</h4>
          <div className="p10-prompt">
            {picked.map((id) => (
              <p key={id}>
                <b>[文档：{title(id)}]</b> {DOCS.find((d) => d.id === id)?.text}
              </p>
            ))}
            {picked.length === 0 && <p className="muted">（没放文档）</p>}
            <p>只根据上面的文档回答。文档里没有的，就说不知道。</p>
            <p>
              <b>问题：</b>{q.q}
            </p>
          </div>
        </>
      )}

      <div className="lab-actions">
        <button className="btn" disabled={!searched} onClick={answer}>
          ② 回答
        </button>
        <button className="btn ghost" onClick={noDocs}>
          不放文档直接问
        </button>
      </div>

      {result && (
        <div className="p10-answer" data-kind={result.kind} aria-live="polite">
          <p className="p10-answer-text">{result.text}</p>
          {result.source && <span className="p10-source">出处：{result.source}</span>}
          {result.kind === "madeup" && <span className="p10-source bad">没有出处 · 示意例子</span>}
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.cited}>{done.cited ? "✓" : "○"} 得到附出处的回答</li>
        <li data-done={done.trap}>{done.trap ? "✓" : "○"} 找出去年文档的陷阱</li>
        <li data-done={done.unknown}>{done.unknown ? "✓" : "○"} 对文档里没有的问题，得到“不知道”的回答</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
