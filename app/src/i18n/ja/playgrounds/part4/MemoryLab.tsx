// ja overlay of src/playgrounds/part4/MemoryLab.tsx (strings only)
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
  const shown = words.length <= 7 ? words : [...words.slice(0, 3), `… ${words.length - 5}語 …`, ...words.slice(-2)];

  const missions = [
    "RNNが「行く」をえらび始める長さを見つける",
    "その長さでLSTMに切りかえて「行った」を取りもどす",
    "LSTMでさえ「昨日」を見落とす長さを見つける",
  ];
  const tip =
    top === 0
      ? `「昨日」がメモに${Math.abs(lastH[0]).toFixed(2)}だけ残っているので、「行った」をえらびました。`
      : `メモの中の「昨日」が${Math.abs(lastH[0]).toFixed(2)}までうすれたので、「${VERBS[top].w}」をえらびました。正解は「行った」なのに！`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="モデルをえらぶ">
        <button aria-pressed={mode === "rnn"} onClick={() => update(middle, "rnn")}>
          RNN
        </button>
        <button aria-pressed={mode === "lstm"} onClick={() => update(middle, "lstm")}>
          LSTM (保管箱)
        </button>
      </div>

      <div className="lab-row" style={{ marginTop: 14, gridTemplateColumns: "6.4em minmax(0, 1fr) 3em" }}>
        <span>間の語の数</span>
        <input type="range" min={0} max={MAX_MIDDLE} step={1} value={middle} aria-label="「昨日」と「学校に」の間の語の数" onChange={(e) => update(Number(e.target.value), mode)} />
        <span className="val">{middle}</span>
      </div>

      <div className="p4-sentence" style={{ marginTop: 8 }} aria-label={`文：${words.join(" ")} 次の語は？`}>
        {shown.map((w, i) => (
          <span key={i} className={`chip ${w === "昨日" && i === 0 ? "hl-mint" : w.startsWith("…") ? "hl-none" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">メモの中の「昨日」のこさ</h4>
          <svg viewBox={`0 0 ${W} 130`} style={{ width: "100%", maxWidth: 360, display: "block" }} role="img" aria-label={`最後のマスでRNN ${Math.abs(rnn[total - 1]).toFixed(2)}、LSTM ${Math.abs(lstm[total - 1]).toFixed(2)}`}>
            <line x1={10} y1={112} x2={W - 10} y2={112} stroke="var(--ink-3)" strokeWidth={1.5} />
            {words.map((_, i) => (
              <g key={i}>
                <rect x={10 + i * bw + bw * 0.1} y={112 - Math.abs(rnn[i]) * 100} width={bw * 0.38} height={Math.abs(rnn[i]) * 100} fill="var(--hl-sky)" opacity={mode === "rnn" ? 1 : 0.45} />
                <rect x={10 + i * bw + bw * 0.52} y={112 - Math.abs(lstm[i]) * 100} width={bw * 0.38} height={Math.abs(lstm[i]) * 100} fill="var(--hl-mint)" opacity={mode === "lstm" ? 1 : 0.45} />
              </g>
            ))}
            <text x={12} y={126} fontSize={10} fill="var(--ink-2)">
              昨日
            </text>
            <text x={W - 12} y={126} fontSize={10} fill="var(--ink-2)" textAnchor="end">
              学校に
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
          <h4 className="p4-h4">{mode === "rnn" ? "RNN" : "LSTM"}が当てた次の語</h4>
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
        <h4>順番待ちレース：{total}マスを計算する</h4>
        <div className="p4-race" aria-hidden="true">
          <span className="p4-race-label">RNN</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null ? "idle" : i < tick ? "done" : i === tick ? "now" : "idle"} />
            ))}
          </span>
          <span className="p4-race-label">同時に</span>
          <span className="p4-cells">
            {words.map((_, i) => (
              <span key={i} className="p4-cell" data-state={race === null || tick < 0 ? "idle" : tick === 0 ? "now" : "par"} />
            ))}
          </span>
        </div>
        <p className="p4-note" aria-live="polite">
          {race === null
            ? "スタートを押すと、2つのやり方でマスを計算します。"
            : raceDone
              ? `同時にすれば1回で終わったのに、RNNは${total}回を順番に待たなければなりませんでした。`
              : `RNN：${Math.max(0, Math.min(tick, total))} / ${total}マス · 同時に：${tick >= 1 ? total : 0} / ${total}マス`}
        </p>
        <div className="lab-actions" style={{ marginTop: 8 }}>
          <button
            className="btn ghost"
            onClick={() => {
              setTick(-1);
              setRace(performance.now());
            }}
          >
            {race === null ? "スタート" : "もう一度スタート"}
          </button>
        </div>
      </div>
      <p className="p4-note">* 説明用のおもちゃのモデルです。RNNはメモを0.8倍ずつ、LSTMの保管箱は0.95倍ずつ書き写します。</p>
    </div>
  );
}
