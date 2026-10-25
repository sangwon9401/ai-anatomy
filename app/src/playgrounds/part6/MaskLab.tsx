import { useState } from "react";
import { SENT, explain, visible } from "../../data/ch59";
import "./style.css";

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
      <div className="p6-seg" role="group" aria-label="모델 고르기">
        <button aria-pressed={mode === "bert"} onClick={() => pick("bert", target)}>
          BERT: 빈칸 맞히기
        </button>
        <button aria-pressed={mode === "gpt"} onClick={() => pick("gpt", target)}>
          GPT: 다음 말 맞히기
        </button>
      </div>

      <p className="p6-label">맞힐 단어를 눌러 보세요</p>
      <div className="p6-sent" role="group" aria-label="문장">
        {SENT.map((w, i) => {
          const state = i === target ? "target" : seen.includes(i) ? "seen" : "hidden";
          return (
            <button key={w} data-state={state} aria-pressed={i === target} aria-label={`${w}${i === target ? " (맞힐 단어)" : state === "hidden" ? " (가려짐)" : ""}`} onClick={() => pick(mode, i)}>
              {state === "target" ? "?" : w}
            </button>
          );
        })}
      </div>
      <p className="p6-msg2">{explain(mode, target)}</p>

      <p className="p6-label">어텐션 표 (가로줄: 쳐다보는 단어, 세로줄: 보이는 단어)</p>
      <div className="p6-grid" role="img" aria-label={mode === "bert" ? "모든 칸이 열린 표" : "대각선 아래만 열린 표"}>
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
      <p className="p6-note">{mode === "bert" ? "BERT는 모든 칸이 열려 있어요. 앞뒤를 다 봐요." : "GPT는 대각선과 그 아래만 열려 있어요. 미래 칸은 가림막으로 가려요(51장)."}</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.bert2}>{done.bert2 ? "✓" : "○"} BERT로 '학교에' 맞히기</li>
        <li data-done={done.gpt2}>{done.gpt2 ? "✓" : "○"} GPT로 같은 '학교에' 맞히기</li>
        <li data-done={done.gpt3}>{done.gpt3 ? "✓" : "○"} GPT로 '간다' 맞히기</li>
      </ul>
      <p className="lab-tip">
        {done.bert2 && done.gpt2 && done.gpt3
          ? "BERT는 빈칸 채우기에, GPT는 한 단어씩 이어 쓰기에 맞아요. ChatGPT는 GPT 쪽이에요!"
          : "같은 단어라도 BERT와 GPT가 볼 수 있는 단어가 달라요. 모드를 바꿔 비교해 보세요."}
      </p>
    </div>
  );
}
