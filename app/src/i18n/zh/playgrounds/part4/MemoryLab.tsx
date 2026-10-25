// zh overlay of src/playgrounds/part4/MemoryLab.tsx (strings; the first word it highlights is the zh data's 昨天)
import { useEffect, useState } from "react";
import { VERBS, predictVerb, rnnRun } from "../../../../data/ch40";
import { lstmRun, sentenceWith } from "../../../../data/ch41";
import "../../../../playgrounds/part4/style.css";

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
  const shown = words.length <= 7 ? words : [...words.slice(0, 3), `…… ${words.length - 5} 个 ……`, ...words.slice(-2)];

  const missions = [
    "找出 RNN 开始选“去”的长度",
    "在那个长度换成 LSTM，把“去了”救回来",
    "找出连 LSTM 都忘掉“昨天”的长度",
  ];
  const tip =
    top === 0
      ? `纸条上还留着 ${Math.abs(lastH[0]).toFixed(2)} 的“昨天”，所以选了“去了”。`
      : `纸条里的“昨天”淡到只剩 ${Math.abs(lastH[0]).toFixed(2)}，所以选了“${VERBS[top].w}”。正确答案明明是“去了”！`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="选择模型">
        <button aria-pressed={mode === "rnn"} onClick={() => update(middle, "rnn")}>
          RNN
        </button>
        <button aria-pressed={mode === "lstm"} onClick={() => update(middle, "lstm")}>
          LSTM（保管箱）
        </button>
      </div>

      <div className="lab-row" style={{ marginTop: 14, gridTemplateColumns: "6.4em minmax(0, 1fr) 3em" }}>
        <span>中间的词数</span>
        <input type="range" min={0} max={MAX_MIDDLE} step={1} value={middle} aria-label="“昨天”和“最后”之间的词数" onChange={(e) => update(Number(e.target.value), mode)} />
        <span className="val">{middle}</span>
      </div>

      <div className="p4-sentence" style={{ marginTop: 8 }} aria-label={`句子：${words.join(" ")}，下一个词是？`}>
        {shown.map((w, i) => (
          <span key={i} className={`chip ${w === "昨天" && i === 0 ? "hl-mint" : w.startsWith("…") ? "hl-none" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">纸条里“昨天”的浓淡</h4>
          <svg viewBox={`0 0 ${W} 130`} style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`最后一格：RNN ${Math.abs(rnn[total - 1]).toFixed(2)}，LSTM ${Math.abs(lstm[total - 1]).toFixed(2)}`}>
            <line x1={10} y1={112} x2={W - 10} y2={112} stroke="var(--ink-3)" strokeWidth={1.5} />
            {words.map((_, i) => (
              <g key={i}>
                <rect x={10 + i * bw + bw * 0.1} y={112 - Math.abs(rnn[i]) * 100} width={bw * 0.38} height={Math.abs(rnn[i]) * 100} fill="var(--hl-sky)" opacity={mode === "rnn" ? 1 : 0.45} />
                <rect x={10 + i * bw + bw * 0.52} y={112 - Math.abs(lstm[i]) * 100} width={bw * 0.38} height={Math.abs(lstm[i]) * 100} fill="var(--hl-mint)" opacity={mode === "lstm" ? 1 : 0.45} />
              </g>
            ))}
            <text x={12} y={126} fontSize={10} fill="var(--ink-2)">
              昨天
            </text>
            <text x={W - 12} y={126} fontSize={10} fill="var(--ink-2)" textAnchor="end">
              最后
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
          <h4 className="p4-h4">{mode === "rnn" ? "RNN" : "LSTM"} 猜的下一个词</h4>
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
        <h4>排队赛跑：计算 {total} 格</h4>
        <div className="p4-race" aria-hidden="true">
          <span className="p4-race-label">RNN</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null ? "idle" : i < tick ? "done" : i === tick ? "now" : "idle"} />
            ))}
          </span>
          <span className="p4-race-label">同时</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null || tick < 0 ? "idle" : tick === 0 ? "now" : "par"} />
            ))}
          </span>
        </div>
        <p className="p4-note" aria-live="polite">
          {race === null
            ? "点“出发”，两种方式就开始计算各格。"
            : raceDone
              ? `同时算的话一次就算完了，RNN 却要按顺序等 ${total} 次。`
              : `RNN：${Math.max(0, Math.min(tick, total))} / ${total} 格 · 同时：${tick >= 1 ? total : 0} / ${total} 格`}
        </p>
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button
            className="btn ghost"
            onClick={() => {
              setTick(-1);
              setRace(performance.now());
            }}
          >
            {race === null ? "出发" : "再出发"}
          </button>
        </div>
      </div>
      <p className="p4-note">* 这是示意用的玩具模型。RNN 每次把纸条乘 0.8 抄过去，LSTM 的保管箱每次乘 0.95。</p>
    </div>
  );
}
