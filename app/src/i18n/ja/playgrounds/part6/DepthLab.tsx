import { useState } from "react";
import { DEPTH_NOTES, peekAt } from "../../../../data/ch58";
import "../../../../playgrounds/part6/style.css";

/** 간다 is ahead of every other single word (by more than a rounding hair) */
const ganLeads = (layer: number) => {
  const p = peekAt(layer);
  return p[0].now > Math.max(...p.slice(1).map((r) => r.now)) + 0.2;
};
const FIRST_GAN = Array.from({ length: 96 }, (_, i) => i + 1).find(ganLeads) ?? 96;

/** 58장: walk down the 96 layers and watch '학교에' fill up. */
export function DepthLab() {
  const [layer, setLayer] = useState(1);
  const [found, setFound] = useState(false);
  const [bottom, setBottom] = useState(false);
  const peek = peekAt(layer);
  const rest = 100 - peek.reduce((a, r) => a + r.now, 0);
  const leads = ganLeads(layer);
  const tint = Math.round(12 + (layer / 96) * 88);

  const move = (v: number) => {
    setLayer(v);
    if (v === FIRST_GAN) setFound(true);
    if (v === 96) setBottom(true);
  };

  let tip = "スライダーをゆっくり下ろしてみましょう。「行く」が1位になる層はどこでしょう？";
  if (layer === FIRST_GAN) tip = `ちょうど${layer}層から「行く」が1位です！`;
  else if (leads && layer === 96) tip = "96層を全部通ると、行く52%、行った21%、遅れた12%。第1章で見たあの数です！";
  else if (leads) tip = "「行く」が1位です。深く行くほど、ますます自信が出てきます。";
  else if (layer < 12) tip = "浅い層では、まだ見当がついていません。候補はどれも似たりよったりです。";

  return (
    <div>
      <div className="lab-rows">
        <div className="lab-row">
          <span>層</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="何層め" onChange={(e) => move(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
      </div>

      <div className="p6-depth">
        <span
          className="chip"
          style={{ fontSize: 20, background: `color-mix(in srgb, var(--hl-yellow) ${tint}%, var(--paper))`, color: tint > 50 ? "var(--chip-ink)" : "var(--ink)", border: "2px solid var(--ink)" }}
        >
          学校に
        </span>
        <span className="muted">{layer}層を通ったベクトル</span>
      </div>

      <p className="p6-label">このベクトルに積み重なった情報（説明用）</p>
      <ul className="p6-notes">
        {DEPTH_NOTES.map((d) => (
          <li key={d.layer} data-on={layer >= d.layer}>
            <span className="n">{d.layer}層〜</span>
            <span>{layer >= d.layer ? d.note : "?"}</span>
          </li>
        ))}
      </ul>

      <p className="p6-label">ここで次の言葉をのぞいてみると</p>
      <div className="bars">
        {peek.map((r) => (
          <div className="bar-row" key={r.w}>
            <span className="label">{r.w}</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${r.now}%`, background: `var(--hl-${r.c})` }} />
            </span>
            <span className="val">{Math.round(r.now)}%</span>
          </div>
        ))}
        <div className="bar-row">
          <span className="label">その他</span>
          <span className="track">
            <span className="fill" style={{ display: "block", width: `${rest}%`, background: "var(--line)" }} />
          </span>
          <span className="val">{Math.round(rest)}%</span>
        </div>
      </div>
      <p className="p6-note">「その他」は約5万個のトークンを全部合わせた分です。層ごとの数は説明用の例です。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={found}>{found ? "✓" : "○"} 「行く」がはじめて1位になる層を見つける</li>
        <li data-done={bottom}>{bottom ? "✓" : "○"} 96層まで下りてみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
