// zh overlay of src/playgrounds/part4/Squeeze.tsx (strings; the starting phrases are the zh data's 我 + 写了 + 数学 作业)
import { useState } from "react";
import { KEEP_MIN, NOTE_SLOTS, PHRASES, squeeze } from "../../../../data/ch42";
import "../../../../playgrounds/part4/style.css";

const START = PHRASES.map((p) => p.ko === "我" || p.ko === "数学 作业" || !!p.fixed);
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

  const missions = ["拼出一个意思一点都不丢的最长句子（最多能几个词？）", "全部放进去，看看翻译里漏掉了什么", "打开注意力，再全部放进去（第 43 章预告）"];
  const tip = attn
    ? "解码器每写一个词都回头看原文，就不必把一切都塞进一张纸条了。这就是第 43 章的注意力。"
    : r.lost.length === 0
      ? `${r.words} 个词都装进了一张纸条。再加长一点试试。`
      : `把 ${r.words} 个词硬塞进 ${NOTE_SLOTS} 格的纸条，前面“${r.lost.join("”“")}”的痕迹变得太淡，翻译里就漏掉了。`;

  return (
    <div>
      <div className="p4-seg" role="group" aria-label="选择要放进去的部分" style={{ display: "flex" }}>
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

      <div className="p4-sentence" style={{ marginTop: 12 }} aria-label="原文">
        {PHRASES.map((p, i) =>
          on[i] ? (
            <span key={p.ko} className="chip hl-violet">
              {p.ko}
            </span>
          ) : null,
        )}
      </div>
      <p className="p4-note" style={{ marginTop: 4 }}>
        把 {r.words} / {MAX_WORDS} 个词装进一张总结纸条（{NOTE_SLOTS} 格数字）。
      </p>

      <div className="p4-box">
        <h4>总结纸条上留下的痕迹（掉到线下就会漏掉）</h4>
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
        <h4 className="p4-h4">解码器写出的翻译</h4>
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
          {attn ? "关闭注意力" : "打开注意力（第 43 章预告）"}
        </button>
        <button className="btn ghost" onClick={() => apply(PHRASES.map(() => true), attn)}>
          全部放进去
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
      <p className="p4-note">* 这是示意用的玩具模型。后面每多读一个词，痕迹就乘 0.8 变淡（第 41 章）；规定比 {KEEP_MIN} 还淡就会在翻译里漏掉。</p>
    </div>
  );
}
