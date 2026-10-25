import { useEffect, useState } from "react";
import { VERBS, predictVerb, rnnRun } from "../../data/ch40";
import { lstmRun, sentenceWith } from "../../data/ch41";
import "./style.css";

type Mode = "rnn" | "lstm";
const MAX_MIDDLE = 40;
const TICK_MS = 140;

export function MemoryLab() {
  const [middle, setMiddle] = useState(2);
  const [mode, setMode] = useState<Mode>("rnn");
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const words = sentenceWith(middle);
  const rnn = rnnRun(words).map((n) => n.h[0]);
  const lstm = lstmRun(words).map((n) => n.h[0]);
  const lastH = mode === "rnn" ? rnnRun(words)[words.length - 1].h : lstmRun(words)[words.length - 1].h;
  const probs = predictVerb(lastH);
  const top = probs.indexOf(Math.max(...probs));

  const update = (m: number, md: Mode) => {
    setMiddle(m);
    setMode(md);
    const w = sentenceWith(m);
    const h = md === "rnn" ? rnnRun(w)[w.length - 1].h : lstmRun(w)[w.length - 1].h;
    const p = predictVerb(h);
    const t = p.indexOf(Math.max(...p));
    const rnnTop = (() => {
      const q = predictVerb(rnnRun(w)[w.length - 1].h);
      return q.indexOf(Math.max(...q));
    })();
    const now = [md === "rnn" && t !== 0, md === "lstm" && t === 0 && rnnTop !== 0, md === "lstm" && t !== 0];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  // the queue race
  const total = words.length;
  const [race, setRace] = useState<number | null>(null);
  const [tick, setTick] = useState(-1);
  useEffect(() => {
    if (race === null) return;
    let id = 0;
    const loop = (now: number) => {
      const k = Math.floor((now - race) / TICK_MS);
      setTick(k);
      if (k <= total) id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [race, total]);
  const raceDone = race !== null && tick >= total;

  const W = 320;
  const bw = (W - 20) / total;
  const shown = words.length <= 7 ? words : [...words.slice(0, 3), `… ${words.length - 5}개 …`, ...words.slice(-2)];

  const missions = [
    "RNN이 '간다'를 고르기 시작하는 길이 찾기",
    "그 길이에서 LSTM으로 바꿔 '갔다' 되살리기",
    "LSTM마저 '어제'를 놓치는 길이 찾기",
  ];
  const tip =
    top === 0
      ? `'어제'가 쪽지에 ${Math.abs(lastH[0]).toFixed(2)}만큼 남아 있어서 '갔다'를 골랐어요.`
      : `쪽지 속 '어제'가 ${Math.abs(lastH[0]).toFixed(2)}까지 옅어져서 '${VERBS[top].w}'를 골랐어요. 정답은 '갔다'인데요!`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="모델 고르기">
        <button aria-pressed={mode === "rnn"} onClick={() => update(middle, "rnn")}>
          RNN
        </button>
        <button aria-pressed={mode === "lstm"} onClick={() => update(middle, "lstm")}>
          LSTM (보관함)
        </button>
      </div>

      <div className="lab-row" style={{ marginTop: 14, gridTemplateColumns: "6.4em minmax(0, 1fr) 3em" }}>
        <span>사이 단어 수</span>
        <input type="range" min={0} max={MAX_MIDDLE} step={1} value={middle} aria-label="'어제'와 '학교에' 사이 단어 수" onChange={(e) => update(Number(e.target.value), mode)} />
        <span className="val">{middle}</span>
      </div>

      <div className="p4-sentence" style={{ marginTop: 8 }} aria-label={`문장: ${words.join(" ")} 다음 단어는?`}>
        {shown.map((w, i) => (
          <span key={i} className={`chip ${w === "어제" && i === 0 ? "hl-mint" : w.startsWith("…") ? "hl-none" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">쪽지 속 '어제'의 진하기</h4>
          <svg viewBox={`0 0 ${W} 130`} style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`마지막 칸에서 RNN ${Math.abs(rnn[total - 1]).toFixed(2)}, LSTM ${Math.abs(lstm[total - 1]).toFixed(2)}`}>
            <line x1={10} y1={112} x2={W - 10} y2={112} stroke="var(--ink-3)" strokeWidth={1.5} />
            {words.map((_, i) => (
              <g key={i}>
                <rect x={10 + i * bw + bw * 0.1} y={112 - Math.abs(rnn[i]) * 100} width={bw * 0.38} height={Math.abs(rnn[i]) * 100} fill="var(--hl-sky)" opacity={mode === "rnn" ? 1 : 0.45} />
                <rect x={10 + i * bw + bw * 0.52} y={112 - Math.abs(lstm[i]) * 100} width={bw * 0.38} height={Math.abs(lstm[i]) * 100} fill="var(--hl-mint)" opacity={mode === "lstm" ? 1 : 0.45} />
              </g>
            ))}
            <text x={12} y={126} fontSize={10} fill="var(--ink-2)">
              어제
            </text>
            <text x={W - 12} y={126} fontSize={10} fill="var(--ink-2)" textAnchor="end">
              학교에
            </text>
          </svg>
          <ul className="legend" style={{ marginTop: 4 }}>
            <li>
              <span className="swatch" style={{ background: "var(--hl-sky)" }} />
              RNN
            </li>
            <li>
              <span className="swatch" style={{ background: "var(--hl-mint)" }} />
              LSTM
            </li>
          </ul>
        </div>
        <div>
          <h4 className="p4-h4">{mode === "rnn" ? "RNN" : "LSTM"}이 맞힌 다음 단어</h4>
          <div className="bars">
            {VERBS.map((v, i) => (
              <div className="bar-row" key={v.w}>
                <span className="label" style={{ fontWeight: i === top ? 700 : 400 }}>
                  {v.w}
                </span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${probs[i] * 100}%`, background: `var(--hl-${v.c})` }} />
                </span>
                <span className="val">{Math.round(probs[i] * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m, i) => (
          <li key={m} data-done={seen[i]}>
            {seen[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>

      <div className="p4-box">
        <h4>줄 서기 경주: 칸 {total}개 계산하기</h4>
        <div className="p4-race" aria-hidden="true">
          <span className="p4-race-label">RNN</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null ? "idle" : i < tick ? "done" : i === tick ? "now" : "idle"} />
            ))}
          </span>
          <span className="p4-race-label">동시에</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null || tick < 0 ? "idle" : tick === 0 ? "now" : "par"} />
            ))}
          </span>
        </div>
        <p className="p4-note" aria-live="polite">
          {race === null
            ? "출발을 누르면 두 방식이 칸을 계산해요."
            : raceDone
              ? `동시에 하면 한 번에 끝났지만, RNN은 ${total}번을 차례로 기다려야 했어요.`
              : `RNN: ${Math.max(0, Math.min(tick, total))} / ${total}칸 · 동시에: ${tick >= 1 ? total : 0} / ${total}칸`}
        </p>
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button
            className="btn ghost"
            onClick={() => {
              setTick(-1);
              setRace(performance.now());
            }}
          >
            {race === null ? "출발" : "다시 출발"}
          </button>
        </div>
      </div>
      <p className="p4-note">* 설명용 장난감 모델이에요. RNN은 쪽지를 0.8배씩, LSTM 보관함은 0.95배씩 옮겨 적어요.</p>
    </div>
  );
}
