// zh overlay of src/playgrounds/part3/HangulBuilder.tsx. The Korean playground assembles Hangul with a formula; 汉字 have
// no formula, so this one pairs a 部首 with a 声旁 from a small table of real characters and shows the looked-up code and
// UTF-8 bytes. The export name stays the same (index.ts maps chapter 28 to it).
import { useState } from "react";
import { BUILT, HANGUL_BASE, PHONETICS, RADICALS, compose, decompose, utf8 } from "../../data/ch28";
import "../../../../playgrounds/part3/style.css";

const MISSIONS = [
  { label: "拼出“江”（第 28 章的例子）", ok: (seen: Set<string>) => seen.has("江") },
  { label: "用“青”拼出 3 个不同的字", ok: (seen: Set<string>) => ["清", "倩", "请"].every((c) => seen.has(c)) },
  { label: "拼出“他”和“她”，比一比编号", ok: (seen: Set<string>) => seen.has("他") && seen.has("她") },
];

const hex = (code: number) => `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;

export function HangulBuilder() {
  const [pick, setPick] = useState<[number, number]>([0, 4]); // 氵 + 工 = 江
  const [seen, setSeen] = useState<Set<string>>(() => new Set(["江"]));
  const [text, setText] = useState("");
  const code = compose(pick[0], pick[1]);
  const built = BUILT[pick[0]][pick[1]];
  const ch = code ? String.fromCodePoint(code) : "";
  const bytes = ch ? utf8(ch) : [];

  const set = (next: [number, number]) => {
    setPick(next);
    const c = BUILT[next[0]][next[1]].ch;
    if (c) setSeen((s) => new Set(s).add(c));
  };

  const onText = (v: string) => {
    setText(v);
    const first = [...v].find((c) => decompose(c.codePointAt(0)!) !== null);
    if (first) {
      const d = decompose(first.codePointAt(0)!)!;
      set([d[0], d[1]]);
    }
  };
  // the character typed in the box (any character): its own code and bytes
  const typed = [...text][0];
  const typedCode = typed ? typed.codePointAt(0)! : 0;
  const inBlock = typedCode >= HANGUL_BASE && typedCode <= 0x9fff;

  const done = MISSIONS.map((m) => m.ok(seen));
  const tip = (() => {
    if (!code) return "这两个部件拼不出常用字。不是随便哪两块都能拼成字的，换一个试试。";
    if (done.every(Boolean)) return "任务完成！“他”和“她”的部首不同，编号差了 2,723。汉字的编号只能查表，算不出来。";
    if (!done[1]) return "右边固定选“青”，左边换不同的部首：读音都和 qīng 很像，意思却跟着部首变。";
    if (!done[2]) return "试试“亻”和“女”配上“也”。";
    return "左边的部首提示意思，右边的声旁常常提示读音。";
  })();

  return (
    <div className="p3-hangul">
      <div className="p3-hangul-top">
        <div className="p3-big" aria-live="polite">
          {ch || "？"}
        </div>
        <div className="p3-hangul-info">
          <div className="p3-formula num">
            <b className="p3-c-sky">{RADICALS[pick[0]].r}</b> + <b className="p3-c-yellow">{PHONETICS[pick[1]].p}</b> = {ch ? <b className="p3-code">{ch}</b> : "没有常用字"}
            {ch && (
              <>
                <br />
                {built.py} · 编号 <b className="p3-code">{code}</b> ({hex(code)})
              </>
            )}
          </div>
          {ch && (
            <div className="lab-sum">
              存储时：{bytes.join(" · ")}（{bytes.length} 个字节）
            </div>
          )}
        </div>
      </div>

      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          左边：部首 <span className="muted">提示意思 · 现在是“{RADICALS[pick[0]].r}”（{RADICALS[pick[0]].means}）</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="部首">
          {RADICALS.map((r, i) => (
            <button key={r.r} className={`p3-jamo${pick[0] === i ? " on hl-sky" : ""}`} aria-pressed={pick[0] === i} aria-label={`部首 ${r.r}（${r.means}）`} onClick={() => set([i, pick[1]])}>
              {r.r}
            </button>
          ))}
        </div>
      </div>
      <div className="p3-jamo-group">
        <div className="p3-jamo-head">
          右边：声旁 <span className="muted">提示读音 · 现在是“{PHONETICS[pick[1]].p}”（{PHONETICS[pick[1]].py}）</span>
        </div>
        <div className="p3-jamo-grid" role="group" aria-label="声旁">
          {PHONETICS.map((p, i) => (
            <button key={p.p} className={`p3-jamo${pick[1] === i ? " on hl-yellow" : ""}`} aria-pressed={pick[1] === i} aria-label={`声旁 ${p.p}（${p.py}）`} onClick={() => set([pick[0], i])}>
              {p.p}
            </button>
          ))}
        </div>
      </div>

      <label className="code-label" htmlFor="p3-split">
        反过来：输入任意一个字，看它的编号和字节
      </label>
      <input id="p3-split" className="code-input" value={text} maxLength={4} placeholder="例如：饭" onChange={(e) => onText(e.target.value)} />
      {typed && (
        <p className="lab-sum num">
          “{typed}” = {typedCode} ({hex(typedCode)}) · 字节 {utf8(typed).join(" · ")}
          {inBlock ? " · 在汉字基本区里" : ""}
        </p>
      )}

      <ul className="missions" style={{ marginTop: 14 }}>
        {MISSIONS.map((m, i) => (
          <li key={m.label} data-done={done[i]}>
            {done[i] ? "○" : "□"} {m.label}
          </li>
        ))}
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
