import { useEffect, useRef, useState } from "react";
import { percents } from "../../../../data/ch45";
import { KINDS, LEASH, QUESTION, drift, mean, tuned } from "../../../../data/ch76";
import "../../../../playgrounds/part8/style.css";

const TRAIN_MS = 1300;
const BEST = 3; // "刚好"
const sgn = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : "0");
const fmt = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : v < 0 ? `−${Math.abs(v).toFixed(2)}` : v.toFixed(2));

export function LeashLab() {
  const [leash, setLeash] = useState(0);
  const [t, setT] = useState(0);
  const [tried, setTried] = useState<Record<number, number>>({});
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const beta = LEASH[leash].beta;
  const p = tuned(beta, t);
  const pct = percents(p);
  const p0 = KINDS.map((k) => k.p0);
  const judge = mean(p, KINDS.map((k) => k.judge));
  const human = mean(p, KINDS.map((k) => k.human));
  const humanStart = mean(p0, KINDS.map((k) => k.human));
  const done = t >= 1;
  const running = t > 0 && t < 1;
  const bestTried = Object.entries(tried).sort((a, b) => b[1] - a[1])[0];

  const train = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / TRAIN_MS);
      setT(x);
      if (x < 1) raf.current = requestAnimationFrame(tick);
      else setTried((r) => ({ ...r, [leash]: mean(tuned(beta), KINDS.map((k) => k.human)) }));
    };
    raf.current = requestAnimationFrame(tick);
  };

  const tip = !done
    ? running
      ? "正在往评分员分数高的回答那边挪……"
      : "选好绳子的长短，按“开始练习”。虚线是原来的模型（第 73 章）。"
    : leash >= 5
      ? "评分员的分数最高，人的满意度却反而下降了。绳子太长，全挤到“满篇都是夸奖”的回答那边去了。"
      : leash <= 1
        ? "几乎和原来的模型一样。绳子太短，没有变好的余地。"
        : leash === BEST
          ? "找到平衡了！亲切又详细的回答大大增加，奇怪的回答只多了一点。人的满意度最高。"
          : "还不错。把绳子再放长一格或缩短一格，比较一下人的满意度。";

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        问题：{QUESTION}
      </p>
      <label className="p8-range">
        <span>绳子长短</span>
        <b>{LEASH[leash].name}</b>
        <input
          type="range"
          min={0}
          max={LEASH.length - 1}
          step={1}
          value={leash}
          disabled={running}
          aria-label="绳子长短"
          onChange={(e) => {
            setLeash(Number(e.target.value));
            setT(0);
          }}
        />
        <span className="p8-ends">
          <span>短：待在原来的模型附近</span>
          <span>长：只追分数</span>
        </span>
      </label>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || done}>
          {done ? "练习结束" : "开始练习"}
        </button>
        {done && (
          <button className="btn ghost" onClick={() => setT(0)}>
            回到练习之前
          </button>
        )}
      </div>

      <div className="p8-dist">
        {KINDS.map((k, i) => (
          <div className="p8-drow" key={k.short}>
            <span className="p8-txt">
              <b>{k.short}</b> <small>{k.excerpt}</small>
              <br />
              <small>
                评分员 {sgn(k.judge)} · 人 {sgn(k.human)}
              </small>
            </span>
            <span className="p8-twin" aria-hidden="true">
              <span className="p8-now" style={{ width: `${p[i] * 100}%`, background: i === 3 ? "var(--hl-pink)" : "var(--hl-yellow)" }} />
              <span className="p8-ghost" style={{ width: `${k.p0 * 100}%` }} />
            </span>
            <span className="p8-val">{pct[i]}%</span>
          </div>
        ))}
      </div>

      <div className="p8-stats">
        <div className="p8-stat">
          评分员分数平均<b>{fmt(judge)}</b>
        </div>
        <div className="p8-stat">
          人的满意度平均<b>{fmt(human)}</b>
        </div>
        <div className="p8-stat" style={{ gridColumn: "1 / -1" }}>
          离原来的模型有多远（KL）
          <span className="p8-track" style={{ display: "block", marginTop: 6 }}>
            <span className="p8-fill" style={{ width: `${Math.min(1, drift(p) / 3) * 100}%`, background: "var(--pen)" }} />
          </span>
        </div>
      </div>

      <p className="lab-tip">{tip}</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={Object.keys(tried).length >= 3}>
          {Object.keys(tried).length >= 3 ? "○" : "□"} 用三种以上的绳子长短练习（{Object.keys(tried).length}/3）
        </li>
        <li data-done={tried[BEST] !== undefined}>
          {tried[BEST] !== undefined ? "○" : "□"} 找出人的满意度最高的长短（原来的模型：{fmt(humanStart)}）
        </li>
      </ul>
      {bestTried && (
        <p className="lab-sum" style={{ margin: "6px 0 0" }}>
          目前最好的长短：{LEASH[Number(bestTried[0])].name}（人的满意度 {fmt(bestTried[1])}）
        </p>
      )}
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        分数和概率是示意数据。这里算出并显示练习结束时模型停在哪里。虚线是原来模型的概率。
      </p>
    </div>
  );
}
