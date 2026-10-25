import { useState } from "react";
import { KEEP_MIN, NOTE_SLOTS, PHRASES, squeeze } from "../../data/ch42";
import "./style.css";

const START = PHRASES.map((p) => p.ko === "나는" || p.ko === "수학 숙제를" || !!p.fixed);
const MAX_WORDS = PHRASES.reduce((a, p) => a + p.ko.split(" ").length, 0);

export function Squeeze() {
  const [on, setOn] = useState<boolean[]>(START);
  const [attn, setAttn] = useState(false);
  const [seen, setSeen] = useState<boolean[]>([false, false, false]);
  const r = squeeze(on, attn);

  const apply = (nextOn: boolean[], nextAttn: boolean) => {
    setOn(nextOn);
    setAttn(nextAttn);
    const q = squeeze(nextOn, nextAttn);
    const all = nextOn.every(Boolean);
    const plain = squeeze(nextOn, false);
    const now = [!nextAttn && plain.lost.length === 0 && plain.words === 6, all && !nextAttn, all && nextAttn && q.lost.length === 0];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  const missions = ["아무 뜻도 빠지지 않는 가장 긴 문장 만들기 (몇 단어까지 될까?)", "전부 넣고, 번역에서 무엇이 빠지는지 보기", "어텐션을 켜고 전부 넣어 보기 (43장 미리보기)"];
  const tip = attn
    ? "디코더가 쓸 때마다 원문을 다시 보니, 쪽지 하나에 다 담지 않아도 돼요. 이게 43장의 어텐션이에요."
    : r.lost.length === 0
      ? `${r.words}단어는 쪽지 하나에 다 담겼어요. 조금 더 길게 만들어 보세요.`
      : `${r.words}단어를 쪽지 ${NOTE_SLOTS}칸에 눌러 담다 보니 앞쪽의 '${r.lost.join("', '")}' 흔적이 너무 옅어져서 번역에서 빠졌어요.`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="넣을 부분 고르기" style={{ display: "flex" }}>
        {PHRASES.map((p, i) => (
          <button
            key={p.ko}
            aria-pressed={on[i]}
            disabled={p.fixed}
            onClick={() => {
              const next = on.map((x, j) => (j === i ? !x : x));
              apply(next, attn);
            }}
          >
            {p.ko}
          </button>
        ))}
      </div>

      <div className="p4-sentence" style={{ marginTop: 12 }} aria-label="원문">
        {PHRASES.map((p, i) =>
          on[i] ? (
            <span key={p.ko} className="chip hl-violet">
              {p.ko}
            </span>
          ) : null,
        )}
      </div>
      <p className="p4-note" style={{ marginTop: 4 }}>
        단어 {r.words}개 / {MAX_WORDS}개를 요약 쪽지 하나(숫자 {NOTE_SLOTS}칸)에 담아요.
      </p>

      <div className="p4-box">
        <h4>요약 쪽지에 남은 흔적 (선 아래로 내려가면 빠져요)</h4>
        <div className="bars">
          {r.traces.map((t) => (
            <div className="bar-row" key={t.p.ko} style={{ gridTemplateColumns: "6.4em minmax(0, 1fr) 3.4em" }}>
              <span className="label" style={{ color: t.kept ? undefined : "var(--pen)" }}>
                {t.p.ko}
              </span>
              <span className="track p4-thresh" style={{ ["--t" as string]: `${KEEP_MIN * 100}%` }}>
                <span className="fill" style={{ display: "block", width: `${t.s * 100}%`, background: attn ? "var(--hl-mint)" : t.kept ? "var(--hl-yellow)" : "var(--hl-pink)" }} />
              </span>
              <span className="val">{t.s.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <h4 className="p4-h4">디코더가 쓴 번역</h4>
        <div className="p4-sentence" aria-live="polite">
          {r.out.map((w, i) => (
            <span key={i} className={`chip ${w === "???" ? "p4-lost" : "hl-orange"}`}>
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="lab-actions">
        <button className={attn ? "btn" : "btn ghost"} aria-pressed={attn} onClick={() => apply(on, !attn)}>
          {attn ? "어텐션 끄기" : "어텐션 켜기 (43장 미리보기)"}
        </button>
        <button className="btn ghost" onClick={() => apply(PHRASES.map(() => true), attn)}>
          전부 넣기
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
      <p className="p4-note">* 설명용 장난감 모델이에요. 흔적은 뒤에 단어를 하나 읽을 때마다 0.8배씩 옅어지고(41장), {KEEP_MIN}보다 옅으면 번역에서 빠진다고 정했어요.</p>
    </div>
  );
}
