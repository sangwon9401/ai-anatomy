import { useState } from "react";
import { GARBLE, PHONE, TOY_X0, garble, runLayers } from "../../../../data/ch56";
import "../../../../playgrounds/part6/style.css";
import { fmt } from "../../../../playgrounds/part6/util";
import { Vec } from "../../../../playgrounds/part6/Vec";

/** 56장: push a vector through up to 48 layers with and without the highway. */
export function ResidualLab() {
  const [n, setN] = useState(4);
  const [highway, setHighway] = useState(false);
  const [done, setDone] = useState({ off: false, on: false });
  const r = runLayers(n, highway);
  const pct = Math.round(r.keep * 100);
  const msg = garble(PHONE[0], Math.round((1 - r.keep) * GARBLE.length));

  const update = (nextN: number, nextHw: boolean) => {
    setN(nextN);
    setHighway(nextHw);
    if (nextN === 48) setDone((d) => ({ off: d.off || !nextHw, on: d.on || nextHw }));
  };

  let tip = "まず高速道路をオフにしたまま、層の数を48まで上げてみましょう。";
  if (!highway && pct < 20) tip = "最初の情報がほとんど消えてしまいました。層ごとにベクトルを丸ごと取りかえると、こうなります。";
  else if (!highway) tip = "層を積むほど、最初とどんどん変わっていきます。";
  else if (n >= 24) tip = `最初の情報が${pct}%も残っています！ でも数の大きさが${fmt(r.size0)}から${fmt(r.size)}に大きくなりましたね。これは第57章で解決します。`;
  else tip = "高速道路がオンなら、層を積んでも最初の情報がよく残ります。48層まで上げてみましょう。";

  return (
    <div>
      <div className="p6-seg" role="group" aria-label="高速道路">
        <button aria-pressed={!highway} onClick={() => update(n, false)}>
          高速道路オフ（取りかえ）
        </button>
        <button aria-pressed={highway} onClick={() => update(n, true)}>
          高速道路オン（足し算）
        </button>
      </div>

      <div className="lab-rows" style={{ marginTop: 14 }}>
        <div className="lab-row">
          <span>層の数</span>
          <input type="range" min={1} max={48} step={1} value={n} aria-label="層の数" onChange={(e) => update(Number(e.target.value), highway)} />
          <span className="val">{n}</span>
        </div>
      </div>

      <p className="p6-label">最初のベクトル</p>
      <Vec v={TOY_X0} label="最初のベクトル" />
      <p className="p6-label">{n}層を通ったあと</p>
      <Vec v={r.x} label={`${n}層を通ったあと`} />

      <div className="lab-out">
        <div className="bars">
          <div className="bar-row">
            <span className="label">似ている度合い</span>
            <span className="track">
              <span className="fill" style={{ display: "block", width: `${pct}%`, background: "var(--hl-mint)" }} />
            </span>
            <span className="val">{pct}%</span>
          </div>
        </div>
        <p className="p6-msg" aria-label="伝言ゲームのたとえ">
          {[...msg].map((ch, i) => (
            <span key={i} className={ch !== PHONE[0][i] ? "bad" : undefined}>
              {ch}
            </span>
          ))}
        </p>
        <p className="p6-note">似ている度合いは、最初のベクトルと向きがどれだけ同じか（第9章）です。文は、その分だけ言葉が変わった伝言ゲームのたとえです。数は説明用の例です。</p>
      </div>

      <ul className="missions" style={{ marginTop: 12 }}>
        <li data-done={done.off}>{done.off ? "✓" : "○"} 高速道路をオフにして48層積んでみる</li>
        <li data-done={done.on}>{done.on ? "✓" : "○"} 高速道路をオンにして48層積んでみる</li>
      </ul>
      <p className="lab-tip">{tip}</p>
    </div>
  );
}
