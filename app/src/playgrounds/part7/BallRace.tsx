import { useEffect, useRef, useState } from "react";
import { X_MAX, X_MIN, bumpy, roll } from "../../data/ch67";
import "./style.css";

const STEPS = 300;
// plot box 320 × 190
const PX = (x: number) => 14 + (x / X_MAX) * 292;
const PY = (f: number) => 176 - f * 26;
const CURVE = Array.from({ length: 121 }, (_, i) => (i / 120) * X_MAX)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${PX(x).toFixed(1)} ${PY(bumpy(x)).toFixed(1)}`)
  .join(" ");
const where = (x: number) => (Math.abs(x - 7) < 0.4 ? "깊은 골짜기" : Math.abs(x - 2.7) < 0.4 ? "작은 웅덩이" : "가는 중");

export function BallRace() {
  const [x0, setX0] = useState(0.4);
  const [beta, setBeta] = useState(0.85);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const raf = useRef(0);
  const plain = roll(x0, 0, STEPS);
  const mom = roll(x0, beta, STEPS);
  const finished = t >= STEPS;

  useEffect(() => {
    if (!running) return;
    let v = 0;
    const tick = () => {
      v = Math.min(STEPS, v + 3);
      setT(v);
      if (v >= STEPS) {
        setRunning(false);
        const p = where(plain[STEPS]);
        const m = where(mom[STEPS]);
        setDone((d) => ({
          ...d,
          escape: d.escape || (p === "작은 웅덩이" && m === "깊은 골짜기"),
          both: d.both || (p === "깊은 골짜기" && m === "깊은 골짜기"),
          weak: d.weak || (beta > 0 && m === "작은 웅덩이" && x0 < 2.2),
        }));
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // plain/mom are derived from x0 and beta, which cannot change while running
  }, [running, x0, beta]);

  const reset = () => {
    setRunning(false);
    setT(0);
  };
  const ball = (xs: number[], color: string, label: string) => {
    const x = xs[Math.min(STEPS, Math.floor(t))];
    return <circle cx={PX(x)} cy={PY(bumpy(x)) - 7} r={7} fill={color} stroke="var(--ink)" strokeWidth={2} aria-label={label} />;
  };

  let tip = "굴리기를 눌러 두 공을 동시에 출발시켜 보세요.";
  if (running) tip = "굴러가는 중…";
  else if (finished) {
    const p = where(plain[STEPS]);
    const m = where(mom[STEPS]);
    if (p === "작은 웅덩이" && m === "깊은 골짜기") tip = "분홍 공만 기세로 언덕을 넘었어요! 이게 관성의 힘이에요.";
    else if (m === "작은 웅덩이" && x0 >= 2.2 && x0 < 3.5) tip = "웅덩이 안에서 출발하면 기세를 모을 내리막이 없어서, 관성 공도 못 빠져나와요.";
    else if (m === "작은 웅덩이") tip = beta === 0 ? "관성이 0이면 분홍 공도 파란 공과 똑같아요. 관성을 올려 보세요." : "관성이 약하면 언덕을 못 넘어요. 관성을 조금 더 올려 보세요.";
    else if (p === "깊은 골짜기") tip = "출발점이 언덕 오른쪽이면 기울기만으로도 골짜기에 닿아요. 출발점이 중요하죠.";
    else tip = "공이 아직 멈추지 않았어요. 관성이 너무 크면 오래 흔들려요.";
  }

  const missions = [
    { key: "escape", text: "파란 공은 웅덩이, 분홍 공은 깊은 골짜기로" },
    { key: "weak", text: "관성이 약해서 분홍 공도 웅덩이에 갇히는 세기 찾기" },
    { key: "both", text: "두 공 모두 깊은 골짜기에 보내기" },
  ];

  return (
    <div>
      <svg viewBox="0 0 320 196" className="p7-svg" role="img" aria-label="울퉁불퉁한 손실 지형과 두 공">
        <path d={CURVE} fill="none" stroke="var(--ink)" strokeWidth={3} />
        <line x1={PX(x0)} y1={PY(bumpy(x0)) - 22} x2={PX(x0)} y2={PY(bumpy(x0)) - 14} stroke="var(--ink-3)" strokeWidth={2} />
        <text x={PX(2.7)} y={PY(bumpy(2.7)) + 16} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          작은 웅덩이
        </text>
        <text x={PX(7)} y={PY(0) + 14} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          깊은 골짜기
        </text>
        {ball(plain, "var(--hl-sky)", "기울기만 공")}
        {ball(mom, "var(--hl-pink)", "관성 공")}
      </svg>
      <ul className="legend" style={{ marginTop: 6 }}>
        <li>
          <span className="swatch hl-sky" />
          기울기만: {t === 0 ? "출발 전" : where(plain[Math.floor(t)])}
        </li>
        <li>
          <span className="swatch hl-pink" />
          관성: {t === 0 ? "출발 전" : where(mom[Math.floor(t)])}
        </li>
      </ul>
      <div className="lab-rows" style={{ marginTop: 12 }}>
        <div className="lab-row">
          <span>출발점</span>
          <input
            type="range"
            min={X_MIN + 0.2}
            max={X_MAX - 0.2}
            step={0.1}
            value={x0}
            disabled={running}
            aria-label="출발점"
            onChange={(e) => {
              setX0(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{x0.toFixed(1)}</span>
        </div>
        <div className="lab-row">
          <span>관성</span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.05}
            value={beta}
            disabled={running}
            aria-label="관성 세기"
            onChange={(e) => {
              setBeta(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{beta.toFixed(2)}</span>
        </div>
      </div>
      <div className="lab-actions">
        <button
          className="btn"
          disabled={running}
          onClick={() => {
            setT(0);
            setRunning(true);
          }}
        >
          굴리기
        </button>
        <button className="btn ghost" onClick={reset}>
          제자리로
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        {missions.map((m) => (
          <li key={m.key} data-done={!!done[m.key]}>
            {done[m.key] ? "○" : "□"} {m.text}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p7-note">설명용 예시 지형이에요. 관성 = 지난 걸음의 기세를 얼마나 남길지(0이면 21장의 공과 같아요).</p>
    </div>
  );
}
