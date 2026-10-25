// ja overlay of src/playgrounds/part4/NgramWriter.tsx (strings only)
import { useState } from "react";
import { CORPUS, END, START, TOKENS, followers } from "../../../../data/ch38";
import "../../../../playgrounds/part4/style.css";

type Mode = 2 | 3;
type Made = { s: string; mode: Mode; novel: boolean };
const MAX_TOKENS = 16;

const contextOf = (toks: string[], mode: Mode) => (mode === 2 || toks.length < 2 ? toks.slice(-1) : toks.slice(-2));

function sampleNext(toks: string[], mode: Mode) {
  const opts = followers(contextOf(toks, mode));
  let r = Math.random();
  for (const o of opts) {
    r -= o.p;
    if (r <= 0) return o.w;
  }
  return opts[opts.length - 1].w;
}

const hasSeq = (t: string[], seq: string[]) => t.some((_, i) => i + seq.length <= t.length && seq.every((w, k) => t[i + k] === w));

export function NgramWriter() {
  const [mode, setMode] = useState<Mode>(2);
  const [toks, setToks] = useState<string[]>([START]);
  const [made, setMade] = useState<Made[]>([]);
  const done = toks[toks.length - 1] === END;
  const ctx = contextOf(toks, mode);
  const opts = done ? [] : followers(ctx);
  const sentence = toks.slice(1, done ? -1 : undefined).join(" ");
  const corpusIdx = done ? CORPUS.indexOf(sentence) : -1;

  const finish = (t: string[]) => {
    setToks(t);
    if (t[t.length - 1] === END) {
      const s = t.slice(1, -1).join(" ");
      setMade((m) => [...m, { s, mode, novel: !CORPUS.includes(s) }]);
    }
  };
  const push = (w: string) => finish([...toks, w]);
  const auto = () => {
    const t = [...toks];
    while (t[t.length - 1] !== END && t.length < MAX_TOKENS) t.push(sampleNext(t, mode));
    finish(t);
  };
  const switchMode = (m: Mode) => {
    setMode(m);
    setToks([START]);
  };

  const novel2 = new Set(made.filter((m) => m.mode === 2 && m.novel).map((m) => m.s)).size;
  const made3 = made.filter((m) => m.mode === 3);
  const missions = [
    { label: `コーパスになかった新しい文を3つ作る (いま${Math.min(novel2, 3)}つ)`, done: novel2 >= 3 },
    { label: "「昨日」が入っているのに「行く」や「寝る」で終わる、おかしな文を作る", done: made.some((m) => m.s.includes("昨日") && /(行く|寝る)$/.test(m.s)) },
    { label: "「直前の2語を見る」に切りかえて、文を3つ作る", done: made3.length >= 3 },
  ];

  let tip: string;
  if (!done && toks.length === 1) tip = mode === 2 ? "〈はじめ〉の次にどの語が何回来たかを数えた表です。1つえらんでみましょう。" : "今度は直前の2語を見て数えます。候補がどれだけ減るか見てみましょう。";
  else if (!done) tip = `いまは「${ctx.join(" ")}」のすぐ次に来た語だけを数えています。それより前は見ていません。`;
  else if (mode === 3 && corpusIdx >= 0) tip = "直前の2語を見たら、コーパスの文をそのまま書き写しました。コーパスが小さいので、2語の並びのあとに来る候補がほとんど1つしかないのです。";
  else if (corpusIdx >= 0) tip = "コーパスにあった文を、そのまま書きました。もう一度作ってみましょう。";
  else if (sentence.includes("昨日") && /(行く|寝る)$/.test(sentence)) tip = "「昨日」なのに「行く」？ 直前の語しか見ないので、文の前のほうの「昨日」を忘れてしまいました。";
  else tip = "コーパスになかった新しい文です！ ペアはどれもコーパスで見たものなのに、つなげたら新しい文になりました。";

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="直前の何語を見るか">
        <button aria-pressed={mode === 2} onClick={() => switchMode(2)}>
          直前の1語を見る (2-gram)
        </button>
        <button aria-pressed={mode === 3} onClick={() => switchMode(3)}>
          直前の2語を見る (3-gram)
        </button>
      </div>

      <div className="p4-sentence" style={{ marginTop: 14 }} aria-live="polite" aria-label="作った文">
        {toks.map((w, i) => (
          <span key={i} className={`chip ${w === START ? "p4-start" : w === END ? "p4-end" : !done && i >= toks.length - ctx.length ? "hl-sky" : "hl-mint"}`}>
            {w}
          </span>
        ))}
        {!done && <span className="p4-blank">?</span>}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="次の語の候補">
          {opts.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => push(o.w)} aria-label={`${o.w}、${o.c}回、${Math.round(o.p * 100)}%`}>
              <span>
                {o.w}
                <span className="count">{o.c}回</span>
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${o.p * 100}%`, background: o.w === END ? "var(--ink-2)" : "var(--hl-yellow)" }} />
              </span>
              <span className="val">{Math.round(o.p * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {done && <p className="p4-verdict">{corpusIdx >= 0 ? `コーパスの${corpusIdx + 1}番目の文そのままです。` : "コーパスになかった新しい文！"}</p>}

      <div className="lab-actions">
        {!done && (
          <>
            <button className="btn" onClick={() => push(sampleNext(toks, mode))}>
              確率どおりに引く
            </button>
            <button className="btn ghost" onClick={auto}>
              最後まで自動
            </button>
          </>
        )}
        <button className={done ? "btn" : "btn ghost"} onClick={() => setToks([START])}>
          {done ? "新しい文を作る" : "最初から"}
        </button>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m) => (
          <li key={m.label} data-done={m.done}>
            {m.done ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>

      {made.length > 0 && (
        <div className="p4-records">
          <h4>作った文 (最近の5つ)</h4>
          <ol>
            {made
              .slice(-5)
              .reverse()
              .map((m, i) => (
                <li key={made.length - i}>
                  <span className="n">{made.length - i}</span>
                  <span>{m.s}</span>
                  <span className="v">
                    {m.novel ? "新しい文" : "もとの文"} · {m.mode}-gram
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>

      <details className="p4-corpus">
        <summary>コーパスの24文を見る (いま数えている場所を表示)</summary>
        <ol>
          {CORPUS.map((s, i) => (
            <li key={s} data-hit={!done && hasSeq(TOKENS[i], ctx)}>
              {s}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
