import { useState } from "react";
import { SERVICES } from "../../../../data/ch78";
import "../../../../playgrounds/part8/style.css";

const MAX_GUESS = 1826; // about five years
const TRUE_DAYS = SERVICES.find((s) => s.name === "ChatGPT")!.days;
const MAX_DAYS = Math.max(...SERVICES.map((s) => s.days));
const daysOf = (v: number) => Math.max(1, Math.round(Math.pow(10, (v / 100) * Math.log10(MAX_GUESS))));
const friendly = (d: number) => (d < 60 ? `約${d}日` : d < 730 ? `約${Math.round(d / 30.4)}か月` : `約${(d / 365).toFixed(1)}年`);

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
        <span>ChatGPTがユーザー100万人を集めるのにかかった時間は？</span>
        <span className="p8-big">{friendly(guess)}</span>
        <input type="range" min={0} max={100} step={1} value={v} disabled={revealed} aria-label="かかった時間を予想する" onChange={(e) => setV(Number(e.target.value))} />
        <span className="p8-ends" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
          <span>1日</span>
          <span>約5年</span>
        </span>
      </label>
      {!revealed ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setRevealed(true)}>
            正解を見る
          </button>
        </div>
      ) : (
        <p className="lab-tip">
          正解はたった{TRUE_DAYS}日！{" "}
          {ratio >= 1.5 ? `自分の予想は、実際より${Math.round(ratio)}倍長かったです。` : ratio <= 0.67 ? `実際より速く予想しましたね！` : "ほぼ正解です！"}
        </p>
      )}

      {revealed && (
        <>
          <div className="p8-seg" role="group" aria-label="目盛り" style={{ marginTop: 14 }}>
            <button aria-pressed={!log} onClick={() => setLog(false)}>
              ふつうの目盛り
            </button>
            <button
              aria-pressed={log}
              onClick={() => {
                setLog(true);
                setUsedLog(true);
              }}
            >
              対数目盛り（第70章）
            </button>
          </div>
          <div className="p8-race" aria-label="100万人までにかかった時間">
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
              スタート！
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setRevealed(false);
                setStarted(false);
              }}
            >
              もう一度予想する
            </button>
          </div>
          {started && (
            <p className="lab-tip">
              {log
                ? "対数目盛りは、10倍ちがうごとに同じ間隔です（第70章）。5日と3.5年のように差が大きい値も、1つの図に収まります。"
                : "ふつうの目盛りでは、ChatGPTの棒が短すぎてほとんど見えません。「対数目盛り」に変えてみましょう。"}
            </p>
          )}
        </>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={revealed}>{revealed ? "○" : "□"} 何日かかったか予想して正解を見る</li>
        <li data-done={usedLog && started}>{usedLog && started ? "○" : "□"} レースを対数目盛りでも見る</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        ほかのサービスの期間は、広く引用される推定値です。サービスごとに「ユーザー」の数え方がちがうので、おおよその比較として見てください。
      </p>
    </div>
  );
}
