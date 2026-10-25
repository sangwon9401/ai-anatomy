// zh overlay of src/playgrounds/part4/NoteRelay.tsx (strings; the word bank and the words it compares are the zh data's)
import { useState } from "react";
import { EMPTY, SLOTS, VERBS, WORD_VEC, predictVerb, rnnRun, type Note } from "../../../../data/ch40";
import "../../../../playgrounds/part4/style.css";

const BANK = ["昨天", "明天", "我", "小雨", "和朋友", "一起", "坐", "公交车"];
const MAX = 8;
const signed = (v: number) => (Math.abs(v) < 0.005 ? "0.00" : `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`);
/** cell colour: yellow for +, sky for −, stronger for bigger numbers */
const cellBg = (v: number) => `color-mix(in srgb, ${v >= 0 ? "var(--hl-yellow)" : "var(--hl-sky)"} ${Math.round(Math.abs(v) * 100)}%, var(--paper-2))`;

/** The note (쪽지) as an HTML card; handwriting fades with the size of each number. */
export function NoteCard({ note, label }: { note: Note; label: string }) {
  return (
    <div className="p4-notecard" aria-label={label}>
      {SLOTS.map((s, i) => (
        <div key={s} className="p4-noterow">
          <b>{s}</b>
          <span className="hand" style={{ opacity: note.gist[i] ? Math.max(0.08, Math.abs(note.h[i])) : 1 }}>
            {note.gist[i] || "·"}
          </span>
          <span className="num">{signed(note.h[i])}</span>
        </div>
      ))}
    </div>
  );
}

export function NoteRelay() {
  const [words, setWords] = useState<string[]>([]);
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const notes = rnnRun(words);
  const last = notes[notes.length - 1] ?? EMPTY;
  const prev = notes[notes.length - 2] ?? EMPTY;
  const probs = predictVerb(last.h);
  const best = probs.indexOf(Math.max(...probs));

  const set = (next: string[]) => {
    setWords(next);
    const n = rnnRun(next);
    const p = predictVerb((n[n.length - 1] ?? EMPTY).h);
    const top = p.indexOf(Math.max(...p));
    const now = [next.length > 0 && top === 0, next.length > 0 && top === 2, next[0] === "昨天" && next.length >= 3 && p[0] < 0.5];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  const missions = ["拼一句让“去了”排第 1 的句子", "拼一句让“要去”排第 1 的句子", "以“昨天”开头，却让“去了”掉到 50% 以下（第 41 章预告）"];

  let tip: string;
  if (words.length === 0) tip = "从空白纸条开始。选第一个词吧。";
  else {
    const w = words[words.length - 1];
    const wrote = (WORD_VEC[w] ?? [0, 0, 0]).findIndex((v) => v !== 0);
    const faded = prev.gist[0] && Math.abs(last.h[0]) < Math.abs(prev.h[0]) ? ` “时间”栏的“${prev.gist[0]}”从 ${signed(prev.h[0])} 变淡成了 ${signed(last.h[0])}。` : "";
    tip = wrote >= 0 ? `“${w}”写进了“${SLOTS[wrote]}”栏。${faded}` : `“${w}”没有新内容可写，只把旧内容乘 0.8 抄了过去。${faded}`;
  }

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="放进去的词">
        {words.length === 0 && <span className="p4-note" style={{ margin: 0 }}>从下面选词放进来。</span>}
        {words.map((w, i) => (
          <span key={i} className={`chip ${w === "昨天" ? "hl-mint" : w === "明天" ? "hl-sky" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>
      <div className="ctx-bank" role="group" aria-label="放词">
        {BANK.map((w) => (
          <button key={w} disabled={words.length >= MAX} onClick={() => set([...words, w])}>
            + {w}
          </button>
        ))}
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">现在的纸条（隐藏状态）</h4>
          <NoteCard note={last} label={`现在的纸条：${SLOTS.map((s, i) => `${s} ${signed(last.h[i])}`).join("，")}`} />
        </div>
        <div>
          <h4 className="p4-h4">用最后的纸条猜出的下一个词</h4>
          <div className="bars">
            {VERBS.map((v, i) => (
              <div className="bar-row" key={v.w}>
                <span className="label" style={{ fontWeight: i === best ? 700 : 400 }}>
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

      {words.length > 0 && (
        <div className="matrix-wrap" style={{ marginTop: 12 }}>
          <table className="matrix" aria-label="每个词改写后的纸条">
            <thead>
              <tr>
                <th scope="col" className="p4-th">
                  词
                </th>
                {SLOTS.map((s) => (
                  <th key={s} scope="col" className="p4-th">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notes.map((n, r) => (
                <tr key={r}>
                  <th scope="row" className="p4-th">
                    {words[r]}
                  </th>
                  {n.h.map((v, i) => (
                    <td key={i} style={{ background: cellBg(v), color: "var(--chip-ink)" }}>
                      {signed(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="lab-actions">
        <button className="btn ghost" disabled={words.length === 0} onClick={() => set(words.slice(0, -1))}>
          删掉一个词
        </button>
        <button className="btn ghost" disabled={words.length === 0} onClick={() => set([])}>
          从头开始
        </button>
      </div>

      <ul className="missions" style={{ marginTop: 14 }}>
        {missions.map((m, i) => (
          <li key={m} data-done={seen[i]}>
            {seen[i] ? "○" : "□"} {m}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p4-note">* 这是示意用的玩具 RNN。新纸条 = 压一压（0.8 × 旧纸条 + 现在的词）。真正的 RNN 纸条有几百个数字，每一栏的意思也不会这样清清楚楚。</p>
    </div>
  );
}
