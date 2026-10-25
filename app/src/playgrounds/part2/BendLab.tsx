import { useState } from "react";
import { SPICE_PTS, V_SPLIT, gelu, num, relu } from "../../data/part2-toy";
import { Mark, SX, SY, S_MAX, SpicePlot } from "./SpicePlot";
import "./style.css";

type Mode = "relu" | "gelu" | "off";
const ACT: Record<Mode, (x: number) => number> = { relu, gelu, off: (x) => x };
const MODES: { key: Mode; label: string }[] = [
  { key: "relu", label: "ReLU" },
  { key: "gelu", label: "GELU" },
  { key: "off", label: "활성화 함수 끄기" },
];
const PTS = SPICE_PTS.map(([m, l]) => ({ m, l, good: V_SPLIT(m, l) }));
const START = { p: 2, sL: 0.5, sR: 0.5, q: 2 };

export function BendLab() {
  const [k, setK] = useState(START);
  const [mode, setMode] = useState<Mode>("relu");
  const act = ACT[mode];
  const edge = (m: number) => k.q + k.sL * act(k.p - m) + k.sR * act(m - k.p);
  const says = (m: number, l: number) => l > edge(m);
  const wrong = PTS.filter((p) => says(p.m, p.l) !== p.good);

  const xs = Array.from({ length: 113 }, (_, i) => (i * S_MAX.m) / 112);
  const clampL = (l: number) => Math.max(-0.2, Math.min(S_MAX.l + 0.3, l));
  const curve = xs.map((m, i) => `${i ? "L" : "M"} ${SX(m).toFixed(1)} ${SY(clampL(edge(m))).toFixed(1)}`).join(" ");
  const shade = `${curve} L ${SX(S_MAX.m)} ${SY(S_MAX.l + 0.3)} L ${SX(0)} ${SY(S_MAX.l + 0.3)} Z`;

  const set = (key: keyof typeof START, v: number) => setK((prev) => ({ ...prev, [key]: v }));
  const sliders: { key: keyof typeof START; label: string; min: number; max: number; step: number }[] = [
    { key: "p", label: "꺾이는 곳", min: 1, max: 5, step: 0.5 },
    { key: "sL", label: "왼쪽 기울기", min: 0, max: 2, step: 0.25 },
    { key: "sR", label: "오른쪽 기울기", min: 0, max: 2, step: 0.25 },
    { key: "q", label: "높이", min: 0, max: 4, step: 0.25 },
  ];

  let tip: string;
  if (mode === "off") tip = `활성화 함수를 끄니 경계가 직선이 됐어요. 손잡이를 아무리 돌려도 2곳 이상은 틀려요. (지금 ${wrong.length}곳)`;
  else if (wrong.length === 0) tip = `13곳 모두 맞았어요! 꺾인 선 덕분이에요.${mode === "relu" ? " GELU로 바꿔도 되는지 확인해 보세요." : " GELU는 꺾이는 곳이 둥글어요."}`;
  else tip = `틀린 곳 ${wrong.length}곳. 빨간 동그라미 친 점을 보고 꺾이는 곳과 기울기를 바꿔 보세요.`;

  return (
    <div className="plane-lab">
      <SpicePlot
        label={`경계: 줄 = ${num(k.q)} + 꺾인 선, 틀린 곳 ${wrong.length}곳`}
        after={
          <>
            {PTS.map((p, i) => (
              <Mark key={i} x={SX(p.m)} y={SY(p.l)} good={p.good} />
            ))}
            {wrong.map((p, i) => (
              <circle key={`w${i}`} cx={SX(p.m)} cy={SY(p.l)} r={13} fill="none" stroke="var(--pen)" strokeWidth={2} />
            ))}
          </>
        }
      >
        <clipPath id="p2-bend-clip">
          <rect x={SX(0)} y={SY(S_MAX.l)} width={SX(S_MAX.m) - SX(0)} height={SY(0) - SY(S_MAX.l)} />
        </clipPath>
        <g clipPath="url(#p2-bend-clip)">
          <path d={shade} fill="var(--hl-mint)" opacity={0.3} />
          <path d={curve} fill="none" stroke="var(--pen)" strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      </SpicePlot>
      <div className="plane-side">
        <div className="ctx-presets" role="group" aria-label="활성화 함수 고르기">
          {MODES.map((m) => (
            <button
              key={m.key}
              aria-pressed={mode === m.key}
              style={mode === m.key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="lab-rows p2-sliders">
          {sliders.map((s) => (
            <div className="lab-row" key={s.key}>
              <span>{s.label}</span>
              <input type="range" min={s.min} max={s.max} step={s.step} value={k[s.key]} aria-label={s.label} onChange={(e) => set(s.key, Number(e.target.value))} />
              <span className="val">{num(k[s.key])}</span>
            </div>
          ))}
        </div>
        <p className="lab-sum">
          경계보다 위(초록 칸)에 있으면 맛집이라고 판단해요. 점은 설명용 예시예요.
        </p>
        <div className="lab-actions">
          <button
            className="btn ghost"
            onClick={() => {
              setK(START);
              setMode("relu");
            }}
          >
            처음 값으로
          </button>
        </div>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
