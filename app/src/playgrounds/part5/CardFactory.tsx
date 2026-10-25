import { useState } from "react";
import { FOCUS, K, W_K, W_Q, W_V, WORDS, X, apply, dot, fmt, fmtVec, type M2, type V2 } from "../../data/part5-toy";
import "./style.css";

const LO = -3;
const HI = 3;

const calc = (m: M2, x: V2) =>
  [0, 1].map((r) => {
    const a = m[r * 2];
    const b = m[r * 2 + 1];
    const t = (c: number, v: number) => (c < 0 ? `(${fmt(c)})×${fmt(v)}` : `${fmt(c)}×${fmt(v)}`);
    return `${t(a, x[0])} + ${t(b, x[1])} = ${fmt(a * x[0] + b * x[1])}`;
  });

function MatrixView({ m }: { m: M2 }) {
  return (
    <span className="p5-mat p5-vec" aria-hidden="true">
      {m.map((v, i) => (
        <span key={i} style={{ textAlign: "right", minWidth: "1.6em" }}>
          {fmt(v)}
        </span>
      ))}
    </span>
  );
}

/** 46장: each word's Q, K, V = matrix × word vector; changing W_Q changes whom '간다' picks. */
export function CardFactory() {
  const [sel, setSel] = useState(FOCUS);
  const [wq, setWq] = useState<M2>(W_Q);
  const [won, setWon] = useState<boolean[]>([false, false, false, false]);

  const x = X[sel];
  const rows: { k: "Q" | "K" | "V"; m: M2; c: string }[] = [
    { k: "Q", m: wq, c: "var(--hl-yellow)" },
    { k: "K", m: W_K, c: "var(--hl-mint)" },
    { k: "V", m: W_V, c: "var(--hl-sky)" },
  ];

  const q = apply(wq, X[FOCUS]);
  const fit = K.map((k) => dot(q, k));
  const best = Math.max(...fit);
  const leaders = fit.map((f, i) => (f === best ? i : -1)).filter((i) => i >= 0);
  const leader = leaders.length === 1 ? leaders[0] : -1;
  const changed = wq.some((v, i) => v !== W_Q[i]);
  if (leader >= 0 && changed && !won[leader]) setWon((w) => w.map((d, i) => d || i === leader));
  const span = Math.max(4, ...fit.map(Math.abs));

  const bump = (i: number, d: number) => setWq((m) => m.map((v, j) => (j === i ? Math.max(LO, Math.min(HI, v + d)) : v)) as M2);

  let tip = "Q 행렬의 숫자를 바꿔 '나는'이 1등이 되게 해 보세요.";
  if (won[0] && !won[1]) tip = "좋아요! 이번엔 '오늘'이 1등이 되게 해 볼까요? 음수도 써 보세요.";
  if (won[0] && won[1]) tip = "행렬 숫자만 바꿨는데 '간다'가 고르는 단어가 바뀌었죠. 학습은 이 숫자들을 알맞게 고치는 일이에요.";
  if (leader < 0) tip = "지금은 공동 1등이에요. 숫자를 조금 더 바꿔 보세요.";

  return (
    <div>
      <div className="p5-words" role="group" aria-label="단어 고르기">
        {WORDS.map((w, i) => (
          <button key={w} aria-pressed={sel === i} onClick={() => setSel(i)}>
            {w}
          </button>
        ))}
      </div>
      <p className="p5-note">
        '{WORDS[sel]}'의 단어 벡터 x = <span className="p5-vec">{fmtVec(x)}</span>
        <span className="p5-ex">설명용 예시</span>
      </p>
      <div className="p5-cards">
        {rows.map((r) => {
          const out = apply(r.m, x);
          const [c1, c2] = calc(r.m, x);
          return (
            <div className="p5-card" key={r.k}>
              <b style={{ background: r.c }}>{r.k}</b>
              <span>
                <span className="p5-vec">
                  <MatrixView m={r.m} /> × {fmtVec(x)} = <b>{fmtVec(out)}</b>
                </span>
                <br />
                <span className="p5-vec muted" style={{ fontSize: 13 }}>
                  {c1} · {c2}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="lab-out">
        <h4 style={{ margin: 0, fontSize: 15 }}>Q를 만드는 행렬 바꾸기</h4>
        <div className="p5-matrow">
          <div className="p5-mat" role="group" aria-label="Q를 만드는 행렬">
            {wq.map((v, i) => (
              <span className="p5-step" key={i}>
                <button onClick={() => bump(i, -1)} disabled={v <= LO} aria-label={`${Math.floor(i / 2) + 1}행 ${(i % 2) + 1}열 줄이기`}>
                  −
                </button>
                <b>{fmt(v)}</b>
                <button onClick={() => bump(i, 1)} disabled={v >= HI} aria-label={`${Math.floor(i / 2) + 1}행 ${(i % 2) + 1}열 늘리기`}>
                  +
                </button>
              </span>
            ))}
          </div>
          <span className="p5-vec">
            '간다'의 Q = <b>{fmtVec(q)}</b>
          </span>
        </div>
        <p className="p5-note" style={{ marginTop: 4 }}>'간다'의 질문과 각 단어 라벨(K)이 맞는 정도 (계산법은 47장에서)</p>
        <div className="norm-bars p5-fit">
          {WORDS.map((w, i) => {
            const v = fit[i];
            const half = (Math.abs(v) / span) * 50;
            return (
              <div className="norm-row" key={w}>
                <span style={{ fontWeight: i === leader ? 700 : 400 }}>{w}</span>
                <span className="norm-track">
                  <span className="norm-mid" />
                  <span className="norm-fill" style={{ left: v >= 0 ? "50%" : `${50 - half}%`, width: `${half}%`, background: i === leader ? "var(--hl-yellow)" : "var(--ink-3)" }} />
                </span>
                <span className="val num">{fmt(v)}</span>
              </div>
            );
          })}
        </div>
        <ul className="missions">
          <li data-done={won[0]}>{won[0] ? "○" : "□"} '나는'이 1등이 되게</li>
          <li data-done={won[1]}>{won[1] ? "○" : "□"} '오늘'이 1등이 되게</li>
        </ul>
      </div>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setWq(W_Q)} disabled={!changed}>
          처음 숫자로
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
