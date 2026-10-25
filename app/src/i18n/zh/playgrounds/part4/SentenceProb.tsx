// zh overlay of src/playgrounds/part4/SentenceProb.tsx (strings only; 万/亿 work the same way in Chinese)
import { useState } from "react";
import { LM_COLORS, fmtPct, nextProbs, sentenceProb } from "../../../../data/ch37";
import "../../../../playgrounds/part4/style.css";

const LEN = 4;
const BEST = "我 今天 去 学校";

/** "约 385 次里有 1 次" style count, with 万/亿 units for big numbers. */
function oneIn(p: number) {
  const n = Math.round(1 / p);
  if (n < 10_000) return `约 ${n.toLocaleString("zh-CN")} 次里有 1 次`;
  if (n < 100_000_000) return `约 ${Math.round(n / 10_000).toLocaleString("zh-CN")} 万次里有 1 次`;
  return `约 ${Math.round(n / 100_000_000).toLocaleString("zh-CN")} 亿次里有 1 次`;
}

type Rec = { s: string; p: number };

export function SentenceProb() {
  const [words, setWords] = useState<string[]>([]);
  const [records, setRecords] = useState<Rec[]>([]);
  const done = words.length === LEN;
  const { options, rest } = nextProbs(words);
  const { p, factors } = sentenceProb(words);
  const text = words.join(" ");

  const add = (w: string) => {
    const next = [...words, w];
    setWords(next);
    if (next.length === LEN) {
      const s = next.join(" ");
      const pr = sentenceProb(next).p;
      setRecords((r) => (r.some((x) => x.s === s) ? r : [...r, { s, p: pr }].sort((a, b) => b.p - a.p)));
    }
  };

  const missions = [
    { label: "找出概率最高的句子", done: records.some((r) => r.s === BEST) },
    { label: "用同样的词、只换顺序，再拼出一句超过 0.1% 的句子", done: records.some((r) => r.s !== BEST && r.p >= 0.001) },
    { label: "看看带“披萨”的句子的概率", done: records.some((r) => r.s.includes("披萨")) },
  ];

  let tip: string;
  if (!done && words.length === 0) tip = "先选第一个词。条越长，这个词越常出现在这个位置。";
  else if (!done) tip = `已经到“${words[words.length - 1]}”了。下一个候选词的概率，要看前面全部 ${words.length} 个词来决定。`;
  else if (text === BEST) tip = "这是第 1 名的句子！每个词的概率都高，乘起来也最大。";
  else if (text.includes("披萨")) tip = "“披萨”一插进来，概率一下子就小了。只要有一个词别扭，乘出来的整体就会变小。";
  else if (p >= 0.001) tip = "很自然的顺序。“今天我去学校”和“我今天去学校”都说得通，不过比第 1 名还是低一点。";
  else if (p < 0.00001) tip = "顺序很别扭，每个词的概率都低，乘起来就变得非常非常小。";
  else tip = "能说得通，但不是常见的顺序，所以概率低。";

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="拼出的句子">
        {words.map((w) => (
          <span key={w} className={`chip hl-${LM_COLORS[w]}`}>
            {w}
          </span>
        ))}
        {Array.from({ length: LEN - words.length }, (_, i) => (
          <span key={i} className="p4-blank">
            {i === 0 ? "?" : ""}
          </span>
        ))}
      </div>

      {!done && (
        <div className="p4-opts" role="group" aria-label="下一个词的候选">
          {options.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => add(o.w)} aria-label={`${o.w}, ${fmtPct(o.p)}`}>
              <span>{o.w}</span>
              <span className="track">
                <span className="fill" style={{ width: `${Math.max(o.p * 100, 1)}%`, background: `var(--hl-${LM_COLORS[o.w]})` }} />
              </span>
              <span className="val">{fmtPct(o.p)}</span>
            </button>
          ))}
          <div className="p4-opt p4-rest" aria-label={`其他所有词，${fmtPct(rest)}`}>
            <span>其他词</span>
            <span className="track">
              <span className="fill" style={{ width: `${rest * 100}%`, background: "var(--line)" }} />
            </span>
            <span className="val">{fmtPct(rest)}</span>
          </div>
        </div>
      )}

      <p className="p4-product" aria-live="polite">
        {words.length === 0 ? (
          "句子的概率 =（所选词的概率依次相乘）"
        ) : (
          <>
            {factors.map((f, i) => (
              <span key={i}>
                {i > 0 && <span className="p4-x">×</span>}
                {fmtPct(f)}
              </span>
            ))}
            <span className="p4-x">=</span>
            <b>{fmtPct(p)}</b>
          </>
        )}
      </p>
      {done && (
        <p className="p4-result">
          “{text}”的概率是 <b>{fmtPct(p)}</b>。四个词的句子里，{oneIn(p)}。
        </p>
      )}

      <div className="lab-actions">
        {done ? (
          <button className="btn" onClick={() => setWords([])}>
            拼一个新句子
          </button>
        ) : (
          <button className="btn ghost" disabled={words.length === 0} onClick={() => setWords(words.slice(0, -1))}>
            删掉一个词
          </button>
        )}
        {records.length > 0 && (
          <button
            className="btn ghost"
            onClick={() => {
              setWords([]);
              setRecords([]);
            }}
          >
            清空记录
          </button>
        )}
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m) => (
          <li key={m.label} data-done={m.done}>
            {m.done ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>

      {records.length > 0 && (
        <div className="p4-records">
          <h4>我拼出的句子（按概率从高到低）</h4>
          <ol>
            {records.slice(0, 6).map((r, i) => (
              <li key={r.s} data-now={done && r.s === text}>
                <span className="n">{i + 1}</span>
                <span>{r.s}</span>
                <span className="v">{fmtPct(r.p)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* 概率是示意数据。真正的语言模型要给几万个候选词打概率。</p>
    </div>
  );
}
