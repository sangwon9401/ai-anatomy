import { useState } from "react";
import { SENT, explain, visible } from "../../../../data/ch59";
import "../../../../playgrounds/part6/style.css";

type Mode = "bert" | "gpt";

/** 59장: which words can BERT and GPT see when they guess one word? */
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
      <div className="p6-seg" role="group" aria-label="モデルを選ぶ">
        <button aria-pressed={mode === "bert"} onClick={() => pick("bert", target)}>
          BERT：空欄を当てる
        </button>
        <button aria-pressed={mode === "gpt"} onClick={() => pick("gpt", target)}>
          GPT：次の言葉を当てる
        </button>
      </div>

      <p className="p6-label">当てたい単語を押してみよう</p>
      <div className="p6-sent" role="group" aria-label="文">
        {SENT.map((w, i) => {
          const state = i === target ? "target" : seen.includes(i) ? "seen" : "hidden";
          return (
            <button key={w} data-state={state} aria-pressed={i === target} aria-label={`${w}${i === target ? "（当てる単語）" : state === "hidden" ? "（隠れている）" : ""}`} onClick={() => pick(mode, i)}>
              {state === "target" ? "?" : w}
            </button>
          );
        })}
      </div>
      <p className="p6-msg2">{explain(mode, target)}</p>

      <p className="p6-label">アテンションの表（横の行：見る側の単語、縦の列：見える単語）</p>
      <div className="p6-grid" role="img" aria-label={mode === "bert" ? "全部のマスが開いた表" : "対角線から下だけが開いた表"}>
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
      <p className="p6-note">{mode === "bert" ? "BERTは全部のマスが開いています。前も後ろも全部見ます。" : "GPTは対角線とその下だけが開いています。未来のマスは目かくしで隠します（第51章）。"}</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.bert2}>{done.bert2 ? "✓" : "○"} BERTで「学校に」を当てる</li>
        <li data-done={done.gpt2}>{done.gpt2 ? "✓" : "○"} GPTで同じ「学校に」を当てる</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} GPTで「行く」を当てる</li>
      </ul>
      <p className="lab-tip">
        {done.bert2 && done.gpt2 && done.gpt3
          ? "BERTは空欄うめに、GPTは一語ずつ書き続けるのに向いています。ChatGPTはGPTのほうです！"
          : "同じ単語でも、BERTとGPTでは見える単語がちがいます。モードを切りかえて比べてみましょう。"}
      </p>
    </div>
  );
}
