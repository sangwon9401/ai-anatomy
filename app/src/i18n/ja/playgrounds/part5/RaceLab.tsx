// ja overlay of src/playgrounds/part5/RaceLab.tsx (strings only)
import { useEffect, useRef, useState } from "react";
import "../../../../playgrounds/part5/style.css";

const TICK_MS = 380;

/** ch44: RNN reads one word per step; the Transformer handles every word in one step. */
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

  let tip = "「スタート」を押してみましょう。上がRNN、下がトランスフォーマーです。";
  if (tick > 0 && !done) tip = "RNNは前の語が終わらないと、次の語を計算できません。トランスフォーマーは、もう終わっていますね？";
  if (done) tip = `RNNは${n}ステップ、トランスフォーマーは1ステップ。語が多いほど差が大きくなります。`;
  if (done && n >= 20) tip = `語が${n}個：RNNは${n}ステップ待ちます。トランスフォーマーはペア${n * n}組を一度に計算します。計算の量は多くても、同時にするので速いのです。`;

  return (
    <div>
      <div className="lab-row">
        <span>語の数</span>
        <input
          type="range"
          min={4}
          max={24}
          step={1}
          value={n}
          aria-label="文の語の数"
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
            <span className="num">{tick} / {n} ステップ</span>
          </div>
          <div className="p5-boxes" aria-label={`RNN：語${n}個のうち${tick}個を計算`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box" data-state={k < tick ? "done" : k === tick && running ? "now" : "wait"} />
            ))}
          </div>
        </div>
        <div className="p5-lane">
          <div className="p5-lane-head">
            <b>トランスフォーマー</b>
            <span className="num">{tick > 0 ? "1ステップで終わり" : "0 ステップ"}</span>
          </div>
          <div className="p5-boxes" aria-label={`トランスフォーマー：${tick > 0 ? "すべての語の計算が終わり" : "スタート前"}`}>
            {Array.from({ length: n }, (_, k) => (
              <span key={k} className="p5-box tf" data-state={tick > 0 ? "done" : "wait"} />
            ))}
          </div>
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={start} disabled={running}>
          スタート
        </button>
        <button className="btn ghost" onClick={() => setTick((k) => Math.min(n, k + 1))} disabled={running || done}>
          1ステップずつ
        </button>
        <button className="btn ghost" onClick={reset}>
          最初から
        </button>
      </div>
      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={ran.any}>{ran.any ? "○" : "□"} 最後まで走らせてみる</li>
        <li data-done={ran.big}>{ran.big ? "○" : "□"} 語を20個以上にふやして走らせてみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
