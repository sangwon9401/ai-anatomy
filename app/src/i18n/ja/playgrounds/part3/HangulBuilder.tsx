// ja overlay of src/playgrounds/part3/HangulBuilder.tsx. The Korean playground assembles a Hangul syllable from
// three jamo; Japanese has no syllable formula, so this one assembles a kana from a base kana, a mark
// (゛ +1, ゜ +2, small −1) and the script (katakana +96), with the same layout, missions and reverse lookup.
import { useState } from "react";
// new kana helpers live only in the ja data overlay, so it is imported directly
import { JONG, JUNG, KATA_SHIFT, MARK_DELTA, compose, decompose, marksOf, utf8 } from "../../data/ch28";
import "../../../../playgrounds/part3/style.css";

const MARK_NAMES = ["なし", "濁点 ゛", "半濁点 ゜", "小さく"];
const SCRIPTS = ["ひらがな", "カタカナ"];

const MISSIONS = [
  { label: "「ガ」を作る", ok: (c: number) => c === 12460 },
  { label: "「ぱ」を作る", ok: (c: number) => c === 12401 },
  { label: "「あ」の次の番号(12355)の字を作る", ok: (c: number) => c === 12355 },
];

export function HangulBuilder() {
  const [pick, setPick] = useState<[number, number, number]>([0, 0, 0]); // あ
  const [text, setText] = useState("");
  const [seen, setSeen] = useState<boolean[]>(MISSIONS.map(() => false));
  const code = compose(...pick);
  const ch = String.fromCodePoint(code);
  const bytes = utf8(ch);
  const baseCode = JUNG[pick[0]].codePointAt(0)!;
  const allowed = marksOf(pick[0]);

  const set = (next: [number, number, number]) => {
    // a base that cannot take the chosen mark falls back to no mark
    if (!marksOf(next[0]).includes(next[1])) next = [next[0], 0, next[2]];
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
    if (seen.every(Boolean)) return "ミッション完了！ かなの番号は、もとの字の番号に足し算するだけで決まります。";
    if (!seen[0]) return "「ガ」は「か」に濁点をつけて、カタカナにした字です。3つの列から1つずつえらんでみましょう。";
    if (pick[1] === 0) return "点を「なし」にすると、もとの字そのものです。足す数は0です。";
    return "点を変えると番号が1か2だけ変わります。カタカナにすると、いつでもちょうど96増えます。";
  })();

  const delta = MARK_DELTA[pick[1]];

  return (
    <div className="p3-hangul">
      <div className="p3-hangul-top">
        <div className="p3-big" aria-live="polite">
          {ch}
        </div>
        <div className="p3-hangul-info">
          <div className="p3-formula num">
            <b className="p3-c-sky">{baseCode}</b> {delta < 0 ? "−" : "+"} <b className="p3-c-pink">{Math.abs(delta)}</b> + <b className="p3-c-yellow">{pick[2] * KATA_SHIFT}</b>
            <br />= <b className="p3-code">{code}</b>
          </div>
          <div className="lab-sum">
            保存するとき：{bytes.join(" · ")} ({bytes.length}バイト)
          </div>
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          もとの字 <span className="muted">{JUNG.length}字 · いまは「{JUNG[pick[0]]}」{baseCode}番</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="もとの字">
          {JUNG.map((j, i) => (
            <button
              key={i}
              className={`p3-jamo${pick[0] === i ? " on hl-sky" : ""}`}
              aria-pressed={pick[0] === i}
              aria-label={`もとの字 ${j} (${j.codePointAt(0)}番)`}
              onClick={() => set([i, pick[1], pick[2]])}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          点・大きさ <span className="muted">いまは {delta < 0 ? "−" : "+"}{Math.abs(delta)}</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="点・大きさ" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))" }}>
          {JONG.map((_, i) => (
            <button
              key={i}
              className={`p3-jamo${pick[1] === i ? " on hl-pink" : ""}`}
              aria-pressed={pick[1] === i}
              disabled={!allowed.includes(i)}
              style={allowed.includes(i) ? undefined : { opacity: 0.35, cursor: "default" }}
              onClick={() => set([pick[0], i, pick[2]])}
            >
              {MARK_NAMES[i]}
            </button>
          ))}
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          文字の種類 <span className="muted">いまは +{pick[2] * KATA_SHIFT}</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="文字の種類" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}>
          {SCRIPTS.map((s, i) => (
            <button key={s} className={`p3-jamo${pick[2] === i ? " on hl-yellow" : ""}`} aria-pressed={pick[2] === i} onClick={() => set([pick[0], pick[1], i])}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="code-label" htmlFor="p3-split">
        逆から：かなを1文字入れると、分けて見せます
      </label>
      <input id="p3-split" className="code-input" value={text} maxLength={4} placeholder="例：ぴ" onChange={(e) => onText(e.target.value)} />

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
