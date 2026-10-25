import { useEffect, useState } from "react";
import { PRESETS82, keepTopK, keepTopP, renorm } from "../../../../data/ch82";
import { pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

type Mode = "k" | "p";
const pc = (p: number) => `${Math.round(p * 1000) / 10}%`;

export function CutLab() {
  const [key, setKey] = useState(PRESETS82[0].key);
  const [mode, setMode] = useState<Mode>("k");
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.9);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [seen, setSeen] = useState({ sure1: false, unsure6: false, pSure: false, pUnsure: false });

  const preset = PRESETS82.find((d) => d.key === key)!;
  const items = preset.items;
  const kk = Math.min(k, items.length);
  const keep = mode === "k" ? keepTopK(items, kk) : keepTopP(items, p);
  const probs = renorm(items, keep);
  const cum = items.map((_, i) => items.slice(0, i + 1).reduce((a, b) => a + b.p, 0));

  // missions stay done once reached
  const p90 = mode === "p" && Math.abs(p - 0.9) < 0.01;
  useEffect(() => {
    setSeen((s) => {
      const n = {
        sure1: s.sure1 || (key === "sure" && keep === 1),
        unsure6: s.unsure6 || (key === "unsure" && keep === 6),
        pSure: s.pSure || (key === "sure" && p90),
        pUnsure: s.pUnsure || (key === "unsure" && p90),
      };
      return n.sure1 === s.sure1 && n.unsure6 === s.unsure6 && n.pSure === s.pSure && n.pUnsure === s.pUnsure ? s : n;
    });
  }, [key, keep, p90]);
  const now = seen;

  const change = (f: () => void) => {
    f();
    setCounts(null);
  };
  const draw = () => {
    const c = items.map(() => 0);
    for (let i = 0; i < 10; i++) c[pickIndex(probs, Math.random())]++;
    setCounts(c);
  };

  const cutNames = items.slice(keep).map((it) => it.w);
  let tip: string;
  if (key === "school") tip = cutNames.includes("披萨") ? `剪掉了 ${cutNames.length} 个。披萨和“其他”这条尾巴没了，不会再抽出怪词。` : "披萨还留着呢。再多剪一点试试？";
  else if (key === "sure") tip = keep === 1 ? "只剩正确答案 9 了。模型有把握时，只留一个最稳妥。" : `还剩 ${keep} 个。8 或 11 这样的错误答案偶尔也会被抽中。`;
  else tip = keep <= 3 ? "连葡萄、西瓜、桃子这些好好的答案也被剪掉了。换成 Top-p 90% 试试。" : cutNames.includes("椅子") ? `还剩 ${keep} 个。只剪掉了离谱的“椅子”，各种水果都留下来了。` : "连椅子都还留着。再剪一点点试试？";

  return (
    <div>
      <div className="ctx-presets p9-tall" role="group" aria-label="选择句子" style={{ marginTop: 0 }}>
        {PRESETS82.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => change(() => setKey(d.key))} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name} ___
          </button>
        ))}
      </div>

      <div className="p9-seg" role="group" aria-label="剪的方法" style={{ marginTop: 12 }}>
        <button aria-pressed={mode === "k"} onClick={() => change(() => setMode("k"))}>
          Top-k
        </button>
        <button aria-pressed={mode === "p"} onClick={() => change(() => setMode("p"))}>
          Top-p
        </button>
      </div>
      <div className="lab-row" style={{ marginTop: 10 }}>
        <span>{mode === "k" ? "k" : "p"}</span>
        {mode === "k" ? (
          <input type="range" min={1} max={items.length} step={1} value={kk} aria-label="保留的候选个数 k" onChange={(e) => change(() => setK(Number(e.target.value)))} />
        ) : (
          <input type="range" min={0.5} max={1} step={0.05} value={p} aria-label="累加概率的标准 p" onChange={(e) => change(() => setP(Number(e.target.value)))} />
        )}
        <span className="val">{mode === "k" ? `${kk} 个` : `${Math.round(p * 100)}%`}</span>
      </div>

      <div className="lab-out">
        <div className="p9-cut-head">
          <span>候选</span>
          <span>原来的概率</span>
          <span>{mode === "p" ? "累加" : ""}</span>
          <span>剪完后</span>
        </div>
        <div className="bars">
          {items.map((it, i) => {
            const kept = i < keep;
            return (
              <div className="p9-cut-row" key={it.w} data-cut={!kept}>
                <span className="label">{it.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${it.p * 100}%`, background: kept ? (it.c ? `var(--hl-${it.c})` : "var(--ink-3)") : "var(--line)" }} />
                </span>
                <span className="n muted">{mode === "p" && i <= keep - 1 ? pc(cum[i]) : ""}</span>
                <span className="n">{kept ? pc(probs[i]) : "剪掉"}</span>
              </div>
            );
          })}
        </div>
        <div className="lab-sum">
          剩下 {keep} 个候选 · 把剩下的 {pc(cum[keep - 1])} 重新分配，总和 100%
          {key === "school" ? " · 其他 = 几万个片段加在一起" : ""}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          用剩下的候选转 10 次
        </button>
      </div>
      {counts && (
        <p className="p9-draws" aria-live="polite">
          {items.map((it, i) =>
            counts[i] > 0 ? (
              <span key={it.w} className={`chip ${it.c ? `hl-${it.c}` : "hl-none"}`}>
                {it.w} {counts[i]} 次
              </span>
            ) : null,
          )}
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={now.sure1}>{now.sure1 ? "○" : "□"} 在“1, 3, 5, 7,”里只留下正确答案 9</li>
        <li data-done={now.unsure6}>{now.unsure6 ? "○" : "□"} 在水果那句里只剪掉离谱的“椅子”</li>
        <li data-done={now.pSure && now.pUnsure}>{now.pSure && now.pUnsure ? "○" : "□"} 用 Top-p 90% 比较两句（1, 3, 5, 7 / 水果）：留下的个数一样吗？</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">概率是示意数据。</p>
    </div>
  );
}
