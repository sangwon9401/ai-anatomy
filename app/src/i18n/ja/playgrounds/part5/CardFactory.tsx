// ja overlay of src/playgrounds/part5/CardFactory.tsx (strings only)
import { useState } from "react";
import { FOCUS, K, W_K, W_Q, W_V, WORDS, X, apply, dot, fmt, fmtVec, type M2, type V2 } from "../../../../data/part5-toy";
import "../../../../playgrounds/part5/style.css";

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

/** ch46: each word's Q, K, V = matrix × word vector; changing W_Q changes whom '行く' picks. */
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

  let tip = "Qの行列の数を変えて、「私は」が1位になるようにしてみましょう。";
  if (won[0] && !won[1]) tip = "いいですね！ 今度は「今日」を1位にしてみましょう。マイナスの数も使ってみましょう。";
  if (won[0] && won[1]) tip = "行列の数を変えただけなのに、「行く」がえらぶ語が変わりましたね。学習とは、この数をちょうどよく直していくことです。";
  if (leader < 0) tip = "いまは同点の1位です。数をもう少し変えてみましょう。";

  return (
    <div>
      <div className="p5-words" role="group" aria-label="語をえらぶ">
        {WORDS.map((w, i) => (
          <button key={w} aria-pressed={sel === i} onClick={() => setSel(i)}>
            {w}
          </button>
        ))}
      </div>
      <p className="p5-note">
        「{WORDS[sel]}」の語のベクトル x = <span className="p5-vec">{fmtVec(x)}</span>
        <span className="p5-ex">説明用の例</span>
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
        <h4 style={{ margin: 0, fontSize: 15 }}>Qを作る行列を変える</h4>
        <div className="p5-matrow">
          <div className="p5-mat" role="group" aria-label="Qを作る行列">
            {wq.map((v, i) => (
              <span className="p5-step" key={i}>
                <button onClick={() => bump(i, -1)} disabled={v <= LO} aria-label={`${Math.floor(i / 2) + 1}行${(i % 2) + 1}列を減らす`}>
                  −
                </button>
                <b>{fmt(v)}</b>
                <button onClick={() => bump(i, 1)} disabled={v >= HI} aria-label={`${Math.floor(i / 2) + 1}行${(i % 2) + 1}列をふやす`}>
                  +
                </button>
              </span>
            ))}
          </div>
          <span className="p5-vec">
            「行く」のQ = <b>{fmtVec(q)}</b>
          </span>
        </div>
        <p className="p5-note" style={{ marginTop: 4 }}>「行く」の質問と、各語のラベル(K)が合う度合い (計算のしかたは第47章で)</p>
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
          <li data-done={won[0]}>{won[0] ? "○" : "□"} 「私は」を1位に</li>
          <li data-done={won[1]}>{won[1] ? "○" : "□"} 「今日」を1位に</li>
        </ul>
      </div>
      <div className="lab-actions">
        <button className="btn ghost" onClick={() => setWq(W_Q)} disabled={!changed}>
          最初の数にもどす
        </button>
      </div>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
