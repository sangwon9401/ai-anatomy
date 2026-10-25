import { useState } from "react";
import { TASKS, calc, fmt, search, type Tool } from "../../../../data/ch89";
import "../../../../playgrounds/part10/style.css";

type Item = { kind: "q" | "think" | "call" | "result" | "answer"; text: string };
const TOOL_NAME: Record<Tool, string> = { calc: "计算器", search: "搜索" };
/** true when the last syllable has a Korean final consonant (Korean particles only; always false for Chinese) */
const batchim = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};
const KIND_NAME: Record<Item["kind"], string> = { q: "问题", think: "模型", call: "调用工具", result: "结果", answer: "回答" };

function runTool(tool: Tool, arg: string) {
  if (tool === "calc") {
    const v = calc(arg);
    return v === null ? "无法计算" : fmt(v);
  }
  const hit = search(arg);
  return hit ? `[${hit.title}] ${hit.text}` : "没有找到文档";
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
    ? `哎呀，模型调用的工具是“${waiting ? TOOL_NAME[waiting.tool] : ""}”${waiting && batchim(TOOL_NAME[waiting.tool]) ? "" : ""}。仔细读读调用的那行字。`
    : finished
      ? `完成！模型运行了 ${runs.model} 次，工具用了 ${runs.tool} 次。这就是在“思考 → 工具 → 结果”里转圈，也就是智能体。`
      : waiting
        ? `模型写下了“${TOOL_NAME[waiting.tool]}(…)”${batchim(TOOL_NAME[waiting.tool]) ? "" : ""}。模型在这里暂停。轮到我这个程序去运行合适的工具了！`
        : last.kind === "result"
          ? "结果已经接在文字末尾了。再按 ▶，让模型读到结果接着写。"
          : "按 ▶，让模型接着写下一行。";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择任务">
        {TASKS.map((t, i) => (
          <button key={t.key} className="p10-seg" aria-pressed={ti === i} onClick={() => reset(i)}>
            {solved.includes(t.key) ? "✓ " : ""}
            {t.title}
          </button>
        ))}
      </div>

      <div className="p10-agent">
        <svg className="p10-loop" viewBox="0 0 220 190" role="img" aria-label={`当前步骤：${["思考", "运行工具", "接上结果"][phase]}`}>
          <circle cx={110} cy={100} r={62} fill="none" stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="6 7" />
          {[
            { x: 110, y: 38, t: "思考" },
            { x: 168, y: 132, t: "工具" },
            { x: 52, y: 132, t: "结果" },
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
            模型运行次数 <b>{runs.model}</b>
          </span>
          <span>
            工具使用次数 <b>{runs.tool}</b>
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
          ▶ 模型接着写
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("calc")}>
          运行计算器
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("search")}>
          运行搜索
        </button>
      </div>
      <div className="lab-actions" style={{ marginTop: 8 }}>
        <button className="btn ghost" onClick={() => reset()}>
          重新开始
        </button>
        <button className="btn ghost" disabled={guess} onClick={() => setGuess(true)}>
          不用工具直接回答
        </button>
      </div>
      {guess && (
        <p className="p10-line bad" style={{ marginTop: 10 }}>
          不用工具：“{task.guess}” ✗（示意例子）看着像样，却没法确认。
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {TASKS.map((t) => (
          <li key={t.key} data-done={solved.includes(t.key)}>
            {solved.includes(t.key) ? "✓" : "○"} 把“{t.title}”做到底
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
