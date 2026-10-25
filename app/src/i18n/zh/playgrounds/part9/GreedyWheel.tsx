import { useState } from "react";
import { PROMPT80, WHEEL } from "../../../../data/ch80";
import { generate, joinPieces, pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const CX = 120;
const CY = 124;
const R = 100;
const P = WHEEL.map((c) => c.p);
const label = (w: string, c: string | null) => (c ? w : "其他");
const fill = (c: string | null) => (c ? `var(--hl-${c})` : "var(--paper-2)");

function starts() {
  let a = 0;
  return WHEEL.map((c) => {
    const s = a;
    a += c.p * 360;
    return s;
  });
}
const START = starts();
const pt = (r: number, deg: number) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];

/** rotation that puts slice i under the pointer, ahead of `from` by `turns` full turns */
function landOn(i: number, from: number, turns: number, at: number) {
  const phi = START[i] + WHEEL[i].p * 360 * at;
  const target = (((-phi - from) % 360) + 360) % 360;
  return from + target + turns * 360;
}

type Line = { how: "贪心" | "采样"; text: string };

export function GreedyWheel() {
  const [rot, setRot] = useState(0);
  const [fast, setFast] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const [greedy, setGreedy] = useState<number[]>(() => WHEEL.map(() => 0));
  const [sample, setSample] = useState<number[]>(() => WHEEL.map(() => 0));
  const [lines, setLines] = useState<Line[]>([]);
  const [tip, setTip] = useState("先按几次“用贪心挑”。");

  const gTotal = greedy.reduce((a, b) => a + b, 0);
  const sTotal = sample.reduce((a, b) => a + b, 0);
  const sNotTop = sTotal - sample[0];
  const gLines = lines.filter((l) => l.how === "贪心");
  const sLines = lines.filter((l) => l.how === "采样");

  const pickGreedy = () => {
    setFast(true);
    setRot((r) => landOn(0, r, 0, 0.5));
    setLast(0);
    const next = greedy.map((n, i) => (i === 0 ? n + 1 : n));
    setGreedy(next);
    const total = next.reduce((a, b) => a + b, 0);
    setTip(total >= 3 ? `用贪心挑了 ${total} 次，全都是“学校”。概率表一样，第 1 名就永远一样。` : "再按一次试试。结果会变吗？");
  };
  const spin = (n: number) => {
    const next = [...sample];
    let i = 0;
    for (let k = 0; k < n; k++) {
      i = pickIndex(P, Math.random());
      next[i]++;
    }
    setFast(n > 1);
    setRot((r) => landOn(i, r, n > 1 ? 2 : 4, 0.15 + Math.random() * 0.7));
    setLast(i);
    setSample(next);
    const total = next.reduce((a, b) => a + b, 0);
    if (total >= 30) setTip(`转了 ${total} 次。“学校”最多，但不是全部。转得越多，各自的比例就越接近概率（52%、21%……）。`);
    else if (i !== 0) setTip(`这次是“${label(WHEEL[i].w, WHEEL[i].c)}”！就算不是第 1 名，只要有格子就可能被抽中。`);
    else setTip("这次是“学校”。再多转几次看看。");
  };
  const write = (how: Line["how"]) => {
    const pieces = generate(how === "贪心" ? 0 : 1, Math.random);
    const text = joinPieces([...PROMPT80, ...pieces]);
    const nextLines = [{ how, text }, ...lines].slice(0, 6);
    setLines(nextLines);
    const g = nextLines.filter((l) => l.how === "贪心").length;
    const s = nextLines.filter((l) => l.how === "采样");
    if (how === "贪心") setTip(g >= 2 ? "贪心写的句子每次都一样，在“然后 见到 朋友”里打转，直到碰上长度上限被截断（…）。" : "这次也按一下“用采样写”。");
    else setTip(new Set(s.map((l) => l.text)).size >= 2 ? "采样写的句子每按一次都不一样。这就是同一个问题 ChatGPT 的回答会略有不同的原因。" : "再按一次。还会出现同一句吗？");
  };
  const reset = () => {
    setGreedy(WHEEL.map(() => 0));
    setSample(WHEEL.map(() => 0));
    setLast(null);
    setLines([]);
    setTip("先按几次“用贪心挑”。");
  };

  const shown = last === null ? null : WHEEL[last];

  return (
    <div>
      <div className="p9-sent" aria-live="polite">
        {PROMPT80.map((w) => (
          <span key={w} className="chip outline">
            {w}
          </span>
        ))}
        {shown ? <span className={`chip ${shown.c ? `hl-${shown.c}` : "hl-none"}`}>{label(shown.w, shown.c)}</span> : <span className="p9-blank">?</span>}
      </div>

      <div className="p9-split" style={{ marginTop: 12 }}>
        <svg className={`p9-wheel${fast ? " fast" : ""}`} viewBox="0 0 240 240" role="img" aria-label="按概率分格子的转盘">
          <g className="spin" style={{ transform: `rotate(${rot}deg)` }}>
            {WHEEL.map((c, i) => {
              const a0 = START[i];
              const a1 = a0 + c.p * 360;
              const [x0, y0] = pt(R, a0);
              const [x1, y1] = pt(R, a1);
              const mid = a0 + c.p * 180;
              const [lx, ly] = pt(R * (c.p < 0.1 ? 0.78 : 0.6), mid);
              return (
                <g key={c.w}>
                  <path d={`M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`} fill={fill(c.c)} stroke="var(--ink)" strokeWidth={1.5} />
                  {c.p >= 0.04 && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={c.p < 0.1 ? 12 : 16} fontWeight={700} fill={c.c ? "var(--chip-ink)" : "var(--ink-2)"} transform={`rotate(${mid} ${lx} ${ly})`}>
                      {label(c.w, c.c)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
          <path d={`M ${CX - 9} 6 L ${CX + 9} 6 L ${CX} 30 Z`} fill="var(--pen)" />
        </svg>

        <div>
          <div className="p9-tally-head">
            <span>候选</span>
            <span>概率</span>
            <span>贪心</span>
            <span>转盘</span>
          </div>
          <div className="bars" style={{ marginTop: 4 }}>
            {WHEEL.map((c, i) => (
              <div className="p9-tally-row" key={c.w} data-last={last === i}>
                <span className="label">{label(c.w, c.c)}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${c.p * 100}%`, background: c.c ? `var(--hl-${c.c})` : "var(--ink-3)" }} />
                </span>
                <span className="n">{greedy[i]}</span>
                <span className="n">{sample[i]}</span>
              </div>
            ))}
          </div>
          <p className="p9-note">概率是示意数据（和第 1 章的数字相同）。</p>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={pickGreedy}>
          用贪心挑
        </button>
        <button className="btn" onClick={() => spin(1)}>
          转一次转盘
        </button>
        <button className="btn ghost" onClick={() => spin(10)}>
          转 10 次
        </button>
      </div>

      <h4 className="p9-h">把整句话写完</h4>
      <div className="lab-actions" style={{ marginTop: 0 }}>
        <button className="btn ghost" onClick={() => write("贪心")}>
          用贪心写
        </button>
        <button className="btn ghost" onClick={() => write("采样")}>
          用采样写
        </button>
        <button className="btn ghost" onClick={reset}>
          重新开始
        </button>
      </div>
      {lines.length > 0 && (
        <ul className="p9-history" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i}>
              <span className="how">{l.how}</span>
              <span className="txt">{l.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="p9-note">句子由一个玩具模型来写：它只看前一个词来决定下一个词。最长 10 个片段。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={gTotal >= 3}>{gTotal >= 3 ? "○" : "□"} 用贪心挑三次：结果会变吗？</li>
        <li data-done={sNotTop > 0}>{sNotTop > 0 ? "○" : "□"} 用转盘抽出“学校”以外的词</li>
        <li data-done={gLines.length > 0 && sLines.length >= 2}>{gLines.length > 0 && sLines.length >= 2 ? "○" : "□"} 用贪心写一次句子，再用采样写两次</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
