// ja overlay of src/playgrounds/part4/Squeeze.tsx (strings only)
import { useState } from "react";
import { KEEP_MIN, NOTE_SLOTS, PHRASES, squeeze } from "../../../../data/ch42";
import "../../../../playgrounds/part4/style.css";

const START = PHRASES.map((p) => p.ko === "私は" || p.ko === "数学の 宿題を" || !!p.fixed);
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

  const missions = ["どの意味もぬけ落ちない、いちばん長い文を作る (何語までいける？)", "全部入れて、翻訳から何がぬけ落ちるか見る", "アテンションをオンにして全部入れてみる (第43章の予告)"];
  const tip = attn
    ? "デコーダーが書くたびにもとの文をもう一度見るので、メモ1枚に全部入れなくてもいいのです。これが第43章のアテンションです。"
    : r.lost.length === 0
      ? `${r.words}語はメモ1枚に全部入りました。もう少し長くしてみましょう。`
      : `${r.words}語をメモの${NOTE_SLOTS}欄におしこんだので、前のほうの「${r.lost.join("」「")}」のあとがうすくなりすぎて、翻訳からぬけ落ちました。`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="入れる部分をえらぶ" style={{ display: "flex" }}>
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

      <div className="p4-sentence" style={{ marginTop: 12 }} aria-label="もとの文">
        {PHRASES.map((p, i) =>
          on[i] ? (
            <span key={p.ko} className="chip hl-violet">
              {p.ko}
            </span>
          ) : null,
        )}
      </div>
      <p className="p4-note" style={{ marginTop: 4 }}>
        {r.words}語 / {MAX_WORDS}語を、要約メモ1枚(数{NOTE_SLOTS}欄)に入れます。
      </p>

      <div className="p4-box">
        <h4>要約メモに残ったあと (線より下がるとぬけ落ちる)</h4>
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
        <h4 className="p4-h4">デコーダーが書いた翻訳</h4>
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
          {attn ? "アテンションをオフ" : "アテンションをオン (第43章の予告)"}
        </button>
        <button className="btn ghost" onClick={() => apply(PHRASES.map(() => true), attn)}>
          全部入れる
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
      <p className="p4-note">* 説明用のおもちゃのモデルです。あとは、うしろの語を1つ読むたびに0.8倍ずつうすれ(第41章)、{KEEP_MIN}よりうすいと翻訳からぬけ落ちることにしました。</p>
    </div>
  );
}
