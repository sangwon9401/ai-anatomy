// en: chapter 28 is rewritten for English letters, so this playground is a "letter lab" instead of the Hangul
// builder: pick a letter, capital or small, and an accent piece; see the rule, the code points and the UTF-8 bytes.
import { useState } from "react";
import { CHO, utf8 } from "../../../../data/ch28";
import "../../../../playgrounds/part3/style.css";

// combining accent pieces (code points checked with a script); shown on a spacing look-alike
const MARKS = [
  { show: "", name: "none", code: 0 },
  { show: "´", name: "acute", code: 769 },
  { show: "`", name: "grave", code: 768 },
  { show: "^", name: "circumflex", code: 770 },
  { show: "~", name: "tilde", code: 771 },
  { show: "¨", name: "umlaut", code: 776 },
];

// capital letters start right after 64, small letters right after 96
const UPPER_BASE = 64;
const LOWER_BASE = 96;

const MISSIONS = [
  { label: "Make 'H' (72)", ok: (s: string) => s === "H" },
  { label: "Make the letter whose number is 100", ok: (s: string) => s === "d" },
  { label: "Make 'é' and find its single number", ok: (s: string) => s === "é" },
];

const cps = (s: string) => [...s].map((c) => c.codePointAt(0)!);

export function HangulBuilder() {
  const [place, setPlace] = useState(1); // 1 = A
  const [small, setSmall] = useState(false);
  const [mark, setMark] = useState(0);
  const [text, setText] = useState("");
  const [seen, setSeen] = useState<boolean[]>(MISSIONS.map(() => false));

  const make = (p: number, sm: boolean, m: number) => {
    const base = String.fromCodePoint((sm ? LOWER_BASE : UPPER_BASE) + p);
    const parts = MARKS[m].code ? base + String.fromCodePoint(MARKS[m].code) : base;
    return { base, parts, whole: parts.normalize("NFC") };
  };
  const { base, parts, whole } = make(place, small, mark);
  const baseCode = base.codePointAt(0)!;
  const joined = cps(whole).length === 1;
  const bytes = utf8(whole);

  const set = (p: number, sm: boolean, m: number) => {
    setPlace(p);
    setSmall(sm);
    setMark(m);
    const w = make(p, sm, m).whole;
    setSeen((s) => s.map((v, i) => v || MISSIONS[i].ok(w)));
  };

  const onText = (v: string) => {
    setText(v);
    const first = v.normalize("NFD")[0];
    if (!first) return;
    const c = first.codePointAt(0)!;
    const sm = c > LOWER_BASE && c <= LOWER_BASE + 26;
    if ((c > UPPER_BASE && c <= UPPER_BASE + 26) || sm) {
      const next = v.normalize("NFD").codePointAt(1);
      const m = MARKS.findIndex((mk) => mk.code && mk.code === next);
      set(c - (sm ? LOWER_BASE : UPPER_BASE), sm, m > 0 ? m : 0);
    }
  };
  const typed = [...text].slice(0, 8).join("");

  const tip = (() => {
    if (seen.every(Boolean)) return "Missions complete! Every letter follows the same rule, and accents are pieces that can join a letter.";
    if (!seen[0]) return "'H' is the 8th letter. Pick H and keep it a capital: 64 + 8 = 72.";
    if (!seen[1]) return "100 = 96 + 4. Which letter is 4th, and is it capital or small?";
    if (mark === 0) return "Now pick 'e' (small) and add the ´ accent piece.";
    return joined
      ? "The letter and the accent piece became one character with its own number. Look at the bytes too."
      : "This letter and accent have no single number, so they stay two pieces. Try 'e' with ´.";
  })();

  return (
    <div className="p3-hangul">
      <div className="p3-hangul-top">
        <div className="p3-big" aria-live="polite">
          {whole}
        </div>
        <div className="p3-hangul-info">
          <div className="p3-formula num">
            {small ? LOWER_BASE : UPPER_BASE} + <b className="p3-c-sky">{place}</b> = <b className="p3-code">{baseCode}</b> ({base})
            {mark > 0 && (
              <>
                <br />+ accent piece <b className="p3-c-pink">{MARKS[mark].code}</b>
                {joined ? (
                  <>
                    {" "}
                    → one number <b className="p3-code">{cps(whole)[0]}</b>
                  </>
                ) : (
                  <> → stays 2 numbers: {cps(parts).join(" + ")}</>
                )}
              </>
            )}
          </div>
          <div className="lab-sum">
            Stored as: {bytes.join(" · ")} ({bytes.length} {bytes.length === 1 ? "byte" : "bytes"})
          </div>
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          Letter <span className="muted">26 letters · place {place}</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="Letter">
          {CHO.map((j, i) => (
            <button
              key={j}
              className={`p3-jamo${place === i + 1 ? " on hl-sky" : ""}`}
              aria-pressed={place === i + 1}
              aria-label={`${j} (place ${i + 1})`}
              onClick={() => set(i + 1, small, mark)}
            >
              {small ? j.toLowerCase() : j}
            </button>
          ))}
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          Capital or small <span className="muted">capital counts from 64, small from 96</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="Capital or small" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {[false, true].map((sm) => (
            <button key={String(sm)} className={`p3-jamo${small === sm ? " on hl-yellow" : ""}`} aria-pressed={small === sm} onClick={() => set(place, sm, mark)}>
              {sm ? "small" : "Capital"}
            </button>
          ))}
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          Accent piece <span className="muted">{mark ? `number ${MARKS[mark].code}` : "none"}</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="Accent piece">
          {MARKS.map((m, i) => (
            <button key={m.name} className={`p3-jamo${mark === i ? " on hl-pink" : ""}`} aria-pressed={mark === i} aria-label={`${m.name}${m.code ? ` (${m.code})` : ""}`} onClick={() => set(place, small, i)}>
              {m.show || <span className="p3-none">none</span>}
            </button>
          ))}
        </div>
      </div>

      <label className="code-label" htmlFor="p3-split">
        The other way: type any character (an emoji works too) to see its numbers
      </label>
      <input id="p3-split" className="code-input" value={text} maxLength={16} placeholder="e.g. ñ or 👍🏽" onChange={(e) => onText(e.target.value)} />
      {typed && (
        <div className="lab-sum" style={{ marginTop: 8 }}>
          Numbers: {cps(typed).join(" + ")} · Stored as {utf8(typed).length} bytes
        </div>
      )}

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
