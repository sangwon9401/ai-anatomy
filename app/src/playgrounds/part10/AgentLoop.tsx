import { useState } from "react";
import { TASKS, calc, fmt, search, type Tool } from "../../data/ch89";
import "./style.css";

type Item = { kind: "q" | "think" | "call" | "result" | "answer"; text: string };
const TOOL_NAME: Record<Tool, string> = { calc: "계산기", search: "검색" };
/** true when the last syllable has a final consonant (for 이에요/예요, 을/를) */
const batchim = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};
const KIND_NAME: Record<Item["kind"], string> = { q: "질문", think: "모델", call: "도구 호출", result: "결과", answer: "답" };

function runTool(tool: Tool, arg: string) {
  if (tool === "calc") {
    const v = calc(arg);
    return v === null ? "계산할 수 없어요" : fmt(v);
  }
  const hit = search(arg);
  return hit ? `[${hit.title}] ${hit.text}` : "찾은 문서가 없어요";
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
    ? `앗, 모델이 부른 도구는 '${waiting ? TOOL_NAME[waiting.tool] : ""}'${waiting && batchim(TOOL_NAME[waiting.tool]) ? "이에요" : "예요"}. 호출 글을 잘 읽어 보세요.`
    : finished
      ? `끝! 모델을 ${runs.model}번, 도구를 ${runs.tool}번 불렀어요. 생각 → 도구 → 결과 고리를 돈 거예요. 이게 에이전트예요.`
      : waiting
        ? `모델이 '${TOOL_NAME[waiting.tool]}(…)'${batchim(TOOL_NAME[waiting.tool]) ? "을" : "를"} 썼어요. 모델은 여기서 멈춰요. 프로그램인 내가 알맞은 도구를 실행할 차례!`
        : last.kind === "result"
          ? "결과를 글 끝에 붙였어요. 다시 ▶를 눌러 모델이 결과를 읽고 이어 쓰게 해요."
          : "▶를 눌러 모델이 다음 줄을 이어 쓰게 해 보세요.";

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="할 일 고르기">
        {TASKS.map((t, i) => (
          <button key={t.key} className="p10-seg" aria-pressed={ti === i} onClick={() => reset(i)}>
            {solved.includes(t.key) ? "✓ " : ""}
            {t.title}
          </button>
        ))}
      </div>

      <div className="p10-agent">
        <svg className="p10-loop" viewBox="0 0 220 190" role="img" aria-label={`지금 단계: ${["생각", "도구 실행", "결과 붙이기"][phase]}`}>
          <circle cx={110} cy={100} r={62} fill="none" stroke="var(--ink-3)" strokeWidth={3} strokeDasharray="6 7" />
          {[
            { x: 110, y: 38, t: "생각" },
            { x: 168, y: 132, t: "도구" },
            { x: 52, y: 132, t: "결과" },
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
            모델 부른 횟수 <b>{runs.model}</b>
          </span>
          <span>
            도구 쓴 횟수 <b>{runs.tool}</b>
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
          ▶ 모델 이어 쓰기
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("calc")}>
          계산기 실행
        </button>
        <button className="btn ghost" disabled={!waiting} onClick={() => use("search")}>
          검색 실행
        </button>
      </div>
      <div className="lab-actions" style={{ marginTop: 8 }}>
        <button className="btn ghost" onClick={() => reset()}>
          처음부터
        </button>
        <button className="btn ghost" disabled={guess} onClick={() => setGuess(true)}>
          도구 없이 답하게 하기
        </button>
      </div>
      {guess && (
        <p className="p10-line bad" style={{ marginTop: 10 }}>
          도구 없이: "{task.guess}" ✗ (설명용 예시) 그럴듯하지만 확인할 길이 없어요.
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {TASKS.map((t) => (
          <li key={t.key} data-done={solved.includes(t.key)}>
            {solved.includes(t.key) ? "✓" : "○"} '{t.title}' 끝까지 해내기
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
