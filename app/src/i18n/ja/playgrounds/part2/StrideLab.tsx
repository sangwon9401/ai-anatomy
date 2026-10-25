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

  let tip = "学習率を決めて「10歩進む」を押してみましょう。";
  if (finished) {
    const last = ls[STEPS];
    if (Math.abs(lr - 0.25) < 1e-9) tip = "1と2の間をずっと行ったり来たり！損失が1から減りません。歩幅が、谷底をちょうど飛びこえる大きさなのです。";
    else if (last > ls[0]) tip = `はね返って飛び出しました！損失が1から${fmtL(last)}まで大きくなりました。学習率を下げてみましょう。`;
    else if (last > 0.1) tip = `10歩進んでも損失 ${fmtL(last)}。カメの歩みです。学習率を上げてみましょう。`;
    else if (ls[1] < 1e-4) tip = "たった一歩で谷底！この谷では、0.125がちょうど谷底までの歩幅です。実際の問題では、こんな幸運はめったにありません。";
    else tip = `損失 ${fmtL(last)}まで下がりました。一歩で谷底に着く学習率も探してみましょう。`;
  }

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 228" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`学習率 ${lr}、${shown}歩後の損失 ${fmtL(ls[shown])}`}>
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
          w（待ちの重み）→
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
            ボールがグラフの外へ飛び出しました！
          </text>
        )}
      </svg>
      <div className="plane-side">
        <div className="lab-row p2-sliders" style={{ gridTemplateColumns: "4.6em minmax(0, 1fr) 3.4em" }}>
          <span>学習率</span>
          <input type="range" min={0.005} max={0.35} step={0.005} value={lr} aria-label="学習率" onChange={(e) => pick(Number(e.target.value))} />
          <span className="val">{num(lr, 3)}</span>
        </div>
        <div className="ctx-presets" role="group" aria-label="学習率の例">
          {PRESETS.map((p) => (
            <button key={p} aria-pressed={Math.abs(lr - p) < 1e-9} onClick={() => pick(p)} style={Math.abs(lr - p) < 1e-9 ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
              {p}
            </button>
          ))}
        </div>
        <div className="lab-actions">
          <button className="btn" onClick={go}>
            10歩進む
          </button>
        </div>
        <p className="p2-calc">
          {shown === 0 ? "w = 1、損失 = 1から出発" : `${shown}歩：w = ${num(cur, 3)}、損失 = ${fmtL(ls[shown])}`}
          <br />
          損失：{ls.slice(0, shown + 1).map(fmtL).join(" → ")}
        </p>
        <ul className="missions">
          {[
            "カメ：10歩後も損失が0.1より大きいまま",
            "はね返り：損失を最初より大きくする",
            "たった一歩で谷底（損失0.0001未満）",
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
