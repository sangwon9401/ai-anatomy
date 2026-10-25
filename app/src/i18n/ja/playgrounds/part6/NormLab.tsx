import { useState } from "react";
import { layerNorm, wordsAt } from "../../../../data/ch57";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

const LIMIT = 20;

/** 57장: grow the word vectors layer by layer, then switch layer normalisation on. */
export function NormLab() {
  const [layer, setLayer] = useState(1);
  const [on, setOn] = useState(false);
  const [gain, setGain] = useState(1);
  const [seen, setSeen] = useState({ big: false, fixed: false, gain: false });

  const words = wordsAt(layer);
  const rows = words.map((w) => {
    const n = layerNorm(w.v, gain);
    const into = on ? n.out : w.v;
    return { ...w, ...n, into, max: Math.max(...into.map(Math.abs)) };
  });
  const worst = Math.max(...rows.map((r) => r.max));
  const shaky = worst > LIMIT;

  const mark = (next: Partial<typeof seen>) => setSeen((s) => ({ big: s.big || !!next.big, fixed: s.fixed || !!next.fixed, gain: s.gain || !!next.gain }));
  const setL = (v: number) => {
    setLayer(v);
    if (v === 96) mark({ big: !on, fixed: on });
  };
  const setNorm = (v: boolean) => {
    setOn(v);
    if (layer === 96) mark({ big: !v, fixed: v });
  };

  let tip = "まず正規化をオフにしたまま、層のスライダーを96まで上げてみましょう。";
  if (!on && shaky) tip = "数が大きくなりすぎました！ 単語ごとに大きさもばらばらなので、部品がゆれます。レイヤー正規化をオンにしてみましょう。";
  else if (!on) tip = "層が深くなるほど数がだんだん大きくなり、単語ごとに大きさがちがってきます。";
  else if (gain !== 1) tip = `倍率${fmt(gain)}倍：正規化した値に倍率をかけました。本物では、この値を数ごとに別々に、学習で決めます。`;
  else tip = "何層めでも、単語ごとに平均0、ばらつき1にそろいました。倍率も変えてみましょう。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="レイヤー正規化">
        <button aria-pressed={!on} onClick={() => setNorm(false)}>
          正規化オフ
        </button>
        <button aria-pressed={on} onClick={() => setNorm(true)}>
          レイヤー正規化オン
        </button>
      </div>
      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>層</span>
          <input type="range" min={1} max={96} step={1} value={layer} aria-label="何層め" onChange={(e) => setL(Number(e.target.value))} />
          <span className="val">{layer}</span>
        </div>
        <div className="lab-row">
          <span>倍率</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={gain}
            disabled={!on}
            aria-label="倍率"
            onChange={(e) => {
              setGain(Number(e.target.value));
              mark({ gain: true });
            }}
          />
          <span className="val">{fmt(gain)}</span>
        </div>
      </div>

      <div className="p6-rows">
        {rows.map((r) => (
          <div className="p6-wrow" key={r.w}>
            <div className="p6-wrow-head">
              <span className="chip outline">{r.w}</span>
              <span className="muted">
                平均 {fmt(r.mean)} · ばらつき {fmt(r.sd)}
              </span>
            </div>
            <Vec v={r.v} label={`${r.w}のベクトル`} />
            {on && (
              <>
                <p className="p6-label">↓ 部品に入る値</p>
                <Vec v={r.into} label={`${r.w}の正規化した値`} />
              </>
            )}
            <div className="bars" style={{ marginTop: 6 }}>
              <div className="bar-row">
                <span className="label">大きさ</span>
                <span className="track">
                  <span className="fill" style={{ display: "block", width: `${Math.min(100, (r.max / 80) * 100)}%`, background: r.max > LIMIT ? "var(--pen)" : "var(--hl-mint)" }} />
                </span>
                <span className="val">{fmt(r.max)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="p6-note">「大きさ」は、部品に入る数のうちいちばん大きい値（符号は無視）です。数は説明用の例です。</p>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={seen.big}>{seen.big ? "✓" : "○"} 正規化をオフにして96層まで上げてみる</li>
        <li data-done={seen.fixed}>{seen.fixed ? "✓" : "○"} 96層でレイヤー正規化をオンにする</li>
        <li data-done={seen.gain}>{seen.gain ? "✓" : "○"} 倍率を変えてみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
