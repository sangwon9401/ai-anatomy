import { useState } from "react";
import { SERVICES } from "../../data/ch78";
import "./style.css";

const MAX_GUESS = 1826; // about five years
const TRUE_DAYS = SERVICES.find((s) => s.name === "ChatGPT")!.days;
const MAX_DAYS = Math.max(...SERVICES.map((s) => s.days));
const daysOf = (v: number) => Math.max(1, Math.round(Math.pow(10, (v / 100) * Math.log10(MAX_GUESS))));
const friendly = (d: number) => (d < 60 ? `약 ${d}일` : d < 730 ? `약 ${Math.round(d / 30.4)}개월` : `약 ${(d / 365).toFixed(1)}년`);

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
        <span>ChatGPT가 사용자 100만 명을 모으는 데 걸린 시간은?</span>
        <span className="p8-big">{friendly(guess)}</span>
        <input type="range" min={0} max={100} step={1} value={v} disabled={revealed} aria-label="걸린 시간 짐작하기" onChange={(e) => setV(Number(e.target.value))} />
        <span className="p8-ends" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
          <span>하루</span>
          <span>약 5년</span>
        </span>
      </label>
      {!revealed ? (
        <div className="lab-actions">
          <button className="btn" onClick={() => setRevealed(true)}>
            정답 보기
          </button>
        </div>
      ) : (
        <p className="lab-tip">
          정답은 단 {TRUE_DAYS}일!{" "}
          {ratio >= 1.5 ? `내 짐작은 실제보다 ${Math.round(ratio)}배 길었어요.` : ratio <= 0.67 ? `실제보다 더 빠르게 짐작했네요!` : "거의 맞혔어요!"}
        </p>
      )}

      {revealed && (
        <>
          <div className="p8-seg" role="group" aria-label="눈금" style={{ marginTop: 14 }}>
            <button aria-pressed={!log} onClick={() => setLog(false)}>
              보통 눈금
            </button>
            <button
              aria-pressed={log}
              onClick={() => {
                setLog(true);
                setUsedLog(true);
              }}
            >
              로그 눈금 (70장)
            </button>
          </div>
          <div className="p8-race" aria-label="100만 명까지 걸린 시간">
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
              출발!
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setRevealed(false);
                setStarted(false);
              }}
            >
              다시 짐작하기
            </button>
          </div>
          {started && (
            <p className="lab-tip">
              {log
                ? "로그 눈금은 10배 차이가 날 때마다 같은 간격이에요(70장). 5일과 3.5년처럼 차이가 큰 값도 한 그림에 담겨요."
                : "보통 눈금에선 ChatGPT 막대가 너무 짧아서 거의 안 보여요. '로그 눈금'으로 바꿔 보세요."}
            </p>
          )}
        </>
      )}
      <ul className="missions" style={{ marginTop: 10 }}>
        <li data-done={revealed}>{revealed ? "○" : "□"} 며칠 걸렸을지 짐작하고 정답 보기</li>
        <li data-done={usedLog && started}>{usedLog && started ? "○" : "□"} 경주를 로그 눈금으로도 보기</li>
      </ul>
      <p className="muted" style={{ fontSize: 13, margin: "8px 0 0" }}>
        다른 서비스의 기간은 널리 인용되는 추정치예요. 서비스마다 '사용자'를 세는 기준이 달라서 대략적인 비교로만 봐 주세요.
      </p>
    </div>
  );
}
