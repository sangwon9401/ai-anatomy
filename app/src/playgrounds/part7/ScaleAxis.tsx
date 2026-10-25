import { useState } from "react";
import { DROP_PER_10X, koN, lossOf } from "../../data/ch70";
import { MODELS } from "../../data/ch69";
import "./style.css";

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
    { key: "log", text: "10배 눈금으로 바꿔서 점들이 한 줄인지 확인하기" },
    { key: "gpt3", text: "GPT-3 크기(1,750억)로 맞추기" },
    { key: "below3", text: "손실을 3 아래로 내리기" },
  ];
  const tip = log
    ? `10배 눈금에서는 한 칸(×10)마다 손실이 똑같이 ${DROP_PER_10X}씩 줄어요. 그래서 곧은 선이에요.`
    : "보통 눈금에서는 작은 모델들이 왼쪽 끝에 다 몰려 있어요. 10배 눈금으로 바꿔 보세요.";

  return (
    <div>
      <div className="p7-seg" role="group" aria-label="눈금 고르기">
        <button aria-pressed={!log} onClick={() => setLog(false)}>
          보통 눈금
        </button>
        <button
          aria-pressed={log}
          onClick={() => {
            setLog(true);
            mark("log");
          }}
        >
          10배 눈금
        </button>
      </div>
      <svg viewBox="0 0 320 222" className="p7-svg" role="img" aria-label={`모델 크기 ${koN(n)}, 손실 ${lossOf(n).toFixed(2)}`}>
        <line x1={X0} y1={186} x2={X0 + XW + 6} y2={186} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={X0} y1={186} x2={X0} y2={14} stroke="var(--ink)" strokeWidth={1.5} />
        {[2, 3, 4, 5].map((v) => (
          <text key={v} x={X0 - 6} y={yOf(v) + 4} fontSize={10} textAnchor="end" fill="var(--ink-2)">
            {v}
          </text>
        ))}
        <text x={X0 - 4} y={10} fontSize={10} fill="var(--ink)" fontWeight={700}>
          손실
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
          모델 크기 →
        </text>
        <path d={curve} fill="none" stroke="var(--pen)" strokeWidth={2} />
        {DECADES.map((v) => (
          <circle key={v} cx={xOf(v)} cy={yOf(lossOf(v))} r={4} fill="var(--hl-sky)" stroke="var(--ink)" strokeWidth={1.2} />
        ))}
        <circle cx={xOf(n)} cy={yOf(lossOf(n))} r={7} fill="var(--hl-yellow)" stroke="var(--pen)" strokeWidth={2.5} />
      </svg>
      <div className="lab-row">
        <span>모델 크기</span>
        <input type="range" min={LO} max={HI} step={0.01} value={e} aria-label="모델 크기 (10배 단위)" onChange={(ev) => setSize(Number(ev.target.value))} />
        <span className="val">{koN(n)}</span>
      </div>
      <div className="p7-seg" role="group" aria-label="실제 GPT 크기" style={{ marginTop: 8 }}>
        {MODELS.map((m) => (
          <button key={m.key} onClick={() => setSize(Math.log10(m.params))}>
            {m.name} ({m.paramsText})
          </button>
        ))}
      </div>
      <p className="lab-sum num">
        크기 {koN(n)} → 손실 {lossOf(n).toFixed(2)} · 10배로 키우면 {lossOf(n * 10).toFixed(2)}
      </p>
      <ul className="missions">
        {missions.map((m) => (
          <li key={m.key} data-done={!!done[m.key]}>
            {done[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">손실 값은 설명용 예시예요(10배마다 0.5씩). 모델 크기(파라미터 수)는 실제 값이에요.</p>
    </div>
  );
}
