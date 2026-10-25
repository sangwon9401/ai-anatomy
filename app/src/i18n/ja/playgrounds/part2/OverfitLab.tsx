import { useEffect, useState } from "react";
import { TRAIN, TRAIN_BIG, VAL, evalPoly, fitPoly, mseOf, type Pt } from "../../../../data/part2-fit";
import { num } from "../../../../data/part2-toy";
import "../../../../playgrounds/part2/style.css";

const X = (x: number) => 26 + x * 44;
const Y = (y: number) => 206 - y * 26;
const BEST_DEG_SMALL = [1, 2, 3, 4, 5, 6, 7].reduce((a, d) => (mseOf(fitPoly(d, TRAIN), VAL) < mseOf(fitPoly(a, TRAIN), VAL) ? d : a), 1);

export function OverfitLab() {
  const [deg, setDeg] = useState(1);
  const [big, setBig] = useState(false);
  const [showVal, setShowVal] = useState(false);
  const [ever, setEver] = useState([false, false, false]);
  const data: Pt[] = big ? TRAIN_BIG : TRAIN;
  const c = fitPoly(deg, data);
  const tr = mseOf(c, data);
  const va = mseOf(c, VAL);
  const lo = Math.min(...data.map((p) => p[0]));
  const hi = Math.max(...data.map((p) => p[0]));
  const d = Array.from({ length: 121 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / 120;
    return `${i ? "L" : "M"} ${X(x).toFixed(1)} ${Y(Math.max(-0.4, Math.min(7.6, evalPoly(c, x)))).toFixed(1)}`;
  }).join(" ");

  const now = [!big && tr < 1e-6, !big && showVal && deg === BEST_DEG_SMALL, big && deg === 7 && showVal && va < 0.2];
  useEffect(() => {
    if (now.some((x, i) => x && !ever[i])) setEver((e) => e.map((x, i) => x || now[i]));
  }, [now[0], now[1], now[2]]); // eslint-disable-line react-hooks/exhaustive-deps

  const barMax = 0.8;
  let tip: string;
  if (!showVal) tip = tr < 1e-6 ? "訓練損失0！でも本当の実力でしょうか？「検証データを見る」をオンにしてみましょう。" : "複雑さを上げてみましょう。訓練損失はどう変わりますか？";
  else if (!big && deg === 7) tip = `8つの点は全部通りますが、初めて見る店（◇）では損失 ${num(va, 2)}。暗記しただけです。過学習です。`;
  else if (big && deg === 7) tip = `データが24軒になったら、同じ複雑なモデルでも検証損失が${num(va, 2)}まで下がりました。暗記しにくくなったからです。`;
  else tip = `訓練 ${num(tr, 2)} · 検証 ${num(va, 2)}。検証損失がいちばん低い複雑さを探してみましょう。`;

  return (
    <div className="plane-lab">
      <svg viewBox="0 0 300 236" style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`複雑さ ${deg}、訓練損失 ${num(tr, 3)}、検証損失 ${num(va, 3)}`}>
        <clipPath id="p2-fit-clip">
          <rect x={X(0)} y={Y(7.6)} width={X(6.2) - X(0)} height={Y(-0.4) - Y(7.6)} />
        </clipPath>
        {[1, 2, 3, 4, 5, 6].map((t) => (
          <g key={t}>
            <line x1={X(t)} y1={Y(0)} x2={X(t)} y2={Y(7.4)} stroke="var(--grid-minor)" />
            <text x={X(t)} y={Y(0) + 12} textAnchor="middle" fontSize={10} fill="var(--ink-3)">
              {t}
            </text>
          </g>
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((t) => (
          <g key={`y${t}`}>
            <line x1={X(0)} y1={Y(t)} x2={X(6.2)} y2={Y(t)} stroke="var(--grid-minor)" />
            <text x={X(0) - 4} y={Y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--ink-3)">
              {t}
            </text>
          </g>
        ))}
        <line x1={X(0)} y1={Y(5)} x2={X(6.2)} y2={Y(5)} stroke="var(--ink-3)" strokeDasharray="4 4" />
        <line x1={X(0)} y1={Y(0)} x2={X(6.2)} y2={Y(0)} stroke="var(--ink)" strokeWidth={1.5} />
        <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(7.4)} stroke="var(--ink)" strokeWidth={1.5} />
        <text x={X(6.2)} y={Y(0) + 24} textAnchor="end" fontSize={11} fill="var(--ink-2)">
          待ち（組）→
        </text>
        <text x={X(0) + 4} y={Y(7.4) + 9} fontSize={11} fill="var(--ink-2)">
          ↑ 星
        </text>
        <path d={d} fill="none" stroke="var(--pen)" strokeWidth={2.4} clipPath="url(#p2-fit-clip)" />
        {showVal &&
          VAL.map(([x, y], i) => (
            <g key={`v${i}`}>
              <line x1={X(x)} y1={Y(y)} x2={X(x)} y2={Y(Math.max(-0.4, Math.min(7.6, evalPoly(c, x))))} stroke="var(--pen)" strokeWidth={1} strokeDasharray="3 2" />
              <path d={`M ${X(x)} ${Y(y) - 5.5} L ${X(x) + 5.5} ${Y(y)} L ${X(x)} ${Y(y) + 5.5} L ${X(x) - 5.5} ${Y(y)} Z`} fill="var(--paper)" stroke="var(--pen)" strokeWidth={1.6} />
            </g>
          ))}
        {data.map(([x, y], i) => (
          <circle key={i} cx={X(x)} cy={Y(y)} r={big ? 3.6 : 4.8} fill="var(--hl-yellow)" stroke="var(--ink)" strokeWidth={1.3} />
        ))}
      </svg>
      <div className="plane-side">
        <div className="lab-row p2-sliders">
          <span>くねくね度</span>
          <input type="range" min={1} max={7} step={1} value={deg} aria-label="モデルの複雑さ（多項式の次数）" onChange={(e) => setDeg(Number(e.target.value))} />
          <span className="val">{deg}</span>
        </div>
        <div className="ctx-presets" role="group" aria-label="データと検証">
          <button aria-pressed={showVal} onClick={() => setShowVal((v) => !v)} style={showVal ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            検証データを見る ◇
          </button>
          <button aria-pressed={big} onClick={() => setBig((b) => !b)} style={big ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {big ? "訓練データ24軒" : "訓練データ8軒"}（切りかえ）
          </button>
        </div>
        <div className="bars">
          <div className="bar-row">
            <span className="label">訓練損失</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${Math.min(1, tr / barMax) * 100}%`, background: "var(--hl-orange)" }} />
            </span>
            <span className="val num">{num(tr, 3)}</span>
          </div>
          <div className="bar-row" style={{ opacity: showVal ? 1 : 0.35 }}>
            <span className="label">検証損失</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${showVal ? Math.min(1, va / barMax) * 100 : 0}%`, background: "var(--pen)" }} />
            </span>
            <span className="val num">{showVal ? num(va, 3) : "?"}</span>
          </div>
        </div>
        <ul className="missions">
          {["8軒で訓練損失を0にする", "検証損失がいちばん低いくねくね度を探す（8軒）", "24軒に増やして、7段階モデルの検証損失を0.2より下げる"].map((t, i) => (
            <li key={t} data-done={ever[i]}>
              {ever[i] ? "○" : "□"} {t}
            </li>
          ))}
        </ul>
        <p className="p2-note">くねくね度 = 曲線の次数（何回曲がれるか）。点線は星の最高点5。店は説明用の例です。</p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
