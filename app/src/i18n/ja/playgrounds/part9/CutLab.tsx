import { useEffect, useState } from "react";
import { PRESETS82, keepTopK, keepTopP, renorm } from "../../../../data/ch82";
import { pickIndex } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

type Mode = "k" | "p";
const pc = (p: number) => `${Math.round(p * 1000) / 10}%`;

export function CutLab() {
  const [key, setKey] = useState(PRESETS82[0].key);
  const [mode, setMode] = useState<Mode>("k");
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.9);
  const [counts, setCounts] = useState<number[] | null>(null);
  const [seen, setSeen] = useState({ sure1: false, unsure6: false, pSure: false, pUnsure: false });

  const preset = PRESETS82.find((d) => d.key === key)!;
  const items = preset.items;
  const kk = Math.min(k, items.length);
  const keep = mode === "k" ? keepTopK(items, kk) : keepTopP(items, p);
  const probs = renorm(items, keep);
  const cum = items.map((_, i) => items.slice(0, i + 1).reduce((a, b) => a + b.p, 0));

  // missions stay done once reached
  const p90 = mode === "p" && Math.abs(p - 0.9) < 0.01;
  useEffect(() => {
    setSeen((s) => {
      const n = {
        sure1: s.sure1 || (key === "sure" && keep === 1),
        unsure6: s.unsure6 || (key === "unsure" && keep === 6),
        pSure: s.pSure || (key === "sure" && p90),
        pUnsure: s.pUnsure || (key === "unsure" && p90),
      };
      return n.sure1 === s.sure1 && n.unsure6 === s.unsure6 && n.pSure === s.pSure && n.pUnsure === s.pUnsure ? s : n;
    });
  }, [key, keep, p90]);
  const now = seen;

  const change = (f: () => void) => {
    f();
    setCounts(null);
  };
  const draw = () => {
    const c = items.map(() => 0);
    for (let i = 0; i < 10; i++) c[pickIndex(probs, Math.random())]++;
    setCounts(c);
  };

  const cutNames = items.slice(keep).map((it) => it.w);
  let tip: string;
  if (key === "school") tip = cutNames.includes("ピザ") ? `${cutNames.length}個を切りました。ピザとその他のしっぽが消えたので、へんてこな言葉が選ばれることはありません。` : "まだピザが残っています。もっと切ってみましょうか？";
  else if (key === "sure") tip = keep === 1 ? "正解の9だけが残りました。モデルに自信があるときは、1つだけ残すのが安全です。" : `${keep}個が残りました。8や11のようなまちがった答えも、たまに選ばれます。`;
  else tip = keep <= 3 ? "ぶどう・すいか・もものように、ちゃんとした答えまで切れてしまいました。Top-p 90%にしてみましょう。" : cutNames.includes("いす") ? `${keep}個が残りました。へんてこな「いす」だけが切れて、いろいろな果物がまんべんなく残りました。` : "いすまで残っています。もう少しだけ切ってみましょうか？";

  return (
    <div>
      <div className="ctx-presets p9-tall" role="group" aria-label="文を選ぶ" style={{ marginTop: 0 }}>
        {PRESETS82.map((d) => (
          <button key={d.key} aria-pressed={d.key === key} onClick={() => change(() => setKey(d.key))} style={d.key === key ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined}>
            {d.name} ___
          </button>
        ))}
      </div>

      <div className="p9-seg" role="group" aria-label="切り方" style={{ marginTop: 12 }}>
        <button aria-pressed={mode === "k"} onClick={() => change(() => setMode("k"))}>
          Top-k
        </button>
        <button aria-pressed={mode === "p"} onClick={() => change(() => setMode("p"))}>
          Top-p
        </button>
      </div>
      <div className="lab-row" style={{ marginTop: 10 }}>
        <span>{mode === "k" ? "k" : "p"}</span>
        {mode === "k" ? (
          <input type="range" min={1} max={items.length} step={1} value={kk} aria-label="残す候補の数 k" onChange={(e) => change(() => setK(Number(e.target.value)))} />
        ) : (
          <input type="range" min={0.5} max={1} step={0.05} value={p} aria-label="足していく確率の基準 p" onChange={(e) => change(() => setP(Number(e.target.value)))} />
        )}
        <span className="val">{mode === "k" ? `${kk}個` : `${Math.round(p * 100)}%`}</span>
      </div>

      <div className="lab-out">
        <div className="p9-cut-head">
          <span>候補</span>
          <span>もとの確率</span>
          <span>{mode === "p" ? "累計" : ""}</span>
          <span>切った後</span>
        </div>
        <div className="bars">
          {items.map((it, i) => {
            const kept = i < keep;
            return (
              <div className="p9-cut-row" key={it.w} data-cut={!kept}>
                <span className="label">{it.w}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${it.p * 100}%`, background: kept ? (it.c ? `var(--hl-${it.c})` : "var(--ink-3)") : "var(--line)" }} />
                </span>
                <span className="n muted">{mode === "p" && i <= keep - 1 ? pc(cum[i]) : ""}</span>
                <span className="n">{kept ? pc(probs[i]) : "カット"}</span>
              </div>
            );
          })}
        </div>
        <div className="lab-sum">
          残った候補{keep}個・残った確率{pc(cum[keep - 1])}を配り直して合計100%
          {key === "school" ? "・その他 = 何万ものかけらの合計" : ""}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={draw}>
          残った候補でルーレット10回
        </button>
      </div>
      {counts && (
        <p className="p9-draws" aria-live="polite">
          {items.map((it, i) =>
            counts[i] > 0 ? (
              <span key={it.w} className={`chip ${it.c ? `hl-${it.c}` : "hl-none"}`}>
                {it.w} {counts[i]}回
              </span>
            ) : null,
          )}
        </p>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={now.sure1}>{now.sure1 ? "○" : "□"} 「1, 3, 5, 7,」で正解の9だけを残す</li>
        <li data-done={now.unsure6}>{now.unsure6 ? "○" : "□"} 果物の文で、へんてこな「いす」だけを切る</li>
        <li data-done={now.pSure && now.pUnsure}>{now.pSure && now.pUnsure ? "○" : "□"} Top-p 90%で2つの文（1, 3, 5, 7／果物）をくらべる：残る数は同じ？</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">確率は説明用の例です。</p>
    </div>
  );
}
