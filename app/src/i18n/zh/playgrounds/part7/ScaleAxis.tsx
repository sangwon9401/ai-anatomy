import { useState } from "react";
import { DROP_PER_10X, koN, lossOf } from "../../../../data/ch70";
import { MODELS } from "../../../../data/ch69";
import "../../../../playgrounds/part7/style.css";

const LO = 7;
const HI = 12;
const DECADES = [1e7, 1e8, 1e9, 1e10, 1e11, 1e12];
const X0 = 40;
const XW = 266;
const yOf = (l: number) => 186 - ((l - 2) / 3.2) * 160;

export function ScaleAxis() {
  const [log, setLog] = useState(false);
  const [e, setE] = useState(9); // log10 of the model size
  const [done, setDone] = useState<Record<string, boolean>>({});
  const n = 10 ** e;
  const xOf = (v: number) => (log ? X0 + ((Math.log10(v) - LO) / (HI - LO)) * XW : X0 + (v / 10 ** HI) * XW);
  const curve = Array.from({ length: 80 }, (_, i) => 10 ** (LO + (i / 79) * (HI - LO)))
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xOf(v).toFixed(1)} ${yOf(lossOf(v)).toFixed(1)}`)
    .join(" ");

  const mark = (k: string) => setDone((d) => (d[k] ? d : { ...d, [k]: true }));
  const setSize = (v: number) => {
    setE(v);
    if (Math.abs(10 ** v - 1.75e11) / 1.75e11 < 0.06) mark("gpt3");
    if (lossOf(10 ** v) < 3) mark("below3");
  };

  const missions = [
    { key: "log", text: "换成 10 倍刻度，看看点是不是排成一条线" },
    { key: "gpt3", text: "调到 GPT-3 的大小（1750 亿）" },
    { key: "below3", text: "把损失降到 3 以下" },
  ];
  const tip = log
    ? `在 10 倍刻度上，每走一格（×10），损失都一样减少 ${DROP_PER_10X}。所以是一条直线。`
    : "在普通刻度上，小模型都挤在最左边。换成 10 倍刻度看看。";

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="选择刻度">
        <button aria-pressed={!log} onClick={() => setLog(false)}>
          普通刻度
        </button>
        <button
          aria-pressed={log}
          onClick={() => {
            setLog(true);
            mark("log");
          }}
        >
          10 倍刻度
        </button>
      </div>
      <svg viewBox="0 0 320 222" className="p7-svg" role="img" aria-label={`模型大小 ${koN(n)}，损失 ${lossOf(n).toFixed(2)}`}>
        <line x1={X0} y1={186} x2={X0 + XW + 6} y2={186} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={X0} y1={186} x2={X0} y2={14} stroke="var(--ink)" strokeWidth={1.5} />
        {[2, 3, 4, 5].map((v) => (
          <text key={v} x={X0 - 6} y={yOf(v) + 4} fontSize={10} textAnchor="end" fill="var(--ink-2)">
            {v}
          </text>
        ))}
        <text x={X0 - 4} y={10} fontSize={10} fill="var(--ink)" fontWeight={700}>
          损失
        </text>
        {(log ? DECADES : [0, 5e11, 1e12]).map((v) => (
          <g key={v}>
            <line x1={xOf(Math.max(v, 1))} y1={183} x2={xOf(Math.max(v, 1))} y2={189} stroke="var(--ink)" />
            <text x={xOf(Math.max(v, 1))} y={201} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
              {v === 0 ? "0" : koN(v)}
            </text>
          </g>
        ))}
        <text x={X0 + XW} y={216} fontSize={10} textAnchor="end" fill="var(--ink)" fontWeight={700}>
          模型大小 →
        </text>
        <path d={curve} fill="none" stroke="var(--pen)" strokeWidth={2} />
        {DECADES.map((v) => (
          <circle key={v} cx={xOf(v)} cy={yOf(lossOf(v))} r={4} fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={1.2} />
        ))}
        <circle cx={xOf(n)} cy={yOf(lossOf(n))} r={7} fill="var(--hl-yellow)" stroke="var(--pen)" strokeWidth={2.5} />
      </svg>
      <div className="lab-row">
        <span>模型大小</span>
        <input type="range" min={LO} max={HI} step={0.01} value={e} aria-label="模型大小（以 10 倍为单位）" onChange={(ev) => setSize(Number(ev.target.value))} />
        <span className="val">{koN(n)}</span>
      </div>
      <div className="p7-seg" role="group" aria-label="真实的 GPT 大小" style={{ marginTop: 8 }}>
        {MODELS.map((m) => (
          <button key={m.key} onClick={() => setSize(Math.log10(m.params))}>
            {m.name} ({m.paramsText})
          </button>
        ))}
      </div>
      <p className="lab-sum num">
        大小 {koN(n)} → 损失 {lossOf(n).toFixed(2)} · 变大 10 倍后 {lossOf(n * 10).toFixed(2)}
      </p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!done[m.key]}>
            {done[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">损失值是示意数据（每 10 倍减少 0.5）。模型大小（参数个数）是真实数值。</p>
    </div>
  );
}
