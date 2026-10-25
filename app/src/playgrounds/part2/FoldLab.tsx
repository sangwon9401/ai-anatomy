import { useState } from "react";
import { SPICE_PTS, V_SPLIT, num } from "../../data/part2-toy";
import { Mark, SX, SY, S_MAX, SpicePlot } from "./SpicePlot";
import "./style.css";

const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const START = { p: 2, t: 0, a: 1, b: 1 };

export function FoldLab() {
  const [k, setK] = useState(START);
  const set = (key: keyof typeof START, v: number) => setK((prev) => ({ ...prev, [key]: v }));
  const cos = Math.cos(Math.PI * k.t);
  // left of the fold the paper turns over; the right half stays put
  const fm = (m: number) => (m < k.p ? k.p + (m - k.p) * cos : m);
  const edge = (m: number) => k.a * Math.abs(m - k.p) + k.b;
  const wrong = PTS.filter((pt) => pt.l > edge(pt.m) !== pt.good);

  const top = S_MAX.l + 0.3;
  const clampL = (l: number) => Math.min(top, l);
  const rightArm = `M ${SX(k.p)} ${SY(edge(k.p))} L ${SX(S_MAX.m)} ${SY(clampL(edge(S_MAX.m)))}`;
  const leftEnd = fm(0);
  const leftArm = `M ${SX(k.p)} ${SY(edge(k.p))} L ${SX(leftEnd)} ${SY(clampL(edge(0)))}`;
  const paperX = Math.min(SX(leftEnd), SX(k.p));
  const paperW = Math.abs(SX(k.p) - SX(leftEnd));

  const missions = [
    { done: k.p === 3, text: "3단계 선에서 접기" },
    { done: k.t === 1, text: "끝까지 접기" },
    { done: wrong.length === 0, text: "직선 하나로 13곳 모두 맞히기" },
  ];
  let tip: string;
  if (missions.every((m) => m.done)) tip = "성공! 첫 층이 종이를 접고, 다음 층 뉴런 하나가 직선으로 갈랐어요. 이게 층을 쌓는 힘이에요.";
  else if (k.t < 1) tip = "접기 슬라이더를 끝까지 밀어 보세요. 왼쪽 점들이 접는 선을 넘어 오른쪽으로 포개져요.";
  else if (k.p !== 3) tip = "같은 편 점끼리 잘 포개지나요? 접는 곳을 옮겨 보세요.";
  else tip = `틀린 곳 ${wrong.length}곳. 접힌 종이 위에서 직선의 기울기와 높이를 바꿔 보세요.`;

  const sliders: { key: keyof typeof START; label: string; min: number; max: number; step: number }[] = [
    { key: "p", label: "접는 곳", min: 1, max: 5, step: 0.5 },
    { key: "t", label: "접기", min: 0, max: 1, step: 0.05 },
    { key: "a", label: "직선 기울기", min: 0, max: 2, step: 0.25 },
    { key: "b", label: "직선 높이", min: 0, max: 4, step: 0.25 },
  ];

  return (
    <div className="plane-lab">
      <SpicePlot
        label={`맵기 ${num(k.p)}단계에서 접은 평면, 틀린 곳 ${wrong.length}곳`}
        after={
          <>
            {PTS.map((pt, i) => (
              <Mark key={i} x={SX(fm(pt.m))} y={SY(pt.l)} good={pt.good} />
            ))}
            {wrong.map((pt, i) => (
              <circle key={`w${i}`} cx={SX(fm(pt.m))} cy={SY(pt.l)} r={13} fill="none" stroke="var(--pen)" strokeWidth={2} />
            ))}
          </>
        }
      >
        <clipPath id="p2-fold-clip">
          <rect x={SX(0)} y={SY(S_MAX.l)} width={SX(S_MAX.m) - SX(0)} height={SY(0) - SY(S_MAX.l)} />
        </clipPath>
        <g clipPath="url(#p2-fold-clip)">
          <rect x={paperX} y={SY(S_MAX.l)} width={paperW} height={SY(0) - SY(S_MAX.l)} fill={cos >= 0 ? "var(--paper-2)" : "var(--hl-sky)"} opacity={cos >= 0 ? 0.8 : 0.3} />
          <path d={rightArm} stroke="var(--pen)" strokeWidth={2.5} fill="none" />
          <path d={leftArm} stroke="var(--pen)" strokeWidth={2.5} fill="none" strokeDasharray={k.t > 0 && k.t < 1 ? "5 4" : undefined} />
        </g>
        <line x1={SX(k.p)} y1={SY(S_MAX.l)} x2={SX(k.p)} y2={SY(0)} stroke="var(--pen)" strokeWidth={1.5} strokeDasharray="4 4" />
      </SpicePlot>
      <div className="plane-side">
        <div className="lab-rows p2-sliders">
          {sliders.map((s) => (
            <div className="lab-row" key={s.key}>
              <span>{s.label}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={k[s.key]} aria-label={s.label} onChange={(e) => set(s.key, Number(e.target.value))} />
              <span className="val">{s.key === "t" ? `${Math.round(k.t * 100)}%` : num(k[s.key])}</span>
            </div>
          ))}
        </div>
        <ul className="missions">
          {missions.map((m) => (
            <li key={m.text} data-done={m.done}>
              {m.done ? "○" : "□"} {m.text}
            </li>
          ))}
        </ul>
        <p className="lab-sum">빨간 선은 다음 층 뉴런의 경계예요. 펼치면 V자, 접으면 직선이에요. 점은 설명용 예시예요.</p>
        <div className="lab-actions">
          <button className="btn ghost" onClick={() => setK(START)}>
            처음 값으로
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
