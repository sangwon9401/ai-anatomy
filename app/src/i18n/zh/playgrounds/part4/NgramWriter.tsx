// zh overlay of src/playgrounds/part4/NgramWriter.tsx: strings, and the 'odd sentence' mission checks for a cat doing
// homework / playing football (Chinese has no tense to mismatch, unlike the Korean 어제 … 간다).
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
    { label: `造出 3 句语料库里没有的新句子（现在 ${Math.min(novel2, 3)} 句）`, done: novel2 >= 3 },
    { label: "造一句离谱的句子：主角是“猫”，最后却是“足球”“作业”或“歌”", done: made.some((m) => m.s.startsWith("猫") && /(足球|作业|歌)$/.test(m.s)) },
    { label: "换成“看前 2 个词”，造 3 个句子", done: made3.length >= 3 },
  ];

  let tip: string;
  if (!done && toks.length === 1) tip = mode === 2 ? "这张表数好了〈开始〉后面出现过哪些词、各几次。选一个吧。" : "这次看前 2 个词来数。看看候选词少了多少。";
  else if (!done) tip = `现在只数紧跟在“${ctx.join(" ")}”后面的词，更前面的都不看。`;
  else if (mode === 3 && corpusIdx >= 0) tip = "看前 2 个词，结果照抄了语料库里的句子。语料库太小，两个词后面的候选几乎只有一个。";
  else if (corpusIdx >= 0) tip = "原样写出了语料库里的句子。再造一句试试。";
  else if (sentence.startsWith("猫") && /(足球|作业|歌)$/.test(sentence)) tip = "猫也会这个？只看前一个词，就忘了句子开头的主角是猫。";
  else tip = "这是语料库里没有的新句子！每一对搭配都在语料库里见过，接起来却成了新句子。";

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="看前面几个词">
        <button aria-pressed={mode === 2} onClick={() => switchMode(2)}>
          看前 1 个词（2-gram）
        </button>
        <button aria-pressed={mode === 3} onClick={() => switchMode(3)}>
          看前 2 个词（3-gram）
        </button>
      </div>

      <div className="p4-sentence" style={{ marginTop: 14 }} aria-live="polite" aria-label="造出的句子">
        {toks.map((w, i) => (
          <span key={i} className={`chip ${w === START ? "p4-start" : w === END ? "p4-end" : !done && i >= toks.length - ctx.length ? "hl-sky" : "hl-mint"}`}>
            {w}
          </span>
        ))}
        {!done && <span className="p4-blank">?</span>}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="下一个词的候选">
          {opts.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => push(o.w)} aria-label={`${o.w}，${o.c} 次，${Math.round(o.p * 100)}%`}>
              <span>
                {o.w}
                <span className="count">{o.c} 次</span>
              </span>
              <span className="track">
                <span className="fill" style={{ width: `${o.p * 100}%`, background: o.w === END ? "var(--ink-2)" : "var(--hl-yellow)" }} />
              </span>
              <span className="val">{Math.round(o.p * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {done && <p className="p4-verdict">{corpusIdx >= 0 ? `和语料库第 ${corpusIdx + 1} 句一模一样。` : "语料库里没有的新句子！"}</p>}

      <div className="lab-actions">
        {!done && (
          <>
            <button className="btn" onClick={() => push(sampleNext(toks, mode))}>
              按概率抽
            </button>
            <button className="btn ghost" onClick={auto}>
              自动造到结尾
            </button>
          </>
        )}
        <button className={done ? "btn" : "btn ghost"} onClick={() => setToks([START])}>
          {done ? "再造一句" : "从头开始"}
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
          <h4>造出的句子（最近 5 句）</h4>
          <ol>
            {made
              .slice(-5)
              .reverse()
              .map((m, i) => (
                <li key={made.length - i}>
                  <span className="n">{made.length - i}</span>
                  <span>{m.s}</span>
                  <span className="v">
                    {m.novel ? "新句子" : "原句"} · {m.mode}-gram
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>

      <details className="p4-corpus">
        <summary>看语料库的 24 句（标出正在数的地方）</summary>
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
