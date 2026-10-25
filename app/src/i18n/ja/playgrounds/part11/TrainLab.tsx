import { useEffect, useReducer, useRef, useState } from "react";
import { corpusByKey } from "../../../../data/part11-corpus";
import { MINI, paramCount, trainStep } from "../../../../playgrounds/part11/minigpt";
import { getCorpus, getMerges, getSession, newSession, writeLine, type Session } from "../../../../playgrounds/part11/store";
import "../../../../playgrounds/part11/style.css";

// when the model writes a line into the diary on its own
const DIARY_AT = new Set([50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
const MAX_GOAL = 5000;
/** milliseconds of training per animation frame, so the page stays responsive */
const BUDGET = 12;
const fmt = (n: number) => n.toLocaleString("ja-JP");
const lossNow = (s: Session) => s.history[s.history.length - 1];

function Chart({ s }: { s: Session }) {
  const W = 320;
  const H = 170;
  const x0 = 30;
  const y0 = 146;
  const top = Math.ceil(s.start);
  const maxStep = Math.max(s.goal, s.model.step);
  const X = (step: number) => x0 + (step / maxStep) * (W - x0 - 8);
  const Y = (loss: number) => y0 - (Math.min(loss, top) / top) * (y0 - 10);
  const h = s.history;
  const every = Math.max(1, Math.ceil(h.length / 300));
  let pts = "";
  for (let i = 0; i < h.length; i += every) pts += `${X(i * 10).toFixed(1)},${Y(h[i]).toFixed(1)} `;
  const last = h.length - 1;
  pts += `${X(last * 10).toFixed(1)},${Y(h[last]).toFixed(1)}`;
  const ticks = [0, Math.round(top / 3), Math.round((2 * top) / 3), top];
  return (
    <svg className="p11-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`損失のグラフ：${fmt(s.model.step)}歩、損失 ${lossNow(s).toFixed(2)}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0} y1={Y(t)} x2={W - 8} y2={Y(t)} stroke="var(--grid-major)" strokeWidth={1} />
          <text x={x0 - 6} y={Y(t) + 4} textAnchor="end" fontSize={10} fill="var(--ink-2)">
            {t}
          </text>
        </g>
      ))}
      <line x1={x0} y1={Y(s.start)} x2={W - 8} y2={Y(s.start)} stroke="var(--ink-3)" strokeWidth={1.2} strokeDasharray="4 3" />
      <text x={W - 10} y={Y(s.start) - 4} textAnchor="end" fontSize={9} fill="var(--ink-2)">
        でたらめに選ぶ {s.start.toFixed(2)}
      </text>
      <line x1={x0} y1={y0} x2={W - 8} y2={y0} stroke="var(--ink)" strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0} y2={8} stroke="var(--ink)" strokeWidth={1.5} />
      <polyline points={pts} fill="none" stroke="var(--pen)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(last * 10)} cy={Y(h[last])} r={3.5} fill="var(--pen)" />
      <text x={x0} y={H - 6} fontSize={10} fill="var(--ink-2)">
        0
      </text>
      <text x={W - 8} y={H - 6} textAnchor="end" fontSize={10} fill="var(--ink-2)">
        {fmt(maxStep)}歩
      </text>
    </svg>
  );
}

export function TrainLab() {
  const corpus = corpusByKey(getCorpus());
  const merges = getMerges().length;
  const [session, setSession] = useState<Session | null>(getSession);
  const [running, setRunning] = useState(false);
  const [, redraw] = useReducer((x: number) => x + 1, 0);
  const sref = useRef(session);
  sref.current = session;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let lastDraw = 0;
    const tick = (now: number) => {
      const s = sref.current;
      if (!s) return;
      const t0 = performance.now();
      while (s.model.step < s.goal) {
        const loss = trainStep(s.model, s.work, s.sample);
        if (!Number.isFinite(loss)) {
          setRunning(false);
          redraw();
          return;
        }
        s.pending.push(loss);
        if (s.pending.length === 10) {
          s.history.push(s.pending.reduce((a, b) => a + b, 0) / 10);
          s.pending = [];
        }
        if (DIARY_AT.has(s.model.step)) s.diary.push({ step: s.model.step, loss: lossNow(s), text: writeLine(s) });
        if (performance.now() - t0 > BUDGET) break;
      }
      s.ms += performance.now() - t0;
      if (s.model.step >= s.goal) {
        setRunning(false);
        redraw();
        return;
      }
      if (now - lastDraw > 120) {
        lastDraw = now;
        redraw();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const start = () => {
    if (!sref.current) {
      const s = newSession();
      sref.current = s;
      setSession(s);
    }
    setRunning(true);
  };
  const restart = () => {
    setRunning(false);
    const s = newSession();
    sref.current = s;
    setSession(s);
  };
  const more = () => {
    const s = sref.current;
    if (!s) return;
    s.goal = Math.min(MAX_GOAL, s.goal + 1000);
    setRunning(true);
  };
  const writeNow = () => {
    const s = sref.current;
    if (!s) return;
    s.diary.push({ step: s.model.step, loss: lossNow(s), text: writeLine(s) });
    redraw();
  };

  const s = session;
  const step = s?.model.step ?? 0;
  const loss = s ? lossNow(s) : null;
  const sec = s ? s.ms / 1000 : 0;
  const lineSet = new Set(corpus.lines);
  const V = s ? s.tok.vocab.length : 0;
  const epochs = s ? (step * MINI.batch * MINI.T) / s.lines.reduce((a, l) => a + l.length + 1, 0) : 0;
  const done = !!s && step >= s.goal;

  let tip: string;
  if (!s) tip = "「訓練スタート」を押してみましょう。はじめの損失は、でたらめに選ぶのと同じくらいから始まります。";
  else if (running && step < 100) tip = "いまは文字をでたらめに選んでいる段階です。損失はすぐに下がりはじめます。";
  else if (loss !== null && loss > 3) tip = "よく出てくる文字から学んでいるところです。";
  else if (loss !== null && loss > 2) tip = "言葉がちらほら見えはじめるころです。生成日記を見てみましょう。";
  else if (loss !== null && loss > 1.2) tip = "それらしい行が出はじめます。データにない新しい組み合わせも見えます。";
  else tip = "損失がとても低くなりました。データを丸ごと覚えた行（覚えた文）がよく出てくるようになります。";
  if (done) tip = s.goal >= MAX_GOAL ? `${fmt(step)}歩に到着！第95章で、このモデルに文章を書かせてみましょう。` : `目標の${fmt(s.goal)}歩に到着！第95章で、このモデルに文章を書かせてみましょう。もっと訓練することもできます。`;

  return (
    <div>
      <div className="p11-setup">
        <span className="chip hl-yellow">{corpus.name}</span>
        <span className="chip hl-sky">{merges ? `BPE くっつけ${merges}回` : "文字単位のトークン"}</span>
        {s && <span className="chip hl-mint">つまみ {fmt(paramCount(s.model.cfg))}個</span>}
      </div>

      <div className="lab-actions">
        {!running ? (
          <button className="btn" onClick={done ? more : start} disabled={done && s.goal >= MAX_GOAL}>
            {!s ? "訓練スタート" : done ? "あと1,000歩" : "続きを訓練"}
          </button>
        ) : (
          <button className="btn" onClick={() => setRunning(false)}>
            一時停止
          </button>
        )}
        <button className="btn ghost" onClick={writeNow} disabled={!s}>
          いま1行書かせる
        </button>
        <button className="btn ghost" onClick={restart} disabled={!s}>
          最初から
        </button>
      </div>

      <dl className="p11-stats p11-stats4">
        <div>
          <dt>歩数</dt>
          <dd>{fmt(step)}</dd>
          <small>目標 {fmt(s?.goal ?? 2000)}</small>
        </div>
        <div>
          <dt>損失</dt>
          <dd>{loss === null ? "–" : loss.toFixed(2)}</dd>
          <small>{s ? `はじめ ${s.history[0].toFixed(2)}` : "低いほどよく当たる"}</small>
        </div>
        <div>
          <dt>訓練時間</dt>
          <dd>{sec.toFixed(1)}秒</dd>
          <small>{sec > 0.5 ? `1秒に${Math.round(step / sec)}歩` : "スマホの中で計算"}</small>
        </div>
        <div>
          <dt>データを読んだ回数</dt>
          <dd>{epochs.toFixed(0)}回</dd>
          <small>{MINI.T}トークンのかたまり × {MINI.batch}つずつ</small>
        </div>
      </dl>

      {s && <Chart s={s} />}

      {s && (
        <>
          <h4 className="p11-h4">生成日記（温度0.8）</h4>
          <ol className="p11-diary">
            {[...s.diary].reverse().slice(0, 12).map((d, i) => (
              <li key={s.diary.length - i}>
                <span className="p11-diary-step num">
                  {fmt(d.step)}歩・損失 {d.loss.toFixed(2)}
                </span>
                <span className="p11-diary-text">{d.text || "（すぐに改行）"}</span>
                {lineSet.has(d.text) && <span className="p11-badge">覚えた文</span>}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {[3, 2, 1].map((t) => {
          const ok = !!s && s.history.some((v, i) => i > 0 && v < t);
          return (
            <li key={t} data-done={ok}>
              {ok ? "✓" : "○"} 損失を{t}より下に
            </li>
          );
        })}
        <li data-done={!!s && s.diary.some((d) => lineSet.has(d.text))}>
          {s && s.diary.some((d) => lineSet.has(d.text)) ? "✓" : "○"} データの中の文をそのまま書く（覚えはじめ！）
        </li>
      </ul>
      <p className="lab-tip">{tip}</p>

      <details className="p11-arch">
        <summary>このミニGPTの設計表</summary>
        {s ? (
          <ul>
            <li>
              トークンの埋め込み {fmt(V)}×{MINI.d} + 位置の埋め込み {MINI.T}×{MINI.d}（第33章、第36章）
            </li>
            <li>トランスフォーマーのブロック1層：層の正規化 → 未来を隠したセルフアテンションのヘッド1つ → 残差接続（第45〜51章、第56〜57章）</li>
            <li>
              → 層の正規化 → フィードフォワード {MINI.d}→{MINI.h}→{MINI.d}（GELU）→ 残差接続（第55章）
            </li>
            <li>層の正規化 → {fmt(V)}種類のトークンのスコア → ソフトマックス（第60章、第14章）。出力のつまみは、トークンの埋め込みと共有します。</li>
            <li>損失：交差エントロピー（第65章）・下り坂：Adam（第67章）、1歩にかたまり{MINI.batch}つ</li>
          </ul>
        ) : (
          <p>訓練を始めると表示されます。</p>
        )}
      </details>
    </div>
  );
}
