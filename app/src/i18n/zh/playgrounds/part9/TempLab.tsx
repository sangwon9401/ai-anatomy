import { useState } from "react";
import { SCORES81 } from "../../../../data/ch81";
import { TOY_PROMPT, generate, oddMask, softmaxT } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const SC = SCORES81.map((s) => s.s);
const PRESETS = [0, 0.5, 1, 2, 3];
const fmt = (v: number) => (v < -0.005 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const pct = (p: number) => (p > 0 && p < 0.001 ? "不到 0.1%" : `${(p * 100).toFixed(1)}%`);

type Run = { pieces: string[]; odd: boolean[] };

export function TempLab() {
  const [t, setT] = useState(1);
  const [runs, setRuns] = useState<{ t: number; list: Run[] } | null>(null);
  const [done, setDone] = useState({ same: false, diff: false, pizza: false });
  const p = softmaxT(SC, t);

  const write = () => {
    const list = Array.from({ length: 5 }, () => {
      const pieces = generate(t, Math.random);
      return { pieces, odd: oddMask(pieces) };
    });
    setRuns({ t, list });
    const uniq = new Set(list.map((r) => r.pieces.join(" "))).size;
    setDone((d) => ({
      same: d.same || uniq === 1,
      diff: d.diff || uniq === 5,
      pizza: d.pizza || list.some((r) => r.pieces[0] === "披萨"),
    }));
  };

  const uniq = runs ? new Set(runs.list.map((r) => r.pieces.join(" "))).size : 0;
  const oddRuns = runs ? runs.list.filter((r) => r.odd.some(Boolean)).length : 0;

  const tip =
    t === 0
      ? "我们约定：温度 0 就是“贪心”。第 1 名独占 100%，所以每次写的句子都一样。"
      : t < 0.6
        ? "很尖。“学校”几乎拿走了全部概率，句子也会越来越像。"
        : t <= 1.3
          ? "这是普通温度。第 1 名常被抽中，但别的词也不少。"
          : "很平。像披萨这样原本很低的候选一下子冒了上来，古怪的句子变多了。";

  return (
    <div>
      <div className="lab-row">
        <span>温度</span>
        <input type="range" min={0} max={3} step={0.1} value={t} aria-label="温度" onChange={(e) => setT(Number(e.target.value))} />
        <span className="val">{t.toFixed(1)}</span>
      </div>
      <div className="p9-seg" role="group" aria-label="快速选择温度" style={{ marginTop: 8 }}>
        {PRESETS.map((v) => (
          <button key={v} aria-pressed={Math.abs(t - v) < 0.05} onClick={() => setT(v)}>
            {v === 0 ? "0（贪心）" : v.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="lab-out">
        <div className="bars">
          {SCORES81.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label">{c.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{pct(p[i])}</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          {t === 0 ? "温度 0 → 不做除法，第 1 名拿 100%" : `分数 ÷ ${t.toFixed(1)} = ${SC.map((s) => fmt(s / t)).join(", ")} → Softmax`}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={write}>
          用这个温度写 5 句话
        </button>
      </div>

      {runs && (
        <>
          <p className="p9-note" style={{ marginTop: 12 }}>
            温度 {runs.t.toFixed(1)} 写出的句子 · 互不相同的 {uniq} 句 · 混进怪词的 {oddRuns} 句
          </p>
          <ol className="p9-runs" aria-live="polite">
            {runs.list.map((r, i) => (
              <li key={i}>
                <span className="muted">{TOY_PROMPT.join(" ")} </span>
                {r.pieces.map((w, k) => {
                  const sep = k === 0 || w === "。" || w === "…" ? "" : " ";
                  return (
                    <span key={k}>
                      {sep}
                      <span className={r.odd[k] ? "p9-odd" : undefined}>{w}</span>
                    </span>
                  );
                })}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.same}>{done.same ? "○" : "□"} 让 5 句话完全一样</li>
        <li data-done={done.diff}>{done.diff ? "○" : "□"} 让 5 句话各不相同</li>
        <li data-done={done.pizza}>{done.pizza ? "○" : "□"} 写出以“我 今天 去 披萨…”开头的句子</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">分数和第 14 章一样，是示意数据。句子由只看前一个词的玩具模型来写。粉色标出的是原本分数很低的怪词。</p>
    </div>
  );
}
