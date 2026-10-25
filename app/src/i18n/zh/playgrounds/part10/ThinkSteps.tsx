import { useState } from "react";
import { PROBLEMS } from "../../../../data/ch87";
import "../../../../playgrounds/part10/style.css";

const chars = (s: string) => [...s.replace(/\s/g, "")].length;
/** Korean subject particle after a word; Chinese needs none, so it returns "". */
const iGa = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? "" : "";
};

export function ThinkSteps() {
  const [pi, setPi] = useState(0);
  const [mine, setMine] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [shown, setShown] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const p = PROBLEMS[pi];
  const done = shown >= p.steps.length;
  const fastChars = chars(`答：${p.fast}`);
  const slowChars = p.steps.reduce((a, s) => a + chars(s), 0) + chars(`答：${p.answer}`);

  const choose = (i: number) => {
    setPi(i);
    setMine(null);
    setFast(false);
    setShown(0);
  };
  const next = () => {
    const n = shown + 1;
    setShown(n);
    if (n >= p.steps.length && !solved.includes(p.key)) setSolved([...solved, p.key]);
  };

  const tip =
    mine === null
      ? "先选出你自己的答案。凭第一感觉，要快！"
      : !done
        ? shown > 0
          ? "每写一行，模型都会重读前面写好的行。继续按下去。"
          : fast
            ? "直接写的答案看着像样，验算却过不了关。这次让它一行一行地解。"
            : "现在用两种方法让模型来做。"
        : mine === p.answer
          ? `一上来就答对了！写出解题过程，还能说明为什么是“${p.answer}”。`
          : `我的第一个答案是“${mine}”，解完后得出的是“${p.answer}”${iGa(p.answer)}。${mine === p.fast ? "第一反应的答案正是陷阱！" : "写出过程，就能看出是在哪里走岔的。"}`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="选择题目">
        {PROBLEMS.map((q, i) => (
          <button key={q.key} className="p10-seg" aria-pressed={pi === i} onClick={() => choose(i)}>
            {solved.includes(q.key) ? "✓ " : ""}
            {q.title}
          </button>
        ))}
      </div>
      <p className="p10-q">{p.q}</p>

      <h4 className="p10-h">① 先写我的答案（要快！）</h4>
      <div className="p10-choices" role="group" aria-label="我的答案">
        {p.choices.map((c) => (
          <button key={c} aria-pressed={mine === c} onClick={() => setMine(c)}>
            {c}
          </button>
        ))}
      </div>

      <h4 className="p10-h">② 让模型来做</h4>
      <div className="p10-duo">
        <section className="p10-panel">
          <h5>直接答</h5>
          <button className="btn ghost" disabled={mine === null || fast} onClick={() => setFast(true)}>
            “只写答案就行”
          </button>
          {fast && (
            <>
              <p className="p10-line">
                <span className="chip hl-pink">答：{p.fast}</span>
              </p>
              <p className="p10-line bad">{p.fastCheck}</p>
              <p className="lab-sum">写了 {fastChars} 个字 · 示意例子</p>
            </>
          )}
        </section>
        <section className="p10-panel">
          <h5>解完再答</h5>
          <button className="btn" disabled={mine === null || done} onClick={next}>
            {shown === 0 ? "“我们一步一步来解”" : "再写一行"}
          </button>
          <ol className="p10-think" aria-live="polite">
            {p.steps.slice(0, shown).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {done && (
            <>
              <p className="p10-line">
                <span className="chip hl-mint">答：{p.answer}</span>
              </p>
              <p className="lab-sum">
                写了 {slowChars} 个字 · 约是直接答的 {Math.round(slowChars / fastChars)} 倍
              </p>
            </>
          )}
        </section>
      </div>
      {done && (
        <p className="lab-sum">
          写的字越多，模型就要运行越多次（第 2 章）。这要花时间，但能把难算的部分一行一行拆开来做。
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {PROBLEMS.map((q) => (
          <li key={q.key} data-done={solved.includes(q.key)}>
            {solved.includes(q.key) ? "✓" : "○"} 解出“{q.title}”
          </li>
        ))}
      </ul>
      <p className="lab-tip">{solved.length === PROBLEMS.length && done ? "三道题都解出来了！三道题里“第一反应的答案”都是陷阱。所以重要的题目要写出过程，再验算。" : tip}</p>
      <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
        模型的“直接答”是为了讲解编的例子。真正的大模型有时也能答对这些有名的题。
      </p>
    </div>
  );
}
