import { useState } from "react";
import { CAND_COLORS, TASKS, guess } from "../../data/ch71";
import "./style.css";

export function FewShotLab() {
  const [taskKey, setTaskKey] = useState(TASKS[0].key);
  const task = TASKS.find((t) => t.key === taskKey)!;
  const [used, setUsed] = useState<boolean[]>([false, false, false]);
  const [odd, setOdd] = useState(false);
  const k = used.filter(Boolean).length;
  const dist = guess(task, k, odd);
  const top = dist.indexOf(Math.max(...dist));
  const [seen, setSeen] = useState<Record<string, boolean>>({});

  const record = (nextK: number, nextOdd: boolean) => {
    const d = guess(task, nextK, nextOdd);
    const t = d.indexOf(Math.max(...d));
    setSeen((s) => ({ ...s, rule: s.rule || (t === 0 && d[0] > 0.8), odd: s.odd || t === 1 }));
  };
  const flip = (i: number) => {
    const next = used.map((u, j) => (j === i ? !u : u));
    setUsed(next);
    record(next.filter(Boolean).length, odd);
  };
  const flipOdd = () => {
    setOdd(!odd);
    record(k, !odd);
  };
  const pick = (key: string) => {
    setTaskKey(key);
    setUsed([false, false, false]);
    setOdd(false);
  };

  const lines = [...task.examples.filter((_, i) => used[i]), ...(odd ? [task.odd] : [])];
  const shots = lines.length;
  const kind = shots === 0 ? "제로샷" : shots === 1 ? "원샷" : "퓨샷";

  let tip = "예시 카드를 하나씩 눌러 프롬프트에 넣어 보세요.";
  if (shots === 0) tip = `예시가 없으면(제로샷) 모델은 '${task.cands[top]}'처럼 그냥 글을 이어 쓰기 쉬워요.`;
  else if (top === 0 && dist[0] > 0.8) tip = `예시 ${shots}개로 '${task.cands[0]}'가 거의 확실해졌어요. 모델의 숫자는 하나도 안 바뀌었는데요!`;
  else if (top === 1) tip = `엉뚱한 예시가 규칙을 바꿔 버렸어요. 모델은 프롬프트 속 예시의 규칙을 그대로 따라 해요.`;
  else if (odd) tip = "서로 다른 규칙의 예시가 섞이면 모델도 헷갈려요.";
  else tip = `예시 ${shots}개. 규칙을 눈치채는 중이에요. 하나 더 넣어 볼까요?`;

  const missions = [
    { key: "rule", text: "정답 확률을 80% 넘게 만들기" },
    { key: "odd", text: "엉뚱한 예시로 대답을 바꿔 버리기" },
  ];

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="과제 고르기">
        {TASKS.map((t) => (
          <button key={t.key} aria-pressed={t.key === taskKey} onClick={() => pick(t.key)} style={t.key === taskKey ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {t.name}
          </button>
        ))}
      </div>
      <p className="p7-label" style={{ marginTop: 12 }}>
        예시 카드 (눌러서 넣기/빼기)
      </p>
      <div className="p7-cards">
        {task.examples.map((ex, i) => (
          <button key={ex} className="p7-card" aria-pressed={used[i]} onClick={() => flip(i)}>
            {ex}
          </button>
        ))}
        <button className="p7-card odd" aria-pressed={odd} onClick={flipOdd}>
          {task.odd} <small>엉뚱한 예시</small>
        </button>
      </div>

      <div className="p7-prompt" aria-label="프롬프트">
        <span className="p7-prompt-tag">
          프롬프트 · {kind}
        </span>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
        <div className="q">
          {task.query} <span className="pen">?</span>
        </div>
      </div>

      <div className="bars" style={{ marginTop: 12 }}>
        {task.cands.map((c, i) => (
          <div className="bar-row" key={c}>
            <span className="label" style={i === top ? { fontWeight: 700 } : undefined}>
              {c}
            </span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${dist[i] * 100}%`, background: `var(--hl-${CAND_COLORS[i]})` }} />
            </span>
            <span className="val">{(dist[i] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <p className="lab-sum">모델 안의 숫자: 그대로 · 바뀐 건 프롬프트뿐</p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!seen[m.key]}>
            {seen[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">확률은 설명용 예시예요. 예시마다 정해진 만큼 점수를 더하는 단순한 규칙으로 계산했어요.</p>
    </div>
  );
}
