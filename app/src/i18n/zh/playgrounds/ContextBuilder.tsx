// zh overlay of src/playgrounds/ContextBuilder.tsx (strings; the ambiguous word is 包, see the zh data/ch45.ts)
import { useState } from "react";
import { BANK, MEANING_NAMES, SENTENCES, attend, percents, type Meaning } from "../../../data/ch45";
import { MEANING_GLYPHS } from "../../../scenes/icons";

const MAX = 5;
const TRI: [number, number][] = [
  [150, 58],
  [42, 236],
  [258, 236],
];
const at = (m: Meaning) => [0, 1].map((k) => m[0] * TRI[0][k] + m[1] * TRI[1][k] + m[2] * TRI[2][k]);
const ICON_POS: [number, number][] = [
  [126, 4],
  [0, 226],
  [252, 226],
];
const PRESETS = [
  { label: "她肩上背着一个", words: SENTENCES.sea },
  { label: "早餐吃了豆沙", words: SENTENCES.fruit },
  { label: "蚊子叮了个", words: SENTENCES.meal },
];

export function ContextBuilder() {
  const [ctx, setCtx] = useState<string[]>(SENTENCES.sea);
  const { words, weights, mix } = attend(ctx);
  const pct = percents(weights);
  const mixPct = percents(mix);
  const top = mix.indexOf(Math.max(...mix));
  const [dx, dy] = at(mix);

  return (
    <div>
      <div className="ctx-sentence" aria-label="现在的句子">
        {ctx.length === 0 && <span className="ctx-empty">从下面选几个词吧。</span>}
        {ctx.map((w) => (
          <button key={w} className="chip outline" onClick={() => setCtx(ctx.filter((x) => x !== w))} aria-label={`去掉 ${w}`}>
            {w}
          </button>
        ))}
        <span className="chip hl-yellow self">包</span>
      </div>

      <div className="ctx-bank" role="group" aria-label="选词">
        {BANK.filter((b) => !ctx.includes(b.w)).map((b) => (
          <button key={b.w} disabled={ctx.length >= MAX} onClick={() => setCtx([...ctx, b.w])}>
            + {b.w}
          </button>
        ))}
      </div>
      <div className="ctx-presets">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => setCtx(p.words)}>
            {p.label}包
          </button>
        ))}
        <button onClick={() => setCtx([])}>清空</button>
      </div>

      <div className="ctx-out">
        <div>
          <h4>“包”看各个词的比例</h4>
          <div className="bars">
            {words.map((w, i) => (
              <div className="bar-row" key={w.w + i}>
                <span className="label">{i === words.length - 1 ? "包（自己）" : w.w}</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${weights[i] * 100}%`, background: "var(--ink-2)" }} />
                </span>
                <span className="val">{pct[i]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4>混合以后“包”的意思</h4>
          <svg viewBox="0 0 300 270" style={{ width: "100%", maxWidth: 300, display: "block" }} role="img" aria-label={`吃的包 ${mixPct[0]}%，背的包 ${mixPct[1]}%，身上的包 ${mixPct[2]}%`}>
            <path d={`M ${TRI[0].join(" ")} L ${TRI[1].join(" ")} L ${TRI[2].join(" ")} Z`} fill="var(--paper-2)" stroke="var(--ink-3)" strokeWidth={2} strokeLinejoin="round" />
            {MEANING_GLYPHS.map((G, i) => (
              <svg key={i} x={ICON_POS[i][0]} y={ICON_POS[i][1]} width={48} height={48} viewBox="0 0 100 100">
                <G />
              </svg>
            ))}
            <circle cx={150} cy={(58 + 236 + 236) / 3} r={6} fill="var(--paper)" stroke="var(--ink-3)" strokeWidth={2} strokeDasharray="3 3" />
            <circle className="tri-dot" cx={dx} cy={dy} r={10} fill="var(--ink)" stroke="var(--hl-yellow)" strokeWidth={4} />
          </svg>
          <div className="bars" style={{ marginTop: 8 }}>
            {MEANING_NAMES.map((n, i) => (
              <div className="bar-row" key={n}>
                <span className="label">{n}</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${mix[i] * 100}%`, background: ["var(--hl-yellow)", "var(--hl-sky)", "var(--hl-pink)"][i] }} />
                </span>
                <span className="val">{mixPct[i]}%</span>
              </div>
            ))}
          </div>
          <p className="ctx-verdict">
            {mix[top] < 0.45 ? "意思还很模糊。再放几个能决定意思的词试试。" : `现在的“包”接近“${MEANING_NAMES[top]}”。`}
          </p>
        </div>
      </div>
    </div>
  );
}
