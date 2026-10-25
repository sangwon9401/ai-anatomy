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
    else r = { kind: "none", text: "入れてもらった文書の中には、答えが見つかりません。" };
    setResult(r);
    if (r.kind === "answer") setDone((d) => ({ ...d, cited: true }));
    if (r.kind === "trap") setDone((d) => ({ ...d, trap: true }));
    if (r.kind === "none" && !q.answer) setDone((d) => ({ ...d, unknown: true }));
  };
  const noDocs = () => setResult({ kind: "madeup", text: q.madeUp });

  const tip = !result
    ? !searched
      ? "まず文書を検索してみましょう。検索語がたくさん重なる文書ほど上に来ます。"
      : picked.length === 0
        ? "入れる文書を選んでみましょう（2つまで）。何も入れずに答えさせてもかまいません。"
        : "プロンプトを確かめて「答える」を押してみましょう。"
    : result.kind === "answer"
      ? "出典つきの答えです！出典の文書を開いて、本当にそう書いてあるか確かめるのを習慣にしましょう。"
      : result.kind === "trap"
        ? "去年の文書を見て答えました！モデルは入れてもらった文書をそのまま信じます。出典の年を確かめましょう。"
        : result.kind === "none"
          ? q.answer
            ? "合う文書が入っていません。検索の順位を見て、ほかの文書を入れてみましょう。"
            : "文書にないことは「わからない」と答えるのが正直な答えです。学校の文書に、修学旅行のお知らせはありませんから。"
          : "出典なしで、もっともらしく作ってしまいました（第84章のハルシネーション）。本当かどうか確かめる方法がありません。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="質問を選ぶ">
        {QUESTIONS.map((x, i) => (
          <button key={x.key} className="p10-seg" aria-pressed={qi === i} onClick={() => chooseQ(i)}>
            {x.q}
          </button>
        ))}
      </div>
      <p className="lab-sum">
        検索語：{q.keys.map((k) => `「${k}」`).join("")}
      </p>
      <div className="lab-actions" style={{ marginTop: 6 }}>
        <button className="btn" onClick={search}>
          ① 文書を検索する
        </button>
      </div>

      {searched && (
        <>
          <h4 className="p10-h">検索結果・押してプロンプトに入れる（{MAX_PICK}つまで）</h4>
          <div className="p10-docs">
            {ranked.map(({ d, hits }) => (
              <button key={d.id} className="p10-doc" aria-pressed={picked.includes(d.id)} disabled={!picked.includes(d.id) && picked.length >= MAX_PICK} onClick={() => toggle(d.id)}>
                <span className="p10-doc-head">
                  <span className={`chip hl-${d.c}`}>{d.title}</span>
                  <span className="p10-score">{hits.length}点</span>
                </span>
                <span className="p10-doc-text">{d.text}</span>
                {hits.length > 0 && <span className="p10-hits">重なった検索語：{hits.join("、")}</span>}
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
            ここでは、検索語がいくつ重なるかで点数をつけます。本物の検索は、質問と文書をベクトルに変えて近いものを探します（第8章）。
          </p>

          <h4 className="p10-h">モデルに入る文章（プロンプト）</h4>
          <div className="p10-prompt">
            {picked.map((id) => (
              <p key={id}>
                <b>[文書：{title(id)}]</b> {DOCS.find((d) => d.id === id)?.text}
              </p>
            ))}
            {picked.length === 0 && <p className="muted">（入れた文書なし）</p>}
            <p>上の文書だけを見て答えてください。文書になければ、わからないと答えてください。</p>
            <p>
              <b>質問：</b>{q.q}
            </p>
          </div>
        </>
      )}

      <div className="lab-actions">
        <button className="btn" disabled={!searched} onClick={answer}>
          ② 答える
        </button>
        <button className="btn ghost" onClick={noDocs}>
          文書なしで聞いてみる
        </button>
      </div>

      {result && (
        <div className="p10-answer" data-kind={result.kind} aria-live="polite">
          <p className="p10-answer-text">{result.text}</p>
          {result.source && <span className="p10-source">出典：{result.source}</span>}
          {result.kind === "madeup" && <span className="p10-source bad">出典なし・説明用の例</span>}
        </div>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.cited}>{done.cited ? "✓" : "○"} 出典つきの答えをもらう</li>
        <li data-done={done.trap}>{done.trap ? "✓" : "○"} 去年の文書のわなを見つける</li>
        <li data-done={done.unknown}>{done.unknown ? "✓" : "○"} 文書にない質問に「わからない」という答えをもらう</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
