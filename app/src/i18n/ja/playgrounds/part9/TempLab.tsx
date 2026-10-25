import { useState } from "react";
import { SCORES81 } from "../../../../data/ch81";
import { TOY_PROMPT, generate, oddMask, softmaxT } from "../../../../data/part9-toy";
import "../../../../playgrounds/part9/style.css";

const SC = SCORES81.map((s) => s.s);
const PRESETS = [0, 0.5, 1, 2, 3];
const fmt = (v: number) => (v < -0.005 ? `−${Math.abs(v).toFixed(1)}` : v.toFixed(1));
const pct = (p: number) => (p > 0 && p < 0.001 ? "0.1%未満" : `${(p * 100).toFixed(1)}%`);

type Run = { pieces: string[]; odd: boolean[] };

export function TempLab() {
  const [t, setT] = useState(1);
  const [runs, setRuns] = useState<{ t: number; list: Run[] } | null>(null);
  const [done, setDone] = useState({ same: false, diff: false, pizza: false });
  const p = softmaxT(SC, t);

  const write = () => {
    const list = Array.from({ length: 5 }, () => {
      const pieces = generate(t, Math.random);
      return { pieces, odd: oddMask(pieces) };
    });
    setRuns({ t, list });
    const uniq = new Set(list.map((r) => r.pieces.join(" "))).size;
    setDone((d) => ({
      same: d.same || uniq === 1,
      diff: d.diff || uniq === 5,
      pizza: d.pizza || list.some((r) => r.pieces[0] === "ピザ"),
    }));
  };

  const uniq = runs ? new Set(runs.list.map((r) => r.pieces.join(" "))).size : 0;
  const oddRuns = runs ? runs.list.filter((r) => r.odd.some(Boolean)).length : 0;

  const tip =
    t === 0
      ? "温度0は「グリーディ」と決めておきます。1位だけが100%なので、文は毎回同じです。"
      : t < 0.6
        ? "とがっています。「行く」がほとんど全部もっていきます。文も似たものばかりになるでしょう。"
        : t <= 1.3
          ? "ふつうの温度です。1位がよく選ばれますが、ほかの言葉もけっこう出ます。"
          : "平らです。ピザのように低かった候補がぐんと上がります。へんてこな文が増えます。";

  return (
    <div>
      <div className="lab-row">
        <span>温度</span>
        <input type="range" min={0} max={3} step={0.1} value={t} aria-label="温度" onChange={(e) => setT(Number(e.target.value))} />
        <span className="val">{t.toFixed(1)}</span>
      </div>
      <div className="p9-seg" role="group" aria-label="温度をすばやく選ぶ" style={{ marginTop: 8 }}>
        {PRESETS.map((v) => (
          <button key={v} aria-pressed={Math.abs(t - v) < 0.05} onClick={() => setT(v)}>
            {v === 0 ? "0（グリーディ）" : v.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="lab-out">
        <div className="bars">
          {SCORES81.map((c, i) => (
            <div className="bar-row" key={c.w}>
              <span className="label">{c.w}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${p[i] * 100}%`, background: `var(--hl-${c.c})` }} />
              </span>
              <span className="val">{pct(p[i])}</span>
            </div>
          ))}
        </div>
        <div className="lab-sum num">
          {t === 0 ? "温度0 → 割らずに1位に100%" : `スコア ÷ ${t.toFixed(1)} = ${SC.map((s) => fmt(s / t)).join(", ")} → ソフトマックス`}
        </div>
      </div>

      <div className="lab-actions">
        <button className="btn" onClick={write}>
          この温度で文を5つ書く
        </button>
      </div>

      {runs && (
        <>
          <p className="p9-note" style={{ marginTop: 12 }}>
            温度{runs.t.toFixed(1)}で書いた文・ちがう文{uniq}個・へんてこな言葉がまじった文{oddRuns}個
          </p>
          <ol className="p9-runs" aria-live="polite">
            {runs.list.map((r, i) => (
              <li key={i}>
                <span className="muted">{TOY_PROMPT.join(" ")} </span>
                {r.pieces.map((w, k) => {
                  const sep = k === 0 || w === "。" || w === "…" ? "" : " ";
                  return (
                    <span key={k}>
                      {sep}
                      <span className={r.odd[k] ? "p9-odd" : undefined}>{w}</span>
                    </span>
                  );
                })}
              </li>
            ))}
          </ol>
        </>
      )}

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.same}>{done.same ? "○" : "□"} 5つ全部が同じ文になるようにする</li>
        <li data-done={done.diff}>{done.diff ? "○" : "□"} 5つ全部がちがう文になるようにする</li>
        <li data-done={done.pizza}>{done.pizza ? "○" : "□"} 「私は 今日 学校に ピザ…」で始まる文をつくる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
      <p className="p9-note">スコアは14章と同じ説明用の例です。文は、すぐ前の言葉だけを見るおもちゃのモデルが書きます。ピンクは、スコアが低かったへんてこな言葉です。</p>
    </div>
  );
}
