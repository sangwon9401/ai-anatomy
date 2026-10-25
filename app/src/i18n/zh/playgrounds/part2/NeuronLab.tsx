import { useState } from "react";
import { FEATURES, GOOD, NEURON, STORES, neuron, num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const fmtW = (w: number) => (w < 0 ? `(${num(w)})` : num(w));

export function NeuronLab() {
  const [w, setW] = useState<number[]>([...NEURON.w]);
  const [b, setB] = useState(NEURON.b);
  const [sel, setSel] = useState(0);

  const rows = STORES.map((s) => {
    const score = neuron(s.x, w, b);
    const says = score >= GOOD;
    const truth = s.real >= GOOD;
    return { ...s, score, says, truth, ok: says === truth };
  });
  const okCount = rows.filter((r) => r.ok).length;
  const firstWrong = rows.find((r) => !r.ok);
  const cur = rows[sel];

  let tip: string;
  if (!firstWrong) tip = "五家店的判断都和朋友们一样了！调好旋钮，这就是“学习”。从第 20 章开始，电脑会自己来做这件事。";
  else if (firstWrong.truth) tip = `对了 ${okCount} 家。朋友们说 ${firstWrong.name}好吃。转哪个旋钮，才能让 ${firstWrong.name}的分数超过 4 分？`;
  else tip = `对了 ${okCount} 家。朋友们说 ${firstWrong.name}一般。把它的分数降到 4 分以下试试，也看看别的店会不会跟着变。`;

  return (
    <div>
      <div className="lab-rows p2-sliders">
        {FEATURES.map((f, i) => (
          <div className="lab-row" key={f.key}>
            <span>{f.name}权重</span>
            <input
              type="range"
              min={-2}
              max={2}
              step={0.5}
              value={w[i]}
              aria-label={`${f.name}权重`}
              onChange={(e) => {
                const v = Number(e.target.value);
                setW((prev) => prev.map((x, j) => (j === i ? v : x)));
              }}
            />
            <span className="val">{num(w[i])}</span>
          </div>
        ))}
        <div className="lab-row">
          <span>偏置</span>
          <input type="range" min={-4} max={6} step={0.5} value={b} aria-label="偏置" onChange={(e) => setB(Number(e.target.value))} />
          <span className="val">{num(b)}</span>
        </div>
      </div>

      <div className="p2-stores" role="group" aria-label="选择店铺">
        <div className="p2-store-head">
          <span>店</span>
          <span>辣度 · 排队 · 价格</span>
          <span>神经元</span>
          <span>朋友们</span>
        </div>
        {rows.map((r, i) => (
          <button key={r.name} className="p2-store" aria-pressed={i === sel} onClick={() => setSel(i)}>
            <span className="name">{r.name.replace(" 店", "")}</span>
            <span className="ins">
              {r.x[0]} · {r.x[1]} · {r.x[2]}
            </span>
            <span className="score" style={{ background: r.says ? "var(--hl-mint)" : "var(--hl-pink)" }}>
              {num(r.score)} {r.says ? "好吃" : "一般"}
            </span>
            <span className="friend">
              {r.truth ? "好吃" : "一般"}
              <span className={`p2-mark${r.ok ? " ok" : ""}`}>{r.ok ? "○" : "✗"}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="p2-calc">
        {cur.name}: {cur.x.map((x, i) => `${x}×${fmtW(w[i])}`).join(" + ")} + {fmtW(b)} = <b>{num(cur.score)}</b>
        {" → "}
        {cur.score >= GOOD ? "4 分以上，好吃" : "不到 4 分，不算好吃"}
      </p>
      <p className="p2-note">辣度按级算，排队是等位的桌数，价格以 10 元为单位（人均）。店和数字都是示意数据。</p>

      <div className="lab-actions">
        <button
          className="btn ghost"
          onClick={() => {
            setW([...NEURON.w]);
            setB(NEURON.b);
          }}
        >
          恢复初始值
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
