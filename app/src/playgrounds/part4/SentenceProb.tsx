import { useState } from "react";
import { LM_COLORS, fmtPct, nextProbs, sentenceProb } from "../../data/ch37";
import "./style.css";

const LEN = 4;
const BEST = "나는 오늘 학교에 간다";

/** "약 385번에 1번" style count, with Korean 만/억 units for big numbers. */
function oneIn(p: number) {
  const n = Math.round(1 / p);
  if (n < 10_000) return `약 ${n.toLocaleString("ko-KR")}번에 1번`;
  if (n < 100_000_000) return `약 ${Math.round(n / 10_000).toLocaleString("ko-KR")}만 번에 1번`;
  return `약 ${Math.round(n / 100_000_000).toLocaleString("ko-KR")}억 번에 1번`;
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
    { label: "확률이 가장 높은 문장 찾기", done: records.some((r) => r.s === BEST) },
    { label: "같은 단어로 순서만 바꿔서 0.1%가 넘는 문장 하나 더", done: records.some((r) => r.s !== BEST && r.p >= 0.001) },
    { label: "'피자'가 들어간 문장의 확률 보기", done: records.some((r) => r.s.includes("피자")) },
  ];

  let tip: string;
  if (!done && words.length === 0) tip = "첫 단어부터 골라 보세요. 막대가 길수록 그 자리에 잘 오는 단어예요.";
  else if (!done) tip = `'${words[words.length - 1]}'까지 왔어요. 다음 후보의 확률은 앞 단어 ${words.length}개를 모두 보고 정해져요.`;
  else if (text === BEST) tip = "1등 문장이에요! 단어마다 확률이 높으니 곱해도 가장 커요.";
  else if (text.includes("피자")) tip = "'피자'가 끼어들자 확률이 확 줄었어요. 한 단어만 어색해도 곱한 결과 전체가 작아져요.";
  else if (p >= 0.001) tip = "자연스러운 순서예요. 한국어는 순서를 조금 바꿔도 말이 되죠. 그래도 1등보다는 조금 낮아요.";
  else if (p < 0.00001) tip = "어색한 순서라 단어마다 확률이 낮았고, 곱하니 아주아주 작아졌어요.";
  else tip = "말은 되지만 흔한 순서는 아니라서 확률이 낮아요.";

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="만든 문장">
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
        <div className="p4-opts" role="group" aria-label="다음 단어 후보">
          {options.map((o) => (
            <button key={o.w} className="p4-opt" onClick={() => add(o.w)} aria-label={`${o.w}, ${fmtPct(o.p)}`}>
              <span>{o.w}</span>
              <span className="track">
                <span className="fill" style={{ width: `${Math.max(o.p * 100, 1)}%`, background: `var(--hl-${LM_COLORS[o.w]})` }} />
              </span>
              <span className="val">{fmtPct(o.p)}</span>
            </button>
          ))}
          <div className="p4-opt p4-rest" aria-label={`다른 단어 전부, ${fmtPct(rest)}`}>
            <span>다른 단어</span>
            <span className="track">
              <span className="fill" style={{ width: `${rest * 100}%`, background: "var(--line)" }} />
            </span>
            <span className="val">{fmtPct(rest)}</span>
          </div>
        </div>
      )}

      <p className="p4-product" aria-live="polite">
        {words.length === 0 ? (
          "문장의 확률 = (고른 단어의 확률을 차례로 곱한 값)"
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
          '{text}'의 확률은 <b>{fmtPct(p)}</b>. 네 단어 문장을 {oneIn(p)} 꼴이에요.
        </p>
      )}

      <div className="lab-actions">
        {done ? (
          <button className="btn" onClick={() => setWords([])}>
            새 문장 만들기
          </button>
        ) : (
          <button className="btn ghost" disabled={words.length === 0} onClick={() => setWords(words.slice(0, -1))}>
            한 단어 지우기
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
            기록 지우기
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
          <h4>내가 만든 문장 (확률 높은 순)</h4>
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
      <p className="p4-note">* 확률은 설명용 예시예요. 진짜 언어 모델은 수만 개의 단어 후보에 확률을 매겨요.</p>
    </div>
  );
}
