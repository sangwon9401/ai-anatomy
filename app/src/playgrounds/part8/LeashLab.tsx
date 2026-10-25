import { useEffect, useRef, useState } from "react";
import { percents } from "../../data/ch45";
import { KINDS, LEASH, QUESTION, drift, mean, tuned } from "../../data/ch76";
import "./style.css";

const TRAIN_MS = 1300;
const BEST = 3; // "알맞게"
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
      ? "채점관 점수가 높은 답 쪽으로 옮겨 가는 중…"
      : "목줄 길이를 고르고 '연습 시키기'를 눌러 보세요. 점선은 원래 모델(73장)이에요."
    : leash >= 5
      ? "채점관 점수는 가장 높은데, 사람 만족도는 오히려 떨어졌어요. 목줄이 너무 길어서 '칭찬만 잔뜩' 답으로 몰려 버렸어요."
      : leash <= 1
        ? "거의 원래 모델 그대로예요. 목줄이 너무 짧아서 좋아질 틈이 없었어요."
        : leash === BEST
          ? "균형을 찾았어요! 친절하고 자세한 답이 크게 늘고, 이상한 답은 조금만 늘었어요. 사람 만족도가 가장 높아요."
          : "나쁘지 않아요. 목줄을 한 칸 더 길게, 또는 짧게 해서 사람 만족도를 비교해 보세요.";

  return (
    <div>
      <p className="p8-label" style={{ marginTop: 0 }}>
        질문: {QUESTION}
      </p>
      <label className="p8-range">
        <span>목줄 길이</span>
        <b>{LEASH[leash].name}</b>
        <input
          type="range"
          min={0}
          max={LEASH.length - 1}
          step={1}
          value={leash}
          disabled={running}
          aria-label="목줄 길이"
          onChange={(e) => {
            setLeash(Number(e.target.value));
            setT(0);
          }}
        />
        <span className="p8-ends">
          <span>짧게: 원래 모델 근처</span>
          <span>길게: 점수만 쫓기</span>
        </span>
      </label>
      <div className="lab-actions">
        <button className="btn" onClick={train} disabled={running || done}>
          {done ? "연습 끝" : "연습 시키기"}
        </button>
        {done && (
          <button className="btn ghost" onClick={() => setT(0)}>
            연습 전으로
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
                채점관 {sgn(k.judge)} · 사람 {sgn(k.human)}
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
          채점관 점수 평균<b>{fmt(judge)}</b>
        </div>
        <div className="p8-stat">
          사람 만족도 평균<b>{fmt(human)}</b>
        </div>
        <div className="p8-stat" style={{ gridColumn: "1 / -1" }}>
          원래 모델에서 멀어진 정도 (KL)
          <span className="p8-track" style={{ display: "block", marginTop: 6 }}>
            <span className="p8-fill" style={{ width: `${Math.min(1, drift(p) / 3) * 100}%`, background: "var(--pen)" }} />
          </span>
        </div>
      </div>

      <p className="lab-tip">{tip}</p>
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={Object.keys(tried).length >= 3}>
          {Object.keys(tried).length >= 3 ? "○" : "□"} 목줄 길이 세 가지 이상 연습시켜 보기 ({Object.keys(tried).length}/3)
        </li>
        <li data-done={tried[BEST] !== undefined}>
          {tried[BEST] !== undefined ? "○" : "□"} 사람 만족도가 가장 높은 길이 찾기 (원래 모델: {fmt(humanStart)})
        </li>
      </ul>
      {bestTried && (
        <p className="lab-sum" style={{ margin: "6px 0 0" }}>
          지금까지 가장 좋았던 길이: {LEASH[Number(bestTried[0])].name} (사람 만족도 {fmt(bestTried[1])})
        </p>
      )}
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        점수와 확률은 설명용 예시예요. 연습이 끝났을 때 모델이 자리 잡는 곳을 계산해서 보여 줘요. 점선은 원래 모델의 확률이에요.
      </p>
    </div>
  );
}
