import { useEffect, useRef, useState } from "react";
import "./style.css";

const TICK_MS = 380;

/** 44장: RNN reads one word per step; the Transformer handles every word in one step. */
export function RaceLab() {
  const [n, setN] = useState(8);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState({ any: false, big: false });
  const raf = useRef(0);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const loop = (t: number) => {
      if (t - last >= TICK_MS) {
        last = t;
        setTick((k) => Math.min(k + 1, n));
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running, n]);

  const done = tick >= n;
  useEffect(() => {
    if (!done) return;
    setRunning(false);
    setRan((r) => ({ any: true, big: r.big || n >= 20 }));
  }, [done, n]);
  const start = () => {
    setTick(0);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setTick(0);
  };

  let tip = "'출발'을 눌러 보세요. 위는 RNN, 아래는 트랜스포머예요.";
  if (tick > 0 && !done) tip = "RNN은 앞 단어가 끝나야 다음 단어를 계산해요. 트랜스포머는 벌써 끝났죠?";
  if (done) tip = `RNN은 ${n}단계, 트랜스포머는 1단계. 단어가 많을수록 차이가 커져요.`;
  if (done && n >= 20) tip = `단어 ${n}개: RNN은 ${n}단계를 기다려요. 트랜스포머는 짝 ${n * n}개를 한 번에 계산해요. 계산 양은 많아도 동시에 하니까 빨라요.`;

  return (
    <div>
      <div className="lab-row">
        <span>단어 수</span>
        <input
          type="range"
          min={4}
          max={24}
          step={1}
          value={n}
          aria-label="문장의 단어 수"
          onChange={(e) => {
            setN(Number(e.target.value));
            reset();
          }}
        />
        <span className="val">{n}</span>
      </div>

      <div className="p5-lanes">
        <div className="p5-lane">
          <div className="p5-lane-head">
            <b>RNN</b>
            <span className="num">{tick} / {n} 단계</span>
          </div>
          <div className="p5-boxes" aria-label={`RNN: 단어 ${n}개 중 ${tick}개 계산`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box" data-state={k < tick ? "done" : k === tick && running ? "now" : "wait"} />
            ))}
          </div>
        </div>
        <div className="p5-lane">
          <div className="p5-lane-head">
            <b>트랜스포머</b>
            <span className="num">{tick > 0 ? "1단계에 끝" : "0 단계"}</span>
          </div>
          <div className="p5-boxes" aria-label={`트랜스포머: ${tick > 0 ? "모든 단어 계산 끝" : "시작 전"}`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box tf" data-state={tick > 0 ? "done" : "wait"} />
            ))}
          </div>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={start} disabled={running}>
          출발
        </button>
        <button className="btn ghost" onClick={() => setTick((k) => Math.min(n, k + 1))} disabled={running || done}>
          한 단계씩
        </button>
        <button className="btn ghost" onClick={reset}>
          처음부터
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={ran.any}>{ran.any ? "○" : "□"} 끝까지 달려 보기</li>
        <li data-done={ran.big}>{ran.big ? "○" : "□"} 단어를 20개 이상으로 늘려서 달려 보기</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
