import { useState } from "react";
import { TASKS, calc, fmt, search, type Tool } from "../../../../data/ch89";
import "../../../../playgrounds/part10/style.css";

type Item = { kind: "q" | "think" | "call" | "result" | "answer"; text: string };
const TOOL_NAME: Record<Tool, string> = { calc: "電卓", search: "検索" };
const KIND_NAME: Record<Item["kind"], string> = { q: "質問", think: "モデル", call: "道具の呼び出し", result: "結果", answer: "答え" };

function runTool(tool: Tool, arg: string) {
  if (tool === "calc") {
    const v = calc(arg);
    return v === null ? "計算できません" : fmt(v);
  }
  const hit = search(arg);
  return hit ? `[${hit.title}] ${hit.text}` : "見つかった文書はありません";
}

export function AgentLoop() {
  const [ti, setTi] = useState(0);
  const task = TASKS[ti];
  const fresh = (): Item[] => [{ kind: "q", text: task.q }];
  const [log, setLog] = useState<Item[]>(fresh);
  const [idx, setIdx] = useState(0);
  const [waiting, setWaiting] = useState<{ tool: Tool; arg: string } | null>(null);
  const [runs, setRuns] = useState({ model: 0, tool: 0 });
  const [wrong, setWrong] = useState(false);
  const [guess, setGuess] = useState(false);
  const [solved, setSolved] = useState<string[]>([]);
  const finished = idx >= task.events.length && !waiting;

  const reset = (i = ti) => {
    setTi(i);
    setLog([{ kind: "q", text: TASKS[i].q }]);
    setIdx(0);
    setWaiting(null);
    setRuns({ model: 0, tool: 0 });
    setWrong(false);
    setGuess(false);
  };
  const step = () => {
    const e = task.events[idx];
    setWrong(false);
    setRuns((r) => ({ ...r, model: r.model + 1 }));
    if (e.t === "call") {
      setLog((l) => [...l, { kind: "call", text: `${TOOL_NAME[e.tool]}(${e.arg})` }]);
      setWaiting({ tool: e.tool, arg: e.arg });
    } else {
      setLog((l) => [...l, { kind: e.t, text: e.text }]);
      if (e.t === "answer" && !solved.includes(task.key)) setSolved((s) => [...s, task.key]);
    }
    setIdx(idx + 1);
  };
  const use = (tool: Tool) => {
    if (!waiting) return;
    if (tool !== waiting.tool) {
      setWrong(true);
      return;
    }
    setWrong(false);
    setLog((l) => [...l, { kind: "result", text: runTool(tool, waiting.arg) }]);
    setRuns((r) => ({ ...r, tool: r.tool + 1 }));
    setWaiting(null);
  };

  const last = log[log.length - 1];
  const phase = waiting ? 1 : last.kind === "result" ? 2 : 0;
  const tip = wrong
    ? `おっと、モデルが呼んだ道具は「${waiting ? TOOL_NAME[waiting.tool] : ""}」です。呼び出しの文章をよく読んでみましょう。`
    : finished
      ? `完了！モデルを${runs.model}回、道具を${runs.tool}回呼びました。考える → 道具 → 結果のループを回ったのです。これがエージェントです。`
      : waiting
        ? `モデルが「${TOOL_NAME[waiting.tool]}(…)」と書きました。モデルはここで止まります。プログラムである自分が、合う道具を動かす番です！`
        : last.kind === "result"
          ? "結果を文章の最後につなげました。もう一度 ▶ を押して、モデルに結果を読ませて続きを書かせましょう。"
          : "▶ を押して、モデルに次の行を書かせてみましょう。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="やることを選ぶ">
        {TASKS.map((t, i) => (
          <button key={t.key} className="p10-seg" aria-pressed={ti === i} onClick={() => reset(i)}>
            {solved.includes(t.key) ? "✓ " : ""}
            {t.title}
          </button>
        ))}
      </div>

      <div className="p10-agent">
        <svg className="p10-loop" viewBox="0 0 220 190" role="img" aria-label={`いまの段階：${["考える", "道具を動かす", "結果をつなげる"][phase]}`}>
          <circle cx={110} cy={100} r={62} fill="none" stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="6 7" />
          {[
            { x: 110, y: 38, t: "考える" },
            { x: 168, y: 132, t: "道具" },
            { x: 52, y: 132, t: "結果" },
          ].map((n, i) => (
            <g key={n.t}>
              <rect x={n.x - 34} y={n.y - 18} width={68} height={36} rx={10} fill={phase === i ? "var(--hl-yellow)" : "var(--paper)"} stroke="var(--ink)" strokeWidth={phase === i ? 3 : 1.5} />
              <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize={16} fill={phase === i ? "var(--chip-ink)" : "var(--ink)"}>
                {n.t}
              </text>
            </g>
          ))}
        </svg>
        <div className="p10-counts">
          <span>
            モデルを呼んだ回数 <b>{runs.model}</b>
          </span>
          <span>
            道具を使った回数 <b>{runs.tool}</b>
          </span>
        </div>
      </div>

      <ol className="p10-log" aria-live="polite">
        {log.map((it, i) => (
          <li key={i} data-kind={it.kind}>
            <span className="p10-kind">{KIND_NAME[it.kind]}</span>
            <span className="p10-text">{it.text}</span>
          </li>
        ))}
      </ol>

      <div className="lab-actions">
        <button className="btn" disabled={!!waiting || finished} onClick={step}>
          ▶ モデルが続きを書く
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("calc")}>
          電卓を動かす
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("search")}>
          検索を動かす
        </button>
      </div>
      <div className="lab-actions" style={{ marginTop: 8 }}>
        <button className="btn ghost" onClick={() => reset()}>
          最初から
        </button>
        <button className="btn ghost" disabled={guess} onClick={() => setGuess(true)}>
          道具なしで答えさせる
        </button>
      </div>
      {guess && (
        <p className="p10-line bad" style={{ marginTop: 10 }}>
          道具なし：「{task.guess}」✗（説明用の例）もっともらしいけれど、確かめる方法がありません。
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {TASKS.map((t) => (
          <li key={t.key} data-done={solved.includes(t.key)}>
            {solved.includes(t.key) ? "✓" : "○"} 「{t.title}」を最後までやりとげる
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
