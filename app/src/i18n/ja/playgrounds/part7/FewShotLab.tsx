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
  const kind = shots === 0 ? "ゼロショット" : shots === 1 ? "ワンショット" : "フューショット";

  let tip = "例のカードを1枚ずつ押して、プロンプトに入れてみましょう。";
  if (shots === 0) tip = `例がないと（ゼロショット）、モデルは「${task.cands[top]}」のように、ただ文を続けがちです。`;
  else if (top === 0 && dist[0] > 0.8) tip = `例${shots}個で「${task.cands[0]}」がほぼ確実になりました。モデルの数は1つも変わっていないのに！`;
  else if (top === 1) tip = `おかしな例が決まりを変えてしまいました。モデルはプロンプトの中の例の決まりを、そのまままねします。`;
  else if (odd) tip = "ちがう決まりの例がまざると、モデルも迷います。";
  else tip = `例${shots}個。決まりに気づきかけています。もう1つ入れてみましょうか？`;

  const missions = [
    { key: "rule", text: "正解の確率を80%より大きくする" },
    { key: "odd", text: "おかしな例で答えを変えてしまう" },
  ];

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="課題を選ぶ">
        {TASKS.map((t) => (
          <button key={t.key} aria-pressed={t.key === taskKey} onClick={() => pick(t.key)} style={t.key === taskKey ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {t.name}
          </button>
        ))}
      </div>
      <p className="p7-label" style={{ marginTop: 12 }}>
        例のカード（押して入れる・出す）
      </p>
      <div className="p7-cards">
        {task.examples.map((ex, i) => (
          <button key={ex} className="p7-card" aria-pressed={used[i]} onClick={() => flip(i)}>
            {ex}
          </button>
        ))}
        <button className="p7-card odd" aria-pressed={odd} onClick={flipOdd}>
          {task.odd} <small>おかしな例</small>
        </button>
      </div>

      <div className="p7-prompt" aria-label="プロンプト">
        <span className="p7-prompt-tag">
          プロンプト · {kind}
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
      <p className="lab-sum">モデルの中の数：そのまま · 変わったのはプロンプトだけ</p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!seen[m.key]}>
            {seen[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">確率は説明用の例です。例ごとに決まった分だけ点数を足す、単純な決まりで計算しました。</p>
    </div>
  );
}
