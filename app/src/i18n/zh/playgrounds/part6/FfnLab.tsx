import { useState } from "react";
import { FFN_WORDS, NEURON_NAMES, ffn } from "../../../../data/ch55";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

/** 第 55 章: one word through the toy 4 → 16 → 4 feed-forward layer. */
export function FfnLab() {
  const [wi, setWi] = useState(2);
  const [bend, setBend] = useState(true);
  const [pick, setPick] = useState<number | null>(null);
  const [tried, setTried] = useState<number[]>([2]);
  const [foundTop, setFoundTop] = useState(false);
  const [unbent, setUnbent] = useState(false);

  const word = FFN_WORDS[wi];
  const run = ffn(word.x, bend);
  const maxAbs = Math.max(...run.h.map(Math.abs), 1e-9);
  const top = run.h.indexOf(Math.max(...run.h));

  const choose = (i: number) => {
    setWi(i);
    setPick(null);
    if (!tried.includes(i)) setTried([...tried, i]);
  };
  const tapNeuron = (j: number) => {
    setPick(j);
    if (wi === 2 && bend && j === top) setFoundTop(true);
  };

  let tip = "点一下最亮的神经元。它会对什么有反应呢？";
  if (!bend) tip = "不拐弯的话，负数（粉色）也会原样通过。这样整台机器就等于一个像直线一样的函数，变宽也白费了（第 17 章）。";
  else if (pick !== null && NEURON_NAMES[pick]) tip = `这个神经元会对“${NEURON_NAMES[pick]}”起反应。（示意用的名字）`;
  else if (pick !== null) tip = "这个神经元很难起名字。真正的模型里，这样的神经元非常多。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="选一个词">
        {FFN_WORDS.map((w, i) => (
          <button key={w.w} aria-pressed={i === wi} onClick={() => choose(i)}>
            {w.w}
          </button>
        ))}
      </div>

      <p className="p6-label">进来的向量（经过注意力之后）</p>
      <Vec v={word.x} label="进来的向量" />

      <p className="p6-label">宽层：16 个神经元（4 倍）· 点点看</p>
      <div className="p6-neurons" role="group" aria-label="16 个神经元">
        {run.h.map((h, j) => {
          const a = Math.min(1, Math.abs(h) / maxAbs);
          const c = h >= 0 ? "var(--hl-yellow)" : "var(--hl-pink)";
          return (
            <button
              key={j}
              aria-pressed={pick === j}
              aria-label={`神经元 ${j + 1}，值 ${fmt(h, 2)}`}
              style={{ background: `color-mix(in srgb, ${c} ${Math.round(a * 100)}%, var(--paper))`, color: a > 0.45 ? "var(--chip-ink)" : "var(--ink)" }}
              onClick={() => tapNeuron(j)}
            >
              {fmt(h)}
            </button>
          );
        })}
      </div>

      <div className="lab-actions">
        <button
          className="btn ghost"
          aria-pressed={!bend}
          onClick={() => {
            setBend(!bend);
            if (bend) setUnbent(true);
          }}
        >
          {bend ? "关掉 GELU 拐弯" : "重新打开 GELU 拐弯"}
        </button>
      </div>

      <p className="p6-label">思考的结果（缩回 4 个）</p>
      <Vec v={run.y} label="思考的结果" />
      <p className="p6-label">原来的向量 + 思考的结果 = 新向量</p>
      <Vec v={run.out} label="新向量" />
      <p className="p6-note">数字和神经元的名字都是示意数据。GPT-3 是 12,288 个 → 49,152 个 → 12,288 个。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={tried.length === 3}>{tried.length === 3 ? "✓" : "○"} 三个词都放进去试试</li>
        <li data-done={foundTop}>{foundTop ? "✓" : "○"} 在“去”里点最亮的神经元</li>
        <li data-done={unbent}>{unbent ? "✓" : "○"} 关掉 GELU 拐弯试试</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
