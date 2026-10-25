import { useState } from "react";
import { CHO, HANGUL_BASE, JONG, JUNG, compose, decompose, utf8 } from "../../data/ch28";
import "./style.css";

const GROUPS = [
  { key: 0, name: "첫소리", items: CHO, color: "sky", mul: "× 21" },
  { key: 1, name: "가운뎃소리", items: JUNG, color: "yellow", mul: "" },
  { key: 2, name: "끝소리", items: JONG, color: "pink", mul: "" },
] as const;

const MISSIONS = [
  { label: "'한' 만들기", ok: (c: number) => c === 54620 },
  { label: "'가' 바로 다음 번호(44033)의 글자 만들기", ok: (c: number) => c === 44033 },
  { label: "번호가 가장 큰 글자 찾기", ok: (c: number) => c === HANGUL_BASE + 11171 },
];

export function HangulBuilder() {
  const [pick, setPick] = useState<[number, number, number]>([0, 0, 0]); // 가
  const [text, setText] = useState("");
  const [seen, setSeen] = useState<boolean[]>(MISSIONS.map(() => false));
  const code = compose(...pick);
  const ch = String.fromCodePoint(code);
  const bytes = utf8(ch);

  const set = (next: [number, number, number]) => {
    setPick(next);
    const c = compose(...next);
    setSeen((s) => s.map((v, i) => v || MISSIONS[i].ok(c)));
  };

  const onText = (v: string) => {
    setText(v);
    const first = [...v].find((c) => decompose(c.codePointAt(0)!) !== null);
    if (first) set(decompose(first.codePointAt(0)!)!);
  };

  const tip = (() => {
    if (seen.every(Boolean)) return "미션 완료! 11,172자 모두 이 공식 하나로 번호가 정해져요.";
    if (!seen[0]) return "'한'은 ㅎ + ㅏ + ㄴ이에요. 세 줄에서 하나씩 눌러 보세요.";
    if (pick[2] === 0) return "끝소리 '없음'을 고르면 받침 없는 글자가 돼요. 이때 끝소리 번호는 0이에요.";
    return "끝소리를 하나 옆으로 옮겨 보세요. 번호가 딱 1 바뀌어요. 가운뎃소리를 옮기면 28, 첫소리를 옮기면 588이 바뀌어요.";
  })();

  return (
    <div className="p3-hangul">
      <div className="p3-hangul-top">
        <div className="p3-big" aria-live="polite">
          {ch}
        </div>
        <div className="p3-hangul-info">
          <div className="p3-formula num">
            44032 + (<b className="p3-c-sky">{pick[0]}</b> × 21 + <b className="p3-c-yellow">{pick[1]}</b>) × 28 + <b className="p3-c-pink">{pick[2]}</b>
            <br />= <b className="p3-code">{code}</b>
          </div>
          <div className="lab-sum">
            저장할 때: {bytes.join(" · ")} ({bytes.length}바이트)
          </div>
        </div>
      </div>

      {GROUPS.map((g) => (
        <div className="p3-jamo-group" key={g.key}>
          <div className="p3-jamo-head">
            {g.name} <span className="muted">{g.items.length}개 · 지금 {pick[g.key]}번</span>
          </div>
          <div className="p3-jamo-grid" role="group" aria-label={g.name}>
            {g.items.map((j, i) => (
              <button
                key={i}
                className={`p3-jamo${pick[g.key] === i ? ` on hl-${g.color}` : ""}`}
                aria-pressed={pick[g.key] === i}
                aria-label={`${g.name} ${j || "없음"} (${i}번)`}
                onClick={() => {
                  const next = [...pick] as [number, number, number];
                  next[g.key] = i;
                  set(next);
                }}
              >
                {j || <span className="p3-none">없음</span>}
              </button>
            ))}
          </div>
        </div>
      ))}

      <label className="code-label" htmlFor="p3-split">
        거꾸로: 한글 한 글자를 넣으면 나눠서 보여 줘요
      </label>
      <input id="p3-split" className="code-input" value={text} maxLength={4} placeholder="예: 밥" onChange={(e) => onText(e.target.value)} />

      <ul className="missions" style={{ marginTop: 14 }}>
        {MISSIONS.map((m, i) => (
          <li key={m.label} data-done={seen[i]}>
            {seen[i] ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
