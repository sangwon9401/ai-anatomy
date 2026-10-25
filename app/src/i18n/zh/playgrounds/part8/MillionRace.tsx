import { useState } from "react";
import { SERVICES } from "../../../../data/ch78";
import "../../../../playgrounds/part8/style.css";

const MAX_GUESS = 1826; // about five years
const TRUE_DAYS = SERVICES.find((s) => s.name === "ChatGPT")!.days;
const MAX_DAYS = Math.max(...SERVICES.map((s) => s.days));
const daysOf = (v: number) => Math.max(1, Math.round(Math.pow(10, (v / 100) * Math.log10(MAX_GUESS))));
const friendly = (d: number) => (d < 60 ? `约 ${d} 天` : d < 730 ? `约 ${Math.round(d / 30.4)} 个月` : `约 ${(d / 365).toFixed(1)} 年`);

export function MillionRace() {
  const [v, setV] = useState(60);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState(false);
  const [usedLog, setUsedLog] = useState(false);
  const guess = daysOf(v);
  const ratio = guess / TRUE_DAYS;

  const width = (d: number) => (log ? (Math.log10(d) / Math.log10(MAX_DAYS)) * 100 : (d / MAX_DAYS) * 100);

  return (
    <div>
      <label className="p8-guess">
        <span>ChatGPT 达到 100 万用户用了多长时间？</span>
        <span className="p8-big">{friendly(guess)}</span>
        <input type="range" min={0} max={100} step={1} value={v} disabled={revealed} aria-label="猜一猜用了多久" onChange={(e) => setV(Number(e.target.value))} />
        <span className="p8-ends" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
          <span>1 天</span>
          <span>约 5 年</span>
        </span>
      </label>
      {!revealed ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setRevealed(true)}>
            看答案
          </button>
        </div>
      ) : (
        <p className="lab-tip">
          答案是只用了 {TRUE_DAYS} 天！{" "}
          {ratio >= 1.5 ? `我猜的时间是实际的 ${Math.round(ratio)} 倍。` : ratio <= 0.67 ? `猜得比实际还快！` : "差不多猜中了！"}
        </p>
      )}

      {revealed && (
        <>
          <div className="p8-seg" role="group" aria-label="刻度" style={{ marginTop: 14 }}>
            <button aria-pressed={!log} onClick={() => setLog(false)}>
              普通刻度
            </button>
            <button
              aria-pressed={log}
              onClick={() => {
                setLog(true);
                setUsedLog(true);
              }}
            >
              对数刻度（第 70 章）
            </button>
          </div>
          <div className="p8-race" aria-label="达到 100 万用户所用的时间">
            {SERVICES.map((s) => (
              <div className="p8-lane" key={s.name}>
                <span style={{ fontWeight: s.name === "ChatGPT" ? 700 : 400 }}>{s.name}</span>
                <span className="p8-track">
                  <span className="p8-fill" style={{ width: started ? `${width(s.days)}%` : 0, background: s.name === "ChatGPT" ? "var(--pen)" : "var(--hl-sky)" }} />
                </span>
                <span className="p8-when">{started ? s.label : ""}</span>
              </div>
            ))}
          </div>
          <div className="lab-actions">
            <button className="btn" onClick={() => setStarted(true)} disabled={started}>
              出发！
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setRevealed(false);
                setStarted(false);
              }}
            >
              重新猜
            </button>
          </div>
          {started && (
            <p className="lab-tip">
              {log
                ? "在对数刻度上，每差 10 倍就隔同样的距离（第 70 章）。像 5 天和 3.5 年这样差很多的数，也能画在一张图里。"
                : "在普通刻度上，ChatGPT 的条太短，几乎看不见。换成“对数刻度”试试。"}
            </p>
          )}
        </>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={revealed}>{revealed ? "○" : "□"} 猜一猜用了几天，再看答案</li>
        <li data-done={usedLog && started}>{usedLog && started ? "○" : "□"} 用对数刻度也看一遍赛跑</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        其他服务的时间是广为引用的估计数字。各个服务统计“用户”的标准不同，只能当作大致的比较。
      </p>
    </div>
  );
}
