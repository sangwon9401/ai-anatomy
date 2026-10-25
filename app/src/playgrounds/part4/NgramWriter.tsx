import { useState } from "react";
import { CORPUS, END, START, TOKENS, followers } from "../../data/ch38";
import "./style.css";

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
    { label: `말뭉치에 없던 새 문장 3개 만들기 (지금 ${Math.min(novel2, 3)}개)`, done: novel2 >= 3 },
    { label: "'어제'가 들어갔는데 '간다'나 '잔다'로 끝나는 엉뚱한 문장 만들기", done: made.some((m) => m.s.includes("어제") && /(간다|잔다)$/.test(m.s)) },
    { label: "'앞 2단어 보기'로 바꿔서 문장 3개 지어 보기", done: made3.length >= 3 },
  ];

  let tip: string;
  if (!done && toks.length === 1) tip = mode === 2 ? "〈시작〉 다음에 어떤 단어가 몇 번 왔는지 세어 둔 표예요. 하나 골라 보세요." : "이번엔 앞 2단어를 보고 세요. 후보가 얼마나 줄어드는지 보세요.";
  else if (!done) tip = `지금은 '${ctx.join(" ")}' 바로 다음에 온 단어만 세고 있어요. 그보다 앞은 보지 않아요.`;
  else if (mode === 3 && corpusIdx >= 0) tip = "앞 2단어를 보니 말뭉치 문장을 그대로 따라 썼어요. 말뭉치가 작아서, 두 단어 줄 뒤에 올 후보가 거의 하나뿐이거든요.";
  else if (corpusIdx >= 0) tip = "말뭉치에 있던 문장을 그대로 다시 썼어요. 한 번 더 지어 보세요.";
  else if (sentence.includes("어제") && /(간다|잔다)$/.test(sentence)) tip = "'어제'인데 '간다'? 바로 앞 단어만 보니, 문장 앞쪽의 '어제'를 잊어버렸어요.";
  else tip = "말뭉치에 없던 새 문장이에요! 짝은 하나하나 말뭉치에서 본 것들인데, 이어 붙이니 새 문장이 됐어요.";

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="앞 몇 단어를 볼까">
        <button aria-pressed={mode === 2} onClick={() => switchMode(2)}>
          앞 1단어 보기 (2-gram)
        </button>
        <button aria-pressed={mode === 3} onClick={() => switchMode(3)}>
          앞 2단어 보기 (3-gram)
        </button>
      </div>

      <div className="p4-sentence" style={{ marginTop: 14 }} aria-live="polite" aria-label="지은 문장">
        {toks.map((w, i) => (
          <span key={i} className={`chip ${w === START ? "p4-start" : w === END ? "p4-end" : !done && i >= toks.length - ctx.length ? "hl-sky" : "hl-mint"}`}>
            {w}
          </span>
        ))}
        {!done && <span className="p4-blank">?</span>}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="다음 단어 후보">
          {opts.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => push(o.w)} aria-label={`${o.w}, ${o.c}번, ${Math.round(o.p * 100)}%`}>
              <span>
                {o.w}
                <span className="count">{o.c}번</span>
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${o.p * 100}%`, background: o.w === END ? "var(--ink-2)" : "var(--hl-yellow)" }} />
              </span>
              <span className="val">{Math.round(o.p * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {done && <p className="p4-verdict">{corpusIdx >= 0 ? `말뭉치 ${corpusIdx + 1}번째 문장 그대로예요.` : "말뭉치에 없던 새 문장!"}</p>}

      <div className="lab-actions">
        {!done && (
          <>
            <button className="btn" onClick={() => push(sampleNext(toks, mode))}>
              확률대로 뽑기
            </button>
            <button className="btn ghost" onClick={auto}>
              끝까지 자동
            </button>
          </>
        )}
        <button className={done ? "btn" : "btn ghost"} onClick={() => setToks([START])}>
          {done ? "새 문장 짓기" : "처음부터"}
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
          <h4>지은 문장 (최근 5개)</h4>
          <ol>
            {made
              .slice(-5)
              .reverse()
              .map((m, i) => (
                <li key={made.length - i}>
                  <span className="n">{made.length - i}</span>
                  <span>{m.s}</span>
                  <span className="v">
                    {m.novel ? "새 문장" : "원래 문장"} · {m.mode}-gram
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>

      <details className="p4-corpus">
        <summary>말뭉치 24문장 보기 (지금 세는 곳 표시)</summary>
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
