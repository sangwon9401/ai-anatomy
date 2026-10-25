import { useState } from "react";
import { SENT, explain, visible } from "../../../../data/ch59";
import "../../../../playgrounds/part6/style.css";

type Mode = "bert" | "gpt";

/** ch. 59: which words can BERT and GPT see when they guess one word? */
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
      <div className="p6-seg" role="group" aria-label="Choose a model">
        <button aria-pressed={mode === "bert"} onClick={() => pick("bert", target)}>
          BERT: fill in the blank
        </button>
        <button aria-pressed={mode === "gpt"} onClick={() => pick("gpt", target)}>
          GPT: guess the next word
        </button>
      </div>

      <p className="p6-label">Tap the word to guess</p>
      <div className="p6-sent" role="group" aria-label="Sentence">
        {SENT.map((w, i) => {
          const state = i === target ? "target" : seen.includes(i) ? "seen" : "hidden";
          return (
            <button key={w} data-state={state} aria-pressed={i === target} aria-label={`${w}${i === target ? " (word to guess)" : state === "hidden" ? " (hidden)" : ""}`} onClick={() => pick(mode, i)}>
              {state === "target" ? "?" : w}
            </button>
          );
        })}
      </div>
      <p className="p6-msg2">{explain(mode, target)}</p>

      <p className="p6-label">Attention table (rows: the word looking, columns: the words it can see)</p>
      <div className="p6-grid" role="img" aria-label={mode === "bert" ? "Table with every cell open" : "Table open only on and below the diagonal"}>
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
      <p className="p6-note">{mode === "bert" ? "For BERT, every cell is open. It sees both before and after." : "For GPT, only the diagonal and below are open. Future cells are covered by the mask (ch. 51)."}</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.bert2}>{done.bert2 ? "✓" : "○"} Guess 'to' with BERT</li>
        <li data-done={done.gpt2}>{done.gpt2 ? "✓" : "○"} Guess the same 'to' with GPT</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} Guess 'school' with GPT</li>
      </ul>
      <p className="lab-tip">
        {done.bert2 && done.gpt2 && done.gpt3
          ? "BERT suits filling in blanks; GPT suits writing on one word at a time. ChatGPT is on the GPT side!"
          : "Even for the same word, BERT and GPT can see different words. Switch modes and compare."}
      </p>
    </div>
  );
}
