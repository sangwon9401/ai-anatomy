// zh overlay of src/playgrounds/part5/RaceLab.tsx (strings only)
import { useEffect, useRef, useState } from "react";
import "../../../../playgrounds/part5/style.css";

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

  let tip = "点“出发”试试。上面是 RNN，下面是 Transformer。";
  if (tick > 0 && !done) tip = "RNN 要等前一个词算完才能算下一个。Transformer 是不是已经算完了？";
  if (done) tip = `RNN 用了 ${n} 步，Transformer 只用 1 步。词越多，差距越大。`;
  if (done && n >= 20) tip = `${n} 个词：RNN 要等 ${n} 步。Transformer 一次算完 ${n * n} 对。计算量虽然大，但同时算，所以快。`;

  return (
    <div>
      <div className="lab-row">
        <span>词数</span>
        <input
          type="range"
          min={4}
          max={24}
          step={1}
          value={n}
          aria-label="句子的词数"
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
            <span className="num">{tick} / {n} 步</span>
          </div>
          <div className="p5-boxes" aria-label={`RNN：${n} 个词里算完 ${tick} 个`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box" data-state={k < tick ? "done" : k === tick && running ? "now" : "wait"} />
            ))}
          </div>
        </div>
        <div className="p5-lane">
          <div className="p5-lane-head">
            <b>Transformer</b>
            <span className="num">{tick > 0 ? "1 步算完" : "0 步"}</span>
          </div>
          <div className="p5-boxes" aria-label={`Transformer：${tick > 0 ? "所有词都算完了" : "还没开始"}`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box tf" data-state={tick > 0 ? "done" : "wait"} />
            ))}
          </div>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={start} disabled={running}>
          出发
        </button>
        <button className="btn ghost" onClick={() => setTick((k) => Math.min(n, k + 1))} disabled={running || done}>
          一步一步
        </button>
        <button className="btn ghost" onClick={reset}>
          从头开始
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={ran.any}>{ran.any ? "○" : "□"} 跑到终点</li>
        <li data-done={ran.big}>{ran.big ? "○" : "□"} 把词数加到 20 个以上再跑一次</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
