import { useState } from "react";
import { PROBLEMS } from "../../data/ch87";
import "./style.css";

const chars = (s: string) => [...s.replace(/\s/g, "")].length;
/** 이/가 after a word, by whether its last syllable has a final consonant. */
const iGa = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0 ? "이" : "가";
};

export function ThinkSteps() {
  const [pi, setPi] = useState(0);
  const [mine, setMine] = useState<string | null>(null);
  const [fast, setFast] = useState(false);
  const [shown, setShown] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const p = PROBLEMS[pi];
  const done = shown >= p.steps.length;
  const fastChars = chars(`답: ${p.fast}`);
  const slowChars = p.steps.reduce((a, s) => a + chars(s), 0) + chars(`답: ${p.answer}`);

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
      ? "먼저 내 답을 골라 보세요. 생각나는 대로 빨리!"
      : !done
        ? shown > 0
          ? "한 줄 쓸 때마다 모델은 앞에 써 둔 줄을 다시 읽어요. 계속 눌러 보세요."
          : fast
            ? "바로 쓴 답은 그럴듯하지만 검산에서 걸렸어요. 이번엔 한 줄씩 풀게 해 보세요."
            : "이제 모델에게 두 가지 방법으로 시켜 보세요."
        : mine === p.answer
          ? `처음부터 맞혔네요! 풀이를 쓰면 왜 '${p.answer}'인지도 보여 줄 수 있어요.`
          : `내 첫 답은 '${mine}', 풀어서 쓰니 '${p.answer}'${iGa(p.answer)} 나왔어요. ${mine === p.fast ? "바로 떠오르는 답이 함정이었죠!" : "풀이를 쓰면 어디서 갈렸는지 보여요."}`;

  return (
    <div>
      <div className="ctx-presets" role="group" aria-label="문제 고르기">
        {PROBLEMS.map((q, i) => (
          <button key={q.key} className="p10-seg" aria-pressed={pi === i} onClick={() => choose(i)}>
            {solved.includes(q.key) ? "✓ " : ""}
            {q.title}
          </button>
        ))}
      </div>
      <p className="p10-q">{p.q}</p>

      <h4 className="p10-h">① 내 답 먼저 (빨리!)</h4>
      <div className="p10-choices" role="group" aria-label="내 답">
        {p.choices.map((c) => (
          <button key={c} aria-pressed={mine === c} onClick={() => setMine(c)}>
            {c}
          </button>
        ))}
      </div>

      <h4 className="p10-h">② 모델에게 시켜 보기</h4>
      <div className="p10-duo">
        <section className="p10-panel">
          <h5>바로 답</h5>
          <button className="btn ghost" disabled={mine === null || fast} onClick={() => setFast(true)}>
            "답만 바로 써 줘"
          </button>
          {fast && (
            <>
              <p className="p10-line">
                <span className="chip hl-pink">답: {p.fast}</span>
              </p>
              <p className="p10-line bad">{p.fastCheck}</p>
              <p className="lab-sum">쓴 글자 {fastChars}자 · 설명용 예시</p>
            </>
          )}
        </section>
        <section className="p10-panel">
          <h5>풀어서 답</h5>
          <button className="btn" disabled={mine === null || done} onClick={next}>
            {shown === 0 ? '"차근차근 풀어 보자"' : "한 줄 더 쓰기"}
          </button>
          <ol className="p10-think" aria-live="polite">
            {p.steps.slice(0, shown).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {done && (
            <>
              <p className="p10-line">
                <span className="chip hl-mint">답: {p.answer}</span>
              </p>
              <p className="lab-sum">
                쓴 글자 {slowChars}자 · 바로 답의 약 {Math.round(slowChars / fastChars)}배
              </p>
            </>
          )}
        </section>
      </div>
      {done && (
        <p className="lab-sum">
          글자를 많이 쓸수록 모델을 더 여러 번 돌려요(2장). 그만큼 시간이 들지만, 어려운 계산을 한 줄씩 나눠서 할 수 있어요.
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        {PROBLEMS.map((q) => (
          <li key={q.key} data-done={solved.includes(q.key)}>
            {solved.includes(q.key) ? "✓" : "○"} '{q.title}' 풀어서 맞히기
          </li>
        ))}
      </ul>
      <p className="lab-tip">{solved.length === PROBLEMS.length && done ? "세 문제 모두 풀었어요! 셋 다 '바로 떠오르는 답'이 함정이었죠. 그래서 중요한 문제는 풀이를 쓰고 검산해요." : tip}</p>
      <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>
        모델의 '바로 답'은 설명을 위해 꾸민 예시예요. 실제 큰 모델은 이런 유명한 문제를 맞히기도 해요.
      </p>
    </div>
  );
}
