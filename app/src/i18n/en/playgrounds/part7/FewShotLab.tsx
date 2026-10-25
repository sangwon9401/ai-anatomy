import { useState } from "react";
import { CAND_COLORS, TASKS, guess } from "../../../../data/ch71";
import "../../../../playgrounds/part7/style.css";

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
  const kind = shots === 0 ? "zero-shot" : shots === 1 ? "one-shot" : "few-shot";

  let tip = "Tap the example cards one at a time to add them to the prompt.";
  if (shots === 0) tip = `With no examples (zero-shot), the model tends to just keep writing, like '${task.cands[top]}'.`;
  else if (top === 0 && dist[0] > 0.8) tip = `With ${shots} examples, '${task.cands[0]}' is almost certain. And not one of the model's numbers changed!`;
  else if (top === 1) tip = `The odd example changed the rule! The model simply copies the rule of the examples in the prompt.`;
  else if (odd) tip = "When examples with different rules are mixed, the model gets confused too.";
  else tip = `${shots} example${shots === 1 ? "" : "s"}. It's starting to catch on. Add another?`;

  const missions = [
    { key: "rule", text: "Get the right answer over 80%" },
    { key: "odd", text: "Flip the answer with the odd example" },
  ];

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="Choose a task">
        {TASKS.map((t) => (
          <button key={t.key} aria-pressed={t.key === taskKey} onClick={() => pick(t.key)} style={t.key === taskKey ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {t.name}
          </button>
        ))}
      </div>
      <p className="p7-label" style={{ marginTop: 12 }}>
        Example cards (tap to add or remove)
      </p>
      <div className="p7-cards">
        {task.examples.map((ex, i) => (
          <button key={ex} className="p7-card" aria-pressed={used[i]} onClick={() => flip(i)}>
            {ex}
          </button>
        ))}
        <button className="p7-card odd" aria-pressed={odd} onClick={flipOdd}>
          {task.odd} <small>odd example</small>
        </button>
      </div>

      <div className="p7-prompt" aria-label="Prompt">
        <span className="p7-prompt-tag">
          Prompt · {kind}
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
      <p className="lab-sum">The model's numbers: unchanged · only the prompt changed</p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!seen[m.key]}>
            {seen[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">The probabilities are illustrative examples, computed with a simple rule that adds a fixed amount to a score for each example.</p>
    </div>
  );
}
