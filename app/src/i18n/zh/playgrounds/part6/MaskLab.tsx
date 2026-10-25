import { useState } from "react";
import { SENT, explain, visible } from "../../../../data/ch59";
import "../../../../playgrounds/part6/style.css";

type Mode = "bert" | "gpt";

/** 第 59 章: which words can BERT and GPT see when they guess one word? */
export function MaskLab() {
  const [mode, setMode] = useState<Mode>("bert");
  const [target, setTarget] = useState(3);
  const [done, setDone] = useState({ bert2: false, gpt2: false, gpt3: false });
  const seen = visible(mode, target);

  const pick = (m: Mode, t: number) => {
    setMode(m);
    setTarget(t);
    setDone((d) => ({ bert2: d.bert2 || (m === "bert" && t === 2), gpt2: d.gpt2 || (m === "gpt" && t === 2), gpt3: d.gpt3 || (m === "gpt" && t === 3) }));
  };

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="选择模型">
        <button aria-pressed={mode === "bert"} onClick={() => pick("bert", target)}>
          BERT：填空
        </button>
        <button aria-pressed={mode === "gpt"} onClick={() => pick("gpt", target)}>
          GPT：猜下一个词
        </button>
      </div>

      <p className="p6-label">点一个要猜的词</p>
      <div className="p6-sent" role="group" aria-label="句子">
        {SENT.map((w, i) => {
          const state = i === target ? "target" : seen.includes(i) ? "seen" : "hidden";
          return (
            <button key={w} data-state={state} aria-pressed={i === target} aria-label={`${w}${i === target ? "（要猜的词）" : state === "hidden" ? "（被挡住）" : ""}`} onClick={() => pick(mode, i)}>
              {state === "target" ? "?" : w}
            </button>
          );
        })}
      </div>
      <p className="p6-msg2">{explain(mode, target)}</p>

      <p className="p6-label">注意力表格（横行：在看的词，竖列：被看到的词）</p>
      <div className="p6-grid" role="img" aria-label={mode === "bert" ? "所有格子都打开的表格" : "只有对角线及以下打开的表格"}>
        <span />
        {SENT.map((w) => (
          <span key={`c${w}`} className="h">
            {w}
          </span>
        ))}
        {SENT.map((w, i) => (
          <div key={`r${w}`} style={{ display: "contents" }}>
            <span className="h r">{w}</span>
            {SENT.map((_, j) => (
              <span key={j} className="cell" data-open={mode === "bert" || j <= i} data-mode={mode} />
            ))}
          </div>
        ))}
      </div>
      <p className="p6-note">{mode === "bert" ? "BERT 的格子全部打开，前后都能看。" : "GPT 只打开对角线和它下面的格子。未来的格子被帘子挡住（第 51 章）。"}</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.bert2}>{done.bert2 ? "✓" : "○"} 用 BERT 猜“去”</li>
        <li data-done={done.gpt2}>{done.gpt2 ? "✓" : "○"} 用 GPT 猜同一个“去”</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} 用 GPT 猜“学校”</li>
      </ul>
      <p className="lab-tip">
        {done.bert2 && done.gpt2 && done.gpt3
          ? "BERT 适合填空，GPT 适合一个词一个词往下写。ChatGPT 属于 GPT 这一边！"
          : "猜同一个词时，BERT 和 GPT 能看到的词不一样。切换模式比较一下吧。"}
      </p>
    </div>
  );
}
