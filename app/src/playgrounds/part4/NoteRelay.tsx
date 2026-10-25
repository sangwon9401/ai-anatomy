import { useState } from "react";
import { EMPTY, SLOTS, VERBS, WORD_VEC, predictVerb, rnnRun, type Note } from "../../data/ch40";
import "./style.css";

const BANK = ["어제", "내일", "나는", "친구와", "함께", "버스를", "타고", "학교에"];
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
    const now = [next.length > 0 && top === 0, next.length > 0 && top === 2, next[0] === "어제" && next.length >= 3 && p[0] < 0.5];
    setSeen((s) => s.map((x, i) => x || now[i]));
  };

  const missions = ["'갔다'가 1등이 되는 문장 만들기", "'갈 거야'가 1등이 되는 문장 만들기", "'어제'로 시작했는데도 '갔다'가 50% 밑으로 떨어지게 하기 (41장 예고)"];

  let tip: string;
  if (words.length === 0) tip = "빈 쪽지에서 시작해요. 첫 단어를 골라 보세요.";
  else {
    const w = words[words.length - 1];
    const wrote = (WORD_VEC[w] ?? [0, 0, 0]).findIndex((v) => v !== 0);
    const faded = prev.gist[0] && Math.abs(last.h[0]) < Math.abs(prev.h[0]) ? ` '때' 칸의 '${prev.gist[0]}'는 ${signed(prev.h[0])} → ${signed(last.h[0])}로 옅어졌어요.` : "";
    tip = wrote >= 0 ? `'${w}'가 '${SLOTS[wrote]}' 칸에 적혔어요.${faded}` : `'${w}'는 쪽지에 새로 적을 게 없어서, 옛 내용만 0.8배로 옮겨 적었어요.${faded}`;
  }

  return (
    <div>
      <div className="p4-sentence" aria-live="polite" aria-label="넣은 단어들">
        {words.length === 0 && <span className="p4-note" style={{ margin: 0 }}>아래에서 단어를 넣어 보세요.</span>}
        {words.map((w, i) => (
          <span key={i} className={`chip ${w === "어제" ? "hl-mint" : w === "내일" ? "hl-sky" : "outline"}`}>
            {w}
          </span>
        ))}
        <span className="p4-blank">?</span>
      </div>
      <div className="ctx-bank" role="group" aria-label="단어 넣기">
        {BANK.map((w) => (
          <button key={w} disabled={words.length >= MAX} onClick={() => set([...words, w])}>
            + {w}
          </button>
        ))}
      </div>

      <div className="p4-relay">
        <div>
          <h4 className="p4-h4">지금 쪽지 (은닉 상태)</h4>
          <NoteCard note={last} label={`지금 쪽지: ${SLOTS.map((s, i) => `${s} ${signed(last.h[i])}`).join(", ")}`} />
        </div>
        <div>
          <h4 className="p4-h4">마지막 쪽지로 맞힌 다음 단어</h4>
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
          <table className="matrix" aria-label="단어마다 고쳐 쓴 쪽지">
            <thead>
              <tr>
                <th scope="col" className="p4-th">
                  단어
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
          한 단어 지우기
        </button>
        <button className="btn ghost" disabled={words.length === 0} onClick={() => set([])}>
          처음부터
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
      <p className="p4-note">* 설명용 장난감 RNN이에요. 새 쪽지 = 누르기(0.8 × 옛 쪽지 + 지금 단어). 진짜 RNN의 쪽지는 숫자 수백 개이고, 칸마다 뜻이 이렇게 딱 정해져 있지 않아요.</p>
    </div>
  );
}
