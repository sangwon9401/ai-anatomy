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
const fmt = (n: number) => n.toLocaleString("zh-CN");
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
    <svg className="p11-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`损失曲线：第 ${fmt(s.model.step)} 步，损失 ${lossNow(s).toFixed(2)}`}>
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
        随便猜 {s.start.toFixed(2)}
      </text>
      <line x1={x0} y1={y0} x2={W - 8} y2={y0} stroke="var(--ink)" strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0} y2={8} stroke="var(--ink)" strokeWidth={1.5} />
      <polyline points={pts} fill="none" stroke="var(--pen)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(last * 10)} cy={Y(h[last])} r={3.5} fill="var(--pen)" />
      <text x={x0} y={H - 6} fontSize={10} fill="var(--ink-2)">
        0
      </text>
      <text x={W - 8} y={H - 6} textAnchor="end" fontSize={10} fill="var(--ink-2)">
        {fmt(maxStep)} 步
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
  if (!s) tip = "按下“开始训练”。一开始，损失和随便猜差不多。";
  else if (running && step < 100) tip = "现在还在乱猜字的阶段。损失马上就会开始下降。";
  else if (loss !== null && loss > 3) tip = "正在先学常见的字和标点。";
  else if (loss !== null && loss > 2) tip = "词语会一个两个地冒出来。看看生成日记吧。";
  else if (loss !== null && loss > 1.2) tip = "开始写出像样的句子了，还能看到数据里没有的新组合。";
  else tip = "损失已经很低了。现在常常会写出把数据整句背下来的句子（背下来的句子）。";
  if (done) tip = s.goal >= MAX_GOAL ? `到达第 ${fmt(step)} 步！去第 95 章用这个模型写写句子吧。` : `到达目标 ${fmt(s.goal)} 步！去第 95 章用这个模型写写句子吧。也可以再多训练一会儿。`;

  return (
    <div>
      <div className="p11-setup">
        <span className="chip hl-yellow">{corpus.name}</span>
        <span className="chip hl-sky">{merges ? `BPE 合并 ${merges} 次` : "按字切的词元"}</span>
        {s && <span className="chip hl-mint">旋钮 {fmt(paramCount(s.model.cfg))} 个</span>}
      </div>

      <div className="lab-actions">
        {!running ? (
          <button className="btn" onClick={done ? more : start} disabled={done && s.goal >= MAX_GOAL}>
            {!s ? "开始训练" : done ? "再训练 1,000 步" : "继续训练"}
          </button>
        ) : (
          <button className="btn" onClick={() => setRunning(false)}>
            暂停一下
          </button>
        )}
        <button className="btn ghost" onClick={writeNow} disabled={!s}>
          现在写一句看看
        </button>
        <button className="btn ghost" onClick={restart} disabled={!s}>
          重新开始
        </button>
      </div>

      <dl className="p11-stats p11-stats4">
        <div>
          <dt>步数</dt>
          <dd>{fmt(step)}</dd>
          <small>目标 {fmt(s?.goal ?? 2000)}</small>
        </div>
        <div>
          <dt>损失</dt>
          <dd>{loss === null ? "–" : loss.toFixed(2)}</dd>
          <small>{s ? `开始时 ${s.history[0].toFixed(2)}` : "越低猜得越准"}</small>
        </div>
        <div>
          <dt>训练时间</dt>
          <dd>{sec.toFixed(1)} 秒</dd>
          <small>{sec > 0.5 ? `每秒 ${Math.round(step / sec)} 步` : "在手机里计算"}</small>
        </div>
        <div>
          <dt>读完数据的遍数</dt>
          <dd>{epochs.toFixed(0)} 遍</dd>
          <small>每次 {MINI.batch} 段 × {MINI.T} 个词元</small>
        </div>
      </dl>

      {s && <Chart s={s} />}

      {s && (
        <>
          <h4 className="p11-h4">生成日记（温度 0.8）</h4>
          <ol className="p11-diary">
            {[...s.diary].reverse().slice(0, 12).map((d, i) => (
              <li key={s.diary.length - i}>
                <span className="p11-diary-step num">
                  第 {fmt(d.step)} 步 · 损失 {d.loss.toFixed(2)}
                </span>
                <span className="p11-diary-text">{d.text || "（直接换行）"}</span>
                {lineSet.has(d.text) && <span className="p11-badge">背下来的句子</span>}
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
              {ok ? "✓" : "○"} 损失降到 {t} 以下
            </li>
          );
        })}
        <li data-done={!!s && s.diary.some((d) => lineSet.has(d.text))}>
          {s && s.diary.some((d) => lineSet.has(d.text)) ? "✓" : "○"} 原样写出数据里的句子（开始背了！）
        </li>
      </ul>
      <p className="lab-tip">{tip}</p>

      <details className="p11-arch">
        <summary>这个迷你 GPT 的设计表</summary>
        {s ? (
          <ul>
            <li>
              词元嵌入 {fmt(V)}×{MINI.d} + 位置嵌入 {MINI.T}×{MINI.d}（第 33、36 章）
            </li>
            <li>Transformer 块 1 层：层归一化 → 遮住未来的自注意力头 1 个 → 残差连接（第 45～51、56～57 章）</li>
            <li>
              → 层归一化 → 前馈网络 {MINI.d}→{MINI.h}→{MINI.d}（GELU）→ 残差连接（第 55 章）
            </li>
            <li>层归一化 → {fmt(V)} 种词元的分数 → Softmax（第 60、14 章）。输出用的旋钮和词元嵌入共用。</li>
            <li>损失：交叉熵（第 65 章）· 下坡：Adam（第 67 章），每一步 {MINI.batch} 段</li>
          </ul>
        ) : (
          <p>开始训练后就能看到。</p>
        )}
      </details>
    </div>
  );
}
