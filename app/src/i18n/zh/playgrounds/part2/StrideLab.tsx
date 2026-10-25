import { useEffect, useRef, useState } from "react";
import { W0, lossA } from "../../../../data/ch21";
import { walk } from "../../../../data/ch22";
import { num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const X = (w: number) => 22 + (Math.max(-0.5, Math.min(3.5, w)) + 0.5) * 69;
const Y = (l: number) => 200 - Math.min(l, 8.6) * 21;
const CURVE = Array.from({ length: 121 }, (_, i) => {
  const w = -0.5 + (4 * i) / 120;
  return `${i ? "L" : "M"} ${X(w).toFixed(1)} ${Y(lossA(w)).toFixed(1)}`;
}).join(" ");
const PRESETS = [0.01, 0.1, 0.125, 0.25, 0.3];
const STEPS = 10;
const fmtL = (l: number) => (l > 999 ? `${Math.round(l)}` : num(l, l < 0.01 ? 5 : 3));

export function StrideLab() {
  const [lr, setLr] = useState(0.1);
  const [shown, setShown] = useState(0); // hops revealed so far
  const [ran, setRan] = useState(false);
  const [ever, setEver] = useState([false, false, false]);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const ws = walk(lr, STEPS, W0);
  const ls = ws.map(lossA);
  const cur = ws[shown];
  const finished = ran && shown === STEPS;
  const now = [finished && ls[STEPS] > 0.1, finished && ls[STEPS] > ls[0], ran && shown >= 1 && ls[1] < 1e-4];
  useEffect(() => {
    if (now.some((d, i) => d && !ever[i])) setEver((e) => e.map((d, i) => d || now[i]));
  }, [now[0], now[1], now[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = () => {
    window.clearInterval(timer.current);
    setRan(true);
    setShown(0);
    let k = 0;
    timer.current = window.setInterval(() => {
      k += 1;
      setShown(k);
      if (k >= STEPS) window.clearInterval(timer.current);
    }, 320);
  };
  const pick = (v: number) => {
    window.clearInterval(timer.current);
    setLr(v);
    setShown(0);
    setRan(false);
  };

  let tip = "定好学习率，点“走 10 步”。";
  if (finished) {
    const last = ls[STEPS];
    if (Math.abs(lr - 0.25) < 1e-9) tip = "在 1 和 2 之间来回跳个不停！损失一直是 1，降不下来。这个步长刚好能整个跨过谷底。";
    else if (last > ls[0]) tip = `弹飞了！损失从 1 涨到了 ${fmtL(last)}。把学习率调小试试。`;
    else if (last > 0.1) tip = `走了 10 步，损失还有 ${fmtL(last)}。像乌龟一样慢。把学习率调大试试。`;
    else if (ls[1] < 1e-4) tip = "一步就到谷底！在这个山谷里，0.125 刚好是一步到底的步长。真实问题里很少有这种好运。";
    else tip = `损失降到了 ${fmtL(last)}。再找找一步就能到谷底的学习率。`;
  }

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 228" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`学习率 ${lr}，走 ${shown} 步后损失 ${fmtL(ls[shown])}`}>
        <clipPath id="p2-stride-clip">
          <rect x={0} y={Y(8.6)} width={300} height={Y(0) - Y(8.6) + 12} />
        </clipPath>
        <line x1={X(-0.5)} y1={Y(0)} x2={X(3.5)} y2={Y(0)} stroke="var(--ink)" strokeWidth={1.5} />
        {[0, 1, 1.5, 2, 3].map((t) => (
          <g key={t}>
            <line x1={X(t)} y1={Y(0) - 3} x2={X(t)} y2={Y(0) + 3} stroke="var(--ink)" />
            <text x={X(t)} y={Y(0) + 14} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
              {t}
            </text>
          </g>
        ))}
        <text x={X(3.5)} y={Y(0) + 26} textAnchor="end" fontSize={11} fill="var(--ink-2)">
          w（排队旋钮）→
        </text>
        <path d={CURVE} fill="none" stroke="var(--ink)" strokeWidth={2} clipPath="url(#p2-stride-clip)" />
        <g clipPath="url(#p2-stride-clip)">
          {ws.slice(0, shown + 1).map((w, k) =>
            k === 0 ? null : (
              <line key={k} x1={X(ws[k - 1])} y1={Y(ls[k - 1])} x2={X(w)} y2={Y(ls[k])} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="4 3" />
            ),
          )}
          {ws.slice(0, shown + 1).map((w, k) => (
            <circle key={`d${k}`} cx={X(w)} cy={Y(ls[k])} r={2.6} fill="var(--pen)" />
          ))}
        </g>
        <circle className="p2-ball" cx={X(cur)} cy={Y(ls[shown]) - 7} r={7} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1.8} />
        {(cur < -0.5 || cur > 3.5 || ls[shown] > 8.6) && (
          <text x={150} y={18} textAnchor="middle" fontSize={13} fill="var(--pen)" fontFamily="var(--font-hand)">
            球被弹出图外了！
          </text>
        )}
      </svg>
      <div className="plane-side">
        <div className="lab-row p2-sliders" style={{ gridTemplateColumns: "4.6em minmax(0, 1fr) 3.4em" }}>
          <span>学习率</span>
          <input type="range" min={0.005} max={0.35} step={0.005} value={lr} aria-label="学习率" onChange={(e) => pick(Number(e.target.value))} />
          <span className="val">{num(lr, 3)}</span>
        </div>
        <div className="ctx-presets" role="group" aria-label="学习率示例">
          {PRESETS.map((p) => (
            <button key={p} aria-pressed={Math.abs(lr - p) < 1e-9} onClick={() => pick(p)} style={Math.abs(lr - p) < 1e-9 ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
              {p}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button className="btn" onClick={go}>
            走 10 步
          </button>
        </div>
        <p className="p2-calc">
          {shown === 0 ? "从 w = 1、损失 = 1 出发" : `第 ${shown} 步：w = ${num(cur, 3)}，损失 = ${fmtL(ls[shown])}`}
          <br />
          损失：{ls.slice(0, shown + 1).map(fmtL).join(" → ")}
        </p>
        <ul className="missions">
          {[
            "乌龟：走 10 步后损失还大于 0.1",
            "弹飞：让损失比一开始还大",
            "一步到底（损失小于 0.0001）",
          ].map((t, i) => (
            <li key={t} data-done={ever[i]}>
              {ever[i] ? "○" : "□"} {t}
            </li>
          ))}
        </ul>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
