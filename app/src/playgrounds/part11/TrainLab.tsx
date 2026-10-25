import { useEffect, useReducer, useRef, useState } from "react";
import { corpusByKey } from "../../data/part11-corpus";
import { MINI, paramCount, trainStep } from "./minigpt";
import { getCorpus, getMerges, getSession, newSession, writeLine, type Session } from "./store";
import "./style.css";

// when the model writes a line into the diary on its own
const DIARY_AT = new Set([50, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000]);
const MAX_GOAL = 5000;
/** milliseconds of training per animation frame, so the page stays responsive */
const BUDGET = 12;
const fmt = (n: number) => n.toLocaleString("ko-KR");
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
    <svg className="p11-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`손실 그래프: ${fmt(s.model.step)}걸음, 손실 ${lossNow(s).toFixed(2)}`}>
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
        아무거나 찍기 {s.start.toFixed(2)}
      </text>
      <line x1={x0} y1={y0} x2={W - 8} y2={y0} stroke="var(--ink)" strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0} y2={8} stroke="var(--ink)" strokeWidth={1.5} />
      <polyline points={pts} fill="none" stroke="var(--pen)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(last * 10)} cy={Y(h[last])} r={3.5} fill="var(--pen)" />
      <text x={x0} y={H - 6} fontSize={10} fill="var(--ink-2)">
        0
      </text>
      <text x={W - 8} y={H - 6} textAnchor="end" fontSize={10} fill="var(--ink-2)">
        {fmt(maxStep)}걸음
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
  if (!s) tip = "'훈련 시작'을 눌러 보세요. 처음엔 손실이 아무거나 찍기 수준에서 출발해요.";
  else if (running && step < 100) tip = "지금은 아무 글자나 찍는 단계예요. 손실이 금방 떨어지기 시작해요.";
  else if (loss !== null && loss > 3) tip = "자주 나오는 글자와 띄어쓰기부터 배우는 중이에요.";
  else if (loss !== null && loss > 2) tip = "낱말이 하나둘 보이기 시작할 거예요. 생성 일기를 보세요.";
  else if (loss !== null && loss > 1.2) tip = "그럴듯한 줄이 나오기 시작해요. 데이터에 없는 새 조합도 보여요.";
  else tip = "손실이 아주 낮아졌어요. 이제는 데이터를 통째로 외운 줄(외운 문장)이 자주 나와요.";
  if (done) tip = s.goal >= MAX_GOAL ? `${fmt(step)}걸음 도착! 95장에서 이 모델로 글을 써 보세요.` : `목표 ${fmt(s.goal)}걸음 도착! 95장에서 이 모델로 글을 써 보세요. 더 훈련할 수도 있어요.`;

  return (
    <div>
      <div className="p11-setup">
        <span className="chip hl-yellow">{corpus.name}</span>
        <span className="chip hl-sky">{merges ? `BPE 병합 ${merges}번` : "글자 단위 토큰"}</span>
        {s && <span className="chip hl-mint">손잡이 {fmt(paramCount(s.model.cfg))}개</span>}
      </div>

      <div className="lab-actions">
        {!running ? (
          <button className="btn" onClick={done ? more : start} disabled={done && s.goal >= MAX_GOAL}>
            {!s ? "훈련 시작" : done ? "1,000걸음 더" : "이어서 훈련"}
          </button>
        ) : (
          <button className="btn" onClick={() => setRunning(false)}>
            잠깐 멈춤
          </button>
        )}
        <button className="btn ghost" onClick={writeNow} disabled={!s}>
          지금 한 줄 써 보기
        </button>
        <button className="btn ghost" onClick={restart} disabled={!s}>
          처음부터
        </button>
      </div>

      <dl className="p11-stats p11-stats4">
        <div>
          <dt>걸음</dt>
          <dd>{fmt(step)}</dd>
          <small>목표 {fmt(s?.goal ?? 2000)}</small>
        </div>
        <div>
          <dt>손실</dt>
          <dd>{loss === null ? "–" : loss.toFixed(2)}</dd>
          <small>{s ? `처음 ${s.history[0].toFixed(2)}` : "낮을수록 잘 맞힘"}</small>
        </div>
        <div>
          <dt>훈련 시간</dt>
          <dd>{sec.toFixed(1)}초</dd>
          <small>{sec > 0.5 ? `초당 ${Math.round(step / sec)}걸음` : "폰 안에서 계산"}</small>
        </div>
        <div>
          <dt>데이터 읽은 횟수</dt>
          <dd>{epochs.toFixed(0)}번</dd>
          <small>조각 {MINI.batch}개 × {MINI.T}토큰씩</small>
        </div>
      </dl>

      {s && <Chart s={s} />}

      {s && (
        <>
          <h4 className="p11-h4">생성 일기 (온도 0.8)</h4>
          <ol className="p11-diary">
            {[...s.diary].reverse().slice(0, 12).map((d, i) => (
              <li key={s.diary.length - i}>
                <span className="p11-diary-step num">
                  {fmt(d.step)}걸음 · 손실 {d.loss.toFixed(2)}
                </span>
                <span className="p11-diary-text">{d.text || "(바로 줄바꿈)"}</span>
                {lineSet.has(d.text) && <span className="p11-badge">외운 문장</span>}
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
              {ok ? "✓" : "○"} 손실 {t} 아래로
            </li>
          );
        })}
        <li data-done={!!s && s.diary.some((d) => lineSet.has(d.text))}>
          {s && s.diary.some((d) => lineSet.has(d.text)) ? "✓" : "○"} 데이터 속 문장을 그대로 써내기 (외우기 시작!)
        </li>
      </ul>
      <p className="lab-tip">{tip}</p>

      <details className="p11-arch">
        <summary>이 미니 GPT의 설계표</summary>
        {s ? (
          <ul>
            <li>
              토큰 임베딩 {fmt(V)}×{MINI.d} + 위치 임베딩 {MINI.T}×{MINI.d} (33장, 36장)
            </li>
            <li>트랜스포머 블록 1층: 층 정규화 → 미래를 가린 셀프 어텐션 헤드 1개 → 잔차 연결 (45~51장, 56~57장)</li>
            <li>
              → 층 정규화 → 피드포워드 {MINI.d}→{MINI.h}→{MINI.d} (GELU) → 잔차 연결 (55장)
            </li>
            <li>층 정규화 → 토큰 {fmt(V)}가지의 점수 → 소프트맥스 (60장, 14장). 출력 손잡이는 토큰 임베딩과 같이 써요.</li>
            <li>손실: 교차 엔트로피(65장) · 내리막: Adam(67장), 한 걸음에 조각 {MINI.batch}개</li>
          </ul>
        ) : (
          <p>훈련을 시작하면 보여요.</p>
        )}
      </details>
    </div>
  );
}
