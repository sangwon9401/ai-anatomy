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
  const kind = shots === 0 ? "零样本" : shots === 1 ? "单样本" : "少样本";

  let tip = "一张张点例子卡片，把它们放进提示词。";
  if (shots === 0) tip = `没有例子（零样本）时，模型很容易像“${task.cands[top]}”这样，直接把话接下去。`;
  else if (top === 0 && dist[0] > 0.8) tip = `有了 ${shots} 个例子，“${task.cands[0]}”几乎确定了。可模型的数字一个都没变！`;
  else if (top === 1) tip = `不相干的例子把规律带偏了。模型会照着提示词里例子的规律来做。`;
  else if (odd) tip = "规律不同的例子混在一起，模型也会犯糊涂。";
  else tip = `${shots} 个例子。模型正在察觉规律。再放一个试试？`;

  const missions = [
    { key: "rule", text: "让正确答案的概率超过 80%" },
    { key: "odd", text: "用不相干的例子把回答带偏" },
  ];

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择任务">
        {TASKS.map((t) => (
          <button key={t.key} aria-pressed={t.key === taskKey} onClick={() => pick(t.key)} style={t.key === taskKey ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {t.name}
          </button>
        ))}
      </div>
      <p className="p7-label" style={{ marginTop: 12 }}>
        例子卡片（点一下放进 / 拿出）
      </p>
      <div className="p7-cards">
        {task.examples.map((ex, i) => (
          <button key={ex} className="p7-card" aria-pressed={used[i]} onClick={() => flip(i)}>
            {ex}
          </button>
        ))}
        <button className="p7-card odd" aria-pressed={odd} onClick={flipOdd}>
          {task.odd} <small>不相干的例子</small>
        </button>
      </div>

      <div className="p7-prompt" aria-label="提示词">
        <span className="p7-prompt-tag">
          提示词 · {kind}
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
      <p className="lab-sum">模型里的数字：没变 · 变的只有提示词</p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!seen[m.key]}>
            {seen[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">概率是示意数据，用“每个例子加固定分数”的简单规则算出来的。</p>
    </div>
  );
}
