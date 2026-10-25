import { useEffect, useRef, useState } from "react";
import { X_MAX, X_MIN, bumpy, roll } from "../../../../data/ch67";
import "../../../../playgrounds/part7/style.css";

const STEPS = 300;
// plot box 320 × 190
const PX = (x: number) => 14 + (x / X_MAX) * 292;
const PY = (f: number) => 176 - f * 26;
const CURVE = Array.from({ length: 121 }, (_, i) => (i / 120) * X_MAX)
  .map((x, i) => `${i === 0 ? "M" : "L"} ${PX(x).toFixed(1)} ${PY(bumpy(x)).toFixed(1)}`)
  .join(" ");
const where = (x: number) => (Math.abs(x - 7) < 0.4 ? "深い谷" : Math.abs(x - 2.7) < 0.4 ? "小さなくぼみ" : "移動中");

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
          escape: d.escape || (p === "小さなくぼみ" && m === "深い谷"),
          both: d.both || (p === "深い谷" && m === "深い谷"),
          weak: d.weak || (beta > 0 && m === "小さなくぼみ" && x0 < 2.2),
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

  let tip = "「転がす」を押して、2つのボールを同時にスタートさせましょう。";
  if (running) tip = "転がっています…";
  else if (finished) {
    const p = where(plain[STEPS]);
    const m = where(mom[STEPS]);
    if (p === "小さなくぼみ" && m === "深い谷") tip = "ピンクのボールだけが勢いで丘を越えました！ これが慣性の力です。";
    else if (m === "小さなくぼみ" && x0 >= 2.2 && x0 < 3.5) tip = "くぼみの中からスタートすると、勢いをためる下り坂がないので、慣性のボールもぬけ出せません。";
    else if (m === "小さなくぼみ") tip = beta === 0 ? "慣性が0だと、ピンクのボールも青いボールと同じです。慣性を上げてみましょう。" : "慣性が弱いと丘を越えられません。慣性をもう少し上げてみましょう。";
    else if (p === "深い谷") tip = "スタート地点が丘の右側なら、傾きだけでも谷に届きます。スタート地点も大事ですね。";
    else tip = "ボールがまだ止まっていません。慣性が大きすぎると、長くゆれ続けます。";
  }

  const missions = [
    { key: "escape", text: "青いボールはくぼみ、ピンクのボールは深い谷へ" },
    { key: "weak", text: "慣性が弱くて、ピンクのボールもくぼみに閉じこめられる強さを見つける" },
    { key: "both", text: "2つのボールを両方とも深い谷へ" },
  ];

  return (
    <div>
      <svg viewBox="0 0 320 196" className="p7-svg" role="img" aria-label="でこぼこの損失の地形と2つのボール">
        <path d={CURVE} fill="none" stroke="var(--ink)" strokeWidth={3} />
        <line x1={PX(x0)} y1={PY(bumpy(x0)) - 22} x2={PX(x0)} y2={PY(bumpy(x0)) - 14} stroke="var(--ink-3)" strokeWidth={2} />
        <text x={PX(2.7)} y={PY(bumpy(2.7)) + 16} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          小さなくぼみ
        </text>
        <text x={PX(7)} y={PY(0) + 14} fontSize={10} textAnchor="middle" fill="var(--ink-2)">
          深い谷
        </text>
        {ball(plain, "var(--hl-sky)", "傾きだけのボール")}
        {ball(mom, "var(--hl-pink)", "慣性のボール")}
      </svg>
      <ul className="legend" style={{ marginTop: 6 }}>
        <li>
          <span className="swatch hl-sky" />
          傾きだけ：{t === 0 ? "スタート前" : where(plain[Math.floor(t)])}
        </li>
        <li>
          <span className="swatch hl-pink" />
          慣性：{t === 0 ? "スタート前" : where(mom[Math.floor(t)])}
        </li>
      </ul>
      <div className="lab-rows" style={{ marginTop: 12 }}>
        <div className="lab-row">
          <span>スタート地点</span>
          <input
            type="range"
            min={X_MIN + 0.2}
            max={X_MAX - 0.2}
            step={0.1}
            value={x0}
            disabled={running}
            aria-label="スタート地点"
            onChange={(e) => {
              setX0(Number(e.target.value));
              reset();
            }}
          />
          <span className="val">{x0.toFixed(1)}</span>
        </div>
        <div className="lab-row">
          <span>慣性</span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.05}
            value={beta}
            disabled={running}
            aria-label="慣性の強さ"
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
          転がす
        </button>
        <button className="btn ghost" onClick={reset}>
          元の位置へ
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
      <p className="p7-note">説明用の例の地形です。慣性 = 前の一歩の勢いをどれだけ残すか（0なら第21章のボールと同じ）。</p>
    </div>
  );
}
